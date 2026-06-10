import { Pool } from '@neondatabase/serverless';
import { 
  Tour, 
  TourImage, 
  Destination, 
  Review, 
  Booking,
  mockTours, 
  mockDestinations, 
  mockReviews, 
  mockBookings, 
  mockTourImages 
} from './mockData';

// Ensure database state persists across Next.js dev server hot-reloads
interface MockDbStore {
  tours: Tour[];
  destinations: Destination[];
  reviews: Review[];
  bookings: Booking[];
  tourImages: TourImage[];
}

declare global {
  // eslint-disable-next-line no-var
  var _mockDbStore: MockDbStore | undefined;
}

if (!globalThis._mockDbStore) {
  globalThis._mockDbStore = {
    tours: [...mockTours],
    destinations: [...mockDestinations],
    reviews: [...mockReviews],
    bookings: [...mockBookings],
    tourImages: [...mockTourImages]
  };
}

const mockDb = globalThis._mockDbStore;

// Check if we have Neon Database URL
const isDbConnected = !!process.env.DATABASE_URL;

// Create Neon SQL connection Pool
const pool = isDbConnected ? new Pool({ connectionString: process.env.DATABASE_URL }) : null;

// Universal SQL execution helper
async function sql(queryText: string, params?: any[]): Promise<any[]> {
  if (!pool) return [];
  const res = await pool.query(queryText, params);
  return res.rows;
}

