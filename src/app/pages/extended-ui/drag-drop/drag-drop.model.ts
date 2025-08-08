export interface Project {
    id: number;
    title: string;
    description: string;
    created_on: string;
    announced_on: string;
    user: {
        avatar: string;
        name: string;
    }
}

export interface Person {
    id: number;
    name: string;
    avatar: string;
    position: string;
    description: string;
}