import { Person, Project } from "./drag-drop.model";

const PROJECTS: Project[] = [
    {
        id: 1,
        title: 'iOS App home page',
        description: 'There are many variations of passages of Lorem Ipsum available.',
        created_on: 'Oct 16, 2018',
        announced_on: '03 Nov',
        user: {
            avatar: 'assets/images/users/user-2.jpg',
            name: 'David Muth',
        },
    },
    {
        id: 2,
        title: 'Invite user to a project',
        description: 'There are many variations of passages of Lorem Ipsum available.',
        created_on: 'Oct 16, 2018',
        announced_on: 'Latest',
        user: {
            avatar: 'assets/images/users/user-3.jpg',
            name: 'Dan Statler',
        },
    },
    {
        id: 3,
        title: 'Topnav layout design',
        description: 'There are many variations of passages of Lorem Ipsum available.',
        created_on: 'Oct 16, 2018',
        announced_on: 'New',
        user: {
            avatar: 'assets/images/users/user-4.jpg',
            name: 'Raleigh Aragon',
        },
    },
    {
        id: 4,
        title: 'Write a release note',
        description: 'There are many variations of passages of Lorem Ipsum available.',
        created_on: 'Oct 16, 2018',
        announced_on: 'Latest',
        user: {
            avatar: 'assets/images/users/user-5.jpg',
            name: 'Gary Rhode',
        },
    },
    {
        id: 5,
        title: 'Enable analytics tracking',
        description: 'There are many variations of passages of Lorem Ipsum available.',
        created_on: 'Oct 16, 2018',
        announced_on: '15 Jun',
        user: {
            avatar: 'assets/images/users/user-6.jpg',
            name: 'Andres Preston',
        },
    },
    {
        id: 6,
        title: 'Kanban board design',
        description: 'There are many variations of passages of Lorem Ipsum available.',
        created_on: 'Oct 16, 2018',
        announced_on: 'Latest',
        user: {
            avatar: 'assets/images/users/user-7.jpg',
            name: 'Joseph Carson',
        },
    },
];

const TEAM1: Person[] = [
    {
        id: 1,
        name: 'Louis K. Bond',
        avatar: 'assets/images/users/user-1.jpg',
        position: 'Founder & CEO',
        description: "Disrupt pork belly poutine, asymmetrical tousled succulents selfies. You probably haven't heard of them tattooed master cleanse live-edge keffiyeh.",
    },
    {
        id: 2,
        name: 'Dennis N. Cloutier',
        avatar: 'assets/images/users/user-2.jpg',
        position: 'Software Engineer',
        description: "Disrupt pork belly poutine, asymmetrical tousled succulents selfies. You probably haven't heard of them tattooed master cleanse live-edge keffiyeh.",
    },
    {
        id: 3,
        name: 'Susan J. Sander',
        avatar: 'assets/images/users/user-3.jpg',
        position: 'Web Designer',
        description: "Disrupt pork belly poutine, asymmetrical tousled succulents selfies. You probably haven't heard of them tattooed master cleanse live-edge keffiyeh.",
    }
];

const TEAM2: Person[] = [
    {
        id: 1,
        name: 'James M. Short',
        avatar: 'assets/images/users/user-4.jpg',
        position: 'Web Developer',
        description: "Disrupt pork belly poutine, asymmetrical tousled succulents selfies. You probably haven't heard of them tattooed master cleanse live-edge keffiyeh.",
    },
    {
        id: 2,
        name: 'Gabriel J. Snyder',
        avatar: 'assets/images/users/user-5.jpg',
        position: 'Business Analyst',
        description: "Disrupt pork belly poutine, asymmetrical tousled succulents selfies. You probably haven't heard of them tattooed master cleanse live-edge keffiyeh.",
    },
    {
        id: 3,
        name: 'Louie C. Mason',
        avatar: 'assets/images/users/user-6.jpg',
        position: 'Human Resources',
        description: "Disrupt pork belly poutine, asymmetrical tousled succulents selfies. You probably haven't heard of them tattooed master cleanse live-edge keffiyeh.",
    },
];

const TEAM3: Person[] = [
    {
        id: 1,
        name: 'Louis K. Bond',
        avatar: 'assets/images/users/user-1.jpg',
        position: 'Founder & CEO',
        description: "Disrupt pork belly poutine, asymmetrical tousled succulents selfies. You probably haven't heard of them tattooed master cleanse live-edge keffiyeh.",
    },
    {
        id: 2,
        name: 'Dennis N. Cloutier',
        avatar: 'assets/images/users/user-2.jpg',
        position: 'Software Engineer',
        description: "Disrupt pork belly poutine, asymmetrical tousled succulents selfies. You probably haven't heard of them tattooed master cleanse live-edge keffiyeh.",
    },
    {
        id: 3,
        name: 'Susan J. Sander',
        avatar: 'assets/images/users/user-3.jpg',
        position: 'Web Designer',
        description: "Disrupt pork belly poutine, asymmetrical tousled succulents selfies. You probably haven't heard of them tattooed master cleanse live-edge keffiyeh.",
    }
];

const TEAM4: Person[] = [
    {
        id: 1,
        name: 'James M. Short',
        avatar: 'assets/images/users/user-4.jpg',
        position: 'Web Developer',
        description: "Disrupt pork belly poutine, asymmetrical tousled succulents selfies. You probably haven't heard of them tattooed master cleanse live-edge keffiyeh.",
    },
    {
        id: 2,
        name: 'Gabriel J. Snyder',
        avatar: 'assets/images/users/user-5.jpg',
        position: 'Business Analyst',
        description: "Disrupt pork belly poutine, asymmetrical tousled succulents selfies. You probably haven't heard of them tattooed master cleanse live-edge keffiyeh.",
    },
    {
        id: 3,
        name: 'Louie C. Mason',
        avatar: 'assets/images/users/user-6.jpg',
        position: 'Human Resources',
        description: "Disrupt pork belly poutine, asymmetrical tousled succulents selfies. You probably haven't heard of them tattooed master cleanse live-edge keffiyeh.",
    },
];

export { PROJECTS, TEAM1, TEAM2, TEAM3, TEAM4 };