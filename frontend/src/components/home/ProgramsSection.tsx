import Image from 'next/image';
import Link from 'next/link';
import { programs } from '@/data/homepage';

export function ProgramsSection() {
  return (
    <section
      id="programs"
      aria-labelledby="programs-heading"
      className="bg-[var(--color-surface)] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-[var(--container-width)] px-4 sm:px-6">
        <div className="mb-10 max-w-xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)]">
            Our Programs
          </p>
          <h2
            id="programs-heading"
            className="font-[family-name:var(--font-montserrat)] text-3xl font-extrabold tracking-tight text-[var(--color-primary)] sm:text-4xl"
          >
            Programs Designed for Real Growth
          </h2>
        </div>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {programs.map((program) => (
            <li key={program.slug} className="group flex flex-col">
              <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-secondary)]">
                <Image
                  src={program.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="mb-2 font-[family-name:var(--font-montserrat)] text-base font-bold text-[var(--color-text)]">
                {program.title}
              </h3>
              <p className="mb-3 flex-1 text-sm leading-relaxed text-[var(--color-muted)]">
                {program.description}
              </p>
              <Link
                href={`/courses/${program.slug}`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
              >
                Know More <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
