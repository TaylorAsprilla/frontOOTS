import { Project } from './projects.model';

const DUMMY_PROJECTS: Project[] = [
    {
        id: 1,
        title: 'New Admin Design',
        state: 'Finished',
        companyName: 'Orange Limited',
        shortDesc: 'With supporting text below as a natural lead-in to additional contenposuere erat a ante',
        startDate: '17 March 2018',
        startTime: '1:00 PM',
        endDate: '22 December 2018',
        endTime: '1:00 PM',
        totalBudget: 15800,
        totalTasks: 78,
        totalTasksCompleted: 28,
        totalTeamSize: 17,
        totalComments: 741,
        teamMembers: [{
            image: 'assets/images/users/user-1.jpg',
            name: 'Mat Helme'
        },
        {
            image: 'assets/images/users/user-2.jpg',
            name: 'Michael Zenaty',
        },
        {
            image: 'assets/images/users/user-3.jpg',
            name: 'James Anderson',
        },
        {
            image: 'assets/images/users/user-4.jpg',
            name: 'Mat Helme',
        },
        {
            image: 'assets/images/users/user-5.jpg',
            name: 'Username',
        }],
        progress: 34,
        progressData: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Completed Tasks',
                data: [32, 42, 42, 62, 52, 75, 62],
                backgroundColor: 'rgba(74, 129, 212, 0.3)',
                borderColor: '#4a81d4',
                tension: 0.4,
                fill: {
                    target: 'origin',
                    above: 'rgba(74, 129, 212, 0.3)',
                },
                pointBackgroundColor: 'transparent',
                pointHoverBackgroundColor: 'transparent',
                pointBorderColor: '#4a81d4',
                pointHoverBorderColor: '#4a81d4',
                pointBorderWidth: 1.5,
                capBezierPoints: true,
            }, {
                label: 'Plan Tasks',
                data: [42, 58, 66, 93, 82, 105, 92],
                backgroundColor: 'transparent',
                borderColor: '#f1556c',
                borderDash: [5, 5],
                tension: 0.4,
                pointBackgroundColor: 'transparent',
                pointHoverBackgroundColor: 'transparent',
                pointBorderColor: '#f1556c',
                pointHoverBorderColor: '#f1556c',
                pointBorderWidth: 1.5,
                capBezierPoints: true,
            }]
        }
    },
    {
        id: 2,
        title: 'App Design and Development',
        state: 'Ongoing',
        companyName: 'Moondust Softwares',
        shortDesc: 'This card has supporting text below as a natural lead-in to additional content is a little bit longer',
        startDate: '17 March 2019',
        startTime: '1:00 PM',
        endDate: '22 December 2019',
        endTime: '1:00 PM',
        totalBudget: 15200,
        totalTasks: 85,
        totalTasksCompleted: 55,
        totalTeamSize: 17,
        totalComments: 103,
        teamMembers: [{
            image: 'assets/images/users/user-6.jpg',
            name: 'Mat Helme'
        },
        {
            image: 'assets/images/users/user-7.jpg',
            name: 'Michael Zenaty',
        },
        {
            image: 'assets/images/users/user-8.jpg',
            name: 'James Anderson',
        }],
        progress: 80,
        progressData: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Completed Tasks',
                data: [32, 42, 42, 62, 52, 75, 62]
            }, {
                label: 'Plan Tasks',

                data: [42, 58, 66, 93, 82, 105, 92]
            }]
        }
    },
    {
        id: 3,
        title: 'Landing page Design',
        state: 'Finished',
        companyName: 'rose Technologies',
        shortDesc: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid',
        startDate: '17 March 2018',
        startTime: '1:00 PM',
        endDate: '22 December 2018',
        endTime: '1:00 PM',
        totalBudget: 14000,
        totalTasks: 42,
        totalTasksCompleted: 21,
        totalTeamSize: 17,
        totalComments: 65,
        teamMembers: [{
            image: 'assets/images/users/user-1.jpg',
            name: 'Mat Helme'
        },
        {
            image: 'assets/images/users/user-2.jpg',
            name: 'Michael Zenaty',
        },
        {
            image: 'assets/images/users/user-3.jpg',
            name: 'James Anderson',
        },
        {
            image: 'assets/images/users/user-4.jpg',
            name: 'Mat Helme',
        },
        ],
        progress: 50,
        progressData: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Completed Tasks',
                data: [32, 42, 42, 62, 52, 75, 62]
            }, {
                label: 'Plan Tasks',

                data: [42, 58, 66, 93, 82, 105, 92]
            }]
        }
    },
    {
        id: 4,
        title: 'Custom Software Development',
        companyName: 'Apple Navigations',
        state: 'Ongoing',
        shortDesc: 'Some quick example text to build on the card title and make up the bulk of the card\'s content',
        startDate: '17 March 2018',
        startTime: '1:00 PM',
        endDate: '22 December 2018',
        endTime: '1:00 PM',
        totalBudget: 20000,
        totalTasks: 98,
        totalTasksCompleted: 70,
        totalTeamSize: 17,
        totalComments: 83,
        teamMembers: [{
            image: 'assets/images/users/user-1.jpg',
            name: 'Mat Helme'
        },
        {
            image: 'assets/images/users/user-2.jpg',
            name: 'Michael Zenaty',
        },
        {
            image: 'assets/images/users/user-5.jpg',
            name: 'Username',
        }],
        progress: 68,
        progressData: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Completed Tasks',
                data: [32, 42, 42, 62, 52, 75, 62]
            }, {
                label: 'Plan Tasks',

                data: [42, 58, 66, 93, 82, 105, 92]
            }]
        }
    },
    {
        id: 5,
        title: 'Website Redesign',
        state: 'Ongoing',
        companyName: 'Enigma navigations',
        shortDesc: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid.',
        startDate: '17 March 2018',
        startTime: '1:00 PM',
        endDate: '22 December 2018',
        endTime: '1:00 PM',
        totalBudget: 21000,
        totalTasks: 38,
        totalTasksCompleted: 12,
        totalTeamSize: 17,
        totalComments: 78,
        teamMembers: [{
            image: 'assets/images/users/user-1.jpg',
            name: 'Mat Helme'
        },

        {
            image: 'assets/images/users/user-3.jpg',
            name: 'James Anderson',
        },
        {
            image: 'assets/images/users/user-4.jpg',
            name: 'Mat Helme',
        },
        {
            image: 'assets/images/users/user-5.jpg',
            name: 'Username',
        }],
        progress: 33,
        progressData: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Completed Tasks',
                data: [32, 42, 42, 62, 52, 75, 62]
            }, {
                label: 'Plan Tasks',

                data: [42, 58, 66, 93, 82, 105, 92]
            }]
        }
    },
    {
        id: 6,
        title: 'Multipurpose Landing Template',
        state: 'Finished',
        companyName: 'Pride Softwares',
        shortDesc: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid.',
        startDate: '17 March 2018',
        startTime: '1:00 PM',
        endDate: '22 December 2018',
        endTime: '1:00 PM',
        totalBudget: 25000,
        totalTasks: 30,
        totalTasksCompleted: 28,
        totalTeamSize: 17,
        totalComments: 148,
        teamMembers: [{
            image: 'assets/images/users/user-1.jpg',
            name: 'Mat Helme'
        },
        {
            image: 'assets/images/users/user-2.jpg',
            name: 'Michael Zenaty',
        },
        {
            image: 'assets/images/users/user-3.jpg',
            name: 'James Anderson',
        },
        {
            image: 'assets/images/users/user-4.jpg',
            name: 'Mat Helme',
        },
        {
            image: 'assets/images/users/user-5.jpg',
            name: 'Username',
        }],
        progress: 95,
        progressData: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Completed Tasks',
                data: [32, 42, 42, 62, 52, 75, 62]
            }, {
                label: 'Plan Tasks',

                data: [42, 58, 66, 93, 82, 105, 92]
            }]
        }
    }];

export { DUMMY_PROJECTS };
