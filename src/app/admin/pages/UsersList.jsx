import { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { Loader2, AlertCircle, Search, User } from 'lucide-react';
import { toast } from 'react-toastify';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getAllUsers();
      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users list.");
      toast.error("Could not load users.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    (user.fullname || user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-blue-500">
        <Loader2 className="animate-spin mr-2" /> Loading Users...
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">User Management</h1>
          <p className="text-slate-400 text-sm">View and manage system users</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-[#1e1e1e] border border-white/10 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full md:w-64"
          />
        </div>
      </div>

      <div className="bg-[#1e1e1e] border border-white/5 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-white/5 text-slate-200 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
                        <User size={20} />
                      </div>
                      <div>
                        <div className="font-medium text-slate-200">{user.fullname || user.name || 'N/A'}</div>
                        <div className="text-xs text-slate-500">ID: {user._id.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-slate-300">{user.email}</span>
                      <span className="text-xs text-slate-500">{user.mobile || 'No mobile'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.role === 'admin'
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <User size={48} className="mb-4 opacity-20" />
                      <p>No users found matching your search.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-right text-xs text-slate-600">
        Showing {filteredUsers.length} of {users.length} users
      </div>
    </div>
  );
};

export default UsersList;