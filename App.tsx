import { StripeProvider } from '@stripe/stripe-react-native';

import CheckoutScreen from './CheckoutScreen';
import BarCodeScannerScreen from './BarCodeScannerScreen';
import CartScreen from './CartScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React from 'react';

export type cart = {
  items: Array<{ id: string; quantity: number ; name:string}>;
};    
// initialize empty cart
export const cart: cart = {
  items: [  ],
};



const Stack = createStackNavigator();


function HomeScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Go to Checkout"
        onPress={() => navigation.navigate('Checkout',{cart:cart})}
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
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="BarCodeScanner" component={BarCodeScannerScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />

      </Stack.Navigator>
    </NavigationContainer>







  );
}
