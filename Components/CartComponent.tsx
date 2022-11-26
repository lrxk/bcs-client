import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Cart } from '../Types/Types';
import { useState } from 'react';
import { useEffect } from 'react';
import {Styles} from '../Styles';

export default function CartComponent(props: { cart: Cart }) {
    const navigation = useNavigation();
    const [total, setTotal] = useState(0);
    const [cart, setCart] = useState(props.cart);
    useEffect(() => {
        let total = 0;
        cart.items.forEach((item) => {
            total += item.price * item.quantity;
        });
        setTotal(total);
    }, [cart]);
    return (
        <View style={Styles.container}>
            <View style={Styles.header}>
                <Text style={Styles.headerText}>Cart</Text>
            </View>
            <ScrollView style={Styles.cartContainer}>
                {cart.items.map((item) => {
                    return (
                        <View style={Styles.itemContainer} key={item.id}>
                            <Text style={Styles.itemText}>Item name:{item.name}</Text>
                            <Text style={Styles.itemText}>Price: {item.price}</Text>
                            <Text style={Styles.itemText}>Quantity:{item.quantity}</Text>
                            <TouchableOpacity style={Styles.button} onPress={() => {
                                let index = cart.items.findIndex((items) => items.id === item.id);
                                if (index !== -1) {
                                    cart.items[index].quantity++;
                                }
                                setCart({ ...cart });
                            }}>
                                <Text style={Styles.buttonText}>+</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={Styles.button} onPress={() => {
                                let index = cart.items.findIndex((items) => items.id === item.id);
                                if (index !== -1) {
                                    cart.items[index].quantity--;
                                }
                                setCart({ ...cart });
                            }}>
                                <Text style={Styles.buttonText}>-</Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </ScrollView>
            <View style={Styles.totalContainer}>
                <Text style={Styles.totalText}>Total: {total}</Text>
            </View>
            <View style={Styles.buttonContainer}>
                <TouchableOpacity style={Styles.button} onPress={() => navigation.navigate('Checkout',{cart:cart})}>
                    <Text style={Styles.buttonText}>Checkout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

