import { useState, useCallback } from "react";

const FONT = "'https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Bebas+Neue&display=swap'";

const colors = {
  bg: "#F5F0E8",
  black: "#0A0A0A",
  yellow: "#FFE135",
  cyan: "#00E5FF",
  pink: "#FF3CAC",
  white: "#FFFFFF",
  gray: "#E0D8C8",
};

// ── Autokey Cipher Logic ──────────────────────────────────────────
function cleanInput(s) {
  return s.toUpperCase().replace(/[^A-Z]/g, "");
}

function autokeyEncrypt(plaintext, keyword) {
  const p = cleanInput(plaintext);
  const k = cleanInput(keyword);
  if (!p || !k) return null;
  const kw = k.length > p.length ? k.slice(0, p.length) : k;
  const keystream = (kw + p).slice(0, p.length);
  let cipher = "";
  const rows = [];
  for (let i = 0; i < p.length; i++) {
    const pv = p.charCodeAt(i) - 65;
    const kv = keystream.charCodeAt(i) - 65;
    const cv = (pv + kv) % 26;
    const cc = String.fromCharCode(cv + 65);
    cipher += cc;
    rows.push({
      i: i + 1,
      plain: p[i], key: keystream[i],
      pv, kv, cv, cipher: cc,
      src: i < kw.length ? "keyword" : "plaintext",
    });
  }
  return { result: cipher, keystream, rows, plain: p, keyword: kw };
}

function autokeyDecrypt(ciphertext, keyword) {
  const c = cleanInput(ciphertext);
  const k = cleanInput(keyword);
  if (!c || !k) return null;
  const kw = k.length > c.length ? k.slice(0, c.length) : k;
  const ksArr = [...kw];
  let plain = "";
  const rows = [];
  for (let i = 0; i < c.length; i++) {
    const cv = c.charCodeAt(i) - 65;
    const kv = ksArr[i].charCodeAt(0) - 65;
    const pv = (cv - kv + 26) % 26;
    const pc = String.fromCharCode(pv + 65);
    plain += pc;
    ksArr.push(pc);
    rows.push({
      i: i + 1,
      cipher: c[i], key: ksArr[i],
      cv, kv, pv, plain: pc,
      src: i < kw.length ? "keyword" : "plaintext",
    });
  }
  return { result: plain, keystream: ksArr.slice(0, c.length).join(""), rows, cipher: c, keyword: kw };
}

