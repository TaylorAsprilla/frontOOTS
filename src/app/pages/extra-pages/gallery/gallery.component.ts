import { Component, OnInit } from '@angular/core';
import { IAlbum, Lightbox } from 'ngx-lightbox';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { GALLARY } from './data';
import { GalleryItem } from './gallery.model';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  galleryAlbums: GalleryItem[] = [];
  imageCategory: string = 'all';
  loading: boolean = false;

  private _albums: IAlbum[] = [];

  constructor (private _lightbox: Lightbox) {
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Extra Pages', path: '/' }, { label: 'Gallery', path: '/', active: true }];
    this._fetchData();
  }

  /**
   * fetches albums of gallery
   */
  _fetchData(): void {
    this.galleryAlbums = this.imageCategory === 'all' ? GALLARY : GALLARY.filter((album) => album.category?.includes(this.imageCategory));
    this.galleryAlbums.forEach(album => this._albums.push(album.image!));
  }

  /**
   * open lightbox
   * @param index image number
   */
  open(index: number): void {
    this._lightbox.open(this._albums, index, { fadeDuration: 0.1, showImageNumberLabel: true, centerVertically: true });
  }

  /**
   * close lightbox programmatically
   */
  close(): void {
    this._lightbox.close();
  }

  /**
   * toggles like
   */
  toggleLike(album: GalleryItem) {
    album.isLiked = !album.isLiked;
  }

  /**
   * filter images by category
   * @param category category
   */
  filterImages(category: string) {
    this.loading = true;
    this.imageCategory = category;
    setTimeout(() => {
      this._fetchData();
      this.loading = false;
    }, 300);
  }


}
