(() => {
  const D = window.FORTUNES;

  const F = [
    { n: "오리지널", t: "연애운", k: "love", c: "#6B3420", hi: "#9A5A3A", box: "#D0202E", fg: "#FFFFFF" },
    { n: "크림치즈", t: "애정운", k: "love2", c: "#F5E8CC", hi: "#FFF8E8", box: "#8ECDF0", fg: "#14324A" },
    { n: "아몬드", t: "금전운", k: "money", c: "#7A4524", hi: "#A8703F", dots: "#DDB57E", box: "#2E8B57", fg: "#FFFFFF" },
    { n: "크런키", t: "직장운", k: "work", c: "#4E2C1C", hi: "#7A4C34", dots: "#8A5A3E", box: "#F5821F", fg: "#2A1A0E" },
    { n: "누드", t: "학업운", k: "study", c: "#E2BC7E", hi: "#F3D9A8", core: 1, box: "#F7C631", fg: "#2A1A0E" },
    { n: "화이트쿠키", t: "오늘의 행운", k: "luck", c: "#E8E0D2", hi: "#FFFFFF", specks: 1, box: "#EDE7DC", fg: "#2A1A0E" },
    { n: "초코쿠키", t: "연말운", k: "yearend", c: "#3E2418", hi: "#6A4532", dots: "#1F0F08", box: "#2453A6", fg: "#FFFFFF" },
  ];
  const COLORS = ["빨강", "버건디", "골드", "하늘색", "크림색", "초록", "보라", "코랄", "네이비", "민트", "라벤더", "오렌지"];
  const TIMES = ["오전 7시", "오전 9시", "오전 11시", "점심 12시", "오후 2시", "오후 3시", "오후 5시", "저녁 7시", "저녁 8시", "밤 10시"];
  const ITEMS = ["손편지", "이어폰", "포스트잇", "텀블러", "동전 지갑", "향수", "머리끈", "볼펜", "우산", "목도리", "핸드크림", "빼빼로"];
  const RANDOM = F.length;

  // 맛별 화면 색: bg 배경, fg 배경 위 글자, hl 종이 카드 위 강조색
  const THEMES = {
    default: { bg: "#B5121B", fg: "#FFFFFF", hl: "#B5121B" },
    love:    { bg: "#D0202E", fg: "#FFFFFF", hl: "#B5121B" },
    love2:   { bg: "#8ECDF0", fg: "#14324A", hl: "#1F5C86" },
    money:   { bg: "#2E8B57", fg: "#FFFFFF", hl: "#23704A" },
    work:    { bg: "#F5821F", fg: "#2A1A0E", hl: "#B0500A" },
    study:   { bg: "#F7C631", fg: "#2A1A0E", hl: "#8A6100" },
    luck:    { bg: "#EDE7DC", fg: "#2A1A0E", hl: "#6B4A2E" },
    yearend: { bg: "#2453A6", fg: "#FFFFFF", hl: "#2453A6" },
    random:  { bg: "#2A2A2A", fg: "#FFFFFF", hl: "#2A2A2A" },
  };
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  function setTheme(key) {
    const t = THEMES[key] || THEMES.default;
    const root = document.documentElement.style;
    root.setProperty("--accent", t.bg);
    root.setProperty("--fg", t.fg);
    root.setProperty("--hl", t.hl);
    if (themeMeta) themeMeta.content = t.bg;
  }
  const STEPS = ["intro", "pick", "draw", "detail"];

  const $ = (s) => document.querySelector(s);
  const r = (n) => Math.floor(Math.random() * n);

  const sheen = (f) => `linear-gradient(90deg,${f.c},${f.hi} 45%,${f.c} 70%)`;
  const coat = (f) =>
    f.core ? "linear-gradient(90deg,#CFA261 0 28%,#5B2E1C 28% 72%,#CFA261 72%)"
    : f.dots ? `radial-gradient(${f.dots} 2px,transparent 2.6px) 0 0/8px 11px,${sheen(f)}`
    : f.specks ? `radial-gradient(#3B2418 1.3px,transparent 1.6px) 0 0/6px 7px,${sheen(f)}`
    : sheen(f);

  const state = { sel: null, result: null };
  let pullTimer;

  // ---------- 단계 전환 ----------
  function go(step) {
    document.querySelectorAll(".step").forEach((el) => (el.hidden = el.dataset.step !== step));
    const si = STEPS.indexOf(step);
    document.querySelectorAll("#dots span").forEach((d, i) => {
      d.classList.toggle("on", i <= si);
      d.classList.toggle("cur", i === si);
    });
    window.scrollTo(0, 0);
  }

  // ---------- 1. 소개 ----------
  const heights = [170, 150, 160, 140, 155, 145, 165];
  $("#introSticks").innerHTML = F.map(
    (f, i) => `<div class="stick" style="height:${heights[i]}px;animation-delay:${i * -0.4}s"><div class="coat" style="background:${coat(f)}"></div><div class="biscuit"></div></div>`
  ).join("");

  $("#start").addEventListener("click", () => {
    state.sel = null;
    setTheme("default");
    renderPacks();
    go("pick");
  });

  // ---------- 2. 상자 고르기 ----------
  const packList = [
    ...F.map((f) => ({ n: f.n, t: f.t, box: f.box, fg: f.fg, tip: f.core ? "#E2BC7E" : f.c })),
    { n: "랜덤", t: "어떤 운이 나올까", box: "#2A2A2A", fg: "#FFFFFF", tip: "#8A8A8A" },
  ];
  $("#packs").innerHTML = packList.map(
    (p, i) => `<button type="button" class="pack" data-i="${i}" aria-pressed="false">
      <div class="pack-box" style="background:${p.box};color:${p.fg}">
        <div class="pack-tips"><i style="background:${p.tip}"></i><i style="background:${p.tip}"></i><i style="background:${p.tip}"></i></div>
        <span class="pack-name">${p.n}</span>
        <span class="pack-type">${p.t}</span>
      </div>
    </button>`
  ).join("");

  $("#packs").addEventListener("click", (e) => {
    const b = e.target.closest(".pack");
    if (!b) return;
    state.sel = +b.dataset.i;
    setTheme(state.sel === RANDOM ? "random" : F[state.sel].k);
    renderPacks();
  });

  function renderPacks() {
    document.querySelectorAll(".pack").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.i === state.sel)));
    const btn = $("#draw");
    const has = state.sel !== null;
    btn.disabled = !has;
    btn.textContent = !has ? "상자를 먼저 골라 주세요" : state.sel === RANDOM ? "랜덤 상자 열기" : `${F[state.sel].n} 상자 열기`;
  }

  // ---------- 3. 뽑기 ----------
  $("#draw").addEventListener("click", () => {
    if (state.sel === null) return;
    const pick = state.sel === RANDOM ? r(F.length) : state.sel;
    const f = F[pick];
    setTheme(f.k);
    const pool = D[f.k];
    const entry = pool.list[r(pool.list.length)];
    state.result = {
      f,
      score: 70 + r(30),
      head: entry[0],
      detail: entry[1],
      advice: pool.adv[r(pool.adv.length)],
      match: F[(pick + 1 + r(F.length - 1)) % F.length].n,
      lucky: [
        ["행운의 색", COLORS[r(COLORS.length)]],
        ["행운의 숫자", String(1 + r(99))],
        ["행운의 시간", TIMES[r(TIMES.length)]],
        ["행운의 물건", ITEMS[r(ITEMS.length)]],
      ],
    };
    renderDraw();
  });

  function renderDraw() {
    const { f, score, head } = state.result;
    const sec = $(".step.draw");
    sec.classList.remove("pulled");
    $("#drawBoxName").textContent = `${f.n} 상자`;
    $("#drawTitle").textContent = "하나 꺼내는 중…";
    $("#bigStick .coat").style.background = coat(f);
    const box = $("#openBox");
    box.style.background = f.box;
    box.style.color = f.fg;
    $("#openBoxName").textContent = f.n;
    $("#quickType").textContent = f.t;
    $("#quickScore").textContent = `${score}점`;
    $("#quickLine").textContent = head;
    go("draw");

    clearTimeout(pullTimer);
    pullTimer = setTimeout(() => {
      sec.classList.add("pulled");
      $("#drawTitle").textContent = "쏙! 뽑았어요";
    }, 400);
  }

  $("#again").addEventListener("click", () => {
    clearTimeout(pullTimer);
    state.sel = null;
    setTheme("default");
    renderPacks();
    go("pick");
  });

  // ---------- 4. 상세 결과 ----------
  $("#toDetail").addEventListener("click", () => {
    const { f, score, head, detail, advice, match, lucky } = state.result;
    $("#miniStick .coat").style.background = coat(f);
    $("#detailMeta").textContent = `${f.n} · ${f.t}`;
    $("#detailHead").textContent = head;
    $("#detailScore").textContent = score;
    $("#detailText").textContent = detail;
    $("#lucky").innerHTML = lucky.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
    $("#advice").textContent = advice;
    $("#match").textContent = match;
    go("detail");
  });

  $("#home").addEventListener("click", () => {
    state.sel = null;
    setTheme("default");
    go("intro");
  });

  $("#share").addEventListener("click", async () => {
    const btn = $("#share");
    const url = location.origin + location.pathname;
    const { f, head } = state.result;
    const text = `내 빼빼로 운세는 ${f.n} · ${f.t}! "${head}" 너도 하나 뽑아 봐 🍫`;
    if (navigator.share) {
      try { await navigator.share({ title: "11.11 빼빼로 운세", text, url }); } catch {}
      return;
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      btn.textContent = "링크를 복사했어요!";
    } catch {
      btn.textContent = url;
    }
    setTimeout(() => (btn.textContent = "친구에게 빼빼로 보내기"), 1800);
  });

  go("intro");
})();
