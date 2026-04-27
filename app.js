gsap.registerPlugin(ScrollTrigger);

/** Разрешает относительные `assets/…` и `backstage/…` в абсолютный URL (нужно для GitHub Pages /site/, где <base> не влияет на Image/Canvas так же, как на <img> в HTML). */
const __ASSET_ROOT = (() => {
  try {
    const s = document.currentScript;
    if (s && s.src) return new URL(".", s.src).href;
  } catch (_) {}
  return new URL("./", document.baseURI).href;
})();
function absAsset(rel) {
  if (rel == null || rel === "") return rel;
  if (/^https?:\/\//i.test(String(rel)) || String(rel).startsWith("//") || String(rel).startsWith("data:") || String(rel).startsWith("blob:")) {
    return rel;
  }
  try {
    return new URL(String(rel).replace(/^\//, ""), __ASSET_ROOT).href;
  } catch (_) {
    return rel;
  }
}

// Background hero video may start only after startup loader hides.
let __bgReelCanPlay = false;

function initStartupLoader() {
  const loader = document.getElementById("startup-loader");
  if (!loader) return;
  document.body.classList.add("is-loading");

  const minMs = 2000;
  let minDone = false;
  let released = false;

  const release = () => {
    if (released || !minDone) return;
    released = true;
    loader.classList.add("is-hidden");
    setTimeout(() => {
      loader.remove();
      document.body.classList.remove("is-loading");
      __bgReelCanPlay = true;
      resumeBackgroundReel();
      // Aggressive startup retries right after reveal so background motion appears immediately.
      let tries = 0;
      const kick = setInterval(() => {
        tries += 1;
        resumeBackgroundReel();
        if (tries >= 18) clearInterval(kick);
      }, 150);
    }, 160);
  };

  setTimeout(() => {
    minDone = true;
    release();
  }, minMs);

  addEventListener(
    "load",
    () => {
      release();
    },
    { once: true },
  );

  // Safety valve: do not block loader forever on hanging resources.
  setTimeout(() => {
    minDone = true;
    release();
  }, 2400);
}

initStartupLoader();

// Browser-window adaptive vars for better desktop responsiveness.
function syncViewportVars() {
  const root = document.documentElement;
  root.style.setProperty("--app-vh", `${window.innerHeight}px`);
  root.style.setProperty("--app-vw", `${window.innerWidth}px`);
}
syncViewportVars();
addEventListener("resize", syncViewportVars, { passive: true });
addEventListener("orientationchange", syncViewportVars, { passive: true });

/** When true, #reel (hero bg) is intentionally not auto-resumed — e.g. showreel modal plays with sound and Chrome would fight pause/play loops. */
let __bgReelResumeSuppressed = false;
function resumeBackgroundReel() {
  const el = document.getElementById("reel");
  if (!el || document.hidden || __bgReelResumeSuppressed || !__bgReelCanPlay) return;
  el.muted = true;
  if (el.paused) {
    const p = el.play();
    if (p) p.catch(() => {});
  }
}

// Keep native scroll behavior to avoid jump-to-top during late resource loading.
if ("scrollRestoration" in history) history.scrollRestoration = "auto";

// ═══ DATA ═══
const TOP5 = [
  {id:"5Fix7P6aGXQ",artist:"Doni feat. Натали",title:"Ты такой",views:362328055,pct:100},
  {id:"OTRjNNzi09E",artist:"Аня Семенович",title:"Хочешь",views:194215000,pct:54},
  {id:"KxxEcOWdZsg",artist:"Alexander Rybak",title:"Котик",views:187432000,pct:52},
  {id:"P7TJLMzDDqI",artist:"Doni feat. Сати Казанова",title:"Я украду",views:182100000,pct:50},
  {id:"BGDT7Z3gza8",artist:"Doni",title:"Осколки",views:171650000,pct:47},
];

const WORKS = [
  {id:"tV_qKmkQyB0",a:"Даня Милохин & Мумий Тролль",t:"Башня"},
  {id:"4VP33dxJu3s",a:"Jony, The Limba",t:"Босс"},
  {id:"6YAWZv_9Ng8",a:"Макс Корж",t:"Стань"},
  {id:"ImTIhkoAWyE",a:"escape · Даня Милохин",t:"so low"},
  {id:"_TazBWWgOeQ",a:"Iowa",t:"Маршрутка"},
  {id:"zdJIYldakwY",a:"L'One feat. Фидель",t:"Океан"},
  {id:"oD4H-ZcR48w",a:"Тимати",t:"Что видишь ты"},
  {id:"LuAPMnUt4y0",a:"Николай Басков",t:"С Днём рождения!"},
  {id:"q35dzC4qtT4",a:"Султан Лагучев",t:"Подмосковная львица"},
  {id:"v4SmBp8SPzM",a:"Мот",t:"92 дня"},
  {id:"z4rVYmeSrWw",a:"Bahh Tee & Turken",t:"Записки с голубками"},
  {id:"oZj27xlw6PA",a:"Натали",t:"У меня есть только ты"},
  {id:"mpEqUV2Pqio",a:"Александр Панайотов",t:"Ночь на облаках"},
  {id:"kKM3zhCa3no",a:"Евгений Григорьев",t:"Только так"},
  {id:"gejyz7sOcXs",a:"Брендон Стоун",t:"Правда без лица"},
  {id:"MNtT3FhZVQQ",a:"EMIN & Асия",t:"Тихий океан"},
  {id:"4Ey_Yhu7ZbM",a:"Doni feat. Morris",t:"Разбуди меня"},
  {id:"VrpE2Qdxbtg",a:"Doni feat. Миша Марвин",t:"Девочка S-класса"},
  {id:"on3PC01ZUoo",a:"Dream Team",t:"Новогодний"},
  {id:"Q_6_s-Lzxtk",a:"Doni feat. Люся Чеботина",t:"Rendez-Vous"},
  {id:"nwKJ-m4zBcM",a:"Doni",t:"Сила не в бороде"},
  {id:"xdC5LavU1FQ",a:"Хор Турецкого",t:"Ленинградский хлеб"},
  {id:"dxYo_nGSSwU",a:"Юлия Михальчик",t:"Девушка простая"},
];

const ADS = [
  {id:"1041690118",title:"RuTube Детям"},
  {id:"1041686403",title:"Артнео"},
  {id:"1057798498",title:"Полиоксидоний"},
  {id:"1186566865",title:"ТИМАТИ BORK"},
  {id:"1186565205",title:"Эксклюзив BORK для Тимати"},
];

const BRANDS = [
  {name:"ЯНДЕКС ТАКСИ",vid:"tV_qKmkQyB0",startAt:34},{name:"ЯНДЕКС АЛИСА",vid:"on3PC01ZUoo",startAt:11},
  {name:"ЯНДЕКС МАРКЕТ",vid:"tV_qKmkQyB0",startAt:44},{name:"ELECTROLUX",vid:"VrpE2Qdxbtg",startAt:25},
  {name:"CHEETOS",vid:"on3PC01ZUoo",startAt:230},{name:"LEON",vid:"4Ey_Yhu7ZbM",startAt:7},
  {name:"RENDEZ-VOUS",vid:"Q_6_s-Lzxtk",startAt:31},{name:"585 ЗОЛОТОЙ",vid:"TT3G8sDdHMs",startAt:47},
  {name:"FRESH BAR",vid:"v4SmBp8SPzM",startAt:21},{name:"DEONICA",vid:"nwKJ-m4zBcM",startAt:10},
  {name:"MODELFORM",vid:"OTRjNNzi09E",startAt:218},{name:"SOVA",vid:"P7TJLMzDDqI",startAt:41},
  {name:"DARVOL",vid:"P7TJLMzDDqI",startAt:43},{name:"RAVON",vid:"nMFMMn9HYcM",startAt:52},
  {name:"BORK",vid:"1186565205"},{name:"RUTUBE",vid:"1041690118"},
  {name:"REN TV",vid:""},{name:"РОССЕЛЬХОЗБАНК",vid:""},
  {name:"ТНТ",vid:""},{name:"СТС",vid:""},
  {name:"ПОЛИОКСИДОНИЙ",vid:"1057798498"},{name:"АРТНЕО",vid:"1041686403"},
];

const ARTISTS = [
  "Александр Панайотов","Александр Рыбак","Андрей Гризли","Анна Семенович","Анна Шульгина","Артур Пирожков","Артур Руденко","Банд’Эрос",
  "Брендон Стоун","Виктория Алешко","Витя АК","Гуф","Даня Милохин","Джиган","Дина Гарипова","Доминик Джокер","Евгений Григорьев",
  "Егор Крид","Ирина Круг","Катя Кокорина","Крестная семья","Летти","Лоя","Люся Чеботина","Мак$им","Макс Корж","Марсель","Миша Марвин",
  "Мот","Мохито","Мумий Тролль","Натали","Николай Басков","Пицца","Роман Bestseller","Руслан Алехно","Сати Казанова","Словецкий",
  "Смоки Мо","Сосо Павлиашвили","Стас Михайлов","Султан Ураган","Татьяна Буланова","Тимати","Триагрутрика","Фидель","Филипп Киркоров",
  "Ханна","Хор Турецкого","Эдвард","Элина Дагаева","Юлия Михальчик","Asammuell","Bahh Tee & Turken","Centr","Dj Miller","Dj Slider & Magnit",
  "Dj Smash","Doni","Escape","Idris & Leos","Iowa","Joio","Jony","Limba","L’one","Natan","Nel","Nemiga","Niletto"
];
const LABELS = ["Black Star","ПЦ Гуцериев","Lotus Music","Монолит","Respect","Warner Music"];
const INTRO_BG = {
  desktop: "assets/video/showreelback.mp4",
  mobile: "assets/video/showreelbackmobile.mp4",
};
const BACKSTAGE_IMAGES = [
  "bts-01.png", "bts-02.png", "bts-03.png", "bts-04.png", "bts-05.png", "bts-06.png",
  "bts-07.png", "bts-08.png", "bts-09.png", "bts-10.png", "bts-11.png", "bts-12.png",
  "bts-13.png", "bts-14.png", "bts-15.png", "bts-16.png", "bts-17.png", "bts-18.png",
  "bts-19.png", "bts-20.png", "bts-21.png", "bts-22.png", "bts-23.png", "bts-24.png",
  "bts-25.png", "0011-F8M98IYQlgA.jpg", "0012-rOowqI9APIQ.jpg", "0014-kyCz4uvIZks.jpg", "0015-XBwDMMvvnmY.jpg", "0016-jgT8cPWcXuQ.jpg",
  "0018-OJ_eKg7P-2Q.jpg", "0019-X-tsCum5Bo4.jpg", "0020-9ywpZa6yiZQ.jpg", "0021-MtbAHQUYJ-8.jpg", "0022-maLMzFP8Xas.jpg", "0023-JBPreKp18eM.jpg",
  "0024-ElPcwidhkog.jpg", "0025-JCdRd_2uMn0.jpg", "0035-Knysu75uAHw.jpg", "0044-vYFdEUq8WBE.jpg", "0049-CRrUG9tDwsw.jpg", "0051-JusKLtU2NUc.jpg",
  "0052-gzwwh-hMqds.jpg", "0053-laZxSkwmvH4.jpg", "0064-7Mb8QsZnS1w.jpg", "0068-ovAk431_zwY.jpg", "0070_bMZjpV83iM.jpg", "0074-CkbYxS0ugug.jpg",
  "0075-Mna7hlZpYqc.jpg", "0076-pqmf8NyTN3A.jpg", "0077-9-OD974One8.jpg", "0078-nMWIdylwX4s.jpg", "0079-ziIvAJbUi8c.jpg", "0080-gMc5kG3C7kY.jpg",
  "0115-oxsxsQJKzHw.jpg", "0116-CDAOuEVS_iI.jpg", "0120-NceRUG4Adc0.jpg", "0121-bcBGXBsEM_o.jpg", "0122-2WrUBJ-ypdc.jpg", "0123-AGqa0B_8MsA.jpg",
  "0128-wEB4pzVCS8o.jpg", "0129-QQcYZwOliCw.jpg", "0130-qJDN_NsSQ3E.jpg", "0131-4pLCAowTRws.jpg", "0135-dyOkDQ2qUpY.jpg", "0136-dW2CtFVwQA4.jpg",
  "0138-m0Qj8fUtwWI.jpg", "0144-QO0zE20JO5U.jpg", "0145-ZWiUZaavw8Y.jpg", "0160-jh6dn-tfkng.jpg", "0174-avTcKb_lR1o.jpg", "0175-3BLg2UzsI5c.jpg",
  "0179-QwAbBakl6Mc.jpg", "0196-6pY6IhlStmE.jpg", "0215-AzKR5jo0FU8.jpg", "0216-mXO1Y7JL008.jpg", "0224-BT00SdIns_E.jpg", "0225-7LKa9zPvbhU.jpg",
  "0246-8vYWRxnL7E.jpg", "0268-dr8Tcy1gZ5g.jpg", "0271-vxkmSZjYcBg.jpg", "0293-soiOyu41c_A.jpg", "0302-IWl0Tu3ugkw.jpg", "0303-48-xhuitS6A.jpg",
  "0307-URY_6ubf_ko.jpg", "0308-IolcYKP2qVk.jpg", "0318-IDPGJ9bIJiU.jpg", "0319-tLDStb10KsI.jpg", "0320-el8TXQRtLoA.jpg", "0330-Q6_B06emXb8.jpg",
  "0353-c3iFCLHquW4.jpg", "0372-cTkdlYEoRmk.jpg", "0413-TmEK8KAL8TA.jpg", "0417-tmH3IaNEHx4.jpg", "0427-LhEFAUHrAzM.jpg"
];
const ARTIST_WIKI_TITLES = {
  "Тимати": "Тимати",
  "Филипп Киркоров": "Киркоров,_Филипп_Бедросович",
  "Николай Басков": "Басков,_Николай_Викторович",
  "Стас Михайлов": "Михайлов,_Станислав_Владимирович",
  "Егор Крид": "Егор_Крид",
  "Джиган": "Джиган",
  "Даня Милохин": "Милохин,_Даня",
  "Макс Корж": "Корж,_Макс",
  "Мот": "Мот_(рэпер)",
  "Мумий Тролль": "Мумий_Тролль",
  "Jony": "Jony",
  "Баста": "Баста",
  "Люся Чеботина": "Чеботина,_Люся",
  "Iowa": "Iowa_(группа)",
  "Niletto": "Niletto",
  "Dj Smash": "DJ_Smash",
  "Doni": "Doni",
  "Alexander Rybak": "Александр_Рыбак",
  "Аня Семенович": "Семёнович,_Анна_Григорьевна",
  "L'One": "L'One",
  "Bahh Tee": "Bahh_Tee",
  "Натали": "Натали_(певица)",
  "Панайотов": "Панайотов,_Александр_Сергеевич",
  "Григорьев": "Григорьев,_Евгений",
  "Михальчик": "Михальчик,_Юлия_Сергеевна",
  "EMIN": "Emin_(певец)",
  "Сати Казанова": "Казанова,_Сати",
  "Лагучев": "Лагучев,_Султан",
  "Ирина Круг": "Круг,_Ирина_Викторовна",
  "Гуф": "Гуф",
  "Хор Турецкого": "Хор_Турецкого",
  "Джокер": "Артур_Пирожков",
  "Марвин": "Миша_Марвин",
  "Escape": "Escape",
  "Natan": "Natan",
};
const LABEL_LOGOS = {
  "Black Star": "assets/artist/Black%20Star.webp",
  "Gazgolder": "https://logo.clearbit.com/gazgolder.com",
  "ПЦ Гуцериев": "https://logo.clearbit.com/gutserievmedia.ru",
  "Lotus Music": "assets/artist/Lotus%20Music.webp",
  "Монолит": "assets/artist/%D0%9C%D0%BE%D0%BD%D0%BE%D0%BB%D0%B8%D1%82.webp",
  "Respect": "https://logo.clearbit.com/respectproduction.ru",
  "Warner Music": "https://logo.clearbit.com/wmg.com",
};

// ═══ CURSOR (RAF только пока курсор движется / догоняет цель — без вечного цикла 60fps) ═══
const cr = document.querySelector(".cr");
if (cr) {
  let mx = innerWidth / 2;
  let my = innerHeight / 2;
  let rx = mx;
  let ry = my;
  let curRaf = 0;
  const CUR_EPS = 0.45;
  const CUR_LERP = 0.22;
  const applyCursor = () => {
    const anchor = document.body.classList.contains("cf") ? "translate(-12%,-8%)" : "translate(-50%,-50%)";
    const dx = mx - rx;
    const dy = my - ry;
    if (dx * dx + dy * dy < CUR_EPS * CUR_EPS) {
      rx = mx;
      ry = my;
      cr.style.transform = `translate(${rx}px,${ry}px) ${anchor}`;
      curRaf = 0;
      return;
    }
    rx += dx * CUR_LERP;
    ry += dy * CUR_LERP;
    cr.style.transform = `translate(${rx}px,${ry}px) ${anchor}`;
    curRaf = requestAnimationFrame(applyCursor);
  };
  const kickCursor = () => {
    if (document.hidden) return;
    if (!curRaf) curRaf = requestAnimationFrame(applyCursor);
  };
  addEventListener(
    "pointermove",
    (e) => {
      mx = e.clientX;
      my = e.clientY;
      kickCursor();
    },
    { passive: true },
  );
  addEventListener("pointerdown", kickCursor, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(curRaf);
      curRaf = 0;
    } else {
      kickCursor();
    }
  });
}
document.addEventListener('mouseover', e => {
  const t = e.target.closest('[data-c]');
  document.body.classList.remove('cl','cv','cf','cn');
  if (!t) return;
  if (t.dataset.c === 'view') document.body.classList.add('cv');
  else if (t.dataset.c === 'finger') document.body.classList.add('cf');
  else if (t.dataset.c === 'native') document.body.classList.add('cn');
  else document.body.classList.add('cl');
});

