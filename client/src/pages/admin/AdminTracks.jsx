import { useState, useEffect } from 'react';
import { getTracks, getAlbums, getBands } from '../../api/mock';
import { formatTime } from '../../utils';

export default function AdminTracks() {
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [bands, setBands] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', band_id: '', album_id: '', track_number: '' });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    getTracks().then(setTracks);
    getAlbums().then(setAlbums);
    getBands().then(setBands);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const band = bands.find((b) => b.id === Number(formData.band_id));
    const album = albums.find((a) => a.id === Number(formData.album_id));
    if (editing) {
      setTracks(tracks.map((t) => t.id === editing
        ? {
            ...t,
            title: formData.title,
            band_id: Number(formData.band_id),
            album_id: Number(formData.album_id) || null,
            track_number: Number(formData.track_number) || null,
            band_name: band?.name || '',
            album_title: album?.title || '',
          }
        : t
      ));
    } else {
      const newTrack = {
        id: Date.now(),
        title: formData.title,
        band_id: Number(formData.band_id),
        album_id: Number(formData.album_id) || null,
        track_number: Number(formData.track_number) || null,
        band_name: band?.name || '',
        album_title: album?.title || '',
        slug: formData.title.toLowerCase().replace(/\s+/g, '-'),
        audio_path: null,
        art_path: null,
        duration_seconds: 0,
      };
      setTracks([...tracks, newTrack]);
    }
    setFormData({ title: '', band_id: '', album_id: '', track_number: '' });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (track) => {
    setFormData({
      title: track.title,
      band_id: String(track.band_id),
      album_id: String(track.album_id || ''),
      track_number: String(track.track_number || ''),
    });
    setEditing(track.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this track?')) {
      setTracks(tracks.filter((t) => t.id !== id));
    }
  };

  const filteredAlbums = formData.band_id
    ? albums.filter((a) => a.band_id === Number(formData.band_id))
    : albums;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">Tracks</h1>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditing(null); setFormData({ title: '', band_id: '', album_id: '', track_number: '' }); }}>
          {showForm ? 'Cancel' : '+ Add Track'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <div className="form-group">
              <label>Track Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Enter track title"
              />
            </div>
            <div className="form-group">
              <label>Track #</label>
              <input
                type="number"
                value={formData.track_number}
                onChange={(e) => setFormData({ ...formData, track_number: e.target.value })}
                placeholder="1"
                min="1"
              />
            </div>
            <div className="form-group">
              <label>Band</label>
              <select
                value={formData.band_id}
                onChange={(e) => setFormData({ ...formData, band_id: e.target.value, album_id: '' })}
                required
              >
                <option value="">Select band...</option>
                {bands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Album</label>
              <select
                value={formData.album_id}
                onChange={(e) => setFormData({ ...formData, album_id: e.target.value })}
              >
                <option value="">No album (standalone)</option>
                {filteredAlbums.map((a) => (
                  <option key={a.id} value={a.id}>{a.title}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Audio File</label>
            <input type="file" accept="audio/*" />
          </div>
          <div className="form-group">
            <label>Track Art</label>
            <input type="file" accept="image/*" />
          </div>
          <button type="submit" className="btn btn-primary">
            {editing ? 'Update Track' : 'Create Track'}
          </button>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Band</th>
            <th>Album</th>
            <th>Duration</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((track) => (
            <tr key={track.id}>
              <td className="mono mute" style={{ fontSize: '0.75rem' }}>{track.track_number || '—'}</td>
              <td style={{ fontWeight: 600 }}>{track.title}</td>
              <td className="mute">{track.band_name}</td>
              <td className="mute">{track.album_title || '—'}</td>
              <td className="mono mute" style={{ fontSize: '0.75rem' }}>{formatTime(track.duration_seconds)}</td>
              <td>
                <div className="actions">
                  <button className="btn btn-sm" onClick={() => handleEdit(track)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(track.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
          {tracks.length === 0 && (
            <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--mute)' }}>No tracks yet</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
