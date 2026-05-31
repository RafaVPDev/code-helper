	"use client";

	import { useState, useEffect } from "react";
	import { createClient } from "@/utils/supabase/client";
	import { useRouter } from "next/navigation";
	import ErrorInput from "@/components/ErrorInput";
	import ResponseCard from "@/components/ResponseCard";

	interface Analysis {
	  id: string;
	  error_message: string;
	  code_snippet: string | null;
	  response: string;
	  created_at: string;
	}

	export default function Home() {
	  const router = useRouter();
	  const supabase = createClient();

	  const [code, setCode] = useState("");
	  const [error, setError] = useState("");
	  const [response, setResponse] = useState("");
	  const [loading, setLoading] = useState(false);
	  const [hasAnalyzed, setHasAnalyzed] = useState(false);
	  const [history, setHistory] = useState<Analysis[]>([]);
	  const [showHistory, setShowHistory] = useState(false);
	  const [userEmail, setUserEmail] = useState("");

	  useEffect(() => {
		supabase.auth.getUser().then(({ data }) => {
		  if (data.user) setUserEmail(data.user.email ?? "");
		});
		loadHistory();
	  }, []);

	  async function loadHistory() {
		const { data } = await supabase
		  .from("analyses")
		  .select("id, error_message, code_snippet, response, created_at")
		  .order("created_at", { ascending: false })
		  .limit(20);
		if (data) setHistory(data);
	  }

	  async function handleAnalyze() {
		if (!error.trim()) return;
		setLoading(true);
		setResponse("");

		try {
		  const res = await fetch("/api/analyze", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ code, error }),
		  });

		  const data = await res.json();
		  const result = data.response ?? data.error ?? "Erro desconhecido.";
		  setResponse(result);
		  setHasAnalyzed(true);

		  // Save to Supabase
		  const { data: { user } } = await supabase.auth.getUser();
		  if (user) {
			await supabase.from("analyses").insert({
			  user_id: user.id,
			  error_message: error,
			  code_snippet: code || null,
			  response: result,
			});
			loadHistory();
		  }
		} catch {
		  setResponse("Falha na conexão com a API.");
		} finally {
		  setLoading(false);
		}
	  }

	  function handleReset() {
		setCode("");
		setError("");
		setResponse("");
		setHasAnalyzed(false);
	  }

	function loadFromHistory(item: Analysis) {
	  setError(item.error_message);
	  setCode(item.code_snippet ?? "");
	  setResponse(item.response);
	  setHasAnalyzed(true);
	  setShowHistory(false);
	}

	  async function handleSignOut() {
		await supabase.auth.signOut();
		router.push("/login");
	  }

	  function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString("pt-BR", {
		  day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
		});
	  }

	  function truncate(text: string, max = 60) {
		return text.length > max ? text.slice(0, max) + "..." : text;
	  }

	  return (
		<main className="main">
		  <header className="header">
			<div className="header-left">
			  <div className="logo-mark" />
			  <h1 className="title">code helper</h1>
			</div>
			<div className="header-right">
			  <button className="nav-btn" onClick={() => setShowHistory(!showHistory)}>
				{showHistory ? "fechar" : `histórico${history.length > 0 ? ` (${history.length})` : ""}`}
			  </button>
			  <span className="user-email">{userEmail}</span>
			  <button className="nav-btn nav-btn--muted" onClick={handleSignOut}>sair</button>
			</div>
		  </header>

		  {showHistory && (
			<div className="history-panel">
			  <p className="history-title">análises anteriores</p>
			  {history.length === 0 ? (
				<p className="history-empty">nenhuma análise ainda.</p>
			  ) : (
				<ul className="history-list">
				  {history.map((item) => (
					<li key={item.id} className="history-item" onClick={() => loadFromHistory(item)}>
					  <span className="history-error">{truncate(item.error_message)}</span>
					  <span className="history-date">{formatDate(item.created_at)}</span>
					</li>
				  ))}
				</ul>
			  )}
			</div>
		  )}

		  <p className="subtitle">cole seu erro. entenda o que aconteceu.</p>

		  <div className={`workspace ${hasAnalyzed ? "workspace--split" : ""}`}>
			<section className="input-section">
			  <ErrorInput
				code={code}
				error={error}
				onCodeChange={setCode}
				onErrorChange={setError}
			  />
			  <div className="actions">
				<button
				  className="btn-analyze"
				  onClick={handleAnalyze}
				  disabled={loading || !error.trim()}
				>
				  {loading ? (
					<span className="btn-inner">
					  <span className="spinner" />
					  analisando...
					</span>
				  ) : (
					<span className="btn-inner">analisar erro</span>
				  )}
				</button>
				{hasAnalyzed && (
				  <button className="btn-reset" onClick={handleReset}>limpar</button>
				)}
			  </div>
			</section>

			{(loading || response) && (
			  <section className="response-section">
				<ResponseCard response={response} loading={loading} />
			  </section>
			)}
		  </div>

		  <style jsx global>{`
			@import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=DM+Sans:wght@300;400;500&display=swap');

			*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

			:root {
			  --bg: #0e0e0f;
			  --surface: #161618;
			  --surface-2: #1e1e21;
			  --border: #2a2a2e;
			  --border-subtle: #1f1f22;
			  --text: #e8e8ea;
			  --text-muted: #6b6b72;
			  --text-dim: #3a3a40;
			  --accent: #c8f135;
			  --accent-dim: rgba(200, 241, 53, 0.08);
			  --accent-glow: rgba(200, 241, 53, 0.15);
			  --radius: 10px;
			  --font-mono: 'DM Mono', monospace;
			  --font-sans: 'DM Sans', sans-serif;
			}

			html, body {
			  background: var(--bg);
			  color: var(--text);
			  font-family: var(--font-sans);
			  min-height: 100vh;
			  -webkit-font-smoothing: antialiased;
			}

			.main {
			  min-height: 100vh;
			  display: flex;
			  flex-direction: column;
			  align-items: center;
			  padding: 0 24px 80px;
			  gap: 40px;
			}

			.header {
			  width: 100%;
			  max-width: 1200px;
			  display: flex;
			  align-items: center;
			  justify-content: space-between;
			  padding: 20px 0;
			  border-bottom: 1px solid var(--border-subtle);
			}

			.header-left {
			  display: flex;
			  align-items: center;
			  gap: 10px;
			}

			.logo-mark {
			  width: 7px;
			  height: 7px;
			  border-radius: 50%;
			  background: var(--accent);
			  box-shadow: 0 0 10px var(--accent-glow);
			}

			.title {
			  font-family: var(--font-mono);
			  font-size: 1rem;
			  font-weight: 400;
			  letter-spacing: -0.02em;
			  color: var(--text);
			}

			.header-right {
			  display: flex;
			  align-items: center;
			  gap: 16px;
			}

			.user-email {
			  font-family: var(--font-mono);
			  font-size: 0.72rem;
			  color: var(--text-dim);
			  letter-spacing: 0.02em;
			}

			.nav-btn {
			  font-family: var(--font-mono);
			  font-size: 0.75rem;
			  color: var(--text-muted);
			  background: none;
			  border: 1px solid var(--border-subtle);
			  border-radius: 6px;
			  padding: 5px 12px;
			  cursor: pointer;
			  transition: color 0.15s, border-color 0.15s;
			  letter-spacing: 0.02em;
			  white-space: nowrap;
			}

			.nav-btn:hover { color: var(--text); border-color: var(--border); }
			.nav-btn--muted:hover { color: #ff8080; border-color: rgba(255,128,128,0.3); }

			.subtitle {
			  font-family: var(--font-mono);
			  font-size: 0.8rem;
			  font-weight: 300;
			  color: var(--text-muted);
			  letter-spacing: 0.02em;
			  margin-top: 12px;
			}

			.history-panel {
			  width: 100%;
			  max-width: 1200px;
			  background: var(--surface);
			  border: 1px solid var(--border-subtle);
			  border-radius: var(--radius);
			  padding: 20px;
			  animation: fadeUp 0.2s ease both;
			}

			.history-title {
			  font-family: var(--font-mono);
			  font-size: 0.7rem;
			  color: var(--text-muted);
			  text-transform: uppercase;
			  letter-spacing: 0.07em;
			  margin-bottom: 14px;
			}

			.history-empty {
			  font-family: var(--font-mono);
			  font-size: 0.8rem;
			  color: var(--text-dim);
			}

			.history-list {
			  list-style: none;
			  display: flex;
			  flex-direction: column;
			  gap: 2px;
			}

			.history-item {
			  display: flex;
			  align-items: center;
			  justify-content: space-between;
			  gap: 16px;
			  padding: 10px 12px;
			  border-radius: 7px;
			  cursor: pointer;
			  transition: background 0.15s;
			}

			.history-item:hover { background: var(--surface-2); }

			.history-error {
			  font-family: var(--font-mono);
			  font-size: 0.78rem;
			  font-weight: 300;
			  color: var(--text);
			  min-width: 0;
			  white-space: nowrap;
			  overflow: hidden;
			  text-overflow: ellipsis;
			}

			.history-date {
			  font-family: var(--font-mono);
			  font-size: 0.68rem;
			  color: var(--text-dim);
			  white-space: nowrap;
			  flex-shrink: 0;
			}

			.workspace {
			  width: 100%;
			  max-width: 720px;
			  display: flex;
			  flex-direction: column;
			  gap: 24px;
			  animation: fadeUp 0.5s 0.1s ease both;
			}

			.workspace--split {
			  max-width: 1200px;
			  flex-direction: row;
			  align-items: flex-start;
			}

			.input-section {
			  flex: 1;
			  min-width: 0;
			  display: flex;
			  flex-direction: column;
			  gap: 16px;
			}

			.response-section {
			  flex: 1;
			  min-width: 0;
			}

			.actions {
			  display: flex;
			  align-items: center;
			  gap: 12px;
			}

			.btn-analyze {
			  flex: 1;
			  height: 48px;
			  background: var(--accent);
			  color: #0e0e0f;
			  border: none;
			  border-radius: var(--radius);
			  font-family: var(--font-mono);
			  font-size: 0.85rem;
			  font-weight: 500;
			  cursor: pointer;
			  transition: opacity 0.15s, transform 0.1s;
			  letter-spacing: 0.01em;
			}

			.btn-analyze:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
			.btn-analyze:active:not(:disabled) { transform: translateY(0); }
			.btn-analyze:disabled { opacity: 0.3; cursor: not-allowed; }

			.btn-inner {
			  display: flex;
			  align-items: center;
			  justify-content: center;
			  gap: 8px;
			}

			.spinner {
			  width: 14px;
			  height: 14px;
			  border: 2px solid rgba(14,14,15,0.3);
			  border-top-color: #0e0e0f;
			  border-radius: 50%;
			  animation: spin 0.7s linear infinite;
			}

			.btn-reset {
			  height: 48px;
			  padding: 0 20px;
			  background: transparent;
			  color: var(--text-muted);
			  border: 1px solid var(--border);
			  border-radius: var(--radius);
			  font-family: var(--font-mono);
			  font-size: 0.8rem;
			  cursor: pointer;
			  transition: color 0.15s, border-color 0.15s;
			  letter-spacing: 0.01em;
			  white-space: nowrap;
			}

			.btn-reset:hover { color: var(--text); border-color: var(--text-dim); }

			@keyframes fadeUp {
			  from { opacity: 0; transform: translateY(12px); }
			  to   { opacity: 1; transform: translateY(0); }
			}

			@keyframes spin {
			  to { transform: rotate(360deg); }
			}

			@media (max-width: 900px) {
			  .workspace--split { flex-direction: column; max-width: 720px; }
			  .user-email { display: none; }
			}
		  `}</style>
		</main>
	  );
	}
