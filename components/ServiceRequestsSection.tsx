import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import { WORKSHOP_BOOKING_TOPIC_OPTIONS } from '../data/workshopBookingTopics';
import { CalendarPlus, Loader2, Send } from 'lucide-react';

const ServiceRequestsSection: React.FC = () => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSending, setContactSending] = useState(false);
  const [contactSent, setContactSent] = useState(false);

  const [labForm, setLabForm] = useState({
    name: '',
    email: '',
    lab_name: '',
    university: '',
    current_site_url: '',
    message: '',
  });
  const [labSending, setLabSending] = useState(false);
  const [labSent, setLabSent] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    organization: '',
    preferredDates: '',
    message: '',
    topics: [] as string[],
  });
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const t = window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => window.clearTimeout(t);
  }, []);

  const resetLabForm = () => {
    setLabForm({
      name: '',
      email: '',
      lab_name: '',
      university: '',
      current_site_url: '',
      message: '',
    });
  };

  const resetBookingForm = () => {
    setBookingForm({
      name: '',
      email: '',
      organization: '',
      preferredDates: '',
      message: '',
      topics: [],
    });
  };

  const toggleTopic = (id: string) => {
    setBookingForm((prev) => ({
      ...prev,
      topics: prev.topics.includes(id) ? prev.topics.filter((t) => t !== id) : [...prev.topics, id],
    }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSending(true);
    const { error } = await supabase.from('contact_messages').insert({
      name: contactName.trim(),
      email: contactEmail.trim(),
      message: contactMessage.trim(),
    });
    setContactSending(false);
    if (error) {
      alert(error.message);
      return;
    }
    setContactSent(true);
    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  const handleLabSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLabSending(true);
    const { error } = await supabase.from('lab_website_inquiries').insert({
      name: labForm.name.trim(),
      email: labForm.email.trim(),
      lab_name: labForm.lab_name.trim() || null,
      university: labForm.university.trim() || null,
      current_site_url: labForm.current_site_url.trim() || null,
      message: labForm.message.trim() || null,
    });
    setLabSending(false);
    if (error) {
      alert(error.message);
      return;
    }
    setLabSent(true);
    resetLabForm();
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingForm.topics.length === 0) {
      alert('Please select at least one topic you are interested in.');
      return;
    }
    setBookingSubmitting(true);
    const { error: insertError } = await supabase.from('workshop_booking_inquiries').insert({
      name: bookingForm.name.trim(),
      email: bookingForm.email.trim(),
      organization: bookingForm.organization.trim() || null,
      preferred_dates: bookingForm.preferredDates.trim() || null,
      message: bookingForm.message.trim() || null,
      topics: bookingForm.topics,
    });
    setBookingSubmitting(false);
    if (insertError) {
      alert(insertError.message);
      return;
    }
    setBookingDone(true);
    resetBookingForm();
  };

  const sectionShell = (id: string, title: string, subtitle: string, children: React.ReactNode) => (
    <section
      id={id}
      className="scroll-mt-28 rounded-2xl border border-[#37352f]/10 bg-white/70 p-6 shadow-sm md:p-8"
    >
      <h2 className="font-serif text-2xl text-[#37352f]">{title}</h2>
      <p className="mt-2 text-sm text-[#37352f]/60">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </section>
  );

  return (
    <div className="mt-16 space-y-12 border-t border-[#37352f]/10 pt-16">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#37352f]/45">Requests</p>
        <h2 className="mt-2 font-serif text-3xl text-[#37352f]">Start a project</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-[#37352f]/60">
          Choose the form that fits what you need. I reply by email.
        </p>
      </div>

      {sectionShell(
        'request-illustration',
        'Cover art, figures & general inquiries',
        'Describe your publication, timeline, and what you are looking for.',
        contactSent ? (
          <div className="space-y-3 rounded-lg border border-green-200 bg-green-50 px-4 py-4 text-center text-sm text-green-900">
            <p>Thanks — your message was sent.</p>
            <button
              type="button"
              onClick={() => setContactSent(false)}
              className="text-xs font-semibold uppercase tracking-wider text-green-800 underline-offset-2 hover:underline"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="mx-auto max-w-lg space-y-4">
            <div>
              <label htmlFor="svc-contact-name" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#37352f]/55">
                Your name
              </label>
              <input
                id="svc-contact-name"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                autoComplete="name"
                className="w-full rounded-lg border border-[#37352f]/15 bg-white px-4 py-3 text-sm text-[#37352f] outline-none focus:border-[#37352f]/35"
              />
            </div>
            <div>
              <label htmlFor="svc-contact-email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#37352f]/55">
                Your email
              </label>
              <input
                id="svc-contact-email"
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                autoComplete="email"
                className="w-full rounded-lg border border-[#37352f]/15 bg-white px-4 py-3 text-sm text-[#37352f] outline-none focus:border-[#37352f]/35"
              />
            </div>
            <div>
              <label htmlFor="svc-contact-message" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#37352f]/55">
                Message
              </label>
              <textarea
                id="svc-contact-message"
                required
                rows={5}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                className="w-full resize-y rounded-lg border border-[#37352f]/15 bg-white px-4 py-3 text-sm text-[#37352f] outline-none focus:border-[#37352f]/35"
                placeholder="Journal, figure count, deadlines, references…"
              />
            </div>
            <button
              type="submit"
              disabled={contactSending}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#37352f] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-black disabled:opacity-60"
            >
              {contactSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" strokeWidth={2} />}
              Send message
            </button>
          </form>
        )
      )}

      {sectionShell(
        'request-lab-website',
        'Lab website',
        'New site or redesign for your research group.',
        labSent ? (
          <div className="space-y-3 rounded-lg border border-green-200 bg-green-50 px-4 py-4 text-center text-sm text-green-900">
            <p>Thanks — your request was sent.</p>
            <button
              type="button"
              onClick={() => setLabSent(false)}
              className="text-xs font-semibold uppercase tracking-wider text-green-800 underline-offset-2 hover:underline"
            >
              Submit another request
            </button>
          </div>
        ) : (
          <form onSubmit={handleLabSubmit} className="mx-auto max-w-lg space-y-4">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#37352f]/55">Name</label>
              <input
                required
                value={labForm.name}
                onChange={(e) => setLabForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full rounded-lg border border-[#37352f]/15 bg-white px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#37352f]/55">Email</label>
              <input
                type="email"
                required
                value={labForm.email}
                onChange={(e) => setLabForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full rounded-lg border border-[#37352f]/15 bg-white px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#37352f]/55">Lab name</label>
              <input
                value={labForm.lab_name}
                onChange={(e) => setLabForm((p) => ({ ...p, lab_name: e.target.value }))}
                className="w-full rounded-lg border border-[#37352f]/15 bg-white px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#37352f]/55">University</label>
              <input
                value={labForm.university}
                onChange={(e) => setLabForm((p) => ({ ...p, university: e.target.value }))}
                className="w-full rounded-lg border border-[#37352f]/15 bg-white px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#37352f]/55">Current site URL (optional)</label>
              <input
                type="url"
                value={labForm.current_site_url}
                onChange={(e) => setLabForm((p) => ({ ...p, current_site_url: e.target.value }))}
                className="w-full rounded-lg border border-[#37352f]/15 bg-white px-3 py-2.5 text-sm"
                placeholder="https://…"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#37352f]/55">Message (optional)</label>
              <textarea
                rows={3}
                value={labForm.message}
                onChange={(e) => setLabForm((p) => ({ ...p, message: e.target.value }))}
                className="w-full resize-y rounded-lg border border-[#37352f]/15 bg-white px-3 py-2.5 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={labSending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#37352f] py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {labSending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Send lab website request
            </button>
          </form>
        )
      )}

      {sectionShell(
        'request-workshop',
        'On-campus or online workshop',
        'Tell me about your audience, timing, and topic interests.',
        bookingDone ? (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-6 text-center text-sm text-green-900">
            <p className="font-serif text-lg">Thank you — your request was sent.</p>
            <p className="mt-2 text-[#37352f]/70">I will get back to you by email.</p>
            <button
              type="button"
              onClick={() => setBookingDone(false)}
              className="mt-4 text-xs font-semibold uppercase tracking-wider text-green-800 underline-offset-2 hover:underline"
            >
              Submit another request
            </button>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit} className="mx-auto max-w-lg space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/55">Name</label>
              <input
                required
                value={bookingForm.name}
                onChange={(e) => setBookingForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full rounded-lg border border-[#37352f]/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#37352f]/40"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/55">Email</label>
              <input
                type="email"
                required
                value={bookingForm.email}
                onChange={(e) => setBookingForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full rounded-lg border border-[#37352f]/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#37352f]/40"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/55">Organization (optional)</label>
              <input
                value={bookingForm.organization}
                onChange={(e) => setBookingForm((p) => ({ ...p, organization: e.target.value }))}
                className="w-full rounded-lg border border-[#37352f]/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#37352f]/40"
                placeholder="University, institute, company…"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/55">Preferred dates or window (optional)</label>
              <input
                value={bookingForm.preferredDates}
                onChange={(e) => setBookingForm((p) => ({ ...p, preferredDates: e.target.value }))}
                className="w-full rounded-lg border border-[#37352f]/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#37352f]/40"
                placeholder="e.g. March 2026, or flexible"
              />
            </div>
            <fieldset className="space-y-3">
              <legend className="text-xs font-bold uppercase tracking-wider text-[#37352f]/55">Topics</legend>
              <p className="text-xs text-[#37352f]/50">Select one or more focus areas.</p>
              <div className="flex flex-col gap-2">
                {WORKSHOP_BOOKING_TOPIC_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#37352f]/10 bg-white px-4 py-3 text-sm hover:border-[#37352f]/25"
                  >
                    <input
                      type="checkbox"
                      checked={bookingForm.topics.includes(opt.id)}
                      onChange={() => toggleTopic(opt.id)}
                      className="h-4 w-4 rounded border-[#37352f]/30"
                    />
                    <span className="text-[#37352f]/90">{opt.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#37352f]/55">Message (optional)</label>
              <textarea
                rows={4}
                value={bookingForm.message}
                onChange={(e) => setBookingForm((p) => ({ ...p, message: e.target.value }))}
                className="w-full resize-y rounded-lg border border-[#37352f]/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#37352f]/40"
                placeholder="Audience size, format (half-day / full day), or other notes…"
              />
            </div>
            <button
              type="submit"
              disabled={bookingSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#37352f] py-3 text-sm font-semibold text-white hover:bg-black disabled:opacity-60"
            >
              {bookingSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              <CalendarPlus size={18} strokeWidth={1.75} />
              Send workshop request
            </button>
          </form>
        )
      )}
    </div>
  );
};

export default ServiceRequestsSection;
