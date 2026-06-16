import React, { useState, useEffect } from 'react';
import { 
  Car, Wrench, ShieldAlert, Plus, Trash2, MapPin, Navigation, 
  PhoneCall, Bell, Star, CreditCard, Clock, CheckCircle2, AlertTriangle, 
  User, Sparkles, ChevronRight, Share2, Printer, Map, ShieldCheck, RefreshCw, 
  Video, VideoOff, MessageSquare, Send, UploadCloud, Volume2, Lock, HelpCircle, 
  Settings, Languages, VolumeX, Eye, Minimize, Sliders, DollarSign, Activity
} from 'lucide-react';
import { Vehicle, Mechanic, BreakdownReport, BreakdownType, RequestStatus, NotificationAlert } from '../types';
import { INITIAL_VEHICLES, INITIAL_MECHANICS, CHENNAI_LOCATIONS, FAQS } from '../mockData';

interface CustomerDashboardProps {
  userName: string;
  userEmail: string;
  activeRequest: BreakdownReport | null;
  setActiveRequest: React.Dispatch<React.SetStateAction<BreakdownReport | null>>;
  addHistoryLog: (report: BreakdownReport) => void;
  serviceHistory: BreakdownReport[];
  notifications: NotificationAlert[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationAlert[]>>;
}

export default function CustomerDashboard({
  userName,
  userEmail,
  activeRequest,
  setActiveRequest,
  addHistoryLog,
  serviceHistory,
  notifications,
  setNotifications
}: CustomerDashboardProps) {
  // 11 Core Tabs capturing all required individual pages
  const [activeTab, setActiveTab] = useState<'dashboard' | 'report' | 'tracking' | 'nearby' | 'videocall' | 'payment' | 'vehicles' | 'history' | 'notifications' | 'settings' | 'profile'>('dashboard');

  // Vehicles state supporting official Tamil Nadu format selection
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [newVehicle, setNewVehicle] = useState({ brand: '', model: '', year: 2023, plate: 'TN 07 AH ', color: '', type: 'Car' as 'Car' });
  const [vehError, setVehError] = useState('');

  // Helper to map selected locations to coordinates on the Chennai vector map (0-100 percentage layout)
  const getLocationCoords = (loc: string) => {
    switch (loc) {
      case 'Guindy':
        return { x: 35, y: 48, name: 'Guindy Industrial Estate' };
      case 'Velachery':
        return { x: 62, y: 54, name: 'Velachery Bypass Road' };
      case 'Tambaram':
        return { x: 10, y: 75, name: 'Tambaram East GST Road' };
      case 'Adyar':
        return { x: 80, y: 35, name: 'Adyar Flyover / ECR' };
      case 'Porur':
        return { x: 15, y: 35, name: 'Porur Bypass Road' };
      case 'Anna Nagar':
        return { x: 32, y: 15, name: 'Anna Nagar Roundtana' };
      case 'T Nagar':
        return { x: 48, y: 22, name: 'T Nagar Usmaan Road' };
      case 'Sholinganallur':
        return { x: 78, y: 84, name: 'OMR IT Corridor' };
      case 'Pallavaram':
        return { x: 18, y: 65, name: 'Pallavaram Cantonment' };
      case 'Avadi':
        return { x: 8, y: 12, name: 'Avadi Main Road' };
      case 'Ambattur':
        return { x: 18, y: 18, name: 'Ambattur Industrial Estate' };
      case 'Chengalpattu':
        return { x: 5, y: 92, name: 'Chengalpattu Toll Plaza' };
      case 'Sriperumbudur':
        return { x: 5, y: 50, name: 'Sriperumbudur SIPCOT' };
      default:
        return { x: 70, y: 26, name: 'Chennai Central Gate' };
    }
  };

  // Location-based State: Pre-selected landmarks around Chennai municipal centers
  const [selectedLocation, setSelectedLocation] = useState('Guindy');
  const [locName, setLocName] = useState('Guindy Industrial Estate, near Kathipara Flyover');
  const [latitude, setLatitude] = useState(13.0067);
  const [longitude, setLongitude] = useState(80.2206);

  // Photo & Video uploads state variables
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [uploadedVideoName, setUploadedVideoName] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Breakdown reporting parameters
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || '');
  const [breakdownType, setBreakdownType] = useState<BreakdownType>('Engine Issue');
  const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High' | 'Critical SOS'>('Medium');
  const [description, setDescription] = useState('');

  // Nearby Mechanics and Profiles variables
  const [mechanics, setMechanics] = useState<Mechanic[]>(INITIAL_MECHANICS);
  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(INITIAL_MECHANICS[0]);
  const [showMechanicDetails, setShowMechanicDetails] = useState(false);

  // Pricing pricing model in Rupees (₹)
  const [consultationFee, setConsultationFee] = useState(199);
  const [roadsideVisitFee, setRoadsideVisitFee] = useState(799);
  const [repairEstimate, setRepairEstimate] = useState(1500);

  // In-app Video Consultation parameters
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [videoCallState, setVideoCallState] = useState<'inactive' | 'calling' | 'active' | 'ended'>('inactive');
  const [callTimer, setCallTimer] = useState(0);

