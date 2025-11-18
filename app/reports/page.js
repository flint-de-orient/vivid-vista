'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Reports() {
  const [plots, setPlots] = useState([]);
  const [selectedPlot, setSelectedPlot] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlots();
  }, []);

  const fetchPlots = async () => {
    const response = await axios.get('/api/plots');
    setPlots(response.data);
  };

  const generateReport = async () => {
    if (!selectedPlot) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`/api/reports/plot-shareholders?plotId=${selectedPlot}`);
      setReportData(response.data);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Reports</h1>
      
      <div className="card">
        <h2 className="section-title">Plot-wise Shareholders Report</h2>
        <p style={{ marginBottom: '1.5rem', color: '#64748b' }}>
          Select a plot to view its shareholders and their land share details
        </p>
        
        <div className="form-grid" style={{ gridTemplateColumns: '1fr auto' }}>
          <div className="form-group">
            <label>Select Plot</label>
            <select
              value={selectedPlot}
              onChange={(e) => setSelectedPlot(e.target.value)}
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
          <div className="form-group" style={{ alignSelf: 'end' }}>
            <button 
              onClick={generateReport} 
              className="btn btn-primary"
              disabled={!selectedPlot || loading}
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>
      </div>

      {reportData && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className="section-title">Shareholders Report</h2>
            <button 
              onClick={() => window.print()} 
              className="btn btn-secondary"
            >
              Print Report
            </button>
          </div>
          
          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>Plot Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <strong>Plot No:</strong> {reportData.plot?.plot_no}
              </div>
              <div>
                <strong>Total Area:</strong> {reportData.plot?.total_land_area} acres
              </div>
              <div>
                <strong>Nature of Land:</strong> {reportData.plot?.nature_of_land}
              </div>
              <div>
                <strong>Total Shared:</strong> {reportData.totalShared}%
              </div>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Khatian No</th>
                  <th>Owner Name</th>
                  <th>Guardian Name</th>
                  <th>Share %</th>
                  <th>Shared Area (Acres)</th>
                </tr>
              </thead>
              <tbody>
                {reportData.shareholders.map((sh, index) => (
                  <tr key={index}>
                    <td>
                      <span className="badge badge-info">{sh.khatian_no}</span>
                    </td>
                    <td style={{ fontWeight: '500' }}>{sh.owner}</td>
                    <td>{sh.guardian_name}</td>
                    <td>
                      <span className="badge badge-success">{sh.share_percentage}%</span>
                    </td>
                    <td style={{ fontWeight: '500' }}>{sh.shared_area}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            background: reportData.totalShared === 100 ? '#dcfce7' : '#fef3c7',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <strong>
              {reportData.totalShared === 100 
                ? '✅ Plot is fully allocated' 
                : `⚠️ ${100 - reportData.totalShared}% remaining unallocated`
              }
            </strong>
          </div>
        </div>
      )}
    </div>
  );
}