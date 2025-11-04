/**
 * Case interfaces for OOTS Colombia application
 * Defines the structure for participant cases
 */

export enum CaseStatus {
  ACTIVE = 'active',
  IN_PROGRESS = 'in_progress',
  CLOSED = 'closed',
  TRANSFERRED = 'transferred',
  SUSPENDED = 'suspended',
}

export enum ApproachType {
  IN_PERSON = 'CP',
  EMAIL = 'E',
  CASUAL_ENCOUNTER = 'EC',
  CALL = 'Ll',
  TELECONSULTATION = 'TC',
  VIRTUAL = 'V',
}

export enum ProcessType {
  FOLLOW_UP = 'S',
  CLOSURE = 'C',
  TRANSFER = 'T',
  REFERRAL = 'D',
}

/**
 * Main Case interface
 */
export interface Case {
  id?: number;
  participantId: number;
  caseNumber?: string;
  status: CaseStatus;
  openingDate: string;
  closingDate?: string;
  assignedProfessionalId?: number;
  consultationReason: ConsultationReason;
  identifiedSituations: IdentifiedSituations;
  intervention: Intervention;
  followUpPlan: FollowUpPlan;
  physicalHealthHistory: PhysicalHealthHistory;
  mentalHealthHistory: MentalHealthHistory;
  assessment: Assessment;
  interventionPlan: InterventionPlan;
  progressNotes: ProgressNote[];
  referrals: Referral[];
  closingNote?: ClosingNote;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Consultation Reason
 */
export interface ConsultationReason {
  reason: string;
  referredBy?: string;
  observations?: string;
}

/**
 * Identified Situations
 */
export interface IdentifiedSituations {
  situations: string[];
  description: string;
  urgencyLevel?: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Intervention
 */
export interface Intervention {
  type: string;
  description: string;
  startDate: string;
  objectives: string[];
  methodology?: string;
}

/**
 * Follow-up Plan
 */
export interface FollowUpPlan {
  scheduleNextAppointment: boolean;
  nextAppointmentDate?: string;
  nextAppointmentTime?: string;
  frequency?: string;
  duration?: string;
  goals: string[];
  observations?: string;
}

/**
 * Physical Health History
 */
export interface PhysicalHealthHistory {
  hasChronicDiseases: boolean;
  chronicDiseases?: string[];
  takingMedications: boolean;
  medications?: Medication[];
  hasAllergies: boolean;
  allergies?: string[];
  hasDisabilities: boolean;
  disabilities?: string[];
  recentSurgeries?: string;
  currentTreatments?: string;
  observations?: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy?: string;
}

/**
 * Mental Health History
 */
export interface MentalHealthHistory {
  hasPreviousTreatment: boolean;
  previousTreatmentDetails?: string;
  hasPsychiatricDiagnosis: boolean;
  psychiatricDiagnoses?: string[];
  takingPsychiatricMedication: boolean;
  psychiatricMedications?: Medication[];
  hasSubstanceUse: boolean;
  substances?: SubstanceUse[];
  hasSuicidalThoughts: boolean;
  suicidalThoughtsDetails?: string;
  hasViolenceHistory: boolean;
  violenceDetails?: string;
  familyMentalHealthHistory?: string;
  observations?: string;
}

export interface SubstanceUse {
  substance: string;
  frequency: string;
  duration: string;
  lastUse?: string;
}

/**
 * Assessment (Ponderación)
 */
export interface Assessment {
  cognitiveFunction: AssessmentItem;
  emotionalState: AssessmentItem;
  socialFunctioning: AssessmentItem;
  familyDynamics: AssessmentItem;
  copingSkills: AssessmentItem;
  riskFactors: RiskFactors;
  protectiveFactors: string[];
  clinicalImpression: string;
  diagnosticHypothesis?: string[];
}

export interface AssessmentItem {
  rating: number; // 1-5 scale
  observations: string;
}

export interface RiskFactors {
  suicideRisk: 'low' | 'medium' | 'high' | 'none';
  violenceRisk: 'low' | 'medium' | 'high' | 'none';
  selfHarmRisk: 'low' | 'medium' | 'high' | 'none';
  otherRisks?: string[];
}

/**
 * Intervention Plan
 */
export interface InterventionPlan {
  objectives: Objective[];
  strategies: Strategy[];
  techniques: string[];
  expectedDuration: string;
  evaluationCriteria: string[];
  contingencyPlan?: string;
}

export interface Objective {
  description: string;
  type: 'short_term' | 'medium_term' | 'long_term';
  indicators: string[];
  targetDate?: string;
}

export interface Strategy {
  name: string;
  description: string;
  frequency: string;
  responsibleParty: string;
}

/**
 * Progress Note
 */
export interface ProgressNote {
  id?: number;
  date: string;
  approachType: ApproachType;
  processType: ProcessType;
  duration: number; // in minutes
  summary: string;
  activities: string[];
  participantResponse: string;
  achievements: string[];
  difficulties?: string[];
  adjustments?: string;
  nextSteps: string[];
  professionalObservations: string;
  createdById?: number;
  createdAt?: string;
}

/**
 * Referral (Referido)
 */
export interface Referral {
  id?: number;
  date: string;
  referredTo: string;
  institution: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  reason: string;
  urgency: 'low' | 'medium' | 'high';
  documentsSent: string[];
  followUpRequired: boolean;
  status: 'pending' | 'completed' | 'cancelled';
  outcome?: string;
  createdAt?: string;
}

/**
 * Closing Note
 */
export interface ClosingNote {
  closureDate: string;
  closureReason: string;
  achievements: string;
  recommendations: string;
  observations?: string;
  followUpSuggestions?: string;
}

/**
 * DTO for creating a new case
 */
export interface CreateCaseDto {
  participantId: number;
  consultationReason: ConsultationReason;
  identifiedSituations: IdentifiedSituations;
  intervention: Intervention;
  followUpPlan: FollowUpPlan;
  physicalHealthHistory: PhysicalHealthHistory;
  mentalHealthHistory: MentalHealthHistory;
  assessment: Assessment;
  interventionPlan: InterventionPlan;
  progressNotes?: ProgressNote[];
  referrals?: Referral[];
}

/**
 * API Responses
 */
export interface CaseResponse {
  success: boolean;
  data: Case;
  message?: string;
}

export interface CaseListResponse {
  success: boolean;
  data: Case[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}
