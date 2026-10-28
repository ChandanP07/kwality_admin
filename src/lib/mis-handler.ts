import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { prisma } from './prisma';
import { reports, ReportConfig } from '@/config/reports';
import { generateExcel } from './excel-export';
import { ReportFilters, ApiResponse } from './types';
import { Prisma } from '@prisma/client';
import { serializeData, flattenObject } from './utils';

// Define specific where input types for each model
type ModelWhereInput =
  | Prisma.ClientWhereInput
  | Prisma.OrderWhereInput
  | Prisma.ComplaintWhereInput
  | Prisma.PrinterWhereInput
  | Prisma.DispatchWhereInput
  | Prisma.AgreementWhereInput
  | Prisma.BranchWhereInput;

export async function handleMISRequest(
  request: NextRequest,
  category: string,
  reportName: string
): Promise<NextResponse<ApiResponse<unknown>>> {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check role permissions
    if (!['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    const reportId = `${category}-${reportName}`;
    const reportConfig = reports[reportId] as ReportConfig | undefined;

    if (!reportConfig) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const filters: ReportFilters = {
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      clientId: searchParams.get('clientId') || undefined,
      branchId: searchParams.get('branchId') || undefined,
      cityId: searchParams.get('cityId') || undefined,
      status: searchParams.get('status') || undefined,
      type: searchParams.get('type') || undefined,
      month: searchParams.get('month') || undefined,
      year: searchParams.get('year') || undefined,
    };

    // Build where clause with proper typing
    const where: ModelWhereInput = {};

    // Add date filters
    if (filters.startDate || filters.endDate) {
      const dateField = reportConfig.dateField || 'createdAt';
      const dateFilter: Prisma.DateTimeFilter = {};

      if (filters.startDate) {
        dateFilter.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        dateFilter.lte = new Date(filters.endDate);
      }

      (where as Record<string, unknown>)[dateField] = dateFilter;
    }

    // Add month/year filters
    if (filters.month && filters.year) {
      const startDate = new Date(parseInt(filters.year), parseInt(filters.month) - 1, 1);
      const endDate = new Date(parseInt(filters.year), parseInt(filters.month), 0);

      const dateField = reportConfig.dateField || 'createdAt';
      (where as Record<string, unknown>)[dateField] = {
        gte: startDate,
        lte: endDate,
      };
    }

    // Add other filters
    if (filters.clientId) {
      (where as Record<string, unknown>).clientId = filters.clientId;
    }
    if (filters.branchId) {
      (where as Record<string, unknown>).branchId = filters.branchId;
    }
    if (filters.status) {
      (where as Record<string, unknown>).status = filters.status;
    }

    // Add fixed values from report config (baseline filters)
    if (reportConfig.fixedValues) {
      Object.assign(where, reportConfig.fixedValues);
    }

    const model = reportConfig.model || 'client';

    // Dynamic access to prisma models
    const prismaModel = (prisma as any)[model];
    if (!prismaModel || typeof prismaModel.findMany !== 'function') {
      // Model doesn't exist in schema — return empty data gracefully
      return NextResponse.json({
        success: true,
        data: [],
        message: `${reportConfig.title} — No data available (module not yet configured)`,
      });
    }

    const data = await prismaModel.findMany({
      where,
      include: reportConfig.include,
    });

    const serializedData = serializeData(data);
    const flattenedData = Array.isArray(serializedData)
      ? serializedData.map(item => flattenObject(item))
      : flattenObject(serializedData);

    return NextResponse.json({
      success: true,
      data: flattenedData,
      message: `${reportConfig.title} generated successfully`,
    });
  } catch (error) {
    console.error('MIS Report Error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      category,
      reportName,
    });

    return NextResponse.json(
      {
        success: false,
        error: 'Internal error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function handleMISExport(
  request: NextRequest,
  category: string,
  reportName: string,
  generator?: any
): Promise<Response> {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(session.user.role)) {
      return new Response('Unauthorized', { status: 401 });
    }

    const reportId = `${category}-${reportName}`;
    const reportConfig = reports[reportId] as ReportConfig | undefined;

    if (!reportConfig) {
      return new Response('Report not found', { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const filters: ReportFilters = {
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      clientId: searchParams.get('clientId') || undefined,
      month: searchParams.get('month') || undefined,
      year: searchParams.get('year') || undefined,
    };

    // Build where clause (same as above)
    const where: ModelWhereInput = {};

    if (filters.startDate || filters.endDate) {
      const dateField = reportConfig.dateField || 'createdAt';
      const dateFilter: Prisma.DateTimeFilter = {};

      if (filters.startDate) {
        dateFilter.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        dateFilter.lte = new Date(filters.endDate);
      }

      (where as Record<string, unknown>)[dateField] = dateFilter;
    }

    // Add month/year filters
    if (filters.month && filters.year) {
      const startDate = new Date(parseInt(filters.year), parseInt(filters.month) - 1, 1);
      const endDate = new Date(parseInt(filters.year), parseInt(filters.month), 0);

      const dateField = reportConfig.dateField || 'createdAt';
      (where as Record<string, unknown>)[dateField] = {
        gte: startDate,
        lte: endDate,
      };
    }

    if (filters.clientId) {
      (where as Record<string, unknown>).clientId = filters.clientId;
    }

    // Add fixed values from report config (baseline filters)
    if (reportConfig.fixedValues) {
      Object.assign(where, reportConfig.fixedValues);
    }

    const model = reportConfig.model || 'client';

    const prismaModel = (prisma as any)[model];
    if (!prismaModel || typeof prismaModel.findMany !== 'function') {
      // Model doesn't exist — return empty Excel
      const excelGenerator = typeof generator === 'function' ? generator : generateExcel;
      const buffer = await excelGenerator({
        sheetName: reportConfig.title,
        columns: reportConfig.columns.map(col => ({
          header: col.header,
          key: col.key,
          width: col.width || 15,
        })),
        data: [],
        title: reportConfig.title,
      });

      return new Response(buffer as any, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${reportConfig.title}.xlsx"`,
        },
      });
    }

    const data = await prismaModel.findMany({
      where,
      include: reportConfig.include,
    });

    const serializedData = serializeData(data);
    const flattenedData = Array.isArray(serializedData)
      ? serializedData.map(item => flattenObject(item))
      : flattenObject(serializedData);

    const excelGenerator = typeof generator === 'function' ? generator : generateExcel;
    const buffer = await excelGenerator({
      sheetName: reportConfig.title,
      columns: reportConfig.columns.map(col => ({
        header: col.header,
        key: col.key,
        width: col.width || 15,
      })),
      data: flattenedData as Record<string, unknown>[],
      title: reportConfig.title,
    });

    return new Response(buffer as any, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${reportConfig.title}.xlsx"`,
      },
    });
  } catch (error) {
    console.error('Export Error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      category,
      reportName,
    });

    return new Response('Export failed', { status: 500 });
  }
}