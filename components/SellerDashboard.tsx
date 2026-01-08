
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Package, DollarSign, TrendingUp, Users, Plus, Edit2, Trash2, ChevronRight } from 'lucide-react';
import { User, Product } from '../types';
import { MOCK_PRODUCTS } from '../constants';

const SellerDashboard: React.FC<{ user: User }> = ({ user }) => {
  const salesData = [
    { name: 'Du', sales: 400 },
    { name: 'Se', sales: 300 },
    { name: 'Ch', sales: 600 },
    { name: 'Pa', sales: 800 },
    { name: 'Ju', sales: 500 },
    { name: 'Sh', sales: 900 },
    { name: 'Ya', sales: 700 },
  ];

  return (
    <div className="p-4 pt-20 pb-24">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Salom, {user.name}!</h1>
          <p className="text-gray-500">Do'koningiz statistikasi</p>
        </div>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm">
          <Plus size={18}/> Yangi mahsulot
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<DollarSign className="text-green-600"/>} label="Jami savdo" value="45,200,000" unit="UZS" color="bg-green-50" />
        <StatCard icon={<Package className="text-blue-600"/>} label="Buyurtmalar" value="128" unit="ta" color="bg-blue-50" />
        <StatCard icon={<TrendingUp className="text-purple-600"/>} label="O'sish" value="+12.5" unit="%" color="bg-purple-50" />
        <StatCard icon={<Users className="text-orange-600"/>} label="Mijozlar" value="1,402" unit="kishi" color="bg-orange-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold mb-4">Haftalik savdo grafigi</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8f8f8'}} />
                <Bar dataKey="sales" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold mb-4">Oxirgi buyurtmalar</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-400">#{1024+i}</div>
                  <div>
                    <p className="text-sm font-semibold">G'iyosiddin T.</p>
                    <p className="text-xs text-gray-500">Bugun, 14:20</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">1,200,000</p>
                  <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">Kutilmoqda</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-purple-600 text-sm font-bold flex items-center justify-center gap-1">
            Barchasini ko'rish <ChevronRight size={14}/>
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Mening mahsulotlarim</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Mahsulot</th>
                <th className="px-6 py-4">Narxi</th>
                <th className="px-6 py-4">Sklad</th>
                <th className="px-6 py-4">Reyting</th>
                <th className="px-6 py-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_PRODUCTS.slice(0, 3).map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.images[0]} className="w-10 h-10 rounded-lg object-cover" />
                      <span className="text-sm font-medium line-clamp-1">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold">{p.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm">{p.stock}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-yellow-500"><TrendingUp size={14}/> {p.rating}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={16}/></button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string, unit: string, color: string }> = ({ icon, label, value, unit, color }) => (
  <div className={`p-4 rounded-2xl ${color} border border-white shadow-sm flex flex-col gap-2`}>
    <div className="flex items-center gap-2 opacity-80">{icon} <span className="text-xs font-bold text-gray-600">{label}</span></div>
    <div className="flex items-baseline gap-1">
      <span className="text-xl font-extrabold">{value}</span>
      <span className="text-[10px] font-bold opacity-60">{unit}</span>
    </div>
  </div>
);

export default SellerDashboard;
