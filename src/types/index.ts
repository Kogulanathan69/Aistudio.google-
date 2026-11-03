export type ModuleType =
  | 'dashboard'
  | 'staff'
  | 'assignments'
  | 'users'
  | 'projects'
  | 'rates'
  | 'estimator'
  | 'approvals'
  | 'content'
  | 'reports'
  | 'notifications'
  | 'settings';

export type SriLankanDistrict =
  | 'Colombo'
  | 'Jaffna'
  | 'Kandy'
  | 'Gampaha'
  | 'Kurunegala';

export type StaffRole =
  | 'Chartered Architect (AIA SL)'
  | 'Structural Civil Engineer (IESL)'
  | 'Senior Architectural Drafter'
  | 'MEP & Environmental Consultant'
  | 'Building Code & UDA Compliance Officer'
  | 'Quantity Surveyor & Cost Planner';

export type StaffDepartment =
  | 'Architectural Planning'
  | 'Structural & Civil Engineering'
  | 'Municipal Approvals & Feasibility'
  | 'MEP & Environmental Design'
  | 'Cost Planning & Estimation';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  department: StaffDepartment;
  status: 'active' | 'inactive';
  activeAssignmentsCount: number;
  maxAssignments: number;
  experienceYears: number;
  joinedDate: string;
  assignedHomeownerIds: string[];
  assignedDistrict: SriLankanDistrict;
  registrationNumber: string; // e.g. AIA-SL / IESL Reg No
}

export type HomeownerStatus = 'active' | 'suspended' | 'pending_verification';

export interface HomeownerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyAddress: string;
  district: SriLankanDistrict;
  plotSizePerches: number; // 1 Perch = 272.25 sq.ft
  localCouncilAuthority: string; // e.g., Jaffna Municipal Council, Colombo Municipal Council
  status: HomeownerStatus;
  registeredDate: string;
  activeStaffId: string | null; // Strict rule: At most one active staff assignment
  activeProjectId: string | null;
  budgetCapLKR: number;
  notes?: string;
}

export interface AssignmentRecord {
  id: string;
  homeownerId: string;
  homeownerName: string;
  staffId: string;
  staffName: string;
  staffRole: string;
  assignedAt: string;
  endedAt?: string;
  status: 'active' | 'reassigned' | 'completed';
  reasonForChange?: string;
  notes?: string;
  assignedByAdmin: string;
}

export type ProjectPlanningStage =
  | 'Land Assessment & AI Requirements'
  | 'Project Brief Drafted'
  | 'Feasibility & Bylaw Clearance'
  | '2D Plan Alternatives Review'
  | 'Awaiting Homeowner 2D Confirmation'
  | 'Confirmed & 3D Modeling'
  | 'Planning Documentation Ready';

export interface PlanAlternative {
  id: string;
  optionKey: 'A' | 'B' | 'C';
  title: string;
  concept: string; // e.g. Central Courtyard (Medamidula) with cross-ventilation
  builtUpAreaSqFt: number;
  estimatedCostLKR: number;
  features: string[];
}

export interface ConstructionProject {
  id: string;
  code: string;
  title: string;
  homeownerId: string;
  homeownerName: string;
  leadStaffId: string;
  leadStaffName: string;
  district: SriLankanDistrict;
  location: string;
  
  // Architectural Planning Deliverables
  landDetails: {
    plotSizePerches: number;
    plotAreaSqFt: number;
    surveyPlanNumber: string;
    localCouncilAuthority: string; // e.g. Jaffna Municipal Council, Kandy Municipal Council
    zoningCategory: string; // e.g., High-Density Residential (R2), Special Mixed Commercial
    soilAndTopography: string;
  };
  
  aiRequirementsStage: {
    status: 'Completed' | 'In Progress' | 'Pending';
    lifestylePromptSummary: string;
    bedroomCount: number;
    bathroomCount: number;
    storeyCount: number;
    courtyardPreferred: boolean;
    vastuOrientationPreferred: boolean;
    targetBudgetLKR: number;
  };

  projectBrief: {
    status: 'Approved by Client' | 'Draft Under Review' | 'Awaiting Homeowner Input';
    briefSummary: string;
    lastUpdated: string;
  };

  feasibilityStage: {
    status: 'Compliant' | 'Variances Identified' | 'Pending Verification';
    udaSetbacksMet: boolean;
    frontSetbackMeters: number;
    rearSetbackMeters: number;
    sideSetbacksMeters: number;
    maximumPlotCoveragePercent: number;
    notes: string;
  };

