import React from 'react';

const DistrictDropdown = ({ geoData, selectedDistrict, onDistrictChange }) => {
  return (
    <fieldset style={{ border: '.5px solid grey', width: '90%', margin: 'auto' }}>
      <legend style={{ fontSize: 'small', fontWeight: '700' }}>Select District</legend>
      <select onChange={onDistrictChange} value={selectedDistrict} id="drop-down">
        <option value="">Select a district</option>
        {geoData &&
          geoData.features.map((feature, idx) => (
            <option key={idx} value={feature.properties?.dtname}>
              {feature.properties?.dtname}
            </option>
          ))}
      </select>
    </fieldset>
  );
};

export default DistrictDropdown;