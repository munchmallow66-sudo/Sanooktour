import { NextResponse } from 'next/server';
import { getTourById, updateTour, deleteTour, getTourImages, getReviews, createReview, setTourImages } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tour = await getTourById(id);
    
    if (!tour) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลทัวร์ที่ระบุ" },
        { status: 404 }
      );
    }

    const images = await getTourImages(id);
    const reviews = await getReviews(id);

    return NextResponse.json({
      ...tour,
      images: images.map(img => img.url),
      reviews
    });
  } catch (error: any) {
    console.error("GET tour detail API error:", error);
    return NextResponse.json(
      { error: "ไม่สามารถดึงรายละเอียดทัวร์ได้", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedTour = await updateTour(id, {
      title: body.title,
      code: body.code,
      country: body.country,
      description: body.description,
      price: body.price ? parseFloat(body.price) : undefined,
      available_seats: body.available_seats !== undefined ? parseInt(body.available_seats) : undefined,
      departure_date: body.departure_date,
      return_date: body.return_date,
      thumbnail: body.thumbnail,
      is_domestic: body.is_domestic,
      is_recommended: body.is_recommended,
      is_promotion: body.is_promotion,
      highlights: body.highlights,
      itinerary: body.itinerary,
      included: body.included,
      excluded: body.excluded,
      airline: body.airline,
      transport_type: body.transport_type
    });

    if (!updatedTour) {
      return NextResponse.json(
        { error: "ไม่สามารถอัปเดตข้อมูลทัวร์ได้ หรือไม่พบข้อมูลทัวร์ที่ระบุ" },
        { status: 404 }
      );
    }

    if (body.images && Array.isArray(body.images)) {
      await setTourImages(id, body.images);
    }

    return NextResponse.json(updatedTour);
  } catch (error: any) {
    console.error("PUT tour detail API error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูลทัวร์", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deleteTour(id);

    if (!success) {
      return NextResponse.json(
        { error: "ไม่สามารถลบข้อมูลทัวร์ได้ หรือไม่พบข้อมูลทัวร์ที่ระบุ" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "ลบข้อมูลทัวร์เรียบร้อยแล้ว" });
  } catch (error: any) {
    console.error("DELETE tour detail API error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการลบข้อมูลทัวร์", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { author, rating, comment } = body;

    if (!author || !rating || !comment) {
      return NextResponse.json(
        { error: "ข้อมูลรีวิวไม่ครบถ้วน ต้องการชื่อผู้รีวิว คะแนน และความคิดเห็น" },
        { status: 400 }
      );
    }

    const newReview = await createReview({
      tour_id: id,
      author,
      rating: parseInt(rating),
      comment
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error: any) {
    console.error("POST review detail API error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการส่งรีวิว", details: error.message },
      { status: 500 }
    );
  }
}
