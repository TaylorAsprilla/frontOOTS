export interface MaritalStatus {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMaritalStatusDto {
  name: string;
  isActive: boolean;
}

export interface UpdateMaritalStatusDto {
  name?: string;
  isActive?: boolean;
}

export interface MaritalStatusResponse {
  statusCode: number;
  message: string;
  data: MaritalStatus;
}

export interface MaritalStatusListResponse {
  statusCode: number;
  message: string;
  data: MaritalStatus[];
}
