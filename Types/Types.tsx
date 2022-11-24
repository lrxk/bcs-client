import React from 'react';

// a single item
export type Item={
    id: string,
    name:string,
    price:number
}
// the cart is a list of items
export type Cart = {
    items: Item[]
};    