// Initialize tables if using real PostgreSQL
export async function initDb() {
  if (!sql) return;

  try {
    // Create Destinations table
    await sql(`
      CREATE TABLE IF NOT EXISTS destinations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        image_url TEXT NOT NULL,
        tour_count INTEGER DEFAULT 0
      )
    `);

    // Create Tours table
    await sql(`
      CREATE TABLE IF NOT EXISTS tours (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        code TEXT UNIQUE NOT NULL,
        country TEXT NOT NULL,
        description TEXT NOT NULL,
        price NUMERIC NOT NULL,
        available_seats INTEGER NOT NULL,
        departure_date TEXT NOT NULL,
        return_date TEXT NOT NULL,
        thumbnail TEXT NOT NULL,
        is_domestic BOOLEAN DEFAULT false,
        is_recommended BOOLEAN DEFAULT false,
        is_promotion BOOLEAN DEFAULT false,
        highlights TEXT[] DEFAULT '{}',
        itinerary JSONB DEFAULT '[]',
        included TEXT[] DEFAULT '{}',
        excluded TEXT[] DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Alter Tours table if columns are missing
    await sql(`ALTER TABLE tours ADD COLUMN IF NOT EXISTS airline TEXT`);
    await sql(`ALTER TABLE tours ADD COLUMN IF NOT EXISTS transport_type TEXT`);


    // Create Tour Images table
    await sql(`
      CREATE TABLE IF NOT EXISTS tour_images (
        id TEXT PRIMARY KEY,
        tour_id TEXT REFERENCES tours(id) ON DELETE CASCADE,
        url TEXT NOT NULL
      )
    `);

    // Create Reviews table
    await sql(`
      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        tour_id TEXT REFERENCES tours(id) ON DELETE CASCADE,
        author TEXT NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);

    // Create Bookings table
    await sql(`
      CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        tour_id TEXT REFERENCES tours(id) ON DELETE CASCADE,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        travelers_count INTEGER NOT NULL,
        total_price NUMERIC NOT NULL,
        travel_date TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);

    // Seed initial data if tables are empty
    const destCount = await sql(`SELECT COUNT(*) FROM destinations`);
    if (parseInt(destCount[0].count) === 0) {
      for (const dest of mockDestinations) {
        await sql(
          `INSERT INTO destinations (id, name, image_url, tour_count) VALUES ($1, $2, $3, $4)`,
          [dest.id, dest.name, dest.image_url, dest.tour_count]
        );
      }

      for (const tour of mockTours) {
        await sql(
          `INSERT INTO tours (
            id, title, code, country, description, price, available_seats, 
            departure_date, return_date, thumbnail, is_domestic, is_recommended, 
            is_promotion, highlights, itinerary, included, excluded, airline, transport_type
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
          [
            tour.id, tour.title, tour.code, tour.country, tour.description, tour.price, tour.available_seats,
            tour.departure_date, tour.return_date, tour.thumbnail, tour.is_domestic, tour.is_recommended,
            tour.is_promotion, tour.highlights, JSON.stringify(tour.itinerary), tour.included, tour.excluded,
            tour.airline || "", tour.transport_type || "plane"
          ]
        );
      }

      for (const img of mockTourImages) {
        await sql(
          `INSERT INTO tour_images (id, tour_id, url) VALUES ($1, $2, $3)`,
          [img.id, img.tour_id, img.url]
        );
      }

      for (const rev of mockReviews) {
        await sql(
          `INSERT INTO reviews (id, tour_id, author, rating, comment, created_at) VALUES ($1, $2, $3, $4, $5, $6)`,
          [rev.id, rev.tour_id, rev.author, rev.rating, rev.comment, rev.created_at]
        );
      }

      for (const book of mockBookings) {
        await sql(
          `INSERT INTO bookings (id, tour_id, customer_name, customer_email, customer_phone, travelers_count, total_price, travel_date, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [book.id, book.tour_id, book.customer_name, book.customer_email, book.customer_phone, book.travelers_count, book.total_price, book.travel_date, book.status, book.created_at]
        );
      }
    }
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
}

// Automatically trigger DB initialization in background if using SQL
if (isDbConnected) {
  initDb();
}

// DATABASE INTERFACE WRAPPERS

// 1. TOURS API
export async function getTours(filters?: {
  country?: string;
  maxPrice?: number;
  isDomestic?: boolean;
  isRecommended?: boolean;
  isPromotion?: boolean;
  search?: string;
  sortBy?: 'latest' | 'priceAsc' | 'priceDesc';
}) {
  if (sql) {
    let query = `SELECT * FROM tours WHERE 1=1`;
    const params: (string | number | boolean)[] = [];
    let paramIndex = 1;

    if (filters?.country) {
      query += ` AND country = $${paramIndex++}`;
      params.push(filters.country);
    }
    if (filters?.maxPrice) {
      query += ` AND price <= $${paramIndex++}`;
      params.push(filters.maxPrice);
    }
    if (filters?.isDomestic !== undefined) {
      query += ` AND is_domestic = $${paramIndex++}`;
      params.push(filters.isDomestic);
    }
    if (filters?.isRecommended !== undefined) {
      query += ` AND is_recommended = $${paramIndex++}`;
      params.push(filters.isRecommended);
    }
    if (filters?.isPromotion !== undefined) {
      query += ` AND is_promotion = $${paramIndex++}`;
      params.push(filters.isPromotion);
    }
    if (filters?.search) {
      query += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex} OR code ILIKE $${paramIndex})`;
      params.push(`%${filters.search}%`);
      paramIndex++;
    }

    if (filters?.sortBy === 'priceAsc') {
      query += ` ORDER BY price ASC`;
    } else if (filters?.sortBy === 'priceDesc') {
      query += ` ORDER BY price DESC`;
    } else {
      query += ` ORDER BY created_at DESC`;
    }

    const results = await sql(query, params);
    return results.map(row => ({
      ...row,
      price: parseFloat(row.price),
      itinerary: typeof row.itinerary === 'string' ? JSON.parse(row.itinerary) : row.itinerary
    })) as Tour[];
  } else {
    // MOCK RESPONSE
    let result = [...mockDb.tours];

    if (filters?.country) {
      result = result.filter(t => t.country === filters.country);
    }
    if (filters?.maxPrice) {
      result = result.filter(t => t.price <= filters.maxPrice!);
    }
    if (filters?.isDomestic !== undefined) {
      result = result.filter(t => t.is_domestic === filters.isDomestic);
    }
    if (filters?.isRecommended !== undefined) {
      result = result.filter(t => t.is_recommended === filters.isRecommended);
    }
    if (filters?.isPromotion !== undefined) {
      result = result.filter(t => t.is_promotion === filters.isPromotion);
    }
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(searchLower) || 
        t.description.toLowerCase().includes(searchLower) ||
        t.code.toLowerCase().includes(searchLower) ||
        t.country.toLowerCase().includes(searchLower)
      );
    }

    if (filters?.sortBy === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters?.sortBy === 'priceDesc') {
      result.sort((a, b) => b.price - a.price);
    } else {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }
}

