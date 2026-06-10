import { NextResponse } from 'next/server';
import { deleteReview } from '@/lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deleteReview(id);

    if (!success) {
      return NextResponse.json(
        { error: "ไม่สามารถลบรีวิวได้ หรือไม่พบข้อมูลรีวิวที่ระบุ" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "ลบรีวิวสำเร็จแล้ว" });
  } catch (error: any) {
    console.error("DELETE review API error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการลบรีวิว", details: error.message },
      { status: 500 }
    );
  }
}
