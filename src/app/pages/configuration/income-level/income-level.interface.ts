export interface IncomeLevel {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIncomeLevelDto {
  name: string;
  isActive: boolean;
}

export interface UpdateIncomeLevelDto {
  name?: string;
  isActive?: boolean;
}

export interface IncomeLevelResponse {
  statusCode: number;
  message: string;
  data: IncomeLevel;
}

export interface IncomeLevelListResponse {
  statusCode: number;
  message: string;
  data: IncomeLevel[];
}
