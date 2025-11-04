// DTOs para crear participante
export interface CreateParticipantDto {
  // Datos Personales
  firstName: string;
  secondName?: string;
  firstLastName: string;
  secondLastName?: string;
  phoneNumber: string;
  email: string;
  documentTypeId: number;
  documentNumber: string;
  address: string;
  city: string;
  birthDate: string;
  religiousAffiliation?: string;
  genderId: number;
  maritalStatusId: number;
  healthInsuranceId: number;
  customHealthInsurance?: string;
  referralSource?: string;
  registeredById: number;

  // Contactos de emergencia
  emergencyContacts: CreateEmergencyContactDto[];

  // Composición familiar
  familyMembers: CreateFamilyMemberDto[];

  // Historial biopsicosocial
  bioPsychosocialHistory: CreateBioPsychosocialHistoryDto;
}

export interface CreateEmergencyContactDto {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  relationshipId: number;
}

export interface CreateFamilyMemberDto {
  name: string;
  birthDate: string;
  occupation: string;
  familyRelationshipId: number;
  academicLevelId: number;
}

export interface CreateBioPsychosocialHistoryDto {
  academicLevelId: number;
  completedGrade: string;
  institution: string;
  profession: string;
  incomeLevelId: number;
  incomeSourceId: number;
  occupationalHistory: string;
  housingTypeId: number;
  housing: string;
}

// Interfaces para la respuesta de la API
export interface ParticipantResponse {
  data: Participant;
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}

export interface Participant {
  id: number;
  firstName: string;
  secondName?: string;
  firstLastName: string;
  secondLastName?: string;
  phoneNumber: string;
  email: string;
  documentTypeId: number;
  documentType: DocumentType;
  documentNumber: string;
  address: string;
  city: string;
  birthDate: string;
  religiousAffiliation?: string;
  genderId: number;
  gender: Gender;
  maritalStatusId: number;
  maritalStatus: MaritalStatus;
  healthInsuranceId: number;
  healthInsurance: HealthInsurance;
  customHealthInsurance?: string;
  referralSource?: string;
  registeredById: number;
  registeredBy: RegisteredBy;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  emergencyContacts: ParticipantEmergencyContact[];
  familyMembers: FamilyMember[];
  bioPsychosocialHistory: BioPsychosocialHistory;
  cases: any[];
}

export interface DocumentType {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Gender {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MaritalStatus {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HealthInsurance {
  id: number;
  name: string;
  code: string;
  allowsCustom: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisteredBy {
  id: number;
  firstName: string;
  secondName: string;
  firstLastName: string;
  secondLastName: string;
  email: string;
  phoneNumber: string;
  position: string;
  headquarters: string;
  documentNumber: string;
  address: string;
  city: string;
  birthDate: string;
  documentTypeId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ParticipantEmergencyContact {
  id: number;
  participantId: number;
  emergencyContactId: number;
  relationshipId: number;
  createdAt: string;
  updatedAt: string;
  emergencyContact: EmergencyContact;
  relationship: FamilyRelationship;
}

export interface EmergencyContact {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyRelationship {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyMember {
  id: number;
  name: string;
  birthDate: string;
  occupation: string;
  participantId: number;
  familyRelationshipId: number;
  academicLevelId: number;
  familyRelationship: FamilyRelationship;
  academicLevel: AcademicLevel;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicLevel {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BioPsychosocialHistory {
  id: number;
  completedGrade: string;
  institution: string;
  profession: string;
  occupationalHistory: string;
  housing: string;
  participantId: number;
  academicLevelId: number;
  incomeSourceId: number;
  incomeLevelId: number;
  housingTypeId: number;
  academicLevel: AcademicLevel;
  incomeSource: IncomeSource;
  incomeLevel: IncomeLevel;
  housingType: HousingType;
  createdAt: string;
  updatedAt: string;
}

export interface IncomeSource {
  id: number;
  name: string;
  code: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IncomeLevel {
  id: number;
  name: string;
  code: string;
  orderIndex: number;
  minAmount: string;
  maxAmount: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HousingType {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
