import { NextResponse } from 'next/server';
import { getTours, createTour, addTourImages } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country') || undefined;
    const search = searchParams.get('search') || undefined;
    const maxPriceStr = searchParams.get('maxPrice');
    const maxPrice = maxPriceStr ? parseFloat(maxPriceStr) : undefined;
    
    const isDomesticStr = searchParams.get('isDomestic');
    const isDomestic = isDomesticStr !== null ? isDomesticStr === 'true' : undefined;

    const isRecommendedStr = searchParams.get('isRecommended');
    const isRecommended = isRecommendedStr !== null ? isRecommendedStr === 'true' : undefined;

    const isPromotionStr = searchParams.get('isPromotion');
    const isPromotion = isPromotionStr !== null ? isPromotionStr === 'true' : undefined;

    const sortBy = (searchParams.get('sortBy') as 'latest' | 'priceAsc' | 'priceDesc') || 'latest';

    const tours = await getTours({
      country,
      search,
      maxPrice,
      isDomestic,
      isRecommended,
      isPromotion,
      sortBy
    });

    return NextResponse.json(tours);
  } catch (error: any) {
    console.error("GET tours API error:", error);
    return NextResponse.json(
      { error: "ไม่สามารถดึงข้อมูลแพ็กเกจทัวร์ได้", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Simple validation
    if (!body.title || !body.code || !body.country || !body.price || !body.departure_date || !body.return_date) {
      return NextResponse.json(
        { error: "ข้อมูลไม่ครบถ้วน กรุณากรอกฟิลด์ที่จำเป็นทั้งหมด" },
        { status: 400 }
      );
    }

    const newTour = await createTour({
      title: body.title,
      code: body.code,
      country: body.country,
      description: body.description || "",
      price: parseFloat(body.price),
      available_seats: parseInt(body.available_seats) || 20,
      departure_date: body.departure_date,
      return_date: body.return_date,
      thumbnail: body.thumbnail || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
      is_domestic: !!body.is_domestic,
      is_recommended: !!body.is_recommended,
      is_promotion: !!body.is_promotion,
      highlights: body.highlights || [],
      itinerary: body.itinerary || [],
      included: body.included || [],
      excluded: body.excluded || [],
      airline: body.airline || "",
      transport_type: body.transport_type || "plane"
    });

    if (body.images && Array.isArray(body.images)) {
      await addTourImages(newTour.id, body.images);
    }

    return NextResponse.json(newTour, { status: 201 });
  } catch (error: any) {
    console.error("POST tours API error:", error);
    return NextResponse.json(
      { error: "ไม่สามารถบันทึกข้อมูลแพ็กเกจทัวร์ได้", details: error.message },
      { status: 500 }
    );
  }
}