export async function getTourById(id: string): Promise<Tour | null> {
  if (sql) {
    const results = await sql(`SELECT * FROM tours WHERE id = $1`, [id]);
    if (results.length === 0) return null;
    const row = results[0];
    return {
      ...row,
      price: parseFloat(row.price),
      itinerary: typeof row.itinerary === 'string' ? JSON.parse(row.itinerary) : row.itinerary
    } as Tour;
  } else {
    const tour = mockDb.tours.find(t => t.id === id);
    return tour || null;
  }
}

export async function createTour(tourData: Omit<Tour, 'id' | 'created_at'>): Promise<Tour> {
  const newId = `tour-${Math.random().toString(36).substr(2, 9)}`;
  const createdAt = new Date().toISOString();
  const newTour: Tour = {
    ...tourData,
    id: newId,
    created_at: createdAt
  };

  if (sql) {
    await sql(`
      INSERT INTO tours (
        id, title, code, country, description, price, available_seats, 
        departure_date, return_date, thumbnail, is_domestic, is_recommended, 
        is_promotion, highlights, itinerary, included, excluded, created_at,
        airline, transport_type
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
    `, [
      newTour.id, newTour.title, newTour.code, newTour.country, newTour.description, newTour.price, newTour.available_seats,
      newTour.departure_date, newTour.return_date, newTour.thumbnail, newTour.is_domestic, newTour.is_recommended,
      newTour.is_promotion, newTour.highlights, JSON.stringify(newTour.itinerary), newTour.included, newTour.excluded, newTour.created_at,
      newTour.airline || "", newTour.transport_type || "plane"
    ]);
  } else {
    mockDb.tours.push(newTour);
    
    // Update destination count if matching
    const dest = mockDb.destinations.find(d => d.name.includes(tourData.country) || tourData.country.includes(d.name.split(' ')[0]));
    if (dest) {
      dest.tour_count += 1;
    }
  }

  return newTour;
}

export async function updateTour(id: string, tourData: Partial<Tour>): Promise<Tour | null> {
  if (sql) {
    const existing = await getTourById(id);
    if (!existing) return null;

    const updated = { ...existing, ...tourData };

    await sql(`
      UPDATE tours SET
        title = $1, code = $2, country = $3, description = $4, price = $5, 
        available_seats = $6, departure_date = $7, return_date = $8, thumbnail = $9, 
        is_domestic = $10, is_recommended = $11, is_promotion = $12, 
        highlights = $13, itinerary = $14, included = $15, excluded = $16,
        airline = $17, transport_type = $18
      WHERE id = $19
    `, [
      updated.title, updated.code, updated.country, updated.description, updated.price, updated.available_seats,
      updated.departure_date, updated.return_date, updated.thumbnail, updated.is_domestic, updated.is_recommended,
      updated.is_promotion, updated.highlights, JSON.stringify(updated.itinerary), updated.included, updated.excluded,
      updated.airline || "", updated.transport_type || "plane", id
    ]);

    return updated;
  } else {
    const index = mockDb.tours.findIndex(t => t.id === id);
    if (index === -1) return null;
    mockDb.tours[index] = { ...mockDb.tours[index], ...tourData } as Tour;
    return mockDb.tours[index];
  }
}

