export interface CRMCustomer {
    id: number;
    avatar: string;
    name: string;
    phone: string;
    email: string;
    company: string;
    created_date: string;
    location: string;
    status: string;
}

export interface CompanyInfoItem {
    id: number;
    logo: string;
    name: string;
    location: string;
    category: string;
    email: string;
    phone: string;
    status: string;
    date: string;
}

export interface PerformanceData {
    id: number;
    user: string;
    position: string;
    leads: number;
    deals: number;
    tasks: number;
}

export interface LeadItem {
    id: number;
    name: string;
    avatar: string;
    email: string;
    status: string;
}