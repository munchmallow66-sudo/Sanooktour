"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Compass, ShieldCheck, HeartHandshake, Award, Headset, Star, ArrowRight, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import TourCard from "@/components/TourCard";
import { GridSkeleton } from "@/components/SkeletonLoader";
import { Tour, Destination, Review } from "@/lib/mockData";

export default function HomePage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [recommendedTours, setRecommendedTours] = useState<Tour[]>([]);
  const [promotionTours, setPromotionTours] = useState<Tour[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        // Load destinations
        const destRes = await fetch("/api/tours"); // We can fetch tours and group or get separate endpoints
        // For simplicity and decoupling, let's fetch tours and filter locally for home, or load from separate API if defined
        const toursRes = await fetch("/api/tours");
        const allTours = await toursRes.json() as Tour[];

        // Filter recommended and promotion tours
        setRecommendedTours(allTours.filter(t => t.is_recommended).slice(0, 3));
        setPromotionTours(allTours.filter(t => t.is_promotion).slice(0, 3));

        // Group destinations from tours
        const destMap = new Map<string, number>();
        allTours.forEach(t => {
          destMap.set(t.country, (destMap.get(t.country) || 0) + 1);
        });

        // Set predefined destinations with count
        const initialDestinations: Destination[] = [
          { id: "d1", name: "ญี่ปุ่น", image_url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80", tour_count: destMap.get("ญี่ปุ่น") || 1 },
          { id: "d2", name: "สวิตเซอร์แลนด์", image_url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=400&q=80", tour_count: destMap.get("สวิตเซอร์แลนด์") || 1 },
          { id: "d3", name: "เชียงใหม่", image_url: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=400&q=80", tour_count: destMap.get("ไทย") || 2 },
          { id: "d4", name: "ภูเก็ต", image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80", tour_count: destMap.get("ไทย") || 2 },
          { id: "d5", name: "เกาหลีใต้", image_url: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=400&q=80", tour_count: destMap.get("เกาหลีใต้") || 1 },
          { id: "d6", name: "เวียดนาม", image_url: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=400&q=80", tour_count: destMap.get("เวียดนาม") || 1 },
        ];
        setDestinations(initialDestinations);

        // Load reviews
        const revRes = await fetch("/api/tours/tour-1"); // fetch reviews from specific tour or static ones
        const details = await revRes.json();
        setReviews(details.reviews || []);

        setLoading(false);
      } catch (error) {
        console.error("Failed to load home page data:", error);
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  } as const;

  // Why choose us points
  const features = [
    {
      icon: <Award className="h-7 w-7 text-secondary" />,
      title: "บริการระดับพรีเมียม",
      description: "คัดสรรโรงแรมคุณภาพ 4-5 ดาว ร้านอาหารรสเลิศ และเดินทางด้วยรถนำเที่ยวที่สะดวกสบายปลอดภัยที่สุด"
    },
    {
      icon: <ShieldCheck className="h-7 w-7 text-secondary" />,
      title: "ปลอดภัย ไร้กังวล",
      description: "จดทะเบียนถูกต้องตามกฎหมาย มีประกันภัยการเดินทางวงเงินคุ้มครองสูง ดูแลความปลอดภัยอย่างเข้มงวด"
    },
    {
      icon: <Headset className="h-7 w-7 text-secondary" />,
      title: "ดูแลช่วยเหลือ 24 ชั่วโมง",
      description: "มีทีมงานมัคคุเทศก์และฝ่ายบริการลูกค้าคอยให้ความช่วยเหลือประสานงานแก้ปัญหาให้ท่านในทุกเวลา"
    },
    {
      icon: <HeartHandshake className="h-7 w-7 text-secondary" />,
      title: "ราคาคุ้มค่า ไม่มีบวกเพิ่ม",
      description: "ราคาทัวร์เคลียร์ชัดเจน รวมค่าตั๋ว ค่าที่พัก ค่าเข้าชม ไม่มีค่าใช้จ่ายแอบแฝงระหว่างเดินทาง"
    }
  ];

  // Gallery images
  const galleryImages = [
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=400&q=80",
  ];

  return (
    <>
      <Navbar />
      <Hero />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        
        {/* SECTION 1: POPULAR DESTINATIONS */}
        <section className="space-y-8">
          <div className="text-center md:text-left md:flex md:items-end md:justify-between">
            <div>
              <h2 className="font-kanit font-bold text-3xl text-slate-800">จุดหมายยอดนิยม</h2>
              <p className="font-prompt text-slate-500 mt-2">เปิดพิกัดเที่ยวสุดฮิตที่มีผู้เลือกเดินทางมากที่สุด</p>
            </div>
            <Link href="/tours" className="hidden md:flex items-center text-primary font-prompt font-semibold hover:text-primary-dark smooth-hover">
              ดูปลายทางทั้งหมด <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {destinations.map((dest, idx) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className="relative h-64 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg group cursor-pointer"
              >
                <Link href={`/tours?search=${encodeURIComponent(dest.name.split(' ')[0])}`}>
                  <img
                    src={dest.image_url}
                    alt={dest.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover smooth-hover group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-slate-900/10 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <p className="font-kanit font-semibold text-lg">{dest.name}</p>
                    <p className="font-prompt text-xs text-slate-300 mt-1">{dest.tour_count} โปรแกรมทัวร์</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 2: SPECIAL PROMOTIONS */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="font-kanit font-bold text-3xl text-slate-800">โปรโมชั่นพิเศษสุดฮอต</h2>
            <p className="font-prompt text-slate-500 mt-2">โปรแกรมทัวร์ลดกระหน่ำ ราคาพิเศษ เฉพาะช่วงนี้เท่านั้น!</p>
          </div>

          {loading ? (
            <GridSkeleton count={3} />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {promotionTours.map((tour) => (
                <motion.div key={tour.id} variants={itemVariants}>
                  <TourCard tour={tour} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* SECTION 3: RECOMMENDED TOURS */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="font-kanit font-bold text-3xl text-slate-800">ทริปแนะนำที่ไม่ควรพลาด</h2>
            <p className="font-prompt text-slate-500 mt-2">ทริปยอดฮิต จัดโปรแกรมสุดคุ้ม ดูแลโดยไกด์คุณภาพมืออาชีพ</p>
          </div>

          {loading ? (
            <GridSkeleton count={3} />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {recommendedTours.map((tour) => (
                <motion.div key={tour.id} variants={itemVariants}>
                  <TourCard tour={tour} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="text-center pt-4">
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-slate-900 text-white font-prompt font-semibold text-sm hover:bg-primary smooth-hover shadow-md"
            >
              <span>ดูแพ็กเกจทัวร์ทั้งหมด</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </Link>
          </div>
        </section>

        {/* SECTION 4: WHY CHOOSE US */}
        <section className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-100 space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-kanit font-bold text-3xl text-slate-800">ทำไมต้องเดินทางกับเรา?</h2>
            <p className="font-prompt text-slate-500 mt-2">เหตุผลที่นักเดินทางยุคใหม่เลือกใช้บริการ Sanook on tour ในทุกทริปสำคัญ</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-white p-8 rounded-[30px] shadow-[0_5px_15px_rgba(0,0,0,0.12)] flex flex-col space-y-4 hover:scale-[1.03] smooth-hover"
              >
                <div className="p-3 bg-secondary/10 w-fit rounded-2xl">
                  {feat.icon}
                </div>
                <h3 className="font-kanit font-bold text-lg text-slate-950">{feat.title}</h3>
                <p className="font-prompt text-slate-600 text-sm leading-relaxed">{feat.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 5: CUSTOMER REVIEWS */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="font-kanit font-bold text-3xl text-slate-800">เสียงตอบรับจากลูกค้าของเรา</h2>
            <p className="font-prompt text-slate-500 mt-2">ความประทับใจและความรู้สึกจริงจากนักเดินทางที่เคยไปสัมผัสประสบการณ์ทัวร์กับเรา</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.length > 0 ? (
              reviews.slice(0, 4).map((rev, idx) => (
                <motion.div
                  key={rev.id}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-white p-8 rounded-[30px] shadow-[0_5px_15px_rgba(0,0,0,0.12)] flex flex-col justify-between hover:scale-[1.02] smooth-hover"
                >
                  <p className="font-prompt text-slate-600 italic leading-relaxed">
                    “ {rev.comment} ”
                  </p>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                    <span className="font-prompt font-semibold text-slate-900 text-sm">{rev.author}</span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < rev.rating ? 'text-secondary fill-secondary' : 'text-slate-200'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              // Fallback reviews if database hasn't loaded yet
              Array.from({ length: 2 }).map((_, idx) => (
                <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between animate-pulse">
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded-sm w-full" />
                    <div className="h-4 bg-slate-200 rounded-sm w-5/6" />
                  </div>
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100">
                    <div className="h-4 bg-slate-200 rounded-sm w-24" />
                    <div className="h-4 bg-slate-200 rounded-sm w-20" />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* SECTION 6: GALLERY */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="font-kanit font-bold text-3xl text-slate-800">ภาพบรรยากาศและความสุข</h2>
            <p className="font-prompt text-slate-500 mt-2">ภาพถ่ายแห่งความประทับใจและความสนุกสนานจากผู้ร่วมทริปเดินทางจริง</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="relative h-64 rounded-2xl overflow-hidden group cursor-zoom-in"
              >
                <img
                  src={img}
                  alt={`Gallery Image ${idx + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover smooth-hover group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 smooth-hover flex items-center justify-center">
                  <ImageIcon className="text-white h-8 w-8 scale-75 group-hover:scale-100 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 7: CALL TO ACTION SECTION */}
        <section className="relative overflow-hidden rounded-3xl bg-slate-950 py-16 px-8 text-center text-white border border-slate-800">
          {/* Background overlay details */}
          <div className="absolute inset-0 z-0">
             <img 
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=70" 
              alt="CTA Background" 
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover opacity-15"
            />
          </div>
          <div className="absolute top-[-50%] left-[-20%] w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-[-50%] right-[-20%] w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="font-kanit font-bold text-3xl sm:text-4xl">เริ่มวางแผนการเดินทางในฝันของคุณ</h2>
            <p className="font-prompt text-slate-400 text-base sm:text-lg leading-relaxed">
              ไม่อยากพลาดช่วงเวลาดีๆ และราคาโปรโมชั่นพิเศษใช่ไหม? สอบถามข้อมูลเพิ่มเติม หรือจองที่นั่งทริปท่องเที่ยวกับเราล่วงหน้าได้เลย
            </p>
            <div className="pt-4 flex flex-wrap gap-4 items-center justify-center">
              <Link 
                href="/tours" 
                className="orange-gradient text-white px-8 py-3.5 rounded-2xl font-prompt font-semibold text-sm shadow-md hover:shadow-lg smooth-hover hover:-translate-y-0.5"
              >
                ค้นหาทริปทั้งหมด
              </Link>
              <Link 
                href="/contact" 
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-3.5 rounded-2xl font-prompt font-semibold text-sm smooth-hover"
              >
                ติดต่อเจ้าหน้าที่
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
