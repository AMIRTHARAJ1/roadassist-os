import React, { useState } from 'react';
import { 
  Users, Wrench, FileBarChart2, Settings, ShieldCheck, 
  MapPin, CheckCircle, RefreshCw, XCircle, AlertCircle, ChevronRight, Bell, Sparkles, TrendingUp
} from 'lucide-react';
import { Mechanic, UserRole } from '../types';
import { INITIAL_MECHANICS, SYSTEM_METRICS } from '../mockData';

interface AdminDashModuleProps {
  onRoleSwitch?: (role: UserRole) => void;
}

export default function AdminDashModule({ onRoleSwitch }: AdminDashModuleProps) {
  const [adminTab, setAdminTab] = useState<'overview' | 'mechanics' | 'users' | 'reports' | 'settings'>('overview');
  const [mechanics, setMechanics] = useState<Mechanic[]>(INITIAL_MECHANICS);
  const [activeTheme, setActiveTheme] = useState<'professional-blue' | 'safety-orange' | 'clean-slate'>('professional-blue');
  const [metricUnit, setMetricUnit] = useState<'km' | 'miles'>('km');
  const [soundAlts, setSoundAlts] = useState(true);

  // Users Mock data
  const [users, setUsers] = useState([
    { id: 'usr-401', name: 'Amirtharaj', email: 'amirtharajk163@gmail.com', phone: '+91 94432 00192', joinDate: '2026-04-12', vehicles: 3, status: 'Active' },
    { id: 'usr-402', name: 'Jessica Miller', email: 'jess.m@yahoo.com', phone: '+91 80551 22891', joinDate: '2026-05-01', vehicles: 2, status: 'Active' },
    { id: 'usr-403', name: 'Nikhil Gowda', email: 'nikhil.g@gmail.com', phone: '+91 91129 00831', joinDate: '2026-05-18', vehicles: 1, status: 'Flagged' },
    { id: 'usr-404', name: 'Megha Sharma', email: 'megha.sharma@outlook.com', phone: '+91 88432 11993', joinDate: '2026-05-30', vehicles: 2, status: 'Active' }
  ]);

  const [alerts, setAlerts] = useState([
    { id: 'al-1', text: 'Mechanic Rajesh Kumar completed order rep-101 (Battery Jump)', category: 'info' },
    { id: 'al-2', text: 'Monsoon flash alert activated for Silk Board sector', category: 'alert' }
  ]);

  const toggleMechanicAvailability = (id: string) => {
    setMechanics(mechanics.map(m => m.id === id ? { ...m, isAvailable: !m.isAvailable } : m));
  };

  const toggleUserStatus = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Flagged' : 'Active' } : u));
  };

  const handleApproveMechanic = (name: string) => {
    alert(`LICENSING DESK APPROVED: Mechanic ${name} certification documents verified post-hash audit.`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      
      {/* Admin Side Controls */}
      <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 bg-slate-150 rounded-xl flex items-center justify-center text-slate-800 font-bold shadow-inner">
              ⚓
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Master Control Admin</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase">System Console HUD</p>
            </div>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => setAdminTab('overview')}
              className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2.5 transition ${
                adminTab === 'overview' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>Control Overview</span>
            </button>

            <button
              onClick={() => setAdminTab('mechanics')}
              className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2.5 transition ${
                adminTab === 'mechanics' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Wrench className="w-4 h-4 shrink-0" />
              <span>Mechanic Registry</span>
            </button>

            <button
              onClick={() => setAdminTab('users')}
              className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2.5 transition ${
                adminTab === 'users' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>Customer Fleet</span>
            </button>

            <button
              onClick={() => setAdminTab('reports')}
              className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2.5 transition ${
                adminTab === 'reports' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <FileBarChart2 className="w-4 h-4 shrink-0" />
              <span>Reports & Analytics</span>
            </button>

            <button
              onClick={() => setAdminTab('settings')}
              className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2.5 transition ${
                adminTab === 'settings' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span>Operations Settings</span>
            </button>
          </div>
        </div>

        {/* Diagnostic Feeds */}
        <div className="bg-slate-900 text-slate-300 p-4 rounded-xl text-center space-y-2 text-xs">
          <div className="w-3 h-3 bg-emerald-500 rounded-full mx-auto animate-ping"></div>
          <p className="font-mono text-[9px] text-slate-400">SSL HANDSHAKE ACTIVE</p>
          <p className="font-bold">Port 3000 Pipeline</p>
        </div>
      </div>

      {/* Main Admin Panels */}
      <div className="lg:col-span-9 space-y-6">
        
        {/* TAB 1: OVERVIEW */}
        {adminTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Main diagnostic header card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-widest">
                <Sparkles className="w-3 h-3 text-indigo-600" /> Administrative Hub Active
              </span>
              <h2 className="text-xl font-bold text-slate-800">Assistance Performance & Response Coordinates</h2>
              <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                Aggregated system health feeds representing active tow vehicles, standby mechanics, and breakdown frequencies across the metropolitan highway grids.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Avg Arrival Lock</span>
                <h3 className="text-lg font-bold text-slate-800">{SYSTEM_METRICS.averageResponseMs} Mins</h3>
                <span className="text-[9px] text-emerald-600 font-semibold block">▲ 4% efficiency gains</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Responders</span>
                <h3 className="text-lg font-bold text-slate-800">{SYSTEM_METRICS.activeMechanics} Nodes</h3>
                <span className="text-[9px] text-indigo-600 font-semibold block">● Online and monitoring</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Customers</span>
                <h3 className="text-lg font-bold text-slate-800">{SYSTEM_METRICS.totalUsers} Clients</h3>
                <span className="text-[9px] text-emerald-600 font-semibold block">▲ 12% Month-Over-Month</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Tow Aggregate</span>
                <h3 className="text-lg font-bold text-slate-800">{SYSTEM_METRICS.towedAggregate} Incidents</h3>
                <span className="text-[9px] text-slate-400 font-semibold block">88 ongoing maintenance</span>
              </div>
            </div>

            {/* Alert Logs */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Active System Alert Register</h3>
              <div className="space-y-2">
                {alerts.map((al, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <AlertCircle className={`w-4 h-4 shrink-0 ${al.category === 'alert' ? 'text-rose-500' : 'text-blue-500'}`} />
                      <span className="text-slate-600 font-medium">{al.text}</span>
                    </div>
                    <span className="text-[9px] text-slate-400 font-semibold uppercase">Uplink verified</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hotspots & Regions block */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Highway Incident Hotspot Densities</h3>
                <p className="text-xs text-slate-400 mt-1">Identified sectors requesting maximum on-spot roadside dispatches.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SYSTEM_METRICS.regionalHotspots.map((h, i) => (
                  <div key={i} className="p-3 border border-slate-100 rounded-xl flex justify-between items-center bg-slate-50/50">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{h.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Report count: {h.count} incidents</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      h.rate === 'High' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                      h.rate === 'Medium' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {h.rate} Risk
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MECHANICS MANAGEMENT */}
        {adminTab === 'mechanics' && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Roadside Mechanics Registry</h2>
                <p className="text-xs text-slate-400 mt-0.5">Approve, monitor, and configure on-duty availability of rescue providers.</p>
              </div>
              <button
                onClick={() => handleApproveMechanic('New Candidate')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold shadow-sm transition"
              >
                Approve New Provider
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {mechanics.map((m) => (
                <div key={m.id} className="p-4 border border-slate-100 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
                  <div className="flex gap-3">
                    <img src={m.profileImg} alt={m.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-800">{m.name}</h4>
                        <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded">ID: {m.id}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 uppercase font-semibold">{m.vehicleDetails}</p>
                      
                      <div className="flex items-center gap-3 mt-2 text-slate-400 text-[10px]">
                        <span>★ {m.rating} ({m.reviewsCount} jobs)</span>
                        <span>• Phone: {m.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 border-t md:border-t-0 pt-3 md:pt-0">
                    <div className="text-right tracking-tight">
                      <p className="text-[10px] text-slate-400 font-bold">Duty Link Status</p>
                      <span className={`text-[11px] font-bold ${m.isAvailable ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {m.isAvailable ? 'Online Dispatch Mode' : 'Offline Duty'}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleMechanicAvailability(m.id)}
                      className={`px-3 py-1.5 font-bold rounded-lg transition text-[11px] cursor-pointer ${
                        m.isAvailable 
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200' 
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                    >
                      {m.isAvailable ? 'Force Go Offline' : 'Clear Duty Lock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: USERS LIST */}
        {adminTab === 'users' && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Customer Registered Fleet Base</h2>
              <p className="text-xs text-slate-400 mt-0.5">View driver account validations, emergency contacts, and active vehicles.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-2">License Username</th>
                    <th className="py-2">Email Desk</th>
                    <th className="py-2">Linked Mobile</th>
                    <th className="py-2 text-center">Vehicles</th>
                    <th className="py-2 text-center">Status Badge</th>
                    <th className="py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="py-3 font-bold text-slate-800">{u.name}</td>
                      <td className="py-3 text-slate-500">{u.email}</td>
                      <td className="py-3 text-slate-500 font-mono">{u.phone}</td>
                      <td className="py-3 text-center font-bold text-indigo-600">{u.vehicles}</td>
                      <td className="py-3 text-center">
                        <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          u.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => toggleUserStatus(u.id)}
                          className="text-[10px] font-bold text-slate-500 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 px-2 py-1 rounded"
                        >
                          Change Lock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: REPORTS & ANALYTICS (CUSTOM HIGH-FIDELITY AUTOMOTIVE CHARTS) */}
        {adminTab === 'reports' && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Telemetry Reports & Crash Analytics</h2>
              <p className="text-xs text-slate-400 mt-1">Incident frequencies and success rate mapping en-route.</p>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="p-4 border border-slate-100 rounded-xl space-y-4">
              <div className="flex justify-between items-center text-xs">
                <h3 className="font-bold text-slate-700">1. Breakdown Frequencies by Incident Type (Monthly)</h3>
                <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">Static aggregates</span>
              </div>

              {/* Styled Bar Graph */}
              <div className="space-y-3.5 pt-2">
                {[
                  { label: 'Engine smoke Fails', count: 42, color: 'bg-rose-500', pct: '42%' },
                  { label: 'Flat Tires', count: 58, color: 'bg-blue-500', pct: '58%' },
                  { label: 'Battery No-cranks', count: 31, color: 'bg-amber-500', pct: '31%' },
                  { label: 'Brake Line Fails', count: 18, color: 'bg-indigo-500', pct: '18%' },
                  { label: 'Lockout Keys', count: 12, color: 'bg-teal-500', pct: '12%' }
                ].map((bg, idx) => (
                  <div key={idx} className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-600">{bg.label}</span>
                      <span className="text-slate-800">{bg.count} dispatches</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div className={`h-full ${bg.color} rounded-full transition-all duration-1000`} style={{ width: bg.pct }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Animated Success Rate Coordinate Chart */}
            <div className="p-4 border border-slate-100 rounded-xl space-y-4 bg-slate-50/20">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <h3 className="font-bold text-slate-700">2. Response Success Rate En-Route (Percentage target: 95%)</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 text-[9px]">Calculated as dispatches with Sub-20 arrival latencies.</p>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold">
                  <TrendingUp className="w-4 h-4" />
                  <span>Avg: 97.4%</span>
                </div>
              </div>

              {/* Custom SVG Line drawing for metrics representation */}
              <div className="relative h-44 border-b border-l border-slate-200/80 pt-4 flex items-end justify-between px-6">
                
                {/* Horizontal reference lines */}
                <div className="absolute inset-y-10 inset-x-0 border-t border-dashed border-slate-100 pointer-events-none"></div>
                <div className="absolute inset-y-20 inset-x-0 border-t border-dashed border-slate-100 pointer-events-none"></div>

                {[
                  { month: 'Jan', rate: '92%', height: 'h-[72%]' },
                  { month: 'Feb', rate: '94%', height: 'h-[80%]' },
                  { month: 'Mar', rate: '97%', height: 'h-[92%]' },
                  { month: 'Apr', rate: '96%', height: 'h-[88%]' },
                  { month: 'May', rate: '98%', height: 'h-[96%]' },
                  { month: 'Jun', rate: '99%', height: 'h-[99%]' }
                ].map((pt, index) => (
                  <div key={index} className="flex flex-col items-center gap-2 relative z-10 w-12">
                    <span className="text-[9px] font-bold text-slate-500 bg-white shadow-sm border border-slate-200 px-1 py-0.5 rounded">{pt.rate}</span>
                    <div className={`w-3.5 bg-gradient-to-t from-indigo-700 to-indigo-500 rounded-t-sm transition-all duration-700 ${pt.height}`}></div>
                    <span className="text-[10px] font-bold text-slate-400 mt-1">{pt.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SETTINGS */}
        {adminTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-800">System Operations Configuration</h2>
              <p className="text-xs text-slate-400 mt-0.5">Tune global dispatch priorities, distance telemetry styles, and presets.</p>
            </div>

            <div className="space-y-6 text-xs font-semibold text-slate-700">
              {/* Preset theme switch */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-widest">Global Assist Palette Theme</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTheme('professional-blue')}
                    className={`py-2 px-3 border rounded-lg text-left transition flex items-center justify-between ${
                      activeTheme === 'professional-blue' ? 'border-blue-500 bg-blue-50/30 text-blue-800 font-bold' : 'border-slate-200 text-slate-500'
                    }`}
                  >
                    <span>Professional Corporate Blue</span>
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTheme('safety-orange')}
                    className={`py-2 px-3 border rounded-lg text-left transition flex items-center justify-between ${
                      activeTheme === 'safety-orange' ? 'border-orange-500 bg-orange-50/35 text-orange-800 font-bold' : 'border-slate-200 text-slate-500'
                    }`}
                  >
                    <span>High-Vis Safety Orange</span>
                    <span className="w-2.5 h-2.5 bg-orange-500 rounded-full"></span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTheme('clean-slate')}
                    className={`py-2 px-3 border rounded-lg text-left transition flex items-center justify-between ${
                      activeTheme === 'clean-slate' ? 'border-slate-800 bg-slate-50 text-slate-800 font-bold' : 'border-slate-200 text-slate-500'
                    }`}
                  >
                    <span>Minimalist Slate Carbon</span>
                    <span className="w-2.5 h-2.5 bg-slate-800 rounded-full"></span>
                  </button>
                </div>
              </div>

              {/* Metric system options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-widest text-[10px]">Distance Metrics Units</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setMetricUnit('km')}
                      className={`px-4 py-2 border rounded-lg font-bold text-xs ${
                        metricUnit === 'km' ? 'bg-slate-800 text-white' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      Kilometers (km)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMetricUnit('miles')}
                      className={`px-4 py-2 border rounded-lg font-bold text-xs ${
                        metricUnit === 'miles' ? 'bg-slate-800 text-white' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      Miles (mi)
                    </button>
                  </div>
                </div>

                {/* Alarm preferences */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-widest text-[10px]">Audio Alert System</label>
                  <button
                    type="button"
                    onClick={() => setSoundAlts(!soundAlts)}
                    className={`w-full py-2 px-3 border rounded-lg text-left flex justify-between items-center transition ${
                      soundAlts ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold' : 'border-slate-200 text-slate-400'
                    }`}
                  >
                    <span>Simulated Dispatch Klaxons</span>
                    <span>{soundAlts ? '✔ ENABLED' : '❌ MUTED'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => alert('Configuration parameters successfully synchronized to central dev server.')}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition shadow-sm"
              >
                Save Operations Config
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
