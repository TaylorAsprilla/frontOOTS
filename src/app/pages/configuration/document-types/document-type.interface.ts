export interface DocumentType {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentTypeResponse {
  data: DocumentType;
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}

export interface DocumentTypeListResponse {
  data: DocumentType[];
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}

export interface CreateDocumentTypeDto {
  name: string;
  isActive?: boolean;
}

export interface UpdateDocumentTypeDto {
  name?: string;
  isActive?: boolean;
}
