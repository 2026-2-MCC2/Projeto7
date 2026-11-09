(function installAuthenticatedFetch() {
  const originalFetch = window.fetch.bind(window);

  function readSessionToken() {
    for (const key of ['trocaticket-user', 'usuario']) {
      try {
        const stored = window.localStorage.getItem(key);
        if (!stored) continue;
        const user = JSON.parse(stored);
        if (user && typeof user.session_token === 'string' && user.session_token) {
          return user.session_token;
        }
      } catch {
        continue;
      }
    }
    return null;
  }

  function isSameOriginApiRequest(input) {
    const requestUrl = typeof input === 'string' ? input : input && input.url;
    if (!requestUrl) return false;
    try {
      const url = new URL(requestUrl, window.location.href);
      return url.origin === window.location.origin && url.pathname.startsWith('/api/');
    } catch {
      return false;
    }
  }

  window.fetch = function authenticatedFetch(input, init) {
    if (!isSameOriginApiRequest(input)) return originalFetch(input, init);

    const token = readSessionToken();
    if (!token) return originalFetch(input, init);

    const headers = new Headers(
      (init && init.headers) || (typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined)
    );
    if (headers.has('Authorization')) return originalFetch(input, init);

    headers.set('Authorization', `Bearer ${token}`);
    return originalFetch(input, { ...(init || {}), headers });
  };
})();
