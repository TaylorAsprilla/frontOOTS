import { KanbanBoardTaskItem, ListTaskItem } from "./tasks.model";

const avatarImg2 = 'assets/images/users/user-9.jpg';
const avatarImg3 = 'assets/images/users/user-3.jpg';
const avatarImg4 = 'assets/images/users/user-4.jpg';
const avatarImg5 = 'assets/images/users/user-5.jpg';
const avatarImg6 = 'assets/images/users/user-6.jpg';

const TODAYTASKS: ListTaskItem[] = [
    {
        id: 1,
        title: 'Draft the new contract document for sales team',
        assigned_to: 'Arya Stark',
        assignee_avatar: avatarImg2,
        due_date: 'Today 10am',
        completed: false,
        priority: 'High',
        stage: 'Todo',
        checklists: [
            { id: 1, title: 'Find out the old contract documents', completed: true },
            {
                id: 2,
                title: 'Organize meeting sales associates to understand need in detail',
                completed: false,
            },
            {
                id: 3,
                title: 'Make sure to cover every small details',
                completed: false,
            },
        ],
        description:
            // tslint:disable-next-line: max-line-length
            '<p><b>This is a task description with markup support</b></p><ul><li>Select a text to reveal the toolbar.</li><li>Edit rich document on-the-fly, so elastic!</li></ul><p>End of air-mode area</p>',
        attachments: [
            { id: 1, filename: 'sales-assets.zip', size: '2.3 MB' },
            { id: 2, filename: 'new-contarcts.docx', size: '1.3 MB' },
        ],
        comments: [
            {
                id: 1,
                author: 'Arya Stark',
                text: 'Should I review the last 3 years legal documents as well?',
                posted_on: '4:30am',
                author_avatar: avatarImg2,
                replies: [{
                    id: 4,
                    author: 'Thelma Fridley',
                    text: 'i\'m in the middle of a timelapse animation myself!(Very different though :)',
                    posted_on: '6:30pm',
                    author_avatar: avatarImg4,
                }]
            },
            {
                id: 2,
                author: 'Gary Somya',
                text: '@Arya FYI..I have created some general guidelines last year.',
                posted_on: '3:30am',
                author_avatar: avatarImg3,
            },
        ],
    },
    {
        id: 2,
        title: 'iOS App home page',
        assigned_to: 'James B',
        assignee_avatar: avatarImg3,
        due_date: 'Today 4pm',
        completed: false,
        stage: 'In-progress',
        priority: 'High',
        checklists: [
            { id: 1, title: 'Find out the old contract documents', completed: false },
            {
                id: 2,
                title: 'Organize meeting sales associates to understand need in detail',
                completed: false,
            },
            {
                id: 3,
                title: 'Make sure to cover every small details',
                completed: false,
            },
        ],
        description:
            // tslint:disable-next-line: max-line-length
            '<p><b>This is a task description with markup support</b></p><ul><li>Select a text to reveal the toolbar.</li><li>Edit rich document on-the-fly, so elastic!</li></ul><p>End of air-mode area</p>',
        attachments: [
            { id: 1, filename: 'sales-assets.zip', size: '2.3 MB' },
            { id: 2, filename: 'new-contarcts.docx', size: '1.3 MB' },
        ],
        comments: [
            {
                id: 1,
                author: 'Arya Stark',
                text: 'Should I review the last 3 years legal documents as well?',
                posted_on: '4:30am',
                author_avatar: avatarImg2,
            },
            {
                id: 2,
                author: 'Gary Somya',
                text: '@Arya FYI..I have created some general guidelines last year.',
                posted_on: '3:30am',
                author_avatar: avatarImg3,
            },
        ],
    },
    {
        id: 3,
        title: 'Write a release note',
        assigned_to: 'Kevin C',
        assignee_avatar: avatarImg4,
        due_date: 'Today 4pm',
        completed: false,
        stage: 'In-progress',
        priority: 'Medium',
        checklists: [
            { id: 1, title: 'Find out the old contract documents', completed: false },
            {
                id: 2,
                title: 'Organize meeting sales associates to understand need in detail',
                completed: false,
            },
            {
                id: 3,
                title: 'Make sure to cover every small details',
                completed: false,
            },
        ],
        description:
            // tslint:disable-next-line: max-line-length
            '<p><b>This is a task description with markup support</b></p><ul><li>Select a text to reveal the toolbar.</li><li>Edit rich document on-the-fly, so elastic!</li></ul><p>End of air-mode area</p>',
        attachments: [
            { id: 1, filename: 'sales-assets.zip', size: '2.3 MB' },
            { id: 2, filename: 'new-contarcts.docx', size: '1.3 MB' },
        ],
        comments: [
            {
                id: 1,
                author: 'Arya Stark',
                text: 'Should I review the last 3 years legal documents as well?',
                posted_on: '4:30am',
                author_avatar: avatarImg2,
            },
            {
                id: 2,
                author: 'Gary Somya',
                text: '@Arya FYI..I have created some general guidelines last year.',
                posted_on: '3:30am',
                author_avatar: avatarImg3,
            },
        ],
    },
]

