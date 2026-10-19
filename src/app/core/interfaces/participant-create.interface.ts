// DTOs para crear participante
export interface CreateParticipantDto {
  // Datos Personales
  mitaNumber?: string;
  firstName: string;
  secondName?: string;
  firstLastName: string;
  secondLastName?: string;
  phoneNumber: string;
  email?: string;
  documentTypeId?: number;
  documentNumber?: string;
  address: string;
  city: string;
  state?: string;
  zipCode?: string;
  birthDate: string;
  religiousAffiliation?: string;
  genderId: number;
  maritalStatusId: number;
  healthInsuranceId: number;
  customHealthInsurance?: string;
  referralSource?: string;
  registeredById: number;
  countryId?: number | null;

  // Contactos de emergencia
  emergencyContacts: CreateEmergencyContactDto[];

  // Composición familiar (se agrega al crear un caso, no al crear el participante)
  familyMembers?: CreateFamilyMemberDto[];

  // Historial biopsicosocial (se agrega al crear un caso, no al crear el participante)
  bioPsychosocialHistory?: CreateBioPsychosocialHistoryDto;
}

export interface UpdateParticipantDto
  extends Partial<
    Omit<CreateParticipantDto, 'registeredById' | 'secondName' | 'secondLastName'>
  > {
  secondName?: string | null;
  secondLastName?: string | null;
  status?: string;
}

export interface CreateEmergencyContactDto {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state?: string;
  zipCode?: string;
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
  academicLevelId: number | null;
  completedGrade: string;
  institution: string;
  profession: string;
  incomeLevelId: number | null;
  incomeSourceId: number | null;
  occupationalHistory: string;
  housingTypeId: number | null;
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
  mitaNumber?: string;
  firstName: string;
  secondName?: string;
  firstLastName: string;
  secondLastName?: string;
  phoneNumber: string;
  email: string;
  documentTypeId: number;
  documentType: DocumentType | null;
  documentNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  birthDate: string;
  religiousAffiliation?: string;
  genderId: number;
  gender: Gender | null;
  maritalStatusId: number;
  maritalStatus: MaritalStatus | null;
  healthInsuranceId: number;
  healthInsurance: HealthInsurance | null;
  customHealthInsurance?: string;
  referralSource?: string;
  registeredById: number;
  registeredBy: RegisteredBy;
  countryId?: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  emergencyContacts: ParticipantEmergencyContact[] | null;
  familyMembers: FamilyMember[] | null;
  bioPsychosocialHistory: BioPsychosocialHistory | null;
  cases: any[] | null;
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
  emergencyContact: EmergencyContact | null;
  relationship: FamilyRelationship | null;
}

export interface EmergencyContact {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state?: string;
  zipCode?: string;
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
  age?: number | null;
  birthDate?: string;
  occupation: string;
  participantId: number;
  familyRelationshipId: number;
  academicLevelId: number;
  familyRelationship: FamilyRelationship | null;
  academicLevel: AcademicLevel | null;
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
  academicLevel: AcademicLevel | null;
  incomeSource: IncomeSource | null;
  incomeLevel: IncomeLevel | null;
  housingType: HousingType | null;
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
