import { create } from 'zustand';

const usePlayerStore = create((set, get) => ({
  // Current track
  currentTrack: null,
  // Queue of tracks (album tracks or custom queue)
  queue: [],
  queueIndex: -1,
  // Playback state
  isPlaying: false,
  duration: 0,
  currentTime: 0,
  volume: 0.8,
  // Audio element ref
  audioRef: null,

  setAudioRef: (ref) => set({ audioRef: ref }),

  // Play a single track
  playTrack: (track, trackList = []) => {
    const queue = trackList.length > 0 ? trackList : [track];
    const queueIndex = queue.findIndex((t) => t.id === track.id);
    set({
      currentTrack: track,
      queue,
      queueIndex: queueIndex >= 0 ? queueIndex : 0,
      isPlaying: true,
    });
    const { audioRef } = get();
    if (audioRef) {
      audioRef.src = track.audio_url || `/api/media/audio/${track.audio_path}`;
      audioRef.play().catch(() => {});
    }
  },

  // Play an entire album
  playAlbum: (tracks) => {
    if (tracks.length === 0) return;
    const track = tracks[0];
    set({
      currentTrack: track,
      queue: tracks,
      queueIndex: 0,
      isPlaying: true,
    });
    const { audioRef } = get();
    if (audioRef) {
      audioRef.src = track.audio_url || `/api/media/audio/${track.audio_path}`;
      audioRef.play().catch(() => {});
    }
  },

  togglePlay: () => {
    const { audioRef, isPlaying, currentTrack } = get();
    if (!audioRef || !currentTrack) return;
    if (isPlaying) {
      audioRef.pause();
    } else {
      audioRef.play().catch(() => {});
    }
    set({ isPlaying: !isPlaying });
  },

  nextTrack: () => {
    const { queue, queueIndex, audioRef } = get();
    if (queueIndex < queue.length - 1) {
      const nextIndex = queueIndex + 1;
      const track = queue[nextIndex];
      set({ currentTrack: track, queueIndex: nextIndex, isPlaying: true });
      if (audioRef) {
        audioRef.src = track.audio_url || `/api/media/audio/${track.audio_path}`;
        audioRef.play().catch(() => {});
      }
    }
  },

  prevTrack: () => {
    const { queue, queueIndex, audioRef, currentTime } = get();
    // If more than 3 seconds in, restart current track
    if (currentTime > 3) {
      if (audioRef) {
        audioRef.currentTime = 0;
      }
      return;
    }
    if (queueIndex > 0) {
      const prevIndex = queueIndex - 1;
      const track = queue[prevIndex];
      set({ currentTrack: track, queueIndex: prevIndex, isPlaying: true });
      if (audioRef) {
        audioRef.src = track.audio_url || `/api/media/audio/${track.audio_path}`;
        audioRef.play().catch(() => {});
      }
    }
  },

  seek: (time) => {
    const { audioRef } = get();
    if (audioRef) {
      audioRef.currentTime = time;
      set({ currentTime: time });
    }
  },

  setVolume: (vol) => {
    const { audioRef } = get();
    if (audioRef) audioRef.volume = vol;
    set({ volume: vol });
  },

  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (dur) => set({ duration: dur }),
  setIsPlaying: (val) => set({ isPlaying: val }),
}));

export default usePlayerStore;
