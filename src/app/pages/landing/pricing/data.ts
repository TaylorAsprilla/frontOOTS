import { PricingPlan } from "src/app/shared/widget/pricing-cards/pricing-card.model";

const PLANS: PricingPlan[] = [
    {
        id: 1,
        name: 'Single Application',
        icon: 'fe-user',
        price: 49,
        duration: 'license',
        features: ['Number of end products 1', 'Customer support', 'Free Updates', '1 Domain', 'Email Support', '24x7 Support'],
        recommended: false
    },
    {
        id: 2,
        name: 'Multiple Application',
        icon: 'fe-award',
        price: 149,
        duration: 'license',
        features: ['Number of end products 3', 'Customer support', 'Free Updates', '1 Domain', 'Email Support', '24x7 Support'],
        recommended: true
    },
    {
        id: 3,
        name: 'Extended',
        icon: 'fe-aperture',
        price: 999,
        duration: 'license',
        features: ['Number of end products 1', 'Customer support', 'Free Updates', '1 Domain', 'Email Support', '24x7 Support'],
        recommended: false
    }
];

export { PLANS };
