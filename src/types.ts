/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  status: 'ready' | 'broken';
  type?: 'Car';
}

export type BreakdownType = 
  | 'Engine Issue'
  | 'Battery Problem'
  | 'Flat Tyre'
  | 'Brake Issue'
  | 'Fuel Problem'
  | 'Electrical Issue'
  | 'Overheating'
  | 'Accident Assistance'
  | 'Other'
  | 'Engine Malfunction'
  | 'Flat Tire'
  | 'Dead Battery'
  | 'Fuel Starvation'
  | 'Break Fail'
  | 'Lockout / Key Lost'
  | 'Other Mechanical';
export type RequestStatus = 'pending' | 'accepted' | 'dispatched' | 'arrived' | 'in-progress' | 'completed' | 'cancelled';
export type UserRole = 'customer' | 'mechanic' | 'admin';

export interface BreakdownReport {
  id: string;
  vehicleId: string;
  vehicleName: string;
  breakdownType: BreakdownType;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical SOS';
  status: RequestStatus;
  locationName: string;
  latitude: number;
  longitude: number;
  mechanicId?: string;
  mechanicName?: string;
  requestedAt: string;
  updatedAt: string;
  totalCost: number;
  rating?: number;
  feedback?: string;
  paymentStatus: 'unpaid' | 'paid';
  paymentMethod?: 'card' | 'upi' | 'apple-pay' | 'cash';
  // New props for Chennai Roadside OS requirements
  photoUrl?: string;
  videoUrl?: string;
  videoName?: string;
  consultationFee?: number;
  roadsideVisitFee?: number;
  repairEstimate?: number;
  quoteStatus?: 'none' | 'proposed' | 'accepted' | 'rejected' | 'paid';
  chatHistory?: { sender: 'customer' | 'mechanic'; message: string; time: string }[];
  videoCallState?: 'inactive' | 'calling' | 'active' | 'ended';
  isSOSTriggered?: boolean;
}

export interface Mechanic {
  id: string;
  name: string;
  phone: string;
  distance: number; // in km
  rating: number;
  reviewsCount: number;
  specialization: string[];
  latitude: number;
  longitude: number;
  isAvailable: boolean;
  address: string;
  profileImg: string;
  vehicleDetails: string;
  experience?: string;
  serviceArea?: string;
}

export interface NotificationAlert {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  timestamp: string;
  read: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'assistance' | 'payment' | 'accounts' | 'mechanic';
}
