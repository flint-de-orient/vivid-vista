'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Deeds() {
  const [deeds, setDeeds] = useState([]);
  const [plots, setPlots] = useState([]);
  const [khatians, setKhatians] = useState([]);
  const [form, setForm] = useState({
    deed_no: '',
    deed_date: '',
    plot_details: [{ plot_id: '', khatian_id: '', sold_area: '', sold_by: '', relation: '' }]
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [deedsRes, plotsRes, khatiansRes] = await Promise.all([
      axios.get('/api/deeds'),
      axios.get('/api/plots'),
      axios.get('/api/khatians')
    ]);
    setDeeds(deedsRes.data);
    setPlots(plotsRes.data);
    setKhatians(khatiansRes.data);
  };

  const addPlotDetail = () => {
    setForm({
      ...form,
      plot_details: [...form.plot_details, { plot_id: '', khatian_id: '', sold_area: '', sold_by: '', relation: '' }]
    });
  };

  const removePlotDetail = (index) => {
    if (form.plot_details.length > 1) {
      const updated = form.plot_details.filter((_, i) => i !== index);
      setForm({ ...form, plot_details: updated });
    }
  };

  const updatePlotDetail = (index, field, value) => {
    const updated = form.plot_details.map((detail, i) =>
      i === index ? { ...detail, [field]: value } : detail
    );
    setForm({ ...form, plot_details: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/deeds', form);
      setForm({
        deed_no: '',
        deed_date: '',
        plot_details: [{ plot_id: '', khatian_id: '', sold_area: '', sold_by: '', relation: '' }]
      });
      fetchData();
      setMessage('Deed registered successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">📄 Deed Registration</h1>
      
      {message && (
        <div className={`alert ${message.includes('Success') || message.includes('successfully') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <h2 className="section-title">Register New Deed</h2>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Deed No</label>
              <input
                placeholder="Enter deed number"
                value={form.deed_no}
                onChange={(e) => setForm({ ...form, deed_no: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Deed Date</label>
              <input
                type="date"
                value={form.deed_date}
                onChange={(e) => setForm({ ...form, deed_date: e.target.value })}
                required
              />
            </div>
          </div>
          
          <h3 className="section-title">Plot Details</h3>
          {form.plot_details.map((detail, index) => (
            <div key={index} className="plot-detail-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4>Plot Detail #{index + 1}</h4>
                {form.plot_details.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removePlotDetail(index)}
                    className="btn btn-secondary"
                    style={{ padding: '4px 8px', fontSize: '12px' }}
                  >
                    ❌ Remove
                  </button>
                )}
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Plot</label>
                  <select
                    value={detail.plot_id}
                    onChange={(e) => updatePlotDetail(index, 'plot_id', e.target.value)}
                    required
                  >
                    <option value="">Select Plot</option>
                    {plots.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.plot_no} - {p.total_land_area} acres
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Khatian</label>
                  <select
                    value={detail.khatian_id}
                    onChange={(e) => updatePlotDetail(index, 'khatian_id', e.target.value)}
                    required
                  >
                    <option value="">Select Khatian</option>
                    {khatians.map((k) => (
                      <option key={k._id} value={k._id}>
                        {k.khatian_no} - {k.owner}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Sold Area</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Area in acres"
                    value={detail.sold_area}
                    onChange={(e) => updatePlotDetail(index, 'sold_area', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Sold By</label>
                  <select
                    value={detail.sold_by}
                    onChange={(e) => updatePlotDetail(index, 'sold_by', e.target.value)}
                    required
                  >
                    <option value="">Select seller type</option>
                    <option value="attorney">Attorney</option>
                    <option value="heir">Heir</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Relation</label>
                  <input
                    placeholder="Relationship to khatian holder"
                    value={detail.relation}
                    onChange={(e) => updatePlotDetail(index, 'relation', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={addPlotDetail} className="btn btn-secondary">
              ➕ Add Another Plot
            </button>
            <button type="submit" className="btn btn-primary">
              📄 Register Deed
            </button>
          </div>
        </form>
      </div>
      
      <div className="card">
        <h2 className="section-title">Registered Deeds ({deeds.length})</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Deed No</th>
                <th>Deed Date</th>
                <th>Plot Details</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {deeds.map((d) => (
                <tr key={d._id}>
                  <td><strong>{d.deed_no}</strong></td>
                  <td>{new Date(d.deed_date).toLocaleDateString()}</td>
                  <td>
                    {d.plot_details.map((pd, i) => (
                      <div key={i} style={{ 
                        background: '#f8fafc', 
                        padding: '8px', 
                        margin: '4px 0', 
                        borderRadius: '6px',
                        fontSize: '13px'
                      }}>
                        <strong>Plot:</strong> {pd.plot_id?.plot_no} | 
                        <strong>Khatian:</strong> {pd.khatian_id?.khatian_no} | 
                        <strong>Area:</strong> {pd.sold_area} acres | 
                        <strong>By:</strong> {pd.sold_by} | 
                        <strong>Relation:</strong> {pd.relation}
                      </div>
                    ))}
                  </td>
                  <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}