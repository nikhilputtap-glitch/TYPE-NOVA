import React, { useEffect } from 'react';

// NOTE: Google Mobile Ads SDK is for Native Mobile Apps.
// For web application, use Google Publisher Tags (GPT).
//
// Ad Unit ID: /1438098329039373/9721439357

export default function AdBanner() {
  useEffect(() => {
    // Load GPT script if not loaded
    if (!document.getElementById('gpt-script')) {
      const script = document.createElement('script');
      script.id = 'gpt-script';
      script.src = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';
      script.async = true;
      document.head.appendChild(script);
    }

    // Define and display Ad safely
    (window as any).googletag = (window as any).googletag || { cmd: [] };
    (window as any).googletag.cmd.push(() => {
      const gpt = (window as any).googletag;
      const slot = gpt.defineSlot('/1438098329039373/9721439357', [320, 50], 'div-gpt-ad-1234567890-0');
      if (slot) {
        slot.addService(gpt.pubads());
        gpt.pubads().enableSingleRequest();
        gpt.enableServices();
        gpt.display('div-gpt-ad-1234567890-0');
      }
    });
  }, []);

  return (
    <div className="w-full flex justify-center items-center p-4 bg-white/5 border border-white/5 rounded-2xl">
      <div id='div-gpt-ad-1234567890-0' style={{ width: '320px', height: '50px', backgroundColor: 'transparent' }}>
        {/* Ad loads here */}
      </div>
    </div>
  );
}
