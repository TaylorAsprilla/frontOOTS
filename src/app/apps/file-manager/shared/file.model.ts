export interface QuickAccessItem {
    icon: string;
    name: string;
    size: string;
}
interface Member {
    image: string;
    name: string;
}
export interface RecentFileItem {
    name: string;
    type: string;
    modifiedDate: string;
    modifiedBy: string;
    size: string;
    owner: string;
    members: Member[];
}