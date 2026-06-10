import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

// Preset Unsplash images to fall back to during local testing if no keys are configured
const fallbackImages = [
  "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80", // Sydney
  "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80", // Santorini
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80", // Switzerland Lake
  "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=800&q=80", // Kyoto
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", // Tropical beach
  "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80", // Italy
];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const country = formData.get('country') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "กรุณาอัปโหลดไฟล์รูปภาพ" },
        { status: 400 }
      );
    }

    // Dynamic config evaluation at request time
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const isConfigured = !!cloudName && !!apiKey && !!apiSecret;

    // 1. REAL CLOUDINARY UPLOAD (if keys exist)
    if (isConfigured) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });

      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResult = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { 
              folder: 'sanook-on-tour',
              resource_type: 'image'
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result as CloudinaryUploadResult);
            }
          );
          uploadStream.end(buffer);
        });

        return NextResponse.json({
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
          success: true
        });
      } catch (cloudinaryError) {
        console.error("Cloudinary uploading failed:", cloudinaryError);
        const errorMessage = cloudinaryError instanceof Error ? cloudinaryError.message : String(cloudinaryError);
        return NextResponse.json(
          { error: "ไม่สามารถอัปโหลดไปยัง Cloudinary ได้", details: errorMessage },
          { status: 500 }
        );
      }
    }

    // 2. FALLBACK MOCK (for testing when no keys are supplied in env)
    console.warn("Cloudinary is not configured. Falling back to mock Unsplash image.");
    let mockUrl = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
    if (country) {
      const searchTerms: Record<string, string> = {
        "ญี่ปุ่น": "japan,tokyo,kyoto",
        "สวิตเซอร์แลนด์": "switzerland,alps,swiss",
        "ไทย": "thailand,phuket,bangkok",
        "เกาหลี": "korea,seoul",
        "ยุโรป": "europe,paris,rome",
        "จีน": "china,beijing,shanghai",
        "เวียดนาม": "vietnam,hanoi,halong"
      };

      const matchedKey = Object.keys(searchTerms).find(k => country.includes(k) || k.includes(country));
      if (matchedKey) {
        const terms = searchTerms[matchedKey];
        mockUrl = `https://images.unsplash.com/featured/?${encodeURIComponent(terms)}&sig=${Math.floor(Math.random() * 1000)}`;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({
      url: mockUrl,
      success: true,
      mocked: true,
      message: "อัปโหลดรูปภาพจำลองสำเร็จ (เนื่องจากยังไม่ได้กำหนดค่า Cloudinary)"
    });

  } catch (error) {
    console.error("Upload API error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ", details: errorMessage },
      { status: 500 }
    );
  }
}

