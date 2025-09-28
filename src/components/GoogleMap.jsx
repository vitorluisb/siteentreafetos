import React, { useEffect, useRef, useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { GOOGLE_MAPS_CONFIG } from '../config/maps';

const MapComponent = ({ locations, selectedLocation, onLocationSelect }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (mapRef.current && !map) {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: selectedLocation ? selectedLocation.position : { lat: -6.8578, lng: -35.4853 },
        zoom: selectedLocation ? 16 : 11,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'transit',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true
      });
      setMap(newMap);
    }
  }, [map, selectedLocation]);

  useEffect(() => {
    if (map && locations) {
      // Limpar marcadores existentes
      markers.forEach(marker => marker.setMap(null));

      const newMarkers = locations.map(location => {
        const marker = new window.google.maps.Marker({
          position: location.position,
          map: map,
          title: location.name,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 2C15.163 2 8 9.163 8 18c0 13.5 16 26 16 26s16-12.5 16-26c0-8.837-7.163-16-16-16z" fill="#E8B4B8" stroke="#D4A5A9" stroke-width="2"/>
                <circle cx="24" cy="18" r="8" fill="white"/>
                <text x="24" y="23" text-anchor="middle" fill="#E8B4B8" font-family="Arial" font-size="12" font-weight="bold">🏥</text>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(48, 48),
            anchor: new window.google.maps.Point(24, 46)
          },
          animation: window.google.maps.Animation.DROP
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; font-family: Arial, sans-serif;">
              <h4 style="margin: 0 0 8px 0; color: #2C2C2C; font-size: 16px;">${location.name}</h4>
              <p style="margin: 4px 0; color: #666; font-size: 14px;">📍 ${location.address}</p>
              <p style="margin: 4px 0; color: #666; font-size: 14px;">📞 ${location.phone}</p>
              <p style="margin: 4px 0; color: #666; font-size: 14px;">🕒 ${location.hours}</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
          onLocationSelect(location);
        });

        return marker;
      });

      setMarkers(newMarkers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, locations, onLocationSelect]);

  useEffect(() => {
    if (map && selectedLocation) {
      map.setCenter(selectedLocation.position);
      map.setZoom(16);
    }
  }, [map, selectedLocation]);

  return <div ref={mapRef} style={{ height: '400px', width: '100%', borderRadius: '12px' }} />;
};

const render = (status) => {
  switch (status) {
    case Status.LOADING:
      return (
        <div style={{ 
          height: '400px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: '12px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #E8B4B8', 
              borderTop: '4px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p style={{ color: '#666', margin: 0 }}>Carregando mapa...</p>
          </div>
        </div>
      );
    case Status.FAILURE:
      return (
        <div style={{ 
          height: '400px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div>
            <p style={{ color: '#666', margin: '0 0 16px 0' }}>Erro ao carregar o mapa</p>
            <button 
              onClick={() => window.location.reload()} 
              style={{
                padding: '8px 16px',
                backgroundColor: '#E8B4B8',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Tentar novamente
            </button>
          </div>
        </div>
      );
    default:
      return null;
  }
};

// Componente de fallback quando a API key não está configurada
const MapFallback = ({ locations, selectedLocation, onLocationSelect }) => {
  return (
    <div style={{ 
      height: '400px', 
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      border: '2px dashed #E8B4B8',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
        <h3 style={{ color: '#666', marginBottom: '8px' }}>Mapa Temporariamente Indisponível</h3>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>
          Configure a chave da API do Google Maps para visualizar o mapa interativo
        </p>
      </div>
      
      <div style={{ width: '100%', maxWidth: '300px' }}>
        <h4 style={{ color: '#E8B4B8', marginBottom: '12px' }}>Nossas Localizações:</h4>
        {locations.map((location, index) => (
          <div 
            key={location.id}
            style={{
              backgroundColor: selectedLocation?.id === location.id ? '#E8B4B8' : 'white',
              color: selectedLocation?.id === location.id ? 'white' : '#666',
              padding: '12px',
              marginBottom: '8px',
              borderRadius: '8px',
              border: '1px solid #E8B4B8',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '14px'
            }}
            onClick={() => onLocationSelect(location)}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              📍 {location.name}
            </div>
            <div>{location.address}</div>
          </div>
        ))}
      </div>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '12px', 
        backgroundColor: '#fff3cd', 
        borderRadius: '6px',
        fontSize: '12px',
        color: '#856404'
      }}>
        💡 Para ativar o mapa: configure REACT_APP_GOOGLE_MAPS_API_KEY no arquivo .env
      </div>
    </div>
  );
};

const GoogleMap = ({ locations, selectedLocation, onLocationSelect }) => {
  // Verificar se a API key está configurada (aceita chave vazia para desenvolvimento)
  const hasApiKey = GOOGLE_MAPS_CONFIG.apiKey !== undefined && 
                    GOOGLE_MAPS_CONFIG.apiKey !== 'YOUR_API_KEY_HERE' && 
                    GOOGLE_MAPS_CONFIG.apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY';

  // Se não há chave configurada, mostrar fallback
  if (!hasApiKey) {
    return (
      <MapFallback 
        locations={locations}
        selectedLocation={selectedLocation}
        onLocationSelect={onLocationSelect}
      />
    );
  }

  // Usar chave vazia para desenvolvimento local (mostra mapas com marca d'água)
  const apiKey = GOOGLE_MAPS_CONFIG.apiKey || '';

  return (
    <Wrapper 
      apiKey={apiKey} 
      libraries={GOOGLE_MAPS_CONFIG.libraries}
      render={render}
    >
      <MapComponent 
        locations={locations} 
        selectedLocation={selectedLocation} 
        onLocationSelect={onLocationSelect} 
      />
    </Wrapper>
  );
};

export default GoogleMap;
