"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") return;
    });
  }, []);

  async function handleReset() {
    if (password !== confirm) { setError("As senhas não coincidem."); return; }
    if (password.length < 6) { setError("A senha precisa ter pelo menos 6 caracteres."); return; }

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError("Erro ao redefinir senha. Tente novamente.");
    } else {
      setSuccess(true);
      setTimeout(() => { router.push("/"); router.refresh(); }, 2000);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#0e0e0f] flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-[#161618] border border-[#1f1f22] rounded-2xl p-8 flex flex-col gap-7">

        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_rgba(200,241,53,0.4)]" />
          <span className="font-mono text-[#e8e8ea] text-base tracking-tight">code helper</span>
        </div>

        {success ? (
          <p className="font-mono text-xs text-[#c8f135] bg-[#c8f13508] border border-[#c8f13530] rounded-lg px-3.5 py-2.5">
            senha redefinida! redirecionando...
          </p>
        ) : (
          <>
            <div>
              <p className="font-mono text-[10px] text-[#6b6b72] uppercase tracking-widest mb-1">nova senha</p>
              <p className="font-mono text-xs text-[#3a3a40] leading-relaxed">
                escolha uma senha forte para sua conta.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] text-[#6b6b72] uppercase tracking-widest">nova senha</label>
                <input
                  type="password"
                  placeholder="min. 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 bg-[#1e1e21] border border-[#1f1f22] rounded-lg px-3.5 font-mono text-sm text-[#e8e8ea] placeholder-[#3a3a40] outline-none focus:border-[#c8f135]/30 caret-[#c8f135] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] text-[#6b6b72] uppercase tracking-widest">confirmar senha</label>
                <input
                  type="password"
                  placeholder="repita a senha"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleReset()}
                  className="h-11 bg-[#1e1e21] border border-[#1f1f22] rounded-lg px-3.5 font-mono text-sm text-[#e8e8ea] placeholder-[#3a3a40] outline-none focus:border-[#c8f135]/30 caret-[#c8f135] transition-colors"
                />
              </div>
            </div>

            {error && (
              <p className="font-mono text-xs text-[#ff8080] bg-[#ff808008] border border-[#ff808030] rounded-lg px-3.5 py-2.5">
                {error}
              </p>
            )}

            <button
              onClick={handleReset}
              disabled={loading || !password || !confirm}
              className="h-12 bg-accent text-[#0e0e0f] rounded-xl font-mono text-sm font-medium tracking-wide
                hover:opacity-90 hover:-translate-y-px active:translate-y-0
                disabled:opacity-30 disabled:cursor-not-allowed
                transition-all duration-150 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-[#0e0e0f]/30 border-t-[#0e0e0f] rounded-full animate-spin" />
                  redefinindo...
                </>
              ) : "redefinir senha"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
