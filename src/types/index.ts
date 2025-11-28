// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  age?: number;
  phone?: string;
  profileImage?: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  age?: number;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Health Data Types
export type HealthState = 
  | 'Normal' 
  | 'Stressed' 
  | 'Tachycardia' 
  | 'Bradycardia' 
  | 'Hypoxia' 
  | 'Warning' 
  | 'Critical';

export type ActivityLevel = 
  | 'Resting' 
  | 'Light' 
  | 'Moderate' 
  | 'Active' 
  | 'Intense';

export interface CurrentHealthStatus {
  heartRate: number;
  spo2: number;
  healthState: HealthState;
  activityLevel: ActivityLevel;
  timestamp: string;
  healthScore?: number;
}

export interface HistoricalDataPoint {
  timestamp: string;
  heartRate?: number;
  spo2?: number;
  healthScore?: number;
  activityLevel?: ActivityLevel;
}

export interface BehavioralPattern {
  id: string;
  pattern: string;
  description: string;
  occurrences: Array<{
    timestamp: string;
    duration: number;
  }>;
  cluster?: number;
}

// Alert Types
export type AlertType = 'Predictive' | 'Anomaly' | 'Emergency' | 'System';
export type AlertSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  acknowledged: boolean;
  relatedMetrics?: {
    heartRate?: number;
    spo2?: number;
    predictedValue?: number;
  };
  recommendedActions?: string[];
}

// Emergency Types
export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
  priority: number;
}

export interface EmergencyAlert {
  id: string;
  type: 'Manual' | 'Fall' | 'Critical';
  timestamp: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Resolved';
  location?: {
    latitude: number;
    longitude: number;
  };
  triggeredBy: 'User' | 'System';
}

// Settings Types
export interface ThresholdSettings {
  lowSpo2: number;
  highHeartRate: number;
  lowHeartRate: number;
  criticalSpo2: number;
}

export interface NotificationPreferences {
  predictiveAlerts: boolean;
  anomalyAlerts: boolean;
  emergencyAlerts: boolean;
  systemNotifications: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface AppSettings {
  thresholds: ThresholdSettings;
  notifications: NotificationPreferences;
  darkMode: boolean;
  autoRefreshInterval: number; // in seconds
}

// Time Range Types
export type TimeRange = '24h' | '7d' | '30d' | '90d';

export interface TimeRangeOption {
  value: TimeRange;
  label: string;
  hours: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
