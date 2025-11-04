export interface FamilyRelationship {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFamilyRelationshipDto {
  name: string;
  isActive: boolean;
}

export interface UpdateFamilyRelationshipDto {
  name?: string;
  isActive?: boolean;
}

export interface FamilyRelationshipResponse {
  statusCode: number;
  message: string;
  data: FamilyRelationship;
}

export interface FamilyRelationshipListResponse {
  statusCode: number;
  message: string;
  data: FamilyRelationship[];
}
