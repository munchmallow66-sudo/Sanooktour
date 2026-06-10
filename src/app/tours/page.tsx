"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, MapPin, Grid, List, RefreshCw, ChevronLeft, ChevronRight, Calendar, Users, SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TourCard from "@/components/TourCard";
import { GridSkeleton, TableSkeleton } from "@/components/SkeletonLoader";
import { Tour } from "@/lib/mockData";
import Link from "next/link";

function ToursSearchAndList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse URL search parameters
  const urlSearch = searchParams.get("search") || "";
  const urlCountry = searchParams.get("country") || "";
  const urlMaxPrice = searchParams.get("maxPrice") || "";
  const urlIsDomestic = searchParams.get("isDomestic") || "";

  // State
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Filter states
  const [search, setSearch] = useState(urlSearch);
  const [country, setCountry] = useState(urlCountry);
  const [maxPrice, setMaxPrice] = useState(urlMaxPrice);
  const [isDomestic, setIsDomestic] = useState(urlIsDomestic);
  const [sortBy, setSortBy] = useState("latest");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Sync state with URL search params when they change
  useEffect(() => {
    setSearch(urlSearch);
    setCountry(urlCountry);
    setMaxPrice(urlMaxPrice);
    setIsDomestic(urlIsDomestic);
    setCurrentPage(1);
  }, [urlSearch, urlCountry, urlMaxPrice, urlIsDomestic]);

  // Fetch tours from API
  const fetchTours = async () => {
    setLoading(true);
    try {
      let query = "/api/tours?";
      const params: string[] = [];
      
      if (search) params.push(`search=${encodeURIComponent(search)}`);
      if (country) params.push(`country=${encodeURIComponent(country)}`);
      if (maxPrice) params.push(`maxPrice=${maxPrice}`);
      if (isDomestic) params.push(`isDomestic=${isDomestic}`);
      if (sortBy) params.push(`sortBy=${sortBy}`);

      query += params.join("&");
      const res = await fetch(query);
      const data = await res.json();
      setTours(data);
    } catch (error) {
      console.error("Error fetching tours:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, [urlSearch, urlCountry, urlMaxPrice, urlIsDomestic, sortBy]);

  // Handle Search submit
  const handleApplyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (country) params.set("country", country);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (isDomestic) params.set("isDomestic", isDomestic);
    
    router.push(`/tours?${params.toString()}`);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearch("");
    setCountry("");
    setMaxPrice("");
    setIsDomestic("");
    setSortBy("latest");
    router.push("/tours");
  };

  // Pagination calculation
  const totalPages = Math.ceil(tours.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTours = tours.slice(indexOfFirstItem, indexOfLastItem);

  // Helper formats
  const formatPrice = (val: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDateRange = (dep: string, ret: string) => {
    const d1 = new Date(dep);
    const d2 = new Date(ret);
    return `${d1.toLocaleDateString("th-TH", { day: "numeric", month: "short" })} - ${d2.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "2-digit" })}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10 space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-prompt text-sm font-semibold text-primary">SANOOK ON TOUR PACKAGES</span>
          <h1 className="font-kanit font-extrabold text-3xl sm:text-4xl text-slate-800 mt-1">
            ค้นหาแพ็กเกจท่องเที่ยว
          </h1>
          <p className="font-prompt text-slate-500 mt-1.5">
            พบทริปดีๆ {tours.length} รายการ ที่ตอบโจทย์การเดินทางของคุณ
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-3 bg-white p-1.5 border border-slate-100 rounded-2xl shadow-xs self-start md:self-end">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-xl smooth-hover flex items-center gap-1.5 font-prompt text-sm font-semibold ${
              viewMode === "grid" ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-50"
            }`}
            title="แสดงแบบการ์ด"
          >
            <Grid className="h-4.5 w-4.5" />
            <span className="hidden sm:inline">การ์ด</span>
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded-xl smooth-hover flex items-center gap-1.5 font-prompt text-sm font-semibold ${
              viewMode === "table" ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-50"
            }`}
            title="แสดงแบบตาราง"
          >
            <List className="h-4.5 w-4.5" />
            <span className="hidden sm:inline">ตารางโปรแกรม</span>
          </button>
        </div>
      </div>

      {/* Filter panel */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <form onSubmit={handleApplyFilters} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Keyword Search */}
          <div className="flex flex-col space-y-1.5">
            <label className="font-prompt text-xs font-semibold text-slate-400">ค้นหาโปรแกรม</label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ชื่อทัวร์, ไฮไลท์, CODE..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary font-prompt text-sm outline-hidden"
              />
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* Country Selector */}
          <div className="flex flex-col space-y-1.5">
            <label className="font-prompt text-xs font-semibold text-slate-400">ประเทศ</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary font-prompt text-sm outline-hidden cursor-pointer"
            >
              <option value="">ทั้งหมด</option>
              <option value="ญี่ปุ่น">ญี่ปุ่น (Japan)</option>
              <option value="สวิตเซอร์แลนด์">สวิตเซอร์แลนด์ (Switzerland)</option>
              <option value="เกาหลีใต้">เกาหลีใต้ (South Korea)</option>
              <option value="เวียดนาม">เวียดนาม (Vietnam)</option>
              <option value="ไต้หวัน">ไต้หวัน (Taiwan)</option>
              <option value="ไทย">ประเทศไทย (Thailand)</option>
            </select>
          </div>

          {/* Price Selector */}
          <div className="flex flex-col space-y-1.5">
            <label className="font-prompt text-xs font-semibold text-slate-400">งบประมาณสูงสุด</label>
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary font-prompt text-sm outline-hidden cursor-pointer"
            >
              <option value="">ไม่จำกัดราคา</option>
              <option value="10000">ไม่เกิน 10,000 บาท</option>
              <option value="25000">ไม่เกิน 25,000 บาท</option>
              <option value="40000">ไม่เกิน 40,000 บาท</option>
              <option value="90000">ไม่เกิน 90,000 บาท</option>
              <option value="150000">ไม่เกิน 150,000 บาท</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-end gap-3">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-2xl bg-secondary hover:bg-primary text-white font-prompt font-semibold text-sm smooth-hover flex items-center justify-center gap-2 transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer"
            >
              <Search className="h-4 w-4" />
              <span>ค้นหาทริป</span>
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-500 smooth-hover"
              title="ล้างตัวกรอง"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Extra Filters (Sorting & Domestic Toggles) */}
        <div className="flex flex-wrap items-center justify-between border-t border-slate-100 mt-6 pt-5 gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              <span className="font-prompt text-xs font-semibold text-slate-500">ประเภททัวร์:</span>
              <button
                type="button"
                onClick={() => {
                  const val = isDomestic === "" ? "true" : isDomestic === "true" ? "false" : "";
                  setIsDomestic(val);
                  const params = new URLSearchParams(searchParams.toString());
                  if (val) params.set("isDomestic", val);
                  else params.delete("isDomestic");
                  router.push(`/tours?${params.toString()}`);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-prompt font-semibold smooth-hover ${
                  isDomestic === "true"
                    ? "bg-primary text-white"
                    : isDomestic === "false"
                    ? "bg-secondary text-white"
                    : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {isDomestic === "true" ? "เฉพาะในประเทศ" : isDomestic === "false" ? "เฉพาะต่างประเทศ" : "ทั้งหมด"}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="font-prompt text-xs font-semibold text-slate-400 whitespace-nowrap">เรียงลำดับ:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 font-prompt text-xs font-semibold outline-hidden cursor-pointer"
            >
              <option value="latest">ใหม่ล่าสุด</option>
              <option value="priceAsc">ราคาต่ำสุด - สูงสุด</option>
              <option value="priceDesc">ราคาสูงสุด - ต่ำสุด</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Results Listing */}
      {loading ? (
        viewMode === "grid" ? <GridSkeleton count={6} /> : <TableSkeleton count={5} />
      ) : currentTours.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-16 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto">
            <Search className="h-8 w-8" />
          </div>
          <h3 className="font-kanit font-semibold text-xl text-slate-800">ไม่พบข้อมูลโปรแกรมทัวร์</h3>
          <p className="font-prompt text-slate-500 text-sm max-w-sm mx-auto">
            ไม่พบทริปการเดินทางที่ตรงกับเงื่อนไขการค้นหาของคุณ ลองล้างฟิลเตอร์หรือเปลี่ยนคีย์เวิร์ดดูใหม่อีกครั้ง
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 bg-primary text-white rounded-xl font-prompt text-xs font-semibold shadow-xs hover:shadow-md smooth-hover"
          >
            แสดงทัวร์ทั้งหมด
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      ) : (
        /* TOUR TABLE VIEW (Specified Real Travel Agency style) */
        <div className="overflow-x-auto bg-white rounded-[30px] border border-slate-100 shadow-[0_5px_15px_rgba(0,0,0,0.12)]">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-primary text-white font-prompt">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">ประเทศ</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">CODE</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">ชื่อโปรแกรมทัวร์</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">ช่วงเวลาเดินทาง</th>
                <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider">ราคาเริ่มต้น</th>
                <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">ที่นั่งคงเหลือ</th>
                <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">รายละเอียด</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100 font-prompt text-sm text-slate-600">
              {currentTours.map((tour) => (
                <tr key={tour.id} className="hover:bg-slate-50/50 smooth-hover">
                  {/* ประเทศ */}
                  <td className="px-6 py-4.5 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary-light/10 text-primary">
                      {tour.country}
                    </span>
                  </td>
                  {/* CODE */}
                  <td className="px-6 py-4.5 whitespace-nowrap font-mono text-xs font-bold text-slate-900">
                    {tour.code}
                  </td>
                  {/* ชื่อโปรแกรม */}
                  <td className="px-6 py-4.5 min-w-[300px] max-w-[400px]">
                    <Link 
                      href={`/tours/${tour.id}`}
                      className="font-semibold text-slate-800 hover:text-primary line-clamp-1 smooth-hover"
                    >
                      {tour.title}
                    </Link>
                    {tour.is_promotion && (
                      <span className="inline-block bg-rose-100 text-rose-600 text-[10px] px-1.5 py-0.5 rounded-sm font-semibold mt-1">
                        PROMO
                      </span>
                    )}
                  </td>
                  {/* ช่วงการเดินทาง */}
                  <td className="px-6 py-4.5 whitespace-nowrap text-slate-500 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{formatDateRange(tour.departure_date, tour.return_date)}</span>
                    </div>
                  </td>
                  {/* ราคา */}
                  <td className="px-6 py-4.5 whitespace-nowrap text-right font-kanit font-bold text-slate-950 text-base">
                    {formatPrice(tour.price)}
                  </td>
                  {/* ที่นั่งคงเหลือ */}
                  <td className="px-6 py-4.5 whitespace-nowrap text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                        tour.available_seats <= 5 
                          ? 'bg-rose-100 text-rose-600' 
                          : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        <Users className="h-3 w-3" />
                        {tour.available_seats} ที่นั่ง
                      </span>
                    </div>
                  </td>
                  {/* ปุ่มดูรายละเอียด */}
                  <td className="px-6 py-4.5 whitespace-nowrap text-center">
                    <Link
                      href={`/tours/${tour.id}`}
                      className="inline-flex items-center justify-center px-4.5 py-1.5 border border-secondary text-secondary hover:bg-secondary hover:text-white font-semibold text-xs rounded-full smooth-hover transition-all duration-300 shadow-xs"
                    >
                      ดูข้อมูล
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination controls */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 pt-6">
          <p className="font-prompt text-xs text-slate-500">
            แสดงหน้า {currentPage} จาก {totalPages} หน้า (ทั้งหมด {tours.length} โปรแกรม)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent smooth-hover"
            >
              <ChevronLeft className="h-4.5 w-4.5" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-9.5 h-9.5 rounded-xl font-prompt text-xs font-bold smooth-hover ${
                  currentPage === i + 1
                    ? "bg-primary text-white"
                    : "border border-slate-200 hover:bg-slate-50 text-slate-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent smooth-hover"
            >
              <ChevronRight className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ToursPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center font-prompt text-slate-500">
          <RefreshCw className="animate-spin h-8 w-8 mx-auto text-primary mb-3" />
          กำลังโหลดแพ็กเกจทัวร์...
        </div>
      }>
        <ToursSearchAndList />
      </Suspense>
      <Footer />
    </>
  );
}
