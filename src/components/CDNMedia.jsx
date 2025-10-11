import React, { useState } from 'react';

// URLs do CDN para mídia pesada (GitHub Raw ou CDN externo)
const CDN_BASE_URL = 'https://raw.githubusercontent.com/vitorluisb/siteentreafetos/main/clinentreafetos/public';

// Mapeamento de arquivos pesados para CDN
const MEDIA_CDN_MAP = {
  // Vídeo principal
  'videocompr.mp4': `${CDN_BASE_URL}/videocompr.mp4`,
  
  // Imagens da clínica Arco-Íris (pesadas)
  'cliniarco/salaated.png': `${CDN_BASE_URL}/cliniarco/salaated.png`,
  'cliniarco/sala3.png': `${CDN_BASE_URL}/cliniarco/sala3.png`,
  'cliniarco/fachadalogo.png': `${CDN_BASE_URL}/cliniarco/fachadalogo.png`,
  'cliniarco/aparelhos4.png': `${CDN_BASE_URL}/cliniarco/aparelhos4.png`,
  'cliniarco/rall.png': `${CDN_BASE_URL}/cliniarco/rall.png`,
  'cliniarco/arcond.png': `${CDN_BASE_URL}/cliniarco/arcond.png`,
  'cliniarco/equipamentos.png': `${CDN_BASE_URL}/cliniarco/equipamentos.png`,
  
  // Imagens da clínica Aquarela (pesadas)
  'cliniaquarela/escalada.png': `${CDN_BASE_URL}/cliniaquarela/escalada.png`,
  'cliniaquarela/corredor.png': `${CDN_BASE_URL}/cliniaquarela/corredor.png`,
  'cliniaquarela/balanco.png': `${CDN_BASE_URL}/cliniaquarela/balanco.png`,
};

/**
 * Componente para carregar imagens via CDN
 */
export const CDNImage = ({ 
  src, 
  alt, 
  className = '', 
  style = {},
  loading = 'lazy',
  fallback = '/logo/entreafetoslogo.png',
  ...props 
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Determinar URL da imagem (CDN ou local)
  const imageUrl = MEDIA_CDN_MAP[src] || src;
  
  const handleImageLoad = () => {
    setIsLoading(false);
  };
  
  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };
  
  if (imageError) {
    return (
      <img
        src={fallback}
        alt={alt}
        className={className}
        style={style}
        loading={loading}
        {...props}
      />
    );
  }
  
  return (
    <div style={{ position: 'relative', ...style }}>
      {isLoading && (
        <div 
          className="image-placeholder"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            color: '#666'
          }}
        >
          Carregando...
        </div>
      )}
      <img
        src={imageUrl}
        alt={alt}
        className={className}
        style={{ 
          ...style,
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease'
        }}
        loading={loading}
        onLoad={handleImageLoad}
        onError={handleImageError}
        {...props}
      />
    </div>
  );
};

/**
 * Componente para carregar vídeos via CDN
 */
export const CDNVideo = ({ 
  src, 
  className = '', 
  style = {},
  fallback = null,
  ...props 
}) => {
  const [videoError, setVideoError] = useState(false);
  
  // Determinar URL do vídeo (CDN ou local)
  const videoUrl = MEDIA_CDN_MAP[src] || src;
  
  const handleVideoError = () => {
    setVideoError(true);
  };
  
  if (videoError && fallback) {
    return fallback;
  }
  
  if (videoError) {
    return (
      <div 
        className={className}
        style={{
          ...style,
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
          color: '#666'
        }}
      >
        Vídeo não disponível
      </div>
    );
  }
  
  return (
    <video
      src={videoUrl}
      className={className}
      style={style}
      onError={handleVideoError}
      {...props}
    />
  );
};

/**
 * Hook para verificar se uma mídia deve usar CDN
 */
export const useMediaCDN = (src) => {
  const isCDNMedia = MEDIA_CDN_MAP.hasOwnProperty(src);
  const mediaUrl = MEDIA_CDN_MAP[src] || src;
  
  return {
    isCDNMedia,
    mediaUrl,
    isHeavyMedia: isCDNMedia
  };
};

export default { CDNImage, CDNVideo, useMediaCDN };