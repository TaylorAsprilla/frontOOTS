import { Component, Input, OnDestroy, OnInit, SimpleChange } from '@angular/core';
import { EventService } from 'src/app/core/services/event.service';
import { changeBodyAttribute, getLayoutConfig } from '../../shared/helper/utils';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from '../../shared/topbar/topbar.component';
import { LeftSidebarComponent } from '../../shared/left-sidebar/left-sidebar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { RightSidebarComponent } from '../../shared/right-sidebar/right-sidebar.component';

@Component({
  selector: 'app-detached-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports: [CommonModule, RouterOutlet, TopbarComponent, LeftSidebarComponent, FooterComponent, RightSidebarComponent],
  standalone: true,
})
export class DetachedLayoutComponent implements OnInit, OnDestroy {
  @Input() layoutWidth: string = '';
  @Input() layoutColor: string = '';
  menuPosition: string = '';
  leftSidebarTheme: string = '';
  leftSidebarType: string = '';
  topbarTheme: string = '';
  showSidebarUserInfo: boolean = false;
  reRender: boolean = true;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    let config = getLayoutConfig('detached');
    this.menuPosition = config.menuPosition;
    this.leftSidebarTheme = config.leftSidebarTheme;
    this.leftSidebarType = config.leftSidebarType;
    this.topbarTheme = config.topbarTheme;
    this.showSidebarUserInfo = config.showSidebarUserInfo;

    // listen to event and change the layout configuarations
    this.eventService.subscribe('changeMenuPosition', (position) => {
      this.menuPosition = position;
    });

    this.eventService.subscribe('changeLeftSidebarTheme', (theme) => {
      this.leftSidebarTheme = theme;
    });

    this.eventService.subscribe('changeLeftSidebarType', (type) => {
      this.leftSidebarType = type;
    });

    this.eventService.subscribe('changeTopbarTheme', (theme) => {
      this.topbarTheme = theme;
    });

    this.eventService.subscribe('toggleLeftSidebarUserInfo', (show) => {
      this.showSidebarUserInfo = show;
    });
    this.changeLayoutConfig();
  }

  /**
   * On view init - activating horizontal layout
   */
  ngAfterViewInit() {
    changeBodyAttribute('data-layout-mode', 'detached');
  }

  /**
   * changes layout configurations
   */
  ngOnChanges(changes: SimpleChange) {
    this._setRerender();
    this.changeLayoutConfig();
  }

  ngDoCheck(): void {
    this.changeLayoutConfig();
  }

  ngOnDestroy(): void {
    changeBodyAttribute('data-layout-mode', 'remove');
  }

  /**
   * controls re-rendering
   */
  _setRerender = () => {
    this.reRender = false;
    setTimeout(() => {
      this.reRender = true;
    });
  };

  /**
   * changes layout related options
   */
  changeLayoutConfig(): void {
    // light vs dark mode
    changeBodyAttribute('data-layout-color', this.layoutColor);

    // boxed vs fluid
    changeBodyAttribute('data-layout-width', this.layoutWidth);

    // scrollable menus
    changeBodyAttribute('data-menu-position', this.menuPosition);

    // left sidebar theme
    changeBodyAttribute('data-leftbar-color', this.leftSidebarTheme);

    // left sidebar type
    changeBodyAttribute('data-leftbar-size', this.leftSidebarType);

    // topbar theme
    changeBodyAttribute('data-topbar-color', this.topbarTheme);
  }

  /**
   * on settings button clicked from topbar
   */
  onSettingsButtonClicked() {
    this.eventService.broadcast('showRightSideBar');
  }

  /**
   * On mobile toggle button clicked
   */
  onToggleMobileMenu() {
    document.body.classList.toggle('sidebar-enable');
  }
}
