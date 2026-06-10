"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Compass, Briefcase, Award, Sparkles, ArrowRight, Calendar, Heart, HelpCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ServiceInfo {
  slug: string;
  title: string;
  desc: string;
  iconName: string;
  image: string;
}

const serviceList = [
  {
    slug: "private-group",
    title: "รับจัดกรุ๊ปเหมา – กรุ๊ปส่วนตัว",
    desc: "ออกแบบเส้นทางท่องเที่ยวในฝันที่เป็นตัวคุณที่สุด ร่วมเดินทางเฉพาะครอบครัว เพื่อนสนิท หรือคนพิเศษ เลือกวันเดินทาง สายการบิน โรงแรม และร้านอาหารได้ตามใจชอบ",
    iconName: "Users",
    image: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=600&q=80"
  },
  {
    slug: "corporate",
    title: "บริการจัดกรุ๊ปองค์กร - หมู่คณะ",
    desc: "นำพาองค์กรของคุณไปเปิดประสบการณ์ท่องเที่ยวแบบก้าวล้ำ สานสัมพันธ์พนักงาน พร้อมการบริการระดับพรีเมียม ดูแลครบวงจรตั้งแต่ตั๋วเครื่องบิน วีซ่า จนถึงกิจกรรมสัมมนา",
    iconName: "Briefcase",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80"
  },
  {
    slug: "meeting-seminar",
    title: "บริการประชุม – สัมมนา",
    desc: "ยกระดับการประชุมสัมมนานอกสถานที่ของบริษัท ด้วยการคัดสรรห้องประชุมระดับหรูที่เพียบพร้อมด้วยเทคโนโลยีระบบแสงสีเสียง อาหารจัดเลี้ยงรสเลิศ และการดำเนินงานไร้รอยต่อ",
    iconName: "Compass",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80"
  },
  {
    slug: "team-building-csr",
    title: "Team Building & CSR",
    desc: "สร้างความสามัคคีและส่งต่อสิ่งดีๆ คืนสู่สังคม ด้วยกิจกรรมละลายพฤติกรรมและการทำบุญบำเพ็ญประโยชน์ ที่สนุกสนานและได้สาระความรู้ พัฒนาศักยภาพบุคคลากรอย่างยั่งยืน",
    iconName: "Award",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
  },
  {
    slug: "party",
    title: "งานเลี้ยงสังสรรค์",
    desc: "ฉลองความสำเร็จขององค์กรในแบบที่คุณต้องการ ด้วยธีมปาร์ตี้สุดชิค การแสดง แสง สี เสียง อุปกรณ์สันทนาการ ดนตรีสด และพิธีกรดำเนินรายการมืออาชีพ ที่จะทำให้ค่ำคืนนี้ประทับใจไม่รู้ลืม",
    iconName: "Sparkles",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80"
  },
  {
    slug: "event",
    title: "บริการจัดอีเวนต์",
    desc: "สร้างสรรค์งานอีเวนต์ทุกรูปแบบอย่างไร้ขีดจำกัด ตั้งแต่การออกแบบเวที แสง สี เสียง งานเปิดตัวสินค้า และกิจกรรมพิเศษ ดำเนินงานโดยทีมงานมืออาชีพ",
    iconName: "Calendar",
    image: "/event_service_banner.png"
  },
  {
    slug: "merit-tour",
    title: "ทัวร์สายบุญ – ไหว้พระอิ่มบุญ",
    desc: "เดินทางสักการะสิ่งศักดิ์สิทธิ์และวัดชื่อดังทั้งในและต่างประเทศ ร่วมสะสมบุญ เสริมความเป็นสิริมงคลให้ชีวิตด้วยการบริการที่สะดวกสบายและอบอุ่น",
    iconName: "Heart",
    image: "/merit_tour_banner.png"
  }
];

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceInfo[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("services_list");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTimeout(() => setServices(parsed), 0);
      } catch (e) {
        console.error(e);
        setTimeout(() => setServices(serviceList), 0);
      }
    } else {
      localStorage.setItem("services_list", JSON.stringify(serviceList));
      setTimeout(() => setServices(serviceList), 0);
    }
  }, []);

  const renderIcon = (name: string) => {
    const colorMap: Record<string, string> = {
      Users: "text-secondary",
      Briefcase: "text-primary",
      Compass: "text-emerald-500",
      Award: "text-amber-500",
      Sparkles: "text-rose-500",
      Calendar: "text-indigo-500",
      Heart: "text-red-500",
    };
    
    const color = colorMap[name] || "text-primary";
    
    switch (name) {
      case "Users": return <Users className={`h-6 w-6 ${color}`} />;
      case "Briefcase": return <Briefcase className={`h-6 w-6 ${color}`} />;
      case "Compass": return <Compass className={`h-6 w-6 ${color}`} />;
      case "Award": return <Award className={`h-6 w-6 ${color}`} />;
      case "Sparkles": return <Sparkles className={`h-6 w-6 ${color}`} />;
      case "Calendar": return <Calendar className={`h-6 w-6 ${color}`} />;
      case "Heart": return <Heart className={`h-6 w-6 ${color}`} />;
      default: return <HelpCircle className={`h-6 w-6 ${color}`} />;
    }
  };

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 font-prompt pb-24">
        {/* Banner Section */}
        <section className="relative min-h-[50vh] flex items-center justify-center bg-linear-to-r from-primary-dark via-slate-950 to-primary-dark text-white overflow-hidden text-center pt-28 pb-16">
          <div className="absolute inset-0 opacity-25">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80" 
              alt="Services Banner" 
              className="w-full h-full object-cover object-center scale-102"
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/60 z-1" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-4 pt-4">
            <h1 className="font-kanit font-extrabold text-4xl sm:text-5xl text-shadow-lg">
              บริการ <span className="text-secondary">จัดกรุ๊ปเหมา & งานองค์กร</span>
            </h1>
            <p className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium text-shadow-md">
              เราออกแบบและจัดการท่องเที่ยวแบบหมู่คณะ การประชุม สัมมนา และกิจกรรมทีมบิลดิ้งระดับพรีเมียม ตอบโจทย์ทุกความต้องการของธุรกิจคุณด้วยความเป็นมืออาชีพ
            </p>
          </div>
        </section>

        {/* Directory List */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xs flex flex-col h-full group hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
              >
                {/* Card Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover smooth-hover group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 left-4 p-2.5 bg-white rounded-2xl shadow-xs z-10">
                    {renderIcon(service.iconName)}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-grow space-y-4">
                  <div className="space-y-2">
                    <h2 className="font-kanit font-bold text-xl text-slate-800 group-hover:text-primary transition-colors duration-300">
                      {service.title}
                    </h2>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {service.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-auto border-t border-slate-50 flex items-center justify-between text-primary font-semibold text-sm">
                    <span>ดูรายละเอียดเพิ่มเติม</span>
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
                <Link href={`/services/${service.slug}`} className="absolute inset-0" />
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
