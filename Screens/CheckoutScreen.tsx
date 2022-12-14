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
    // calculate total price
    const cart = props.route.params.cart;
    let amount = 0;
    cart.items.forEach((item: { price: number; quantity: number }) => {
        amount += (item.price * item.quantity);
    });
    console.log(amount);
    const userId = 1;
    // browse the id in the cart item array and if the quantity is greater than 1, then add the item to the array multiple times
    let itemsId: number[] = [];
    cart.items.forEach((item: { id: number; quantity: number }) => {
        for (let i = 0; i < item.quantity; i++) {
            itemsId.push(item.id);
        }
    });
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
                navigation.navigate('Paid', { itemList: itemList });
            }
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
                    <Text>Item Name: {item.name}</Text>
                    <Text>Quantity : {item.quantity}</Text>
                    <Text>Item Cost : {item.price / 100}</Text>
                    <Text>Total For this item : {(item.price * item.quantity) / 100}</Text>
                </View>
            )} />
            <View>
                <Text> Total: {amount / 100}</Text>
            </View>

        </SafeAreaView>
    );
}