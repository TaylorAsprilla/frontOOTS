import {
  LAYOUT_COLOR_DARK,
  LAYOUT_COLOR_LIGHT,
  LAYOUT_DETACHED,
  LAYOUT_HORIZONTAL,
  LAYOUT_TWO_COLUMN_MENU,
  LAYOUT_VERTICAL,
  LAYOUT_WIDTH_BOXED,
  LAYOUT_WIDTH_FLUID,
  LEFT_SIDEBAR_THEME_DARK,
  LEFT_SIDEBAR_THEME_LIGHT,
  LEFT_SIDEBAR_TYPE_DEFAULT,
  MENU_POSITION_FIXED,
  MENU_POSITION_SCROLLABLE,
  TOPBAR_THEME_DARK,
  TOPBAR_THEME_LIGHT,
} from '../config/layout.model';
import { LayoutConfig } from '../models/layout-config.model';
import { MenuItem } from '../models/menu.model';

/**
 * finds all parents of selected menuitem
 * @param menuItems list of menus
 * @param menuItem selected menu
 * @returns list of all parent menus of menuitem
 */
const findAllParent = (menuItems: MenuItem[], menuItem: any): any => {
  let parents = [];
  const parent = findMenuItem(menuItems, menuItem['parentKey']);

  if (parent) {
    parents.push(parent['key']);
    if (parent['parentKey']) parents = [...parents, ...findAllParent(menuItems, parent)];
  }
  return parents;
};

/**
 * finds menuitem
 * @param menuItems list of menus
 * @param menuItemKey key to be matched
 * @returns menuitem that has menuItemKey
 */
const findMenuItem = (menuItems: MenuItem[], menuItemKey: string): any => {
  if (menuItems && menuItemKey) {
    for (var i = 0; i < menuItems.length; i++) {
      if (menuItems[i].key === menuItemKey) {
        return menuItems[i];
      }
      var found = findMenuItem(menuItems[i].children, menuItemKey);
      if (found) return found;
    }
  }
  return null;
};

/**
 * Changes the body attribute
 */
const changeBodyAttribute = (attribute: string, value?: string, action = 'set'): void => {
  switch (action) {
    case 'remove':
      if (document.body) {
        if (document.body.hasAttribute(attribute)) {
          document.body.removeAttribute(attribute);
        }
      }
      break;
    default:
      if (document.body) document.body.setAttribute(attribute, value!);
      break;
  }
};

/**
 * returns configurations based on layout type
 * @param layoutType layout type
 */
const getLayoutConfig = (layoutType: string = 'vertical'): LayoutConfig => {
  let config: LayoutConfig = {
    layoutWidth: LAYOUT_WIDTH_FLUID,
    layoutColor: LAYOUT_COLOR_LIGHT,
    menuPosition: MENU_POSITION_FIXED,
    leftSidebarTheme: LEFT_SIDEBAR_THEME_LIGHT,
    leftSidebarType: LEFT_SIDEBAR_TYPE_DEFAULT,
    topbarTheme: TOPBAR_THEME_DARK,
    showSidebarUserInfo: false,
  };

  switch (layoutType) {
    case LAYOUT_HORIZONTAL:
      return config;
    case LAYOUT_DETACHED:
      config.showSidebarUserInfo = true;
      return config;
    case LAYOUT_TWO_COLUMN_MENU:
      config.topbarTheme = TOPBAR_THEME_LIGHT;
      return config;
    default:
      return config;
  }
};

/**
 * Filtra ítems de menú según el rol del usuario.
 *
 * Cualquier ítem (o hijo) marcado con `adminOnly: true` se omite
 * cuando `isAdmin === false`. Si un padre es eliminado, sus hijos
 * también desaparecen porque ya no se itera por él.
 *
 * No muta el array original.
 */
const filterMenuByRole = (menuItems: MenuItem[], isAdmin: boolean): MenuItem[] => {
  if (!menuItems) return [];
  return menuItems
    .filter((item) => isAdmin || !item.adminOnly)
    .map((item) => {
      if (item.children && item.children.length) {
        return { ...item, children: filterMenuByRole(item.children, isAdmin) };
      }
      return item;
    });
};

export { findAllParent, findMenuItem, changeBodyAttribute, getLayoutConfig, filterMenuByRole };
