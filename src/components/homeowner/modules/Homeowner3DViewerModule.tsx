import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Box,
  Lock,
  Unlock,
  Layers,
  Eye,
  Camera,
  Sun,
  Maximize2,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { ConstructionProject, HomeownerModuleType } from '../../../types';
import { getSampleFloorPlan } from '../../../data/mockData';

interface Homeowner3DViewerModuleProps {
  currentProject: ConstructionProject;
  onNavigate: (module: HomeownerModuleType) => void;
}

export const Homeowner3DViewerModule: React.FC<Homeowner3DViewerModuleProps> = ({
  currentProject,
  onNavigate,
}) => {
  const is3DUnlocked =
    currentProject.homeownerConfirmation?.isConfirmed &&
    currentProject.model3DStatus?.status !== 'Locked - Awaiting Homeowner 2D Confirmation';

  const containerRef = useRef<HTMLDivElement>(null);

  // 3D Control States
  const [showRoof, setShowRoof] = useState(true);
  const [cameraView, setCameraView] = useState<'isometric' | 'perspective' | 'top' | 'courtyard'>('isometric');
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<'noon' | 'sunset' | 'morning'>('noon');

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const roofGroupRef = useRef<THREE.Group | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);

  useEffect(() => {
    if (!is3DUnlocked || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;

    // Detect Software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf1f5f9);
    scene.fog = new THREE.Fog(0xf1f5f9, 40, 160);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 500);
    cameraRef.current = camera;
    camera.position.set(45, 38, 55);
    camera.lookAt(0, 4, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // Attach to DOM
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xfff5eb, 0x94a3b8, 0.8);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 1.8);
    dirLight.position.set(30, 45, 25);
    dirLight.castShadow = !isSoftwareGl;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 150;
    const d = 35;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // Ground Plane with subtle grass and site boundary
    const groundGeo = new THREE.PlaneGeometry(120, 120);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xecfdf5,
      roughness: 0.9,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = !isSoftwareGl;
    scene.add(ground);

    // Site boundary outline
    const siteBoundsGeo = new THREE.BoxGeometry(60, 0.1, 75);
    const siteBoundsMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.95,
    });
    const sitePlinth = new THREE.Mesh(siteBoundsGeo, siteBoundsMat);
    sitePlinth.position.set(0, 0.05, 0);
    sitePlinth.receiveShadow = !isSoftwareGl;
    scene.add(sitePlinth);

    // Soft Contact Shadow Plane directly beneath house
    const shadowGeo = new THREE.PlaneGeometry(50, 60);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x0f172a,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.06;
    scene.add(shadowPlane);

    // Architectural Building Model
    const buildingGroup = new THREE.Group();
    scene.add(buildingGroup);

    const rooms =
      currentProject.interactiveFloorPlan?.rooms ||
      getSampleFloorPlan(currentProject.selectedPlanKey || 'A').rooms;

    const wallHeight = 5.5; // in Three.js units
    const scaleFactor = 0.55; // scale ft to 3D units

    // Materials
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.4,
      metalness: 0.1,
    });
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.65,
      metalness: 0.05,
    });
    const courtyardFloorMat = new THREE.MeshStandardMaterial({
      color: 0x0891b2,
      roughness: 0.2,
      metalness: 0.3,
    });
    const gravelMat = new THREE.MeshStandardMaterial({
      color: 0xd6d3d1,
      roughness: 0.95,
      metalness: 0.05,
    });
    const timberPillarMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.5,
      metalness: 0.1,
    });
    const roofTileMat = new THREE.MeshStandardMaterial({
      color: 0x9a3412, // Sri Lankan clay terracotta tile orange
      roughness: 0.6,
      metalness: 0.1,
    });

    const roofGroup = new THREE.Group();
    buildingGroup.add(roofGroup);
    roofGroupRef.current = roofGroup;

    // Build Rooms from 2D coordinates
    rooms.forEach((room) => {
      const rx = (room.x - 20) * scaleFactor;
      const rz = (room.y - 20) * scaleFactor;
      const rw = room.width * scaleFactor;
      const rl = room.length * scaleFactor;

      const isCourtyard = room.category === 'courtyard';

      // 1. Floor Slab
      const floorGeo = new THREE.BoxGeometry(rw, 0.4, rl);
      const floorMesh = new THREE.Mesh(
        floorGeo,
        isCourtyard ? courtyardFloorMat : floorMat
      );
      floorMesh.position.set(rx + rw / 2, 0.2, rz + rl / 2);
      floorMesh.receiveShadow = !isSoftwareGl;
      buildingGroup.add(floorMesh);

      // If courtyard, add gravel boundary & open to sky
      if (isCourtyard) {
        const borderGeo = new THREE.BoxGeometry(rw + 0.8, 0.6, rl + 0.8);
        const borderMesh = new THREE.Mesh(borderGeo, gravelMat);
        borderMesh.position.set(rx + rw / 2, 0.3, rz + rl / 2);
        buildingGroup.add(borderMesh);
        return; // Courtyard has no outer ceiling
      }

      // 2. Room Walls
      const wallThickness = 0.4;
      // North Wall
      const wallN = new THREE.Mesh(new THREE.BoxGeometry(rw, wallHeight, wallThickness), wallMat);
      wallN.position.set(rx + rw / 2, wallHeight / 2 + 0.4, rz);
      wallN.castShadow = !isSoftwareGl;
      wallN.receiveShadow = !isSoftwareGl;
      buildingGroup.add(wallN);

      // South Wall
      const wallS = new THREE.Mesh(new THREE.BoxGeometry(rw, wallHeight, wallThickness), wallMat);
      wallS.position.set(rx + rw / 2, wallHeight / 2 + 0.4, rz + rl);
      wallS.castShadow = !isSoftwareGl;
      wallS.receiveShadow = !isSoftwareGl;
      buildingGroup.add(wallS);

      // East Wall
      const wallE = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, wallHeight, rl), wallMat);
      wallE.position.set(rx + rw, wallHeight / 2 + 0.4, rz + rl / 2);
      wallE.castShadow = !isSoftwareGl;
      wallE.receiveShadow = !isSoftwareGl;
      buildingGroup.add(wallE);

      // West Wall
      const wallW = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, wallHeight, rl), wallMat);
      wallW.position.set(rx, wallHeight / 2 + 0.4, rz + rl / 2);
      wallW.castShadow = !isSoftwareGl;
      wallW.receiveShadow = !isSoftwareGl;
      buildingGroup.add(wallW);

      // Timber Pillars if Verandah
      if (room.category === 'verandah' || room.name.toLowerCase().includes('verandah')) {
        for (let p = 0; p <= 3; p++) {
          const pillarGeo = new THREE.CylinderGeometry(0.2, 0.25, wallHeight, 8);
          const pillar = new THREE.Mesh(pillarGeo, timberPillarMat);
          pillar.position.set(rx + (rw / 3) * p, wallHeight / 2 + 0.4, rz + rl);
          pillar.castShadow = !isSoftwareGl;
          buildingGroup.add(pillar);
        }
      }

      // Pitched Terracotta Roof section over room
      const roofPitchH = 2.4;
      const roofConeGeo = new THREE.ConeGeometry(Math.max(rw, rl) * 0.72, roofPitchH, 4);
      const roofMesh = new THREE.Mesh(roofConeGeo, roofTileMat);
      roofMesh.position.set(rx + rw / 2, wallHeight + 0.4 + roofPitchH / 2, rz + rl / 2);
      roofMesh.rotation.y = Math.PI / 4;
      roofMesh.castShadow = !isSoftwareGl;
      roofGroup.add(roofMesh);
    });

    // Decorative Tropical Palms in garden perimeter
    for (let t = 0; t < 6; t++) {
      const angle = (t / 6) * Math.PI * 2;
      const dist = 28 + (t % 2) * 5;
      const tx = Math.cos(angle) * dist;
      const tz = Math.sin(angle) * dist;

      const treeTrunkGeo = new THREE.CylinderGeometry(0.3, 0.5, 7, 6);
      const treeTrunk = new THREE.Mesh(treeTrunkGeo, timberPillarMat);
      treeTrunk.position.set(tx, 3.5, tz);
      treeTrunk.castShadow = !isSoftwareGl;
      scene.add(treeTrunk);

      const leavesGeo = new THREE.ConeGeometry(3.5, 4.5, 7);
      const leavesMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
      const foliage = new THREE.Mesh(leavesGeo, leavesMat);
      foliage.position.set(tx, 8, tz);
      foliage.castShadow = !isSoftwareGl;
      scene.add(foliage);
    }

    // Animation & Pacing Loop
    let animationFrameId = 0;
    let rotationSpeed = 0.0015;

    const animate = () => {
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        // Slow architectural showcase rotation if isometric
        if (cameraView === 'isometric') {
          buildingGroup.rotation.y += rotationSpeed;
        }
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [is3DUnlocked, currentProject.interactiveFloorPlan?.revision, cameraView]);

  // Handle Camera Presets
  const handleCameraChange = (view: 'isometric' | 'perspective' | 'top' | 'courtyard') => {
    setCameraView(view);
    if (!cameraRef.current) return;
    if (view === 'isometric') {
      cameraRef.current.position.set(45, 38, 55);
      cameraRef.current.lookAt(0, 4, 0);
    } else if (view === 'perspective') {
      cameraRef.current.position.set(0, 15, 42);
      cameraRef.current.lookAt(0, 4, 0);
    } else if (view === 'top') {
      cameraRef.current.position.set(0, 65, 0.1);
      cameraRef.current.lookAt(0, 0, 0);
    } else if (view === 'courtyard') {
      cameraRef.current.position.set(0, 6, 8);
      cameraRef.current.lookAt(0, 6, -10);
    }
  };

  const handleToggleRoof = () => {
    setShowRoof(!showRoof);
    if (roofGroupRef.current) {
      roofGroupRef.current.visible = !showRoof;
    }
  };

  const handleTimeOfDayChange = (time: 'noon' | 'sunset' | 'morning') => {
    setTimeOfDay(time);
    if (!dirLightRef.current || !sceneRef.current) return;
    if (time === 'sunset') {
      dirLightRef.current.position.set(40, 15, -30);
      dirLightRef.current.color.setHex(0xf97316);
      sceneRef.current.background = new THREE.Color(0xfde047);
    } else if (time === 'morning') {
      dirLightRef.current.position.set(-40, 25, 20);
      dirLightRef.current.color.setHex(0xfef08a);
      sceneRef.current.background = new THREE.Color(0xf8fafc);
    } else {
      dirLightRef.current.position.set(30, 45, 25);
      dirLightRef.current.color.setHex(0xfffaed);
      sceneRef.current.background = new THREE.Color(0xf1f5f9);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {currentProject.code}
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                is3DUnlocked
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {is3DUnlocked ? '3D Conceptual Model Active' : '3D Visualization Locked'}
            </span>
            <span className="text-xs text-slate-500">
              Revision v{currentProject.planRevisionStatus.currentRevision || 1}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Conceptual 3D Massing Viewer</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Volumetric 3D representation with tropical pitched terracotta roofs, open-to-sky Medamidula, and perimeter setbacks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('homeowner_2d_editor')}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
          >
            ← 2D Studio
          </button>
          <button
            onClick={() => onNavigate('homeowner_interior_studio')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <span>Interior Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D Viewport Container */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden relative min-h-[540px] flex items-center justify-center">
        {is3DUnlocked ? (
          <>
            {/* Three.js Canvas Mount */}
            <div ref={containerRef} className="w-full h-[540px] cursor-grab active:cursor-grabbing" />

            {/* Spec Badge Top Left */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none">
              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/60 p-2.5 rounded-xl text-xs text-white shadow-lg space-y-0.5">
                <span className="font-bold text-slate-100 block">{currentProject.title}</span>
                <span className="text-[11px] text-slate-400 block font-mono">
                  Option {currentProject.selectedPlanKey || 'A'} • Rev v{currentProject.planRevisionStatus.currentRevision}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold block">
                  PBR Terracotta & Tropical Verandah
                </span>
              </div>
            </div>

            {/* Collapsible Ergonomic Bottom HUD Dock */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-2xl transition-all">
              {/* Collapse/Expand Toggle Button */}
              <div className="flex justify-center mb-1">
                <button
                  onClick={() => setIsDockCollapsed(!isDockCollapsed)}
                  className="px-3 py-1 rounded-full bg-slate-900/80 hover:bg-slate-900 text-slate-300 hover:text-white text-[11px] font-medium border border-slate-700/80 backdrop-blur-md shadow-md flex items-center gap-1 transition-all"
                >
                  {isDockCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  <span>{isDockCollapsed ? 'Show 3D Controls' : 'Cinema Mode'}</span>
                </button>
              </div>

              {!isDockCollapsed && (
                <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3 rounded-2xl shadow-2xl flex flex-wrap items-center justify-between gap-3 text-xs text-white">
                  {/* Camera Views */}
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
                      Camera:
                    </span>
                    {(['isometric', 'perspective', 'top', 'courtyard'] as const).map((view) => (
                      <button
                        key={view}
                        onClick={() => handleCameraChange(view)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                          cameraView === view
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                        }`}
                      >
                        {view}
                      </button>
                    ))}
                  </div>

                  {/* Roof Toggle */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleToggleRoof}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        showRoof
                          ? 'bg-amber-600/80 text-white hover:bg-amber-600'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>{showRoof ? 'Roof On' : 'Roof Cutaway'}</span>
                    </button>

                    {/* Lighting Presets */}
                    <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                      {(['morning', 'noon', 'sunset'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => handleTimeOfDayChange(t)}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize transition-all ${
                            timeOfDay === t ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Locked State Notice */
          <div className="max-w-md mx-auto p-8 text-center bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl text-white space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto shadow-lg">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">3D Conceptual Model is Locked</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Under BuildMind governance rules, 3D volumetric generation is unlocked strictly after the homeowner validates and explicitly confirms the current 2D plan revision.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-left text-xs space-y-1.5 text-slate-300">
              <div className="flex items-center justify-between text-slate-400">
                <span>Plan Revision:</span>
                <span className="font-bold text-white">v{currentProject.planRevisionStatus.currentRevision || 1}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Validation:</span>
                <span className={currentProject.planRevisionStatus.structuralGridValidated ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                  {currentProject.planRevisionStatus.structuralGridValidated ? 'Passed' : 'Pending Validation'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Homeowner Digital Stamp:</span>
                <span className="text-rose-400 font-semibold">Not Stamped</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('homeowner_2d_confirmation')}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-700/30 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-200" />
              <span>Go to Final 2D Confirmation Screen</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
