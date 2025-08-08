import { Post, Topic, User } from "./social-feed.model";

const POSTS: Post[] = [
    {
        id: 1,
        author: {
            id: 1,
            name: 'Jeremy Tomlinson',
            avatar: 'assets/images/users/user-3.jpg'
        },
        postedOn: 'about 2 minuts ago',
        scope: 'Public',
        // tslint:disable-next-line: max-line-length
        content: `
         <p>Story based around the idea of time lapse, animation to post soon!</p>
         <div class="row">
         <div class="col-sm-8">
             <img src="../assets/images/small/img-4.jpg" alt="post-img" class="rounded me-1 mb-3 mb-sm-0 img-fluid">
         </div>
         <div class="col">
             <img src="../assets/images/small/img-1.jpg" alt="post-img" class="rounded me-1 img-fluid mb-3">
             <img src="../assets/images/small/img-3.jpg" alt="post-img" class="rounded me-1 img-fluid">
         </div>
     </div>
        `,
        totalLikes: '2k',
        totalComments: '184',
        isLiked: true,
    },
    {
        id: 2,
        author: {
            id: 4,
            name: 'Jon Snow',
            avatar: 'assets/images/users/user-5.jpg'
        },
        postedOn: 'about 20 minuts ago',
        scope: 'Public',
        // tslint:disable-next-line: max-line-length
        content: `<div class="font-16 text-center fst-italic text-dark">
                                            <i class="mdi mdi-format-quote-open font-20"></i> Cras sit amet nibh libero, in
                                            gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras
                                            purus odio, vestibulum in vulputate at, tempus viverra turpis. Duis
                                            sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper
                                            porta. Mauris massa.
                                        </div>`,
        totalLikes: '751',
        totalComments: '85',
        isLiked: false,
        comments: [
            {
                id: 1,
                content: ' Nice work, makes me think of The Money Pit.',
                postedOn: '2 mins ago',
                author: {
                    id: 2,
                    name: 'Jeremy Tomlinson',
                    avatar: 'assets/images/users/user-9.jpg'
                },
                isLiked: false,
                replies: [
                    {
                        id: 3,
                        content:
                            "i'm in the middle of a timelapse animation myself! (Very different though.) Awesome stuff.",
                        postedOn: '5 hours ago',
                        author: {
                            id: 3,
                            name: 'Kathleen Thomas',
                            avatar: 'assets/images/users/user-1.jpg',
                        },
                    },
                ],
            }
        ]
    },
    {
        id: 3,
        author: {
            id: 4,
            name: 'Martin Williamson',
            avatar: 'assets/images/users/user-2.jpg',
        },
        postedOn: 'about 15 hours ago',
        scope: 'Public',
        content:
            '<p>The parallax is a little odd but O.o that house build is awesome!!</p>' +
            '<iframe src="https://player.vimeo.com/video/87993762" height="300" class="img-fluid border-0"></iframe>',
        isLiked: false,
        totalLikes: '1.5k',
        totalComments: '184',
        totalView: '3.5k'
    },
];

const PEOPLETOFOLLOW: User[] = [
    {
        id: 1,
        name: 'Robb Stark',
        status: 'The first king in the North',
        avatar: 'assets/images/users/user-2.jpg'
    },
    {
        id: 2,
        name: 'Sansa Stark',
        status: 'Lady of winterfall',
        avatar: 'assets/images/users/user-9.jpg'
    },
    {
        id: 3,
        name: 'Cersei Lannister',
        status: 'Queen of the Seven Kingdoms',
        avatar: 'assets/images/users/user-10.jpg'
    },
    {
        id: 4,
        name: 'Daenerys Targaryen',
        status: 'The dragon queen',
        avatar: 'assets/images/users/user-7.jpg'
    },
    {
        id: 5,
        name: 'Adhamd Annaway',
        status: 'I am available!',
        avatar: 'assets/images/users/user-4.jpg'
    }
];

const TRENDINGTOPICS: Topic[] = [{
    id: 1,
    title: 'Golden Globes',
    description: 'The 27 Best moments from the Golden Globe Awards'
}, {
    id: 2,
    title: 'World Cricket',
    description: 'India has won ICC T20 World Cup Yesterday'
}, {
    id: 3,
    title: 'Antartica',
    description: 'Metling of Totten Glacier could cause high risk to areas near by sea'
},
{
    id: 4,
    title: 'Global Tournament',
    description: 'America has won Football match Yesterday'
}
];

export { POSTS, PEOPLETOFOLLOW, TRENDINGTOPICS };