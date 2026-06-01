"use client";
import { useTranslations } from "next-intl";

interface Props {
  code: string;
  error: string;
  onCodeChange: (v: string) => void;
  onErrorChange: (v: string) => void;
}

export default function ErrorInput({ code, error, onCodeChange, onErrorChange }: Props) {
  const t = useTranslations("input");

  return (
    <div className="error-input">
      <div className="field">
        <label className="field-label">
          <span className="label-dot label-dot--required" />
          {t("errorLabel")}
        </label>
        <textarea
          className="textarea textarea--error"
          placeholder={t("errorPlaceholder")}
          value={error}
          onChange={(e) => onErrorChange(e.target.value)}
          rows={6}
          spellCheck={false}
        />
      </div>
      <div className="field">
        <label className="field-label">
          <span className="label-dot" />
          {t("codeLabel")}
          <span className="field-optional">{t("optional")}</span>
        </label>
        <textarea
          className="textarea textarea--code"
          placeholder={t("codePlaceholder")}
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          rows={8}
          spellCheck={false}
        />
      </div>
      <style jsx>{`
        .error-input {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .field-label {
          display: flex;
          align-items: center;
          gap: 7px;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 400;
          color: var(--text-muted);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          user-select: none;
        }
        .label-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--border);
          flex-shrink: 0;
        }
        .label-dot--required {
          background: var(--accent);
          box-shadow: 0 0 6px var(--accent-glow);
        }
        .field-optional {
          margin-left: auto;
          font-size: 0.68rem;
          color: var(--text-dim);
          letter-spacing: 0.04em;
        }
        .textarea {
          width: 100%;
          background: var(--surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius);
          color: var(--text);
          font-family: var(--font-mono);
          font-size: 0.82rem;
          font-weight: 300;
          line-height: 1.65;
          padding: 14px 16px;
          resize: vertical;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          caret-color: var(--accent);
        }
        .textarea::placeholder {
          color: var(--text-dim);
        }
        .textarea:focus {
          border-color: var(--border);
          background: var(--surface-2);
        }
        .textarea--error:focus {
          border-color: rgba(200, 241, 53, 0.25);
        }
      `}</style>
    </div>
  );
}