import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';


type RatioItem = {
  ratioX: number;
  ratioY: number;
}

@Component({
  selector: 'app-ui-embedvideo',
  templateUrl: './embedvideo.component.html',
  styleUrls: ['./embedvideo.component.scss']
})
export class EmbedvideoComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  embedVideoCards: RatioItem[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Base UI', path: '/' }, { label: 'Embed Video', path: '/', active: true }];
    this.embedVideoCards = [
      {
        ratioX: 21,
        ratioY: 9
      },
      {
        ratioX: 16,
        ratioY: 9
      },
      {
        ratioX: 1,
        ratioY: 1
      },
      {
        ratioX: 4,
        ratioY: 3
      }
    ];
  }

}
