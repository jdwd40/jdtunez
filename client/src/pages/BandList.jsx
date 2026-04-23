import { useState, useEffect } from 'react';
import ArtworkCard from '../components/ArtworkCard';
import { getBands } from '../api/mock';

export default function BandList() {
  const [bands, setBands] = useState([]);

  useEffect(() => {
    getBands().then(setBands);
  }, []);

  return (
    <div className="container">
      <h1 className="page-title">Bands</h1>
      <p className="page-subtitle">Browse all artists</p>

      {bands.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">&#9835;</div>
          <p>No bands yet.</p>
        </div>
      ) : (
        <div className="bands-grid">
          {bands.map((band) => (
            <ArtworkCard
              key={band.id}
              to={`/bands/${band.id}`}
              title={band.name}
              artPath={band.art_path}
            />
          ))}
        </div>
      )}

      <style>{`
        .bands-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 20px;
        }
        @media (min-width: 768px) {
          .bands-grid {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          }
        }
      `}</style>
    </div>
  );
}