// ═══ UI HOVER SFX (EXCEPT MOSAIC) ═══
const uiSfx = { ctx: null, lastGlobalAt: 0, lastByKey: new Map() };
const getUiAudio = async () => {
  if (uiSfx.ctx) return uiSfx.ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  uiSfx.ctx = new AC();
  return uiSfx.ctx;
};
/** One shared context for UI hovers + mosaic — resume on first pointer move/tap (no extra “click to hear”). */
let siteAudioSilentPrimed = false;
const unlockSiteAudio = async () => {
  const ac = await getUiAudio();
  if (!ac) return;
  await ac.resume().catch(() => {});
  if (ac.state !== "running") return;
  if (siteAudioSilentPrimed) return;
  siteAudioSilentPrimed = true;
  const t0 = ac.currentTime;
  const o = ac.createOscillator();
  const g = ac.createGain();
  g.gain.setValueAtTime(0.00001, t0);
  o.connect(g).connect(ac.destination);
  o.start(t0);
  o.stop(t0 + 0.012);
};
document.addEventListener("pointerdown", () => void unlockSiteAudio(), { capture: true, passive: true });
document.addEventListener("pointermove", () => void unlockSiteAudio(), { once: true, capture: true, passive: true });
document.addEventListener("touchstart", () => void unlockSiteAudio(), { capture: true, passive: true });
document.addEventListener("mousedown", () => void unlockSiteAudio(), { capture: true, passive: true });
document.addEventListener("keydown", () => void unlockSiteAudio(), { once: true, capture: true });

const playUiTick = async (key = "ui", pan = 0, tone = 1) => {
  const now = performance.now();
  const lastForKey = uiSfx.lastByKey.get(key) || 0;
  if (now - lastForKey < 85) return;
  if (now - uiSfx.lastGlobalAt < 32) return;
  uiSfx.lastByKey.set(key, now);
  uiSfx.lastGlobalAt = now;

  await unlockSiteAudio();
  const ac = await getUiAudio();
  if (!ac) return;
  if (ac.state !== "running") await ac.resume().catch(() => {});

  const t0 = ac.currentTime;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  const filter = ac.createBiquadFilter();
  const p = ac.createStereoPanner ? ac.createStereoPanner() : null;

  osc.type = "triangle";
  osc.frequency.setValueAtTime(520 * tone, t0);
  osc.frequency.exponentialRampToValueAtTime(980 * tone, t0 + 0.05);
  filter.type = "highpass";
  filter.frequency.setValueAtTime(250, t0);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(0.03, t0 + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.095);

  if (p) {
    p.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), t0);
    osc.connect(filter).connect(gain).connect(p).connect(ac.destination);
  } else {
    osc.connect(filter).connect(gain).connect(ac.destination);
  }
  osc.start(t0);
  osc.stop(t0 + 0.1);
};

const HOVER_SFX_SELECTOR = ".artists-inset,.logo-c";
document.addEventListener("pointerover", (e) => {
  if (e.pointerType === "touch") return;
  const target = e.target instanceof Element ? e.target.closest(HOVER_SFX_SELECTOR) : null;
  if (!target || target.closest("#wgrid")) return; // keep mosaic sound separate
  const prev = e.relatedTarget instanceof Element ? e.relatedTarget.closest(HOVER_SFX_SELECTOR) : null;
  if (prev === target) return;
  const pan = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
  const tone = target.matches(".artists-inset,.sp-photo") ? 0.92 : 1.0;
  playUiTick(`hover:${target.className}`, pan, tone);
}, { passive: true });

// ═══ PROGRESS BAR (один layout на кадр анимации, не на каждый scroll) ═══
let scrollPaintRaf = 0;
const flushScrollUi = () => {
  scrollPaintRaf = 0;
  const pg = document.getElementById("pg");
  const nav = document.getElementById("nav");
  const max = Math.max(1, document.body.scrollHeight - innerHeight);
  if (pg) pg.style.width = `${(scrollY / max) * 100}%`;
  if (nav) nav.classList.toggle("s", scrollY > 80);
};
addEventListener(
  "scroll",
  () => {
    if (!scrollPaintRaf) scrollPaintRaf = requestAnimationFrame(flushScrollUi);
  },
  { passive: true },
);

// ═══ INTRO ANIMATION + VIDEO + NAME FX ═══
const reel = document.getElementById("reel");
if (reel) {
  reel.loop = true;
  reel.poster = absAsset("assets/img/img1.jpg");
  reel.muted = true;
  reel.defaultMuted = true;
  reel.setAttribute("playsinline", "");
  reel.setAttribute("webkit-playsinline", "");
  if ("playsInline" in reel) reel.playsInline = true;
  // Skip problematic static first frame so motion is visible right after loader.
  let reelLiveFrameShifted = false;
  const shiftReelToLiveFrame = () => {
    if (reelLiveFrameShifted) return;
    if (reel.readyState < 1) return;
    try {
      if (reel.currentTime < 0.12) reel.currentTime = 0.12;
      reelLiveFrameShifted = true;
    } catch (_) {}
  };
  reel.addEventListener("loadedmetadata", shiftReelToLiveFrame, { once: true });
  reel.addEventListener("playing", shiftReelToLiveFrame, { once: true });

  (function initHeroBackgroundVideo() {
    const mql = window.matchMedia("(max-width: 720px)");
    const pickSrc = () =>
      mql.matches
        ? "assets/video/showreelbackmobile.mp4"
        : "assets/video/showreelback.mp4";
    const fallbacks = ["assets/video/showreel.mp4"];
    let step = 0;
    const tryLoad = (path) => {
      reel.removeAttribute("src");
      /** @type {HTMLSourceElement[]} */
      const old = Array.from(reel.querySelectorAll("source"));
      old.forEach((n) => n.remove());
      reel.src = absAsset(path);
      reel.preload = "auto";
      reel.load();
    };
    const onErr = () => {
      if (step < fallbacks.length) {
        tryLoad(fallbacks[step++]);
      } else {
        reel.removeEventListener("error", onErr);
      }
    };
    tryLoad(pickSrc());
    reel.addEventListener("error", onErr, { passive: true });
    const onResize = () => {
      const next = pickSrc();
      const want = absAsset(next);
      if (reel.currentSrc && want === reel.currentSrc) return;
      step = 0;
      tryLoad(next);
    };
    if (mql.addEventListener) mql.addEventListener("change", onResize);
    else if (mql.addListener) mql.addListener(onResize);
  })();

  const ensurePlay = () => resumeBackgroundReel();

  let debounceT = 0;
  const debouncedEnsure = (ms = 160) => {
    clearTimeout(debounceT);
    debounceT = setTimeout(ensurePlay, ms);
  };

  const introEl = document.querySelector(".intro");
  if (introEl) {
    new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) debouncedEnsure(40);
        }
      },
      { threshold: 0, rootMargin: "80px 0px" },
    ).observe(introEl);
  }
  reel.addEventListener("loadeddata", () => debouncedEnsure(20));
  reel.addEventListener("canplay", () => debouncedEnsure(20));
  reel.addEventListener("stalled", () => debouncedEnsure(300));
  reel.addEventListener("waiting", () => debouncedEnsure(400));
  reel.addEventListener("suspend", () => debouncedEnsure(220));
  let pauseT = 0;
  reel.addEventListener("pause", () => {
    if (document.hidden) return;
    if (__bgReelResumeSuppressed) return;
    clearTimeout(pauseT);
    pauseT = setTimeout(() => {
      if (!__bgReelResumeSuppressed) ensurePlay();
    }, 250);
  });
  reel.addEventListener("ended", () => {
    reel.currentTime = 0;
    if (!__bgReelResumeSuppressed) ensurePlay();
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) debouncedEnsure(80);
  });
  addEventListener("focus", () => debouncedEnsure(100));
  addEventListener("pageshow", (e) => {
    if (e.persisted) debouncedEnsure(50);
  });
  addEventListener("touchstart", () => ensurePlay(), { once: true, passive: true });
  let watchdog = setInterval(() => {
    if (document.hidden || __bgReelResumeSuppressed) return;
    if (reel.paused) ensurePlay();
  }, 6000);
  addEventListener(
    "beforeunload",
    () => {
      clearInterval(watchdog);
    },
    { once: true },
  );
  ensurePlay();
}

