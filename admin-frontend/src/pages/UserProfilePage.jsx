import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as adminService from '../services/adminService.js';

const UserProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const result = await adminService.getUserProfile(id);
        setData(result);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  // Styles
  const backBtnStyle = {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-sans)',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '32px',
    padding: 0,
    transition: 'color 0.2s',
  };

  const titleStyle = {
    fontFamily: 'var(--font-sans)',
    fontSize: '32px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    letterSpacing: '-0.025em',
    marginBottom: '4px',
  };

  const subtitleStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: '13px',
    color: 'var(--text-muted)',
    marginBottom: '8px',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '32px',
  };

  const avatarStyle = {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-light))',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: '700',
    flexShrink: 0,
    fontFamily: 'var(--font-sans)',
  };

  const badgeStyle = (isActive) => ({
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '9999px',
    fontSize: '11px',
    fontWeight: '600',
    fontFamily: 'var(--font-mono)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: isActive ? 'var(--color-success)' : 'var(--color-danger)',
    backgroundColor: isActive ? 'var(--color-success)11' : 'var(--color-danger)11',
    border: `1px solid ${isActive ? 'var(--color-success)44' : 'var(--color-danger)44'}`,
    marginLeft: '12px',
  });

  const roleBadgeStyle = (role) => ({
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '9999px',
    fontSize: '11px',
    fontWeight: '600',
    fontFamily: 'var(--font-mono)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: role === 'admin' ? 'var(--color-accent)' : 'var(--text-muted)',
    backgroundColor: role === 'admin' ? 'var(--color-accent-bg)' : 'var(--bg-tertiary)',
    border: `1px solid ${role === 'admin' ? 'var(--color-accent)33' : 'var(--border-subtle)'}`,
    marginLeft: '8px',
  });

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '32px',
  };

  const statCardStyle = {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
  };

  const statValueStyle = {
    fontFamily: 'var(--font-sans)',
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    letterSpacing: '-0.025em',
    marginBottom: '4px',
  };

  const statLabelStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--text-muted)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  };

  const sectionStyle = {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
  };

  const sectionTitleStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--text-muted)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: '16px',
    fontWeight: '600',
  };

  const thStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--text-muted)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    textAlign: 'left',
    padding: '10px 12px',
    borderBottom: '1px solid var(--border-subtle)',
  };

  const tdStyle = {
    fontFamily: 'var(--font-sans)',
    fontSize: '13px',
    color: 'var(--text-primary)',
    padding: '12px',
    borderBottom: '1px solid var(--border-subtle)',
    letterSpacing: '-0.01em',
  };

  const emptyStyle = {
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-sans)',
    fontSize: '14px',
    textAlign: 'center',
    padding: '24px',
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
    fontFamily: 'var(--font-sans)',
  };

  const infoValueStyle = {
    fontSize: '14px',
    color: 'var(--text-primary)',
    fontWeight: '600',
    fontFamily: 'var(--font-sans)',
  };

  if (loading) {
    return <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', fontSize: '16px', padding: '60px 0' }}>Loading user profile...</div>;
  }

  if (error) {
    return (
      <div>
        <button onClick={() => navigate('/users')} style={backBtnStyle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
          Back to Users
        </button>
        <div style={{ color: 'var(--color-danger)', fontSize: '16px', fontFamily: 'var(--font-sans)' }}>{error}</div>
      </div>
    );
  }

  const { user, stats, recentConversations, recentAuditLogs } = data;
  const accountAge = Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div>
      <button
        onClick={() => navigate('/users')}
        style={backBtnStyle}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        Back to Users
      </button>

      {/* Header */}
      <div style={headerStyle}>
        <div style={avatarStyle}>
          {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={titleStyle}>{user.name}</span>
            <span style={roleBadgeStyle(user.role)}>{user.role}</span>
            <span style={badgeStyle(user.isActive !== false)}>
              {user.isActive !== false ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div style={subtitleStyle}>{user.email}</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={statsGridStyle}>
        <div style={statCardStyle}>
          <div style={statValueStyle}>{stats.totalQueries.toLocaleString()}</div>
          <div style={statLabelStyle}>Total Queries</div>
        </div>
        <div style={statCardStyle}>
          <div style={statValueStyle}>{stats.totalConversations.toLocaleString()}</div>
          <div style={statLabelStyle}>Conversations</div>
        </div>
        <div style={statCardStyle}>
          <div style={statValueStyle}>{stats.totalTokens.toLocaleString()}</div>
          <div style={statLabelStyle}>Tokens Used</div>
        </div>
      </div>

      {/* Account Details */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Account Details</div>
        <div style={infoRowStyle}>
          <span style={infoLabelStyle}>Account Created</span>
          <span style={infoValueStyle}>{new Date(user.createdAt).toLocaleDateString()}</span>
        </div>
        <div style={infoRowStyle}>
          <span style={infoLabelStyle}>Account Age</span>
          <span style={infoValueStyle}>{accountAge} days</span>
        </div>
        <div style={{ ...infoRowStyle, borderBottom: 'none' }}>
          <span style={infoLabelStyle}>Last Login</span>
          <span style={infoValueStyle}>
            {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : '—'}
          </span>
        </div>
      </div>

      {/* Recent Conversations */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Recent Conversations</div>
        {recentConversations.length === 0 ? (
          <div style={emptyStyle}>No conversations yet</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>Title</th>
                <th style={thStyle}>Messages</th>
                <th style={thStyle}>Flags</th>
                <th style={thStyle}>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {recentConversations.map((c) => (
                <tr key={c._id}>
                  <td style={{ ...tdStyle, maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.title}
                  </td>
                  <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>{c.messageCount}</td>
                  <td style={tdStyle}>
                    {c.hasHallucination && (
                      <span style={{
                        fontSize: '10px', fontFamily: 'var(--font-mono)',
                        color: 'var(--color-danger)', backgroundColor: 'var(--color-danger)11',
                        border: '1px solid var(--color-danger)44', padding: '2px 6px', borderRadius: '4px',
                      }}>HALLUCINATION</span>
                    )}
                  </td>
                  <td style={{ ...tdStyle, color: 'var(--text-muted)', fontSize: '12px' }}>
                    {new Date(c.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Recent Audit Logs */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Recent Audit Logs</div>
        {recentAuditLogs.length === 0 ? (
          <div style={emptyStyle}>No audit logs found</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Action</th>
                <th style={thStyle}>By</th>
                <th style={thStyle}>Details</th>
              </tr>
            </thead>
            <tbody>
              {recentAuditLogs.map((log) => (
                <tr key={log._id}>
                  <td style={{ ...tdStyle, color: 'var(--text-muted)', fontSize: '12px', whiteSpace: 'nowrap' }}>
                    {new Date(log.createdAt).toLocaleDateString()}
                  </td>
                  <td style={tdStyle}>
                    <span style={{
                      fontSize: '11px', fontFamily: 'var(--font-mono)',
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                      padding: '2px 8px', borderRadius: '4px',
                      backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)',
                      border: '1px solid var(--border-subtle)',
                    }}>
                      {log.action?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, color: 'var(--text-muted)', fontSize: '12px' }}>
                    {log.userId?.email || 'System'}
                  </td>
                  <td style={{ ...tdStyle, color: 'var(--text-muted)', fontSize: '12px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {log.details ? JSON.stringify(log.details) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