const UPCOMINGTASKS: ListTaskItem[] = [
    {
        id: 4,
        title: 'Invite user to a project',
        assigned_to: 'Arya Stark',
        assignee_avatar: avatarImg2,
        due_date: 'Tomorrow 10am',
        stage: 'Todo',
        completed: false,
        priority: 'Low',
        checklists: [
            { id: 1, title: 'Find out the old contract documents', completed: false },
            {
                id: 2,
                title: 'Organize meeting sales associates to understand need in detail',
                completed: false,
            },
            {
                id: 3,
                title: 'Make sure to cover every small details',
                completed: false,
            },
        ],
        description:
            // tslint:disable-next-line: max-line-length
            '<p><b>This is a task description with markup support</b></p><ul><li>Select a text to reveal the toolbar.</li><li>Edit rich document on-the-fly, so elastic!</li></ul><p>End of air-mode area</p>',
        attachments: [
            { id: 1, filename: 'sales-assets.zip', size: '2.3 MB' },
            { id: 2, filename: 'new-contarcts.docx', size: '1.3 MB' },
        ],
        comments: [
            {
                id: 1,
                author: 'Arya Stark',
                text: 'Should I review the last 3 years legal documents as well?',
                posted_on: '4:30am',
                author_avatar: avatarImg2,
            },
            {
                id: 2,
                author: 'Gary Somya',
                text: '@Arya FYI..I have created some general guidelines last year.',
                posted_on: '3:30am',
                author_avatar: avatarImg3,
            },
        ],
    },
    {
        id: 5,
        title: 'Enable analytics tracking',
        assigned_to: 'James B',
        assignee_avatar: avatarImg5,
        due_date: '27 Aug 10am',
        completed: false,
        stage: 'Review',
        priority: 'Low',
        checklists: [
            { id: 1, title: 'Find out the old contract documents', completed: false },
            {
                id: 2,
                title: 'Organize meeting sales associates to understand need in detail',
                completed: false,
            },
            {
                id: 3,
                title: 'Make sure to cover every small details',
                completed: false,
            },
        ],
        description:
            // tslint:disable-next-line: max-line-length
            '<p><b>This is a task description with markup support</b></p><ul><li>Select a text to reveal the toolbar.</li><li>Edit rich document on-the-fly, so elastic!</li></ul><p>End of air-mode area</p>',
        attachments: [
            { id: 1, filename: 'sales-assets.zip', size: '2.3 MB' },
            { id: 2, filename: 'new-contarcts.docx', size: '1.3 MB' },
        ],
        comments: [
            {
                id: 1,
                author: 'Arya Stark',
                text: 'Should I review the last 3 years legal documents as well?',
                posted_on: '4:30am',
                author_avatar: avatarImg2,
            },
            {
                id: 2,
                author: 'Gary Somya',
                text: '@Arya FYI..I have created some general guidelines last year.',
                posted_on: '3:30am',
                author_avatar: avatarImg3,
            },
        ],
    },
    {
        id: 6,
        title: 'Code HTML email template',
        assigned_to: 'Kevin C',
        assignee_avatar: avatarImg6,
        due_date: 'No Due Date',
        completed: false,
        stage: 'Review',
        priority: 'Medium',
        checklists: [
            { id: 1, title: 'Find out the old contract documents', completed: false },
            {
                id: 2,
                title: 'Organize meeting sales associates to understand need in detail',
                completed: false,
            },
            {
                id: 3,
                title: 'Make sure to cover every small details',
                completed: false,
            },
        ],
        description:
            // tslint:disable-next-line: max-line-length
            '<p><b>This is a task description with markup support</b></p><ul><li>Select a text to reveal the toolbar.</li><li>Edit rich document on-the-fly, so elastic!</li></ul><p>End of air-mode area</p>',
        attachments: [
            { id: 1, filename: 'sales-assets.zip', size: '2.3 MB' },
            { id: 2, filename: 'new-contarcts.docx', size: '1.3 MB' },
        ],
        comments: [
            {
                id: 1,
                author: 'Arya Stark',
                text: 'Should I review the last 3 years legal documents as well?',
                posted_on: '4:30am',
                author_avatar: avatarImg2,
            },
            {
                id: 2,
                author: 'Gary Somya',
                text: '@Arya FYI..I have created some general guidelines last year.',
                posted_on: '3:30am',
                author_avatar: avatarImg3,
            },
        ],
    },
]

