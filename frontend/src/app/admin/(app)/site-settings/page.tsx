'use client';

import { useCallback, useEffect, useState } from 'react';
import { PermissionGate } from '@/components/admin/PermissionGate';
import { useAdminApi } from '@/hooks/useAdminApi';
import { useToast } from '@/components/admin/Toast';
import { ApiError } from '@/lib/api-client';

export default function SiteSettingsPage() {
  const { get, mutate } = useAdminApi();
  const { push } = useToast();
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await get<Record<string, unknown>>('/admin/site-settings');
      const next: Record<string, string> = {};
      for (const [k, v] of Object.entries(data)) {
        if (v === null || v === undefined) continue;
        if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
          next[k] = String(v);
        }
      }
      setForm(next);
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Failed to load', 'error');
    } finally {
      setLoading(false);
    }
  }, [get, push]);

  useEffect(() => {
    void load();
  }, [load]);

  async function save() {
    setBusy(true);
    try {
      await mutate('/admin/site-settings', 'PATCH', {
        businessName: form.businessName,
        tagline: form.tagline,
        phone: form.phone,
        whatsapp: form.whatsapp,
        email: form.email,
        officeAddress: form.officeAddress,
        businessHours: form.businessHours,
        headerCtaLabel: form.headerCtaLabel,
        headerCtaHref: form.headerCtaHref,
        defaultMetaTitle: form.defaultMetaTitle,
        defaultMetaDescription: form.defaultMetaDescription,
        brandPrimary: form.brandPrimary,
        brandAccent: form.brandAccent,
      });
      push('Settings saved');
      await load();
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Save failed', 'error');
    } finally {
      setBusy(false);
    }
  }

  const fields = [
    'businessName',
    'tagline',
    'phone',
    'whatsapp',
    'email',
    'officeAddress',
    'businessHours',
    'headerCtaLabel',
    'headerCtaHref',
    'defaultMetaTitle',
    'defaultMetaDescription',
    'brandPrimary',
    'brandAccent',
  ];

  return (
    <PermissionGate
      permission="settings.manage"
      fallback={<p className="text-sm text-red-600">You do not have access.</p>}
    >
      <h2 className="text-2xl font-bold text-slate-900">Site settings</h2>
      <p className="text-sm text-slate-500">Brand, contact, and SEO defaults.</p>
      {loading ? (
        <p className="mt-6 text-sm text-slate-500">Loading…</p>
      ) : (
        <div className="mt-6 max-w-2xl space-y-3 rounded-md border bg-white p-6">
          {fields.map((name) => (
            <label key={name} className="block text-sm font-medium capitalize">
              {name.replace(/([A-Z])/g, ' $1')}
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={form[name] ?? ''}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [name]: e.target.value }))
                }
              />
            </label>
          ))}
          <button
            type="button"
            disabled={busy}
            onClick={() => void save()}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {busy ? 'Saving…' : 'Save settings'}
          </button>
        </div>
      )}
    </PermissionGate>
  );
}
