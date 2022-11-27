import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Styles } from '../Styles';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
export default function PaidScreen(props: { route: any }) {
    const navigation = useNavigation();

    return (
        <><View style={Styles.container}>
            <Text style={Styles.text}></Text>
            <Text style={Styles.text}>You bought: </Text>
            {/* Skip line */}
            <Text style={Styles.text}> </Text>
            <FlatList data={props.route.params.itemList} renderItem={({ item }) => <Text style={Styles.text}>{item.name}x{item.quantity}</Text>} />

        </View><TouchableOpacity style={Styles.button} onPress={() => {
            navigation.navigate('Home', { cart: [] });
        } }>
                <Text style={Styles.buttonText}>Return to Home</Text>
            </TouchableOpacity></>
    );
}