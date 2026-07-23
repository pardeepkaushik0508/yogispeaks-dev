import {
  Check,
  ClipboardCheck,
  Mic2,
  Route,
  Trophy,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { benefits, journeySteps } from '@/data/homepage';

const stepIcons = {
  clipboard: ClipboardCheck,
  map: Route,
  mic: Mic2,
  chart: TrendingUp,
  trophy: Trophy,
};

export function JourneyBenefitsSection() {
  return (
    <section
      aria-labelledby="journey-heading"
      className="bg-white py-16 sm:py-20"
    >
      <div className="mx-auto grid max-w-[var(--container-width)] gap-12 px-4 sm:px-6 lg:grid-cols-[1.4fr_0.6fr] lg:gap-14">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)]">
            Our Teaching Method
          </p>
          <h2
            id="journey-heading"
            className="mb-10 font-[family-name:var(--font-montserrat)] text-3xl font-extrabold tracking-tight text-[var(--color-primary)] sm:text-4xl"
          >
            How Your Learning Journey Works
          </h2>

          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
            {journeySteps.map((step, index) => {
              const Icon = stepIcons[step.icon];
              return (
                <li key={step.title} className="relative">
                  {index < journeySteps.length - 1 ? (
                    <ArrowRight
                      aria-hidden="true"
                      className="absolute -right-2 top-5 hidden size-4 text-[var(--color-accent)] lg:block"
                    />
                  ) : null}
                  <span className="mb-3 inline-flex size-11 items-center justify-center rounded-full border-2 border-[var(--color-accent)] bg-white text-[var(--color-accent)]">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                    Step {index + 1}
                  </p>
                  <h3 className="mb-1 font-[family-name:var(--font-montserrat)] text-sm font-bold text-[var(--color-text)]">
                    {step.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-[var(--color-muted)]">
                    {step.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>

        <aside
          aria-labelledby="benefits-heading"
          className="rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-6 sm:p-8"
        >
          <h2
            id="benefits-heading"
            className="mb-5 font-[family-name:var(--font-montserrat)] text-xl font-extrabold text-[var(--color-primary)]"
          >
            What You Get at YogiSpeaks
          </h2>
          <ul className="space-y-3">
            {benefits.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-[var(--color-text)]">
                <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-success)] text-white">
                  <Check className="size-3" aria-hidden="true" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
