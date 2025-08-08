// Table data
export interface AdvancedTable {
    name: string;
    position: string;
    office: string;
    age: number;
    date: string;
    salary: string;

    [key: string]: string | number;
}