const nameFxCanvas = document.getElementById("name-fx");
let nameFxGlow = false;
if (nameFxCanvas) {
  const nctx = nameFxCanvas.getContext("2d");
  const off = document.createElement("canvas");
  const offCtx = off.getContext("2d");
  const lines = ["RUSTAM", "ROMANOV"];
  const particles = [];
  const pointer = { x: -9999, y: -9999, px: -9999, py: -9999, vx: 0, vy: 0, active: false };
  const repelRadius = 188;
  const repelStrength = 2.85;
  const nameSfx = {
    lastAt: 0,
    wasActive: false,
    wasScattered: false,
    lastScatterAt: 0,
    lastMoveToneAt: 0,
  };
  const NAME_FX_AUDIO_MODE = "light-bubbly"; // off | light-bubbly | hiss
  let namePointerLastMoveAt = 0;
  let nameNoiseBuffer = null;
  const nameHiss = {
    source: null,
    gain: null,
    hp: null,
    filter: null,
    pan: null,
    running: false,
  };

  const getNameNoiseBuffer = (ac) => {
    if (nameNoiseBuffer && nameNoiseBuffer.sampleRate === ac.sampleRate) return nameNoiseBuffer;
    const dur = 0.22;
    const len = Math.max(1, Math.floor(ac.sampleRate * dur));
    const b = ac.createBuffer(1, len, ac.sampleRate);
    const ch = b.getChannelData(0);
    for (let i = 0; i < len; i += 1) {
      ch[i] = (Math.random() * 2 - 1) * (0.35 + Math.random() * 0.65);
    }
    nameNoiseBuffer = b;
    return b;
  };

  const ensureNameHiss = async () => {
    if (NAME_FX_AUDIO_MODE !== "hiss") return null;
    await unlockSiteAudio();
    const ac = await getUiAudio();
    if (!ac) return null;
    if (ac.state !== "running") await ac.resume().catch(() => {});
    if (ac.state !== "running") return null;
    if (nameHiss.running && nameHiss.source && nameHiss.gain) return { ac };

    const src = ac.createBufferSource();
    src.buffer = getNameNoiseBuffer(ac);
    src.loop = true;
    const hp = ac.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.setValueAtTime(1650, ac.currentTime);
    const f = ac.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.setValueAtTime(3950, ac.currentTime);
    f.Q.setValueAtTime(1.55, ac.currentTime);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, ac.currentTime);
    const p = ac.createStereoPanner ? ac.createStereoPanner() : null;
    if (p) {
      src.connect(hp).connect(f).connect(g).connect(p).connect(ac.destination);
    } else {
      src.connect(hp).connect(f).connect(g).connect(ac.destination);
    }
    src.start();
    nameHiss.source = src;
    nameHiss.hp = hp;
    nameHiss.gain = g;
    nameHiss.filter = f;
    nameHiss.pan = p;
    nameHiss.running = true;
    return { ac };
  };

  const updateNameHiss = async (intensity, panNorm, motion = 0, tSec = 0) => {
    if (NAME_FX_AUDIO_MODE !== "hiss") return;
    const state = await ensureNameHiss();
    if (!state || !nameHiss.gain || !nameHiss.filter || !nameHiss.hp) return;
    const t = state.ac.currentTime;
    const k = Math.max(0, Math.min(1, intensity));
    const motionK = Math.max(0, Math.min(1, motion / 2.2));
    const sparkle =
      0.62 +
      0.28 * Math.abs(Math.sin(tSec * 17.3 + panNorm * 1.7)) +
      0.22 * Math.abs(Math.sin(tSec * 31.8 + 0.7));
    const targetGain = 0.0001 + k * (0.043 + motionK * 0.085) * sparkle;
    const targetHp = 1450 + k * 1100 + motionK * 500;
    const targetFreq = 3350 + k * 3100 + motionK * 1500 + Math.sin(tSec * 22.4) * 420;
    const targetQ = Math.max(0.75, 1.45 + motionK * 1.5 + Math.sin(tSec * 27.5 + 0.3) * 0.3);
    nameHiss.gain.gain.cancelScheduledValues(t);
    nameHiss.gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, targetGain), t + 0.03);
    nameHiss.hp.frequency.cancelScheduledValues(t);
    nameHiss.hp.frequency.exponentialRampToValueAtTime(Math.max(120, targetHp), t + 0.03);
    nameHiss.filter.frequency.cancelScheduledValues(t);
    nameHiss.filter.frequency.exponentialRampToValueAtTime(Math.max(140, targetFreq), t + 0.035);
    nameHiss.filter.Q.cancelScheduledValues(t);
    nameHiss.filter.Q.linearRampToValueAtTime(targetQ, t + 0.035);
    if (nameHiss.pan) {
      nameHiss.pan.pan.cancelScheduledValues(t);
      nameHiss.pan.pan.linearRampToValueAtTime(Math.max(-1, Math.min(1, panNorm)), t + 0.05);
    }
  };

  const stopNameHiss = async () => {
    if (NAME_FX_AUDIO_MODE !== "hiss") return;
    if (!nameHiss.running || !nameHiss.gain) return;
    const ac = await getUiAudio();
    if (!ac) return;
    const t = ac.currentTime;
    nameHiss.gain.gain.cancelScheduledValues(t);
    nameHiss.gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);
  };

  const playNameFxTone = async (kind, velocity = 0) => {
    if (NAME_FX_AUDIO_MODE === "off") return;
    const now = performance.now();
    const minGap =
      kind === "scatter" ? 120 :
      kind === "active" ? 700 :
      kind === "gather" ? 220 : 180;
    if (now - nameSfx.lastAt < minGap) return;
    nameSfx.lastAt = now;

    await unlockSiteAudio();
    const ac = await getUiAudio();
    if (!ac) return;
    if (ac.state !== "running") await ac.resume().catch(() => {});
    if (ac.state !== "running") return;

    const t0 = ac.currentTime;
    if (NAME_FX_AUDIO_MODE === "light-bubbly") {
      const profileKind = kind === "scatter" ? "active" : kind;
      const pan = Math.max(-1, Math.min(1, pointer.x / Math.max(1, nameFxCanvas.clientWidth) * 2 - 1));
      const main = ac.createOscillator();
      const overtone = ac.createOscillator();
      const shimmer = ac.createOscillator();
      const orbit = ac.createOscillator();
      const wobble = ac.createOscillator();
      const wobbleGain = ac.createGain();
      const panMain = ac.createStereoPanner ? ac.createStereoPanner() : null;
      const panOver = ac.createStereoPanner ? ac.createStereoPanner() : null;
      const panShimmer = ac.createStereoPanner ? ac.createStereoPanner() : null;
      const panOrbit = ac.createStereoPanner ? ac.createStereoPanner() : null;
      const gMain = ac.createGain();
      const gOver = ac.createGain();
      const gShimmer = ac.createGain();
      const gOrbit = ac.createGain();
      const hp = ac.createBiquadFilter();
      const bp = ac.createBiquadFilter();
      const panNode = ac.createStereoPanner ? ac.createStereoPanner() : null;
      const vel = Math.min(1, velocity / 2.2);
      const warp = profileKind === "active" ? 1 : 0.6;
      const base =
        profileKind === "gather" ? 380 :
        profileKind === "active" ? 410 + vel * 120 :
        520 + vel * 180;
      const dur = profileKind === "gather" ? 0.38 : profileKind === "active" ? 1.05 : 0.26;
      hp.type = "highpass";
      hp.frequency.setValueAtTime(420, t0);
      bp.type = "bandpass";
      bp.frequency.setValueAtTime(2500, t0);
      bp.Q.setValueAtTime(0.85, t0);
      main.type = "sine";
      overtone.type = "triangle";
      shimmer.type = "sine";
      orbit.type = "sine";
      wobble.type = "sine";
      main.frequency.setValueAtTime(base * 1.08, t0);
      main.frequency.exponentialRampToValueAtTime(base * (0.58 - vel * 0.05), t0 + dur);
      overtone.frequency.setValueAtTime(base * 2.25, t0);
      overtone.frequency.exponentialRampToValueAtTime(base * (1.35 + vel * 0.12), t0 + dur * 0.92);
      shimmer.frequency.setValueAtTime(base * 3.7, t0);
      shimmer.frequency.exponentialRampToValueAtTime(base * (2.35 + vel * 0.18), t0 + dur * 0.85);
      orbit.frequency.setValueAtTime(base * 0.52, t0);
      orbit.frequency.exponentialRampToValueAtTime(base * 0.34, t0 + dur);
      wobble.frequency.setValueAtTime(3.2 + vel * 2.4, t0);
      wobble.frequency.linearRampToValueAtTime(5.8 + vel * 3.6, t0 + dur);
      wobbleGain.gain.setValueAtTime(profileKind === "active" ? 12 + vel * 10 : 24 + vel * 16, t0);
      wobbleGain.gain.linearRampToValueAtTime(profileKind === "active" ? 4 + vel * 5 : 8 + vel * 9, t0 + dur);
      wobble.connect(wobbleGain);
      wobbleGain.connect(main.frequency);
      wobbleGain.connect(overtone.frequency);
      wobbleGain.connect(shimmer.frequency);
      gMain.gain.setValueAtTime(0.0001, t0);
      gMain.gain.exponentialRampToValueAtTime(0.013 + vel * 0.008, t0 + (profileKind === "active" ? 0.24 : 0.04));
      gMain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur * 0.96);
      gOver.gain.setValueAtTime(0.0001, t0);
      gOver.gain.exponentialRampToValueAtTime(0.008 + vel * 0.005, t0 + (profileKind === "active" ? 0.27 : 0.028));
      gOver.gain.exponentialRampToValueAtTime(0.0001, t0 + dur * 0.9);
      gShimmer.gain.setValueAtTime(0.0001, t0);
      gShimmer.gain.exponentialRampToValueAtTime(0.006 + vel * 0.0042, t0 + (profileKind === "active" ? 0.22 : 0.024));
      gShimmer.gain.exponentialRampToValueAtTime(0.0001, t0 + dur * 0.72);
      gOrbit.gain.setValueAtTime(0.0001, t0);
      gOrbit.gain.exponentialRampToValueAtTime(0.0065 + vel * 0.0038, t0 + (profileKind === "active" ? 0.31 : 0.05));
      gOrbit.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      if (panMain) panMain.pan.setValueAtTime(Math.max(-1, Math.min(1, pan * 0.9 - 0.2)), t0);
      if (panOver) panOver.pan.setValueAtTime(Math.max(-1, Math.min(1, -pan * 0.95 + 0.2)), t0);
      if (panShimmer) panShimmer.pan.setValueAtTime(Math.max(-1, Math.min(1, pan * 0.7 + 0.35)), t0);
      if (panOrbit) panOrbit.pan.setValueAtTime(Math.max(-1, Math.min(1, -pan * 0.55 - 0.28)), t0);
      bp.frequency.exponentialRampToValueAtTime(4300 + vel * 1300 + warp * 260, t0 + dur * 0.4);
      bp.frequency.exponentialRampToValueAtTime(1750 + warp * 120, t0 + dur);
      bp.Q.linearRampToValueAtTime(1.35 + vel * 0.85, t0 + dur * 0.45);
      bp.Q.linearRampToValueAtTime(0.7, t0 + dur);
      if (panNode) {
        panNode.pan.setValueAtTime(pan, t0);
        if (panMain && panOver && panShimmer && panOrbit) {
          main.connect(gMain).connect(panMain).connect(hp).connect(bp).connect(panNode).connect(ac.destination);
          overtone.connect(gOver).connect(panOver).connect(hp).connect(bp).connect(panNode).connect(ac.destination);
          shimmer.connect(gShimmer).connect(panShimmer).connect(hp).connect(bp).connect(panNode).connect(ac.destination);
          orbit.connect(gOrbit).connect(panOrbit).connect(hp).connect(bp).connect(panNode).connect(ac.destination);
        } else {
          main.connect(gMain).connect(hp).connect(bp).connect(panNode).connect(ac.destination);
          overtone.connect(gOver).connect(hp).connect(bp).connect(panNode).connect(ac.destination);
          shimmer.connect(gShimmer).connect(hp).connect(bp).connect(panNode).connect(ac.destination);
          orbit.connect(gOrbit).connect(hp).connect(bp).connect(panNode).connect(ac.destination);
        }
      } else {
        if (panMain && panOver && panShimmer && panOrbit) {
          main.connect(gMain).connect(panMain).connect(hp).connect(bp).connect(ac.destination);
          overtone.connect(gOver).connect(panOver).connect(hp).connect(bp).connect(ac.destination);
          shimmer.connect(gShimmer).connect(panShimmer).connect(hp).connect(bp).connect(ac.destination);
          orbit.connect(gOrbit).connect(panOrbit).connect(hp).connect(bp).connect(ac.destination);
        } else {
          main.connect(gMain).connect(hp).connect(bp).connect(ac.destination);
          overtone.connect(gOver).connect(hp).connect(bp).connect(ac.destination);
          shimmer.connect(gShimmer).connect(hp).connect(bp).connect(ac.destination);
          orbit.connect(gOrbit).connect(hp).connect(bp).connect(ac.destination);
        }
      }
      main.start(t0);
      overtone.start(t0 + 0.004);
      shimmer.start(t0 + 0.002);
      orbit.start(t0);
      wobble.start(t0);
      main.stop(t0 + dur);
      overtone.stop(t0 + dur * 0.9);
      shimmer.stop(t0 + dur * 0.74);
      orbit.stop(t0 + dur);
      wobble.stop(t0 + dur);
      return;
    }

    const osc = ac.createOscillator();
    const gain = ac.createGain();
    const filter = ac.createBiquadFilter();
    const noise = ac.createBufferSource();
    const noiseGain = ac.createGain();
    const noiseFilter = ac.createBiquadFilter();
    const panNode = ac.createStereoPanner ? ac.createStereoPanner() : null;
    const pan = Math.max(-1, Math.min(1, pointer.x / Math.max(1, nameFxCanvas.clientWidth) * 2 - 1));
    const speedBoost = Math.min(0.35, velocity * 0.018);
    noise.buffer = getNameNoiseBuffer(ac);

    if (kind === "scatter") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(130, t0);
      osc.frequency.exponentialRampToValueAtTime(180, t0 + 0.08);
      filter.type = "highpass";
      filter.frequency.setValueAtTime(1200, t0);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.004 + speedBoost * 0.15, t0 + 0.016);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.11);
      noiseFilter.type = "highpass";
      noiseFilter.frequency.setValueAtTime(2100, t0);
      noiseGain.gain.setValueAtTime(0.0001, t0);
      noiseGain.gain.exponentialRampToValueAtTime(0.072 + speedBoost * 0.95, t0 + 0.012);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.115);
    } else if (kind === "active") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(120, t0);
      osc.frequency.exponentialRampToValueAtTime(145, t0 + 0.045);
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1000, t0);
      filter.Q.setValueAtTime(0.7, t0);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.0025 + speedBoost * 0.12, t0 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.075);
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(2600, t0);
      noiseFilter.Q.setValueAtTime(0.55, t0);
      noiseGain.gain.setValueAtTime(0.0001, t0);
      noiseGain.gain.exponentialRampToValueAtTime(0.048 + speedBoost * 0.55, t0 + 0.01);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.082);
    } else {
      osc.type = "sine";
      osc.frequency.setValueAtTime(140, t0);
      osc.frequency.exponentialRampToValueAtTime(110, t0 + 0.13);
      filter.type = "highpass";
      filter.frequency.setValueAtTime(900, t0);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.0022, t0 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.16);
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(1800, t0);
      noiseFilter.Q.setValueAtTime(0.8, t0);
      noiseGain.gain.setValueAtTime(0.0001, t0);
      noiseGain.gain.exponentialRampToValueAtTime(0.055, t0 + 0.02);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.17);
    }

    if (panNode) {
      panNode.pan.setValueAtTime(pan, t0);
      osc.connect(filter).connect(gain).connect(panNode).connect(ac.destination);
      noise.connect(noiseFilter).connect(noiseGain).connect(panNode).connect(ac.destination);
    } else {
      osc.connect(filter).connect(gain).connect(ac.destination);
      noise.connect(noiseFilter).connect(noiseGain).connect(ac.destination);
    }
    osc.start(t0);
    const stopAt = t0 + (kind === "gather" ? 0.17 : 0.13);
    noise.start(t0);
    osc.stop(stopAt);
    noise.stop(stopAt);
  };

  function buildNameParticles() {
    const dpr = window.devicePixelRatio || 1;
    const rect = nameFxCanvas.getBoundingClientRect();
    nameFxCanvas.width = Math.max(1, Math.round(rect.width * dpr));
    nameFxCanvas.height = Math.max(1, Math.round(rect.height * dpr));
    nctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    off.width = Math.max(1, Math.round(rect.width));
    off.height = Math.max(1, Math.round(rect.height));
    offCtx.clearRect(0, 0, off.width, off.height);
    offCtx.fillStyle = "#ffffff";
    offCtx.textAlign = "left";
    offCtx.textBaseline = "alphabetic";

    // Same kerning/scale. First line is near the top of the buffer — we never shift the block *up* to
    // “fit” the second line; that is what was flattening the first R. Use the full line’s
    // actualBoundingBoxAscent so the first line’s cap isn’t in the subpixel/alpha no‑man’s land.
    const fontSize = Math.min(rect.width * 0.22, rect.height * 0.46);
    const startX = Math.max(rect.width * 0.01, 6);
    const lineGap = fontSize * 0.86;
    offCtx.font = `400 ${fontSize}px Cormorant Garamond`;
    const m0 = offCtx.measureText("R");
    const m1 = offCtx.measureText("RUSTAM");
    const aLine1 =
      m1.actualBoundingBoxAscent > 0
        ? m1.actualBoundingBoxAscent
        : m0.fontBoundingBoxAscent > 0
          ? m0.fontBoundingBoxAscent
          : fontSize * 0.75;
    const topPad = 10;
    const minBaseline = topPad + aLine1;
    const topY = Math.max(minBaseline, rect.height * 0.43);
    const line2Y = topY + lineGap;
    offCtx.fillText(lines[0], startX, topY);
    offCtx.fillText(lines[1], startX, line2Y);

    const data = offCtx.getImageData(0, 0, off.width, off.height).data;
    particles.length = 0;
    // Finer grid → more “atoms” (tuned for perf: step ≥ 1)
    // Soft antialias (especially the first line’s top) — don’t be stricter than ~70 or R flattens
    const step = Math.max(1, Math.round(fontSize / 48));
    for (let y = 0; y < off.height; y += step) {
      for (let x = 0; x < off.width; x += step) {
        const a = data[(y * off.width + x) * 4 + 3];
        if (a > 70) {
          particles.push({
            x0: x,
            y0: y,
            x: x,
            y: y,
            vx: 0,
            vy: 0,
            drift: (Math.random() - 0.5) * 0.12,
            seed: Math.random() * Math.PI * 2,
            s: Math.max(0.7, step * 0.52),
          });
        }
      }
    }
  }

  let nameFxIoVisible = false;
  let nameFxRaf = 0;
  const nameFxIo = new IntersectionObserver(
    ([e]) => {
      nameFxIoVisible = e.isIntersecting;
      if (nameFxIoVisible && !document.hidden && !nameFxRaf) nameFxRaf = requestAnimationFrame(drawNameFx);
      if (!nameFxIoVisible) {
        cancelAnimationFrame(nameFxRaf);
        nameFxRaf = 0;
      }
    },
    { rootMargin: "80px 0px", threshold: 0 },
  );
  nameFxIo.observe(nameFxCanvas);

  function drawNameFx() {
    if (document.hidden || !nameFxIoVisible) {
      nameFxRaf = 0;
      return;
    }
    nameFxRaf = requestAnimationFrame(drawNameFx);
    const w = nameFxCanvas.width / (window.devicePixelRatio || 1);
    const h = nameFxCanvas.height / (window.devicePixelRatio || 1);
    nctx.clearRect(0, 0, w, h);
    const t = performance.now() * 0.001;
    pointer.vx *= 0.72;
    pointer.vy *= 0.72;
    if (Math.abs(pointer.vx) < 0.01) pointer.vx = 0;
    if (Math.abs(pointer.vy) < 0.01) pointer.vy = 0;

    const ptrSpeed = Math.hypot(pointer.vx, pointer.vy);
    const speedBoost = 1 + Math.min(0.7, ptrSpeed * 0.12);

    let displacementAcc = 0;
    particles.forEach((p) => {
      if (pointer.active) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const dist = Math.hypot(dx, dy) || 0.001;
        if (dist < repelRadius) {
          const u = 1 - dist / repelRadius;
          const f = u * u; // smooth falloff, stronger at center
          const push = f * repelStrength * speedBoost;
          const tangential = (pointer.vx + pointer.vy) * 0.04;
          const swirlX = (-dy / dist) * tangential;
          const swirlY = (dx / dist) * tangential;
          p.vx += (dx / dist) * push + swirlX;
          p.vy += (dy / dist) * push + swirlY;
        }
      }
      p.vx += Math.sin(t + p.seed) * p.drift * 0.03;
      p.vy += Math.cos(t * 0.87 + p.seed) * p.drift * 0.03;
      p.vx += (p.x0 - p.x) * 0.055;
      p.vy += (p.y0 - p.y) * 0.055;
      p.vx *= 0.84;
      p.vy *= 0.84;
      p.x += p.vx;
      p.y += p.vy;

      const displacement = Math.hypot(p.x - p.x0, p.y - p.y0);
      displacementAcc += displacement;
      if (displacement > 0.7) {
        nctx.fillStyle = nameFxGlow ? "rgba(200,164,104,.2)" : "rgba(236,233,225,.18)";
        nctx.beginPath();
        nctx.arc(p.x, p.y, p.s * 1.65, 0, Math.PI * 2);
        nctx.fill();
      }

      nctx.fillStyle = nameFxGlow ? "rgba(200,164,104,.96)" : "rgba(236,233,225,.96)";
      nctx.fillRect(p.x, p.y, p.s, p.s);
    });

    const avgDisplacement = particles.length ? displacementAcc / particles.length : 0;
    const pointerSpeed = Math.hypot(pointer.vx, pointer.vy);
    if (pointer.active && !nameSfx.wasActive) {
      nameSfx.wasActive = true;
      void playNameFxTone("scatter", pointerSpeed);
    }
    if (pointer.active && avgDisplacement > 0.9 && performance.now() - nameSfx.lastScatterAt > 160) {
      nameSfx.wasScattered = true;
      nameSfx.lastScatterAt = performance.now();
    }
    const movingNow = performance.now() - namePointerLastMoveAt < 55 && pointerSpeed > 0.14;
    if (NAME_FX_AUDIO_MODE === "light-bubbly" && pointer.active && movingNow) {
      const nowMs = performance.now();
      if (nowMs - nameSfx.lastMoveToneAt > 700) {
        nameSfx.lastMoveToneAt = nowMs;
        void playNameFxTone("active", pointerSpeed);
      }
    }
    const hissIntensity = pointer.active && movingNow ? Math.min(1, avgDisplacement / 2.4) : 0;
    const hissPan = pointer.x / Math.max(1, nameFxCanvas.clientWidth) * 2 - 1;
    if (hissIntensity > 0.02) void updateNameHiss(hissIntensity, hissPan, pointerSpeed, t);
    else void stopNameHiss();
    if (!pointer.active && nameSfx.wasActive) {
      nameSfx.wasActive = false;
      if (nameSfx.wasScattered || avgDisplacement > 0.45) {
        nameSfx.wasScattered = false;
        void playNameFxTone("gather", 0);
      }
    }
  }

  buildNameParticles();
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && nameFxIoVisible && !nameFxRaf) nameFxRaf = requestAnimationFrame(drawNameFx);
    if (document.hidden) {
      cancelAnimationFrame(nameFxRaf);
      nameFxRaf = 0;
    }
  });
  {
    const r = nameFxCanvas.getBoundingClientRect();
    if (r.bottom > 0 && r.top < innerHeight) {
      nameFxIoVisible = true;
      nameFxRaf = requestAnimationFrame(drawNameFx);
    }
  }
  addEventListener("resize", () => {
    buildNameParticles();
    if (nameFxIoVisible && !document.hidden && !nameFxRaf) nameFxRaf = requestAnimationFrame(drawNameFx);
  });
  nameFxCanvas.addEventListener("mousemove", (e) => {
    const r = nameFxCanvas.getBoundingClientRect();
    pointer.active = true;
    pointer.px = pointer.x;
    pointer.py = pointer.y;
    pointer.x = e.clientX - r.left;
    pointer.y = e.clientY - r.top;
    const dx = pointer.x - pointer.px;
    const dy = pointer.y - pointer.py;
    pointer.vx = Math.max(-34, Math.min(34, dx));
    pointer.vy = Math.max(-34, Math.min(34, dy));
    if (Math.hypot(dx, dy) > 0.45) namePointerLastMoveAt = performance.now();
  });
  nameFxCanvas.addEventListener("mouseleave", () => {
    pointer.active = false;
    pointer.vx = 0;
    pointer.vy = 0;
  });
}

