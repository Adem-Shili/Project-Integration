import React from 'react';
import HeaderAdmin from '../components/HeaderAdmin';
import Footer from '../components/Footer';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

// Composant Dashboard Admin - single file
// Dépendances : react, recharts, tailwindcss

const stats = [
  { title: 'Total Shops', value: 24, note: '+2 this month', icon: '🏬' },
  { title: 'Total Users', value: '1,247', note: '+48 this week', icon: '👤' },
  { title: 'Monthly', value: '$89,432', note: '+12% last month', icon: '💰' },
  { title: 'Pending', value: 156, note: '32 urgent', icon: '📦' },
];

const salesData = [
  { month: 'Jan', sales: 12000 },
  { month: 'Feb', sales: 15000 },
  { month: 'Mar', sales: 17000 },
  { month: 'Apr', sales: 14000 },
  { month: 'May', sales: 21000 },
  { month: 'Jun', sales: 24000 },
];

const orderStatus = [
  { name: 'Delivered', value: 65 },
  { name: 'Pending', value: 25 },
  { name: 'Cancelled', value: 10 },
];

const COLORS = ['#2563EB', '#F59E0B', '#EF4444'];

const shops = [
  { name: 'Downtown Store', owner: 'John Smith', status: 'Active', sales: '$45,230' },
  { name: 'Mall Branch', owner: 'Sarah Johnson', status: 'Active', sales: '$38,920' },
  { name: 'Suburb Shop', owner: 'Mike Davis', status: 'Inactive', sales: '$12,450' },
  { name: 'City Center', owner: 'Emma Wilson', status: 'Active', sales: '$52,180' },
];

const users = [
  { user: 'Alice Cooper', role: 'Manager', shop: 'Downtown Store', lastActive: '2 hours ago' },
  { user: 'Bob Martinez', role: 'Cashier', shop: 'Mall Branch', lastActive: '1 day ago' },
  { user: 'Carol White', role: 'Admin', shop: 'City Center', lastActive: '5 minutes ago' },
  { user: 'David Lee', role: 'Cashier', shop: 'Suburb Shop', lastActive: '3 days' },
];

export default function AdminDashboard() {
  return (
    <div>
        <HeaderAdmin/>
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <div key={s.title} className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-400">{s.title}</p>
                <p className="text-xl font-bold text-gray-800">{s.value}</p>
                <p className="text-sm text-green-500">{s.note}</p>
              </div>
              <div className="text-3xl">{s.icon}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Sales Over Time</h3>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <LineChart data={salesData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="#2563EB" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Orders by Status</h3>
            <div style={{ width: '100%', height: 260 }} className="flex items-center justify-center">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={orderStatus} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} label>
                    {orderStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Management tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">Shops Management</h3>
              <button className="text-xs px-3 py-1 bg-amber-400 rounded text-white">View All</button>
            </div>
            <div className="divide-y divide-gray-100">
              {shops.map((s) => (
                <div key={s.name} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{s.name}</p>
                    <p className="text-xs text-gray-500">{s.owner}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {s.status}
                    </span>
                    <div className="text-sm text-gray-600">{s.sales}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">Users Management</h3>
              <button className="text-xs px-3 py-1 bg-amber-400 rounded text-white">View All</button>
            </div>
            <div className="divide-y divide-gray-100">
              {users.map((u) => (
                <div key={u.user} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{u.user}</p>
                    <p className="text-xs text-gray-500">{u.role} • {u.shop}</p>
                  </div>
                  <div className="text-sm text-gray-500">{u.lastActive}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* === fin insertion === */}
            <hr className="h-[2px] bg-yellow-500 border-0" />
            <Footer />
    </div>
  );
}
