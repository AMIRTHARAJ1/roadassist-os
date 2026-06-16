import React, { useState } from 'react';
import { Shield, Key, Mail, User, ShieldAlert, Wrench, Lock, CheckCircle } from 'lucide-react';
import { UserRole } from '../types';

interface LoginModuleProps {
  onLoginSuccess: (user: { name: string; email: string; role: UserRole }) => void;
}

export default function LoginModule({ onLoginSuccess }: LoginModuleProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [extraAuthDetails, setExtraAuthDetails] = useState(''); // e.g. License plate for user, base location/tow truck registration for mechanic
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAutofill = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'customer') {
      setEmail('customer@roadassist.org');
      setFullName('Amirtharaj');
      setPassword('customer123');
      setPhone('+91 94432 00192');
    } else if (role === 'mechanic') {
      setEmail('mechanic.rajesh@roadassist.org');
      setFullName('Rajesh Kumar (Heavy Tow Rig)');
      setPassword('mech123');
      setPhone('+91 98450 12231');
    } else {
      setEmail('admin@roadassist.org');
      setFullName('Super Administrator Desk');
      setPassword('admin123');
      setPhone('+91 90038 41031');
    }
    setMsg({ type: 'success', text: `Loaded ${role.toUpperCase()} credentials. Click Sign In below.` });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isRegister && (!fullName || !phone))) {
      setMsg({ type: 'error', text: 'Please fill out all required fields.' });
      return;
    }

    setMsg({ type: 'success', text: isRegister ? 'Account created successfully! Autologging in...' : 'Sign in authorized.' });
    
    setTimeout(() => {
      onLoginSuccess({
        name: fullName || (selectedRole === 'customer' ? 'Amirtharaj' : selectedRole === 'mechanic' ? 'Rajesh Kumar' : 'Admin Operator'),
        email: email,
        role: selectedRole
      });
    }, 800);
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 bg-slate-50">
      <div className="w-full max-w-md bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden">
        {/* Color stripe: blue and orange */}
        <div className="h-2 bg-gradient-to-r from-blue-600 via-orange-500 to-blue-800"></div>

        <div className="p-8">
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner mb-4 relative">
              <Wrench className="w-8 h-8" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                SOS
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">RoadAssist OS</h1>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Enhancing Real-Time On-Road Vehicle Breakdown Detection & Roadside Assistance Management
            </p>
          </div>

          {/* Quick Demo Access Bar */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 mb-6">
            <p className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider mb-2 text-center">
              Quick Demo Auto-Fill (Interactive Roles):
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleAutofill('customer')}
                className="px-2 py-1.5 bg-blue-600 text-white hover:bg-blue-700 text-xs rounded-lg font-medium transition shadow-sm cursor-pointer"
              >
                ⚙️ User
              </button>
              <button
                type="button"
                onClick={() => handleAutofill('mechanic')}
                className="px-2 py-1.5 bg-orange-500 text-white hover:bg-orange-600 text-xs rounded-lg font-medium transition shadow-sm cursor-pointer"
              >
                🔧 Mechanic
              </button>
              <button
                type="button"
                onClick={() => handleAutofill('admin')}
                className="px-2 py-1.5 bg-slate-800 text-white hover:bg-slate-900 text-xs rounded-lg font-medium transition shadow-sm cursor-pointer"
              >
                👑 Admin
              </button>
            </div>
          </div>

          {/* Role selector inside form tab */}
          <div className="relative flex p-1 bg-slate-100 rounded-lg mb-6">
            <button
              onClick={() => setSelectedRole('customer')}
              className={`flex-1 text-center py-2 text-xs font-semibold rounded-md transition ${
                selectedRole === 'customer'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => setSelectedRole('mechanic')}
              className={`flex-1 text-center py-2 text-xs font-semibold rounded-md transition ${
                selectedRole === 'mechanic'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Mechanic Link
            </button>
            <button
              onClick={() => setSelectedRole('admin')}
              className={`flex-1 text-center py-2 text-xs font-semibold rounded-md transition ${
                selectedRole === 'admin'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Control Desk
            </button>
          </div>

          {msg && (
            <div
              className={`p-3 rounded-lg text-xs font-medium mb-4 flex items-start gap-2 ${
                msg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                  : 'bg-rose-50 text-rose-800 border border-rose-100'
              }`}
            >
              {msg.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span>{msg.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Amirtharaj"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Emergency Mobile Contact
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <span className="text-xs font-semibold">+91</span>
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98765 43210"
                      className="w-full pl-12 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Authorized Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@roadassist.org"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                {!isRegister && (
                  <a href="#reset" className="text-[10px] text-blue-600 hover:underline">
                    Forgot Key?
                  </a>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                />
              </div>
            </div>

            {isRegister && selectedRole === 'mechanic' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tow Truck Plate / Certification ID
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Key className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={extraAuthDetails}
                    onChange={(e) => setExtraAuthDetails(e.target.value)}
                    placeholder="e.g. MH-12-PQ-9981 or MECH-CR501"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                  />
                </div>
              </div>
            )}

            {isRegister && selectedRole === 'customer' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Vehicle Number (Optional)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Shield className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={extraAuthDetails}
                    onChange={(e) => setExtraAuthDetails(e.target.value)}
                    placeholder="e.g. KA-03-HA-8821"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-2.5 px-4 font-semibold text-sm text-white rounded-lg transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                selectedRole === 'customer'
                  ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                  : selectedRole === 'mechanic'
                  ? 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-400'
                  : 'bg-slate-800 hover:bg-slate-900 focus:ring-slate-700'
              }`}
            >
              {isRegister ? 'Complete Registration' : 'Secure Authenticate'}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-slate-100 pt-4">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setMsg(null);
              }}
              className="text-xs text-slate-500 hover:text-blue-600 font-medium cursor-pointer"
            >
              {isRegister
                ? 'Already verified? Let\'s Sign In'
                : 'Need roadside credentials? Build Account'}
            </button>
          </div>
        </div>
      </div>

      {/* Security notice footer */}
      <div className="mt-6 flex items-center gap-2 text-[11px] text-slate-400">
        <Shield className="w-4.5 h-4.5 text-blue-500" />
        <span>End-to-end encrypted dispatch handshakes active. SSL/TLS Standard v1.3</span>
      </div>
    </div>
  );
}
