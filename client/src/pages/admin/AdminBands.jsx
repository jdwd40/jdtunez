import { useState, useEffect } from 'react';
import { getBands } from '../../api/mock';

export default function AdminBands() {
  const [bands, setBands] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '' });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    getBands().then(setBands);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      setBands(bands.map((b) => b.id === editing ? { ...b, name: formData.name } : b));
    } else {
      const newBand = {
        id: Date.now(),
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        art_path: null,
        created_at: new Date().toISOString(),
      };
      setBands([...bands, newBand]);
    }
    setFormData({ name: '' });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (band) => {
    setFormData({ name: band.name });
    setEditing(band.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this band?')) {
      setBands(bands.filter((b) => b.id !== id));
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">Bands</h1>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditing(null); setFormData({ name: '' }); }}>
          {showForm ? 'Cancel' : '+ Add Band'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>
          <div className="form-group">
            <label>Band Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              required
              placeholder="Enter band name"
            />
          </div>
          <div className="form-group">
            <label>Band Art</label>
            <input type="file" accept="image/*" />
          </div>
          <button type="submit" className="btn btn-primary">
            {editing ? 'Update Band' : 'Create Band'}
          </button>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Art</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bands.map((band) => (
            <tr key={band.id}>
              <td style={{ fontWeight: 600 }}>{band.name}</td>
              <td className="mono mute" style={{ fontSize: '0.75rem' }}>{band.slug}</td>
              <td>
                {band.art_path ? (
                  <div style={{ width: 32, height: 32, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--line)' }}>
                    <img src={`/api/media/images/${band.art_path}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ) : (
                  <span className="mute" style={{ fontSize: '0.75rem' }}>—</span>
                )}
              </td>
              <td>
                <div className="actions">
                  <button className="btn btn-sm" onClick={() => handleEdit(band)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(band.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
          {bands.length === 0 && (
            <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--mute)' }}>No bands yet</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
