export interface SitemapItem {
    id?: number;
    label: string;
    isTitle?: boolean;
    icon?: string;
    className?: string;
    children?: Array<SitemapItem>;
}