// Configuração do Google Maps
// Para usar o Google Maps, você precisa de uma API Key
// Obtenha sua chave em: https://console.cloud.google.com/google/maps-apis
// Ative as APIs: Maps JavaScript API, Places API, Geocoding API

export const GOOGLE_MAPS_CONFIG = {
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE',
  libraries: ['places', 'geometry'],
  region: 'BR',
  language: 'pt-BR'
};

// Instruções para configurar:
// 1. Crie um arquivo .env na raiz do projeto
// 2. Adicione: REACT_APP_GOOGLE_MAPS_API_KEY=sua_chave_aqui
// 3. Reinicie o servidor de desenvolvimento





