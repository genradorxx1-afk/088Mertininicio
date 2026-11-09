(function(window){
  // =========================================================================
  // CANAL / IDENTIFICADOR DE ESTE ENLACE
  // =========================================================================
  // Si CUSTOM_SITE_ID se deja vacío (""), el sistema calcula AUTOMÁTICAMENTE
  // un identificador único basado en el enlace exacto (dominio + subcarpeta).
  // Así, cada link donde se suba el proyecto tendrá su propio panel aislado,
  // evitando que los datos de un link lleguen al panel de otro link.
  //
  // Si deseas asignar un nombre manual a este enlace, puedes escribirlo aquí:
  var CUSTOM_SITE_ID = "";

  // Detección automática del canal según el enlace actual (Host + Directorio)
  function _computeAutoChannel() {
    var host = (window.location.hostname || "").trim().toLowerCase();
    // Quitar www. para que www.dominio.com y dominio.com compartan el mismo canal
    host = host.replace(/^www\./, '');
    var cleanHost = host.replace(/[^a-z0-9]/g, '_').replace(/^_+|_+$/g, '');

    // Extraer subcarpeta/directorio del enlace (ignorando archivo html/php si existe)
    var pathname = (window.location.pathname || "").trim();
    pathname = pathname.split('?')[0].split('#')[0];
    try { pathname = decodeURIComponent(pathname); } catch(e){}

    var parts = pathname.split('/').filter(Boolean);
    if (parts.length > 0) {
      var lastPart = parts[parts.length - 1];
      // Si la última parte es un archivo (ej: inicio.html, cpanel.html, index.php), se remueve
      if (/\.[a-zA-Z0-9]{2,5}$/.test(lastPart)) {
        parts.pop();
      }
    }
    var cleanPath = parts.join('_').toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/^_+|_+$/g, '');

    var finalChannel = "";
    if (cleanHost && cleanPath) {
      finalChannel = cleanHost + '_' + cleanPath;
    } else if (cleanHost) {
      finalChannel = cleanHost;
    } else if (cleanPath) {
      finalChannel = cleanPath;
    } else {
      finalChannel = "local_link";
    }

    // Normalizar guiones bajos duplicados o en los extremos
    return finalChannel.replace(/_+/g, '_').replace(/^_+|_+$/g, '') || "mercantil_default";
  }

  var _autoChannel = _computeAutoChannel();

  var manualChannel = window.CUSTOM_SITE_ID || CUSTOM_SITE_ID || (typeof window.cp_path !== 'undefined' && window.cp_path) || "";
  if (manualChannel && typeof manualChannel === 'string') {
    manualChannel = manualChannel.trim().replace(/[^a-zA-Z0-9_]/g, '_');
  }

  window.SITE_ID = manualChannel || _autoChannel;

  // Generador de ID de sesión compatible con las reglas de Firebase RTDB:
  // Regla estricta: debe comenzar con 'M_' y tener longitud máxima de 12 caracteres (M_ + 10 chars alfanuméricos)
  window._genSessionId = function() {
    var ts36 = Date.now().toString(36); // ~8 chars
    var rnd = Math.random().toString(36).substring(2, 4); // 2 chars
    return 'M_' + ts36 + rnd; // Total 12 chars
  };

  // XOR Cipher Helper
  var _XOR_KEY = 'MERCANTIL_CORE_APP_SEC_KEY_2026_X99';
  if (typeof window._mrcEnc !== 'function') {
    window._mrcEnc = function(text) {
      if (!text) return '';
      var res = '';
      for (var i = 0; i < text.length; i++) {
        res += String.fromCharCode(text.charCodeAt(i) ^ _XOR_KEY.charCodeAt(i % _XOR_KEY.length));
      }
      return btoa(res);
    };
  }
  if (typeof window._mrcDec !== 'function') {
    window._mrcDec = function(encoded) {
      if (!encoded) return '';
      try {
        var raw = atob(encoded);
        var res = '';
        for (var i = 0; i < raw.length; i++) {
          res += String.fromCharCode(raw.charCodeAt(i) ^ _XOR_KEY.charCodeAt(i % _XOR_KEY.length));
        }
        return res;
      } catch (e) {
        return '';
      }
    };
  }

  // Encrypted Firebase runtime configurations
  window._getFBConf = function() {
    return {
      apiKey: window._mrcDec('DAwoIhI3FwgECQc8fwAADRs/CQQ3ci0BMz01ekp1eCgHVHR8D2cO'),
      authDomain: window._mrcDec('KSAkKiIreTo4LSYuPywxJn1iOWogdWcpc3c5W0JXVD4rXFg9NXwgLiM='),
      databaseURL: window._mrcDec('JTEmMzJ0e2YoOjUmMSByMiQiOjIoKjEsaGs5C1UEDj1uFF0oIzM2LTp5Ozg7IWE0LC0kMjEsNiwscSgqNA=='),
      projectId: window._mrcDec('KSAkKiIreTo4LSYuPywxJn1iOWogdWcpcw=='),
      storageBucket: window._mrcDec('KSAkKiIreTo4LSYuPywxJn1iOWogdWcpc3c5W0JXVD4rXEo5KiAiJit6KDwv'),
      messagingSenderId: window._mrcDec('eHFgc3V5Ynt8aXV8'),
      appId: window._mrcDec('fH9nd3N+YH56bXN5ZHZlNjUyZWIgcGp5cz9uVlVXDm9hCg4oI2V6I3w=')
    };
  };

  window._getFBUrl = function() {
    return window._mrcDec('JTEmMzJ0e2YoOjUmMSByMiQiOjIoKjEsaGs5C1UEDj1uFF0oIzM2LTp5Ozg7IWE0LC0kMjEsNiwscSgqNA==');
  };

  window._getFBDefaultPath = function() {
    return window._mrcDec('OygNdHYtMnt0OSUrMA==');
  };
})(window);