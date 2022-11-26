
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
    const ipAddress=Constants.expoConfig.extra.address;
    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }: any) => {
        setScanned(true);
        Alert.alert('Bar code with type ' + type + ' and data ' + data + ' has been scanned!');
        let item: Item = {
            name: data, 
            price: 1,
            id: '',
            quantity: 0
        };
        navigation.navigate('Checkout', { cart: cart });
    };
    if (hasPermission === false || hasPermission === null) {
        return (
            <ItemComponent onAddToCart={async (id) => {
                // console.log("toto");
                let item: Item;
                console.log("Before fetch");
                console.log(ipAddress);
                await fetch('http://'+ipAddress+'/items/' + id, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then((response) => response.json()).then((json) => {
                        item = {
                            id: json.id,
                            name: json.name,
                            price: json.price / 100,
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
                    })
                    .catch((error) => {
                        console.log("Not found");
                        console.error(error);
                    });
                console.log("cart", cart);
                console.log("After fetch");
                Alert.alert("Item added to cart");
                // console.log(id);
                // console.log(cart);
            }} />
        )
    } else {
        return (
            <View style={Styles.container}>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={Styles.barcodeScanner}
                />
                {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
            </View>
        );
    }
}


