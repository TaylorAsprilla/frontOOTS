export interface ApproachType {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApproachTypeResponse {
  data: ApproachType;
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}

export interface ApproachTypeListResponse {
  data: ApproachType[];
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}

export interface CreateApproachTypeDto {
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateApproachTypeDto {
  name?: string;
  description?: string;
  isActive?: boolean;
}
