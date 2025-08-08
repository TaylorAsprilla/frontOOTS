import { Component, OnInit } from '@angular/core';
import { QuillModules } from 'ngx-quill';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-form-editors',
  templateUrl: './editors.component.html',
  styleUrls: ['./editors.component.scss']
})
export class EditorsComponent implements OnInit {
  pageTitle: BreadcrumbItem[] = [];
  editorText1: string = "";
  editorText2: string = "";
  quillConfig: QuillModules = {};

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Forms', path: '/' }, { label: 'Quilljs Editor', path: '/', active: true }];
    this.quillConfig = {
      toolbar: [
        [{ font: [] }, { size: [] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "super" }, { script: "sub" }],
        [{ header: [!1, 1, 2, 3, 4, 5, 6] }, "blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
        ["direction", { align: [] }],
        ["link", "image", "video"],
        ["clean"]
      ]
    }

    this.editorText1 = `<h3><span class="ql-size-large">Hello World!</span></h3>
            <p><br></p>
            <h3>This is an simple editable area.</h3>
            <p><br></p>
            <ul>
            <li>
            Select a text to reveal the toolbar.
            </li>
            <li>
            Edit rich document on-the-fly, so elastic!
            </li>
            </ul>
            <p><br></p>
            <p>
            End of simple area
            </p>`

    this.editorText2 = `<h3><span class="ql-size-large">Hello World!</span></h3>
            <p><br></p>
            <h3>This is an simple editable area.</h3>
            <p><br></p>
            <ul>
            <li>
            Select a text to reveal the toolbar.
            </li>
            <li>
            Edit rich document on-the-fly, so elastic!
            </li>
            </ul>
            <p><br></p>
            <p>
            End of simple area
            </p>`

  }

}
