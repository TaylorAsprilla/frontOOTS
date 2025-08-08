import { ChatUser } from "./chat.model";

//list of chat users
const USERS: ChatUser[] = [
    {
        id: 1,
        name: 'Brandon Smith',
        avatar: 'assets/images/users/user-2.jpg',
        lastMessage: 'How are you today?',
        totalUnread: 3,
        lastMessageOn: '4:30am',
        groups: [{ id: 1, groupName: 'App Development', variant: 'success' }, { id: 2, groupName: 'Office Work', variant: 'warning' }]
    },
    {
        id: 2,
        name: 'Maria C',
        avatar: 'assets/images/users/user-10.jpg',
        lastMessage: 'Hey! a reminder for tomorrow\'s meeting?',
        totalUnread: 0,
        lastMessageOn: '5:30am',
        groups: [{ id: 1, groupName: 'App Development', variant: 'success' }, { id: 2, groupName: 'Office Work', variant: 'warning' }]
    },
    {
        id: 3,
        name: 'Dominic A',
        avatar: 'assets/images/users/user-8.jpg',
        lastMessage: 'Are we going to have this week\'s planning meeting?',
        totalUnread: 2,
        lastMessageOn: 'Thu',
        groups: [{ id: 1, groupName: 'App Development', variant: 'success' }, { id: 2, groupName: 'Office Work', variant: 'warning' }]

    },
    {
        id: 4,
        name: 'Ronda D',
        avatar: 'assets/images/users/user-9.jpg',
        lastMessage: 'Please check these design assets..',
        totalUnread: 0,
        lastMessageOn: 'Wed',
        groups: [{ id: 1, groupName: 'App Development', variant: 'success' }]
    },
    {
        id: 5,
        name: 'Michael H',
        avatar: 'assets/images/users/user-3.jpg',
        lastMessage: 'Are you free for 15 mins? I would like to discuss something',
        totalUnread: 6,
        lastMessageOn: 'Tue',
        groups: [{ id: 1, groupName: 'App Development', variant: 'success' }, { id: 2, groupName: 'Office Work', variant: 'warning' }]
    },
    {
        id: 6,
        name: 'Thomas R',
        avatar: 'assets/images/users/user-5.jpg',
        lastMessage: 'Let\'s have meeting today between me, you and Tony...',
        totalUnread: 0,
        lastMessageOn: 'Tue',
        groups: [{ id: 1, groupName: 'App Development', variant: 'success' }]
    },
    {
        id: 7,
        name: 'Thomas J',
        avatar: 'assets/images/users/user-6.jpg',
        lastMessage: 'Howdy?',
        totalUnread: 0,
        lastMessageOn: 'Tue',
        groups: [{ id: 1, groupName: 'Office Work', variant: 'warning' }]
    },
    {
        id: 8,
        name: 'Rikcy J',
        avatar: 'assets/images/users/user-1.jpg',
        lastMessage: 'Are you interested in learning?',
        totalUnread: 28,
        lastMessageOn: 'Mon',
        groups: [{ id: 1, groupName: 'App Development', variant: 'success' }, { id: 2, groupName: 'Office Work', variant: 'primary' }]
    }
];

export { USERS };