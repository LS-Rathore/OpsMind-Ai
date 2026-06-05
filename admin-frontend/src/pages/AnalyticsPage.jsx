import React, { useState, useEffect } from 'react';
import * as adminService from '../services/adminService.js';

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await adminService.getAnalytics();
        setData(result);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

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
    marginBottom: '32px',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '40px',
  };

  const cardStyle = {
    backgroundColor: 'var(--color-panel-bg)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: '4px',
    padding: '24px',
  };

  const cardLabelStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--color-muted-ash)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: '16px',
  };

  const cardValueStyle = {
    fontFamily: 'var(--font-sans)',
    fontSize: '32px',
    fontWeight: '600',
    color: 'var(--color-frost-white)',
    letterSpacing: '-0.025em',
  };

  const sectionTitleStyle = {
    fontFamily: 'var(--font-sans)',
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--color-frost-white)',
    letterSpacing: '-0.015em',
    marginBottom: '20px',
  };

  const listItemStyle = (idx) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid var(--color-border-subtle)',
    fontFamily: 'var(--font-sans)',
    fontSize: '14px',
    color: 'var(--color-frost-white)',
    backgroundColor: 'var(--color-panel-bg)',
  });

  const rankStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    color: 'var(--color-muted-ash)',
    backgroundColor: 'var(--color-faded-steel)',
    padding: '4px 8px',
    borderRadius: '4px',
    marginRight: '12px',
    flexShrink: 0,
  };

  const countStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    color: 'var(--color-muted-ash)',
    letterSpacing: '0.05em',
  };

  if (loading) {
    return <div style={{ color: '#7d8187', fontFamily: 'Inter', fontSize: '16px', padding: '60px 0' }}>Loading analytics...</div>;
  }

  return (
    <div>
      <h1 style={titleStyle}>Analytics</h1>
      <p style={subtitleStyle}>Usage metrics and trends</p>

      <div style={gridStyle}>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Total Queries</div>
          <div style={cardValueStyle}>{data?.totalQueries || 0}</div>
        </div>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Monthly Active Users</div>
          <div style={cardValueStyle}>{data?.monthlyActiveUsers || 0}</div>
        </div>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Daily Active Users</div>
          <div style={cardValueStyle}>{data?.dailyActiveUsers || 0}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div>
          <h3 style={sectionTitleStyle}>Most Asked Questions</h3>
          <div style={{ backgroundColor: '#10100f', border: '1px solid #1f2228', borderRadius: '8px', overflow: 'hidden' }}>
            {(data?.topQuestions || []).length === 0 ? (
              <div style={{ padding: '24px', color: '#7d8187', fontSize: '14px', textAlign: 'center' }}>No data yet</div>
            ) : (
              data.topQuestions.map((q, i) => (
                <div key={i} style={listItemStyle(i)}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', overflow: 'hidden' }}>
                    <span style={rankStyle}>{i + 1}.</span>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{q.question}</span>
                  </div>
                  <span style={countStyle}>{q.count}×</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h3 style={sectionTitleStyle}>Most Used Documents</h3>
          <div style={{ backgroundColor: '#10100f', border: '1px solid #1f2228', borderRadius: '8px', overflow: 'hidden' }}>
            {(data?.topDocuments || []).length === 0 ? (
              <div style={{ padding: '24px', color: '#7d8187', fontSize: '14px', textAlign: 'center' }}>No data yet</div>
            ) : (
              data.topDocuments.map((d, i) => (
                <div key={i} style={listItemStyle(i)}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', overflow: 'hidden' }}>
                    <span style={rankStyle}>{i + 1}.</span>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.filename}</span>
                  </div>
                  <span style={countStyle}>{d.count}×</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
