import React from 'react';
import { workshopCardCoverUrl } from '../utils/workshopImages';
import type { Workshop } from '../types';

/** Single cover image for list cards — no collage, no repeat of gallery-only shots. */
const WorkshopCardMedia: React.FC<{
  workshop: Workshop;
  title: string;
  /** Fill a relative/aspect parent (absolute inset). */
  fill?: boolean;
}> = ({ workshop, title, fill }) => {
  const src = workshopCardCoverUrl(workshop);

  if (!src) {
    return (
      <div
        className={`flex w-full items-center justify-center bg-gradient-to-br from-[#eceae6] to-[#ddd9d3] text-sm text-[#37352f]/45 ${
          fill ? 'absolute inset-0' : 'h-52'
        }`}
      >
        No image
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      className={`w-full object-cover ${fill ? 'absolute inset-0 h-full' : 'h-52'}`}
      loading="lazy"
      decoding="async"
    />
  );
};

export default WorkshopCardMedia;
