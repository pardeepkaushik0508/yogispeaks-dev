'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { PermissionGate } from '@/components/admin/PermissionGate';
import { MediaPicker } from '@/components/admin/MediaPicker';
import { useAdminApi } from '@/hooks/useAdminApi';
import { useToast } from '@/components/admin/Toast';
import { FormSkeleton } from '@/components/ui/Skeleton';
import { ButtonSpinner } from '@/components/ui/Spinner';
import { ApiError } from '@/lib/api-client';

type CourseRow = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescriptionHtml: string;
  heroHeadline?: string | null;
  whyLearnHtml?: string | null;
  whoShouldJoinHtml?: string | null;
  whyChooseHtml?: string | null;
  whyLearnTitle?: string | null;
  whoShouldJoinTitle?: string | null;
  whoShouldJoinIntro?: string | null;
  curriculumTitle?: string | null;
  featuresTitle?: string | null;
  benefitsTitle?: string | null;
  benefitsIntro?: string | null;
  learningStepsTitle?: string | null;
  whyChooseTitle?: string | null;
  testimonialsTitle?: string | null;
  faqsTitle?: string | null;
  finalCtaHeadline?: string | null;
  finalCtaBody?: string | null;
  finalSecondaryCtaLabel?: string | null;
  stickyCtaLabel?: string | null;
  duration: string;
  mode: string;
  status: string;
  isFeatured: boolean;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  secondaryCtaLabel?: string | null;
  secondaryCtaHref?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  featuredImageId?: string | null;
  brochureMediaId?: string | null;
  featuredImage?: { id?: string; url?: string } | null;
  brochureMedia?: { id?: string; url?: string; title?: string } | null;
  benefits: { label: string }[];
  features: { title: string; description?: string | null }[];
  learningSteps: { stepNumber: number; title: string; description?: string | null }[];
  curriculumItems: { title: string; bodyHtml?: string | null; iconKey?: string | null }[];
  faqs: { question: string; answerHtml: string }[];
};

function linesToLabels(text: string) {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((label) => ({ label }));
}

function labelsToLines(items: { label: string }[]) {
  return items.map((i) => i.label).join('\n');
}

