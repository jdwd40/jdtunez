import usePlayerStore from '../store/playerStore';
import { formatTime } from '../utils';
import PlaceholderArt from './PlaceholderArt';

export default function TrackRow({ track, trackList = [], showAlbum = false }) {
  const { playTrack, currentTrack, isPlaying } = usePlayerStore();
  const isActive = currentTrack?.id === track.id;

  return (
    <div
      className={`track-row ${isActive ? 'track-row--active' : ''}`}
      onClick={() => playTrack(track, trackList)}
    >
      <div className="track-row__num">
        {isActive && isPlaying ? (
          <span className="track-row__playing">{'\u25B6'}</span>
        ) : (
          <span className="track-row__number mono">{track.track_number || '\u2014'}</span>
        )}
      </div>
      <div className="track-row__art">
        {track.art_path ? (
          <img src={`/api/media/images/${track.art_path}`} alt="" />
        ) : (
          <PlaceholderArt name={track.title} size="42px" style={{ borderRadius: 'var(--radius-sm)' }} />
        )}
      </div>
      <div className="track-row__info">
        <div className="track-row__title">{track.title}</div>
        <div className="track-row__sub">
          {track.band_name}
          {showAlbum && track.album_title ? ` \u00B7 ${track.album_title}` : ''}
        </div>
      </div>
      <div className="track-row__duration mono">
        {formatTime(track.duration_seconds)}
      </div>
      <style>{`
        .track-row {
          display: grid;
          grid-template-columns: 28px 42px 1fr auto;
          gap: 10px;
          align-items: center;
          padding: 8px;
          border-bottom: 1px dashed var(--fill-2);
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: background 0.1s;
        }
        .track-row:last-child { border-bottom: 0; }
        .track-row:hover { background: var(--fill); }
        .track-row--active { background: var(--fill); }
        .track-row__num {
          text-align: center;
          font-size: 0.75rem;
          color: var(--mute);
        }
        .track-row__playing {
          color: var(--accent);
          font-size: 0.625rem;
        }
        .track-row__art {
          width: 42px;
          height: 42px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 1px solid var(--line);
        }
        .track-row__art img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .track-row__info {
          min-width: 0;
        }
        .track-row__title {
          font-size: 0.8125rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .track-row__sub {
          font-size: 0.6875rem;
          color: var(--mute);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .track-row__duration {
          font-size: 0.6875rem;
          color: var(--mute);
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}
