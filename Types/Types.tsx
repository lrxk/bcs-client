// a single item
export type Item={
    id: string,
    name:string,
    price:number,
    quantity:number
}
// the cart is a list of items
export type Cart = {
    items: Item[]
};    