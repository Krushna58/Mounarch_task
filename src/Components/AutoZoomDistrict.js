import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const AutoZoomDistrict = ({ geoData, selectedDistrict }) => {
  const map = useMap();

  useEffect(() => {
    if (!geoData || !selectedDistrict) return;

    const feature = geoData.features.find(
      (f) => f.properties?.dtname === selectedDistrict
    );

    if (feature) {
      const layer = L.geoJSON(feature);
      map.fitBounds(layer.getBounds(), { padding: [50, 50] });
    }
  }, [geoData, selectedDistrict, map]);

  return null;
};

export default AutoZoomDistrict;