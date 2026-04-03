import { useEffect } from 'react';

const INTERESTS = ['Web Development', 'DevOps', 'Cloud Computing', 'AI/ML', 'System Design'];

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
      <path d="M12 2C6.478 2 2 6.59 2 12.25c0 4.53 2.865 8.372 6.839 9.73.5.095.683-.223.683-.495 0-.244-.008-.89-.013-1.747-2.782.62-3.37-1.384-3.37-1.384-.454-1.19-1.11-1.507-1.11-1.507-.908-.638.069-.625.069-.625 1.004.072 1.532 1.06 1.532 1.06.892 1.577 2.34 1.122 2.91.858.09-.666.35-1.123.636-1.38-2.221-.262-4.555-1.14-4.555-5.074 0-1.121.389-2.038 1.029-2.757-.103-.262-.446-1.317.098-2.744 0 0 .84-.276 2.75 1.053A9.37 9.37 0 0 1 12 7.219a9.34 9.34 0 0 1 2.505.349c1.909-1.329 2.748-1.053 2.748-1.053.546 1.427.203 2.482.1 2.744.64.719 1.028 1.636 1.028 2.757 0 3.945-2.338 4.809-4.566 5.066.359.319.678.948.678 1.911 0 1.38-.012 2.493-.012 2.833 0 .274.18.595.688.494C19.138 20.618 22 16.778 22 12.25 22 6.59 17.523 2 12 2Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
      <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3C4.17 3 3.3 3.89 3.3 4.98s.86 1.98 1.93 1.98h.02c1.1 0 1.96-.9 1.96-1.98C7.21 3.89 6.35 3 5.27 3h-.02ZM20.7 13.36c0-3.36-1.79-4.93-4.17-4.93-1.92 0-2.78 1.07-3.26 1.82V8.5H9.89c.04 1.16 0 11.5 0 11.5h3.38v-6.42c0-.34.02-.68.12-.93.27-.68.87-1.38 1.88-1.38 1.33 0 1.87 1.04 1.87 2.58V20h3.38v-6.64Z" />
    </svg>
  );
}

export default function DeveloperInfo({ open, onClose }) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="About Developer"
    >
      <section
        className="ui-card w-full max-w-xl p-5 transition duration-200 ease-out sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-4">
            <img
              src="https://shubham.civoranexus.com/images/shubham-dighe.jpeg"
              alt="Shubham Dighe"
              loading="lazy"
              decoding="async"
              className="h-14 w-14 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
            />
            <div>
              <p className="ui-label">About Developer</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">Shubham Dighe</h2>
              <p className="ui-muted text-sm">Full Stack Developer | System Builder</p>
            </div>
          </div>
          <button type="button" className="ui-btn" onClick={onClose}>
            Close
          </button>
        </header>

        <p className="ui-muted text-sm leading-relaxed">
          Founder and CEO of Civora Nexus. Passionate about building scalable systems, developer tools, and solving
          real-world problems through technology.
        </p>

        <div className="mt-4">
          <p className="ui-label">Interests</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {INTERESTS.map((interest) => (
              <span
                key={interest}
                className="ui-surface px-2.5 py-1 text-xs"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <a
            href="https://github.com/ShubhamMaster"
            target="_blank"
            rel="noreferrer"
            className="ui-btn inline-flex items-center gap-2"
          >
            <GithubIcon />
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/shubhamdighe/"
            target="_blank"
            rel="noreferrer"
            className="ui-btn inline-flex items-center gap-2"
          >
            <LinkedInIcon />
            LinkedIn
          </a>
        </div>
      </section>
    </div>
  );
}
