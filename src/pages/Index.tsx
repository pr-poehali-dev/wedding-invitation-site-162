import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

/* ── Images ── */
const HERO_IMAGE    = "https://cdn.poehali.dev/projects/153c976b-95dd-47fc-9d22-8d8cd1c4c698/files/00fad8e5-48b6-4e00-8995-407fa7aa90ba.jpg";
const BOUQUET_IMG   = "https://cdn.poehali.dev/projects/153c976b-95dd-47fc-9d22-8d8cd1c4c698/files/df2baa41-b36f-4259-ab4d-a1c4ab0816bc.jpg";
const ARCH_IMG      = "https://cdn.poehali.dev/projects/153c976b-95dd-47fc-9d22-8d8cd1c4c698/files/76807e1a-2fe6-47e0-8537-cc2d3dcf5f82.jpg";
const BOTANICAL_BG  = "https://cdn.poehali.dev/projects/153c976b-95dd-47fc-9d22-8d8cd1c4c698/files/15e930dc-3acd-4c51-9696-dd7ea20b6372.jpg";

const FABRIC_IMAGES = [
  { img: "https://cdn.poehali.dev/projects/153c976b-95dd-47fc-9d22-8d8cd1c4c698/files/277a993d-d3a3-4f52-9dc2-c245f471dc70.jpg", name: "Изумрудный" },
  { img: "https://cdn.poehali.dev/projects/153c976b-95dd-47fc-9d22-8d8cd1c4c698/files/3c112ac7-4346-4f10-b741-35f0aec659bd.jpg", name: "Бежевый" },
  { img: "https://cdn.poehali.dev/projects/153c976b-95dd-47fc-9d22-8d8cd1c4c698/files/d4e41fe2-4375-4ef8-a3a3-d25c629f104d.jpg", name: "Молочный шоколад" },
  { img: "https://cdn.poehali.dev/projects/153c976b-95dd-47fc-9d22-8d8cd1c4c698/files/277bfc3b-01d7-420a-8b43-cb36174cc5fc.jpg", name: "Голубой" },
];

const schedule = [
  { time: "13:30", title: "Сбор гостей", desc: "Дворец бракосочетания · г. Благовещенск", icon: "Users" },
  { time: "13:45", title: "Регистрация брака", desc: "пер. Святителя Иннокентия, 6 · г. Благовещенск, Амурская обл.", icon: "Heart" },
  { time: "14:30", title: "Фотосессия", desc: "Совместные снимки с молодожёнами", icon: "Camera" },
  { time: "17:00", title: "Свадебный банкет", desc: "Игнатьевское шоссе, 4 км, 1а · Ресторан «Дом счастливых событий»", icon: "Wine" },
  { time: "23:00", title: "Завершение вечера", desc: "Окончание праздничного вечера", icon: "Moon" },
];

/* ── Colours ── */
const C = {
  emerald: "#2d6a4f",
  dark:    "#1a3d2b",
  gold:    "#c9a84c",
  cream:   "#fafaf7",
  lightG:  "#f0f5ef",
};

/* ── Helpers ── */
function useInView(ref: React.RefObject<Element>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.07 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}

function Section({ id, children, className = "", style = {} }: { id: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref as React.RefObject<Element>);
  return (
    <section id={id} ref={ref} className={className}
      style={{ transition: "opacity .7s, transform .7s", opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(32px)", ...style }}>
      {children}
    </section>
  );
}

/* ── Gold frame corner SVG ── */
function GoldCorners({ size = 60, opacity = 0.7 }: { size?: number; opacity?: number }) {
  const s = `${size}px`;
  const corner = (rot: number) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ position: "absolute", width: s, height: s, opacity }}>
      <path d={`M2 58 L2 2 L58 2`} stroke={C.gold} strokeWidth="1.5" fill="none" />
      <path d={`M2 10 L10 10 L10 2`} stroke={C.gold} strokeWidth="1" fill="none" />
      <circle cx="2" cy="2" r="2.5" fill={C.gold} />
    </svg>
  );
  return (
    <>
      <div style={{ position: "absolute", top: 0, left: 0 }}>{corner(0)}</div>
      <div style={{ position: "absolute", top: 0, right: 0, transform: "scaleX(-1)" }}>{corner(0)}</div>
      <div style={{ position: "absolute", bottom: 0, left: 0, transform: "scaleY(-1)" }}>{corner(0)}</div>
      <div style={{ position: "absolute", bottom: 0, right: 0, transform: "scale(-1)" }}>{corner(0)}</div>
    </>
  );
}

