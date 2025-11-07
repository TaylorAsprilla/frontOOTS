export interface HousingType {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHousingTypeDto {
  name: string;
  isActive: boolean;
}

export interface UpdateHousingTypeDto {
  name?: string;
  isActive?: boolean;
}

export interface HousingTypeResponse {
  statusCode: number;
  message: string;
  data: HousingType;
}

export interface HousingTypeListResponse {
  statusCode: number;
  message: string;
  data: HousingType[];
}
