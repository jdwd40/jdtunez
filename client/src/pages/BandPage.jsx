import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ArtworkCard from '../components/ArtworkCard';
import PlaceholderArt from '../components/PlaceholderArt';
import { getBand, getBandAlbums } from '../api/mock';

export default function BandPage() {
  const { bandId } = useParams();
  const [band, setBand] = useState(null);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    getBand(bandId).then(setBand);
    getBandAlbums(bandId).then(setAlbums);
  }, [bandId]);

  if (!band) {
    return (
      <div className="container">
        <div className="empty-state">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Band header */}
      <div className="band-header">
        <div className="band-header__art">
          {band.art_path ? (
            <img
              src={`/api/media/images/${band.art_path}`}
              alt={band.name}
              className="art-image"
            />
          ) : (
            <PlaceholderArt
              name={band.name}
              style={{ borderRadius: 'var(--radius)', border: '1.5px solid var(--line)' }}
            />
          )}
        </div>
        <div className="band-header__info">
          <h1 className="page-title" style={{ marginTop: 0 }}>{band.name}</h1>
          <p className="page-subtitle">{albums.length} album{albums.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Albums */}
      <div className="section-title">
        <span>Albums</span>
      </div>
      {albums.length === 0 ? (
        <div className="empty-state">
          <p>No albums yet.</p>
        </div>
      ) : (
        <div className="band-albums">
          {albums.map((album) => (
            <ArtworkCard
              key={album.id}
              to={`/albums/${album.id}`}
              title={album.title}
              subtitle={album.release_date?.slice(0, 4)}
              artPath={album.art_path}
            />
          ))}
        </div>
      )}

      <style>{`
        .band-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem 0;
        }
        .band-header__art {
          width: 120px;
          flex-shrink: 0;
        }
        @media (min-width: 768px) {
          .band-header__art { width: 180px; }
        }
        .band-albums {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 20px;
        }
      `}</style>
    </div>
  );
}
