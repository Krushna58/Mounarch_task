import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import AutoZoomDistrict from './AutoZoomDistrict';
import AutoZoomVillage from './AutoZoomVillage';

const MapDisplay = ({
  geoData,
  villageGeoData,
  selectedDistrict,
  selectedVillage,
  villagesGeoJsonDataFeatures,
  districtStyle,
  villageStyle,
  onEachFeature,
}) => {
  return (
    <MapContainer center={[19.7515, 75.7139]} zoom={6} id="map-container">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      {selectedVillage ? (
        <GeoJSON data={villagesGeoJsonDataFeatures} style={villageStyle} />
      ) : (
        <GeoJSON data={geoData} style={districtStyle} onEachFeature={onEachFeature} />
      )}
      {selectedVillage ? (
        <AutoZoomVillage geoData={villageGeoData} selectedVillage={selectedVillage} />
      ) : (
        <AutoZoomDistrict geoData={geoData} selectedDistrict={selectedDistrict} />
      )}
    </MapContainer>
  );
};

export default MapDisplay;