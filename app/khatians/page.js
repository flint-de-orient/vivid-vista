'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import FileUpload from '../../components/FileUpload';

export default function Khatians() {
  const [khatians, setKhatians] = useState([]);
  const [filteredKhatians, setFilteredKhatians] = useState([]);
  const [form, setForm] = useState({ khatian_no: '', owner: '', guardian_name: '' });
  const [activeTab, setActiveTab] = useState('single');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchKhatians();
  }, []);

  const fetchKhatians = async () => {
    const response = await axios.get('/api/khatians');
    setKhatians(response.data);
    setFilteredKhatians(response.data);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = khatians.filter(k => 
      k.khatian_no.toLowerCase().includes(term.toLowerCase()) ||
      k.owner.toLowerCase().includes(term.toLowerCase()) ||
      k.guardian_name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredKhatians(filtered);
  };

  const handleEdit = (khatian) => {
    setForm({
      khatian_no: khatian.khatian_no,
      owner: khatian.owner,
      guardian_name: khatian.guardian_name
    });
    setEditingId(khatian._id);
    setActiveTab('single');
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this khatian?')) return;
    
    try {
      await axios.delete(`/api/khatians/${id}`);
      setMessage('Khatian deleted successfully!');
      fetchKhatians();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Delete failed');
    }
  };

  const resetForm = () => {
    setForm({ khatian_no: '', owner: '', guardian_name: '' });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`/api/khatians/${editingId}`, form);
        setMessage('Khatian updated successfully!');
      } else {
        await axios.post('/api/khatians', form);
        setMessage('Khatian added successfully!');
      }
      resetForm();
      fetchKhatians();
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
      const khatians = parsedData
        .filter(row => row[0] && row[1] && row[2]) // Filter out empty rows
        .map(row => ({
          khatian_no: String(row[0]).trim(),
          owner: String(row[1]).trim(),
          guardian_name: String(row[2]).trim()
        }));
      
      if (khatians.length === 0) {
        setMessage('No valid data found to upload');
        setLoading(false);
        return;
      }
      
      const response = await axios.post('/api/khatians/bulk', { khatians });
      setMessage(`Successfully uploaded ${response.data.inserted} khatians!`);
      setParsedData([]);
      fetchKhatians();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Khatian Master</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{khatians.length}</div>
          <div className="stat-label">Total Khatians</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{new Set(khatians.map(k => k.owner)).size}</div>
          <div className="stat-label">Unique Owners</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{khatians.filter(k => new Date(k.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length}</div>
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
              <h2 className="section-title">{editingId ? 'Edit Khatian' : 'Add New Khatian'}</h2>
              {editingId && (
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancel Edit
                </button>
              )}
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Khatian Number</label>
                <input
                  placeholder="Enter unique khatian number"
                  value={form.khatian_no}
                  onChange={(e) => setForm({ ...form, khatian_no: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Owner Name</label>
                <input
                  placeholder="Enter owner's full name"
                  value={form.owner}
                  onChange={(e) => setForm({ ...form, owner: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Guardian Name</label>
                <input
                  placeholder="Enter guardian's full name"
                  value={form.guardian_name}
                  onChange={(e) => setForm({ ...form, guardian_name: e.target.value })}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (editingId ? 'Updating...' : 'Adding...') : (editingId ? 'Update Khatian' : 'Add Khatian')}
            </button>
          </form>
        )}

        {activeTab === 'bulk' && (
          <div>
            <h2 className="section-title">Bulk Upload Khatians</h2>
            <p style={{ marginBottom: '1.5rem', color: '#64748b' }}>
              Upload CSV or Excel file with columns: Khatian No, Owner, Guardian Name
            </p>
            
            <FileUpload onDataParsed={handleFileData} />
            
            {parsedData.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <h3 className="section-title">Preview Data ({parsedData.length} records)</h3>
                <div className="table-container" style={{ maxHeight: '300px', overflow: 'auto' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Khatian No</th>
                        <th>Owner</th>
                        <th>Guardian Name</th>
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
          <h2 className="section-title">Khatian Records</h2>
          <div className="form-group" style={{ margin: 0, minWidth: '300px' }}>
            <input
              placeholder="Search by khatian no, owner, or guardian name..."
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
                <th>Khatian No</th>
                <th>Owner</th>
                <th>Guardian Name</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredKhatians.map((k) => (
                <tr key={k._id}>
                  <td>
                    <span className="badge badge-info">{k.khatian_no}</span>
                  </td>
                  <td style={{ fontWeight: '500' }}>{k.owner}</td>
                  <td>{k.guardian_name}</td>
                  <td style={{ color: '#64748b' }}>{new Date(k.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleEdit(k)} 
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(k._id)} 
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