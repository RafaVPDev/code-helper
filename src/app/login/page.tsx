"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

type Mode = "login" | "register" | "forgot";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function reset() { setError(""); setSuccess(""); }

  async function handleSubmit() {
    setLoading(true);
    reset();

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError("Email ou senha incorretos.");
      else { router.push("/"); router.refresh(); }

    } else if (mode === "register") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError("Erro ao criar conta. Tente outro email.");
      else setSuccess("Conta criada! Verifique seu email para confirmar.");

    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) setError("Erro ao enviar email. Verifique o endereço.");
      else setSuccess("Email enviado! Verifique sua caixa de entrada.");
    }

    setLoading(false);
  }

  async function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") await handleSubmit();
  }

  const isForgot = mode === "forgot";

  return (
    <main className="min-h-screen bg-[#0e0e0f] flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-[#161618] border border-[#1f1f22] rounded-2xl p-8 flex flex-col gap-7">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-[#c8f135] shadow-[0_0_10px_rgba(200,241,53,0.4)]" />
          <span className="font-mono text-[#e8e8ea] text-base tracking-tight">code helper</span>
        </div>

        {/* Tabs - só aparece no login/register */}
        {!isForgot && (
          <div className="flex bg-[#1e1e21] rounded-lg p-1 gap-1">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); reset(); }}
                className={`flex-1 h-8 rounded-md font-mono text-xs tracking-wide transition-all duration-150
                  ${mode === m
                    ? "bg-[#161618] text-[#e8e8ea] shadow-sm"
                    : "text-[#6b6b72] hover:text-[#e8e8ea]"
                  }`}
              >
                {m === "login" ? "entrar" : "criar conta"}
              </button>
            ))}
          </div>
        )}

        {/* Título no modo forgot */}
        {isForgot && (
          <div>
            <p className="font-mono text-[10px] text-[#6b6b72] uppercase tracking-widest mb-1">recuperar acesso</p>
            <p className="font-mono text-xs text-[#3a3a40] leading-relaxed">
              informe seu email e enviaremos um link para redefinir sua senha.
            </p>
          </div>
        )}

        {/* Fields */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] text-[#6b6b72] uppercase tracking-widest">email</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="email"
              className="h-11 bg-[#1e1e21] border border-[#1f1f22] rounded-lg px-3.5 font-mono text-sm text-[#e8e8ea] placeholder-[#3a3a40] outline-none focus:border-[#c8f135]/30 caret-[#c8f135] transition-colors"
            />
          </div>

          {!isForgot && (
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] text-[#6b6b72] uppercase tracking-widest">senha</label>
              <input
                type="password"
                placeholder="min. 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className="h-11 bg-[#1e1e21] border border-[#1f1f22] rounded-lg px-3.5 font-mono text-sm text-[#e8e8ea] placeholder-[#3a3a40] outline-none focus:border-[#c8f135]/30 caret-[#c8f135] transition-colors"
              />
            </div>
          )}
        </div>

        {/* Messages */}
        {error && (
          <p className="font-mono text-xs text-[#ff8080] bg-[#ff808008] border border-[#ff808030] rounded-lg px-3.5 py-2.5">
            {error}
          </p>
        )}
        {success && (
          <p className="font-mono text-xs text-[#c8f135] bg-[#c8f13508] border border-[#c8f13530] rounded-lg px-3.5 py-2.5">
            {success}
          </p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading || !email || (!isForgot && !password)}
          className="h-12 bg-[#c8f135] text-[#0e0e0f] rounded-xl font-mono text-sm font-medium tracking-wide
            hover:opacity-90 hover:-translate-y-px active:translate-y-0
            disabled:opacity-30 disabled:cursor-not-allowed
            transition-all duration-150 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-[#0e0e0f]/30 border-t-[#0e0e0f] rounded-full animate-spin" />
              {isForgot ? "enviando..." : mode === "login" ? "entrando..." : "criando..."}
            </>
          ) : (
            isForgot ? "enviar link" : mode === "login" ? "entrar" : "criar conta"
          )}
        </button>

        {/* Forgot / Voltar */}
        <div className="text-center">
          {!isForgot ? (
            <button
              onClick={() => { setMode("forgot"); reset(); }}
              className="font-mono text-xs text-[#3a3a40] hover:text-[#6b6b72] transition-colors"
            >
              esqueci minha senha
            </button>
          ) : (
            <button
              onClick={() => { setMode("login"); reset(); }}
              className="font-mono text-xs text-[#3a3a40] hover:text-[#6b6b72] transition-colors"
            >
              voltar para o login
            </button>
          )}
        </div>

      </div>
    </main>
  );
}
