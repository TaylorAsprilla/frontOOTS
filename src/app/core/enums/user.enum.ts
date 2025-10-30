/**
 * Enum para estados de usuario
 */
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
}

/**
 * Enum para tipos de documento
 */
export enum DocumentType {
  CC = 'CC', // Cédula de Ciudadanía
  CE = 'CE', // Cédula de Extranjería
  TI = 'TI', // Tarjeta de Identidad
  PA = 'PA', // Pasaporte
  RC = 'RC', // Registro Civil
}
