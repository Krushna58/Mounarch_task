import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const AutoZoomVillage = ({ geoData, selectedVillage }) => {
  const map = useMap();

  useEffect(() => {
    if (!geoData || !selectedVillage) return;

    const feature = geoData.find(
      (f) => f.properties?.NAME === selectedVillage
    );

    if (feature) {
      const layer = L.geoJSON(feature);
      map.fitBounds(layer.getBounds(), { padding: [50, 50] });
    }
  }, [geoData, selectedVillage, map]);

  return null;
};

export default AutoZoomVillage;