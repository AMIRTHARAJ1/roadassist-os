/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Wrench, ShieldCheck, Car, Users, LogOut, ArrowRightLeft, 
  Sparkles, Mail, MapPin, Phone, Github, GraduationCap, ArrowUpRight, MessageSquare, Info
} from 'lucide-react';
import { UserRole, BreakdownReport, NotificationAlert } from './types';
import LoginModule from './components/LoginModule';
import CustomerDashboard from './components/CustomerDashboard';
import AdminDashModule from './components/AdminDashModule';
import MechanicPortal from './components/MechanicPortal';
import { INITIAL_NOTIFICATIONS, INITIAL_REPORTS } from './mockData';
import { supabase } from './supabaseClient';

export default function App() {
  const [user, setUser] = useState<{ name: string; email: string; role: UserRole } | null>(null);
  
  // Unified Global Request State (enables real-time cross-role interactive simulation!)
  const [activeRequest, setActiveRequestState] = useState<BreakdownReport | null>(null);
  const [serviceHistory, setServiceHistory] = useState<BreakdownReport[]>(INITIAL_REPORTS);
  const [notifications, setNotificationsState] = useState<NotificationAlert[]>(INITIAL_NOTIFICATIONS);

  React.useEffect(() => {
    const fetchInitialData = async () => {
      // 1. Check for existing Supabase auth session (Crucial for Google OAuth redirects)
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        const pendingRole = localStorage.getItem('pending_oauth_role') as UserRole || session.user.user_metadata?.role || 'customer';
        
        // If new OAuth login without a role, save it to their metadata
        if (!session.user.user_metadata?.role && localStorage.getItem('pending_oauth_role')) {
          await supabase.auth.updateUser({ data: { role: pendingRole } });
        }

        setUser({
          name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          role: pendingRole
        });
        localStorage.removeItem('pending_oauth_role');
      }

      // 2. Listen to auth state changes (handles the moment they return from Google)
      supabase.auth.onAuthStateChange((_event, session) => {
         if (session && session.user) {
            const r = session.user.user_metadata?.role || localStorage.getItem('pending_oauth_role') || 'customer';
            setUser({
              name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              role: r as UserRole
            });
         }
      });

      // 3. Fetch Mocked/DB Data
      const { data: reportsData } = await supabase.from('breakdown_reports').select('*').order('requestedAt', { ascending: false });
      if (reportsData && reportsData.length > 0) {
        setServiceHistory(reportsData as BreakdownReport[]);
        // Optionally find the active request
        const active = reportsData.find(r => !['completed', 'cancelled'].includes(r.status));
        if (active) setActiveRequestState(active as BreakdownReport);
      }

      const { data: notifData } = await supabase.from('notifications').select('*').order('timestamp', { ascending: false });
      if (notifData && notifData.length > 0) {
        setNotificationsState(notifData as NotificationAlert[]);
      }
    };
    fetchInitialData();
  }, []);

  const setActiveRequest: React.Dispatch<React.SetStateAction<BreakdownReport | null>> = (value) => {
    const nextVal = typeof value === 'function' ? value(activeRequest) : value;
    setActiveRequestState(nextVal);
    if (nextVal) {
      supabase.from('breakdown_reports').upsert(nextVal).then(({ error }) => {
        if (error) console.error('Error upserting active request:', error);
      });
    }
  };

  const setNotifications: React.Dispatch<React.SetStateAction<NotificationAlert[]>> = (value) => {
    const nextVal = typeof value === 'function' ? value(notifications) : value;
    setNotificationsState(nextVal);
    if (nextVal && nextVal.length > 0) {
      // Upsert the newest notification
      supabase.from('notifications').upsert(nextVal[0]).then(({ error }) => {
         if (error) console.error('Error upserting notification:', error);
      });
    }
  };

  // About Us / Contact Us modals or custom page toggles
  const [showAboutUs, setShowAboutUs] = useState(false);
  const [showContactUs, setShowContactUs] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', msg: '', success: false });

  const handleLoginSuccess = (loggedInUser: { name: string; email: string; role: UserRole }) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    // Attempt real supabase signout in background
    supabase.auth.signOut().catch(err => {
      console.warn("Failed to sign out from Supabase:", err);
    });
    // Always clear local state instantly for a snappy UI
    setUser(null);
  };

  const handleRoleSwap = (newRole: UserRole) => {
    if (!user) return;
    setUser({
      ...user,
      role: newRole,
      name: newRole === 'admin' ? 'Super Admin Desk' : 
            newRole === 'mechanic' ? 'Rajesh Kumar (Technician)' : 'Amirtharaj'
    });
  };

  const addHistoryLog = (report: BreakdownReport) => {
    setServiceHistory([report, ...serviceHistory]);
    supabase.from('breakdown_reports').upsert(report).then(({ error }) => {
      if (error) console.error('Error upserting to history log:', error);
    });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactForm({ ...contactForm, success: true });
    setTimeout(() => {
      setContactForm({ name: '', email: '', msg: '', success: false });
      setShowContactUs(false);
      alert('Support Message Dispatched. We will reply shortly via registered credentials.');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      
      {/* GLOBAL MASTER BAR (Displays project title and multi-role switch toolbar) */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-md relative">
              <Wrench className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-orange-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold">
                OS
              </div>
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight text-slate-900 flex items-center gap-1.5 leading-none">
                RoadAssist OS
              </h1>
              <span className="text-[10px] text-slate-400 font-medium tracking-tight mt-1 inline-block uppercase block">
                Breakdown Detection Console
              </span>
            </div>
          </div>

          {user ? (
            <div className="flex items-center gap-4">
              {/* Connected User ID & Logout */}
              <div className="flex items-center gap-2 border-l border-slate-100 pl-4">
                <span className="text-xs font-bold text-slate-700 hidden sm:inline">
                  {user.name.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-1.5 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 text-slate-500 rounded-lg transition border border-slate-150 cursor-pointer"
                  title="Sign Out Session"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-4">
              <button 
                onClick={() => setShowAboutUs(true)}
                className="text-xs text-slate-500 hover:text-blue-600 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Info className="w-4" /> About Research Project
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTAINER ZONE */}
      <main className="flex-1 w-full bg-slate-50">
        {!user ? (
          <LoginModule onLoginSuccess={handleLoginSuccess} />
        ) : user.role === 'customer' ? (
          <CustomerDashboard
            userName={user.name}
            userEmail={user.email}
            activeRequest={activeRequest}
            setActiveRequest={setActiveRequest}
            addHistoryLog={addHistoryLog}
            serviceHistory={serviceHistory}
            notifications={notifications}
            setNotifications={setNotifications}
          />
        ) : user.role === 'mechanic' ? (
          <MechanicPortal
            userName={user.name}
            activeRequest={activeRequest}
            setActiveRequest={setActiveRequest}
            addHistoryLog={addHistoryLog}
          />
        ) : (
          <AdminDashModule onRoleSwitch={handleRoleSwap} />
        )}
      </main>

      {/* ABOUT US MODAL/PANEL */}
      {showAboutUs && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-100 shadow-2xl p-6 md:p-8 space-y-4 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50 text-blue-100 rounded-full -mr-6 -mt-6 flex items-center justify-center">
              <GraduationCap className="w-12 h-12" />
            </div>

            <div className="space-y-1.5 relative z-10">
              <span className="text-[10px] bg-blue-50 text-blue-700 font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                Research Context
              </span>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                Enhancing Real-Time On-Road Vehicle Breakdown Detection and Roadside Assistance Management
              </h3>
              <p className="text-xs text-slate-500 font-medium">Final-Year Engineering Project Capstone</p>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3.5 text-xs text-slate-600 leading-relaxed font-sans">
              <p>
                <strong>System Hypothesis:</strong> Traditional vehicle diagnostic models operate in silos. This solution deploys a connected, real-time geolocation dispatcher model that bridges vehicle breakdown states directly to the nearest standby mechanics with tow platform compatibility.
              </p>
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl text-[11px]">
                <div>
                  <span className="font-bold text-slate-800 block">Core Technologies</span>
                  <span className="text-slate-500">React 18 • TypeScript • Tailwind v4 • Real-Time GPS Tracking Telemetry Simulator</span>
                </div>
                <div>
                  <span className="font-bold text-slate-800 block">Investigator Desk</span>
                  <span className="text-slate-500">Amirtharaj & Standby Responders Team</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowAboutUs(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Close Project Overview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT US MODAL / FORM */}
      {showContactUs && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-100 shadow-2xl p-6 space-y-5">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-base font-bold text-slate-800">Operational Support Desk</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Submit immediate queries to our system coordinators.</p>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-3 text-xs font-semibold text-slate-700">
              <div className="space-y-1">
                <label>Contact Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Amirtharaj" 
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full p-2 border border-slate-200 bg-slate-50 rounded-lg outline-none"
                />
              </div>

              <div className="space-y-1">
                <label>Registered Driver Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@roadassist.org" 
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full p-2 border border-slate-200 bg-slate-50 rounded-lg outline-none"
                />
              </div>

              <div className="space-y-1">
                <label>Query specifics / Diagnostic details</label>
                <textarea 
                  required
                  placeholder="What assistance question exists?" 
                  rows={3} 
                  value={contactForm.msg}
                  onChange={(e) => setContactForm({ ...contactForm, msg: e.target.value })}
                  className="w-full p-2 border border-slate-200 bg-slate-50 rounded-lg outline-none resize-none"
                ></textarea>
              </div>

              <div className="pt-2 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowContactUs(false)}
                  className="px-4 py-2 hover:bg-slate-100 text-slate-600 font-bold rounded-xl border border-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition cursor-pointer"
                >
                  Submit Query
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CLEAN FOOTER DESIGN */}
      <footer className="bg-slate-900 text-slate-400 py-10 mt-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold shadow">
                ⚓
              </div>
              <span className="font-bold text-white tracking-tight">RoadAssist OS</span>
            </div>
            <p className="leading-relaxed text-[11px] text-slate-450 pr-4">
              Designed as a comprehensive real-time web application UI for project named "Enhancing Real-Time On-Road Vehicle Breakdown Detection and Roadside Assistance Management". Highly responsive user, mechanic, and admin nodes.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2">
            <h4 className="font-bold text-white uppercase tracking-widest text-[9px]">Research Desk</h4>
            <div className="space-y-1 text-[11px]">
              <button 
                onClick={() => setShowAboutUs(true)}
                className="hover:text-amber-400 transition block text-left underline"
              >
                About capstone Project goals
              </button>
              <button 
                onClick={() => setShowContactUs(true)}
                className="hover:text-amber-400 transition block text-left underline"
              >
                Contact Research Coordinator
              </button>
            </div>
          </div>

          <div className="md:col-span-4 space-y-2 font-medium">
            <h4 className="font-bold text-white uppercase tracking-widest text-[9px]">Compliance & SSL Protocols</h4>
            <div className="space-y-1.5 text-[11px]">
              <p className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Encrypted GPS handshake telemetry (TLS-1.3)</span>
              </p>
              <p className="text-[10px] text-slate-500 leading-normal">
                Complies with on-spot breakdown dispatch safety and diagnostic management regulations. All Rights Reserved © 2026.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