// ── Styles ────────────────────────────────────────────────────────
const S = {
  page: {
    minHeight: "100vh",
    background: colors.bg,
    fontFamily: "'Space Mono', monospace",
    padding: "0",
    overflowX: "hidden",
  },
  header: {
    background: colors.black,
    borderBottom: `4px solid ${colors.yellow}`,
    padding: "24px 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "12px",
  },
  headerTitle: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "clamp(28px, 5vw, 52px)",
    color: colors.yellow,
    letterSpacing: "0.08em",
    margin: 0,
    lineHeight: 1,
  },
  headerSub: {
    fontSize: "11px",
    color: "#999",
    letterSpacing: "0.15em",
    marginTop: "4px",
    textTransform: "uppercase",
  },
  badge: {
    background: colors.cyan,
    color: colors.black,
    fontFamily: "'Space Mono', monospace",
    fontWeight: 700,
    fontSize: "11px",
    padding: "6px 14px",
    border: `2px solid ${colors.black}`,
    boxShadow: `3px 3px 0 ${colors.black}`,
    letterSpacing: "0.1em",
  },
  main: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "32px 24px 64px",
  },
  tabRow: {
    display: "flex",
    gap: "0",
    marginBottom: "32px",
    border: `3px solid ${colors.black}`,
    width: "fit-content",
    boxShadow: `5px 5px 0 ${colors.black}`,
  },
  tabBtn: (active, accent) => ({
    padding: "12px 32px",
    background: active ? accent : colors.white,
    color: active ? colors.black : "#555",
    fontFamily: "'Space Mono', monospace",
    fontWeight: 700,
    fontSize: "13px",
    letterSpacing: "0.12em",
    border: "none",
    borderRight: `3px solid ${colors.black}`,
    cursor: "pointer",
    textTransform: "uppercase",
    transition: "background 0.15s",
  }),
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    marginBottom: "28px",
  },
  card: (accent = colors.yellow) => ({
    background: colors.white,
    border: `3px solid ${colors.black}`,
    boxShadow: `6px 6px 0 ${colors.black}`,
    padding: "24px",
    position: "relative",
  }),
  cardLabel: {
    fontFamily: "'Space Mono', monospace",
    fontWeight: 700,
    fontSize: "10px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#777",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    background: colors.bg,
    border: `3px solid ${colors.black}`,
    padding: "12px 14px",
    fontFamily: "'Space Mono', monospace",
    fontSize: "16px",
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: colors.black,
    outline: "none",
    boxSizing: "border-box",
    textTransform: "uppercase",
  },
  resultBox: (accent) => ({
    background: accent,
    border: `3px solid ${colors.black}`,
    padding: "14px 16px",
    fontFamily: "'Space Mono', monospace",
    fontSize: "22px",
    fontWeight: 700,
    letterSpacing: "0.15em",
    color: colors.black,
    minHeight: "52px",
    wordBreak: "break-all",
  }),
  ksBox: {
    background: "#F0EBE0",
    border: `2px dashed ${colors.black}`,
    padding: "10px 14px",
    fontFamily: "'Space Mono', monospace",
    fontSize: "14px",
    letterSpacing: "0.1em",
    color: "#444",
    wordBreak: "break-all",
    marginTop: "8px",
  },
  accentStripe: (color) => ({
    position: "absolute",
    top: 0, left: 0, right: 0,
    height: "6px",
    background: color,
  }),
  sectionTitle: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "28px",
    letterSpacing: "0.08em",
    color: colors.black,
    margin: "32px 0 16px",
    borderBottom: `3px solid ${colors.black}`,
    paddingBottom: "8px",
  },
  tableWrap: {
    overflowX: "auto",
    border: `3px solid ${colors.black}`,
    boxShadow: `6px 6px 0 ${colors.black}`,
    background: colors.white,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontFamily: "'Space Mono', monospace",
    fontSize: "13px",
  },
  th: (accent) => ({
    background: accent,
    color: colors.black,
    fontWeight: 700,
    padding: "10px 14px",
    textAlign: "center",
    borderBottom: `3px solid ${colors.black}`,
    borderRight: `1px solid ${colors.black}`,
    letterSpacing: "0.08em",
    whiteSpace: "nowrap",
    fontSize: "11px",
    textTransform: "uppercase",
  }),
  td: (i) => ({
    padding: "9px 14px",
    textAlign: "center",
    borderBottom: `1px solid #D0C8B8`,
    borderRight: `1px solid #D0C8B8`,
    background: i % 2 === 0 ? colors.white : "#FAF6EE",
    color: colors.black,
  }),
  srcBadge: (src) => ({
    background: src === "keyword" ? colors.cyan : colors.pink,
    color: colors.black,
    fontWeight: 700,
    fontSize: "10px",
    padding: "3px 10px",
    border: `2px solid ${colors.black}`,
    letterSpacing: "0.08em",
    display: "inline-block",
  }),
  emptyState: {
    textAlign: "center",
    padding: "48px 24px",
    color: "#999",
    fontSize: "13px",
    letterSpacing: "0.1em",
    fontWeight: 700,
    textTransform: "uppercase",
  },
  formulaBox: {
    background: colors.black,
    color: colors.yellow,
    border: `3px solid ${colors.black}`,
    padding: "16px 20px",
    fontFamily: "'Space Mono', monospace",
    fontSize: "13px",
    lineHeight: "2",
    letterSpacing: "0.05em",
    marginBottom: "28px",
    boxShadow: `5px 5px 0 #555`,
  },
  copyBtn: {
    background: "transparent",
    border: `2px solid ${colors.black}`,
    padding: "4px 12px",
    fontFamily: "'Space Mono', monospace",
    fontSize: "11px",
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.1em",
    marginLeft: "10px",
    verticalAlign: "middle",
  },
};