setTimeout(() => {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.to("#ir", { opacity: 1, y: 0, duration: 0.6 })
    .fromTo("#name-fx", { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 1.05 }, "-=.2")
    .to("#ifoot", { opacity: 1, y: 0, duration: 0.6 }, "-=.35");
}, 200);

gsap.utils
  .toArray(document.querySelectorAll("#intro-stats .istat, #showreel-cta"))
  .forEach((el, i) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 16, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        delay: 1 + i * 0.08,
        ease: "power3.out",
      }
    );
    if (el.classList?.contains("istat")) {
      el.addEventListener("mouseenter", () => {
        gsap.to(el, { y: -3, duration: 0.25, ease: "power2.out" });
      });
      el.addEventListener("mouseleave", () => {
        gsap.to(el, { y: 0, duration: 0.25, ease: "power2.out" });
      });
    }
  });

ScrollTrigger.create({
  trigger: ".intro",
  start: "top top",
  end: "bottom top",
  onLeave: () => { nameFxGlow = true; },
  onEnterBack: () => { nameFxGlow = false; },
});

// ═══ SCROLL REVEALS ═══
gsap.utils.toArray('.rv').forEach(el => gsap.to(el, { opacity: 1, y: 0, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } }));
gsap.utils.toArray('.h-t span').forEach(el => gsap.to(el, { y: 0, opacity: 1, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));

// ═══ BACKSTAGE MODAL GALLERY ═══
const backstageGrid = document.getElementById("backstage-grid");
if (backstageGrid) {
  BACKSTAGE_IMAGES.forEach((name) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "bts-ph";
    card.setAttribute("aria-label", "Open backstage photo");
    const src = absAsset(`backstage/${name}`);
    card.innerHTML = `<img src="${src}" alt="" loading="lazy">`;
    card.addEventListener("click", () => openBtsViewer(src));
    backstageGrid.appendChild(card);
  });
}

// ═══ BACKSTAGE TITLE — мозаика как в блоке клипов: волна смены (WAVE_STEP), кроссфейд (FADE_MS), без сдвига фото ═══
const btsTitleWrap = document.querySelector(".backstage-title-wrap");
const btsTitleCanvas = document.getElementById("backstage-mosaic-canvas");
const btsTitleBtn = btsTitleWrap?.querySelector(".backstage-title");
if (btsTitleWrap && btsTitleCanvas && btsTitleBtn) {
  const BTS_TXT = "BACKSTAGE";
  const FADE_MS = 1550;
  const WAVE_STEP = 90;
  const WAVE_PERIOD_MIN = 2200;
  const WAVE_PERIOD_MAX = 3800;
  const BASE_TILE_W = 312;
  const BASE_TILE_H = 186;
  const btsShuffledIdx = (() => {
    const arr = BACKSTAGE_IMAGES.map((_, i) => i);
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  })();
  const btsLoaded = new Map();
  const btsPoolIdx = [];
  const btsRejected = [];
  const btsTiles = [];
  const btsGrid = { cols: 0, rows: 0, tileW: BASE_TILE_W, tileH: BASE_TILE_H };
  const btsWave = { nextAt: 0 };
  const btsPointer = { x: -1e6, y: -1e6, active: false };
  const SPOT_RADIUS = 148;
  const BTS_MIN_MOSAIC_LUMA = 86;
  let btsRaf = 0;
  let btsLastFrame = 0;
  const btsCtx = btsTitleCanvas.getContext("2d");
  const btsDpr = () => Math.min(2, window.devicePixelRatio || 1);
  const btsLayerCanvas = document.createElement("canvas");
  const btsLayerCtx = btsLayerCanvas.getContext("2d");
  const btsSpotCanvas = document.createElement("canvas");
  const btsSpotCtx = btsSpotCanvas.getContext("2d");
  const btsLumaCanvas = document.createElement("canvas");
  btsLumaCanvas.width = 24;
  btsLumaCanvas.height = 24;
  const btsLumaCtx = btsLumaCanvas.getContext("2d", { willReadFrequently: true });

  const btsEstimateLuma = (img) => {
    if (!btsLumaCtx || !img?.naturalWidth || !img?.naturalHeight) return 255;
    btsLumaCtx.clearRect(0, 0, btsLumaCanvas.width, btsLumaCanvas.height);
    btsLumaCtx.drawImage(img, 0, 0, btsLumaCanvas.width, btsLumaCanvas.height);
    const px = btsLumaCtx.getImageData(0, 0, btsLumaCanvas.width, btsLumaCanvas.height).data;
    let acc = 0;
    const count = px.length / 4;
    for (let k = 0; k < px.length; k += 4) {
      acc += px[k] * 0.2126 + px[k + 1] * 0.7152 + px[k + 2] * 0.0722;
    }
    return acc / Math.max(1, count);
  };

  const btsPromoteRejectedIfNeeded = () => {
    if (btsPoolIdx.length || !btsRejected.length) return;
    btsRejected.sort((a, b) => b.luma - a.luma);
    const fallbackTop = btsRejected.slice(0, Math.min(8, btsRejected.length));
    fallbackTop.forEach(({ idx, img }) => {
      btsLoaded.set(idx, img);
      btsPoolIdx.push(idx);
      btsAssignLoaded(idx, img);
    });
  };

  const btsDrawTile = (ctx, img, dx, dy, dw, dh) => {
    const fallbackImg = btsPoolIdx.length ? btsLoaded.get(btsPoolIdx[0]) : null;
    const source = img && img.complete && img.naturalWidth
      ? img
      : (fallbackImg && fallbackImg.complete && fallbackImg.naturalWidth ? fallbackImg : null);
    if (!source) return;
    const cx = dx + dw / 2;
    const cy = dy + dh / 2;
    const scale = Math.max(dw / source.naturalWidth, dh / source.naturalHeight);
    const sw = dw / scale;
    const sh = dh / scale;
    const sx = (source.naturalWidth - sw) * 0.5;
    const sy = (source.naturalHeight - sh) * 0.5;
    ctx.drawImage(source, sx, sy, sw, sh, cx - dw / 2, cy - dh / 2, dw, dh);
  };
  const btsAssignLoaded = (idx, img) => {
    const empty = btsTiles.find((t) => t.idx == null);
    if (!empty) return;
    empty.img = img;
    empty.idx = idx;
    empty.nextChange = performance.now() + 3500 + Math.random() * 2500;
  };
  const btsRefillFromPool = () => {
    if (!btsPoolIdx.length) return;
    while (btsTiles.some((t) => t.idx == null)) {
      const idx = btsPoolIdx[Math.floor(Math.random() * btsPoolIdx.length)];
      const img = btsLoaded.get(idx);
      if (!img) break;
      btsAssignLoaded(idx, img);
    }
  };
  const btsPickUnique = (tile) => {
    if (!btsPoolIdx.length) return null;
    for (let a = 0; a < 24; a += 1) {
      const idx = btsPoolIdx[Math.floor(Math.random() * btsPoolIdx.length)];
      if (idx != null && idx !== tile.idx) {
        const img = btsLoaded.get(idx);
        if (img) return { img, idx };
      }
    }
    for (let i = 0; i < btsPoolIdx.length; i += 1) {
      const idx = btsPoolIdx[i];
      if (idx != null && idx !== tile.idx) {
        const img = btsLoaded.get(idx);
        if (img) return { img, idx };
      }
    }
    return null;
  };
  const btsInitTiles = () => {
    const total = btsGrid.cols * btsGrid.rows;
    btsTiles.length = 0;
    for (let id = 0; id < total; id += 1) {
      btsTiles.push({
        id,
        c: id % btsGrid.cols,
        r: Math.floor(id / btsGrid.cols),
        img: null,
        idx: null,
        prevImg: null,
        fading: false,
        fadeStart: 0,
        nextChange: Number.POSITIVE_INFINITY,
      });
    }
  };
  const btsFontString = () => {
    const cs = getComputedStyle(btsTitleBtn);
    const fs = parseFloat(cs.fontSize) || 72;
    const ff = cs.fontFamily || "sans-serif";
    const fw = cs.fontWeight || "900";
    const raw = cs.letterSpacing || "";
    let lsPx = fs * 0.06;
    if (raw.endsWith("px")) lsPx = parseFloat(raw) || lsPx;
    else if (raw.endsWith("em")) lsPx = (parseFloat(raw) || 0.06) * fs;
    return { str: `${fw} ${fs}px ${ff}`, fs, lsPx };
  };
  let btsLayout = { fontStr: "", fs: 72, lsPx: 0, tx: 0, ty: 0 };
  const btsSyncTextLayout = () => {
    const { str, fs, lsPx } = btsFontString();
    const w = btsTitleCanvas.width / btsDpr();
    const h = btsTitleCanvas.height / btsDpr();
    btsLayout = { fontStr: str, fs, lsPx, tx: w / 2, ty: h / 2 + fs * 0.02 };
  };
  const btsResize = () => {
    const rect = btsTitleWrap.getBoundingClientRect();
    const w = Math.max(1, Math.floor(rect.width));
    const h = Math.max(1, Math.floor(rect.height));
    const dpr = btsDpr();
    btsTitleCanvas.width = Math.floor(w * dpr);
    btsTitleCanvas.height = Math.floor(h * dpr);
    btsTitleCanvas.style.width = `${w}px`;
    btsTitleCanvas.style.height = `${h}px`;
    btsLayerCanvas.width = w;
    btsLayerCanvas.height = h;
    btsSpotCanvas.width = w;
    btsSpotCanvas.height = h;
    btsCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    btsGrid.cols = Math.max(1, Math.ceil(w / BASE_TILE_W));
    btsGrid.rows = Math.max(1, Math.ceil(h / BASE_TILE_H));
    btsGrid.tileW = Math.ceil(w / btsGrid.cols);
    btsGrid.tileH = Math.ceil(h / btsGrid.rows);
    btsInitTiles();
    btsRefillFromPool();
    btsSyncTextLayout();
  };
  let btsPreloadCancel = false;
  const btsPreload = () => {
    let i = 0;
    let active = 0;
    const concurrency = 10;
    const pump = () => {
      while (!btsPreloadCancel && active < concurrency && i < btsShuffledIdx.length) {
        const idx = btsShuffledIdx[i++];
        active += 1;
        const im = new Image();
        im.decoding = "async";
        im.onload = () => {
          if (!btsPreloadCancel) {
            const luma = btsEstimateLuma(im);
            if (luma >= BTS_MIN_MOSAIC_LUMA) {
              btsLoaded.set(idx, im);
              btsPoolIdx.push(idx);
              btsAssignLoaded(idx, im);
              btsRefillFromPool();
            } else {
              btsRejected.push({ idx, img: im, luma });
            }
          }
          active -= 1;
          if (!btsPreloadCancel && i >= btsShuffledIdx.length && active === 0) {
            btsPromoteRejectedIfNeeded();
            btsRefillFromPool();
          }
          pump();
        };
        im.onerror = () => {
          active -= 1;
          pump();
        };
        im.src = absAsset(`backstage/${BACKSTAGE_IMAGES[idx]}`);
      }
    };
    pump();
  };
  let btsIoVisible = false;
  const btsDraw = (t) => {
    if (document.hidden || !btsIoVisible) {
      btsRaf = 0;
      return;
    }
    btsRaf = requestAnimationFrame(btsDraw);
    if (t - btsLastFrame < 1000 / 32) return;
    btsLastFrame = t;
    const w = btsTitleCanvas.width / btsDpr();
    const h = btsTitleCanvas.height / btsDpr();
    const { fontStr, fs, lsPx, tx, ty } = btsLayout;
    btsCtx.setTransform(btsDpr(), 0, 0, btsDpr(), 0, 0);
    btsCtx.globalAlpha = 1;
    btsCtx.globalCompositeOperation = "source-over";
    btsCtx.fillStyle = "#060606";
    btsCtx.fillRect(0, 0, w, h);

    btsTiles.forEach((tile) => {
      if (t >= tile.nextChange) {
        const pick = btsPickUnique(tile);
        if (pick && pick.img && pick.img !== tile.img) {
          tile.prevImg = tile.img;
          tile.img = pick.img;
          tile.idx = pick.idx;
          tile.fading = true;
          tile.fadeStart = t;
          tile.nextChange = Number.POSITIVE_INFINITY;
        } else {
          tile.nextChange = Number.POSITIVE_INFINITY;
        }
      }
    });

    btsLayerCtx.clearRect(0, 0, w, h);
    btsLayerCtx.save();
    btsLayerCtx.filter = "none";
    const order = [...btsTiles].sort((a, b) => a.id - b.id);
    order.forEach((tile) => {
      const gap = 0;
      const x = tile.c * btsGrid.tileW + gap;
      const y = tile.r * btsGrid.tileH + gap;
      const tw = Math.max(4, btsGrid.tileW - gap * 2);
      const th = Math.max(3, btsGrid.tileH - gap * 2);
      if (tile.fading) {
        const p = Math.min(1, (t - tile.fadeStart) / FADE_MS);
        if (tile.prevImg) {
          btsLayerCtx.globalAlpha = 1 - p;
          btsDrawTile(btsLayerCtx, tile.prevImg, x, y, tw, th);
        }
        btsLayerCtx.globalAlpha = Math.max(p, 0.001);
        btsDrawTile(btsLayerCtx, tile.img, x, y, tw, th);
        btsLayerCtx.globalAlpha = 1;
        if (p >= 1) tile.fading = false;
      } else {
        btsDrawTile(btsLayerCtx, tile.img, x, y, tw, th);
      }
    });
    btsLayerCtx.restore();
    btsLayerCtx.filter = "none";

    btsCtx.drawImage(btsLayerCanvas, 0, 0);
    // Reliable desaturation pass (works even where canvas filter grayscale is inconsistent).
    btsCtx.globalCompositeOperation = "saturation";
    btsCtx.fillStyle = "#808080";
    btsCtx.fillRect(0, 0, w, h);
    btsCtx.globalCompositeOperation = "source-over";
    btsCtx.fillStyle = "rgba(0,0,0,.68)";
    btsCtx.fillRect(0, 0, w, h);
    if (btsPointer.active) {
      btsSpotCtx.clearRect(0, 0, w, h);
      const g = btsSpotCtx.createRadialGradient(btsPointer.x, btsPointer.y, 0, btsPointer.x, btsPointer.y, SPOT_RADIUS);
      g.addColorStop(0, "rgba(255,255,255,.98)");
      g.addColorStop(0.55, "rgba(255,255,255,.45)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      btsSpotCtx.fillStyle = g;
      btsSpotCtx.fillRect(0, 0, w, h);
      btsSpotCtx.globalCompositeOperation = "source-in";
      btsSpotCtx.drawImage(btsLayerCanvas, 0, 0);
      btsSpotCtx.globalCompositeOperation = "source-over";
      btsCtx.drawImage(btsSpotCanvas, 0, 0);
    }

    if (btsPoolIdx.length > 0 && t >= btsWave.nextAt) {
      const oc = Math.floor(Math.random() * btsGrid.cols);
      const or = Math.floor(Math.random() * btsGrid.rows);
      const start = t;
      btsTiles.forEach((tile) => {
        const ring = Math.max(Math.abs(tile.c - oc), Math.abs(tile.r - or));
        const at = start + ring * WAVE_STEP + Math.random() * 65;
        if (at < tile.nextChange) tile.nextChange = at;
      });
      btsWave.nextAt = t + WAVE_PERIOD_MIN + Math.random() * (WAVE_PERIOD_MAX - WAVE_PERIOD_MIN);
    }

    btsCtx.save();
    btsCtx.globalCompositeOperation = "destination-in";
    btsCtx.font = fontStr;
    try {
      btsCtx.letterSpacing = `${lsPx}px`;
    } catch (_) {}
    btsCtx.textAlign = "center";
    btsCtx.textBaseline = "middle";
    btsCtx.lineJoin = "round";
    btsCtx.miterLimit = 4;
    btsCtx.fillStyle = "#fff";
    btsCtx.fillText(BTS_TXT, tx, ty);
    btsCtx.restore();
  };

  const btsIo = new IntersectionObserver(
    ([e]) => {
      btsIoVisible = e.isIntersecting;
      if (btsIoVisible && !document.hidden && !btsRaf) btsRaf = requestAnimationFrame(btsDraw);
      if (!btsIoVisible) {
        cancelAnimationFrame(btsRaf);
        btsRaf = 0;
      }
    },
    { rootMargin: "140px 0px", threshold: 0 },
  );
  btsIo.observe(btsTitleWrap);

  btsPreload();
  const btsStart = () => {
    btsResize();
    btsWave.nextAt = performance.now() + 700;
    cancelAnimationFrame(btsRaf);
    btsRaf = 0;
    const r = btsTitleWrap.getBoundingClientRect();
    if (r.bottom > -80 && r.top < innerHeight + 140 && !document.hidden) {
      btsIoVisible = true;
      btsRaf = requestAnimationFrame(btsDraw);
    }
  };
  document.fonts.ready.then(btsStart).catch(btsStart);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && btsIoVisible && !btsRaf) btsRaf = requestAnimationFrame(btsDraw);
    if (document.hidden) {
      cancelAnimationFrame(btsRaf);
      btsRaf = 0;
    }
  });
  const btsRo = new ResizeObserver(() => {
    btsResize();
  });
  btsRo.observe(btsTitleWrap);
  addEventListener("resize", btsResize);
  btsTitleWrap.addEventListener(
    "pointermove",
    (e) => {
      const r = btsTitleWrap.getBoundingClientRect();
      btsPointer.x = e.clientX - r.left;
      btsPointer.y = e.clientY - r.top;
      btsPointer.active = true;
    },
    { passive: true },
  );
  btsTitleWrap.addEventListener(
    "pointerleave",
    () => {
      btsPointer.active = false;
      btsPointer.x = -1e6;
      btsPointer.y = -1e6;
    },
    { passive: true },
  );

  addEventListener(
    "beforeunload",
    () => {
      btsPreloadCancel = true;
      cancelAnimationFrame(btsRaf);
      btsRo.disconnect();
      btsIo.disconnect();
    },
    { once: true },
  );
}

