"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Calendar, Users, Mail, Phone, User, DollarSign, 
  ArrowLeft, CheckCircle2, ShieldCheck, CreditCard, RefreshCw 
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tour } from "@/lib/mockData";

export default function BookingPage({ params }: { params: Promise<{ tourId: string }> }) {
  const router = useRouter();
  const { tourId } = use(params);

  // States
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [travelersCount, setTravelersCount] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  useEffect(() => {
    // Populate form if user is already logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setCustomerName(parsed.name || "");
        setCustomerEmail(parsed.email || "");
      } catch (e) {
        // ignore
      }
    }

    async function loadTour() {
      try {
        const res = await fetch(`/api/tours/${tourId}`);
        if (!res.ok) {
          toast.error("ไม่สามารถดึงข้อมูลทัวร์ได้");
          router.push("/tours");
          return;
        }
        const data = await res.json();
        setTour(data);
      } catch (err) {
        console.error(err);
        toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    }
    loadTour();
  }, [tourId]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tour) return;

    if (!customerName || !customerEmail || !customerPhone) {
      toast.error("กรุณากรอกข้อมูลผู้ติดต่อให้ครบถ้วน");
      return;
    }

    if (travelersCount > tour.available_seats) {
      toast.error(`จำนวนที่นั่งเหลือไม่เพียงพอ (ว่าง ${tour.available_seats} ที่นั่ง)`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tour_id: tour.id,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          travelers_count: travelersCount,
          total_price: tour.price * travelersCount,
          travel_date: tour.departure_date
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        toast.success("บันทึกการจองเรียบร้อยแล้ว!");
        setBookingSuccess(data);
      } else {
        toast.error(data.error || "เกิดข้อผิดพลาดในการทำรายการ");
      }
    } catch (err) {
      console.error(err);
      toast.error("ไม่สามารถดำเนินการจองได้ในขณะนี้");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex items-center justify-center flex-col gap-4 font-prompt text-slate-500">
          <RefreshCw className="animate-spin h-8 w-8 text-primary" />
          <span>กำลังโหลดข้อมูลการจอง...</span>
        </div>
        <Footer />
      </>
    );
  }

  if (!tour) {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex items-center justify-center flex-col gap-4 font-prompt text-slate-500">
          <span>ไม่พบทัวร์ที่เลือก</span>
          <Link href="/tours" className="px-5 py-2 bg-primary text-white rounded-xl">ไปค้นหาทัวร์ใหม่</Link>
        </div>
        <Footer />
      </>
    );
  }

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("th-TH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const totalPrice = tour.price * travelersCount;

  // SUCCESS CONFIRMATION VIEW
  if (bookingSuccess) {
    return (
      <>
        <Navbar />
        <main className="bg-slate-50 font-prompt pt-28 pb-16 px-4">
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 border border-slate-100 shadow-xl text-center space-y-6">
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto"
            >
              <CheckCircle2 className="h-12 w-12" />
            </motion.div>

            <div className="space-y-2">
              <h2 className="font-kanit font-extrabold text-2xl text-slate-800">ส่งคำขอจองสำเร็จแล้ว!</h2>
              <p className="text-slate-500 text-sm">
                เลขอ้างอิงการจอง: <span className="font-mono font-bold text-slate-900">{bookingSuccess.id}</span>
              </p>
            </div>

            {/* Booking Summary Box */}
            <div className="bg-slate-50 rounded-2xl p-5 text-left text-xs text-slate-600 space-y-3.5 border border-slate-100">
              <p className="font-semibold text-slate-800 text-sm border-b border-slate-200 pb-2 truncate">
                {tour.title}
              </p>
              <div className="flex justify-between">
                <span>รหัสทริป:</span>
                <span className="font-bold text-slate-800">{tour.code}</span>
              </div>
              <div className="flex justify-between">
                <span>วันเดินทาง:</span>
                <span className="font-medium text-slate-800">{formatDate(tour.departure_date)}</span>
              </div>
              <div className="flex justify-between">
                <span>จำนวนผู้ร่วมทริป:</span>
                <span className="font-bold text-slate-800">{travelersCount} ท่าน</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-3 text-sm">
                <span className="font-semibold text-slate-800">ยอดเงินรวมทั้งสิ้น:</span>
                <span className="font-bold text-secondary font-kanit text-lg">{formatPrice(totalPrice)}</span>
              </div>
              <div className="bg-amber-50 text-amber-700 p-3 rounded-lg border border-amber-100 text-[10px] leading-relaxed">
                📢 <strong>ชำระเงินภายหลัง:</strong> เจ้าหน้าที่จะดำเนินการตรวจสอบที่นั่งและโทรติดต่อยืนยันข้อมูล พร้อมส่งรายละเอียดการโอนเงิน/ชำระเงินให้ทางอีเมลและเบอร์โทรศัพท์ของท่านภายใน 24 ชม.
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link 
                href="/tours" 
                className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-sm smooth-hover"
              >
                ดูทัวร์อื่นๆ เพิ่มเติม
              </Link>
              <Link 
                href="/" 
                className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl text-sm shadow-md smooth-hover"
              >
                กลับไปหน้าแรก
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 font-prompt pt-28 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <Link href={`/tours/${tour.id}`} className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-primary smooth-hover">
            <ArrowLeft className="h-4 w-4 mr-1.5" /> ย้อนกลับไปรายละเอียดทัวร์
          </Link>

          <h1 className="font-kanit font-extrabold text-2xl sm:text-3xl text-slate-900">
            ขั้นตอนการจองแพ็กเกจทัวร์
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* LEFT 2 COLUMNS: FORM */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Form card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
                <h2 className="font-kanit font-semibold text-lg text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  ข้อมูลผู้จองและผู้ติดต่อ
                </h2>

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">ชื่อ-นามสกุล (ตรงตามหนังสือเดินทาง/บัตรประชาชน)</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="เช่น นายธนากร เที่ยวสนุก"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-sm outline-hidden"
                      />
                      <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  {/* Contact Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">เบอร์โทรศัพท์ติดต่อ</label>
                      <div className="relative">
                        <input 
                          type="tel" 
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="เช่น 0897654321"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-sm outline-hidden"
                        />
                        <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">อีเมลสำหรับส่งใบจอง</label>
                      <div className="relative">
                        <input 
                          type="email" 
                          required
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="เช่น user@domain.com"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-sm outline-hidden"
                        />
                        <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  {/* Quantity Traveler Selector */}
                  <div className="space-y-1 pt-2">
                    <label className="text-xs font-semibold text-slate-500 flex justify-between">
                      <span>จำนวนผู้ร่วมเดินทาง (ท่าน)</span>
                      <span className="text-primary font-bold">ที่นั่งว่างเหลือ: {tour.available_seats} ที่นั่ง</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <button 
                        type="button" 
                        onClick={() => setTravelersCount(prev => Math.max(1, prev - 1))}
                        className="w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 font-bold smooth-hover"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-bold text-lg">{travelersCount}</span>
                      <button 
                        type="button" 
                        onClick={() => setTravelersCount(prev => Math.min(tour.available_seats, prev + 1))}
                        className="w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 font-bold smooth-hover"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Payment notification */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 mt-6">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <CreditCard className="h-4 w-4 text-primary" /> ช่องทางการชำระเงิน
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      จองที่นั่งไว้ก่อน แล้วชำระเงินภายหลัง (Pay Later)! ระบบจะไม่บังคับให้ตัดบัตรเครดิตทันที เพื่ออุ่นใจว่าท่านจะได้รับการยืนยันที่นั่งและเช็คทริปโดยคนขับ/ผู้จัดการส่วนกลางก่อนชำระเงินจริง
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full orange-gradient text-white py-3.5 rounded-2xl font-prompt font-semibold text-sm shadow-md hover:shadow-lg smooth-hover flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <RefreshCw className="animate-spin h-4.5 w-4.5" />
                          <span>กำลังบันทึกรายการจอง...</span>
                        </>
                      ) : (
                        <span>ยืนยันการจองและชำระเงินภายหลัง</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>

            </div>

            {/* RIGHT COLUMN: BOOKING SUMMARY SIDEBAR */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
                <h3 className="font-kanit font-semibold text-base text-slate-800 border-b border-slate-100 pb-3">
                  สรุปรายละเอียดทริป
                </h3>

                <div className="space-y-4">
                  <div className="relative h-32 rounded-xl overflow-hidden">
                    <img src={tour.thumbnail} alt={tour.title} className="w-full h-full object-cover" />
                  </div>

                  <p className="font-semibold text-slate-800 text-sm line-clamp-2 leading-snug">
                    {tour.title}
                  </p>

                  <div className="space-y-2 text-xs text-slate-500 font-prompt">
                    <div className="flex justify-between">
                      <span>รหัสโปรแกรม:</span>
                      <span className="font-mono font-bold text-slate-800">{tour.code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ประเทศ:</span>
                      <span className="font-semibold text-slate-800">{tour.country}</span>
                    </div>
                    <div className="flex items-start justify-between">
                      <span>วันเดินทาง:</span>
                      <div className="text-right text-slate-800">
                        <p>{formatDate(tour.departure_date)}</p>
                        <p className="text-[10px] text-slate-400">ถึง {formatDate(tour.return_date)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-2.5">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>ราคาต่อท่าน:</span>
                    <span>{formatPrice(tour.price)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>ผู้เดินทาง:</span>
                    <span className="font-bold text-slate-800">{travelersCount} ท่าน</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-slate-100 pt-3">
                    <span className="font-semibold text-slate-800">ยอดเงินรวม:</span>
                    <span className="font-bold text-secondary font-kanit text-lg">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] text-emerald-600 bg-emerald-50 py-2 rounded-xl border border-emerald-100 font-semibold">
                  <ShieldCheck className="h-4.5 w-4.5" />
                  <span>ไม่มีค่าใช้จ่ายแอบแฝงเพิ่มเติม</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
