import { useState, useEffect } from 'react';
import { Users, FileText, Activity, AlertCircle, Loader2 } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [stats, setStats] = useState({
    usersCount: 0,
    pdfsCount: 0,
    recentUsers: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch users and pdfs in parallel
      const [users, pdfs] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getAllPdfs()
      ]);

      setStats({
        usersCount: users?.length || 0,
        pdfsCount: pdfs?.length || 0,
        recentUsers: users?.slice(0, 5) || [] // Show top 5 recent users
      });
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard data.");
      toast.error("Could not load dashboard stats.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-blue-500">
        <Loader2 className="animate-spin mr-2" /> Loading Dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-12 text-red-400">
        <AlertCircle className="mr-2" /> {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-100">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={stats.usersCount}
          icon={Users}
          color="bg-blue-500/10 text-blue-500 border-blue-500/20"
        />
        <StatCard
          title="Documents Indexed"
          value={stats.pdfsCount}
          icon={FileText}
          color="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
        />
        <StatCard
          title="System Status"
          value="Active"
          icon={Activity}
          color="bg-purple-500/10 text-purple-500 border-purple-500/20"
        />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-slate-200 mb-4">Recent Users</h2>
        <div className="bg-[#1e1e1e] border border-white/5 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-white/5 text-slate-200 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats.recentUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-300">{user.fullname || user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs border ${user.role === 'admin'
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}
                {stats.recentUsers.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-slate-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className={`p-6 rounded-xl border ${color} relative overflow-hidden`}>
    <div className="relative z-10">
      <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
      <Icon size={48} />
    </div>
  </div>
);

export default Dashboard;