  // Synchronized Chat logs with mechanic
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'customer' | 'mechanic'; message: string; time: string }>>([
    { sender: 'mechanic', message: 'Hello! This is your RoadAssist technician. I have reviewed the mechanical fault details you submitted.', time: 'Just now' },
    { sender: 'mechanic', message: 'I am initiating a video call consultation to diagnose the engine temperature spike. Please accept it above.', time: 'Just now' }
  ]);

  // Payment variables (UPI, Card checkouts in ₹)
  const [payMethod, setPayMethod] = useState<'card' | 'upi' | 'apple-pay' | 'cash'>('upi');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('amirtharaj@okaxis');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Rating & Feedback parameters
  const [userRating, setUserRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Settings & Customizations (Language, Simulation Speed)
  const [appLanguage, setAppLanguage] = useState<'en' | 'ta'>('en');
  const [autoSirenVolume, setAutoSirenVolume] = useState(true);
  const [simulationSpeedMultiplier, setSimulationSpeedMultiplier] = useState('1.5x');

  // Contact support state
  const [supportMessage, setSupportMessage] = useState('');

  // Driver Personal Profile Data
  const [profPhone, setProfPhone] = useState('+91 94432 00192');
  const [profAddress, setProfAddress] = useState('Flat 4A, Shivalaya Apartment, Velachery Bypass Road, Chennai - 600042');
  const [profEmergencyName, setProfEmergencyName] = useState('Rajaram Kumar (Brother)');
  const [profEmergencyPhone, setProfEmergencyPhone] = useState('+91 98402 11993');
  const [profSaved, setProfSaved] = useState(false);

  // Live Location Driving coordinates simulator state
  const [simulationStep, setSimulationStep] = useState(0); // 0 to 4 steps
  const [isSimulating, setIsSimulating] = useState(false);

  // Pre-load current coordinates when landmark dropdown changes
  const updateChennaiCoordinates = (locNameValue: string) => {
    setSelectedLocation(locNameValue);
    setLocName(`Municipal Circle corridor, ${locNameValue}, Chennai`);
    
    // Exact approximate Chennai mapping coords
    switch(locNameValue) {
      case 'Guindy': setLatitude(13.0067); setLongitude(80.2206); break;
      case 'Tambaram': setLatitude(12.9249); setLongitude(80.1000); break;
      case 'Velachery': setLatitude(12.9790); setLongitude(80.2196); break;
      case 'Anna Nagar': setLatitude(13.0850); setLongitude(80.2101); break;
      case 'T Nagar': setLatitude(13.0418); setLongitude(80.2337); break;
      case 'Porur': setLatitude(13.0382); setLongitude(80.1565); break;
      case 'Ambattur': setLatitude(13.1141); setLongitude(80.1548); break;
      case 'Avadi': setLatitude(13.1200); setLongitude(80.1000); break;
      case 'Poonamallee': setLatitude(13.0473); setLongitude(80.0945); break;
      case 'Chengalpattu': setLatitude(12.6841); setLongitude(79.9836); break;
      case 'Sriperumbudur': setLatitude(12.9734); setLongitude(79.9515); break;
      case 'Red Hills': setLatitude(13.1970); setLongitude(80.1691); break;
      case 'Pallavaram': setLatitude(12.9675); setLongitude(80.1491); break;
      case 'Sholinganallur': setLatitude(12.9015); setLongitude(80.2272); break;
      case 'OMR Road (Thorapakkam)': setLatitude(12.9213); setLongitude(80.2312); break;
      case 'ECR Road (Kovalam)': setLatitude(12.7909); setLongitude(80.2520); break;
      default: setLatitude(13.0827); setLongitude(80.2707); break;
    }
  };

  // Video call counter interval simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (videoCallState === 'active') {
      interval = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(interval);
  }, [videoCallState]);

  // Format call duration string
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Synchronize simulation step based on shared activeRequest status
  useEffect(() => {
    if (!activeRequest) {
      setSimulationStep(0);
      return;
    }
    switch (activeRequest.status) {
      case 'pending':
        setSimulationStep(0);
        break;
      case 'accepted':
        if (activeRequest.isSOSTriggered) {
          setSimulationStep(1);
        } else {
          setSimulationStep(0);
        }
        break;
      case 'dispatched':
        setSimulationStep(1);
        break;
      case 'arrived':
        setSimulationStep(2);
        break;
      case 'in-progress':
        setSimulationStep(3);
        break;
      case 'completed':
        setSimulationStep(4);
        break;
      default:
        break;
    }
  }, [activeRequest?.status]);

  // Auto-simulate GPS tracking progression when a mechanic is dispatched
  useEffect(() => {
    if (!activeRequest || activeRequest.status === 'completed' || activeRequest.status === 'pending') return;
    
    // Only auto-progress for dispatched/arrived/in-progress statuses
    if (activeRequest.status === 'dispatched' || activeRequest.status === 'arrived' || activeRequest.status === 'in-progress') {
      const autoTimer = setTimeout(() => {
        let newStatus: RequestStatus = activeRequest.status;
        let title = '';
        let msg = '';

        if (activeRequest.status === 'dispatched') {
          newStatus = 'arrived';
          title = 'On-spot Arrival Confirmed';
          msg = `${activeRequest.mechanicName || 'Mechanic'} has safely pulled alongside your vehicle at ${activeRequest.locationName}.`;
        } else if (activeRequest.status === 'arrived') {
          newStatus = 'in-progress';
          title = 'Active Repairs Underway';
          msg = 'Standard diagnostics scan active. Spare filters, socket, and battery lines verified.';
        } else if (activeRequest.status === 'in-progress') {
          newStatus = 'completed';
          title = 'Mechanical Issue Solved ✅';
          msg = 'Technician cleared the block and verified ignition. Your invoice with GST is ready for checkout.';
        }

        if (newStatus !== activeRequest.status) {
          const updated = {
            ...activeRequest,
            status: newStatus,
            updatedAt: new Date().toISOString()
          };
          setActiveRequest(updated);

          if (newStatus === 'completed') {
            addHistoryLog(updated);
          }

          const stepN: NotificationAlert = {
            id: 'notif-auto-' + Date.now(),
            title,
            message: msg,
            type: newStatus === 'completed' ? 'success' : 'info',
            timestamp: new Date().toISOString(),
            read: false
          };
          setNotifications(prev => [stepN, ...prev]);
        }
      }, 5000); // Progress every 5 seconds

      return () => clearTimeout(autoTimer);
    }
  }, [activeRequest?.status]);

  // Handle mock image/video uploads with dynamic visual progress bar
  const handleMediaUploadMock = (type: 'photo' | 'video') => {
    setIsUploading(true);
    setUploadProgress(10);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);
            if (type === 'photo') {
              // Add nice mechanical failure mock pictures
              const randImg =UploadedPhotoMocks[Math.floor(Math.random() * UploadedPhotoMocks.length)];
              setUploadedPhotos(prevPhotos => [...prevPhotos, randImg]);
            } else {
              setUploadedVideo('https://assets.mixkit.co/videos/preview/mixkit-car-engine-running-close-up-vibe-40342-large.mp4');
              setUploadedVideoName('broken_bonnet_smoke_recording.mp4');
            }
          }, 400);
          return 100;
        }
        return prev + 30;
      });
    }, 200);
  };

  // Submit breakdown request
  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicleId) {
      alert('Tamil Nadu safety protocol: Register or select a vehicle first.');
      return;
    }

    const veh = vehicles.find(v => v.id === selectedVehicleId);
    
    // Formulate a live breakdown report
    const newReport: BreakdownReport = {
      id: 'REP-' + Math.floor(10000 + Math.random() * 90000),
      vehicleId: selectedVehicleId,
      vehicleName: veh ? `${veh.brand} ${veh.model} [${veh.plate}]` : 'Registered TN Car',
      breakdownType,
      description: description || 'Vehicle breakdown recorded near ' + selectedLocation,
      severity,
      status: 'pending',
      locationName: locName,
      latitude,
      longitude,
      requestedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalCost: consultationFee + roadsideVisitFee, // standard combined Initial quote
      paymentStatus: 'unpaid',
      photoUrl: uploadedPhotos[0] || 'https://images.unsplash.com/photo-1597766353982-16fc7caccb2f?w=400',
      videoUrl: uploadedVideo || undefined,
      videoName: uploadedVideoName || undefined,
      consultationFee,
      roadsideVisitFee,
      repairEstimate,
      quoteStatus: 'proposed',
      chatHistory: chatMessages,
      videoCallState: 'inactive'
    };

    setActiveRequest(newReport);
    
    // Quick notification trigger
    const alertNotif: NotificationAlert = {
      id: 'notif-' + Date.now(),
      title: 'Quotation Proposed in INR',
      message: `Mechanic quote proposed for breakdown at ${selectedLocation}. Diagnostic rate: ₹${consultationFee}, Visit: ₹${roadsideVisitFee}`,
      type: 'warning',
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications([alertNotif, ...notifications]);

    // Proceed to nearby mechanics / diagnostic approval
    setActiveTab('nearby');
    setSimulationStep(0);
  };

  // Immediate distress SOS beacon bypass
  const triggerImmediateSOSBeacon = () => {
    const primaryVeh = vehicles[0] || { brand: 'Tata', model: 'Nexon EV', plate: 'TN 22 EF 9876', color: 'White' };
    
    const sosRequest: BreakdownReport = {
      id: 'SOS-CORRIDOR-' + Math.floor(1000 + Math.random() * 9000),
      vehicleId: primaryVeh.id || 'veh-demo',
      vehicleName: `${primaryVeh.brand} ${primaryVeh.model} [${primaryVeh.plate}]`,
      breakdownType: 'Engine Malfunction',
      description: 'IMMEDIATE SOS EMERGENCY SIGNALLING - HIGHWAY CRASH CORRIDOR HAZARD DANGER BEACON ACTIVE.',
      severity: 'Critical SOS',
      status: 'accepted',
      locationName: `NH-45 Highway shoulder, near ${selectedLocation} Exit, Tambaram Corridors`,
      latitude: 12.9249,
      longitude: 80.1000,
      mechanicId: 'mech-1',
      mechanicName: 'Arul Motors (Heavy Flatbed Duty)',
      requestedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalCost: 499 + 799, // Emergency distress SOS bundle
      paymentStatus: 'unpaid',
      quoteStatus: 'accepted',
      consultationFee: 199,
      roadsideVisitFee: 799,
      repairEstimate: 499, // basic on-spot patch-up
      isSOSTriggered: true
    };

    setActiveRequest(sosRequest);
    setSelectedMechanic(INITIAL_MECHANICS[0]); // default to Arul Motors standby

    const emergencyN: NotificationAlert = {
      id: 'notif-sos-alert-' + Date.now(),
      title: 'Tamil Nadu Highway SOS Locked!',
      message: `Arul Motors standby hydraulic tow rig is locked onto your coordinates. Estimated time to destination: 12 mins.`,
      type: 'alert',
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications([emergencyN, ...notifications]);

    setActiveTab('tracking');
    setSimulationStep(1); // Set to active dispatched
  };

  // Accept specific mechanic quotation
  const acceptMechanicQuotation = (mech: Mechanic) => {
    if (!activeRequest) return;
    
    const updated = {
      ...activeRequest,
      status: 'accepted' as RequestStatus,
      mechanicId: mech.id,
      mechanicName: mech.name,
      quoteStatus: 'accepted' as const,
      updatedAt: new Date().toISOString()
    };
    
    setActiveRequest(updated);
    setSelectedMechanic(mech);

    // Push automated system handshake
    const accNotif: NotificationAlert = {
      id: 'notif-acc-' + Date.now(),
      title: 'Quotation Accepted • Video Consult Online',
      message: `You accepted quote from ${mech.name}. Remote consultation room has been provisioned. Launch Video call below.`,
      type: 'success',
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications([accNotif, ...notifications]);

    // Go directly to Video Call page
    setActiveTab('videocall');
    setVideoCallState('calling'); // Set status to incoming call from mechanic
  };

  // Simulate GPS progression steps for Chennai locations
  const advanceSimulationProgression = () => {
    if (!activeRequest) return;
    setIsSimulating(true);

    let nextStep = simulationStep + 1;
    if (nextStep > 4) nextStep = 4;
    setSimulationStep(nextStep);

    let newStatus: RequestStatus = 'accepted';
    let title = '';
    let msg = '';

    if (nextStep === 1) {
      newStatus = 'dispatched';
      title = 'Tamil Nadu Tow Rig Dispatched';
      msg = `${activeRequest.mechanicName || 'Mechanic'} flatbed tow winch is loaded and en-route along GST Road corridor.`;
    } else if (nextStep === 2) {
      newStatus = 'arrived';
      title = 'On-spot Arrival';
      msg = `Your technician has safely pulled alongside your vehicles at GPS coordinates [${latitude.toFixed(4)}, ${longitude.toFixed(4)}].`;
    } else if (nextStep === 3) {
      newStatus = 'in-progress';
      title = 'Active Repairs Underway';
      msg = 'Standard diagnostics scan active. Spare filters socket and battery lines verified.';
    } else if (nextStep === 4) {
      newStatus = 'completed';
      title = 'Mechanical Issue Solved';
      msg = 'Technician cleared the block and verified ignition. Your invoice with GST is ready for checkout.';
    }

    const updated = {
      ...activeRequest,
      status: newStatus,
      updatedAt: new Date().toISOString()
    };
    setActiveRequest(updated);

    const stepN: NotificationAlert = {
      id: 'notif-step-' + Date.now(),
      title,
      message: msg,
      type: 'info',
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications([stepN, ...notifications]);
    setIsSimulating(false);
  };

  // Settle invoice
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRequest) return;

    setPaymentSuccess(true);
    const updated = {
      ...activeRequest,
      paymentStatus: 'paid' as const,
      quoteStatus: 'paid' as const,
      paymentMethod: payMethod,
      updatedAt: new Date().toISOString()
    };
    setActiveRequest(updated);

    const invoiceNotif: NotificationAlert = {
      id: 'notif-pay-' + Date.now(),
      title: 'Assistance Bill Cleared successfully',
      message: `Checked out ₹${activeRequest.totalCost} paid to ${activeRequest.mechanicName || 'Technician'} with digital receipt seal.`,
      type: 'success',
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications([invoiceNotif, ...notifications]);
  };

  // Feedback Submission
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRequest) return;

    const finalized: BreakdownReport = {
      ...activeRequest,
      rating: userRating,
      feedback: feedbackText || 'Affordable mechanics, highly skilled and punctual assistance.',
      status: 'completed',
      updatedAt: new Date().toISOString()
    };

    addHistoryLog(finalized);
    setActiveRequest(null); // Clear active
    setFeedbackSubmitted(true);
    
    // Redirect to service logs history tab
    setActiveTab('history');
  };

  // Register New Tamil Nadu Vehicle Number plate
  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    setVehError('');

    if (!newVehicle.brand || !newVehicle.model || !newVehicle.plate) {
      setVehError('Provide all parameters to initialize smart sensors.');
      return;
    }

    // Official TN registration pattern validation (e.g. TN 07 CD 5678 or TN-01-AB-1234)
    const tnPlatePattern = /^TN\s?\d{2}\s?[A-Z]{1,2}\s?\d{4}$/i;
    const cleanPlate = newVehicle.plate.replace(/-/g, ' ').toUpperCase().trim();
    
    if (!tnPlatePattern.test(cleanPlate)) {
      setVehError('Standard Tamil Nadu Format plate required: "TN 07 AB 1234"');
      return;
    }

    const brandNew: Vehicle = {
      id: 'veh-' + Date.now(),
      plate: cleanPlate,
      brand: newVehicle.brand,
      model: newVehicle.model,
      year: Number(newVehicle.year),
      color: newVehicle.color || 'Royal Blue Matte',
      status: 'ready',
      type: newVehicle.type || 'Car'
    };

    setVehicles([...vehicles, brandNew]);
    setSelectedVehicleId(brandNew.id);
    setNewVehicle({ brand: '', model: '', year: 2024, plate: 'TN ', color: '', type: 'Car' });
  };

  const deleteVehicle = (id: string) => {
    if (vehicles.length <= 1) {
      alert('You must retain at least one registered vehicle for emergency roadside sweeps.');
      return;
    }
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  // Simulate HD Video messaging interactive chat response
  const sendChatToTechnician = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { sender: 'customer' as const, message: chatInput, time: 'Just now' };
    const nextMsgs = [...chatMessages, userMsg];
    setChatMessages(nextMsgs);
    const query = chatInput.toLowerCase();
    setChatInput('');

    setTimeout(() => {
      let responseText = "Understood. The engine smoke indicates structural pressure leakages. Please wait while I monitor coolant fluid live on feed.";
      if (query.includes('towing') || query.includes('tow')) {
        responseText = "Yes, Murugan Vehicle Care operates flatbed towing platforms with hydraulic assist. The visit rate is listed dynamically at ₹799.";
      } else if (query.includes('charge') || query.includes('how much') || query.includes('price')) {
        responseText = "The video consultation is capped strictly at ₹199 per standard capstone rules. Any physical spare parts replacement will follow regional spare tariffs.";
      } else if (query.includes('where') || query.includes('coming')) {
        responseText = "I am currently approaching the Anna Nagar central ring traffic circle. Monitor my blue rig tracking icon on the GPS tab!";
      } else if (query.includes('problem') || query.includes('video')) {
        responseText = "Perfect! The video you uploaded allows me to pinpoint the loose hose collar on the battery terminal radiator.";
      }
      
      setChatMessages(prev => [...prev, { sender: 'mechanic' as const, message: responseText, time: 'Just now' }]);
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 max-w-7xl mx-auto min-h-screen">
      
      {/* 23 Pages Navigator - Left Sidebar */}
      <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-6 flex flex-col justify-between">
        <div className="space-y-6">
          
          {/* Driver account brief */}
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md">
              {userName.charAt(0)}
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 leading-none">{userName}</h3>
              <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                Tamil Nadu Node Verified
              </p>
            </div>
          </div>

          {/* Active Ticket live banner */}
          {activeRequest && (
            <div 
              onClick={() => setActiveTab('tracking')}
              className="p-3 bg-orange-50 border border-orange-200 rounded-xl cursor-pointer hover:bg-orange-100/50 transition duration-150 animate-pulse text-xs"
            >
              <div className="flex items-center gap-2 font-bold text-orange-850">
                <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Ticket Active • {activeRequest.status.toUpperCase()}</span>
              </div>
              <p className="text-[9px] text-slate-500 mt-1">Review live driving telemetry map</p>
            </div>
          )}

          {/* Modern navigation sidebar covering all requested pages */}
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl flex items-center gap-3 transition ${
                activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Wrench className="w-4 h-4 shrink-0" />
              <span>User Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('report')}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl flex items-center gap-3 transition ${
                activeTab === 'report' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <UploadCloud className="w-4 h-4 shrink-0" />
              <span>Breakdown Reporting / Upload</span>
            </button>

            <button
              onClick={() => setActiveTab('nearby')}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl flex items-center gap-3 transition ${
                activeTab === 'nearby' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-4 h-4 shrink-0" />
              <span>Nearby Mechanics / Quotes</span>
            </button>

            <button
              onClick={() => setActiveTab('videocall')}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl flex justify-between items-center transition ${
                activeTab === 'videocall' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Video className="w-4 h-4 shrink-0" />
                <span>Video Consultation & Chat</span>
              </div>
              {activeRequest?.quoteStatus === 'accepted' && (
                <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('tracking')}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl flex justify-between items-center transition ${
                activeTab === 'tracking' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Map className="w-4 h-4 shrink-0" />
                <span>Live Location Tracking</span>
              </div>
              {activeRequest && (
                <span className="text-[9px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full font-extrabold animate-bounce">
                  Live
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('payment')}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl flex items-center gap-3 transition ${
                activeTab === 'payment' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-4 h-4 shrink-0" />
              <span>Quotation & INR Payment</span>
            </button>

            <button
              onClick={() => setActiveTab('vehicles')}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl flex justify-between items-center transition ${
                activeTab === 'vehicles' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Car className="w-4 h-4 shrink-0" />
                <span>Vehicle Registration</span>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-500 py-0.5 px-2 rounded-full font-black">
                {vehicles.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl flex items-center gap-3 transition ${
                activeTab === 'history' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Clock className="w-4 h-4 shrink-0" />
              <span>Service Logs & Ratings</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl flex justify-between items-center transition ${
                activeTab === 'notifications' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 shrink-0" />
                <span>Notifications Panel</span>
              </div>
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl flex items-center gap-3 transition ${
                activeTab === 'profile' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              <span>User Profile Edit</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl flex items-center gap-3 transition ${
                activeTab === 'settings' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span>Terminal Settings Page</span>
            </button>
          </div>
        </div>

        {/* Rapid SOS Panel (District dispatch trigger) */}
        <div className="pt-4 border-t border-slate-100">
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl text-center space-y-3 shadow-inner">
            <h4 className="text-xs font-black text-rose-900 flex items-center justify-center gap-1 uppercase tracking-tight">
              <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse" />
              TN Highway Rescue SOS
            </h4>
            <p className="text-[10px] text-slate-500 leading-normal">
              Bypass paperwork. Push live telemetry coordinates immediately to nearby standby highway patrols.
            </p>
            <button
              type="button"
              onClick={triggerImmediateSOSBeacon}
              className="w-full py-2.5 bg-rose-600 text-white text-xs font-extrabold uppercase tracking-widest hover:bg-rose-700 transition rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>🚨 Trigger Distress SOS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Dynamic Panel Layout */}
      <div className="lg:col-span-9 space-y-6">
        
        {/* Global sticky en-route tracking tape to make live tracking impossible to miss! */}
        {activeRequest && activeRequest.status !== 'completed' && (
          <div 
            onClick={() => setActiveTab('tracking')}
            className={`p-3.5 bg-gradient-to-r ${
              activeRequest.status === 'dispatched' ? 'from-amber-500 via-amber-600 to-orange-600 text-white' :
              activeRequest.status === 'arrived' ? 'from-emerald-600 via-emerald-700 to-teal-700 text-white' :
              activeRequest.status === 'in-progress' ? 'from-blue-600 via-blue-700 to-indigo-700 text-white' :
              'from-slate-800 to-slate-900'
            } text-white rounded-2xl shadow-md border border-white/5 cursor-pointer hover:scale-[1.01] transition duration-200 flex flex-col sm:flex-row justify-between items-center gap-3`}
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
              <div className="text-xs">
                <span className="font-extrabold uppercase tracking-widest text-[9px] bg-white/20 px-2 py-0.5 rounded mr-2">
                  Live Status Telemetry
                </span>
                <span className="font-extrabold font-semibold">
                  {activeRequest.mechanicName || 'Technician'} • {
                    activeRequest.status === 'pending' ? 'Awaiting Quote Lock Approval...' :
                    activeRequest.status === 'accepted' ? 'Preparing tools and flatbed vehicle dispatch...' :
                    activeRequest.status === 'dispatched' ? 'Flatbed rig is on approach along GST/OMR corridors!' :
                    activeRequest.status === 'arrived' ? 'Assigned technician has safely pulled over alongside!' :
                    'Active diagnostics scan and repairs underway.'
                  }
                </span>
              </div>
            </div>
            
            <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 hover:bg-black/35 px-3.5 py-1.5 rounded-xl border border-white/10 shrink-0 flex items-center gap-1.5 transition">
              <Map className="w-3.5 h-3.5" /> View GPS Tracking Map &rarr;
            </span>
          </div>
        )}
        
        {/* TAB 1: USER DASHBOARD DIAGNOSTIC CONSOLE */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Visual Header featuring Tamil Nadu roads illustration */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 text-white p-6 md:p-8 rounded-2xl relative overflow-hidden shadow-lg border border-indigo-900/40">
              <div className="absolute right-0 top-0 bottom-0 opacity-15 flex items-center pr-10">
                <Car className="w-56 h-56 rotate-6 text-indigo-400" />
              </div>
              
              <div className="relative z-10 space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold bg-orange-400/90 text-slate-950 uppercase tracking-widest leading-none">
                  <Sparkles className="w-3.5 h-3.5" /> TN Roadside Safety Active
                </span>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                  On-Road Vehicle Breakdown Detection and Roadside Assistance
                </h2>
                <p className="text-xs md:text-sm text-blue-105 max-w-xl leading-relaxed font-sans">
                  Active User: <span className="font-bold text-amber-300">{userName}</span> | Primary Service Area: <span className="font-bold text-amber-300">Chennai, Tamil Nadu</span>. Integrated GPS monitoring cells are surveying Chengalpattu, Velachery, Guindy, and surrounding highway sectors.
                </p>
                
                <div className="pt-2 flex flex-wrap gap-2.5">
                  <button
                    onClick={() => setActiveTab('report')}
                    className="px-4.5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl transition shadow-md cursor-pointer uppercase tracking-wider"
                  >
                    Report breakdown
                  </button>
                  <button
                    onClick={() => setActiveTab('vehicles')}
                    className="px-4.5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Manage fleet vehicles ({vehicles.length})
                  </button>
                </div>
              </div>
            </div>

            {/* Real-Time Live Status indicators list */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Avg ETA</span>
                  <p className="text-sm font-extrabold text-slate-800">14.8 Mins</p>
                </div>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Assistance rate</span>
                  <p className="text-sm font-extrabold text-slate-800">100% Secure</p>
                </div>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Active Workshops</span>
                  <p className="text-sm font-extrabold text-slate-800">10 Verified</p>
                </div>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Network health</span>
                  <p className="text-sm font-extrabold text-slate-800">99.8% Online</p>
                </div>
              </div>
            </div>

            {/* Fast selection categories box */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Immediate Trouble Shoot Portal</h3>
                <p className="text-xs text-slate-450 mt-1">Select an issue category to dry-run reporting parameters:</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {([
                  { type: 'Engine Issue', label: 'Engine Issue', quote: '₹199 Consultation', icon: '💨' },
                  { type: 'Flat Tyre', label: 'Flat Tyre', quote: '₹799 Road visit', icon: '🛞' },
                  { type: 'Battery Problem', label: 'Battery Problem', quote: '₹299 Inspection', icon: '⚡' },
                  { type: 'Brake Issue', label: 'Brake Failure', quote: '₹1500+ Estimate', icon: '🛑' },
                ] as const).map((opt) => (
                  <button
                    key={opt.type}
                    onClick={() => {
                      setBreakdownType(opt.type);
                      setActiveTab('report');
                    }}
                    className="p-3 border border-slate-150 hover:border-blue-500 hover:shadow-md transition text-center space-y-2 rounded-xl group cursor-pointer bg-slate-50/50"
                  >
                    <span className="text-2xl block group-hover:scale-110 transition">{opt.icon}</span>
                    <p className="text-xs font-bold text-slate-800">{opt.label}</p>
                    <p className="text-[10px] text-blue-600 font-extrabold">{opt.quote}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Chennai locations coverage quick-check banner */}
            <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-blue-900 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Metropolitan Chennai Grid Active
                </h4>
                <p className="text-[11px] text-slate-650 leading-relaxed font-semibold">
                  We monitor GST and OMR high-speed highways recursively. Available locations include Poonamallee, Sriperumbudur, Tambaram, Pallavaram, ECR road, and Sholinganallur.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveTab('settings');
                }}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-blue-700 text-xs font-extrabold rounded-lg border border-blue-200 transition shrink-0 whitespace-nowrap"
              >
                View Grid Nodes
              </button>
            </div>

          </div>
        )}

        {/* TAB 2: BREAKDOWN REPORTING & MEDIA FILE UPLOAD PAGE */}
        {activeTab === 'report' && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-slate-900">Incident breakdown Reporting Page</h2>
              <p className="text-xs text-slate-400 mt-1 font-semibold">
                Submit issue descriptors, load geo coordinates, and upload fault recorded files to request quotes.
              </p>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-6">
              
              {/* Grid selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Form fields */}
                <div className="space-y-4">
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      1. Select Your Affected Vehicle
                    </label>
                    <select
                      value={selectedVehicleId}
                      onChange={(e) => setSelectedVehicleId(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-semibold bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    >
                      {vehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                          🚗 {v.brand} {v.model} [{v.plate}] ({v.color})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                        2. What is the Problem?
                      </label>
                      <select
                        value={breakdownType}
                        onChange={(e) => setBreakdownType(e.target.value as BreakdownType)}
                        className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-bold bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                      >
                        <option value="Engine Issue">Engine Issue</option>
                        <option value="Battery Problem">Battery Problem</option>
                        <option value="Flat Tyre">Flat Tyre</option>
                        <option value="Brake Issue">Brake Issue</option>
                        <option value="Fuel Problem">Fuel Problem</option>
                        <option value="Electrical Issue">Electrical Issue</option>
                        <option value="Overheating">Overheating</option>
                        <option value="Accident Assistance">Accident Assistance</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                        3. Risk Severity Level
                      </label>
                      <select
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value as any)}
                        className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-bold bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                      >
                        <option value="Low">Low (Drivable to shop)</option>
                        <option value="Medium">Medium (Standby needed)</option>
                        <option value="High">High (Immediate Rig dispatched)</option>
                        <option value="Critical SOS">Critical SOS (Express Hazard)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      4. Description of Mechanical Issue
                    </label>
                    <textarea
                      required
                      placeholder="Explain symptoms (e.g. Engine heat indicator beep sounding, heavy gray smoke under bonnet radiator collar, coolant tank empty)..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full p-3 text-xs border border-slate-200 rounded-lg bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none"
                    ></textarea>
                  </div>

                  {/* Standardized Quotation configuration setting inside formulation */}
                  <div className="p-3.5 bg-blue-50/50 border border-blue-150 rounded-xl space-y-2">
                    <span className="text-[9px] font-bold text-blue-700 uppercase tracking-widest block">
                      Assistance Capstone Standard Rates (₹ INR Only)
                    </span>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <button
                        type="button"
                        onClick={() => setActiveTab('videocall')}
                        className="bg-white p-1.5 rounded-md border border-slate-200 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md transition-all duration-200 cursor-pointer group"
                      >
                        <span className="block text-[8px] text-slate-400 font-bold uppercase group-hover:text-blue-600">Video Consult</span>
                        <span className="font-extrabold text-blue-700">₹{consultationFee}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('nearby')}
                        className="bg-white p-1.5 rounded-md border border-slate-200 hover:border-orange-400 hover:bg-orange-50 hover:shadow-md transition-all duration-200 cursor-pointer group"
                      >
                        <span className="block text-[8px] text-slate-400 font-bold uppercase group-hover:text-orange-600">Roadside Visit</span>
                        <span className="font-extrabold text-slate-800 group-hover:text-orange-700">₹{roadsideVisitFee}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('nearby')}
                        className="bg-white p-1.5 rounded-md border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 hover:shadow-md transition-all duration-200 cursor-pointer group"
                      >
                        <span className="block text-[8px] text-slate-400 font-bold uppercase group-hover:text-emerald-600">Major Repair</span>
                        <span className="font-extrabold text-slate-800 group-hover:text-emerald-700">₹{repairEstimate}+</span>
                      </button>
                    </div>
                  </div>

                </div>

                {/* Location and Photo/Video Upload Columns */}
                <div className="space-y-4">
                  
                  {/* Chennai Landmark Quick selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      5. Select Active Chennai Landmark Node
                    </label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => updateChennaiCoordinates(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-bold bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    >
                      {CHENNAI_LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Landmark coordinate reference
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                      <div className="bg-slate-50 px-2.5 py-1.5 border border-slate-200 rounded-md">
                        <span className="text-[8px] block text-slate-400 uppercase">Latitude</span>
                        <span className="font-mono">{latitude} N</span>
                      </div>
                      <div className="bg-slate-50 px-2.5 py-1.5 border border-slate-200 rounded-md">
                        <span className="text-[8px] block text-slate-400 uppercase">Longitude</span>
                        <span className="font-mono">{longitude} E</span>
                      </div>
                    </div>
                  </div>

                  {/* MULTIMEDIA ATTACHMENTS SECTION */}
                  <div className="border border-slate-200 rounded-xl p-4.5 space-y-4 bg-slate-50/50">
                    <span className="text-xs font-bold text-slate-800 block">
                      6. Upload Diagnostics Media (Optional)
                    </span>

                    <div className="grid grid-cols-2 gap-3">
                      
                      {/* Photo upload mock button */}
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => handleMediaUploadMock('photo')}
                          disabled={isUploading}
                          className="w-full py-4 border-2 border-dashed border-slate-350 hover:border-blue-500 rounded-xl flex flex-col items-center justify-center text-center space-y-1 bg-white hover:bg-slate-50 transition cursor-pointer"
                        >
                          <span className="text-xl">📸</span>
                          <span className="text-[10px] font-bold text-slate-705">Upload Photo (Optional)</span>
                        </button>
                        
                        {uploadedPhotos.length > 0 && (
                          <div className="flex gap-1 overflow-x-auto py-1">
                            {uploadedPhotos.map((img, i) => (
                              <img key={i} src={img} className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0" alt="uploaded mock" />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Video upload mock button */}
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => handleMediaUploadMock('video')}
                          disabled={isUploading}
                          className="w-full py-4 border-2 border-dashed border-slate-350 hover:border-blue-500 rounded-xl flex flex-col items-center justify-center text-center space-y-1 bg-white hover:bg-slate-50 transition cursor-pointer"
                        >
                          <span className="text-xl">🎥</span>
                          <span className="text-[10px] font-bold text-slate-705">Upload Video (Optional)</span>
                        </button>

                        {uploadedVideo && (
                          <div className="p-1 px-2 border border-slate-250 bg-white rounded-lg flex items-center justify-between">
                            <span className="text-[9px] font-bold text-slate-600 truncate max-w-[80px]">
                              {uploadedVideoName}
                            </span>
                            <span className="text-[8px] bg-red-100 text-red-700 px-1 py-0.5 rounded uppercase font-black shrink-0">
                              Ready
                            </span>
                          </div>
                        )}
                      </div>

                    </div>

                    {isUploading && (
                      <div className="space-y-1 text-center">
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-1.5 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                        <span className="text-[9px] font-bold text-blue-600">Syncing media files to RoadAssist cloud: {uploadProgress}%</span>
                      </div>
                    )}

                  </div>

                </div>

              </div>

              {/* Submit panel */}
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <p className="text-[10px] text-slate-400 font-bold max-w-sm">
                  * Submission sends immediate telemetry to Arul Motors, Kumar works, Murugan care, and 7 other Tamil Nadu technicians.
                </p>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-blue-700 shadow-md flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Navigation className="w-4 h-4" /> Assemble Mechanics and Quotes
                </button>
              </div>

            </form>
          </div>
        )}

        {/* TAB 3: NEARBY MECHANICS LIST & CHENNAI PROFILES */}
        {activeTab === 'nearby' && (
          <div className="space-y-6">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h3 className="text-base font-black text-slate-900">Verified nearby mechanics in {selectedLocation} corridor</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-semibold">Specialized flatbed tow operators ready within {selectedLocation} local perimeter</p>
              </div>
              <div className="flex gap-2">
                <span className="text-xs font-bold text-slate-500 bg-slate-100 py-1.5 px-3 rounded-lg border border-slate-200">
                  Sector: {selectedLocation}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Mechanics layout */}
              <div className="md:col-span-12 lg:col-span-7 space-y-3">
                {mechanics.map((mech) => (
                  <div
                    key={mech.id}
                    className={`bg-white rounded-2xl border p-4 shadow-xs transition hover:shadow-md cursor-pointer flex gap-4 ${
                      selectedMechanic?.id === mech.id ? 'border-2 border-blue-500' : 'border-slate-150'
                    }`}
                    onClick={() => {
                      setSelectedMechanic(mech);
                      setShowMechanicDetails(true);
                    }}
                  >
                    <img
                      src={mech.profileImg}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-100 shadow-md"
                      alt={mech.name}
                    />
                    <div className="flex-1 min-w-0">
                      
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-black text-slate-900 truncate leading-tight">{mech.name}</h4>
                          <span className="text-[10px] text-slate-400 font-bold mt-1 inline-block">{mech.address}</span>
                        </div>
                        <span className="text-[10px] font-black bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg shrink-0">
                          {mech.distance} km away
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-500 line-clamp-1 mt-1 font-sans">
                        🚜 Rig: {mech.vehicleDetails}
                      </p>

                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-700">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span>{mech.rating}</span>
                          <span className="text-slate-400">({mech.reviewsCount} tasks)</span>
                        </div>
                        <span className="text-[10px] text-emerald-600 font-black flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                          Online
                        </span>
                      </div>

                    </div>
                  </div>
                ))}
              </div>

              {/* Mechanic profile card right hand */}
              <div className="md:col-span-12 lg:col-span-5">
                {selectedMechanic ? (
                  <div className="bg-white rounded-2xl border border-blue-200 shadow-lg p-5 space-y-4 sticky top-20">
                    <div className="text-center pb-3 border-b border-slate-100">
                      <img
                        src={selectedMechanic.profileImg}
                        className="w-16 h-16 rounded-full object-cover mx-auto ring-4 ring-orange-500 shadow-md"
                        alt={selectedMechanic.name}
                      />
                      <h4 className="text-sm font-black text-slate-910 mt-3">{selectedMechanic.name}</h4>
                      <p className="text-[10px] text-blue-700 font-extrabold mt-1 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full inline-block">
                        Certified Chennai Partner
                      </p>
                    </div>

                    <div className="text-xs space-y-2.5 font-bold text-slate-700">
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase">Address base</span>
                        <span className="font-semibold text-slate-850 block">{selectedMechanic.address}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase">Available Mobile Contact</span>
                        <span className="text-blue-700 font-extrabold block">{selectedMechanic.phone}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase">Recovery Fleet Rig</span>
                        <span className="text-slate-800 font-bold block">{selectedMechanic.vehicleDetails}</span>
                      </div>
                      
                      {/* Specialties block */}
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase">Operational Specialties</span>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {selectedMechanic.specialization.map(spec => (
                            <span key={spec} className="text-[9px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md font-semibold">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Capstone Prices list in INR (₹) */}
                      <div className="pt-3 border-t border-slate-100 space-y-1.5">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Standard Capstone Price Quotes (INR)</span>
                        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                          <div className="bg-slate-50 p-2 border border-slate-200 rounded-lg text-center">
                            <span className="block text-[8px] text-slate-400">Video consultation</span>
                            <span className="text-orange-600">₹{consultationFee}</span>
                          </div>
                          <div className="bg-slate-50 p-2 border border-slate-200 rounded-lg text-center">
                            <span className="block text-[8px] text-slate-400">Roadside visit</span>
                            <span className="text-slate-800">₹{roadsideVisitFee}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {activeRequest ? (
                      <div className="space-y-2.5">
                        <button
                          onClick={() => acceptMechanicQuotation(selectedMechanic)}
                          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Video className="w-4 h-4" />
                          <span>Accept Video Call</span>
                        </button>
                        <button
                          onClick={() => {
                            if (!activeRequest) return;
                            const updated = {
                              ...activeRequest,
                              status: 'dispatched' as RequestStatus,
                              mechanicId: selectedMechanic.id,
                              mechanicName: selectedMechanic.name,
                              quoteStatus: 'accepted' as const,
                              updatedAt: new Date().toISOString()
                            };
                            setActiveRequest(updated);
                            setSelectedMechanic(selectedMechanic);

                            setChatMessages([
                              { sender: 'mechanic', message: `Hi! I'm ${selectedMechanic.name}. I've accepted the dispatch. How can I help?`, time: 'Just now' },
                              { sender: 'mechanic', message: 'Please describe the issue in detail and I will prepare the right tools.', time: 'Just now' }
                            ]);

                            const msgNotif: NotificationAlert = {
                              id: 'notif-msg-' + Date.now(),
                              title: `Chat with ${selectedMechanic.name}`,
                              message: `Message session opened with ${selectedMechanic.name}. You can now exchange texts.`,
                              type: 'info',
                              timestamp: new Date().toISOString(),
                              read: false,
                            };
                            setNotifications([msgNotif, ...notifications]);

                            setActiveTab('videocall');
                            // Don't start video — just open chat
                          }}
                          className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Send Message to Mechanic</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            // Auto-create a breakdown request and dispatch this mechanic
                            const selectedVeh = vehicles[0];
                            const newReport: BreakdownReport = {
                              id: 'req-quick-' + Date.now(),
                              vehicleId: selectedVeh?.id || 'veh-1',
                              vehicleName: selectedVeh ? `${selectedVeh.brand} ${selectedVeh.model} (${selectedVeh.plate})` : 'Vehicle',
                              breakdownType: breakdownType || 'Other',
                              description: `Quick dispatch requested to ${selectedMechanic.name} from Nearby Mechanics panel.`,
                              severity: 'Medium',
                              status: 'dispatched' as RequestStatus,
                              locationName: selectedLocation,
                              latitude: latitude,
                              longitude: longitude,
                              mechanicId: selectedMechanic.id,
                              mechanicName: selectedMechanic.name,
                              requestedAt: new Date().toISOString(),
                              updatedAt: new Date().toISOString(),
                              totalCost: roadsideVisitFee,
                              paymentStatus: 'unpaid',
                              quoteStatus: 'accepted',
                              consultationFee: consultationFee,
                              roadsideVisitFee: roadsideVisitFee,
                              repairEstimate: repairEstimate,
                              chatHistory: [
                                { sender: 'mechanic', message: `Hello! I'm ${selectedMechanic.name}. I've received your roadside assistance request. I'm preparing my rig now.`, time: 'Just now' },
                                { sender: 'mechanic', message: 'Please share more details about the issue if possible. I will be there shortly.', time: 'Just now' }
                              ],
                              videoCallState: 'inactive',
                            };
                            setActiveRequest(newReport);

                            const dispatchNotif: NotificationAlert = {
                              id: 'notif-dispatch-' + Date.now(),
                              title: `Mechanic ${selectedMechanic.name} Dispatched!`,
                              message: `Your roadside request has been sent to ${selectedMechanic.name} (${selectedMechanic.vehicleDetails}). They are en-route to ${selectedLocation}.`,
                              type: 'success',
                              timestamp: new Date().toISOString(),
                              read: false,
                            };
                            setNotifications([dispatchNotif, ...notifications]);

                            setChatMessages([
                              { sender: 'mechanic', message: `Hello! I'm ${selectedMechanic.name}. I've received your roadside assistance request. I'm preparing my rig now.`, time: 'Just now' },
                              { sender: 'mechanic', message: 'Please share more details about the issue if possible. I will be there shortly.', time: 'Just now' }
                            ]);

                            setActiveTab('videocall');
                            setVideoCallState('calling');
                          }}
                          className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Navigation className="w-4 h-4" />
                          <span>Request This Mechanic & Connect</span>
                        </button>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => {
                              alert(`📞 Calling ${selectedMechanic.name} at ${selectedMechanic.phone}...`);
                            }}
                            className="py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-[10px] uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>Call Mechanic</span>
                          </button>
                          <button
                            onClick={() => {
                              // Create request and go to video call / chat
                              const selectedVeh = vehicles[0];
                              const newReport: BreakdownReport = {
                                id: 'req-msg-' + Date.now(),
                                vehicleId: selectedVeh?.id || 'veh-1',
                                vehicleName: selectedVeh ? `${selectedVeh.brand} ${selectedVeh.model} (${selectedVeh.plate})` : 'Vehicle',
                                breakdownType: breakdownType || 'Other',
                                description: `Message consultation requested with ${selectedMechanic.name}.`,
                                severity: 'Low',
                                status: 'dispatched' as RequestStatus,
                                locationName: selectedLocation,
                                latitude: latitude,
                                longitude: longitude,
                                mechanicId: selectedMechanic.id,
                                mechanicName: selectedMechanic.name,
                                requestedAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                                totalCost: consultationFee,
                                paymentStatus: 'unpaid',
                                quoteStatus: 'accepted',
                                consultationFee: consultationFee,
                                roadsideVisitFee: roadsideVisitFee,
                                repairEstimate: repairEstimate,
                                chatHistory: [
                                  { sender: 'mechanic', message: `Hi! I'm ${selectedMechanic.name}. How can I help you today?`, time: 'Just now' }
                                ],
                                videoCallState: 'inactive',
                              };
                              setActiveRequest(newReport);

                              setChatMessages([
                                { sender: 'mechanic', message: `Hi! I'm ${selectedMechanic.name}. How can I help you today?`, time: 'Just now' }
                              ]);

                              const msgNotif: NotificationAlert = {
                                id: 'notif-msg-' + Date.now(),
                                title: `Chat with ${selectedMechanic.name}`,
                                message: `Chat consultation opened with ${selectedMechanic.name}. You can now exchange messages.`,
                                type: 'info',
                                timestamp: new Date().toISOString(),
                                read: false,
                              };
                              setNotifications([msgNotif, ...notifications]);

                              setActiveTab('videocall');
                            }}
                            className="py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-[10px] uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Message</span>
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border p-5 text-center text-xs text-slate-400">
                    Select a mechanic from the list to view customized profiles.
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* TAB 4: VIDEO CALL CONSULTATION & LIVE CHAT PANE */}
        {activeTab === 'videocall' && (
          <div className="space-y-6">
            
            {/* Header banner */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h3 className="text-base font-black text-slate-900">In-App High-Definition Video Consultation Page</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-bold">Provide visual fault feedback during video consult streams with chats</p>
              </div>
              <div className="flex gap-2">
                <span className="text-xs font-bold text-slate-505 bg-slate-100 py-1.5 px-3 rounded-lg border border-slate-200">
                  Channel ID: SECURE-VCALL-502
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Video consultation column */}
              <div className="lg:col-span-7 bg-slate-950 rounded-2xl p-4 text-white relative flex flex-col justify-between overflow-hidden shadow-2xl h-[520px] border border-slate-800">
                
                {/* Embedded roads static grids mock background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:16px_16px]"></div>

                {/* Video call header info overlay */}
                <div className="relative z-10 flex justify-between items-center bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></div>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-100">
                      {selectedMechanic?.name || 'Vignesh Auto Service'}
                    </span>
                  </div>
                  {videoCallState === 'active' ? (
                    <span className="text-xs font-mono font-extrabold bg-blue-600/90 text-white px-2.5 py-0.5 rounded-full">
                      Live {formatTimer(callTimer)}
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-400 animate-pulse">
                      Waiting for secure hook...
                    </span>
                  )}
                </div>

                {/* Simulated Camera Feeds */}
                <div className="relative flex-1 flex items-center justify-center">
                  
                  {/* MAIN FEED MODE CONTENT */}
                  {videoCallState === 'active' ? (
                    isVideoOn ? (
                      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                        <img
                          src={selectedMechanic?.profileImg || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400'}
                          className="w-full h-full object-cover rounded-xl border border-white/5"
                          alt="Mechanic Feed"
                        />
                        <div className="absolute bottom-4 left-4 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 text-[10px] font-bold">
                          📹 {selectedMechanic?.name || 'Arul Motors'} • At workshop base
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-slate-500 text-xs py-10 font-bold bg-slate-900 absolute inset-0 flex items-center justify-center rounded-xl">
                        📸 Local video stream paused. Tap Start Cam below.
                      </div>
                    )
                  ) : videoCallState === 'calling' ? (
                    <div className="text-center space-y-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl max-w-sm">
                      <div className="w-16 h-16 bg-amber-500 text-white rounded-full flex items-center justify-center mx-auto animate-pulse shadow-lg text-2xl font-bold">
                        📞
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-white">Incoming Video Consultation</h4>
                        <p className="text-[11px] text-slate-300 font-semibold max-w-xs mx-auto leading-relaxed">
                          {selectedMechanic?.name || 'Your technician'} is initiating a video call consultation to diagnose the vehicle faults.
                        </p>
                      </div>
                      
                      <div className="flex flex-col gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setVideoCallState('active');
                            const nextMsgs = [
                              ...chatMessages,
                              { sender: 'mechanic', message: 'Accepted video call request! Live HD feed is now active.', time: 'Just now' }
                            ];
                            setChatMessages(nextMsgs);
                          }}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] rounded-xl shadow-md transition uppercase tracking-widest cursor-pointer"
                        >
                          Accept Video Consultation
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setVideoCallState('inactive');
                            const nextMsgs = [
                              ...chatMessages,
                              { sender: 'customer', message: 'Declined video consultation. Let us proceed with normal chat messaging.', time: 'Just now' }
                            ];
                            setChatMessages(nextMsgs);
                          }}
                          className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] rounded-xl transition uppercase tracking-widest cursor-pointer"
                        >
                          Decline • Normal Chat Only
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Default/Declined Normal Message help board */
                    <div className="p-6 text-center space-y-4 max-w-md">
                      <div className="w-12 h-12 bg-indigo-950 text-indigo-400 rounded-xl flex items-center justify-center mx-auto border border-indigo-900">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-extrabold text-slate-100">Live Normal Messaging Active</h4>
                        <p className="text-[11px] text-slate-400 font-medium">
                          You are communicating via secure text chat. If preferred, you can launch high-definition video diagnostics later using the button below.
                        </p>
                      </div>

                      {/* Diagnostic Tips Dashboard Card based on report Category */}
                      <div className="bg-slate-900 border border-slate-800/80 p-3.5 rounded-xl text-left space-y-2 mt-4">
                        <h5 className="text-[10px] text-orange-400 font-black uppercase tracking-widest">
                          🛡 Safe Stopping Guidelines
                        </h5>
                        <ul className="text-[10px] text-slate-300 space-y-1 list-disc pl-4 font-medium">
                          <li>Park your vehicle on the leftmost lane or shoulder.</li>
                          <li>Turn on your hazard safety warning flashers.</li>
                          <li>Monitor the approaching mechanic on the Live Location Tracking tab.</li>
                        </ul>
                      </div>

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setVideoCallState('active');
                            const nextMsgs = [
                              ...chatMessages,
                              { sender: 'customer', message: 'Initiated video call diagnostic consultation.', time: 'Just now' }
                            ];
                            setChatMessages(nextMsgs);
                          }}
                          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] rounded-xl shadow-md transition uppercase tracking-widest cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Video className="w-3.5 h-3.5" /> Start Video Consult
                        </button>
                      </div>
                    </div>
                  )}

                  {/* USER PERSONAL CAM OVERLAY (PIP Layout) */}
                  {videoCallState === 'active' && (
                    <div className="absolute top-20 right-4 w-28 h-36 bg-slate-900/90 rounded-xl overflow-hidden border-2 border-orange-500 shadow-2xl z-20">
                      {isAudioMuted ? (
                        <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center text-rose-500 font-bold text-lg">
                          🔇
                        </div>
                      ) : (
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                          className="w-full h-full object-cover"
                          alt="User local feed"
                        />
                      )}
                      <div className="absolute bottom-1 right-1 bg-black/60 px-1 rounded text-[7px] font-bold">
                        Client Feed
                      </div>
                    </div>
                  )}

                </div>

                {/* Control switches overlay */}
                {videoCallState === 'active' && (
                  <div className="relative z-10 bg-slate-900/85 backdrop-blur-md p-3.5 rounded-xl border border-white/10 flex justify-center gap-4 text-xs font-bold">
                    <button
                      onClick={() => setIsAudioMuted(!isAudioMuted)}
                      className={`p-3 rounded-full border transition cursor-pointer ${
                        isAudioMuted ? 'bg-rose-600 border-rose-500 text-white font-bold' : 'bg-slate-800 border-slate-700 hover:bg-slate-750 text-slate-200'
                      }`}
                    >
                      {isAudioMuted ? '🔇 Unmute' : '🎙 Mute Mic'}
                    </button>

                    <button
                      onClick={() => setIsVideoOn(!isVideoOn)}
                      className="p-3 bg-slate-850 hover:bg-slate-750 border border-slate-700 text-white rounded-full transition cursor-pointer"
                    >
                      {isVideoOn ? '📹 Stop Cam' : '📹 Start Cam'}
                    </button>

                    <button
                      onClick={() => {
                        setVideoCallState('inactive');
                        const endNotif: NotificationAlert = {
                          id: 'notif-end-vc-' + Date.now(),
                          title: 'Video Stream Terminated',
                          message: 'HD video diagnostics room safely closed. Ongoing chat channels are active.',
                          type: 'info',
                          timestamp: new Date().toISOString(),
                          read: false
                        };
                        setNotifications([endNotif, ...notifications]);
                      }}
                      className="p-3 bg-rose-600 hover:bg-rose-700 text-white rounded-full px-5 transition font-extrabold cursor-pointer"
                    >
                      End Live Call
                    </button>
                  </div>
                )}

              </div>

              {/* Chat Messaging right hand Column */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[520px] justify-between">
                
                {/* Chat header */}
                <div className="p-3.5 bg-slate-900 text-white flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold uppercase tracking-wider">Live Chat Desk</span>
                  </div>
                  <span className="text-[10px] text-slate-400">SSL encrypted tunnel</span>
                </div>

                {/* Message display feed */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs leading-normal">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className={`flex flex-col ${msg.sender === 'customer' ? 'items-end' : 'items-start'}`}>
                      <span className="text-[8px] text-slate-400 font-extrabold px-1 mb-1">
                        {msg.sender === 'customer' ? 'Me' : selectedMechanic?.name || 'Technician'}
                      </span>
                      <div className={`p-2.5 rounded-2xl max-w-[85%] font-medium ${
                        msg.sender === 'customer'
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-slate-100 text-slate-700 rounded-tl-none'
                      }`}>
                        {msg.message}
                      </div>
                      <span className="text-[8px] text-slate-350 font-bold px-1.5 mt-0.5">{msg.time}</span>
                    </div>
                  ))}
                </div>

                {/* Interactive pricing summary drawer in Chat */}
                <div className="bg-orange-50/60 p-3 border-t border-slate-150 text-[11px] font-bold flex justify-between items-center">
                  <div className="text-orange-950 font-extrabold">Active quote: ₹{consultationFee} Video Consult Included</div>
                  <button
                    onClick={() => setActiveTab('payment')}
                    className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-[10px] transition cursor-pointer font-bold uppercase tracking-wider"
                  >
                    Go To Billing
                  </button>
                </div>

                {/* Message submit bar */}
                <form onSubmit={sendChatToTechnician} className="p-3 border-t border-slate-100 flex gap-2 bg-slate-50">
                  <input
                    type="text"
                    required
                    placeholder="Type diagnostic message or questions..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="bg-white px-3 py-2 text-xs border border-slate-200 rounded-lg flex-1 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="p-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-lg transition overflow-hidden cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

              </div>

            </div>

          </div>
        )}

        {/* TAB 5: LIVE GPS COORDINATES MAP LAYOUT */}
        {activeTab === 'tracking' && (() => {
          const userPos = getLocationCoords(selectedLocation);
          const mechStartX = userPos.x > 50 ? userPos.x - 32 : userPos.x + 32;
          const mechStartY = userPos.y > 50 ? userPos.y - 24 : userPos.y + 24;

          let currX = mechStartX;
          let currY = mechStartY;
          if (simulationStep === 1) {
            currX = userPos.x;
            currY = mechStartY;
          } else if (simulationStep >= 2) {
            currX = userPos.x - 3.5;
            currY = userPos.y + 2.5;
          }

          return (
            <div className="space-y-6">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h3 className="text-base font-black text-slate-900">Live GPS tracking and telemetry mapping</h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-semibold">Automatic driving coordinate synchronization along highway margins</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs font-bold text-slate-505 bg-slate-100 py-1.5 px-3 rounded-lg border border-slate-200">
                    Location: {userPos.name} • {latitude.toFixed(4)} N, {longitude.toFixed(4)} E
                  </span>
                </div>
              </div>

              {!activeRequest ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center space-y-4 shadow-sm">
                  <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                    <Map className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">No active roadside dispatch tracks</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      Please submit a breakdown signal first inside the "Breakdown Reporting" center to activate telemetry streams.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('report')}
                    className="px-4.5 py-2.5 bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 rounded-xl transition"
                  >
                    Configure active report
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Driving simulation map column */}
                  <div className="lg:col-span-8 space-y-5">
                    
                    <div className="bg-white rounded-2xl border border-slate-100 p-4.5 shadow-sm space-y-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-700 uppercase tracking-widest bg-blue-50/50 border border-blue-200 px-3 py-1 rounded-full">
                          INCIDENT ID: {activeRequest.id}
                        </span>
                        
                        {/* Driver simulator toggle */}
                        <button
                          onClick={advanceSimulationProgression}
                          disabled={activeRequest.status === 'completed'}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg border flex items-center gap-1.5 transition cursor-pointer ${
                            activeRequest.status === 'completed'
                              ? 'bg-slate-50 text-slate-450 border-slate-150'
                              : 'bg-orange-500 hover:bg-orange-600 text-white border-orange-400 shadow-sm'
                          }`}
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Simulate tow rig progress</span>
                        </button>
                      </div>

                      {/* Chennai GPS map vector widget */}
                      <div className="h-96 bg-[#f4f3f0] rounded-xl border border-slate-200 overflow-hidden relative shadow-inner">
                        
                        {/* SVG Google Map Background */}
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                          {/* Land */}
                          <rect x="0" y="0" width="100" height="100" fill="#f4f3f0" />
                          
                          {/* Green spaces */}
                          <path d="M 0,25 Q 25,32 30,50 T 0,72 Z" fill="#e8f5e9" opacity="0.9" />
                          <path d="M 40,48 Q 52,50 50,70 T 32,75 Z" fill="#e8f5e9" opacity="0.9" />
                          
                          {/* Industrial / Residential blocks */}
                          <rect x="15" y="45" width="22" height="15" rx="1.5" fill="#ebeeeb" />
                          <rect x="42" y="8" width="12" height="10" rx="1" fill="#ebeeeb" />
                          
                          {/* Adyar River */}
                          <path d="M 0,65 Q 35,55 55,42 T 100,32" fill="none" stroke="#bbdefb" strokeWidth="3.5" strokeLinecap="round" />
                          
                          {/* Bay of Bengal */}
                          <path d="M 88,0 C 90,30 92,70 91,100 L 100,100 L 100,0 Z" fill="#bbdefb" />
                          
                          {/* Highways */}
                          {/* Anna Salai / GST Road */}
                          <path d="M -10,95 L 95,-10" fill="none" stroke="#ffe082" strokeWidth="2.5" />
                          <path d="M -10,95 L 95,-10" fill="none" stroke="#ffb300" strokeWidth="1.2" strokeLinecap="round" />
                          <path d="M -10,95 L 95,-10" fill="none" stroke="#fff" strokeWidth="0.25" strokeDasharray="1,1" />
                          
                          {/* Inner Ring Road */}
                          <path d="M 30,0 L 30,100" fill="none" stroke="#ffe082" strokeWidth="2.2" />
                          <path d="M 30,0 L 30,100" fill="none" stroke="#ffb300" strokeWidth="1" strokeLinecap="round" />
                          <path d="M 30,0 L 30,100" fill="none" stroke="#fff" strokeWidth="0.2" strokeDasharray="1,1" />
                          
                          {/* Secondary Roads */}
                          {/* Velachery Main Road */}
                          <path d="M 30,50 Q 55,56 88,42" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
                          {/* OMR */}
                          <path d="M 52,42 L 85,95" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
                          {/* Mount Poonamallee Road */}
                          <path d="M 0,38 L 30,45" fill="none" stroke="#fff" strokeWidth="1.0" strokeLinecap="round" />
                          {/* Grid streets */}
                          <path d="M 10,12 L 30,12" fill="none" stroke="#fff" strokeWidth="0.8" />
                          <path d="M 18,12 L 18,40" fill="none" stroke="#fff" strokeWidth="0.8" />
                          <path d="M 30,22 L 55,22" fill="none" stroke="#fff" strokeWidth="0.8" />
                          <path d="M 48,22 L 48,42" fill="none" stroke="#fff" strokeWidth="0.8" />
                          <path d="M 42,0 L 42,15" fill="none" stroke="#fff" strokeWidth="0.8" />
                          <path d="M 30,15 L 42,15" fill="none" stroke="#fff" strokeWidth="0.8" />
                          <path d="M 30,75 L 70,75" fill="none" stroke="#fff" strokeWidth="0.8" />
                          
                          {/* Cloverleaf Kathipara Interchange */}
                          <circle cx="30" cy="35" r="4.5" fill="none" stroke="#ffe082" strokeWidth="1.2" />
                          <circle cx="30" cy="35" r="4.5" fill="none" stroke="#ffb300" strokeWidth="0.6" />
                          
                          {/* Map Labels */}
                          <text x="66" y="24" fill="#78909c" fontSize="1.8" fontWeight="bold" fontFamily="sans-serif">GST Road (Anna Salai)</text>
                          <text x="33" y="38" fill="#d32f2f" fontSize="1.5" fontWeight="bold" fontFamily="sans-serif">Kathipara Jn.</text>
                          <text x="5" y="48" fill="#388e3c" fontSize="1.8" fontWeight="bold" fontFamily="sans-serif">Guindy Park</text>
                          <text x="42" y="63" fill="#388e3c" fontSize="1.6" fontWeight="bold" fontFamily="sans-serif">IIT Madras</text>
                          <text x="48" y="51" fill="#0288d1" fontSize="1.5" fontWeight="bold" fontFamily="sans-serif" transform="rotate(-10, 48, 51)">Adyar River</text>
                          <text x="92" y="50" fill="#0288d1" fontSize="2.0" fontWeight="bold" fontFamily="sans-serif" transform="rotate(90, 92, 50)">Bay of Bengal</text>
                          <text x="65" y="49" fill="#546e7a" fontSize="1.5" fontWeight="bold" fontFamily="sans-serif">Velachery</text>
                          <text x="52" y="18" fill="#546e7a" fontSize="1.5" fontWeight="bold" fontFamily="sans-serif">T. Nagar</text>
                          <text x="82" y="76" fill="#546e7a" fontSize="1.5" fontWeight="bold" fontFamily="sans-serif">OMR</text>

                          {/* Navigation route path */}
                          <path
                            d={`M ${mechStartX} ${mechStartY} L ${userPos.x} ${mechStartY} L ${userPos.x} ${userPos.y}`}
                            fill="none"
                            stroke="#93c5fd"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            opacity="0.75"
                          />
                          <path
                            d={`M ${mechStartX} ${mechStartY} L ${userPos.x} ${mechStartY} L ${userPos.x} ${userPos.y}`}
                            fill="none"
                            stroke="#2563eb"
                            strokeWidth="0.8"
                            strokeLinecap="round"
                            strokeDasharray="1.5,1.2"
                          />
                        </svg>

                        {/* Pin represent user vehicle breakdown spot */}
                        <div
                          className="absolute -ml-5 -mt-10 text-center z-10 transition-all duration-500"
                          style={{ left: `${userPos.x}%`, top: `${userPos.y}%` }}
                        >
                          <div className="w-10 h-10 bg-rose-600 text-white rounded-2xl flex items-center justify-center shadow-lg animate-bounce mx-auto border-2 border-white">
                            <Car className="w-5.5 h-5.5" />
                          </div>
                          <span className="text-[8px] font-black bg-slate-900 text-slate-105 px-1.5 py-0.5 rounded shadow mt-1 inline-block whitespace-nowrap">
                            Incident Site ({selectedLocation})
                          </span>
                        </div>

                        {/* Tow service approaching icon based on simulationStep */}
                        {simulationStep > 0 && (
                          <div
                            className="absolute -ml-5 -mt-10 text-center z-20 transition-all duration-[3000ms] ease-in-out"
                            style={{ left: `${currX}%`, top: `${currY}%` }}
                          >
                            <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg relative border-2 border-white mx-auto">
                              <Wrench className="w-4.5 h-4.5 text-white" />
                              {/* Flashing strobe beacon lamps */}
                              <div className="absolute -top-0.5 w-2 h-0.5 bg-red-400 left-1 rounded-full animate-pulse"></div>
                              <div className="absolute -top-0.5 w-2 h-0.5 bg-blue-400 right-1 rounded-full animate-pulse"></div>
                            </div>
                            <span className="text-[8px] font-black bg-blue-900 text-white px-1.5 py-0.5 rounded shadow mt-1 inline-block whitespace-nowrap">
                              🚚 {activeRequest.mechanicName || 'Rig'} En-Route
                            </span>
                          </div>
                        )}

                        {/* Live satellite data status feedback overlay */}
                        <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 border border-slate-205 rounded-xl flex justify-between items-center text-[11px] font-bold">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></div>
                            <span className="text-slate-800">
                              {simulationStep === 0 ? 'Wait Consultation approve' :
                               simulationStep === 1 ? `Mobilizing heavy recovery rig to ${selectedLocation}` :
                               simulationStep === 2 ? `Pulled over near ${selectedLocation} roadside` :
                               simulationStep === 3 ? 'Diagnostic Scan & Cable patch active' :
                               'Work finished safely'}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] bg-slate-100 py-1 px-2 border border-slate-200 rounded">
                            {simulationStep === 0 ? 'Coordinate locked' :
                             simulationStep === 1 ? 'En route' :
                             simulationStep === 2 ? '0.0 km' :
                             simulationStep === 3 ? 'On-site work' :
                             'Finished'}
                          </span>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* TAB 6: INR PRICING AND PAYMENT SCREEN */}
        {activeTab === 'payment' && (
          <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-100 p-6 shadow-lg space-y-6">
            
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <div>
                <h3 className="text-base font-black text-slate-900">National Payment Gateway (INR ₹)</h3>
                <p className="text-xs text-slate-400 mt-0.5">Approved service quotation invoices will be cleared here</p>
              </div>
              <CreditCard className="w-6 h-6 text-indigo-600" />
            </div>

            {!activeRequest ? (
              <div className="text-center p-6 space-y-3">
                <span className="text-4xl">🧾</span>
                <p className="text-xs text-slate-400 font-bold">No active un-billed invoices detected on your terminal.</p>
              </div>
            ) : !paymentSuccess ? (
              <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs font-bold text-slate-700">
                
                {/* Invoice breakup list */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <span className="text-[9px] text-slate-400 block uppercase">Billing statement breakdown</span>
                  
                  <div className="flex justify-between border-b border-slate-150 pb-1 text-slate-600 font-medium">
                    <span>Video Guidance Consultation Fee:</span>
                    <span>₹{activeRequest.consultationFee || 199}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-150 pb-1 text-slate-600 font-medium">
                    <span>On-Spot Roadside Visit travel Fee:</span>
                    <span>₹{activeRequest.roadsideVisitFee || 799}</span>
                  </div>
                  {activeRequest.repairEstimate ? (
                    <div className="flex justify-between border-b border-slate-150 pb-1 text-slate-600 font-medium">
                      <span>Mechanical Repair Material Estimate:</span>
                      <span>₹{activeRequest.repairEstimate}</span>
                    </div>
                  ) : null}

                  <div className="flex justify-between font-extrabold text-slate-800 pt-2.5 text-sm">
                    <span>Total Bill (Includes GST):</span>
                    <span className="text-blue-700">₹{activeRequest.totalCost} INR</span>
                  </div>
                </div>

                {/* Method switcher */}
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setPayMethod('upi')}
                    className={`py-2 p-1 text-center border rounded-lg transition ${
                      payMethod === 'upi' ? 'bg-blue-50 border-blue-400 text-blue-700 shadow-xs' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    🚀 Local UPI (GPay/PhonePe)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayMethod('card')}
                    className={`py-2 p-1 text-center border rounded-lg transition ${
                      payMethod === 'card' ? 'bg-blue-50 border-blue-400 text-blue-700 shadow-xs' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    💳 Visa / Rupay Checkout
                  </button>
                </div>

                {payMethod === 'upi' ? (
                  <div className="space-y-1.5">
                    <label>Enter Registered UPI virtual handle address</label>
                    <input
                      type="text"
                      required
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 bg-slate-50 rounded-lg outline-none focus:bg-white"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label>16-Digit National Bank Card Number</label>
                      <input
                        type="text"
                        placeholder="4234 8839 0102 9911"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full p-2.5 border border-slate-200 bg-slate-50 rounded-lg"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label>Expiry (MM/YY)</label>
                        <input
                          type="text"
                          placeholder="09/29"
                          required
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full p-2.5 border border-slate-200 bg-slate-50 rounded-lg animate-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label>CVV Number</label>
                        <input
                          type="password"
                          placeholder="•••"
                          required
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full p-2.5 border border-slate-200 bg-slate-50 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase rounded-xl shadow-md transition cursor-pointer tracking-wider"
                >
                  Settle ₹{activeRequest.totalCost} securely via {payMethod.toUpperCase()}
                </button>

              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 border border-emerald-250 rounded-2xl text-center text-xs font-bold text-emerald-805 space-y-2 leading-relaxed">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto animate-bounce" />
                  <p>In-App Settle Clearance Authorized!</p>
                  <span className="text-[10px] text-slate-505 block">Receipt transaction code: TXN-TN-504938210</span>
                </div>

                {/* Rating element post payment */}
                <div className="p-4 bg-slate-50 border border-slate-205 rounded-2xl space-y-3 text-xs font-bold">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Submit Service Rating Feed</span>
                  
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((st) => (
                      <button
                        type="button"
                        key={st}
                        onClick={() => setUserRating(st)}
                        className="cursor-pointer"
                      >
                        <Star className={`w-6 h-6 ${(st <= userRating) ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>

                  <textarea
                    required
                    placeholder="Provide diagnostic feedback details (e.g. Arul Motors technicians replaced battery line fast inside Guindy sector)..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    rows={2}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg"
                  ></textarea>

                  <button
                    type="button"
                    onClick={handleFeedbackSubmit}
                    className="w-full py-2 bg-blue-605 text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition text-[11px] uppercase tracking-wider"
                  >
                    Publish Verified Review & Settle Log
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

        {/* TAB 7: VEHICLE REGISTRATION */}
        {activeTab === 'vehicles' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-none">
            
            {/* Form */}
            <div className="md:col-span-5 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Configure Vehicle Details</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Sync state registration sensors</p>
              </div>

              {vehError && (
                <div className="p-2 bg-rose-50 border border-rose-100 text-rose-800 text-[11px] font-bold rounded-lg leading-relaxed">
                  {vehError}
                </div>
              )}

              <form onSubmit={handleAddVehicle} className="space-y-4 text-xs font-bold text-slate-700">
                
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Vehicle Category</label>
                  <select
                    value={newVehicle.type || 'Car'}
                    disabled
                    className="w-full p-2 border border-slate-200 bg-slate-100 rounded-md outline-none cursor-not-allowed text-slate-500 font-semibold"
                  >
                    <option value="Car">Car 🚗</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label>Brand Manufacturer</label>
                    <input
                      type="text"
                      placeholder="Hyundai"
                      value={newVehicle.brand}
                      onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                      className="w-full p-2 border border-slate-200 bg-slate-50/50 rounded-md outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label>Model Variant</label>
                    <input
                      type="text"
                      placeholder="Creta SX"
                      value={newVehicle.model}
                      onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                      className="w-full p-2 border border-slate-200 bg-slate-50/50 rounded-md outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label>Manufacture Year</label>
                    <input
                      type="number"
                      value={newVehicle.year}
                      onChange={(e) => setNewVehicle({ ...newVehicle, year: Number(e.target.value) })}
                      className="w-full p-2 border border-slate-200 bg-slate-50/50 rounded-md outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label>Body Color</label>
                    <input
                      type="text"
                      placeholder="Polar White"
                      value={newVehicle.color}
                      onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })}
                      className="w-full p-2 border border-slate-200 bg-slate-50/50 rounded-md outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label>Tamil Nadu Registration Plate</label>
                  <input
                    type="text"
                    placeholder="TN 07 AH 5678"
                    value={newVehicle.plate}
                    onChange={(e) => setNewVehicle({ ...newVehicle, plate: e.target.value })}
                    className="w-full p-2.5 border border-blue-200 bg-blue-50/20 font-mono font-bold tracking-widest rounded-lg focus:bg-white outline-none uppercase text-xs"
                  />
                  <p className="text-[9px] text-slate-400 font-medium font-sans">Car formats: TN 01 AB 1234, TN 07 CD 5678</p>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-none rounded-xl text-xs transition uppercase tracking-wider cursor-pointer"
                >
                  Confirm Registration
                </button>
              </form>
            </div>

            {/* Configured vehicles list */}
            <div className="md:col-span-7 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div>
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Registered Active Fleet</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">These vehicles represent coverage under Chennai District Rescue Hubs</p>
              </div>

              <div className="space-y-3">
                {vehicles.map((v) => (
                  <div key={v.id} className="p-3.5 border border-slate-150 rounded-xl flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                        <Car className="w-5.5 h-5.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-805 leading-none flex items-center gap-2">
                          <span>{v.brand} {v.model}</span>
                          <span className="text-[8px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded uppercase">Car</span>
                        </h4>
                        <span className="text-[10px] font-mono font-bold text-slate-500 tracking-wider block mt-2 text-[9px]">
                          {v.plate} • {v.color} • {v.year}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteVehicle(v.id)}
                      className="p-1 px-2 hover:bg-rose-50 text-rose-600 border border-transparent hover:border-rose-200 text-[10px] font-bold rounded"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 8: SERVICE HISTORY & RATINGS LOG */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900">Roadside Service Logs History</h2>
              <p className="text-xs text-slate-400 mt-0.5 font-bold">Comprehensive historical record of assistance coordinates dispatch events</p>
            </div>

            <div className="space-y-4">
              {serviceHistory.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-10 font-bold">No registered logs recorded yet.</p>
              ) : (
                serviceHistory.map((sh) => (
                  <div key={sh.id} className="p-4 border border-slate-150 rounded-xl space-y-3 bg-slate-50/20 text-xs font-bold text-slate-700">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[8px] bg-slate-200 text-slate-755 p-1 px-2.5 rounded-full uppercase tracking-wider font-extrabold leading-none">
                          INCIDENT ID: {sh.id}
                        </span>
                        <h4 className="text-xs font-black text-slate-910 mt-2">{sh.vehicleName}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-slate-900 block">₹{sh.totalCost}</span>
                        <span className="text-[9px] text-emerald-600 block">Completed & Paid</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[10px] border-t border-slate-150 pt-2.5 font-bold text-slate-600">
                      <div>
                        <span className="text-[8px] text-slate-400 uppercase block">Diagnostics Category</span>
                        <span className="text-slate-800 block text-xs mt-1 leading-none">{sh.breakdownType}</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-400 uppercase block">Contractor Unit</span>
                        <span className="text-slate-805 block text-xs mt-1 leading-none">{sh.mechanicName || 'Contracted Center'}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[8px] text-slate-400 uppercase block">Landmarked Incident Coordinates</span>
                        <span className="text-slate-805 block text-xs mt-1 leading-normal truncate">{sh.locationName}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200/50 flex justify-between items-center text-[10px] leading-relaxed">
                      <div className="flex items-center gap-1.5 font-bold text-slate-700">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="font-extrabold">Rated: {sh.rating} / 5</span>
                        <span className="text-slate-500 truncate max-w-xs font-semibold">"{sh.feedback}"</span>
                      </div>
                      <button
                        onClick={() => alert(`INVOICING DOCUMENT DESK\n\nLicense Unit: RoadAssist OS Tamil Nadu\nReference Code: ${sh.id}\nAssisting Node: ${sh.mechanicName}\nTotal Charged: INR ₹${sh.totalCost}\nTax Invoice: Cleared`)}
                        className="px-2.5 py-1 text-[10px] font-extrabold hover:bg-slate-50 border border-slate-200/60 rounded-md transition flex items-center gap-1 cursor-pointer whitespace-nowrap"
                      >
                        <Printer className="w-3" /> Print Invoice receipt
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 10: METRIC TERMINAL SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-black text-slate-900">Local System parameters Settings Page</h2>
              <p className="text-xs text-slate-400 mt-0.5 font-bold">Customize localized translation languages and device telemetry variables</p>
            </div>

            <div className="space-y-4 text-xs font-bold text-slate-750 max-w-md">
              
              <div className="space-y-1">
                <label className="flex items-center gap-1">
                  <Languages className="w-4 h-4" /> Selected Localized App Language
                </label>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <button
                    type="button"
                    onClick={() => setAppLanguage('en')}
                    className={`py-2 border rounded-lg ${
                      appLanguage === 'en' ? 'bg-blue-50 border-blue-400 text-blue-700 shadow-xs' : 'border-slate-205 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    English (Standard Global)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAppLanguage('ta')}
                    className={`py-2 border rounded-lg ${
                      appLanguage === 'ta' ? 'bg-blue-50 border-blue-400 text-blue-700 shadow-xs' : 'border-slate-205 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    தமிழ் (Tamil Nadu Localized)
                  </button>
                </div>
              </div>

              <div className="space-y-1 pt-3">
                <label className="flex items-center gap-1 font-bold">
                  <Sliders className="w-4 h-4 text-indigo-600" /> Live GPS Driving Simulation Rate
                </label>
                <select
                  value={simulationSpeedMultiplier}
                  onChange={(e) => setSimulationSpeedMultiplier(e.target.value)}
                  className="w-full p-2 border border-slate-200 bg-slate-50 rounded-lg font-bold"
                >
                  <option value="1.0x">1.0x Standard Tow Drive Speed</option>
                  <option value="1.5x">1.5x Fast Telemetry Sweeps</option>
                  <option value="2.0x">2.0x Accelerated Dry Runs</option>
                </select>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-4 border border-slate-150 rounded-xl pt-3">
                <div className="space-y-0.5">
                  <span className="block font-extrabold text-slate-805">Emergency SOS Warning Siren Noise</span>
                  <span className="text-[10px] text-slate-400 font-semibold block leading-normal">Play responsive emergency acoustic signals upon critical breakdown reporting triggers.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoSirenVolume(!autoSirenVolume)}
                  className={`w-10 h-6 rounded-full p-1 transition-colors outline-none cursor-pointer ${
                    autoSirenVolume ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-100 ${
                    autoSirenVolume ? 'translate-x-4' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>

              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-1 text-[11px] text-blue-900 leading-normal font-semibold">
                <span>District regulatory notice:</span>
                <p>System complies with security and TLS-1.3 standard data encryption requirements under Tamil Nadu Information Technology standards.</p>
              </div>

            </div>
          </div>
        )}

        {/* TAB 9: DISPATCH ALERTS (NOTIFICATIONS INBOX) */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-p-100 pb-3">
              <div>
                <h2 className="text-lg font-black text-slate-900">Dispatch alerts and Regional bulletins</h2>
                <p className="text-xs text-slate-400 font-semibold">Real-time municipal alerts, climate warning sirens, and order updates.</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                className="px-3 py-1.5 hover:bg-slate-100 text-slate-700 font-extrabold text-xs rounded-lg transition"
              >
                Mark all read
              </button>
            </div>

            <div className="space-y-3">
              {notifications.map((not) => (
                <div
                  key={not.id}
                  className={`p-4 border rounded-xl flex items-start gap-3 transition ${
                    !not.read ? 'border-orange-200 bg-orange-50/30 shadow-xs' : 'border-slate-150 bg-white'
                  }`}
                >
                  <div className="p-2 bg-slate-100 rounded-lg shrink-0 text-slate-600">
                    🔔
                  </div>
                  <div className="flex-1 min-w-0 font-medium">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-slate-800 leading-none">{not.title}</h4>
                      <span className="text-[9px] text-slate-400">
                        {new Date(not.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {not.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 11: USER PROFILE EDIT PAGE */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border border-slate-105 p-6 md:p-8 shadow-sm space-y-6 animate-none">
            
            <div className="border-b border-slate-150 pb-4">
              <h2 className="text-lg font-black text-slate-905">Roadside Assistance Core Profile Page</h2>
              <p className="text-xs text-slate-450 mt-1 font-semibold">Verify diagnostic telemetry identifiers coordinates and backup emergency mobile numbers</p>
            </div>

            {profSaved && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold rounded-lg mb-2">
                ✔ Profile updates successfully bound to central database coordinates.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-bold text-slate-700">
              
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-450 mb-1 font-bold">Driver Email Identification</label>
                  <input
                    type="text"
                    value={userEmail}
                    disabled
                    className="w-full p-2.5 bg-slate-100 border border-slate-200 text-slate-500 rounded-lg cursor-not-allowed leading-tight"
                  />
                </div>

                <div>
                  <label className="block text-slate-455 mb-1 font-bold">Authorized Full Legal Name</label>
                  <input
                    type="text"
                    value={userName}
                    disabled
                    className="w-full p-2.5 bg-slate-100 border border-slate-200 text-slate-505 rounded-lg cursor-not-allowed leading-tight"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">On-Duty Mobile Active Number</label>
                  <input
                    type="text"
                    value={profPhone}
                    onChange={(e) => setProfPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-slate-400 mb-1">Assisted Residential Address</label>
                  <input
                    type="text"
                    value={profAddress}
                    onChange={(e) => setProfAddress(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-1">Next of Kin Contact Name</label>
                    <input
                      type="text"
                      value={profEmergencyName}
                      onChange={(e) => setProfEmergencyName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-250 rounded-lg focus:bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Next of Kin Contact Phone</label>
                    <input
                      type="text"
                      value={profEmergencyPhone}
                      onChange={(e) => setProfEmergencyPhone(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-250 rounded-lg focus:bg-white outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setProfSaved(true);
                      setTimeout(() => setProfSaved(false), 3000);
                    }}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-none rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Settle profile details
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

// Simple mock images to show after file uploads
const UploadedPhotoMocks = [
  'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=150',
  'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?w=150',
  'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=150'
];
