import { BarCodeScanner } from 'expo-barcode-scanner';
import { useEffect, useState } from 'react';

import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import React from 'react';
export type { cart } from './App';
export async function save(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
}

export async function getValueFor(key: string) {

    let result = await SecureStore.getItemAsync(key);
    if (result) {
        return result;
    } else {
        return null;
    }
}

export default function BarCodeScannerScreen({ navigation }: any) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [cart, setCart] = useState<cart>({ items: [] });
    const [id, setId] = useState('');

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');

        })();
    }, []);
    const fetchNameFromId = async (id: string) => {
        const response = await fetch(`http://172.26.3.95:8000/items/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.status === 200) {
            const { name, price } = await response.json();
            return {
                name,
                price
            };
        } else {
            return { name: 'Not Found', price: 0 };
        }
    };

    const handleBarCodeScanned = async ({ type, data }: any) => {
        setScanned(true);
        const newCart = { ...cart };
        const itemIndex = newCart.items.findIndex((i: any) => i.id === data);
        let name, price;
        await fetchNameFromId(data).then((values) => {
            name = values.name;
            price = values.price;
        });
        if (itemIndex === -1) {
            newCart.items.push({
                id: data, quantity: 1, name: name
            });
        } else {
            newCart.items[itemIndex].quantity += 1;
        }
        setCart(newCart);
        save('cart', JSON.stringify(newCart));
        navigation.navigate('Cart', { cart: newCart });
    };
    const handleCart = () => {
        navigation.navigate('Cart', { cart: cart });
    };

    const addNewItemToCart = async (id: string) => {
        const newCart = { ...cart };
        const itemIndex = newCart.items.findIndex((i: any) => i.id === id);
        let name, price;
        await fetchNameFromId(id).then((values) => {
            name = values.name;
            price = values.price;
        });
        if (itemIndex === -1) {
            newCart.items.push({ id: id, quantity: 1, name: name });
        } else {
            newCart.items[itemIndex].quantity += 1;
        }
        const JSONcart = JSON.stringify(newCart)
        setCart(JSONcart);
        save('cart', JSONcart);
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false || hasPermission === null) {
        // add manually item to cart
        return (
            <View style={styles.container}>
                <Text style={styles.text}>No access to camera</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={text => setId(text)}
                    placeholder="Enter item id"
                    keyboardType='numeric'
                />
                <Button
                    title="Add item to cart"
                    onPress={ () => {

                        addNewItemToCart(id);
                        // display an alert saying that the item has been added to the cart
                        Alert.alert('Item added to cart');
                        // navigation.push('Cart', { cart: cart });
                    }
                    } />
                <Button title="Go to Cart" onPress={handleCart} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />

            {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}

            <Text style={styles.text}>Barcode: {value}</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    text: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        marginTop: 20,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
});