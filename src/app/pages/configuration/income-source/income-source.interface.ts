export interface IncomeSource {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIncomeSourceDto {
  name: string;
  isActive: boolean;
}

export interface UpdateIncomeSourceDto {
  name?: string;
  isActive?: boolean;
}

export interface IncomeSourceResponse {
  statusCode: number;
  message: string;
  data: IncomeSource;
}

export interface IncomeSourceListResponse {
  statusCode: number;
  message: string;
  data: IncomeSource[];
}
