// Mock data for frontend development before backend is ready

export const bands = [
  {
    id: 1,
    name: 'footfive',
    slug: 'footfive',
    art_path: null,
    created_at: '2024-01-15',
  },
  {
    id: 2,
    name: 'Paper Lungs',
    slug: 'paper-lungs',
    art_path: null,
    created_at: '2023-06-20',
  },
  {
    id: 3,
    name: 'Drift Collective',
    slug: 'drift-collective',
    art_path: null,
    created_at: '2022-11-01',
  },
];

export const albums = [
  {
    id: 1,
    band_id: 1,
    title: 'Hollow Year',
    slug: 'hollow-year',
    art_path: null,
    release_date: '2024-09-15',
    band_name: 'footfive',
  },
  {
    id: 2,
    band_id: 1,
    title: 'Paper Lungs',
    slug: 'paper-lungs',
    art_path: null,
    release_date: '2022-03-10',
    band_name: 'footfive',
  },
  {
    id: 3,
    band_id: 1,
    title: 'Drift',
    slug: 'drift',
    art_path: null,
    release_date: '2020-07-22',
    band_name: 'footfive',
  },
  {
    id: 4,
    band_id: 2,
    title: 'Soft Machines',
    slug: 'soft-machines',
    art_path: null,
    release_date: '2023-11-01',
    band_name: 'Paper Lungs',
  },
  {
    id: 5,
    band_id: 3,
    title: 'Veins By Night',
    slug: 'veins-by-night',
    art_path: null,
    release_date: '2023-02-14',
    band_name: 'Drift Collective',
  },
];

export const tracks = [
  { id: 1, band_id: 1, album_id: 1, title: 'Slow Mercy', slug: 'slow-mercy', audio_path: null, art_path: null, duration_seconds: 227, track_number: 1, band_name: 'footfive', album_title: 'Hollow Year' },
  { id: 2, band_id: 1, album_id: 1, title: 'North Window', slug: 'north-window', audio_path: null, art_path: null, duration_seconds: 242, track_number: 2, band_name: 'footfive', album_title: 'Hollow Year' },
  { id: 3, band_id: 1, album_id: 1, title: 'Paper Lungs', slug: 'paper-lungs', audio_path: null, art_path: null, duration_seconds: 178, track_number: 3, band_name: 'footfive', album_title: 'Hollow Year' },
  { id: 4, band_id: 1, album_id: 1, title: 'Drift, Pt. II', slug: 'drift-pt-ii', audio_path: null, art_path: null, duration_seconds: 314, track_number: 4, band_name: 'footfive', album_title: 'Hollow Year' },
  { id: 5, band_id: 1, album_id: 1, title: 'Kind River', slug: 'kind-river', audio_path: null, art_path: null, duration_seconds: 202, track_number: 5, band_name: 'footfive', album_title: 'Hollow Year' },
  { id: 6, band_id: 1, album_id: 1, title: 'Veins By', slug: 'veins-by', audio_path: null, art_path: null, duration_seconds: 250, track_number: 6, band_name: 'footfive', album_title: 'Hollow Year' },
  { id: 7, band_id: 1, album_id: 2, title: 'Exhale', slug: 'exhale', audio_path: null, art_path: null, duration_seconds: 195, track_number: 1, band_name: 'footfive', album_title: 'Paper Lungs' },
  { id: 8, band_id: 1, album_id: 2, title: 'Ghost Frame', slug: 'ghost-frame', audio_path: null, art_path: null, duration_seconds: 268, track_number: 2, band_name: 'footfive', album_title: 'Paper Lungs' },
  { id: 9, band_id: 1, album_id: 2, title: 'Soft Landing', slug: 'soft-landing', audio_path: null, art_path: null, duration_seconds: 211, track_number: 3, band_name: 'footfive', album_title: 'Paper Lungs' },
  { id: 10, band_id: 2, album_id: 4, title: 'Wire Heart', slug: 'wire-heart', audio_path: null, art_path: null, duration_seconds: 233, track_number: 1, band_name: 'Paper Lungs', album_title: 'Soft Machines' },
  { id: 11, band_id: 2, album_id: 4, title: 'Copper Veil', slug: 'copper-veil', audio_path: null, art_path: null, duration_seconds: 189, track_number: 2, band_name: 'Paper Lungs', album_title: 'Soft Machines' },
  { id: 12, band_id: 3, album_id: 5, title: 'Night Pulse', slug: 'night-pulse', audio_path: null, art_path: null, duration_seconds: 276, track_number: 1, band_name: 'Drift Collective', album_title: 'Veins By Night' },
  { id: 13, band_id: 3, album_id: 5, title: 'Undertow', slug: 'undertow', audio_path: null, art_path: null, duration_seconds: 305, track_number: 2, band_name: 'Drift Collective', album_title: 'Veins By Night' },
];

// Helper functions to simulate API calls
export function getBands() {
  return Promise.resolve(bands);
}

export function getBand(id) {
  const band = bands.find((b) => b.id === Number(id));
  return Promise.resolve(band || null);
}

export function getBandAlbums(bandId) {
  return Promise.resolve(albums.filter((a) => a.band_id === Number(bandId)));
}

export function getAlbums() {
  return Promise.resolve(albums);
}

export function getAlbum(id) {
  const album = albums.find((a) => a.id === Number(id));
  return Promise.resolve(album || null);
}

export function getAlbumTracks(albumId) {
  return Promise.resolve(
    tracks
      .filter((t) => t.album_id === Number(albumId))
      .sort((a, b) => a.track_number - b.track_number)
  );
}

export function getTracks() {
  return Promise.resolve(tracks);
}

export function getTrack(id) {
  return Promise.resolve(tracks.find((t) => t.id === Number(id)) || null);
}

export function getLatestAlbums(limit = 6) {
  return Promise.resolve(
    [...albums].sort((a, b) => new Date(b.release_date) - new Date(a.release_date)).slice(0, limit)
  );
}

export function getPopularTracks(limit = 6) {
  return Promise.resolve(tracks.slice(0, limit));
}
