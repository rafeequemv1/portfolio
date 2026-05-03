import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, Send, Sparkles } from 'lucide-react';
import { supabase } from '../supabase/client';
import { ROUTES } from '../utils/routes';
import type { View } from '../types';

export type HomeLeadModalMode = 'work-with-me' | 'cover-art';

const SERVICE_OPTIONS = [
  { id: 'journal-cover', label: 'Journal cover art', hint: 'Nature, Cell, custom—high-impact visuals' },
  { id: 'figures', label: 'Figures & infographics', hint: 'Publications, grants, slides' },
  { id: 'lab-web', label: 'Lab website', hint: 'New site or redesign' },
  { id: 'workshop', label: 'Workshop / training', hint: 'On-campus or online' },
] as const;

type ServiceId = (typeof SERVICE_OPTIONS)[number]['id'] | '';

interface HomeLeadModalProps {
  mode: HomeLeadModalMode;
  onClose: () => void;
  navigate?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, view: View, path: string) => void;
}

const HomeLeadModal: React.FC<HomeLeadModalProps> = ({ mode, onClose, navigate }) => {
  const [selected, setSelected] = useState<ServiceId>('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setSent(false);
    setSending(false);
    if (mode === 'cover-art') {
      setSelected('journal-cover');
    } else {
      setSelected('');
    }
    setName('');
    setEmail('');
    setMessage('');
  }, [mode]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const title = mode === 'cover-art' ? 'Request cover illustration' : 'Work with me';
  const subtitle =
    mode === 'cover-art'
      ? 'Tell me about your journal, timeline, and visual direction. I reply personally by email.'
      : 'Choose a focus (optional), add a short note, and send—I typically reply within a few business days.';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const label = SERVICE_OPTIONS.find((o) => o.id === selected)?.label;
    const homeTag =
      mode === 'cover-art' ? '[Home — Request illustration]' : '[Home — Work with me]';
    const composed = [
      homeTag,
      label ? `Interested in: ${label}` : 'Interested in: (not specified)',
      '',
      message.trim(),
    ].join('\n');
    const { error } = await supabase.from('contact_messages').insert({
      name: name.trim(),
      email: email.trim(),
      message: composed,
    });
    setSending(false);
    if (error) {
      alert(error.message);
      return;
    }
    setSent(true);
  };

  const goServices = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (navigate) {
      e.preventDefault();
      onClose();
      navigate(e, 'services', `${ROUTES.services}#request-illustration`);
    }
  };

  const modal = (
    <div className="fixed inset-0 z-[200] flex items-end justify-center p-4 sm:items-center" role="presentation">
      <div
        className="absolute inset-0 bg-[#37352f]/40 backdrop-blur-[2px]"
        aria-hidden
        onMouseDown={() => onClose()}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="home-lead-modal-title"
        className="relative z-10 flex max-h-[min(92dvh,720px)] w-[min(100%,32rem)] flex-col rounded-t-2xl border border-[#37352f]/10 bg-[#fcfaf8] shadow-2xl sm:max-h-[85vh] sm:rounded-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#37352f]/10 px-5 pb-4 pt-5 sm:px-6">
          <div className="min-w-0">
            <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-[#37352f]/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#37352f]/55">
              <Sparkles className="h-3 w-3" strokeWidth={2} aria-hidden />
              Studio inquiry
            </div>
            <h2 id="home-lead-modal-title" className="font-serif text-2xl tracking-tight text-[#37352f] sm:text-[1.65rem]">
              {title}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-[#37352f]/65">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-[#37352f]/10 text-[#37352f]/50 transition-colors hover:border-[#37352f]/25 hover:bg-white hover:text-[#37352f]"
            aria-label="Close"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6 sm:py-5">
          {sent ? (
            <div className="space-y-4 rounded-xl border border-emerald-200/80 bg-emerald-50/90 px-4 py-6 text-center">
              <p className="font-serif text-lg text-emerald-950">Thank you — your note is in.</p>
              <p className="text-sm text-emerald-900/80">Watch your inbox; I reply personally (no bots).</p>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  onClose();
                }}
                className="rounded-md bg-[#37352f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-black"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'work-with-me' && (
                <fieldset className="space-y-2">
                  <legend className="text-xs font-bold uppercase tracking-[0.14em] text-[#37352f]/50">What do you need?</legend>
                  <p className="text-xs text-[#37352f]/45">Optional—helps me respond with the right samples and timeline.</p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {SERVICE_OPTIONS.map((opt) => {
                      const active = selected === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSelected(active ? '' : opt.id)}
                          className={`rounded-md border px-3 py-3 text-left text-sm transition-all ${
                            active
                              ? 'border-[#37352f] bg-white shadow-md ring-2 ring-[#37352f]/10'
                              : 'border-[#37352f]/10 bg-white/60 hover:border-[#37352f]/25 hover:bg-white'
                          }`}
                        >
                          <span className="font-semibold text-[#37352f]">{opt.label}</span>
                          <span className="mt-0.5 block text-xs text-[#37352f]/50">{opt.hint}</span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              )}

              {mode === 'cover-art' && (
                <p className="rounded-xl border border-[#37352f]/10 bg-white/80 px-3 py-2.5 text-xs text-[#37352f]/70">
                  <span className="font-semibold text-[#37352f]">Journal cover art</span> is pre-selected. Add journal name, deadline, and any reference covers you like.
                </p>
              )}

              <div className="space-y-3">
                <div>
                  <label htmlFor="home-lead-name" className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#37352f]/55">
                    Name
                  </label>
                  <input
                    id="home-lead-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    className="w-full rounded-xl border border-[#37352f]/12 bg-white px-4 py-3 text-sm text-[#37352f] outline-none focus:border-[#37352f]/35"
                  />
                </div>
                <div>
                  <label htmlFor="home-lead-email" className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#37352f]/55">
                    Work email
                  </label>
                  <input
                    id="home-lead-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="w-full rounded-xl border border-[#37352f]/12 bg-white px-4 py-3 text-sm text-[#37352f] outline-none focus:border-[#37352f]/35"
                  />
                </div>
                <div>
                  <label htmlFor="home-lead-message" className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#37352f]/55">
                    Project details
                  </label>
                  <textarea
                    id="home-lead-message"
                    required
                    rows={mode === 'cover-art' ? 5 : 4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      mode === 'cover-art'
                        ? 'Target journal, story in one sentence, deadline, links to paper or refs…'
                        : 'Scope, timeline, budget range if any, links…'
                    }
                    className="w-full resize-y rounded-xl border border-[#37352f]/12 bg-white px-4 py-3 text-sm text-[#37352f] outline-none focus:border-[#37352f]/35"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={sending}
                className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-md bg-[#37352f] py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-black disabled:opacity-60"
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" strokeWidth={2} aria-hidden />}
                Send request
              </button>

              <p className="text-center text-[11px] text-[#37352f]/45">
                Prefer a longer brief or lab / workshop forms?{' '}
                <a
                  href={`${ROUTES.services}#request-illustration`}
                  onClick={goServices}
                  className="font-semibold text-[#37352f] underline decoration-[#37352f]/25 underline-offset-2 hover:decoration-[#37352f]"
                >
                  Open full services page
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modal, document.body);
};

export default HomeLeadModal;
