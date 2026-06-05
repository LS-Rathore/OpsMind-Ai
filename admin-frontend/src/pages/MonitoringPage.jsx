import React, { useState, useEffect } from 'react';
import * as adminService from '../services/adminService.js';

const MonitoringPage = () => {
  const [conversations, setConversations] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterHallucination, setFilterHallucination] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [expandedConvo, setExpandedConvo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredBtn, setHoveredBtn] = useState(null);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (filterHallucination) params.hallucination = 'true';
      const result = await adminService.getAdminConversations(params);
      setConversations(result.conversations);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchConversations(); }, [page, filterHallucination]);

  const handleExpand = async (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      setExpandedConvo(null);
      return;
    }
    try {
      const convo = await adminService.getAdminConversation(id);
      setExpandedConvo(convo);
      setExpandedId(id);
    } catch (err) {
      console.error('Failed to load conversation:', err);
    }
  };

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
    display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px',
  };

  const filterBtnStyle = (active) => ({
    backgroundColor: active ? '#1f2228' : 'transparent',
    color: active ? '#ffffff' : '#7d8187',
    border: '1px solid #1f2228', borderRadius: '6px',
    padding: '6px 14px', fontSize: '13px', cursor: 'pointer',
    fontFamily: 'Inter', transition: 'all 0.15s ease',
  });

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

  const badgeStyle = (isHallucination) => ({
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    backgroundColor: isHallucination ? 'var(--color-danger)11' : 'var(--color-success)11',
    color: isHallucination ? 'var(--color-danger)' : 'var(--color-success)',
    border: `1px solid ${isHallucination ? 'var(--color-danger)44' : 'var(--color-success)44'}`,
  });

  const expandBtnStyle = (isHovered) => ({
    background: 'transparent',
    border: 'none',
    color: isHovered ? 'var(--color-frost-white)' : 'var(--color-muted-ash)',
    cursor: 'pointer',
    fontSize: '13px',
    fontFamily: 'var(--font-sans)',
    transition: 'color 0.15s ease',
  });

  const hallucinationBadge = {
    display: 'inline-block', padding: '2px 8px', borderRadius: '4px',
    fontSize: '11px', fontFamily: 'var(--font-mono)',
    backgroundColor: 'var(--color-danger)11',
    color: 'var(--color-danger)',
    border: '1px solid var(--color-danger)44',
  };

  const expandedStyle = {
    backgroundColor: 'var(--color-panel-bg)',
    borderBottom: '1px solid var(--color-border-subtle)',
    padding: '16px 24px',
  };

  const msgStyle = (role) => ({
    padding: '12px 16px', marginBottom: '8px', borderRadius: '4px',
    backgroundColor: role === 'user' ? 'var(--color-faded-steel)' : 'transparent',
    border: role === 'assistant' ? '1px solid var(--color-border-subtle)' : 'none',
    fontSize: '14px', lineHeight: '1.5', color: 'var(--color-frost-white)',
    fontFamily: 'var(--font-sans)',
  });

  const msgRoleStyle = {
    fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-muted-ash)',
    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px',
  };

  const metaBadge = (isHallucination) => ({
    fontSize: '10px', fontFamily: 'var(--font-mono)', color: isHallucination ? 'var(--color-danger)' : 'var(--color-muted-ash)',
    marginLeft: '12px',
    backgroundColor: isHallucination ? 'var(--color-danger)11' : 'transparent',
    padding: isHallucination ? '2px 6px' : '0',
    borderRadius: '4px',
  });

  const paginationStyle = {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    gap: '16px', marginTop: '24px',
  };

  const pageBtnStyle = (disabled) => ({
    backgroundColor: 'transparent', color: disabled ? '#474747' : '#7d8187',
    border: '1px solid #1f2228', borderRadius: '6px',
    padding: '6px 14px', fontSize: '13px', cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'Inter', transition: 'all 0.15s ease',
  });

  if (loading && conversations.length === 0) {
    return <div style={{ color: '#7d8187', fontFamily: 'Inter', fontSize: '16px', padding: '60px 0' }}>Loading conversations...</div>;
  }

  return (
    <div>
      <h1 style={titleStyle}>Chat Monitoring</h1>
      <p style={subtitleStyle}>Review user conversations</p>

      <div style={filterBarStyle}>
        <button style={filterBtnStyle(!filterHallucination)} onClick={() => { setFilterHallucination(false); setPage(1); }}>All</button>
        <button style={filterBtnStyle(filterHallucination)} onClick={() => { setFilterHallucination(true); setPage(1); }}>Hallucinations Only</button>
        <span style={{ fontFamily: "'Space Mono'", fontSize: '11px', color: '#7d8187', marginLeft: 'auto' }}>
          {total} conversations
        </span>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>User</th>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Messages</th>
            <th style={thStyle}>Flags</th>
            <th style={thStyle}>Last Activity</th>
          </tr>
        </thead>
        <tbody>
          {conversations.map((c) => (
            <React.Fragment key={c._id}>
              <tr onClick={() => handleExpand(c._id)}>
                <td style={tdStyle}>{c.user?.email || 'Unknown'}</td>
                <td style={{ ...tdStyle, maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {c.title}
                </td>
                <td style={{ ...tdStyle, color: '#7d8187' }}>{c.messageCount}</td>
                <td style={tdStyle}>
                  {c.hasHallucination && <span style={hallucinationBadge}>HALLUCINATION</span>}
                </td>
                <td style={{ ...tdStyle, color: '#7d8187', fontSize: '13px' }}>
                  {new Date(c.updatedAt).toLocaleString()}
                </td>
              </tr>
              {expandedId === c._id && expandedConvo && (
                <tr>
                  <td colSpan="5" style={{ padding: 0 }}>
                    <div style={expandedStyle}>
                      {expandedConvo.messages?.map((m, i) => (
                        <div key={i} style={msgStyle(m.role)}>
                          <div style={msgRoleStyle}>
                            {m.role}
                            {m.role === 'assistant' && m.tokenCount > 0 && (
                              <span style={metaBadge(false)}>{m.tokenCount} tokens · {m.responseTimeMs}ms</span>
                            )}
                            {m.isHallucination && <span style={metaBadge(true)}>HALLUCINATION</span>}
                          </div>
                          {m.content}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <div style={paginationStyle}>
        <button style={pageBtnStyle(page <= 1)} onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>← Prev</button>
        <span style={{ fontFamily: "'Space Mono'", fontSize: '12px', color: '#7d8187' }}>
          Page {page} of {totalPages}
        </span>
        <button style={pageBtnStyle(page >= totalPages)} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next →</button>
      </div>
    </div>
  );
};

export default MonitoringPage;