// ═══ BUILD CHART ═══
const chartEl = document.getElementById('chart');
const maxTopViews = Math.max(...TOP5.map((v) => v.views));
TOP5.forEach((v, i) => {
  const widthPct = Math.max(8, Math.round((v.views / maxTopViews) * 100));
  const el = document.createElement('a');
  el.className = 'br';
  el.href = '#';
  el.setAttribute('data-c', 'view');
  el.onclick = (e) => { e.preventDefault(); openYT(v.id); };
  el.innerHTML = `
    <span class="br-rk">${String(i+1).padStart(2,'0')}</span>
    <span class="br-bar"><span class="br-f" style="--w:${widthPct}%"><span class="br-lbl"><span class="br-counter" data-base="${v.views}"></span> просмотров</span></span></span>
    <span class="br-nfo"><span class="br-art">${v.artist}</span><span class="br-sng"> — ${v.title}</span></span>
  `;
  chartEl.appendChild(el);
});

// Animate chart bars
ScrollTrigger.create({
  trigger: '#chart', start: 'top 80%', once: true,
  onEnter: () => gsap.to('.br-f', { scaleX: 1, duration: 1.3, stagger: .12, ease: 'power3.out' })
});

// Live counter animation
function formatNum(n) { return n.toLocaleString('ru-RU'); }
document.querySelectorAll(".br-counter").forEach((el) => {
  const base = parseInt(el.dataset.base, 10) || 0;
  el.dataset.current = String(base);
  el.textContent = formatNum(base);
  const tick = () => {
    const current = parseInt(el.dataset.current, 10) || base;
    const next = current + (1 + Math.floor(Math.random() * 3));
    el.dataset.current = String(next);
    el.textContent = formatNum(next);
    const wait = 500 + Math.floor(Math.random() * 1000);
    setTimeout(tick, wait);
  };
  setTimeout(tick, 400 + Math.floor(Math.random() * 700));
});

