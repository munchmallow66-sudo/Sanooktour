"use client";

import Link from "next/link";
import { Calendar, MapPin, Bus, Plane, Ship, FileText, MessageCircle, Laptop } from "lucide-react";
import { motion } from "framer-motion";
import { Tour } from "@/lib/mockData";
import { toast } from "react-hot-toast";

interface TourCardProps {
  tour: Tour;
}

export default function TourCard({ tour }: TourCardProps) {
  // Format price
  const formattedPrice = new Intl.NumberFormat("th-TH", {
    maximumFractionDigits: 0,
  }).format(tour.price);

  // Thai month names mapping to avoid hydration issues
  const getMonthYearLabel = () => {
    const d1 = new Date(tour.departure_date);
    const d2 = new Date(tour.return_date);
    const thaiMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    const m1 = thaiMonths[d1.getMonth()];
    const y1 = d1.getFullYear() + 543; // Buddhist era format
    const m2 = thaiMonths[d2.getMonth()];
    const y2 = d2.getFullYear() + 543;
    
    if (m1 === m2 && y1 === y2) {
      return `${m1} ${y1}`;
    } else if (y1 === y2) {
      return `${m1} - ${m2} ${y1}`;
    } else {
      return `${m1} ${y1} - ${m2} ${y2}`;
    }
  };

  const getDurationLabel = () => {
    const d1 = new Date(tour.departure_date);
    const d2 = new Date(tour.return_date);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    if (diffDays === 1) return "1 วัน";
    return `${diffDays} วัน ${diffDays - 1} คืน`;
  };

  const getTransportInfo = () => {
    if (tour.transport_type || tour.airline) {
      let icon = Plane;
      if (tour.transport_type === "bus") icon = Bus;
      else if (tour.transport_type === "ship") icon = Ship;
      
      const label = tour.airline || (tour.transport_type === "bus" ? "รถโค้ช VIP / รถตู้" : tour.transport_type === "ship" ? "สปีดโบ๊ท / เรือ" : "สายการบินชั้นนำ");
      return { label, icon };
    }

    if (tour.country !== "ไทย" && tour.country !== "ประเทศไทย") {
      let label = "สายการบินชั้นนำ";
      if (tour.code.includes("VN")) label = "Vietnam Airlines";
      else if (tour.code.includes("KR")) label = "AirAsia X";
      else if (tour.code.includes("JP")) label = "Japan Airlines";
      else if (tour.code.includes("EU")) label = "Swiss Air";
      return { label, icon: Plane };
    }
    if (tour.title.includes("พีพี") || tour.title.includes("สิมิลัน") || tour.title.includes("เกาะ") || tour.title.includes("ล่องใต้")) {
      return { label: "สปีดโบ๊ท / เรือ", icon: Ship };
    }
    return { label: "รถโค้ช VIP / รถตู้", icon: Bus };
  };

  const transport = getTransportInfo();
  const TransportIcon = transport.icon;

  const handleDownloadPDF = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.success(`กำลังดาวน์โหลดเอกสารโปรแกรมทัวร์ ${tour.code}...`, {
      icon: "📥",
      style: {
        borderRadius: "16px",
        background: "#0F172A",
        color: "#FFF",
      }
    });
    setTimeout(() => {
      window.open(`https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`, '_blank');
    }, 1200);
  };

  const handleLineClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const text = `สวัสดีครับ สนใจสอบถามข้อมูลเพิ่มเติมทัวร์ ${tour.title} รหัสโปรแกรม: ${tour.code} ครับ`;
    const lineUrl = `https://line.me/ti/p/~0624658228?text=${encodeURIComponent(text)}`;
    window.open(lineUrl, '_blank');
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white rounded-[28px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] border border-slate-100 flex flex-col h-full group transition-all"
    >
      {/* Thumbnail Header Area */}
      <div className="relative h-60 overflow-hidden">
        <img
          src={tour.thumbnail}
          alt={tour.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
          loading="lazy"
          decoding="async"
        />
        
        {/* Soft shadow gradients on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-black/10" />

        {/* Top Badges */}
        <div className="absolute top-4.5 left-4.5 flex flex-col gap-1.5 z-10">
          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-prompt font-semibold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
            <MapPin className="h-3 w-3 text-secondary" />
            {tour.country}
          </span>
          {tour.is_promotion && (
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-prompt font-extrabold px-2.5 py-1 rounded-lg shadow-sm uppercase tracking-wider">
              โปรสุดฮอต 🔥
            </span>
          )}
        </div>

        {/* Code Badge */}
        <div className="absolute top-4.5 right-4.5 z-10">
          <span className="bg-red-600 text-white text-[11px] font-prompt font-bold px-2.5 py-1 rounded-lg shadow-sm">
            รหัส: {tour.code}
          </span>
        </div>

        {/* Seat Availability floating text */}
        <div className="absolute bottom-4 left-4.5 z-10 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/10 text-white text-[11px] font-prompt flex items-center gap-1.5">
          <div className={`w-2.5 h-2.5 rounded-full ${tour.available_seats <= 5 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
          <span>คงเหลือ {tour.available_seats} ที่นั่ง</span>
        </div>
      </div>

      {/* Card Details Area */}
      <div className="p-5.5 flex flex-col flex-grow space-y-4">
        {/* Title */}
        <div>
          <Link href={`/tours/${tour.id}`}>
            <h3 className="font-kanit font-extrabold text-[16px] text-slate-900 leading-snug line-clamp-2 min-h-[44px] group-hover:text-primary transition-colors duration-200">
              {tour.title}
            </h3>
          </Link>
        </div>

        {/* Date and Duration Bar */}
        <div className="bg-slate-50 border border-slate-100/60 rounded-2xl px-4 py-3 flex justify-between items-center text-xs font-prompt font-semibold text-slate-600 shadow-3xs">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-primary shrink-0" />
            <span>{getMonthYearLabel()}</span>
          </div>
          <div className="bg-slate-200/60 text-slate-700 px-2.5 py-0.5 rounded-lg text-[11px] font-bold">
            {getDurationLabel()}
          </div>
        </div>

        {/* Attractions / Highlights Bulleted */}
        <p className="text-xs text-slate-500 font-prompt leading-relaxed line-clamp-2 min-h-[36px] bg-slate-50/30 p-2 rounded-xl border border-dashed border-slate-100">
          {tour.highlights.join(" • ")}
        </p>

        {/* Transport and Price Row */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          {/* Transport Info */}
          <div className="flex items-center text-[11px] font-prompt font-bold text-sky-700 bg-sky-50 border border-sky-100/50 px-2.5 py-1.5 rounded-xl shadow-4xs">
            <TransportIcon className="h-3.5 w-3.5 mr-1.5 text-sky-500 shrink-0" />
            <span>{transport.label}</span>
          </div>

          {/* Pricing Info */}
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-prompt block leading-none">ราคาเริ่มต้น</span>
            <div className="flex items-baseline justify-end gap-0.5 mt-1">
              <span className="text-xs font-bold text-red-600 font-prompt">฿</span>
              <span className="text-2xl font-extrabold text-red-600 font-kanit tracking-tight leading-none">
                {formattedPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Actions 2x2 Grid Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1 z-10">
          {/* Button 1: ดูรายละเอียด */}
          <Link
            href={`/tours/${tour.id}`}
            className="flex items-center justify-center bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-100/85 font-prompt font-bold text-xs py-2.5 rounded-xl transition-all duration-200 shadow-4xs"
          >
            ดูรายละเอียด
          </Link>

          {/* Button 2: ดาวน์โหลดโปรแกรม */}
          <button
            onClick={handleDownloadPDF}
            className="flex items-center justify-center gap-1 bg-sky-800 hover:bg-sky-900 text-white font-prompt font-bold text-xs py-2.5 rounded-xl transition-all duration-200 shadow-4xs cursor-pointer"
          >
            <FileText className="h-3.5 w-3.5 shrink-0" />
            <span>โหลดโปรแกรม</span>
          </button>

          {/* Button 3: จองทาง Line */}
          <button
            onClick={handleLineClick}
            className="flex items-center justify-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white font-prompt font-bold text-xs py-2.5 rounded-xl transition-all duration-200 shadow-4xs cursor-pointer"
          >
            <MessageCircle className="h-3.5 w-3.5 shrink-0" />
            <span>จองทาง Line</span>
          </button>

          {/* Button 4: กดจองหน้าเว็บ */}
          <Link
            href={`/booking/${tour.id}`}
            className="flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white font-prompt font-bold text-xs py-2.5 rounded-xl transition-all duration-200 shadow-4xs text-center"
          >
            <Laptop className="h-3.5 w-3.5 shrink-0" />
            <span>จองหน้าเว็บ</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
