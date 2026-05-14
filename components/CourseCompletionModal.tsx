import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface CourseCompletionModalProps {
  open: boolean;
  courseTitle: string;
  onClose: () => void;
}

/** Silly “spaghetti shower” celebration when all chapters are marked complete. */
const CourseCompletionModal: React.FC<CourseCompletionModalProps> = ({ open, courseTitle, onClose }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!mounted || typeof document === 'undefined' || !open) return null;

  const noodles = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    left: `${(i * 37) % 100}%`,
    delay: `${(i % 7) * 0.12}s`,
    dur: `${2.4 + (i % 5) * 0.35}s`,
    emoji: i % 3 === 0 ? '🍝' : i % 3 === 1 ? '🎉' : '✨',
  }));

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-celebrate-title"
    >
      <style>{`
        @keyframes courseNoodleFall {
          0% { transform: translateY(-12vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0.3; }
        }
      `}</style>
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {noodles.map((n) => (
          <span
            key={n.id}
            className="absolute -top-10 text-2xl opacity-90"
            style={{
              left: n.left,
              animation: `courseNoodleFall ${n.dur} ease-in ${n.delay} forwards`,
            }}
          >
            {n.emoji}
          </span>
        ))}
      </div>
      <div className="pointer-events-auto relative z-[1] w-full max-w-md rounded-2xl border border-[#37352f]/15 bg-[#fcfaf8] p-8 text-center shadow-2xl">
        <p className="text-4xl" aria-hidden>
          🍝
        </p>
        <h2 id="course-celebrate-title" className="mt-4 font-serif text-2xl text-[#37352f]">
          Congratulations!
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#37352f]/70">
          You marked every chapter complete in <span className="font-medium text-[#37352f]">{courseTitle}</span>. That deserves a spaghetti
          shower.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-8 w-full rounded-xl bg-[#37352f] px-5 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-[#2a2a26]"
        >
          Keep learning
        </button>
      </div>
    </div>,
    document.body
  );
};

export default CourseCompletionModal;
