import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { EventService } from 'src/app/core/service/event.service';
import { changeBodyAttribute, getLayoutConfig } from '../../shared/helper/utils';

@Component({
  selector: 'app-vertical-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class VerticalLayoutComponent implements OnInit {

  @Input() layoutWidth: string = '';
  @Input() layoutColor: string = "";
  menuPosition: string = "";
  leftSidebarTheme: string = "";
  leftSidebarType: string = "";
  topbarTheme: string = "";
  showSidebarUserInfo: boolean = false;
  reRender: boolean = true;

  constructor (
    private eventService: EventService
  ) { }

  ngOnInit(): void {

    let config = getLayoutConfig('vertical');
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

  ngAfterViewInit() {
    changeBodyAttribute('data-layout-mode', '', 'remove')
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

  /**
   * controls re-rendering
   */
  _setRerender = () => {
    this.reRender = false;
    setTimeout(() => {
      this.reRender = true;
    }, 20);
  }

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
