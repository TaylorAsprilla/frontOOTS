/**
 * Interface para la solicitud de login
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Interface para la información del usuario en la respuesta
 */
export interface AuthUser {
  id: number;
  firstName: string;
  firstLastName: string;
  email: string;
}

/**
 * Interface para los datos de autenticación en la respuesta
 */
export interface AuthData {
  access_token: string;
  token_type: string;
  expires_in: number; // Segundos hasta la expiración
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
  tokenType: string;
  expiresAt: Date; // Timestamp de expiración calculado
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
