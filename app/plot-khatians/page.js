'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PlotKhatians() {
  const [plotKhatians, setPlotKhatians] = useState([]);
  const [filteredMappings, setFilteredMappings] = useState([]);
  const [plots, setPlots] = useState([]);
  const [khatians, setKhatians] = useState([]);
  const [form, setForm] = useState({ plot_id: '', khatian_id: '', land_share: '' });
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this mapping?')) return;
    
    try {
      await axios.delete(`/api/plot-khatians/${id}`);
      setMessage('Mapping deleted successfully!');
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Delete failed');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [plotKhatiansRes, plotsRes, khatiansRes] = await Promise.all([
      axios.get('/api/plot-khatians'),
      axios.get('/api/plots'),
      axios.get('/api/khatians')
    ]);
    setPlotKhatians(plotKhatiansRes.data);
    setFilteredMappings(plotKhatiansRes.data);
    setPlots(plotsRes.data);
    setKhatians(khatiansRes.data);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = plotKhatians.filter(pk => 
      pk.plot_id?.plot_no.toLowerCase().includes(term.toLowerCase()) ||
      pk.khatian_id?.khatian_no.toLowerCase().includes(term.toLowerCase()) ||
      pk.khatian_id?.owner.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredMappings(filtered);
  };

  const handleEdit = (mapping) => {
    setForm({
      plot_id: mapping.plot_id._id,
      khatian_id: mapping.khatian_id._id,
      land_share: mapping.land_share
    });
    setEditingId(mapping._id);
  };

  const resetForm = () => {
    setForm({ plot_id: '', khatian_id: '', land_share: '' });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/plot-khatians/${editingId}`, form);
        setMessage('Mapping updated successfully!');
      } else {
        await axios.post('/api/plot-khatians', form);
        setMessage('Plot-Khatian mapping created successfully!');
      }
      resetForm();
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">🔗 Map Plot and Khatian</h1>
      
      {message && (
        <div className={`alert ${message.includes('Success') || message.includes('successfully') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="section-title">{editingId ? 'Edit Mapping' : 'Create Plot-Khatian Mapping'}</h2>
            {editingId && (
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Cancel Edit
              </button>
            )}
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Select Plot</label>
              <select
                value={form.plot_id}
                onChange={(e) => setForm({ ...form, plot_id: e.target.value })}
                required
              >
                <option value="">Choose a plot</option>
                {plots.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.plot_no} - {p.total_land_area} acres ({p.nature_of_land})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Select Khatian</label>
              <select
                value={form.khatian_id}
                onChange={(e) => setForm({ ...form, khatian_id: e.target.value })}
                required
              >
                <option value="">Choose a khatian</option>
                {khatians.map((k) => (
                  <option key={k._id} value={k._id}>
                    {k.khatian_no} - {k.owner}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Land Share (%)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="Enter land share percentage"
                value={form.land_share}
                onChange={(e) => setForm({ ...form, land_share: e.target.value })}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Update Mapping' : 'Create Mapping'}
          </button>
        </form>
      </div>
      
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="section-title">Plot-Khatian Mappings ({plotKhatians.length})</h2>
          <div className="form-group" style={{ margin: 0, minWidth: '300px' }}>
            <input
              placeholder="Search by plot no, khatian no, or owner..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ margin: 0 }}
            />
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Plot No</th>
                <th>Plot Area</th>
                <th>Khatian No</th>
                <th>Owner</th>
                <th>Land Share</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMappings.map((pk) => (
                <tr key={pk._id}>
                  <td><strong>{pk.plot_id?.plot_no}</strong></td>
                  <td>{pk.plot_id?.total_land_area} acres</td>
                  <td><strong>{pk.khatian_id?.khatian_no}</strong></td>
                  <td>{pk.khatian_id?.owner}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '12px',
                      background: '#dcfce7',
                      color: '#166534',
                      fontWeight: '600'
                    }}>
                      {pk.land_share}%
                    </span>
                  </td>
                  <td>{new Date(pk.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleEdit(pk)} 
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(pk._id)} 
                        className="btn btn-danger"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}