import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-extended-ui-animation',
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.scss']
})
export class AnimationComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  animationType: string = 'bounce';

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Extended UI', path: '/' }, { label: 'Animation', path: '/', active: true }];
  }

  /**
   * triggers animation 
   */
  triggerAnimation(): void {
    let animationBox = document.getElementById("animationSandbox");
    animationBox?.classList.add('animate__' + this.animationType, 'animate__animated');
    animationBox?.addEventListener('animationend', () => {
      animationBox?.classList.remove('animate__' + this.animationType, 'animate__animated');
    });
  }

}
