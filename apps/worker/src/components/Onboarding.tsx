import { createSignal, type Component } from 'solid-js';
import { createIdentity, type StoredIdentity } from '../lib/identity';

interface Props {
  onComplete: (identity: StoredIdentity) => void;
}

const COLORS = ['#5865f2', '#eb459e', '#57f287', '#fee75c', '#ed4245', '#9b59b6'];

export const Onboarding: Component<Props> = (props) => {
  const [name, setName] = createSignal('');
  const [color, setColor] = createSignal(COLORS[0]);
  const [loading, setLoading] = createSignal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!name().trim() || loading()) return;
    setLoading(true);
    try {
      const identity = await createIdentity(name(), color());
      props.onComplete(identity);
    } catch (err) {
      console.error(err);
      alert('Failed to generate cryptographic keys. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: '0',
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      "align-items": 'center',
      "justify-content": 'center',
      padding: '16px'
    }}>
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        "border-radius": '12px',
        width: '100%',
        "max-width": '420px',
        padding: '32px',
        "box-shadow": '0 12px 32px rgba(0,0,0,0.5)'
      }}>
        <div style={{ "text-align": 'center', "margin-bottom": '24px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            "border-radius": '50%',
            background: color(),
            margin: '0 auto 16px',
            display: 'flex',
            "align-items": 'center',
            "justify-content": 'center',
            "font-size": '24px',
            "font-weight": 'bold',
            color: '#fff',
            transition: 'background 0.2s'
          }}>
            {name().trim() ? name().trim().charAt(0).toUpperCase() : '?'}
          </div>
          <h2 style={{ color: 'var(--text-header)', "font-size": '20px', "font-weight": '700' }}>
            Welcome to Hearth
          </h2>
          <p style={{ color: 'var(--text-muted)', "font-size": '13px', "margin-top": '6px' }}>
            No accounts or passwords. Your identity is cryptographically generated on this device.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', "flex-direction": 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', "font-size": '12px', "font-weight": '700', color: 'var(--text-muted)', "margin-bottom": '8px', "text-transform": 'uppercase' }}>
              Display Name
            </label>
            <input
              type="text"
              required
              maxlength="24"
              placeholder="e.g. Alex"
              value={name()}
              onInput={(e) => setName(e.currentTarget.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border)',
                "border-radius": '6px',
                color: 'var(--text-normal)',
                "font-size": '14px',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', "font-size": '12px', "font-weight": '700', color: 'var(--text-muted)', "margin-bottom": '8px', "text-transform": 'uppercase' }}>
              Accent Colour
            </label>
            <div style={{ display: 'flex', gap: '10px', "justify-content": 'center' }}>
              {COLORS.map((c) => (
                <button
                  type="button"
                  onClick={() => setColor(c)}
                  style={{
                    width: '32px',
                    height: '32px',
                    "border-radius": '50%',
                    background: c,
                    border: color() === c ? '3px solid #fff' : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'transform 0.1s'
                  }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!name().trim() || loading()}
            style={{
              width: '100%',
              padding: '12px',
              background: 'var(--accent)',
              color: '#fff',
              border: 'none',
              "border-radius": '6px',
              "font-size": '14px',
              "font-weight": '600',
              cursor: name().trim() && !loading() ? 'pointer' : 'not-allowed',
              opacity: name().trim() && !loading() ? '1' : '0.6',
              "margin-top": '8px'
            }}
          >
            {loading() ? 'Generating Keys...' : 'Enter Hearth'}
          </button>
        </form>
      </div>
    </div>
  );
};