  // 3 2D alternatives
  planAlternatives: PlanAlternative[];
  selectedPlanKey: 'A' | 'B' | 'C' | null;

  // 2D revision and validation status
  planRevisionStatus: {
    currentRevision: number;
    structuralGridValidated: boolean;
    councilClearanceValidated: boolean;
    architectSignedOff: boolean;
    notes: string;
  };

  // Critical Governance Invariant:
  // Admin and Staff MUST NOT confirm homeowner 2D plans or unlock 3D generation.
  // This state is strictly initiated by homeowner in their portal.
  homeownerConfirmation: {
    isConfirmed: boolean;
    confirmedAt?: string;
    confirmedPlanOption?: 'A' | 'B' | 'C';
    clientDigitalStamp?: string;
    disclaimer: string;
  };

  model3DStatus: {
    status: 'Locked - Awaiting Homeowner 2D Confirmation' | 'Generating' | 'Ready for Review' | 'Finalized';
    unlockedAt?: string;
    renderCount: number;
  };

  // Interactive 2D Layout & Floor Plan Geometry
  interactiveFloorPlan?: FloorPlanGeometry;
  
  // Interior Studio Selections
  interiorSelections?: RoomInteriorSelection[];

  // AI Requirements Chat Log
  aiChatHistory?: AIChatMessage[];

  // Plot Dimensions
  plotDimensions?: {
    frontageMeters: number;
    depthMeters: number;
    orientation: 'North' | 'South' | 'East' | 'West' | 'North-East' | 'North-West' | 'South-East' | 'South-West';
    accessRoadWidthMeters: number;
  };

  costEstimateLKR: {
    totalEstimateLKR: number;
    costPerSqFtLKR: number;
    breakdownDate: string;
  };

  currentStage: ProjectPlanningStage;
  startDate: string;
  targetCompletionDate: string;
}

export type RateCategory =
  | 'Raw Materials'
  | 'Structural & Steel'
  | 'Finishing & Surfaces'
  | 'Skilled Labor & Trades'
  | 'MEP & Environmental';

export type RateStatus = 'Active' | 'Proposed' | 'Archived';

export interface ConstructionRate {
  id: string;
  category: RateCategory;
  name: string;
  unit: string; // e.g. '50kg bag', 'metric ton', 'sq.ft', 'cube (100 cu.ft)', 'day'
  baseRateLKR: number; // in LKR
  previousRateLKR: number;
  district: SriLankanDistrict;
  source: string; // e.g., 'NCASL Market Index', 'BSR Schedule 2024', 'Regional Hardware Survey'
  effectiveDate: string;
  status: RateStatus;
  version: string;
  lastUpdated: string;
  updatedBy: string;
  supplierNotes?: string;
}

export interface DistrictCostFactor {
  district: SriLankanDistrict;
  label: string;
  multiplier: number;
  materialTransportNote: string;
}

export type ApprovalType =
  | 'Construction Rate Proposal'
  | 'Building-Rule PDF Submission'
  | 'Content Publication Request';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'changes_requested';

export interface ApprovalRequest {
  id: string;
  reqNumber: string;
  type: ApprovalType;
  title: string;
  district?: SriLankanDistrict;
  submittedByStaffId: string;
  submittedByStaffName: string;
  submittedAt: string;
  status: ApprovalStatus;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  details: string;
  
  // Specific payload for Rate Proposals
  rateProposalData?: {
    materialName: string;
    proposedRateLKR: number;
    currentRateLKR: number;
    unit: string;
    sourceDocumentation: string;
  };

  // Specific payload for Building-rule PDF submissions
  buildingRulePdfData?: {
    authorityName: string; // e.g., 'UDA Western Province', 'Jaffna Municipal Council'
    gazetteOrRefNumber: string;
    fileName: string;
    documentType: 'Zoning Bylaw' | 'Setback Schedule' | 'Fire Safety Rule';
  };

  adminRemarks?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export type ContentStatus = 'published' | 'in_review' | 'draft' | 'archived';

export interface ContentArticle {
  id: string;
  title: string;
  category: 'UDA Building Regulations' | 'Architectural Guidelines' | 'Homeowner Planning Guide' | 'Sri Lankan Site Specifications';
  author: string;
  status: ContentStatus;
  lastModified: string;
  version: string;
  targetAudience: 'Homeowners' | 'Staff' | 'All';
  districtRelevance?: SriLankanDistrict | 'National';
  summary: string;
  content: string;
}

export type NotificationCategory =
  | 'assignment'
  | 'approval'
  | 'project'
  | 'rate'
  | 'system';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  timestamp: string;
  read: boolean;
  linkModule?: ModuleType;
  targetId?: string;
}

