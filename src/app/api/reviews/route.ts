import { NextResponse } from 'next/server';
import { getReviews } from '@/lib/db';

export async function GET() {
  try {
    const reviews = await getReviews();
    return NextResponse.json(reviews);
  } catch (error: any) {
    console.error("GET reviews API error:", error);
    return NextResponse.json(
      { error: "ไม่สามารถดึงข้อมูลรีวิวได้", details: error.message },
      { status: 500 }
    );
  }
}
