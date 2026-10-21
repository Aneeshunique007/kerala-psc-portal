// Service Worker Registration
export function registerSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('SW registered:', reg.scope);

          // Check for updates every hour
          setInterval(() => reg.update(), 60 * 60 * 1000);

          reg.onupdatefound = () => {
            const newWorker = reg.installing;
            newWorker.onstatechange = () => {
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                // New content available — show a subtle toast
                showUpdateToast();
              }
            };
          };
        })
        .catch((err) => console.error('SW registration failed:', err));
    });
  }
}

function showUpdateToast() {
  const toast = document.createElement('div');
  toast.id = 'pwa-update-toast';
  toast.innerHTML = `
    <span>🔄 App updated!</span>
    <button onclick="window.location.reload()">Reload</button>
  `;
  toast.style.cssText = `
    position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
    background: #0ea5e9; color: #fff; padding: 10px 20px; border-radius: 12px;
    display: flex; align-items: center; gap: 12px; z-index: 9999;
    box-shadow: 0 4px 20px rgba(0,0,0,0.4); font-family: 'Outfit', sans-serif;
    font-size: 14px; font-weight: 500; animation: slideUp 0.3s ease;
  `;
  toast.querySelector('button').style.cssText = `
    background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.4);
    color: #fff; padding: 4px 12px; border-radius: 8px; cursor: pointer;
    font-size: 13px; font-weight: 600;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 10000);
}
