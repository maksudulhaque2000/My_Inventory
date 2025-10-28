// src/app/api/dashboard-summary/route.ts
import { NextResponse } from 'next/server';
import { getDashboardSummary } from '@/lib/dashboardService';

export async function GET() {
  try {
    const data = await getDashboardSummary();
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
