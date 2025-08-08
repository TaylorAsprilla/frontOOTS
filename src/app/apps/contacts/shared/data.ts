import { Experience, MemberInfo, ProfileProjectItem, TimelinePost } from "./contacts.model";

const MEMBERLIST: MemberInfo[] = [
    {
        id: 1,
        name: 'Freddie J. Plourde',
        avatar: 'assets/images/users/user-3.jpg',
        position: 'Founder',
        website: 'websitename.com',
        posts: '$2563',
        followers: '$29.8k',
        followings: '1125',
    },
    {
        id: 2,
        name: 'Christopher Gallardo',
        avatar: 'assets/images/users/user-4.jpg',
        position: 'Webdesigner',
        website: 'abcweb.com',
        posts: '$12.7k',
        followers: '$65.3k',
        followings: '2184',
    },
    {
        id: 3,
        name: 'Joseph M. Rohr',
        avatar: 'assets/images/users/user-5.jpg',
        position: 'Webdesigner',
        website: 'mywebs.com',
        posts: '$1021',
        followers: '$25.6k',
        followings: '325',
    },
    {
        id: 4,
        name: 'Mark K. Horne',
        avatar: 'assets/images/users/user-6.jpg',
        position: 'Director',
        website: 'profileq.com',
        posts: '$7845',
        followers: '$16.7k',
        followings: '5846',
    },
    {
        id: 5,
        name: 'James M. Fonville',
        avatar: 'assets/images/users/user-7.jpg',
        position: 'Manager',
        website: 'coolweb.com',
        posts: '$4851',
        followers: '$10.2k',
        followings: '895',
    },
    {
        id: 6,
        name: 'Jade M. Walker',
        avatar: 'assets/images/users/user-8.jpg',
        position: 'Programmer',
        website: 'supported.com',
        posts: '$4560',
        followers: '$15.3k',
        followings: '742',
    },
    {
        id: 7,
        name: 'Marie E. Tate',
        avatar: 'assets/images/users/user-9.jpg',
        position: 'Webdeveloper',
        website: 'website.com',
        posts: '$3520',
        followers: '$4587',
        followings: '423',
    },
    {
        id: 8,
        name: 'Elyse D. Davidson',
        avatar: 'assets/images/users/user-2.jpg',
        position: 'Webdesigner',
        website: 'dumosite.com',
        posts: '$7851',
        followers: '$16.8k',
        followings: '1036',
    },
    {
        id: 9,
        name: 'Sarah E. Goin',
        avatar: 'assets/images/users/user-10.jpg',
        position: 'Manager',
        website: 'webion.com',
        posts: '$7421',
        followers: '$29.5k',
        followings: '11k',
    },
];

const EXPERIENCE: Experience[] = [
    {
        id: 1,
        title: "Lead designer / Developer",
        company: "websitename.com ",
        year: "2015 - 18",
        description: "Everyone realizes why a new common language would be desirable: one could refuse to pay expensive translators. To achieve this, it would be necessary to have uniform grammar, pronunciation and more common words.",
    },
    {
        id: 2,
        title: "Senior Graphic Designer",
        company: "Software Inc. ",
        year: "2012 - 15",
        description: "If several languages coalesce, the grammar of the resulting language is more simple and regular than that of the individual languages. The new common language will be more simple and regular than the existing European languages.",
    },
    {
        id: 3,
        title: "Graphic Designer",
        company: "Coderthemes Design LLP",
        year: "2010 - 12",
        description: "The European languages are members of the same family. Their separate existence is a myth. For science music sport etc, Europe uses the same vocabulary. The languages only differ in their grammar their pronunciation."
    }
];


const PROJECTS: ProfileProjectItem[] = [
    {
        id: 1,
        clientName: 'Halette Boivin',
        projectName: 'App design and development',
        startDate: '01/01/2015',
        dueDate: '10/05/2018',
        status: 'Work in Progress',
    },
    {
        id: 2,
        clientName: 'Durandana Jolicoeur',
        projectName: 'Coffee detail page - Main Page',
        startDate: '21/07/2016',
        dueDate: '12/05/2018',
        status: 'Pending',
    },
    {
        id: 3,
        clientName: 'Lucas Sabourin',
        projectName: 'Poster illustation design',
        startDate: '18/03/2018',
        dueDate: '28/09/2018',
        status: 'Done',
    },
    {
        id: 4,
        clientName: 'Donatien Brunelle',
        projectName: 'Drinking bottle graphics',
        startDate: '02/10/2017',
        dueDate: '07/05/2018',
        status: 'Work in Progress',
    },
    {
        id: 5,
        clientName: 'Karel Auberjo',
        projectName: 'Landing page design - Home',
        startDate: '17/01/2017',
        dueDate: '25/05/2021',
        status: 'Coming soon',
    },
];


const POSTS: TimelinePost[] = [
    {
        id: 1,
        author: {
            id: 4,
            name: 'Jeremy Tomlinson',
            avatar: 'assets/images/users/user-3.jpg',
        },
        postedOn: 'about 2 minuts ago',
        content:
            '<p>Story based around the idea of time lapse, animation to post soon!</p><img src="assets/images/small/img-1.jpg" alt="post-img" class="rounded me-1" height="60" /><img src="assets/images/small/img-2.jpg" alt="post-img" class="rounded me-1" height="60" /><img src="assets/images/small/img-3.jpg" alt="post-img" class="rounded me-1" height="60" />',
        isLiked: false,
        totalLikes: '12',
        engagement: true,
    },
    {
        id: 2,
        author: {
            id: 1,
            name: 'Thelma Fridley',
            avatar: 'assets/images/users/user-4.jpg',
        },
        postedOn: 'about 1 hour ago',
        content:
            '<div class="font-16 text-center fst-italic text-dark"><i class="mdi mdi-format-quote-open font-20"></i> Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa.</div>',
        totalLikes: '28',
        totalComments: '',
        isLiked: true,
        comments: [
            {
                id: 1,
                content: 'Nice work, makes me think of The Money Pit.',
                postedOn: '3 hours ago',
                author: {
                    id: 2,
                    name: 'Jeremy Tomlinson',
                    avatar: 'assets/images/users/user-3.jpg',
                },
                isLiked: true,
                replies: [
                    {
                        id: 3,
                        content:
                            "i'm in the middle of a timelapse animation myself! (Very different though.) Awesome stuff.",
                        postedOn: '5 hours ago',
                        author: {
                            id: 3,
                            name: 'Thelma Fridley',
                            avatar: 'assets/images/users/user-4.jpg',
                        },
                    },
                ],
            },
        ],
        engagement: true,
    },
    {
        id: 3,
        author: {
            id: 4,
            name: 'Martin Williamson',
            avatar: 'assets/images/users/user-6.jpg',
        },
        postedOn: 'about 20 minuts ago',
        // scope: 'Public',
        content:
            '<p>The parallax is a little odd but O.o that house build is awesome!!</p>' +
            '<iframe src="https://player.vimeo.com/video/87993762" height="300" class="img-fluid border-0"></iframe>',
        // "<p>The parallax is a little odd but O.o that house build is awesome!!</p><iframe src='https://player.vimeo.com/video/87993762' height='300' class='img-fluid border-0'></iframe>",
        isLiked: false,
        engagement: false,
    },
];

export { MEMBERLIST, EXPERIENCE, PROJECTS, POSTS };