import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

const SCROLL_THRESHOLD = 320;

const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-[#37352f]/15 bg-[#fcfaf8]/95 text-[#37352f] shadow-lg backdrop-blur-sm transition-opacity hover:bg-[#37352f] hover:text-white supports-[bottom:max(1.25rem,env(safe-area-inset-bottom))] supports-[right:max(1.25rem,env(safe-area-inset-right))]"
      aria-label="Back to top"
      title="Back to top"
    >
      <ArrowUp size={20} strokeWidth={2} aria-hidden />
    </button>
  );
};

export default BackToTop;
