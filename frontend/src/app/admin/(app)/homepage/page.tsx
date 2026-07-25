'use client';

import { useCallback, useEffect, useState } from 'react';
import { PermissionGate } from '@/components/admin/PermissionGate';
import { useAdminApi } from '@/hooks/useAdminApi';
import { useToast } from '@/components/admin/Toast';
import { Skeleton } from '@/components/ui/Skeleton';
import { ApiError } from '@/lib/api-client';

type Bundle = {
  sections: { id: string; key: string; title?: string | null; isVisible: boolean }[];
  stats: { id: string; label: string; value: string }[];
  features: { id: string; title: string; description: string }[];
  steps: { id: string; title: string; stepNumber: number }[];
  benefits: { id: string; label: string }[];
};

export default function HomepageAdminPage() {
  const { get, mutate } = useAdminApi();
  const { push } = useToast();
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setBundle(await get<Bundle>('/admin/homepage'));
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Failed to load', 'error');
    } finally {
      setLoading(false);
    }
  }, [get, push]);

  useEffect(() => {
    void load();
  }, [load]);

  async function addStat() {
    try {
      await mutate('/admin/homepage/stats', 'POST', {
        label: 'New stat',
        value: '0',
        sortOrder: bundle?.stats.length ?? 0,
        isVisible: true,
      });
      push('Stat added');
      await load();
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Failed', 'error');
    }
  }

  async function addFeature() {
    try {
      await mutate('/admin/homepage/features', 'POST', {
        title: 'New feature',
        description: 'Description',
        sortOrder: bundle?.features.length ?? 0,
        isVisible: true,
      });
      push('Feature added');
      await load();
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Failed', 'error');
    }
  }

  async function addBenefit() {
    try {
      await mutate('/admin/homepage/benefits', 'POST', {
        label: 'New benefit',
        sortOrder: bundle?.benefits.length ?? 0,
        isVisible: true,
      });
      push('Benefit added');
      await load();
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Failed', 'error');
    }
  }

  return (
    <PermissionGate
      permission="homepage.manage"
      fallback={<p className="text-sm text-red-600">You do not have access.</p>}
    >
      <h2 className="text-2xl font-bold text-slate-900">Homepage</h2>
      <p className="text-sm text-slate-500">
        Sections, stats, features, steps, and benefits.
      </p>
      {loading || !bundle ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-md border bg-white p-4 space-y-3">
              <Skeleton className="h-5 w-40" />
              {Array.from({ length: 4 }).map((__, j) => (
                <Skeleton key={j} className="h-8 w-full" />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-md border bg-white p-4">
            <h3 className="font-semibold">Sections ({bundle.sections.length})</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {bundle.sections.map((s) => (
                <li key={s.id} className="flex justify-between gap-2 border-b py-2">
                  <span>
                    <strong>{s.key}</strong> — {s.title || 'Untitled'}
                  </span>
                  <span className="text-slate-500">
                    {s.isVisible ? 'Visible' : 'Hidden'}
                  </span>
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-md border bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Stats ({bundle.stats.length})</h3>
              <button type="button" onClick={() => void addStat()} className="text-sm text-slate-700 underline">
                Add
              </button>
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {bundle.stats.map((s) => (
                <li key={s.id}>
                  {s.value} — {s.label}
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-md border bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Features ({bundle.features.length})</h3>
              <button type="button" onClick={() => void addFeature()} className="text-sm underline">
                Add
              </button>
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {bundle.features.map((f) => (
                <li key={f.id}>
                  <strong>{f.title}</strong>
                  <p className="text-slate-500">{f.description}</p>
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-md border bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Benefits ({bundle.benefits.length})</h3>
              <button type="button" onClick={() => void addBenefit()} className="text-sm underline">
                Add
              </button>
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {bundle.benefits.map((b) => (
                <li key={b.id}>{b.label}</li>
              ))}
            </ul>
          </section>
          <section className="rounded-md border bg-white p-4 lg:col-span-2">
            <h3 className="font-semibold">Learning steps ({bundle.steps.length})</h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-5 text-sm">
              {bundle.steps.map((s) => (
                <li key={s.id} className="rounded border p-2">
                  Step {s.stepNumber}: {s.title}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </PermissionGate>
  );
}
