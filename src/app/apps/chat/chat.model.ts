import { ChatGroup } from "src/app/shared/widget/chat-group/chat-group.model";

export interface ChatUser {
    id?: number;
    name?: string;
    avatar?: string;
    lastMessage?: string;
    totalUnread?: number;
    lastMessageOn?: string;
    email?: string;
    phone?: string;
    location?: string;
    languages?: string;
    groups?: ChatGroup[];
}

export interface ChatMessage {
    id: number;
    from: ChatUser;
    to: ChatUser;
    message: {
        type?: string;
        value?: any;
    }[];
    sendOn?: string;
}