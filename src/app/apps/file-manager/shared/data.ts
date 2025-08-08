import { QuickAccessItem, RecentFileItem } from "./file.model";

const quickAccess: QuickAccessItem[] = [
    {
        icon: "mdi mdi-folder-zip font-16",
        name: "Ubold-sketch.zip",
        size: "2.3 MB"
    },
    {
        icon: "mdi mdi-folder font-16",
        name: "Compile Version",
        size: "87.2 MB"
    },
    {
        icon: "mdi mdi-folder-zip-outline font-16",
        name: "admin-dashboard.zip",
        size: "45.1 MB"
    },
    {
        icon: "mdi mdi-file-pdf-outline font-16",
        name: "Documentation.pdf",
        size: "7.5 MB"
    },
    {
        icon: "mdi mdi-file-pdf-outline font-16",
        name: "License-details.pdf",
        size: "784 KB"
    },
    {
        icon: "mdi mdi-folder-account font-16",
        name: "Purchase Verification",
        size: "87.2 MB"
    },
    {
        icon: "mdi mdi-folder-account font-16",
        name: "Ubold Integrations",
        size: "874 MB"
    },
];

const recentFiles: RecentFileItem[] = [
    {
        name: "App Design & Development",
        modifiedDate: "Jan 03, 2020",
        modifiedBy: "Andrew",
        size: "128 MB",
        type: 'folder',
        owner: "Danielle Thompson",
        members: [
            {
                image: 'assets/images/users/user-1.jpg',
                name: "Mat Helme"
            },
            {
                image: 'assets/images/users/user-2.jpg',
                name: "Michael Zenaty"
            },
            {
                image: 'assets/images/users/user-3.jpg',
                name: "James Anderson"
            },
            {
                image: 'assets/images/users/user-5.jpg',
                name: "Username"
            },
        ],
    },
    {
        name: "Hyper-sketch-design.zip",
        modifiedDate: "Feb 13, 2020",
        modifiedBy: "Coderthemes",
        size: "521 MB",
        type: 'file',
        owner: "Coder Themes",
        members: [
            {
                image: 'assets/images/users/user-4.jpg',
                name: "Mat Helme"
            },
            {
                image: 'assets/images/users/user-1.jpg',
                name: "Michael Zenaty"
            },
            {
                image: 'assets/images/users/user-6.jpg',
                name: "James Anderson"
            },
        ],
    },
    {
        name: "Annualreport.pdf",
        modifiedDate: "Dec 18, 2019",
        modifiedBy: "Alejandro",
        size: "7.2 MB",
        type: 'file-text',
        owner: "Gary Coley",
        members: [
            {
                image: 'assets/images/users/user-9.jpg',
                name: "Mat Helme"
            },
            {
                image: 'assets/images/users/user-7.jpg',
                name: "Michael Zenaty"
            },
            {
                image: 'assets/images/users/user-3.jpg',
                name: "James Anderson"
            },
        ],
    },
    {
        name: "Wireframes",
        modifiedDate: "Nov 25, 2019",
        modifiedBy: "Dunkle",
        size: "54.2 MB",
        type: 'folder',
        owner: "Jasper Rigg",
        members: [
            {
                image: 'assets/images/users/user-1.jpg',
                name: "Mat Helme"
            },
            {
                image: 'assets/images/users/user-8.jpg',
                name: "Michael Zenaty"
            },
            {
                image: 'assets/images/users/user-2.jpg',
                name: "James Anderson"
            },
            {
                image: 'assets/images/users/user-5.jpg',
                name: "Username"
            },
        ],
    },
    {
        name: "Documentation.docs",
        modifiedDate: "Feb 9, 2020",
        modifiedBy: "Justin",
        size: "8.3 MB",
        type: 'file-text',
        owner: "Cooper Sharwood",
        members: [
            {
                image: 'assets/images/users/user-3.jpg',
                name: "Mat Helme"
            },
            {
                image: 'assets/images/users/user-10.jpg',
                name: "Michael Zenaty"
            },
        ],
    },
];

export { quickAccess, recentFiles };