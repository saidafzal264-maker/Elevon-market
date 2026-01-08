
import { Product, Order } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const apiClient = {
  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE_URL}/products`);
    if (!res.ok) throw new Error('Mahsulotlarni yuklashda xatolik');
    return res.json();
  },

  async searchProducts(query: string): Promise<Product[]> {
    const res = await fetch(`${API_BASE_URL}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) throw new Error('Qidiruvda xatolik');
    return res.json();
  },

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) throw new Error('Buyurtma yaratishda xatolik');
    return res.json();
  },

  async getAiRecommendations(history: string[]): Promise<string[]> {
    const res = await fetch(`${API_BASE_URL}/ai/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history }),
    });
    if (!res.ok) return [];
    return res.json();
  }
};
