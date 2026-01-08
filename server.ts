
import express from 'express';
import cors from 'cors';
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

app.use(cors());
app.use(express.json());

// In-memory Database mockup (Productionda PostgreSQL ga ulanadi)
let products = [
  {
    id: 'p1',
    title: 'iPhone 15 Pro Max 256GB Natural Titanium',
    description: 'Eng so\'nggi modeldagi iPhone, kuchli protsessor va mukammal kamera.',
    price: 15500000,
    discountPrice: 14900000,
    category: 'Elektronika',
    images: ['https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800'],
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    rating: 4.9,
    reviewsCount: 128,
    sellerId: 's1',
    stock: 15
  },
  {
    id: 'p2',
    title: 'Samsung Galaxy S24 Ultra',
    description: 'AI imkoniyatlariga ega flagman smartfon.',
    price: 13500000,
    category: 'Elektronika',
    images: ['https://images.unsplash.com/photo-1707201369680-9940730d173d?w=800'],
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    rating: 4.8,
    reviewsCount: 95,
    sellerId: 's2',
    stock: 20
  },
  {
    id: 'p3',
    title: 'Nike Tech Fleece Hoodie',
    description: 'Sport va kundalik kiyish uchun premium kiyim.',
    price: 1200000,
    category: 'Kiyimlar',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'],
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    rating: 4.7,
    reviewsCount: 312,
    sellerId: 's1',
    stock: 50
  }
];

// Mahsulotlar ro'yxati
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Aqlli AI Qidiruv (Semantic Search)
app.post('/api/search', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Query required" });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search query: "${query}". Products: ${JSON.stringify(products.map(p => ({id: p.id, title: p.title, desc: p.description})))}. Return matched IDs as JSON array.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    const matchedIds = JSON.parse(response.text || "[]");
    const results = products.filter(p => matchedIds.includes(p.id));
    res.json(results);
  } catch (err) {
    console.error("AI Search Error:", err);
    res.status(500).json({ error: "AI search failed" });
  }
});

// AI Tavsiyalar
app.post('/api/ai/recommendations', async (req, res) => {
  const { history } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `History: ${history.join(", ")}. Products: ${JSON.stringify(products.map(p => ({id: p.id, title: p.title})))}. Suggest 3 IDs in JSON array.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    res.json(JSON.parse(response.text || "[]"));
  } catch (err) {
    res.json([]);
  }
});

// Buyurtma yaratish
app.post('/api/orders', (req, res) => {
  const { userId, items, total } = req.body;
  const newOrder = {
    id: 'ord-' + Math.random().toString(36).substr(2, 9),
    userId,
    items,
    total,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  console.log("New Order Created:", newOrder);
  res.status(201).json(newOrder);
});

app.listen(port, () => {
  console.log(`Bozor Production API running at http://localhost:${port}`);
});
