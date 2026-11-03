import React, { useState } from 'react';
import {
  User,
  MapPin,
  Building2,
  Phone,
  Mail,
  Shield,
  FileText,
  Calendar,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { HomeownerUser, ConstructionProject } from '../../../types';
import { StorageService, formatLKR } from '../../../services/storageService';

interface HomeownerProfileModuleProps {
  currentHomeowner: HomeownerUser;
  currentProject: ConstructionProject | null;
  onHomeownerUpdated: (homeowner: HomeownerUser) => void;
}

export const HomeownerProfileModule: React.FC<HomeownerProfileModuleProps> = ({
  currentHomeowner,
  currentProject,
  onHomeownerUpdated,
}) => {
  const [name, setName] = useState(currentHomeowner.name);
  const [phone, setPhone] = useState(currentHomeowner.phone);
  const [propertyAddress, setPropertyAddress] = useState(currentHomeowner.propertyAddress);
  const [plotSizePerches, setPlotSizePerches] = useState(currentHomeowner.plotSizePerches);
  const [localCouncilAuthority, setLocalCouncilAuthority] = useState(currentHomeowner.localCouncilAuthority);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const homeowners = StorageService.getHomeowners();
    const updatedHomeowner: HomeownerUser = {
      ...currentHomeowner,
      name,
      phone,
      propertyAddress,
      plotSizePerches,
      localCouncilAuthority,
    };

    const newHomeowners = homeowners.map((h) => (h.id === currentHomeowner.id ? updatedHomeowner : h));
    StorageService.saveHomeowners(newHomeowners);
    onHomeownerUpdated(updatedHomeowner);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Homeowner Profile & Land Title</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your registered Sri Lankan property particulars, municipal boundary, and contact coordinates.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          Client Account
        </span>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile particulars successfully saved to browser local store.</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-2xl flex items-center justify-center shadow-md shadow-blue-700/20">
            {currentHomeowner.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{currentHomeowner.name}</h3>
            <p className="text-xs text-slate-500">{currentHomeowner.email}</p>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1 inline-block">
              Verified Homeowner
            </span>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number (Sri Lanka)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Property Address / Site Location
            </label>
            <input
              type="text"
              value={propertyAddress}
              onChange={(e) => setPropertyAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Land Extent in Perches
              </label>
              <input
                type="number"
                step="0.1"
                value={plotSizePerches}
                onChange={(e) => setPlotSizePerches(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Local Planning Council
              </label>
              <input
                type="text"
                value={localCouncilAuthority}
                onChange={(e) => setLocalCouncilAuthority(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile Updates</span>
          </button>
        </div>
      </form>
    </div>
  );
};
