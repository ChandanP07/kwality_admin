import { z } from 'zod';

// ==================== USER VALIDATIONS ====================

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  mobile: z.string()
    .min(10, 'Mobile number must be at least 10 digits')
    .max(15, 'Mobile number must not exceed 15 digits')
    .regex(/^[0-9+\-\s()]+$/, 'Invalid mobile number format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  role: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE', 'TECHNICIAN', 'CLIENT']).optional(),
});

export const updateUserSchema = z.object({
  id: z.string().min(1, 'Invalid user ID'),
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  mobile: z.string()
    .min(10)
    .max(15)
    .regex(/^[0-9+\-\s()]+$/)
    .optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE', 'TECHNICIAN', 'CLIENT']).optional(),
  isActive: z.boolean().optional(),
});

export const resetPasswordSchema = z.object({
  userId: z.string().min(1, 'Invalid user ID'),
});

// ==================== CLIENT VALIDATIONS ====================

export const createClientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200),
  companyName: z.string().min(2).max(200).optional(),
  email: z.string().email('Invalid email address'),
  mobile: z.string()
    .min(10)
    .max(15)
    .regex(/^[0-9+\-\s()]+$/),
  address: z.string().min(5).max(500),
  cityId: z.string().min(1, 'Invalid city ID'),
  pincode: z.string()
    .length(6, 'Pincode must be 6 digits')
    .regex(/^[0-9]{6}$/, 'Invalid pincode format'),
  gstNumber: z.string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST number')
    .optional()
    .or(z.literal('')),
  panNumber: z.string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN number')
    .optional()
    .or(z.literal('')),
});

export const updateClientSchema = z.object({
  id: z.string().min(1, 'Invalid client ID'),
  name: z.string().min(2).max(200).optional(),
  companyName: z.string().min(2).max(200).optional(),
  email: z.string().email().optional(),
  mobile: z.string()
    .min(10)
    .max(15)
    .regex(/^[0-9+\-\s()]+$/)
    .optional(),
  address: z.string().min(5).max(500).optional(),
  cityId: z.string().min(1).optional(),
  pincode: z.string()
    .length(6)
    .regex(/^[0-9]{6}$/)
    .optional(),
  gstNumber: z.string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .optional()
    .or(z.literal('')),
  panNumber: z.string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
    .optional()
    .or(z.literal('')),
  isActive: z.boolean().optional(),
});

// ==================== CITY VALIDATIONS ====================

export const createCitySchema = z.object({
  name: z.string().min(2, 'City name must be at least 2 characters').max(100),
  state: z.string().min(2, 'State name must be at least 2 characters').max(100),
  country: z.string().min(2).max(100).default('India'),
});

export const updateCitySchema = z.object({
  id: z.string().min(1, 'Invalid city ID'),
  name: z.string().min(2).max(100).optional(),
  state: z.string().min(2).max(100).optional(),
  country: z.string().min(2).max(100).optional(),
  isActive: z.boolean().optional(),
});

// ==================== PRINTER VALIDATIONS ====================

export const createPrinterModelSchema = z.object({
  modelName: z.string().min(2).max(200),
  manufacturer: z.string().min(2).max(100),
  type: z.enum(['LASER', 'INKJET', 'DOT_MATRIX', 'THERMAL', 'MULTIFUNCTION']),
  description: z.string().max(1000).optional(),
});

export const createClientPrinterSchema = z.object({
  clientId: z.string().min(1, 'Invalid client ID'),
  printerModelId: z.string().min(1, 'Invalid printer model ID'),
  serialNumber: z.string().min(2).max(100),
  installationDate: z.string().datetime().or(z.date()),
  location: z.string().min(2).max(200).optional(),
  monthlyPageLimit: z.number().int().positive().optional(),
  rentalRate: z.number().positive().optional(),
});

export const printerPurchaseSchema = z.object({
  printerModelId: z.string().min(1, 'Invalid printer model ID'),
  vendorId: z.string().min(1, 'Invalid vendor ID'),
  quantity: z.number().int().positive('Quantity must be a positive number'),
  unitPrice: z.number().positive('Unit price must be positive'),
  totalPrice: z.number().positive('Total price must be positive'),
  purchaseDate: z.string().datetime().or(z.date()),
  invoiceNumber: z.string().min(1).max(100),
});

// ==================== ORDER VALIDATIONS ====================

export const createOrderSchema = z.object({
  clientId: z.string().min(1, 'Invalid client ID'),
  orderType: z.enum(['CARTRIDGE', 'TONER', 'PARTS', 'SERVICE', 'RENTAL']),
  items: z.array(z.object({
    itemId: z.string().min(1),
    quantity: z.number().int().positive(),
    rate: z.number().positive(),
  })).min(1, 'At least one item is required'),
  remarks: z.string().max(1000).optional(),
});

// ==================== COMPLAINT VALIDATIONS ====================

export const createComplaintSchema = z.object({
  clientId: z.string().min(1, 'Invalid client ID'),
  printerIds: z.array(z.string().min(1)).min(1, 'At least one printer is required'),
  complaintType: z.enum(['BREAKDOWN', 'MAINTENANCE', 'INSTALLATION', 'QUALITY_ISSUE', 'OTHER']),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  requestedDate: z.string().datetime().or(z.date()).optional(),
});

