"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface Props {
  response: string;
  loading: boolean;
}

function parseMarkdown(text: string): string {
  return text
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      const escaped = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return `<pre class="code-block">${lang ? `<span class="code-lang">${lang}</span>` : ""}<code>${escaped.trimEnd()}</code></pre>`;
    })
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .split(/\n\n+/)
    .map((p) => {
      if (p.startsWith("<pre") || p.startsWith("<ul") || p.startsWith("<ol")) return p;
      const lines = p.split("\n").filter(Boolean);
      if (lines.length === 0) return "";
      if (/^\d+\.\s/.test(lines[0])) {
        const items = lines.map((l) => `<li>${l.replace(/^\d+\.\s/, "")}</li>`).join("");
        return `<ol>${items}</ol>`;
      }
      return `<p>${lines.join("<br />")}</p>`;
    })
    .join("");
}

export default function ResponseCard({ response, loading }: Props) {
  const t = useTranslations("response");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (response) {
      setVisible(false);
      requestAnimationFrame(() => setVisible(true));
    }
  }, [response]);

  return (
    <div className={`response-card ${visible ? "response-card--visible" : ""}`}>
      <div className="card-header">
        <span className="card-label">
          {loading ? t("diagnosing") : t("diagnosis")}
        </span>
        {!loading && response && (
          <button
            className="copy-btn"
            onClick={() => navigator.clipboard.writeText(response)}
            title={t("copy")}
          >
            {t("copy")}
          </button>
        )}
      </div>

      <div className="card-body">
        {loading ? (
          <div className="skeleton-wrap">
            <div className="skeleton" style={{ width: "80%" }} />
            <div className="skeleton" style={{ width: "60%" }} />
            <div className="skeleton" style={{ width: "90%" }} />
            <div className="skeleton" style={{ width: "50%" }} />
          </div>
        ) : (
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(response) }}
          />
        )}
      </div>

      <style jsx>{`
        .response-card {
          background: var(--surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius);
          overflow: hidden;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .response-card--visible {
          opacity: 1;
          transform: translateY(0);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-subtle);
          background: var(--surface-2);
        }

        .card-label {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 400;
          color: var(--accent);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .copy-btn {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--text-dim);
          background: none;
          border: none;
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: color 0.15s;
          padding: 2px 0;
        }

        .copy-btn:hover {
          color: var(--text-muted);
        }

        .card-body {
          padding: 20px;
          min-height: 120px;
        }

        .skeleton-wrap {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 4px 0;
        }

        .skeleton {
          height: 13px;
          background: var(--surface-2);
          border-radius: 4px;
          animation: shimmer 1.4s ease infinite;
        }

        @keyframes shimmer {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .prose :global(p) {
          font-family: var(--font-sans);
          font-size: 0.88rem;
          font-weight: 300;
          line-height: 1.75;
          color: var(--text);
          margin-bottom: 14px;
        }

        .prose :global(p:last-child) {
          margin-bottom: 0;
        }

        .prose :global(strong) {
          font-weight: 500;
          color: var(--text);
        }

        .prose :global(ol) {
          padding-left: 20px;
          margin-bottom: 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .prose :global(li) {
          font-family: var(--font-sans);
          font-size: 0.88rem;
          font-weight: 300;
          line-height: 1.7;
          color: var(--text);
        }

        .prose :global(.code-block) {
          position: relative;
          background: #0a0a0b;
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          padding: 16px;
          margin: 14px 0;
          overflow-x: auto;
        }

        .prose :global(.code-lang) {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
        }

        .prose :global(.code-block code) {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          font-weight: 300;
          line-height: 1.7;
          color: #c9d1d9;
          white-space: pre;
        }

        .prose :global(.inline-code) {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 1px 6px;
          color: var(--accent);
        }
      `}</style>
    </div>
  );
}