// ── Components ────────────────────────────────────────────────────
function AccentCard({ children, accent = colors.yellow, style = {} }) {
  return (
    <div style={{ ...S.card(), ...style, position: "relative" }}>
      <div style={S.accentStripe(accent)} />
      <div style={{ paddingTop: "8px" }}>{children}</div>
    </div>
  );
}

function ProcessTable({ rows, mode, accent }) {
  if (!rows || rows.length === 0)
    return <div style={S.emptyState}>— masukkan teks untuk melihat tabel proses —</div>;

  const isEnc = mode === "enc";
  const headers = isEnc
    ? ["#", "Plain", "Key", "P (num)", "K (num)", "(P+K) mod 26", "Cipher", "Key dari"]
    : ["#", "Cipher", "Key", "C (num)", "K (num)", "(C−K) mod 26", "Plain", "Key dari"];

  return (
    <div style={S.tableWrap}>
      <table style={S.table}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h} style={S.th(accent)}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={r.i}>
              {isEnc ? (
                <>
                  <td style={S.td(idx)}>{r.i}</td>
                  <td style={{ ...S.td(idx), fontWeight: 700 }}>{r.plain}</td>
                  <td style={S.td(idx)}>{r.key}</td>
                  <td style={S.td(idx)}>{r.pv}</td>
                  <td style={S.td(idx)}>{r.kv}</td>
                  <td style={{ ...S.td(idx), fontWeight: 700 }}>{r.cv}</td>
                  <td style={{ ...S.td(idx), fontWeight: 700, color: "#C00" }}>{r.cipher}</td>
                  <td style={S.td(idx)}><span style={S.srcBadge(r.src)}>{r.src}</span></td>
                </>
              ) : (
                <>
                  <td style={S.td(idx)}>{r.i}</td>
                  <td style={{ ...S.td(idx), fontWeight: 700 }}>{r.cipher}</td>
                  <td style={S.td(idx)}>{r.key}</td>
                  <td style={S.td(idx)}>{r.cv}</td>
                  <td style={S.td(idx)}>{r.kv}</td>
                  <td style={{ ...S.td(idx), fontWeight: 700 }}>{r.pv}</td>
                  <td style={{ ...S.td(idx), fontWeight: 700, color: "#007A3D" }}>{r.plain}</td>
                  <td style={S.td(idx)}><span style={S.srcBadge(r.src)}>{r.src}</span></td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────
export default function AutokeyCipher() {
  const [tab, setTab] = useState("enc");
  const [encPlain, setEncPlain] = useState("SERANGAN");
  const [encKey, setEncKey] = useState("KUNCI");
  const [decCipher, setDecCipher] = useState("COYDFMFE");
  const [decKey, setDecKey] = useState("KUNCI");
  const [copied, setCopied] = useState("");

  const encResult = autokeyEncrypt(encPlain, encKey);
  const decResult = autokeyDecrypt(decCipher, decKey);

  const copyText = useCallback((text, id) => {
    navigator.clipboard?.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(""), 1500);
  }, []);

  const isEnc = tab === "enc";
  const accent = isEnc ? colors.yellow : colors.cyan;
  const result = isEnc ? encResult : decResult;

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Bebas+Neue&display=swap"
        rel="stylesheet"
      />
      <div style={S.page}>
        {/* Header */}
        <header style={S.header}>
          <div>
            <h1 style={S.headerTitle}>AUTOKEY CIPHER</h1>
            <p style={S.headerSub}>Classical Cryptography · Tugas Kriptografi</p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <span style={S.badge}>ENCRYPT</span>
            <span style={{ ...S.badge, background: colors.pink }}>DECRYPT</span>
          </div>
        </header>

        <main style={S.main}>

          {/* Formula box */}
          <div style={S.formulaBox}>
            <span style={{ color: colors.cyan, fontWeight: 700 }}>// RUMUS AUTOKEY CIPHER</span>{"\n"}
            <span style={{ color: "#aaa" }}>Enkripsi :</span> {"  "}C<sub>i</sub> = (P<sub>i</sub> + K<sub>i</sub>) mod 26{"\n"}
            <span style={{ color: "#aaa" }}>Dekripsi :</span> {"  "}P<sub>i</sub> = (C<sub>i</sub> − K<sub>i</sub> + 26) mod 26{"\n"}
            <span style={{ color: "#aaa" }}>Key stream:</span> {"  "}K = keyword + plaintext
          </div>

          {/* Tabs */}
          <div style={S.tabRow}>
            <button
              style={{ ...S.tabBtn(isEnc, colors.yellow), borderRight: `3px solid ${colors.black}` }}
              onClick={() => setTab("enc")}
            >
              ⬡ Enkripsi
            </button>
            <button
              style={{ ...S.tabBtn(!isEnc, colors.cyan), borderRight: "none" }}
              onClick={() => setTab("dec")}
            >
              ⬡ Dekripsi
            </button>
          </div>

          {/* Input cards */}
          <div style={S.grid}>
            <AccentCard accent={accent}>
              <div style={S.cardLabel}>
                {isEnc ? "Plaintext (teks asli)" : "Ciphertext (teks terenkripsi)"}
              </div>
              <input
                style={S.input}
                value={isEnc ? encPlain : decCipher}
                onChange={(e) => isEnc ? setEncPlain(e.target.value) : setDecCipher(e.target.value)}
                placeholder={isEnc ? "CONTOH: SERANGAN" : "CONTOH: COYDFMFE"}
                spellCheck={false}
              />
            </AccentCard>

            <AccentCard accent={colors.pink}>
              <div style={S.cardLabel}>Keyword (kunci)</div>
              <input
                style={S.input}
                value={isEnc ? encKey : decKey}
                onChange={(e) => isEnc ? setEncKey(e.target.value) : setDecKey(e.target.value)}
                placeholder="CONTOH: KUNCI"
                spellCheck={false}
              />
            </AccentCard>
          </div>

          {/* Key stream + Result */}
          {result && (
            <div style={S.grid}>
              <AccentCard accent="#B0F0D0" style={{}}>
                <div style={S.cardLabel}>Key Stream yang Digunakan</div>
                <div style={S.ksBox}>{result.keystream || "—"}</div>
                <div style={{ fontSize: "11px", color: "#888", marginTop: "8px", letterSpacing: "0.05em" }}>
                  = keyword <span style={{ color: colors.black, fontWeight: 700 }}>({result.keyword})</span> + {isEnc ? "plaintext" : "plaintext hasil dekripsi"}
                </div>
              </AccentCard>

              <AccentCard accent={accent}>
                <div style={S.cardLabel}>
                  {isEnc ? "Hasil Enkripsi (Ciphertext)" : "Hasil Dekripsi (Plaintext)"}
                </div>
                <div style={S.resultBox(accent)}>
                  {result.result}
                  <button
                    style={S.copyBtn}
                    onClick={() => copyText(result.result, "res")}
                  >
                    {copied === "res" ? "✓ COPIED" : "COPY"}
                  </button>
                </div>
              </AccentCard>
            </div>
          )}

          {!result && (
            <div style={{ ...S.card(), textAlign: "center", padding: "32px", marginBottom: "28px" }}>
              <span style={{ color: "#bbb", fontSize: "13px", fontWeight: 700, letterSpacing: "0.1em" }}>
                MASUKKAN TEKS &amp; KEYWORD YANG VALID
              </span>
            </div>
          )}

          {/* Process table */}
          <div style={S.sectionTitle}>// TABEL PROSES</div>
          <ProcessTable rows={result?.rows} mode={tab} accent={accent} />

          {/* Legend */}
          <div style={{ marginTop: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <span style={{ ...S.srcBadge("keyword"), fontSize: "11px" }}>KEYWORD</span>
            <span style={{ fontSize: "11px", color: "#666", alignSelf: "center" }}>= karakter dari keyword asli</span>
            <span style={{ ...S.srcBadge("plaintext"), fontSize: "11px" }}>PLAINTEXT</span>
            <span style={{ fontSize: "11px", color: "#666", alignSelf: "center" }}>= karakter dari plaintext (autokey)</span>
          </div>

        </main>
      </div>
    </>
  );
}