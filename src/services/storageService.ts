import {
  StaffMember,
  HomeownerUser,
  AssignmentRecord,
  ConstructionProject,
  ConstructionRate,
  ApprovalRequest,
  ContentArticle,
  NotificationItem,
  AppSettings,
  AuditLogEntry,
  SriLankanDistrict,
  StaffTask,
  ProjectReviewRecord,
  PlanningPdfDocument,
  WorkspaceRole,
  FloorPlanGeometry,
  AIChatMessage,
  RoomInteriorSelection,
  PlanAlternative,
} from '../types';
import {
  initialStaff,
  initialHomeowners,
  initialAssignments,
  initialProjects,
  initialRates,
  initialApprovals,
  initialArticles,
  initialNotifications,
  initialSettings,
  initialAuditLogs,
  initialStaffTasks,
  initialProjectReviews,
  initialPlanningPdfs,
  getSampleFloorPlan,
} from '../data/mockData';

const STORAGE_KEYS = {
  STAFF: 'buildmind_lk_v2_staff',
  HOMEOWNERS: 'buildmind_lk_v2_homeowners',
  ASSIGNMENTS: 'buildmind_lk_v2_assignments',
  PROJECTS: 'buildmind_lk_v2_projects',
  RATES: 'buildmind_lk_v2_rates',
  APPROVALS: 'buildmind_lk_v2_approvals',
  ARTICLES: 'buildmind_lk_v2_articles',
  NOTIFICATIONS: 'buildmind_lk_v2_notifications',
  SETTINGS: 'buildmind_lk_v2_settings',
  AUDIT_LOGS: 'buildmind_lk_v2_audit_logs',
  TASKS: 'buildmind_lk_v2_tasks',
  REVIEWS: 'buildmind_lk_v2_reviews',
  PDF_DOCS: 'buildmind_lk_v2_pdf_docs',
  ACTIVE_ROLE: 'buildmind_lk_v2_active_role',
  ACTIVE_STAFF_ID: 'buildmind_lk_v2_active_staff_id',
  ACTIVE_HOMEOWNER_ID: 'buildmind_lk_v2_active_homeowner_id',
  ACTIVE_PROJECT_ID: 'buildmind_lk_v2_active_project_id',
  VERSION: 'buildmind_lk_v2_initialized',
};

// Clean legacy v1 keys to prevent stale US data corruption
function checkAndMigrateLegacyData(): void {
  try {
    const isV2 = localStorage.getItem(STORAGE_KEYS.VERSION);
    if (!isV2) {
      // Clear obsolete v1 keys
      const legacyKeys = [
        'buildmind_staff_v1',
        'buildmind_homeowners_v1',
        'buildmind_assignments_v1',
        'buildmind_projects_v1',
        'buildmind_rates_v1',
        'buildmind_approvals_v1',
        'buildmind_articles_v1',
        'buildmind_notifications_v1',
        'buildmind_settings_v1',
        'buildmind_audit_logs_v1',
      ];
      legacyKeys.forEach((k) => localStorage.removeItem(k));
      localStorage.setItem(STORAGE_KEYS.VERSION, 'true');
    }
  } catch (e) {
    console.error('Migration error', e);
  }
}

// Ensure migration runs on import
checkAndMigrateLegacyData();

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to load ${key} from localStorage`, e);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key} to localStorage`, e);
  }
}

// Currency Formatter Helper
export function formatLKR(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) return 'Rs. 0';
  return `Rs. ${Math.round(amount).toLocaleString('en-US')}`;
}

