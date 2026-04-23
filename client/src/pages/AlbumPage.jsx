import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import TrackRow from '../components/TrackRow';
import PlaceholderArt from '../components/PlaceholderArt';
import usePlayerStore from '../store/playerStore';
import { getAlbum, getAlbumTracks } from '../api/mock';
import { formatTime } from '../utils';

export default function AlbumPage() {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const playAlbum = usePlayerStore((s) => s.playAlbum);

  useEffect(() => {
    getAlbum(albumId).then(setAlbum);
    getAlbumTracks(albumId).then(setTracks);
  }, [albumId]);

  if (!album) {
    return (
      <div className="container">
        <div className="empty-state"><p>Loading...</p></div>
      </div>
    );
  }

  const totalDuration = tracks.reduce((sum, t) => sum + (t.duration_seconds || 0), 0);

  return (
    <div className="container">
      <div className="album-header">
        <div className="album-header__art">
          {album.art_path ? (
            <img
              src={`/api/media/images/${album.art_path}`}
              alt={album.title}
              className="art-image"
            />
          ) : (
            <PlaceholderArt
              name={album.title}
              style={{ borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--line)' }}
            />
          )}
        </div>
        <div className="album-header__info">
          <h1 className="page-title" style={{ marginTop: 0 }}>{album.title}</h1>
          <Link to={`/bands/${album.band_id}`} className="album-header__band">
            {album.band_name}
          </Link>
          <div className="album-header__meta mono">
            {album.release_date?.slice(0, 4)} &middot; {tracks.length} track{tracks.length !== 1 ? 's' : ''} &middot; {formatTime(totalDuration)}
          </div>
          <button
            className="pill accent"
            style={{ marginTop: '0.75rem', fontWeight: 600 }}
            onClick={() => playAlbum(tracks)}
          >
            &#9654; Play Album
          </button>
        </div>
      </div>

      {/* Track list */}
      <div className="section-title">
        <span>Tracks</span>
        <span className="see-all mono">{tracks.length} track{tracks.length !== 1 ? 's' : ''}</span>
      </div>
      {tracks.length === 0 ? (
        <div className="empty-state"><p>No tracks yet.</p></div>
      ) : (
        <div className="album-tracks">
          {tracks.map((track) => (
            <TrackRow key={track.id} track={track} trackList={tracks} />
          ))}
        </div>
      )}

      <style>{`
        .album-header {
          display: flex;
          gap: 1.5rem;
          padding: 1.5rem 0 0.5rem;
          align-items: flex-start;
        }
        .album-header__art {
          width: 160px;
          flex-shrink: 0;
        }
        @media (min-width: 768px) {
          .album-header__art { width: 220px; }
        }
        .album-header__info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .album-header__band {
          font-size: 0.9375rem;
          color: var(--mute);
        }
        .album-header__band:hover {
          color: var(--ink);
        }
        .album-header__meta {
          font-size: 0.6875rem;
          color: var(--mute);
          margin-top: 4px;
        }
        .album-tracks {
          border: 1.5px solid var(--line);
          border-radius: var(--radius);
          overflow: hidden;
          margin-bottom: 2rem;
        }
      `}</style>
    </div>
  );
}
