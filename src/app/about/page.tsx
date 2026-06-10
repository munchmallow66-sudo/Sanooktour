import { Compass, Users, Heart, ShieldCheck, Flame } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  const values = [
    {
      icon: <Flame className="h-6 w-6 text-secondary" />,
      title: "เที่ยวสนุก สุดพลัง (Sanook & Passion)",
      desc: "เราเชื่อว่าการท่องเที่ยวควรจะเป็นเรื่องสนุกที่สุดในชีวิต เราจึงออกแบบทุกโปรแกรมด้วยความกระตือรือร้น เพื่อมอบพลังและรอยยิ้มกลับไปให้ลูกทริปทุกคน",
      hoverBorder: "hover:border-secondary/35 hover:shadow-[0_10px_30px_rgba(240,119,48,0.06)]"
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: "ปลอดภัย ไร้กังวล (Safety First)",
      desc: "ความปลอดภัยของท่านคือหน้าที่อันดับหนึ่ง ทีมงานและไกด์ทุกคนผ่านการฝึกอบรมการปฐมพยาบาลและการแก้ปัญหาวิกฤต พร้อมประกันภัยคุ้มครองสูงสุดทุกทริป",
      hoverBorder: "hover:border-primary/35 hover:shadow-[0_10px_30px_rgba(49,118,177,0.06)]"
    },
    {
      icon: <Users className="h-6 w-6 text-emerald-500" />,
      title: "บริการอบอุ่นเหมือนคนในครอบครัว (Friendly Care)",
      desc: "เราดูแลทุกคนอย่างเป็นกันเอง ใส่ใจในทุกรายละเอียดเล็กๆ น้อยๆ ตั้งแต่อาหารการกินไปจนถึงการนอนหลับพักผ่อน เพื่อให้รู้สึกอุ่นใจเหมือนเที่ยวกับเพื่อนซี้",
      hoverBorder: "hover:border-emerald-500/35 hover:shadow-[0_10px_30px_rgba(16,185,129,0.06)]"
    },
    {
      icon: <Heart className="h-6 w-6 text-rose-500" />,
      title: "คุณภาพพรีเมียมแต่จริงใจ (Premium Value)",
      desc: "ทุกแพ็กเกจของเราถูกจัดสรรบนความคุ้มค่าสูงสุด ที่พักโรงแรมหรู 4-5 ดาว เดินทางสะดวกสบาย อาหารอร่อยขึ้นชื่อ ไม่มีตุกติกหรือบวกค่าใช้จ่ายหน้างาน",
      hoverBorder: "hover:border-rose-500/35 hover:shadow-[0_10px_30px_rgba(244,63,94,0.06)]"
    }
  ];

  const team = [
    {
      name: "คุณกิตติพงศ์ สนุกดี",
      role: "ผู้ก่อตั้งและประธานเจ้าหน้าที่บริหาร (Founder & CEO)",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80",
      quote: "เป้าหมายของผมคือสร้างการท่องเที่ยวรูปแบบใหม่ ที่ลบภาพความเหนื่อยล้าของทัวร์แบบเดิมๆ ให้เหลือแต่ความสนุกและประทับใจ"
    },
    {
      name: "คุณรสริน ท่องเที่ยว",
      role: "หัวหน้าฝ่ายจัดการเส้นทาง (Head of Tour Operations)",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=400&q=80",
      quote: "ฉันเดินทางมาแล้วกว่า 30 ประเทศ เพื่อคัดสรรเฉพาะโรงแรมที่เตียงนอนนุ่มที่สุด และจุดถ่ายภาพที่สวยและดีที่สุดให้ลูกค้าของเราค่ะ"
    },
    {
      name: "คุณธีรเดช นำทาง",
      role: "หัวหน้าทีมมัคคุเทศก์ (Chief Tour Guide)",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80",
      quote: "การได้เห็นรอยยิ้มและเสียงหัวเราะของทุกคนระหว่างเดินทาง คือรางวัลที่ยิ่งใหญ่ที่สุดในการทำหน้าที่ไกด์ของผมครับ"
    }
  ];

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 font-prompt pb-20">
        
        {/* Banner Section */}
        <section className="relative min-h-[50vh] flex items-center justify-center bg-linear-to-r from-primary-dark via-slate-950 to-primary-dark text-white overflow-hidden text-center pt-28 pb-16">
          <div className="absolute inset-0 opacity-25">
            <Image 
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80" 
              alt="About Banner" 
              fill
              priority
              sizes="100vw"
              className="object-cover object-center scale-102"
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/60 z-1" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-4 pt-4">
            <h1 className="font-kanit font-extrabold text-4xl sm:text-5xl text-shadow-lg">
              รู้จักกับ <span className="text-secondary">Sanook on tour</span>
            </h1>
            <p className="text-slate-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-medium text-shadow-md">
              เราคือบริษัททัวร์ยุคใหม่ของคนรุ่นใหม่ ที่ขับเคลื่อนด้วยการเดินทางที่เน้นการแชร์ความสุข ความสนุก และความประทับใจระดับพรีเมียม
            </p>
          </div>
        </section>

        {/* Company Vision & Story */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex p-3 bg-primary-light/10 text-primary rounded-2xl">
              <Compass className="h-6 w-6 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <h2 className="font-kanit font-bold text-2xl sm:text-3xl text-slate-800">
              จุดเริ่มต้นของความสนุกทุกการเดินทาง
            </h2>
            <div className="text-slate-600 text-sm leading-relaxed space-y-4">
              <p>
                <strong>Sanook on tour</strong> ก่อตั้งขึ้นจากกลุ่มคนรักการเดินทางที่เจอปัญหาเดียวกัน คือการเดินทางท่องเที่ยวกับทัวร์แบบดั้งเดิมมักจะมีตารางที่แน่นเกินไป รีบร้อน ช้อปปิ้งบังคับ และไกด์ที่ไม่ใส่ใจเท่าที่ควร เราจึงอยากทลายกำแพงเหล่านั้น
              </p>
              <p>
                เราดีไซน์แผนการท่องเที่ยวใหม่หมด โดยยึดหลักการ <strong>“เดินทางแบบพรีเมียม สบายๆ ถ่ายรูปสวย และสนุกเป็นกันเอง”</strong> เราคัดเลือกที่พักเฉพาะระดับ 4-5 ดาวที่มีสไตล์โดดเด่น มื้ออาหารขึ้นชื่อของท้องถิ่น และกำหนดเวลาเที่ยวให้พอเหมาะ ไม่รีบวิ่ง ให้ลูกค้าได้ซึมซับบรรยากาศจริงเต็มที่
              </p>
              <p>
                ไม่ว่าจะเป็นการเดินทางในประเทศ หรือพิชิตปลายทางต่างประเทศอันห่างไกล ท่านจะสัมผัสได้ถึงความเอาใจใส่ ความรอบรู้ และรอยยิ้มของพวกเราตั้งแต่วันแรกที่ปรึกษาไปจนถึงวันเดินทางกลับอย่างปลอดภัย
              </p>
            </div>
          </div>
          <div className="relative h-96 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-4 border-white group cursor-pointer">
            <Image 
              src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80" 
              alt="Group Travel" 
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover smooth-hover group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </section>

        {/* Core Values */}
        <section className="bg-white py-16 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="font-kanit font-bold text-2xl sm:text-3xl text-slate-800">คุณค่าหลักที่เรายึดถือ</h2>
              <p className="text-slate-500 text-sm">หลักการปฏิบัติงานและหัวใจสำคัญในการบริการที่พนักงานทุกคนยึดมั่น</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((v, idx) => (
                <div key={idx} className={`flex gap-5 p-6 rounded-2xl bg-slate-50 border border-slate-100 smooth-hover hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer ${v.hoverBorder}`}>
                  <div className="p-3 bg-white w-fit h-fit rounded-xl shadow-xs shrink-0">
                    {v.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-kanit font-semibold text-lg text-slate-800">{v.title}</h3>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Members */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="font-kanit font-bold text-2xl sm:text-3xl text-slate-800">ทีมผู้บริหารและเบื้องหลัง</h2>
            <p className="text-slate-500 text-sm">ผู้ร่วมวางแผน ออกแบบ และพาคุณเดินทางไปสัมผัสประสบการณ์ดีๆ ทั่วโลก</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col items-center text-center space-y-4 smooth-hover hover:-translate-y-2 hover:shadow-lg hover:border-primary/10 transition-all duration-300 group cursor-pointer"
              >
                <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-primary-light/20 shadow-inner group-hover:border-primary-light/50 transition-colors duration-500">
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    fill
                    sizes="128px"
                    className="object-cover smooth-hover group-hover:scale-105" 
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="font-kanit font-semibold text-lg text-slate-800">{member.name}</h3>
                  <p className="text-primary text-xs font-semibold leading-normal">{member.role}</p>
                </div>
                <p className="text-slate-500 text-xs italic leading-relaxed pt-2 border-t border-slate-50">
                  “ {member.quote} ”
                </p>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
