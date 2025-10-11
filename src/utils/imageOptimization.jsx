// Utilitário simplificado para otimização de imagens
import { useState, useEffect, useRef, useCallback } from 'react';

// Detecta suporte a WebP
export const supportsWebP = () => {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

// Gera URLs otimizadas
export const getOptimizedImageUrl = (originalUrl, options = {}) => {
  const { width, quality = 80, format } = options;
  
  // Para desenvolvimento local, retorna a URL original
  if (originalUrl.startsWith('/') || originalUrl.includes('localhost')) {
    return originalUrl;
  }
  
  return originalUrl;
};

// Gera srcset para imagens responsivas
export const generateSrcSet = (baseUrl, sizes = [320, 640, 768, 1024, 1280, 1920]) => {
  return sizes
    .map(size => `${getOptimizedImageUrl(baseUrl, { width: size })} ${size}w`)
    .join(', ');
};

// Hook para preload de imagens
export const useImagePreload = (urls = []) => {
  const [preloadedImages, setPreloadedImages] = useState(new Set());

  const preloadImage = useCallback((url) => {
    if (preloadedImages.has(url)) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        setPreloadedImages(prev => new Set([...prev, url]));
        resolve();
      };
      img.onerror = reject;
      img.src = url;
    });
  }, [preloadedImages]);

  const preloadImages = useCallback((imageUrls) => {
    return Promise.all(imageUrls.map(preloadImage));
  }, [preloadImage]);

  useEffect(() => {
    if (urls.length > 0) {
      preloadImages(urls);
    }
  }, [urls, preloadImages]);

  return { preloadImage, preloadImages, preloadedImages };
};

// Componente de imagem otimizada
export const AdvancedOptimizedImage = ({
  src,
  alt,
  className = '',
  priority = false,
  sizes = '100vw',
  quality = 80,
  placeholder = 'blur',
  onLoad,
  onError,
  style = {},
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(priority ? src : '');
  const imgRef = useRef(null);

  useEffect(() => {
    if (priority) {
      setImageSrc(getOptimizedImageUrl(src, { quality }));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(getOptimizedImageUrl(src, { quality }));
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src, quality, priority]);

  const handleImageLoad = useCallback((e) => {
    setIsLoaded(true);
    setHasError(false);
    if (onLoad) onLoad(e);
  }, [onLoad]);

  const handleImageError = useCallback((e) => {
    setHasError(true);
    setIsLoaded(false);
    if (onError) onError(e);
  }, [onError]);

  return (
    <div 
      ref={imgRef}
      className={`optimized-image-container ${className}`}
      style={{ position: 'relative', overflow: 'hidden', ...style }}
    >
      {/* Placeholder */}
      {!isLoaded && !hasError && imageSrc && (
        <div className="image-placeholder">
          {placeholder === 'blur' && (
            <div className="placeholder-blur" />
          )}
          {placeholder === 'shimmer' && (
            <div className="placeholder-shimmer" />
          )}
        </div>
      )}

      {/* Imagem principal */}
      {imageSrc && (
        <img
          src={imageSrc}
          srcSet={generateSrcSet(src)}
          sizes={sizes}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            ...style
          }}
          {...props}
        />
      )}

      {/* Estado de erro */}
      {hasError && (
        <div className="image-error">
          <span>Erro ao carregar imagem</span>
        </div>
      )}
    </div>
  );
};

// Headers de cache
export const getCacheHeaders = (imageType) => {
  const headers = {
    'Cache-Control': 'public, max-age=31536000, immutable',
    'X-Content-Type-Options': 'nosniff'
  };

  if (imageType === 'webp') {
    headers['Vary'] = 'Accept';
  }

  return headers;
};

export default {
  supportsWebP,
  getOptimizedImageUrl,
  generateSrcSet,
  useImagePreload,
  AdvancedOptimizedImage,
  getCacheHeaders
};