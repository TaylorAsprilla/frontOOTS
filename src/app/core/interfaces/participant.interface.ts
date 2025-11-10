/**
 * Participant-related interfaces for type safety and data structure
 */

export interface PersonalData {
  firstName: string;
  secondName?: string;
  firstLastName: string;
  secondLastName?: string;
  phoneNumber: string;
  email: string;
  documentTypeId: string;
  documentNumber: string;
  address: string;
  city: string;
  birthDate: string;
  religiousAffiliation?: string;
  referralSource?: string;
  genderId: string;
  maritalStatusId: string;
  healthInsuranceId: string;
  housingTypeId: string;
}

export interface FamilyMember {
  name: string;
  birthDate?: string;
  occupation?: string;
  relationshipId?: string;
  academicLevelId?: string;
}

export interface FamilyComposition {
  members: FamilyMember[];
}

export interface ConsultationReason {
  reason?: string;
}

export interface IdentifiedSituations {
  situations?: string;
}

export interface Intervention {
  intervention?: string;
}

export interface FollowUpPlan {
  plan?: string;
}

export interface AcademicHistory {
  schooling?: string;
  completedGrade?: string;
  institution?: string;
  profession?: string;
  incomeSource?: string;
  monthlyIncome?: string;
  occupationalHistory?: string;
  housing?: string;
}

export interface PhysicalHealthHistory {
  physicalConditions?: string;
  receivingTreatment?: string;
  treatmentDetails?: string;
  paternalFamilyHistory?: string;
  maternalFamilyHistory?: string;
  physicalHealthObservations?: string;
}

export interface MentalHealthHistory {
  mentalConditions?: string;
  receivingMentalTreatment?: string;
  mentalTreatmentDetails?: string;
  paternalMentalHistory?: string;
  maternalMentalHistory?: string;
  mentalHealthObservations?: string;
}

export interface Assessment {
  consultationReason?: string;
  concurrentFactors?: string;
  criticalFactors?: string;
  problemAnalysis?: string;
}

export interface InterventionPlan {
  description?: string;
}

export interface ProgressNote {
  date: string;
  time?: string;
  approachType: string;
  process?: string;
  summary: string;
  observations?: string;
  agreements?: string;
}

export interface Referrals {
  description?: string;
}

export interface ClosingNote {
  observations?: string;
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
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  registeredById: number;
  status?: ParticipantStatus;
}

export enum ParticipantStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISCHARGED = 'discharged',
  TRANSFERRED = 'transferred',
}

export interface ParticipantFormData {
  personalData: PersonalData;
  familyComposition: {
    name: string;
    birthDate?: string;
    occupation?: string;
    relationshipId?: string;
    academicLevelId?: string;
  };
  consultationReason: {
    reason?: string;
  };
  identifiedSituations: {
    situations?: string;
  };
  intervention: {
    intervention?: string;
  };
  followUpPlan: {
    plan?: string;
  };
  academicHistory: AcademicHistory;
  physicalHealthHistory: PhysicalHealthHistory;
  mentalHealthHistory: MentalHealthHistory;
  assessment: Assessment;
  interventionPlan: InterventionPlan;
  progressNotes: ProgressNote[];
  referrals: Referrals;
  closingNote: ClosingNote;
}

// Validation messages interface
export interface ValidationMessages {
  [key: string]: {
    [key: string]: string;
  };
}

// API Response interfaces
export interface ParticipantResponse {
  success: boolean;
  data: Participant;
  message?: string;
}

export interface ParticipantListResponse {
  data: {
    data: Participant[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}

export interface ParticipantByUserResponse {
  data: {
    userId: number;
    total: number;
    participants: Participant[];
  };
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}
