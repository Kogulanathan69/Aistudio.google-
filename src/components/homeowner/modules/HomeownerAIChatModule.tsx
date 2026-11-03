import React, { useState } from 'react';
import {
  MessageSquareCode,
  Send,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  FileCheck2,
  ArrowRight,
  Compass,
  Layers,
  Info,
} from 'lucide-react';
import { ConstructionProject, AIChatMessage, HomeownerModuleType } from '../../../types';
import { StorageService, formatLKR } from '../../../services/storageService';

interface HomeownerAIChatModuleProps {
  currentProject: ConstructionProject;
  onNavigate: (module: HomeownerModuleType) => void;
  onProjectUpdated: (project: ConstructionProject) => void;
}

const DEFAULT_CONVERSATION: AIChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'ai',
    text: `Ayubowan! I am your BuildMind Architectural Assistant. I see you are planning a residence in ${'Jaffna'}. To tailor the floor plan alternatives, let's explore your family lifestyle, spatial habits, and Sri Lankan tropical design preferences.`,
    timestamp: '10:00 AM',
    options: ['Family & Bedrooms', 'Kitchen Lifestyle', 'Medamidula Courtyard', 'Vastu & Climate'],
  },
  {
    id: 'msg-2',
    sender: 'ai',
    text: 'First, what is your preference for the Kitchen layout? In Sri Lankan tropical residences, many homeowners prefer a dual setup: a closed "wet kitchen" for heavy aromatic cooking and an open "dry pantry" adjoining the dining area.',
    timestamp: '10:01 AM',
    options: [
      'Dual Kitchen: Wet Kitchen + Open Dry Show Pantry',
      'Single large open-concept kitchen',
      'Traditional closed kitchen only',
    ],
    fieldExtracted: 'kitchenPreference',
  },
];

