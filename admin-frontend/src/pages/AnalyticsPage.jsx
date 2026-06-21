import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
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

  const sectionTitleStyle = {
    fontFamily: 'var(--font-sans)',
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    letterSpacing: '-0.015em',
    marginBottom: '20px',
  };

  const listItemStyle = (idx) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid var(--border-subtle)',
    fontFamily: 'var(--font-sans)',
    fontSize: '14px',
    color: 'var(--text-primary)',
    backgroundColor: 'var(--bg-secondary)',
  });

  const rankStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    color: 'var(--text-muted)',
    backgroundColor: 'var(--bg-tertiary)',
    padding: '4px 8px',
    borderRadius: '4px',
    marginRight: '12px',
    flexShrink: 0,
  };

  const countStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    color: 'var(--text-muted)',
    letterSpacing: '0.05em',
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-medium)',
          padding: '12px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          fontFamily: 'var(--font-sans)',
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
          <p style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: '600' }}>
            {payload[0].value} <span style={{ color: 'var(--text-faint)', fontSize: '14px', fontWeight: '400' }}>{payload[0].name}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const feedbackData = [
    { name: 'Upvotes', value: data?.upvotes || 0, color: '#10b981' },
    { name: 'Downvotes', value: data?.downvotes || 0, color: '#ef4444' }
  ];

  // If no feedback at all, render a default grey slice so pie chart isn't empty
  if (feedbackData[0].value === 0 && feedbackData[1].value === 0) {
    feedbackData.push({ name: 'No Data', value: 1, color: '#1f2228' });
  }

  const chartCardStyle = {
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '8px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
  };

  if (loading) {
    return <div style={{ color: 'var(--text-muted)', fontFamily: 'Inter', fontSize: '16px', padding: '60px 0' }}>Loading analytics...</div>;
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

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div style={chartCardStyle}>
          <h3 style={sectionTitleStyle}>Queries Over Time (Last 7 Days)</h3>
          <div style={{ height: '300px', width: '100%', marginTop: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.queriesOverTime || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2228" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#7d8187" 
                  tick={{ fill: '#7d8187', fontSize: 12, fontFamily: 'Inter' }} 
                  axisLine={false} 
                  tickLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="#7d8187" 
                  tick={{ fill: '#7d8187', fontSize: 12, fontFamily: 'Inter' }} 
                  axisLine={false} 
                  tickLine={false} 
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  name="Queries" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4, stroke: '#0c0c0b' }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={chartCardStyle}>
          <h3 style={sectionTitleStyle}>AI Response Feedback</h3>
          <div style={{ height: '300px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={feedbackData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {feedbackData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length && payload[0].name !== 'No Data') {
                      return (
                        <div style={{ backgroundColor: '#1f2228', border: '1px solid #333', padding: '12px', borderRadius: '8px', color: '#fff', fontFamily: 'Inter' }}>
                          <span style={{ color: payload[0].payload.color, fontWeight: '600', marginRight: '8px' }}>{payload[0].name}</span>
                          <span>{payload[0].value}</span>
                        </div>
                      );
                    }
                    return null;
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Inter', fontSize: '13px', color: 'var(--text-muted)' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} /> Upvotes
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Inter', fontSize: '13px', color: 'var(--text-muted)' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} /> Downvotes
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={chartCardStyle}>
          <h3 style={sectionTitleStyle}>Most Used Documents</h3>
          <div style={{ height: '300px', width: '100%', marginTop: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.topDocuments || []} layout="vertical" margin={{ left: 50, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2228" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="filename" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#f8fafc', fontSize: 13, fontFamily: 'Inter' }}
                  width={150}
                  tickFormatter={(value) => value.length > 20 ? value.substring(0, 20) + '...' : value}
                />
                <Tooltip 
                  cursor={{ fill: 'var(--border-subtle)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-medium)', padding: '12px', borderRadius: '8px', color: 'var(--text-primary)', fontFamily: 'Inter' }}>
                          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>{payload[0].payload.filename}</div>
                          <div style={{ fontSize: '16px', fontWeight: '600' }}>{payload[0].value} <span style={{ fontSize: '13px', color: 'var(--text-faint)', fontWeight: '400' }}>Uses</span></div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
            {(data?.topDocuments || []).length === 0 && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '14px', fontFamily: 'Inter' }}>No document data yet</div>
            )}
          </div>
        </div>

        <div style={chartCardStyle}>
          <h3 style={sectionTitleStyle}>Most Asked Questions</h3>
          <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '300px' }}>
            {(data?.topQuestions || []).length === 0 ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>No data yet</div>
            ) : (
              <div style={{ overflowY: 'auto', paddingRight: '8px' }}>
                {data.topQuestions.map((q, i) => (
                  <div key={i} style={listItemStyle(i)}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', overflow: 'hidden' }}>
                      <span style={rankStyle}>{i + 1}.</span>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{q.question}</span>
                    </div>
                    <span style={countStyle}>{q.count}×</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
