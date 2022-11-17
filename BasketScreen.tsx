import React, { useEffect, useState } from "react";

import { Alert, Text, Button, SafeAreaView, View } from "react-native";



export default function BasketScreen() {
    const fetchBasket = async () => {
        const response = await fetch(`http://172.26.3.95:8000/items/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const { basket } = await response.json();
        return basket;
    };
    const [basket, setBasket] = useState([]);
    useEffect(() => {
        fetchBasket().then((basket) => {
            setBasket(basket);
        });
    }, []);


    return (
        <View>
        <Text>BasketScreen</Text>
        </View>
    );
}