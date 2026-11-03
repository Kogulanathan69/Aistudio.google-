import React, { useState, useRef } from 'react';
import {
  Edit3,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Maximize2,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Info,
  Grid,
  Move,
  Layers,
} from 'lucide-react';
import { ConstructionProject, FloorPlanRoom, FloorPlanGeometry, HomeownerModuleType } from '../../../types';
import { StorageService } from '../../../services/storageService';
import { getSampleFloorPlan } from '../../../data/mockData';

interface Homeowner2DEditorModuleProps {
  currentProject: ConstructionProject;
  onNavigate: (module: HomeownerModuleType) => void;
  onProjectUpdated: (project: ConstructionProject) => void;
}

export const Homeowner2DEditorModule: React.FC<Homeowner2DEditorModuleProps> = ({
  currentProject,
  onNavigate,
  onProjectUpdated,
}) => {
  const initialPlan = currentProject.interactiveFloorPlan || getSampleFloorPlan(currentProject.selectedPlanKey || 'A');

  const [rooms, setRooms] = useState<FloorPlanRoom[]>(initialPlan.rooms);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(rooms[0]?.id || null);
  const [revision, setRevision] = useState<number>(initialPlan.revision || 1);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'warning'; text: string } | null>(null);

  // Dragging state
  const [draggingRoomId, setDraggingRoomId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

  // Metric calculations
  const totalFloorAreaSqFt = rooms.reduce((acc, r) => acc + (r.width * r.length), 0);
  const maxCoverageSqFt = Math.round((currentProject.landDetails.plotAreaSqFt * currentProject.feasibilityStage.maximumPlotCoveragePercent) / 100);
  const isOverCoverage = totalFloorAreaSqFt > maxCoverageSqFt;

  const handleRoomSelect = (id: string) => {
    setSelectedRoomId(id);
  };

  const handleDragStart = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedRoomId(id);
    setDraggingRoomId(id);
    const room = rooms.find((r) => r.id === id);
    if (room) {
      // client coordinates to svg coords
      setDragOffset({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingRoomId) return;
    const deltaX = Math.round((e.clientX - dragOffset.x) / 8);
    const deltaY = Math.round((e.clientY - dragOffset.y) / 8);

    if (Math.abs(deltaX) >= 1 || Math.abs(deltaY) >= 1) {
      setRooms((prev) =>
        prev.map((r) => {
          if (r.id === draggingRoomId) {
            const newX = Math.max(0, Math.min(80, r.x + deltaX));
            const newY = Math.max(0, Math.min(60, r.y + deltaY));
            return { ...r, x: newX, y: newY };
          }
          return r;
        })
      );
      setDragOffset({ x: e.clientX, y: e.clientY });
      setHasUnsavedChanges(true);
    }
  };

  const handleMouseUp = () => {
    setDraggingRoomId(null);
  };

  const handleResize = (dimension: 'width' | 'length', delta: number) => {
    if (!selectedRoomId) return;
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === selectedRoomId) {
          const newVal = Math.max(6, Math.min(40, r[dimension] + delta));
          return { ...r, [dimension]: newVal };
        }
        return r;
      })
    );
    setHasUnsavedChanges(true);
  };

  const handleAddRoom = (category: FloorPlanRoom['category']) => {
    const newRoom: FloorPlanRoom = {
      id: `room-${Date.now()}`,
      name: category === 'courtyard' ? 'Medamidula Courtyard' : category === 'bedroom' ? 'Family Bedroom' : 'Private Study Nook',
      category,
      x: 10,
      y: 10,
      width: category === 'courtyard' ? 12 : 14,
      length: category === 'courtyard' ? 12 : 12,
      color: category === 'courtyard' ? '#cffafe' : '#e0e7ff',
    };
    setRooms([...rooms, newRoom]);
    setSelectedRoomId(newRoom.id);
    setHasUnsavedChanges(true);
  };

  const handleDeleteRoom = (id: string) => {
    if (rooms.length <= 2) {
      alert('Floor plan requires at least 2 rooms.');
      return;
    }
    setRooms(rooms.filter((r) => r.id !== id));
    if (selectedRoomId === id) {
      setSelectedRoomId(rooms[0]?.id || null);
    }
    setHasUnsavedChanges(true);
  };

  const handleSaveFloorPlan = () => {
    const newGeometry: FloorPlanGeometry = {
      revision: revision + 1,
      rooms,
      totalAreaSqFt: totalFloorAreaSqFt,
      lastEditedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isValidated: false,
      validationErrors: [],
      isConfirmed: false,
    };

    // CRITICAL GOVERNANCE INVARIANT ENFORCEMENT:
    // Calling updateProjectInteractiveFloorPlan increments revision,
    // invalidates homeowner confirmation, and locks 3D model!
    const updated = StorageService.updateProjectInteractiveFloorPlan(currentProject.id, newGeometry);
    if (updated) {
      onProjectUpdated(updated);
      setRevision(newGeometry.revision);
      setHasUnsavedChanges(false);
      setNotification({
        type: 'warning',
        text: `Floor plan Revision v${newGeometry.revision} saved! Invariant enforced: Previous confirmation and 3D visualization have been reset and locked until re-validated and re-confirmed.`,
      });
      setTimeout(() => setNotification(null), 6000);
    }
  };

  const handleResetToAlternative = () => {
    const cleanSample = getSampleFloorPlan(currentProject.selectedPlanKey || 'A');
    setRooms(cleanSample.rooms);
    setSelectedRoomId(cleanSample.rooms[0]?.id || null);
    setHasUnsavedChanges(true);
  };

  return (
    <div className="space-y-6" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {currentProject.code}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              Revision v{revision}
            </span>
            {hasUnsavedChanges ? (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                Unsaved Edits
              </span>
            ) : (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                Saved State
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Interactive 2D Architectural Studio</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Drag, reposition, and resize rooms. Any geometric change creates a new plan revision and locks the 3D model.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleResetToAlternative}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Reset layout to base option"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Base</span>
          </button>

          <button
            onClick={handleSaveFloorPlan}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Revision</span>
          </button>

          <button
            onClick={() => onNavigate('homeowner_2d_validation')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <span>Run 2D Validation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {notification && (
        <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-start gap-3 shadow-xs ${
          notification.type === 'warning'
            ? 'bg-amber-50 border-amber-300 text-amber-900'
            : 'bg-emerald-50 border-emerald-300 text-emerald-900'
        }`}>
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Governance Notice:</span>
            {notification.text}
          </div>
        </div>
      )}

      {/* Main Studio Grid: Left 2D Canvas, Right Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* SVG Interactive Canvas */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between select-none">
          {/* Canvas Toolbar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Grid className="w-3.5 h-3.5 text-blue-600" />
                <span>Floor Plan Grid (1 sq = 2 ft)</span>
              </span>
              <span className="text-[11px] text-slate-500">
                Total Area: <strong className="text-slate-900">{totalFloorAreaSqFt.toLocaleString()} sq.ft</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                isOverCoverage ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                Coverage: {Math.round((totalFloorAreaSqFt / currentProject.landDetails.plotAreaSqFt) * 100)}% / {currentProject.feasibilityStage.maximumPlotCoveragePercent}% max
              </span>
            </div>
          </div>

          {/* SVG Floor Plan Area */}
          <div className="w-full aspect-16/10 bg-slate-50/70 rounded-xl border border-slate-200 relative overflow-hidden flex items-center justify-center p-2">
            <svg
              viewBox="0 0 800 500"
              className="w-full h-full cursor-crosshair"
              onClick={() => setSelectedRoomId(null)}
            >
              {/* Grid lines */}
              <defs>
                <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="800" height="500" fill="url(#gridPattern)" />

              {/* Buildable Envelope Border */}
              <rect
                x="30"
                y="30"
                width="740"
                height="440"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="1.5"
                strokeDasharray="6 4"
                rx="6"
              />
              <text x="40" y="48" fill="#94a3b8" fontSize="10" fontWeight="bold">
                Permissible Building Zone (Setback Bound)
              </text>

              {/* Render Floor Plan Rooms */}
              {rooms.map((room) => {
                const isSelected = selectedRoomId === room.id;
                const scale = 7.5; // ft to px
                const svgX = 50 + room.x * scale;
                const svgY = 60 + room.y * scale;
                const svgW = room.width * scale;
                const svgH = room.length * scale;

                const isCourtyard = room.category === 'courtyard';

                return (
                  <g
                    key={room.id}
                    onMouseDown={(e) => handleDragStart(e, room.id)}
                    className="cursor-move"
                  >
                    {/* Room Rectangle */}
                    <rect
                      x={svgX}
                      y={svgY}
                      width={svgW}
                      height={svgH}
                      fill={isCourtyard ? '#ecfeff' : room.color || '#eff6ff'}
                      stroke={isSelected ? '#2563eb' : isCourtyard ? '#06b6d4' : '#64748b'}
                      strokeWidth={isSelected ? 3 : isCourtyard ? 2 : 1.5}
                      strokeDasharray={isCourtyard ? '4 2' : undefined}
                      rx="4"
                      className="transition-all"
                    />

                    {/* Room Name & Dimensions Label */}
                    <text
                      x={svgX + svgW / 2}
                      y={svgY + svgH / 2 - 5}
                      textAnchor="middle"
                      fill={isCourtyard ? '#0e7490' : '#1e293b'}
                      fontSize="11"
                      fontWeight="bold"
                      pointerEvents="none"
                    >
                      {room.name}
                    </text>
                    <text
                      x={svgX + svgW / 2}
                      y={svgY + svgH / 2 + 10}
                      textAnchor="middle"
                      fill="#64748b"
                      fontSize="9"
                      pointerEvents="none"
                    >
                      {room.width}' × {room.length}' ({room.width * room.length} sq.ft)
                    </text>

                    {/* Wall Door indicator */}
                    <rect
                      x={svgX + svgW / 2 - 12}
                      y={svgY}
                      width="24"
                      height="3"
                      fill="#d97706"
                      pointerEvents="none"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Move className="w-3 h-3 text-blue-500" />
              <span>Click and drag rooms to reconfigure. Select a room to adjust dimensions.</span>
            </span>
            <span className="font-mono text-slate-600">Total Rooms: {rooms.length}</span>
          </div>
        </div>

        {/* Right Inspector & Tools */}
        <div className="space-y-4">
          {/* Room Inspector */}
          {selectedRoom ? (
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Selected Space
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 truncate">{selectedRoom.name}</h3>
                </div>
                <button
                  onClick={() => handleDeleteRoom(selectedRoom.id)}
                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete Room"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Dimensions controllers */}
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1 text-slate-700">
                    <span>Width (ft):</span>
                    <strong className="text-slate-900 font-mono">{selectedRoom.width} ft</strong>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleResize('width', -2)}
                      className="py-1 bg-slate-100 hover:bg-slate-200 rounded font-semibold text-slate-700"
                    >
                      - 2 ft
                    </button>
                    <button
                      onClick={() => handleResize('width', 2)}
                      className="py-1 bg-slate-100 hover:bg-slate-200 rounded font-semibold text-slate-700"
                    >
                      + 2 ft
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1 text-slate-700">
                    <span>Length (ft):</span>
                    <strong className="text-slate-900 font-mono">{selectedRoom.length} ft</strong>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleResize('length', -2)}
                      className="py-1 bg-slate-100 hover:bg-slate-200 rounded font-semibold text-slate-700"
                    >
                      - 2 ft
                    </button>
                    <button
                      onClick={() => handleResize('length', 2)}
                      className="py-1 bg-slate-100 hover:bg-slate-200 rounded font-semibold text-slate-700"
                    >
                      + 2 ft
                    </button>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
                  <span className="text-[10px] text-slate-400 block font-semibold">Area</span>
                  <span className="text-sm font-bold text-blue-700">
                    {selectedRoom.width * selectedRoom.length} sq.ft
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs text-center text-xs text-slate-500">
              <Info className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <p>Click on any room on the plan to inspect and resize its spatial footprint.</p>
            </div>
          )}

          {/* Add Room Quick Palette */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-blue-600" />
              <span>Add Tropical Spaces</span>
            </h4>

            <div className="grid grid-cols-1 gap-1.5 text-xs">
              <button
                onClick={() => handleAddRoom('courtyard')}
                className="w-full py-1.5 px-3 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 text-left font-medium transition-colors"
              >
                + Medamidula Courtyard
              </button>
              <button
                onClick={() => handleAddRoom('bedroom')}
                className="w-full py-1.5 px-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-left font-medium transition-colors"
              >
                + Family Bedroom
              </button>
              <button
                onClick={() => handleAddRoom('utility')}
                className="w-full py-1.5 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-left font-medium transition-colors"
              >
                + Study Nook / Prayer Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
