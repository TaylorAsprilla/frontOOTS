export interface MenuItem {
  id?: number;
  key?: string;
  label?: string;
  icon?: string;
  link?: string;
  collapsed?: boolean;
  children?: any;
  isTitle?: boolean;
  badge?: any;
  parentKey?: number;
  adminOnly?: boolean;
  /** Con adminOnly: también visible para ADMIN_COUNTRY (sus datos se filtran por país en el backend). */
  countryAdminAllowed?: boolean;
  /** Solo visible para quienes aprueban transferencias (SUPERVISOR, ADMIN, ADMIN_COUNTRY). */
  approverOnly?: boolean;
  /** Visible para los profesionales que elaboran informes de transferencia */
  reporterOnly?: boolean;
}
