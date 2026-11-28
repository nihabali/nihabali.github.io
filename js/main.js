(() => {
  const D = window.DATA, S = D.site, U = S.ui, P = D.personal, IC = D.icons || {}, PALS = window.PALETTES || ["green"], ENV = window.ENV || {}, API = D.api || {};
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; };
  const sess = (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) {} };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches, root = document.documentElement;
  let lang = store("lang") || S.defaultLang, animeMap, animeTried = false, movieData, movieTried = false, animeData, musicData, typedState = 0, typedIdx = 0, typedLang = "", typeToken = 0, galTimer, spy, revealIO;
  const tr = v => (v && typeof v === "object" ? v[lang] || v.en || "" : v || "");
  const on = id => S.enabledSections.includes(id);
  const icon = n => (IC[n] ? `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${IC[n]}"/></svg>` : "");
  const sec = (id, body) => `<section id="${id}" class="rv"><div class="wrap"><h2>${esc(tr(U.nav[id]))}</h2>${body}</div></section>`;

  const cookie = () => {
    let d = "";
    for (let i = 0; i <= 360; i++) { const a = i / 360 * 2 * Math.PI, r = .5 * (.93 + .07 * Math.cos(9 * a)); d += (i ? "L" : "M") + (.5 + r * Math.cos(a)).toFixed(4) + " " + (.5 + r * Math.sin(a)).toFixed(4); }
    return `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><clipPath id="cookie" clipPathUnits="objectBoundingBox"><path d="${d}Z"/></clipPath></defs></svg>`;
  };

  const chunk = a => { if (!a.length) return []; const n = Math.ceil(a.length / 5), b = Math.floor(a.length / n), x = a.length % n, o = []; let i = 0; for (let k = 0; k < n; k++) { const s = b + (k < x ? 1 : 0); o.push(a.slice(i, i + s)); i += s; } return o; };
  const row = (href, img, title, sub, label) => `<a class="row" href="${esc(href)}" target="_blank" rel="noopener" aria-label="${esc(label)}">${img ? `<img class="rimg" src="${esc(img)}" alt="" loading="lazy">` : '<span class="rimg"></span>'}<span class="rt"><strong>${esc(title)}</strong>${sub ? ` <span class="sub">– ${esc(sub)}</span>` : ""}</span>${icon("arrow-top-right")}</a>`;
  const headOf = (title, sub, url) => `<h3>${esc(title)}${sub ? ` <span class="sub">· ${esc(sub)}</span>` : ""}</h3>${url ? `<a class="openl" href="${esc(url)}" target="_blank" rel="noopener">${esc(tr(U.openPlaylist))} ${icon("open-in-new")}</a>` : ""}`;
  const pcards = (rows, head = "") => chunk(rows).map(g => `<div class="pcard card"><div class="ch">${head}</div><div class="rows">${g.join("")}</div></div>`);
  const car = (id, cards, label) => `<div class="car"><div class="car-h"><div class="slider-b"><button class="btn small ib" type="button" data-slide="${id}" data-dir="-1" aria-label="${esc(tr(U.prev))}">${icon("chevron-left")}</button><button class="btn small ib" type="button" data-slide="${id}" data-dir="1" aria-label="${esc(tr(U.next))}">${icon("chevron-right")}</button></div></div><div class="track" id="${id}" tabindex="0" role="region" aria-roledescription="carousel" aria-label="${esc(label)}">${cards.join("")}</div><div class="dots">${cards.map((c, i) => `<button type="button" class="dot" data-dot="${i}" aria-label="${i + 1}"></button>`).join("")}</div></div>`;
  const moviesOn = () => { const M = D.movies; return !!(M && (ENV.TMDB_READ_TOKEN || ENV.TMDB_API_KEY || M.readToken || M.apiKey) && M.lists && M.lists.some(l => l.id)); };

  const bcard = (id, cls, inner) => `<article id="${id}" class="bcard card ${cls}">${inner}</article>`;
  const BENTO = ["contact", "about", "tech", "dreams"];
  const interestsCard = () => bcard("interests", "b-int", `<h2>${esc(tr(U.interests))}</h2><div class="stats">${P.interests.map(i => `<span class="chip">${esc(tr(i))}</span>`).join("")}</div>`);
  const themeSvg = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 3a9 9 0 0 0 0 18z"/></svg>';
  const clockFmt = () => new Intl.DateTimeFormat(lang === "bn" ? "bn-BD" : "en-GB", { timeZone: "Asia/Dhaka", hour: "2-digit", minute: "2-digit", hour12: true }).format(new Date());
  const tick = () => $$(".clock").forEach(e => { e.textContent = clockFmt(); });

  const sections = {
    anime: () => {
      const A = Object.assign({}, D.anime, animeData || {}), c = A.counts, mx = A.maxPerList || 10;
      const stats = [["completed", c.completed], ["watching", c.watching], ["planning", c.planning]].map(([k, n]) => `<span class="chip">${esc(tr(U[k]))}: <b class="num" data-n="${n}">${n}</b></span>`).join("");
      const rows = ids => ids.filter(i => animeMap && animeMap[i]).slice(0, mx).map(i => { const a = animeMap[i]; return row(a.u, a.c, a.t, "", a.t + " (AniList)"); });
      let body = `<p class="sub">${esc(animeTried ? tr(U.animeFail) : "…")}</p>`;
      if (animeMap) { const cards = [["topRated", A.topRated], ["watching", A.watching]].flatMap(([k, ids]) => pcards(rows(ids), headOf(tr(U[k])))); if (cards.length) body = car("anTrack", cards, tr(U.nav.anime)); }
      return sec("anime", `<div class="stats">${stats}<a class="chip" href="${esc(A.profileUrl)}" target="_blank" rel="noopener">${icon("anilist")} ${esc(tr(U.openAnilist))}</a></div>${body}`);
    },
    movies: () => {
      let extra = "";
      if (movieData && movieData.length) {
        const cards = movieData.flatMap(l => pcards(l.items.map(it => row(it.u, it.p ? "https://image.tmdb.org/t/p/w92" + it.p : "", it.t, it.y, it.t + (it.y ? " (" + it.y + ")" : ""))), headOf(tr(l.title))));
        extra = car("mvTrack", cards, tr(U.nav.movies)) + `<p class="sub tmdb">${esc(tr(U.tmdb))}</p>`;
      } else if (movieTried) extra = `<p class="sub">${esc(tr(U.movieFail))}</p>`;
      return sec("movies", `<p>${esc(tr(P.movies))}</p>${extra}`);
    },
    music: () => sec("music", car("musicTrack", (musicData || D.music).flatMap(m => pcards(m.tracks.slice(0, 5).map(t => row("https://music.youtube.com/watch?v=" + t.id, t.thumb, t.title, t.artist, `${t.title} — ${t.artist}`)), headOf(tr(m.name), `${m.count} ${tr(U.songs)}`, m.url))), tr(U.nav.music)) + (musicData ? `<p class="sub tmdb">${esc(tr(U.ytNote))} <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google Privacy Policy</a></p>` : "")),
    gallery: () => sec("gallery", `<div class="gslider"><div class="track gtrack" id="galTrack" tabindex="0" role="region" aria-roledescription="carousel" aria-label="${esc(tr(U.nav.gallery))}">${D.gallery.map((g, i) => `<button type="button" class="gslide" data-i="${i}" aria-label="${esc(tr(g.caption))}"><img src="${esc(g.src)}" alt="${esc(tr(g.alt))}"${i ? ' loading="lazy"' : ""}><span class="cap">${esc(tr(g.caption))}</span></button>`).join("")}</div><button class="btn small ib gnav prev" type="button" data-slide="galTrack" data-dir="-1" aria-label="${esc(tr(U.prev))}">${icon("chevron-left")}</button><button class="btn small ib gnav next" type="button" data-slide="galTrack" data-dir="1" aria-label="${esc(tr(U.next))}">${icon("chevron-right")}</button><div class="dots">${D.gallery.map((g, i) => `<button type="button" class="dot" data-dot="${i}" aria-label="${esc(tr(g.caption))}"></button>`).join("")}</div></div>`),
    about: () => bcard("about", "b-about", `<h2>${esc(tr(U.nav.about))}</h2>${P.about.map(p => `<p>${esc(tr(p))}</p>`).join("")}`),
    tech: () => {
      const hosts = D.social.filter(s => s.enabled && ["GitHub", "GitLab", "Codeberg"].includes(s.platform)).map(s => `<a class="chip" href="${esc(s.url)}" target="_blank" rel="noopener me">${icon(s.platform.toLowerCase())} ${esc(s.platform)}</a>`).join("");
      return bcard("tech", "b-tech", `<h2>${esc(tr(U.nav.tech))}</h2><div class="big"><b>~4</b><span>${esc(tr(U.years))}</span></div><p>${esc(tr(P.tech))}</p><div class="stats">${hosts}</div>`);
    },
    dreams: () => bcard("dreams", "b-dreams", `<h2>${esc(tr(U.nav.dreams))}</h2>${P.dreams.map(d => `<div class="dream"><h3>${esc(tr(d.title))}</h3><p>${esc(tr(d.text))}</p></div>`).join("")}`),
    contact: () => {
      const c = D.contact, k = [];
      if (c.phone) k.push(["tel:" + c.phone, "phone", U.phoneLabel, c.phone, ""]);
      if (c.whatsapp) k.push(["https://wa.me/" + c.whatsapp, "whatsapp", U.waLabel, "+" + c.whatsapp, ' target="_blank" rel="noopener"']);
      if (c.email) k.push(["mailto:" + c.email, "email", U.mailLabel, c.email, ""]);
      return bcard("contact", "b-contact", `<h2>${esc(tr(U.nav.contact))}</h2><p>${esc(tr(U.contactNote))}</p><div class="cpills">${k.map(([h, i, l, v, a]) => `<a class="cpill" href="${esc(h)}" aria-label="${esc(tr(l))}: ${esc(v)}"${a}><span class="cic">${icon(i)}</span><span>${esc(v)}</span></a>`).join("")}</div><p class="tz">${icon("clock-outline")} ${esc(tr(U.bdTime))} <b class="clock"></b></p>`);
    }
  };

  const bodyHtml = () => {
    let out = "", done = false;
    S.enabledSections.filter(id => sections[id]).forEach(id => {
      if (BENTO.includes(id)) { if (done) return; done = true; out += `<section class="rv bento-sec"><div class="wrap"><div class="bento">${BENTO.filter(on).map(b => sections[b]()).join("")}${on("about") ? interestsCard() : ""}</div></div></section>`; }
      else out += sections[id]();
    });
    return out;
  };
  const hero = () => `${cookie()}<section class="hero" id="home"><div class="wrap"><div><p class="hello">${esc(tr(P.hello))}</p><h1>${esc(tr(P.name))}</h1><p class="from">${esc(tr(P.from))}</p><p class="tag"><span class="vh">${esc(tr(P.tagline))}</span><span class="ghost" aria-hidden="true">${esc(tr(P.tagline))}</span><span class="typed" aria-hidden="true"><span class="tx"></span><span class="caret"></span></span></p></div><div class="pf"><span class="pf-blob"></span><span class="pf-glass cookie"></span><img class="pf-img cookie" src="${esc(P.profileImage)}" alt="${esc(tr(P.profileAlt))}"><span class="pf-gloss cookie"></span></div></div></section>`;

  const palHTML = () => `<p class="pal-t">${esc(tr(U.palette))}</p><div class="swatches" role="group" aria-label="${esc(tr(U.palette))}">${PALS.map(p => `<button type="button" class="sw" data-pal="${p}" aria-pressed="${p === root.dataset.pal}" aria-label="${esc(tr(U.palNames[p]))}" title="${esc(tr(U.palNames[p]))}"></button>`).join("")}</div>`;
  const themeColor = () => { const m = $('meta[name="theme-color"]'); if (m) m.content = getComputedStyle(root).getPropertyValue("--bg").trim(); };
  function setPal(p) { root.dataset.pal = p; sess("pal", p); store("lastPal", p); $$(".sw").forEach(b => b.setAttribute("aria-pressed", b.dataset.pal === p)); themeColor(); }

  function footer() {
    const nav = S.enabledSections.filter(id => sections[id]).map(id => `<li><a href="#${id}">${esc(tr(U.nav[id]))}</a></li>`).join("");
    const soc = D.social.filter(s => s.enabled && s.url).map(s => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener me">${icon(s.platform.toLowerCase())}<span>${esc(s.platform)}</span></a></li>`).join("");
    const a0 = animeMap && ((animeData || D.anime).watching || []).map(i => animeMap[i]).find(Boolean);
    return `<div class="fgrid"><div><p class="fb">${esc(tr(P.name))}</p><p class="sub">${esc(tr(P.tagline))}</p><p class="sub">${esc(tr(P.location))}</p></div>
<div><h3>${esc(tr(U.find))}</h3><ul class="flist two">${soc}</ul></div>
<div><h3>${esc(tr(U.explore))}</h3><ul class="flist two">${nav}</ul></div>
<div><h3>${esc(tr(U.now))}</h3><ul class="flist"><li><span class="fi">${icon("clock-outline")}<span>${esc(tr(U.bdTime))} <b class="clock"></b></span></span></li>${a0 ? `<li><a href="${esc(a0.u)}" target="_blank" rel="noopener">${icon("anilist")}<span>${esc(tr(U.watchingNow))}: ${esc(a0.t)}</span></a></li>` : ""}</ul></div></div>
<div class="fbar"><span>© ${new Date().getFullYear()} ${esc(tr(P.name))} · ${esc(tr(U.builtWith))}</span><span class="fact"><button type="button" class="btn small" data-act="lang">${lang === "en" ? "বাংলা" : "English"}</button><button type="button" class="btn small ib" data-act="theme" aria-label="${esc(tr(U.theme))}">${themeSvg}</button><a href="#home">${icon("arrow-up")} ${esc(tr(U.top))}</a></span></div>`;
  }

  function render() {
    root.lang = lang;
    document.title = tr(S.title);
    $("#skip").textContent = tr(U.skip);
    $("#brand").textContent = tr(P.name);
    $("#nav").innerHTML = S.enabledSections.filter(id => sections[id]).map(id => `<a href="#${id}">${esc(tr(U.nav[id]))}</a>`).join("") + `<div class="navpal">${palHTML()}</div>`;
    $("#palPop").innerHTML = palHTML();
    $("#lang").textContent = lang === "en" ? "বাংলা" : "English";
    $("#themeBtn").setAttribute("aria-label", tr(U.theme));
    $("#themeBtn").innerHTML = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 3a9 9 0 0 0 0 18z"/></svg>';
    $("#palBtn").setAttribute("aria-label", tr(U.palette)); $("#palBtn").innerHTML = icon("palette");
    $("#menuBtn").textContent = tr(U.menu);
    $("#lbClose").textContent = tr(U.close);
    $("#main").innerHTML = hero() + bodyHtml();
    $("#foot").innerHTML = footer();
    typeTagline(); reveal(); spyNav(); setupTracks(); themeColor(); tick();
  }

  function typeTagline() {
    const el = $(".tx"), caret = $(".caret"), text = tr(P.tagline); if (!el) return;
    typeToken++;
    if (typedLang !== lang) { typedLang = lang; typedIdx = 0; if (typedState === 1) typedState = 0; }
    if (reduce || typedState === 2) { el.textContent = text; caret.classList.add("done"); typedState = 2; return; }
    const seg = window.Intl && Intl.Segmenter ? [...new Intl.Segmenter(lang, { granularity: "grapheme" }).segment(text)].map(s => s.segment) : [...text];
    const my = typeToken; typedState = 1; el.textContent = seg.slice(0, typedIdx).join("");
    const step = () => { if (my !== typeToken) return; el.textContent = seg.slice(0, ++typedIdx).join(""); if (typedIdx < seg.length) setTimeout(step, 40 + Math.random() * 35); else { typedState = 2; setTimeout(() => caret.classList.add("done"), 2200); } };
    setTimeout(step, typedIdx ? 0 : 900);
  }

  function countUp(el) {
    const n = +el.dataset.n; if (reduce || !n) return; const t0 = performance.now();
    const f = t => { const k = Math.min(1, (t - t0) / 1000); el.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f); };
    el.textContent = "0"; requestAnimationFrame(f);
  }

  function reveal() {
    $$(".rv").forEach(s => $$(".wrap > h2, .wrap > p, .wrap > .stats, .wrap > .grid > *, .wrap > .bento > *, .wrap > .car, .wrap > .gslider, .wrap > .cpills > *, .wrap > .tmdb, .fgrid > *, .fbar", s).forEach((el, i) => { el.classList.add("ri"); el.style.setProperty("--d", i * 90 + "ms"); }));
    const els = $$(".rv");
    if (revealIO) revealIO.disconnect();
    if (!("IntersectionObserver" in window)) return els.forEach(e => e.classList.add("in"));
    revealIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); $$(".num", e.target).forEach(countUp); revealIO.unobserve(e.target); } }), { threshold: .06 });
    els.forEach(e => revealIO.observe(e));
  }

  function spyNav() {
    if (spy) spy.disconnect(); const links = $$("#nav a");
    spy = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id)); }), { rootMargin: "-40% 0px -55% 0px" });
    S.enabledSections.forEach(id => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  function slide(tk, dir) {
    const s = tk.firstElementChild.offsetWidth + 16, end = tk.scrollLeft + tk.clientWidth >= tk.scrollWidth - 4;
    if (dir > 0 && end) tk.scrollTo({ left: 0, behavior: "smooth" });
    else if (dir < 0 && tk.scrollLeft < 4) tk.scrollTo({ left: tk.scrollWidth, behavior: "smooth" });
    else tk.scrollBy({ left: s * dir, behavior: "smooth" });
  }

  // Every slider (gallery, anime, music, movies): dots, hide controls when everything fits, gallery autoplay.
  function setupTracks() {
    clearInterval(galTimer);
    $$(".track").forEach(tk => {
      const box = tk.parentElement, dots = $$(".dot", box), n = tk.children.length, step = () => tk.firstElementChild.offsetWidth + 16;
      const refresh = () => {
        const vis = Math.max(1, Math.round((tk.clientWidth + 16) / step())), max = Math.max(0, n - vis), i = Math.min(max, Math.round(tk.scrollLeft / step()));
        box.classList.toggle("noscroll", max === 0); dots.forEach((d, k) => { d.hidden = k > max; d.classList.toggle("on", k === i); });
      };
      tk._refresh = refresh; refresh(); tk.addEventListener("scroll", refresh, { passive: true });
      if (tk.id !== "galTrack" || reduce) return;
      let paused = false, vis = false, t;
      const hold = () => { paused = true; clearTimeout(t); }, free = () => { clearTimeout(t); t = setTimeout(() => { paused = false; }, 2500); };
      ["mouseenter", "focusin", "touchstart"].forEach(e => box.addEventListener(e, hold, { passive: true }));
      ["mouseleave", "focusout", "touchend"].forEach(e => box.addEventListener(e, free, { passive: true }));
      new IntersectionObserver(es => { vis = es[0].isIntersecting; }).observe(box);
      galTimer = setInterval(() => { if (!paused && vis && !document.hidden) slide(tk, 1); }, 4500);
    });
  }
  addEventListener("resize", () => $$(".track").forEach(t => t._refresh && t._refresh()));

  const ALQ = "https://graphql.anilist.co", MED = "media{id isAdult title{romaji english} siteUrl coverImage{large}}";
  const aniPost = async (query, variables) => {
    const r = await fetch(ALQ, { method: "POST", headers: Object.assign({ "Content-Type": "application/json", Accept: "application/json" }, ENV.ANILIST_TOKEN ? { Authorization: "Bearer " + ENV.ANILIST_TOKEN } : {}), body: JSON.stringify({ query, variables }) });
    const j = await r.json(); if (!j.data) throw new Error("anilist"); return j.data;
  };
  const aniItem = x => ({ t: x.title.english || x.title.romaji, u: x.siteUrl, c: x.coverImage && x.coverImage.large });
  async function loadAnime() {
    if (!on("anime")) return;
    const user = (ENV.ANILIST_USERNAME || API.anilistUsername || "").trim(), A = D.anime;
    const key = user ? "v3:" + user : "v2:" + [...A.watching, ...A.topRated].join(",");
    try { const c = JSON.parse(store("anime-cache") || "null"); if (c && c.key === key && Date.now() - c.t < 216e5) { animeMap = c.map; animeData = c.data; return render(); } } catch (e) {}
    try {
      if (!user) throw new Error("no username");
      const d = await aniPost(`query($u:String){top:MediaListCollection(userName:$u,type:ANIME,status:COMPLETED,sort:SCORE_DESC){lists{entries{id score(format:POINT_100) ${MED}}}} now:MediaListCollection(userName:$u,type:ANIME,status:CURRENT,sort:UPDATED_TIME_DESC){lists{entries{id ${MED}}}} plan:MediaListCollection(userName:$u,type:ANIME,status:PLANNING){lists{entries{id}}}}`, { u: user });
      const uniq = k => { const s = new Set(); return ((d[k] && d[k].lists) || []).flatMap(l => l.entries).filter(e => !s.has(e.id) && s.add(e.id)); };
      const top = uniq("top"), now = uniq("now"), ok = e => e.media && !e.media.isAdult, mp = {};
      const topOk = top.filter(e => ok(e) && e.score > 0).sort((a, b) => b.score - a.score), nowOk = now.filter(ok);
      [...topOk, ...nowOk].forEach(e => { mp[e.media.id] = aniItem(e.media); });
      animeMap = mp; animeData = { counts: { completed: top.length, watching: now.length, planning: uniq("plan").length }, topRated: topOk.map(e => e.media.id), watching: nowOk.map(e => e.media.id) };
    } catch (e) {
      try {
        const d = await aniPost("query($ids:[Int]){Page(perPage:50){media(id_in:$ids,type:ANIME,isAdult:false){id title{romaji english} siteUrl coverImage{large}}}}", { ids: [...A.watching, ...A.topRated] }), mp = {};
        d.Page.media.forEach(x => { mp[x.id] = aniItem(x); }); animeMap = mp; animeData = null;
      } catch (e2) { animeMap = null; animeData = null; }
    }
    if (animeMap) store("anime-cache", JSON.stringify({ key, t: Date.now(), map: animeMap, data: animeData }));
    animeTried = true; render();
  }

  async function loadMusic() {
    const key = ENV.YOUTUBE_API_KEY || API.youtubeApiKey; if (!key) return;
    const mx = API.youtubeMax || 5, last = (API.youtubePick || "last") === "last", ck = "y1:" + D.music.map(m => m.url).join("|") + mx + last;
    try { const c = JSON.parse(store("music-cache") || "null"); if (c && c.key === ck && Date.now() - c.t < 216e5) { musicData = c.data; return render(); } } catch (e) {}
    try {
      musicData = await Promise.all(D.music.map(async m => {
        const pid = new URL(m.url).searchParams.get("list"); let items = [], tok = "", total = m.count;
        for (let p = 0; p < 4; p++) {
          const r = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${encodeURIComponent(pid)}&key=${encodeURIComponent(key)}${tok ? "&pageToken=" + tok : ""}`);
          if (!r.ok) throw new Error(r.status);
          const j = await r.json(); total = (j.pageInfo && j.pageInfo.totalResults) || total; items.push(...(j.items || [])); tok = j.nextPageToken; if (!tok) break;
        }
        items = items.filter(i => i.snippet && i.snippet.resourceId && !/^(Private|Deleted) video$/.test(i.snippet.title));
        items = last ? items.slice(-mx) : items.slice(0, mx);
        return Object.assign({}, m, { count: total, tracks: items.map(i => ({ title: i.snippet.title, artist: (i.snippet.videoOwnerChannelTitle || "").replace(/ - Topic$/, ""), id: i.snippet.resourceId.videoId, thumb: ((i.snippet.thumbnails || {}).medium || (i.snippet.thumbnails || {}).default || {}).url || "" })) });
      }));
      store("music-cache", JSON.stringify({ key: ck, t: Date.now(), data: musicData }));
    } catch (e) { musicData = null; }
    render();
  }

  async function loadMovies() {
    if (!on("movies") || !moviesOn()) return;
    const M = D.movies, lists = M.lists.filter(l => l.id), mx = M.maxPerList || 10, key = "m1:" + lists.map(l => l.id).join(",") + ":" + mx;
    try { const c = JSON.parse(store("movie-cache") || "null"); if (c && c.key === key && Date.now() - c.t < 216e5) { movieData = c.data; return render(); } } catch (e) {}
    try {
      movieData = (await Promise.all(lists.map(async l => {
        const tok = ENV.TMDB_READ_TOKEN || M.readToken, ak = ENV.TMDB_API_KEY || M.apiKey, id = encodeURIComponent(l.id);
        const r = await fetch(`https://api.themoviedb.org/4/list/${id}?page=1` + (tok ? "" : "&api_key=" + encodeURIComponent(ak)), tok ? { headers: { Authorization: "Bearer " + tok, Accept: "application/json" } } : {});
        if (!r.ok) throw new Error(r.status);
        const j = await r.json();
        return { title: l.title, items: (j.results || j.items || []).filter(x => x.title || x.name).slice(0, mx).map(x => ({ t: x.title || x.name, y: (x.release_date || x.first_air_date || "").slice(0, 4), p: x.poster_path, u: `https://www.themoviedb.org/${x.media_type === "tv" ? "tv" : "movie"}/${x.id}` })) };
      }))).filter(l => l.items.length);
      store("movie-cache", JSON.stringify({ key, t: Date.now(), data: movieData }));
    } catch (e) { movieData = null; }
    movieTried = true; render();
  }

  const closePal = () => { $("#palPop").hidden = true; $("#palBtn").setAttribute("aria-expanded", "false"); };
  document.addEventListener("click", e => {
    if (!e.target.closest("#palPop, #palBtn")) closePal();
    const t = e.target.closest("button, a"); if (!t) return;
    if (t.id === "lang" || t.dataset.act === "lang") { lang = lang === "en" ? "bn" : "en"; store("lang", lang); render(); }
    else if (t.id === "themeBtn" || t.dataset.act === "theme") { const n = root.dataset.theme === "dark" ? "light" : "dark"; root.dataset.theme = n; store("theme", n); themeColor(); }
    else if (t.id === "palBtn") { const h = $("#palPop").hidden; $("#palPop").hidden = !h; t.setAttribute("aria-expanded", h); }
    else if (t.dataset.pal) setPal(t.dataset.pal);
    else if (t.id === "menuBtn") { const o = $("#nav").classList.toggle("open"); t.setAttribute("aria-expanded", o); }
    else if (t.closest("#nav")) { $("#nav").classList.remove("open"); $("#menuBtn").setAttribute("aria-expanded", "false"); }
    else if (t.id === "lbClose") $("#lightbox").close();
    else if (t.dataset.slide) slide(document.getElementById(t.dataset.slide), +t.dataset.dir);
    else if (t.dataset.dot !== undefined) { const tk = t.parentElement.parentElement.querySelector(".track"); tk.scrollTo({ left: +t.dataset.dot * (tk.firstElementChild.offsetWidth + 16), behavior: "smooth" }); }
    else if (t.dataset.i !== undefined) { const g = D.gallery[+t.dataset.i], d = $("#lightbox"); d.querySelector("img").src = g.src; d.querySelector("img").alt = tr(g.alt); d.querySelector("figcaption").textContent = tr(g.caption); d.showModal(); }
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { closePal(); $("#nav").classList.remove("open"); } });
  $("#lightbox").addEventListener("click", e => { if (e.target.id === "lightbox") e.target.close(); });
  const bar = $("#progress"), head = $(".top");
  addEventListener("scroll", () => { bar.style.transform = `scaleX(${scrollY / ((root.scrollHeight - innerHeight) || 1)})`; head.classList.toggle("scrolled", scrollY > 8); }, { passive: true });
  render(); loadAnime(); loadMovies(); loadMusic(); setInterval(tick, 20000);
})();
