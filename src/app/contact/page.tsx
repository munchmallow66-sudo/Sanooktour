"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, MessageSquare, Clock, Send, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("กรุณากรอกชื่อ อีเมล และข้อความติดต่อ");
      return;
    }

    setSending(true);
    // Simulate sending message
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      toast.success("ข้อความของท่านถูกส่งเรียบร้อยแล้ว เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด");
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    }, 1200);
  };

  const contacts = [
    {
      icon: <Phone className="h-6 w-6 text-primary" />,
      title: "เบอร์โทรศัพท์ติดต่อ",
      detail: (
        <span className="flex flex-col space-y-0.5 text-xs">
          <span>062-359-3293</span>
          <span>062-465-8228</span>
          <span>062-465-8998</span>
          <span>063-387-6979</span>
          <span>080-698-9393</span>
        </span>
      ),
      actionText: "โทรสายด่วน",
      link: "tel:0623593293"
    },
    {
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: "อีเมลสำหรับสอบถาม",
      detail: <span className="text-xs break-all block">sanookontour@gmail.com</span>,
      actionText: "ส่งอีเมล",
      link: "mailto:sanookontour@gmail.com"
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-emerald-500" />,
      title: "Line Official ID",
      detail: <span className="text-xs block">0624658228</span>,
      actionText: "แอดไลน์แชท",
      link: "https://line.me/ti/p/~0624658228"
    },
    {
      icon: (
        <svg className="h-6 w-6 text-[#1877F2] fill-current" viewBox="0 0 24 24">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
        </svg>
      ),
      title: "Facebook Page",
      detail: <span className="text-xs leading-snug block">Sanook on tour รับจัดกรุ๊ปทัวร์ทั้งในและต่างประเทศ</span>,
      actionText: "เข้าชมเพจ Facebook",
      link: "https://www.facebook.com/sanookontour456/?locale=th_TH"
    },
    {
      icon: <Clock className="h-6 w-6 text-slate-700" />,
      title: "เวลาทำการสำนักงาน",
      detail: <span className="text-xs block">จันทร์ - ศุกร์: 08:30 - 18:00 น.</span>,
      actionText: "วันทำการ",
      link: ""
    }
  ];

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 font-prompt pb-20">

        {/* Banner */}
        <section className="relative min-h-[45vh] flex items-center justify-center bg-slate-900 text-white overflow-hidden text-center pt-28 pb-20">
          <div className="absolute inset-0 opacity-20">
            <img
              src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80"
              alt="Contact Banner"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-4">
            <h1 className="font-kanit font-extrabold text-4xl sm:text-5xl">ติดต่อเรา</h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              เราพร้อมตอบข้อสงสัย แนะนำแพ็กเกจทัวร์ และอำนวยความสะดวกในการจองเดินทางให้ท่านในทุกรายละเอียด
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
            {contacts.map((c, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md flex flex-col items-center text-center justify-between space-y-4">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 shadow-xs">
                  {c.icon}
                </div>
                <div className="space-y-1 w-full">
                  <h3 className="font-kanit font-bold text-slate-800 text-sm">{c.title}</h3>
                  <div className="text-slate-500 text-xs sm:text-sm font-semibold pt-1">{c.detail}</div>
                </div>
                {c.link ? (
                  <a
                    href={c.link}
                    target={c.link.startsWith("http") ? "_blank" : undefined}
                    rel={c.link.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center text-xs font-semibold text-primary hover:text-primary-dark smooth-hover pt-2 border-t border-slate-50 w-full justify-center"
                  >
                    {c.actionText} →
                  </a>
                ) : (
                  <span className="text-slate-400 text-[10px] pt-2 border-t border-slate-50 w-full block">
                    {c.actionText}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form & Map */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
            <div>
              <h2 className="font-kanit font-bold text-xl sm:text-2xl text-slate-800">ส่งข้อความติดต่อฝ่ายบริการ</h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">กรอกข้อมูลของท่านด้านล่าง เจ้าหน้าที่จะติดต่อตอบกลับทางโทรศัพท์หรืออีเมลโดยเร็วที่สุด</p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 text-emerald-800 p-8 rounded-2xl border border-emerald-100 text-center space-y-3">
                <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto" />
                <h4 className="font-kanit font-bold text-lg">ขอบคุณสำหรับข้อความติดต่อ</h4>
                <p className="text-xs sm:text-sm max-w-sm mx-auto">
                  ข้อความความสนใจของท่านได้รับการบันทึกแล้ว เจ้าหน้าที่ฝ่ายลูกค้าสัมพันธ์จะประสานงานติดต่อกลับหาท่านโดยด่วน
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 smooth-hover"
                >
                  ส่งข้อความอื่นเพิ่มเติม
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">ชื่อผู้ติดต่อ *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="กรอกชื่อ-นามสกุล"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary text-xs outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">อีเมลสำหรับติดต่อกลับ *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@domain.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary text-xs outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">เบอร์โทรศัพท์ติดต่อ</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="กรอกเบอร์โทรศัพท์"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary text-xs outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">หัวข้อติดต่อ</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="เช่น แนะนำทัวร์สัมมนาบริษัท, ขอจองทัวร์"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary text-xs outline-hidden"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">รายละเอียดข้อความติดต่อ *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="พิมพ์ข้อความของคุณที่ต้องการให้เจ้าหน้าที่ดูแลประสานงานช่วยเหลือ..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary text-xs outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3 bg-slate-900 hover:bg-primary text-white font-semibold text-sm rounded-xl smooth-hover flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {sending ? (
                    <span>กำลังส่งข้อมูล...</span>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>ส่งข้อมูลหาฝ่ายบริการลูกค้า</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Map & Address */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
            <div className="space-y-4 text-xs text-slate-600">
              <h2 className="font-kanit font-bold text-xl text-slate-800">ที่ตั้งบริษัท</h2>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  1/10 ถ. สุขาภิบาล ๕ แขวงท่าแร้ง เขตบางเขน กรุงเทพมหานคร 10220
                </span>
              </div>
            </div>

            <div className="relative h-72 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
              <iframe
                src="https://maps.google.com/maps?q=Sanook%20on%20tour%20%E0%B8%AA%E0%B8%99%E0%B8%B8%E0%B8%81%20%E0%B8%AD%E0%B8%AD%E0%B8%99%E0%B8%97%E0%B8%B1%E0%B8%A7%E0%B8%A3%E0%B9%8C%201/10%20%E0%B8%96.%20%E0%B8%AA%E0%B8%B8%E0%B8%82%E0%B8%B2%E0%B8%A0%E0%B8%B4%E0%B8%9A%E0%B8%B2%E0%B8%A5%20%E0%B9%95%20%E0%B9%81%E0%B8%82%E0%B8%A7%E0%B8%87%E0%B8%97%E0%B9%88%E0%B8%B2%E0%B9%81%E0%B8%A3%E0%B9%89%E0%B8%87%20%E0%B9%80%E0%B8%82%E0%B8%95%E0%B8%9A%E0%B8%B2%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%99%20%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%A3%2010220&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}
