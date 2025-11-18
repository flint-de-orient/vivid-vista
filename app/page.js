export default function Home() {
  return (
    <div className="container">
      <h1 className="page-title">Land Record Management System</h1>
      
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
            Professional Land Management Solution
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Streamline your land record operations with our comprehensive digital platform
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', border: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Khatian Master</h3>
            </div>
            <p style={{ marginBottom: '1.5rem', opacity: '0.9' }}>Create and manage khatian records with unique identifiers and owner details</p>
            <a href="/khatians" className="btn btn-secondary">Manage Khatians</a>
          </div>
          
          <div className="card" style={{ background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', color: 'white', border: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15,7V5A2,2 0 0,0 13,3H11A2,2 0 0,0 9,5V7H8A1,1 0 0,0 7,8V16A3,3 0 0,0 10,19H14A3,3 0 0,0 17,16V8A1,1 0 0,0 16,7H15M11,5H13V7H11V5Z"/>
              </svg>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Plot Master</h3>
            </div>
            <p style={{ marginBottom: '1.5rem', opacity: '0.9' }}>Manage plots with area details and comprehensive land nature information</p>
            <a href="/plots" className="btn btn-secondary">Manage Plots</a>
          </div>
          
          <div className="card" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white', border: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7A2,2 0 0,1 13,5H20V3H13A4,4 0 0,0 9,7V8.9C7.29,8.9 5.9,10.29 5.9,12V16A2,2 0 0,0 7.9,18H10V16H7.9V12H3.9Z"/>
              </svg>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Plot-Khatian Mapping</h3>
            </div>
            <p style={{ marginBottom: '1.5rem', opacity: '0.9' }}>Link plots to khatians with precise land share information</p>
            <a href="/plot-khatians" className="btn btn-secondary">Map Records</a>
          </div>
          
          <div className="card" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: 'white', border: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-2.99 4v7h2v7h4zm-7.5-10.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9V9c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v6h1.5v7h4z"/>
              </svg>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Purchaser Master</h3>
            </div>
            <p style={{ marginBottom: '1.5rem', opacity: '0.9' }}>Manage purchaser records and their detailed information</p>
            <a href="/purchasers" className="btn btn-secondary">Manage Purchasers</a>
          </div>
          
          <div className="card" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white', border: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6,2A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6M6,4H13V9H18V20H6V4Z"/>
              </svg>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Deed Registration</h3>
            </div>
            <p style={{ marginBottom: '1.5rem', opacity: '0.9' }}>Register deeds with comprehensive plot details and legal information</p>
            <a href="/deeds" className="btn btn-secondary">Register Deeds</a>
          </div>
          
          <div className="card" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white', border: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,3H21A1,1 0 0,1 22,4V20A1,1 0 0,1 21,21H3A1,1 0 0,1 2,20V4A1,1 0 0,1 3,3M4,5V19H20V5H4M6,7H18V9H6V7M6,11H18V13H6V11M6,15H18V17H6V15Z"/>
              </svg>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Reports</h3>
            </div>
            <p style={{ marginBottom: '1.5rem', opacity: '0.9' }}>Generate detailed reports on plot shareholders and land allocations</p>
            <a href="/reports" className="btn btn-secondary">View Reports</a>
          </div>
        </div>
      </div>
    </div>
  );
}