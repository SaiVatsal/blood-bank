import React, { useState } from 'react';
import { useStore } from './store/useStore';
import {
  Droplet,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Send,
  Users,
  Building2,
  CheckCircle2,
  PlusCircle,
  PhoneCall,
  Activity,
  HeartHandshake,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function App() {
  const {
    activeTab,
    setActiveTab,
    selectedBloodFilter,
    setSelectedBloodFilter,
    inventory,
    donors,
    hospitalRequests,
    broadcasts,
    fulfillHospitalRequest,
    registerDonor,
    broadcastUrgentAlert
  } = useStore();

  // Donor Registration State
  const [donorName, setDonorName] = useState('');
  const [donorBlood, setDonorBlood] = useState('O-');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorLocation, setDonorLocation] = useState('Central District');

  const bloodTypes = ['All', 'O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  const filteredInventory = inventory.filter(i =>
    selectedBloodFilter === 'All' ? true : i.type === selectedBloodFilter
  );

  const totalUnits = inventory.reduce((sum, i) => sum + i.units, 0);
  const criticalCount = inventory.filter(i => i.status === 'Critical Low').length;

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!donorName.trim() || !donorPhone.trim()) return;
    registerDonor({
      name: donorName,
      bloodType: donorBlood,
      phone: donorPhone,
      location: donorLocation,
      lastDonatedDate: 'Never'
    });
    setDonorName('');
    setDonorPhone('');
  };

  return (
    <div className="min-h-screen bg-[#fffafb] text-stone-900 font-sans flex flex-col selection:bg-rose-700 selection:text-white">
      {/* Top Header */}
      <header className="bg-[#881337] text-white border-b border-rose-900 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-[#881337] flex items-center justify-center font-black shadow-md">
              <Droplet className="w-6 h-6 fill-current" />
            </div>
            <div>
              <span className="font-black text-xl text-white tracking-tight block leading-tight">HemaVault</span>
              <span className="text-[10px] text-rose-200 font-mono font-bold uppercase tracking-wider">
                NATIONAL BLOOD BANKING & EMERGENCY TRANSFUSION NETWORK
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-1 bg-[#4c0519] p-1 rounded-2xl border border-rose-950 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('inventory')}
                className={`px-3.5 py-1.5 rounded-xl transition ${
                  activeTab === 'inventory' ? 'bg-rose-600 text-white shadow-sm font-bold' : 'text-rose-200 hover:text-white'
                }`}
              >
                Vault Inventory
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                  activeTab === 'requests' ? 'bg-rose-600 text-white shadow-sm font-bold' : 'text-rose-200 hover:text-white'
                }`}
              >
                Hospital STAT ({hospitalRequests.filter(r => r.status === 'Pending Dispatch').length})
              </button>
              <button
                onClick={() => setActiveTab('donors')}
                className={`px-3.5 py-1.5 rounded-xl transition ${
                  activeTab === 'donors' ? 'bg-rose-600 text-white shadow-sm font-bold' : 'text-rose-200 hover:text-white'
                }`}
              >
                Donor Registry ({donors.length})
              </button>
            </nav>

            <button
              onClick={() => setActiveTab('register-donor')}
              className="px-4 py-2 bg-white text-[#881337] hover:bg-rose-50 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md"
            >
              <PlusCircle className="w-4 h-4" /> Register Donor
            </button>
          </div>
        </div>
      </header>

      {/* Low Stock Emergency Banner */}
      {criticalCount > 0 && (
        <div className="bg-rose-100 border-b border-rose-200 px-4 py-2.5 text-xs text-rose-950 flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-700 animate-bounce" />
            <span className="font-bold">CRITICAL SUPPLY DEFICIT:</span>
            <span>{criticalCount} blood types currently below emergency safety thresholds (O-, B-, AB-).</span>
          </div>
          <span className="font-bold text-rose-800">AUTOMATED STAT PAGING ACTIVE</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* INVENTORY DASHBOARD */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-rose-100 pb-3">
              <div>
                <h1 className="text-2xl font-black text-[#881337]">Cryogenic Blood Reserve Vault</h1>
                <p className="text-xs text-stone-500 font-mono">Total Verified Cryo-Preserved Units: <strong className="text-stone-900">{totalUnits} Units</strong></p>
              </div>

              <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-rose-200">
                {bloodTypes.map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedBloodFilter(t)}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition ${
                      selectedBloodFilter === t
                        ? 'bg-[#881337] text-white shadow-sm'
                        : 'text-rose-950 hover:bg-rose-50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Blood Type Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {filteredInventory.map(item => {
                const isCrit = item.status === 'Critical Low';
                const pct = Math.min(100, Math.round((item.units / item.target) * 100));

                return (
                  <div
                    key={item.type}
                    className={`bg-white rounded-3xl border p-6 shadow-sm space-y-4 flex flex-col justify-between transition ${
                      isCrit ? 'border-rose-400 ring-2 ring-rose-500/20' : 'border-rose-100'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center font-black text-xl text-[#881337]">
                          {item.type}
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          isCrit ? 'bg-rose-600 text-white' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      <div>
                        <div className="flex justify-between items-baseline font-mono">
                          <span className="text-3xl font-black text-stone-900">{item.units}</span>
                          <span className="text-xs text-stone-400">Target: {item.target} Units</span>
                        </div>
                        {item.universalDonor && (
                          <span className="text-[10px] font-mono text-rose-600 font-bold block mt-1">★ UNIVERSAL DONOR TYPE</span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="w-full h-2 bg-rose-50 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isCrit ? 'bg-rose-600' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-mono text-stone-400 block text-right">Cold Storage: {item.shelfLifeDays}d max</span>
                      </div>
                    </div>

                    <button
                      onClick={() => broadcastUrgentAlert(item.type)}
                      className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-[#881337] border border-rose-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5 text-rose-600" /> Broadcast STAT Call
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Broadcast Feed */}
            {broadcasts.length > 0 && (
              <div className="bg-white rounded-3xl border border-rose-100 p-6 shadow-sm space-y-3">
                <h3 className="font-bold text-sm text-[#881337] font-mono uppercase">Emergency Broadcast Transmissions</h3>
                <div className="space-y-2">
                  {broadcasts.map(bc => (
                    <div key={bc.id} className="p-3 bg-rose-50 rounded-2xl border border-rose-100 text-xs font-mono text-rose-900 flex justify-between items-center">
                      <span>{bc.message}</span>
                      <span className="text-rose-400 shrink-0">{bc.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* HOSPITAL STAT REQUESTS */}
        {activeTab === 'requests' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="border-b border-rose-100 pb-3">
              <h2 className="font-black text-2xl text-[#881337]">Hospital Emergency Transfusion Orders</h2>
              <p className="text-xs text-stone-500 font-mono">Real-time ICU and trauma center requisitions with instant inventory fulfillment</p>
            </div>

            <div className="space-y-4">
              {hospitalRequests.map(req => (
                <div key={req.id} className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                        req.urgency.includes('STAT') ? 'bg-rose-600 text-white' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {req.urgency}
                      </span>
                      <span className="text-xs text-stone-400 font-mono">{req.timeRequested}</span>
                    </div>

                    <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#881337]" /> {req.hospital}
                    </h3>
                    <p className="text-xs text-stone-600 font-mono">Department: {req.department}</p>
                    <div className="text-xs font-mono text-[#881337] font-bold">
                      Requested: {req.unitsRequested} Units of Blood Type <span className="underline">{req.bloodType}</span>
                    </div>
                  </div>

                  <div>
                    {req.status === 'Pending Dispatch' ? (
                      <button
                        onClick={() => fulfillHospitalRequest(req.id)}
                        className="px-6 py-3 bg-[#881337] hover:bg-[#4c0519] text-white font-bold rounded-2xl text-xs shadow-md transition flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Dispatch Transfusion Units
                      </button>
                    ) : (
                      <span className="px-4 py-2 bg-emerald-100 text-emerald-800 font-mono font-bold text-xs rounded-xl flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Fulfilled & Dispatched
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DONOR REGISTRY TAB */}
        {activeTab === 'donors' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="border-b border-rose-100 pb-3">
              <h2 className="font-black text-2xl text-[#881337]">National Blood Donor Roster</h2>
              <p className="text-xs text-stone-500 font-mono">Verified donors tracked with 56-day cooldown intervals and historical contribution logs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {donors.map(donor => (
                <div key={donor.id} className="bg-white p-5 rounded-3xl border border-rose-100 shadow-sm space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center font-black text-sm text-[#881337]">
                        {donor.bloodType}
                      </span>
                      <span className="text-xs font-mono text-stone-400">{donor.id}</span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-stone-900">{donor.name}</h4>
                      <p className="text-[11px] text-stone-500 font-mono">{donor.phone}</p>
                      <p className="text-[11px] text-stone-500 font-mono">{donor.location}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-rose-50 text-xs font-mono">
                    <div className="flex justify-between text-stone-500">
                      <span>Total Given:</span>
                      <strong className="text-stone-900">{donor.totalDonations}x</strong>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span>Status:</span>
                      {donor.daysUntilEligible === 0 ? (
                        <span className="text-emerald-600 font-bold">Eligible Now ✓</span>
                      ) : (
                        <span className="text-amber-600 font-bold">Cooldown ({donor.daysUntilEligible}d)</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REGISTER DONOR TAB */}
        {activeTab === 'register-donor' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="border-b border-rose-100 pb-3">
              <h2 className="font-black text-2xl text-[#881337]">Register New Lifesaving Donor</h2>
              <p className="text-xs text-stone-500 font-mono">Join the emergency donor pool for automated priority alerts</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-sm space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-stone-700 font-bold">Donor Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rachel Adams"
                  value={donorName}
                  onChange={e => setDonorName(e.target.value)}
                  className="w-full bg-rose-50/40 border border-rose-200 rounded-xl p-2.5 text-stone-900 focus:outline-none focus:border-rose-600 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-stone-700 font-bold">Blood Type</label>
                  <select
                    value={donorBlood}
                    onChange={e => setDonorBlood(e.target.value)}
                    className="w-full bg-rose-50/40 border border-rose-200 rounded-xl p-2.5 text-stone-900 focus:outline-none focus:border-rose-600"
                  >
                    {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-stone-700 font-bold">Mobile Phone (For STAT SMS)</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={donorPhone}
                    onChange={e => setDonorPhone(e.target.value)}
                    className="w-full bg-rose-50/40 border border-rose-200 rounded-xl p-2.5 text-stone-900 focus:outline-none focus:border-rose-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-700 font-bold">Home / Work Metro District</label>
                <input
                  type="text"
                  value={donorLocation}
                  onChange={e => setDonorLocation(e.target.value)}
                  className="w-full bg-rose-50/40 border border-rose-200 rounded-xl p-2.5 text-stone-900 focus:outline-none focus:border-rose-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#881337] hover:bg-[#4c0519] text-white font-bold rounded-xl shadow-md transition"
                >
                  Confirm Registration & Enroll in Donor Pool
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-rose-100 bg-white py-6 px-4 text-center text-xs font-mono text-[#881337]/60">
        HEMAVAULT • EMERGENCY TRANSFUSION MATRIX • CRITICAL BLOOD BANKING NETWORK
      </footer>
    </div>
  );
}
