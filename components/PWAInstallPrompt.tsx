import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Check if mobile/tablet via user agent to only show on relevant devices
      if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-bounce-subtle">
      <div className="bg-blue-600 text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-3 pr-2">
        <span className="text-sm font-medium whitespace-nowrap">Install GitLaunch App</span>
        <button 
            onClick={handleInstall}
            className="bg-white/20 hover:bg-white/30 p-1.5 rounded-full transition-colors"
        >
            <Download className="w-4 h-4" />
        </button>
        <button 
            onClick={() => setIsVisible(false)}
            className="text-blue-200 hover:text-white p-1"
        >
            <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;