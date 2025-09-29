import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configurar ícones do Leaflet (necessário para React)
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Criar ícone customizado para as clínicas
const clinicIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 10.4 12.5 28.5 12.5 28.5s12.5-18.1 12.5-28.5C25 5.6 19.4 0 12.5 0z" fill="#E8B4B8" stroke="#D4A5A9" stroke-width="2"/>
      <circle cx="12.5" cy="12.5" r="6" fill="white"/>
      <path d="M10 12.5h5M12.5 10v5" stroke="#E8B4B8" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `),
  shadowUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="41" height="41" viewBox="0 0 41 41" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20.5" cy="37" rx="12" ry="4" fill="rgba(0,0,0,0.2)"/>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Função para abrir localização no Google Maps
const openInGoogleMaps = (lat, lng, name) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(name)}`;
  window.open(url, '_blank');
};

// Função para obter direções no Google Maps
const getDirectionsInGoogleMaps = (lat, lng, name) => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(name)}`;
  window.open(url, '_blank');
};

// Componente para controlar o mapa dinamicamente
const MapController = ({ selectedLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedLocation) {
      // Fazer zoom na localização selecionada com animação suave
      map.flyTo(
        [selectedLocation.position.lat, selectedLocation.position.lng], 
        16, 
        {
          duration: 1.5, // Duração da animação em segundos
          easeLinearity: 0.25
        }
      );
    } else {
      // Voltar para a visão geral de Guarabira
      map.flyTo([-6.8578, -35.4853], 11, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }, [selectedLocation, map]);

  return null;
};

const OpenStreetMap = ({ locations, selectedLocation, onLocationSelect }) => {
  // Determinar o centro do mapa
  const center = selectedLocation 
    ? [selectedLocation.position.lat, selectedLocation.position.lng]
    : [-6.8578, -35.4853]; // Centro de Guarabira, PB

  // Determinar o zoom
  const zoom = selectedLocation ? 16 : 11;

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        {/* Controlador para zoom automático */}
        <MapController selectedLocation={selectedLocation} />
        
        {/* Camada de tiles do OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Marcadores para cada localização */}
        {locations && locations.map((location, index) => (
          <Marker 
            key={index}
            position={[location.position.lat, location.position.lng]}
            icon={clinicIcon}
            eventHandlers={{
              click: () => {
                if (onLocationSelect) {
                  onLocationSelect(location);
                }
              }
            }}
          >
            <Popup>
              <div style={{ textAlign: 'center', minWidth: '200px' }}>
                <h3 style={{ 
                  margin: '0 0 10px 0', 
                  color: '#E8B4B8', 
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}>
                  {location.name}
                </h3>
                <p style={{ 
                  margin: '0 0 15px 0', 
                  fontSize: '14px',
                  color: '#666',
                  lineHeight: '1.4'
                }}>
                  {location.address}
                </p>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button
                    onClick={() => openInGoogleMaps(
                      location.position.lat, 
                      location.position.lng, 
                      location.name
                    )}
                    style={{
                      backgroundColor: '#E8B4B8',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    📍 Ver no Google Maps
                  </button>
                  <button
                    onClick={() => getDirectionsInGoogleMaps(
                      location.position.lat, 
                      location.position.lng, 
                      location.name
                    )}
                    style={{
                      backgroundColor: '#D4A5A9',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    🧭 Como Chegar
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Informação sobre o mapa open source */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '5px 8px',
        borderRadius: '4px',
        fontSize: '11px',
        color: '#666',
        zIndex: 1000
      }}>
        🗺️ Nossas Unidades - Clique nos marcadores para abrir no Google Maps
      </div>
    </div>
  );
};

export default OpenStreetMap;