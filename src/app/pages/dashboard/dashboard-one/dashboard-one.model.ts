interface UserBalance {
    id: number;
    avatar: string;
    name: string;
    currency: string;
    balance: number;
    orders: number;
}

interface RevenueHistory {
    id: number;
    marketplaces: string;
    date: Date;
    payouts: number;
    status: string;
}

export { UserBalance, RevenueHistory };