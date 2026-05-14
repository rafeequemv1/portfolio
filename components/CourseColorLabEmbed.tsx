import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { ColorLabPreset } from '../courses/colorLabPresets';
import { hslToHex, hslToRgbInt, hexToHsl } from '../courses/colorUtils';

function normHue(h: number): number {
  return ((h % 360) + 360) % 360;
}

function HueWheelLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const rIn = 38;
  const rOut = 108;
  const [hue, setHue] = useState(210);
  const [sat, setSat] = useState(0.92);
  const [lit] = useState(0.52);

  const paint = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const w = c.width;
    const h = c.height;
    const id = ctx.createImageData(w, h);
    const data = id.data;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
        const hh = normHue(ang + 90);
        const i = (y * w + x) * 4;
        if (dist >= rIn && dist <= rOut) {
          const t = (dist - rIn) / (rOut - rIn);
          const s = 0.55 + t * 0.45;
          const [r, g, b] = hslToRgbInt(hh, s, 0.5);
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
          data[i + 3] = 255;
        } else {
          data[i] = 248;
          data[i + 1] = 250;
          data[i + 2] = 252;
          data[i + 3] = 255;
        }
      }
    }
    ctx.putImageData(id, 0, 0);
  }, [cx, cy, rIn, rOut]);

  useEffect(() => {
    paint();
  }, [paint]);

  const onPick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const scaleX = c.width / rect.width;
    const scaleY = c.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX - cx;
    const y = (e.clientY - rect.top) * scaleY - cy;
    const dist = Math.sqrt(x * x + y * y);
    if (dist < rIn || dist > rOut) return;
    const ang = (Math.atan2(y, x) * 180) / Math.PI;
    const hh = normHue(ang + 90);
    const t = (dist - rIn) / (rOut - rIn);
    const s = 0.55 + t * 0.45;
    setHue(Math.round(hh));
    setSat(Math.round(s * 100) / 100);
  };

  const swatch = hslToHex(hue, sat, lit);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Click the ring to sample a hue (saturation increases toward the outer edge). Use the sliders to fine-tune.
      </p>
      <div className="flex flex-wrap items-start gap-6">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="cursor-crosshair rounded-full border border-slate-200 bg-slate-100 shadow-inner"
          onClick={onPick}
          role="img"
          aria-label="Interactive hue ring — click to pick a color"
        />
        <div className="min-w-[10rem] flex-1 space-y-3">
          <div
            className="h-16 w-full rounded-lg border border-slate-200 shadow-sm"
            style={{ backgroundColor: swatch }}
            title={swatch}
          />
          <p className="font-mono text-xs text-slate-700">{swatch}</p>
          <label className="block text-xs font-medium text-slate-600">
            Hue {Math.round(hue)}°
            <input
              type="range"
              min={0}
              max={360}
              value={hue}
              onChange={(e) => setHue(Number(e.target.value))}
              className="mt-1 w-full accent-emerald-600"
            />
          </label>
          <label className="block text-xs font-medium text-slate-600">
            Saturation {Math.round(sat * 100)}%
            <input
              type="range"
              min={5}
              max={100}
              value={Math.round(sat * 100)}
              onChange={(e) => setSat(Number(e.target.value) / 100)}
              className="mt-1 w-full accent-emerald-600"
            />
          </label>
        </div>
      </div>
    </div>
  );
}