export async function deleteTour(id: string): Promise<boolean> {
  if (sql) {
    const result = await sql(`DELETE FROM tours WHERE id = $1 RETURNING id`, [id]);
    return result.length > 0;
  } else {
    const index = mockDb.tours.findIndex(t => t.id === id);
    if (index === -1) return false;
    const tour = mockDb.tours[index];
    mockDb.tours.splice(index, 1);

    // Update destination count
    const dest = mockDb.destinations.find(d => d.name.includes(tour.country) || tour.country.includes(d.name.split(' ')[0]));
    if (dest && dest.tour_count > 0) {
      dest.tour_count -= 1;
    }
    return true;
  }
}

// 2. TOUR IMAGES API
export async function getTourImages(tourId: string): Promise<TourImage[]> {
  if (sql) {
    const results = await sql(`SELECT * FROM tour_images WHERE tour_id = $1`, [tourId]);
    return results as TourImage[];
  } else {
    return mockDb.tourImages.filter(img => img.tour_id === tourId);
  }
}

export async function addTourImages(tourId: string, urls: string[]): Promise<TourImage[]> {
  const newImages: TourImage[] = urls.map(url => ({
    id: `img-${Math.random().toString(36).substr(2, 9)}`,
    tour_id: tourId,
    url
  }));

  if (sql) {
    for (const img of newImages) {
      await sql(`INSERT INTO tour_images (id, tour_id, url) VALUES ($1, $2, $3)`, [img.id, img.tour_id, img.url]);
    }
  } else {
    mockDb.tourImages.push(...newImages);
  }

  return newImages;
}

export async function setTourImages(tourId: string, urls: string[]): Promise<TourImage[]> {
  if (sql) {
    await sql(`DELETE FROM tour_images WHERE tour_id = $1`, [tourId]);
  } else {
    mockDb.tourImages = mockDb.tourImages.filter(img => img.tour_id !== tourId);
  }
  return addTourImages(tourId, urls);
}

// 3. BOOKINGS API
export async function getBookings(): Promise<Booking[]> {
  if (sql) {
    const results = await sql(`SELECT * FROM bookings ORDER BY created_at DESC`);
    return results.map(row => ({
      ...row,
      travelers_count: parseInt(row.travelers_count),
      total_price: parseFloat(row.total_price)
    })) as Booking[];
  } else {
    return [...mockDb.bookings].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
}

export async function createBooking(bookingData: Omit<Booking, 'id' | 'created_at' | 'status'>): Promise<Booking> {
  const newId = `book-${Math.random().toString(36).substr(2, 9)}`;
  const newBooking: Booking = {
    ...bookingData,
    id: newId,
    status: 'pending',
    created_at: new Date().toISOString()
  };

  // Reduce available seats of the tour
  const tour = await getTourById(bookingData.tour_id);
  if (!tour || tour.available_seats < bookingData.travelers_count) {
    throw new Error('ที่นั่งว่างไม่เพียงพอสำหรับการจองนี้');
  }

  if (sql) {
    // Transaction-like update in single pool execution:
    await sql(`
      INSERT INTO bookings (
        id, tour_id, customer_name, customer_email, customer_phone, 
        travelers_count, total_price, travel_date, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `, [
      newBooking.id, newBooking.tour_id, newBooking.customer_name, newBooking.customer_email, newBooking.customer_phone,
      newBooking.travelers_count, newBooking.total_price, newBooking.travel_date, newBooking.status, newBooking.created_at
    ]);

    await sql(`
      UPDATE tours SET available_seats = available_seats - $1 WHERE id = $2
    `, [bookingData.travelers_count, bookingData.tour_id]);
  } else {
    mockDb.bookings.push(newBooking);
    
    // Reduce seats in mock DB
    const mockTourIndex = mockDb.tours.findIndex(t => t.id === bookingData.tour_id);
    if (mockTourIndex !== -1) {
      mockDb.tours[mockTourIndex].available_seats -= bookingData.travelers_count;
    }
  }

  return newBooking;
}

export async function updateBookingStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled'): Promise<Booking | null> {
  if (sql) {
    const results = await sql(`
      UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *
    `, [status, id]);
    if (results.length === 0) return null;
    const row = results[0];
    
    // If cancelled, return the seats to the tour
    if (status === 'cancelled') {
      await sql(`
        UPDATE tours SET available_seats = available_seats + $1 WHERE id = $2
      `, [parseInt(row.travelers_count), row.tour_id]);
    }
    
    return {
      ...row,
      travelers_count: parseInt(row.travelers_count),
      total_price: parseFloat(row.total_price)
    } as Booking;
  } else {
    const index = mockDb.bookings.findIndex(b => b.id === id);
    if (index === -1) return null;
    
    const prevStatus = mockDb.bookings[index].status;
    mockDb.bookings[index].status = status;

    if (status === 'cancelled' && prevStatus !== 'cancelled') {
      const tourIndex = mockDb.tours.findIndex(t => t.id === mockDb.bookings[index].tour_id);
      if (tourIndex !== -1) {
        mockDb.tours[tourIndex].available_seats += mockDb.bookings[index].travelers_count;
      }
    } else if (prevStatus === 'cancelled' && status !== 'cancelled') {
      const tourIndex = mockDb.tours.findIndex(t => t.id === mockDb.bookings[index].tour_id);
      if (tourIndex !== -1) {
        mockDb.tours[tourIndex].available_seats -= mockDb.bookings[index].travelers_count;
      }
    }
    
    return mockDb.bookings[index];
  }
}

