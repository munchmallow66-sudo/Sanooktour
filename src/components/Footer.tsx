import Link from "next/link";
import { Compass, Phone, Mail, MapPin, MessageSquare } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#184085] text-slate-200 font-prompt">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-white/20 bg-white flex items-center justify-center shrink-0">
                <img
                  src="/logo.jpg"
                  alt="Sanook on tour Logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="font-kanit font-bold text-2xl tracking-wide flex items-center">
                <span className="text-white">Sanook</span>
                <span className="text-secondary ml-1">on tour</span>
              </span>
            </Link>
            <p className="text-slate-300 text-sm leading-relaxed">
              บริษัททัวร์ยุคใหม่ เที่ยวสนุก ทุกทริป บริการอบอุ่น ใส่ใจทุกรายละเอียด ด้วยราคาที่คุ้มค่าสูงสุด พร้อมดูแลท่านตลอด 24 ชั่วโมง
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="https://www.facebook.com/sanookontour456/?locale=th_TH" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-[#123166] hover:bg-secondary hover:text-white text-slate-300 smooth-hover" title="Facebook">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
              <a href="#" className="p-2 rounded-lg bg-[#123166] hover:bg-secondary hover:text-white text-slate-300 smooth-hover" title="Instagram">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="#" className="p-2 rounded-lg bg-[#123166] hover:bg-secondary hover:text-white text-slate-300 smooth-hover" title="Twitter">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a href="https://line.me/ti/p/~0624658228" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-[#123166] hover:bg-secondary hover:text-white text-slate-300 smooth-hover" title="Line">
                <MessageSquare className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-kanit font-semibold text-lg mb-6 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-0.5 after:bg-secondary">
              ลิงก์แนะนำ
            </h3>
            <ul className="space-y-3 text-sm text-slate-200">
              <li>
                <Link href="/" className="hover:text-secondary smooth-hover flex items-center">
                  <span className="mr-2">›</span> หน้าแรก
                </Link>
              </li>
              <li>
                <Link href="/tours" className="hover:text-secondary smooth-hover flex items-center">
                  <span className="mr-2">›</span> ทัวร์ทั้งหมด
                </Link>
              </li>
              <li>
                <Link href="/tours?isDomestic=true" className="hover:text-secondary smooth-hover flex items-center">
                  <span className="mr-2">›</span> ทัวร์ในประเทศ
                </Link>
              </li>
              <li>
                <Link href="/tours?isDomestic=false" className="hover:text-secondary smooth-hover flex items-center">
                  <span className="mr-2">›</span> ทัวร์ต่างประเทศ
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-secondary smooth-hover flex items-center">
                  <span className="mr-2">›</span> เกี่ยวกับเรา
                </Link>
              </li>
            </ul>
          </div>

          {/* Destinations Column */}
          <div>
            <h3 className="text-white font-kanit font-semibold text-lg mb-6 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-0.5 after:bg-secondary">
              จุดหมายปลายทางยอดฮิต
            </h3>
            <ul className="space-y-3 text-sm text-slate-200">
              <li>
                <Link href="/tours?search=ญี่ปุ่น" className="hover:text-secondary smooth-hover flex items-center">
                  <span className="mr-2">›</span> ญี่ปุ่น (Japan)
                </Link>
              </li>
              <li>
                <Link href="/tours?search=สวิตเซอร์แลนด์" className="hover:text-secondary smooth-hover flex items-center">
                  <span className="mr-2">›</span> สวิตเซอร์แลนด์ (Switzerland)
                </Link>
              </li>
              <li>
                <Link href="/tours?search=เกาหลี" className="hover:text-secondary smooth-hover flex items-center">
                  <span className="mr-2">›</span> เกาหลีใต้ (South Korea)
                </Link>
              </li>
              <li>
                <Link href="/tours?search=เชียงใหม่" className="hover:text-secondary smooth-hover flex items-center">
                  <span className="mr-2">›</span> เชียงใหม่ (Chiang Mai)
                </Link>
              </li>
              <li>
                <Link href="/tours?search=ภูเก็ต" className="hover:text-secondary smooth-hover flex items-center">
                  <span className="mr-2">›</span> ภูเก็ต (Phuket)
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-white font-kanit font-semibold text-lg mb-6 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-0.5 after:bg-secondary">
              ติดต่อเรา
            </h3>
            <ul className="space-y-4 text-sm text-slate-200">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-secondary mr-3 shrink-0 mt-0.5" />
                <span className="text-slate-300">
                  1/10 ถ. สุขาภิบาล ๕ แขวงท่าแร้ง เขตบางเขน กรุงเทพฯ 10220
                </span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-secondary mr-3 shrink-0 mt-0.5" />
                <span className="text-slate-300 text-xs leading-relaxed">
                  062-3593293, 062-4658228, 062-4658998,<br />
                  063-3876979, 080-6989393
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-secondary mr-3 shrink-0" />
                <span className="text-slate-300">sanookontour@gmail.com</span>
              </li>
              <li className="pt-2 border-t border-[#123166]">
                <p className="text-xs text-slate-400">วันทำการ: จันทร์ - ศุกร์ (08.30 - 18.00 น.)</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Lower Footer */}
      <div className="border-t border-[#123166] bg-[#0f2c61] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-300 space-y-4 md:space-y-0">
          <p>© 2026 Sanook on tour. All Rights Reserved. ใบอนุญาตประกอบธุรกิจนำเที่ยวเลขที่ 11/XXXXX</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-secondary smooth-hover">ข้อตกลงการใช้งาน</a>
            <a href="#" className="hover:text-secondary smooth-hover">นโยบายความเป็นส่วนตัว</a>
            <a href="#" className="hover:text-secondary smooth-hover">คำแนะนำความปลอดภัย</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
