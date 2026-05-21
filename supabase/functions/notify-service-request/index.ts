import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

type RequestType = 'illustration' | 'lab_website' | 'workshop';

interface NotifyPayload {
  type?: RequestType;
  record?: Record<string, unknown>;
  page_url?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const subjectByType: Record<RequestType, string> = {
  illustration: 'New illustration / figure request',
  lab_website: 'New lab website request',
  workshop: 'New workshop booking request',
};

function clean(value: unknown): string {
  if (Array.isArray(value)) return value.filter(Boolean).join(', ');
  if (value == null || value === '') return '-';
  return String(value);
}

function escapeHtml(value: unknown): string {
  return clean(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function titleCaseKey(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function renderRows(record: Record<string, unknown>): string {
  return Object.entries(record)
    .map(
      ([key, value]) => `
        <tr>
          <td style="padding:8px 10px;border-bottom:1px solid #eee;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:.04em;">${escapeHtml(titleCaseKey(key))}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #eee;color:#222;font-size:14px;white-space:pre-wrap;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join('');
}

function renderText(type: RequestType, record: Record<string, unknown>, pageUrl?: string): string {
  const rows = Object.entries(record)
    .map(([key, value]) => `${titleCaseKey(key)}: ${clean(value)}`)
    .join('\n');

  return `${subjectByType[type]}\n\n${rows}\n${pageUrl ? `\nPage: ${pageUrl}\n` : ''}`;
}

function renderHtml(type: RequestType, record: Record<string, unknown>, pageUrl?: string): string {
  return `
    <div style="font-family:Inter,Arial,sans-serif;line-height:1.5;color:#222;max-width:640px;">
      <h1 style="font-family:Georgia,serif;font-size:24px;margin:0 0 12px;color:#37352f;">${escapeHtml(subjectByType[type])}</h1>
      <p style="margin:0 0 18px;color:#666;">A new request was submitted from rafeeque.com.</p>
      <table style="border-collapse:collapse;width:100%;border:1px solid #eee;border-bottom:0;background:#fff;">
        ${renderRows(record)}
      </table>
      ${
        pageUrl
          ? `<p style="margin:18px 0 0;color:#777;font-size:12px;">Submitted from: <a href="${escapeHtml(pageUrl)}">${escapeHtml(pageUrl)}</a></p>`
          : ''
      }
    </div>`;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  const toEmail = Deno.env.get('SERVICE_REQUEST_TO_EMAIL') || 'rafeequemavoor@gmail.com';
  const fromEmail =
    Deno.env.get('SERVICE_REQUEST_FROM_EMAIL') || 'Rafeeque Website <onboarding@resend.dev>';

  if (!resendApiKey) {
    return new Response(JSON.stringify({ error: 'RESEND_API_KEY is not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const payload = (await req.json().catch(() => null)) as NotifyPayload | null;
  const type = payload?.type;
  const record = payload?.record || {};

  if (!type || !(type in subjectByType)) {
    return new Response(JSON.stringify({ error: 'Invalid request type' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const replyTo = typeof record.email === 'string' && record.email.includes('@') ? record.email : undefined;
  const subject = subjectByType[type];

  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: replyTo,
      subject,
      html: renderHtml(type, record, payload?.page_url),
      text: renderText(type, record, payload?.page_url),
    }),
  });

  if (!resendRes.ok) {
    const detail = await resendRes.text();
    return new Response(JSON.stringify({ error: 'Email send failed', detail }), {
      status: 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