const OTHERTASKS: ListTaskItem[] = [
    {
        id: 7,
        title: 'Coordinate with business development',
        assigned_to: 'Arya Stark',
        assignee_avatar: avatarImg2,
        due_date: 'No Due Date',
        stage: 'Todo',
        completed: false,
        priority: 'High',
        checklists: [
            { id: 1, title: 'Find out the old contract documents', completed: false },
            {
                id: 2,
                title: 'Organize meeting sales associates to understand need in detail',
                completed: false,
            },
            {
                id: 3,
                title: 'Make sure to cover every small details',
                completed: false,
            },
        ],
        description:
            // tslint:disable-next-line: max-line-length
            '<p><b>This is a task description with markup support</b></p><ul><li>Select a text to reveal the toolbar.</li><li>Edit rich document on-the-fly, so elastic!</li></ul><p>End of air-mode area</p>',
        attachments: [
            { id: 1, filename: 'sales-assets.zip', size: '2.3 MB' },
            { id: 2, filename: 'new-contarcts.docx', size: '1.3 MB' },
        ],
        comments: [
            {
                id: 1,
                author: 'Arya Stark',
                text: 'Should I review the last 3 years legal documents as well?',
                posted_on: '4:30am',
                author_avatar: avatarImg2,

            },
            {
                id: 2,
                author: 'Gary Somya',
                text: '@Arya FYI..I have created some general guidelines last year.',
                posted_on: '3:30am',
                author_avatar: avatarImg3,
            },
        ],
    },
    {
        id: 8,
        title: 'Kanban board design',
        assigned_to: 'James B',
        assignee_avatar: avatarImg5,
        stage: 'Review',
        due_date: '30 Aug 10am',
        completed: false,
        priority: 'Low',
        checklists: [
            { id: 1, title: 'Find out the old contract documents', completed: false },
            {
                id: 2,
                title: 'Organize meeting sales associates to understand need in detail',
                completed: false,
            },
            {
                id: 3,
                title: 'Make sure to cover every small details',
                completed: false,
            },
        ],
        description:
            // tslint:disable-next-line: max-line-length
            '<p><b>This is a task description with markup support</b></p><ul><li>Select a text to reveal the toolbar.</li><li>Edit rich document on-the-fly, so elastic!</li></ul><p>End of air-mode area</p>',
        attachments: [
            { id: 1, filename: 'sales-assets.zip', size: '2.3 MB' },
            { id: 2, filename: 'new-contarcts.docx', size: '1.3 MB' },
        ],
        comments: [
            {
                id: 1,
                author: 'Arya Stark',
                text: 'Should I review the last 3 years legal documents as well?',
                posted_on: '4:30am',
                author_avatar: avatarImg2,
            },
            {
                id: 2,
                author: 'Gary Somya',
                text: '@Arya FYI..I have created some general guidelines last year.',
                posted_on: '3:30am',
                author_avatar: avatarImg3,
            },
        ],
    },
    {
        id: 9,
        title: 'Draft the new contract document for sales team',
        assigned_to: 'Kevin C',
        assignee_avatar: avatarImg6,
        due_date: 'No Due Date',
        stage: 'Done',
        completed: false,
        priority: 'Medium',
        checklists: [
            { id: 1, title: 'Find out the old contract documents', completed: false },
            {
                id: 2,
                title: 'Organize meeting sales associates to understand need in detail',
                completed: false,
            },
            {
                id: 3,
                title: 'Make sure to cover every small details',
                completed: false,
            },
        ],
        description:
            // tslint:disable-next-line: max-line-length
            '<p><b>This is a task description with markup support</b></p><ul><li>Select a text to reveal the toolbar.</li><li>Edit rich document on-the-fly, so elastic!</li></ul><p>End of air-mode area</p>',
        attachments: [
            { id: 1, filename: 'sales-assets.zip', size: '2.3 MB' },
            { id: 2, filename: 'new-contarcts.docx', size: '1.3 MB' },
        ],
        comments: [
            {
                id: 1,
                author: 'Arya Stark',
                text: 'Should I review the last 3 years legal documents as well?',
                posted_on: '4:30am',
                author_avatar: avatarImg2,
            },
            {
                id: 2,
                author: 'Gary Somya',
                text: '@Arya FYI..I have created some general guidelines last year.',
                posted_on: '3:30am',
                author_avatar: avatarImg3,
            },
        ],
    },
    {
        id: 10,
        title: 'Draft the new contract document for vendor Abc',
        assigned_to: 'Kevin C',
        assignee_avatar: avatarImg6,
        due_date: '2 Sep 10am',
        completed: false,
        stage: 'Done',
        priority: 'Medium',
        checklists: [
            { id: 1, title: 'Find out the old contract documents', completed: false },
            {
                id: 2,
                title: 'Organize meeting sales associates to understand need in detail',
                completed: false,
            },
            {
                id: 3,
                title: 'Make sure to cover every small details',
                completed: false,
            },
        ],
        description:
            // tslint:disable-next-line: max-line-length
            '<p><b>This is a task description with markup support</b></p><ul><li>Select a text to reveal the toolbar.</li><li>Edit rich document on-the-fly, so elastic!</li></ul><p>End of air-mode area</p>',
        attachments: [
            { id: 1, filename: 'sales-assets.zip', size: '2.3 MB' },
            { id: 2, filename: 'new-contarcts.docx', size: '1.3 MB' },
        ],
        comments: [
            {
                id: 1,
                author: 'Arya Stark',
                text: 'Should I review the last 3 years legal documents as well?',
                posted_on: '4:30am',
                author_avatar: avatarImg2,
            },
            {
                id: 2,
                author: 'Gary Somya',
                text: '@Arya FYI..I have created some general guidelines last year.',
                posted_on: '3:30am',
                author_avatar: avatarImg3,
            },
        ],
    },
]

