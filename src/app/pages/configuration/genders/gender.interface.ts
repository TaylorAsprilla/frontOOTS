export interface Gender {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGenderDto {
  name: string;
  isActive?: boolean;
}

export interface UpdateGenderDto {
  name?: string;
  isActive?: boolean;
}

export interface GenderResponse {
  statusCode: number;
  message: string;
  data: Gender;
}

export interface GenderListResponse {
  statusCode: number;
  message: string;
  data: Gender[];
}
