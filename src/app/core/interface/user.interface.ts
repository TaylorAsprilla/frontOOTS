import { UserModel } from '../models/user.model';

export interface UserInterface {
  firstName: string;
  secondName?: string;
  firstLastName: string;
  secondLastName?: string;
  phoneNumber: string;
  email: string;
  password: string;
  documentNumber: string;
  address: string;
  city: string;
  birthDate: string;
}

/**
 * Interface para la creación de usuarios (incluye password)
 */
export interface CreateUserRequest {
  firstName: string;
  secondName?: string;
  firstLastName: string;
  secondLastName?: string;
  phoneNumber: string;
  email: string;
  password: string;
  documentNumber: string;
  address: string;
  city: string;
  birthDate: string;
}

/**
 * Interface para la actualización de usuarios (campos opcionales)
 */
export interface UpdateUserRequest {
  firstName?: string;
  secondName?: string;
  firstLastName?: string;
  secondLastName?: string;
  phoneNumber?: string;
  email?: string;
  documentNumber?: string;
  address?: string;
  city?: string;
  birthDate?: string;
}

/**
 * Interface para la respuesta de la API
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

/**
 * Interface para la respuesta paginada de usuarios
 */
export interface PaginatedUsersResponse {
  users: UserModel[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Interface para información extendida de usuario (member info)
 */
export interface UserInfoInterface {
  id?: number;
  primerNombre?: string;
  segundoNombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
  email?: string;
  celular?: string;
  foto?: string;
  cargo?: string;
  participants?: number;
  casos?: number;
  proximasCitas?: number;
}