export interface AppSettings {
  companyName: string;
  adminEmail: string;
  taxRegistrationNumber: string;
  currency: 'LKR';
  currencySymbol: 'Rs.';
  unitSystem: 'perches_and_sqft';
  maxStaffAssignmentLimit: number;
  autoNotifyStaffOnAssign: boolean;
  requireApprovalForRateUpdate: boolean;
  contingencyDefaultPercent: number;
  architecturalFeePercent: number;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  details: string;
  module: ModuleType | StaffModuleType | HomeownerModuleType;
}

export type WorkspaceRole = 'admin' | 'staff' | 'homeowner';

export type StaffModuleType =
  | 'staff_dashboard'
  | 'staff_homeowners'
  | 'staff_projects'
  | 'staff_reviews'
  | 'staff_pdf_library'
  | 'staff_building_rules'
  | 'staff_rate_suggestions'
  | 'staff_approvals'
  | 'staff_tasks'
  | 'staff_notifications'
  | 'staff_profile';

export type HomeownerModuleType =
  | 'homeowner_dashboard'
  | 'homeowner_projects'
  | 'homeowner_new_project'
  | 'homeowner_ai_chat'
  | 'homeowner_brief'
  | 'homeowner_feasibility'
  | 'homeowner_plan_alternatives'
  | 'homeowner_2d_editor'
  | 'homeowner_2d_validation'
  | 'homeowner_2d_confirmation'
  | 'homeowner_3d_viewer'
  | 'homeowner_interior_studio'
  | 'homeowner_cost_estimation'
  | 'homeowner_project_report'
  | 'homeowner_notifications'
  | 'homeowner_profile';

export interface FloorPlanRoom {
  id: string;
  name: string;
  category: 'living' | 'bedroom' | 'bathroom' | 'kitchen' | 'courtyard' | 'dining' | 'verandah' | 'utility';
  x: number; // in feet (grid scale)
  y: number;
  width: number;
  length: number;
  color?: string;
  doors?: Array<{ wall: 'north' | 'south' | 'east' | 'west'; offset: number; width: number }>;
  windows?: Array<{ wall: 'north' | 'south' | 'east' | 'west'; offset: number; width: number }>;
}

export interface FloorPlanGeometry {
  revision: number;
  rooms: FloorPlanRoom[];
  totalAreaSqFt: number;
  lastEditedAt: string;
  isValidated: boolean;
  validationErrors: string[];
  isConfirmed: boolean;
  confirmedAt?: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  options?: string[];
  fieldExtracted?: string;
  extractedValue?: any;
}

export interface RoomInteriorSelection {
  roomId: string;
  roomName: string;
  style: string;
  flooring: string;
  wallFinish: string;
  ceilingFinish: string;
  estimatedCostLKR: number;
}

export interface StaffTask {
  id: string;
  staffId: string;
  projectId?: string;
  projectCode?: string;
  projectTitle?: string;
  homeownerName?: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed';
  category: 'Review' | 'Site Feasibility' | '2D Plan Revision' | 'UDA Clearance' | 'General';
  completedAt?: string;
  notes?: string;
}

export interface ProjectReviewRecord {
  id: string;
  projectId: string;
  projectCode: string;
  projectTitle: string;
  homeownerId: string;
  homeownerName: string;
  reviewerStaffId: string;
  reviewerStaffName: string;
  stageReviewed: ProjectPlanningStage;
  reviewStatus: 'Approved' | 'Corrections Requested' | 'In Progress' | 'Awaiting Client Input';
  comments: string;
  udaComplianceChecked: boolean;
  structuralCheckPassed: boolean;
  gridAlignmentPassed: boolean;
  reviewDate: string;
  actionItems: string[];
}

export interface PlanningPdfDocument {
  id: string;
  title: string;
  fileName: string;
  fileSizeMb: number;
  district: SriLankanDistrict;
  authority: string;
  effectiveYear: number;
  documentType: 'Zoning Bylaw' | 'Setback Schedule' | 'Fire Safety Rule' | 'Environmental Clearance' | 'Subdivision Regulation';
  version: string;
  submittedByStaffId: string;
  submittedByStaffName: string;
  uploadedAt: string;
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'changes_requested';
  approvalRequestId?: string;
  adminRemarks?: string;
  fileSummary: string;
}

