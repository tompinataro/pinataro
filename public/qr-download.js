// Adjust download links to work both with Express (/dl) and Live Server
(function(){
  function adjust(){
    var port = location.port;
    var isLive = port === '5500' || port === '5501' || (location.hostname === '127.0.0.1' && port && port !== '3000');
    if (isLive) {
      document.querySelectorAll('a[href^="/dl/"]').forEach(function(a){
        var rel = a.getAttribute('href').replace(/^\/dl\//,'');
        a.setAttribute('href','/' + rel.replace(/^\//,''));
        if (!a.hasAttribute('download')) {
          a.setAttribute('download', rel.split('/').pop());
        }
      });
    } else {
      document.querySelectorAll('a[data-dl]').forEach(function(a){
        var rel = (a.getAttribute('data-dl')||'').replace(/^\//,'');
        if (rel) {
          a.setAttribute('href','/dl/' + rel);
          if (!a.hasAttribute('download')) {
            a.setAttribute('download', rel.split('/').pop());
          }
        }
      });
    }
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', adjust); } else { adjust(); }
})();

