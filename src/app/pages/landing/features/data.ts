interface Feature {
    id: number;
    title: string;
    description: string;
    image: string;
    icon: string;
}

const FEATURES: Feature[] = [
    {
        id: 1,
        title: 'It\'s designed for describing your app, agency or business',
        description: 'If several languages coalesce the grammar of the resulting language is more simple and regular than that of the individual languages.',
        image: 'assets/images/landing/features-img/img-2.png',
        icon: 'mdi mdi-chart-bar'
    },
    {
        id: 2,
        title: 'Explore the new world of creativity',
        description: ' Everyone realizes why a new common language would be desirable one could refuse to expensive translators it would be necessary.',
        image: 'assets/images/landing/features-img/img-1.png',
        icon: 'mdi mdi-auto-fix'
    },
];

export { Feature, FEATURES };
