import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/153c976b-95dd-47fc-9d22-8d8cd1c4c698/files/07cc4345-1395-4ec5-9cc5-63807c2e2ba7.jpg";

const schedule = [
  { time: "14:00", title: "Сбор гостей", desc: "Встреча и приветственный фуршет", icon: "Users" },
  { time: "15:00", title: "Церемония", desc: "Торжественная регистрация брака", icon: "Heart" },
  { time: "16:00", title: "Фотосессия", desc: "Совместные фото с молодожёнами", icon: "Camera" },
  { time: "17:00", title: "Банкет", desc: "Праздничный ужин и тосты", icon: "Wine" },
  { time: "19:00", title: "Первый танец", desc: "Танец молодожёнов", icon: "Music" },
  { time: "20:00", title: "Дискотека", desc: "Танцы и веселье до утра", icon: "Sparkles" },
];

function useInView(ref: React.RefObject<Element>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}

function Section({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref as React.RefObject<Element>);
  return (
    <section
      id={id}
      ref={ref}
      className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${className}`}
    >
      {children}
    </section>
  );
}

function Countdown() {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const target = new Date("2025-06-14T14:00:00");
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) { setTime({ d: 0, h: 0, m: 0, s: 0 }); return; }
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex justify-center gap-6 md:gap-10 mt-3">
      {[{ v: time.d, l: "дней" }, { v: time.h, l: "часов" }, { v: time.m, l: "минут" }, { v: time.s, l: "секунд" }].map((t, i) => (
        <div key={i} className="text-center">
          <div className="font-cormorant text-4xl text-white font-light">{String(t.v).padStart(2, "0")}</div>
          <div className="font-montserrat text-[9px] text-white/30 tracking-widest uppercase mt-1">{t.l}</div>
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
    { href: "#rsvp", label: "RSVP" },
    { href: "#contacts", label: "Контакты" },
  ];
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#0a0a0a]/90 backdrop-blur-md shadow-2xl" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="font-cormorant text-2xl text-[#e8c87a] italic tracking-widest">A & M</a>
        <div className="hidden md:flex gap-8">
          {links.map(l => (
            <a key={l.href} href={l.href} className="font-montserrat text-[10px] tracking-[0.2em] text-white/60 hover:text-[#e8c87a] transition-colors uppercase">
              {l.label}
            </a>
          ))}
        </div>
        <button className="md:hidden text-white/60 hover:text-white transition-colors" onClick={() => setOpen(!open)}>
          <Icon name={open ? "X" : "Menu"} size={22} />
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-[#0a0a0a]/97 backdrop-blur-md px-6 pb-6 flex flex-col gap-1">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="font-montserrat text-[10px] tracking-[0.2em] text-white/60 hover:text-[#e8c87a] transition-colors uppercase py-3 border-b border-white/5">
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
  const [submitted, setSubmitted] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => { setTimeout(() => setHeroLoaded(true), 120); }, []);

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen font-montserrat">
      <Nav />

      {/* HERO */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Свадьба" className="w-full h-full object-cover scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/50 via-[#0a0a0a]/20 to-[#0a0a0a]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/40 via-transparent to-[#0a0a0a]/40" />
        </div>
        <div className={`relative z-10 text-center px-6 transition-all duration-1000 delay-100 ${heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <p className="font-montserrat text-[10px] tracking-[0.5em] text-[#e8c87a] uppercase mb-8">Приглашаем на свадьбу</p>
          <h1 className="font-cormorant text-[80px] md:text-[130px] text-white font-light leading-[0.9] mb-6">
            Анна<br />
            <span className="text-[#e8c87a] italic text-5xl md:text-7xl">&</span><br />
            Михаил
          </h1>
          <div className="flex items-center justify-center gap-4 my-8">
            <div className="w-16 h-px bg-[#e8c87a]/40" />
            <span className="font-montserrat text-[10px] tracking-[0.4em] text-white/50 uppercase">14 июня 2025</span>
            <div className="w-16 h-px bg-[#e8c87a]/40" />
          </div>
          <p className="font-montserrat text-[10px] tracking-[0.3em] text-white/40 uppercase mb-10">Москва · Grand Event Hall</p>
          <a
            href="#invitation"
            className="inline-block font-montserrat text-[10px] tracking-[0.3em] uppercase text-white border border-white/25 px-10 py-4 hover:border-[#e8c87a] hover:text-[#e8c87a] transition-all duration-400"
          >
            Открыть приглашение
          </a>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
          <Icon name="ChevronDown" size={18} className="text-white" />
        </div>
      </div>

      {/* ПРИГЛАШЕНИЕ */}
      <Section id="invitation" className="py-32 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <span className="font-montserrat text-[9px] tracking-[0.5em] text-[#e8c87a] uppercase">Приглашение</span>
          <h2 className="font-cormorant text-5xl md:text-6xl text-white font-light mt-6 mb-6 leading-tight">
            Дорогие друзья<br />и близкие
          </h2>
          <div className="w-12 h-px bg-[#e8c87a]/40 mx-auto mb-8" />
          <p className="font-montserrat text-sm text-white/50 leading-8 max-w-lg mx-auto">
            Мы рады пригласить вас разделить с нами один из самых важных и счастливых дней нашей жизни — день нашей свадьбы. Ваше присутствие сделает этот праздник по-настоящему незабываемым.
          </p>
          <p className="font-cormorant text-2xl italic text-[#e8c87a]/70 mt-10">
            С любовью, Анна и Михаил ♡
          </p>
        </div>
      </Section>

      {/* ДАТА И ВРЕМЯ */}
      <Section id="datetime" className="py-24 px-6 bg-white/[0.015]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-montserrat text-[9px] tracking-[0.5em] text-[#e8c87a] uppercase">Дата и время</span>
          </div>
          <div className="grid grid-cols-3 border border-white/10 mb-10">
            {[
              { value: "14", label: "Июня" },
              { value: "2025", label: "Года" },
              { value: "14:00", label: "Начало" },
            ].map((item, i) => (
              <div key={i} className={`text-center py-10 ${i < 2 ? "border-r border-white/10" : ""}`}>
                <div className="font-cormorant text-5xl md:text-6xl text-white font-light mb-3">{item.value}</div>
                <div className="font-montserrat text-[9px] tracking-[0.3em] text-white/30 uppercase">{item.label}</div>
              </div>
            ))}
          </div>
          <div className="border border-white/10 p-8 text-center">
            <p className="font-montserrat text-[9px] tracking-[0.3em] text-white/30 uppercase mb-4">До свадьбы</p>
            <Countdown />
          </div>
        </div>
      </Section>

      {/* МЕСТО */}
      <Section id="venue" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-montserrat text-[9px] tracking-[0.5em] text-[#e8c87a] uppercase">Место проведения</span>
          </div>
          <div className="grid md:grid-cols-5 border border-white/10">
            <div className="md:col-span-3 p-10 md:border-r border-white/10 border-b md:border-b-0">
              <Icon name="MapPin" size={18} className="text-[#e8c87a] mb-6" />
              <h3 className="font-cormorant text-3xl text-white font-light mb-4">Grand Event Hall</h3>
              <p className="font-montserrat text-sm text-white/40 leading-7 mb-8">
                г. Москва, ул. Тверская, д. 15<br />
                Банкетный зал «Золотой», 2-й этаж
              </p>
              <a href="#" className="inline-flex items-center gap-2 font-montserrat text-[10px] tracking-[0.2em] uppercase text-[#e8c87a] hover:text-white transition-colors border-b border-[#e8c87a]/30 pb-1">
                Открыть маршрут
                <Icon name="ArrowRight" size={12} />
              </a>
            </div>
            <div className="md:col-span-2 min-h-[200px] bg-gradient-to-br from-white/5 to-white/[0.02] flex items-center justify-center">
              <div className="text-center">
                <Icon name="Map" size={36} className="text-white/15 mb-3 mx-auto" />
                <p className="font-montserrat text-[9px] text-white/20 tracking-widest uppercase">Карта</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ГРАФИК МЕРОПРИЯТИЙ */}
      <Section id="schedule" className="py-24 px-6 bg-white/[0.015]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-4">
            <span className="font-montserrat text-[9px] tracking-[0.5em] text-[#e8c87a] uppercase">График мероприятий</span>
          </div>
          <h2 className="font-cormorant text-4xl text-center text-white font-light mb-16">Программа дня</h2>
          <div className="relative">
            <div className="absolute left-[52px] top-4 bottom-4 w-px bg-gradient-to-b from-[#e8c87a]/30 via-[#e8c87a]/10 to-transparent" />
            {schedule.map((item, i) => (
              <div key={i} className="relative flex items-start gap-6 mb-10 last:mb-0 group">
                <div className="w-[44px] text-right flex-shrink-0 pt-1">
                  <span className="font-montserrat text-[10px] text-[#e8c87a] tracking-wider">{item.time}</span>
                </div>
                <div className="relative z-10 w-[16px] h-[16px] flex-shrink-0 mt-1 border border-[#e8c87a]/40 bg-[#0a0a0a] flex items-center justify-center group-hover:border-[#e8c87a] group-hover:bg-[#e8c87a]/10 transition-all duration-300">
                  <div className="w-[5px] h-[5px] bg-[#e8c87a]/60 group-hover:bg-[#e8c87a] transition-colors" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <Icon name={item.icon} size={14} className="text-[#e8c87a]/60" />
                    <h4 className="font-cormorant text-xl text-white font-light">{item.title}</h4>
                  </div>
                  <p className="font-montserrat text-xs text-white/35 ml-[22px]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* RSVP */}
      <Section id="rsvp" className="py-24 px-6">
        <div className="max-w-xl mx-auto text-center">
          <span className="font-montserrat text-[9px] tracking-[0.5em] text-[#e8c87a] uppercase">Подтверждение участия</span>
          <h2 className="font-cormorant text-5xl text-white font-light mt-6 mb-3">Вы придёте?</h2>
          <p className="font-montserrat text-[10px] text-white/30 mb-12 tracking-wide">Просим ответить до 1 мая 2025</p>

          {!submitted ? (
            <div className="border border-white/10 p-8 md:p-10 text-left">
              <input
                type="text"
                value={rsvpName}
                onChange={e => setRsvpName(e.target.value)}
                placeholder="Ваше имя"
                className="w-full bg-transparent border-b border-white/15 pb-3 mb-8 font-montserrat text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#e8c87a] transition-colors"
              />
              <div className="flex gap-3 mb-8">
                <button
                  onClick={() => setRsvpStatus("yes")}
                  className={`flex-1 py-3 font-montserrat text-[10px] tracking-[0.25em] uppercase transition-all duration-300 ${rsvpStatus === "yes" ? "bg-[#e8c87a] text-[#0a0a0a] font-medium" : "border border-white/15 text-white/50 hover:border-[#e8c87a]/50 hover:text-[#e8c87a]"}`}
                >
                  Буду
                </button>
                <button
                  onClick={() => setRsvpStatus("no")}
                  className={`flex-1 py-3 font-montserrat text-[10px] tracking-[0.25em] uppercase transition-all duration-300 ${rsvpStatus === "no" ? "bg-white/15 text-white border border-white/30" : "border border-white/15 text-white/50 hover:border-white/30 hover:text-white/70"}`}
                >
                  Не смогу
                </button>
              </div>
              {rsvpStatus === "yes" && (
                <div className="mb-8">
                  <label className="font-montserrat text-[9px] text-white/30 tracking-widest uppercase block mb-4">Количество гостей</label>
                  <div className="flex gap-3">
                    {["1", "2", "3", "4+"].map(n => (
                      <button
                        key={n}
                        onClick={() => setRsvpCount(n)}
                        className={`w-12 h-12 font-montserrat text-sm transition-all duration-200 ${rsvpCount === n ? "bg-[#e8c87a] text-[#0a0a0a] font-medium" : "border border-white/15 text-white/50 hover:border-[#e8c87a]/40"}`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <button
                onClick={() => { if (rsvpName.trim() && rsvpStatus !== "idle") setSubmitted(true); }}
                disabled={!rsvpName.trim() || rsvpStatus === "idle"}
                className="w-full py-4 font-montserrat text-[10px] tracking-[0.35em] uppercase bg-[#e8c87a] text-[#0a0a0a] hover:bg-[#d4b060] transition-colors duration-300 font-medium disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Отправить ответ
              </button>
            </div>
          ) : (
            <div className="border border-[#e8c87a]/25 p-12 bg-[#e8c87a]/5">
              <div className="w-12 h-12 border border-[#e8c87a]/40 flex items-center justify-center mx-auto mb-6">
                <Icon name="Check" size={22} className="text-[#e8c87a]" />
              </div>
              <p className="font-cormorant text-3xl text-white font-light mb-3">
                {rsvpStatus === "yes" ? "Ждём вас!" : "Жаль, что не придёте"}
              </p>
              <p className="font-montserrat text-xs text-white/30">Спасибо за ответ, {rsvpName}</p>
            </div>
          )}
        </div>
      </Section>

      {/* КОНТАКТЫ */}
      <Section id="contacts" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <span className="font-montserrat text-[9px] tracking-[0.5em] text-[#e8c87a] uppercase">Контакты</span>
          <h2 className="font-cormorant text-4xl text-white font-light mt-6 mb-14">Есть вопросы?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: "Анна", role: "Невеста", phone: "+7 (999) 123-45-67" },
              { name: "Михаил", role: "Жених", phone: "+7 (999) 765-43-21" },
            ].map((c, i) => (
              <div key={i} className="border border-white/10 p-8 hover:border-[#e8c87a]/30 transition-all duration-300 group">
                <p className="font-cormorant text-2xl text-white font-light mb-1">{c.name}</p>
                <p className="font-montserrat text-[9px] text-[#e8c87a]/50 tracking-[0.3em] uppercase mb-6">{c.role}</p>
                <a href={`tel:${c.phone}`} className="inline-flex items-center gap-2 font-montserrat text-sm text-white/40 group-hover:text-[#e8c87a] transition-colors duration-300">
                  <Icon name="Phone" size={13} />
                  {c.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="py-10 text-center border-t border-white/5">
        <p className="font-cormorant text-xl text-white/15 italic">Анна & Михаил · 2025</p>
      </footer>

      <style>{`
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
      `}</style>
    </div>
  );
}
