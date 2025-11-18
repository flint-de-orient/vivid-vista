'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import FileUpload from '../../components/FileUpload';

export default function Plots() {
  const [plots, setPlots] = useState([]);
  const [filteredPlots, setFilteredPlots] = useState([]);
  const [form, setForm] = useState({ plot_no: '', total_land_area: '', nature_of_land: '' });
  const [activeTab, setActiveTab] = useState('single');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPlots();
  }, []);

  const fetchPlots = async () => {
    const response = await axios.get('/api/plots');
    setPlots(response.data);
    setFilteredPlots(response.data);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = plots.filter(p => 
      p.plot_no.toLowerCase().includes(term.toLowerCase()) ||
      p.nature_of_land.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredPlots(filtered);
  };

  const handleEdit = (plot) => {
    setForm(plot);
    setEditingId(plot._id);
    setActiveTab('single');
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this plot?')) return;
    
    try {
      await axios.delete(`/api/plots/${id}`);
      setMessage('Plot deleted successfully!');
      fetchPlots();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Delete failed');
    }
  };

  const resetForm = () => {
    setForm({ plot_no: '', total_land_area: '', nature_of_land: '' });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`/api/plots/${editingId}`, form);
        setMessage('Plot updated successfully!');
      } else {
        await axios.post('/api/plots', form);
        setMessage('Plot added successfully!');
      }
      resetForm();
      fetchPlots();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileData = (data) => {
    setParsedData(data);
  };

  const handleBulkUpload = async () => {
    if (parsedData.length === 0) return;
    
    setLoading(true);
    try {
      const plots = parsedData
        .filter(row => row[0] && row[1] && row[2])
        .map(row => ({
          plot_no: String(row[0]).trim(),
          total_land_area: parseFloat(String(row[1]).trim()),
          nature_of_land: String(row[2]).trim()
        }));
      
      if (plots.length === 0) {
        setMessage('No valid data found to upload');
        setLoading(false);
        return;
      }
      
      const response = await axios.post('/api/plots/bulk', { plots });
      setMessage(`Successfully uploaded ${response.data.inserted} plots!`);
      setParsedData([]);
      fetchPlots();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Plot Master</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{plots.length}</div>
          <div className="stat-label">Total Plots</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{plots.reduce((sum, p) => sum + p.total_land_area, 0).toFixed(2)}</div>
          <div className="stat-label">Total Area (Acres)</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{new Set(plots.map(p => p.nature_of_land)).size}</div>
          <div className="stat-label">Land Types</div>
        </div>
      </div>
      
      {message && (
        <div className={`alert ${message.includes('Success') || message.includes('successfully') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}
      
      <div className="card">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'single' ? 'active' : ''}`}
            onClick={() => setActiveTab('single')}
          >
            Single Entry
          </button>
          <button 
            className={`tab ${activeTab === 'bulk' ? 'active' : ''}`}
            onClick={() => setActiveTab('bulk')}
          >
            Bulk Upload
          </button>
        </div>

        {activeTab === 'single' && (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 className="section-title">{editingId ? 'Edit Plot' : 'Add New Plot'}</h2>
              {editingId && (
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancel Edit
                </button>
              )}
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Plot Number</label>
                <input
                  placeholder="Enter unique plot number"
                  value={form.plot_no}
                  onChange={(e) => setForm({ ...form, plot_no: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Total Land Area (Acres)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Enter area in acres"
                  value={form.total_land_area}
                  onChange={(e) => setForm({ ...form, total_land_area: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Nature of Land</label>
                <select
                  value={form.nature_of_land}
                  onChange={(e) => setForm({ ...form, nature_of_land: e.target.value })}
                  required
                >
                  <option value="">Select land type</option>
                  <option value="SHALI">SHALI</option>
                  <option value="BAGAN">BAGAN</option>
                  <option value="DANGA">DANGA</option>
                  <option value="DOBA">DOBA</option>
                  <option value="PUKUR">PUKUR</option>
                  <option value="PUKUR PAR">PUKUR PAR</option>
                  <option value="BASTU">BASTU</option>
                  <option value="VITI">VITI</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (editingId ? 'Updating...' : 'Adding...') : (editingId ? 'Update Plot' : 'Add Plot')}
            </button>
          </form>
        )}

        {activeTab === 'bulk' && (
          <div>
            <h2 className="section-title">Bulk Upload Plots</h2>
            <p style={{ marginBottom: '1.5rem', color: '#64748b' }}>
              Upload CSV or Excel file with columns: Plot No, Total Land Area, Nature of Land
            </p>
            
            <FileUpload onDataParsed={handleFileData} />
            
            {parsedData.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <h3 className="section-title">Preview Data ({parsedData.length} records)</h3>
                <div className="table-container" style={{ maxHeight: '300px', overflow: 'auto' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Plot No</th>
                        <th>Total Land Area</th>
                        <th>Nature of Land</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedData.slice(0, 10).map((row, index) => (
                        <tr key={index}>
                          <td>{String(row[0] || '').trim()}</td>
                          <td>{String(row[1] || '').trim()}</td>
                          <td>{String(row[2] || '').trim()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {parsedData.length > 10 && (
                  <p style={{ color: '#64748b', marginTop: '0.5rem', fontSize: '14px' }}>
                    Showing first 10 records. Total: {parsedData.length}
                  </p>
                )}
                <button 
                  onClick={handleBulkUpload} 
                  className="btn btn-success"
                  disabled={loading}
                  style={{ marginTop: '1rem' }}
                >
                  {loading ? 'Uploading...' : `Upload ${parsedData.length} Records`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="section-title">Plot Records</h2>
          <div className="form-group" style={{ margin: 0, minWidth: '300px' }}>
            <input
              placeholder="Search by plot no or nature of land..."
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
                <th>Total Land Area</th>
                <th>Nature of Land</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlots.map((p) => (
                <tr key={p._id}>
                  <td>
                    <span className="badge badge-info">{p.plot_no}</span>
                  </td>
                  <td style={{ fontWeight: '500' }}>{p.total_land_area} acres</td>
                  <td><span className="badge badge-success">{p.nature_of_land}</span></td>
                  <td style={{ color: '#64748b' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleEdit(p)} 
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(p._id)} 
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