const KANBANTASKS: KanbanBoardTaskItem[] = [
    {
        id: 1,
        title: 'Ubold v3.0 - Redesign',
        description: 'There are many variations of passages of Lorem Ipsum available.',
        status: 'Upcoming',
        priority: 'High',
        userAvatar: [avatarImg2, avatarImg3],
        project: 'Ubold',
        dueDate: 'Jul 18, 2019',
    },
    {
        id: 2,
        title: 'Minton v3.0 - Redesign',
        description: 'Many desktop publishing packages and web page.',
        status: 'Inprogress',
        priority: 'Low',
        userAvatar: [avatarImg2],
        project: 'Ubold',
        dueDate: 'Jul 20, 2019',
    },
    {
        id: 3,
        title: 'Ubold v2.1 - Angular and Django',
        description: 'If you are going to use a passage of Lorem Ipsum.',
        status: 'Completed',
        priority: 'Low',
        userAvatar: [avatarImg5],
        project: 'Ubold2',
        dueDate: 'Jul 21, 2019',
    },
    {
        id: 4,
        title: 'Ubold v2.1 - React, Webpack',
        description: 'It has roots in a piece of classical Latin literature from 45 BC.',
        status: 'Completed',
        priority: 'High',
        userAvatar: [avatarImg6, avatarImg4],
        project: 'Ubold2',
        dueDate: 'Jul 22, 2019',
    },
    {
        id: 5,
        title: 'Ubold 2.2 - Vue.Js and Laravel',
        description: 'There are many variations of passages of Lorem Ipsum available.',
        status: 'Upcoming',
        priority: 'Low',
        userAvatar: [avatarImg6],
        project: 'Ubold',
        dueDate: 'Jul 18, 2019',
    },
    {
        id: 6,
        title: 'Ubold 2.3 - Rails, NodeJs, Mean',
        description: 'All the Lorem Ipsum generators on the Internet tend to repeat predefined.',
        status: 'Upcoming',
        priority: 'Medium',
        userAvatar: [avatarImg2, avatarImg3],
        project: 'Ubold2',
        dueDate: 'Jul 21, 2019',
    },
    {
        id: 7,
        title: 'Ubold - Landing page and UI Kit',
        description: 'Your awesome text goes here. Your awesome text goes here.',
        status: 'Completed',
        priority: 'Medium',
        userAvatar: [avatarImg2, avatarImg4],
        project: 'Ubold',
        dueDate: 'Jul 10, 2019',
    },
    {
        id: 8,
        title: 'Ubold 3.0 - Scoping',
        description: 'A handful of model sentence structures, to generate Lorem Ipsum which looks reasonable.',
        status: 'Inprogress',
        priority: 'High',
        userAvatar: [avatarImg5],
        project: 'Ubold2',
        dueDate: 'Jul 24, 2019',
    },
    {
        id: 9,
        title: 'Shreyu 1.0 - Angular',
        description: 'There are many variations of passages of Lorem Ipsum available.',
        status: 'Upcoming',
        priority: 'Low',
        userAvatar: [avatarImg2],
        project: 'Ubold',
        dueDate: 'Aug 18, 2019',
    },
    {
        id: 10,
        title: 'Shreyu 1.0 - React',
        description: 'All the Lorem Ipsum generators on the Internet tend to repeat predefined.',
        status: 'Inprogress',
        priority: 'High',
        userAvatar: [avatarImg4],
        project: 'Ubold',
        dueDate: 'Aug 18, 2019',
    },
    {
        id: 11,
        title: 'Minton 1.0 - Angular',
        description: 'There are many variations of passages of Lorem Ipsum available.',
        status: 'Completed',
        priority: 'Low',
        userAvatar: [avatarImg2],
        project: 'Ubold',
        dueDate: 'Aug 18, 2019',
    },
];

// all tasks
const ALLTASKS = [...TODAYTASKS, ...UPCOMINGTASKS, ...OTHERTASKS]


export { ALLTASKS, TODAYTASKS, UPCOMINGTASKS, OTHERTASKS, KANBANTASKS };