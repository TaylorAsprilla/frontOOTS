import { AllResult, UserResult } from "./search-result.model";

const USERS: UserResult[] = [{
    id: 1,
    userName: "Chadengle",
    email: "mediaheader@mail.com",
    avatar: "/assets/images/users/user-1.jpg",
    bio: "Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus."
},
{
    id: 2,
    userName: "Halette Boivin",
    email: "mediaheader@mail.com",
    avatar: "/assets/images/users/user-2.jpg",
    bio: "Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus."
},
{
    id: 3,
    userName: "Lucas Sabourin",
    email: "mediaheader@mail.com",
    avatar: "/assets/images/users/user-3.jpg",
    bio: "Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus."
},
{
    id: 4,
    userName: "Donatien Brunelle",
    email: "mediaheader@mail.com",
    avatar: "/assets/images/users/user-4.jpg",
    bio: "Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus."
},
{
    id: 5,
    userName: "Karel Auberjo",
    email: "mediaheader@mail.com",
    avatar: "/assets/images/users/user-5.jpg",
    bio: "Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus."
}
];

const ALLRESULTS: AllResult[] = [
    {
        id: 1,
        title: 'Zircos - Responsive Admin Template',
        url: 'http://coderthemes.com/zircos/index.html',
        content: `<p class="mb-0 text-muted">Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p>`
    },
    {
        id: 2,
        title: 'Uplon - Responsive Bootstrap 4 Web App Kit',
        url: 'http://themeforest.net/user/coderthemes/portfolio?ref=coderthemes',
        content: `<p class="mb-0 text-muted">Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p>`,
    },
    {
        id: 3,
        content: USERS[0]
    },
    {
        id: 4,
        title: 'Zircos - Responsive Admin Template',
        url: 'http://ubold.coderthemes.com/',
        content: `<p class="mb-0 text-muted">Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p>`
    },
    {
        id: 5,
        title: 'Uplon - Responsive Bootstrap 4 Web App Kit',
        url: 'http://themeforest.net/user/coderthemes/portfolio?ref=coderthemes',
        content: `
        <div class="">
        <img src="../assets/images/small/img-1.jpg" height="48" alt="image"/>
        <img src="../assets/images/small/img-2.jpg" height="48" alt="image"/>
        <img src="../assets/images/small/img-3.jpg" height="48" alt="image"/>
        <img src="../assets/images/small/img-4.jpg" height="48" alt="image"/>
        </div>`,
    },
    {
        id: 6,
        title: 'Zircos - Responsive Admin Template',
        url: 'http://ubold.coderthemes.com/',
        content: `<p class="mb-0 text-muted">Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p>`
    },
    {
        id: 7,
        title: 'Uplon - Responsive Bootstrap 4 Web App Kit',
        url: 'http://themeforest.net/user/coderthemes/portfolio?ref=coderthemes',
        content: `
        <p class="mb-0 text-muted">
        Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.
        </p>
        <div class="row mt-2">
        <div class="col-sm-4 col-xl-2">
        <div class="ratio ratio-16x9">
        <iframe src="https://www.youtube.com/embed/PrUxWZiQfy4?autohide=0&showinfo=0&controls=0"></iframe>
        </div>
        </div>
        </div>`,
    }
];



export { ALLRESULTS, USERS };