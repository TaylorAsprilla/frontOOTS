/**
 * Roles de usuario disponibles en el sistema (RBAC)
 */
export type UserRole = 'ADMIN' | 'COORDINADOR' | 'SUPERVISOR' | 'PSICOLOGO' | 'ORIENTADOR';

/**
 * Interface para la solicitud de login
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Interface para la información del país en la respuesta de autenticación
 */
export interface AuthCountry {
  id: number;
  name: string;
  iso: string;
  locale: string;
}

/**
 * Interface para la información del rol en la respuesta de autenticación
 */
export interface AuthRole {
  id: number;
  name: UserRole;
  description?: string;
  isActive?: boolean;
}

/**
 * Interface para la información del usuario en la respuesta
 */
export interface AuthUser {
  id: number;
  firstName: string;
  firstLastName: string;
  email: string;
  role?: UserRole | AuthRole;
  status?: string;
  country?: AuthCountry;
}

/**
 * Interface para los datos de autenticación en la respuesta
 */
export interface AuthData {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}

/**
 * Interface para la respuesta completa del backend
 */
export interface LoginResponse {
  data: AuthData;
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}

/**
 * Interface para la información del usuario autenticado almacenada
 */
export interface AuthenticatedUser extends AuthUser {
  token: string;
  refreshToken?: string;
  tokenType: string;
  expiresAt: Date; // Timestamp de expiración calculado
}

// ==================== REFRESH TOKEN ====================

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

// ==================== LOGOUT ====================

export interface LogoutRequest {
  refresh_token?: string;
}

export interface LogoutResponse {
  message: string;
}

// ==================== SESIONES ACTIVAS ====================

export interface ActiveSession {
  id: number;
  ipAddress: string;
  deviceType: string;
  browser: string;
  os: string;
  country: string;
  city: string;
  lastActivity: string;
  createdAt: string;
}

// ==================== HISTORIAL DE LOGIN ====================

export interface LoginHistoryEntry {
  id: number;
  ipAddress: string;
  country: string;
  city: string;
  deviceType: string;
  browser: string;
  os: string;
  isNewLocation: boolean;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
}

export interface LoginHistoryResponse {
  data: LoginHistoryEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==================== AUDIT LOGS ====================

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'PASSWORD_CHANGE'
  | 'PASSWORD_RESET'
  | 'STATUS_CHANGE';

export interface AuditLog {
  id: number;
  userEmail: string;
  action: AuditAction;
  endpoint: string;
  httpMethod: string;
  responseStatus: number;
  ipAddress: string;
  durationMs: number;
  createdAt: string;
}

export interface AuditLogResponse {
  data: AuditLog[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AuditLogFilters {
  userId?: number;
  action?: AuditAction;
  endpoint?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

/**
 * Interface para errores de autenticación
 */
export interface AuthError {
  statusCode: number;
  message: string;
  error?: string;
  timestamp: string;
  path: string;
}

/**
 * Interface para el usuario completo desde /validate endpoint
 */
export interface ValidatedUser {
  id: number;
  firstName: string;
  secondName: string | null;
  firstLastName: string;
  secondLastName: string | null;
  email: string;
  phoneNumber: string;
  position: string;
  headquarters: string;
  documentNumber: string;
  address: string;
  city: string;
  birthDate: string; // ISO date string
  documentTypeId: number;
  role?: UserRole;
  status: 'ACTIVE' | 'INACTIVE';
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedin: string | null;
  github: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface para los datos de respuesta de validate
 */
export interface ValidateData {
  valid: boolean;
  user: ValidatedUser;
}

/**
 * Interface para la respuesta completa de validate
 */
export interface ValidateTokenResponse {
  data: ValidateData;
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}

/**
 * Interface extendida para usuario autenticado con datos completos
 */
export interface AuthenticatedUserComplete extends ValidatedUser {
  token: string;
  tokenType: string;
  expiresAt: Date;
}

// ==================== PASSWORD MANAGEMENT INTERFACES ====================

/**
 * DTO para cambiar contraseña (usuario autenticado)
 */
export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * DTO para solicitar recuperación de contraseña
 */
export interface ForgotPasswordDto {
  email: string;
}

/**
 * DTO para restablecer contraseña con token
 */
export interface ResetPasswordDto {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Interface para respuesta genérica de operaciones de contraseña
 */
export interface PasswordResponse {
  data?: any;
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}

// ==================== PROFILE MANAGEMENT INTERFACES ====================

/**
 * DTO para actualizar perfil de usuario
 */
export interface UpdateProfileDto {
  firstName?: string;
  firstLastName?: string;
  phoneNumber?: string;
  position?: string;
  website?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
}

/**
 * Interface para usuario con redes sociales
 */
export interface UserProfile {
  id: number;
  firstName: string;
  firstLastName: string;
  email: string;
  phoneNumber?: string;
  position?: string;
  website?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
}

/**
 * Interface para respuesta de actualización de perfil
 */
export interface UpdateProfileResponse {
  data: UserProfile;
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}
