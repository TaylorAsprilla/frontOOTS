interface CheckListItem {
    id: number;
    title: string;
    completed: boolean;
}

interface Comment {

    id: number;
    author: string;
    text: string;
    posted_on: string;
    author_avatar: string;
    replies?: Comment[];
}

interface AttachmentItem {
    id: number;
    filename: string;
    size: string;
}

export interface ListTaskItem {
    id?: number;
    title?: string;
    assignee_avatar?: string;
    assigned_to?: string;
    due_date?: string;
    description?: string;
    checklists?: CheckListItem[];
    attachments?: AttachmentItem[];
    comments?: Comment[];
    completed?: boolean;
    stage?: string;
    subtasks?: string;
    priority?: string;
}


// Kanban Board Data
export interface KanbanBoardTaskItem {
    id?: number;
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    userAvatar?: string[];
    project?: string;
    dueDate?: string;
}
