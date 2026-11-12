import { createSignal, onMount, Show, type Component } from 'solid-js';
import { loadIdentity, type StoredIdentity } from './lib/identity';
import { Onboarding } from './components/Onboarding';

const App: Component = () => {
  const [identity, setIdentity] = createSignal<StoredIdentity | null>(null);
  const [loading, setLoading] = createSignal(true);

  onMount(async () => {
    try {
      const saved = await loadIdentity();
      if (saved) {
        setIdentity(saved);
      }
    } catch (err) {
      console.error('Error loading identity:', err);
    } finally {
      setLoading(false);
    }
  });

  return (
    <div style={{ height: '100%', display: 'flex' }}>
      <Show when={!loading()}>
        <Show
          when={identity()}
          fallback={<Onboarding onComplete={(id) => setIdentity(id)} />}
        >
          {/* Main App Workspace (Logged in via WebCrypto) */}
          <div style={{
            display: 'flex',
            "flex-direction": 'column',
            "align-items": 'center',
            "justify-content": 'center',
            width: '100%',
            height: '100%',
            gap: '16px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              "border-radius": '50%',
              background: identity()?.profile.accentColor || 'var(--accent)',
              display: 'flex',
              "align-items": 'center',
              "justify-content": 'center',
              "font-size": '32px',
              "font-weight": 'bold',
              color: '#fff',
              "box-shadow": '0 8px 24px rgba(0,0,0,0.4)'
            }}>
              {identity()?.profile.displayName.charAt(0).toUpperCase()}
            </div>
            
            <h1 style={{ color: 'var(--text-header)', "font-size": '26px' }}>
              {identity()?.profile.displayName}
            </h1>
            <p style={{
              color: 'var(--text-muted)',
              "font-family": 'monospace',
              background: 'var(--bg-secondary)',
              padding: '6px 14px',
              "border-radius": '6px',
              "font-size": '14px',
              border: '1px solid var(--border)'
            }}>
              {identity()?.profile.handle}
            </p>
            <p style={{
              color: '#22c55e',
              "font-size": '12px',
              "font-weight": '600',
              background: 'rgba(34, 197, 94, 0.1)',
              padding: '4px 10px',
              "border-radius": '4px'
            }}>
              ✓ Cryptographic ECDSA Keypair Active in IndexedDB
            </p>
          </div>
        </Show>
      </Show>
    </div>
  );
};

export default App;