function HarmoniesLab() {
  const [base, setBase] = useState(200);
  const h = normHue(base);
  const tri = [h, normHue(h + 120), normHue(h + 240)] as const;
  const ana = [normHue(h - 28), h, normHue(h + 28)] as const;
  const split = [h, normHue(h + 150), normHue(h + 210)] as const;
  const tet = [h, normHue(h + 90), normHue(h + 180), normHue(h + 270)] as const;

  const Sw = ({ hh, label }: { hh: number; label: string }) => (
    <div className="text-center">
      <div
        className="mx-auto h-14 w-14 rounded-lg border border-slate-200 shadow-sm"
        style={{ backgroundColor: hslToHex(hh, 0.82, 0.48) }}
      />
      <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="font-mono text-[10px] text-slate-600">{Math.round(hh)}°</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Rotate the base hue to see how triadic, analogous, split-complementary, and tetradic sets move together—common
        starting points for figure accents and multi-panel layouts. Tetradic means four hues spaced like corners of a
        rectangle on the wheel (here 90° apart); use fewer saturated large fields so the palette does not feel crowded.
      </p>
      <label className="block text-xs font-semibold text-slate-700">
        Base hue {Math.round(h)}°
        <input
          type="range"
          min={0}
          max={360}
          value={base}
          onChange={(e) => setBase(Number(e.target.value))}
          className="mt-2 w-full max-w-md accent-emerald-600"
        />
      </label>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="mb-3 text-center text-xs font-bold uppercase tracking-wide text-slate-500">Triadic</p>
          <div className="flex justify-center gap-2">
            <Sw hh={tri[0]} label="A" />
            <Sw hh={tri[1]} label="B" />
            <Sw hh={tri[2]} label="C" />
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="mb-3 text-center text-xs font-bold uppercase tracking-wide text-slate-500">Analogous</p>
          <div className="flex justify-center gap-2">
            <Sw hh={ana[0]} label="−" />
            <Sw hh={ana[1]} label="0" />
            <Sw hh={ana[2]} label="+" />
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="mb-3 text-center text-xs font-bold uppercase tracking-wide text-slate-500">Split complement</p>
          <div className="flex justify-center gap-2">
            <Sw hh={split[0]} label="Base" />
            <Sw hh={split[1]} label="+150°" />
            <Sw hh={split[2]} label="+210°" />
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="mb-3 text-center text-xs font-bold uppercase tracking-wide text-slate-500">Tetradic</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Sw hh={tet[0]} label="h" />
            <Sw hh={tet[1]} label="+90°" />
            <Sw hh={tet[2]} label="+180°" />
            <Sw hh={tet[3]} label="+270°" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ComplementaryLab() {
  const [hex, setHex] = useState('#2563eb');
  const hsl = hexToHsl(hex);
  const compHue = hsl ? normHue(hsl.h + 180) : 30;
  const compHex = hsl ? hslToHex(compHue, hsl.s, hsl.l) : '#c2410c';

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Pick a key color for arrows, labels, or a pathway. The second swatch stays opposite on the hue wheel at the
        same saturation and lightness—useful for &ldquo;signal vs background&rdquo; pairs without fighting contrast.
      </p>
      <div className="flex flex-wrap items-center gap-6">
        <label className="flex flex-col gap-2 text-xs font-medium text-slate-700">
          Your accent
          <input type="color" value={hex} onChange={(e) => setHex(e.target.value)} className="h-12 w-24 cursor-pointer rounded border border-slate-200" />
        </label>
        <div className="flex gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-500">Base</p>
            <div className="mt-1 h-16 w-16 rounded-lg border border-slate-200 shadow-sm" style={{ backgroundColor: hex }} />
            <p className="mt-1 font-mono text-[10px] text-slate-600">{hex}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-500">Complement</p>
            <div className="mt-1 h-16 w-16 rounded-lg border border-slate-200 shadow-sm" style={{ backgroundColor: compHex }} />
            <p className="mt-1 font-mono text-[10px] text-slate-600">{compHex}</p>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-500">Mini layout</p>
        <div className="flex h-20 gap-1 overflow-hidden rounded-md">
          <div className="flex-[2] p-2 text-xs font-medium text-white" style={{ backgroundColor: hex }}>
            Data emphasis
          </div>
          <div className="flex-1 p-2 text-xs font-medium text-white" style={{ backgroundColor: compHex }}>
            Contrast callout
          </div>
        </div>
      </div>
    </div>
  );
}

function TemperatureLab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Scientific illustrations often mix &ldquo;cool&rdquo; backgrounds (clinical, structural) with &ldquo;warm&rdquo;
        highlights (energy, danger, activity). Keep temperature intentional—random warm/cool jumps read as mistakes.
      </p>
      <div
        className="relative h-14 w-full overflow-hidden rounded-lg border border-slate-200 shadow-inner"
        style={{
          background: 'linear-gradient(90deg, #ea580c 0%, #fbbf24 18%, #fef3c7 38%, #bae6fd 62%, #0284c7 100%)',
        }}
      >
        <span className="absolute bottom-1 left-2 text-[10px] font-bold uppercase tracking-wide text-white drop-shadow">
          Warm
        </span>
        <span className="absolute bottom-1 right-2 text-[10px] font-bold uppercase tracking-wide text-white drop-shadow">
          Cool
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-orange-200 bg-orange-50/80 p-3 text-xs text-orange-950">
          <strong>Warm cues:</strong> metabolism, fire, inflammation, sunset time-lapses, heatmaps (use carefully with
          accessibility).
        </div>
        <div className="rounded-lg border border-sky-200 bg-sky-50/80 p-3 text-xs text-sky-950">
          <strong>Cool cues:</strong> DNA, cryo-EM aesthetic, buffers, &ldquo;calm&rdquo; backgrounds behind busy data.
        </div>
      </div>
    </div>
  );
}

interface CourseColorLabEmbedProps {
  preset: ColorLabPreset;
}

const CourseColorLabEmbed: React.FC<CourseColorLabEmbedProps> = ({ preset }) => {
  const title =
    preset === 'hue_wheel'
      ? 'Hue & saturation explorer'
      : preset === 'harmonies'
        ? 'Harmony presets on the wheel'
        : preset === 'complementary'
          ? 'Complementary pair'
          : 'Warm vs cool';

  return (
    <div
      className="rounded-xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/50 to-white p-4 shadow-sm sm:p-5"
      role="region"
      aria-label={`Interactive color lab: ${title}`}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800/80">Interactive lab</p>
      <h3 className="mt-1 text-sm font-semibold text-slate-900">{title}</h3>
      <div className="mt-4">
        {preset === 'hue_wheel' ? <HueWheelLab /> : null}
        {preset === 'harmonies' ? <HarmoniesLab /> : null}
        {preset === 'complementary' ? <ComplementaryLab /> : null}
        {preset === 'temperature' ? <TemperatureLab /> : null}
      </div>
    </div>
  );
};

export default CourseColorLabEmbed;
