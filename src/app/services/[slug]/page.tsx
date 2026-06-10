"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, HelpCircle, Phone, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ServiceDetail {
  title: string;
  subtitle: string;
  desc: string;
  bgImage: string;
  benefits: string[];
  highlights: string[];
  placeholderName: string;
  previewImages?: string[];
}

const servicesData: Record<string, {
  title: string;
  subtitle: string;
  desc: string;
  bgImage: string;
  benefits: string[];
  highlights: string[];
  placeholderName: string;
  previewImages?: string[];
}> = {
  "private-group": {
    title: "รับจัดกรุ๊ปเหมา – กรุ๊ปส่วนตัว",
    subtitle: "เที่ยวแบบเป็นส่วนตัว ออกแบบเส้นทางได้ตามใจคุณ",
    desc: "ดีไซน์เส้นทางท่องเที่ยวในฝันที่เป็นตัวคุณที่สุด ร่วมเดินทางเฉพาะครอบครัว เพื่อนสนิท หรือคนพิเศษ เลือกวันเดินทาง สายการบิน โรงแรม และร้านอาหารได้ตามใจชอบ พร้อมไกด์และรถบริการส่วนตัวดูแลตลอดการเดินทางอย่างอบอุ่น",
    bgImage: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=1600&q=80",
    benefits: [
      "กำหนดแผนการเดินทางและเวลาตามใจคุณ ไม่ต้องรีบตามใคร",
      "เลือกโรงแรม ที่พัก และร้านอาหารระดับที่ต้องการได้ 100%",
      "รถตู้ VIP / รถบัสส่วนตัว พร้อมคนขับมืออาชีพและไกด์ดูแลเฉพาะกรุ๊ป",
      "มีความเป็นส่วนตัวสูง เหมาะสำหรับครอบครัว คู่รัก หรือกลุ่มเพื่อนสนิท"
    ],
    highlights: ["วางแผนตารางเวลาอิสระ", "รถตู้ VIP ส่วนตัว", "ไกด์ส่วนตัวดูแล 24 ชม.", "เลือกโรงแรมตามงบประมาณ"],
    placeholderName: "เช่น ทริปครอบครัวเที่ยวญี่ปุ่น 6 ท่าน"
  },
  "corporate": {
    title: "บริการจัดกรุ๊ปองค์กร - หมู่คณะ",
    subtitle: "ทัศนศึกษา ท่องเที่ยวประจำปีบริษัท ครบวงจร",
    desc: "นำพาองค์กรของคุณไปเปิดประสบการณ์ท่องเที่ยวแบบก้าวล้ำ สานสัมพันธ์พนักงาน พร้อมการบริการระดับพรีเมียม ดูแลครบวงจรตั้งแต่ตั๋วเครื่องบิน วีซ่า ประกันการเดินทาง จนถึงห้องสัมมนาและกิจกรรมบันเทิง",
    bgImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80",
    benefits: [
      "ดูแลครบวงจร (One-Stop Service) ตั๋วเครื่องบิน วีซ่า ที่พัก รถบัส",
      "วางแผนเส้นทางที่ตอบโจทย์เป้าหมายและงบประมาณของบริษัท",
      "มีทีมงานประสานงานดูแลหน้างานตลอดทริป มั่นใจไร้รอยต่อ",
      "รับประกันภัยการเดินทางวงเงินสูงสุดสำหรับหมู่คณะองค์กร"
    ],
    highlights: ["บริการครบวงจร One-Stop", "คุมงบประมาณองค์กรได้ดี", "ประสานงานหน้างานระดับมืออาชีพ", "ประกันภัยหมู่คณะครอบคลุม"],
    placeholderName: "เช่น ท่องเที่ยวประจำปีพนักงานบริษัท 80 ท่าน"
  },
  "meeting-seminar": {
    title: "บริการประชุม – สัมมนา",
    subtitle: "ประชุมวิชาการ สัมมนาเชิงปฏิบัติการ นอกสถานที่",
    desc: "ยกระดับการประชุมสัมมนานอกสถานที่ของบริษัท ด้วยการคัดสรรโรงแรมห้องประชุมระดับหรูที่เพียบพร้อมด้วยเทคโนโลยีระบบแสง สี เสียง อุปกรณ์มัลติมีเดีย อาหารจัดเลี้ยงรสเลิศ และห้องพักสบายสำหรับผู้เข้าร่วมงาน",
    bgImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80",
    benefits: [
      "คัดสรรโรงแรมที่มีห้องประชุมขนาดที่เหมาะสมและอุปกรณ์ครบครัน",
      "บริการจัดอาหารว่าง (Coffee Break) และอาหารมื้อหลักแบบพิเศษ",
      "ทีมงานติดตั้งและควบคุมระบบเทคนิคแสง สี เสียง ตลอดการสัมมนา",
      "บริการรถรับส่งสนามบิน-โรงแรม สำหรับวิทยากรและผู้บริหาร"
    ],
    highlights: ["อุปกรณ์ห้องประชุมครบครัน", "จัดเลี้ยงอาหารรสเลิศ", "บริการดูแลด้านเทคนิค", "บริหารตารางเวลาสัมมนาแม่นยำ"],
    placeholderName: "เช่น สัมมนาผู้บริหารระดับสูง 30 ท่าน ณ หัวหิน"
  },
  "team-building-csr": {
    title: "Team Building & CSR",
    subtitle: "กิจกรรมละลายพฤติกรรม สรรสร้างความสามัคคี และรับผิดชอบต่อสังคม",
    desc: "สร้างความสามัคคีและส่งต่อสิ่งดีๆ คืนสู่สังคม ด้วยกิจกรรมละลายพฤติกรรมและการทำบุญบำเพ็ญประโยชน์ ที่สนุกสนานและได้สาระความรู้ พัฒนาศักยภาพบุคคลากรอย่างสร้างสรรค์และยั่งยืน",
    bgImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
    benefits: [
      "วิทยากรกิจกรรมสันทนาการมืออาชีพ เพลิดเพลิน ได้แง่คิดพัฒนาทีม",
      "ออกแบบธีมกิจกรรมที่สอดคล้องกับค่านิยมขององค์กร (Core Values)",
      "จัดสรรกิจกรรม CSR เพื่อสังคม เช่น ปลูกป่า ปล่อยเต่า บริจาคสิ่งของ",
      "ช่างภาพและวิดีโอบันทึกภาพความประทับใจตลอดกิจกรรม"
    ],
    highlights: ["วิทยากรมืออาชีพ", "กิจกรรมออกแบบตามสั่ง", "บำเพ็ญประโยชน์เพื่อสังคม", "ภาพและวิดีโอระดับโปร"],
    placeholderName: "เช่น กิจกรรม Team Building พนักงาน 50 ท่าน ณ พัทยา"
  },
  "party": {
    title: "งานเลี้ยงสังสรรค์",
    subtitle: "ปาร์ตี้ปีใหม่ งานเลี้ยงขอบคุณลูกค้า งานกาล่าดินเนอร์",
    desc: "ฉลองความสำเร็จขององค์กรในแบบที่คุณต้องการ ด้วยธีมปาร์ตี้สุดชิค การแสดง แสง สี เสียง อุปกรณ์สันทนาการ ดนตรีสด และพิธีกรดำเนินรายการมืออาชีพ ที่จะทำให้ค่ำคืนงานเลี้ยงสังสรรค์ประทับใจพนักงานไม่รู้ลืม",
    bgImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1600&q=80",
    benefits: [
      "ออกแบบและตกแต่งสถานที่ตามธีมงานที่ต้องการ (เช่น คาวบอย, ย้อนยุค)",
      "ระบบเครื่องเสียง วงดนตรีสด ดีเจ และการแสดงโชว์ระดับมืออาชีพ",
      "อาหารบุฟเฟต์ โต๊ะจีน หรือค็อกเทล พร้อมเครื่องดื่มหลากหลาย",
      "กิจกรรมชิงโชค จับสลาก และเกมสนุกสนานตลอดค่ำคืน"
    ],
    highlights: ["จัดตกแต่งสถานที่ตามธีม", "เครื่องเสียงและไฟระดับผับ", "พิธีกรและวงดนตรีสด", "อาหารบุฟเฟต์/ค็อกเทลรสเลิศ"],
    placeholderName: "เช่น งานเลี้ยงปีใหม่พนักงานบริษัท 120 ท่าน ณ กรุงเทพฯ"
  },
  "event": {
    title: "บริการจัดอีเวนต์ – งานเปิดตัว & กิจกรรมพิเศษ",
    subtitle: "สร้างสรรค์งานอีเวนต์ทุกรูปแบบอย่างไร้ขีดจำกัด ด้วยทีมงานมืออาชีพ",
    desc: "เราให้บริการจัดงานอีเวนต์ครบวงจร ตั้งแต่การวางแนวคิด การออกแบบเวที แสง สี เสียง งานเปิดตัวสินค้า งานแถลงข่าว กิจกรรมส่งเสริมการขาย ตลอดจนงานคอนเสิร์ตและงานแสดงสินค้า มั่นใจได้ในความสวยงามและการดำเนินงานที่เป็นระบบแบบมืออาชีพ",
    bgImage: "/event_service_banner.png",
    benefits: [
      "ออกแบบและวางคอนเซปต์งานตามโจทย์และภาพลักษณ์ที่บริษัทต้องการ",
      "ระบบแสง สี เสียง เวที และเอฟเฟกต์สุดอลังการระดับมาตรฐานสากล",
      "ทีมงานควบคุมคิวงานและประสานงานมืออาชีพ รันคิวตรงเวลา แม่นยำ",
      "คัดสรรผู้ดำเนินรายการ (MC) ดารา ศิลปิน และการแสดงที่ตรงใจคุณ"
    ],
    highlights: ["ออกแบบอีเวนต์ตามธีม", "ระบบแสงสีเสียงไฮเอนด์", "รันคิวแม่นยำทุกขั้นตอน", "บริการครบวงจรจบในที่เดียว"],
    placeholderName: "เช่น งานเปิดตัวสินค้าใหม่ พนักงาน 200 ท่าน ณ กรุงเทพฯ"
  },
  "merit-tour": {
    title: "ทัวร์สายบุญ – ไหว้พระอิ่มบุญ",
    subtitle: "เดินทางท่องเที่ยวพร้อมสะสมบุญ เสริมสิริมงคลให้ชีวิต",
    desc: "พาคุณเดินทางสักการะสิ่งศักดิ์สิทธิ์ วัดชื่อดัง และสถานที่ท่องเที่ยวสำคัญทางประวัติศาสตร์และศาสนา ทั้งในและต่างประเทศ ร่วมทำบุญ ถวายสังฆทาน ฟังธรรมเทศนา ท่ามกลางบรรยากาศที่สงบและสบาย พร้อมไกด์ผู้เชี่ยวชาญเล่าเรื่องราวประวัติศาสตร์และประเพณีอย่างลึกซึ้ง",
    bgImage: "/merit_tour_banner.png",
    benefits: [
      "เดินทางสักการะสิ่งศักดิ์สิทธิ์เสริมดวงชะตา บารมี และความเป็นสิริมงคล",
      "กำหนดเส้นทางทำบุญที่เหมาะสม ไม่เหนื่อยล้าจนเกินไปสำหรับคณะผู้เดินทางและผู้ใหญ่",
      "บริการอาหารเจ / อาหารมังสวิรัติ หรืออาหารท้องถิ่นรสเลิศทุกมื้อถูกหลักอนามัย",
      "ไกด์นำเที่ยวผู้เชี่ยวชาญคอยแนะนำพิธีการทำบุญและประวัติสถานที่อย่างถูกต้อง"
    ],
    highlights: ["ไหว้พระวัดดังเสริมสิริมงคล", "ทัวร์ไม่เร่งรีบ สบายๆ", "อาหารอร่อยถูกหลักอนามัย", "รวมทุกพิธีการทำบุญชี้แนะ"],
    placeholderName: "เช่น ทัวร์ไหว้พระ 9 วัด จังหวัดอยุธยา ผู้เดินทาง 15 ท่าน"
  }
};

