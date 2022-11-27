import CheckoutScreen from './Screens/CheckoutScreen';
import BarCodeScannerScreen from './Screens/BarCodeScannerScreen';
import CartScreen from './Screens/CartScreen';
import PaidScreen from './Screens/PaidScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Cart } from './Types/Types';
import { StripeProvider } from '@stripe/stripe-react-native';
import Constants from "expo-constants";
const stripe_publishable_key = Constants.expoConfig.extra.stripe_publishable_key;

// initialize empty cart
export const cart: Cart = {
  items: [],
};



const Stack = createStackNavigator();


function HomeScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Go to Checkout"
        onPress={() => navigation.navigate('Checkout', { cart: cart })}
      />
      <Button
        title="Add item to cart"
        onPress={() => navigation.navigate('BarCodeScanner')}
      />
      <Button
        title="Go to cart"
        onPress={() => navigation.navigate('Cart', { cart: cart })}
      />
    </View>
  );
}
export default function App({ navigation }: any) {
  return (

    <NavigationContainer>
      <StripeProvider
        publishableKey={stripe_publishable_key}
        merchantIdentifier="merchant.com.example">

      </StripeProvider>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="BarCodeScanner" component={BarCodeScannerScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Paid" component={PaidScreen} />
      </Stack.Navigator>
    </NavigationContainer>







  );
}
