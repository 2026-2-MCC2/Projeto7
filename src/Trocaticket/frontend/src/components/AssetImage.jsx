import { useState } from 'react';

const FALLBACK_ASSET = '/imagens/logo troca ticket.png';

export function resolveAssetUrl(value, fallback = FALLBACK_ASSET) {
  const raw = String(value || '').trim();
  if (!raw) return fallback;
  if (/^(data:|blob:|https?:\/\/)/i.test(raw)) return raw;
  if (raw.startsWith('/')) return raw;
  return `/${raw.replace(/^\.?\//, '')}`;
}

export function AssetImage({ src, fallback = FALLBACK_ASSET, alt = '', ...props }) {
  const [failed, setFailed] = useState(false);
  return (
    <img
      {...props}
      src={failed ? fallback : resolveAssetUrl(src, fallback)}
      alt={alt}
      onError={() => setFailed(true)}
    />
  );
}
