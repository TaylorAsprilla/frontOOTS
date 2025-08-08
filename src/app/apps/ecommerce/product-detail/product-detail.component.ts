import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { PRODUCTLIST } from '../shared/data';
import { Product } from '../shared/ecommerce.model';

@Component({
  selector: 'app-ecommerce-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  product: Product = {};


  constructor (private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Ecommerce', path: '/' }, { label: 'Product Detail', path: '/', active: true }];
    // fetches product details
    this.route.queryParams.subscribe(params => {
      if (params && params.hasOwnProperty('id')) {
        this.product = PRODUCTLIST.filter(x => String(x.id) === params['id'])[0];
      } else {
        this.product = PRODUCTLIST[0];
      }
    });
  }

}
