
import React from 'react';
import { Users, ShoppingBag, ShieldAlert, Settings, PieChart, Activity, DollarSign, Download } from 'lucide-react';

const AdminPanel: React.FC = () => {
  return (
    <div className="p-4 pt-20 pb-24">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Admin Central</h1>
          <p className="text-gray-500">Global marketplace overview and control</p>
        </div>
        <button className="bg-gray-900 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-800 transition">
          <Download size={18}/> Export Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <AdminStatCard icon={<Users size={20}/>} label="Total Users" value="245,000" trend="+12%" color="bg-blue-500" />
        <AdminStatCard icon={<ShoppingBag size={20}/>} label="Total Orders" value="12,402" trend="+5.2%" color="bg-purple-500" />
        <AdminStatCard icon={<DollarSign size={20}/>} label="Total Revenue" value="$2.4M" trend="+18.4%" color="bg-green-500" />
        <AdminStatCard icon={<Activity size={20}/>} label="Active Users" value="1,200" trend="-2%" color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><ShieldAlert size={20} className="text-red-500"/> Verification Queue</h3>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                  <div>
                    <p className="font-bold text-sm">Store #{i*152} Request</p>
                    <p className="text-xs text-gray-500">Submitted 2h ago</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-lg">Approve</button>
                  <button className="px-3 py-1 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-lg">Review</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><PieChart size={20} className="text-purple-500"/> Revenue Distribution</h3>
           <div className="flex items-center justify-center h-48">
              <div className="w-32 h-32 rounded-full border-[12px] border-purple-500 border-r-indigo-500 border-b-blue-500 border-l-green-500 animate-pulse"></div>
              <div className="ml-8 space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Electronics 45%</div>
                <div className="flex items-center gap-2 text-xs font-medium"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Clothing 25%</div>
                <div className="flex items-center gap-2 text-xs font-medium"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Beauty 15%</div>
                <div className="flex items-center gap-2 text-xs font-medium"><div className="w-2 h-2 rounded-full bg-green-500"></div> Others 15%</div>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">Platform Logs</h3>
          <button className="text-xs font-bold text-blue-600">View All Logs</button>
        </div>
        <div className="space-y-3">
          <LogEntry status="success" message="System backup completed successfully" time="10:45 AM" />
          <LogEntry status="warning" message="High latency detected on node AP-South" time="09:20 AM" />
          <LogEntry status="error" message="Failed payment attempt from card #4421" time="08:15 AM" />
          <LogEntry status="info" message="New seller 'Apple Store Official' registered" time="07:50 AM" />
        </div>
      </div>
    </div>
  );
};

const AdminStatCard: React.FC<{ icon: React.ReactNode, label: string, value: string, trend: string, color: string }> = ({ icon, label, value, trend, color }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
    <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-gray-200`}>
      {icon}
    </div>
    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
    <div className="flex items-baseline justify-between">
      <h4 className="text-2xl font-extrabold">{value}</h4>
      <span className={`text-xs font-bold ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{trend}</span>
    </div>
  </div>
);

const LogEntry: React.FC<{ status: 'success' | 'warning' | 'error' | 'info', message: string, time: string }> = ({ status, message, time }) => {
  const colors = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };
  return (
    <div className="flex items-center gap-4 py-2">
      <div className={`w-2 h-2 rounded-full ${colors[status]}`}></div>
      <p className="flex-1 text-sm text-gray-700">{message}</p>
      <span className="text-xs font-medium text-gray-400">{time}</span>
    </div>
  );
};

export default AdminPanel;