// ═══ BUILD WORKS GRID ═══
const wgrid = document.getElementById('wgrid');
if (wgrid) {
  const canvas = document.createElement("canvas");
  canvas.className = "works-canvas";
  wgrid.innerHTML = "";
  wgrid.appendChild(canvas);

  const navPrev = document.createElement("button");
  navPrev.type = "button";
  navPrev.className = "works-nav works-nav--prev";
  navPrev.setAttribute("aria-label", "Предыдущее изображение");
  navPrev.innerHTML = "<span aria-hidden=\"true\">&#x2039;</span>";

  const navNext = document.createElement("button");
  navNext.type = "button";
  navNext.className = "works-nav works-nav--next";
  navNext.setAttribute("aria-label", "Следующее изображение");
  navNext.innerHTML = "<span aria-hidden=\"true\">&#x203A;</span>";

  const focusLayer = document.createElement("div");
  focusLayer.className = "works-focus-layer";
  const focusBackdrop = document.createElement("button");
  focusBackdrop.type = "button";
  focusBackdrop.className = "works-focus__backdrop";
  focusBackdrop.setAttribute("aria-label", "Закрыть увеличение");
  const focusImg = document.createElement("img");
  focusImg.className = "works-focus__img";
  focusImg.alt = "Увеличенный кадр";
  focusImg.decoding = "sync";
  focusImg.loading = "eager";
  focusImg.setAttribute("fetchpriority", "high");
  focusLayer.appendChild(focusBackdrop);
  focusLayer.appendChild(focusImg);
  focusLayer.appendChild(navPrev);
  focusLayer.appendChild(navNext);
  document.body.appendChild(focusLayer);

  const ctx = canvas.getContext("2d");
  const BASE_TILE_W = 92;
  const BASE_TILE_H = 52;
  // Cursor tile: strongest scale, then each next ring gets half of previous gain.
  const CENTER_SCALE = 2.6;
  const RING1_SCALE = 1 + (CENTER_SCALE - 1) * 0.5;
  const RING2_SCALE = 1 + (CENTER_SCALE - 1) * 0.25;
  const LERP = 0.22;
  const LERP_RETURN = 0.08;
  const FADE_MS = 800;
  const WAVE_STEP = 90;
  const WAVE_PERIOD_MIN = 5000;
  const WAVE_PERIOD_MAX = 9000;
  const TILE_RADIUS = 7;
  const MOSAIC_COUNT = 355;
  const SELECT_SCALE = CENTER_SCALE * 2;
  const NAV_OFFSET = 64;
  const NAV_HALF = 24;
  const FOCUS_MARGIN = 24;
  const SRC = (i) => absAsset(`assets/assents/images_mosaic/img${i}.jpg`);
  const SRC_HQ = (i) => absAsset(`assets/assents/images/img${i}.jpg`);

  const pointer = { x: -1e6, y: -1e6 };
  let selectedTileId = -1;
  let selectedSeq = null;
  let focusOpen = false;
  const grid = { cols: 0, rows: 0, tileW: BASE_TILE_W, tileH: BASE_TILE_H };
  const wave = { nextAt: 0 };
  const tiles = [];
  const loadedBySeq = new Map();
  const poolSeq = [];

  const perfLevel = (() => {
    const cores = navigator.hardwareConcurrency || 4;
    const mem = navigator.deviceMemory || 4;
    if (cores < 4 || mem < 4) return "low";
    if (cores < 8 || mem < 8) return "medium";
    return "high";
  })();
  /** Must match `resize()` — used to map backing-store pixels to CSS px in `draw()`. */
  let worksDpr = 1;
  const targetFps = perfLevel === "low" ? 30 : perfLevel === "medium" ? 45 : 60;
  const frameInterval = 1000 / targetFps;

  const sound = { lastAt: 0, lastId: -1 };
  const playMoveSound = async (pan = 0) => {
    const now = performance.now();
    if (now - sound.lastAt < 90) return;
    sound.lastAt = now;
    await unlockSiteAudio();
    const ac = await getUiAudio();
    if (!ac) return;
    if (ac.state !== "running") await ac.resume().catch(() => {});
    const t0 = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    const p = ac.createStereoPanner ? ac.createStereoPanner() : null;
    osc.type = "triangle";
    osc.frequency.setValueAtTime(680, t0);
    osc.frequency.exponentialRampToValueAtTime(1220, t0 + 0.08);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.04, t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.12);
    if (p) {
      p.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), t0);
      osc.connect(gain).connect(p).connect(ac.destination);
    } else {
      osc.connect(gain).connect(ac.destination);
    }
    osc.start(t0);
    osc.stop(t0 + 0.13);
  };

  const roundedRect = (x, y, w, h, r) => {
    const rr = Math.max(0, Math.min(r, Math.min(w, h) / 2));
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.lineTo(x + w - rr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
    ctx.lineTo(x + w, y + h - rr);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
    ctx.lineTo(x + rr, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
    ctx.lineTo(x, y + rr);
    ctx.quadraticCurveTo(x, y, x + rr, y);
    ctx.closePath();
  };
  const drawCoverRounded = (img, dx, dy, dw, dh, s = 1) => {
    const source = (img && img.complete && img.naturalWidth) ? img : null;
    if (!source) {
      ctx.fillStyle = "#0d0d0d";
      roundedRect(dx, dy, dw, dh, TILE_RADIUS);
      ctx.fill();
      return;
    }
    const cx = dx + dw / 2;
    const cy = dy + dh / 2;
    const drawW = dw * s;
    const drawH = dh * s;
    const scale = Math.max(drawW / source.naturalWidth, drawH / source.naturalHeight);
    const sw = drawW / scale;
    const sh = drawH / scale;
    const sx = (source.naturalWidth - sw) * 0.5;
    const sy = (source.naturalHeight - sh) * 0.5;
    ctx.save();
    roundedRect(cx - drawW / 2, cy - drawH / 2, drawW, drawH, TILE_RADIUS * Math.max(1, s * 0.9));
    ctx.clip();
    ctx.drawImage(source, sx, sy, sw, sh, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
    ctx.restore();
  };

  const shuffledSeqs = (() => {
    const arr = Array.from({ length: MOSAIC_COUNT }, (_, i) => i + 1);
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  })();
  const usedSeqsExcluding = (excludeTile) => {
    const used = new Set();
    tiles.forEach((t) => {
      if (t !== excludeTile && t.seq) used.add(t.seq);
    });
    return used;
  };
  const assignLoadedToFirstEmptyTile = (seq, img) => {
    const used = usedSeqsExcluding(null);
    if (used.has(seq)) return;
    const empty = tiles.find((t) => !t.seq);
    if (!empty) return;
    empty.img = img;
    empty.seq = seq;
    empty.nextChange = performance.now() + 3500 + Math.random() * 2500;
  };
  const refillTilesFromLoadedPool = () => {
    for (let i = 0; i < poolSeq.length; i += 1) {
      const seq = poolSeq[i];
      const img = loadedBySeq.get(seq);
      if (img) assignLoadedToFirstEmptyTile(seq, img);
      if (!tiles.some((t) => !t.seq)) break;
    }
  };
  const pickUniqueForTile = (tile) => {
    if (!poolSeq.length) return null;
    const used = usedSeqsExcluding(tile);
    for (let attempt = 0; attempt < 24; attempt += 1) {
      const seq = poolSeq[Math.floor(Math.random() * poolSeq.length)];
      if (seq && seq !== tile.seq && !used.has(seq)) {
        const img = loadedBySeq.get(seq);
        if (img) return { img, seq };
      }
    }
    for (let i = 0; i < poolSeq.length; i += 1) {
      const seq = poolSeq[i];
      if (seq && seq !== tile.seq && !used.has(seq)) {
        const img = loadedBySeq.get(seq);
        if (img) return { img, seq };
      }
    }
    return null;
  };
  const hideNav = () => {
    navPrev.classList.remove("is-visible");
    navNext.classList.remove("is-visible");
  };
  const closeFocus = () => {
    focusOpen = false;
    selectedTileId = -1;
    selectedSeq = null;
    focusLayer.classList.remove("is-open");
    hideNav();
  };
  const positionFocusForTile = (tile) => {
    if (!focusOpen || !tile) return;
    const tileRatio = grid.tileW / Math.max(1, grid.tileH);
    let fw = Math.max(grid.tileW * 9.5, 560);
    fw = Math.min(fw, window.innerWidth - FOCUS_MARGIN * 2);
    let fh = fw / tileRatio;
    const maxH = window.innerHeight - FOCUS_MARGIN * 2;
    if (fh > maxH) {
      fh = maxH;
      fw = fh * tileRatio;
    }

    const left = (window.innerWidth - fw) * 0.5;
    const top = (window.innerHeight - fh) * 0.5;
    focusImg.style.left = `${left}px`;
    focusImg.style.top = `${top}px`;
    focusImg.style.width = `${fw}px`;
    focusImg.style.height = `${fh}px`;

    const y = window.innerHeight * 0.5;
    const prevX = Math.max(NAV_HALF + 8, left - NAV_OFFSET);
    const nextX = Math.min(window.innerWidth - NAV_HALF - 8, left + fw + NAV_OFFSET);
    navPrev.style.left = `${prevX}px`;
    navPrev.style.top = `${y}px`;
    navNext.style.left = `${nextX}px`;
    navNext.style.top = `${y}px`;
    navPrev.classList.add("is-visible");
    navNext.classList.add("is-visible");
  };
  const openFocusForTile = (tile) => {
    if (!tile) return;
    selectedTileId = tile.id;
    selectedSeq = tile.seq || poolSeq[0] || null;
    tile.nextChange = Number.POSITIVE_INFINITY;
    if (selectedSeq) {
      focusImg.onerror = () => { focusImg.onerror = null; focusImg.src = SRC(selectedSeq); };
      focusImg.src = SRC_HQ(selectedSeq);
    }
    focusOpen = true;
    focusLayer.classList.add("is-open");
    positionFocusForTile(tile);
  };
  const getLoadedSeqs = () => [...new Set(poolSeq)].sort((a, b) => a - b);
  const cycleSelectedTileImage = (dir) => {
    if (selectedTileId < 0) return;
    const tile = tiles[selectedTileId];
    if (!tile) return;
    const seqs = getLoadedSeqs();
    if (seqs.length < 2) return;
    let idx = seqs.indexOf(tile.seq);
    if (idx < 0) idx = 0;
    const nextIdx = (idx + dir + seqs.length) % seqs.length;
    const nextSeq = seqs[nextIdx];
    const nextImg = loadedBySeq.get(nextSeq);
    if (!nextImg) return;
    tile.img = nextImg;
    tile.seq = nextSeq;
    selectedSeq = nextSeq;
    tile.prevImg = null;
    tile.fading = false;
    tile.nextChange = Number.POSITIVE_INFINITY;
    focusImg.onerror = () => { focusImg.onerror = null; focusImg.src = SRC(nextSeq); };
    focusImg.src = SRC_HQ(nextSeq);
    positionFocusForTile(tile);
  };
  const initTiles = () => {
    const total = grid.cols * grid.rows;
    tiles.length = 0;
    for (let id = 0; id < total; id += 1) {
      tiles.push({
        id,
        c: id % grid.cols,
        r: Math.floor(id / grid.cols),
        img: null,
        seq: null,
        clip: WORKS[Math.floor(Math.random() * WORKS.length)],
        prevImg: null,
        fading: false,
        fadeStart: 0,
        scale: 1,
        nextChange: Number.POSITIVE_INFINITY,
      });
    }
  };
  const resize = () => {
    const rect = wgrid.getBoundingClientRect();
    const dpr = perfLevel === "low" ? 1 : Math.min(2, window.devicePixelRatio || 1);
    worksDpr = dpr;
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    grid.cols = Math.max(1, Math.ceil(rect.width / BASE_TILE_W));
    grid.rows = Math.max(1, Math.ceil(rect.height / BASE_TILE_H));
    grid.tileW = Math.ceil(rect.width / grid.cols);
    grid.tileH = Math.ceil(rect.height / grid.rows);
    initTiles();
    refillTilesFromLoadedPool();
    if (selectedTileId >= 0 && tiles[selectedTileId] && focusOpen) positionFocusForTile(tiles[selectedTileId]);
    else hideNav();
  };
  const preloadStream = () => {
    let i = 0;
    let active = 0;
    let cancelled = false;
    const concurrency = perfLevel === "low" ? 4 : perfLevel === "medium" ? 8 : 12;
    const pump = () => {
      while (!cancelled && active < concurrency && i < shuffledSeqs.length) {
        const seq = shuffledSeqs[i++];
        active += 1;
        const img = new Image();
        img.decoding = "async";
        img.loading = "eager";
        img.onload = () => {
          if (!cancelled) {
            loadedBySeq.set(seq, img);
            poolSeq.push(seq);
            assignLoadedToFirstEmptyTile(seq, img);
          }
          active -= 1;
          pump();
        };
        img.onerror = () => {
          active -= 1;
          pump();
        };
        img.src = SRC(seq);
      }
    };
    pump();
    return () => { cancelled = true; };
  };

  let raf = 0;
  let lastFrame = 0;
  let worksIoVisible = false;
  const draw = (t) => {
    if (document.hidden || !worksIoVisible) {
      raf = 0;
      return;
    }
    raf = requestAnimationFrame(draw);
    if (t - lastFrame < frameInterval) return;
    lastFrame = t;

    const w = canvas.width / worksDpr;
    const h = canvas.height / worksDpr;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#090909";
    ctx.fillRect(0, 0, w, h);

    const mc = Math.floor(pointer.x / grid.tileW);
    const mr = Math.floor(pointer.y / grid.tileH);
    const hoveredId = (mc >= 0 && mr >= 0 && mc < grid.cols && mr < grid.rows) ? (mr * grid.cols + mc) : -1;
    if (hoveredId !== sound.lastId && hoveredId >= 0) {
      const pan = grid.cols > 1 ? ((mc / (grid.cols - 1)) * 2 - 1) : 0;
      playMoveSound(pan);
      sound.lastId = hoveredId;
    }

    tiles.forEach((tile) => {
      const isSelected = tile.id === selectedTileId;
      const ring = hoveredId >= 0 ? Math.max(Math.abs(tile.c - mc), Math.abs(tile.r - mr)) : 9999;
      let target = 1;
      if (isSelected) target = focusOpen ? 1 : SELECT_SCALE;
      else if (ring === 0) target = CENTER_SCALE;
      else if (ring === 1) target = RING1_SCALE;
      else if (ring === 2) target = RING2_SCALE;
      tile.scale += (target - tile.scale) * ((hoveredId >= 0 || isSelected) ? LERP : LERP_RETURN);

      if (!isSelected && t >= tile.nextChange) {
        const pick = pickUniqueForTile(tile);
        if (pick && pick.img && pick.img !== tile.img) {
          tile.prevImg = tile.img;
          tile.img = pick.img;
          tile.seq = pick.seq;
          tile.clip = WORKS[Math.floor(Math.random() * WORKS.length)];
          tile.fading = true;
          tile.fadeStart = t;
          tile.nextChange = t + 4200 + Math.random() * 3600;
        } else {
          tile.nextChange = t + 120 + Math.random() * 300;
        }
      }
    });

    // Draw smaller tiles first so enlarged tiles stay on top.
    const order = [...tiles].sort((a, b) => a.scale - b.scale);
    order.forEach((tile) => {
      const x = tile.c * grid.tileW;
      const y = tile.r * grid.tileH;
      if (tile.fading) {
        const p = Math.min(1, (t - tile.fadeStart) / FADE_MS);
        if (tile.prevImg) {
          ctx.globalAlpha = 1 - p;
          drawCoverRounded(tile.prevImg, x, y, grid.tileW - 1, grid.tileH - 1, tile.scale);
        }
        ctx.globalAlpha = p;
        drawCoverRounded(tile.img, x, y, grid.tileW - 1, grid.tileH - 1, tile.scale);
        ctx.globalAlpha = 1;
        if (p >= 1) tile.fading = false;
      } else {
        drawCoverRounded(tile.img, x, y, grid.tileW - 1, grid.tileH - 1, tile.scale);
      }
    });

    if (poolSeq.length > 0 && t >= wave.nextAt) {
      const oc = Math.floor(Math.random() * grid.cols);
      const or = Math.floor(Math.random() * grid.rows);
      const start = t;
      tiles.forEach((tile) => {
        if (tile.id === selectedTileId) return;
        const ring = Math.max(Math.abs(tile.c - oc), Math.abs(tile.r - or));
        const at = start + ring * WAVE_STEP + Math.random() * 120;
        if (at < tile.nextChange) tile.nextChange = at;
      });
      wave.nextAt = t + WAVE_PERIOD_MIN + Math.random() * (WAVE_PERIOD_MAX - WAVE_PERIOD_MIN);
    }

    if (selectedTileId >= 0 && tiles[selectedTileId] && focusOpen) positionFocusForTile(tiles[selectedTileId]);
    else hideNav();
  };

  const stopPreload = preloadStream();
  const worksIo = new IntersectionObserver(
    ([e]) => {
      worksIoVisible = e.isIntersecting;
      if (worksIoVisible && !document.hidden && !raf) raf = requestAnimationFrame(draw);
      if (!worksIoVisible) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    { rootMargin: "160px 0px", threshold: 0 },
  );
  worksIo.observe(wgrid);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && worksIoVisible && !raf) raf = requestAnimationFrame(draw);
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  });
  resize();
  wave.nextAt = performance.now() + 900;
  {
    const wr = wgrid.getBoundingClientRect();
    worksIoVisible = wr.bottom > -160 && wr.top < innerHeight + 160;
    if (worksIoVisible && !document.hidden) raf = requestAnimationFrame(draw);
  }

  const onMove = (e) => {
    const rect = wgrid.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
  };
  const onLeave = () => {
    pointer.x = -1e6;
    pointer.y = -1e6;
    sound.lastId = -1;
  };
  const onClick = (e) => {
    const rect = wgrid.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const mc = Math.floor(x / grid.tileW);
    const mr = Math.floor(y / grid.tileH);
    if (mc < 0 || mr < 0 || mc >= grid.cols || mr >= grid.rows) return;
    const tile = tiles[mr * grid.cols + mc];
    if (!tile) return;
    pointer.x = x;
    pointer.y = y;
    openFocusForTile(tile);
  };
  const onNavPrev = (e) => {
    e.stopPropagation();
    cycleSelectedTileImage(-1);
  };
  const onNavNext = (e) => {
    e.stopPropagation();
    cycleSelectedTileImage(1);
  };
  const onFocusKey = (e) => {
    if (!focusOpen) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      cycleSelectedTileImage(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      cycleSelectedTileImage(1);
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeFocus();
    }
  };
  wgrid.addEventListener("mousemove", onMove, { passive: true });
  wgrid.addEventListener("mouseleave", onLeave, { passive: true });
  wgrid.addEventListener("click", onClick);
  navPrev.addEventListener("click", onNavPrev);
  navNext.addEventListener("click", onNavNext);
  focusBackdrop.addEventListener("click", closeFocus);
  document.addEventListener("keydown", onFocusKey);
  addEventListener("resize", resize);
  addEventListener("scroll", () => {
    if (selectedTileId >= 0 && tiles[selectedTileId] && focusOpen) positionFocusForTile(tiles[selectedTileId]);
  }, { passive: true });

  addEventListener("beforeunload", () => {
    cancelAnimationFrame(raf);
    stopPreload();
    worksIo.disconnect();
    navPrev.removeEventListener("click", onNavPrev);
    navNext.removeEventListener("click", onNavNext);
    focusBackdrop.removeEventListener("click", closeFocus);
    document.removeEventListener("keydown", onFocusKey);
    focusLayer.remove();
  }, { once: true });
}

// ═══ BUILD ADS ═══
const advsEl = document.getElementById('advs');
const THUMB_REV = "2026-04-26-1";
const probeImageSize = (url) =>
  new Promise((resolve) => {
    if (!url) return resolve(null);
    const img = new Image();
    let done = false;
    const finish = (result) => {
      if (done) return;
      done = true;
      resolve(result);
    };
    const timer = setTimeout(() => finish(null), 3500);
    img.onload = () => {
      clearTimeout(timer);
      finish({
        url,
        w: img.naturalWidth || 0,
        h: img.naturalHeight || 0,
      });
    };
    img.onerror = () => {
      clearTimeout(timer);
      finish(null);
    };
    img.decoding = "async";
    img.loading = "eager";
    img.src = url;
  });
