import { useState, useEffect } from 'react';
import { authService } from '../../../services/authService';
import { Loader2, AlertCircle, User, Mail, Phone, Calendar, Shield } from 'lucide-react';
import { toast } from 'react-toastify';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const data = await authService.getCurrentUser();
      setUser(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile data.");
      toast.error("Could not load profile.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-blue-500">
        <Loader2 className="animate-spin mr-2" /> Loading Profile...
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

  if (!user) {
    return (
      <div className="p-6 text-slate-400">User not found</div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-100 mb-6">My Profile</h1>

      <div className="bg-[#1e1e1e] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 rounded-full bg-slate-900 border-4 border-[#1e1e1e] flex items-center justify-center text-slate-200 shadow-xl">
              <User size={48} />
            </div>
          </div>
        </div>

        <div className="pt-16 pb-8 px-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{user.fullname || user.name}</h2>
              {/* <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                {user.role?.toUpperCase()}
              </span> */}
            </div>
            <div className="text-sm text-slate-500">
              User ID: {user._id}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-3 mb-2 text-slate-400">
                <Mail size={18} />
                <span className="text-sm font-medium">Email Address</span>
              </div>
              <div className="text-lg text-slate-200">{user.email}</div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-3 mb-2 text-slate-400">
                <Phone size={18} />
                <span className="text-sm font-medium">Mobile Number</span>
              </div>
              <div className="text-lg text-slate-200">{user.mobile || 'Not provided'}</div>
            </div>

            {/* <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-3 mb-2 text-slate-400">
                <Shield size={18} />
                <span className="text-sm font-medium">Role Access</span>
              </div>
              <div className="text-lg text-slate-200 capitalize">{user.role}</div>
            </div> */}

            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-3 mb-2 text-slate-400">
                <Calendar size={18} />
                <span className="text-sm font-medium">Joined Date</span>
              </div>
              <div className="text-lg text-slate-200">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;