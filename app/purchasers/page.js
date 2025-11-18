'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import FileUpload from '../../components/FileUpload';

export default function Purchasers() {
  const [purchasers, setPurchasers] = useState([]);
  const [filteredPurchasers, setFilteredPurchasers] = useState([]);
  const [form, setForm] = useState({ name: '', guardian_name: '', khatian_no: '' });
  const [activeTab, setActiveTab] = useState('single');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPurchasers();
  }, []);

  const fetchPurchasers = async () => {
    const response = await axios.get('/api/purchasers');
    setPurchasers(response.data);
    setFilteredPurchasers(response.data);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = purchasers.filter(p => 
      p.name.toLowerCase().includes(term.toLowerCase()) ||
      p.guardian_name.toLowerCase().includes(term.toLowerCase()) ||
      (p.khatian_no && p.khatian_no.toLowerCase().includes(term.toLowerCase()))
    );
    setFilteredPurchasers(filtered);
  };

  const handleEdit = (purchaser) => {
    setForm(purchaser);
    setEditingId(purchaser._id);
    setActiveTab('single');
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this purchaser?')) return;
    
    try {
      await axios.delete(`/api/purchasers/${id}`);
      setMessage('Purchaser deleted successfully!');
      fetchPurchasers();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Delete failed');
    }
  };

  const resetForm = () => {
    setForm({ name: '', guardian_name: '', khatian_no: '' });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`/api/purchasers/${editingId}`, form);
        setMessage('Purchaser updated successfully!');
      } else {
        await axios.post('/api/purchasers', form);
        setMessage('Purchaser added successfully!');
      }
      resetForm();
      fetchPurchasers();
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
      const purchasers = parsedData
        .filter(row => row[0] && row[1])
        .map(row => ({
          name: String(row[0]).trim(),
          guardian_name: String(row[1]).trim(),
          khatian_no: row[2] ? String(row[2]).trim() : ''
        }));
      
      if (purchasers.length === 0) {
        setMessage('No valid data found to upload');
        setLoading(false);
        return;
      }
      
      const response = await axios.post('/api/purchasers/bulk', { purchasers });
      setMessage(`Successfully uploaded ${response.data.inserted} purchasers!`);
      setParsedData([]);
      fetchPurchasers();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Purchaser Master</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{purchasers.length}</div>
          <div className="stat-label">Total Purchasers</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{purchasers.filter(p => p.khatian_no).length}</div>
          <div className="stat-label">With Khatian</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{purchasers.filter(p => new Date(p.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length}</div>
          <div className="stat-label">Added This Month</div>
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
              <h2 className="section-title">{editingId ? 'Edit Purchaser' : 'Add New Purchaser'}</h2>
              {editingId && (
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancel Edit
                </button>
              )}
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Name</label>
                <input
                  placeholder="Enter purchaser name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Guardian Name</label>
                <input
                  placeholder="Enter guardian name"
                  value={form.guardian_name}
                  onChange={(e) => setForm({ ...form, guardian_name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Khatian No (Optional)</label>
                <input
                  placeholder="Enter khatian number if applicable"
                  value={form.khatian_no}
                  onChange={(e) => setForm({ ...form, khatian_no: e.target.value })}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (editingId ? 'Updating...' : 'Adding...') : (editingId ? 'Update Purchaser' : 'Add Purchaser')}
            </button>
          </form>
        )}

        {activeTab === 'bulk' && (
          <div>
            <h2 className="section-title">Bulk Upload Purchasers</h2>
            <p style={{ marginBottom: '1.5rem', color: '#64748b' }}>
              Upload CSV or Excel file with columns: Name, Guardian Name, Khatian No
            </p>
            
            <FileUpload onDataParsed={handleFileData} />
            
            {parsedData.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <h3 className="section-title">Preview Data ({parsedData.length} records)</h3>
                <div className="table-container" style={{ maxHeight: '300px', overflow: 'auto' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Guardian Name</th>
                        <th>Khatian No</th>
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
          <h2 className="section-title">Purchaser Records</h2>
          <div className="form-group" style={{ margin: 0, minWidth: '300px' }}>
            <input
              placeholder="Search by name, guardian, or khatian no..."
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
                <th>Name</th>
                <th>Guardian Name</th>
                <th>Khatian No</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchasers.map((p) => (
                <tr key={p._id}>
                  <td style={{ fontWeight: '500' }}>{p.name}</td>
                  <td>{p.guardian_name}</td>
                  <td>{p.khatian_no ? (
                    <span className="badge badge-info">{p.khatian_no}</span>
                  ) : (
                    <span style={{ color: '#9ca3af' }}>-</span>
                  )}</td>
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