// 4. DESTINATIONS API
export async function getDestinations(): Promise<Destination[]> {
  if (sql) {
    const results = await sql(`SELECT * FROM destinations ORDER BY tour_count DESC`);
    return results.map(row => ({
      ...row,
      tour_count: parseInt(row.tour_count)
    })) as Destination[];
  } else {
    // Recalculate tour counts based on active tours list
    const counts = mockDb.tours.reduce((acc, tour) => {
      acc[tour.country] = (acc[tour.country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return mockDb.destinations.map(dest => {
      const countryKey = dest.name.split(' ')[0]; // E.g., 'ญี่ปุ่น'
      const matchCount = Object.keys(counts).find(k => k.includes(countryKey) || countryKey.includes(k));
      return {
        ...dest,
        tour_count: matchCount ? counts[matchCount] : 0
      };
    }).sort((a, b) => b.tour_count - a.tour_count);
  }
}

// 5. REVIEWS API
export async function getReviews(tourId?: string): Promise<Review[]> {
  if (sql) {
    let query = `SELECT * FROM reviews`;
    const params = [];
    if (tourId) {
      query += ` WHERE tour_id = $1`;
      params.push(tourId);
    }
    query += ` ORDER BY created_at DESC`;
    const results = await sql(query, params);
    return results.map(row => ({
      ...row,
      rating: parseInt(row.rating)
    })) as Review[];
  } else {
    let result = [...mockDb.reviews];
    if (tourId) {
      result = result.filter(r => r.tour_id === tourId);
    }
    return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
}

export async function createReview(reviewData: Omit<Review, 'id' | 'created_at'>): Promise<Review> {
  const newId = `rev-${Math.random().toString(36).substr(2, 9)}`;
  const createdAt = new Date().toISOString();
  const newReview: Review = {
    ...reviewData,
    id: newId,
    created_at: createdAt
  };

  if (sql) {
    await sql(`
      INSERT INTO reviews (id, tour_id, author, rating, comment, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [newReview.id, newReview.tour_id, newReview.author, newReview.rating, newReview.comment, newReview.created_at]);
  } else {
    mockDb.reviews.push(newReview);
  }

  return newReview;
}

export async function deleteReview(id: string): Promise<boolean> {
  if (sql) {
    const result = await sql(`DELETE FROM reviews WHERE id = $1 RETURNING id`, [id]);
    return result.length > 0;
  } else {
    const index = mockDb.reviews.findIndex(r => r.id === id);
    if (index === -1) return false;
    mockDb.reviews.splice(index, 1);
    return true;
  }
}
