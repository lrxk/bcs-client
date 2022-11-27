import { useNavigation } from "@react-navigation/native";
import { useStripe } from "@stripe/stripe-react-native";
import { StripeProvider } from '@stripe/stripe-react-native';
import React, { useEffect, useState } from "react";
import { Alert, Text, Button, SafeAreaView, View, FlatList } from "react-native";
import Constants from "expo-constants";
export default function CheckoutScreen(props: { route: any }) {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const [paymentIntentId, setPaymentIntentId] = useState<string>("");
    const navigation = useNavigation();
    const ipAddress = Constants.expoConfig.extra.address;
    const stripe_publishable_key = Constants.expoConfig.extra.stripe_publishable_key;
    // calculate total price
    const cart = props.route.params.cart;
    let amount = 0;
    cart.items.forEach((item: { price: number; quantity: number }) => {
        amount += (item.price * item.quantity);
    });
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
            console.log(error);
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

            if (response.status === 200) {
                Alert.alert('Success', 'Your order is confirmed!');
            }
        }
    };

    useEffect(() => {
        initializePaymentSheet();
    }, []);

    return (
        <SafeAreaView>
            <StripeProvider
                publishableKey={stripe_publishable_key}
                merchantIdentifier="merchant.com.example"
            >
                <Text>Payment</Text>
                <Button
                    disabled={!loading}
                    title="Checkout"
                    onPress={openPaymentSheet}
                />
                <FlatList data={itemList} renderItem={({ item }) => (
                    <><View key={item.id}>
                        <Text>Item Name: {item.name}</Text>
                        <Text>Quantity : {item.quantity}</Text>
                        <Text>Item Cost : {item.price / 100}</Text>
                        <Text>Total For this item : {(item.price * item.quantity) / 100}</Text>
                    </View></>
                )} />
                <View>
                    <Text> Total: {amount / 100}</Text>
                </View>
            </StripeProvider>
        </SafeAreaView>
    );
}