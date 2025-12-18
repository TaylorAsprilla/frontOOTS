/**
 * Process Type interface
 * Represents types of processes in case management
 */
export interface ProcessType {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO for creating a new process type
 */
export interface CreateProcessTypeDto {
  name: string;
}

/**
 * DTO for updating a process type
 */
export interface UpdateProcessTypeDto {
  name?: string;
  isActive?: boolean;
}
