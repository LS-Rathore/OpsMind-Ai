import React, { useState, useEffect } from 'react';
import * as adminService from '../services/adminService.js';

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(''); // 'up' or 'down'

  useEffect(() => {
    fetchFeedbacks();
  }, [filter]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const params = filter ? { type: filter } : {};
      const data = await adminService.getFeedback(params);
      setFeedbacks(data.feedbacks || []);
    } catch (err) {
      console.error('Failed to load feedback:', err);
    } finally {
      setLoading(false);
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
    marginBottom: '32px',
  };

  const filterContainerStyle = {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
  };

  const filterBtnStyle = (active) => ({
    padding: '8px 16px',
    borderRadius: '4px',
    border: '1px solid var(--border-subtle)',
    backgroundColor: active ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
    color: active ? 'var(--text-primary)' : 'var(--text-muted)',
    fontFamily: 'var(--font-sans)',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  });

  const cardStyle = {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const cardHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  };

  const badgeStyle = (type) => ({
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    textTransform: 'uppercase',
    backgroundColor: type === 'up' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
    color: type === 'up' ? '#10b981' : '#ef4444',
    border: `1px solid ${type === 'up' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  });

  const metaStyle = {
    fontSize: '12px',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
  };

  const contentStyle = {
    fontSize: '14px',
    color: 'var(--text-primary)',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
    maxHeight: '150px',
    overflowY: 'auto',
    backgroundColor: 'var(--bg-tertiary)',
    padding: '16px',
    borderRadius: '6px',
    border: '1px solid var(--border-subtle)',
  };

  return (
    <div>
      <h1 style={titleStyle}>User Feedback</h1>
      <p style={subtitleStyle}>Review upvotes and downvotes</p>

      <div style={filterContainerStyle}>
        <button style={filterBtnStyle(filter === '')} onClick={() => setFilter('')}>All Feedback</button>
        <button style={filterBtnStyle(filter === 'up')} onClick={() => setFilter('up')}>👍 Upvotes</button>
        <button style={filterBtnStyle(filter === 'down')} onClick={() => setFilter('down')}>👎 Downvotes</button>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-muted)', fontFamily: 'Inter', fontSize: '14px', padding: '20px 0' }}>Loading feedback...</div>
      ) : feedbacks.length === 0 ? (
        <div style={{ color: 'var(--text-muted)', fontFamily: 'Inter', fontSize: '14px', padding: '40px 0', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px dashed var(--border-subtle)' }}>
          No feedback matches this filter.
        </div>
      ) : (
        feedbacks.map((item) => (
          <div key={item._id} style={cardStyle}>
            <div style={cardHeaderStyle}>
              <div>
                <div style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                  {item.user.name} ({item.user.email})
                </div>
                <div style={metaStyle}>{new Date(item.createdAt).toLocaleString()}</div>
              </div>
              <div style={badgeStyle(item.feedback)}>
                {item.feedback === 'up' ? '👍 Upvote' : '👎 Downvote'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Response</div>
              <div style={contentStyle}>{item.content}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FeedbackPage;
