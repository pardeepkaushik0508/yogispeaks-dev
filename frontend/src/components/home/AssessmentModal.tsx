'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/cn';

const assessmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter your full name')
    .max(80, 'Name is too long'),
  email: z.string().trim().email('Please enter a valid email'),
  phone: z
    .string()
    .trim()
    .min(10, 'Enter a valid phone number')
    .max(15, 'Phone number is too long')
    .regex(/^[+]?[\d\s-]{10,15}$/, 'Enter a valid phone number'),
  goal: z.string().trim().max(300, 'Keep this under 300 characters').optional(),
});

type AssessmentFormValues = z.infer<typeof assessmentSchema>;

type AssessmentModalContextValue = {
  openAssessment: () => void;
  closeAssessment: () => void;
};

const AssessmentModalContext = createContext<AssessmentModalContextValue | null>(
  null,
);

export function useAssessmentModal() {
  const ctx = useContext(AssessmentModalContext);
  return (
    ctx ?? {
      openAssessment: () => undefined,
      closeAssessment: () => undefined,
    }
  );
}

export function AssessmentModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openAssessment = useCallback(() => setOpen(true), []);
  const closeAssessment = useCallback(() => setOpen(false), []);

  return (
    <AssessmentModalContext.Provider value={{ openAssessment, closeAssessment }}>
      {children}
      <AssessmentModal open={open} onClose={closeAssessment} />
    </AssessmentModalContext.Provider>
  );
}

function AssessmentModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: { name: '', email: '', phone: '', goal: '' },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      const t = window.setTimeout(() => {
        setSubmitted(false);
        reset();
      }, 280);
      return () => window.clearTimeout(t);
    }
  }, [open, reset]);

  useEffect(() => {
    if (!submitted) return;
    const t = window.setTimeout(() => onClose(), 2200);
    return () => window.clearTimeout(t);
  }, [submitted, onClose]);

  const onSubmit = handleSubmit(async () => {
    await new Promise((r) => setTimeout(r, 450));
    setSubmitted(true);
  });

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center px-[15px] py-6 sm:px-4 sm:py-8"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <button
            type="button"
            aria-label="Close dialog backdrop"
            className="absolute inset-0 bg-[var(--color-primary-dark)]/70 backdrop-blur-[2px]"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 w-full max-w-[420px] overflow-hidden rounded-2xl bg-white shadow-2xl"
            initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          >
            <div className="relative bg-[var(--color-primary-dark)] px-[15px] pb-4 pt-4 text-white sm:px-6 sm:pb-5 sm:pt-5">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-6 -top-8 size-28 rounded-full bg-[var(--color-accent)]/20"
              />
              <div className="relative flex items-start justify-between gap-3">
                <div className="min-w-0 pr-2">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)] sm:text-[11px]">
                    Free Assessment
                  </p>
                  <h2
                    id={titleId}
                    className="text-lg font-bold leading-snug tracking-tight sm:text-xl"
                  >
                    Book Your Free Communication Assessment
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-white/70 sm:text-sm">
                    Share your details and we&apos;ll schedule your session.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-colors hover:bg-white/15"
                  aria-label="Close"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </div>

            <div className="px-[15px] py-4 sm:px-6 sm:py-5">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="thanks"
                    className="flex flex-col items-center py-8 text-center"
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.28 }}
                  >
                    <CheckCircle2
                      className="mb-3 size-12 text-[var(--color-success)]"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <h3 className="mb-1.5 text-lg font-bold text-[var(--color-primary)]">
                      Thank you!
                    </h3>
                    <p className="max-w-sm text-sm leading-relaxed text-[var(--color-muted)]">
                      Your request has been received. We&apos;ll contact you shortly to
                      schedule your free assessment.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={onSubmit}
                    className="space-y-3"
                    noValidate
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                  >
                    <Field
                      id="assessment-name"
                      label="Full name"
                      error={errors.name?.message}
                    >
                      <input
                        id="assessment-name"
                        autoComplete="name"
                        placeholder="Your name"
                        className={fieldClass(!!errors.name)}
                        {...register('name')}
                      />
                    </Field>

                    <Field
                      id="assessment-email"
                      label="Email"
                      error={errors.email?.message}
                    >
                      <input
                        id="assessment-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        className={fieldClass(!!errors.email)}
                        {...register('email')}
                      />
                    </Field>

                    <Field
                      id="assessment-phone"
                      label="Phone"
                      error={errors.phone?.message}
                    >
                      <input
                        id="assessment-phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="+91 98765 43210"
                        className={fieldClass(!!errors.phone)}
                        {...register('phone')}
                      />
                    </Field>

                    <Field
                      id="assessment-goal"
                      label="What would you like to improve? (optional)"
                      error={errors.goal?.message}
                    >
                      <textarea
                        id="assessment-goal"
                        rows={2}
                        placeholder="e.g. Interview confidence, fluency…"
                        className={cn(fieldClass(!!errors.goal), 'resize-none')}
                        {...register('goal')}
                      />
                    </Field>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-1 inline-flex w-full items-center justify-center rounded-md bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSubmitting ? 'Submitting…' : 'Submit request'}
                    </button>
                    <p className="text-center text-[11px] text-[var(--color-muted)]">
                      No obligation · 100% free · We respect your privacy
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-[var(--color-primary)]"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-[var(--color-danger)]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function fieldClass(hasError: boolean) {
  return cn(
    'w-full rounded-md border bg-white px-3 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)]/70 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]',
    hasError
      ? 'border-[var(--color-danger)]'
      : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/50',
  );
}
