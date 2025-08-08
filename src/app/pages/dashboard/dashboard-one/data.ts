import { RevenueHistory, UserBalance } from "./dashboard-one.model";

const USERBALANCEDATA: UserBalance[] = [
    {
        id: 1,
        avatar: 'assets/images/users/user-2.jpg',
        name: 'Tomaslau',
        currency: 'BTC',
        balance: 0.00816117,
        orders: 0.00097036,
    },
    {
        id: 2,
        avatar: 'assets/images/users/user-3.jpg',
        name: 'Erwin E. Brown',
        currency: 'ETH',
        balance: 3.16117008,
        orders: 1.70360009,
    },
    {
        id: 3,
        avatar: 'assets/images/users/user-4.jpg',
        name: 'Margeret V. Ligon',
        currency: 'EUR',
        balance: 25.08,
        orders: 12.58,
    },
    {
        id: 4,
        avatar: 'assets/images/users/user-5.jpg',
        name: 'Jose D. Delacruz',
        currency: 'CNY',
        balance: 82.0,
        orders: 30.83,
    },
    {
        id: 5,
        avatar: 'assets/images/users/user-6.jpg',
        name: 'Luke J. Sain',
        currency: 'BTC',
        balance: 2.00816117,
        orders: 1.00097036,
    },
];

const REVENUEHISTORYDATA: RevenueHistory[] = [
    {
        id: 1,
        marketplaces: 'Themes Market',
        date: new Date('Oct 15 2018'),
        payouts: 5848.68,
        status: 'Upcoming',
    },
    {
        id: 2,
        marketplaces: 'Freelance',
        date: new Date('Oct 12 2018'),
        payouts: 1247.25,
        status: 'Paid',
    },
    {
        id: 3,
        marketplaces: 'Share Holding',
        date: new Date('Oct 10 2018'),
        payouts: 815.89,
        status: 'Paid',
    },
    {
        id: 4,
        marketplaces: "Envato's Affiliates",
        date: new Date('Oct 03 2018'),
        payouts: 248.75,
        status: 'Overdue',
    },
    {
        id: 5,
        marketplaces: 'Marketing Revenue',
        date: new Date('Sep 21, 2018'),
        payouts: 978.21,
        status: 'Upcoming',
    },
    {
        id: 6,
        marketplaces: 'Advertise Revenue',
        date: new Date('Sep 15, 2018'),
        payouts: 358.10,
        status: 'Paid',
    },
];

export { USERBALANCEDATA, REVENUEHISTORYDATA };