import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Select2Data } from 'ng-select2-component';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-ecommerce-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  newProduct!: FormGroup;
  files: File[] = [];
  category: Select2Data = [];

  constructor (
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Ecommerce', path: '/' }, { label: 'Add / Edit Product', path: '/', active: true }];
    // product form
    this.newProduct = this.fb.group({
      name: ['', Validators.required],
      reference: ['', Validators.required],
      description: ['', Validators.required],
      summary: [''],
      category: ['', Validators.required],
      price: ['', Validators.required],
      status: ['online', Validators.required],
      comment: [''],
      metaTitle: [''],
      metaKeywords: [''],
      metaDescription: ['']
    });

    // product categories
    this.category = [
      {
        label: 'Shopping',
        options: [
          { value: 'SH1', label: 'Shopping 1' },
          { value: 'SH2', label: 'Shopping 2' },
          { value: 'SH3', label: 'Shopping 3' },
        ],
      },
      {
        label: 'CRM',
        options: [
          { value: 'CRM1', label: 'Crm 1' },
          { value: 'CRM2', label: 'Crm 2' },
          { value: 'CRM3', label: 'Crm 3' },
          { value: 'CRM4', label: 'Crm 4' },
        ],
      },
      {
        label: 'eCommerce',
        options: [
          { value: 'E1', label: 'eCommerce 1' },
          { value: 'E2', label: 'eCommerce 2' },
          { value: 'E3', label: 'eCommerce 3' },
          { value: 'E4', label: 'eCommerce 4' },
        ],
      },
    ];
  }

  // convenience getter for easy access to form fields
  get form1() { return this.newProduct.controls; }

  /**
   *  adds new file in uploaded files
   */
  onSelect(event: any) {
    this.files.push(...event.addedFiles);
  }

  /**
   *   removes file from uploaded files
   */
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  /**
  * Formats the size
  */
  getSize(f: File) {
    const bytes = f.size;
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }


  /**
   * Returns the preview url
   */
  getPreviewUrl(f: File) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(encodeURI(URL.createObjectURL(f)));
  }

}
