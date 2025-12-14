import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { GeneratedPage } from '../types';

const data = [
  { name: 'Mon', visits: 4000, conversions: 240 },
  { name: 'Tue', visits: 3000, conversions: 139 },
  { name: 'Wed', visits: 2000, conversions: 980 },
  { name: 'Thu', visits: 2780, conversions: 390 },
  { name: 'Fri', visits: 1890, conversions: 480 },
  { name: 'Sat', visits: 2390, conversions: 380 },
  { name: 'Sun', visits: 3490, conversions: 430 },
];

const trafficSource = [
    { name: 'GitHub', value: 45 },
    { name: 'Direct', value: 25 },
    { name: 'Social', value: 20 },
    { name: 'Search', value: 10 },
];

interface AnalyticsViewProps {
    pageData: GeneratedPage;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ pageData }) => {
  return (
    <div className="h-full overflow-y-auto p-8 space-y-8 bg-slate-50 rounded-xl">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-900">Performance Forecast</h2>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                Projected Conversion: 4.2%
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase">Projected Traffic & Conversion</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={pageData.meta.themeColor} stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor={pageData.meta.themeColor} stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <Tooltip 
                                contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}} 
                                itemStyle={{color: '#fff'}}
                            />
                            <Area type="monotone" dataKey="visits" stroke={pageData.meta.themeColor} fillOpacity={1} fill="url(#colorVisits)" />
                            <Area type="monotone" dataKey="conversions" stroke="#10b981" fill="none" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase">Traffic Sources</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={trafficSource} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={60} tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                            <Tooltip cursor={{fill: 'transparent'}} />
                            <Bar dataKey="value" fill={pageData.meta.themeColor} radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                 <div className="text-sm text-gray-500 mb-1">Current Stars</div>
                 <div className="text-3xl font-bold text-slate-900">{pageData.githubStats.stars.toLocaleString()}</div>
             </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                 <div className="text-sm text-gray-500 mb-1">Growth Rate</div>
                 <div className="text-3xl font-bold text-green-600">+12%</div>
             </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                 <div className="text-sm text-gray-500 mb-1">Avg. Time on Page</div>
                 <div className="text-3xl font-bold text-slate-900">2m 45s</div>
             </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                 <div className="text-sm text-gray-500 mb-1">Bounce Rate</div>
                 <div className="text-3xl font-bold text-slate-900">34%</div>
             </div>
        </div>
    </div>
  );
};

export default AnalyticsView;
