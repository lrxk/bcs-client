import { useNavigation } from "@react-navigation/native";
import { useStripe } from "@stripe/stripe-react-native";
import React from "react";
import { useEffect, useState } from "react";
import { Alert, Text, Button, SafeAreaView, View, FlatList } from "react-native";
import Constants from "expo-constants"; 
export default function CheckoutScreen(props: { route: any }) {
    const navigation = useNavigation();
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const [paymentIntentId, setPaymentIntentId] = useState<string>("");
    const ipAddress=Constants.expoConfig.extra.address;
    // calculate total price
    const cart = props.route.params.cart;
    let amount = 0;
    cart.items.forEach((item: { price: number;quantity:number }) => {
        amount += item.price*item.quantity;
    });
    amount = amount * 100;
    const userId = 1;
    const itemsId = props.route.params.cart.items.map((item: { id: string; }) => item.id);
    const itemList = props.route.params.cart.items;
    const fetchPaymentSheetParams = async () => {
        const response = await fetch(`http://${ipAddress}/payments/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "amount": amount,
                "customer_id": userId
            })
        });

        const { paymentIntent, ephemeralKey, customer } = await response.json();

        return {
            paymentIntent,
            ephemeralKey,
            customer,
        };
    };

    const initializePaymentSheet = async () => {
        const {
            paymentIntent,
            ephemeralKey,
            customer,
        } = await fetchPaymentSheetParams();

        const { error } = await initPaymentSheet({
            merchantDisplayName: "Example, Inc.",
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
            allowsDelayedPaymentMethods: false,
        });

        if (!error) {
            setPaymentIntentId(paymentIntent);
            setLoading(true);
        }
    };

    const openPaymentSheet = async () => {
        const { error } = await presentPaymentSheet();

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            const paymentIntent = `pi_${paymentIntentId.split("_")[1]}`;
            const response = await fetch(`http://${ipAddress}/payments/check/${paymentIntent}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "items_id": itemsId,
                    "customer_id": userId
                })
            });

            if (response.status == 200) Alert.alert('Success', 'Your order is confirmed!');
        }
    };

    useEffect(() => {
        initializePaymentSheet();
    }, []);

    return (
        <SafeAreaView>
            <Text>Payment</Text>
            <Button
                disabled={!loading}
                title="Checkout"
                onPress={openPaymentSheet}
            />
            <FlatList data={itemList} renderItem={({ item }) => (
                <View key={item.id}>
                    <Text>{item.name}</Text>
                    <Text>{item.quantity}</Text>
                    <Text>{item.price}</Text>
                    <Text>Total :{item.price*item.quantity}</Text>
                </View>
            )} />
        </SafeAreaView>
    );
}