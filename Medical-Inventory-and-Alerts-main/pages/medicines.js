import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Navbar Component
function Navbar() {
  const router = useRouter();

  return (
    <nav style={{
      width: '100%',
      background: 'linear-gradient(90deg, #2563eb 0%, #1e40af 100%)',
      padding: '1rem 0',
      boxShadow: '0 2px 8px rgba(30,58,138,0.08)',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000,
      marginBottom: '2rem',
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

// Utility functions for expiry checks
function isExpired(expiryDate) {
  return new Date(expiryDate) < new Date();
}

function isExpiringSoon(expiryDate, days = 7) {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry - now;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays > 0 && diffDays <= days;
}

export default function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [editMedicine, setEditMedicine] = useState(null);
  const [showOnlyExp, setShowOnlyExp] = useState(false); // Toggle state
  const router = useRouter();

  useEffect(() => {
    fetchMedicines();
    // eslint-disable-next-line
  }, []);

  const fetchMedicines = async () => {
    const res = await fetch('/api/medicines');
    const data = await res.json();
    setMedicines(data.data);
    setFiltered(data.data);
  };

  useEffect(() => {
    const filteredMeds = medicines.filter(med =>
      med.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(filteredMeds);
  }, [search, medicines]);

  const handleDelete = async id => {
    if (!confirm('Are you sure you want to delete this medicine?')) return;
    await fetch(`/api/medicines`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: id }),
    });
    fetchMedicines();
  };

  const handleEdit = id => {
    const medicine = medicines.find(med => med._id === id);
    setEditMedicine({ ...medicine });
  };

  const handleSave = async () => {
    await fetch('/api/medicines', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editMedicine),
    });
    setEditMedicine(null);
    fetchMedicines();
  };

  const handleChange = (e) => {
    setEditMedicine({
      ...editMedicine,
      [e.target.name]: e.target.value,
    });
  };

  // Compute the view based on toggle
  const getDisplayMeds = () => {
    if (showOnlyExp) {
      // Show only expired and expiring soon
      return filtered.filter(
        med => isExpired(med.expiryDate) || isExpiringSoon(med.expiryDate)
      );
    }
    // Show all (filtered by search)
    return filtered;
  };

  // For notifications and badges in "showOnlyExp" mode
  const expiredMeds = getDisplayMeds().filter(med => isExpired(med.expiryDate));
  const expiringSoonMeds = getDisplayMeds().filter(med => isExpiringSoon(med.expiryDate));

  // Edit Form
  if (editMedicine) {
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
          maxWidth: '480px',
          width: '100%',
          background: 'white',
          margin: '2rem auto',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(30,58,138,0.10)',
          padding: '2.5rem 2rem',
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#1e3a8a',
            marginBottom: '2rem',
            letterSpacing: '1px',
          }}>
            Edit Medicine
          </h1>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#1e3a8a', fontWeight: 'bold' }}>Medicine Name</label>
          <input
            type="text"
            name="name"
            value={editMedicine.name}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '10px',
              border: '1px solid #c7d2fe',
              marginBottom: '1.2rem',
              fontSize: '1.05rem',
              outline: 'none',
              boxShadow: '0 2px 8px rgba(37,99,235,0.03)',
            }}
          />
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#1e3a8a', fontWeight: 'bold' }}>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={editMedicine.quantity}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '10px',
              border: '1px solid #c7d2fe',
              marginBottom: '1.2rem',
              fontSize: '1.05rem',
              outline: 'none',
              boxShadow: '0 2px 8px rgba(37,99,235,0.03)',
            }}
          />
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#1e3a8a', fontWeight: 'bold' }}>Expiry Date</label>
          <input
            type="date"
            name="expiryDate"
            value={editMedicine.expiryDate}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '10px',
              border: '1px solid #c7d2fe',
              marginBottom: '1.2rem',
              fontSize: '1.05rem',
              outline: 'none',
              boxShadow: '0 2px 8px rgba(37,99,235,0.03)',
            }}
          />
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button
              onClick={handleSave}
              style={{
                background: 'linear-gradient(90deg, #10b981 0%, #22d3ee 100%)',
                color: 'white',
                padding: '0.9rem 2rem',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1.05rem',
                boxShadow: '0 2px 8px rgba(16,185,129,0.08)',
                transition: 'background 0.2s',
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Medicines List
  const displayMeds = getDisplayMeds();

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
      <div style={{ maxWidth: '900px', width: '100%', margin: '2rem auto' }}>
        <h1 style={{
          fontSize: '2.2rem',
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#1e3a8a',
          marginBottom: '2rem',
          letterSpacing: '1px',
        }}>
          Medicine List
        </h1>

        {/* Toggle Button */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setShowOnlyExp(prev => !prev)}
            style={{
              background: showOnlyExp
                ? 'linear-gradient(90deg, #2563eb 0%, #1e40af 100%)'
                : 'linear-gradient(90deg, #10b981 0%, #22d3ee 100%)',
              color: 'white',
              padding: '0.8rem 1.5rem',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1.05rem',
              boxShadow: '0 2px 8px rgba(16,185,129,0.08)',
              transition: 'background 0.2s',
              marginRight: '0.5rem',
            }}
          >
            {showOnlyExp
              ? 'Show All Medicines'
              : 'Show Only Expired/Expiring Soon'}
          </button>
        </div>

        {/* Show notifications and badges only in "showOnlyExp" mode */}
        {showOnlyExp && expiredMeds.length > 0 && (
          <div style={{
            background: '#fee2e2',
            color: '#b91c1c',
            border: '1px solid #fca5a5',
            borderRadius: '10px',
            padding: '1rem',
            marginBottom: '1.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: '1.1rem',
          }}>
            ⚠️ {expiredMeds.length} medicine{expiredMeds.length > 1 ? 's have' : ' has'} expired!
          </div>
        )}
        {showOnlyExp && expiringSoonMeds.length > 0 && (
          <div style={{
            background: '#fef9c3',
            color: '#a16207',
            border: '1px solid #fde68a',
            borderRadius: '10px',
            padding: '1rem',
            marginBottom: '1.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: '1.05rem',
          }}>
            ⏰ {expiringSoonMeds.length} medicine{expiringSoonMeds.length > 1 ? 's are' : ' is'} expiring soon!
          </div>
        )}

        {/* Search */}
        <div style={{ maxWidth: '500px', margin: '0 auto 2rem auto' }}>
          <input
            type="text"
            placeholder="Search by medicine name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '10px',
              border: '1px solid #c7d2fe',
              fontSize: '1.05rem',
              outline: 'none',
              marginBottom: '1.5rem',
              boxShadow: '0 2px 8px rgba(37,99,235,0.03)',
            }}
          />
        </div>

        {/* Medicine Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
          {displayMeds.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '1.1rem' }}>
              {showOnlyExp
                ? 'No expired or expiring soon medicines found.'
                : 'No medicines found.'}
            </p>
          ) : (
            displayMeds.map(med => {
              const expired = isExpired(med.expiryDate);
              const expiringSoon = isExpiringSoon(med.expiryDate);
              return (
                <div
                  key={med._id}
                  style={{
                    padding: '1.5rem',
                    background: showOnlyExp
                      ? (expired
                        ? '#fee2e2'
                        : expiringSoon
                        ? '#fef9c3'
                        : 'white')
                      : 'white',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(30,58,138,0.10)',
                    border: showOnlyExp
                      ? (expired
                        ? '1.5px solid #ef4444'
                        : expiringSoon
                        ? '1.5px solid #facc15'
                        : '1px solid #e0e7ff')
                      : '1px solid #e0e7ff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                  }}
                >
                  {/* Expiry Badge only in showOnlyExp mode */}
                  {showOnlyExp && expired && (
                    <span style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: '#ef4444',
                      color: 'white',
                      borderRadius: '8px',
                      padding: '0.2rem 0.7rem',
                      fontWeight: 'bold',
                      fontSize: '0.95rem',
                      letterSpacing: '1px',
                    }}>
                      Expired
                    </span>
                  )}
                  {showOnlyExp && !expired && expiringSoon && (
                    <span style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: '#facc15',
                      color: '#78350f',
                      borderRadius: '8px',
                      padding: '0.2rem 0.7rem',
                      fontWeight: 'bold',
                      fontSize: '0.95rem',
                      letterSpacing: '1px',
                    }}>
                      Expiring Soon
                    </span>
                  )}
                  <div>
                    <h3 style={{ margin: 0, color: '#2563eb', fontWeight: 'bold' }}>{med.name}</h3>
                    <p style={{ margin: '0.5rem 0 0.2rem 0', color: '#64748b' }}>Quantity: <span style={{ color: '#0f172a', fontWeight: 'bold' }}>{med.quantity}</span></p>
                    <p style={{ margin: 0, color: '#64748b' }}>Expiry: <span style={{ color: '#0f172a', fontWeight: 'bold' }}>{new Date(med.expiryDate).toLocaleDateString()}</span></p>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.2rem' }}>
                    <button
                      onClick={() => handleEdit(med._id)}
                      style={{
                        padding: '0.6rem 1.2rem',
                        background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        boxShadow: '0 2px 8px rgba(59,130,246,0.08)',
                        transition: 'background 0.2s',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(med._id)}
                      style={{
                        padding: '0.6rem 1.2rem',
                        background: 'linear-gradient(90deg, #ef4444 0%, #f87171 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        boxShadow: '0 2px 8px rgba(239,68,68,0.08)',
                        transition: 'background 0.2s',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link href="/">
            <button
              style={{
                background: 'linear-gradient(90deg, #10b981 0%, #22d3ee 100%)',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1.05rem',
                boxShadow: '0 2px 8px rgba(16,185,129,0.08)',
                transition: 'background 0.2s',
              }}
            >
              Back to Form
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
