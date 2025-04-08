import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import data from "../Data/data.xlsx"

// Sample GeoJSON data for projects (replace with actual GeoJSON)
const projectGeoJSON = {
  'Pune Ring Road': {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [74.0, 18.5], [74.5, 18.5], [74.5, 19.0], [74.0, 19.0], [74.0, 18.5]
        ]
      ]
    },
    properties: {
      name: 'Pune Ring Road'
    }
  },
  // Add GeoJSON for other projects as needed
  'Samrudhi': {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [73.0, 19.0], [74.0, 19.0], [74.0, 20.0], [73.0, 20.0], [73.0, 19.0]
        ]
      ]
    },
    properties: {
      name: 'Samrudhi'
    }
  },
  'Purandar Airport': {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [73.5, 18.0], [74.0, 18.0], [74.0, 18.5], [73.5, 18.5], [73.5, 18.0]
        ]
      ]
    },
    properties: {
      name: 'Purandar Airport'
    }
  },
  'GT Line': {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [73.0, 18.5], [73.5, 18.5], [73.5, 19.0], [73.0, 19.0], [73.0, 18.5]
        ]
      ]
    },
    properties: {
      name: 'GT Line'
    }
  }
};

const TableComponent = () => {
  const [tables, setTables] = useState({
    mainTable: { headers: [], rows: [], title: 'Project Details' }
  });
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');

  // Function to process Excel file
  const processExcelFile = async (data) => {
    try {
      console.log('Fetching file from:', data);
      const response = await fetch(data);

      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      console.log('File fetched, size:', arrayBuffer.byteLength);

      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      console.log('Workbook sheets:', workbook.SheetNames);

      const mainSheet = workbook.Sheets[workbook.SheetNames[0]];
      const mainData = XLSX.utils.sheet_to_json(mainSheet, { header: 1 });
      console.log('Main Table Data:', mainData);

      const newTables = {
        mainTable: {
          headers: mainData[0] || [],
          rows: mainData.slice(1) || [],
          title: 'Project Details'
        }
      };

      console.log('Processed Tables:', newTables);
      setTables(newTables);
    } catch (error) {
      console.error('Error processing Excel file:', error);
      setError(error.message);
    }
  };

  // Load the Excel file when the component mounts
  useEffect(() => {
    processExcelFile('/Data/data.xlsx');
  }, []);

  // Extract unique villages (assuming Village/City is the second column, index 1)
  const uniqueVillages = [...new Set(tables.mainTable.rows.map(row => row[1]))].filter(Boolean);

  // Filter rows based on selections
  const filteredRows = tables.mainTable.rows.filter(row => {
    const matchesProject = !selectedProject || row[0] === selectedProject;
    const matchesVillage = !selectedVillage || row[1] === selectedVillage;
    return matchesProject && matchesVillage;
  });

  // Render table function
  const renderTable = (tableData) => (
    <div style={{ marginBottom: '20px' }}>
      <h2>{tableData.title}</h2>
      {tableData.headers.length > 0 ? (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              {tableData.headers.map((header, index) => (
                <th
                  key={index}
                  style={{
                    border: '1px solid black',
                    padding: '8px',
                    backgroundColor: '#f0f0f0'
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.length > 0 ? (
              filteredRows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      style={{
                        border: '1px solid black',
                        padding: '8px'
                      }}
                    >
                      {cell || ''}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={tableData.headers.length} style={{ border: '1px solid black', padding: '8px' }}>
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <p>No headers available to display table</p>
      )}
    </div>
  );

  // Map style
  const mapStyle = {
    height: '400px',
    width: '100%'
  };

  return (
    <div style={{ padding: '20px' }}>
      <nav style={{ backgroundColor: '#00aaff', padding: '10px', color: 'white' }}>
        <h1>Monarch</h1>
        <a href="#" style={{ color: 'white', margin: '0 10px' }}>Home</a>
        <a href="#" style={{ color: 'white', margin: '0 10px' }}>Features</a>
        <a href="#" style={{ color: 'white', margin: '0 10px' }}>About</a>
        <a href="#" style={{ color: 'white', margin: '0 10px' }}>Admin</a>
        <a href="#" style={{ color: 'white', margin: '0 10px' }}>Login</a>
        <span style={{ float: 'right' }}>{new Date().toLocaleString()}</span>
      </nav>

      <div style={{ display: 'flex' }}>
        {/* Left Sidebar with Dropdowns */}
        <div style={{ width: '20%', padding: '10px', borderRight: '1px solid #ccc' }}>
          <label>Select Project</label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            style={{ width: '100%', marginBottom: '10px' }}
          >
            <option value="">Select Project</option>
            <option value="Pune Ring Road">Pune Ring Road</option>
            <option value="Samrudhi">Samrudhi</option>
            <option value="Purandar Airport">Purandar Airport</option>
            <option value="GT Line">GT Line</option>
          </select>

          <label>Select Village/City</label>
          <select
            value={selectedVillage}
            onChange={(e) => setSelectedVillage(e.target.value)}
            style={{ width: '100%' }}
          >
            <option value="">Select Village/City</option>
            {uniqueVillages.map((village, index) => (
              <option key={index} value={village}>
                {village}
              </option>
            ))}
          </select>
        </div>

        {/* Map Section */}
        <div style={{ width: '80%', padding: '10px' }}>
          <MapContainer center={[18.5204, 73.8567]} zoom={8} style={mapStyle}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {selectedProject && projectGeoJSON[selectedProject] && (
              <GeoJSON
                data={projectGeoJSON[selectedProject]}
                style={{ color: 'purple', weight: 2 }}
              />
            )}
          </MapContainer>
        </div>
      </div>

      {/* Table Section */}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {tables.mainTable.headers.length > 0 && renderTable(tables.mainTable)}
    </div>
  );
};

export default TableComponent;