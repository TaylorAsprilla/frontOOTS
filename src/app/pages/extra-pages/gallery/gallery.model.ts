import { IAlbum } from "ngx-lightbox";

export interface GalleryItem {
    id?: number;
    image?: IAlbum;
    title?: string;
    userName?: string;
    avatar?: string;
    isLiked?: boolean;
    category?: string[];
}