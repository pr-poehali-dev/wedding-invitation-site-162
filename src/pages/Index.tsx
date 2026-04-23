import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/153c976b-95dd-47fc-9d22-8d8cd1c4c698/files/07cc4345-1395-4ec5-9cc5-63807c2e2ba7.jpg";

const schedule = [
  { time: "13:30", title: "Сбор гостей", desc: "Дворец бракосочетания", icon: "Users" },
  { time: "13:45", title: "Регистрация брака", desc: "ЗАГС, г. Благовещенск, пер. Святителя Иннокентия, 6", icon: "Heart" },
  { time: "14:30", title: "Фотосессия", desc: "Совместные фото с молодожёнами", icon: "Camera" },
  { time: "17:00", title: "Свадебный банкет", desc: "Игнатьевское шоссе, 4 км, 1а · Ресторан «Дом счастливых событий»", icon: "Wine" },
  { time: "23:00", title: "Завершение", desc: "Окончание праздничного вечера", icon: "Moon" },
];

const dresscodeColors = [
  { name: "Изумрудный", hex: "#2d6a4f" },
  { name: "Бежевый", hex: "#d4b896" },
  { name: "Молочный шоколад", hex: "#7b4f31" },
  { name: "Голубой", hex: "#a8c8e8" },
];

function useInView(ref: React.RefObject<Element>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.1 });
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
    const target = new Date("2026-08-28T13:30:00");
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
          <div className="font-cormorant text-4xl text-[#1a3d2b] font-light">{String(t.v).padStart(2, "0")}</div>
          <div className="font-montserrat text-[9px] text-[#1a3d2b]/40 tracking-widest uppercase mt-1">{t.l}</div>
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
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-[#2d6a4f]/10" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="font-cormorant text-2xl text-[#2d6a4f] italic tracking-widest">В & К</a>
        <div className="hidden md:flex gap-7">
          {links.map(l => (
            <a key={l.href} href={l.href} className={`font-montserrat text-[10px] tracking-[0.18em] uppercase transition-colors ${scrolled ? "text-[#1a3d2b]/60 hover:text-[#2d6a4f]" : "text-white/70 hover:text-white"}`}>
              {l.label}
            </a>
          ))}
        </div>
        <button className={`md:hidden transition-colors ${scrolled ? "text-[#1a3d2b]/60" : "text-white/70"}`} onClick={() => setOpen(!open)}>
          <Icon name={open ? "X" : "Menu"} size={22} />
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-white/98 backdrop-blur-md px-6 pb-6 flex flex-col gap-1 border-t border-[#2d6a4f]/10">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="font-montserrat text-[10px] tracking-[0.2em] text-[#1a3d2b]/60 hover:text-[#2d6a4f] transition-colors uppercase py-3 border-b border-[#2d6a4f]/8">
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

  const toggleAlcohol = (val: string) => {
    setAlcohol(prev => prev.includes(val) ? prev.filter(a => a !== val) : [...prev, val]);
  };

  return (
    <div className="bg-[#f7f5f0] text-[#1a3d2b] min-h-screen font-montserrat">
      <Nav />

      {/* HERO */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Свадьба" className="w-full h-full object-cover scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d1f16]/55 via-[#0d1f16]/25 to-[#0d1f16]/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d1f16]/30 via-transparent to-[#0d1f16]/30" />
        </div>
        <div className={`relative z-10 text-center px-6 transition-all duration-1000 delay-100 ${heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <p className="font-montserrat text-[10px] tracking-[0.55em] text-[#a8d5b5] uppercase mb-8">Приглашаем на свадьбу</p>
          <h1 className="font-cormorant text-[80px] md:text-[130px] text-white font-light leading-[0.9] mb-6">
            Вадим<br />
            <span className="text-[#7dc99a] italic text-5xl md:text-7xl">&</span><br />
            Ксения
          </h1>
          <div className="flex items-center justify-center gap-4 my-8">
            <div className="w-16 h-px bg-[#7dc99a]/50" />
            <span className="font-montserrat text-[10px] tracking-[0.4em] text-white/60 uppercase">28 августа 2026</span>
            <div className="w-16 h-px bg-[#7dc99a]/50" />
          </div>
          <p className="font-montserrat text-[10px] tracking-[0.3em] text-white/40 uppercase mb-10">г. Благовещенск</p>
          <a
            href="#invitation"
            className="inline-block font-montserrat text-[10px] tracking-[0.3em] uppercase text-white border border-white/30 px-10 py-4 hover:border-[#7dc99a] hover:text-[#7dc99a] transition-all duration-300"
          >
            Открыть приглашение
          </a>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
          <Icon name="ChevronDown" size={18} className="text-white" />
        </div>
      </div>

      {/* ПРИГЛАШЕНИЕ */}
      <Section id="invitation" className="py-32 px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <span className="font-montserrat text-[9px] tracking-[0.5em] text-[#2d6a4f] uppercase">Приглашение</span>
          <h2 className="font-cormorant text-5xl md:text-6xl text-[#1a3d2b] font-light mt-6 mb-6 leading-tight">
            Дорогие друзья<br />и близкие
          </h2>
          <div className="w-12 h-px bg-[#2d6a4f]/30 mx-auto mb-8" />
          <p className="font-montserrat text-sm text-[#1a3d2b]/55 leading-8 max-w-lg mx-auto">
            Мы рады пригласить вас разделить с нами один из самых важных и счастливых дней нашей жизни — день нашей свадьбы. Ваше присутствие сделает этот праздник по-настоящему незабываемым.
          </p>
          <p className="font-cormorant text-2xl italic text-[#2d6a4f] mt-10">
            С любовью, Вадим и Ксения ♡
          </p>
        </div>
      </Section>

      {/* ДАТА И ВРЕМЯ */}
      <Section id="datetime" className="py-24 px-6 bg-[#f7f5f0]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-montserrat text-[9px] tracking-[0.5em] text-[#2d6a4f] uppercase">Дата и время</span>
          </div>
          <div className="grid grid-cols-3 border border-[#2d6a4f]/20 mb-10 bg-white">
            {[
              { value: "28", label: "Августа" },
              { value: "2026", label: "Года" },
              { value: "13:30", label: "Начало" },
            ].map((item, i) => (
              <div key={i} className={`text-center py-10 ${i < 2 ? "border-r border-[#2d6a4f]/15" : ""}`}>
                <div className="font-cormorant text-5xl md:text-6xl text-[#1a3d2b] font-light mb-3">{item.value}</div>
                <div className="font-montserrat text-[9px] tracking-[0.3em] text-[#1a3d2b]/35 uppercase">{item.label}</div>
              </div>
            ))}
          </div>
          <div className="border border-[#2d6a4f]/20 p-8 text-center bg-white">
            <p className="font-montserrat text-[9px] tracking-[0.3em] text-[#1a3d2b]/35 uppercase mb-4">До свадьбы</p>
            <Countdown />
          </div>
        </div>
      </Section>

      {/* МЕСТО */}
      <Section id="venue" className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-montserrat text-[9px] tracking-[0.5em] text-[#2d6a4f] uppercase">Место проведения</span>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* ЗАГС */}
            <div className="border border-[#2d6a4f]/20 p-8 bg-[#f7f5f0]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-[#2d6a4f] flex items-center justify-center flex-shrink-0">
                  <Icon name="Heart" size={14} className="text-white" />
                </div>
                <span className="font-montserrat text-[10px] tracking-[0.3em] text-[#2d6a4f] uppercase">Регистрация</span>
              </div>
              <h3 className="font-cormorant text-2xl text-[#1a3d2b] font-light mb-3">Дворец бракосочетания</h3>
              <p className="font-montserrat text-xs text-[#1a3d2b]/50 leading-6 mb-6">
                г. Благовещенск<br />пер. Святителя Иннокентия, 6
              </p>
              <a href="https://maps.yandex.ru/?text=Благовещенск+пер+Святителя+Иннокентия+6" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-montserrat text-[10px] tracking-[0.2em] uppercase text-[#2d6a4f] border-b border-[#2d6a4f]/30 pb-0.5 hover:border-[#2d6a4f] transition-colors">
                Маршрут <Icon name="ArrowRight" size={11} />
              </a>
            </div>
            {/* Банкет */}
            <div className="border border-[#2d6a4f]/20 p-8 bg-[#f7f5f0]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-[#2d6a4f] flex items-center justify-center flex-shrink-0">
                  <Icon name="Wine" size={14} className="text-white" />
                </div>
                <span className="font-montserrat text-[10px] tracking-[0.3em] text-[#2d6a4f] uppercase">Банкет</span>
              </div>
              <h3 className="font-cormorant text-2xl text-[#1a3d2b] font-light mb-3">Дом счастливых событий</h3>
              <p className="font-montserrat text-xs text-[#1a3d2b]/50 leading-6 mb-6">
                Игнатьевское шоссе<br />4 километр, 1а
              </p>
              <a href="https://maps.yandex.ru/?text=Благовещенск+Игнатьевское+шоссе+4км+1а" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-montserrat text-[10px] tracking-[0.2em] uppercase text-[#2d6a4f] border-b border-[#2d6a4f]/30 pb-0.5 hover:border-[#2d6a4f] transition-colors">
                Маршрут <Icon name="ArrowRight" size={11} />
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* ГРАФИК МЕРОПРИЯТИЙ */}
      <Section id="schedule" className="py-24 px-6 bg-[#1a3d2b]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-4">
            <span className="font-montserrat text-[9px] tracking-[0.5em] text-[#7dc99a] uppercase">График мероприятий</span>
          </div>
          <h2 className="font-cormorant text-4xl text-center text-white font-light mb-16">Программа дня</h2>
          <div className="relative">
            <div className="absolute left-[52px] top-4 bottom-4 w-px bg-gradient-to-b from-[#7dc99a]/40 via-[#7dc99a]/15 to-transparent" />
            {schedule.map((item, i) => (
              <div key={i} className="relative flex items-start gap-6 mb-10 last:mb-0 group">
                <div className="w-[44px] text-right flex-shrink-0 pt-1">
                  <span className="font-montserrat text-[10px] text-[#7dc99a] tracking-wider">{item.time}</span>
                </div>
                <div className="relative z-10 w-[16px] h-[16px] flex-shrink-0 mt-1 border border-[#7dc99a]/40 bg-[#1a3d2b] flex items-center justify-center group-hover:border-[#7dc99a] group-hover:bg-[#7dc99a]/10 transition-all duration-300">
                  <div className="w-[5px] h-[5px] bg-[#7dc99a]/60 group-hover:bg-[#7dc99a] transition-colors" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <Icon name={item.icon} size={14} className="text-[#7dc99a]/60" />
                    <h4 className="font-cormorant text-xl text-white font-light">{item.title}</h4>
                  </div>
                  <p className="font-montserrat text-xs text-white/35 ml-[22px] leading-5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ДРЕСС-КОД */}
      <Section id="dresscode" className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <span className="font-montserrat text-[9px] tracking-[0.5em] text-[#2d6a4f] uppercase">Дресс-код</span>
          <h2 className="font-cormorant text-4xl text-[#1a3d2b] font-light mt-6 mb-4">Цвета торжества</h2>
          <p className="font-montserrat text-xs text-[#1a3d2b]/45 mb-12 leading-6">
            Просим придерживаться цветовой палитры праздника.<br />Это создаст красивое общее фото и гармоничную атмосферу.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dresscodeColors.map((c, i) => (
              <div key={i} className="group">
                <div
                  className="w-full aspect-square mb-3 border border-black/5 shadow-sm group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundColor: c.hex }}
                />
                <p className="font-montserrat text-[10px] text-[#1a3d2b]/60 tracking-wide">{c.name}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 border border-[#2d6a4f]/15 p-6 bg-[#f7f5f0]">
            <p className="font-montserrat text-xs text-[#1a3d2b]/50 leading-6">
              Пожалуйста, избегайте белого и чёрного цветов в нарядах.<br />
              Будем рады, если вы поддержите нашу палитру!
            </p>
          </div>
        </div>
      </Section>

      {/* RSVP */}
      <Section id="rsvp" className="py-24 px-6 bg-[#f7f5f0]">
        <div className="max-w-xl mx-auto text-center">
          <span className="font-montserrat text-[9px] tracking-[0.5em] text-[#2d6a4f] uppercase">Подтверждение участия</span>
          <h2 className="font-cormorant text-5xl text-[#1a3d2b] font-light mt-6 mb-3">Вы придёте?</h2>
          <p className="font-montserrat text-[10px] text-[#1a3d2b]/40 mb-12 tracking-wide">Просим ответить до 1 июля 2026</p>

          {!submitted ? (
            <div className="border border-[#2d6a4f]/20 p-8 md:p-10 text-left bg-white">
              {/* Имя */}
              <label className="font-montserrat text-[9px] tracking-[0.3em] text-[#2d6a4f] uppercase block mb-2">Ваше имя</label>
              <input
                type="text"
                value={rsvpName}
                onChange={e => setRsvpName(e.target.value)}
                placeholder="Имя и фамилия"
                className="w-full bg-transparent border-b border-[#2d6a4f]/20 pb-3 mb-8 font-montserrat text-sm text-[#1a3d2b] placeholder-[#1a3d2b]/25 focus:outline-none focus:border-[#2d6a4f] transition-colors"
              />

              {/* Придёте? */}
              <label className="font-montserrat text-[9px] tracking-[0.3em] text-[#2d6a4f] uppercase block mb-3">Подтверждение</label>
              <div className="flex gap-3 mb-8">
                <button
                  onClick={() => setRsvpStatus("yes")}
                  className={`flex-1 py-3 font-montserrat text-[10px] tracking-[0.25em] uppercase transition-all duration-300 ${rsvpStatus === "yes" ? "bg-[#2d6a4f] text-white" : "border border-[#2d6a4f]/25 text-[#1a3d2b]/50 hover:border-[#2d6a4f]/50 hover:text-[#2d6a4f]"}`}
                >
                  Буду
                </button>
                <button
                  onClick={() => setRsvpStatus("no")}
                  className={`flex-1 py-3 font-montserrat text-[10px] tracking-[0.25em] uppercase transition-all duration-300 ${rsvpStatus === "no" ? "bg-[#1a3d2b]/15 text-[#1a3d2b] border border-[#1a3d2b]/25" : "border border-[#2d6a4f]/25 text-[#1a3d2b]/50 hover:border-[#1a3d2b]/30 hover:text-[#1a3d2b]/70"}`}
                >
                  Не смогу
                </button>
              </div>

              {rsvpStatus === "yes" && (
                <>
                  {/* Количество гостей */}
                  <label className="font-montserrat text-[9px] tracking-[0.3em] text-[#2d6a4f] uppercase block mb-3">Количество гостей</label>
                  <div className="flex gap-3 mb-8">
                    {["1", "2", "3", "4+"].map(n => (
                      <button
                        key={n}
                        onClick={() => setRsvpCount(n)}
                        className={`w-12 h-12 font-montserrat text-sm transition-all duration-200 ${rsvpCount === n ? "bg-[#2d6a4f] text-white" : "border border-[#2d6a4f]/25 text-[#1a3d2b]/50 hover:border-[#2d6a4f]/50"}`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>

                  {/* Трансфер */}
                  <label className="font-montserrat text-[9px] tracking-[0.3em] text-[#2d6a4f] uppercase block mb-3">Нужен ли трансфер?</label>
                  <div className="flex gap-3 mb-8">
                    {[{ v: "yes", l: "Да, нужен" }, { v: "no", l: "Нет, спасибо" }].map(opt => (
                      <button
                        key={opt.v}
                        onClick={() => setTransfer(opt.v as "yes" | "no")}
                        className={`flex-1 py-2.5 font-montserrat text-[10px] tracking-[0.2em] uppercase transition-all duration-200 ${transfer === opt.v ? "bg-[#2d6a4f] text-white" : "border border-[#2d6a4f]/25 text-[#1a3d2b]/50 hover:border-[#2d6a4f]/50"}`}
                      >
                        {opt.l}
                      </button>
                    ))}
                  </div>

                  {/* Алкоголь */}
                  <label className="font-montserrat text-[9px] tracking-[0.3em] text-[#2d6a4f] uppercase block mb-3">Какой алкоголь предпочитаете?</label>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {["Вино", "Шампанское", "Виски", "Коньяк", "Водка", "Пиво", "Не пью"].map(opt => (
                      <button
                        key={opt}
                        onClick={() => toggleAlcohol(opt)}
                        className={`px-4 py-2 font-montserrat text-[10px] tracking-[0.15em] uppercase transition-all duration-200 ${alcohol.includes(opt) ? "bg-[#2d6a4f] text-white" : "border border-[#2d6a4f]/25 text-[#1a3d2b]/50 hover:border-[#2d6a4f]/50"}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {/* Ребёнок */}
                  <label className="font-montserrat text-[9px] tracking-[0.3em] text-[#2d6a4f] uppercase block mb-3">Будет ли с вами ребёнок?</label>
                  <div className="flex gap-3 mb-8">
                    {[{ v: "yes", l: "Да" }, { v: "no", l: "Нет" }].map(opt => (
                      <button
                        key={opt.v}
                        onClick={() => setHasChild(opt.v as "yes" | "no")}
                        className={`flex-1 py-2.5 font-montserrat text-[10px] tracking-[0.2em] uppercase transition-all duration-200 ${hasChild === opt.v ? "bg-[#2d6a4f] text-white" : "border border-[#2d6a4f]/25 text-[#1a3d2b]/50 hover:border-[#2d6a4f]/50"}`}
                      >
                        {opt.l}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <button
                onClick={() => { if (rsvpName.trim() && rsvpStatus !== "idle") setSubmitted(true); }}
                disabled={!rsvpName.trim() || rsvpStatus === "idle"}
                className="w-full py-4 font-montserrat text-[10px] tracking-[0.35em] uppercase bg-[#2d6a4f] text-white hover:bg-[#1a3d2b] transition-colors duration-300 font-medium disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Отправить ответ
              </button>
            </div>
          ) : (
            <div className="border border-[#2d6a4f]/25 p-12 bg-white">
              <div className="w-12 h-12 border border-[#2d6a4f]/40 flex items-center justify-center mx-auto mb-6">
                <Icon name="Check" size={22} className="text-[#2d6a4f]" />
              </div>
              <p className="font-cormorant text-3xl text-[#1a3d2b] font-light mb-3">
                {rsvpStatus === "yes" ? "Ждём вас!" : "Жаль, что не придёте"}
              </p>
              <p className="font-montserrat text-xs text-[#1a3d2b]/35">Спасибо за ответ, {rsvpName}</p>
            </div>
          )}
        </div>
      </Section>

      {/* КОНТАКТЫ */}
      <Section id="contacts" className="py-24 px-6 bg-white border-t border-[#2d6a4f]/10">
        <div className="max-w-3xl mx-auto text-center">
          <span className="font-montserrat text-[9px] tracking-[0.5em] text-[#2d6a4f] uppercase">Контакты</span>
          <h2 className="font-cormorant text-4xl text-[#1a3d2b] font-light mt-6 mb-14">Есть вопросы?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: "Вадим", role: "Жених", phone: "+7 (000) 000-00-00" },
              { name: "Ксения", role: "Невеста", phone: "+7 (000) 000-00-00" },
            ].map((c, i) => (
              <div key={i} className="border border-[#2d6a4f]/15 p-8 hover:border-[#2d6a4f]/40 transition-all duration-300 group bg-[#f7f5f0]">
                <p className="font-cormorant text-2xl text-[#1a3d2b] font-light mb-1">{c.name}</p>
                <p className="font-montserrat text-[9px] text-[#2d6a4f]/60 tracking-[0.3em] uppercase mb-6">{c.role}</p>
                <a href={`tel:${c.phone}`} className="inline-flex items-center gap-2 font-montserrat text-sm text-[#1a3d2b]/40 group-hover:text-[#2d6a4f] transition-colors duration-300">
                  <Icon name="Phone" size={13} />
                  {c.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="py-10 text-center border-t border-[#2d6a4f]/10 bg-[#f7f5f0]">
        <p className="font-cormorant text-xl text-[#1a3d2b]/20 italic">Вадим & Ксения · 28.08.2026</p>
      </footer>

      <style>{`
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
      `}</style>
    </div>
  );
}
