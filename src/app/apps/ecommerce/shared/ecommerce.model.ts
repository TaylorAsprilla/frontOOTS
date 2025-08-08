export interface Transaction {
    id: number;
    avatar: string;
    name: string;
    cardDetails: {
        image: string;
        cardNum: string;
    },
    date: string;
    amount: number;
    status: string;
}

export interface Product {
    id?: number;
    name?: string;
    category?: string;
    companyName?: string;
    image?: string;
    added_date?: string;
    price?: number;
    amount?: number;
    status?: string;
    quantity?: number;
    rating?: number;

    [key: string]: number | string | undefined;
}


export interface Order {
    id: number;
    order_id: string;
    products: string[];
    order_date: string;
    order_time: string;
    payment_status: string;
    total: string;
    payment_method: string;
    order_status: string;
}

export interface Customer {
    id: number;
    name: string;
    balance: string;
    phone: string;
    orders: number;
    last_order: {
        date: string;
        time: string;
    },
    status: string;
    avatar: string;

    [key: string]: number | string | Object;

}

export interface Seller {
    id: number;
    name: string;
    store: string;
    ratings: number;
    products: number;
    balance: string;
    created_on: string;
    revenue: string;
    image: string;

    [key: string]: number | string;

}

interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    image: string;
    price: number;
    total: number;
}


interface ShippingAddress {
    provider: string;
    address_1: string;
    address_2: string;
    phone: string;
    mobile: string;
}

interface Billing {
    type: string;
    provider: string;
    valid: string;
}

interface DeliveryInfo {
    provider: string;
    order_id: string;
    payment_mode: string;
}

export interface OrderDetails {
    id: string;
    tracking_id: string;
    order_status?: string;
    items: OrderItem[];
    shipping: ShippingAddress;
    billing: Billing;
    delivery: DeliveryInfo;
}

export interface CartItem {
    id: number;
    image: string;
    name: string;
    size: string;
    color: string;
    price: number;
    qty: number;
    total: number;
}

export interface CartSummary {
    grand_total?: number;
    discount?: number;
    shipping_charge?: number;
    tax?: number;
    net_total?: number;
};

