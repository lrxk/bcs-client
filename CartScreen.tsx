import { TabRouter } from "@react-navigation/native";
import { createPaymentMethod } from "@stripe/stripe-react-native";
import React, { Children, useEffect, useState } from "react";
import { Alert, Text, Button, SafeAreaView, View, FlatList } from "react-native";
import { cart } from "./App";
import { getValueFor, save } from "./BarCodeScannerScreen";

export default function CartScreen({ navigation, route }: any) {
  const [cart, setCart] = useState(route.params.cart);
  const [ids, setIds] = useState([]);

  useEffect(() => {
    (async () => {
      const cart = await getValueFor("cart");
      if (cart) {
        setCart(JSON.parse(cart));
        setIds(JSON.parse(cart).items.map((i: any) => i.id));
      }
    })();
  }, []);




  const addItemToCart = (item: { id: string; quantity: number }) => {
    const newCart = { ...cart };
    const itemIndex = newCart.items.findIndex((i: { id: string; }) => i.id === item.id);
    if (itemIndex === -1) {
      newCart.items.push(item);
    } else {
      newCart.items[itemIndex].quantity += 1;
    }
    save('cart', JSON.stringify(newCart));
    setCart(newCart);
  }



  const removeItemFromCart = (item: { id: string; quantity: number }) => {
    const newCart = { ...cart };
    const itemIndex = newCart.items.findIndex((i: { id: string; }) => i.id === item.id);
    if (itemIndex === -1) {
      return;
    } else {
      if (newCart.items[itemIndex].quantity === 1) {
        newCart.items.splice(itemIndex, 1);
      } else {
        newCart.items[itemIndex].quantity -= 1;
      }
    }
    save('cart', JSON.stringify(newCart));
    setCart(newCart);

  }
  console.log(cart.items);

  if (cart.items.length === 0 || cart === undefined) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Cart is empty</Text>
        <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
        <Button title="Add Item" onPress={() => navigation.navigate('BarCodeScanner')} />
      </View>

    );
  } else {
    return (
      <SafeAreaView>
        <Text>Cart</Text>
        <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
        <Button title="Add Item" onPress={() => navigation.navigate('BarCodeScanner')} />
        <Button
          title="Go to Checkout"
          onPress={() => navigation.push('Checkout', { cart: cart })}
        />
        {/* display the content of the cart */}
        <FlatList
          data={cart.items}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text>{item.id}</Text>
              <Text>{item.name}</Text>
              <Text>{item.quantity}</Text>
              <Button title="+" onPress={() => addItemToCart(item)} />
              <Button title="-" onPress={() => removeItemFromCart(item)} />
            </View>
          )}
          keyExtractor={(item) => item.id}
        />

      </SafeAreaView>


    );
  }

}