import axios from "axios";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const SUGGESTIONS = [
  { icon: "🔊", text: "Engine making knocking sound" },
  { icon: "🛢️", text: "When should I change my oil?" },
  { icon: "🛑", text: "Brake pads for 2019 Toyota Camry" },
  { icon: "⚠️", text: "Check engine light is on" },
  { icon: "🔋", text: "Battery keeps draining overnight" },
  { icon: "❄️", text: "AC not cooling properly" },
];

const TypingDots = () => (
  <>
    <style>{`
      @keyframes aiDot {
        0%,80%,100% { transform:translateY(0); opacity:0.4; }
        40% { transform:translateY(-4px); opacity:1; }
      }
      @keyframes aiFadeUp {
        from { opacity:0; transform:translateY(6px); }
        to   { opacity:1; transform:translateY(0); }
      }
    `}</style>
    <span style={{ display:"inline-flex", gap:4, alignItems:"center" }}>
      {[0,1,2].map(i => (
        <span key={i} style={{
          width:7, height:7, borderRadius:"50%", background:"#2563eb",
          display:"inline-block",
          animation:"aiDot 1.2s infinite",
          animationDelay:`${i*0.2}s`,
        }}/>
      ))}
    </span>
  </>
);

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text) => {
    const t = (text || message).trim();
    if (!t || loading) return;
    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setMessages(prev => [...prev, { role: "user", text: t }]);
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5216/api/ai/chat", { message: t });
      setMessages(prev => [...prev, { role: "ai", text: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "Sorry, I couldn't reach the server. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const isEmpty = messages.length === 0;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      background: "#f8faff",
      fontFamily: "inherit",
      overflow: "hidden",
    }}>

      {/* ── Scrollable area ── */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: isEmpty ? "0" : "24px 0 8px",
        display: "flex",
        flexDirection: "column",
      }}>

        {/* Empty state */}
        {isEmpty && (
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 24px 0",
          }}>
            {/* Icon */}
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, marginBottom: 16,
              boxShadow: "0 4px 20px rgba(37,99,235,0.25)",
            }}>🔧</div>

            <div style={{ fontWeight: 700, fontSize: 20, color: "#1e293b", marginBottom: 6 }}>
              AutoMind AI
            </div>
            <div style={{ fontSize: 14, color: "#64748b", marginBottom: 36, textAlign: "center" }}>
              Your expert car servicing &amp; parts advisor
            </div>

            {/* Suggestion grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              width: "100%",
              maxWidth: 560,
            }}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.text}
                  onClick={() => send(s.text)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "12px 14px", borderRadius: 12,
                    border: "1.5px solid #e2e8f0",
                    background: "#fff",
                    cursor: "pointer", textAlign: "left",
                    fontSize: 13.5, color: "#334155",
                    fontFamily: "inherit", fontWeight: 500,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "#2563eb";
                    e.currentTarget.style.background = "#eff6ff";
                    e.currentTarget.style.color = "#1d4ed8";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(37,99,235,0.12)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.color = "#334155";
                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
                  }}
                >
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{s.icon}</span>
                  <span style={{ lineHeight: 1.4 }}>{s.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {!isEmpty && (
          <div style={{
            display: "flex", flexDirection: "column", gap: 16,
            width: "100%", maxWidth: 720,
            margin: "0 auto", padding: "0 20px",
          }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  alignItems: "flex-end", gap: 8,
                  animation: "aiFadeUp 0.25s ease",
                }}
              >
                {/* AI avatar */}
                {msg.role === "ai" && (
                  <div style={{
                    width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                    background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 15, boxShadow: "0 2px 6px rgba(37,99,235,0.2)",
                  }}>🔧</div>
                )}

                <div style={{
                  maxWidth: "72%",
                  padding: "11px 15px",
                  borderRadius: msg.role === "user"
                    ? "16px 16px 4px 16px"
                    : "16px 16px 16px 4px",
                  background: msg.role === "user"
                    ? "linear-gradient(135deg,#2563eb,#1d4ed8)"
                    : "#fff",
                  color: msg.role === "user" ? "#fff" : "#1e293b",
                  fontSize: 14, lineHeight: 1.65,
                  boxShadow: msg.role === "user"
                    ? "0 2px 10px rgba(37,99,235,0.25)"
                    : "0 1px 4px rgba(0,0,0,0.07)",
                  border: msg.role === "ai" ? "1px solid #e2e8f0" : "none",
                }}>
                  {msg.role === "ai" ? (
                    <div className="prose prose-sm max-w-none" style={{
                      color: "#1e293b",
                      fontSize: 14,
                      lineHeight: 1.7,
                    }}>
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  ) : msg.text}
                </div>

                {/* User avatar */}
                {msg.role === "user" && (
                  <div style={{
                    width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                    background: "#e0e7ff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700, color: "#3730a3",
                  }}>You</div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{
                display: "flex", alignItems: "flex-end", gap: 8,
                animation: "aiFadeUp 0.2s ease",
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 15, flexShrink: 0,
                  boxShadow: "0 2px 6px rgba(37,99,235,0.2)",
                }}>🔧</div>
                <div style={{
                  padding: "12px 16px", borderRadius: "16px 16px 16px 4px",
                  background: "#fff", border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                }}>
                  <TypingDots />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* ── Fixed bottom input ── */}
      <div style={{
        background: "#f8faff",
        borderTop: "1px solid #e2e8f0",
        padding: "10px 20px 14px",
        flexShrink: 0,
      }}>
        {/* Quick chips — shown after conversation starts */}
        {!isEmpty && (
          <div style={{
            display: "flex", gap: 6, marginBottom: 8,
            flexWrap: "wrap",
            maxWidth: 720, margin: "0 auto 8px",
          }}>
            {SUGGESTIONS.slice(0, 4).map((s) => (
              <button
                key={s.text}
                onClick={() => send(s.text)}
                style={{
                  fontSize: 12, padding: "4px 11px", borderRadius: 20,
                  border: "1px solid #cbd5e1", background: "#fff",
                  cursor: "pointer", color: "#475569",
                  fontFamily: "inherit", fontWeight: 500,
                  whiteSpace: "nowrap", transition: "all 0.15s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "#2563eb";
                  e.currentTarget.style.color = "#2563eb";
                  e.currentTarget.style.background = "#eff6ff";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "#cbd5e1";
                  e.currentTarget.style.color = "#475569";
                  e.currentTarget.style.background = "#fff";
                }}
              >
                {s.icon} {s.text}
              </button>
            ))}
          </div>
        )}

        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div
            style={{
              display: "flex", alignItems: "flex-end", gap: 8,
              background: "#fff",
              border: "1.5px solid #e2e8f0",
              borderRadius: 14,
              padding: "8px 10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onFocusCapture={e => {
              e.currentTarget.style.borderColor = "#2563eb";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)";
            }}
            onBlurCapture={e => {
              e.currentTarget.style.borderColor = "#e2e8f0";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
            }}
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={message}
              onChange={e => {
                setMessage(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 110) + "px";
              }}
              onKeyDown={handleKey}
              placeholder="Ask your car problem..."
              style={{
                flex: 1, resize: "none", border: "none", outline: "none",
                fontSize: 14, fontFamily: "inherit", lineHeight: 1.55,
                background: "transparent", color: "#1e293b",
                padding: "2px 4px",
              }}
            />
            <button
              onClick={() => send()}
              disabled={!message.trim() || loading}
              style={{
                background: message.trim() && !loading
                  ? "linear-gradient(135deg,#2563eb,#1d4ed8)"
                  : "#e2e8f0",
                color: "#fff", border: "none", borderRadius: 9,
                width: 36, height: 36,
                cursor: message.trim() && !loading ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.2s",
                boxShadow: message.trim() && !loading ? "0 2px 6px rgba(37,99,235,0.3)" : "none",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M2 14L14 8 2 2v4.5l8 1.5-8 1.5V14z" fill={message.trim() && !loading ? "white" : "#94a3b8"} />
              </svg>
            </button>
          </div>
          <div style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", marginTop: 6 }}>
            Enter to send · Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;