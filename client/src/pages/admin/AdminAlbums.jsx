import { useState, useEffect } from 'react';
import { getAlbums, getBands } from '../../api/mock';

export default function AdminAlbums() {
  const [albums, setAlbums] = useState([]);
  const [bands, setBands] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', band_id: '' });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    getAlbums().then(setAlbums);
    getBands().then(setBands);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const band = bands.find((b) => b.id === Number(formData.band_id));
    if (editing) {
      setAlbums(albums.map((a) => a.id === editing
        ? { ...a, title: formData.title, band_id: Number(formData.band_id), band_name: band?.name || '' }
        : a
      ));
    } else {
      const newAlbum = {
        id: Date.now(),
        title: formData.title,
        band_id: Number(formData.band_id),
        band_name: band?.name || '',
        slug: formData.title.toLowerCase().replace(/\s+/g, '-'),
        art_path: null,
        release_date: new Date().toISOString().slice(0, 10),
      };
      setAlbums([...albums, newAlbum]);
    }
    setFormData({ title: '', band_id: '' });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (album) => {
    setFormData({ title: album.title, band_id: String(album.band_id) });
    setEditing(album.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this album?')) {
      setAlbums(albums.filter((a) => a.id !== id));
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">Albums</h1>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditing(null); setFormData({ title: '', band_id: '' }); }}>
          {showForm ? 'Cancel' : '+ Add Album'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>
          <div className="form-group">
            <label>Album Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Enter album title"
            />
          </div>
          <div className="form-group">
            <label>Band</label>
            <select
              value={formData.band_id}
              onChange={(e) => setFormData({ ...formData, band_id: e.target.value })}
              required
            >
              <option value="">Select band...</option>
              {bands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Album Art</label>
            <input type="file" accept="image/*" />
          </div>
          <button type="submit" className="btn btn-primary">
            {editing ? 'Update Album' : 'Create Album'}
          </button>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Band</th>
            <th>Released</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {albums.map((album) => (
            <tr key={album.id}>
              <td style={{ fontWeight: 600 }}>{album.title}</td>
              <td className="mute">{album.band_name}</td>
              <td className="mono mute" style={{ fontSize: '0.75rem' }}>{album.release_date?.slice(0, 4) || '—'}</td>
              <td>
                <div className="actions">
                  <button className="btn btn-sm" onClick={() => handleEdit(album)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(album.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
          {albums.length === 0 && (
            <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--mute)' }}>No albums yet</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
