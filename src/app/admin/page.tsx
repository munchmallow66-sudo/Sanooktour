"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, Map, CalendarRange, Users2, DollarSign, Plus, 
  Trash2, Edit3, ShieldAlert, Check, X, RefreshCw, Upload, LogOut, Link2, Star 
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tour, Booking } from "@/lib/mockData";

export default function AdminDashboard() {
  const router = useRouter();
  
  // Auth state
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  
  // Admin tabs
  const [activeTab, setActiveTab] = useState<"overview" | "tours" | "bookings" | "services" | "reviews">("overview");

  // Database states
  const [tours, setTours] = useState<Tour[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states (Add/Edit Tour)
  const [editingTourId, setEditingTourId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [country, setCountry] = useState("ญี่ปุ่น");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(29900);
  const [seats, setSeats] = useState(20);
  const [depDate, setDepDate] = useState("2026-10-15");
  const [retDate, setRetDate] = useState("2026-10-20");
  const [thumbnail, setThumbnail] = useState("");
  const [isDomestic, setIsDomestic] = useState(false);
  const [isRecommended, setIsRecommended] = useState(false);
  const [isPromotion, setIsPromotion] = useState(false);
  
  // New CMS fields
  const [airline, setAirline] = useState("");
  const [transportType, setTransportType] = useState("plane");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryInput, setGalleryInput] = useState("");
  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  
  // Array lists
  const [highlightInput, setHighlightInput] = useState("");
  const [highlights, setHighlights] = useState<string[]>([]);
  const [includedInput, setIncludedInput] = useState("");
  const [included, setIncluded] = useState<string[]>([]);
  const [excludedInput, setExcludedInput] = useState("");
  const [excluded, setExcluded] = useState<string[]>([]);
  
  // Dynamic Itinerary days
  const [itinerary, setItinerary] = useState<{ day: number; title: string; description: string }[]>([
    { day: 1, title: "กรุงเทพฯ - ปลายทาง", description: "ออกเดินทางจากกรุงเทพฯ ถึงปลายทาง เข้าเช็คอินที่พัก" }
  ]);

  // Image upload
  const [uploadingImage, setUploadingImage] = useState(false);

  // Service states
  const [services, setServices] = useState<any[]>([]);
  const [servicesDetailed, setServicesDetailed] = useState<any>({});
  const [editingServiceSlug, setEditingServiceSlug] = useState<string | null>(null);
  const [showServiceForm, setShowServiceForm] = useState(false);

  // Service form states
  const [sSlug, setSSlug] = useState("");
  const [sTitle, setSTitle] = useState("");
  const [sSubtitle, setSSubtitle] = useState("");
  const [sDesc, setSDesc] = useState("");
  const [sBgImage, setSBgImage] = useState("");
  const [sIconName, setSIconName] = useState("Compass");
  const [sPlaceholder, setSPlaceholder] = useState("");

  // Lists in services
  const [highlightServiceInput, setHighlightServiceInput] = useState("");
  const [sHighlights, setSHighlights] = useState<string[]>([]);
  const [benefitServiceInput, setBenefitServiceInput] = useState("");
  const [sBenefits, setSBenefits] = useState<string[]>([]);
  
  // Preview images list (New feature requested!)
  const [previewImageInput, setPreviewImageInput] = useState("");
  const [sPreviewImages, setSPreviewImages] = useState<string[]>([]);
  const [uploadingPreviewImage, setUploadingPreviewImage] = useState(false);

  // Check admin auth status
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setIsAdmin(false);
      router.push("/login");
      return;
    }
    try {
      const parsed = JSON.parse(storedUser);
      if (parsed.role === "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        router.push("/login");
      }
    } catch (e) {
      setIsAdmin(false);
      router.push("/login");
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch tours
      const toursRes = await fetch("/api/tours");
      const toursData = await toursRes.json();
      setTours(toursData);

      // Fetch bookings
      const bookingsRes = await fetch("/api/bookings");
      const bookingsData = await bookingsRes.json();
      setBookings(bookingsData);

      // Fetch reviews
      setLoadingReviews(true);
      const reviewsRes = await fetch("/api/reviews");
      const reviewsData = await reviewsRes.json();
      setAllReviews(reviewsData);
      setLoadingReviews(false);
    } catch (error) {
      console.error(error);
      toast.error("ไม่สามารถเชื่อมต่อฐานข้อมูลได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
      loadServicesFromStorage();
    }
  }, [isAdmin]);

  // Handle tour delete
  const handleDeleteTour = async (id: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบแพ็กเกจทัวร์นี้อย่างถาวร?")) return;

    try {
      const res = await fetch(`/api/tours/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("ลบแพ็กเกจทัวร์สำเร็จ!");
        loadData();
      } else {
        toast.error("ลบข้อมูลไม่สำเร็จ");
      }
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดในการทำรายการ");
    }
  };

  // Handle image upload to API (Cloudinary fallback)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("country", country);

    setUploadingImage(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setThumbnail(data.url);
        toast.success(data.mocked ? "อัปโหลดสำเร็จ (จำลองรูปตามประเทศ)" : "อัปโหลดรูปภาพสำเร็จ!");
      } else {
        toast.error(data.error || "อัปโหลดไม่สำเร็จ");
      }
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่ออัปโหลด");
    } finally {
      setUploadingImage(false);
    }
  };

  // Add Dynamic Day to Itinerary
  const addItineraryDay = () => {
    setItinerary(prev => [
      ...prev,
      { day: prev.length + 1, title: `เดินทางท่องเที่ยววันที่ ${prev.length + 1}`, description: "รายละเอียดท่องเที่ยวในวันนี้..." }
    ]);
  };

  // Remove Dynamic Day from Itinerary
  const removeItineraryDay = (dayNum: number) => {
    if (itinerary.length <= 1) return;
    const filtered = itinerary.filter(day => day.day !== dayNum);
    // Re-index days
    const reindexed = filtered.map((day, idx) => ({ ...day, day: idx + 1 }));
    setItinerary(reindexed);
  };

  // Save Tour package (Create or Update)
  const handleSaveTour = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !code || !country || !thumbnail) {
      toast.error("กรุณากรอกหัวข้อ รหัสทริป ประเทศ และอัปโหลดภาพประกอบ");
      return;
    }

    const payload = {
      title,
      code,
      country,
      description,
      price,
      available_seats: seats,
      departure_date: depDate,
      return_date: retDate,
      thumbnail,
      is_domestic: isDomestic,
      is_recommended: isRecommended,
      is_promotion: isPromotion,
      highlights,
      itinerary,
      included,
      excluded,
      airline,
      transport_type: transportType,
      images: galleryImages
    };

    try {
      let res;
      if (editingTourId) {
        // Edit mode
        res = await fetch(`/api/tours/${editingTourId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        // Create mode
        res = await fetch("/api/tours", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        toast.success(editingTourId ? "แก้ไขโปรแกรมทัวร์สำเร็จ!" : "เพิ่มโปรแกรมทัวร์ใหม่สำเร็จ!");
        resetForm();
        loadData();
      } else {
        const data = await res.json();
        toast.error(data.error || "บันทึกข้อมูลไม่สำเร็จ");
      }
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const handleEditClick = async (tour: Tour) => {
    setEditingTourId(tour.id);
    setTitle(tour.title);
    setCode(tour.code);
    setCountry(tour.country);
    setDescription(tour.description);
    setPrice(tour.price);
    setSeats(tour.available_seats);
    setDepDate(tour.departure_date);
    setRetDate(tour.return_date);
    setThumbnail(tour.thumbnail);
    setIsDomestic(tour.is_domestic);
    setIsRecommended(tour.is_recommended);
    setIsPromotion(tour.is_promotion);
    setHighlights(tour.highlights || []);
    setIncluded(tour.included || []);
    setExcluded(tour.excluded || []);
    setItinerary(tour.itinerary || []);
    setAirline(tour.airline || "");
    setTransportType(tour.transport_type || "plane");
    setGalleryImages([]);
    setGalleryInput("");
    setShowAddForm(true);

    try {
      const res = await fetch(`/api/tours/${tour.id}`);
      if (res.ok) {
        const fullData = await res.json();
        setGalleryImages(fullData.images || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const resetForm = () => {
    setEditingTourId(null);
    setShowAddForm(false);
    setTitle("");
    setCode("");
    setCountry("ญี่ปุ่น");
    setDescription("");
    setPrice(29900);
    setSeats(20);
    setDepDate("2026-10-15");
    setRetDate("2026-10-20");
    setThumbnail("");
    setIsDomestic(false);
    setIsRecommended(false);
    setIsPromotion(false);
    setHighlights([]);
    setIncluded([]);
    setExcluded([]);
    setItinerary([
      { day: 1, title: "กรุงเทพฯ - ปลายทาง", description: "ออกเดินทางจากกรุงเทพฯ ถึงปลายทาง เข้าเช็คอินที่พัก" }
    ]);
    setAirline("");
    setTransportType("plane");
    setGalleryImages([]);
    setGalleryInput("");
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบความคิดเห็นนี้อย่างถาวร?")) return;

    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("ลบรีวิวเรียบร้อยแล้ว!");
        loadData();
      } else {
        const data = await res.json();
        toast.error(data.error || "ลบข้อมูลไม่สำเร็จ");
      }
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดในการทำรายการ");
    }
  };

  // Handle booking status updates
  const handleUpdateBooking = async (id: string, status: 'confirmed' | 'cancelled') => {
    try {
      const res = await fetch("/api/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });

      if (res.ok) {
        toast.success(`อัปเดตสถานะการจองเป็น ${status === 'confirmed' ? 'ยืนยันแล้ว' : 'ยกเลิกแล้ว'} สำเร็จ!`);
        loadData();
      } else {
        toast.error("อัปเดตไม่สำเร็จ");
      }
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดในการทำรายการ");
    }
  };

  const loadServicesFromStorage = () => {
    const storedList = localStorage.getItem("services_list");
    const storedData = localStorage.getItem("services_data");
    
    const defaultList = [
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

    const defaultDetailed = {
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
        placeholderName: "เช่น ทริปครอบครัวเที่ยวญี่ปุ่น 6 ท่าน",
        previewImages: [
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
          "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=400&q=80",
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
        ]
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
        placeholderName: "เช่น ท่องเที่ยวประจำปีพนักงานบริษัท 80 ท่าน",
        previewImages: [
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80",
          "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=400&q=80",
          "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=400&q=80"
        ]
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
        placeholderName: "เช่น งานเปิดตัวสินค้าใหม่ พนักงาน 200 ท่าน ณ กรุงเทพฯ",
        previewImages: [
          "/event_service_banner.png"
        ]
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
        placeholderName: "เช่น ทัวร์ไหว้พระ 9 วัด จังหวัดอยุธยา ผู้เดินทาง 15 ท่าน",
        previewImages: [
          "/merit_tour_banner.png"
        ]
      }
    };

    if (storedList) {
      setServices(JSON.parse(storedList));
    } else {
      localStorage.setItem("services_list", JSON.stringify(defaultList));
      setServices(defaultList);
    }

    if (storedData) {
      setServicesDetailed(JSON.parse(storedData));
    } else {
      localStorage.setItem("services_data", JSON.stringify(defaultDetailed));
      setServicesDetailed(defaultDetailed);
    }
  };

  const resetServiceForm = () => {
    setEditingServiceSlug(null);
    setShowServiceForm(false);
    setSSlug("");
    setSTitle("");
    setSSubtitle("");
    setSDesc("");
    setSBgImage("");
    setSIconName("Compass");
    setSPlaceholder("");
    setSHighlights([]);
    setSBenefits([]);
    setSPreviewImages([]);
    setHighlightServiceInput("");
    setBenefitServiceInput("");
    setPreviewImageInput("");
  };

  const handleEditServiceClick = (service: any) => {
    const detailed = servicesDetailed[service.slug] || {};
    setEditingServiceSlug(service.slug);
    setSSlug(service.slug);
    setSTitle(service.title);
    setSSubtitle(detailed.subtitle || "");
    setSDesc(service.desc || detailed.desc || "");
    setSBgImage(detailed.bgImage || service.image || "");
    setSIconName(service.iconName || "Compass");
    setSPlaceholder(detailed.placeholderName || "");
    setSHighlights(detailed.highlights || []);
    setSBenefits(detailed.benefits || []);
    setSPreviewImages(detailed.previewImages || []);
    setShowServiceForm(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();

    if (!sTitle || !sSlug || !sBgImage) {
      toast.error("กรุณากรอกชื่อบริการ รหัสอ้างอิง (Slug) และรูปภาพหน้าปกหลัก");
      return;
    }

    const listPayload = {
      slug: sSlug.trim().toLowerCase(),
      title: sTitle,
      desc: sDesc || sSubtitle,
      iconName: sIconName,
      image: sBgImage
    };

    const detailedPayload = {
      title: sTitle,
      subtitle: sSubtitle || sTitle,
      desc: sDesc || sSubtitle,
      bgImage: sBgImage,
      benefits: sBenefits,
      highlights: sHighlights,
      placeholderName: sPlaceholder || "เช่น ข้อมูลเพิ่มเติม...",
      previewImages: sPreviewImages
    };

    let updatedList = [...services];
    let updatedDetailed = { ...servicesDetailed };

    if (editingServiceSlug) {
      if (editingServiceSlug !== listPayload.slug) {
        updatedList = updatedList.filter(s => s.slug !== editingServiceSlug);
        delete updatedDetailed[editingServiceSlug];
      }
      
      const existingIdx = updatedList.findIndex(s => s.slug === listPayload.slug);
      if (existingIdx >= 0) {
        updatedList[existingIdx] = listPayload;
      } else {
        updatedList.push(listPayload);
      }
    } else {
      if (updatedDetailed[listPayload.slug]) {
        toast.error("รหัสอ้างอิงบริการ (Slug) นี้มีอยู่ในระบบแล้ว");
        return;
      }
      updatedList.push(listPayload);
    }

    updatedDetailed[listPayload.slug] = detailedPayload;

    localStorage.setItem("services_list", JSON.stringify(updatedList));
    localStorage.setItem("services_data", JSON.stringify(updatedDetailed));
    setServices(updatedList);
    setServicesDetailed(updatedDetailed);

    toast.success(editingServiceSlug ? "แก้ไขข้อมูลบริการสำเร็จ!" : "สร้างบริการใหม่สำเร็จ!");
    resetServiceForm();
  };

  const handleDeleteService = (slug: string) => {
    if (!confirm(`คุณแน่ใจหรือไม่ที่จะลบบริการ "${slug}" นี้อย่างถาวร?`)) return;

    const updatedList = services.filter(s => s.slug !== slug);
    const updatedDetailed = { ...servicesDetailed };
    delete updatedDetailed[slug];

    localStorage.setItem("services_list", JSON.stringify(updatedList));
    localStorage.setItem("services_data", JSON.stringify(updatedDetailed));
    setServices(updatedList);
    setServicesDetailed(updatedDetailed);

    toast.success("ลบบริการสำเร็จ!");
  };

  const handlePreviewImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("country", "thailand");

    setUploadingPreviewImage(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setSPreviewImages(prev => [...prev, data.url]);
        toast.success("อัปโหลดรูปภาพตัวอย่างสำเร็จ!");
      } else {
        toast.error(data.error || "อัปโหลดไม่สำเร็จ");
      }
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่ออัปโหลด");
    } finally {
      setUploadingPreviewImage(false);
    }
  };

  // Statistics calculation
  const totalSales = bookings
    .filter(b => b.status === "confirmed")
    .reduce((acc, b) => acc + Number(b.total_price), 0);
  
  const pendingBookings = bookings.filter(b => b.status === "pending").length;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      maximumFractionDigits: 0
    }).format(val);
  };

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center font-prompt text-slate-500">
        ตรวจสอบสิทธิ์ผู้ดูแลระบบ...
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-prompt text-center p-6">
        <div className="max-w-sm bg-white p-8 rounded-3xl border border-slate-100 shadow-md space-y-4">
          <ShieldAlert className="h-12 w-12 text-rose-500 mx-auto" />
          <h2 className="font-kanit font-bold text-xl text-slate-800">ไม่มีสิทธิ์การเข้าถึง</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            พื้นที่นี้เฉพาะผู้ดูแลระบบที่มีสิทธิ์จัดการเท่านั้น กรุณาเข้าสู่ระบบในฐานะ Admin
          </p>
          <Link href="/login" className="block w-full py-2 bg-primary text-white rounded-xl text-sm font-semibold">
            ไปที่หน้าเข้าสู่ระบบ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 font-prompt min-h-screen pb-20">
        
        {/* Header Banner */}
        <div className="bg-slate-900 text-white pt-28 pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <span className="text-primary text-xs font-bold uppercase tracking-wider">ระบบจัดการเว็บบอร์ด (CMS)</span>
              <h1 className="font-kanit font-bold text-2xl sm:text-3xl flex items-center gap-2">
                <LayoutDashboard className="h-7 w-7 text-primary" /> Admin Control Dashboard
              </h1>
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem("user");
                router.push("/login");
                router.refresh();
              }}
              className="px-4 py-2 border border-slate-700 bg-slate-800 hover:bg-rose-950 text-rose-400 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-2 smooth-hover"
            >
              <LogOut className="h-4 w-4" /> ออกจากระบบแอดมิน
            </button>
          </div>
        </div>

        {/* Content wrapper */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* SIDEBAR TABS MENU */}
          <div className="lg:col-span-1 bg-white rounded-3xl p-5 border border-slate-100 shadow-xs h-fit space-y-2">
            <button
              onClick={() => { setActiveTab("overview"); resetForm(); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 smooth-hover ${
                activeTab === "overview" ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <LayoutDashboard className="h-4.5 w-4.5" />
              <span>ภาพรวมและสถิติ</span>
            </button>
            <button
              onClick={() => { setActiveTab("tours"); resetServiceForm(); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 smooth-hover ${
                activeTab === "tours" ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Map className="h-4.5 w-4.5" />
              <span>จัดการทัวร์ ({tours.length})</span>
            </button>
            <button
              onClick={() => { setActiveTab("services"); resetForm(); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 smooth-hover ${
                activeTab === "services" ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Users2 className="h-4.5 w-4.5" />
              <span>จัดการบริการ ({services.length})</span>
            </button>
            <button
              onClick={() => { setActiveTab("bookings"); resetForm(); resetServiceForm(); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 smooth-hover ${
                activeTab === "bookings" ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <CalendarRange className="h-4.5 w-4.5" />
              <span>จัดการรายการจอง ({bookings.length})</span>
              {pendingBookings > 0 && (
                <span className="ml-auto w-5 h-5 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {pendingBookings}
                </span>
              )}
            </button>
            <button
              onClick={() => { setActiveTab("reviews"); resetForm(); resetServiceForm(); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 smooth-hover ${
                activeTab === "reviews" ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Star className={`h-4.5 w-4.5 ${activeTab === "reviews" ? "text-white" : "text-slate-500"}`} />
              <span>จัดการรีวิว ({allReviews.length})</span>
            </button>

            <div className="border-t border-slate-100 pt-4 mt-4 text-center">
              <button 
                onClick={loadData}
                className="text-xs text-slate-400 hover:text-primary flex items-center gap-1.5 justify-center mx-auto"
              >
                <RefreshCw className="h-3.5 w-3.5" /> รีเฟรชฐานข้อมูล
              </button>
            </div>
          </div>

          {/* MAIN TAB CONTENT */}
          <div className="lg:col-span-3 space-y-8">
            {loading ? (
              <div className="bg-white rounded-3xl p-16 border border-slate-100 shadow-xs text-center font-prompt text-slate-400 flex flex-col items-center gap-3">
                <RefreshCw className="animate-spin h-8 w-8 text-primary" />
                <span>กำลังประสานงานฐานข้อมูลระบบ...</span>
              </div>
            ) : (
              <>
                
                {/* 1. OVERVIEW TAB */}
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    {/* STATS GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {/* STAT 1: SALES */}
                      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex items-center gap-5">
                        <div className="p-4 bg-emerald-50 text-emerald-500 rounded-2xl">
                          <DollarSign className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-slate-400 font-semibold">รายได้รวมที่อนุมัติแล้ว</p>
                          <p className="font-kanit font-extrabold text-2xl text-slate-800">{formatCurrency(totalSales)}</p>
                        </div>
                      </div>

                      {/* STAT 2: BOOKINGS */}
                      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex items-center gap-5">
                        <div className="p-4 bg-primary-light/20 text-primary rounded-2xl">
                          <CalendarRange className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-slate-400 font-semibold">ยอดผู้จองทั้งหมด</p>
                          <p className="font-kanit font-extrabold text-2xl text-slate-800">{bookings.length} รายการ</p>
                        </div>
                      </div>

                      {/* STAT 3: TOURS COUNT */}
                      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex items-center gap-5">
                        <div className="p-4 bg-amber-50 text-secondary rounded-2xl">
                          <Map className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-slate-400 font-semibold">โปรแกรมทัวร์ทั้งหมด</p>
                          <p className="font-kanit font-extrabold text-2xl text-slate-800">{tours.length} แพ็กเกจ</p>
                        </div>
                      </div>
                    </div>

                    {/* LATEST BOOKINGS SUMMARY LIST */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 space-y-4">
                      <h3 className="font-kanit font-bold text-lg text-slate-800">คำสั่งซื้อ / รายการจองล่าสุด</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100 text-xs text-left">
                          <thead className="bg-slate-50 font-prompt text-slate-500">
                            <tr>
                              <th className="px-4 py-3">ผู้จอง</th>
                              <th className="px-4 py-3">วันเดินทาง</th>
                              <th className="px-4 py-3">จอง (ท่าน)</th>
                              <th className="px-4 py-3 text-right">ยอดชำระ</th>
                              <th className="px-4 py-3 text-center">สถานะ</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-600 font-prompt">
                            {bookings.slice(0, 5).map((book) => {
                              const tourName = tours.find(t => t.id === book.tour_id)?.title || "ทริปที่ไม่มีในระบบ";
                              return (
                                <tr key={book.id} className="hover:bg-slate-50/50">
                                  <td className="px-4 py-3">
                                    <p className="font-semibold text-slate-800">{book.customer_name}</p>
                                    <p className="text-[10px] text-slate-400 truncate max-w-[200px]" title={tourName}>{tourName}</p>
                                  </td>
                                  <td className="px-4 py-3 font-semibold">{book.travel_date}</td>
                                  <td className="px-4 py-3 font-bold text-center">{book.travelers_count}</td>
                                  <td className="px-4 py-3 font-bold text-right text-slate-900">{formatCurrency(book.total_price)}</td>
                                  <td className="px-4 py-3 text-center">
                                    <span className={`inline-block px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                                      book.status === 'confirmed'
                                        ? 'bg-emerald-100 text-emerald-600'
                                        : book.status === 'cancelled'
                                        ? 'bg-rose-100 text-rose-600'
                                        : 'bg-amber-100 text-amber-600'
                                    }`}>
                                      {book.status === 'confirmed' ? 'ยืนยันแล้ว' : book.status === 'cancelled' ? 'ยกเลิก' : 'รอตรวจสอบ'}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                            {bookings.length === 0 && (
                              <tr>
                                <td colSpan={5} className="py-8 text-center text-slate-400">ยังไม่มีรายการจองเข้ามาในระบบ</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. TOURS MANAGEMENT TAB */}
                {activeTab === "tours" && (
                  <div className="space-y-6">
                    {/* BUTTON TO SHOW FORM */}
                    {!showAddForm && (
                      <div className="flex justify-between items-center">
                        <h3 className="font-kanit font-bold text-lg text-slate-800">โปรแกรมแพ็กเกจทัวร์ทั้งหมด</h3>
                        <button
                          onClick={() => { resetForm(); setShowAddForm(true); }}
                          className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-semibold flex items-center gap-2 smooth-hover shadow-xs"
                        >
                          <Plus className="h-4.5 w-4.5" /> เพิ่มแพ็กเกจทัวร์ใหม่
                        </button>
                      </div>
                    )}

                    {/* CMS ADD/EDIT FORM CONTAINER */}
                    {showAddForm && (
                      <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 sm:p-8 space-y-6">
                        <h3 className="font-kanit font-bold text-lg text-slate-800 border-b border-slate-100 pb-3 flex justify-between">
                          <span>{editingTourId ? "📝 แก้ไขรายละเอียดโปรแกรมทัวร์" : "➕ เพิ่มโปรแกรมแพ็กเกจทัวร์ใหม่"}</span>
                          <button onClick={resetForm} className="text-xs text-slate-400 hover:text-slate-700">ยกเลิก</button>
                        </h3>

                        <form onSubmit={handleSaveTour} className="space-y-6 text-sm">
                          {/* Tour Title */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-1">
                              <label className="text-xs font-semibold text-slate-500">ชื่อโปรแกรมทัวร์ (ยาวและอธิบายรายละเอียด) *</label>
                              <input 
                                type="text" 
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="เช่น ทัวร์เกาหลี ฤดูใบไม้ผลิ สุดคุ้ม 5 วัน 3 คืน"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary outline-hidden"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-500">รหัสโปรแกรม (CODE) *</label>
                              <input 
                                type="text" 
                                required
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="เช่น SOT-KR002"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary outline-hidden font-mono uppercase font-bold"
                              />
                            </div>
                          </div>

                          {/* Country, type, prices, seats */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-500">ประเทศเดินทาง *</label>
                              <input 
                                type="text" 
                                required
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                placeholder="เช่น ญี่ปุ่น"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary outline-hidden"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-500">ราคาต่อท่าน (บาท) *</label>
                              <input 
                                type="number" 
                                required
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary outline-hidden"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-500">ที่นั่งจำกัดสูงสุด (ที่) *</label>
                              <input 
                                type="number" 
                                required
                                value={seats}
                                onChange={(e) => setSeats(Number(e.target.value))}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary outline-hidden"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-500">ประเภท</label>
                              <div className="flex gap-4 pt-3.5">
                                <label className="flex items-center gap-1 cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={isDomestic}
                                    onChange={(e) => setIsDomestic(e.target.checked)}
                                    className="rounded border-slate-300 text-primary focus:ring-primary"
                                  />
                                  <span className="text-xs">ในประเทศ</span>
                                </label>
                                <label className="flex items-center gap-1 cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={isRecommended}
                                    onChange={(e) => setIsRecommended(e.target.checked)}
                                    className="rounded border-slate-300 text-primary focus:ring-primary"
                                  />
                                  <span className="text-xs">ทริปแนะนำ</span>
                                </label>
                                <label className="flex items-center gap-1 cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={isPromotion}
                                    onChange={(e) => setIsPromotion(e.target.checked)}
                                    className="rounded border-slate-300 text-primary focus:ring-primary"
                                  />
                                  <span className="text-xs">โปรพิเศษ</span>
                                </label>
                              </div>
                            </div>
                          </div>

                          {/* Airline and Transport Type */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-500">สายการบิน (ถ้ามี)</label>
                              <input 
                                type="text" 
                                value={airline}
                                onChange={(e) => setAirline(e.target.value)}
                                placeholder="เช่น Japan Airlines, Vietnam Airlines"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary outline-hidden"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-500">ประเภทพาหนะหลัก *</label>
                              <select 
                                value={transportType}
                                onChange={(e) => setTransportType(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary outline-hidden bg-white"
                              >
                                <option value="plane">เครื่องบิน (Plane)</option>
                                <option value="bus">รถบัส / รถตู้ (Bus)</option>
                                <option value="ship">เรือ / สปีดโบ๊ท (Ship)</option>
                              </select>
                            </div>
                          </div>

                          {/* Departure dates & description */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-500">วันเดินทางไป *</label>
                              <input 
                                type="date" 
                                required
                                value={depDate}
                                onChange={(e) => setDepDate(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary outline-hidden"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-500">วันเดินทางกลับ *</label>
                              <input 
                                type="date" 
                                required
                                value={retDate}
                                onChange={(e) => setRetDate(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary outline-hidden"
                              />
                            </div>

                            {/* Image upload (Real API upload) */}
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-500">อัปโหลดภาพทริป (Cloudinary) *</label>
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={thumbnail}
                                  onChange={(e) => setThumbnail(e.target.value)}
                                  placeholder="ลิ้งก์รูปภาพ..."
                                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:border-primary outline-hidden text-xs"
                                />
                                <div className="relative">
                                  <input 
                                    type="file" 
                                    id="admin-image-upload" 
                                    onChange={handleImageUpload}
                                    className="hidden" 
                                    accept="image/*"
                                  />
                                  <label 
                                    htmlFor="admin-image-upload"
                                    className="p-2.5 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-primary smooth-hover cursor-pointer"
                                    title="เลือกไฟล์และอัปโหลด"
                                  >
                                    {uploadingImage ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500">คำอธิบายภาพรวมทริป</label>
                            <textarea 
                              rows={3}
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              placeholder="ภาพรวมทริปที่จะแสดงบนการ์ดและหน้าจอหลัก..."
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary outline-hidden"
                            />
                          </div>

                          {/* Gallery Images Management */}
                          <div className="space-y-2 bg-slate-50 p-5 rounded-3xl border border-slate-100">
                            <label className="text-xs font-bold text-slate-700">รูปภาพแกลเลอรีเพิ่มเติม (แสดงในหน้ารายละเอียดทัวร์)</label>
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                value={galleryInput}
                                onChange={(e) => setGalleryInput(e.target.value)}
                                placeholder="ป้อนที่อยู่ลิงก์รูปภาพ..."
                                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:border-primary outline-hidden text-xs bg-white"
                              />
                              <div className="relative">
                                <input 
                                  type="file" 
                                  id="admin-gallery-image-upload" 
                                  onChange={async (e) => {
                                    const files = e.target.files;
                                    if (!files || files.length === 0) return;
                                    const file = files[0];
                                    const formData = new FormData();
                                    formData.append("file", file);
                                    formData.append("country", country);
                                    
                                    toast.loading("กำลังอัปโหลดรูปแกลเลอรี...", { id: "gallery-upload" });
                                    try {
                                      const res = await fetch("/api/upload", { method: "POST", body: formData });
                                      const data = await res.json();
                                      if (res.ok && data.url) {
                                        setGalleryImages(prev => [...prev, data.url]);
                                        toast.success("อัปโหลดรูปแกลเลอรีสำเร็จ!", { id: "gallery-upload" });
                                      } else {
                                        toast.error(data.error || "อัปโหลดไม่สำเร็จ", { id: "gallery-upload" });
                                      }
                                    } catch (err) {
                                      toast.error("เกิดข้อผิดพลาดในการอัปโหลด", { id: "gallery-upload" });
                                    }
                                  }}
                                  className="hidden" 
                                  accept="image/*"
                                />
                                <label 
                                  htmlFor="admin-gallery-image-upload"
                                  className="px-4 py-2.5 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-primary smooth-hover cursor-pointer text-xs font-semibold gap-1.5"
                                >
                                  <Upload className="h-4 w-4" /> อัปโหลด
                                </label>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  if (galleryInput.trim()) {
                                    setGalleryImages(prev => [...prev, galleryInput.trim()]);
                                    setGalleryInput("");
                                  }
                                }}
                                className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-semibold"
                              >
                                เพิ่ม URL
                              </button>
                            </div>
                            
                            {/* Previews Grid */}
                            {galleryImages.length > 0 && (
                              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-3">
                                {galleryImages.map((url, idx) => (
                                  <div key={url + idx} className="relative h-20 rounded-xl overflow-hidden border border-slate-200 group">
                                    <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => setGalleryImages(prev => prev.filter((_, i) => i !== idx))}
                                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400 font-bold transition-opacity text-xs"
                                    >
                                      <Trash2 className="h-4.5 w-4.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Highlights, inclusions, exclusions */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Highlights */}
                            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                              <label className="text-xs font-bold text-slate-700">ไฮไลท์หลัก ({highlights.length})</label>
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={highlightInput}
                                  onChange={(e) => setHighlightInput(e.target.value)}
                                  placeholder="ป้อนไฮไลท์..."
                                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (highlightInput) {
                                      setHighlights(prev => [...prev, highlightInput]);
                                      setHighlightInput("");
                                    }
                                  }}
                                  className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold"
                                >
                                  +
                                </button>
                              </div>
                              <ul className="space-y-1 max-h-32 overflow-y-auto">
                                {highlights.map((h, i) => (
                                  <li key={i} className="flex justify-between items-center text-[10px] text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
                                    <span className="truncate">{h}</span>
                                    <button type="button" onClick={() => setHighlights(prev => prev.filter((_, idx) => idx !== i))} className="text-rose-500 ml-1"><X className="h-3 w-3" /></button>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Included */}
                            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                              <label className="text-xs font-bold text-slate-700">ค่าใช้จ่ายรวม ({included.length})</label>
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={includedInput}
                                  onChange={(e) => setIncludedInput(e.target.value)}
                                  placeholder="ป้อนราคารวม..."
                                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (includedInput) {
                                      setIncluded(prev => [...prev, includedInput]);
                                      setIncludedInput("");
                                    }
                                  }}
                                  className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold"
                                >
                                  +
                                </button>
                              </div>
                              <ul className="space-y-1 max-h-32 overflow-y-auto">
                                {included.map((inc, i) => (
                                  <li key={i} className="flex justify-between items-center text-[10px] text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
                                    <span className="truncate">{inc}</span>
                                    <button type="button" onClick={() => setIncluded(prev => prev.filter((_, idx) => idx !== i))} className="text-rose-500 ml-1"><X className="h-3 w-3" /></button>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Excluded */}
                            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                              <label className="text-xs font-bold text-slate-700">ไม่รวมอะไรบ้าง ({excluded.length})</label>
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={excludedInput}
                                  onChange={(e) => setExcludedInput(e.target.value)}
                                  placeholder="ป้อนสิ่งไม่รวม..."
                                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (excludedInput) {
                                      setExcluded(prev => [...prev, excludedInput]);
                                      setExcludedInput("");
                                    }
                                  }}
                                  className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold"
                                >
                                  +
                                </button>
                              </div>
                              <ul className="space-y-1 max-h-32 overflow-y-auto">
                                {excluded.map((exc, i) => (
                                  <li key={i} className="flex justify-between items-center text-[10px] text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
                                    <span className="truncate">{exc}</span>
                                    <button type="button" onClick={() => setExcluded(prev => prev.filter((_, idx) => idx !== i))} className="text-rose-500 ml-1"><X className="h-3 w-3" /></button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Day-by-day itinerary CMS section */}
                          <div className="space-y-4 bg-slate-50 p-5 rounded-3xl border border-slate-100">
                            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                              <h4 className="font-kanit font-bold text-slate-700 text-sm">กำหนดการเดินทางรายวัน ({itinerary.length} วัน)</h4>
                              <button
                                type="button"
                                onClick={addItineraryDay}
                                className="px-3 py-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
                              >
                                <Plus className="h-3.5 w-3.5" /> เพิ่มวันเดินทาง
                              </button>
                            </div>

                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                              {itinerary.map((day, idx) => (
                                <div key={day.day} className="bg-white p-4 rounded-2xl border border-slate-200 relative space-y-3">
                                  <div className="flex justify-between items-center">
                                    <span className="font-kanit font-bold text-xs text-primary bg-primary-light/10 px-2.5 py-1 rounded-lg">
                                      วันที่ {day.day}
                                    </span>
                                    {itinerary.length > 1 && (
                                      <button 
                                        type="button" 
                                        onClick={() => removeItineraryDay(day.day)}
                                        className="text-rose-500 hover:text-rose-700"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    )}
                                  </div>

                                  <div className="space-y-2">
                                    <input 
                                      type="text" 
                                      required
                                      value={day.title}
                                      onChange={(e) => {
                                        const updated = [...itinerary];
                                        updated[idx].title = e.target.value;
                                        setItinerary(updated);
                                      }}
                                      placeholder="หัวข้อการเดินทางวันนี้..."
                                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-primary outline-hidden font-semibold"
                                    />
                                    <textarea 
                                      rows={2}
                                      required
                                      value={day.description}
                                      onChange={(e) => {
                                        const updated = [...itinerary];
                                        updated[idx].description = e.target.value;
                                        setItinerary(updated);
                                      }}
                                      placeholder="รายละเอียดโปรแกรมการท่องเที่ยวและกิจกรรมของวันนี้..."
                                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-primary outline-hidden"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Submit Actions */}
                          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={resetForm}
                              className="px-6 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-xl text-xs"
                            >
                              ยกเลิกการกรอก
                            </button>
                            <button
                              type="submit"
                              className="px-8 py-2.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl text-xs shadow-xs"
                            >
                              {editingTourId ? "บันทึกการแก้ไขโปรแกรม" : "สร้างและเผยแพร่แพ็กเกจทัวร์"}
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* TOURS LIST GRID FOR ADMIN */}
                    {!showAddForm && (
                      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 space-y-4">
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-slate-100 text-xs text-left">
                            <thead className="bg-slate-50 font-prompt text-slate-500">
                              <tr>
                                <th className="px-4 py-3">รหัส (CODE)</th>
                                <th className="px-4 py-3">ชื่อโปรแกรม</th>
                                <th className="px-4 py-3">ประเทศ</th>
                                <th className="px-4 py-3 text-right">ราคา</th>
                                <th className="px-4 py-3 text-center">ที่นั่งว่าง</th>
                                <th className="px-4 py-3 text-center">จัดการ</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-600 font-prompt">
                              {tours.map((t) => (
                                <tr key={t.id} className="hover:bg-slate-50/50">
                                  <td className="px-4 py-3 font-mono font-bold text-slate-900">{t.code}</td>
                                  <td className="px-4 py-3 font-semibold text-slate-800 max-w-[250px] truncate" title={t.title}>
                                    {t.title}
                                  </td>
                                  <td className="px-4 py-3">{t.country}</td>
                                  <td className="px-4 py-3 text-right font-bold text-slate-900">{formatCurrency(t.price)}</td>
                                  <td className="px-4 py-3 text-center font-semibold text-primary">{t.available_seats} ที่นั่ง</td>
                                  <td className="px-4 py-3 text-center whitespace-nowrap space-x-2">
                                    <button 
                                      onClick={() => handleEditClick(t)}
                                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg smooth-hover" 
                                      title="แก้ไข"
                                    >
                                      <Edit3 className="h-4 w-4" />
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteTour(t.id)}
                                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg smooth-hover" 
                                      title="ลบ"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                    <Link 
                                      href={`/tours/${t.id}`}
                                      className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg inline-block smooth-hover"
                                      title="ดูตัวอย่างจริง"
                                    >
                                      <Link2 className="h-4 w-4" />
                                    </Link>
                                  </td>
                                </tr>
                              ))}
                              {tours.length === 0 && (
                                <tr>
                                  <td colSpan={6} className="py-8 text-center text-slate-400">ยังไม่มีแพ็กเกจทัวร์อยู่ในระบบ</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. BOOKINGS MANAGEMENT TAB */}
                {activeTab === "bookings" && (
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 space-y-4">
                    <h3 className="font-kanit font-bold text-lg text-slate-800">รายการรับจองและใบยืนยัน</h3>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-100 text-xs text-left">
                        <thead className="bg-slate-50 font-prompt text-slate-500">
                          <tr>
                            <th className="px-4 py-3">เลขอ้างอิง / ผู้ติดต่อ</th>
                            <th className="px-4 py-3">เบอร์โทร / อีเมล</th>
                            <th className="px-4 py-3">โปรแกรมทัวร์</th>
                            <th className="px-4 py-3 text-center">จอง (ท่าน)</th>
                            <th className="px-4 py-3 text-right">ยอดรวม</th>
                            <th className="px-4 py-3 text-center">สถานะ</th>
                            <th className="px-4 py-3 text-center">จัดการ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-600 font-prompt">
                          {bookings.map((book) => {
                            const matchingTour = tours.find(t => t.id === book.tour_id);
                            return (
                              <tr key={book.id} className="hover:bg-slate-50/50">
                                <td className="px-4 py-3">
                                  <p className="font-bold text-slate-800 truncate max-w-[120px]" title={book.id}>{book.id}</p>
                                  <p className="font-semibold text-slate-500 pt-0.5">{book.customer_name}</p>
                                </td>
                                <td className="px-4 py-3">
                                  <p>{book.customer_phone}</p>
                                  <p className="text-[10px] text-slate-400">{book.customer_email}</p>
                                </td>
                                <td className="px-4 py-3 max-w-[200px] truncate" title={matchingTour?.title || "ทริปที่ไม่มีในระบบ"}>
                                  <p className="font-semibold text-slate-800">{matchingTour?.title || "ทริปที่ไม่มีในระบบ"}</p>
                                  <p className="text-[10px] text-slate-400 pt-0.5">วันเดินทาง: {book.travel_date}</p>
                                </td>
                                <td className="px-4 py-3 text-center font-bold text-slate-800">{book.travelers_count}</td>
                                <td className="px-4 py-3 text-right font-bold text-slate-900">{formatCurrency(book.total_price)}</td>
                                <td className="px-4 py-3 text-center">
                                  <span className={`inline-block px-2.5 py-0.5 rounded-full font-semibold text-[10px] ${
                                    book.status === 'confirmed'
                                      ? 'bg-emerald-100 text-emerald-600'
                                      : book.status === 'cancelled'
                                      ? 'bg-rose-100 text-rose-600'
                                      : 'bg-amber-100 text-amber-600'
                                  }`}>
                                    {book.status === 'confirmed' ? 'อนุมัติแล้ว' : book.status === 'cancelled' ? 'ยกเลิก' : 'รอตรวจสอบ'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center whitespace-nowrap space-x-1">
                                  {book.status === "pending" && (
                                    <>
                                      <button
                                        onClick={() => handleUpdateBooking(book.id, "confirmed")}
                                        className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md"
                                        title="ยืนยันการจอง"
                                      >
                                        <Check className="h-4.5 w-4.5" />
                                      </button>
                                      <button
                                        onClick={() => handleUpdateBooking(book.id, "cancelled")}
                                        className="p-1 text-rose-600 hover:bg-rose-50 rounded-md"
                                        title="ยกเลิกการจอง"
                                      >
                                        <X className="h-4.5 w-4.5" />
                                      </button>
                                    </>
                                  )}
                                  {book.status !== "pending" && (
                                    <span className="text-[10px] text-slate-400">-</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                          {bookings.length === 0 && (
                            <tr>
                              <td colSpan={7} className="py-8 text-center text-slate-400">ยังไม่มีรายการจองการเดินทางในระบบ</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 5. REVIEWS MODERATION TAB */}
                {activeTab === "reviews" && (
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 space-y-4">
                    <h3 className="font-kanit font-bold text-lg text-slate-800">จัดการรีวิวและความเห็นของลูกค้า</h3>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-100 text-xs text-left">
                        <thead className="bg-slate-50 font-prompt text-slate-500">
                          <tr>
                            <th className="px-4 py-3">ผู้เขียนรีวิว</th>
                            <th className="px-4 py-3">แพ็กเกจทัวร์</th>
                            <th className="px-4 py-3 text-center">คะแนน</th>
                            <th className="px-4 py-3">ความคิดเห็น</th>
                            <th className="px-4 py-3">วันที่เขียน</th>
                            <th className="px-4 py-3 text-center">จัดการ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-600 font-prompt">
                          {allReviews.map((rev) => {
                            const matchingTour = tours.find(t => t.id === rev.tour_id);
                            const tourTitle = matchingTour?.title || "ทริปที่ไม่มีในระบบ";
                            const tourCode = matchingTour?.code || "N/A";
                            return (
                              <tr key={rev.id} className="hover:bg-slate-50/50">
                                <td className="px-4 py-3 font-semibold text-slate-800">{rev.author}</td>
                                <td className="px-4 py-3 max-w-[200px] truncate" title={tourTitle}>
                                  <p className="font-bold text-slate-900">{tourCode}</p>
                                  <p className="text-[10px] text-slate-400 truncate">{tourTitle}</p>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <div className="flex items-center justify-center gap-0.5 text-amber-500">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`h-3 w-3 ${i < rev.rating ? 'fill-amber-500' : 'text-slate-200'}`} 
                                      />
                                    ))}
                                  </div>
                                </td>
                                <td className="px-4 py-3 max-w-xs truncate" title={rev.comment}>{rev.comment}</td>
                                <td className="px-4 py-3 whitespace-nowrap">{new Date(rev.created_at).toLocaleDateString("th-TH")}</td>
                                <td className="px-4 py-3 text-center whitespace-nowrap">
                                  <button
                                    onClick={() => handleDeleteReview(rev.id)}
                                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg smooth-hover"
                                    title="ลบรีวิวนี้"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                          {allReviews.length === 0 && (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-slate-400">ยังไม่มีรีวิวแสดงผลในระบบ</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 4. SERVICES MANAGEMENT TAB */}
                {activeTab === "services" && (
                  <div className="space-y-6">
                    {/* BUTTON TO SHOW FORM */}
                    {!showServiceForm && (
                      <div className="flex justify-between items-center">
                        <h3 className="font-kanit font-bold text-lg text-slate-800">จัดการข้อมูลบริการ</h3>
                        <button
                          onClick={() => { resetServiceForm(); setShowServiceForm(true); }}
                          className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-semibold flex items-center gap-2 smooth-hover shadow-xs"
                        >
                          <Plus className="h-4.5 w-4.5" /> เพิ่มบริการใหม่
                        </button>
                      </div>
                    )}

                    {/* CMS ADD/EDIT SERVICE FORM CONTAINER */}
                    {showServiceForm && (
                      <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 sm:p-8 space-y-6">
                        <h3 className="font-kanit font-bold text-lg text-slate-800 border-b border-slate-100 pb-3 flex justify-between">
                          <span>{editingServiceSlug ? "📝 แก้ไขรายละเอียดบริการ" : "➕ เพิ่มบริการใหม่"}</span>
                          <button onClick={resetServiceForm} className="text-xs text-slate-400 hover:text-slate-700">ยกเลิก</button>
                        </h3>

                        <form onSubmit={handleSaveService} className="space-y-6 text-sm">
                          {/* Title & Slug */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-500">ชื่อบริการ *</label>
                              <input 
                                type="text" 
                                required
                                value={sTitle}
                                onChange={(e) => setSTitle(e.target.value)}
                                placeholder="เช่น บริการจัดกรุ๊ปเหมา – กรุ๊ปส่วนตัว"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary outline-hidden"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-500">รหัสอ้างอิงบริการ (Slug) *</label>
                              <input 
                                type="text" 
                                required
                                disabled={!!editingServiceSlug}
                                value={sSlug}
                                onChange={(e) => setSSlug(e.target.value.replace(/[^a-zA-Z0-9-]/g, "").toLowerCase())}
                                placeholder="เช่น private-group (ภาษาอังกฤษ ไม่มีช่องว่าง)"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary outline-hidden font-mono uppercase font-bold disabled:bg-slate-50 disabled:text-slate-400"
                              />
                            </div>
                          </div>

                          {/* Subtitle & Icon & Cover Image */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-500">คำโปรย / หัวข้อย่อย</label>
                              <input 
                                type="text" 
                                value={sSubtitle}
                                onChange={(e) => setSSubtitle(e.target.value)}
                                placeholder="เช่น เที่ยวแบบเป็นส่วนตัว ออกแบบเส้นทางได้ตามใจคุณ"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary outline-hidden"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-500">ไอคอนหลัก (ชื่อไอคอน Lucide)</label>
                              <select
                                value={sIconName}
                                onChange={(e) => setSIconName(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary outline-hidden bg-white"
                              >
                                <option value="Users">Users (กรุ๊ปคน/ผู้ใช้)</option>
                                <option value="Briefcase">Briefcase (กระเป๋าทำงาน/องค์กร)</option>
                                <option value="Compass">Compass (เข็มทิศ/นำทาง)</option>
                                <option value="Award">Award (ถ้วยรางวัล/CSR)</option>
                                <option value="Sparkles">Sparkles (ประกาย/งานเลี้ยง)</option>
                                <option value="Calendar">Calendar (ปฏิทิน/จัดอีเวนต์)</option>
                                <option value="Heart">Heart (หัวใจ/สายบุญ)</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-500">ภาพหน้าปกหลัก (URL) *</label>
                              <input 
                                type="text" 
                                required
                                value={sBgImage}
                                onChange={(e) => setSBgImage(e.target.value)}
                                placeholder="ลิงก์รูปภาพปก..."
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary outline-hidden"
                              />
                            </div>
                          </div>

                          {/* Description */}
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500">รายละเอียดบริการ (ยาว)</label>
                            <textarea 
                              rows={4}
                              value={sDesc}
                              onChange={(e) => setSDesc(e.target.value)}
                              placeholder="รายละเอียดการให้บริการทั้งหมดที่จะแสดงในหน้าเว็บบริการ..."
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary outline-hidden"
                            />
                          </div>

                          {/* Highlights, Benefits, Preview Images */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Highlights */}
                            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                              <label className="text-xs font-bold text-slate-700 font-kanit">ไฮไลต์สำคัญ ({sHighlights.length})</label>
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={highlightServiceInput}
                                  onChange={(e) => setHighlightServiceInput(e.target.value)}
                                  placeholder="ป้อนไฮไลต์..."
                                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (highlightServiceInput) {
                                      setSHighlights(prev => [...prev, highlightServiceInput]);
                                      setHighlightServiceInput("");
                                    }
                                  }}
                                  className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold"
                                >
                                  +
                                </button>
                              </div>
                              <ul className="space-y-1 max-h-32 overflow-y-auto">
                                {sHighlights.map((h, i) => (
                                  <li key={i} className="flex justify-between items-center text-[10px] text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
                                    <span className="truncate">{h}</span>
                                    <button type="button" onClick={() => setSHighlights(prev => prev.filter((_, idx) => idx !== i))} className="text-rose-500 ml-1"><X className="h-3 w-3" /></button>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Benefits */}
                            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                              <label className="text-xs font-bold text-slate-700 font-kanit">สิ่งที่จะได้รับเมื่อใช้บริการ ({sBenefits.length})</label>
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={benefitServiceInput}
                                  onChange={(e) => setBenefitServiceInput(e.target.value)}
                                  placeholder="ป้อนสิ่งที่จะได้รับ..."
                                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (benefitServiceInput) {
                                      setSBenefits(prev => [...prev, benefitServiceInput]);
                                      setBenefitServiceInput("");
                                    }
                                  }}
                                  className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold"
                                >
                                  +
                                </button>
                              </div>
                              <ul className="space-y-1 max-h-32 overflow-y-auto">
                                {sBenefits.map((b, i) => (
                                  <li key={i} className="flex justify-between items-center text-[10px] text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
                                    <span className="truncate">{b}</span>
                                    <button type="button" onClick={() => setSBenefits(prev => prev.filter((_, idx) => idx !== i))} className="text-rose-500 ml-1"><X className="h-3 w-3" /></button>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Preview Images List (Request specific feature!) */}
                            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                              <label className="text-xs font-bold text-slate-700 font-kanit">รูปภาพตัวอย่างสำหรับลูกค้า ({sPreviewImages.length})</label>
                              
                              <div className="flex gap-1.5">
                                <input 
                                  type="text" 
                                  value={previewImageInput}
                                  onChange={(e) => setPreviewImageInput(e.target.value)}
                                  placeholder="ลิ้งก์รูปภาพตัวอย่าง..."
                                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] bg-white"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (previewImageInput) {
                                      setSPreviewImages(prev => [...prev, previewImageInput]);
                                      setPreviewImageInput("");
                                    }
                                  }}
                                  className="px-2.5 py-1.5 bg-primary text-white rounded-lg text-xs font-bold"
                                  title="เพิ่มจากลิ้งก์"
                                >
                                  +
                                </button>
                                
                                <div className="relative shrink-0">
                                  <input 
                                    type="file" 
                                    id="preview-image-upload" 
                                    onChange={handlePreviewImageUpload}
                                    className="hidden" 
                                    accept="image/*"
                                  />
                                  <label 
                                    htmlFor="preview-image-upload"
                                    className="p-1.5 bg-slate-900 text-white rounded-lg flex items-center justify-center hover:bg-primary smooth-hover cursor-pointer h-7 w-7"
                                    title="อัปโหลดรูปภาพ"
                                  >
                                    {uploadingPreviewImage ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                                  </label>
                                </div>
                              </div>

                              {/* Preview Image Thumbnails */}
                              <div className="grid grid-cols-4 gap-1.5 max-h-28 overflow-y-auto pt-1">
                                {sPreviewImages.map((img, i) => (
                                  <div key={i} className="relative h-10 w-full rounded-md border border-slate-200 overflow-hidden group bg-white">
                                    <img src={img} className="w-full h-full object-cover" />
                                    <button 
                                      type="button"
                                      onClick={() => setSPreviewImages(prev => prev.filter((_, idx) => idx !== i))}
                                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                                    >
                                      <X className="h-3.5 w-3.5 text-rose-400" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Placeholder Name */}
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500">ข้อมูลแนะนำสำหรับการกรอกของลูกค้า (Placeholder ในช่องติดต่อ)</label>
                            <input 
                              type="text" 
                              value={sPlaceholder}
                              onChange={(e) => setSPlaceholder(e.target.value)}
                              placeholder="เช่น เช่น ทริปครอบครัวเที่ยวญี่ปุ่น 6 ท่าน"
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary outline-hidden"
                            />
                          </div>

                          {/* Submit Actions */}
                          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={resetServiceForm}
                              className="px-6 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-xl text-xs"
                            >
                              ยกเลิกการกรอก
                            </button>
                            <button
                              type="submit"
                              className="px-8 py-2.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl text-xs shadow-xs"
                            >
                              {editingServiceSlug ? "บันทึกการแก้ไขข้อมูลบริการ" : "สร้างและเผยแพร่บริการใหม่"}
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* SERVICES LIST GRID FOR ADMIN */}
                    {!showServiceForm && (
                      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 space-y-4">
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-slate-100 text-xs text-left">
                            <thead className="bg-slate-50 font-prompt text-slate-500">
                              <tr>
                                <th className="px-4 py-3">ไอคอน</th>
                                <th className="px-4 py-3">รหัสอ้างอิง (Slug)</th>
                                <th className="px-4 py-3">ชื่อบริการ</th>
                                <th className="px-4 py-3">รูปภาพปก</th>
                                <th className="px-4 py-3 text-center">ภาพตัวอย่าง</th>
                                <th className="px-4 py-3 text-center">จัดการ</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-600 font-prompt">
                              {services.map((s) => {
                                const detailed = servicesDetailed[s.slug] || {};
                                const previewsCount = detailed.previewImages?.length || 0;
                                return (
                                  <tr key={s.slug} className="hover:bg-slate-50/50">
                                    <td className="px-4 py-3 font-mono font-bold text-slate-900">{s.iconName || "Compass"}</td>
                                    <td className="px-4 py-3 font-mono font-bold text-slate-700">{s.slug}</td>
                                    <td className="px-4 py-3 font-semibold text-slate-800" title={s.title}>{s.title}</td>
                                    <td className="px-4 py-3">
                                      <div className="h-8 w-12 rounded-md overflow-hidden border border-slate-200 bg-slate-50">
                                        <img src={s.image} className="w-full h-full object-cover" />
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-center font-bold text-primary">{previewsCount} ภาพ</td>
                                    <td className="px-4 py-3 text-center whitespace-nowrap space-x-2">
                                      <button 
                                        onClick={() => handleEditServiceClick(s)}
                                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg smooth-hover" 
                                        title="แก้ไข"
                                      >
                                        <Edit3 className="h-4 w-4" />
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteService(s.slug)}
                                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg smooth-hover" 
                                        title="ลบ"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                      <Link 
                                        href={`/services/${s.slug}`}
                                        className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg inline-block smooth-hover"
                                        title="ดูตัวอย่างจริง"
                                      >
                                        <Link2 className="h-4 w-4" />
                                      </Link>
                                    </td>
                                  </tr>
                                );
                              })}
                              {services.length === 0 && (
                                <tr>
                                  <td colSpan={6} className="py-8 text-center text-slate-400">ยังไม่มีรายการบริการอยู่ในระบบ</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </>
            )}
          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}
