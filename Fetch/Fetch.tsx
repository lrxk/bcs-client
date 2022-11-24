import React from "react";

const getItemInfo = async (id: string) => {
    const response = await fetch(`http://172.26.3.95:8000/items/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (response.status === 200) {
        let { name, price } = await response.json();
        return {
            name,
            price
        };
    } else {
        return {
            name: "Not Found",
            price: 0
        };
    }
};
const getItemsInfo = async () => {
    const response = await fetch(`http://172.26.3.95:8000/items/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (response.status === 200) {
        let items = await response.json();
        return items;
    }
    else {
        return [];
    }
};
