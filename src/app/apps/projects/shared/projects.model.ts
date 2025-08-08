import { ChartData } from "chart.js";

export interface Project {
    id?: number;
    title?: string;
    companyName?: string
    state?: string;
    shortDesc?: string;
    totalTasks?: number;
    totalTasksCompleted?: number;
    totalTeamSize?: number;
    totalComments?: number;
    teamMembers?: {
        image: string;
        name: string;
    }[];
    progress?: number;
    progressData?: ChartData<'line'>;
    startDate?: string;
    startTime?: string;
    endDate?: string;
    endTime?: string;
    totalBudget?: number;
}
