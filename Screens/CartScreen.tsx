import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useEffect } from 'react';
import { Styles } from '../Styles';
import CartComponent from '../Components/CartComponent';

export default function CartScreen(props: { route: any }) {
    const navigation = useNavigation();
    const [total, setTotal] = useState(0);
    const [cart, setCart] = useState(props.route.params.cart);
    useEffect(() => {
        let total = 0;
        cart.items.forEach((item: { price: number; }) => {
            total += item.price;
        });
        setTotal(total);
    }, [cart]);
    return (
        <><View style={Styles.container}>
            <CartComponent cart={cart} />
            {/* place a checkout button at the bottom of the screen */}

        </View>
            <TouchableOpacity style={Styles.button} onPress={() => {
                navigation.navigate('Checkout', { cart: cart });
            }}>
                <Text style={Styles.buttonText}>Checkout</Text>
            </TouchableOpacity>
        </>

    );
}