export default function CourseEditorAdmin() {
  const params = useParams<{ id: string }>();
  const { get, mutate } = useAdminApi();
  const { push } = useToast();
  const [course, setCourse] = useState<CourseRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [benefitsText, setBenefitsText] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [stepsText, setStepsText] = useState('');
  const [curriculumText, setCurriculumText] = useState('');
  const [faqsText, setFaqsText] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await get<CourseRow>(`/admin/courses/${params.id}`);
      setCourse({
        ...data,
        featuredImageId: data.featuredImageId || data.featuredImage?.id || null,
        brochureMediaId: data.brochureMediaId || data.brochureMedia?.id || null,
      });
      setBenefitsText(labelsToLines(data.benefits || []));
      setFeaturesText(
        JSON.stringify(
          (data.features || []).map((f) => ({
            title: f.title,
            description: f.description || undefined,
          })),
          null,
          2,
        ),
      );
      setStepsText(
        JSON.stringify(
          (data.learningSteps || []).map((s) => ({
            stepNumber: s.stepNumber,
            title: s.title,
            description: s.description || undefined,
          })),
          null,
          2,
        ),
      );
      setCurriculumText(
        JSON.stringify(
          (data.curriculumItems || []).map((c) => ({
            title: c.title,
            bodyHtml: c.bodyHtml || '',
            iconKey: c.iconKey || undefined,
          })),
          null,
          2,
        ),
      );
      setFaqsText(
        JSON.stringify(
          (data.faqs || []).map((f) => ({
            question: f.question,
            answerHtml: f.answerHtml,
          })),
          null,
          2,
        ),
      );
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Failed to load course', 'error');
    } finally {
      setLoading(false);
    }
  }, [get, params.id, push]);

  useEffect(() => {
    void load();
  }, [load]);

  async function save() {
    if (!course) return;
    setBusy(true);
    try {
      const features = JSON.parse(featuresText || '[]') as CourseRow['features'];
      const learningSteps = JSON.parse(stepsText || '[]') as CourseRow['learningSteps'];
      const curriculumItems = JSON.parse(
        curriculumText || '[]',
      ) as CourseRow['curriculumItems'];
      const faqs = JSON.parse(faqsText || '[]') as CourseRow['faqs'];

      await mutate(`/admin/courses/${course.id}`, 'PATCH', {
        name: course.name,
        slug: course.slug,
        shortDescription: course.shortDescription,
        longDescriptionHtml: course.longDescriptionHtml,
        heroHeadline: course.heroHeadline,
        whyLearnHtml: course.whyLearnHtml,
        whoShouldJoinHtml: course.whoShouldJoinHtml,
        whyChooseHtml: course.whyChooseHtml,
        whyLearnTitle: course.whyLearnTitle,
        whoShouldJoinTitle: course.whoShouldJoinTitle,
        whoShouldJoinIntro: course.whoShouldJoinIntro,
        curriculumTitle: course.curriculumTitle,
        featuresTitle: course.featuresTitle,
        benefitsTitle: course.benefitsTitle,
        benefitsIntro: course.benefitsIntro,
        learningStepsTitle: course.learningStepsTitle,
        whyChooseTitle: course.whyChooseTitle,
        testimonialsTitle: course.testimonialsTitle,
        faqsTitle: course.faqsTitle,
        finalCtaHeadline: course.finalCtaHeadline,
        finalCtaBody: course.finalCtaBody,
        finalSecondaryCtaLabel: course.finalSecondaryCtaLabel,
        stickyCtaLabel: course.stickyCtaLabel,
        duration: course.duration,
        mode: course.mode,
        status: course.status,
        isFeatured: course.isFeatured,
        ctaLabel: course.ctaLabel,
        ctaHref: course.ctaHref,
        secondaryCtaLabel: course.secondaryCtaLabel,
        secondaryCtaHref: course.secondaryCtaHref,
        metaTitle: course.metaTitle,
        metaDescription: course.metaDescription,
        featuredImageId: course.featuredImageId || null,
        brochureMediaId: course.brochureMediaId || null,
        benefits: linesToLabels(benefitsText),
        features,
        learningSteps,
        curriculumItems,
        faqs,
      });
      push('Course saved');
      await load();
    } catch (err) {
      push(
        err instanceof ApiError
          ? err.message
          : err instanceof SyntaxError
            ? 'Invalid JSON in one of the list fields'
            : 'Save failed',
        'error',
      );
    } finally {
      setBusy(false);
    }
  }

  function setField<K extends keyof CourseRow>(key: K, value: CourseRow[K]) {
    setCourse((c) => (c ? { ...c, [key]: value } : c));
  }

  return (
    <PermissionGate
      permission="courses.manage"
      fallback={<p className="text-sm text-red-600">You do not have access.</p>}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/courses" className="text-sm text-slate-500 hover:text-slate-800">
            ← Courses
          </Link>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">Edit course</h2>
          <p className="text-sm text-slate-500">
            Hero, curriculum, features, benefits, FAQs — all managed here.
          </p>
        </div>
        <button
          type="button"
          disabled={busy || !course}
          onClick={() => void save()}
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {busy ? <ButtonSpinner /> : null}
          {busy ? 'Saving…' : 'Save changes'}
        </button>
      </div>

      {loading || !course ? (
        <FormSkeleton fields={8} />
      ) : (
        <div className="mt-6 space-y-6">
          <section className="rounded-md border bg-white p-4">
            <h3 className="font-semibold">Media uploads</h3>
            <p className="mt-1 text-sm text-slate-500">
              Upload a featured image and optional course brochure (PDF/DOC). The brochure
              powers the “Download Course Brochure” button on the public course page.
            </p>
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              <MediaPicker
                label="Featured / hero image"
                accept="image/*"
                value={course.featuredImageId}
                onChange={(id) => setField('featuredImageId', id)}
              />
              <MediaPicker
                label="Course brochure"
                accept=".pdf,.doc,.docx,application/pdf,image/*"
                hint="PDF recommended. Max 15MB."
                value={course.brochureMediaId}
                onChange={(id) => setField('brochureMediaId', id)}
              />
            </div>
          </section>

          <section className="rounded-md border bg-white p-4">
            <h3 className="font-semibold">Basics & SEO</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(
                [
                  ['name', 'Name'],
                  ['slug', 'Slug'],
                  ['heroHeadline', 'Hero headline'],
                  ['shortDescription', 'Short description'],
                  ['duration', 'Duration'],
                  ['mode', 'Mode'],
                  ['ctaLabel', 'Primary CTA label'],
                  ['ctaHref', 'Primary CTA href'],
                  ['secondaryCtaLabel', 'Secondary CTA label'],
                  ['secondaryCtaHref', 'Secondary CTA href'],
                  ['stickyCtaLabel', 'Sticky mobile CTA label'],
                  ['metaTitle', 'Meta title'],
                  ['metaDescription', 'Meta description'],
                ] as const
              ).map(([field, label]) => (
                <label key={field} className="block text-sm font-medium">
                  {label}
                  <input
                    className="mt-1 w-full rounded-md border px-3 py-2"
                    value={String(course[field] ?? '')}
                    onChange={(e) => setField(field, e.target.value)}
                  />
                </label>
              ))}
              <label className="block text-sm font-medium">
                Status
                <select
                  className="mt-1 w-full rounded-md border px-3 py-2"
                  value={course.status}
                  onChange={(e) => setField('status', e.target.value)}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={course.isFeatured}
                  onChange={(e) => setField('isFeatured', e.target.checked)}
                />
                Featured on homepage
              </label>
            </div>
          </section>

          <section className="rounded-md border bg-white p-4">
            <h3 className="font-semibold">Section titles & final CTA</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(
                [
                  ['whyLearnTitle', 'Why learn title'],
                  ['whoShouldJoinTitle', 'Who should join title'],
                  ['whoShouldJoinIntro', 'Who should join intro'],
                  ['curriculumTitle', 'Curriculum title'],
                  ['featuresTitle', 'Features title'],
                  ['benefitsTitle', 'Benefits / outcomes title'],
                  ['benefitsIntro', 'Benefits intro'],
                  ['learningStepsTitle', 'Teaching method title'],
                  ['whyChooseTitle', 'Why choose title'],
                  ['testimonialsTitle', 'Testimonials title'],
                  ['faqsTitle', 'FAQs title'],
                  ['finalCtaHeadline', 'Final CTA headline'],
                  ['finalSecondaryCtaLabel', 'Final secondary CTA label'],
                ] as const
              ).map(([field, label]) => (
                <label key={field} className="block text-sm font-medium">
                  {label}
                  <input
                    className="mt-1 w-full rounded-md border px-3 py-2"
                    value={String(course[field] ?? '')}
                    onChange={(e) => setField(field, e.target.value)}
                  />
                </label>
              ))}
              <label className="block text-sm font-medium sm:col-span-2">
                Final CTA body
                <textarea
                  className="mt-1 w-full rounded-md border px-3 py-2"
                  rows={3}
                  value={String(course.finalCtaBody ?? '')}
                  onChange={(e) => setField('finalCtaBody', e.target.value)}
                />
              </label>
            </div>
          </section>

          {(
            [
              ['longDescriptionHtml', 'Hero / long description HTML'],
              ['whyLearnHtml', 'Why learn HTML'],
              ['whoShouldJoinHtml', 'Who should join HTML'],
              ['whyChooseHtml', 'Why choose HTML'],
            ] as const
          ).map(([field, label]) => (
            <section key={field} className="rounded-md border bg-white p-4">
              <label className="block text-sm font-medium">
                {label}
                <textarea
                  className="mt-1 w-full rounded-md border px-3 py-2 font-mono text-xs"
                  rows={5}
                  value={String(course[field] ?? '')}
                  onChange={(e) => setField(field, e.target.value)}
                />
              </label>
            </section>
          ))}

          <section className="rounded-md border bg-white p-4">
            <label className="block text-sm font-medium">
              Benefits (one per line)
              <textarea
                className="mt-1 w-full rounded-md border px-3 py-2"
                rows={6}
                value={benefitsText}
                onChange={(e) => setBenefitsText(e.target.value)}
              />
            </label>
          </section>

          <section className="rounded-md border bg-white p-4">
            <label className="block text-sm font-medium">
              Features JSON
              <textarea
                className="mt-1 w-full rounded-md border px-3 py-2 font-mono text-xs"
                rows={8}
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
              />
            </label>
          </section>

          <section className="rounded-md border bg-white p-4">
            <label className="block text-sm font-medium">
              Learning steps JSON
              <textarea
                className="mt-1 w-full rounded-md border px-3 py-2 font-mono text-xs"
                rows={8}
                value={stepsText}
                onChange={(e) => setStepsText(e.target.value)}
              />
            </label>
          </section>

          <section className="rounded-md border bg-white p-4">
            <label className="block text-sm font-medium">
              Curriculum modules JSON
              <textarea
                className="mt-1 w-full rounded-md border px-3 py-2 font-mono text-xs"
                rows={12}
                value={curriculumText}
                onChange={(e) => setCurriculumText(e.target.value)}
              />
            </label>
          </section>

          <section className="rounded-md border bg-white p-4">
            <label className="block text-sm font-medium">
              FAQs JSON
              <textarea
                className="mt-1 w-full rounded-md border px-3 py-2 font-mono text-xs"
                rows={10}
                value={faqsText}
                onChange={(e) => setFaqsText(e.target.value)}
              />
            </label>
          </section>
        </div>
      )}
    </PermissionGate>
  );
}
