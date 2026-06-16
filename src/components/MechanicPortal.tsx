import React, { useState } from 'react';
import { 
  Wrench, Car, MapPin, PhoneCall, AlertTriangle, 
  CheckCircle, Play, ShieldAlert, Sparkles, Navigation, DollarSign
} from 'lucide-react';
import { BreakdownReport, RequestStatus } from '../types';

interface MechanicPortalProps {
  userName: string;
  activeRequest: BreakdownReport | null;
  setActiveRequest: React.Dispatch<React.SetStateAction<BreakdownReport | null>>;
  addHistoryLog: (report: BreakdownReport) => void;
}

export default function MechanicPortal({
  userName,
  activeRequest,
  setActiveRequest,
  addHistoryLog
}: MechanicPortalProps) {
  const [isOnDuty, setIsOnDuty] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  // Settle & Complete Mechanic job
  const handleNextStatus = () => {
    if (!activeRequest) return;

    let nextStatus: RequestStatus = 'accepted';
    if (activeRequest.status === 'accepted') nextStatus = 'dispatched';
    else if (activeRequest.status === 'dispatched') nextStatus = 'arrived';
    else if (activeRequest.status === 'arrived') nextStatus = 'in-progress';
    else if (activeRequest.status === 'in-progress') nextStatus = 'completed';

    const updated = {
      ...activeRequest,
      status: nextStatus,
      updatedAt: new Date().toISOString()
    };
    setActiveRequest(updated);
    
    setSuccessMsg(`Status updated to ${nextStatus.toUpperCase()} successfully.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeclineJob = () => {
    if (!activeRequest) return;
    setActiveRequest(null);
    setSuccessMsg('Incident ticket released back to dispatch desk.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      
      {/* Side Status Controller */}
      <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 font-bold shadow-inner">
              🔧
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Technician Fleet Link</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Heavy Duty Sweeper Rig</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl space-y-3">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Radio Beacon State</span>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${isOnDuty ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {isOnDuty ? 'Ready for Dispatch' : 'Radio Muted'}
                </span>
                
                {/* Switch btn */}
                <button
                  type="button"
                  onClick={() => setIsOnDuty(!isOnDuty)}
                  className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 outline-none cursor-pointer ${
                    isOnDuty ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                    isOnDuty ? 'translate-x-4' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>
            </div>

            <div className="space-y-1 text-slate-500 text-[11px] font-medium leading-relaxed">
              <p>✔ Automatic job pairing en-route actively locked.</p>
              <p>✔ Heavy flatbed winch and brake scanner logs online.</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 border-orange-100 p-4 rounded-xl text-center text-xs">
          <span className="font-mono text-[9px] text-orange-600 font-bold uppercase tracking-wider">Emergency Standby</span>
          <p className="font-semibold text-slate-700 mt-1">Responder #7 Rajesh</p>
        </div>
      </div>

      {/* Mechanic Operations Arena */}
      <div className="lg:col-span-9 space-y-6">
        
        {/* Main telemetry status */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <span className="inline-flex items-center gap-1.5 px-2 px-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-850 border border-orange-200 uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Shift Feed Active
          </span>
          <h2 className="text-xl font-bold text-slate-850">Connected Dispatch Stream and Job HUD</h2>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            As clients request emergency service actions en-route, safety hooks populate below in your active radio feed immediately. Open tickets to accept dispatches.
          </p>
        </div>

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle className="w-5.5 h-5.5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* INCOMING OR ACTIVE TICKET CONTAINER */}
        {!isOnDuty ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-xs text-slate-400">
            Please flip your "Ready for Dispatch" radio beacon to active mode on the side controller to connect to active highway breakdown telemetry channels.
          </div>
        ) : !activeRequest ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">No Active Roadside Calls</h3>
              <p className="text-xs text-slate-400 mt-1">
                Awaiting client dispatch commands. Switch role back to "Customer" to submit a mock breakdown incident and see it link here!
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 p-5 md:p-6 shadow-sm space-y-5">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[9px] bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold uppercase px-2.5 py-0.5 rounded-full shrink-0">
                  Active Dispatch Hook
                </span>
                <h3 className="text-base font-bold text-slate-800 mt-1.5">{activeRequest.vehicleName}</h3>
                <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-4.5 h-4.5 text-orange-500" />
                  <span>{activeRequest.locationName}</span>
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs block text-slate-400 font-bold">Payout Value</span>
                <span className="text-lg font-bold text-slate-900">₹{activeRequest.totalCost}</span>
              </div>
            </div>

            {/* Incident Details Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
              <div className="p-4 bg-slate-50/50 rounded-xl space-y-2.5">
                <div>
                  <span className="text-[9px] uppercase text-slate-400 block font-bold">Failure category</span>
                  <span className="font-bold text-orange-600 text-xs">{activeRequest.breakdownType}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-slate-400 block font-bold">Severity Risk</span>
                  <span className="font-bold text-rose-600 text-xs">{activeRequest.severity}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-slate-400 block font-bold">Client Description</span>
                  <p className="text-slate-600 font-medium leading-relaxed font-sans text-[11px] mt-0.5">"{activeRequest.description}"</p>
                </div>
              </div>

              {/* Status workflow updater */}
              <div className="p-4 bg-slate-50 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase text-slate-400 block font-bold">Active Hook Status</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping"></div>
                    <span className="font-bold text-orange-600 text-sm uppercase">{activeRequest.status}</span>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  {activeRequest.status !== 'completed' ? (
                    <>
                      <button
                        onClick={handleNextStatus}
                        className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase rounded-lg shadow cursor-pointer transition flex items-center justify-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Advanced status to: {
                          activeRequest.status === 'pending' ? 'Dispatch' :
                          activeRequest.status === 'accepted' ? 'Dispatched' :
                          activeRequest.status === 'dispatched' ? 'Arrived' :
                          activeRequest.status === 'arrived' ? 'Repair' :
                          'Completed'
                        }</span>
                      </button>
                      <button
                        onClick={handleDeclineJob}
                        className="w-full py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-[11px] uppercase rounded-lg transition"
                      >
                        Decline & release Incident
                      </button>
                    </>
                  ) : (
                    <div className="p-3 bg-emerald-50 text-emerald-800 text-[11px] text-center rounded-xl font-bold">
                      ✔ ASSIST ACTION CONCLUDED. Client is actively processing invoice settlement details.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Operations metrics in shift */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="block text-[10px] text-slate-400 font-semibold uppercase">Completed Jobs</span>
                <span className="font-bold text-slate-700">14 Jobs in shift</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="block text-[10px] text-slate-400 font-semibold uppercase">Total Earned</span>
                <span className="font-bold text-slate-700 flex items-center"><DollarSign className="w-3.5" /> 18,250 INR</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="block text-[10px] text-slate-400 font-semibold uppercase">Average Rating</span>
                <span className="font-bold text-amber-500">★ 4.88 / 5</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="block text-[10px] text-slate-400 font-semibold uppercase">GPS Coordinate</span>
                <span className="font-mono text-[10px] text-slate-700">12.9716, 77.5946</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
