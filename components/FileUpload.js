'use client';
import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export default function FileUpload({ onDataParsed, acceptedTypes = ['.csv', '.xlsx', '.xls'] }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [hasHeader, setHasHeader] = useState(true);
  const [rawData, setRawData] = useState([]);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    setFile(file);
    setParsing(true);
    
    try {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      let data = [];

      if (fileExtension === 'csv') {
        const text = await file.text();
        const result = Papa.parse(text, { header: false, skipEmptyLines: true });
        data = result.data;
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      }

      setRawData(data);
      processData(data, hasHeader);
    } catch (error) {
      console.error('Error parsing file:', error);
      alert('Error parsing file. Please check the format.');
    } finally {
      setParsing(false);
    }
  };

  const processData = (data, skipHeader) => {
    const processedData = skipHeader ? data.slice(1) : data;
    onDataParsed(processedData);
  };

  const handleHeaderToggle = (checked) => {
    setHasHeader(checked);
    if (rawData.length > 0) {
      processData(rawData, checked);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="upload-container">
      <div
        className={`upload-area ${dragActive ? 'dragover' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="file-input"
          accept={acceptedTypes.join(',')}
          onChange={handleChange}
        />
        
        <div className="upload-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
        </div>
        
        <h3 style={{ marginBottom: '0.5rem', color: '#374151' }}>
          {parsing ? 'Processing file...' : 'Drop your file here or click to browse'}
        </h3>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
          Supports CSV, Excel (.xlsx, .xls) files
        </p>
        
        {!parsing && (
          <button type="button" className="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z"/>
            </svg>
            Choose File
          </button>
        )}
        
        {parsing && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6' }}>
            <div style={{ 
              width: '20px', 
              height: '20px', 
              border: '2px solid #e5e7eb', 
              borderTop: '2px solid #3b82f6', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite' 
            }}></div>
            Processing...
          </div>
        )}
      </div>
      
      {file && !parsing && (
        <div>
          <div className="file-info">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#10b981' }}>
              <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
            </svg>
            <div>
              <p style={{ fontWeight: '500', color: '#374151' }}>{file.name}</p>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          
          <div style={{ 
            background: '#f8fafc', 
            border: '1px solid #e2e8f0', 
            borderRadius: '12px', 
            padding: '1rem', 
            marginTop: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <input
              type="checkbox"
              id="hasHeader"
              checked={hasHeader}
              onChange={(e) => handleHeaderToggle(e.target.checked)}
              style={{ width: '16px', height: '16px' }}
            />
            <label htmlFor="hasHeader" style={{ 
              fontWeight: '500', 
              color: '#374151',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              First row contains headers
            </label>
          </div>
        </div>
      )}
    </div>
  );
}