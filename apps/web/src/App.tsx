import type { Component } from 'solid-js';

const App: Component = () => {
  return (
    <div style={{
      display: 'flex',
      "align-items": 'center',
      "justify-content": 'center',
      height: '100%',
      "flex-direction": 'column',
      gap: '16px'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        "background-color": 'var(--accent)',
        "border-radius": '24px',
        display: 'flex',
        "align-items": 'center',
        "justify-content": 'center',
        "box-shadow": '0 8px 24px rgba(0,0,0,0.3)'
      }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.34 5L2 22l5.2-1.31C8.6 21.49 10.25 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
        </svg>
      </div>
      <h1 style={{ color: 'var(--text-header)', "font-size": '24px', "font-weight": '700' }}>
        Hearth
      </h1>
      <p style={{ color: 'var(--text-muted)', "font-size": '14px', "max-width": '360px', "text-align": 'center' }}>
        Discord-style real-time chat. No logins, no passwords, 100% serverless on Cloudflare.
      </p>
      <div style={{
        "background-color": 'var(--bg-secondary)',
        padding: '8px 16px',
        "border-radius": '8px',
        "font-size": '12px',
        color: '#22c55e',
        "font-weight": '600'
      }}>
        ● Solid.js Frontend Running Cleanly
      </div>
    </div>
  );
};

export default App;