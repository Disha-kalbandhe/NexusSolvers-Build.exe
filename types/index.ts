// Admin types
export interface CollegeStats {
  collegeName: string;
  location: string;
  totalReports: number;
  criticalCases: number;
  lastReport: Date;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
}

export interface BiasReport {
  id: string;
  collegeName: string;
  studentName?: string;
  reportDate: Date;
  biasType: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'reviewed' | 'resolved';
  description?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'college_admin' | 'student';
  collegeName?: string;
}
