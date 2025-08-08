import { User } from "src/app/core/models/auth.models";
import { StatisticsCard1 } from "src/app/shared/widget/statistics-card/statistics-card.model";
import { StatisticsCard2 } from "src/app/shared/widget/statistics-card2/statistics-card2.model";
import { StatisticsCard3 } from "src/app/shared/widget/statistics-card3/statistics-card3.model";
import { StatisticsWidget } from "src/app/shared/widget/statistics-widget/statistics-widget.model";
import { UserCard } from "src/app/shared/widget/user-card/user-card.model";

const STATISCTICSCARD1: StatisticsCard1[] = [
    {
        id: 1,
        variant: 'primary',
        description: "Total Revenue",
        icon: 'fe-heart',
        stats: 58967,
        options: {
            prefix: '$',
            duration: 2
        }
    },
    {
        id: 2,
        variant: 'success',
        description: "Today's Sales",
        icon: 'fe-shopping-cart',
        stats: 127,
        options: {
            duration: 2
        }
    },
    {
        id: 3,
        variant: 'info',
        description: "Conversion",
        icon: 'fe-bar-chart-line',
        stats: 0.58,
        options: {
            decimalPlaces: 2,
            duration: 2,
            suffix: '%'
        }
    },
    {
        id: 4,
        variant: 'warning',
        description: "Today's Visits",
        icon: 'fe-eye',
        stats: 78412,
        options: {
            duration: 2,
        }
    },
    {
        id: 5,
        variant: 'danger',
        description: "Available Stores",
        icon: 'fe-shopping-bag',
        stats: 178,
        options: {
            duration: 2,
        }
    },
    {
        id: 6,
        variant: 'secondary',
        description: "Gitlab Commits",
        icon: 'fe-gitlab',
        stats: 289,
        options: {
            duration: 2,
        }
    },
    {
        id: 7,
        variant: 'blue',
        description: "Free Gifts",
        icon: 'fe-gift',
        stats: 1021,
        options: {
            duration: 2,
        }
    },
    {
        id: 8,
        variant: 'pink',
        description: "Paid Users",
        icon: 'fe-users',
        stats: 154,
        options: {
            suffix: 'k',
            duration: 2,
        }
    }

];

const STATISTICSWIDGETS: StatisticsWidget[] = [
    {
        icon: 'mdi mdi-cart-plus',
        iconCssClasses: 'text-primary mdi-24px',
        stats: 8954,
        label: 'Lifetime Sales',
        labelCssClasses: 'font-15'
    },
    {
        icon: 'mdi mdi-currency-usd',
        iconCssClasses: ' text-success mdi-24px',
        stats: 7841,
        options: {
            prefix: '$'
        },
        label: 'Income Amounts',
        labelCssClasses: 'font-15'
    },
    {
        icon: 'mdi mdi-account-group ',
        iconCssClasses: 'text-danger mdi-24px',
        stats: 6521,
        label: 'Total Users',
        labelCssClasses: 'font-15'
    },
    {
        icon: 'mdi mdi-eye-outline',
        iconCssClasses: 'text-blue mdi-24px',
        stats: 325,
        options: {
            suffix: 'k'
        },
        label: 'Total Visits',
        labelCssClasses: 'font-15'
    }
];

const STATISTICSCARD2: StatisticsCard2[] = [
    {
        id: 1,
        variant: 'blue',
        description: "Total Revenue",
        icon: 'fe-aperture',
        stats: 12145,
        progress: 60,
        options: {
            prefix: '$',
        }
    },
    {
        id: 2,
        variant: 'success',
        description: "January's Sales",
        icon: 'fe-shopping-cart',
        stats: 1576,
        progress: 49
    },
    {
        id: 3,
        variant: 'warning',
        description: "Payouts",
        icon: 'fe-bar-chart-2',
        stats: 8947,
        progress: 18,
        options: {
            prefix: '$',
        }
    },
    {
        id: 4,
        variant: 'info',
        description: "Available Stores",
        icon: 'fe-cpu',
        stats: 178,
        progress: 74
    }
];

const STATISTICSCARD3: StatisticsCard3[] = [
    {
        id: 1,
        title: "Income Status",
        stats: 31570,
        trendLabel: 'Total income',
        trendValue: '$22506',
        trendIcon: 'fa fa-caret-up',
        variant: 'success',
        trendStats: '10.25',
        options: {
            prefix: '$',
            duration: 2
        }
    },
    {
        id: 2,
        title: "Sales Status",
        stats: 683,
        trendLabel: 'Total Sales',
        trendValue: '2398',
        trendIcon: 'fa fa-caret-down',
        variant: 'danger',
        trendStats: '7.85',
    },
    {
        id: 3,
        title: "Recent Users",
        stats: 3.2,
        trendLabel: 'Total users',
        trendValue: '121 M',
        trendIcon: 'fa fa-caret-up',
        variant: 'success',
        trendStats: '3.64',
        options: {
            suffix: 'M',
            decimalPlaces: 1,
            duration: 2
        }
    },
    {
        id: 4,
        title: "Total Revenue",
        stats: 68541,
        trendLabel: 'Total revenue',
        trendValue: '$1.2 M',
        trendIcon: 'fa fa-caret-up',
        variant: 'success',
        trendStats: '17.48',
        options: {
            prefix: '$',
            duration: 2
        }
    }
];

const USERSCARDS: UserCard[] = [{
    id: 1,
    name: 'Thelma Fridley',
    title: 'Admin User',
    avatar: 'assets/images/users/user-3.jpg'
},
{
    id: 2,
    name: 'Chandler Hervieux',
    title: 'Manager',
    avatar: 'assets/images/users/user-4.jpg'
},
{
    id: 3,
    name: 'Percy Demers',
    title: 'Director',
    avatar: 'assets/images/users/user-5.jpg'
},
{
    id: 4,
    name: 'Antoine Masson',
    title: 'Premium User',
    avatar: 'assets/images/users/user-6.jpg',
    premiumUser: true

}
];

export { STATISCTICSCARD1, STATISTICSWIDGETS, STATISTICSCARD2, STATISTICSCARD3, USERSCARDS };
