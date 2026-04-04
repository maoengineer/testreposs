"use client";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

interface Message { name: string; email: string; subject: string; message: string; date: string; }

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);

  useEffect(() => {
    const msgs: Message[] = JSON.parse(localStorage.getItem("ciq_messages") || "[]");
    setMessages(msgs.reverse());
  }, []);

  const deleteMsg = (i: number) => {
    const updated = [...messages];
    updated.splice(i, 1);
    setMessages(updated);
    localStorage.setItem("ciq_messages", JSON.stringify([...updated].reverse()));
    setSelected(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Contact Messages</h2>
            <p className="text-slate-400 text-sm mt-1">{messages.length} total messages</p>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-16 text-center">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-slate-400">No messages yet. Messages from the contact form will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* List */}
            <div className="space-y-3">
              {messages.map((m, i) => (
                <button key={i} onClick={() => setSelected(m)}
                  className={`w-full text-left rounded-xl border p-4 transition-all ${
                    selected === m
                      ? "border-violet-500 bg-violet-600/10"
                      : "border-slate-800 bg-slate-900 hover:border-slate-700"
                  }`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-white text-sm">{m.name}</p>
                      <p className="text-xs text-slate-400">{m.email}</p>
                    </div>
                    <span className="text-xs text-slate-600 flex-shrink-0">{new Date(m.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-slate-300 mt-2 font-medium">{m.subject}</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{m.message}</p>
                </button>
              ))}
            </div>

            {/* Detail */}
            {selected && (
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 h-fit sticky top-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-white">{selected.name}</h3>
                    <a href={`mailto:${selected.email}`} className="text-sm text-violet-400 hover:text-violet-300">
                      {selected.email}
                    </a>
                  </div>
                  <span className="text-xs text-slate-500">{new Date(selected.date).toLocaleString()}</span>
                </div>
                <div className="rounded-lg bg-slate-800 px-4 py-2 mb-4">
                  <p className="text-xs text-slate-400">Subject</p>
                  <p className="text-sm font-semibold text-white">{selected.subject}</p>
                </div>
                <div className="rounded-lg bg-slate-800 px-4 py-3 mb-6">
                  <p className="text-xs text-slate-400 mb-2">Message</p>
                  <p className="text-sm text-slate-200 whitespace-pre-wrap">{selected.message}</p>
                </div>
                <div className="flex gap-3">
                  <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                    className="flex-1 text-center py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors">
                    Reply via Email
                  </a>
                  <button onClick={() => deleteMsg(messages.indexOf(selected))}
                    className="px-4 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-semibold transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
