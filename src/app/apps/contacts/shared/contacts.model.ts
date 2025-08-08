import { Post } from "../../social-feed/shared/social-feed.model";

export interface MemberInfo {
    id?: number;
    name?: string;
    avatar?: string;
    position?: string;
    website?: string;
    posts?: string;
    followers?: string;
    followings?: string;
}

export interface Experience {
    id?: number;
    title?: string;
    company?: string;
    year?: string;
    description?: string;
}

export interface ProfileProjectItem {
    id?: number;
    clientName?: string;
    projectName?: string;
    startDate?: string;
    dueDate?: string;
    status?: string;
}

export interface TimelinePost extends Post {
    engagement: boolean;
}