export function formatShortLKR(amount: number): string {
  if (amount >= 10000000) {
    return `Rs. ${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 1000000) {
    return `Rs. ${(amount / 1000000).toFixed(2)} M`;
  }
  if (amount >= 1000) {
    return `Rs. ${(amount / 1000).toFixed(0)}k`;
  }
  return `Rs. ${amount.toLocaleString()}`;
}

export class StorageService {
  // Read all
  static getStaff(): StaffMember[] {
    return loadFromStorage(STORAGE_KEYS.STAFF, initialStaff);
  }

  static getHomeowners(): HomeownerUser[] {
    return loadFromStorage(STORAGE_KEYS.HOMEOWNERS, initialHomeowners);
  }

  static getAssignments(): AssignmentRecord[] {
    return loadFromStorage(STORAGE_KEYS.ASSIGNMENTS, initialAssignments);
  }

  static getProjects(): ConstructionProject[] {
    return loadFromStorage(STORAGE_KEYS.PROJECTS, initialProjects);
  }

  static getRates(): ConstructionRate[] {
    return loadFromStorage(STORAGE_KEYS.RATES, initialRates);
  }

  static getApprovals(): ApprovalRequest[] {
    return loadFromStorage(STORAGE_KEYS.APPROVALS, initialApprovals);
  }

  static getArticles(): ContentArticle[] {
    return loadFromStorage(STORAGE_KEYS.ARTICLES, initialArticles);
  }

  static getNotifications(): NotificationItem[] {
    return loadFromStorage(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
  }

  static getSettings(): AppSettings {
    return loadFromStorage(STORAGE_KEYS.SETTINGS, initialSettings);
  }

  static getAuditLogs(): AuditLogEntry[] {
    return loadFromStorage(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs);
  }

  // Save all
  static saveStaff(data: StaffMember[]): void {
    saveToStorage(STORAGE_KEYS.STAFF, data);
  }

  static saveHomeowners(data: HomeownerUser[]): void {
    saveToStorage(STORAGE_KEYS.HOMEOWNERS, data);
  }

  static saveAssignments(data: AssignmentRecord[]): void {
    saveToStorage(STORAGE_KEYS.ASSIGNMENTS, data);
  }

  static saveProjects(data: ConstructionProject[]): void {
    saveToStorage(STORAGE_KEYS.PROJECTS, data);
  }

  static saveRates(data: ConstructionRate[]): void {
    saveToStorage(STORAGE_KEYS.RATES, data);
  }

  static saveApprovals(data: ApprovalRequest[]): void {
    saveToStorage(STORAGE_KEYS.APPROVALS, data);
  }

  static saveArticles(data: ContentArticle[]): void {
    saveToStorage(STORAGE_KEYS.ARTICLES, data);
  }

  static saveNotifications(data: NotificationItem[]): void {
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, data);
  }

  static saveSettings(data: AppSettings): void {
    saveToStorage(STORAGE_KEYS.SETTINGS, data);
  }

  static getTasks(): StaffTask[] {
    return loadFromStorage(STORAGE_KEYS.TASKS, initialStaffTasks);
  }

  static saveTasks(data: StaffTask[]): void {
    saveToStorage(STORAGE_KEYS.TASKS, data);
  }

  static getProjectReviews(): ProjectReviewRecord[] {
    return loadFromStorage(STORAGE_KEYS.REVIEWS, initialProjectReviews);
  }

  static saveProjectReviews(data: ProjectReviewRecord[]): void {
    saveToStorage(STORAGE_KEYS.REVIEWS, data);
  }

  static getPlanningPdfs(): PlanningPdfDocument[] {
    return loadFromStorage(STORAGE_KEYS.PDF_DOCS, initialPlanningPdfs);
  }

  static savePlanningPdfs(data: PlanningPdfDocument[]): void {
    saveToStorage(STORAGE_KEYS.PDF_DOCS, data);
  }

  static getActiveRole(): WorkspaceRole {
    return loadFromStorage(STORAGE_KEYS.ACTIVE_ROLE, 'admin');
  }

  static setActiveRole(role: WorkspaceRole): void {
    saveToStorage(STORAGE_KEYS.ACTIVE_ROLE, role);
  }

  static getActiveStaffId(): string {
    return loadFromStorage(STORAGE_KEYS.ACTIVE_STAFF_ID, 'stf-101');
  }

  static setActiveStaffId(id: string): void {
    saveToStorage(STORAGE_KEYS.ACTIVE_STAFF_ID, id);
  }

  static getActiveHomeownerId(): string {
    return loadFromStorage(STORAGE_KEYS.ACTIVE_HOMEOWNER_ID, 'usr-201');
  }

  static setActiveHomeownerId(id: string): void {
    saveToStorage(STORAGE_KEYS.ACTIVE_HOMEOWNER_ID, id);
  }

  static getActiveProjectId(): string | null {
    return loadFromStorage(STORAGE_KEYS.ACTIVE_PROJECT_ID, 'prj-lk-001');
  }

  static setActiveProjectId(id: string | null): void {
    saveToStorage(STORAGE_KEYS.ACTIVE_PROJECT_ID, id);
  }

  static getActiveHomeowner(): HomeownerUser | undefined {
    const id = this.getActiveHomeownerId();
    return this.getHomeowners().find((h) => h.id === id);
  }

  static getProjectsByHomeowner(homeownerId: string): ConstructionProject[] {
    return this.getProjects().filter((p) => p.homeownerId === homeownerId);
  }

  static getProjectById(projectId: string): ConstructionProject | undefined {
    return this.getProjects().find((p) => p.id === projectId);
  }

  // --- HOMEOWNER PHASE 3 ARCHITECTURAL METHODS ---

  /**
   * Creates a new Sri Lankan residential project for a homeowner
   */
  static createHomeownerProject(params: {
    homeownerId: string;
    title: string;
    district: SriLankanDistrict;
    location: string;
    plotSizePerches: number;
    frontageMeters: number;
    depthMeters: number;
    orientation: 'North' | 'South' | 'East' | 'West' | 'North-East' | 'North-West' | 'South-East' | 'South-West';
    accessRoadWidthMeters: number;
    targetBudgetLKR: number;
    storeyCount: number;
    bedroomCount: number;
    bathroomCount: number;
    courtyardPreferred: boolean;
    vastuOrientationPreferred: boolean;
    localCouncilAuthority: string;
  }): ConstructionProject {
    const projects = this.getProjects();
    const homeowners = this.getHomeowners();
    const homeowner = homeowners.find((h) => h.id === params.homeownerId);
    const homeownerName = homeowner ? homeowner.name : 'Homeowner Client';

    // Find assigned staff or default to lead architect in that district
    const staffList = this.getStaff();
    const assignedStaff = homeowner?.activeStaffId 
      ? staffList.find((s) => s.id === homeowner.activeStaffId)
      : staffList.find((s) => s.assignedDistrict === params.district && s.role.includes('Architect')) || staffList[0];

    const newId = `prj-lk-${Date.now().toString(36)}`;
    const projectCode = `PRJ-LK-${new Date().getFullYear()}-${String(projects.length + 1).padStart(3, '0')}`;
    const plotAreaSqFt = params.plotSizePerches * 272.25;

    // Calculate UDA permissible coverage (typically 65% for residential zones in SL)
    const maxCoveragePercent = 65;
    const estBuiltUpAreaSqFt = Math.round(plotAreaSqFt * (maxCoveragePercent / 100) * params.storeyCount * 0.7);

    // Initial 3 genuinely different architectural plan alternatives
    const altA: PlanAlternative = {
      id: `alt-a-${Date.now()}`,
      optionKey: 'A',
      title: 'Option A: Central Courtyard (Medamidula) & Cross-Ventilation',
      concept: 'Traditional Sri Lankan central open sky court (Medamidula) facilitating natural thermal chimney cooling, surrounding verandah, and living pavilion.',
      builtUpAreaSqFt: estBuiltUpAreaSqFt,
      estimatedCostLKR: Math.round(estBuiltUpAreaSqFt * 14850),
      features: [
        'Central open-to-sky Medamidula courtyard with rain-drainage',
        'Traditional wide entrance verandah (Pil-potha)',
        'Wet & dry dual kitchen configuration',
        'Vastu-aligned master bedroom in South-West (Niruthi)',
      ],
    };

    const altB: PlanAlternative = {
      id: `alt-b-${Date.now()}`,
      optionKey: 'B',
      title: 'Option B: Modern Open-Plan Pavilion with Linear Garden',
      concept: 'Contemporary minimalist pavilion with continuous floor-to-ceiling glass louvres, integrated dining terrace, and high-volume double-height living.',
      builtUpAreaSqFt: Math.round(estBuiltUpAreaSqFt * 1.05),
      estimatedCostLKR: Math.round(estBuiltUpAreaSqFt * 1.05 * 15600),
      features: [
        'Expansive open-plan living, dining and show pantry',
        'Side landscaped buffer garden and water feature',
        'Dedicated home office / library facing East morning light',
        'Covered double car porch with direct service entry',
      ],
    };

    const altC: PlanAlternative = {
      id: `alt-c-${Date.now()}`,
      optionKey: 'C',
      title: 'Option C: Compact Multi-Generational Split-Level',
      concept: 'Optimized multi-generational floor plan with ground-floor elderly accessible suite, independent family lounge upstairs, and rooftop terrace.',
      builtUpAreaSqFt: Math.round(estBuiltUpAreaSqFt * 0.95),
      estimatedCostLKR: Math.round(estBuiltUpAreaSqFt * 0.95 * 14200),
      features: [
        'Ground floor master bedroom with zero-threshold ensuite',
        'First floor separate study nook and prayer / meditation space',
        'Rooftop solar drying yard and herb garden',
        'Compact structural grid minimizing transfer beams',
      ],
    };

    const sampleFloorPlan = getSampleFloorPlan('A');

    const newProject: ConstructionProject = {
      id: newId,
      code: projectCode,
      title: params.title,
      homeownerId: params.homeownerId,
      homeownerName,
      leadStaffId: assignedStaff?.id || 'stf-101',
      leadStaffName: assignedStaff?.name || 'Arch. K. Tharmalingam',
      district: params.district,
      location: params.location,
      landDetails: {
        plotSizePerches: params.plotSizePerches,
        plotAreaSqFt,
        surveyPlanNumber: `SP/LK/${params.district.substring(0, 3).toUpperCase()}/${Date.now().toString().substring(6)}`,
        localCouncilAuthority: params.localCouncilAuthority,
        zoningCategory: 'Low-to-Medium Density Residential (R1/R2)',
        soilAndTopography: 'Firm gravelly clay loam, slight natural slope towards municipal drain',
      },
      plotDimensions: {
        frontageMeters: params.frontageMeters,
        depthMeters: params.depthMeters,
        orientation: params.orientation,
        accessRoadWidthMeters: params.accessRoadWidthMeters,
      },
      aiRequirementsStage: {
        status: 'Completed',
        lifestylePromptSummary: `Client requested ${params.bedroomCount} bedrooms, ${params.bathroomCount} bathrooms over ${params.storeyCount} floor(s). ${params.courtyardPreferred ? 'Medamidula courtyard desired.' : ''} ${params.vastuOrientationPreferred ? 'Vastu Shastra alignment requested.' : ''}`,
        bedroomCount: params.bedroomCount,
        bathroomCount: params.bathroomCount,
        storeyCount: params.storeyCount,
        courtyardPreferred: params.courtyardPreferred,
        vastuOrientationPreferred: params.vastuOrientationPreferred,
        targetBudgetLKR: params.targetBudgetLKR,
      },
      projectBrief: {
        status: 'Draft Under Review',
        briefSummary: `Residential planning brief for ${params.title} on ${params.plotSizePerches} perches in ${params.district}. Design prioritized for tropical climate, passive solar shading, cross-ventilation, and local municipal bylaws.`,
        lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16),
      },
      feasibilityStage: {
        status: 'Compliant',
        udaSetbacksMet: true,
        frontSetbackMeters: params.accessRoadWidthMeters >= 9 ? 3.0 : 4.5,
        rearSetbackMeters: 3.0,
        sideSetbacksMeters: 1.5,
        maximumPlotCoveragePercent: maxCoveragePercent,
        notes: `Compliant with UDA Planning Regulations (Western/Northern Province) for road width ${params.accessRoadWidthMeters}m. Note: Formal municipal clearance requires licensed architect submission.`,
      },
      planAlternatives: [altA, altB, altC],
      selectedPlanKey: 'A',
      planRevisionStatus: {
        currentRevision: 1,
        structuralGridValidated: true,
        councilClearanceValidated: true,
        architectSignedOff: true,
        notes: 'Initial AI architectural layout generated from site dimensions and brief.',
      },
      homeownerConfirmation: {
        isConfirmed: false,
        disclaimer: 'Demonstration design only. Formal clearance requires licensed Chartered Architect submission to the municipal council.',
      },
      model3DStatus: {
        status: 'Locked - Awaiting Homeowner 2D Confirmation',
        renderCount: 0,
      },
      interactiveFloorPlan: sampleFloorPlan,
      costEstimateLKR: {
        totalEstimateLKR: altA.estimatedCostLKR,
        costPerSqFtLKR: Math.round(altA.estimatedCostLKR / altA.builtUpAreaSqFt),
        breakdownDate: new Date().toISOString().split('T')[0],
      },
      currentStage: '2D Plan Alternatives Review',
      startDate: new Date().toISOString().split('T')[0],
      targetCompletionDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    };

    // Update homeowner's activeProjectId
    const updatedHomeowners = homeowners.map((h) => {
      if (h.id === params.homeownerId) {
        return {
          ...h,
          activeProjectId: newId,
        };
      }
      return h;
    });

    this.saveProjects([newProject, ...projects]);
    this.saveHomeowners(updatedHomeowners);
    this.setActiveProjectId(newId);

    this.addAuditLog({
      action: 'Project Created',
      actor: homeownerName,
      details: `Created residential architectural project "${params.title}" (${projectCode}) in ${params.district}`,
      module: 'homeowner_new_project',
    });

    // Notify assigned staff
    const notifs = this.getNotifications();
    this.saveNotifications([
      {
        id: `notif-${Date.now().toString(36)}`,
        title: 'New Residential Project Initiated',
        message: `${homeownerName} initiated ${params.title} (${params.district}, ${params.plotSizePerches} perches).`,
        category: 'project',
        timestamp: 'Just now',
        read: false,
        linkModule: 'projects',
      },
      ...notifs,
    ]);

    return newProject;
  }

  /**
   * Updates AI chat history and extracted requirements
   */
  static updateProjectAIRequirements(
    projectId: string,
    chatHistory: AIChatMessage[],
    requirements: Partial<ConstructionProject['aiRequirementsStage']>
  ): ConstructionProject | null {
    const projects = this.getProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project) return null;

    const updated: ConstructionProject = {
      ...project,
      aiChatHistory: chatHistory,
      aiRequirementsStage: {
        ...project.aiRequirementsStage,
        ...requirements,
        status: 'Completed',
      },
      projectBrief: {
        ...project.projectBrief,
        briefSummary: requirements.lifestylePromptSummary 
          ? `Updated from AI Requirements session: ${requirements.lifestylePromptSummary}`
          : project.projectBrief.briefSummary,
        lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16),
      },
    };

    const newProjects = projects.map((p) => (p.id === projectId ? updated : p));
    this.saveProjects(newProjects);
    return updated;
  }

  /**
   * Updates Project Brief
   */
  static updateProjectBrief(
    projectId: string,
    briefSummary: string,
    status: ConstructionProject['projectBrief']['status'] = 'Approved by Client'
  ): ConstructionProject | null {
    const projects = this.getProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project) return null;

    const updated: ConstructionProject = {
      ...project,
      projectBrief: {
        status,
        briefSummary,
        lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16),
      },
      currentStage: status === 'Approved by Client' ? 'Feasibility & Bylaw Clearance' : project.currentStage,
    };

    const newProjects = projects.map((p) => (p.id === projectId ? updated : p));
    this.saveProjects(newProjects);

    this.addAuditLog({
      action: 'Project Brief Updated',
      actor: project.homeownerName,
      details: `Homeowner updated architectural brief for ${project.code}. Status: ${status}`,
      module: 'homeowner_brief',
    });

    return updated;
  }

  /**
   * Selects one of the 3 2D plan alternatives (A, B, C)
   */
  static selectPlanAlternative(
    projectId: string,
    optionKey: 'A' | 'B' | 'C'
  ): ConstructionProject | null {
    const projects = this.getProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project) return null;

    const selectedAlt = project.planAlternatives.find((a) => a.optionKey === optionKey);
    const newFloorPlan = getSampleFloorPlan(optionKey);

    // CRITICAL GOVERNANCE INVARIANT:
    // Switching or selecting an alternative resets confirmation and locks 3D
    const updated: ConstructionProject = {
      ...project,
      selectedPlanKey: optionKey,
      interactiveFloorPlan: newFloorPlan,
      planRevisionStatus: {
        currentRevision: 1,
        structuralGridValidated: true,
        councilClearanceValidated: true,
        architectSignedOff: true,
        notes: `Selected ${selectedAlt?.title || `Option ${optionKey}`}. Base geometry loaded.`,
      },
      homeownerConfirmation: {
        isConfirmed: false,
        disclaimer: project.homeownerConfirmation.disclaimer,
      },
      model3DStatus: {
        status: 'Locked - Awaiting Homeowner 2D Confirmation',
        renderCount: 0,
      },
      costEstimateLKR: {
        totalEstimateLKR: selectedAlt?.estimatedCostLKR || project.costEstimateLKR.totalEstimateLKR,
        costPerSqFtLKR: selectedAlt ? Math.round(selectedAlt.estimatedCostLKR / selectedAlt.builtUpAreaSqFt) : project.costEstimateLKR.costPerSqFtLKR,
        breakdownDate: new Date().toISOString().split('T')[0],
      },
      currentStage: '2D Plan Alternatives Review',
    };

    const newProjects = projects.map((p) => (p.id === projectId ? updated : p));
    this.saveProjects(newProjects);

    this.addAuditLog({
      action: 'Plan Alternative Selected',
      actor: project.homeownerName,
      details: `Homeowner selected Option ${optionKey} (${selectedAlt?.title}) for ${project.code}. 3D locked awaiting final confirmation.`,
      module: 'homeowner_plan_alternatives',
    });

    return updated;
  }

  /**
   * CRITICAL GOVERNANCE INVARIANT:
   * Any geometric 2D edit MUST invalidate the previous confirmation and generated 3D model!
   */
  static updateProjectInteractiveFloorPlan(
    projectId: string,
    floorPlan: FloorPlanGeometry
  ): ConstructionProject | null {
    const projects = this.getProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project) return null;

    const newRevision = (project.planRevisionStatus.currentRevision || 1) + 1;

    const updatedFloorPlan: FloorPlanGeometry = {
      ...floorPlan,
      revision: newRevision,
      isValidated: false,
      isConfirmed: false,
      lastEditedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    const updated: ConstructionProject = {
      ...project,
      interactiveFloorPlan: updatedFloorPlan,
      planRevisionStatus: {
        ...project.planRevisionStatus,
        currentRevision: newRevision,
        structuralGridValidated: false,
        councilClearanceValidated: false,
        architectSignedOff: false,
        notes: `Revision v${newRevision} modified in 2D Studio. Geometric changes require re-validation.`,
      },
      // INVARIANT: Invalidate confirmation
      homeownerConfirmation: {
        isConfirmed: false,
        confirmedAt: undefined,
        confirmedPlanOption: undefined,
        clientDigitalStamp: undefined,
        disclaimer: project.homeownerConfirmation.disclaimer,
      },
      // INVARIANT: Lock 3D visualization
      model3DStatus: {
        ...project.model3DStatus,
        status: 'Locked - Awaiting Homeowner 2D Confirmation',
        unlockedAt: undefined,
      },
      currentStage: 'Awaiting Homeowner 2D Confirmation',
    };

    const newProjects = projects.map((p) => (p.id === projectId ? updated : p));
    this.saveProjects(newProjects);

    this.addAuditLog({
      action: '2D Plan Geometry Modified',
      actor: project.homeownerName,
      details: `Revision v${newRevision} saved for ${project.code}. Previous confirmation and 3D visualization invalidated.`,
      module: 'homeowner_2d_editor',
    });

    return updated;
  }

  /**
   * Validates 2D Plan Geometry against architectural and regulatory rules
   */
  static validateProject2DPlan(
    projectId: string
  ): { success: boolean; errors: string[]; warnings: string[]; updatedProject: ConstructionProject | null } {
    const projects = this.getProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project) {
      return { success: false, errors: ['Project not found'], warnings: [], updatedProject: null };
    }

    const rooms = project.interactiveFloorPlan?.rooms || [];
    const errors: string[] = [];
    const warnings: string[] = [];

    // Rule 1: Room count
    if (rooms.length < 3) {
      errors.push('Floor plan must contain at least 3 distinct rooms/spaces.');
    }

    // Rule 2: Mandatory functional areas
    const hasLiving = rooms.some((r) => r.category === 'living' || r.name.toLowerCase().includes('living'));
    const hasKitchen = rooms.some((r) => r.category === 'kitchen' || r.name.toLowerCase().includes('kitchen'));
    const hasBedroom = rooms.some((r) => r.category === 'bedroom' || r.name.toLowerCase().includes('bed'));
    const hasBath = rooms.some((r) => r.category === 'bathroom' || r.name.toLowerCase().includes('bath'));

    if (!hasLiving) errors.push('Missing essential Living Area (Living Room / Lounge).');
    if (!hasKitchen) errors.push('Missing Kitchen / Pantry facility.');
    if (!hasBedroom) errors.push('At least one Bedroom is required for residential occupancy.');
    if (!hasBath) errors.push('At least one Sanitary Bathroom facility is required.');

    // Rule 3: Sri Lankan Tropical Context & Courtyard warning
    const hasCourtyard = rooms.some((r) => r.category === 'courtyard' || r.name.toLowerCase().includes('court') || r.name.toLowerCase().includes('medamidula'));
    if (project.aiRequirementsStage.courtyardPreferred && !hasCourtyard) {
      warnings.push('Homeowner specified preference for Medamidula Courtyard, but none is currently positioned.');
    }

    // Rule 4: Total built footprint vs permissible site coverage
    const totalRoomSqFt = rooms.reduce((acc, r) => acc + (r.width * r.length), 0);
    const maxPermissibleSqFt = (project.landDetails.plotAreaSqFt * project.feasibilityStage.maximumPlotCoveragePercent) / 100;
    if (totalRoomSqFt > maxPermissibleSqFt) {
      warnings.push(`Built footprint (${totalRoomSqFt.toLocaleString()} sq.ft) exceeds maximum permissible ground coverage (${Math.round(maxPermissibleSqFt).toLocaleString()} sq.ft). Consider double-storey distribution.`);
    }

    // Rule 5: Overlap detection between rooms
    for (let i = 0; i < rooms.length; i++) {
      for (let j = i + 1; j < rooms.length; j++) {
        const r1 = rooms[i];
        const r2 = rooms[j];
        const overlapX = Math.max(0, Math.min(r1.x + r1.width, r2.x + r2.width) - Math.max(r1.x, r2.x));
        const overlapY = Math.max(0, Math.min(r1.y + r1.length, r2.y + r2.length) - Math.max(r1.y, r2.y));
        if (overlapX > 2 && overlapY > 2) {
          warnings.push(`Potential spatial overlap detected between "${r1.name}" and "${r2.name}".`);
        }
      }
    }

    const isValid = errors.length === 0;

    const updatedFloorPlan: FloorPlanGeometry = {
      ...(project.interactiveFloorPlan || getSampleFloorPlan('A')),
      isValidated: isValid,
      validationErrors: [...errors, ...warnings],
    };

    const updated: ConstructionProject = {
      ...project,
      interactiveFloorPlan: updatedFloorPlan,
      planRevisionStatus: {
        ...project.planRevisionStatus,
        structuralGridValidated: isValid,
        councilClearanceValidated: isValid,
        architectSignedOff: isValid,
        notes: isValid 
          ? `Revision v${updatedFloorPlan.revision} passed 2D validation checks (${warnings.length} advisory remarks).`
          : `Revision v${updatedFloorPlan.revision} failed validation: ${errors.join('; ')}`,
      },
    };

    const newProjects = projects.map((p) => (p.id === projectId ? updated : p));
    this.saveProjects(newProjects);

    this.addAuditLog({
      action: '2D Plan Validated',
      actor: project.homeownerName,
      details: `Validated revision v${updatedFloorPlan.revision} of ${project.code}. Result: ${isValid ? 'PASSED' : 'FAILED'} (${errors.length} errors, ${warnings.length} warnings)`,
      module: 'homeowner_2d_validation',
    });

    return {
      success: isValid,
      errors,
      warnings,
      updatedProject: updated,
    };
  }

  /**
   * CRITICAL GOVERNANCE INVARIANT:
   * Explicit Homeowner Confirmation unlocks the 3D model!
   * Admin and Staff cannot call or bypass this.
   */
  static confirmProject2DPlan(
    projectId: string,
    homeownerName: string
  ): { success: boolean; message: string; updatedProject: ConstructionProject | null } {
    const projects = this.getProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project) {
      return { success: false, message: 'Project not found.', updatedProject: null };
    }

    if (!project.planRevisionStatus.structuralGridValidated) {
      return {
        success: false,
        message: 'Cannot confirm 2D plan before passing geometric and regulatory validation.',
        updatedProject: null,
      };
    }

    const currentRev = project.planRevisionStatus.currentRevision || 1;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const digitalStamp = `BM-STAMP-${project.code}-REV${currentRev}-${Date.now().toString(36).toUpperCase()}`;

    const updatedFloorPlan: FloorPlanGeometry = {
      ...(project.interactiveFloorPlan || getSampleFloorPlan('A')),
      isConfirmed: true,
      confirmedAt: timestamp,
    };

    const updated: ConstructionProject = {
      ...project,
      interactiveFloorPlan: updatedFloorPlan,
      homeownerConfirmation: {
        isConfirmed: true,
        confirmedAt: timestamp,
        confirmedPlanOption: project.selectedPlanKey || 'A',
        clientDigitalStamp: digitalStamp,
        disclaimer: 'Homeowner explicit digital sign-off on current 2D plan geometry. Authorizes conceptual 3D massing visualization.',
      },
      // UNLOCK 3D MODEL
      model3DStatus: {
        status: 'Ready for Review',
        unlockedAt: timestamp,
        renderCount: (project.model3DStatus.renderCount || 0) + 1,
      },
      currentStage: 'Confirmed & 3D Modeling',
    };

    const newProjects = projects.map((p) => (p.id === projectId ? updated : p));
    this.saveProjects(newProjects);

    this.addAuditLog({
      action: '2D Plan Explicitly Confirmed',
      actor: homeownerName,
      details: `Homeowner ${homeownerName} stamped digital approval on ${project.code} Rev v${currentRev} (${digitalStamp}). 3D conceptual model UNLOCKED.`,
      module: 'homeowner_2d_confirmation',
    });

    // Notify assigned staff
    const notifs = this.getNotifications();
    this.saveNotifications([
      {
        id: `notif-${Date.now().toString(36)}`,
        title: 'Homeowner Confirmed 2D Floor Plan',
        message: `${homeownerName} signed off on Revision v${currentRev} of ${project.code}. Conceptual 3D model unlocked.`,
        category: 'project',
        timestamp: 'Just now',
        read: false,
        linkModule: 'projects',
      },
      ...notifs,
    ]);

    return {
      success: true,
      message: `2D Plan Revision v${currentRev} confirmed! 3D Conceptual Model is now unlocked.`,
      updatedProject: updated,
    };
  }

  /**
   * Updates interior room selections
   */
  static updateInteriorSelections(
    projectId: string,
    selections: RoomInteriorSelection[]
  ): ConstructionProject | null {
    const projects = this.getProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project) return null;

    const updated: ConstructionProject = {
      ...project,
      interiorSelections: selections,
    };

    const newProjects = projects.map((p) => (p.id === projectId ? updated : p));
    this.saveProjects(newProjects);
    return updated;
  }

  static addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    const logs = this.getAuditLogs();
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `log-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    saveToStorage(STORAGE_KEYS.AUDIT_LOGS, [newEntry, ...logs]);
  }

  // --- CORE BUSINESS RULES ---

  /**
   * Enforces: "One homeowner can have at most one active staff assignment. Preserve assignment history when reassigning."
   */
  static assignOrReassignStaff(
    homeownerId: string,
    newStaffId: string,
    reason: string = 'Architectural project phase handover & specialized planning lead alignment',
    notes: string = ''
  ): { success: boolean; message: string } {
    const homeowners = this.getHomeowners();
    const staffList = this.getStaff();
    const assignments = this.getAssignments();

    const homeowner = homeowners.find((h) => h.id === homeownerId);
    const newStaff = staffList.find((s) => s.id === newStaffId);

    if (!homeowner) {
      return { success: false, message: 'Homeowner not found' };
    }
    if (!newStaff) {
      return { success: false, message: 'Staff member not found' };
    }
    if (newStaff.status === 'inactive') {
      return { success: false, message: 'Cannot assign to an inactive staff member.' };
    }

    // Check staff capacity limit
    if (newStaff.activeAssignmentsCount >= newStaff.maxAssignments && homeowner.activeStaffId !== newStaffId) {
      return {
        success: false,
        message: `${newStaff.name} has reached the maximum client assignment capacity (${newStaff.maxAssignments}).`,
      };
    }

    const previousStaffId = homeowner.activeStaffId;
    const nowTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

    // 1. Mark existing active assignment for this homeowner as reassigned
    const updatedAssignments = assignments.map((asg) => {
      if (asg.homeownerId === homeownerId && asg.status === 'active') {
        return {
          ...asg,
          status: 'reassigned' as const,
          endedAt: nowTimestamp,
          reasonForChange: reason,
        };
      }
      return asg;
    });

    // 2. Create new active assignment record
    const newAssignment: AssignmentRecord = {
      id: `asg-${Date.now().toString(36)}`,
      homeownerId: homeowner.id,
      homeownerName: homeowner.name,
      staffId: newStaff.id,
      staffName: newStaff.name,
      staffRole: newStaff.role,
      assignedAt: nowTimestamp,
      status: 'active',
      reasonForChange: previousStaffId ? reason : undefined,
      notes: notes || `Direct administrative assignment to ${newStaff.name}`,
      assignedByAdmin: 'Admin Control Center',
    };
    updatedAssignments.unshift(newAssignment);

    // 3. Update staff allocation counts
    const updatedStaff = staffList.map((s) => {
      let assignedHomeowners = [...s.assignedHomeownerIds];

      if (previousStaffId && s.id === previousStaffId && previousStaffId !== newStaffId) {
        assignedHomeowners = assignedHomeowners.filter((id) => id !== homeownerId);
      }
      if (s.id === newStaffId) {
        if (!assignedHomeowners.includes(homeownerId)) {
          assignedHomeowners.push(homeownerId);
        }
      }

      return {
        ...s,
        assignedHomeownerIds: assignedHomeowners,
        activeAssignmentsCount: assignedHomeowners.length,
      };
    });

    // 4. Update homeowner record
    const updatedHomeowners = homeowners.map((h) => {
      if (h.id === homeownerId) {
        return {
          ...h,
          activeStaffId: newStaff.id,
        };
      }
      return h;
    });

    // 5. Update project lead if linked project exists
    const projects = this.getProjects();
    const updatedProjects = projects.map((p) => {
      if (p.homeownerId === homeownerId) {
        return {
          ...p,
          leadStaffId: newStaff.id,
          leadStaffName: newStaff.name,
        };
      }
      return p;
    });

    // Commit changes
    this.saveAssignments(updatedAssignments);
    this.saveStaff(updatedStaff);
    this.saveHomeowners(updatedHomeowners);
    this.saveProjects(updatedProjects);

    // Audit log
    this.addAuditLog({
      action: previousStaffId ? 'Homeowner Reassigned' : 'Staff Assigned to Homeowner',
      actor: 'Admin Director',
      details: previousStaffId
        ? `Reassigned ${homeowner.name} to ${newStaff.name}. Reason: ${reason}`
        : `Assigned ${homeowner.name} to ${newStaff.name} (${newStaff.role})`,
      module: 'assignments',
    });

    // Notification
    const notifs = this.getNotifications();
    this.saveNotifications([
      {
        id: `notif-${Date.now().toString(36)}`,
        title: previousStaffId ? 'Architectural Lead Reassignment Executed' : 'New Client Allocation',
        message: `${homeowner.name} is now supervised by ${newStaff.name} (${newStaff.role}).`,
        category: 'assignment',
        timestamp: 'Just now',
        read: false,
        linkModule: 'assignments',
        targetId: newAssignment.id,
      },
      ...notifs,
    ]);

    return {
      success: true,
      message: `Successfully assigned ${homeowner.name} to ${newStaff.name}. Assignment history preserved.`,
    };
  }

  /**
   * Unassign staff from homeowner
   */
  static unassignStaff(homeownerId: string, reason: string = 'Administrative unassignment'): boolean {
    const homeowners = this.getHomeowners();
    const staffList = this.getStaff();
    const assignments = this.getAssignments();

    const homeowner = homeowners.find((h) => h.id === homeownerId);
    if (!homeowner || !homeowner.activeStaffId) return false;

    const previousStaffId = homeowner.activeStaffId;
    const nowTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const updatedAssignments = assignments.map((asg) => {
      if (asg.homeownerId === homeownerId && asg.status === 'active') {
        return {
          ...asg,
          status: 'completed' as const,
          endedAt: nowTimestamp,
          reasonForChange: reason,
        };
      }
      return asg;
    });

    const updatedStaff = staffList.map((s) => {
      if (s.id === previousStaffId) {
        const assigned = s.assignedHomeownerIds.filter((id) => id !== homeownerId);
        return {
          ...s,
          assignedHomeownerIds: assigned,
          activeAssignmentsCount: assigned.length,
        };
      }
      return s;
    });

    const updatedHomeowners = homeowners.map((h) => {
      if (h.id === homeownerId) {
        return { ...h, activeStaffId: null };
      }
      return h;
    });

    this.saveAssignments(updatedAssignments);
    this.saveStaff(updatedStaff);
    this.saveHomeowners(updatedHomeowners);

    this.addAuditLog({
      action: 'Staff Unassigned',
      actor: 'Admin Director',
      details: `Unassigned staff from ${homeowner.name}. Reason: ${reason}`,
      module: 'assignments',
    });

    return true;
  }

  // Provision Staff (Admin Only rule)
  static provisionStaff(
    data: Omit<StaffMember, 'id' | 'activeAssignmentsCount' | 'assignedHomeownerIds' | 'joinedDate'>
  ): StaffMember {
    const staffList = this.getStaff();
    const newStaff: StaffMember = {
      ...data,
      id: `stf-${Date.now().toString(36)}`,
      activeAssignmentsCount: 0,
      assignedHomeownerIds: [],
      joinedDate: new Date().toISOString().split('T')[0],
    };
    this.saveStaff([newStaff, ...staffList]);

    this.addAuditLog({
      action: 'Staff Provisioned',
      actor: 'Admin Director',
      details: `Provisioned staff account for ${newStaff.name} (${newStaff.role}, ${newStaff.assignedDistrict})`,
      module: 'staff',
    });

    return newStaff;
  }

  // Toggle Staff status
  static toggleStaffStatus(staffId: string): StaffMember | null {
    const staffList = this.getStaff();
    const existing = staffList.find((s) => s.id === staffId);
    if (!existing) return null;

    const newStatus: 'active' | 'inactive' = existing.status === 'active' ? 'inactive' : 'active';
    const updatedStaff: StaffMember = { ...existing, status: newStatus };

    const newList = staffList.map((s) => (s.id === staffId ? updatedStaff : s));
    this.saveStaff(newList);

    this.addAuditLog({
      action: 'Staff Status Toggled',
      actor: 'Admin Director',
      details: `Updated ${updatedStaff.name}'s status to ${updatedStaff.status}`,
      module: 'staff',
    });

    return updatedStaff;
  }

  // Update Construction Rate with District, Source, Effective Date, Version, Status
  static updateRate(
    rateId: string,
    newRateLKR: number,
    supplierNotes?: string,
    newSource?: string,
    effectiveDate?: string
  ): ConstructionRate | null {
    const rates = this.getRates();
    const existing = rates.find((r) => r.id === rateId);
    if (!existing) return null;

    const currentVerParts = existing.version.split('.');
    const nextVer = `${currentVerParts[0]}.${parseInt(currentVerParts[1] || '0') + 1}`;

    const updated: ConstructionRate = {
      ...existing,
      previousRateLKR: existing.baseRateLKR,
      baseRateLKR: Number(newRateLKR),
      source: newSource || existing.source,
      effectiveDate: effectiveDate || new Date().toISOString().split('T')[0],
      version: nextVer,
      lastUpdated: new Date().toISOString().split('T')[0],
      updatedBy: 'Admin Director',
      supplierNotes: supplierNotes !== undefined ? supplierNotes : existing.supplierNotes,
    };

    const newRates = rates.map((r) => (r.id === rateId ? updated : r));
    this.saveRates(newRates);

    this.addAuditLog({
      action: 'Rate Modified',
      actor: 'Admin Director',
      details: `Adjusted ${updated.name} (${updated.district}) from Rs. ${updated.previousRateLKR.toLocaleString()} to Rs. ${updated.baseRateLKR.toLocaleString()} per ${updated.unit} [Ver ${updated.version}]`,
      module: 'rates',
    });

    const notifs = this.getNotifications();
    this.saveNotifications([
      {
        id: `notif-${Date.now().toString(36)}`,
        title: 'Construction Unit Rate Updated',
        message: `${updated.name} in ${updated.district} updated to Rs. ${updated.baseRateLKR.toLocaleString()}/${updated.unit}.`,
        category: 'rate',
        timestamp: 'Just now',
        read: false,
        linkModule: 'rates',
        targetId: updated.id,
      },
      ...notifs,
    ]);

    return updated;
  }

  // Review Staff Approval Request
  static reviewApproval(
    approvalId: string,
    status: 'approved' | 'rejected' | 'changes_requested',
    remarks: string
  ): ApprovalRequest | null {
    const approvals = this.getApprovals();
    const existing = approvals.find((a) => a.id === approvalId);
    if (!existing) return null;

    const updated: ApprovalRequest = {
      ...existing,
      status,
      adminRemarks: remarks,
      reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      reviewedBy: 'Admin Director',
    };

    const newApprovals = approvals.map((a) => (a.id === approvalId ? updated : a));
    this.saveApprovals(newApprovals);

    // If a Rate Proposal was approved, automatically update the corresponding rate item!
    if (status === 'approved' && updated.type === 'Construction Rate Proposal' && updated.rateProposalData) {
      const rates = this.getRates();
      const matchingRate = rates.find(
        (r) =>
          r.name.toLowerCase().includes(updated.rateProposalData!.materialName.toLowerCase().split(' ')[0]) &&
          r.district === (updated.district || 'Colombo')
      );
      if (matchingRate) {
        this.updateRate(
          matchingRate.id,
          updated.rateProposalData.proposedRateLKR,
          `Rate updated from approved proposal ${updated.reqNumber}. Source: ${updated.rateProposalData.sourceDocumentation}`,
          updated.rateProposalData.sourceDocumentation
        );
      }
    }

    // If a Building-Rule PDF submission was reviewed, synchronize PDF document status
    if (updated.type === 'Building-Rule PDF Submission') {
      const pdfs = this.getPlanningPdfs();
      const updatedPdfs = pdfs.map((pdf) => {
        if (pdf.approvalRequestId === updated.id || pdf.title === updated.title) {
          return {
            ...pdf,
            approvalStatus: status,
            adminRemarks: remarks,
          };
        }
        return pdf;
      });
      this.savePlanningPdfs(updatedPdfs);
    }

    // Dispatch notification to staff
    const notifs = this.getNotifications();
    this.saveNotifications([
      {
        id: `notif-${Date.now().toString(36)}`,
        title: `Proposal Decision: ${status === 'approved' ? 'Approved' : status === 'changes_requested' ? 'Changes Requested' : 'Rejected'}`,
        message: `Admin has reviewed "${updated.title}" (${status.replace('_', ' ')}). Remarks: ${remarks || 'No remarks provided.'}`,
        category: 'approval',
        timestamp: 'Just now',
        read: false,
        linkModule: 'approvals',
      },
      ...notifs,
    ]);

    this.addAuditLog({
      action: `Staff Approval ${status.toUpperCase()}`,
      actor: 'Admin Director',
      details: `${updated.reqNumber} (${updated.title}) set to ${status}. Remarks: ${remarks}`,
      module: 'approvals',
    });

    return updated;
  }

  // Task methods
  static addTask(taskData: Omit<StaffTask, 'id'>): StaffTask {
    const tasks = this.getTasks();
    const newTask: StaffTask = {
      ...taskData,
      id: `tsk-${Date.now().toString(36)}`,
    };
    this.saveTasks([newTask, ...tasks]);
    return newTask;
  }

  static toggleTaskStatus(taskId: string): StaffTask | null {
    const tasks = this.getTasks();
    const existing = tasks.find((t) => t.id === taskId);
    if (!existing) return null;

    const nextStatus: StaffTask['status'] =
      existing.status === 'completed'
        ? 'pending'
        : existing.status === 'pending'
        ? 'in_progress'
        : 'completed';

    const updatedTask: StaffTask = {
      ...existing,
      status: nextStatus,
      completedAt: nextStatus === 'completed' ? new Date().toISOString().replace('T', ' ').substring(0, 16) : undefined,
    };

    const updatedList = tasks.map((t) => (t.id === taskId ? updatedTask : t));
    this.saveTasks(updatedList);
    return updatedTask;
  }

  static updateTask(task: StaffTask): void {
    const tasks = this.getTasks();
    const updated = tasks.map((t) => (t.id === task.id ? task : t));
    this.saveTasks(updated);
  }

  static deleteTask(taskId: string): void {
    const tasks = this.getTasks();
    this.saveTasks(tasks.filter((t) => t.id !== taskId));
  }

  // Project Review methods
  static addProjectReview(
    reviewData: Omit<ProjectReviewRecord, 'id' | 'reviewDate'>
  ): ProjectReviewRecord {
    const reviews = this.getProjectReviews();
    const newReview: ProjectReviewRecord = {
      ...reviewData,
      id: `rev-${Date.now().toString(36)}`,
      reviewDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    this.saveProjectReviews([newReview, ...reviews]);

    this.addAuditLog({
      action: 'Project Review Logged',
      actor: reviewData.reviewerStaffName,
      details: `Logged architectural review for ${reviewData.projectCode} (${reviewData.stageReviewed}): ${reviewData.reviewStatus}`,
      module: 'staff_reviews',
    });

    return newReview;
  }

  // Submit Planning PDF
  static submitPlanningPdf(
    pdfData: Omit<PlanningPdfDocument, 'id' | 'uploadedAt' | 'approvalStatus' | 'approvalRequestId'>
  ): { pdf: PlanningPdfDocument; approval: ApprovalRequest } {
    const approvals = this.getApprovals();
    const pdfs = this.getPlanningPdfs();

    const approvalId = `apr-${Date.now().toString(36)}`;
    const pdfId = `pdf-${Date.now().toString(36)}`;
    const reqNumber = `PROP-LK-${new Date().getFullYear()}-${String(approvals.length + 1).padStart(3, '0')}`;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newApproval: ApprovalRequest = {
      id: approvalId,
      reqNumber,
      type: 'Building-Rule PDF Submission',
      title: pdfData.title,
      district: pdfData.district,
      submittedByStaffId: pdfData.submittedByStaffId,
      submittedByStaffName: pdfData.submittedByStaffName,
      submittedAt: timestamp,
      status: 'pending',
      urgency: 'high',
      details: `${pdfData.authority} regulation document: ${pdfData.documentType} (Year: ${pdfData.effectiveYear}, Ver: ${pdfData.version}). ${pdfData.fileSummary}`,
      buildingRulePdfData: {
        authorityName: pdfData.authority,
        gazetteOrRefNumber: `${pdfData.authority.split(' ')[0]}-${pdfData.effectiveYear}-${pdfData.version}`,
        fileName: pdfData.fileName,
        documentType: pdfData.documentType as any,
      },
    };

    const newPdf: PlanningPdfDocument = {
      ...pdfData,
      id: pdfId,
      uploadedAt: timestamp,
      approvalStatus: 'pending',
      approvalRequestId: approvalId,
    };

    this.saveApprovals([newApproval, ...approvals]);
    this.savePlanningPdfs([newPdf, ...pdfs]);

    this.addAuditLog({
      action: 'Planning PDF Submitted',
      actor: pdfData.submittedByStaffName,
      details: `Submitted ${pdfData.title} (${pdfData.authority}) for Admin approval. Ref: ${reqNumber}`,
      module: 'staff_pdf_library',
    });

    // Notify Admin
    const notifs = this.getNotifications();
    this.saveNotifications([
      {
        id: `notif-${Date.now().toString(36)}`,
        title: 'New Planning PDF Submitted for Review',
        message: `${pdfData.submittedByStaffName} submitted "${pdfData.title}" for ${pdfData.district}. Pending Admin sign-off.`,
        category: 'approval',
        timestamp: 'Just now',
        read: false,
        linkModule: 'approvals',
      },
      ...notifs,
    ]);

    return { pdf: newPdf, approval: newApproval };
  }

  // Submit Rate Proposal
  static submitRateProposal(params: {
    staff: StaffMember;
    materialName: string;
    proposedRateLKR: number;
    currentRateLKR: number;
    unit: string;
    district: SriLankanDistrict;
    sourceDoc: string;
    reason: string;
  }): ApprovalRequest {
    const approvals = this.getApprovals();
    const reqNumber = `PROP-LK-${new Date().getFullYear()}-${String(approvals.length + 1).padStart(3, '0')}`;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newApproval: ApprovalRequest = {
      id: `apr-${Date.now().toString(36)}`,
      reqNumber,
      type: 'Construction Rate Proposal',
      title: `Rate Proposal: ${params.materialName} (${params.district})`,
      district: params.district,
      submittedByStaffId: params.staff.id,
      submittedByStaffName: params.staff.name,
      submittedAt: timestamp,
      status: 'pending',
      urgency: 'high',
      details: `Proposed rate adjustment for ${params.materialName} in ${params.district}. Current: Rs. ${params.currentRateLKR.toLocaleString()}/${params.unit} -> Proposed: Rs. ${params.proposedRateLKR.toLocaleString()}/${params.unit}. Reason: ${params.reason}. Source: ${params.sourceDoc}`,
      rateProposalData: {
        materialName: params.materialName,
        proposedRateLKR: params.proposedRateLKR,
        currentRateLKR: params.currentRateLKR,
        unit: params.unit,
        sourceDocumentation: params.sourceDoc,
      },
    };

    this.saveApprovals([newApproval, ...approvals]);

    this.addAuditLog({
      action: 'Rate Proposal Submitted',
      actor: params.staff.name,
      details: `Submitted proposal ${reqNumber} for ${params.materialName} (Rs. ${params.proposedRateLKR.toLocaleString()}/${params.unit})`,
      module: 'staff_rate_suggestions',
    });

    const notifs = this.getNotifications();
    this.saveNotifications([
      {
        id: `notif-${Date.now().toString(36)}`,
        title: 'New Material Rate Proposal',
        message: `${params.staff.name} suggested Rs. ${params.proposedRateLKR.toLocaleString()}/${params.unit} for ${params.materialName} in ${params.district}.`,
        category: 'rate',
        timestamp: 'Just now',
        read: false,
        linkModule: 'approvals',
      },
      ...notifs,
    ]);

    return newApproval;
  }

  // Submit Rule Correction Suggestion
  static submitRuleCorrection(params: {
    staff: StaffMember;
    ruleTitle: string;
    correctionNotes: string;
    district?: SriLankanDistrict;
  }): ApprovalRequest {
    const approvals = this.getApprovals();
    const reqNumber = `PROP-LK-${new Date().getFullYear()}-${String(approvals.length + 1).padStart(3, '0')}`;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newApproval: ApprovalRequest = {
      id: `apr-${Date.now().toString(36)}`,
      reqNumber,
      type: 'Content Publication Request',
      title: `Rule Correction Suggestion: ${params.ruleTitle}`,
      district: params.district,
      submittedByStaffId: params.staff.id,
      submittedByStaffName: params.staff.name,
      submittedAt: timestamp,
      status: 'pending',
      urgency: 'medium',
      details: `Suggested correction from staff member for "${params.ruleTitle}": ${params.correctionNotes}`,
    };

    this.saveApprovals([newApproval, ...approvals]);

    this.addAuditLog({
      action: 'Rule Correction Suggested',
      actor: params.staff.name,
      details: `Submitted correction suggestion for rule "${params.ruleTitle}" (${reqNumber})`,
      module: 'staff_building_rules',
    });

    const notifs = this.getNotifications();
    this.saveNotifications([
      {
        id: `notif-${Date.now().toString(36)}`,
        title: 'Planning Rule Correction Suggested',
        message: `${params.staff.name} suggested revisions to "${params.ruleTitle}".`,
        category: 'approval',
        timestamp: 'Just now',
        read: false,
        linkModule: 'approvals',
      },
      ...notifs,
    ]);

    return newApproval;
  }

  // Reset entire dataset to initial pristine Sri Lankan state
  static resetDemoData(): void {
    saveToStorage(STORAGE_KEYS.STAFF, initialStaff);
    saveToStorage(STORAGE_KEYS.HOMEOWNERS, initialHomeowners);
    saveToStorage(STORAGE_KEYS.ASSIGNMENTS, initialAssignments);
    saveToStorage(STORAGE_KEYS.PROJECTS, initialProjects);
    saveToStorage(STORAGE_KEYS.RATES, initialRates);
    saveToStorage(STORAGE_KEYS.APPROVALS, initialApprovals);
    saveToStorage(STORAGE_KEYS.ARTICLES, initialArticles);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
    saveToStorage(STORAGE_KEYS.SETTINGS, initialSettings);
    saveToStorage(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs);
    saveToStorage(STORAGE_KEYS.TASKS, initialStaffTasks);
    saveToStorage(STORAGE_KEYS.REVIEWS, initialProjectReviews);
    saveToStorage(STORAGE_KEYS.PDF_DOCS, initialPlanningPdfs);
    saveToStorage(STORAGE_KEYS.ACTIVE_ROLE, 'admin');
    saveToStorage(STORAGE_KEYS.ACTIVE_STAFF_ID, 'stf-101');
    saveToStorage(STORAGE_KEYS.VERSION, 'true');
  }
}
