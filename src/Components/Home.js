import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Home.css'
import L from 'leaflet'
// import { configs } from 'eslint-plugin-react-refresh';
import axios from 'axios';

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

const AutoZoomVillage = ({ geoData, selectedVillage }) => {
  const map = useMap();

  useEffect(() => {
    if (!geoData || !selectedVillage) return;

    const feature = geoData.find(
      (f) => f.properties?.NAME === selectedVillage
    );

    // console.log("Geo Data : ", selectedVillage)

    if (feature) {
      const layer = L.geoJSON(feature);
      map.fitBounds(layer.getBounds(), { padding: [50, 50] });
    }
  }, [geoData, selectedVillage, map]);

  return null;
};


const Home = () => {
  const [geoData, setGeoData] = useState(null);
  const [villageGeoData, setVillageGeoData] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');
  const [tahasilsData, setTahasilsData] = useState(null);

  let villagesGeoJsonDataFeatures = null;

  useEffect(() => {
    fetch('/MAHARASHTRA_DISTRICTS.geojson')
      .then(res => res.json())
      .then((data) => {
        console.log(data)
        setGeoData(data)
      })
      .catch(err => console.error('Error loading GeoJSON:', err));
  }, []);

  useEffect(()=>{
    console.log("first")
    setSelectedVillage('')
  }, [selectedDistrict])

  useEffect(() => {
    axios.get('/tahsils.json')
      .then((res) => {
        // (res.data).forEach(obj => {
        //   console.log(obj.name)
        // });
        setTahasilsData(res.data)
      })
      .catch(err => console.error("Error Loading Tahsils Data : ", err))
  }, [])

  let fetchRelatedVillages = (districtName) => {
    axios.get("/maharashtra_villages_geojson.txt", { responseType: "text" })
      .then((response) => {
        const json = JSON.parse(response.data);
        villagesGeoJsonDataFeatures =json.features
        const villagesGeoJsonData = (json.features).filter(village => village.properties?.DISTRICT === districtName)
        // console.log("Villages GeoJson : ", villagesGeoJsonData)
        setVillageGeoData(villagesGeoJsonData)
      })
      .catch((error) => {
        console.error("Error loading GeoJSON data:", error);
      });
  }

  // Dropdown change handler
  const handleDistrictChange = (e) => {

    fetchRelatedVillages(e.target.value)

    setSelectedDistrict(e.target.value);
  };
  const handleVillageChange = (e) => {
    setSelectedVillage(e.target.value);
  };

  // const handleDistrictCenter = (dtname) => {
  //   geoData.features.forEach((feature) => {
  //     if (feature.properties?.dtname === dtname) {
  //       const lat = feature.geometry.coordinates[0][0][0];
  //       const lng = feature.geometry.coordinates[0][0][1];
  //       setDefaultCenter([lat, lng]);  // Pass as an array [lat, lng]
  //     }
  //   });
  // };


  // Style each district
  const districtStyle = (feature) => {
    return {
      color: feature.properties?.dtname === selectedDistrict ? 'blue' : 'grey',
      weight: feature.properties?.dtname === selectedDistrict ? 3 : 1,
      fillColor: 'white',
      fillOpacity: 0.3,
    };
  };

  const villageStyle = (feature) => {
    return {
      color: feature.properties?.NAME === selectedVillage ? 'blue' : 'grey',
      weight: feature.properties?.NAME === selectedVillage ? 3 : 1,
      fillColor: 'white',
      fillOpacity: 0.3,
    };
  };

  const onEachFeature = (feature, layer) => {
    const name = feature.properties?.dtname || 'Unknown';
    layer.bindPopup(name.toString());
  };

  return (
    <div id='main-container'>

      {/* Dropdown to select district */}
      <div id='drop-down-container'>
        <fieldset style={{ border: '.5px solid grey', width: '90%', margin: 'auto' }}>
          <legend style={{ fontSize: 'small', fontWeight: '700' }}>Select District</legend>
          <select onChange={(e) => { handleDistrictChange(e) }} value={selectedDistrict} id='drop-down'>
            <option value="">Select a district</option>
            {geoData &&
              geoData.features.map((feature, idx) => (
                <option key={idx} value={feature.properties?.dtname}>
                  {feature.properties?.dtname}
                </option>
              ))}
          </select>
        </fieldset>

        <fieldset style={{ border: '.5px solid grey', width: '90%', margin: 'auto' }}>
          <legend style={{ fontSize: 'small', fontWeight: '700' }}>Select Village/City</legend>
          <select onChange={(e) => { handleVillageChange(e) }} value={selectedVillage} id='drop-down'>
            <option value="" selected>Select a Village/City</option>
            {villageGeoData &&
              villageGeoData.map((feature, idx) => (
                <option key={idx} value={feature.properties?.NAME}>
                  {feature.properties?.NAME}
                </option>
              ))}
          </select>
        </fieldset>
      </div>


      {/* Map */}
      {geoData && (
        <MapContainer center={[19.7515, 75.7139]} zoom={6} id='map-container'>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {/* <GeoJSON data={geoData} style={districtStyle} onEachFeature={onEachFeature} /> */}
          {selectedVillage ? (
            <GeoJSON data={villagesGeoJsonDataFeatures} />
          ) : (
            <GeoJSON data={geoData} style={districtStyle} onEachFeature={onEachFeature} />
          )}

          {
            selectedVillage ? <AutoZoomVillage geoData={villageGeoData} selectedVillage={selectedVillage} /> : <AutoZoomDistrict geoData={geoData} selectedDistrict={selectedDistrict} />
          }
        </MapContainer>
      ) || (<h1 style={{ textAlign: 'center', width: '100%', color: 'white', fontSize: '3rem' }}>Map is Loading...</h1>)}

      {console.log("GeoData : ",geoData)}
    </div>
  );
};

export default Home;