export const updateComplaintSchema = z.object({
  id: z.string().min(1, 'Invalid complaint ID'),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED']).optional(),
  assignedTo: z.string().min(1).optional(),
  resolution: z.string().max(2000).optional(),
  resolvedDate: z.string().datetime().or(z.date()).optional(),
});

// ==================== AGREEMENT VALIDATIONS ====================

export const createAgreementSchema = z.object({
  clientId: z.string().min(1, 'Invalid client ID'),
  printerIds: z.array(z.string().min(1)).min(1, 'At least one printer is required'),
  startDate: z.string().datetime().or(z.date()),
  endDate: z.string().datetime().or(z.date()),
  monthlyRental: z.number().positive('Monthly rental must be positive'),
  pageRate: z.number().positive('Page rate must be positive'),
  freePages: z.number().int().nonnegative('Free pages must be non-negative').optional(),
  terms: z.string().max(5000).optional(),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end > start;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

// ==================== BRANCH VALIDATIONS ====================

export const createBranchSchema = z.object({
  name: z.string().min(2).max(200),
  code: z.string().min(2).max(50).regex(/^[A-Za-z0-9_-]+$/, 'Branch code must contain only letters, numbers, hyphens, and underscores'),
  cityId: z.string().min(1, 'Invalid city ID'),
  address: z.string().min(5).max(500),
  contactPerson: z.string().min(2).max(100),
  contactNumber: z.string()
    .min(10)
    .max(15)
    .regex(/^[0-9+\-\s()]+$/),
  email: z.string().email(),
});

export const updateBranchSchema = z.object({
  id: z.string().min(1, 'Invalid branch ID'),
  name: z.string().min(2).max(200).optional(),
  cityId: z.string().min(1).optional(),
  address: z.string().min(5).max(500).optional(),
  contactPerson: z.string().min(2).max(100).optional(),
  contactNumber: z.string()
    .min(10)
    .max(15)
    .regex(/^[0-9+\-\s()]+$/)
    .optional(),
  email: z.string().email().optional(),
  isActive: z.boolean().optional(),
});

// ==================== TERMINATION VALIDATIONS ====================

export const createTerminationSchema = z.object({
  clientId: z.string().min(1, 'Invalid client ID'),
  agreementId: z.string().min(1, 'Invalid agreement ID'),
  terminationDate: z.string().datetime().or(z.date()),
  reason: z.string().min(10, 'Reason must be at least 10 characters').max(2000),
  finalAmount: z.number().nonnegative('Final amount must be non-negative').optional(),
});

// ==================== REPLACEMENT VALIDATIONS ====================

export const createReplacementSchema = z.object({
  clientId: z.string().min(1, 'Invalid client ID'),
  oldPrinterId: z.string().min(1, 'Invalid old printer ID'),
  newPrinterId: z.string().min(1, 'Invalid new printer ID'),
  replacementDate: z.string().datetime().or(z.date()),
  reason: z.string().min(10).max(2000),
});

// ==================== DISPATCH VALIDATIONS ====================

export const createDispatchSchema = z.object({
  orderId: z.string().min(1, 'Invalid order ID'),
  dispatchDate: z.string().datetime().or(z.date()),
  deliveryBoy: z.string().min(1, 'Invalid delivery boy ID').optional(),
  courierName: z.string().min(2).max(100).optional(),
  trackingNumber: z.string().max(100).optional(),
  dispatchType: z.enum(['SELF', 'COURIER']),
});

export const updateDispatchSchema = z.object({
  id: z.string().min(1, 'Invalid dispatch ID'),
  status: z.enum(['PENDING', 'IN_TRANSIT', 'DELIVERED', 'RETURNED']).optional(),
  deliveryDate: z.string().datetime().or(z.date()).optional(),
  receivedBy: z.string().max(100).optional(),
  remarks: z.string().max(1000).optional(),
});

// ==================== MIS REPORT VALIDATIONS ====================

export const reportFiltersSchema = z.object({
  startDate: z.string().datetime().or(z.date()).optional(),
  endDate: z.string().datetime().or(z.date()).optional(),
  clientId: z.string().min(1).optional(),
  branchId: z.string().min(1).optional(),
  cityId: z.string().min(1).optional(),
  status: z.string().optional(),
  type: z.string().optional(),
  month: z.string().regex(/^(0[1-9]|1[0-2])$/).optional(), // 01-12
  year: z.string().regex(/^[0-9]{4}$/).optional(), // YYYY
});

// ==================== HELPER FUNCTIONS ====================

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type CreateCityInput = z.infer<typeof createCitySchema>;
export type UpdateCityInput = z.infer<typeof updateCitySchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CreateComplaintInput = z.infer<typeof createComplaintSchema>;
export type UpdateComplaintInput = z.infer<typeof updateComplaintSchema>;
export type CreateAgreementInput = z.infer<typeof createAgreementSchema>;
export type ReportFiltersInput = z.infer<typeof reportFiltersSchema>;

/**
 * Validation helper function
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validated data or throws error with details
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map((err: z.ZodIssue) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      throw new Error(JSON.stringify({
        message: 'Validation failed',
        errors: errorMessages
      }));
    }
    throw error;
  }
}

/**
 * Safe validation that returns result object
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Array<{ field: string; message: string }> } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  } else {
    const errors = result.error.issues.map(err => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    return { success: false, errors };
  }
}