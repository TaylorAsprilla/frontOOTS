export interface ApproachType {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApproachTypeDto {
  name: string;
  description?: string;
}

export interface UpdateApproachTypeDto {
  name?: string;
  description?: string;
  isActive?: boolean;
}
