const EVENT_IMAGE_FIELDS = Object.freeze({
  imagem: 'imagem',
  banner: 'banner_desktop',
  mapa: 'mapa_evento'
});

function isManagedEventImageUrl(value) {
  return /^\/api\/events\/\d+\/imagem\?campo=(?:imagem|banner|mapa)(?:&v=[^&]+)?$/i.test(String(value || '').trim());
}

function eventImageResponse(value, eventId, field, version) {
  const image = value == null ? null : String(value);
  if (!image || !/^data:/i.test(image)) return value || null;
  const publicField = Object.entries(EVENT_IMAGE_FIELDS).find(([, column]) => column === field)?.[0] || field;
  return `/api/events/${eventId}/imagem?campo=${publicField}&v=${encodeURIComponent(String(version ?? ''))}`;
}

function eventImageVersion(value) {
  const image = String(value || '');
  return /^data:/i.test(image) ? Buffer.byteLength(image, 'utf8') : null;
}

function preserveEventImageInput(value) {
  const image = value == null ? null : String(value).trim();
  return image && isManagedEventImageUrl(image) ? null : (image || null);
}

function decodeDataImage(value) {
  const match = String(value || '').match(/^data:([^;,]+);base64,([A-Za-z0-9+/=\s]+)$/i);
  if (!match) return null;
  return { contentType: match[1].toLowerCase(), data: Buffer.from(match[2].replace(/\s/g, ''), 'base64') };
}

module.exports = {
  EVENT_IMAGE_FIELDS,
  decodeDataImage,
  eventImageResponse,
  eventImageVersion,
  isManagedEventImageUrl,
  preserveEventImageInput
};
