const test = require('node:test');
const assert = require('node:assert/strict');
const { eventImageResponse, eventImageVersion, preserveEventImageInput } = require('./event-images');

test('converts only data images to versioned event URLs', () => {
  assert.equal(eventImageResponse('data:image/png;base64,AAAA', 6, 'imagem', 42), '/api/events/6/imagem?campo=imagem&v=42');
  assert.equal(eventImageResponse('/uploads/events/banner.jpg', 6, 'banner_desktop', 42), '/uploads/events/banner.jpg');
  assert.equal(eventImageResponse('https://blob.vercel-storage.com/banner.jpg', 6, 'banner_desktop', 42), 'https://blob.vercel-storage.com/banner.jpg');
  assert.equal(eventImageVersion('data:image/png;base64,AAAA'), 26);
});

test('preserves the stored image when an API image URL is submitted back', () => {
  assert.equal(preserveEventImageInput('/api/events/6/imagem?campo=imagem&v=42'), null);
  assert.equal(preserveEventImageInput('/uploads/events/banner.jpg'), '/uploads/events/banner.jpg');
  assert.equal(preserveEventImageInput('data:image/png;base64,AAAA'), 'data:image/png;base64,AAAA');
});
