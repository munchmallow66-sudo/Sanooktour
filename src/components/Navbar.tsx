"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function NavbarContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isToursDropdownOpen, setIsToursDropdownOpen] = useState(false);
  const [isMobileToursOpen, setIsMobileToursOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check login state
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setTimeout(() => setUser(parsed), 0);
      } catch (error) {
        console.error(error);
        localStorage.removeItem("user");
      }
    }

    // Set listener for storage change (e.g., when logging in/out from other pages)
    const handleStorageChange = () => {
      const u = localStorage.getItem("user");
      setUser(u ? JSON.parse(u) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    // Poll to keep state updated on page transitions
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    if (!isProfileOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#profile-menu-container")) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isProfileOpen]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { name: "หน้าแรก", path: "/" },
    {
      name: "แพ็กเกจทัวร์",
      path: "/tours",
      subLinks: [
        { name: "ทัวร์ทั้งหมด", path: "/tours" },
        { name: "ทัวร์ในประเทศ", path: "/tours?isDomestic=true" },
        { name: "ทัวร์ต่างประเทศ", path: "/tours?isDomestic=false" },
      ],
    },
    {
      name: "บริการ",
      path: "/services",
      subLinks: [
        { name: "กรุ๊ปเหมา & ส่วนตัว", path: "/services/private-group" },
        { name: "กรุ๊ปองค์กร & หมู่คณะ", path: "/services/corporate" },
        { name: "ประชุม & สัมมนา", path: "/services/meeting-seminar" },
        { name: "Team Building & CSR", path: "/services/team-building-csr" },
        { name: "งานเลี้ยงสังสรรค์", path: "/services/party" },
        { name: "จัดอีเวนต์", path: "/services/event" },
        { name: "ทัวร์สายบุญ", path: "/services/merit-tour" },
      ],
    },
    { name: "เกี่ยวกับเรา", path: "/about" },
    { name: "ติดต่อเรา", path: "/contact" },
  ];

  const bannerPages = ["/", "/about", "/services", "/contact"];
  const isBannerPage = bannerPages.includes(pathname) || pathname.startsWith("/services/");
  
  const isTransparent = isBannerPage && !isScrolled && !isOpen;
  const searchParams = useSearchParams();

  const isLinkActive = (link: { path: string; subLinks?: { path: string }[] }) => {
    if (link.path === "/") {
      return pathname === "/";
    }

    if (link.subLinks) {
      return pathname.startsWith(link.path);
    }

    return pathname === link.path;
  };

  const isSubLinkActive = (subPath: string) => {
    if (!pathname.startsWith("/tours")) return false;
    const isDomesticParam = searchParams.get("isDomestic");
    
    if (subPath.includes("isDomestic=true")) {
      return isDomesticParam === "true";
    }
    if (subPath.includes("isDomestic=false")) {
      return isDomesticParam === "false";
    }
    if (subPath === "/tours") {
      return pathname === "/tours" && isDomesticParam === null;
    }
    return false;
  };

  const headerClass = `z-50 w-full transition-all duration-300 ${
    isBannerPage ? "fixed" : "sticky"
  } top-0 ${
    isTransparent
      ? "px-4 sm:px-6 xl:px-8 pt-4 pb-2 bg-transparent"
      : "px-0 py-0 bg-white shadow-lg"
  }`;

  const innerClass = `max-w-[1440px] mx-auto w-full transition-all duration-300 ${
    isTransparent
      ? "rounded-[20px] sm:rounded-[24px] bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.15)] py-1"
      : "bg-transparent border-0 shadow-none py-0 rounded-none px-4 sm:px-6 xl:px-8"
  }`;

  return (
    <header className={headerClass}>
      <div className={innerClass}>
        <div className="flex items-center justify-between h-20 px-6 sm:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group shrink-0">
            <div className={`relative h-11 w-11 overflow-hidden rounded-xl border flex items-center justify-center smooth-hover group-hover:scale-105 shadow-xs shrink-0 transition-all duration-300 ${
              isTransparent ? "border-white/20 bg-white/10 backdrop-blur-md" : "border-slate-200 bg-white"
            }`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.jpg"
                alt="Sanook on tour Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="font-kanit font-bold text-xl sm:text-2xl tracking-wide flex items-center">
              <span className={`transition-colors duration-300 ${isTransparent ? "text-white" : "text-primary"}`}>Sanook</span>
              <span className="text-secondary ml-1 transition-colors duration-300">on tour</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1 xl:space-x-2 ml-auto mr-8 xl:mr-10">
            {navLinks.map((link) => {
              const isActive = isLinkActive(link);
              
              if (link.subLinks) {
                const isTours = link.path === "/tours";
                const isOpenDropdown = isTours ? isToursDropdownOpen : isServicesDropdownOpen;
                const setIsOpenDropdown = isTours ? setIsToursDropdownOpen : setIsServicesDropdownOpen;
                
                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setIsOpenDropdown(true)}
                    onMouseLeave={() => setIsOpenDropdown(false)}
                  >
                    <button
                      className={`flex items-center gap-1 px-3 xl:px-4 py-2 font-prompt text-[15px] xl:text-[17px] font-medium smooth-hover border-b-2 transition-all duration-300 whitespace-nowrap cursor-pointer ${
                        isActive
                          ? isTransparent
                            ? "text-secondary border-secondary font-semibold text-shadow-sm"
                            : "text-primary border-primary font-semibold"
                          : isTransparent
                            ? "text-white border-transparent hover:text-secondary text-shadow-sm"
                            : "text-slate-900 border-transparent hover:text-primary"
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpenDropdown ? "rotate-180" : ""}`} />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {isOpenDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="absolute left-0 mt-1 w-52 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-slate-100 py-2 z-50 overflow-hidden text-slate-800"
                        >
                          {link.subLinks.map((sub) => {
                            const isSubActive = isSubLinkActive(sub.path);
                            return (
                              <Link
                                key={sub.name}
                                href={sub.path}
                                className={`block px-4 py-2.5 font-prompt text-sm font-medium transition-colors hover:bg-slate-50 ${
                                  isSubActive ? "text-primary bg-primary/5 font-semibold" : "text-slate-700 hover:text-primary"
                                }`}
                              >
                                {sub.name}
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`px-3 xl:px-4 py-2 font-prompt text-[15px] xl:text-[17px] font-medium smooth-hover border-b-2 transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? isTransparent
                        ? "text-secondary border-secondary font-semibold text-shadow-sm"
                        : "text-primary border-primary font-semibold"
                      : isTransparent
                        ? "text-white border-transparent hover:text-secondary text-shadow-sm"
                        : "text-slate-900 border-transparent hover:text-primary"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* User Operations */}
          <div className="hidden xl:flex items-center space-x-2 xl:space-x-4 shrink-0">
            {user && (
              <div className="relative" id="profile-menu-container">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-xl border smooth-hover cursor-pointer transition-all duration-300 whitespace-nowrap shrink-0 ${
                    isTransparent
                      ? "border-white/20 bg-white/5 hover:bg-white/15 text-white"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800"
                  }`}
                >
                  {/* Avatar Circle */}
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center font-prompt font-semibold text-sm transition-colors duration-300 shrink-0 ${
                    isTransparent ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                  }`}>
                    {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                  </div>
                  <span className="font-prompt text-sm font-medium max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 shrink-0 ${isProfileOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 mt-2.5 w-64 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-slate-100 py-2.5 z-50 overflow-hidden text-slate-800"
                    >
                      {/* Dropdown Header */}
                      <div className="px-4 py-3 border-b border-slate-50">
                        <p className="font-prompt font-semibold text-slate-800 text-[15px] truncate">
                          {user.name}
                        </p>
                        <p className="font-prompt text-slate-400 text-xs truncate mt-0.5">
                          {user.email || "ไม่มีข้อมูลอีเมล"}
                        </p>
                        <div className="mt-2 flex items-center">
                          <span className={`px-2 py-0.5 rounded-md font-prompt text-[10px] font-semibold ${
                            user.role === "admin"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}>
                            {user.role === "admin" ? "ผู้ดูแลระบบ (Admin)" : "สมาชิก (Member)"}
                          </span>
                        </div>
                      </div>

                      {/* Dropdown Items */}
                      <div className="px-1.5 py-1.5 space-y-1">
                        <Link
                          href="/"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-700 hover:text-primary hover:bg-slate-50 font-prompt text-sm font-medium transition-all"
                        >
                          <Home className="h-4 w-4 text-slate-500" />
                          <span>หน้าแรกของฉัน</span>
                        </Link>

                        {user.role === "admin" && (
                          <Link
                            href="/admin"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-700 hover:text-primary hover:bg-slate-50 font-prompt text-sm font-medium transition-all"
                          >
                            <LayoutDashboard className="h-4 w-4 text-slate-500" />
                            <span>จัดการระบบ</span>
                          </Link>
                        )}
                      </div>

                      {/* Dropdown Footer (Logout) */}
                      <div className="px-1.5 pt-1.5 mt-1.5 border-t border-slate-50">
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            handleLogout();
                          }}
                          className="flex items-center space-x-2.5 w-full px-3 py-2 rounded-xl text-secondary hover:text-white hover:bg-secondary font-prompt text-sm font-semibold transition-all cursor-pointer"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>ออกจากระบบ</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <Link
              href="/tours"
              className="shimmer-button bg-linear-to-r from-secondary to-secondary-light hover:from-primary hover:to-primary-light text-white px-5 xl:px-6 py-2.5 rounded-xl font-prompt text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 smooth-hover transition-all duration-300 whitespace-nowrap shrink-0"
            >
              จองทัวร์เลย
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center space-x-3 shrink-0">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "ปิดเมนูนำทาง" : "เปิดเมนูนำทาง"}
              className={`p-2 rounded-lg smooth-hover transition-colors duration-300 ${
                isTransparent 
                  ? "text-white hover:bg-white/10" 
                  : "text-slate-800 hover:bg-slate-100"
              }`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="xl:hidden bg-white/95 backdrop-blur-md shadow-xl rounded-[20px] sm:rounded-[24px] border border-slate-200/50 overflow-hidden mt-2.5"
          >
            <div className="px-4 pt-2 pb-6 space-y-1 sm:px-6">
              {navLinks.map((link) => {
                const isActive = isLinkActive(link);
                
                if (link.subLinks) {
                  const isTours = link.path === "/tours";
                  const isMobileOpen = isTours ? isMobileToursOpen : isMobileServicesOpen;
                  const setIsMobileOpen = isTours ? setIsMobileToursOpen : setIsMobileServicesOpen;
                  
                  return (
                    <div key={link.name} className="block">
                      <button
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        className={`flex items-center justify-between w-full px-4 py-3 rounded-lg font-prompt text-base font-medium smooth-hover transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "text-primary bg-primary/5 font-semibold"
                            : "text-slate-950 hover:text-primary hover:bg-slate-50"
                        }`}
                      >
                        <span>{link.name}</span>
                        <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isMobileOpen ? "rotate-180" : ""}`} />
                      </button>
                      
                      <AnimatePresence>
                        {isMobileOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden pl-4 pr-2 py-1 space-y-1 bg-slate-50/50 rounded-lg mt-1"
                          >
                            {link.subLinks.map((sub) => {
                              const isSubActive = isSubLinkActive(sub.path);
                              return (
                                <Link
                                  key={sub.name}
                                  href={sub.path}
                                  onClick={() => setIsOpen(false)}
                                  className={`block px-4 py-2 rounded-md font-prompt text-[15px] font-medium smooth-hover ${
                                    isSubActive
                                      ? "text-primary bg-primary/10 font-semibold"
                                      : "text-slate-700 hover:text-primary hover:bg-slate-50"
                                  }`}
                                >
                                  {sub.name}
                                </Link>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.name}
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-lg font-prompt text-base font-medium smooth-hover transition-all duration-200 ${
                      isActive
                        ? "text-primary bg-primary/5 font-semibold"
                        : "text-slate-950 hover:text-primary hover:bg-slate-50"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              <div className="border-t border-slate-100 pt-4 mt-4 space-y-3">
                {user && (
                  <div className="space-y-3 px-4">
                    <div className="flex items-center space-x-2 text-text-base font-prompt text-sm border-b border-slate-100 pb-2">
                      <User className="h-4 w-4 text-primary" />
                      <span className="font-semibold">{user.name} ({user.role === 'admin' ? 'ผู้ดูแล' : 'สมาชิก'})</span>
                    </div>

                    <Link
                      href="/"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 w-full px-4 py-2.5 rounded-lg border border-slate-100 bg-slate-50 text-slate-700 text-sm font-prompt font-medium hover:text-primary smooth-hover"
                    >
                      <Home className="h-4 w-4 text-slate-500" />
                      <span>หน้าแรกของฉัน</span>
                    </Link>

                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-2 w-full px-4 py-2.5 rounded-lg border border-primary/20 bg-primary-light/5 text-primary text-sm font-prompt font-medium hover:bg-primary-light/10 smooth-hover"
                      >
                        <LayoutDashboard className="h-4 w-4 text-primary" />
                        <span>จัดการระบบ</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2.5 rounded-lg text-secondary border border-secondary/20 bg-secondary/5 text-sm font-prompt font-semibold hover:bg-secondary hover:text-white smooth-hover cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>ออกจากระบบ</span>
                    </button>
                  </div>
                )}
                
                <Link
                  href="/tours"
                  onClick={() => setIsOpen(false)}
                  className="shimmer-button block text-center w-full bg-secondary hover:bg-primary text-white px-4 py-3 rounded-xl font-prompt text-sm font-semibold shadow-xs smooth-hover transition-all duration-300"
                >
                  จองทัวร์เลย
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const bannerPages = ["/", "/about", "/services", "/contact"];
  const isBannerPage = bannerPages.includes(pathname) || pathname.startsWith("/services/");
  
  const fallbackClass = isBannerPage
    ? "fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/10 h-20"
    : "fixed top-0 left-0 w-full z-50 bg-white shadow-lg h-20";

  return (
    <Suspense fallback={<header className={fallbackClass} />}>
      <NavbarContent />
    </Suspense>
  );
}
