import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Cart } from '../Types/Types';
import { useState } from 'react';
import { useEffect } from 'react';
import { Styles } from '../Styles';

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
        <FlatList data={cart.items} renderItem={({ item }) => {
            return (
                <View style={Styles.itemContainer}>
                    <View style={Styles.itemNameContainer}>
                        <Text style={Styles.itemName}>{item.name}</Text>
                    </View>
                    <View style={Styles.itemPriceContainer}>
                        <Text style={Styles.itemPrice}>${item.price}</Text>
                    </View>
                    <View style={Styles.itemQuantityContainer}>
                        <Text style={Styles.itemQuantity}>Quantity: {item.quantity}</Text>
                    </View>
                    <TouchableOpacity style={Styles.button} onPress={() => navigation.navigate('Checkout', { cart: cart })}>
                        <Text style={Styles.buttonText}>Checkout</Text>
                    </TouchableOpacity>
                    {/* increment quantity button */}
                    <TouchableOpacity style={Styles.button} onPress={() => {
                        let newCart = { ...cart };
                        newCart.items.forEach((cartItem) => {
                            // if the item is already in the cart, increment the quantity
                            if (cartItem.id === item.id) {
                                cartItem.quantity++;
                            }
                        });
                        setCart(newCart);
                    }}>
                        <Text style={Styles.buttonText}>+</Text>
                    </TouchableOpacity>
                    {/* decrement quantity button */}
                    <TouchableOpacity style={Styles.button} onPress={() => {
                        let newCart = { ...cart };
                        newCart.items.forEach((cartItem) => {
                            // if the quantity is 1 and the user clicks the decrement button, remove the item from the cart
                            if (cartItem.id === item.id && cartItem.quantity === 1) {
                                newCart.items = newCart.items.filter((cartItem) => cartItem.id !== item.id);
                            }
                            if (cartItem.id === item.id) {
                                cartItem.quantity--;
                            }
                        });
                        setCart(newCart);
                    }}>
                        <Text style={Styles.buttonText}>-</Text>
                    </TouchableOpacity>
                </View>
            )

        }} />


    );
}

