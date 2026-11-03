/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ModuleType,
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
  HomeownerStatus,
  ContentStatus,
  NotificationCategory,
  WorkspaceRole,
  StaffModuleType,
  HomeownerModuleType,
  StaffTask,
  ProjectReviewRecord,
  PlanningPdfDocument,
  SriLankanDistrict,
} from './types';
import { StorageService } from './services/storageService';

// Admin Layout Components
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

// Admin Modules
import { DashboardModule } from './components/modules/DashboardModule';
import { StaffManagementModule } from './components/modules/StaffManagementModule';
import { StaffAssignmentModule } from './components/modules/StaffAssignmentModule';
import { UserManagementModule } from './components/modules/UserManagementModule';
import { ProjectManagementModule } from './components/modules/ProjectManagementModule';
import { ConstructionRatesModule } from './components/modules/ConstructionRatesModule';
import { CostEstimatorModule } from './components/modules/CostEstimatorModule';
import { StaffApprovalsModule } from './components/modules/StaffApprovalsModule';
import { ContentApprovalsModule } from './components/modules/ContentApprovalsModule';
import { ReportsAnalyticsModule } from './components/modules/ReportsAnalyticsModule';
import { NotificationsModule } from './components/modules/NotificationsModule';
import { SettingsModule } from './components/modules/SettingsModule';

// Staff Layout & Modules
import { StaffSidebar } from './components/staff/StaffSidebar';
import { StaffHeader } from './components/staff/StaffHeader';
import { StaffDashboardModule } from './components/staff/modules/StaffDashboardModule';
import { StaffHomeownersModule } from './components/staff/modules/StaffHomeownersModule';
import { StaffProjectsModule } from './components/staff/modules/StaffProjectsModule';
import { StaffProjectReviewModule } from './components/staff/modules/StaffProjectReviewModule';
import { StaffPdfLibraryModule } from './components/staff/modules/StaffPdfLibraryModule';
import { StaffBuildingRulesModule } from './components/staff/modules/StaffBuildingRulesModule';
import { StaffRateSuggestionsModule } from './components/staff/modules/StaffRateSuggestionsModule';
import { StaffApprovalStatusModule } from './components/staff/modules/StaffApprovalStatusModule';
import { StaffTasksModule } from './components/staff/modules/StaffTasksModule';
import { StaffNotificationsModule } from './components/staff/modules/StaffNotificationsModule';
import { StaffProfileModule } from './components/staff/modules/StaffProfileModule';

// Homeowner Layout & Modules
import { HomeownerSidebar } from './components/homeowner/HomeownerSidebar';
import { HomeownerHeader } from './components/homeowner/HomeownerHeader';
import { HomeownerDashboardModule } from './components/homeowner/modules/HomeownerDashboardModule';
import { HomeownerProjectsModule } from './components/homeowner/modules/HomeownerProjectsModule';
import { HomeownerNewProjectWizard } from './components/homeowner/modules/HomeownerNewProjectWizard';
import { HomeownerAIChatModule } from './components/homeowner/modules/HomeownerAIChatModule';
import { HomeownerBriefModule } from './components/homeowner/modules/HomeownerBriefModule';
import { HomeownerFeasibilityModule } from './components/homeowner/modules/HomeownerFeasibilityModule';
import { HomeownerPlanAlternativesModule } from './components/homeowner/modules/HomeownerPlanAlternativesModule';
import { Homeowner2DEditorModule } from './components/homeowner/modules/Homeowner2DEditorModule';
import { Homeowner2DValidationModule } from './components/homeowner/modules/Homeowner2DValidationModule';
import { HomeownerConfirmationModule } from './components/homeowner/modules/HomeownerConfirmationModule';
import { Homeowner3DViewerModule } from './components/homeowner/modules/Homeowner3DViewerModule';
import { HomeownerInteriorStudioModule } from './components/homeowner/modules/HomeownerInteriorStudioModule';
import { HomeownerCostEstimatorModule } from './components/homeowner/modules/HomeownerCostEstimatorModule';
import { HomeownerReportModule } from './components/homeowner/modules/HomeownerReportModule';
import { HomeownerProfileModule } from './components/homeowner/modules/HomeownerProfileModule';
import { HomeownerNotificationsModule } from './components/homeowner/modules/HomeownerNotificationsModule';

