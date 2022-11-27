
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useState, useEffect } from 'react';
import { Text, View, Button, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { cart } from '../App';
import { Item } from '../Types/Types';
import { Styles } from '../Styles';
import Constants from 'expo-constants';
import ItemComponent from '../Components/ItemComponent';
export default function BarCodeScannerScreen() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [item, setItem] = useState<Item>();
    const navigation = useNavigation();
    const ipAddress = Constants.expoConfig.extra.address;
    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);
    const AsyncAlert = async (title: string, message: string, it: Item, func: Function) => {
        return new Promise((resolve) => {
            Alert.alert(title, message, [
                {
                    text: 'Yes',
                    onPress: () => {
                        resolve(true);
                        func();
                    },
                },
                {
                    text: 'No',
                    onPress: () => resolve(false),

                }
            ]);
        });
    };
    const incrementQuantity = (item: Item) => {
        let index = cart.items.findIndex((i: Item) => i.id === item.id);
        cart.items[index].quantity++;
    }
    const addNewItem = (item: Item) => {
        cart.items.push(item);
    }

    const handleBarCodeScanned = async ({ type, data }: any) => {
        setScanned(true);
        // Alert.alert('Bar code with type ' + type + ' and data ' + data + ' has been scanned!');
        await fetch(`http://${ipAddress}/items/${data}`)
            .then(response => response.json())
            .then(async json => {
                if (json != null || json != undefined) {
                    let index = cart.items.findIndex((item) => item.id === json.id);
                    // check if item is already in cart if so increment quantity, if not add item to cart
                    if (index === -1) {
                        let item: Item = {
                            id: json.id,
                            name: json.name,
                            price: json.price,
                            quantity: 1
                        }
                        // make the alert await for the user to press ok
                        await AsyncAlert('Add Item', `Would you like to add ${item.name} to your cart?`, item, () => {
                            addNewItem(item);
                        });
                    } else {
                        // make the alert await for the user to press ok
                        await AsyncAlert('Increment Quantity', `Would you like to increment the quantity of ${json.name} in your cart?`, json, () => {
                            incrementQuantity(json);
                        });
                        // cart.items[index].quantity++;
                    }
                } else {
                    Alert.alert('Item not found');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        setScanned(false);
    };
    if (hasPermission === false || hasPermission === null) {
        return (
            <><ItemComponent onAddToCart={async (id) => {
                // console.log("toto");
                let item: Item;
                console.log("Before fetch");
                console.log(ipAddress);
                await fetch('http://' + ipAddress + '/items/' + id, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then((response) => {
                        if (response.status == 404) {
                            Alert.alert("Error");
                            return;
                        } else {
                            return response.json();
                        }
                    }).then((json) => {
                        if (json != undefined && json != null) {
                            item = {
                                id: json.id,
                                name: json.name,
                                price: json.price,
                                quantity: 1
                            };
                            console.log("item", item);
                            // if the item is already in the cart, we increment the quantity
                            let index = cart.items.findIndex((items) => items.id === json.id);
                            console.log("index", index);
                            if (index !== -1) {
                                cart.items[index].quantity++;
                            }
                            else {
                                console.log("New Item");
                                cart.items.push(item);
                            }
                            Alert.alert("Item added to cart");
                        } else {
                            Alert.alert("Item not found");
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
                console.log("cart", cart);
                console.log("After fetch");

                // console.log(id);
                // console.log(cart);
            }} /><Button title="Go to Checkout" onPress={() => navigation.navigate('Checkout', { cart: cart })} /><Button title='Go to Cart' onPress={() => navigation.navigate('Cart', { cart: cart })} /></>
        )
    } else {
        return (
            <><View style={Styles.container}>
                {<BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={{ height: 200, width: 200 }} />}
            </View><Button title="Go to Checkout" onPress={() => navigation.navigate('Checkout', { cart: cart })} /><Button title='Go to Cart' onPress={() => navigation.navigate('Cart', { cart: cart })} /></>
        );
    }
}


