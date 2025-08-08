export interface TicketItem {
    id: string;
    requested_by: {
        name: string;
        image: string;
    };
    subject: string;
    assignee: string;
    priority: string;
    status: string;
    created_date: string;
    due_date: string;

    [key: string]: string | object
}

export interface TicketDetails {
    id: string;
    title: string;
    type: string;
    reported_by: {
        name: string;
        image: string;
    };
    assigned_to: {
        name: string;
        image: string;
    };
    created_on: {
        date: string;
        time: string;
    };
    updated_on: {
        date: string;
        time: string;
    };
    overview: string;
    discussion: {
        avatar: string;
        name: string;
        text: string;
        time: string;
    }[]
}