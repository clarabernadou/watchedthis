/*
 * Mode démo de WatchedThis (version de novembre 2023).
 * L’API Express/MySQL du projet (http://localhost:8080) est simulée dans le
 * navigateur : le catalogue vient de films.json (données fictives), et les
 * comptes, listes « à voir » / « déjà vus », notes et commentaires restent dans
 * le localStorage du visiteur. La liste des genres TMDB et les images (affiches,
 * photos de profil) sont fournies localement, sans appel externe.
 */
(function () {
  'use strict';

  var API_URL = /^https?:\/\/localhost:8080\/(.*)$/;
  var GENRES_URL = /^https:\/\/api\.themoviedb\.org\/3\/genre\/movie\/list/;
  var POSTER_URL = /^https:\/\/image\.tmdb\.org\/t\/p\/[^\/]+\/poster-(\d+)\.jpg/;
  var LOCAL_IMAGE_URL = /^(?:https?:\/\/[^\/]+)?\/images\/(.+)$/;
  var STORE_KEY = 'watchedthis2023_demo_store_v1';
  var BANNER_KEY = 'watchedthis2023_demo_banner';
  var ROOT = new URL('./', document.currentScript.src).href;
  var RESPONSE_DELAY = 120;
  var DEMO = { username: 'demo', email: 'demo@watchedthis.fr', password: 'Demo1234' };
  var STATUS_TEXT = { 200: 'OK', 400: 'Bad Request', 401: 'Unauthorized', 404: 'Not Found', 500: 'Internal Server Error' };
  var GENRES = [
    { id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 16, name: 'Animation' }, { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' }, { id: 99, name: 'Documentary' }, { id: 18, name: 'Drama' }, { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' }, { id: 36, name: 'History' }, { id: 27, name: 'Horror' }, { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' }, { id: 10749, name: 'Romance' }, { id: 878, name: 'Science Fiction' },
    { id: 10770, name: 'TV Movie' }, { id: 53, name: 'Thriller' }, { id: 10752, name: 'War' }, { id: 37, name: 'Western' }
  ];

  var nativeFetch = window.fetch.bind(window);
  var nativeOpen = XMLHttpRequest.prototype.open;
  var nativeSend = XMLHttpRequest.prototype.send;
  var nativeSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
  var catalog = null;
  var films = [];
  var byId = {};
  var posters = {};
  var store = null;

  /* ---------- Outils ---------- */

  function readStore() {
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function saveStore() {
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(store));
    } catch (error) {
      /* Stockage plein ou bloqué : les données restent en mémoire pour la session. */
    }
  }

  function sha256(text) {
    if (window.crypto && window.crypto.subtle && window.TextEncoder) {
      return window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (buffer) {
        return Array.prototype.map.call(new Uint8Array(buffer), function (byte) {
          return ('0' + byte.toString(16)).slice(-2);
        }).join('');
      });
    }
    return Promise.resolve('plain:' + text);
  }

  function reply(status, payload) {
    return { status: status, payload: payload };
  }

  function readBody(body) {
    if (typeof FormData !== 'undefined' && body instanceof FormData) {
      var fields = {};
      var file = null;
      body.forEach(function (value, key) {
        if (value instanceof File) {
          file = value;
        } else {
          fields[key] = value;
        }
      });
      return { data: fields, file: file };
    }
    if (typeof body === 'string') {
      try { return { data: JSON.parse(body), file: null }; } catch (error) { /* corps invalide */ }
    }
    return { data: {}, file: null };
  }

  function fileToImage(file, size) {
    return new Promise(function (resolve) {
      if (!file) {
        resolve(null);
        return;
      }
      var reader = new FileReader();
      reader.onerror = function () { resolve(null); };
      reader.onload = function () {
        var image = new Image();
        image.onerror = function () { resolve(null); };
        image.onload = function () {
          var ratio = Math.min(1, size / Math.max(image.width, image.height));
          var canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(image.width * ratio));
          canvas.height = Math.max(1, Math.round(image.height * ratio));
          canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  /* ---------- Images générées (aucune image externe) ---------- */

  function wrapText(context, text, maxWidth) {
    var words = String(text).split(' ');
    var lines = [];
    var line = '';
    words.forEach(function (word) {
      var test = line ? line + ' ' + word : word;
      if (line && context.measureText(test).width > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    });
    if (line) {
      lines.push(line);
    }
    return lines;
  }

  function posterArt(id) {
    if (posters[id]) {
      return posters[id];
    }
    var film = byId[id];
    var title = film ? film.title : 'Poster';
    var year = film ? String(film.release_date).slice(0, 4) : '';
    var firstGenre = film ? JSON.parse(film.genre_ids)[0] : 0;
    var hue = film ? (firstGenre * 37 + film.id * 13) % 360 : 210;
    var canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 750;
    var context = canvas.getContext('2d');
    var gradient = context.createLinearGradient(0, 0, 500, 750);
    gradient.addColorStop(0, 'hsl(' + hue + ', 55%, 34%)');
    gradient.addColorStop(1, 'hsl(' + ((hue + 40) % 360) + ', 60%, 14%)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 500, 750);
    context.fillStyle = 'rgba(255, 255, 255, 0.10)';
    context.beginPath();
    context.arc(400, 140, 150, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.arc(90, 620, 190, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = '#ffffff';
    context.textAlign = 'center';
    context.font = 'bold 46px Arial, sans-serif';
    var lines = wrapText(context, title, 400);
    var top = 330 - (lines.length * 54) / 2;
    lines.forEach(function (text, index) {
      context.fillText(text, 250, top + index * 54);
    });
    context.font = '30px Arial, sans-serif';
    context.fillStyle = 'rgba(255, 255, 255, 0.85)';
    context.fillText(year, 250, top + lines.length * 54 + 28);
    context.font = '20px Arial, sans-serif';
    context.fillStyle = 'rgba(255, 255, 255, 0.6)';
    context.fillText('Affiche fictive (démo)', 250, 712);
    posters[id] = canvas.toDataURL('image/jpeg', 0.85);
    return posters[id];
  }

  var defaultAvatarUrl = null;
  function defaultAvatar() {
    if (defaultAvatarUrl) {
      return defaultAvatarUrl;
    }
    var canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    var context = canvas.getContext('2d');
    context.fillStyle = '#5b4b8a';
    context.fillRect(0, 0, 200, 200);
    context.fillStyle = 'rgba(255, 255, 255, 0.9)';
    context.beginPath();
    context.arc(100, 80, 38, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.arc(100, 205, 78, Math.PI, Math.PI * 2);
    context.fill();
    defaultAvatarUrl = canvas.toDataURL('image/png');
    return defaultAvatarUrl;
  }

  function rewriteImage(value) {
    var text = String(value);
    var poster = POSTER_URL.exec(text);
    if (poster) {
      return posterArt(Number(poster[1]));
    }
    var local = LOCAL_IMAGE_URL.exec(text);
    if (local) {
      var name = decodeURIComponent(local[1]);
      if (store && store.avatars && store.avatars[name]) {
        return store.avatars[name];
      }
      if (/^defaultProfilePicture\./.test(name)) {
        return defaultAvatar();
      }
    }
    return value;
  }

  var srcDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
  Object.defineProperty(HTMLImageElement.prototype, 'src', {
    configurable: true,
    enumerable: srcDescriptor.enumerable,
    get: srcDescriptor.get,
    set: function (value) { srcDescriptor.set.call(this, rewriteImage(value)); }
  });

  var nativeSetAttribute = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function (name, value) {
    if (this instanceof HTMLImageElement && String(name).toLowerCase() === 'src') {
      return nativeSetAttribute.call(this, name, rewriteImage(value));
    }
    return nativeSetAttribute.apply(this, arguments);
  };

  /* ---------- Données de départ ---------- */

  function loadCatalog() {
    if (!catalog) {
      catalog = nativeFetch(ROOT + 'films.json')
        .then(function (response) { return response.json(); })
        .then(function (list) {
          films = list;
          byId = {};
          list.forEach(function (film) { byId[film.id] = film; });
          return films;
        });
    }
    return catalog;
  }

  function newUserFilm(userId, filmId) {
    var now = new Date().toISOString();
    return {
      filmId: Number(filmId), userId: Number(userId), toWatch: false, alreadyWatched: false,
      notation: null, comment: null, place: null, with: null, createdAt: now, updatedAt: now
    };
  }

  function ensureStore() {
    if (store) {
      return Promise.resolve(store);
    }
    store = readStore();
    if (store) {
      return Promise.resolve(store);
    }
    return sha256(DEMO.username + ':' + DEMO.password).then(function (hash) {
      var rows = [];
      [6, 8, 13, 21].forEach(function (id) {
        var row = newUserFilm(1, id);
        row.toWatch = true;
        rows.push(row);
      });
      [[5, 5, 'Amazing soundtrack and a great ending.', 'Cinema'], [1, 5, 'A classic that never gets old.', 'Home'], [16, 4, 'Perfect for Halloween night.', 'Home']].forEach(function (item) {
        var row = newUserFilm(1, item[0]);
        row.alreadyWatched = true;
        row.notation = item[1];
        row.comment = item[2];
        row.place = item[3];
        rows.push(row);
      });
      store = {
        users: [{ id: 1, username: DEMO.username, email: DEMO.email, hash: hash, profilePicture: 'defaultProfilePicture.png' }],
        userFilms: rows,
        avatars: {}
      };
      saveStore();
      return store;
    });
  }

  /* ---------- Routes de l’API ---------- */

  function findUser(id) {
    return store.users.filter(function (user) { return String(user.id) === String(id); })[0] || null;
  }

  function findUserFilm(userId, filmId) {
    return store.userFilms.filter(function (row) {
      return String(row.userId) === String(userId) && String(row.filmId) === String(filmId);
    })[0] || null;
  }

  function signup(data) {
    var username = String(data.username || '').trim();
    var email = String(data.email || '').trim().toLowerCase();
    if (!username || !email || !data.password) {
      return Promise.resolve(reply(400, { message: 'Failed! Username, email and password are required!' }));
    }
    if (store.users.some(function (user) { return user.username.toLowerCase() === username.toLowerCase(); })) {
      return Promise.resolve(reply(400, { message: 'Failed! Username is already in use!' }));
    }
    if (store.users.some(function (user) { return user.email === email; })) {
      return Promise.resolve(reply(400, { message: 'Failed! Email is already in use!' }));
    }
    return sha256(username + ':' + String(data.password)).then(function (hash) {
      var id = store.users.reduce(function (max, user) { return Math.max(max, user.id); }, 0) + 1;
      store.users.push({ id: id, username: username, email: email, hash: hash, profilePicture: 'defaultProfilePicture.png' });
      saveStore();
      return reply(200, { message: 'User was registered successfully!' });
    });
  }

  function signin(data) {
    var username = String(data.username || '').trim();
    var user = store.users.filter(function (item) { return item.username.toLowerCase() === username.toLowerCase(); })[0];
    if (!user) {
      return Promise.resolve(reply(404, { message: 'User Not found.' }));
    }
    return sha256(user.username + ':' + String(data.password || '')).then(function (hash) {
      if (hash !== user.hash) {
        return reply(401, { accessToken: null, message: 'Invalid Password!' });
      }
      return reply(200, {
        id: user.id, username: user.username, email: user.email, profilePicture: user.profilePicture,
        roles: ['ROLE_USER'], authentication_token: 'demo.' + user.id, is_verified: true
      });
    });
  }

  function updateProfile(userId, body) {
    var user = findUser(userId);
    if (!user) {
      return Promise.resolve(reply(404, { message: 'User Not found.' }));
    }
    var request = readBody(body);
    var username = String(request.data.username || '').trim();
    var email = String(request.data.email || '').trim().toLowerCase();
    if (username && store.users.some(function (other) { return other.id !== user.id && other.username.toLowerCase() === username.toLowerCase(); })) {
      return Promise.resolve(reply(500, { message: 'Username must be unique' }));
    }
    if (email && store.users.some(function (other) { return other.id !== user.id && other.email === email; })) {
      return Promise.resolve(reply(500, { message: 'Email must be unique' }));
    }
    return fileToImage(request.file, 256).then(function (image) {
      if (username) {
        user.username = username;
      }
      if (email) {
        user.email = email;
      }
      if (image) {
        var name = 'upload-' + user.id + '-' + Date.now() + '.jpg';
        store.avatars[name] = image;
        user.profilePicture = name;
      }
      saveStore();
      return reply(200, { message: 'User profile updated successfully!' });
    });
  }

  function handleAuth(method, parts, body) {
    var action = parts[2];
    if (action === 'signup' && method === 'POST') {
      return signup(readBody(body).data);
    }
    if (action === 'signin' && method === 'POST') {
      return signin(readBody(body).data);
    }
    if (action === 'logout' && method === 'POST') {
      return Promise.resolve(reply(200, { message: 'You have been logged out.' }));
    }
    if (action === 'verify' && method === 'GET') {
      return Promise.resolve(reply(200, { message: 'Your account has been validated.' }));
    }
    if (action === 'update' && method === 'PUT') {
      return updateProfile(parts[3], body);
    }
    if (method === 'GET' && action) {
      var user = findUser(action);
      return Promise.resolve(user
        ? reply(200, { username: user.username, email: user.email, profilePicture: user.profilePicture })
        : reply(404, { message: 'User Not found.' }));
    }
    return Promise.resolve(reply(404, { message: 'Not found.' }));
  }

  function handleUserFilms(method, parts, body) {
    var userId = parts[3];
    if (parts[4] === 'save-films' && method === 'GET') {
      return reply(200, store.userFilms);
    }
    if (parts[4] !== 'film') {
      return reply(404, { error: 'Not found' });
    }
    var filmId = parts[5];
    var action = parts[6];
    var row = findUserFilm(userId, filmId);
    if (action === 'status' && method === 'GET') {
      return reply(200, row || { filmId: null, toWatch: false, alreadyWatched: false, notation: null, comment: null, place: null, with: null });
    }
    if ((action === 'add-to-watchlist' || action === 'add-to-already-watched') && method === 'POST') {
      var field = action === 'add-to-watchlist' ? 'toWatch' : 'alreadyWatched';
      if (!row) {
        row = newUserFilm(userId, filmId);
        store.userFilms.push(row);
      }
      row[field] = !row[field];
      row.updatedAt = new Date().toISOString();
      saveStore();
      var messages = {
        toWatch: ['Film removed from watchlist successfully', 'Film added to watchlist successfully'],
        alreadyWatched: ['Film marked as not watched successfully', 'Film marked as already watched successfully']
      };
      return reply(200, { message: messages[field][row[field] ? 1 : 0] });
    }
    if (action === 'update' && parts[7] === 'userFilm' && method === 'PUT') {
      if (!row) {
        return reply(404, { error: 'UserFilm association not found' });
      }
      var data = readBody(body).data;
      if (data.comment !== undefined) {
        row.comment = data.comment;
      }
      if (data.notation !== undefined) {
        row.notation = Number(data.notation) === 0 ? null : data.notation;
      }
      if (data.place !== undefined) {
        row.place = data.place;
      }
      if (data.withList !== undefined) {
        row.with = data.withList;
      }
      row.updatedAt = new Date().toISOString();
      saveStore();
      return reply(200, { message: 'Film data updated successfully' });
    }
    return reply(404, { error: 'Not found' });
  }

  function handleFilms(method, parts, body) {
    if (!parts[2] && method === 'GET') {
      return reply(200, films);
    }
    if (parts[2] === 'auth') {
      return handleUserFilms(method, parts, body);
    }
    if (parts[2] === 'update' && method === 'PUT') {
      return reply(200, { message: 'Film updated successfully' });
    }
    if (method === 'GET' && byId[parts[2]]) {
      return reply(200, byId[parts[2]]);
    }
    return reply(404, { error: 'Film not found' });
  }

  function route(method, path, body) {
    var parts = path.split('?')[0].replace(/^\/+|\/+$/g, '').split('/');
    return Promise.all([ensureStore(), loadCatalog()]).then(function () {
      if (parts[0] !== 'api') {
        return reply(404, { message: 'Not found.' });
      }
      if (parts[1] === 'auth') {
        return handleAuth(method, parts, body);
      }
      if (parts[1] === 'films') {
        return handleFilms(method, parts, body);
      }
      return reply(404, { message: 'Not found.' });
    });
  }

  /* ---------- Interception de fetch (liste des genres TMDB) ---------- */

  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || String(input);
    if (GENRES_URL.test(url)) {
      return Promise.resolve(new Response(JSON.stringify({ genres: GENRES }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    }
    return nativeFetch(input, init);
  };

  /* ---------- Interception de XMLHttpRequest (axios) ---------- */

  function finish(xhr, url, result) {
    var text = JSON.stringify(result.payload);
    var fields = {
      readyState: 4,
      status: result.status,
      statusText: STATUS_TEXT[result.status] || '',
      responseURL: url,
      responseText: text,
      response: xhr.responseType === 'json' ? JSON.parse(text) : text
    };
    Object.keys(fields).forEach(function (key) {
      Object.defineProperty(xhr, key, { value: fields[key], configurable: true });
    });
    xhr.getAllResponseHeaders = function () { return 'content-type: application/json; charset=utf-8\r\n'; };
    xhr.getResponseHeader = function (name) { return /^content-type$/i.test(name) ? 'application/json; charset=utf-8' : null; };
    xhr.dispatchEvent(new Event('readystatechange'));
    xhr.dispatchEvent(new ProgressEvent('load'));
    xhr.dispatchEvent(new ProgressEvent('loadend'));
  }

  XMLHttpRequest.prototype.open = function (method, url) {
    var match = API_URL.exec(String(url));
    this.__demo = match ? { method: String(method).toUpperCase(), url: String(url), path: match[1] } : null;
    if (this.__demo) {
      return nativeOpen.call(this, method, window.location.href);
    }
    return nativeOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.setRequestHeader = function () {
    return nativeSetRequestHeader.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function (body) {
    var demo = this.__demo;
    if (!demo) {
      return nativeSend.apply(this, arguments);
    }
    var xhr = this;
    route(demo.method, demo.path, body)
      .catch(function () { return reply(500, { message: 'Erreur de la démo' }); })
      .then(function (result) {
        window.setTimeout(function () { finish(xhr, demo.url, result); }, RESPONSE_DELAY);
      });
  };

  /* ---------- Bandeau d’information ---------- */

  function showBanner() {
    try {
      if (window.sessionStorage.getItem(BANNER_KEY) === 'closed') {
        return;
      }
    } catch (error) { /* sessionStorage indisponible */ }
    var banner = document.createElement('div');
    banner.setAttribute('role', 'note');
    banner.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:99999;max-width:360px;padding:10px 12px;' +
      'border-radius:10px;background:#1f2933;color:#fff;font:13px/1.45 Arial,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.35)';
    banner.innerHTML = '<strong>Version de démonstration</strong> : l’API est simulée dans votre navigateur ' +
      '(les données restent sur votre appareil, les comptes créés sont déjà vérifiés).<br>Les informations sur les films ' +
      '(titres, résumés, notes, dates) sont des données fictives et <strong>peuvent être incorrectes</strong> ; les images sont générées.<br>' +
      'Compte test : <code style="color:#ffd1b0">' + DEMO.username + '</code> / <code style="color:#ffd1b0">' + DEMO.password + '</code><br>' +
      '<a href="#" data-reset style="color:#ffb27a">Réinitialiser la démo</a> · <a href="#" data-close style="color:#ffb27a">Fermer</a>';
    banner.querySelector('[data-close]').addEventListener('click', function (event) {
      event.preventDefault();
      try { window.sessionStorage.setItem(BANNER_KEY, 'closed'); } catch (error) { /* ignoré */ }
      banner.remove();
    });
    banner.querySelector('[data-reset]').addEventListener('click', function (event) {
      event.preventDefault();
      try { window.localStorage.removeItem(STORE_KEY); } catch (error) { /* ignoré */ }
      ['authentication_token', 'user_id', 'userInfoCookie'].forEach(function (name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      });
      window.location.href = ROOT;
    });
    document.body.appendChild(banner);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showBanner);
  } else {
    showBanner();
  }
})();
