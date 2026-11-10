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
  // 특별 상자: 랜덤 뽑기에는 포함되지 않음
  const DALBI = {
    n: "달비🌙", file: "달비", t: "모든 행운", k: "dalbi", special: 1,
    c: "#6B3420", hi: "#9A5A3A",
    box: "linear-gradient(120deg,#CDEBFB 0%,#FFFFFF 42%,#FFDCE6 72%,#FFF0B8 100%)", fg: "#2E4A6E",
    head: "남은 50일, 좋은 일만 가득하길",
    headLines: ["남은 50일,", "좋은 일만 가득하길"],
    letter: [
      "안녕 다진아",
      "",
      "빼빼로 데이가 별다른 날이 아닐 수 있지만",
      "먼 브라질에서 빼빼로를 받기 어려울 너에게",
      "잠시나마 기분 좋은 순간을 만들어 주고 싶어서",
      "이렇게 특별한 빼빼로를 준비해봤어",
      "",
      "아마 올해 많은 일들이 있었던 너에게",
      "남은 50일 동안 좋은 일들이 가득했으면",
      "좋겠다는 마음을 담아봤어",
      "",
      "어쩌다 우연히 알게 되었는데",
      "같은 INFJ에 같은 생일",
      "비슷한 점이 많으면서도 다른 점이 많은 우리",
      "참 재미있는 인연인거 같아",
      "",
      "처음에 이렇게 연락할 수 있을까 생각했었는데",
      "최근에 많은 이야기를 나누고",
      "너에 대해 하나씩 알아가고 이해해 가는 과정이",
      "즐겁고 시간 가는줄 모르네",
      "",
      "앞으로도 지금처럼 재밌게 놀고",
      "같이 잘 지냈으면 좋겠어",
      "잘 부탁할게",
    ].join("\n"),
    sign: "2026.11.11\n0321 재현이가",
  };
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
    dalbi:   { bg: "#BFE4F8", fg: "#2E4A6E", hl: "#E8799B" },
  };
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  function setTheme(key) {
    const t = THEMES[key] || THEMES.default;
    const root = document.documentElement.style;
    root.setProperty("--accent", t.bg);
    root.setProperty("--fg", t.fg);
    root.setProperty("--hl", t.hl);
    if (themeMeta) themeMeta.content = t.bg;
    document.body.classList.toggle("dalbi", key === "dalbi");
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
  const dalbiSticks = [44, 52, 48, 56, 46, 54, 50, 58, 47]
    .map((h) => `<i style="height:${h}px"></i>`).join("");
  const dalbiPack = `<button type="button" class="pack pack-dalbi" data-i="dalbi" aria-pressed="false">
      <div class="pack-box" style="background:${DALBI.box};color:${DALBI.fg}">
        <div class="dalbi-sticks">${dalbiSticks}</div>
        <span class="pack-name">${DALBI.n}</span>
        <span class="pack-type">${DALBI.t}</span>
      </div>
    </button>`;
  // 달비 상자는 숨김: 주소 끝에 #dalbi 를 붙여 들어올 때만 보임
  const showDalbi = location.hash === "#dalbi";
  $("#packs").innerHTML = (showDalbi ? dalbiPack : "") + packList.map(
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
    state.sel = b.dataset.i === "dalbi" ? "dalbi" : +b.dataset.i;
    setTheme(state.sel === "dalbi" ? "dalbi" : state.sel === RANDOM ? "random" : F[state.sel].k);
    renderPacks();
  });

  function renderPacks() {
    document.querySelectorAll(".pack").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.i === String(state.sel))));
    const btn = $("#draw");
    const has = state.sel !== null;
    btn.disabled = !has;
    btn.textContent = !has ? "상자를 먼저 골라 주세요"
      : state.sel === "dalbi" ? "빼빼로 상자 열기"
      : state.sel === RANDOM ? "랜덤 상자 열기" : `${F[state.sel].n} 상자 열기`;
  }

  // ---------- 3. 뽑기 ----------
  $("#draw").addEventListener("click", () => {
    if (state.sel === null) return;
    if (state.sel === "dalbi") {
      setTheme("dalbi");
      state.result = {
        f: DALBI,
        score: 100,
        head: DALBI.head,
        detail: DALBI.letter,
        lucky: [],
      };
      renderDraw();
      return;
    }
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
      $("#drawTitle").textContent = f.special ? "빼빼로를 받았어요" : "쏙! 뽑았어요";
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
    if (f.headLines) $("#detailHead").innerHTML = f.headLines.join("<br>");
    else $("#detailHead").textContent = head;
    $("#detailScore").textContent = score;
    const sp = !!f.special;
    $(".step.detail .score-badge").classList.toggle("inline", sp);
    $("#lucky").hidden = sp;
    $("#detailText").hidden = sp;
    $(".step.detail .advice").hidden = sp;
    $(".step.detail .match").hidden = sp;
    $("#letter").hidden = !sp;
    if (sp) { $("#letterText").textContent = detail; $("#letterSign").textContent = f.sign; }
    else {
      $("#detailText").textContent = detail;
      $("#advice").textContent = advice;
      $("#match").textContent = match;
    }
    $("#lucky").innerHTML = lucky.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
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
    const text = f.special
      ? `${f.n} 빼빼로를 받았어요! ${f.t} 100점 🍫`
      : `내 빼빼로 운세는 ${f.n} · ${f.t}! "${head}" 너도 하나 뽑아 봐 🍫`;
    if (navigator.share) {
      try { await navigator.share({ title: "2026 빼빼로 운세", text, url }); } catch {}
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

  // ---------- 결과 이미지 저장 ----------
  const SANS = '"Noto Sans KR", sans-serif';
  const DISPLAY = '"Black Han Sans", sans-serif';
  const PEN = '"Nanum Pen Script", cursive';

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h);
  }

  // 한글은 글자 단위, 가능하면 띄어쓰기 단위로 줄바꿈
  function wrap(ctx, text, maxW) {
    const lines = [];
    let line = "";
    for (const word of text.split(" ")) {
      const test = line ? line + " " + word : word;
      if (ctx.measureText(test).width <= maxW) { line = test; continue; }
      if (line) lines.push(line);
      if (ctx.measureText(word).width <= maxW) { line = word; continue; }
      line = "";
      for (const ch of word) {
        if (ctx.measureText(line + ch).width > maxW) { lines.push(line); line = ch; } else line += ch;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  function drawStick(ctx, f, x, y, w, h) {
    const bis = h * 0.36;
    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate((14 * Math.PI) / 180);
    ctx.translate(-w / 2, -h / 2);
    roundRect(ctx, 0, 0, w, h, [w / 2, w / 2, 6, 6]);
    ctx.clip();
    const bg = ctx.createLinearGradient(0, 0, w, 0);
    bg.addColorStop(0, "#CFA261"); bg.addColorStop(0.5, "#EFD29E"); bg.addColorStop(1, "#CFA261");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    const ch = h - bis;
    if (f.core) {
      ctx.fillStyle = "#5B2E1C";
      ctx.fillRect(w * 0.28, 0, w * 0.44, ch);
    } else {
      const g = ctx.createLinearGradient(0, 0, w, 0);
      g.addColorStop(0, f.c); g.addColorStop(0.45, f.hi); g.addColorStop(0.7, f.c); g.addColorStop(1, f.c);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, ch);
      if (f.dots || f.specks) {
        ctx.fillStyle = f.dots || "#3B2418";
        const step = f.dots ? 11 : 8, rad = f.dots ? 2.6 : 1.8;
        for (let yy = 6; yy < ch - 4; yy += step) {
          for (let xx = (yy / step) % 2 ? 5 : 10; xx < w; xx += step) {
            ctx.beginPath(); ctx.arc(xx, yy, rad, 0, Math.PI * 2); ctx.fill();
          }
        }
      }
    }
    ctx.restore();
  }

  function loadImage(src) {
    return new Promise((res) => {
      const im = new Image();
      im.onload = () => res(im);
      im.onerror = () => res(null);
      im.src = src;
    });
  }

  async function renderResultImage() {
    const { f, score, head, detail, advice, match, lucky } = state.result;
    const t = THEMES[f.k] || THEMES.default;
    const sp = !!f.special;
    const INK = sp ? "#3B3550" : "#3A1A12";
    const LETTER_FONT = `46px ${PEN}`, LETTER_LH = 66, PARA_GAP = 30;
    const sample = head + detail + (advice || "") + (match || "") + lucky.flat().join("") + "2026빼빼로운세같이먹으면좋은맛오늘해볼한가지점·cheetahtah.com/pepero";
    await Promise.all([
      document.fonts.load(`64px ${DISPLAY}`, sample),
      document.fonts.load(`400 36px ${SANS}`, sample),
      document.fonts.load(`700 36px ${SANS}`, sample),
      document.fonts.load(`58px ${PEN}`, sp ? detail + "빼빼로에 담은 편지" : advice),
    ]).catch(() => {});

    const W = 1080, CX = 60, CW = W - CX * 2, P = 64, IX = CX + P, IW = CW - P * 2;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = W;
    canvas.height = 2000; // 측정용, 아래에서 실제 높이로 다시 그림

    // 1차: 레이아웃 계산
    const layout = () => {
      const L = {};
      let y = 170 + P; // 카드 안쪽 시작
      L.headTop = y;
      // 제목이 한 줄에 안 들어가면 글자를 줄이고, 그래도 길면 두 줄로
      L.headSize = 64;
      ctx.font = `${L.headSize}px ${DISPLAY}`;
      if (ctx.measureText(head).width > IW - 110 - 190) {
        L.headSize = 54;
        ctx.font = `${L.headSize}px ${DISPLAY}`;
      }
      L.headLH = Math.round(L.headSize * 1.22);
      L.headLines = wrap(ctx, head, IW - 110 - 190);
      if (L.headLines.length === 2) {
        // 두 줄이면 띄어쓰기 기준으로 길이를 비슷하게 나눔 (한 글자만 남는 줄 방지)
        const words = head.split(" ");
        let best = null;
        for (let i = 1; i < words.length; i++) {
          const l1 = words.slice(0, i).join(" "), l2 = words.slice(i).join(" ");
          const m = Math.max(ctx.measureText(l1).width, ctx.measureText(l2).width);
          if (m <= IW - 110 - 190 && (!best || m < best.m)) best = { m, lines: [l1, l2] };
        }
        if (best) L.headLines = best.lines;
      }
      if (f.headLines) L.headLines = f.headLines;
      L.headY = y + 76;
      const headBottom = L.headY + 26 + (L.headLines.length - 1) * L.headLH + 18;
      y = Math.max(y + 190, headBottom + 44);
      if (sp) {
        // 편지: 줄바꿈 유지, 빈 줄은 문단 간격
        ctx.font = LETTER_FONT;
        L.letterTop = y;
        let ly = y + 40 + 40 + 28; // 상자 안 여백 + 라벨
        L.letterLabelY = y + 40 + 28;
        L.letterLines = [];
        ly += 34;
        for (const para of detail.split("\n")) {
          if (!para.trim()) { ly += PARA_GAP; continue; }
          for (const ln of wrap(ctx, para, IW - 80)) { L.letterLines.push([ln, ly]); ly += LETTER_LH; }
        }
        ly += 20;
        L.signY = ly;
        L.letterBottom = ly + (f.sign.split("\n").length - 1) * LETTER_LH + 44;
        L.cardBottom = L.letterBottom + P;
        L.H = Math.max(1350, L.cardBottom + 130);
        return L;
      }
      ctx.font = `400 36px ${SANS}`;
      L.detailLines = wrap(ctx, detail, IW);
      L.detailY = y + 36;
      y = L.detailY + (L.detailLines.length - 1) * 62 + 56;
      L.gridY = y;
      y += 110 * 2 + 20 + 48;
      L.dashY = y;
      L.adviceLabelY = y + 56;
      L.adviceY = y + 128;
      y += 170;
      L.matchY = y;
      y += 88;
      L.cardBottom = y + P;
      L.H = Math.max(1350, L.cardBottom + 130);
      return L;
    };
    const L = layout();
    canvas.height = L.H;

    // 배경
    if (sp) {
      const g = ctx.createLinearGradient(0, 0, W * 0.5, L.H);
      g.addColorStop(0, "#C4E6FA"); g.addColorStop(0.42, "#F4FAFF");
      g.addColorStop(0.72, "#FFDCE6"); g.addColorStop(1, "#FFEFB3");
      ctx.fillStyle = g;
    } else ctx.fillStyle = t.bg;
    ctx.fillRect(0, 0, W, L.H);

    // 상단 제목
    ctx.fillStyle = t.fg;
    ctx.textBaseline = "alphabetic";
    ctx.font = `700 32px ${SANS}`;
    ctx.textAlign = "left";
    ctx.fillText("2026 빼빼로 운세", CX + 8, 112);
    ctx.textAlign = "right";
    ctx.fillText("11 · 11", W - CX - 8, 112);

    // 종이 카드
    ctx.fillStyle = sp ? "rgba(70,110,160,.14)" : "rgba(0,0,0,.18)";
    roundRect(ctx, CX, 170 + 14, CW, L.cardBottom - 170, 48);
    ctx.fill();
    ctx.fillStyle = sp ? "#FFFFFF" : "#FFF6EA";
    roundRect(ctx, CX, 170, CW, L.cardBottom - 170, 48);
    ctx.fill();

    // 막대 + 제목 + 점수
    drawStick(ctx, f, IX + 8, L.headTop + 4, 40, 170);
    ctx.textAlign = "left";
    ctx.fillStyle = t.hl;
    ctx.font = `700 30px ${SANS}`;
    ctx.fillText(`${f.n} · ${f.t}`, IX + 110, L.headTop + 30);
    ctx.fillStyle = INK;
    ctx.font = `${L.headSize}px ${DISPLAY}`;
    L.headLines.forEach((ln, i) => ctx.fillText(ln, IX + 110, L.headY + 26 + i * L.headLH));

    const scx = IX + IW - 80, scy = L.headTop + 80;
    ctx.fillStyle = t.hl;
    ctx.beginPath(); ctx.arc(scx, scy, 80, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    if (sp) {
      // "100점" 한 줄로
      ctx.font = `56px ${DISPLAY}`;
      const nw = ctx.measureText(String(score)).width;
      ctx.font = `700 30px ${SANS}`;
      const uw = ctx.measureText("점").width;
      const sx = scx - (nw + 4 + uw) / 2;
      ctx.textAlign = "left";
      ctx.font = `56px ${DISPLAY}`;
      ctx.fillText(String(score), sx, scy + 20);
      ctx.font = `700 30px ${SANS}`;
      ctx.fillText("점", sx + nw + 4, scy + 20);
    } else {
      ctx.textAlign = "center";
      ctx.font = `64px ${DISPLAY}`;
      ctx.fillText(String(score), scx, scy + 14);
      ctx.font = `700 24px ${SANS}`;
      ctx.fillText("점", scx, scy + 50);
    }

    ctx.textAlign = "left";
    if (sp) {
      // 편지 상자 (버터색 + 분홍 줄)
      const bh = L.letterBottom - L.letterTop;
      ctx.save();
      roundRect(ctx, IX, L.letterTop, IW, bh, 32);
      ctx.clip();
      ctx.fillStyle = "#FFF7D9";
      ctx.fillRect(IX, L.letterTop, IW, bh);
      const img = await loadImage("dalbi-bg.jpg");
      if (img) {
        // 상자를 꽉 채우도록 잘라서 흐리게
        const sc = Math.max(IW / img.width, bh / img.height);
        const dw = img.width * sc, dh = img.height * sc;
        ctx.globalAlpha = 0.3;
        ctx.drawImage(img, IX + (IW - dw) / 2, L.letterTop + (bh - dh) / 2, dw, dh);
        ctx.globalAlpha = 1;
      }
      ctx.restore();
      ctx.fillStyle = t.hl;
      ctx.font = `700 28px ${SANS}`;
      ctx.fillText("빼빼로에 담은 편지 💌", IX + 40, L.letterLabelY);
      ctx.strokeStyle = "rgba(232,121,155,.22)";
      ctx.lineWidth = 2;
      ctx.fillStyle = INK;
      ctx.font = LETTER_FONT;
      L.letterLines.forEach(([ln, ly]) => {
        ctx.beginPath(); ctx.moveTo(IX + 40, ly + 14); ctx.lineTo(IX + IW - 40, ly + 14); ctx.stroke();
        ctx.fillText(ln, IX + 40, ly);
      });
      ctx.textAlign = "right";
      f.sign.split("\n").forEach((ln, i) => ctx.fillText(ln, IX + IW - 40, L.signY + i * LETTER_LH));
      ctx.textAlign = "left";
    } else {
      // 상세 운세
      ctx.fillStyle = INK;
      ctx.font = `400 36px ${SANS}`;
      L.detailLines.forEach((ln, i) => ctx.fillText(ln, IX, L.detailY + i * 62));
    }

    // 행운 4칸
    const cw = (IW - 20) / 2, chh = 110;
    lucky.forEach(([k, v], i) => {
      const x = IX + (i % 2) * (cw + 20), y = L.gridY + Math.floor(i / 2) * (chh + 20);
      ctx.fillStyle = sp ? "#EEF7FD" : "#FFFFFF";
      roundRect(ctx, x, y, cw, chh, 24); ctx.fill();
      ctx.strokeStyle = sp ? "#CFE6F5" : "#EAD9C0"; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = sp ? "#6A7A90" : "#6E5446";
      ctx.font = `400 24px ${SANS}`;
      ctx.fillText(k, x + 26, y + 42);
      ctx.fillStyle = INK;
      ctx.font = `700 34px ${SANS}`;
      ctx.fillText(v, x + 26, y + 88);
    });

    if (sp) {
      ctx.textAlign = "center";
      ctx.fillStyle = t.fg;
      ctx.font = `700 30px ${SANS}`;
      ctx.fillText("cheetahtah.com/pepero", W / 2, L.cardBottom + (L.H - L.cardBottom) / 2 + 12);
      return new Promise((res) => canvas.toBlob(res, "image/png"));
    }

    // 오늘 해 볼 한 가지
    ctx.strokeStyle = "#C9B49A";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.beginPath(); ctx.moveTo(IX, L.dashY); ctx.lineTo(IX + IW, L.dashY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = t.hl;
    ctx.font = `700 28px ${SANS}`;
    ctx.fillText("오늘 해 볼 한 가지", IX, L.adviceLabelY);
    ctx.fillStyle = "#3A1A12";
    ctx.font = `58px ${PEN}`;
    ctx.fillText(advice, IX, L.adviceY);

    // 같이 먹으면 좋은 맛
    ctx.fillStyle = "#F3E4CE";
    roundRect(ctx, IX, L.matchY, IW, 88, 22); ctx.fill();
    ctx.fillStyle = "#3A1A12";
    ctx.font = `400 30px ${SANS}`;
    ctx.fillText("같이 먹으면 좋은 맛", IX + 28, L.matchY + 55);
    ctx.textAlign = "right";
    ctx.font = `700 30px ${SANS}`;
    ctx.fillText(match, IX + IW - 28, L.matchY + 55);

    // 하단 주소
    ctx.textAlign = "center";
    ctx.fillStyle = t.fg;
    ctx.font = `700 30px ${SANS}`;
    ctx.fillText("cheetahtah.com/pepero", W / 2, L.cardBottom + (L.H - L.cardBottom) / 2 + 12);

    return new Promise((res) => canvas.toBlob(res, "image/png"));
  }

  $("#saveImg").addEventListener("click", async () => {
    const btn = $("#saveImg");
    const label = btn.querySelector("span");
    btn.disabled = true;
    label.textContent = "이미지 만드는 중…";
    try {
      const blob = await renderResultImage();
      const name = `2026-빼빼로운세-${state.result.f.file || state.result.f.n}.png`;
      const file = new File([blob], name, { type: "image/png" });
      const mobile = matchMedia("(pointer: coarse)").matches;
      if (mobile && navigator.canShare && navigator.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file], title: "2026 빼빼로 운세" }); } catch {}
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
      }
      label.textContent = "저장했어요!";
    } catch (e) {
      label.textContent = "저장에 실패했어요";
    }
    setTimeout(() => { label.textContent = "이미지로 저장"; btn.disabled = false; }, 1600);
  });

  go("intro");
})();
