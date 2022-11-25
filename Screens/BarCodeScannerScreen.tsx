
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useState, useEffect } from 'react';
import { Text, View, Button, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { cart } from '../App';
import { Item } from '../Types/Types';
import { Styles } from '../Styles';

import ItemComponent from '../Components/ItemComponent';
import { createPaymentMethod } from '@stripe/stripe-react-native';
export default function BarCodeScannerScreen() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [item, setItem] = useState<Item>();
    const navigation = useNavigation();
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
            name: data, price: 1,
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
                await fetch('http://192.168.1.75:8000/items/' + id, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then((response) => response.json()).then((json) => {
                        item = {
                            id: json.id,
                            name: json.name,
                            price: json.price,
                            quantity: 1
                        };
                        console.log("item", item);
                        // if the item is already in the cart, we increment the quantity
                        let index = cart.items.findIndex((item) => item.id === id);
                        if (index !== -1) {
                            cart.items[index].quantity++;
                        } else {
                            cart.items.push(item);
                        }
                        console.log("cart", cart);
                    })
                    .catch((error) => {
                        console.log("Not found");
                        console.error(error);
                    });
                console.log("After fetch");
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


