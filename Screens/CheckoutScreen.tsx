import { useStripe } from "@stripe/stripe-react-native";
import React from "react";
import { useEffect, useState } from "react";
import { Alert, Text, Button, SafeAreaView, View, FlatList } from "react-native";

export default function CheckoutScreen({navigation,route}: any) {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const [paymentIntentId, setPaymentIntentId] = useState<string>("");
    const amount = route.params.cart.items.reduce((acc: number, item: { quantity: number; }) => acc + item.quantity, 0) * 100;
    const userId = 1;
    const itemsId = route.params.cart.items.map((item: { id: string; }) => item.id);
    const itemList = route.params.cart.items.map((item: { id: string; name: string; quantity: number; }) => {
        return {
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            amount: amount
        }
    });
    const fetchPaymentSheetParams = async () => {
        const response = await fetch(`http://172.26.3.95:8000/payments/`, {
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
            const response = await fetch(`http://172.26.3.95:8000/payments/check/${paymentIntent}`, {
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
                <View>
                    <Text>{item.name}</Text>
                    <Text>{item.quantity}</Text>
                    <Text>{item.amount}</Text>
                </View>
            )} />
        </SafeAreaView>
    );
}