export enum CaseDiscussionStatus {
  DRAFT = 'BORRADOR',
  FINALIZED = 'FINALIZADA',
  ANNULLED = 'ANULADA',
}

export interface CaseDiscussionFamilyMember {
  id?: number;
  name: string;
  age: number | null;
  relationship: string;
  occupation: string;
}

export interface CaseDiscussion {
  id: number;
  caseId: number;
  caseNumber: string;
  participantId?: number | null;
  participantName: string;
  socialWorkerName: string;
  supervisorName: string;
  discussionDate: string;
  status: CaseDiscussionStatus;
  clientName: string;
  clientAge: number | null;
  clientSex: string;
  clientMaritalStatus: string;
  familyMembers: CaseDiscussionFamilyMember[];
  presentingSituations: string;
  affectedPeople: string;
  socialWorkerRecommendations: string;
  supervisorRecommendations: string;
  createdAt: string;
  updatedAt: string;
  annulledAt?: string | null;
}

export interface CreateCaseDiscussionRequest {
  participantId?: number | null;
  participantName: string;
  caseNumber: string;
  socialWorkerName: string;
  supervisorName: string;
  discussionDate: string;
  status?: CaseDiscussionStatus;
  clientName: string;
  clientAge: number | null;
  clientSex: string;
  clientMaritalStatus: string;
  familyMembers: CaseDiscussionFamilyMember[];
  presentingSituations: string;
  affectedPeople: string;
  socialWorkerRecommendations: string;
  supervisorRecommendations: string;
}

export interface UpdateCaseDiscussionRequest extends Partial<CreateCaseDiscussionRequest> {
  status?: CaseDiscussionStatus;
}
