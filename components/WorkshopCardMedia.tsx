import React from 'react';
import { workshopImageList } from '../utils/workshopImages';
import type { Workshop } from '../types';

/** Up to 4-image collage for workshop list cards. */
const WorkshopCardMedia: React.FC<{ workshop: Workshop; title: string }> = ({ workshop, title }) => {
  const imgs = workshopImageList(workshop);
  const extra = imgs.length > 4 ? imgs.length - 4 : 0;

  if (imgs.length === 0) {
    return (
      <div className="flex h-52 w-full items-center justify-center bg-gradient-to-br from-[#eceae6] to-[#ddd9d3] text-sm text-[#37352f]/45">
        No image
      </div>
    );
  }

  if (imgs.length === 1) {
    return <img src={imgs[0]} alt="" className="h-52 w-full object-cover" />;
  }

  if (imgs.length === 2) {
    return (
      <div className="grid h-52 w-full grid-cols-2 gap-px bg-[#37352f]/15">
        {imgs.map((src) => (
          <img key={src} src={src} alt="" className="h-full min-h-0 w-full min-w-0 object-cover" />
        ))}
      </div>
    );
  }

  if (imgs.length === 3) {
    return (
      <div className="flex h-52 w-full gap-px bg-[#37352f]/15">
        <div className="min-h-0 min-w-0 flex-[1.12]">
          <img src={imgs[0]} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="flex h-full min-h-0 w-[36%] min-w-0 flex-col gap-px">
          <div className="relative min-h-0 flex-1">
            <img src={imgs[1]} alt="" className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <div className="relative min-h-0 flex-1">
            <img src={imgs[2]} alt="" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>
      </div>
    );
  }

  const quad = imgs.slice(0, 4);
  return (
    <div className="relative grid h-52 w-full grid-cols-2 grid-rows-2 gap-px bg-[#37352f]/15">
      {quad.map((src, i) => (
        <img
          key={`${src}-${i}`}
          src={src}
          alt={i === 0 ? title : ''}
          className="h-full min-h-0 w-full min-w-0 object-cover"
        />
      ))}
      {extra > 0 && (
        <div className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
          +{extra} more
        </div>
      )}
    </div>
  );
};

export default WorkshopCardMedia;
