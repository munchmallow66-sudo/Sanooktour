import { NextResponse } from 'next/server';
import { getReviews } from '@/lib/db';

export async function GET() {
  try {
    const reviews = await getReviews();
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("GET reviews API error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "ไม่สามารถดึงข้อมูลรีวิวได้", details: errorMessage },
      { status: 500 }
    );
  }
}
