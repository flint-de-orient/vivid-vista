import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <title>Land Record Management System</title>
      </head>
      <body>
        <nav className="nav">
          <div className="nav-container">
            <div className="nav-links">
              <a href="/">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
                Home
              </a>
              <a href="/khatians">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
                Khatians
              </a>
              <a href="/plots">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15,7V5A2,2 0 0,0 13,3H11A2,2 0 0,0 9,5V7H8A1,1 0 0,0 7,8V16A3,3 0 0,0 10,19H14A3,3 0 0,0 17,16V8A1,1 0 0,0 16,7H15M11,5H13V7H11V5Z"/>
                </svg>
                Plots
              </a>
              <a href="/plot-khatians">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7A2,2 0 0,1 13,5H20V3H13A4,4 0 0,0 9,7V8.9C7.29,8.9 5.9,10.29 5.9,12V16A2,2 0 0,0 7.9,18H10V16H7.9V12H3.9Z"/>
                </svg>
                Mapping
              </a>
              <a href="/purchasers">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-2.99 4v7h2v7h4zm-7.5-10.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9V9c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v6h1.5v7h4z"/>
                </svg>
                Purchasers
              </a>
              <a href="/deeds">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6,2A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6M6,4H13V9H18V20H6V4Z"/>
                </svg>
                Deeds
              </a>
              <a href="/reports">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,3H21A1,1 0 0,1 22,4V20A1,1 0 0,1 21,21H3A1,1 0 0,1 2,20V4A1,1 0 0,1 3,3M4,5V19H20V5H4M6,7H18V9H6V7M6,11H18V13H6V11M6,15H18V17H6V15Z"/>
                </svg>
                Reports
              </a>
            </div>
          </div>
        </nav>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}