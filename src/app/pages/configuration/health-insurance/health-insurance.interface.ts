export interface HealthInsurance {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHealthInsuranceDto {
  name: string;
  isActive: boolean;
}

export interface UpdateHealthInsuranceDto {
  name?: string;
  isActive?: boolean;
}

export interface HealthInsuranceResponse {
  statusCode: number;
  message: string;
  data: HealthInsurance;
}

export interface HealthInsuranceListResponse {
  statusCode: number;
  message: string;
  data: HealthInsurance[];
}