/* ── Gold card border ── */
function GoldCard({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ position: "relative", border: `1px solid ${C.gold}40`, background: "#fff", boxShadow: `0 4px 32px ${C.gold}14, 0 2px 8px rgba(0,0,0,0.06)`, ...style }}>
      <GoldCorners size={36} opacity={0.55} />
      {children}
    </div>
  );
}

/* ── Gold divider ── */
function GoldDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", margin: "24px 0" }}>
      <div style={{ width: 64, height: 1, background: `linear-gradient(to right, transparent, ${C.gold}70)` }} />
      <span style={{ color: C.gold, fontSize: 13 }}>✦</span>
      <div style={{ width: 32, height: 1, background: `${C.gold}60` }} />
      <span style={{ color: C.gold, fontSize: 9 }}>✦</span>
      <div style={{ width: 64, height: 1, background: `linear-gradient(to left, transparent, ${C.gold}70)` }} />
    </div>
  );
}

function Label({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <span style={{ fontFamily: "'Raleway',sans-serif", fontSize: 9, letterSpacing: "0.55em", textTransform: "uppercase", color: light ? C.gold : C.gold }}>{children}</span>;
}

/* ── Countdown ── */
function Countdown() {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const target = new Date("2026-08-28T13:30:00");
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return;
      setT({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "clamp(24px,5vw,56px)", marginTop: 16 }}>
      {[{ v: t.d, l: "дней" }, { v: t.h, l: "часов" }, { v: t.m, l: "минут" }, { v: t.s, l: "секунд" }].map((x, i) => (
        <div key={i} style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,5vw,48px)", color: C.dark, fontWeight: 400 }}>{String(x.v).padStart(2, "0")}</div>
          <div style={{ fontFamily: "'Raleway',sans-serif", fontSize: 9, color: `${C.gold}99`, letterSpacing: "0.3em", textTransform: "uppercase", marginTop: 6 }}>{x.l}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Nav ── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = [
    { href: "#invitation", label: "Приглашение" }, { href: "#datetime", label: "Дата" },
    { href: "#venue", label: "Место" }, { href: "#schedule", label: "График" },
    { href: "#dresscode", label: "Дресс-код" }, { href: "#rsvp", label: "RSVP" }, { href: "#contacts", label: "Контакты" },
  ];
  const lc = scrolled ? `${C.dark}88` : "rgba(255,255,255,.68)";
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: scrolled ? "rgba(255,255,255,.96)" : "transparent", backdropFilter: scrolled ? "blur(14px)" : "none", borderBottom: scrolled ? `1px solid ${C.gold}22` : "none", transition: "all .5s" }}>
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="#" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontStyle: "italic", letterSpacing: ".15em", color: scrolled ? C.gold : "#fff", textDecoration: "none" }}>В & К</a>
        <div className="hidden lg:flex" style={{ gap: 28 }}>
          {links.map(l => (
            <a key={l.href} href={l.href} style={{ fontFamily: "'Raleway',sans-serif", fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: lc, textDecoration: "none", transition: "color .2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.gold)} onMouseLeave={e => (e.currentTarget.style.color = lc)}>
              {l.label}
            </a>
          ))}
        </div>
        <button className="lg:hidden" style={{ background: "none", border: "none", cursor: "pointer", color: lc }} onClick={() => setOpen(!open)}>
          <Icon name={open ? "X" : "Menu"} size={22} />
        </button>
      </div>
      {open && (
        <div style={{ background: "rgba(255,255,255,.98)", padding: "0 24px 24px", borderTop: `1px solid ${C.gold}20` }}>
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ display: "block", fontFamily: "'Raleway',sans-serif", fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: `${C.dark}66`, padding: "12px 0", borderBottom: `1px solid ${C.emerald}10`, textDecoration: "none" }}>{l.label}</a>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ══════════════════════════════════════════
   MAIN
══════════════════════════════════════════ */
export default function Index() {
  const [rsvpStatus, setRsvpStatus] = useState<"idle"|"yes"|"no">("idle");
  const [rsvpName, setRsvpName]     = useState("");
  const [rsvpCount, setRsvpCount]   = useState("1");
  const [transfer, setTransfer]     = useState<"yes"|"no"|"">("");
  const [alcohol, setAlcohol]       = useState<string[]>([]);
  const [hasChild, setHasChild]     = useState<"yes"|"no"|"">("");
  const [submitted, setSubmitted]   = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => { setTimeout(() => setHeroLoaded(true), 120); }, []);
  const toggleAlcohol = (v: string) => setAlcohol(p => p.includes(v) ? p.filter(a => a !== v) : [...p, v]);

  const btnOn  = { background: C.emerald, color: "#fff", border: `1px solid ${C.emerald}` };
  const btnOff = { background: "transparent", color: `${C.dark}55`, border: `1px solid ${C.emerald}30` };

  /* ── RSVP submit ── */
  const handleSubmit = async () => {
    if (!rsvpName.trim() || rsvpStatus === "idle") return;
    setSubmitted(true);
    try {
      await fetch("https://formsubmit.co/ajax/ksu.matykhina1708@mail.ru", {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          Имя: rsvpName,
          Присутствие: rsvpStatus === "yes" ? "Буду" : "Не смогу",
          Гостей: rsvpStatus === "yes" ? rsvpCount : "—",
          Трансфер: transfer === "yes" ? "Нужен" : transfer === "no" ? "Не нужен" : "—",
          Алкоголь: alcohol.length ? alcohol.join(", ") : "—",
          Ребёнок: hasChild === "yes" ? "Да" : hasChild === "no" ? "Нет" : "—",
          _subject: `Ответ на приглашение от ${rsvpName}`,
        }),
      });
    } catch (_) { /* silent */ }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.cream, color: C.dark, fontFamily: "'Raleway',sans-serif" }}>
      <Nav />

      {/* ═══ HERO ═══ */}
      <div style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <img src={HERO_IMAGE} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.04)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(8,22,12,.58) 0%, rgba(8,22,12,.18) 45%, rgba(8,22,12,.88) 100%)" }} />
        {/* botanical corners */}
        <img src={BOTANICAL_BG} alt="" style={{ position: "absolute", top: 0, left: 0, width: 300, opacity: .22, pointerEvents: "none" }} />
        <img src={BOTANICAL_BG} alt="" style={{ position: "absolute", top: 0, right: 0, width: 300, opacity: .22, pointerEvents: "none", transform: "scaleX(-1)" }} />
        <img src={BOTANICAL_BG} alt="" style={{ position: "absolute", bottom: 0, left: 0, width: 220, opacity: .15, pointerEvents: "none", transform: "scaleY(-1)" }} />
        <img src={BOTANICAL_BG} alt="" style={{ position: "absolute", bottom: 0, right: 0, width: 220, opacity: .15, pointerEvents: "none", transform: "scale(-1)" }} />

        <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 24px", transition: "opacity 1s, transform 1s", opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? "none" : "translateY(48px)" }}>
          {/* gold frame around title */}
          <div style={{ display: "inline-block", position: "relative", padding: "40px 60px" }}>
            <GoldCorners size={50} opacity={.65} />
            <p style={{ fontFamily: "'Raleway',sans-serif", fontSize: 10, letterSpacing: ".6em", textTransform: "uppercase", color: "#b8dfc5", marginBottom: 28 }}>Приглашаем на свадьбу</p>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(58px,10vw,110px)", color: "#fff", fontWeight: 400, lineHeight: .9, margin: 0 }}>
              Вадим<br />
              <em style={{ fontStyle: "italic", color: C.gold, fontSize: ".44em", letterSpacing: ".15em" }}>и</em><br />
              Ксения
            </h1>
            <GoldDivider />
            <p style={{ fontFamily: "'Raleway',sans-serif", fontSize: 10, letterSpacing: ".44em", textTransform: "uppercase", color: "rgba(255,255,255,.52)", marginBottom: 6 }}>28 августа 2026</p>
            <p style={{ fontFamily: "'Raleway',sans-serif", fontSize: 10, letterSpacing: ".3em", textTransform: "uppercase", color: "rgba(255,255,255,.3)", marginBottom: 32 }}>г. Благовещенск · Амурская область</p>
          </div>
          <br />
          <a href="#invitation" style={{ display: "inline-block", fontFamily: "'Raleway',sans-serif", fontSize: 10, letterSpacing: ".35em", textTransform: "uppercase", color: "#fff", border: "1px solid rgba(255,255,255,.3)", padding: "16px 40px", textDecoration: "none", transition: "all .3s", marginTop: 8 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.3)"; e.currentTarget.style.color = "#fff"; }}>
            Открыть приглашение
          </a>
        </div>
        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", opacity: .4, animation: "bounce 1.5s infinite" }}>
          <Icon name="ChevronDown" size={18} className="text-white" />
        </div>
      </div>

      {/* ═══ ПРИГЛАШЕНИЕ ═══ */}
      <Section id="invitation" style={{ padding: "100px 24px", backgroundColor: "#fff", position: "relative", overflow: "hidden" }}>
        <img src={BOTANICAL_BG} alt="" style={{ position: "absolute", top: 0, left: 0, width: 320, opacity: .2, pointerEvents: "none" }} />
        <img src={BOTANICAL_BG} alt="" style={{ position: "absolute", bottom: 0, right: 0, width: 320, opacity: .2, pointerEvents: "none", transform: "scale(-1)" }} />
        <div style={{ maxWidth: 860, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 40, alignItems: "center", position: "relative" }}>
          {/* left bouquet */}
          <div style={{ position: "relative", display: "flex", justifyContent: "flex-end" }}>
            <GoldCard style={{ width: "100%", maxWidth: 280, aspectRatio: "3/4", overflow: "hidden", padding: 0 }}>
              <img src={BOUQUET_IMG} alt="Букет" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </GoldCard>
          </div>
          {/* centre text */}
          <div style={{ textAlign: "center", minWidth: 200 }}>
            <Label>Приглашение</Label>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,4vw,44px)", color: C.dark, fontWeight: 400, margin: "20px 0 10px", lineHeight: 1.2 }}>
              Дорогие<br /><em>друзья и близкие</em>
            </h2>
            <GoldDivider />
            <p style={{ fontFamily: "'Raleway',sans-serif", fontSize: 13, color: `${C.dark}88`, lineHeight: 2 }}>
              Мы рады пригласить вас разделить с нами один из самых важных и счастливых дней нашей жизни — день нашей свадьбы. Ваше присутствие сделает этот праздник по-настоящему незабываемым.
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontStyle: "italic", color: C.emerald, marginTop: 28 }}>С любовью, Вадим и Ксения ♡</p>
          </div>
          {/* right arch */}
          <div>
            <GoldCard style={{ width: "100%", maxWidth: 280, aspectRatio: "3/4", overflow: "hidden", padding: 0 }}>
              <img src={ARCH_IMG} alt="Арка" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </GoldCard>
          </div>
        </div>
      </Section>

      {/* ═══ ДАТА И ВРЕМЯ ═══ */}
      <Section id="datetime" style={{ padding: "96px 24px", backgroundColor: C.lightG, position: "relative", overflow: "hidden" }}>
        <img src={BOTANICAL_BG} alt="" style={{ position: "absolute", right: 0, top: 0, height: "100%", width: 280, opacity: .17, pointerEvents: "none", objectFit: "cover" }} />
        <img src={BOTANICAL_BG} alt="" style={{ position: "absolute", left: 0, bottom: 0, width: 200, opacity: .12, pointerEvents: "none", transform: "scaleY(-1)" }} />
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}><Label>Дата и время</Label></div>
          <GoldCard style={{ marginBottom: 24, padding: 0 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
              {[{ value: "28", label: "Августа" }, { value: "2026", label: "Года" }, { value: "13:30", label: "Начало" }].map((item, i) => (
                <div key={i} style={{ textAlign: "center", padding: "36px 16px", borderRight: i < 2 ? `1px solid ${C.gold}22` : "none" }}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(36px,6vw,56px)", color: C.dark, fontWeight: 400, marginBottom: 10 }}>{item.value}</div>
                  <div style={{ fontFamily: "'Raleway',sans-serif", fontSize: 9, letterSpacing: ".35em", textTransform: "uppercase", color: `${C.dark}44` }}>{item.label}</div>
                </div>
              ))}
            </div>
          </GoldCard>
          <GoldCard style={{ padding: "28px 32px", textAlign: "center" }}>
            <p style={{ fontFamily: "'Raleway',sans-serif", fontSize: 9, letterSpacing: ".35em", textTransform: "uppercase", color: C.gold, marginBottom: 4 }}>До торжества</p>
            <Countdown />
          </GoldCard>
        </div>
      </Section>

      {/* ═══ МЕСТО ═══ */}
      <Section id="venue" style={{ padding: "96px 24px", backgroundColor: "#fff", position: "relative", overflow: "hidden" }}>
        <img src={BOTANICAL_BG} alt="" style={{ position: "absolute", left: 0, bottom: 0, width: 260, opacity: .18, pointerEvents: "none" }} />
        <img src={BOTANICAL_BG} alt="" style={{ position: "absolute", right: 0, top: 0, width: 200, opacity: .13, pointerEvents: "none", transform: "scaleX(-1)" }} />
        <div style={{ maxWidth: 896, margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}><Label>Место проведения</Label></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
            {[
              { icon: "Heart", label: "Регистрация", title: "Дворец бракосочетания", addr: "г. Благовещенск, Амурская область\nпер. Святителя Иннокентия, 6", maps: "https://yandex.ru/maps/?text=Благовещенск+переулок+Святителя+Иннокентия+6" },
              { icon: "Wine", label: "Банкет", title: "Дом счастливых событий", addr: "г. Благовещенск, Амурская область\nИгнатьевское шоссе, 4 км, 1а", maps: "https://yandex.ru/maps/?text=Благовещенск+Игнатьевское+шоссе+4+километр+1а" },
            ].map((v, i) => (
              <GoldCard key={i} style={{ padding: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 32, height: 32, background: C.emerald, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name={v.icon} size={13} className="text-white" />
                  </div>
                  <span style={{ fontFamily: "'Raleway',sans-serif", fontSize: 9, letterSpacing: ".35em", textTransform: "uppercase", color: C.emerald }}>{v.label}</span>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: C.dark, fontWeight: 400, marginBottom: 10 }}>{v.title}</h3>
                <p style={{ fontFamily: "'Raleway',sans-serif", fontSize: 12, color: `${C.dark}66`, lineHeight: 1.9, marginBottom: 24, whiteSpace: "pre-line" }}>{v.addr}</p>
                <a href={v.maps} target="_blank" rel="noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "'Raleway',sans-serif", fontSize: 9, letterSpacing: ".25em", textTransform: "uppercase", color: C.emerald, textDecoration: "none", borderBottom: `1px solid ${C.emerald}40`, paddingBottom: 2, transition: "color .2s, border-color .2s" }}
                  onMouseEnter={e => { e.currentTarget.style.color = C.gold; e.currentTarget.style.borderColor = C.gold; }}
                  onMouseLeave={e => { e.currentTarget.style.color = C.emerald; e.currentTarget.style.borderColor = `${C.emerald}40`; }}>
                  Открыть маршрут <Icon name="ArrowRight" size={11} />
                </a>
              </GoldCard>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ ГРАФИК ═══ */}
      <Section id="schedule" style={{ padding: "96px 24px", backgroundColor: C.dark, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${BOTANICAL_BG})`, backgroundSize: "cover", backgroundPosition: "center", opacity: .07, filter: "grayscale(1)", pointerEvents: "none" }} />
        <img src={BOUQUET_IMG} alt="" style={{ position: "absolute", right: -40, bottom: 0, width: 280, opacity: .12, pointerEvents: "none", objectFit: "cover" }} />
        <div style={{ maxWidth: 640, margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: 8 }}><Label>График мероприятий</Label></div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,5vw,40px)", color: "#fff", fontWeight: 400, textAlign: "center", margin: "8px 0 0" }}>Программа дня</h2>
          <GoldDivider />
          <div style={{ marginBottom: 48 }} />
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 52, top: 10, bottom: 10, width: 1, background: `linear-gradient(to bottom, ${C.gold}50, ${C.gold}18, transparent)` }} />
            {schedule.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 24, marginBottom: i < schedule.length - 1 ? 40 : 0 }}>
                <div style={{ width: 44, textAlign: "right", flexShrink: 0, paddingTop: 2 }}>
                  <span style={{ fontFamily: "'Raleway',sans-serif", fontSize: 10, color: C.gold, letterSpacing: ".08em" }}>{item.time}</span>
                </div>
                <div style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2, border: `1px solid ${C.gold}55`, background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
                  <div style={{ width: 5, height: 5, background: `${C.gold}90` }} />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <Icon name={item.icon} size={13} style={{ color: "#7dc99a" }} />
                    <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: "#fff", fontWeight: 400 }}>{item.title}</h4>
                  </div>
                  <p style={{ fontFamily: "'Raleway',sans-serif", fontSize: 11, color: "rgba(255,255,255,.35)", marginLeft: 22, lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ ДРЕСС-КОД ═══ */}
      <Section id="dresscode" style={{ padding: "96px 24px", backgroundColor: "#fff", position: "relative", overflow: "hidden" }}>
        <img src={BOTANICAL_BG} alt="" style={{ position: "absolute", right: 0, top: 0, height: "100%", width: 300, opacity: .14, pointerEvents: "none", objectFit: "cover", objectPosition: "left" }} />
        <img src={BOTANICAL_BG} alt="" style={{ position: "absolute", left: 0, bottom: 0, width: 200, opacity: .12, pointerEvents: "none", transform: "scaleX(-1)" }} />
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <Label>Дресс-код</Label>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,5vw,40px)", color: C.dark, fontStyle: "italic", fontWeight: 400, margin: "20px 0 6px" }}>Цвета торжества</h2>
          <GoldDivider />
          <p style={{ fontFamily: "'Raleway',sans-serif", fontSize: 12, color: `${C.dark}66`, lineHeight: 2, maxWidth: 460, margin: "0 auto 48px" }}>
            Просим придерживаться цветовой палитры праздника — это создаст красивое общее фото и гармоничную атмосферу.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 20 }}>
            {FABRIC_IMAGES.map((c, i) => (
              <div key={i}>
                <GoldCard style={{ aspectRatio: "3/4", overflow: "hidden", padding: 0, cursor: "default" }}>
                  <img src={c.img} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.06)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
                </GoldCard>
                <p style={{ fontFamily: "'Raleway',sans-serif", fontSize: 10, color: `${C.dark}77`, marginTop: 10, letterSpacing: ".06em" }}>{c.name}</p>
              </div>
            ))}
          </div>
          <GoldCard style={{ marginTop: 40, padding: 24 }}>
            <p style={{ fontFamily: "'Raleway',sans-serif", fontSize: 12, color: `${C.dark}66`, lineHeight: 2 }}>
              Пожалуйста, избегайте <strong style={{ color: `${C.dark}99` }}>белого</strong> и <strong style={{ color: `${C.dark}99` }}>чёрного</strong> цветов в нарядах.<br />Будем рады, если вы поддержите нашу палитру!
            </p>
          </GoldCard>
        </div>
      </Section>

      {/* ═══ RSVP ═══ */}
      <Section id="rsvp" style={{ padding: "96px 24px", backgroundColor: C.lightG, position: "relative", overflow: "hidden" }}>
        <img src={BOTANICAL_BG} alt="" style={{ position: "absolute", left: 0, top: 0, width: 280, opacity: .2, pointerEvents: "none" }} />
        <img src={ARCH_IMG} alt="" style={{ position: "absolute", right: 0, bottom: 0, width: 240, opacity: .1, pointerEvents: "none", objectFit: "cover" }} />
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <Label>Подтверждение участия</Label>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(32px,6vw,52px)", color: C.dark, fontWeight: 400, margin: "20px 0 6px" }}>Вы придёте?</h2>
          <p style={{ fontFamily: "'Raleway',sans-serif", fontSize: 10, color: `${C.dark}55`, marginBottom: 40, letterSpacing: ".08em" }}>Просим ответить до 1 июля 2026</p>

          {!submitted ? (
            <GoldCard style={{ padding: "40px 32px", textAlign: "left" }}>
              <label style={{ fontFamily: "'Raleway',sans-serif", fontSize: 9, letterSpacing: ".35em", textTransform: "uppercase", color: C.emerald, display: "block", marginBottom: 8 }}>Ваше имя</label>
              <input type="text" value={rsvpName} onChange={e => setRsvpName(e.target.value)} placeholder="Имя и фамилия"
                style={{ width: "100%", background: "transparent", border: "none", borderBottom: `1px solid ${C.emerald}25`, paddingBottom: 12, marginBottom: 28, fontFamily: "'Raleway',sans-serif", fontSize: 14, color: C.dark, outline: "none", boxSizing: "border-box" }} />

              <label style={{ fontFamily: "'Raleway',sans-serif", fontSize: 9, letterSpacing: ".35em", textTransform: "uppercase", color: C.emerald, display: "block", marginBottom: 10 }}>Подтверждение</label>
              <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
                {[{ v: "yes" as const, l: "Буду" }, { v: "no" as const, l: "Не смогу" }].map(o => (
                  <button key={o.v} onClick={() => setRsvpStatus(o.v)} style={{ flex: 1, padding: 12, fontFamily: "'Raleway',sans-serif", fontSize: 10, letterSpacing: ".25em", textTransform: "uppercase", cursor: "pointer", transition: "all .2s", ...(rsvpStatus === o.v ? btnOn : btnOff) }}>{o.l}</button>
                ))}
              </div>

              {rsvpStatus === "yes" && (<>
                <label style={{ fontFamily: "'Raleway',sans-serif", fontSize: 9, letterSpacing: ".35em", textTransform: "uppercase", color: C.emerald, display: "block", marginBottom: 10 }}>Количество гостей</label>
                <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
                  {["1","2","3","4+"].map(n => (
                    <button key={n} onClick={() => setRsvpCount(n)} style={{ width: 48, height: 48, fontFamily: "'Raleway',sans-serif", fontSize: 14, cursor: "pointer", transition: "all .2s", ...(rsvpCount === n ? btnOn : btnOff) }}>{n}</button>
                  ))}
                </div>

                <label style={{ fontFamily: "'Raleway',sans-serif", fontSize: 9, letterSpacing: ".35em", textTransform: "uppercase", color: C.emerald, display: "block", marginBottom: 10 }}>Нужен ли трансфер?</label>
                <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
                  {[{ v: "yes" as const, l: "Да, нужен" }, { v: "no" as const, l: "Нет, спасибо" }].map(o => (
                    <button key={o.v} onClick={() => setTransfer(o.v)} style={{ flex: 1, padding: 10, fontFamily: "'Raleway',sans-serif", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", cursor: "pointer", transition: "all .2s", ...(transfer === o.v ? btnOn : btnOff) }}>{o.l}</button>
                  ))}
                </div>

                <label style={{ fontFamily: "'Raleway',sans-serif", fontSize: 9, letterSpacing: ".35em", textTransform: "uppercase", color: C.emerald, display: "block", marginBottom: 10 }}>Какой алкоголь предпочитаете?</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
                  {["Вино","Шампанское","Виски","Коньяк","Водка","Пиво","Не пью"].map(o => (
                    <button key={o} onClick={() => toggleAlcohol(o)} style={{ padding: "8px 14px", fontFamily: "'Raleway',sans-serif", fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", cursor: "pointer", transition: "all .2s", ...(alcohol.includes(o) ? btnOn : btnOff) }}>{o}</button>
                  ))}
                </div>

                <label style={{ fontFamily: "'Raleway',sans-serif", fontSize: 9, letterSpacing: ".35em", textTransform: "uppercase", color: C.emerald, display: "block", marginBottom: 10 }}>Будет ли с вами ребёнок?</label>
                <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
                  {[{ v: "yes" as const, l: "Да" }, { v: "no" as const, l: "Нет" }].map(o => (
                    <button key={o.v} onClick={() => setHasChild(o.v)} style={{ flex: 1, padding: 10, fontFamily: "'Raleway',sans-serif", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", cursor: "pointer", transition: "all .2s", ...(hasChild === o.v ? btnOn : btnOff) }}>{o.l}</button>
                  ))}
                </div>
              </>)}

              <button onClick={handleSubmit} disabled={!rsvpName.trim() || rsvpStatus === "idle"}
                style={{ width: "100%", padding: 16, fontFamily: "'Raleway',sans-serif", fontSize: 10, letterSpacing: ".4em", textTransform: "uppercase", background: C.emerald, color: "#fff", border: "none", cursor: "pointer", transition: "background .3s", opacity: (!rsvpName.trim() || rsvpStatus === "idle") ? .3 : 1 }}>
                Отправить ответ
              </button>
            </GoldCard>
          ) : (
            <GoldCard style={{ padding: "56px 40px" }}>
              <div style={{ width: 48, height: 48, border: `1px solid ${C.gold}55`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <Icon name="Check" size={22} style={{ color: C.emerald }} />
              </div>
              <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, color: C.dark, fontWeight: 400, marginBottom: 10 }}>
                {rsvpStatus === "yes" ? "Ждём вас!" : "Жаль, что не придёте"}
              </p>
              <p style={{ fontFamily: "'Raleway',sans-serif", fontSize: 12, color: `${C.dark}44` }}>Спасибо за ответ, {rsvpName}</p>
            </GoldCard>
          )}
        </div>
      </Section>

      {/* ═══ КОНТАКТЫ ═══ */}
      <Section id="contacts" style={{ padding: "96px 24px", backgroundColor: "#fff", borderTop: `1px solid ${C.gold}20`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${BOTANICAL_BG})`, backgroundSize: "cover", backgroundPosition: "center", opacity: .07, pointerEvents: "none" }} />
        <div style={{ maxWidth: 768, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <Label>Контакты</Label>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,5vw,40px)", color: C.dark, fontStyle: "italic", fontWeight: 400, margin: "20px 0 48px" }}>Есть вопросы?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 24 }}>
            {[
              { name: "Вадим", role: "Жених", phone: "+7 (000) 000-00-00", tel: "+70000000000", showMail: false },
              { name: "Ксения", role: "Невеста", phone: "+7 (914) 610-92-11", tel: "+79146109211", showMail: true },
            ].map((c, i) => (
              <GoldCard key={i} style={{ padding: 32 }}>
                <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: C.dark, fontWeight: 400, marginBottom: 4 }}>{c.name}</p>
                <p style={{ fontFamily: "'Raleway',sans-serif", fontSize: 9, color: `${C.emerald}88`, letterSpacing: ".35em", textTransform: "uppercase", marginBottom: 20 }}>{c.role}</p>
                <a href={`tel:${c.tel}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Raleway',sans-serif", fontSize: 13, color: `${C.dark}55`, textDecoration: "none", transition: "color .2s", marginBottom: c.showMail ? 12 : 0, display: "flex" }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.emerald)} onMouseLeave={e => (e.currentTarget.style.color = `${C.dark}55`)}>
                  <Icon name="Phone" size={13} /> {c.phone}
                </a>
                {c.showMail && (
                  <a href="mailto:ksu.matykhina1708@mail.ru" style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'Raleway',sans-serif", fontSize: 11, color: `${C.dark}44`, textDecoration: "none", transition: "color .2s", wordBreak: "break-all" }}
                    onMouseEnter={e => (e.currentTarget.style.color = C.gold)} onMouseLeave={e => (e.currentTarget.style.color = `${C.dark}44`)}>
                    <Icon name="Mail" size={13} /> ksu.matykhina1708@mail.ru
                  </a>
                )}
              </GoldCard>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ padding: "36px 24px", textAlign: "center", borderTop: `1px solid ${C.gold}22`, backgroundColor: C.lightG, position: "relative" }}>
        <div style={{ marginBottom: 8 }}>
          <span style={{ color: `${C.gold}66`, fontSize: 12 }}>✦</span>
        </div>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontStyle: "italic", color: `${C.emerald}44` }}>Вадим & Ксения · 28.08.2026</p>
      </footer>
    </div>
  );
}
