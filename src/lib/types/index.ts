import { Prisma } from '@prisma/client';

// ==================== FILTER TYPES ====================

export interface BaseFilters {
  startDate?: string | Date;
  endDate?: string | Date;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ClientFilters extends BaseFilters {
  cityId?: string;
  isActive?: boolean;
  groupId?: string;
}

export interface ComplaintFilters extends BaseFilters {
  clientId?: string;
  status?: string;
  priority?: string;
  assignedTo?: string;
  complaintType?: string;
}

export interface OrderFilters extends BaseFilters {
  clientId?: string;
  status?: string;
  orderType?: string;
  branchId?: string;
}

export interface DispatchFilters extends BaseFilters {
  orderId?: string;
  status?: string;
  deliveryBoy?: string;
  dispatchType?: string;
}

export interface PrinterFilters extends BaseFilters {
  clientId?: string;
  modelId?: string;
  status?: string;
  type?: string;
}

export interface ReportFilters extends BaseFilters {
  clientId?: string;
  branchId?: string;
  cityId?: string;
  month?: string;
  year?: string;
  status?: string;
  type?: string;
}

// ==================== PRISMA WHERE TYPES ====================

export type ClientWhereInput = Prisma.ClientWhereInput;
export type OrderWhereInput = Prisma.OrderWhereInput;
export type ComplaintWhereInput = Prisma.ComplaintWhereInput;
export type PrinterWhereInput = Prisma.PrinterWhereInput;
export type DispatchWhereInput = Prisma.DispatchWhereInput;

// ==================== RESPONSE TYPES ====================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==================== EMAIL TEMPLATE DATA TYPES ====================

export interface UserCredentialsEmailData {
  name: string;
  username: string;
  password: string;
  loginUrl: string;
}

export interface ComplaintEmailData {
  clientName: string;
  complaintNumber: string;
  description: string;
  priority: string;
  assignedTo: string;
}

export interface AgreementReminderEmailData {
  clientName: string;
  agreementNumber: string;
  endDate: string;
  daysRemaining: number;
}

export type EmailTemplateData = 
  | UserCredentialsEmailData 
  | ComplaintEmailData 
  | AgreementReminderEmailData;

// ==================== EXCEL EXPORT TYPES ====================

export interface ExcelColumnn {
  header: string;
  key: string;
  width?: number;
  style?: Partial<{
    font: { bold?: boolean; size?: number };
    alignment: { horizontal?: string; vertical?: string };
    fill: { type: string; fgColor: { argb: string } };
  }>;
}

export interface ExcelExportOptions {
  filename: string;
  sheetName: string;
  columns: ExcelColumnn[];
  data: Record<string, unknown>[];
  title?: string;
}