export default function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { slug } = use(params);
  
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("services_data");
    let currentData = servicesData;
    if (stored) {
      try {
        currentData = JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    } else {
      localStorage.setItem("services_data", JSON.stringify(servicesData));
    }
    setTimeout(() => {
      setService(currentData[slug] || null);
      setLoading(false);
    }, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center font-prompt text-slate-500">
        กำลังโหลดข้อมูลบริการ...
      </div>
    );
  }

  if (!service) {
    return (
      <>
        <Navbar />
        <main className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50 font-prompt text-center p-4">
          <h1 className="font-kanit font-bold text-3xl text-slate-800">ไม่พบบริการที่ต้องการ</h1>
          <p className="text-slate-500 mt-2">หน้าบริการนี้ไม่มีอยู่หรือถูกถอดถอนแล้ว</p>
          <button 
            onClick={() => router.push("/services")} 
            className="mt-6 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold smooth-hover"
          >
            ไปหน้าบริการหลัก
          </button>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 font-prompt pb-24">
        {/* Hero Section */}
        <section className="relative min-h-[50vh] flex items-center justify-center bg-linear-to-r from-primary-dark via-slate-950 to-primary-dark text-white overflow-hidden text-center pt-28 pb-16">
          <div className="absolute inset-0 opacity-25">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={service.bgImage} 
              alt={service.title} 
              className="w-full h-full object-cover object-center scale-102"
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/60 z-1" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-4 pt-8">
            <h1 className="font-kanit font-extrabold text-3xl sm:text-4xl md:text-5xl text-shadow-lg leading-tight">
              {service.title}
            </h1>
            <p className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto font-medium text-shadow-md leading-relaxed">
              {service.subtitle}
            </p>
          </div>
        </section>

        {/* Content Column */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-10">
            {/* Description */}
            <div className="space-y-4 bg-white p-8 rounded-3xl border border-slate-100 shadow-xs">
              <h2 className="font-kanit font-bold text-2xl text-slate-800 border-l-4 border-primary pl-3">
                รายละเอียดการให้บริการ
              </h2>
              <p className="text-slate-600 text-[15px] sm:text-base leading-relaxed pt-2">
                {service.desc}
              </p>
            </div>

            {/* Highlights */}
            <div className="space-y-4">
              <h2 className="font-kanit font-bold text-xl text-slate-800 pl-1">
                ไฮไลต์สำคัญของบริการนี้
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.highlights.map((highlight: string, idx: number) => (
                  <div 
                    key={idx} 
                    className="p-4 bg-white rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-3 smooth-hover hover:border-primary/20 hover:shadow-xs"
                  >
                    <div className="h-2 w-2 rounded-full bg-secondary shrink-0" />
                    <span className="font-prompt text-sm font-semibold text-slate-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-4 bg-white p-8 rounded-3xl border border-slate-100 shadow-xs">
              <h2 className="font-kanit font-bold text-xl text-slate-800 border-l-4 border-secondary pl-3">
                สิ่งที่คุณจะได้รับเมื่อเดินทางกับเรา
              </h2>
              <ul className="space-y-4 pt-2">
                {service.benefits.map((benefit: string, idx: number) => (
                  <li key={idx} className="flex items-start space-x-3.5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-600 text-sm sm:text-[15px] leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Preview Images Gallery */}
            {service.previewImages && service.previewImages.length > 0 && (
              <div className="space-y-4 bg-white p-8 rounded-3xl border border-slate-100 shadow-xs">
                <h2 className="font-kanit font-bold text-xl text-slate-800 border-l-4 border-primary pl-3">
                  ภาพบรรยากาศ / ตัวอย่างการจัดกิจกรรม
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                  {service.previewImages.map((img: string, idx: number) => (
                    <div key={idx} className="relative h-32 sm:h-40 rounded-2xl overflow-hidden group border border-slate-100 shadow-2xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`${service.title} preview ${idx + 1}`}
                        className="w-full h-full object-cover smooth-hover group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Immediate Assistance Info */}
            <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 flex flex-col sm:flex-row gap-5 items-center">
              <div className="p-3 bg-white rounded-2xl shadow-xs shrink-0 text-primary">
                <HelpCircle className="h-8 w-8" />
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="font-kanit font-bold text-slate-800 text-base sm:text-lg">ต้องการติดต่อเร่งด่วน?</h3>
                <p className="text-slate-500 text-xs sm:text-sm">สามารถโทรสายตรงเจ้าหน้าที่ผู้ดูแลกรุ๊ปองค์กรและกรุ๊ปเหมาได้โดยตรง</p>
                <div className="pt-2 flex flex-wrap gap-4 justify-center sm:justify-start font-prompt text-sm font-semibold text-primary">
                  <span className="flex items-center gap-1"><Phone className="h-4 w-4" /> 062-3593293</span>
                  <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> sanookontour@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
