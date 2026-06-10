import { NextResponse } from 'next/server';
import { getBookings, createBooking, updateBookingStatus } from '@/lib/db';

export async function GET() {
  try {
    const bookings = await getBookings();
    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error("GET bookings API error:", error);
    return NextResponse.json(
      { error: "ไม่สามารถดึงข้อมูลรายการจองได้", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Simple validation
    if (!body.tour_id || !body.customer_name || !body.customer_email || !body.customer_phone || !body.travelers_count || !body.total_price || !body.travel_date) {
      return NextResponse.json(
        { error: "ข้อมูลผู้จองไม่ครบถ้วน กรุณากรอกชื่อ อีเมล เบอร์โทรศัพท์ และจำนวนผู้เดินทาง" },
        { status: 400 }
      );
    }

    try {
      const newBooking = await createBooking({
        tour_id: body.tour_id,
        customer_name: body.customer_name,
        customer_email: body.customer_email,
        customer_phone: body.customer_phone,
        travelers_count: parseInt(body.travelers_count),
        total_price: parseFloat(body.total_price),
        travel_date: body.travel_date
      });
      return NextResponse.json(newBooking, { status: 201 });
    } catch (dbError: any) {
      return NextResponse.json(
        { error: dbError.message || "ที่นั่งว่างไม่เพียงพอสำหรับการจองนี้" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("POST bookings API error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการสร้างรายการจอง", details: error.message },
      { status: 500 }
    );
  }
}

// For updating status of bookings (e.g. confirm, cancel)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "ข้อมูลไม่ครบถ้วน ต้องการ booking id และ status" },
        { status: 400 }
      );
    }

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { error: "สถานะไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    const updatedBooking = await updateBookingStatus(id, status);
    if (!updatedBooking) {
      return NextResponse.json(
        { error: "ไม่พบรายการจองที่ระบุ" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedBooking);
  } catch (error: any) {
    console.error("PUT bookings API error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัปเดตสถานะการจอง", details: error.message },
      { status: 500 }
    );
  }
}
