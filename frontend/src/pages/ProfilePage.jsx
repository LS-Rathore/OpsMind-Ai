import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../services/api.js';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        setProfile(res.data);
        setName(res.data.name || '');
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setIsSaving(true);
    try {
      const payload = {};
      if (name.trim() !== profile?.name) payload.name = name.trim();
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      if (Object.keys(payload).length === 0) {
        setMessage({ type: 'info', text: 'No changes to save' });
        setIsSaving(false);
        return;
      }

      await api.put('/auth/profile', payload);
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Refresh profile
      const res = await api.get('/auth/me');
      setProfile(res.data);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  const accountAge = profile?.createdAt
    ? Math.floor((Date.now() - new Date(profile.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // Styles
  const pageStyle = {
    minHeight: '100vh',
    backgroundColor: 'var(--bg-primary)',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '48px 24px',
    boxSizing: 'border-box',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
  };

  const containerStyle = {
    width: '100%',
    maxWidth: '560px',
  };

  const backBtnStyle = {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '32px',
    padding: 0,
    transition: 'color 0.2s',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '40px',
  };

  const avatarStyle = {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-light))',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: '700',
    flexShrink: 0,
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    letterSpacing: '-0.025em',
    marginBottom: '4px',
  };

  const subtitleStyle = {
    fontSize: '14px',
    color: 'var(--text-muted)',
  };

  const sectionStyle = {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '16px',
    padding: '28px',
    marginBottom: '24px',
  };

  const sectionTitleStyle = {
    fontFamily: "'Space Mono', ui-monospace, monospace",
    fontSize: '11px',
    color: 'var(--text-muted)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: '20px',
    fontWeight: '600',
  };

  const infoRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid var(--border-subtle)',
  };

  const infoLabelStyle = {
    fontSize: '14px',
    color: 'var(--text-muted)',
    fontWeight: '500',
  };

  const infoValueStyle = {
    fontSize: '14px',
    color: 'var(--text-primary)',
    fontWeight: '600',
  };

  const labelStyle = {
    fontFamily: "'Space Mono', ui-monospace, monospace",
    fontSize: '11px',
    color: 'var(--text-muted)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: '8px',
    display: 'block',
    fontWeight: '500',
  };

  const getInputStyle = (fieldName) => ({
    backgroundColor: 'var(--bg-tertiary)',
    color: 'var(--text-primary)',
    border: '1px solid',
    borderColor: focusedField === fieldName ? 'var(--border-strong)' : 'var(--border-subtle)',
    borderRadius: '10px',
    padding: '12px 16px',
    fontSize: '14px',
    width: '100%',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: '20px',
    transition: 'border-color 0.2s ease',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
  });

  const btnStyle = {
    backgroundColor: 'var(--text-primary)',
    color: 'var(--bg-primary)',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: isSaving ? 'not-allowed' : 'pointer',
    opacity: isSaving ? 0.7 : 1,
    transition: 'all 0.2s ease',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    width: '100%',
  };

  const messageBannerStyle = (type) => ({
    padding: '12px 16px',
    borderRadius: '10px',
    fontSize: '14px',
    marginBottom: '20px',
    fontWeight: '500',
    color: type === 'error' ? 'var(--color-danger)' : type === 'success' ? 'var(--color-success)' : 'var(--color-accent)',
    backgroundColor: type === 'error' ? 'rgba(239, 68, 68, 0.1)' : type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'var(--color-accent-bg)',
    border: `1px solid ${type === 'error' ? 'rgba(239, 68, 68, 0.2)' : type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'var(--color-accent)22'}`,
  });

  const roleBadgeStyle = {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '9999px',
    fontSize: '11px',
    fontWeight: '600',
    fontFamily: "'Space Mono', monospace",
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: profile?.role === 'admin' ? 'var(--color-accent)' : 'var(--color-success)',
    backgroundColor: profile?.role === 'admin' ? 'var(--color-accent-bg)' : 'rgba(16, 185, 129, 0.1)',
    border: `1px solid ${profile?.role === 'admin' ? 'var(--color-accent)33' : 'rgba(16, 185, 129, 0.25)'}`,
  };

  if (!profile) {
    return (
      <div style={pageStyle}>
        <div style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Loading profile...</div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <button
          onClick={() => navigate('/')}
          style={backBtnStyle}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Back to Chat
        </button>

        <div style={headerStyle}>
          <div style={avatarStyle}>
            {profile.name?.charAt(0)?.toUpperCase() || profile.email?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <div style={titleStyle}>{profile.name}</div>
            <div style={subtitleStyle}>{profile.email}</div>
          </div>
        </div>

        {/* Account Info Section */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Account Information</div>
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Role</span>
            <span style={roleBadgeStyle}>{profile.role}</span>
          </div>
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Status</span>
            <span style={{ ...infoValueStyle, color: profile.isActive !== false ? 'var(--color-success)' : 'var(--color-danger)' }}>
              {profile.isActive !== false ? '● Active' : '● Inactive'}
            </span>
          </div>
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Account Age</span>
            <span style={infoValueStyle}>{accountAge} days</span>
          </div>
          <div style={{ ...infoRowStyle, borderBottom: 'none' }}>
            <span style={infoLabelStyle}>Last Login</span>
            <span style={infoValueStyle}>
              {profile.lastLoginAt ? new Date(profile.lastLoginAt).toLocaleString() : '—'}
            </span>
          </div>
        </div>

        {/* Edit Profile Section */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Edit Profile</div>

          {message.text && <div style={messageBannerStyle(message.type)}>{message.text}</div>}

          <form onSubmit={handleSaveProfile}>
            <label style={labelStyle}>Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField('')}
              style={getInputStyle('name')}
              placeholder="Your name"
            />

            <div style={{ ...sectionTitleStyle, marginTop: '8px', marginBottom: '16px' }}>Change Password</div>

            <label style={labelStyle}>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              onFocus={() => setFocusedField('currentPassword')}
              onBlur={() => setFocusedField('')}
              style={getInputStyle('currentPassword')}
              placeholder="••••••••"
            />

            <label style={labelStyle}>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onFocus={() => setFocusedField('newPassword')}
              onBlur={() => setFocusedField('')}
              style={getInputStyle('newPassword')}
              placeholder="••••••••"
            />

            <label style={labelStyle}>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setFocusedField('confirmPassword')}
              onBlur={() => setFocusedField('')}
              style={getInputStyle('confirmPassword')}
              placeholder="••••••••"
            />

            <button type="submit" disabled={isSaving} style={btnStyle}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div style={{ ...sectionStyle, borderColor: 'rgba(239, 68, 68, 0.15)' }}>
          <div style={{ ...sectionTitleStyle, color: 'var(--color-danger)' }}>Danger Zone</div>
          <button
            onClick={logout}
            style={{
              backgroundColor: 'transparent',
              color: 'var(--color-danger)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              width: '100%',
              fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