import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function App() {
  // Workspace Role: 'admin' or 'staff'
  const [workspaceRole, setWorkspaceRole] = useState<WorkspaceRole>('admin');
  const [currentStaffId, setCurrentStaffId] = useState<string>('stf-101');

  // Navigation State
  const [currentAdminModule, setCurrentAdminModule] = useState<ModuleType>('dashboard');
  const [currentStaffModule, setCurrentStaffModule] = useState<StaffModuleType>('staff_dashboard');
  const [mobileAdminSidebarOpen, setMobileAdminSidebarOpen] = useState(false);
  const [mobileStaffSidebarOpen, setMobileStaffSidebarOpen] = useState(false);

  // Core state loaded from LocalStorage
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [homeowners, setHomeowners] = useState<HomeownerUser[]>([]);
  const [assignments, setAssignments] = useState<AssignmentRecord[]>([]);
  const [projects, setProjects] = useState<ConstructionProject[]>([]);
  const [rates, setRates] = useState<ConstructionRate[]>([]);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [articles, setArticles] = useState<ContentArticle[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  // Staff Phase 2 State
  const [tasks, setTasks] = useState<StaffTask[]>([]);
  const [reviews, setReviews] = useState<ProjectReviewRecord[]>([]);
  const [planningPdfs, setPlanningPdfs] = useState<PlanningPdfDocument[]>([]);
  const [preSelectedProjectIdForReview, setPreSelectedProjectIdForReview] = useState<string | undefined>(undefined);

  // Homeowner Phase 3 State
  const [currentHomeownerId, setCurrentHomeownerId] = useState<string>('usr-201');
  const [currentHomeownerModule, setCurrentHomeownerModule] = useState<HomeownerModuleType>('homeowner_dashboard');
  const [currentProjectId, setCurrentProjectId] = useState<string | null>('prj-lk-001');
  const [mobileHomeownerSidebarOpen, setMobileHomeownerSidebarOpen] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Pre-selected staff id when jumping to assignments from staff module
  const [preSelectedStaffId, setPreSelectedStaffId] = useState<string | undefined>(undefined);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Load state on mount
  const refreshAllState = () => {
    setStaff(StorageService.getStaff());
    setHomeowners(StorageService.getHomeowners());
    setAssignments(StorageService.getAssignments());
    setProjects(StorageService.getProjects());
    setRates(StorageService.getRates());
    setApprovals(StorageService.getApprovals());
    setArticles(StorageService.getArticles());
    setNotifications(StorageService.getNotifications());
    setSettings(StorageService.getSettings());
    setAuditLogs(StorageService.getAuditLogs());
    setTasks(StorageService.getTasks());
    setReviews(StorageService.getProjectReviews());
    setPlanningPdfs(StorageService.getPlanningPdfs());
    setWorkspaceRole(StorageService.getActiveRole());
    setCurrentStaffId(StorageService.getActiveStaffId());
    setCurrentHomeownerId(StorageService.getActiveHomeownerId());
    setCurrentProjectId(StorageService.getActiveProjectId());
  };

  useEffect(() => {
    refreshAllState();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  };

  // Switch Workspace Role (Admin ↔ Staff ↔ Homeowner)
  const handleSwitchWorkspaceRole = (role: WorkspaceRole, targetStaffId?: string, targetHomeownerId?: string) => {
    StorageService.setActiveRole(role);
    if (targetStaffId) {
      StorageService.setActiveStaffId(targetStaffId);
      setCurrentStaffId(targetStaffId);
    }
    if (targetHomeownerId) {
      StorageService.setActiveHomeownerId(targetHomeownerId);
      setCurrentHomeownerId(targetHomeownerId);
    }
    setWorkspaceRole(role);
    showToast(
      `Switched to ${role === 'admin' ? 'Admin Control Center' : role === 'staff' ? 'Staff Workspace' : 'Homeowner Client Portal'}.`,
      'info'
    );
  };

  // Switch Active Staff Member in Staff Workspace
  const handleSwitchActiveStaff = (staffId: string) => {
    StorageService.setActiveStaffId(staffId);
    setCurrentStaffId(staffId);
    const member = staff.find((s) => s.id === staffId);
    if (member) {
      showToast(`Active Staff: ${member.name} (${member.assignedDistrict})`, 'info');
    }
  };

  // Active Staff Member Entity
  const currentStaff = staff.find((s) => s.id === currentStaffId) || staff[0];

  // Assigned Homeowners strictly for this Staff member
  const assignedHomeownersForStaff = homeowners.filter(
    (h) => h.activeStaffId === currentStaff?.id
  );

  // Assigned Projects strictly for this Staff member
  const assignedProjectsForStaff = projects.filter(
    (p) => p.leadStaffId === currentStaff?.id
  );

  // Filtered Tasks for this Staff member
  const myTasks = tasks.filter((t) => t.staffId === currentStaff?.id);

  // Filtered Approvals submitted by this Staff member
  const myApprovals = approvals.filter((a) => a.submittedByStaffId === currentStaff?.id);

  // Filtered Planning PDFs for this Staff member
  const myPdfs = planningPdfs.filter(
    (p) => p.submittedByStaffId === currentStaff?.id || p.approvalStatus === 'approved'
  );

  // Reviews associated with this staff or assigned projects
  const myReviews = reviews.filter(
    (r) =>
      r.reviewerStaffId === currentStaff?.id ||
      assignedProjectsForStaff.some((p) => p.id === r.projectId)
  );

  // Active Homeowner Entity (Phase 3)
  const currentHomeowner = homeowners.find((h) => h.id === currentHomeownerId) || homeowners[0];
  const homeownerProjects = projects.filter((p) => p.homeownerId === currentHomeowner?.id);
  const currentProject = projects.find((p) => p.id === currentProjectId) || homeownerProjects[0] || null;
  const assignedStaffForHomeowner = staff.find((s) => s.id === currentHomeowner?.activeStaffId) || null;

  const handleSwitchActiveHomeowner = (homeownerId: string) => {
    StorageService.setActiveHomeownerId(homeownerId);
    setCurrentHomeownerId(homeownerId);
    const h = homeowners.find((item) => item.id === homeownerId);
    if (h) {
      const hProjects = projects.filter((p) => p.homeownerId === homeownerId);
      const projId = h.activeProjectId || (hProjects[0] ? hProjects[0].id : null);
      if (projId) {
        StorageService.setActiveProjectId(projId);
        setCurrentProjectId(projId);
      }
      showToast(`Active Homeowner: ${h.name} (${h.district})`, 'info');
    }
  };

  const handleSelectHomeownerProject = (projectId: string) => {
    StorageService.setActiveProjectId(projectId);
    setCurrentProjectId(projectId);
    const p = projects.find((item) => item.id === projectId);
    if (p) {
      showToast(`Selected Project: ${p.title} (${p.code})`, 'info');
    }
  };

  const handleProjectCreated = (projectId: string) => {
    refreshAllState();
    setCurrentProjectId(projectId);
    StorageService.setActiveProjectId(projectId);
    setCurrentHomeownerModule('homeowner_ai_chat');
    showToast('New residential project initialized successfully!', 'success');
  };

  const handleProjectUpdated = (updatedProject: ConstructionProject) => {
    setProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
  };

  const handleHomeownerUpdated = (updatedHomeowner: HomeownerUser) => {
    setHomeowners((prev) => prev.map((h) => (h.id === updatedHomeowner.id ? updatedHomeowner : h)));
    showToast('Profile updated successfully', 'success');
  };

  // --- Handlers: Staff Operations (Phase 2) ---

  const handleAddTask = (taskData: Omit<StaffTask, 'id'>) => {
    StorageService.addTask(taskData);
    refreshAllState();
    showToast(`Task "${taskData.title}" created.`, 'success');
  };

  const handleToggleTask = (taskId: string) => {
    const updated = StorageService.toggleTaskStatus(taskId);
    refreshAllState();
    if (updated) {
      showToast(
        `Task marked as ${updated.status}.`,
        updated.status === 'completed' ? 'success' : 'info'
      );
    }
  };

  const handleUpdateTask = (task: StaffTask) => {
    StorageService.updateTask(task);
    refreshAllState();
    showToast('Task updated successfully.');
  };

  const handleDeleteTask = (taskId: string) => {
    StorageService.deleteTask(taskId);
    refreshAllState();
    showToast('Task removed.');
  };

  const handleAddProjectReview = (
    reviewData: Omit<ProjectReviewRecord, 'id' | 'reviewDate'>
  ) => {
    StorageService.addProjectReview(reviewData);
    refreshAllState();
    showToast(
      `Review recorded for ${reviewData.projectCode} (${reviewData.reviewStatus}).`,
      'success'
    );
  };

  const handleSubmitPlanningPdf = (
    pdfData: Omit<PlanningPdfDocument, 'id' | 'uploadedAt' | 'approvalStatus' | 'approvalRequestId'>
  ) => {
    const result = StorageService.submitPlanningPdf(pdfData);
    refreshAllState();
    showToast(
      `Submitted "${pdfData.title}" for Admin approval (Ref: ${result.approval.reqNumber}).`,
      'success'
    );
  };

  const handleSubmitRateProposal = (params: {
    materialName: string;
    proposedRateLKR: number;
    currentRateLKR: number;
    unit: string;
    district: SriLankanDistrict;
    sourceDoc: string;
    reason: string;
  }) => {
    if (!currentStaff) return;
    const approval = StorageService.submitRateProposal({
      staff: currentStaff,
      ...params,
    });
    refreshAllState();
    showToast(
      `Rate proposal submitted for Admin review (Ref: ${approval.reqNumber}).`,
      'success'
    );
  };

  const handleSubmitRuleCorrection = (
    ruleTitle: string,
    correctionNotes: string,
    district?: SriLankanDistrict
  ) => {
    if (!currentStaff) return;
    const approval = StorageService.submitRuleCorrection({
      staff: currentStaff,
      ruleTitle,
      correctionNotes,
      district,
    });
    refreshAllState();
    showToast(
      `Correction proposal submitted for Admin review (Ref: ${approval.reqNumber}).`,
      'success'
    );
  };

  const handleUpdateStaffProfile = (updatedStaffMember: StaffMember) => {
    const currentStaffList = StorageService.getStaff();
    const updatedList = currentStaffList.map((s) =>
      s.id === updatedStaffMember.id ? updatedStaffMember : s
    );
    StorageService.saveStaff(updatedList);
    refreshAllState();
    showToast('Staff credentials and contact settings updated.');
  };

  const handleUpdateProjectNotes = (projectId: string, notes: string) => {
    const currentProjects = StorageService.getProjects();
    const updated = currentProjects.map((p) =>
      p.id === projectId
        ? {
            ...p,
            planRevisionStatus: {
              ...p.planRevisionStatus,
              notes,
            },
          }
        : p
    );
    StorageService.saveProjects(updated);
    refreshAllState();
    showToast('Project architectural observations saved.');
  };

  const handleStaffQuickAction = (
    action: 'rate_proposal' | 'pdf_upload' | 'log_review' | 'add_task'
  ) => {
    switch (action) {
      case 'rate_proposal':
        setCurrentStaffModule('staff_rate_suggestions');
        break;
      case 'pdf_upload':
        setCurrentStaffModule('staff_pdf_library');
        break;
      case 'log_review':
        setCurrentStaffModule('staff_reviews');
        break;
      case 'add_task':
        setCurrentStaffModule('staff_tasks');
        break;
    }
  };

  // --- Handlers: Admin Operations (Phase 1 Preserved) ---

  const handleProvisionStaff = (
    data: Omit<StaffMember, 'id' | 'activeAssignmentsCount' | 'assignedHomeownerIds' | 'joinedDate'>
  ) => {
    const newStaff = StorageService.provisionStaff(data);
    refreshAllState();
    showToast(`Staff member ${newStaff.name} provisioned successfully!`);
  };

  const handleToggleStaffStatus = (staffId: string) => {
    const updated = StorageService.toggleStaffStatus(staffId);
    refreshAllState();
    if (updated) {
      showToast(
        `${updated.name} is now ${updated.status}.`,
        updated.status === 'active' ? 'success' : 'info'
      );
    }
  };

  const handleAssignOrReassign = (
    homeownerId: string,
    staffId: string,
    reason: string,
    notes: string
  ) => {
    const res = StorageService.assignOrReassignStaff(homeownerId, staffId, reason, notes);
    refreshAllState();
    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
    return res;
  };

  const handleUnassign = (homeownerId: string, reason: string) => {
    const success = StorageService.unassignStaff(homeownerId, reason);
    refreshAllState();
    if (success) {
      showToast('Staff unassigned. Homeowner is now unassigned.', 'info');
    }
    return success;
  };

  const handleAddHomeowner = (
    data: Omit<HomeownerUser, 'id' | 'registeredDate' | 'activeStaffId' | 'activeProjectId'>
  ) => {
    const homeownersList = StorageService.getHomeowners();
    const newHomeowner: HomeownerUser = {
      ...data,
      id: `usr-${Date.now().toString(36)}`,
      registeredDate: new Date().toISOString().split('T')[0],
      activeStaffId: null,
      activeProjectId: null,
    };
    StorageService.saveHomeowners([newHomeowner, ...homeownersList]);
    StorageService.addAuditLog({
      action: 'Homeowner Registered',
      actor: 'Public Portal (Simulated)',
      details: `Client ${newHomeowner.name} registered for ${newHomeowner.propertyAddress}`,
      module: 'users',
    });
    refreshAllState();
    showToast(`Homeowner ${newHomeowner.name} registered! Awaiting staff assignment.`, 'success');
  };

  const handleUpdateHomeownerStatus = (homeownerId: string, status: HomeownerStatus) => {
    const homeownersList = StorageService.getHomeowners();
    const updated = homeownersList.map((h) => (h.id === homeownerId ? { ...h, status } : h));
    StorageService.saveHomeowners(updated);
    refreshAllState();
    showToast(`Homeowner verification status updated to ${status}.`);
  };

  const handleAddProject = (projectData: Omit<ConstructionProject, 'id' | 'code'>) => {
    const projectsList = StorageService.getProjects();
    const newProject: ConstructionProject = {
      ...projectData,
      id: `prj-${Date.now().toString(36)}`,
      code: `BM-LK-24-${String(projectsList.length + 1).padStart(2, '0')}`,
    };
    StorageService.saveProjects([newProject, ...projectsList]);

    const homeownersList = StorageService.getHomeowners();
    const updatedHomeowners = homeownersList.map((h) =>
      h.id === newProject.homeownerId ? { ...h, activeProjectId: newProject.id } : h
    );
    StorageService.saveHomeowners(updatedHomeowners);

    StorageService.addAuditLog({
      action: 'Project Initialized',
      actor: 'Admin Director',
      details: `Created architectural planning pipeline for ${newProject.title} (${newProject.code})`,
      module: 'projects',
    });

    refreshAllState();
    showToast(`Project ${newProject.title} created with code ${newProject.code}!`);
  };

  const handleUpdateProject = (updated: ConstructionProject) => {
    const projectsList = StorageService.getProjects();
    const updatedList = projectsList.map((p) => (p.id === updated.id ? updated : p));
    StorageService.saveProjects(updatedList);
    refreshAllState();
    showToast(`Project ${updated.title} updated successfully.`);
  };

  const handleUpdateRate = (
    rateId: string,
    newRateLKR: number,
    supplierNotes?: string,
    newSource?: string,
    effectiveDate?: string
  ) => {
    const updated = StorageService.updateRate(rateId, newRateLKR, supplierNotes, newSource, effectiveDate);
    refreshAllState();
    if (updated) {
      showToast(`${updated.name} rate updated to Rs. ${updated.baseRateLKR.toLocaleString()}/${updated.unit}!`);
    }
  };

  const handleAddRate = (
    rateData: Omit<ConstructionRate, 'id' | 'previousRateLKR' | 'lastUpdated' | 'updatedBy' | 'version'>
  ) => {
    const currentRates = StorageService.getRates();
    const newRate: ConstructionRate = {
      ...rateData,
      id: `rat-${Date.now().toString(36)}`,
      previousRateLKR: rateData.baseRateLKR,
      version: 'v1.0',
      lastUpdated: new Date().toISOString().split('T')[0],
      updatedBy: 'Admin Director',
    };
    StorageService.saveRates([newRate, ...currentRates]);
    StorageService.addAuditLog({
      action: 'New Rate Added',
      actor: 'Admin Director',
      details: `Added ${newRate.name} (Rs. ${newRate.baseRateLKR.toLocaleString()}/${newRate.unit}) - ${newRate.district}`,
      module: 'rates',
    });
    refreshAllState();
    showToast(`Added ${newRate.name} to Sri Lankan rate schedule.`);
  };

  const handleApplyEstimateToProject = (projectId: string, budgetLKR: number) => {
    const projectsList = StorageService.getProjects();
    const updated = projectsList.map((p) => {
      if (p.id !== projectId) return p;
      const selectedPlan = p.planAlternatives.find((a) => a.optionKey === p.selectedPlanKey);
      const area = selectedPlan?.builtUpAreaSqFt || (p.landDetails.plotSizePerches * 200);
      const costPerSqFt = Math.round(budgetLKR / (area || 2500));
      return {
        ...p,
        costEstimateLKR: {
          totalEstimateLKR: budgetLKR,
          costPerSqFtLKR: costPerSqFt,
          breakdownDate: new Date().toISOString().split('T')[0],
        },
      };
    });
    StorageService.saveProjects(updated);
    StorageService.addAuditLog({
      action: 'Estimate Applied to Project',
      actor: 'Admin Director',
      details: `Updated project cost estimate to Rs. ${budgetLKR.toLocaleString()} based on Sri Lankan Parametric Estimator`,
      module: 'estimator',
    });
    refreshAllState();
    showToast('Applied estimated budget to project!', 'success');
  };

  const handleReviewApproval = (
    approvalId: string,
    status: 'approved' | 'rejected' | 'changes_requested',
    remarks: string
  ) => {
    const updated = StorageService.reviewApproval(approvalId, status, remarks);
    refreshAllState();
    if (updated) {
      showToast(`Request ${updated.reqNumber} set to ${status}.`, 'info');
    }
  };

  const handleAddArticle = (articleData: Omit<ContentArticle, 'id' | 'lastModified'>) => {
    const currentArticles = StorageService.getArticles();
    const newArticle: ContentArticle = {
      ...articleData,
      id: `cnt-${Date.now().toString(36)}`,
      lastModified: new Date().toISOString().split('T')[0],
    };
    StorageService.saveArticles([newArticle, ...currentArticles]);
    StorageService.addAuditLog({
      action: 'Content Article Created',
      actor: 'Admin Director',
      details: `Created ${newArticle.title} (${newArticle.category})`,
      module: 'content',
    });
    refreshAllState();
    showToast(`Draft ${newArticle.title} saved.`);
  };

  const handleUpdateArticleStatus = (articleId: string, status: ContentStatus) => {
    const currentArticles = StorageService.getArticles();
    const updated = currentArticles.map((a) => (a.id === articleId ? { ...a, status } : a));
    StorageService.saveArticles(updated);
    refreshAllState();
    showToast(`Article status updated to ${status}.`);
  };

  const handleMarkNotificationRead = (id: string) => {
    const currentNotifs = StorageService.getNotifications();
    const updated = currentNotifs.map((n) => (n.id === id ? { ...n, read: true } : n));
    StorageService.saveNotifications(updated);
    refreshAllState();
  };

  const handleMarkAllNotificationsRead = () => {
    const currentNotifs = StorageService.getNotifications();
    const updated = currentNotifs.map((n) => ({ ...n, read: true }));
    StorageService.saveNotifications(updated);
    refreshAllState();
    showToast('All notifications marked as read.');
  };

  const handleDeleteNotification = (id: string) => {
    const currentNotifs = StorageService.getNotifications();
    const updated = currentNotifs.filter((n) => n.id !== id);
    StorageService.saveNotifications(updated);
    refreshAllState();
  };

  const handleDispatchBroadcast = (
    title: string,
    message: string,
    category: NotificationCategory
  ) => {
    const currentNotifs = StorageService.getNotifications();
    const newNotif: NotificationItem = {
      id: `notif-${Date.now().toString(36)}`,
      title,
      message,
      category,
      timestamp: 'Just now',
      read: false,
    };
    StorageService.saveNotifications([newNotif, ...currentNotifs]);
    StorageService.addAuditLog({
      action: 'System Broadcast Dispatched',
      actor: 'Admin Director',
      details: `Broadcast: ${title}`,
      module: 'notifications',
    });
    refreshAllState();
    showToast('Broadcast signal dispatched across portal!', 'success');
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    StorageService.saveSettings(newSettings);
    StorageService.addAuditLog({
      action: 'System Settings Updated',
      actor: 'Admin Director',
      details: 'Updated operational invariants and company profile',
      module: 'settings',
    });
    refreshAllState();
  };

  const handleResetData = () => {
    StorageService.resetDemoData();
    refreshAllState();
    showToast('Demonstration database reset to pristine factory seed state.', 'info');
  };

  const handleExportBackup = () => {
    const fullBackup = {
      timestamp: new Date().toISOString(),
      staff,
      homeowners,
      assignments,
      projects,
      rates,
      approvals,
      articles,
      notifications,
      settings,
      auditLogs,
      tasks,
      reviews,
      planningPdfs,
    };
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', jsonStr);
    link.setAttribute('download', `BuildMind_Full_Backup_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Full system backup JSON exported.');
  };

  const handleAdminQuickAction = (
    action: 'provision_staff' | 'new_assignment' | 'new_project' | 'run_estimator'
  ) => {
    switch (action) {
      case 'provision_staff':
        setCurrentAdminModule('staff');
        break;
      case 'new_assignment':
        setCurrentAdminModule('assignments');
        setIsAssignModalOpen(true);
        break;
      case 'new_project':
        setCurrentAdminModule('projects');
        break;
      case 'run_estimator':
        setCurrentAdminModule('estimator');
        break;
    }
  };

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'pending').length;
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col antialiased text-slate-800 font-sans">
      {/* Toast Feedback */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-xs font-semibold text-white ${
              toast.type === 'error'
                ? 'bg-rose-600'
                : toast.type === 'info'
                ? 'bg-slate-800'
                : 'bg-emerald-600'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="h-4 w-4 shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="h-4 w-4 shrink-0" />
            ) : (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            )}
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 hover:opacity-75 transition-opacity"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* WORKSPACE VIEW: HOMEOWNER / CLIENT WORKSPACE (PHASE 3) */}
      {workspaceRole === 'homeowner' && currentHomeowner && (
        <div className="min-h-screen bg-[#F4F7FB] flex flex-col">
          {/* Homeowner Sidebar */}
          <HomeownerSidebar
            currentModule={currentHomeownerModule}
            onSelectModule={setCurrentHomeownerModule}
            currentHomeowner={currentHomeowner}
            allHomeowners={homeowners}
            onSwitchHomeowner={handleSwitchActiveHomeowner}
            onSwitchRole={(role) => handleSwitchWorkspaceRole(role)}
            currentProject={currentProject}
            allProjects={homeownerProjects}
            onSelectProject={handleSelectHomeownerProject}
            unreadNotificationsCount={unreadNotificationsCount}
            mobileOpen={mobileHomeownerSidebarOpen}
            onCloseMobile={() => setMobileHomeownerSidebarOpen(false)}
          />

          {/* Homeowner Main Content Layout offset by lg:pl-72 */}
          <div className="lg:pl-72 flex flex-col flex-1 min-w-0">
            {/* Homeowner Header */}
            <HomeownerHeader
              currentHomeowner={currentHomeowner}
              currentProject={currentProject}
              onOpenMobileMenu={() => setMobileHomeownerSidebarOpen(true)}
              onSelectModule={setCurrentHomeownerModule}
              onSwitchRole={(role) => handleSwitchWorkspaceRole(role)}
              unreadNotificationsCount={unreadNotificationsCount}
            />

            {/* Homeowner Main Content Modules */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              {currentHomeownerModule === 'homeowner_dashboard' && (
                <HomeownerDashboardModule
                  currentHomeowner={currentHomeowner}
                  currentProject={currentProject}
                  allProjects={homeownerProjects}
                  assignedStaff={assignedStaffForHomeowner}
                  onNavigate={setCurrentHomeownerModule}
                  onSelectProject={handleSelectHomeownerProject}
                />
              )}

              {currentHomeownerModule === 'homeowner_projects' && (
                <HomeownerProjectsModule
                  projects={homeownerProjects}
                  currentProjectId={currentProjectId}
                  onSelectProject={handleSelectHomeownerProject}
                  onNavigate={setCurrentHomeownerModule}
                />
              )}

              {currentHomeownerModule === 'homeowner_new_project' && (
                <HomeownerNewProjectWizard
                  currentHomeowner={currentHomeowner}
                  onNavigate={setCurrentHomeownerModule}
                  onProjectCreated={handleProjectCreated}
                />
              )}

              {currentHomeownerModule === 'homeowner_ai_chat' && currentProject && (
                <HomeownerAIChatModule
                  currentProject={currentProject}
                  onNavigate={setCurrentHomeownerModule}
                  onProjectUpdated={handleProjectUpdated}
                />
              )}

              {currentHomeownerModule === 'homeowner_brief' && currentProject && (
                <HomeownerBriefModule
                  currentProject={currentProject}
                  onNavigate={setCurrentHomeownerModule}
                  onProjectUpdated={handleProjectUpdated}
                />
              )}

              {currentHomeownerModule === 'homeowner_feasibility' && currentProject && (
                <HomeownerFeasibilityModule
                  currentProject={currentProject}
                  onNavigate={setCurrentHomeownerModule}
                />
              )}

              {currentHomeownerModule === 'homeowner_plan_alternatives' && currentProject && (
                <HomeownerPlanAlternativesModule
                  currentProject={currentProject}
                  onNavigate={setCurrentHomeownerModule}
                  onProjectUpdated={handleProjectUpdated}
                />
              )}

              {currentHomeownerModule === 'homeowner_2d_editor' && currentProject && (
                <Homeowner2DEditorModule
                  currentProject={currentProject}
                  onNavigate={setCurrentHomeownerModule}
                  onProjectUpdated={handleProjectUpdated}
                />
              )}

              {currentHomeownerModule === 'homeowner_2d_validation' && currentProject && (
                <Homeowner2DValidationModule
                  currentProject={currentProject}
                  onNavigate={setCurrentHomeownerModule}
                  onProjectUpdated={handleProjectUpdated}
                />
              )}

              {currentHomeownerModule === 'homeowner_2d_confirmation' && currentProject && (
                <HomeownerConfirmationModule
                  currentProject={currentProject}
                  currentHomeowner={currentHomeowner}
                  onNavigate={setCurrentHomeownerModule}
                  onProjectUpdated={handleProjectUpdated}
                />
              )}

              {currentHomeownerModule === 'homeowner_3d_viewer' && currentProject && (
                <Homeowner3DViewerModule
                  currentProject={currentProject}
                  onNavigate={setCurrentHomeownerModule}
                />
              )}

              {currentHomeownerModule === 'homeowner_interior_studio' && currentProject && (
                <HomeownerInteriorStudioModule
                  currentProject={currentProject}
                  onNavigate={setCurrentHomeownerModule}
                  onProjectUpdated={handleProjectUpdated}
                />
              )}

              {currentHomeownerModule === 'homeowner_cost_estimation' && currentProject && (
                <HomeownerCostEstimatorModule
                  currentProject={currentProject}
                  onNavigate={setCurrentHomeownerModule}
                />
              )}

              {currentHomeownerModule === 'homeowner_project_report' && currentProject && (
                <HomeownerReportModule
                  currentProject={currentProject}
                  currentHomeowner={currentHomeowner}
                  onNavigate={setCurrentHomeownerModule}
                />
              )}

              {currentHomeownerModule === 'homeowner_profile' && (
                <HomeownerProfileModule
                  currentHomeowner={currentHomeowner}
                  currentProject={currentProject}
                  onHomeownerUpdated={handleHomeownerUpdated}
                />
              )}

              {currentHomeownerModule === 'homeowner_notifications' && (
                <HomeownerNotificationsModule
                  notifications={notifications}
                  onNotificationsUpdated={setNotifications}
                  onNavigate={setCurrentHomeownerModule}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* WORKSPACE VIEW: STAFF WORKSPACE (PHASE 2) */}
      {workspaceRole === 'staff' && currentStaff && (
        <div className="min-h-screen bg-[#F4F7FB] flex flex-col">
          {/* Staff Sidebar */}
          <StaffSidebar
            currentModule={currentStaffModule}
            onSelectModule={setCurrentStaffModule}
            currentStaff={currentStaff}
            allStaff={staff}
            onSwitchStaff={handleSwitchActiveStaff}
            onSwitchToAdmin={() => handleSwitchWorkspaceRole('admin')}
            onSwitchToHomeowner={() => handleSwitchWorkspaceRole('homeowner')}
            assignedHomeownersCount={assignedHomeownersForStaff.length}
            assignedProjectsCount={assignedProjectsForStaff.length}
            pendingReviewsCount={myReviews.filter((r) => r.reviewStatus !== 'Approved').length}
            pendingTasksCount={myTasks.filter((t) => t.status !== 'completed').length}
            pendingApprovalsCount={myApprovals.filter((a) => a.status === 'pending').length}
            unreadNotificationsCount={unreadNotificationsCount}
            mobileOpen={mobileStaffSidebarOpen}
            onCloseMobile={() => setMobileStaffSidebarOpen(false)}
          />

          {/* Staff Main Content Layout offset by lg:pl-72 */}
          <div className="lg:pl-72 flex flex-col flex-1 min-w-0">
            {/* Staff Header */}
            <StaffHeader
              currentModule={currentStaffModule}
              onSelectModule={setCurrentStaffModule}
              currentStaff={currentStaff}
              onSwitchToAdmin={() => handleSwitchWorkspaceRole('admin')}
              onSwitchToHomeowner={() => handleSwitchWorkspaceRole('homeowner')}
              onOpenMobileSidebar={() => setMobileStaffSidebarOpen(true)}
              notifications={notifications}
              onMarkNotificationRead={handleMarkNotificationRead}
              onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
              onQuickAction={handleStaffQuickAction}
            />

            {/* Staff Main Content Area */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              {currentStaffModule === 'staff_dashboard' && (
                <StaffDashboardModule
                  currentStaff={currentStaff}
                  assignedHomeowners={assignedHomeownersForStaff}
                  assignedProjects={assignedProjectsForStaff}
                  tasks={myTasks}
                  reviews={myReviews}
                  myApprovals={myApprovals}
                  myPdfs={myPdfs}
                  onNavigate={setCurrentStaffModule}
                  onToggleTask={handleToggleTask}
                  onQuickAction={handleStaffQuickAction}
                />
              )}

              {currentStaffModule === 'staff_homeowners' && (
                <StaffHomeownersModule
                  currentStaff={currentStaff}
                  assignedHomeowners={assignedHomeownersForStaff}
                  projects={assignedProjectsForStaff}
                  onNavigateToProject={(projectId) => {
                    setCurrentStaffModule('staff_projects');
                  }}
                />
              )}

              {currentStaffModule === 'staff_projects' && (
                <StaffProjectsModule
                  currentStaff={currentStaff}
                  assignedProjects={assignedProjectsForStaff}
                  homeowners={assignedHomeownersForStaff}
                  onUpdateProjectNotes={handleUpdateProjectNotes}
                  onNavigateToReviews={(projectId) => {
                    setPreSelectedProjectIdForReview(projectId);
                    setCurrentStaffModule('staff_reviews');
                  }}
                />
              )}

              {currentStaffModule === 'staff_reviews' && (
                <StaffProjectReviewModule
                  currentStaff={currentStaff}
                  reviews={myReviews}
                  assignedProjects={assignedProjectsForStaff}
                  onAddReview={handleAddProjectReview}
                  preSelectedProjectId={preSelectedProjectIdForReview}
                />
              )}

              {currentStaffModule === 'staff_pdf_library' && (
                <StaffPdfLibraryModule
                  currentStaff={currentStaff}
                  pdfDocuments={planningPdfs}
                  onSubmitPdf={handleSubmitPlanningPdf}
                />
              )}

              {currentStaffModule === 'staff_building_rules' && (
                <StaffBuildingRulesModule
                  currentStaff={currentStaff}
                  articles={articles}
                  onSubmitCorrection={handleSubmitRuleCorrection}
                />
              )}

              {currentStaffModule === 'staff_rate_suggestions' && (
                <StaffRateSuggestionsModule
                  currentStaff={currentStaff}
                  rates={rates}
                  myApprovals={myApprovals}
                  onSubmitRateProposal={handleSubmitRateProposal}
                />
              )}

              {currentStaffModule === 'staff_approvals' && (
                <StaffApprovalStatusModule
                  currentStaff={currentStaff}
                  myApprovals={myApprovals}
                />
              )}

              {currentStaffModule === 'staff_tasks' && (
                <StaffTasksModule
                  currentStaff={currentStaff}
                  tasks={myTasks}
                  assignedProjects={assignedProjectsForStaff}
                  onAddTask={handleAddTask}
                  onToggleTask={handleToggleTask}
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
                />
              )}

              {currentStaffModule === 'staff_notifications' && (
                <StaffNotificationsModule
                  currentStaff={currentStaff}
                  notifications={notifications}
                  onMarkRead={handleMarkNotificationRead}
                  onMarkAllRead={handleMarkAllNotificationsRead}
                  onDeleteNotification={handleDeleteNotification}
                  onNavigateToStaffModule={setCurrentStaffModule}
                />
              )}

              {currentStaffModule === 'staff_profile' && (
                <StaffProfileModule
                  currentStaff={currentStaff}
                  onUpdateProfile={handleUpdateStaffProfile}
                  assignedHomeownersCount={assignedHomeownersForStaff.length}
                  assignedProjectsCount={assignedProjectsForStaff.length}
                  myReviewsCount={myReviews.length}
                  myProposalsCount={myApprovals.length}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* WORKSPACE VIEW: ADMIN CONTROL CENTER (PHASE 1) */}
      {workspaceRole === 'admin' && (
        <div className="min-h-screen bg-[#F4F7FB] flex flex-col">
          {/* Admin Sidebar */}
          <Sidebar
            currentModule={currentAdminModule}
            onSelectModule={setCurrentAdminModule}
            pendingApprovalsCount={pendingApprovalsCount}
            unreadNotificationsCount={unreadNotificationsCount}
            mobileOpen={mobileAdminSidebarOpen}
            onCloseMobile={() => setMobileAdminSidebarOpen(false)}
          />

          {/* Admin Main Layout Area offset by fixed 72 (18rem / 288px) sidebar on lg */}
          <div className="lg:pl-72 flex flex-col flex-1 min-w-0">
            {/* Admin Header with Switch to Staff Portal button */}
            <Header
              currentModule={currentAdminModule}
              onSelectModule={setCurrentAdminModule}
              onOpenMobileSidebar={() => setMobileAdminSidebarOpen(true)}
              notifications={notifications}
              onMarkNotificationRead={handleMarkNotificationRead}
              onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
              onResetData={handleResetData}
              onQuickAction={handleAdminQuickAction}
              onSwitchToStaff={() => handleSwitchWorkspaceRole('staff')}
              onSwitchToHomeowner={() => handleSwitchWorkspaceRole('homeowner')}
            />

            {/* Admin Main Content Area */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              {currentAdminModule === 'dashboard' && (
                <DashboardModule
                  onSelectModule={setCurrentAdminModule}
                  staff={staff}
                  homeowners={homeowners}
                  assignments={assignments}
                  projects={projects}
                  rates={rates}
                  approvals={approvals}
                  onReviewApproval={(id, status, remarks) =>
                    handleReviewApproval(id, status, remarks)
                  }
                  onOpenAssignModal={() => {
                    setCurrentAdminModule('assignments');
                    setIsAssignModalOpen(true);
                  }}
                />
              )}

              {currentAdminModule === 'staff' && (
                <StaffManagementModule
                  staff={staff}
                  homeowners={homeowners}
                  onProvisionStaff={handleProvisionStaff}
                  onToggleStatus={handleToggleStaffStatus}
                  onNavigateToAssignments={(staffId) => {
                    setPreSelectedStaffId(staffId);
                    setCurrentAdminModule('assignments');
                  }}
                />
              )}

              {currentAdminModule === 'assignments' && (
                <StaffAssignmentModule
                  assignments={assignments}
                  homeowners={homeowners}
                  staff={staff}
                  onAssignOrReassign={handleAssignOrReassign}
                  onUnassign={handleUnassign}
                  preSelectedStaffId={preSelectedStaffId}
                  isAssignModalOpen={isAssignModalOpen}
                  setIsAssignModalOpen={setIsAssignModalOpen}
                />
              )}

              {currentAdminModule === 'users' && (
                <UserManagementModule
                  homeowners={homeowners}
                  staff={staff}
                  projects={projects}
                  onAddHomeowner={handleAddHomeowner}
                  onUpdateStatus={handleUpdateHomeownerStatus}
                  onNavigateToAssign={(homeownerId) => {
                    setCurrentAdminModule('assignments');
                    setIsAssignModalOpen(true);
                  }}
                />
              )}

              {currentAdminModule === 'projects' && (
                <ProjectManagementModule
                  projects={projects}
                  homeowners={homeowners}
                  staff={staff}
                  onAddProject={handleAddProject}
                  onUpdateProject={handleUpdateProject}
                />
              )}

              {currentAdminModule === 'rates' && (
                <ConstructionRatesModule
                  rates={rates}
                  onUpdateRate={handleUpdateRate}
                  onAddRate={handleAddRate}
                />
              )}

              {currentAdminModule === 'estimator' && (
                <CostEstimatorModule
                  rates={rates}
                  homeowners={homeowners}
                  projects={projects}
                  onApplyEstimateToProject={handleApplyEstimateToProject}
                />
              )}

              {currentAdminModule === 'approvals' && (
                <StaffApprovalsModule
                  approvals={approvals}
                  onReviewApproval={handleReviewApproval}
                />
              )}

              {currentAdminModule === 'content' && (
                <ContentApprovalsModule
                  articles={articles}
                  onAddArticle={handleAddArticle}
                  onUpdateArticleStatus={handleUpdateArticleStatus}
                />
              )}

              {currentAdminModule === 'reports' && (
                <ReportsAnalyticsModule
                  projects={projects}
                  staff={staff}
                  rates={rates}
                  assignments={assignments}
                />
              )}

              {currentAdminModule === 'notifications' && (
                <NotificationsModule
                  notifications={notifications}
                  onMarkRead={handleMarkNotificationRead}
                  onMarkAllRead={handleMarkAllNotificationsRead}
                  onDeleteNotification={handleDeleteNotification}
                  onDispatchBroadcast={handleDispatchBroadcast}
                  onNavigateToModule={setCurrentAdminModule}
                />
              )}

              {currentAdminModule === 'settings' && settings && (
                <SettingsModule
                  settings={settings}
                  auditLogs={auditLogs}
                  onUpdateSettings={handleUpdateSettings}
                  onResetData={handleResetData}
                  onExportBackup={handleExportBackup}
                />
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
