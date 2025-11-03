export interface AcademicLevel {
  id: number;
  name: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AcademicLevelFormData {
  name: string;
  isActive?: boolean;
}

export interface AcademicLevelResponse {
  data: AcademicLevel;
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}

export interface AcademicLevelListResponse {
  data: AcademicLevel[];
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Nota: El backend no soporta paginación ni búsqueda
// Los filtros se aplican en el frontend