export const HomeownerAIChatModule: React.FC<HomeownerAIChatModuleProps> = ({
  currentProject,
  onNavigate,
  onProjectUpdated,
}) => {
  const [messages, setMessages] = useState<AIChatMessage[]>(
    currentProject.aiChatHistory && currentProject.aiChatHistory.length > 0
      ? currentProject.aiChatHistory
      : DEFAULT_CONVERSATION
  );
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Extracted Requirements local summary
  const [reqSummary, setReqSummary] = useState({
    bedrooms: currentProject.aiRequirementsStage.bedroomCount,
    bathrooms: currentProject.aiRequirementsStage.bathroomCount,
    storeys: currentProject.aiRequirementsStage.storeyCount,
    courtyard: currentProject.aiRequirementsStage.courtyardPreferred,
    vastu: currentProject.aiRequirementsStage.vastuOrientationPreferred,
    budget: currentProject.aiRequirementsStage.targetBudgetLKR,
    kitchen: 'Dual Wet & Dry Pantry',
    ventilation: 'Passive Cross-Ventilation with Timber Louvres',
  });

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: AIChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputVal('');
    setIsTyping(true);

    // AI automated conversational reply engine
    setTimeout(() => {
      let aiResponseText = '';
      let nextOptions: string[] | undefined = undefined;

      const lower = text.toLowerCase();
      if (lower.includes('kitchen') || lower.includes('wet') || lower.includes('dry')) {
        aiResponseText = 'Excellent choice. A dual kitchen keeps cooking heat and spice aromas separate while allowing an elegant show pantry for breakfast and family conversations. Next, what are your thoughts on an open-to-sky Medamidula courtyard?';
        nextOptions = [
          'Yes, central Medamidula with small water pond',
          'Yes, landscaped rock garden courtyard',
          'Covered skylight courtyard instead',
        ];
        setReqSummary((prev) => ({ ...prev, kitchen: text }));
      } else if (lower.includes('courtyard') || lower.includes('medamidula') || lower.includes('pond')) {
        aiResponseText = 'A Medamidula creates an internal micro-climate, drawing cooler ground breezes through the verandahs and flushing warm air upward through the roof vents. How would you like the master bedroom situated?';
        nextOptions = [
          'Ground Floor (Accessible & private garden view)',
          'First Floor (High ceiling & balcony overlooking courtyard)',
          'Strictly South-West (Vastu Niruthi orientation)',
        ];
        setReqSummary((prev) => ({ ...prev, courtyard: true }));
      } else if (lower.includes('master') || lower.includes('ground') || lower.includes('first') || lower.includes('vastu')) {
        aiResponseText = 'Understood. We will ensure the master suite satisfies your orientation preferences while ensuring quiet spatial buffering from the living pavilion. Would you like to review and confirm these requirements to update your project brief?';
        nextOptions = ['Confirm Requirements into Project Brief', 'Review 2D Plan Options'];
      } else {
        aiResponseText = `Noted: "${text}". I have logged this requirement in your architectural brief. Is there any specific outdoor verandah or car porch need for your ${currentProject.district} site?`;
        nextOptions = [
          'Double car porch with direct service entrance',
          'Expansive wrap-around verandah (Pil-potha)',
          'All looks good! Ready to generate brief',
        ];
      }

      const aiMsg: AIChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        options: nextOptions,
      };

      const finalMessages = [...newMessages, aiMsg];
      setMessages(finalMessages);
      setIsTyping(false);

      // Persist to storage
      const updated = StorageService.updateProjectAIRequirements(currentProject.id, finalMessages, {
        lifestylePromptSummary: `Client specified: ${reqSummary.kitchen}; Courtyard: ${reqSummary.courtyard ? 'Medamidula preferred' : 'No'}; Bedrooms: ${reqSummary.bedrooms}; Bathrooms: ${reqSummary.bathrooms}.`,
      });
      if (updated) {
        onProjectUpdated(updated);
      }
    }, 600);
  };

  const handleApplyToBrief = () => {
    const updated = StorageService.updateProjectBrief(
      currentProject.id,
      `Comprehensive architectural requirements synthesized from AI Lifestyle interview: ${reqSummary.bedrooms} bedrooms, ${reqSummary.bathrooms} bathrooms over ${reqSummary.storeys} floors in ${currentProject.district}. Featuring: ${reqSummary.kitchen}, ${reqSummary.courtyard ? 'Central open-sky Medamidula courtyard' : 'Conventional open layout'}, passive cooling design, and Vastu alignment. Budget target: ${formatLKR(reqSummary.budget)}.`,
      'Approved by Client'
    );
    if (updated) {
      onProjectUpdated(updated);
      onNavigate('homeowner_brief');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left 2 Cols: Chat Stream */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col h-[650px]">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-5 h-5 text-cyan-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">BuildMind AI Architectural Advisor</h3>
                <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Co-designing for {currentProject.title} ({currentProject.district})
              </p>
            </div>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div key={msg.id} className={`flex gap-3 ${isAi ? '' : 'flex-row-reverse'}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isAi
                      ? 'bg-[#132A48] text-white shadow-xs'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {isAi ? <Bot className="w-4 h-4 text-cyan-300" /> : <User className="w-4 h-4" />}
                </div>

                <div className={`max-w-[80%] ${isAi ? '' : 'text-right'}`}>
                  <div
                    className={`inline-block p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isAi
                        ? 'bg-slate-100 text-slate-900 rounded-tl-xs'
                        : 'bg-blue-600 text-white rounded-tr-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {msg.timestamp}
                  </span>

                  {/* Suggestion Chips */}
                  {isAi && msg.options && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {msg.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            if (opt.includes('Confirm Requirements')) {
                              handleApplyToBrief();
                            } else if (opt.includes('Review 2D Plan')) {
                              onNavigate('homeowner_plan_alternatives');
                            } else {
                              handleSend(opt);
                            }
                          }}
                          className="text-xs px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors font-medium text-left"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic">
              <Bot className="w-4 h-4 animate-bounce" />
              <span>Synthesizing architectural recommendations...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-100 flex items-center gap-2 bg-slate-50/50">
          <input
            type="text"
            placeholder="Type your preferences (e.g. 'I want high ceilings, a pooja room, and ground floor master bedroom')..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(inputVal)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm focus:outline-hidden focus:border-blue-600"
          />
          <button
            onClick={() => handleSend(inputVal)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right Col: Extracted Structured Requirements Panel */}
      <div className="space-y-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-blue-600" />
              <span>Extracted Requirements</span>
            </h4>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Sync
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kitchen Lifestyle</span>
              <span className="font-semibold text-slate-800">{reqSummary.kitchen}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Courtyard & Climate</span>
              <span className="font-semibold text-slate-800">
                {reqSummary.courtyard ? 'Medamidula Open Courtyard' : 'Standard Layout'}
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">{reqSummary.ventilation}</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
                <span className="text-[10px] text-slate-400 block font-semibold">Storeys</span>
                <span className="text-sm font-bold text-slate-800">{reqSummary.storeys}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
                <span className="text-[10px] text-slate-400 block font-semibold">Beds</span>
                <span className="text-sm font-bold text-slate-800">{reqSummary.bedrooms}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
                <span className="text-[10px] text-slate-400 block font-semibold">Baths</span>
                <span className="text-sm font-bold text-slate-800">{reqSummary.bathrooms}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Budget</span>
              <span className="font-bold text-base text-blue-700">{formatLKR(reqSummary.budget)}</span>
            </div>
          </div>

          <button
            onClick={handleApplyToBrief}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>Apply to Project Brief</span>
          </button>
        </div>

        <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-100 text-xs text-blue-900 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-blue-800">
            <Info className="w-4 h-4 text-blue-600" />
            <span>Next Architectural Stage</span>
          </div>
          <p className="text-[11px] leading-relaxed text-blue-800">
            Once confirmed, requirements flow directly to the <strong>Editable Project Brief</strong> and generate the 3 preliminary 2D Plan alternatives (Options A, B, and C).
          </p>
        </div>
      </div>
    </div>
  );
};
