import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(10).max(5000),
  company: z.string().max(0).optional().or(z.literal('')),
  startedAt: z.number().int().positive(),
});

const recentSubmissions = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const timestamps = (recentSubmissions.get(ip) ?? []).filter((time) => now - time < windowMs);
  if (timestamps.length >= 5) return true;
  timestamps.push(now);
  recentSubmissions.set(ip, timestamps);
  return false;
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Email is not configured.' }, { status: 503 });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many messages. Please try again later.' }, { status: 429 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please fill in all fields correctly.' }, { status: 400 });
  }

  if (parsed.data.company) {
    return NextResponse.json({ error: 'Submission rejected.' }, { status: 400 });
  }

  if (Date.now() - parsed.data.startedAt < 2500) {
    return NextResponse.json({ error: 'Submission rejected.' }, { status: 400 });
  }

  const resend = new Resend(apiKey);
  const from = process.env.CONTACT_FROM ?? 'ielyssa.com <onboarding@resend.dev>';
  const to = process.env.CONTACT_TO_EMAIL ?? 'info@ielyssa.com';

  try {
    await resend.emails.send({
      from,
      to,
      replyTo: parsed.data.email,
      subject: `New message from ${parsed.data.name} — ielyssa.com`,
      text: `Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\n\n${parsed.data.message}`,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to send. Please email info@ielyssa.com directly.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

