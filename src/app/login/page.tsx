"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Compass, Mail, Lock, User, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);

  // Form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = "/api/auth";
      const payload = 
        activeTab === "login" 
          ? { action: "login", email, password }
          : { action: "register", name, email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || (activeTab === "login" ? "เข้าสู่ระบบสำเร็จ!" : "สมัครสมาชิกสำเร็จ!"));
        
        // Cache user details locally
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Redirect based on role
        if (data.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
        router.refresh();
      } else {
        toast.error(data.error || "เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์");
      }
    } catch (err) {
      console.error(err);
      toast.error("ไม่สามารถดำเนินการได้ในขณะนี้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 font-prompt pt-32 pb-20 flex justify-center items-center px-4">
        
        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-3">
            <Link href="/" className="inline-flex items-center space-x-2.5 justify-center">
              <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-slate-100 bg-white flex items-center justify-center shrink-0 shadow-xs">
                <img
                  src="/logo.jpg"
                  alt="Sanook on tour Logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="font-kanit font-bold text-2xl tracking-wide">
                <span className="text-primary">Sanook</span>
                <span className="text-secondary ml-1">on tour</span>
              </span>
            </Link>
            <p className="text-slate-500 text-xs sm:text-sm">สัมผัสประสบการณ์ท่องเที่ยวที่ดีที่สุดของคุณ</p>
          </div>

          {/* Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => {
                setActiveTab("login");
                setEmail("");
                setPassword("");
              }}
              className={`flex-1 py-2 text-center text-xs font-semibold rounded-xl smooth-hover ${
                activeTab === "login" ? "bg-white text-primary shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              เข้าสู่ระบบ
            </button>
            <button
              onClick={() => {
                setActiveTab("register");
                setEmail("");
                setPassword("");
                setName("");
              }}
              className={`flex-1 py-2 text-center text-xs font-semibold rounded-xl smooth-hover ${
                activeTab === "register" ? "bg-white text-primary shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              สมัครสมาชิก
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            <AnimatePresence mode="wait">
              {activeTab === "register" && (
                <motion.div
                  key="register-name"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1"
                >
                  <label className="text-xs font-semibold text-slate-500">ชื่อ-นามสกุล *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="เช่น สมศักดิ์ ใจกว้าง"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary text-xs outline-hidden"
                    />
                    <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">อีเมลแอดเดรส *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary text-xs outline-hidden"
                />
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">รหัสผ่าน *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่านของคุณ"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary text-xs outline-hidden"
                />
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-xl smooth-hover flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin h-4.5 w-4.5" />
                    <span>กำลังประมวลผล...</span>
                  </>
                ) : (
                  <span>{activeTab === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิกตอนนี้"}</span>
                )}
              </button>
            </div>
          </form>
        </div>

      </main>

      <Footer />
    </>
  );
}
