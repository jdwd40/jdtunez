import { useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import usePlayerStore from '../store/playerStore';
import { formatTime } from '../utils';
import PlaceholderArt from './PlaceholderArt';
import './Player.css';

export default function Player() {
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const navigate = useNavigate();

  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    queue,
    queueIndex,
    setAudioRef,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    setCurrentTime,
    setDuration,
    setIsPlaying,
  } = usePlayerStore();

  useEffect(() => {
    if (audioRef.current) {
      setAudioRef(audioRef.current);
      audioRef.current.volume = volume;
    }
  }, [setAudioRef, volume]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, [setCurrentTime]);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, [setDuration]);

  const handleEnded = useCallback(() => {
    if (queueIndex < queue.length - 1) {
      nextTrack();
    } else {
      setIsPlaying(false);
    }
  }, [queueIndex, queue.length, nextTrack, setIsPlaying]);

  const handleProgressClick = (e) => {
    if (!progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    seek(percent * duration);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentTrack) {
    return (
      <>
        <audio ref={audioRef} />
        <div className="player player--empty">
          <div className="player__inner">
            <span className="player__hint mono">Select a track to start listening</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <div className="player">
        <div
          className="player__progress-bar"
          ref={progressRef}
          onClick={handleProgressClick}
          role="progressbar"
          aria-valuenow={currentTime}
          aria-valuemin={0}
          aria-valuemax={duration}
        >
          <div className="player__progress-fill" style={{ width: `${progress}%` }} />
          <div className="player__progress-thumb" style={{ left: `${progress}%` }} />
        </div>

        <div className="player__inner">
          {/* Track info */}
          <button
            className="player__info"
            onClick={() => navigate('/now-playing')}
          >
            <div className="player__art">
              {currentTrack.art_path ? (
                <img src={`/api/media/images/${currentTrack.art_path}`} alt="" />
              ) : (
                <PlaceholderArt name={currentTrack.title} size="44px" style={{ borderRadius: 6 }} />
              )}
            </div>
            <div className="player__meta">
              <div className="player__title">{currentTrack.title}</div>
              <div className="player__artist">{currentTrack.band_name}</div>
            </div>
          </button>

          {/* Controls */}
          <div className="player__controls">
            <button
              className="player__btn"
              onClick={prevTrack}
              aria-label="Previous track"
            >
              &#9198;
            </button>
            <button
              className="player__btn player__btn--play"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? '&#9646;&#9646;' : '&#9654;'}
            </button>
            <button
              className="player__btn"
              onClick={nextTrack}
              aria-label="Next track"
            >
              &#9197;
            </button>
          </div>

          {/* Time + Volume */}
          <div className="player__right">
            <span className="player__time mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <div className="player__volume">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                aria-label="Volume"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
