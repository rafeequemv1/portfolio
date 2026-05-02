import React, { useState } from 'react';
import ContactMessagesManager from './ContactMessagesManager';
import LabWebsiteInquiriesManager from './LabWebsiteInquiriesManager';
import WorkshopBookingInquiriesManager from './WorkshopBookingInquiriesManager';

type ServiceRequestTab = 'illustration' | 'lab' | 'workshop';

const ServicesAdminPanel: React.FC = () => {
  const [tab, setTab] = useState<ServiceRequestTab>('illustration');

  return (
    <div className="space-y-6">
      <p className="text-sm text-[#37352f]/60">
        Submissions from the public Services page: general messages, lab website build requests, and workshop booking inquiries.
      </p>
      <div className="inline-flex w-full max-w-2xl flex-wrap items-center gap-1 rounded-xl border border-[#37352f]/10 bg-[#37352f]/5 p-1">
        <button
          type="button"
          onClick={() => setTab('illustration')}
          className={`rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-wider sm:px-4 sm:text-xs ${
            tab === 'illustration' ? 'bg-[#37352f] text-white shadow-sm' : 'text-[#37352f]/65 hover:text-[#37352f]'
          }`}
        >
          Covers & figures
        </button>
        <button
          type="button"
          onClick={() => setTab('lab')}
          className={`rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-wider sm:px-4 sm:text-xs ${
            tab === 'lab' ? 'bg-[#37352f] text-white shadow-sm' : 'text-[#37352f]/65 hover:text-[#37352f]'
          }`}
        >
          Lab websites
        </button>
        <button
          type="button"
          onClick={() => setTab('workshop')}
          className={`rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-wider sm:px-4 sm:text-xs ${
            tab === 'workshop' ? 'bg-[#37352f] text-white shadow-sm' : 'text-[#37352f]/65 hover:text-[#37352f]'
          }`}
        >
          Workshops
        </button>
      </div>
      {tab === 'illustration' && <ContactMessagesManager />}
      {tab === 'lab' && <LabWebsiteInquiriesManager />}
      {tab === 'workshop' && <WorkshopBookingInquiriesManager />}
    </div>
  );
};

export default ServicesAdminPanel;
