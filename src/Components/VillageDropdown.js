import React from 'react';

const VillageDropdown = ({ villageGeoData, selectedVillage, onVillageChange }) => {
  return (
    <fieldset style={{ border: '.5px solid grey', width: '90%', margin: 'auto' }}>
      <legend style={{ fontSize: 'small', fontWeight: '700' }}>Select Village/City</legend>
      <select onChange={onVillageChange} value={selectedVillage} id="drop-down">
        <option value="">Select a Village/City</option>
        {villageGeoData &&
          villageGeoData.map((feature, idx) => (
            <option key={idx} value={feature.properties?.NAME}>
              {feature.properties?.NAME}
            </option>
          ))}
      </select>
    </fieldset>
  );
};

export default VillageDropdown;