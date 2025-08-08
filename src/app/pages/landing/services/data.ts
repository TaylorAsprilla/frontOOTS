interface Services {
    icon?: string;
    title: string;
    description?: string;
}

const SERVICES: Services[] = [
    {
        icon: 'assets/images/landing/icons/layers.png',
        title: 'Responsive Layouts',
        description: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit',
    },
    {
        icon: 'assets/images/landing/icons/core.png',
        title: 'Based on Bootstrap UI',
        description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium',
    },
    {
        icon: 'assets/images/landing/icons/paperdesk.png',
        title: 'Creative Design',
        description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis',
    },
    {
        icon: 'assets/images/landing/icons/solarsystem.png',
        title: 'Awesome Support',
        description: 'At solmen va esser necessi far uniform grammatica pronun e plu sommun paroles.',
    },
    {
        icon: 'assets/images/landing/icons/datatext.png',
        title: 'Easy to customize',
        description: 'If several languages coalesce the grammar of the is more simple languages.',
    },
    {
        icon: 'assets/images/landing/icons/browserscript.png',
        title: 'Quality Code',
        description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis',
    },
];

export { Services, SERVICES };