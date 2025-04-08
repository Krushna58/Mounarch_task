import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DistrictDropdown from './DistrictDropdown';
import VillageDropdown from './VillageDropdown';
import MapDisplay from './MapDisplay';
import 'leaflet/dist/leaflet.css';
import './Home.css';

const Home = () => {
  const [geoData, setGeoData] = useState(null);
  const [villageGeoData, setVillageGeoData] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');
  const [tahasilsData, setTahasilsData] = useState(null);
  const [villagesGeoJsonDataFeatures, setVillagesGeoJsonDataFeatures] = useState(null);

  useEffect(() => {
    fetch('/MAHARASHTRA_DISTRICTS.geojson')
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error('Error loading GeoJSON:', err));
  }, []);

  useEffect(() => {
    setSelectedVillage('');
  }, [selectedDistrict]);

  useEffect(() => {
    axios
      .get('/tahsils.json')
      .then((res) => setTahasilsData(res.data))
      .catch((err) => console.error('Error Loading Tahsils Data : ', err));
  }, []);

  const fetchRelatedVillages = (districtName) => {
    axios
      .get('/maharashtra_villages_geojson.txt', { responseType: 'text' })
      .then((response) => {
        const json = JSON.parse(response.data);
        setVillagesGeoJsonDataFeatures(json.features);
        const filteredVillages = json.features.filter(
          (village) => village.properties?.DISTRICT === districtName
        );
        setVillageGeoData(filteredVillages);
      })
      .catch((error) => console.error('Error loading GeoJSON data:', error));
  };

  const handleDistrictChange = (e) => {
    fetchRelatedVillages(e.target.value);
    setSelectedDistrict(e.target.value);
  };

  const handleVillageChange = (e) => {
    setSelectedVillage(e.target.value);
  };

  const districtStyle = (feature) => ({
    color: feature.properties?.dtname === selectedDistrict ? 'blue' : 'grey',
    weight: feature.properties?.dtname === selectedDistrict ? 3 : 1,
    fillColor: 'white',
    fillOpacity: 0.3,
  });

  const villageStyle = (feature) => ({
    color: feature.properties?.NAME === selectedVillage ? 'blue' : 'grey',
    weight: feature.properties?.NAME === selectedVillage ? 3 : 1,
    fillColor: 'white',
    fillOpacity: 0.3,
  });

  const onEachFeature = (feature, layer) => {
    const name = feature.properties?.dtname || 'Unknown';
    layer.bindPopup(name.toString());
  };

  return (
    <div id="main-container">
      <div id="drop-down-container">
        <DistrictDropdown
          geoData={geoData}
          selectedDistrict={selectedDistrict}
          onDistrictChange={handleDistrictChange}
        />
        <VillageDropdown
          villageGeoData={villageGeoData}
          selectedVillage={selectedVillage}
          onVillageChange={handleVillageChange}
        />
      </div>
      {geoData ? (
        <MapDisplay
          geoData={geoData}
          villageGeoData={villageGeoData}
          selectedDistrict={selectedDistrict}
          selectedVillage={selectedVillage}
          villagesGeoJsonDataFeatures={villagesGeoJsonDataFeatures}
          districtStyle={districtStyle}
          villageStyle={villageStyle}
          onEachFeature={onEachFeature}
        />
      ) : (
        <h1
          style={{
            textAlign: 'center',
            width: '100%',
            color: 'white',
            fontSize: '3rem',
          }}
        >
          Map is Loading...
        </h1>
      )}
    </div>
  );
};

export default Home;