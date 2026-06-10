import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password, name } = body;

    // 1. ADMIN & USER LOGIN
    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json(
          { error: "กรุณากรอกอีเมลและรหัสผ่าน" },
          { status: 400 }
        );
      }

      // Hardcoded Admin check for easy testing
      if (email === 'admin@sanookontour.com' && password === 'Sanook@2026') {
        return NextResponse.json({
          success: true,
          user: {
            id: "admin-user-id",
            email: "admin@sanookontour.com",
            name: "Admin Sanook",
            role: "admin"
          }
        });
      }

      // Hardcoded Customer check for testing user login
      if (email.endsWith('@gmail.com') || email.endsWith('@hotmail.com')) {
        // Any standard gmail/hotmail works for demo purposes
        const username = email.split('@')[0];
        return NextResponse.json({
          success: true,
          user: {
            id: `user-${Math.random().toString(36).substr(2, 9)}`,
            email: email,
            name: username.charAt(0).toUpperCase() + username.slice(1),
            role: "user"
          }
        });
      }

      return NextResponse.json(
        { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    // 2. USER REGISTRATION
    if (action === 'register') {
      if (!email || !password || !name) {
        return NextResponse.json(
          { error: "กรุณากรอกข้อมูลให้ครบถ้วนเพื่อสมัครสมาชิก" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: `user-${Math.random().toString(36).substr(2, 9)}`,
          email: email,
          name: name,
          role: "user"
        },
        message: "สมัครสมาชิกสำเร็จเรียบร้อยแล้ว!"
      }, { status: 201 });
    }

    return NextResponse.json(
      { error: "Action ไม่ถูกต้อง" },
      { status: 400 }
    );

  } catch (error) {
    console.error("Auth API error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์", details: errorMessage },
      { status: 500 }
    );
  }
}
