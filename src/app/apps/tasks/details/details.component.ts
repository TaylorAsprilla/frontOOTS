import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { TODAYTASKS } from '../shared/data';
import { ListTaskItem } from '../shared/tasks.model';

@Component({
  selector: 'app-task-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];

  selectedTask!: ListTaskItem;
  files: File[] = [];

  constructor (private sanitizer: DomSanitizer) { }


  ngOnInit(): void {
    this.pageTitle = [{ label: 'Tasks', path: '/' }, { label: 'Task Detail', path: '/', active: true }];
    this.selectedTask = TODAYTASKS[0];
  }

  /**
   * adds new file in uploaded files
   * @param event event
   */
  onSelect(event: any) {
    this.files.push(...event.addedFiles);
  }

  /**
   * removes file from uploaded files
   * @param event event
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
