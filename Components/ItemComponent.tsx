import React, { Component, useState } from 'react';
import { Item } from '../Types/Types';
import { View, Text, Button, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { cart } from '../App';
import { Styles } from '../Styles';
export default function ItemComponent(props: {

    onAddToCart: (id: string) => void
}) {
    const emptyItem = { name: '', price: 0, quantity: 0 };
    const navigation = useNavigation();
    const [item, setItem] = useState(emptyItem);
    const [id, setId] = useState('');
    return (
        <><View style={Styles.container}>
            <View style={Styles.textContainer}>
                <TextInput style={Styles.textInput} placeholder="Enter Item id" onChangeText={(text) => setId(text)} />
            </View>
            <View style={Styles.buttonContainer}>
                <TouchableOpacity style={Styles.button} onPress={() => props.onAddToCart(id)}>
                    <Text style={Styles.buttonText}>Add to cart</Text>
                </TouchableOpacity>
            </View>

        </View></>
    )
}


