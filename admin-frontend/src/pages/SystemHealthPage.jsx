import React, { useState, useEffect } from 'react';
import * as adminService from '../services/adminService.js';

const SystemHealthPage = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [isRefreshHovered, setIsRefreshHovered] = useState(false);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const data = await adminService.getSystemHealth();
      setHealth(data);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Failed to load system health:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHealth(); }, []);

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const titleStyle = {
    fontFamily: 'var(--font-sans)',
    fontSize: '32px',
    fontWeight: '700',
    color: 'var(--color-frost-white)',
    letterSpacing: '-0.025em',
    marginBottom: '4px',
  };

  const subtitleStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    color: 'var(--color-muted-ash)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  };

  const sectionTitleStyle = {
    fontFamily: 'var(--font-sans)',
    fontSize: '18px',
    fontWeight: '500',
    color: 'var(--color-frost-white)',
    letterSpacing: '-0.015em',
    marginBottom: '20px',
    marginTop: '48px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const gridStyle4 = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
  };

  const cardStyle = {
    backgroundColor: '#111213', // Slightly lighter than base for the cards
    border: '1px solid #1a1c1e', // Very subtle border
    borderRadius: '4px',
    padding: '20px 24px',
    position: 'relative',
  };

  const cardLabelStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: 'var(--color-muted-ash)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const cardValueStyle = {
    fontFamily: 'var(--font-sans)',
    fontSize: '28px',
    fontWeight: '500',
    color: 'var(--color-frost-white)',
    letterSpacing: '-0.02em',
  };

  const cardSubStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: 'var(--color-muted-ash)',
    marginTop: '8px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  };

  const statusDotStyle = {
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-electric-blue)',
  };

  const refreshBtnStyle = {
    backgroundColor: 'transparent',
    color: isRefreshHovered ? 'var(--color-frost-white)' : 'var(--color-muted-ash)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: '999px',
    padding: '8px 16px',
    fontSize: '10px',
    cursor: 'pointer',
    fontFamily: 'var(--font-mono)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  if (loading && !health) {
    return <div style={{ color: 'var(--color-muted-ash)', fontFamily: 'var(--font-sans)', fontSize: '16px', padding: '60px 0' }}>Loading system health...</div>;
  }

  return (
    <div style={{ paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={titleStyle}>System Health</h1>
          <p style={subtitleStyle}>Infrastructure monitoring</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={fetchHealth}
            onMouseEnter={() => setIsRefreshHovered(true)}
            onMouseLeave={() => setIsRefreshHovered(false)}
            style={refreshBtnStyle}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"></polyline>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
            Reload Data
          </button>
          
          {/* Settings Icon */}
          <button style={{ background: 'none', border: 'none', color: 'var(--color-muted-ash)', cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
          
          {/* Mock Profile Icon block */}
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#1a1c1e', border: '1px solid #2a2c2e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7d8187" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
          </div>
        </div>
      </div>

      <h3 style={{ ...sectionTitleStyle, marginTop: '48px' }}>
        <span style={statusDotStyle} />
        API Health
      </h3>
      <div style={gridStyle4}>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Status</div>
          <div style={{ ...cardValueStyle, fontSize: '24px', color: health?.api?.status === 'healthy' ? 'var(--color-frost-white)' : 'var(--color-danger)' }}>
            {(health?.api?.status || 'Unknown').toUpperCase()}
          </div>
        </div>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Uptime</div>
          <div style={{ ...cardValueStyle, fontSize: '24px' }}>{health?.api?.uptimeFormatted || '—'}</div>
          <div style={cardSubStyle}>{(health?.api?.uptimeSeconds || 0).toLocaleString()}s</div>
        </div>
      </div>

      <h3 style={sectionTitleStyle}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
        AI Usage
      </h3>
      <div style={gridStyle4}>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Tokens Used</div>
          <div style={cardValueStyle}>{(health?.ai?.totalTokens || 0).toLocaleString()}</div>
        </div>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Avg Response Time</div>
          <div style={cardValueStyle}>{health?.ai?.avgResponseTimeMs || 0}<span style={{ fontSize: '12px', color: 'var(--color-muted-ash)', marginLeft: '4px' }}>MS</span></div>
        </div>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Total Responses</div>
          <div style={cardValueStyle}>{health?.ai?.totalResponses || 0}</div>
        </div>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>
            Hallucinations
            { (health?.ai?.hallucinationCount || 0) > 0 && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            )}
          </div>
          <div style={{ ...cardValueStyle, color: (health?.ai?.hallucinationCount || 0) > 0 ? 'var(--color-danger)' : 'var(--color-frost-white)' }}>
            {health?.ai?.hallucinationCount || 0}
          </div>
          <div style={{ ...cardSubStyle, color: (health?.ai?.hallucinationCount || 0) > 0 ? 'var(--color-danger)' : 'var(--color-muted-ash)' }}>
            {health?.ai?.totalResponses > 0
              ? `${((health.ai.hallucinationCount / health.ai.totalResponses) * 100).toFixed(1)}% rate`
              : '0.0% rate'}
          </div>
        </div>
      </div>

      <h3 style={sectionTitleStyle}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
        </svg>
        MongoDB
      </h3>
      <div style={gridStyle4}>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Vector Count</div>
          <div style={cardValueStyle}>{(health?.mongodb?.vectorCount || 0).toLocaleString()}</div>
          <div style={cardSubStyle}>chunks indexed</div>
        </div>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Database Size</div>
          <div style={cardValueStyle}>{(health?.mongodb?.databaseSize ? (health.mongodb.databaseSize / 1024 / 1024).toFixed(1) : 0)}<span style={{ fontSize: '12px', color: 'var(--color-muted-ash)', marginLeft: '4px' }}>MB</span></div>
        </div>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Storage Size</div>
          <div style={cardValueStyle}>{(health?.mongodb?.storageSize ? (health.mongodb.storageSize / 1024 / 1024).toFixed(1) : 0)}<span style={{ fontSize: '12px', color: 'var(--color-muted-ash)', marginLeft: '4px' }}>MB</span></div>
        </div>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Documents</div>
          <div style={cardValueStyle}>{health?.mongodb?.documentCount || 0}</div>
          <div style={cardSubStyle}>PDF files</div>
        </div>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Users</div>
          <div style={cardValueStyle}>{health?.mongodb?.userCount || 0}</div>
        </div>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Collections</div>
          <div style={cardValueStyle}>{health?.mongodb?.collections || 0}</div>
        </div>
        
        {/* Spanning Chart Placeholder */}
        <div style={{ ...cardStyle, gridColumn: 'span 2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed #1f2228' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted-ash)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '12px' }}>
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
          <div style={{ ...cardSubStyle, marginTop: 0 }}>Resource Allocation Map</div>
        </div>
      </div>
      
      {/* Bottom Status Bar */}
      <div style={{ 
        position: 'fixed', bottom: 0, left: '240px', right: 0, 
        padding: '12px 48px', borderTop: '1px solid var(--color-border-subtle)', 
        backgroundColor: 'var(--color-deep-midnight)', display: 'flex', 
        justifyContent: 'space-between', fontFamily: 'var(--font-mono)', 
        fontSize: '9px', color: 'var(--color-muted-ash)', textTransform: 'uppercase', letterSpacing: '0.05em'
      }}>
        <div>System Cluster: <span style={{ color: 'var(--color-frost-white)' }}>OPS-US-EAST-1</span> &nbsp;&nbsp; Load: <span style={{ color: 'var(--color-frost-white)' }}>0.42</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>Last Sync: {lastRefresh ? lastRefresh.toISOString().replace('T', ' ').substring(0, 19) + ' UTC' : 'Pending...'}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-frost-white)' }}>
            <span style={statusDotStyle} /> CONNECTED
          </span>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthPage;
