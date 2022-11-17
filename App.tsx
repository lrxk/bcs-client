import { StripeProvider } from '@stripe/stripe-react-native';

import CheckoutScreen from './CheckoutScreen';
import BarCodeScannerScreen from './BarCodeScannerScreen';
import BasketScreen from './BasketScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';



const Stack = createStackNavigator();


function HomeScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Go to Checkout"
        onPress={() => navigation.navigate('Checkout')}
      />
      <Button
        title="Go to BarCodeScanner"
        onPress={() => navigation.navigate('BarCodeScanner')}
      />
      <Button
        title="Go to Basket"
        onPress={() => navigation.navigate('Basket')}
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
        <Stack.Screen name="Basket" component={BasketScreen} />

      </Stack.Navigator>
    </NavigationContainer>







  );
}
