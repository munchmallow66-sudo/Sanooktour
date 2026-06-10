"use client";

import { use, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Calendar, Users, MapPin, CheckCircle2, XCircle, ArrowLeft, 
  Map, Star, ChevronDown, ChevronUp, Share2, Heart, Award, ShieldAlert,
  Plane, Bus, Ship
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tour, Review } from "@/lib/mockData";

export default function TourDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  // States
  const [tour, setTour] = useState<(Tour & { images: string[]; reviews: Review[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [isLiked, setIsLiked] = useState(false);

  // Add review states
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchTourDetail = useCallback(async () => {
    try {
      const res = await fetch(`/api/tours/${id}`);
      if (!res.ok) {
        toast.error("ไม่สามารถโหลดข้อมูลทัวร์ได้");
        router.push("/tours");
        return;
      }
      const data = await res.json();
      setTour(data);
      setActiveImage(data.thumbnail);
    } catch (error) {
      console.error("Error fetching tour detail:", error);
      toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    setTimeout(() => {
      fetchTourDetail();
    }, 0);
  }, [fetchTourDetail]);

  const toggleDay = (day: number) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("คัดลอกลิงก์ไปยังคลิปบอร์ดแล้ว!");
    } else {
      toast("แชร์ลิงก์นี้: " + window.location.href);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor || !reviewComment) {
      toast.error("กรุณากรอกชื่อและเขียนรีวิวให้ครบถ้วน");
      return;
    }

    setSubmittingReview(true);
    try {
      // Let's fetch to `/api/tours/${id}` as a POST to add review. That is very clean!
      const reviewRes = await fetch(`/api/tours/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: reviewAuthor,
          rating: reviewRating,
          comment: reviewComment
        })
      });

      if (reviewRes.ok) {
        toast.success("ขอบคุณสำหรับรีวิวของคุณ!");
        setReviewAuthor("");
        setReviewComment("");
        setReviewRating(5);
        fetchTourDetail(); // reload
      } else {
        toast.error("เกิดข้อผิดพลาดในการส่งรีวิว");
      }
    } catch (err) {
      console.error(err);
      toast.error("ไม่สามารถส่งรีวิวได้ในขณะนี้");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex items-center justify-center flex-col gap-4 font-prompt text-slate-500">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span>กำลังโหลดข้อมูลโปรแกรมทัวร์...</span>
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
          <span>ไม่พบโปรแกรมทัวร์ที่คุณต้องการ</span>
          <Link href="/tours" className="px-5 py-2 bg-primary text-white rounded-xl">กลับไปค้นหาทัวร์</Link>
        </div>
        <Footer />
      </>
    );
  }

  const formattedPrice = new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(tour.price);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("th-TH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Merge thumbnail into images for display if not present
  const allImages = Array.from(new Set([tour.thumbnail, ...(tour.images || [])]));

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 font-prompt pb-20">
        
        {/* Gallery Top Banner */}
        <div className="bg-slate-900 text-white pt-24 pb-4 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <Link href="/tours" className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-white smooth-hover">
              <ArrowLeft className="h-4 w-4 mr-1.5" /> ย้อนกลับไปค้นหาทัวร์
            </Link>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsLiked(!isLiked)} 
                className={`p-2 rounded-full border border-slate-700 bg-slate-800 hover:bg-slate-700 smooth-hover ${isLiked ? 'text-rose-500 border-rose-950' : 'text-slate-400'}`}
              >
                <Heart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
              </button>
              <button 
                onClick={handleShare}
                className="p-2 rounded-full border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white smooth-hover"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT 2 COLUMNS: TOUR INFOS */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Header info */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-4">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {tour.country}
                </span>
                <span className="bg-slate-100 text-slate-600 text-xs font-mono px-2 py-1 rounded-md font-bold">
                  CODE: {tour.code}
                </span>
                {tour.is_promotion && (
                  <span className="bg-secondary/10 text-secondary text-xs font-bold px-3 py-1 rounded-full">
                    โปรโมชั่นพิเศษ
                  </span>
                )}
                {(tour.airline || tour.transport_type) && (
                  <span className="bg-sky-50 text-sky-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 border border-sky-100/50">
                    {tour.transport_type === "bus" ? (
                      <Bus className="h-3.5 w-3.5 text-sky-500" />
                    ) : tour.transport_type === "ship" ? (
                      <Ship className="h-3.5 w-3.5 text-sky-500" />
                    ) : (
                      <Plane className="h-3.5 w-3.5 text-sky-500" />
                    )}
                    <span>{tour.airline || (tour.transport_type === "bus" ? "รถโค้ช VIP / รถตู้" : tour.transport_type === "ship" ? "สปีดโบ๊ท / เรือ" : "สายการบินชั้นนำ")}</span>
                  </span>
                )}
              </div>

              <h1 className="font-kanit font-extrabold text-2xl sm:text-3xl md:text-4xl text-slate-900 leading-tight">
                {tour.title}
              </h1>

              <p className="text-slate-600 text-sm leading-relaxed pt-2">
                {tour.description}
              </p>
            </div>

            {/* Cinematic Gallery */}
            <div className="space-y-4">
              <div className="relative h-80 sm:h-[450px] w-full rounded-3xl overflow-hidden shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeImage}
                  alt={tour.title}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              </div>

              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`relative h-20 w-32 shrink-0 rounded-2xl overflow-hidden border-2 smooth-hover ${
                        activeImage === img ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
              <h2 className="font-kanit font-bold text-xl sm:text-2xl text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
                <Award className="h-5.5 w-5.5 text-primary" />
                ไฮไลท์การเดินทาง
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tour.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start text-sm text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2.5 shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Day-by-Day Itinerary Accordion */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
              <h2 className="font-kanit font-bold text-xl sm:text-2xl text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
                <Map className="h-5.5 w-5.5 text-primary" />
                ตารางโปรแกรมท่องเที่ยวแบบละเอียด
              </h2>
              
              <div className="space-y-4">
                {tour.itinerary.map((day) => {
                  const isExpanded = expandedDay === day.day;
                  return (
                    <div 
                      key={day.day} 
                      className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                        isExpanded ? 'border-primary bg-primary/2.5' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <button
                        onClick={() => toggleDay(day.day)}
                        className="w-full flex items-center justify-between p-5 text-left font-prompt"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-10 h-10 rounded-xl font-kanit font-bold text-sm flex items-center justify-center shrink-0 ${
                            isExpanded ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            Day {day.day}
                          </span>
                          <span className="font-semibold text-slate-800 text-sm sm:text-base leading-snug">
                            {day.title}
                          </span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-primary shrink-0 ml-3" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-slate-400 shrink-0 ml-3" />
                        )}
                      </button>

                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="px-5 pb-6 pt-1 pl-18 border-t border-slate-100/60 text-slate-600 text-sm leading-relaxed">
                              {day.description}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inclusions and Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Included */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
                <h3 className="font-kanit font-bold text-lg text-emerald-600 flex items-center gap-2 border-b border-slate-50 pb-3">
                  <CheckCircle2 className="h-5 w-5" /> ค่าทัวร์รวมอะไรบ้าง
                </h3>
                <ul className="space-y-2.5">
                  {tour.included.map((item, idx) => (
                    <li key={idx} className="flex items-start text-xs text-slate-500">
                      <span className="text-emerald-500 mr-2 shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Excluded */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
                <h3 className="font-kanit font-bold text-lg text-rose-600 flex items-center gap-2 border-b border-slate-50 pb-3">
                  <XCircle className="h-5 w-5" /> ค่าทัวร์ไม่รวมอะไรบ้าง
                </h3>
                <ul className="space-y-2.5">
                  {tour.excluded.map((item, idx) => (
                    <li key={idx} className="flex items-start text-xs text-slate-500">
                      <span className="text-rose-500 mr-2 shrink-0">✗</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Map Mockup */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-4">
              <h2 className="font-kanit font-bold text-xl sm:text-2xl text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
                <Map className="h-5.5 w-5.5 text-primary" />
                แผนที่จุดท่องเที่ยวสำคัญ
              </h2>
              <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-slate-200">
                {/* Visual mockup of customized tourist map using styling */}
                <iframe 
                  src={`https://www.google.com/maps/embed/v1/place?key=MOCK_KEY&q=${encodeURIComponent(tour.country + ' ' + tour.title)}`}
                  className="w-full h-full border-0 grayscale opacity-20 pointer-events-none"
                  allowFullScreen
                />
                <div className="absolute inset-0 bg-linear-to-tr from-slate-100/90 to-white/40 flex flex-col items-center justify-center p-6 text-center space-y-3 z-10">
                  <div className="p-4 bg-primary-light/20 text-primary rounded-full">
                    <MapPin className="h-8 w-8 animate-bounce" />
                  </div>
                  <p className="font-kanit font-bold text-slate-800">พิกัดทริป: {tour.country}</p>
                  <p className="font-prompt text-slate-500 text-xs max-w-sm">
                    แผนที่ท่องเที่ยวจำลองของสายเดินทาง เส้นทางการท่องเที่ยวได้รับการวางแผนโดยผู้เชี่ยวชาญจาก Sanook on tour
                  </p>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
              <h2 className="font-kanit font-bold text-xl sm:text-2xl text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
                <Star className="h-5.5 w-5.5 text-primary fill-primary" />
                รีวิวจากผู้เดินทางจริง ({tour.reviews?.length || 0})
              </h2>

              <div className="space-y-6 divide-y divide-slate-100">
                {tour.reviews?.map((rev) => (
                  <div key={rev.id} className="pt-6 first:pt-0 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 text-sm">{rev.author}</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{rev.comment}</p>
                    <p className="text-[10px] text-slate-400">{formatDate(rev.created_at)}</p>
                  </div>
                ))}

                {(!tour.reviews || tour.reviews.length === 0) && (
                  <p className="text-center font-prompt text-slate-400 py-4 text-sm">ยังไม่มีรีวิวสำหรับทริปนี้ เป็นคนแรกที่เริ่มเขียนรีวิว!</p>
                )}
              </div>

              {/* Add a Review Form */}
              <form onSubmit={handleAddReview} className="border-t border-slate-100 pt-6 space-y-4">
                <h4 className="font-kanit font-semibold text-slate-800 text-sm">ร่วมแบ่งปันความประทับใจของคุณ</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500">ชื่อของคุณ</label>
                    <input 
                      type="text" 
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      placeholder="เช่น คุณสมศักดิ์ รักเที่ยว"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-primary font-prompt text-xs outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-500">ให้คะแนนความประทับใจ</label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(parseInt(e.target.value))}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-primary font-prompt text-xs outline-hidden cursor-pointer"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5 ดาว - ดีเลิศ)</option>
                      <option value="4">⭐⭐⭐⭐ (4 ดาว - ดีมาก)</option>
                      <option value="3">⭐⭐⭐ (3 ดาว - พอใช้)</option>
                      <option value="2">⭐⭐ (2 ดาว - ปรับปรุง)</option>
                      <option value="1">⭐ (1 ดาว - ไม่พอใจ)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-500">ความคิดเห็น</label>
                  <textarea 
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="เขียนรายละเอียดความประทับใจของทริปนี้..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary font-prompt text-xs outline-hidden"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={submittingReview}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-primary text-white rounded-xl font-prompt font-semibold text-xs smooth-hover disabled:opacity-55"
                >
                  {submittingReview ? "กำลังส่งรีวิว..." : "ส่งรีวิวความพึงพอใจ"}
                </button>
              </form>
            </div>

          </div>

          {/* RIGHT COLUMNS: STICKY BOOKING CARD */}
          <div className="space-y-6">
            <div className="sticky top-24 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-md space-y-6">
              
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400">ราคาต่อท่าน</span>
                <p className="font-kanit font-extrabold text-3xl text-secondary">{formattedPrice}</p>
                <p className="text-[10px] text-slate-400">*ราคาดังกล่าวรวมภาษีมูลค่าเพิ่มและค่าวีซ่าตามระบุแล้ว</p>
              </div>

              <div className="border-t border-slate-100 pt-5 space-y-4">
                {/* Date */}
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800">วันที่เดินทาง</p>
                    <p className="text-slate-500 mt-1">
                      {formatDate(tour.departure_date)}
                    </p>
                    <p className="text-slate-500 mt-0.5">ถึง {formatDate(tour.return_date)}</p>
                  </div>
                </div>

                {/* Available seats */}
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-xs flex-1">
                    <div className="flex justify-between font-semibold text-slate-800">
                      <span>สถานะที่นั่ง</span>
                      <span className={tour.available_seats <= 5 ? "text-rose-500" : "text-emerald-500"}>
                        {tour.available_seats > 0 ? `ว่าง ${tour.available_seats} ที่นั่ง` : "ที่นั่งเต็มแล้ว"}
                      </span>
                    </div>
                    {/* progress */}
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                      <div 
                        className={`h-full rounded-full ${tour.available_seats <= 5 ? 'bg-rose-500' : 'bg-primary'}`}
                        style={{ width: `${(tour.available_seats / 20) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Warnings if seats are low */}
              {tour.available_seats <= 5 && tour.available_seats > 0 && (
                <div className="p-3 bg-rose-50 text-rose-600 rounded-xl flex items-start gap-2 border border-rose-100">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 animate-bounce" />
                  <span className="text-[10px] font-prompt leading-relaxed">
                    ที่นั่งใกล้เต็มแล้ว! หากท่านต้องการเดินทางกรุณาจองล่วงหน้าเพื่อรักษาสิทธิ์
                  </span>
                </div>
              )}

              {/* Book Action Button */}
              <div>
                {tour.available_seats > 0 ? (
                  <Link 
                    href={`/booking/${tour.id}`}
                    className="block text-center w-full orange-gradient text-white py-3.5 rounded-2xl font-prompt font-semibold text-sm shadow-md hover:shadow-lg smooth-hover hover:-translate-y-0.5"
                  >
                    จองแพ็กเกจทัวร์นี้เลย
                  </Link>
                ) : (
                  <button
                    disabled
                    className="block w-full bg-slate-200 text-slate-400 py-3.5 rounded-2xl font-prompt font-semibold text-sm cursor-not-allowed"
                  >
                    ที่นั่งเต็มแล้ว (ปิดรับจอง)
                  </button>
                )}
              </div>

              {/* Help contact */}
              <div className="text-center">
                <p className="text-xs text-slate-400 leading-relaxed">
                  มีข้อสงสัยหรือต้องการสอบถามเพิ่มเติม? <br />
                  โทร <span className="text-primary font-bold">062-3593293</span> ตลอด 24 ชม.
                </p>
              </div>

            </div>
          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}
