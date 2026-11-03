import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  AlertCircle,
  Tag,
} from 'lucide-react';
import {
  StaffTask,
  StaffMember,
  ConstructionProject,
} from '../../../types';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';

interface StaffTasksModuleProps {
  currentStaff: StaffMember;
  tasks: StaffTask[];
  assignedProjects: ConstructionProject[];
  onAddTask: (task: Omit<StaffTask, 'id'>) => void;
  onToggleTask: (taskId: string) => void;
  onUpdateTask: (task: StaffTask) => void;
  onDeleteTask: (taskId: string) => void;
}

export const StaffTasksModule: React.FC<StaffTasksModuleProps> = ({
  currentStaff,
  tasks,
  assignedProjects,
  onAddTask,
  onToggleTask,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<StaffTask | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: assignedProjects[0]?.id || '',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    priority: 'high' as StaffTask['priority'],
    category: 'Review' as StaffTask['category'],
    notes: '',
  });

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.projectTitle && t.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const proj = assignedProjects.find((p) => p.id === formData.projectId);

    onAddTask({
      staffId: currentStaff.id,
      title: formData.title,
      description: formData.description,
      projectId: proj?.id,
      projectCode: proj?.code,
      projectTitle: proj?.title,
      homeownerName: proj?.homeownerName,
      dueDate: formData.dueDate,
      priority: formData.priority,
      status: 'pending',
      category: formData.category,
      notes: formData.notes,
    });

    setIsAddModalOpen(false);
    setFormData({
      title: '',
      description: '',
      projectId: assignedProjects[0]?.id || '',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      priority: 'high',
      category: 'Review',
      notes: '',
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    onUpdateTask(editingTask);
    setEditingTask(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-rose-600" />
            My Architectural Tasks & Deliverables
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your personal review queue, client coordination tasks, and boundary clearance deadlines.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Task</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks by title, project, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses ({tasks.length})</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="Review">Review</option>
            <option value="Site Feasibility">Site Feasibility</option>
            <option value="2D Plan Revision">2D Plan Revision</option>
            <option value="UDA Clearance">UDA Clearance</option>
            <option value="General">General</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTasks.map((task) => {
          const isDone = task.status === 'completed';
          return (
            <div
              key={task.id}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isDone
                  ? 'bg-slate-50/70 border-slate-200 opacity-75'
                  : 'bg-white border-slate-200/80 shadow-xs hover:border-blue-300'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => onToggleTask(task.id)}
                  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 mt-1 cursor-pointer shrink-0"
                />

                <div className="min-w-0 flex-1 text-xs">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className={`font-bold text-sm ${
                        isDone ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {task.title}
                    </span>

                    <span
                      className={`text-[9.5px] px-1.5 py-0.2 rounded font-semibold ${
                        task.priority === 'urgent'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : task.priority === 'high'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {task.priority}
                    </span>

                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                      {task.category}
                    </span>
                  </div>

                  <p className="text-slate-600 leading-relaxed">{task.description}</p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-1.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Due: <strong className="text-slate-700">{task.dueDate}</strong>
                    </span>
                    {task.projectCode && (
                      <span>
                        Project: <strong className="text-slate-700">{task.projectCode}</strong> ({task.homeownerName})
                      </span>
                    )}
                    {task.completedAt && (
                      <span className="text-emerald-600 font-medium">
                        Completed on {task.completedAt}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => setEditingTask(task)}
                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Edit Task"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                  title="Delete Task"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs bg-white rounded-xl border border-dashed border-slate-200">
            No tasks found in this view.
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Create New Architectural Task"
          subtitle={`Personal task item for ${currentStaff.name}`}
          maxWidth="md"
        >
          <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Task Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Verify boundary wall fire clearance with council"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Link to Assigned Project (Optional)</label>
              <select
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- General Task (No Project Link) --</option>
                {assignedProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} — {p.title} ({p.homeownerName})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Due Date *</label>
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Review">Review</option>
                  <option value="Site Feasibility">Site Feasibility</option>
                  <option value="2D Plan Revision">2D Plan Revision</option>
                  <option value="UDA Clearance">UDA Clearance</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Task Instructions / Scope *</label>
              <textarea
                rows={3}
                required
                placeholder="Details of the review deliverable, calculations, or client coordination..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-xs"
              >
                Add Task
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <Modal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          title="Edit Task Details"
          maxWidth="md"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Task Title *</label>
              <input
                type="text"
                required
                value={editingTask.title}
                onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={editingTask.dueDate}
                  onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                <select
                  value={editingTask.priority}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, priority: e.target.value as any })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={editingTask.description}
                onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingTask(null)}
                className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
