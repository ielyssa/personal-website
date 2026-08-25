'use client';

import { useId, useState, type FormEvent } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { Iconify } from '@/components/ui/iconify';

type ContactFormProps = {
  configured: boolean;
};

export function ContactForm({ configured }: ContactFormProps) {
  const formId = useId();
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!configured) {
    return (
      <Card variant="outlined" sx={{ p: 2.6 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.8 }}>
          Prefer email?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Reach me directly and I will get back to you.
        </Typography>
        <Button component="a" href="mailto:info@ielyssa.com" variant="contained" startIcon={<Iconify icon="carbon:email" />}>
          Email me
        </Button>
      </Card>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus('sending');
    setErrorMessage(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          message: data.get('message'),
          company: data.get('company'),
          startedAt: Number(data.get('startedAt')),
        }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? 'Something went wrong. Please try again.');
      }
      setStatus('sent');
      form.reset();
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    }
  }

  return (
    <Card variant="outlined" sx={{ p: { xs: 2.6, md: 3.2 } }}>
      {status === 'sent' ? (
        <Stack spacing={1.2} alignItems="flex-start">
          <Iconify icon="carbon:checkmark-filled" width={28} sx={{ color: 'success.main' }} />
          <Typography variant="h6">Message sent</Typography>
          <Typography variant="body2" color="text.secondary">
            Thanks for reaching out — I will get back to you soon.
          </Typography>
          <Button size="small" onClick={() => setStatus('idle')}>
            Send another message
          </Button>
        </Stack>
      ) : (
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Typography variant="h6" component="label" htmlFor={`${formId}-message`} sx={{ fontWeight: 700 }}>
              Send a message
            </Typography>
            <input type="hidden" name="startedAt" value={Date.now()} />
            <Box sx={{ position: 'absolute', left: -9999, top: -9999 }} aria-hidden>
              <label htmlFor={`${formId}-company`}>Company</label>
              <input id={`${formId}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                id={`${formId}-name`}
                name="name"
                label="Name"
                required
                fullWidth
                autoComplete="name"
                size="small"
              />
              <TextField
                id={`${formId}-email`}
                name="email"
                type="email"
                label="Email"
                required
                fullWidth
                autoComplete="email"
                size="small"
              />
            </Stack>
            <TextField
              id={`${formId}-message`}
              name="message"
              label="Message"
              required
              multiline
              minRows={4}
              fullWidth
              size="small"
            />
            {status === 'error' && errorMessage ? (
              <Typography variant="body2" sx={{ color: 'error.main' }}>
                {errorMessage}
              </Typography>
            ) : null}
            <Button
              type="submit"
              variant="contained"
              disabled={status === 'sending'}
              startIcon={<Iconify icon="carbon:email" />}
              sx={{ alignSelf: 'flex-start' }}
            >
              {status === 'sending' ? 'Sending…' : 'Send message'}
            </Button>
          </Stack>
        </form>
      )}
    </Card>
  );
}

