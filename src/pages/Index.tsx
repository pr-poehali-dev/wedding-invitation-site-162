import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/153c976b-95dd-47fc-9d22-8d8cd1c4c698/files/07cc4345-1395-4ec5-9cc5-63807c2e2ba7.jpg";
const BOTANICAL_BG = "https://cdn.poehali.dev/projects/153c976b-95dd-47fc-9d22-8d8cd1c4c698/files/15e930dc-3acd-4c51-9696-dd7ea20b6372.jpg";

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

function useInView(ref: React.RefObject<Element>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}

function Section({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref as React.RefObject<Element>);
  return (
    <section id={id} ref={ref} className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${className}`}>
      {children}
    </section>
  );
}

function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-7">
      <div className="w-16 h-px" style={{ background: "linear-gradient(to right, transparent, #c9a84c80)" }} />
      <span style={{ color: "#c9a84c", fontSize: "12px" }}>✦</span>
      <div className="w-8 h-px" style={{ background: "#c9a84c50" }} />
      <span style={{ color: "#c9a84c", fontSize: "8px" }}>✦</span>
      <div className="w-16 h-px" style={{ background: "linear-gradient(to left, transparent, #c9a84c80)" }} />
    </div>
  );
}

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "9px", letterSpacing: "0.55em", textTransform: "uppercase", color: light ? "#c9a84c" : "#c9a84c" }}>
      {children}
    </span>
  );
}

function Countdown() {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const target = new Date("2026-08-28T13:30:00");
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) { setTime({ d: 0, h: 0, m: 0, s: 0 }); return; }
      setTime({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);
  return (
    <div className="flex justify-center gap-8 md:gap-14 mt-4">
      {[{ v: time.d, l: "дней" }, { v: time.h, l: "часов" }, { v: time.m, l: "минут" }, { v: time.s, l: "секунд" }].map((t, i) => (
        <div key={i} className="text-center">
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,5vw,48px)", color: "#1a3d2b", fontWeight: 400 }}>{String(t.v).padStart(2, "0")}</div>
          <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: "9px", color: "#2d6a4f80", letterSpacing: "0.3em", textTransform: "uppercase", marginTop: "6px" }}>{t.l}</div>
        </div>
      ))}
    </div>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = [
    { href: "#invitation", label: "Приглашение" },
    { href: "#datetime", label: "Дата" },
    { href: "#venue", label: "Место" },
    { href: "#schedule", label: "График" },
    { href: "#dresscode", label: "Дресс-код" },
    { href: "#rsvp", label: "RSVP" },
    { href: "#contacts", label: "Контакты" },
  ];
  const navBg = scrolled ? "rgba(255,255,255,0.96)" : "transparent";
  const linkColor = scrolled ? "rgba(26,61,43,0.55)" : "rgba(255,255,255,0.7)";
  const linkHover = scrolled ? "#2d6a4f" : "#fff";
  const logoColor = scrolled ? "#2d6a4f" : "#fff";
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: navBg, backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? "1px solid rgba(45,106,79,0.1)" : "none", transition: "all 0.5s" }}>
      <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="#" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontStyle: "italic", letterSpacing: "0.15em", color: logoColor, textDecoration: "none" }}>В & К</a>
        <div className="hidden lg:flex" style={{ gap: "28px" }}>
          {links.map(l => (
            <a key={l.href} href={l.href} className="nav-link" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", color: linkColor, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = linkHover)} onMouseLeave={e => (e.currentTarget.style.color = linkColor)}>
              {l.label}
            </a>
          ))}
        </div>
        <button className="lg:hidden" style={{ background: "none", border: "none", cursor: "pointer", color: linkColor }} onClick={() => setOpen(!open)}>
          <Icon name={open ? "X" : "Menu"} size={22} />
        </button>
      </div>
      {open && (
        <div style={{ background: "rgba(255,255,255,0.98)", padding: "0 24px 24px", borderTop: "1px solid rgba(45,106,79,0.08)" }}>
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ display: "block", fontFamily: "'Raleway', sans-serif", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(26,61,43,0.55)", padding: "12px 0", borderBottom: "1px solid rgba(45,106,79,0.06)", textDecoration: "none" }}>
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

export default function Index() {
  const [rsvpStatus, setRsvpStatus] = useState<"idle" | "yes" | "no">("idle");
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpCount, setRsvpCount] = useState("1");
  const [transfer, setTransfer] = useState<"yes" | "no" | "">("");
  const [alcohol, setAlcohol] = useState<string[]>([]);
  const [hasChild, setHasChild] = useState<"yes" | "no" | "">("");
  const [submitted, setSubmitted] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setHeroLoaded(true), 120); }, []);
  const toggleAlcohol = (val: string) => setAlcohol(prev => prev.includes(val) ? prev.filter(a => a !== val) : [...prev, val]);

  const emerald = "#2d6a4f";
  const darkGreen = "#1a3d2b";
  const gold = "#c9a84c";
  const cream = "#fafaf7";
  const lightGreen = "#f0f5ef";

  const btnActive = { background: emerald, color: "#fff", border: `1px solid ${emerald}` };
  const btnInactive = { background: "transparent", color: "rgba(26,61,43,0.45)", border: "1px solid rgba(45,106,79,0.2)" };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: cream, color: darkGreen, fontFamily: "'Raleway', sans-serif" }}>
      <Nav />

      {/* HERO */}
      <div style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <img src={HERO_IMAGE} alt="Свадьба" style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.05)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,28,18,0.52) 0%, rgba(10,28,18,0.2) 50%, rgba(10,28,18,0.88) 100%)" }} />
        </div>
        {/* botanical overlays */}
        <img src={BOTANICAL_BG} alt="" style={{ position: "absolute", top: 0, left: 0, width: "280px", opacity: 0.18, pointerEvents: "none", objectFit: "cover" }} />
        <img src={BOTANICAL_BG} alt="" style={{ position: "absolute", top: 0, right: 0, width: "280px", opacity: 0.18, pointerEvents: "none", objectFit: "cover", transform: "scaleX(-1)" }} />

        <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 24px", transition: "all 1s", opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? "none" : "translateY(48px)" }}>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "10px", letterSpacing: "0.6em", textTransform: "uppercase", color: "#a8d5b5", marginBottom: "32px" }}>Приглашаем на свадьбу</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(64px, 11vw, 120px)", color: "#fff", fontWeight: 400, lineHeight: 0.9, marginBottom: "16px" }}>
            Вадим<br />
            <em style={{ fontStyle: "italic", color: gold, fontSize: "0.48em", letterSpacing: "0.12em" }}>и</em><br />
            Ксения
          </h1>
          <GoldDivider />
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "10px", letterSpacing: "0.42em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: "8px" }}>28 августа 2026</p>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.32)", marginBottom: "40px" }}>г. Благовещенск · Амурская область</p>
          <a href="#invitation" style={{ display: "inline-block", fontFamily: "'Raleway', sans-serif", fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", padding: "16px 40px", textDecoration: "none", transition: "all 0.3s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = gold; e.currentTarget.style.color = gold; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.color = "#fff"; }}>
            Открыть приглашение
          </a>
        </div>
        <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", opacity: 0.4, animation: "bounce 1.5s infinite" }}>
          <Icon name="ChevronDown" size={18} className="text-white" />
        </div>
      </div>

      {/* ПРИГЛАШЕНИЕ */}
      <Section id="invitation" className="relative overflow-hidden" style={{ padding: "120px 24px", backgroundColor: "#fff" }}>
        <img src={BOTANICAL_BG} alt="" style={{ position: "absolute", top: 0, left: 0, width: "300px", opacity: 0.22, pointerEvents: "none" }} />
        <img src={BOTANICAL_BG} alt="" style={{ position: "absolute", bottom: 0, right: 0, width: "300px", opacity: 0.22, pointerEvents: "none", transform: "scaleX(-1) scaleY(-1)" }} />
        <div style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center", position: "relative" }}>
          <SectionLabel>Приглашение</SectionLabel>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px,6vw,56px)", color: darkGreen, fontWeight: 400, margin: "24px 0 12px", lineHeight: 1.2 }}>
            Дорогие друзья<br /><em>и близкие</em>
          </h2>
          <GoldDivider />
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "14px", color: "rgba(26,61,43,0.6)", lineHeight: 2, maxWidth: "480px", margin: "0 auto" }}>
            Мы рады пригласить вас разделить с нами один из самых важных и счастливых дней нашей жизни — день нашей свадьбы. Ваше присутствие сделает этот праздник по-настоящему незабываемым.
          </p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontStyle: "italic", color: emerald, marginTop: "40px" }}>
            С любовью, Вадим и Ксения ♡
          </p>
        </div>
      </Section>

      {/* ДАТА И ВРЕМЯ */}
      <Section id="datetime" className="relative overflow-hidden" style={{ padding: "96px 24px", backgroundColor: lightGreen }}>
        <img src={BOTANICAL_BG} alt="" style={{ position: "absolute", right: 0, top: 0, height: "100%", width: "280px", opacity: 0.18, pointerEvents: "none", objectFit: "cover" }} />
        <div style={{ maxWidth: "720px", margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}><SectionLabel>Дата и время</SectionLabel></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", border: `1px solid rgba(45,106,79,0.18)`, marginBottom: "32px", backgroundColor: "#fff", boxShadow: "0 2px 20px rgba(45,106,79,0.06)" }}>
            {[{ value: "28", label: "Августа" }, { value: "2026", label: "Года" }, { value: "13:30", label: "Начало" }].map((item, i) => (
              <div key={i} style={{ textAlign: "center", padding: "40px 16px", borderRight: i < 2 ? `1px solid rgba(45,106,79,0.12)` : "none" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(40px,6vw,60px)", color: darkGreen, fontWeight: 400, marginBottom: "12px" }}>{item.value}</div>
                <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: "9px", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(45,106,79,0.4)" }}>{item.label}</div>
              </div>
            ))}
          </div>
          <div style={{ border: `1px solid rgba(201,168,76,0.25)`, padding: "32px", textAlign: "center", backgroundColor: "#fff", boxShadow: "0 2px 20px rgba(201,168,76,0.06)" }}>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "9px", letterSpacing: "0.35em", textTransform: "uppercase", color: gold, marginBottom: "4px" }}>До торжества</p>
            <Countdown />
          </div>
        </div>
      </Section>

      {/* МЕСТО */}
      <Section id="venue" className="relative overflow-hidden" style={{ padding: "96px 24px", backgroundColor: "#fff" }}>
        <img src={BOTANICAL_BG} alt="" style={{ position: "absolute", left: 0, bottom: 0, width: "260px", opacity: 0.18, pointerEvents: "none" }} />
        <div style={{ maxWidth: "896px", margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}><SectionLabel>Место проведения</SectionLabel></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            {[
              { icon: "Heart", label: "Регистрация", title: "Дворец бракосочетания", addr: "г. Благовещенск, Амурская область\nпер. Святителя Иннокентия, 6", maps: "https://yandex.ru/maps/?text=Благовещенск+переулок+Святителя+Иннокентия+6" },
              { icon: "Wine", label: "Банкет", title: "Дом счастливых событий", addr: "г. Благовещенск, Амурская область\nИгнатьевское шоссе, 4 км, 1а", maps: "https://yandex.ru/maps/?text=Благовещенск+Игнатьевское+шоссе+4+километр+1а" },
            ].map((v, i) => (
              <div key={i} style={{ border: `1px solid rgba(45,106,79,0.15)`, padding: "32px", backgroundColor: cream, transition: "border-color 0.3s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(45,106,79,0.15)")}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                  <div style={{ width: "32px", height: "32px", backgroundColor: emerald, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={v.icon} size={13} className="text-white" />
                  </div>
                  <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "9px", letterSpacing: "0.35em", textTransform: "uppercase", color: emerald }}>{v.label}</span>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", color: darkGreen, fontWeight: 400, marginBottom: "12px" }}>{v.title}</h3>
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "12px", color: "rgba(26,61,43,0.5)", lineHeight: 1.8, marginBottom: "24px", whiteSpace: "pre-line" }}>{v.addr}</p>
                <a href={v.maps} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "'Raleway', sans-serif", fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase", color: emerald, textDecoration: "none", borderBottom: `1px solid rgba(45,106,79,0.3)`, paddingBottom: "2px", transition: "color 0.2s, border-color 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.color = gold; e.currentTarget.style.borderColor = gold; }}
                  onMouseLeave={e => { e.currentTarget.style.color = emerald; e.currentTarget.style.borderColor = "rgba(45,106,79,0.3)"; }}>
                  Открыть маршрут <Icon name="ArrowRight" size={11} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ГРАФИК */}
      <Section id="schedule" className="relative overflow-hidden" style={{ padding: "96px 24px", backgroundColor: darkGreen }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${BOTANICAL_BG})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.07, filter: "grayscale(1)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "640px", margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: "12px" }}><SectionLabel>График мероприятий</SectionLabel></div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,5vw,40px)", color: "#fff", fontWeight: 400, textAlign: "center", marginBottom: "12px" }}>Программа дня</h2>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "56px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "40px", height: "1px", background: "rgba(201,168,76,0.4)" }} />
              <span style={{ color: "rgba(201,168,76,0.6)", fontSize: "12px" }}>✦</span>
              <div style={{ width: "40px", height: "1px", background: "rgba(201,168,76,0.4)" }} />
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: "52px", top: "12px", bottom: "12px", width: "1px", background: "linear-gradient(to bottom, rgba(201,168,76,0.4), rgba(125,201,154,0.15), transparent)" }} />
            {schedule.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "24px", marginBottom: i < schedule.length - 1 ? "40px" : 0 }}>
                <div style={{ width: "44px", textAlign: "right", flexShrink: 0, paddingTop: "2px" }}>
                  <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "10px", color: gold, letterSpacing: "0.08em" }}>{item.time}</span>
                </div>
                <div style={{ width: "16px", height: "16px", flexShrink: 0, marginTop: "2px", border: `1px solid rgba(201,168,76,0.45)`, backgroundColor: darkGreen, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
                  <div style={{ width: "5px", height: "5px", backgroundColor: "rgba(201,168,76,0.7)" }} />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                    <Icon name={item.icon} size={13} style={{ color: "rgba(125,201,154,0.65)" }} />
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", color: "#fff", fontWeight: 400 }}>{item.title}</h4>
                  </div>
                  <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.35)", marginLeft: "22px", lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ДРЕСС-КОД */}
      <Section id="dresscode" className="relative overflow-hidden" style={{ padding: "96px 24px", backgroundColor: "#fff" }}>
        <img src={BOTANICAL_BG} alt="" style={{ position: "absolute", right: 0, top: 0, height: "100%", width: "300px", opacity: 0.15, pointerEvents: "none", objectFit: "cover", objectPosition: "left" }} />
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", position: "relative" }}>
          <SectionLabel>Дресс-код</SectionLabel>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,5vw,40px)", color: darkGreen, fontWeight: 400, fontStyle: "italic", margin: "24px 0 8px" }}>Цвета торжества</h2>
          <GoldDivider />
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "12px", color: "rgba(26,61,43,0.5)", lineHeight: 1.9, maxWidth: "460px", margin: "0 auto 48px" }}>
            Просим придерживаться цветовой палитры праздника — это создаст красивое общее фото и гармоничную атмосферу.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "20px" }}>
            {FABRIC_IMAGES.map((c, i) => (
              <div key={i} style={{ cursor: "default" }}>
                <div style={{ position: "relative", overflow: "hidden", aspectRatio: "3/4", marginBottom: "12px", boxShadow: "0 4px 24px rgba(0,0,0,0.1)", transition: "box-shadow 0.3s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 40px rgba(0,0,0,0.18)"; (e.currentTarget.querySelector("img") as HTMLElement).style.transform = "scale(1.06)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.1)"; (e.currentTarget.querySelector("img") as HTMLElement).style.transform = "scale(1)"; }}>
                  <img src={c.img} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.25), transparent)" }} />
                </div>
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "10px", color: "rgba(26,61,43,0.65)", letterSpacing: "0.08em" }}>{c.name}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "48px", border: `1px solid rgba(201,168,76,0.25)`, padding: "24px", backgroundColor: "#fdf9f0" }}>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "12px", color: "rgba(26,61,43,0.5)", lineHeight: 1.9 }}>
              Пожалуйста, избегайте <strong style={{ color: "rgba(26,61,43,0.7)" }}>белого</strong> и <strong style={{ color: "rgba(26,61,43,0.7)" }}>чёрного</strong> цветов в нарядах.<br />
              Будем рады, если вы поддержите нашу палитру!
            </p>
          </div>
        </div>
      </Section>

      {/* RSVP */}
      <Section id="rsvp" className="relative overflow-hidden" style={{ padding: "96px 24px", backgroundColor: lightGreen }}>
        <img src={BOTANICAL_BG} alt="" style={{ position: "absolute", left: 0, top: 0, width: "280px", opacity: 0.2, pointerEvents: "none" }} />
        <div style={{ maxWidth: "560px", margin: "0 auto", textAlign: "center", position: "relative" }}>
          <SectionLabel>Подтверждение участия</SectionLabel>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px,6vw,52px)", color: darkGreen, fontWeight: 400, margin: "24px 0 8px" }}>Вы придёте?</h2>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "10px", color: "rgba(26,61,43,0.4)", marginBottom: "48px", letterSpacing: "0.08em" }}>Просим ответить до 1 июля 2026</p>

          {!submitted ? (
            <div style={{ border: `1px solid rgba(45,106,79,0.16)`, padding: "40px", textAlign: "left", backgroundColor: "#fff", boxShadow: "0 4px 24px rgba(45,106,79,0.06)" }}>
              {/* Имя */}
              <label style={{ fontFamily: "'Raleway', sans-serif", fontSize: "9px", letterSpacing: "0.35em", textTransform: "uppercase", color: emerald, display: "block", marginBottom: "8px" }}>Ваше имя</label>
              <input type="text" value={rsvpName} onChange={e => setRsvpName(e.target.value)} placeholder="Имя и фамилия"
                style={{ width: "100%", background: "transparent", border: "none", borderBottom: `1px solid rgba(45,106,79,0.18)`, paddingBottom: "12px", marginBottom: "32px", fontFamily: "'Raleway', sans-serif", fontSize: "14px", color: darkGreen, outline: "none", boxSizing: "border-box" }} />

              {/* Придёте? */}
              <label style={{ fontFamily: "'Raleway', sans-serif", fontSize: "9px", letterSpacing: "0.35em", textTransform: "uppercase", color: emerald, display: "block", marginBottom: "12px" }}>Подтверждение</label>
              <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
                {[{ v: "yes" as const, l: "Буду" }, { v: "no" as const, l: "Не смогу" }].map(opt => (
                  <button key={opt.v} onClick={() => setRsvpStatus(opt.v)}
                    style={{ flex: 1, padding: "12px", fontFamily: "'Raleway', sans-serif", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s", ...(rsvpStatus === opt.v ? btnActive : btnInactive) }}>
                    {opt.l}
                  </button>
                ))}
              </div>

              {rsvpStatus === "yes" && (<>
                {/* Кол-во гостей */}
                <label style={{ fontFamily: "'Raleway', sans-serif", fontSize: "9px", letterSpacing: "0.35em", textTransform: "uppercase", color: emerald, display: "block", marginBottom: "12px" }}>Количество гостей</label>
                <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
                  {["1", "2", "3", "4+"].map(n => (
                    <button key={n} onClick={() => setRsvpCount(n)}
                      style={{ width: "48px", height: "48px", fontFamily: "'Raleway', sans-serif", fontSize: "14px", cursor: "pointer", transition: "all 0.2s", ...(rsvpCount === n ? btnActive : btnInactive) }}>
                      {n}
                    </button>
                  ))}
                </div>

                {/* Трансфер */}
                <label style={{ fontFamily: "'Raleway', sans-serif", fontSize: "9px", letterSpacing: "0.35em", textTransform: "uppercase", color: emerald, display: "block", marginBottom: "12px" }}>Нужен ли трансфер?</label>
                <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
                  {[{ v: "yes" as const, l: "Да, нужен" }, { v: "no" as const, l: "Нет, спасибо" }].map(opt => (
                    <button key={opt.v} onClick={() => setTransfer(opt.v)}
                      style={{ flex: 1, padding: "10px", fontFamily: "'Raleway', sans-serif", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s", ...(transfer === opt.v ? btnActive : btnInactive) }}>
                      {opt.l}
                    </button>
                  ))}
                </div>

                {/* Алкоголь */}
                <label style={{ fontFamily: "'Raleway', sans-serif", fontSize: "9px", letterSpacing: "0.35em", textTransform: "uppercase", color: emerald, display: "block", marginBottom: "12px" }}>Какой алкоголь предпочитаете?</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "32px" }}>
                  {["Вино", "Шампанское", "Виски", "Коньяк", "Водка", "Пиво", "Не пью"].map(opt => (
                    <button key={opt} onClick={() => toggleAlcohol(opt)}
                      style={{ padding: "8px 16px", fontFamily: "'Raleway', sans-serif", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s", ...(alcohol.includes(opt) ? btnActive : btnInactive) }}>
                      {opt}
                    </button>
                  ))}
                </div>

                {/* Ребёнок */}
                <label style={{ fontFamily: "'Raleway', sans-serif", fontSize: "9px", letterSpacing: "0.35em", textTransform: "uppercase", color: emerald, display: "block", marginBottom: "12px" }}>Будет ли с вами ребёнок?</label>
                <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
                  {[{ v: "yes" as const, l: "Да" }, { v: "no" as const, l: "Нет" }].map(opt => (
                    <button key={opt.v} onClick={() => setHasChild(opt.v)}
                      style={{ flex: 1, padding: "10px", fontFamily: "'Raleway', sans-serif", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s", ...(hasChild === opt.v ? btnActive : btnInactive) }}>
                      {opt.l}
                    </button>
                  ))}
                </div>
              </>)}

              <button onClick={() => { if (rsvpName.trim() && rsvpStatus !== "idle") setSubmitted(true); }}
                disabled={!rsvpName.trim() || rsvpStatus === "idle"}
                style={{ width: "100%", padding: "16px", fontFamily: "'Raleway', sans-serif", fontSize: "10px", letterSpacing: "0.4em", textTransform: "uppercase", background: emerald, color: "#fff", border: "none", cursor: "pointer", transition: "background 0.3s", opacity: (!rsvpName.trim() || rsvpStatus === "idle") ? 0.3 : 1 }}>
                Отправить ответ
              </button>
            </div>
          ) : (
            <div style={{ border: `1px solid rgba(201,168,76,0.3)`, padding: "64px 40px", backgroundColor: "#fff", boxShadow: "0 4px 24px rgba(201,168,76,0.06)" }}>
              <div style={{ width: "48px", height: "48px", border: `1px solid rgba(201,168,76,0.45)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <Icon name="Check" size={22} style={{ color: emerald }} />
              </div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", color: darkGreen, fontWeight: 400, marginBottom: "12px" }}>{rsvpStatus === "yes" ? "Ждём вас!" : "Жаль, что не придёте"}</p>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "12px", color: "rgba(26,61,43,0.35)" }}>Спасибо за ответ, {rsvpName}</p>
            </div>
          )}
        </div>
      </Section>

      {/* КОНТАКТЫ */}
      <Section id="contacts" className="relative overflow-hidden" style={{ padding: "96px 24px", backgroundColor: "#fff", borderTop: `1px solid rgba(45,106,79,0.1)` }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${BOTANICAL_BG})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.08, pointerEvents: "none" }} />
        <div style={{ maxWidth: "768px", margin: "0 auto", textAlign: "center", position: "relative" }}>
          <SectionLabel>Контакты</SectionLabel>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,5vw,40px)", color: darkGreen, fontStyle: "italic", fontWeight: 400, margin: "24px 0 56px" }}>Есть вопросы?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
            {[{ name: "Вадим", role: "Жених", phone: "+7 (000) 000-00-00" }, { name: "Ксения", role: "Невеста", phone: "+7 (000) 000-00-00" }].map((c, i) => (
              <div key={i} style={{ border: `1px solid rgba(45,106,79,0.15)`, padding: "32px", backgroundColor: cream, transition: "border-color 0.3s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.45)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(45,106,79,0.15)")}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", color: darkGreen, fontWeight: 400, marginBottom: "4px" }}>{c.name}</p>
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "9px", color: "rgba(45,106,79,0.55)", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: "24px" }}>{c.role}</p>
                <a href={`tel:${c.phone}`} style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "'Raleway', sans-serif", fontSize: "13px", color: "rgba(26,61,43,0.4)", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = emerald)} onMouseLeave={e => (e.currentTarget.style.color = "rgba(26,61,43,0.4)")}>
                  <Icon name="Phone" size={13} /> {c.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer style={{ padding: "40px 24px", textAlign: "center", borderTop: `1px solid rgba(45,106,79,0.1)`, backgroundColor: lightGreen }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontStyle: "italic", color: "rgba(45,106,79,0.3)" }}>Вадим & Ксения · 28.08.2026</p>
      </footer>
    </div>
  );
}
