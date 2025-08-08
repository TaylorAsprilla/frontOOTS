interface TimelinePost {
    id: number;
    postedOn?: string;
    time?: string;
    content?: string;
}

export interface TimelineItem {
    id?: number;
    day?: string;
    posts?: TimelinePost[];
}