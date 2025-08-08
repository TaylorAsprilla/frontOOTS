export interface Testimonial {
    id: number;
    clientName: string;
    title: string;
    avatar: string;
    message: string;
}

export const TESTIMONIALS: Testimonial[] = [
    {
        id: 1,
        clientName: 'Michael Morrell',
        title: 'Ubold User',
        avatar: 'assets/images/landing/testi/img-2.png',
        message: 'Excellent support for a tricky issue related to our customization of the template. Author kept us updated as he made progress on the issue and emailed us a patch when he was done. '
    },
    {
        id: 2,
        clientName: 'John Seidel',
        title: 'Ubold User',
        avatar: 'assets/images/landing/testi/img-1.png',
        message: 'Flexible, Everything is in, Suuuuuper light, even for the code is much easier to cut and make it a theme for a productive app.'
    },
    {
        id: 3,
        clientName: 'Robert Taylor',
        title: 'Ubold User',
        avatar: 'assets/images/landing/testi/img-3.png',
        message: 'Not only the code, design and support are awesome, but they also update it constantly the template with new content, new plugins. I will buy surely another coderthemes template! '
    }
];