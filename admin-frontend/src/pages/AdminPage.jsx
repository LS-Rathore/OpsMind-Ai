import React, { useState, useEffect } from 'react';
import * as adminService from '../services/adminService.js';

const AdminPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsData, healthData] = await Promise.all([
          adminService.getAnalytics(),
          adminService.getSystemHealth(),
        ]);
        setAnalytics(analyticsData);
        setHealth(healthData);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
    marginBottom: '32px',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '40px',
  };

  const cardStyle = {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '4px',
    padding: '24px',
  };

  const cardLabelStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--text-muted)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: '16px',
  };

  const cardValueStyle = {
    fontFamily: 'var(--font-sans)',
    fontSize: '32px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    letterSpacing: '-0.025em',
  };

  const cardSubStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: 'var(--text-muted)',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    marginTop: '8px',
  };

  const sectionTitleStyle = {
    fontFamily: 'var(--font-sans)',
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    letterSpacing: '-0.015em',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  const statusDotStyle = (healthy) => ({
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: healthy ? 'var(--color-success)' : 'var(--color-danger)',
  });

  if (loading) {
    return (
      <div style={{ color: 'var(--text-muted)', fontFamily: 'Inter', fontSize: '16px', padding: '60px 0' }}>
        Loading dashboard...
      </div>
    );
  }

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <div>
      <h1 style={titleStyle}>Dashboard</h1>
      <p style={subtitleStyle}>System Overview</p>

      <div style={gridStyle}>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Total Users</div>
          <div style={cardValueStyle}>{analytics?.totalUsers || 0}</div>
        </div>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Total Documents</div>
          <div style={cardValueStyle}>{analytics?.totalDocuments || 0}</div>
        </div>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Total Queries</div>
          <div style={cardValueStyle}>{analytics?.totalQueries || 0}</div>
        </div>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Monthly Active</div>
          <div style={cardValueStyle}>{analytics?.monthlyActiveUsers || 0}</div>
          <div style={cardSubStyle}>users in last 30 days</div>
        </div>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Daily Active</div>
          <div style={cardValueStyle}>{analytics?.dailyActiveUsers || 0}</div>
          <div style={cardSubStyle}>users in last 24h</div>
        </div>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Vector Chunks</div>
          <div style={cardValueStyle}>{health?.mongodb?.vectorCount || 0}</div>
        </div>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Total Upvotes</div>
          <div style={{ ...cardValueStyle, color: 'var(--color-success)' }}>{analytics?.upvotes || 0}</div>
        </div>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Total Downvotes</div>
          <div style={{ ...cardValueStyle, color: 'var(--color-danger)' }}>{analytics?.downvotes || 0}</div>
        </div>
      </div>

      <div style={sectionTitleStyle}>
        <span style={statusDotStyle(health?.api?.status === 'healthy')} />
        System Status
      </div>
      <div style={gridStyle}>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>API Status</div>
          <div style={{ ...cardValueStyle, fontSize: '18px', color: 'var(--color-success)' }}>
            {health?.api?.status || 'unknown'}
          </div>
          <div style={cardSubStyle}>Uptime: {health?.api?.uptimeFormatted || '—'}</div>
        </div>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Database Size</div>
          <div style={{ ...cardValueStyle, fontSize: '18px' }}>
            {formatBytes(health?.mongodb?.databaseSize)}
          </div>
        </div>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>AI Tokens Used</div>
          <div style={{ ...cardValueStyle, fontSize: '18px' }}>
            {(health?.ai?.totalTokens || 0).toLocaleString()}
          </div>
          <div style={cardSubStyle}>
            Avg response: {health?.ai?.avgResponseTimeMs || 0}ms
          </div>
        </div>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Hallucinations</div>
          <div style={{ ...cardValueStyle, fontSize: '18px', color: (health?.ai?.hallucinationCount || 0) > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>
            {health?.ai?.hallucinationCount || 0}
          </div>
          <div style={cardSubStyle}>of {health?.ai?.totalResponses || 0} responses</div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
