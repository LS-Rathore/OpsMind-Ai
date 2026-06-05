import React, { useState, useEffect } from 'react';
import * as adminService from '../services/adminService.js';

const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionFilter, setActionFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (actionFilter) params.action = actionFilter;
      const result = await adminService.getAuditLogs(params);
      setLogs(result.logs);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, [page, actionFilter]);

  const actionTypes = [
    '', 'document_upload', 'document_delete', 'document_reindex',
    'user_create', 'user_deactivate', 'user_activate', 'user_password_reset',
  ];

  const formatAction = (action) => action.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const titleStyle = {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '32px', fontWeight: '700', color: '#ffffff',
    letterSpacing: '-0.025em', marginBottom: '4px',
  };

  const subtitleStyle = {
    fontFamily: "'Space Mono', ui-monospace, monospace",
    fontSize: '12px', color: '#7d8187', letterSpacing: '0.1em',
    textTransform: 'uppercase', marginBottom: '24px',
  };

  const filterBarStyle = {
    display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '16px',
  };

  const thStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--color-muted-ash)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    textAlign: 'left',
    padding: '12px 16px',
    borderBottom: '1px solid var(--color-border-subtle)',
  };

  const tdStyle = {
    fontFamily: 'var(--font-sans)',
    fontSize: '14px',
    color: 'var(--color-frost-white)',
    padding: '14px 16px',
    borderBottom: '1px solid var(--color-border-subtle)',
    letterSpacing: '-0.015em',
  };

  const actionBadgeStyle = (action) => {
    let color = 'var(--color-muted-ash)';
    let bg = 'var(--color-border-subtle)';
    let border = 'var(--color-border-subtle)';
    
    if (action.includes('CREATE') || action.includes('UPLOAD') || action.includes('ACTIVATE')) {
      color = 'var(--color-success)'; bg = 'var(--color-success)11'; border = 'var(--color-success)44';
    } else if (action.includes('DELETE') || action.includes('DEACTIVATE')) {
      color = 'var(--color-danger)'; bg = 'var(--color-danger)11'; border = 'var(--color-danger)44';
    } else if (action.includes('LOGIN')) {
      color = 'var(--color-electric-blue)'; bg = 'var(--color-electric-blue)11'; border = 'var(--color-electric-blue)44';
    }

    return {
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '11px',
      fontFamily: 'var(--font-mono)',
      color, backgroundColor: bg, border: `1px solid ${border}`,
      textTransform: 'uppercase',
    };
  };

  const filterBtnStyle = (isActive) => ({
    backgroundColor: isActive ? 'var(--color-faded-steel)' : 'transparent',
    color: isActive ? 'var(--color-frost-white)' : 'var(--color-muted-ash)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: '4px',
    padding: '6px 12px',
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  });

  const paginationStyle = {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    gap: '16px', marginTop: '24px',
  };

  const pageBtnStyle = (disabled) => ({
    backgroundColor: 'transparent', color: disabled ? '#474747' : 'var(--color-muted-ash)',
    border: '1px solid var(--color-border-subtle)', borderRadius: '6px',
    padding: '6px 14px', fontSize: '13px', cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'var(--font-sans)', transition: 'all 0.15s ease',
  });

  if (loading && logs.length === 0) {
    return <div style={{ color: 'var(--color-muted-ash)', fontFamily: 'var(--font-sans)', fontSize: '16px', padding: '60px 0' }}>Loading audit logs...</div>;
  }

  return (
    <div>
      <h1 style={titleStyle}>Audit Logs</h1>
      <p style={subtitleStyle}>Activity tracking</p>

      <div style={filterBarStyle}>
        {actionTypes.map((a) => (
          <button
            key={a || 'all'}
            style={filterBtnStyle(actionFilter === a)}
            onClick={() => { setActionFilter(a); setPage(1); }}
          >
            {a ? formatAction(a) : 'All'}
          </button>
        ))}
        <span style={{ fontFamily: "'Space Mono'", fontSize: '11px', color: '#7d8187', marginLeft: 'auto' }}>
          {total} events
        </span>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Timestamp</th>
            <th style={thStyle}>User</th>
            <th style={thStyle}>Action</th>
            <th style={thStyle}>Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ ...tdStyle, textAlign: 'center', color: '#7d8187', padding: '40px' }}>
                No audit logs found
              </td>
            </tr>
          ) : (
            logs.map((log) => (
              <tr key={log._id}>
                <td style={{ ...tdStyle, color: '#7d8187', fontSize: '13px', whiteSpace: 'nowrap' }}>
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td style={tdStyle}>{log.userId?.email || 'System'}</td>
                <td style={tdStyle}>
                  <span style={actionBadgeStyle(log.action)}>{formatAction(log.action)}</span>
                </td>
                <td style={{ ...tdStyle, color: '#7d8187', fontSize: '13px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {log.details ? JSON.stringify(log.details) : '—'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div style={paginationStyle}>
          <button style={pageBtnStyle(page <= 1)} onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>← Prev</button>
          <span style={{ fontFamily: "'Space Mono'", fontSize: '12px', color: '#7d8187' }}>
            Page {page} of {totalPages}
          </span>
          <button style={pageBtnStyle(page >= totalPages)} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next →</button>
        </div>
      )}
    </div>
  );
};

export default AuditLogsPage;
