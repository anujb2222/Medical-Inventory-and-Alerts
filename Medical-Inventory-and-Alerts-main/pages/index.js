import { useState } from 'react';
import { useRouter } from 'next/router';

function Navbar() {
  const router = useRouter();

  return (
    <nav style={{
      width: '100%',
      background: 'linear-gradient(90deg, #2563eb 0%, #1e40af 100%)',
      padding: '1rem 0',
      boxShadow: '0 2px 8px rgba(30,58,138,0.08)',
      marginBottom: '2rem',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000,
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
      }}>
        <span
          style={{
            fontWeight: 'bold',
            fontSize: '1.5rem',
            color: '#fff',
            letterSpacing: '1px',
            cursor: 'pointer',
          }}
          onClick={() => router.push('/')}
        >
          MediTrack
        </span>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <button
            onClick={() => router.push('/')}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: router.pathname === '/' ? 'bold' : 'normal',
              borderBottom: router.pathname === '/' ? '2px solid #10b981' : 'none',
              paddingBottom: '2px',
              transition: 'border-bottom 0.2s',
            }}
          >
            Home
          </button>
          <button
            onClick={() => router.push('/medicines')}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: router.pathname === '/medicines' ? 'bold' : 'normal',
              borderBottom: router.pathname === '/medicines' ? '2px solid #10b981' : 'none',
              paddingBottom: '2px',
              transition: 'border-bottom 0.2s',
            }}
          >
            Medicines
          </button>
        </div>
      </div>
    </nav>
  );
}

export default function Home() {
  const [form, setForm] = useState({ name: '', quantity: '', expiryDate: '' });
  const [editingId, setEditingId] = useState(null);
  const router = useRouter();

  const handleSubmit = async e => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const body = editingId ? { _id: editingId, ...form } : form;

    await fetch('/api/medicines', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setForm({ name: '', quantity: '', expiryDate: '' });
    setEditingId(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #f0f4ff 0%, #e0e7ff 100%)',
      paddingTop: '5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <Navbar />
      <div style={{
        background: 'white',
        padding: '2.5rem 2rem',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(30,58,138,0.10)',
        width: '100%',
        maxWidth: '480px',
        marginTop: '2rem',
        transition: 'box-shadow 0.2s',
      }}>
        <h1 style={{
          fontSize: '2.2rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '1.5rem',
          color: '#1e3a8a',
          letterSpacing: '1px',
        }}>
          Medical Inventory
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Medicine Name"
            required
            style={{
              padding: '1rem',
              borderRadius: '10px',
              border: '1px solid #c7d2fe',
              fontSize: '1.05rem',
              outline: 'none',
              transition: 'box-shadow 0.2s',
              boxShadow: '0 2px 8px rgba(37,99,235,0.03)',
            }}
          />
          <input
            type="number"
            value={form.quantity}
            onChange={e => setForm({ ...form, quantity: e.target.value })}
            placeholder="Quantity"
            required
            style={{
              padding: '1rem',
              borderRadius: '10px',
              border: '1px solid #c7d2fe',
              fontSize: '1.05rem',
              outline: 'none',
              transition: 'box-shadow 0.2s',
              boxShadow: '0 2px 8px rgba(37,99,235,0.03)',
            }}
          />
          <input
            type="date"
            value={form.expiryDate}
            onChange={e => setForm({ ...form, expiryDate: e.target.value })}
            required
            style={{
              padding: '1rem',
              borderRadius: '10px',
              border: '1px solid #c7d2fe',
              fontSize: '1.05rem',
              outline: 'none',
              transition: 'box-shadow 0.2s',
              boxShadow: '0 2px 8px rgba(37,99,235,0.03)',
            }}
          />
          <button
            type="submit"
            style={{
              background: 'linear-gradient(90deg, #2563eb 0%, #1e40af 100%)',
              color: 'white',
              padding: '1rem',
              borderRadius: '10px',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(16,185,129,0.08)',
              transition: 'background 0.2s',
            }}
          >
            {editingId ? 'Update Medicine' : 'Add Medicine'}
          </button>
        </form>

        <button
          onClick={() => router.push('/medicines')}
          style={{
            marginTop: '2rem',
            background: 'linear-gradient(90deg, #10b981 0%, #22d3ee 100%)',
            color: 'white',
            padding: '1rem',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            fontWeight: 'bold',
            fontSize: '1.05rem',
            boxShadow: '0 2px 8px rgba(16,185,129,0.08)',
            transition: 'background 0.2s',
          }}
        >
          View Medicines
        </button>
      </div>
    </div>
  );
}
