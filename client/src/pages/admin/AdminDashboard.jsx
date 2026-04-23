import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBands, getAlbums, getTracks } from '../../api/mock';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ bands: 0, albums: 0, tracks: 0 });

  useEffect(() => {
    Promise.all([getBands(), getAlbums(), getTracks()]).then(([b, a, t]) => {
      setStats({ bands: b.length, albums: a.length, tracks: t.length });
    });
  }, []);

  const cards = [
    { label: 'Bands', count: stats.bands, to: '/admin/bands', icon: '&#9834;' },
    { label: 'Albums', count: stats.albums, to: '/admin/albums', icon: '&#9835;' },
    { label: 'Tracks', count: stats.tracks, to: '/admin/tracks', icon: '&#9836;' },
  ];

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Manage your music library</p>

      <div className="dash-grid">
        {cards.map((card) => (
          <Link key={card.label} to={card.to} className="dash-card card">
            <div className="dash-card__icon" dangerouslySetInnerHTML={{ __html: card.icon }} />
            <div className="dash-card__count hand">{card.count}</div>
            <div className="dash-card__label mono">{card.label}</div>
          </Link>
        ))}
      </div>

      <style>{`
        .dash-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 16px;
          margin-top: 1rem;
        }
        .dash-card {
          padding: 1.5rem;
          text-align: center;
          text-decoration: none;
          color: inherit;
          transition: all 0.15s;
        }
        .dash-card:hover {
          background: var(--fill);
        }
        .dash-card__icon {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .dash-card__count {
          font-size: 2.5rem;
          line-height: 1;
        }
        .dash-card__label {
          font-size: 0.75rem;
          color: var(--mute);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
}
