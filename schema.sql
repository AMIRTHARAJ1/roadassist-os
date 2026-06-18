-- Schema for RoadAssist OS Breakdown Reports and Notifications

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: breakdown_reports
CREATE TABLE IF NOT EXISTS public.breakdown_reports (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  "vehicleId" text NOT NULL,
  "vehicleName" text NOT NULL,
  "breakdownType" text NOT NULL,
  description text NOT NULL,
  severity text NOT NULL,
  status text NOT NULL,
  "locationName" text NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  "mechanicId" text,
  "mechanicName" text,
  "requestedAt" timestamp with time zone DEFAULT now(),
  "updatedAt" timestamp with time zone DEFAULT now(),
  "totalCost" numeric DEFAULT 0,
  rating numeric,
  feedback text,
  "paymentStatus" text DEFAULT 'unpaid',
  "paymentMethod" text,
  "photoUrl" text,
  "videoUrl" text,
  "videoName" text,
  "consultationFee" numeric,
  "roadsideVisitFee" numeric,
  "repairEstimate" numeric,
  "quoteStatus" text DEFAULT 'none',
  "chatHistory" jsonb DEFAULT '[]'::jsonb,
  "videoCallState" text DEFAULT 'inactive',
  "isSOSTriggered" boolean DEFAULT false
);

-- Table: notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL,
  timestamp timestamp with time zone DEFAULT now(),
  read boolean DEFAULT false
);

-- Note: In a real production environment you should configure Row Level Security (RLS)
-- and proper foreign keys matching the mechanics and vehicles tables.