const pickBestThumb = async (urls) => {
  const uniq = [...new Set(urls.filter(Boolean))];
  if (!uniq.length) return "";
  const results = await Promise.all(uniq.map(probeImageSize));
  const valid = results.filter(Boolean);
  if (!valid.length) return uniq[0];
  valid.sort((a, b) => (b.w * b.h) - (a.w * a.h));
  return valid[0].url;
};
const setAdThumbById = (id, url, fallbackUrl = "") => {
  if (!id || !url) return;
  const finalUrl = `${url}${url.includes("?") ? "&" : "?"}v=${THUMB_REV}`;
  const finalFallback = fallbackUrl
    ? `${fallbackUrl}${fallbackUrl.includes("?") ? "&" : "?"}v=${THUMB_REV}`
    : "";
  document.querySelectorAll(`.adv[data-id="${id}"] img`).forEach((img) => {
    if (finalFallback) {
      img.onerror = () => {
        if (img.src !== finalFallback) img.src = finalFallback;
      };
    } else {
      img.onerror = null;
    }
    img.src = finalUrl;
  });
};
const upscaleCanonicalVimeoThumb = (thumbUrl, size = "1920") => {
  if (!thumbUrl) return "";
  // Keep the same frame hash from Vimeo and only bump its requested size.
  return thumbUrl.replace(/_(\d+x\d+|\d+)(\?|$)/, `_${size}$2`);
};
const resolveVimeoThumb = async (id, imgEl) => {
  if (!id || !imgEl) return;
  try {
    const url = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(`https://vimeo.com/${id}`)}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      const bestFallback = await pickBestThumb([
        `https://vumbnail.com/${id}_large.jpg`,
        `https://vumbnail.com/${id}.jpg`,
      ]);
      if (bestFallback) setAdThumbById(id, bestFallback);
      return;
    }
    const data = await res.json();
    const thumb = data?.thumbnail_url;
    if (thumb) {
      const bestFromCanonical = await pickBestThumb([
        upscaleCanonicalVimeoThumb(thumb, "1920"),
        upscaleCanonicalVimeoThumb(thumb, "1280"),
        upscaleCanonicalVimeoThumb(thumb, "960"),
        upscaleCanonicalVimeoThumb(thumb, "640"),
      ]);
      // Keep the exact Vimeo frame, but in max available resolution.
      if (bestFromCanonical) {
        setAdThumbById(id, bestFromCanonical, thumb);
        return;
      }
      setAdThumbById(id, thumb);
      return;
    }
    const bestFallback = await pickBestThumb([
      `https://vumbnail.com/${id}_large.jpg`,
      `https://vumbnail.com/${id}.jpg`,
    ]);
    if (bestFallback) setAdThumbById(id, bestFallback);
  } catch (_) {}
};
ADS.forEach((a, i) => {
  const el = document.createElement('a');
  el.className = 'adv';
  el.href = "#";
  el.setAttribute("data-c", "native");
  el.dataset.id = a.id;
  el.innerHTML = `<div class="adv-p"><img src="https://vumbnail.com/${a.id}_large.jpg?v=${THUMB_REV}" alt="${a.title}" loading="lazy"><span class="adv-play" aria-hidden="true"></span></div><div class="adv-m"><span class="adv-n">${String(i + 1).padStart(2, "0")}</span><span class="adv-t">${a.title}</span></div>`;
  const thumbImg = el.querySelector("img");
  if (thumbImg) resolveVimeoThumb(a.id, thumbImg);
  advsEl.appendChild(el);
});
{
  const viewport = document.getElementById("advs-viewport");
  const track = document.getElementById("advs");
  if (viewport && track) {
    const originals = Array.from(track.children);
    originals.forEach((node) => track.appendChild(node.cloneNode(true)));
    let singleWidth = track.scrollWidth / 2;
    let isDragging = false;
    let dragged = false;
    let interactingUntil = 0;
    let startX = 0;
    let startScrollLeft = 0;
    let downCardId = "";
    let raf = 0;
    let last = 0;
    const SPEED = 0.08; // px/ms
    const normalize = () => {
      if (!singleWidth) return;
      if (viewport.scrollLeft >= singleWidth) viewport.scrollLeft -= singleWidth;
      if (viewport.scrollLeft < 0) viewport.scrollLeft += singleWidth;
    };
    const tick = (t) => {
      raf = requestAnimationFrame(tick);
      if (!last) last = t;
      const dt = Math.min(34, t - last);
      last = t;
      if (!isDragging && performance.now() >= interactingUntil) {
        viewport.scrollLeft += SPEED * dt;
        normalize();
      }
    };
    const onDown = (e) => {
      isDragging = true;
      dragged = false;
      startX = e.clientX;
      startScrollLeft = viewport.scrollLeft;
      downCardId = e.target instanceof Element ? (e.target.closest(".adv")?.dataset.id || "") : "";
      viewport.setPointerCapture(e.pointerId);
      interactingUntil = performance.now() + 700;
      viewport.style.cursor = "grabbing";
    };
    const onMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 6) dragged = true;
      viewport.scrollLeft = startScrollLeft - dx;
      normalize();
    };
    const onUp = () => {
      if (!isDragging) return;
      isDragging = false;
      interactingUntil = performance.now() + 500;
      viewport.style.cursor = "grab";
      if (dragged && advsEl) {
        advsEl.dataset.dragSuppress = "1";
        setTimeout(() => {
          if (advsEl) advsEl.dataset.dragSuppress = "0";
        }, 120);
      } else if (downCardId) {
        openYT(downCardId);
      }
      downCardId = "";
    };
    viewport.addEventListener("pointerdown", onDown);
    viewport.addEventListener("pointermove", onMove);
    viewport.addEventListener("pointerup", onUp);
    viewport.addEventListener("pointercancel", onUp);
    viewport.addEventListener(
      "wheel",
      (e) => {
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY * 0.85;
        if (!delta) return;
        e.preventDefault();
        viewport.scrollLeft += delta;
        normalize();
        interactingUntil = performance.now() + 900;
      },
      { passive: false },
    );
    advsEl?.addEventListener("click", (e) => {
      const card = e.target instanceof Element ? e.target.closest(".adv") : null;
      if (!card) return;
      e.preventDefault();
      if (advsEl.dataset.dragSuppress === "1") return;
      const id = card.dataset.id;
      if (id) openYT(id);
    });
    addEventListener(
      "resize",
      () => {
        singleWidth = track.scrollWidth / 2;
        normalize();
      },
      { passive: true },
    );
    raf = requestAnimationFrame(tick);
    addEventListener("beforeunload", () => cancelAnimationFrame(raf), { once: true });
  }
}

// ═══ BUILD BRAND LOGOS ═══
const logosEl = document.getElementById('logos');
BRANDS.forEach(b => {
  const el = document.createElement('a');
  el.className = b.vid ? 'logo-c logo-link' : 'logo-c';
  if (b.name === "ЯНДЕКС ТАКСИ") el.classList.add("logo-yandex-taxi");
  if (b.name === "ЯНДЕКС АЛИСА") el.classList.add("logo-yandex-alisa");
  if (b.name === "ЯНДЕКС МАРКЕТ") el.classList.add("logo-yandex-market");
  if (b.name === "ELECTROLUX") el.classList.add("logo-electrolux");
  if (b.name === "CHEETOS") el.classList.add("logo-cheetos");
  if (b.name === "LEON") el.classList.add("logo-leon");
  if (b.name === "RENDEZ-VOUS") el.classList.add("logo-rendezvous");
  if (b.name === "585 ЗОЛОТОЙ") el.classList.add("logo-585");
  if (b.name === "FRESH BAR") el.classList.add("logo-fresh-bar");
  if (b.name === "DEONICA") el.classList.add("logo-deonica");
  if (b.name === "MODELFORM") el.classList.add("logo-modelform");
  if (b.name === "SOVA") el.classList.add("logo-sova");
  if (b.name === "DARVOL") el.classList.add("logo-darvol");
  if (b.name === "RAVON") el.classList.add("logo-ravon");
  if (b.name === "BORK") el.classList.add("logo-bork");
  if (b.name === "RUTUBE") el.classList.add("logo-rutube");
  if (b.name === "REN TV") el.classList.add("logo-ren-tv");
  if (b.name === "РОССЕЛЬХОЗБАНК") el.classList.add("logo-rosselkhozbank");
  if (b.name === "ТНТ") el.classList.add("logo-tnt");
  if (b.name === "СТС") el.classList.add("logo-sts");
  if (b.name === "ПОЛИОКСИДОНИЙ") el.classList.add("logo-polioxidoniy");
  if (b.name === "АРТНЕО") el.classList.add("logo-artneo");
  el.href = b.vid ? '#' : 'javascript:void(0)';
  if (b.vid) {
    el.setAttribute('data-c', 'native');
    el.onclick = (e) => { e.preventDefault(); openYT(b.vid, b.startAt || 0); };
  }
  el.innerHTML = `<span>${b.name}</span>`;
  logosEl.appendChild(el);
});

// ═══ STILLS REVEAL ═══
gsap.utils.toArray('.sf').forEach((el, i) => ScrollTrigger.create({
  trigger: el, start: 'top 90%', once: true,
  onEnter: () => setTimeout(() => el.classList.add('rv'), i * 50)
}));

// ═══ MODALS ═══
function openYT(id, startAt = 0) {
  const ytStarts = {
    tV_qKmkQyB0: 34, // Yandex Taxi
    VrpE2Qdxbtg: 25, // Electrolux
    on3PC01ZUoo: 11, // Yandex Alisa
  };
  const startSec = startAt || ytStarts[id] || 0;
  const isVimeo = /^\d+$/.test(id);
  const ytStart = startSec ? `&start=${startSec}` : "";
  const src = isVimeo
    ? `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0`
    : `https://www.youtube.com/embed/${id}?autoplay=1&rel=0${ytStart}`;
  document.getElementById('mif').src = src;
  document.getElementById('modal').classList.add('open');
}
function closeM() {
  document.getElementById('mif').src = '';
  document.getElementById('modal').classList.remove('open');
}
function openBts() { document.getElementById('bts-modal').classList.add('open'); }
function closeBts() {
  closeBtsViewer();
  document.getElementById('bts-modal').classList.remove('open');
}
function openBtsViewer(src) {
  const viewer = document.getElementById("bts-viewer");
  const img = document.getElementById("bts-viewer-img");
  if (!viewer || !img) return;
  img.src = src;
  viewer.classList.add("open");
}
function closeBtsViewer() {
  const viewer = document.getElementById("bts-viewer");
  const img = document.getElementById("bts-viewer-img");
  if (!viewer || !img) return;
  viewer.classList.remove("open");
  img.src = "";
}

function updateShowreelPauseUI() {
  const v = document.getElementById("showreel-player");
  const btn = document.getElementById("showreel-pause");
  if (!v || !btn) return;
  const paused = v.paused;
  btn.classList.toggle("is-paused", paused);
  if (paused) {
    btn.setAttribute("aria-pressed", "true");
    btn.setAttribute("aria-label", "Play");
  } else {
    btn.setAttribute("aria-pressed", "false");
    btn.setAttribute("aria-label", "Пауза");
  }
}

const SHOWREEL_VIMEO_ID = (document.body?.dataset.showreelVimeo || "").trim();

function openShowreel() {
  if (SHOWREEL_VIMEO_ID) {
    openYT(SHOWREEL_VIMEO_ID);
    return;
  }
  const modal = document.getElementById("showreel-modal");
  const wrap = document.getElementById("showreel-bubble-wrap");
  const bubble = document.getElementById("showreel-bubble");
  const v = document.getElementById("showreel-player");
  const feDisp = document.getElementById("feDisp");
  if (!modal || !wrap || !bubble || !v) return;
  __bgReelResumeSuppressed = true;
  if (!v.src) {
    v.src = absAsset("assets/video/showreel2025_small_1.mp4");
    v.load();
  }
  v.currentTime = 0;
  v.muted = false;
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
  const brStart = "58% 42% 38% 62% / 48% 55% 45% 52%";
  gsap.set(wrap, { scale: 0.1, opacity: 0, transformOrigin: "50% 50%" });
  gsap.set(bubble, { borderRadius: brStart });
  if (feDisp) feDisp.setAttribute("scale", "0");
  const tOpen = gsap.timeline({ defaults: { ease: "expo.out" } });
  tOpen.to(
    wrap,
    { scale: 1, opacity: 1, duration: 0.92 },
    0,
  );
  tOpen.to(
    bubble,
    { borderRadius: "20px", duration: 0.9, ease: "elastic.out(0.75, 0.38)" },
    0.04,
  );
  if (feDisp) {
    tOpen.fromTo(
      feDisp,
      { attr: { scale: 0.5 } },
      { attr: { scale: 5.4 }, duration: 0.95, ease: "expo.out" },
      0.05,
    );
  }
  const p = v.play();
  if (p) p.catch(() => { v.muted = true; v.play().catch(() => {}); });
  updateShowreelPauseUI();
}

function closeShowreel() {
  const modal = document.getElementById("showreel-modal");
  if (!modal || !modal.classList.contains("open")) return;
  const v = document.getElementById("showreel-player");
  const wrap = document.getElementById("showreel-bubble-wrap");
  const bubble = document.getElementById("showreel-bubble");
  const feDisp = document.getElementById("feDisp");
  if (v) {
    v.pause();
    v.removeAttribute("src");
    v.load();
  }
  document.body.style.overflow = "";
  if (!wrap) {
    modal.classList.remove("open");
    if (feDisp) feDisp.setAttribute("scale", "0");
    __bgReelResumeSuppressed = false;
    setTimeout(resumeBackgroundReel, 80);
    return;
  }
  gsap.to(wrap, {
    scale: 0.88,
    opacity: 0,
    duration: 0.28,
    ease: "power3.in",
    onComplete: () => {
      modal.classList.remove("open");
      gsap.set(wrap, { clearProps: "all" });
      if (bubble) gsap.set(bubble, { clearProps: "borderRadius" });
      if (feDisp) feDisp.setAttribute("scale", "0");
      __bgReelResumeSuppressed = false;
      setTimeout(resumeBackgroundReel, 80);
    },
  });
}

{
  const showreelBtn = document.getElementById("showreel-btn");
  if (showreelBtn) showreelBtn.addEventListener("click", openShowreel);
  document.getElementById("showreel-modal-close")?.addEventListener("click", (e) => {
    e.stopPropagation();
    closeShowreel();
  });
  const sp = document.getElementById("showreel-pause");
  const pl = document.getElementById("showreel-player");
  if (sp && pl) {
    sp.addEventListener("click", (e) => {
      e.stopPropagation();
      if (pl.paused) pl.play();
      else pl.pause();
      updateShowreelPauseUI();
    });
    pl.addEventListener("play", updateShowreelPauseUI);
    pl.addEventListener("pause", updateShowreelPauseUI);
    pl.addEventListener("ended", updateShowreelPauseUI);
  }
}

// ESC to close modals
addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeShowreel();
    closeM();
    closeBtsViewer();
    closeBts();
  }
});

// ═══ LANG ═══
function sL(l) {
  document.body.classList.toggle('le', l === 'en');
  document.getElementById('bru').classList.toggle('on', l === 'ru');
  document.getElementById('ben').classList.toggle('on', l === 'en');
  const showreelBtn = document.getElementById('showreel-btn');
  if (showreelBtn) {
    showreelBtn.setAttribute('aria-label', l === 'en' ? 'Watch showreel' : 'Смотреть showreel');
  }
}

