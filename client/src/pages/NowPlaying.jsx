import { useNavigate } from 'react-router-dom';
import usePlayerStore from '../store/playerStore';
import { formatTime } from '../utils';
import TrackRow from '../components/TrackRow';
import PlaceholderArt from '../components/PlaceholderArt';

export default function NowPlaying() {
  const navigate = useNavigate();
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    queue,
    queueIndex,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
  } = usePlayerStore();

  if (!currentTrack) {
    return (
      <div className="container">
        <div className="empty-state" style={{ paddingTop: '4rem' }}>
          <div className="empty-icon">&#9835;</div>
          <p>Nothing playing yet. Browse some music to get started.</p>
        </div>
      </div>
    );
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const upNext = queue.slice(queueIndex + 1);

  const handleScrubClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    seek(percent * duration);
  };

  return (
    <div className="np-page">
      <div className="np-container">
        {/* Back button */}
        <button className="np-back chip mono" onClick={() => navigate(-1)}>
          &#8592; BACK
        </button>

        {/* Hero art */}
        <div className="np-art">
          {currentTrack.art_path ? (
            <img
              src={`/api/media/images/${currentTrack.art_path}`}
              alt={currentTrack.title}
            />
          ) : (
            <PlaceholderArt name={currentTrack.album_title || currentTrack.title} />
          )}
          <div className="np-art__tag mono">ALBUM ART</div>
        </div>

        {/* Track meta */}
        <div className="np-meta">
          <h1 className="np-title hand">{currentTrack.title}</h1>
          <div className="np-artist">
            {currentTrack.band_name}
            {currentTrack.album_title && (
              <> &middot; <span className="mono">{currentTrack.album_title}</span></>
            )}
          </div>
          {queue.length > 1 && (
            <div className="np-position mono">
              track {queueIndex + 1} / {queue.length}
            </div>
          )}
        </div>

        {/* Scrub bar */}
        <div className="np-scrub" onClick={handleScrubClick}>
          <div className="np-scrub__fill" style={{ width: `${progress}%` }} />
          <div className="np-scrub__thumb" style={{ left: `${progress}%` }} />
        </div>
        <div className="np-times">
          <span className="mono">{formatTime(currentTime)}</span>
          <span className="mono">{formatTime(duration)}</span>
        </div>

        {/* Controls */}
        <div className="np-controls">
          <button className="np-btn" onClick={prevTrack}>&#9198;</button>
          <button className="np-btn np-btn--play" onClick={togglePlay}>
            {isPlaying ? '\u23F8' : '\u25B6'}
          </button>
          <button className="np-btn" onClick={nextTrack}>&#9197;</button>
        </div>

        {/* Up next */}
        {upNext.length > 0 && (
          <>
            <div className="section-title" style={{ marginTop: '2rem' }}>
              <span>Up next</span>
            </div>
            <div className="np-queue">
              {upNext.slice(0, 5).map((track) => (
                <TrackRow key={track.id} track={track} trackList={queue} />
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        .np-page {
          padding-bottom: calc(var(--player-height) + 2rem);
        }
        .np-container {
          max-width: 420px;
          margin: 0 auto;
          padding: 1rem;
        }
        .np-back {
          margin-bottom: 1rem;
          font-size: 0.6875rem;
          cursor: pointer;
        }
        .np-art {
          width: 100%;
          aspect-ratio: 1/1;
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1.5px solid var(--line);
          position: relative;
          margin-bottom: 1.25rem;
          box-shadow: 2px 3px 0 var(--fill-2);
        }
        .np-art img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .np-art__placeholder {
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(135deg, var(--fill-2) 0 10px, var(--fill) 10px 20px);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--hand);
          font-size: 4rem;
          color: var(--ink-2);
        }
        .np-art__tag {
          position: absolute;
          top: 10px;
          left: 10px;
          font-size: 0.625rem;
          background: var(--paper);
          border: 1px solid var(--line);
          padding: 3px 7px;
          border-radius: 6px;
        }
        .np-meta {
          margin-bottom: 1rem;
        }
        .np-title {
          font-size: 1.75rem;
          line-height: 1;
          margin: 0;
        }
        .np-artist {
          font-size: 0.8125rem;
          color: var(--mute);
          margin-top: 4px;
        }
        .np-position {
          font-size: 0.6875rem;
          color: var(--mute);
          margin-top: 2px;
        }
        .np-scrub {
          height: 4px;
          background: var(--fill-2);
          border-radius: 2px;
          position: relative;
          cursor: pointer;
        }
        .np-scrub__fill {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          background: var(--accent);
          border-radius: 2px;
        }
        .np-scrub__thumb {
          position: absolute;
          top: -4px;
          width: 12px;
          height: 12px;
          border-radius: 999px;
          background: var(--accent);
          border: 2px solid var(--ink);
          transform: translateX(-50%);
        }
        .np-times {
          display: flex;
          justify-content: space-between;
          font-size: 0.6875rem;
          color: var(--mute);
          margin-top: 6px;
          margin-bottom: 1rem;
        }
        .np-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }
        .np-btn {
          width: 44px;
          height: 44px;
          border-radius: 999px;
          border: 1.5px solid var(--line);
          background: var(--paper);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          transition: all 0.15s;
        }
        .np-btn:hover {
          background: var(--fill);
        }
        .np-btn--play {
          width: 60px;
          height: 60px;
          background: var(--ink);
          color: var(--paper);
          border-color: var(--ink);
          font-size: 20px;
        }
        .np-btn--play:hover {
          background: var(--ink-2);
        }
        .np-queue {
          border: 1.5px solid var(--line);
          border-radius: var(--radius);
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
