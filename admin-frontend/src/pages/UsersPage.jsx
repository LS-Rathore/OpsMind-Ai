import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as adminService from '../services/adminService.js';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [tempPassword, setTempPassword] = useState('');
  const [error, setError] = useState('');
  const [hoveredAction, setHoveredAction] = useState({ id: null, type: null });
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setTempPassword('');
    try {
      const result = await adminService.createUser(form);
      setTempPassword(result.tempPassword);
      setForm({ name: '', email: '', password: '', role: 'user' });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create user');
    }
  };

  const handleToggleActive = async (user) => {
    try {
      if (user.isActive) {
        await adminService.deactivateUser(user._id);
      } else {
        await adminService.activateUser(user._id);
      }
      fetchUsers();
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  const handleResetPassword = async (userId) => {
    try {
      const result = await adminService.resetPassword(userId);
      alert(`New temporary password: ${result.tempPassword}`);
    } catch (err) {
      console.error('Failed to reset password:', err);
    }
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
    fontSize: '12px',
    color: 'var(--text-muted)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: '24px',
  };

  const btnStyle = (variant = 'default') => ({
    backgroundColor: variant === 'primary' ? 'var(--text-primary)' : 'transparent',
    color: variant === 'primary' ? 'var(--bg-primary)' : 'var(--text-muted)',
    border: variant === 'primary' ? 'none' : '1px solid var(--border-subtle)',
    borderRadius: '6px',
    padding: '8px 16px',
    fontFamily: 'var(--font-sans)',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  });

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '16px',
  };

  const thStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--text-muted)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    textAlign: 'left',
    padding: '12px 16px',
    borderBottom: '1px solid var(--border-subtle)',
  };

  const tdStyle = {
    fontFamily: 'var(--font-sans)',
    fontSize: '14px',
    color: 'var(--text-primary)',
    padding: '14px 16px',
    borderBottom: '1px solid var(--border-subtle)',
    letterSpacing: '-0.015em',
  };

  const statusBadge = (active) => ({
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: '9999px',
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    letterSpacing: '0.05em',
    color: active ? 'var(--color-success)' : 'var(--color-danger)',
    border: `1px solid ${active ? 'var(--color-success)' : 'var(--color-danger)'}44`,
    backgroundColor: active ? 'var(--color-success)11' : 'var(--color-danger)11',
  });

  const getActionBtnStyle = (id, type) => {
    const isHovered = hoveredAction.id === id && hoveredAction.type === type;
    return {
      background: 'transparent', border: 'none',
      color: isHovered ? 'var(--text-primary)' : 'var(--text-muted)',
      cursor: 'pointer', fontSize: '13px',
      fontFamily: 'var(--font-sans)', padding: '4px 8px',
      transition: 'color 0.15s ease',
    };
  };

  const backdropStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  };

  const modalStyle = {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-subtle)',
    width: '420px', padding: '32px', boxSizing: 'border-box',
    borderRadius: '8px',
  };

  const inputStyle = {
    width: '100%',
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-primary)',
    padding: '10px 14px',
    borderRadius: '6px',
    fontFamily: 'var(--font-sans)',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: '12px',
  };

  const selectStyle = { ...inputStyle, cursor: 'pointer' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={titleStyle}>Users</h1>
          <p style={subtitleStyle}>Manage user accounts</p>
        </div>
        <button onClick={() => { setShowModal(true); setTempPassword(''); setError(''); }} style={btnStyle('primary')}>
          Create User
        </button>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Role</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Last Login</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td style={tdStyle}>{u.name}</td>
              <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>{u.email}</td>
              <td style={tdStyle}>
                <span style={{ fontFamily: "'Space Mono'", fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {u.role}
                </span>
              </td>
              <td style={tdStyle}>
                <span style={statusBadge(u.isActive !== false)}>
                  {u.isActive !== false ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td style={{ ...tdStyle, color: 'var(--text-muted)', fontSize: '13px' }}>
                {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : '—'}
              </td>
              <td style={tdStyle}>
                <button
                  onClick={() => navigate(`/users/${u._id}`)}
                  onMouseEnter={() => setHoveredAction({ id: u._id, type: 'view' })}
                  onMouseLeave={() => setHoveredAction({ id: null, type: null })}
                  style={getActionBtnStyle(u._id, 'view')}
                >
                  View
                </button>
                <button
                  onClick={() => handleToggleActive(u)}
                  onMouseEnter={() => setHoveredAction({ id: u._id, type: 'toggle' })}
                  onMouseLeave={() => setHoveredAction({ id: null, type: null })}
                  style={getActionBtnStyle(u._id, 'toggle')}
                >
                  {u.isActive !== false ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleResetPassword(u._id)}
                  onMouseEnter={() => setHoveredAction({ id: u._id, type: 'reset' })}
                  onMouseLeave={() => setHoveredAction({ id: null, type: null })}
                  style={getActionBtnStyle(u._id, 'reset')}
                >
                  Reset PW
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div style={backdropStyle} onClick={() => setShowModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ ...titleStyle, fontSize: '20px', marginBottom: '20px' }}>Create User</h2>
            <form onSubmit={handleCreate}>
              <input style={inputStyle} placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <input style={inputStyle} placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <input style={inputStyle} placeholder="Password (optional, auto-generated)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <select style={selectStyle} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {error && <div style={{ color: 'var(--color-danger)', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}
              {tempPassword && (
                <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '12px', marginBottom: '12px', borderRadius: '4px', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Temp Password: </span>
                  <span style={{ color: 'var(--color-success)', fontFamily: "'Space Mono'" }}>{tempPassword}</span>
                </div>
              )}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} style={btnStyle()}>Cancel</button>
                <button type="submit" style={btnStyle('primary')}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