// ═══ BUBBLES CANVAS ═══
(function() {
  const canvas = document.getElementById('bcanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  let bmx = 0, bmy = 0, pointerInside = false;
  let hoverBubble = null;
  let dragBubble = null;
  const imageCache = new Map();
  const imageObjCache = new Map();
  const all = [
    ...ARTISTS.map((a) => ({ text: a, lab: false, media: artistMediaRef(a) })),
    ...LABELS.map((l) => ({ text: l, lab: true, media: labelMediaRef(l) })),
  ];

  // Bubble radii: labels −20% vs original; top artists = label size; next tier a bit smaller; default unchanged; multi-word default tier slightly larger.
  const BUB_R_LAB_MIN = 42 * 0.8;
  const BUB_R_LAB_SPAN = 15 * 0.8;
  const BUB_R_DEF_MIN = 26;
  const BUB_R_DEF_SPAN = 13.5;
  const BUB_R_TIER_B_OF_LAB = 0.9;
  const BUB_R_MULTIWORD = 1.08;
  const BUB_TIER_A = new Set([
    "Стас Михайлов", "Филипп Киркоров", "Джиган", "Мот", "Макс Корж", "Jony",
  ]);
  const BUB_TIER_B = new Set([
    "Iowa", "Doni", "L\u2019one", "L'one", "Limba", "Niletto", "Гуф", "Мумий Тролль",
  ]);
  /** Доля радиуса, на которую круг может заходить за край canvas (обрезка .artists-inset). */
  const BUBBLE_OUTSIDE_FR = 1 / 3;
  function bubbleAxisBounds(r, len) {
    const o = r * BUBBLE_OUTSIDE_FR;
    const min = r - o;
    const max = len - r + o;
    return { min, max, span: Math.max(0, max - min) };
  }
  function bubbleNameWordCount(s) {
    return String(s).trim().split(/\s+/).filter(Boolean).length;
  }
  function pickBubbleRadius(d) {
    const t = d.text;
    if (d.lab) return BUB_R_LAB_MIN + Math.random() * BUB_R_LAB_SPAN;
    if (BUB_TIER_A.has(t)) return BUB_R_LAB_MIN + Math.random() * BUB_R_LAB_SPAN;
    if (BUB_TIER_B.has(t)) {
      const bMin = BUB_R_LAB_MIN * BUB_R_TIER_B_OF_LAB;
      const bSpan = BUB_R_LAB_SPAN * BUB_R_TIER_B_OF_LAB;
      return bMin + Math.random() * bSpan;
    }
    let r = BUB_R_DEF_MIN + Math.random() * BUB_R_DEF_SPAN;
    if (bubbleNameWordCount(t) >= 2) r *= BUB_R_MULTIWORD;
    return r;
  }

  function artistMediaRef(name) {
    const localBase = `assets/artist/${encodeURIComponent(name)}`;
    const localFallback = `assets/artist/${encodeURIComponent(name.toLowerCase())}`;
    const localLatin = `assets/artist/${encodeURIComponent(
      name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9а-яА-ЯёЁ]+/g, "_")
    )}`;
    const localCandidates = [
      `${localBase}.webp`,
      `${localBase}.jpg`,
      `${localBase}.jpeg`,
      `${localBase}.png`,
      `${localFallback}.webp`,
      `${localFallback}.jpg`,
      `${localFallback}.png`,
      `${localLatin}.webp`,
      `${localLatin}.jpg`,
      `${localLatin}.png`,
    ];
    const wikiTitle = ARTIST_WIKI_TITLES[name];
    if (wikiTitle) return { type: "artist", localCandidates, wikiTitle };
    const keyword = name.split(" ")[0].replace(/[^a-zA-Zа-яА-ЯёЁ']/g, "").toLowerCase();
    const top = TOP5.find((item) => item.artist.toLowerCase().includes(keyword));
    if (top) return { type: "artist", localCandidates, fallback: `https://i.ytimg.com/vi/${top.id}/hqdefault.jpg` };
    const work = WORKS.find((item) => item.a.toLowerCase().includes(keyword));
    if (work) return { type: "artist", localCandidates, fallback: `https://i.ytimg.com/vi/${work.id}/hqdefault.jpg` };
    return { type: "artist", localCandidates, fallback: "assets/img/portrait-suit1.jpg" };
  }

  function labelMediaRef(name) {
    return { type: "label", src: LABEL_LOGOS[name] || "assets/img/portrait-dark.jpg" };
  }

  function canLoadImage(src) {
    return new Promise((resolve) => {
      const resolved = absAsset(src);
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = resolved;
    });
  }

  async function firstAvailable(candidates) {
    for (const src of candidates) {
      // eslint-disable-next-line no-await-in-loop
      if (await canLoadImage(src)) return absAsset(src);
    }
    return null;
  }

  async function resolveMedia(ref) {
    const key = JSON.stringify(ref || {});
    if (imageCache.has(key)) return imageCache.get(key);
    if (!ref) return absAsset("assets/img/portrait-dark.jpg");

    if (ref.type === "label") {
      const out = absAsset(ref.src);
      if (await canLoadImage(out)) {
        imageCache.set(key, out);
        return out;
      }
      const localLabelFallback = absAsset("assets/img/portrait-dark.jpg");
      imageCache.set(key, localLabelFallback);
      return localLabelFallback;
    }

    if (ref.type === "artist") {
      const local = await firstAvailable(ref.localCandidates || []);
      if (local) {
        imageCache.set(key, local);
        return local;
      }
      if (ref.wikiTitle) {
        try {
          const url = `https://ru.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(ref.wikiTitle)}`;
          const data = await fetch(url).then((r) => (r.ok ? r.json() : null));
          const wikiImg = data?.thumbnail?.source || data?.originalimage?.source;
          if (wikiImg) {
            imageCache.set(key, wikiImg);
            return wikiImg;
          }
        } catch {}
      }
      const fallback = absAsset(ref.fallback || "assets/img/portrait-suit1.jpg");
      if (await canLoadImage(fallback)) {
        imageCache.set(key, fallback);
        return fallback;
      }
      const localFallback = absAsset("assets/img/portrait-suit1.jpg");
      imageCache.set(key, localFallback);
      return localFallback;
    }

    return absAsset("assets/img/portrait-dark.jpg");
  }

  async function ensureBubbleImage(bubble) {
    if (!bubble || bubble.mediaReady) return;
    bubble.mediaReady = true;
    const src = await resolveMedia(bubble.media);
    bubble.mediaSrc = src;
    if (!imageObjCache.has(src)) {
      const img = new Image();
      img.src = src;
      imageObjCache.set(src, img);
    }
  }

  function resize() {
    const r = canvas.parentElement.getBoundingClientRect();
    W = canvas.width = r.width * devicePixelRatio;
    H = canvas.height = r.height * devicePixelRatio;
    canvas.style.width = r.width + 'px';
    canvas.style.height = r.height + 'px';
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  resize();
  addEventListener('resize', resize);
  const setPointerFromClient = (clientX, clientY) => {
    const r = canvas.getBoundingClientRect();
    bmx = clientX - r.left;
    bmy = clientY - r.top;
    pointerInside = true;
  };
  canvas.addEventListener('mousemove', e => {
    setPointerFromClient(e.clientX, e.clientY);
    if (dragBubble) {
      dragBubble.x = bmx;
      dragBubble.y = bmy;
      dragBubble.vx *= 0.8;
      dragBubble.vy *= 0.8;
    }
    const prevHover = hoverBubble;
    const nextHover = pickBubble(bmx, bmy);
    hoverBubble = nextHover;
    if (nextHover && nextHover !== prevHover) {
      const rw = W / devicePixelRatio;
      const pan = ((nextHover.x / Math.max(1, rw)) * 2) - 1;
      playUiTick("bubble-hover", pan, 0.88);
    }
    if (hoverBubble) ensureBubbleImage(hoverBubble);
  });
  const onTouchPointer = (e) => {
    if (!e.touches || !e.touches[0]) return;
    setPointerFromClient(e.touches[0].clientX, e.touches[0].clientY);
    if (dragBubble) {
      dragBubble.x = bmx;
      dragBubble.y = bmy;
    }
    const nextHover = pickBubble(bmx, bmy);
    hoverBubble = nextHover;
    if (hoverBubble) ensureBubbleImage(hoverBubble);
  };
  canvas.addEventListener("touchstart", onTouchPointer, { passive: true });
  canvas.addEventListener("touchmove", onTouchPointer, { passive: true });
  canvas.addEventListener("mouseleave", () => {
    pointerInside = false;
    hoverBubble = null;
    dragBubble = null;
  });
  canvas.addEventListener("touchend", () => {
    pointerInside = false;
    hoverBubble = null;
    dragBubble = null;
  }, { passive: true });
  canvas.addEventListener("mousedown", (e) => {
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const target = pickBubble(x, y);
    if (!target) return;
    dragBubble = target;
    canvas.style.cursor = "grabbing";
  });
  addEventListener("mouseup", () => {
    dragBubble = null;
    canvas.style.cursor = "none";
  });

  function bubbleTextLines(s) {
    const words = String(s).trim().split(/\s+/);
    if (words.length < 2) return [s];
    return [words[0], words.slice(1).join(" ")];
  }

  class Bubble {
    constructor(d) {
      this.text = d.text; this.lab = d.lab; this.media = d.media;
      const rw = W / devicePixelRatio, rh = H / devicePixelRatio;
      this.r = pickBubbleRadius(d);
      const bx = bubbleAxisBounds(this.r, rw);
      const by = bubbleAxisBounds(this.r, rh);
      this.x = bx.min + Math.random() * bx.span;
      this.y = by.min + Math.random() * by.span;
      this.vx = (Math.random() - .5) * .18;
      this.vy = (Math.random() - .5) * .18;
      this.pulse = Math.random() * Math.PI * 2;
      this.mediaSrc = null;
      this.mediaReady = false;
    }
    update() {
      const rw = W / devicePixelRatio, rh = H / devicePixelRatio;
      const o = this.r * BUBBLE_OUTSIDE_FR;
      const minX = this.r - o;
      const maxX = rw - this.r + o;
      const minY = this.r - o;
      const maxY = rh - this.r + o;
      const dx = this.x - bmx, dy = this.y - bmy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (pointerInside && dist < 220) {
        const nx = dx / (dist || 1);
        const ny = dy / (dist || 1);
        const f = (220 - dist) / 220;
        // Make bubbles scatter faster from cursor interaction.
        this.vx += nx * (0.32 + f * 1.05);
        this.vy += ny * (0.32 + f * 1.05);
        this.x += nx * f * 2.8;
        this.y += ny * f * 2.8;
      }
      this.vx *= .955; this.vy *= .955;
      const speed = Math.hypot(this.vx, this.vy);
      if (speed > 2.4) {
        const k = 2.4 / speed;
        this.vx *= k;
        this.vy *= k;
      }
      if (dragBubble !== this) {
        this.x += this.vx; this.y += this.vy;
      }
      if (this.x < minX) { this.x = minX; this.vx *= -0.4; }
      if (this.x > maxX) { this.x = maxX; this.vx *= -0.4; }
      if (this.y < minY) { this.y = minY; this.vy *= -0.4; }
      if (this.y > maxY) { this.y = maxY; this.vy *= -0.4; }
      this.pulse += .021;
      for (const b of bubbles) {
        if (b === this) continue;
        const ddx = this.x - b.x, ddy = this.y - b.y;
        const dd = Math.sqrt(ddx * ddx + ddy * ddy);
        const minD = this.r + b.r;
        if (dd < minD && dd > 0) {
          const o = (minD - dd), nx = ddx / dd, ny = ddy / dd;
          this.x += nx * o * .30; this.y += ny * o * .30;
          b.x -= nx * o * .30; b.y -= ny * o * .30;
          this.vx += nx * .045; this.vy += ny * .045;
          b.vx -= nx * .045; b.vy -= ny * .045;
        }
      }
    }
    draw() {
      const dist = Math.sqrt((this.x - bmx) ** 2 + (this.y - bmy) ** 2);
      const hov = pointerInside && (this === hoverBubble || dist < this.r + 20);
      const pulse = .15 + Math.sin(this.pulse) * .08;
      const a = hov ? .8 : pulse;
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.strokeStyle = this.lab ? `rgba(200,164,104,${a})` : `rgba(236,233,225,${a * .7})`;
      ctx.lineWidth = hov ? 1.5 : .5;
      ctx.stroke();
      const hasMedia = hov && this.mediaSrc && imageObjCache.get(this.mediaSrc)?.complete;
      if (hasMedia) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r - 1, 0, Math.PI * 2);
        ctx.clip();
        const img = imageObjCache.get(this.mediaSrc);
        const dw = this.r * 2;
        const dh = this.r * 2;
        const scale = Math.max(dw / img.naturalWidth, dh / img.naturalHeight);
        const sw = dw / scale;
        const sh = dh / scale;
        const sx = (img.naturalWidth - sw) * 0.5;
        const sy = (img.naturalHeight - sh) * 0.5;
        ctx.drawImage(img, sx, sy, sw, sh, this.x - this.r, this.y - this.r, dw, dh);
        ctx.restore();
      } else {
        if (hov) {
          ctx.fillStyle = this.lab ? 'rgba(200,164,104,.08)' : 'rgba(255,255,255,.04)';
          ctx.fill();
        }
        ctx.fillStyle = hov
          ? (this.lab ? '#c8a468' : '#ece9e1')
          : (this.lab ? `rgba(200,164,104,${a + .15})` : `rgba(236,233,225,${a + .1})`);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        const lines = bubbleTextLines(this.text);
        const maxW = this.r * 1.75;
        const maxStackH = this.r * 1.45;
        let fs = Math.min(this.r * .5, 11);
        const fits = () => {
          ctx.font = this.lab ? `${fs}px JetBrains Mono` : `500 ${fs}px Instrument Sans`;
          const w = Math.max(...lines.map((t) => ctx.measureText(t).width), 0);
          const stack = (lines.length - 1) * fs * 1.2;
          return w <= maxW && stack <= maxStackH;
        };
        while (fs > 3 && !fits()) fs -= 0.5;
        const lh = fs * 1.18;
        const y0 = this.y - ((lines.length - 1) * lh) * 0.5;
        lines.forEach((t, i) => {
          ctx.fillText(t, this.x, y0 + i * lh);
        });
      }
      ctx.restore();
    }
  }

  const bubbles = all.map(d => new Bubble(d));

  // Warm up a subset of artist/label images in idle time so circles show photos faster.
  const warmupBubbleMedia = () => {
    const targets = bubbles.slice(0, Math.min(26, bubbles.length));
    let i = 0;
    const pump = () => {
      const end = Math.min(i + 2, targets.length);
      for (; i < end; i += 1) ensureBubbleImage(targets[i]);
      if (i < targets.length) {
        if (window.requestIdleCallback) requestIdleCallback(pump, { timeout: 1800 });
        else setTimeout(pump, 120);
      }
    };
    pump();
  };
  if (window.requestIdleCallback) requestIdleCallback(warmupBubbleMedia, { timeout: 1200 });
  else setTimeout(warmupBubbleMedia, 250);
  function pickBubble(x, y) {
    for (let i = bubbles.length - 1; i >= 0; i -= 1) {
      const b = bubbles[i];
      if (Math.hypot(b.x - x, b.y - y) <= b.r) return b;
    }
    return null;
  }

  let bubbleRaf = 0;
  let bubblesIoVisible = false;
  const bubbleIo = new IntersectionObserver(
    ([e]) => {
      bubblesIoVisible = e.isIntersecting;
      if (bubblesIoVisible && !document.hidden && !bubbleRaf) bubbleRaf = requestAnimationFrame(anim);
      if (!bubblesIoVisible) {
        cancelAnimationFrame(bubbleRaf);
        bubbleRaf = 0;
      }
    },
    { rootMargin: "120px 0px", threshold: 0 },
  );
  bubbleIo.observe(canvas);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && bubblesIoVisible && !bubbleRaf) bubbleRaf = requestAnimationFrame(anim);
    if (document.hidden) {
      cancelAnimationFrame(bubbleRaf);
      bubbleRaf = 0;
    }
  });
  function anim() {
    if (document.hidden || !bubblesIoVisible) {
      bubbleRaf = 0;
      return;
    }
    bubbleRaf = requestAnimationFrame(anim);
    ctx.clearRect(0, 0, W / devicePixelRatio, H / devicePixelRatio);
    bubbles.forEach((b) => b.update());
    bubbles.forEach((b) => b.draw());
  }
  {
    const r0 = canvas.getBoundingClientRect();
    bubblesIoVisible = r0.bottom > -100 && r0.top < innerHeight + 120;
    if (bubblesIoVisible && !document.hidden) bubbleRaf = requestAnimationFrame(anim);
  }
})();
