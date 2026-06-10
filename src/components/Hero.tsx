"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, DollarSign, Calendar, Compass } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [country, setCountry] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let query = "/tours?";
    const params: string[] = [];
    
    if (keyword) params.push(`search=${encodeURIComponent(keyword)}`);
    if (country) params.push(`country=${encodeURIComponent(country)}`);
    if (maxPrice) params.push(`maxPrice=${maxPrice}`);

    query += params.join("&");
    router.push(query);
  };

  const popularCountries = ["ญี่ปุ่น", "สวิตเซอร์แลนด์", "เกาหลีใต้", "เวียดนาม", "ไต้หวัน", "ไทย"];

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden pt-24 pb-12">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-bg.jpg"
          alt="Travel Background"
          className="w-full h-full object-cover object-center scale-102"
        />
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/30 via-transparent to-slate-950/40" />
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-[20%] left-[10%] w-24 h-24 bg-primary/20 rounded-full blur-2xl animate-pulse hidden md:block" />
      <div className="absolute bottom-[30%] right-[15%] w-32 h-32 bg-secondary/15 rounded-full blur-2xl animate-pulse hidden md:block" />

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white flex flex-col items-center pt-16 sm:pt-20 md:pt-24">


        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-kanit font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-[70px] tracking-tight leading-tight max-w-4xl text-shadow-lg"
        >
          เที่ยวสนุก ทุกทริป กับ <br className="hidden sm:block" />
          <span className="text-secondary mt-2 inline-block">Sanook on tour</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-prompt text-base sm:text-lg md:text-xl text-white mt-6 max-w-2xl leading-relaxed font-medium text-shadow-md"
        >
          ค้นหาแพ็กเกจทัวร์ต่างประเทศและในประเทศระดับพรีเมียมในราคาเอื้อมถึง แผนเที่ยวคุ้มค่า เดินทางอุ่นใจ บริการเป็นกันเอง
        </motion.p>

        {/* Search Panel (Interactive) */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          onSubmit={handleSearch}
          className="w-full max-w-4xl mt-12 bg-white/95 backdrop-blur-md p-6 rounded-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-white/40 text-slate-800 text-left grid grid-cols-1 md:grid-cols-4 gap-5"
        >
          {/* Keyword Search */}
          <div className="flex flex-col space-y-1.5">
            <label className="font-prompt text-xs font-semibold text-slate-500 flex items-center px-1">
              <Search className="h-3.5 w-3.5 mr-1 text-primary" /> ค้นหาโปรแกรมทัวร์
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="คีย์เวิร์ด, เมือง, CODE..."
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary font-prompt text-sm font-medium placeholder-slate-400 bg-white outline-hidden transition-all"
            />
          </div>

          {/* Destination Selector */}
          <div className="flex flex-col space-y-1.5">
            <label className="font-prompt text-xs font-semibold text-slate-500 flex items-center px-1">
              <MapPin className="h-3.5 w-3.5 mr-1 text-primary" /> ประเทศที่อยากเที่ยว
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary font-prompt text-sm font-medium bg-white outline-hidden cursor-pointer transition-all"
            >
              <option value="">ทุกประเทศ</option>
              <option value="ญี่ปุ่น">ญี่ปุ่น (Japan)</option>
              <option value="สวิตเซอร์แลนด์">สวิตเซอร์แลนด์ (Swiss)</option>
              <option value="เกาหลีใต้">เกาหลีใต้ (Korea)</option>
              <option value="เวียดนาม">เวียดนาม (Vietnam)</option>
              <option value="ไต้หวัน">ไต้หวัน (Taiwan)</option>
              <option value="ไทย">ประเทศไทย (Thailand)</option>
            </select>
          </div>

          {/* Budget Selector */}
          <div className="flex flex-col space-y-1.5">
            <label className="font-prompt text-xs font-semibold text-slate-500 flex items-center px-1">
              <DollarSign className="h-3.5 w-3.5 mr-1 text-primary" /> งบประมาณการเดินทาง
            </label>
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary font-prompt text-sm font-medium bg-white outline-hidden cursor-pointer transition-all"
            >
              <option value="">ทุกราคา</option>
              <option value="15000">ไม่เกิน 15,000 บาท</option>
              <option value="35000">ไม่เกิน 35,000 บาท</option>
              <option value="90000">ไม่เกิน 90,000 บาท</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full min-h-[46px] bg-secondary hover:bg-primary text-white font-prompt font-semibold text-sm rounded-2xl smooth-hover flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              <Search className="h-4.5 w-4.5" />
              <span>ค้นหาโปรแกรม</span>
            </button>
          </div>
        </motion.form>

        {/* Quick Dest Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm font-prompt text-white text-shadow-sm"
        >
          <span>จุดหมายแนะนำ:</span>
          {popularCountries.map((c) => (
            <button
              key={c}
              onClick={() => router.push(`/tours?country=${encodeURIComponent(c)}`)}
              className="px-3.5 py-1 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-xs font-medium text-white smooth-hover"
            >
              #{c}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
