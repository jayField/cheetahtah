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
  // 황금 빼빼로: 일반 상자에서 1/100 확률로 나옴 (주소 끝 #gold 면 항상 나옴: 미리보기용)
  const GOLD = {
    love: { head: "연애운이 활짝 열린 날", body: "오늘은 생각나는 사람에게 연락해 보세요. 무엇을 해도 마음이 닿는, 100번 중 한 번 오는 날이에요.", adv: "지금 떠오르는 그 사람에게 먼저 연락하기" },
    love2: { head: "사랑이 두 배로 깊어지는 날", body: "오늘만큼은 평소보다 크게 마음을 표현해 보세요. 둘에게 오래 기억될 하루가 될 거예요.", adv: "사랑한다는 말 소리 내서 전하기" },
    money: { head: "지갑에 황금빛이 드는 날", body: "작은 응모나 뽑기에도 도전해 보세요. 뜻밖의 행운이 손에 들어올 수 있는 날이에요.", adv: "오늘 하나만 응모하거나 뽑아 보기" },
    work: { head: "하는 일마다 인정받는 날", body: "미뤄 둔 제안이나 아이디어를 오늘 꺼내 보세요. 생각보다 큰 박수를 받게 될 거예요.", adv: "아껴 둔 아이디어 하나 꺼내 말하기" },
    study: { head: "머리가 번쩍 트이는 날", body: "어렵던 문제가 술술 풀려요. 오늘 공부한 건 오래도록 내 것이 돼요.", adv: "제일 어려운 과목부터 펼쳐 보기" },
    luck: { head: "100번 중 1번 오는 하루", body: "오늘은 무엇이든 해 볼 만한 날이에요. 망설이던 일이 있다면 지금 바로 도전해 보세요.", adv: "미뤄 둔 일 하나에 바로 도전하기" },
    yearend: { head: "올해 최고의 연말이 와요", body: "남은 날들이 선물처럼 채워질 거예요. 보고 싶은 사람들과 꼭 만날 약속을 잡아 보세요.", adv: "보고 싶은 사람과 연말 약속 잡기" },
  };
  const GOLD_COAT = "linear-gradient(90deg,#A8740A,#FFE9A3 38%,#F4C542 55%,#B8860B 85%)";
  const GOLD_BIS = "linear-gradient(90deg,#C99A3A,#FFF1C4 50%,#C99A3A)";
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
    gold:    { bg: "#1B1206", fg: "#FFE48A", hl: "#9A6B00" },
  };
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  function setTheme(key) {
    const t = THEMES[key] || THEMES.default;
    const root = document.documentElement.style;
    root.setProperty("--accent", t.bg);
    root.setProperty("--fg", t.fg);
    root.setProperty("--hl", t.hl);
    if (themeMeta) themeMeta.content = t.bg;
    document.body.classList.toggle("gold", key === "gold");
    $("#topTitle").textContent = key === "gold" ? "2026.11.11 빼빼로 운세" : "2026 빼빼로 운세";
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
    document.querySelectorAll(".pack").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.i === String(state.sel))));
    const btn = $("#draw");
    const has = state.sel !== null;
    btn.disabled = !has;
    btn.textContent = !has ? "상자를 먼저 골라 주세요"
      : state.sel === RANDOM ? "랜덤 상자 열기" : `${F[state.sel].n} 상자 열기`;
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
    if (Math.random() < 0.01 || location.hash === "#gold") {
      const g = GOLD[f.k];
      Object.assign(state.result, {
        gold: true, score: 100, head: g.head, detail: g.body, advice: g.adv,
        lucky: [["행운의 색", "황금색"], ["행운의 숫자", "100"], state.result.lucky[2], state.result.lucky[3]],
      });
      setTheme("gold");
    }
    renderDraw();
  });

  function renderDraw() {
    const { f, score, head, detail, gold } = state.result;
    const sec = $(".step.draw");
    sec.classList.remove("pulled");
    $("#drawBoxName").textContent = gold ? "1/100 확률 · 황금 빼빼로" : `${f.n} 상자`;
    $("#drawTitle").textContent = "하나 꺼내는 중…";
    $("#bigStick .coat").style.background = gold ? GOLD_COAT : coat(f);
    $("#bigStick .biscuit").style.background = gold ? GOLD_BIS : "";
    $("#quickHead").hidden = !gold;
    $("#quickHead").textContent = gold ? head : "";
    $("#toDetail").textContent = gold ? "황금 운세 자세히 보기" : "자세한 운세 보기";
    const box = $("#openBox");
    box.style.background = f.box;
    box.style.color = f.fg;
    $("#openBoxName").textContent = f.n;
    $("#quickType").textContent = gold ? `${f.n} · ${f.t}` : f.t;
    $("#quickScore").textContent = `${score}점`;
    $("#quickLine").textContent = gold ? detail : head;
    go("draw");

    clearTimeout(pullTimer);
    pullTimer = setTimeout(() => {
      sec.classList.add("pulled");
      if (gold) $("#drawTitle").innerHTML = "행운의 빼빼로가<br>나왔어요!";
      else $("#drawTitle").textContent = "쏙! 뽑았어요";
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
    const { f, score, head, detail, advice, match, lucky, gold } = state.result;
    $("#detailCard").hidden = !!gold;
    $("#goldCard").hidden = !gold;
    $("#share").textContent = gold ? "친구에게 자랑하기" : "친구에게 빼빼로 보내기";
    if (gold) {
      $("#goldMeta").textContent = `${f.n} · ${f.t}`;
      $("#goldHead").textContent = head;
      $("#goldBody").textContent = detail;
      $("#goldAdv").textContent = advice;
      $("#goldLucky").innerHTML = lucky.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
      go("detail");
      return;
    }
    $("#miniStick .coat").style.background = coat(f);
    $("#detailMeta").textContent = `${f.n} · ${f.t}`;
    $("#detailHead").textContent = head;
    $("#detailScore").textContent = score;
    $("#detailText").textContent = detail;
    $("#advice").textContent = advice;
    $("#match").textContent = match;
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
    const { f, head, gold } = state.result;
    const text = gold
      ? `1/100 확률 황금빼빼로 당첨! ${f.n} · ${f.t} 100점 ✨ "${head}" 너도 하나 뽑아 봐 🍫`
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
    setTimeout(() => (btn.textContent = gold ? "친구에게 자랑하기" : "친구에게 빼빼로 보내기"), 1800);
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


  async function renderResultImage() {
    const { f, score, head, detail, advice, match, lucky } = state.result;
    const t = THEMES[f.k] || THEMES.default;
    const INK = "#3A1A12";
    const sample = head + detail + (advice || "") + (match || "") + lucky.flat().join("") + "2026빼빼로운세같이먹으면좋은맛오늘해볼한가지점·cheetahtah.com/pepero";
    await Promise.all([
      document.fonts.load(`64px ${DISPLAY}`, sample),
      document.fonts.load(`400 36px ${SANS}`, sample),
      document.fonts.load(`700 36px ${SANS}`, sample),
      document.fonts.load(`58px ${PEN}`, advice),
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
      L.headY = y + 76;
      const headBottom = L.headY + 26 + (L.headLines.length - 1) * L.headLH + 18;
      y = Math.max(y + 190, headBottom + 44);
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
    ctx.fillStyle = t.bg;
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
    ctx.fillStyle = "rgba(0,0,0,.18)";
    roundRect(ctx, CX, 170 + 14, CW, L.cardBottom - 170, 48);
    ctx.fill();
    ctx.fillStyle = "#FFF6EA";
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
    ctx.textAlign = "center";
    ctx.font = `64px ${DISPLAY}`;
    ctx.fillText(String(score), scx, scy + 14);
    ctx.font = `700 24px ${SANS}`;
    ctx.fillText("점", scx, scy + 50);

    ctx.textAlign = "left";
    // 상세 운세
    ctx.fillStyle = INK;
    ctx.font = `400 36px ${SANS}`;
    L.detailLines.forEach((ln, i) => ctx.fillText(ln, IX, L.detailY + i * 62));

    // 행운 4칸
    const cw = (IW - 20) / 2, chh = 110;
    lucky.forEach(([k, v], i) => {
      const x = IX + (i % 2) * (cw + 20), y = L.gridY + Math.floor(i / 2) * (chh + 20);
      ctx.fillStyle = "#FFFFFF";
      roundRect(ctx, x, y, cw, chh, 24); ctx.fill();
      ctx.strokeStyle = "#EAD9C0"; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = "#6E5446";
      ctx.font = `400 24px ${SANS}`;
      ctx.fillText(k, x + 26, y + 42);
      ctx.fillStyle = INK;
      ctx.font = `700 34px ${SANS}`;
      ctx.fillText(v, x + 26, y + 88);
    });


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

  // 황금 빼빼로 저장 이미지: 어두운 배경 + 금색 카드
  async function renderGoldImage() {
    const { f, head, detail, advice, lucky } = state.result;
    const sample = head + detail + advice + lucky.flat().join("") + `${f.n} · ${f.t}` + "2026.11.11빼빼로운세GOLDENSTICK1/100점오늘꼭해볼한가지cheetahtah.com/pepero";
    await Promise.all([
      document.fonts.load(`64px ${DISPLAY}`, sample),
      document.fonts.load(`400 36px ${SANS}`, sample),
      document.fonts.load(`700 36px ${SANS}`, sample),
      document.fonts.load(`66px ${PEN}`, advice),
    ]).catch(() => {});
    const W = 1080, CX = 60, CW = W - CX * 2, IX = CX + 76, IW = CW - 152, MID = W / 2;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = W; canvas.height = 2000;

    // 레이아웃
    ctx.font = `66px ${DISPLAY}`;
    const headLines = wrap(ctx, head, IW);
    ctx.font = `400 38px ${SANS}`;
    const bodyLines = wrap(ctx, detail, IW);
    ctx.font = `66px ${PEN}`;
    const advLines = wrap(ctx, advice, IW);
    let y = 170 + 96;
    const eyebrowY = y; y += 50;
    const circleY = y + 105; y += 210 + 64;
    const metaY = y; y += 78;
    const headY = y + 10; y += headLines.length * 82 + 30;
    const bodyY = y + 10; y += bodyLines.length * 66 + 30;
    const gridY = y; y += 110 * 2 + 20 + 50;
    const dashY = y; y += 64;
    const advLabelY = y; y += 80;
    const advY = y; y += (advLines.length - 1) * 74 + 40;
    const cardBottom = y + 60;
    const H = Math.max(1350, cardBottom + 140);
    canvas.height = H;

    // 배경 + 빛
    ctx.fillStyle = "#1B1206"; ctx.fillRect(0, 0, W, H);
    const glow = ctx.createRadialGradient(MID, circleY, 0, MID, circleY, 700);
    glow.addColorStop(0, "rgba(255,214,90,.28)"); glow.addColorStop(1, "rgba(255,214,90,0)");
    ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

    // 상단 제목
    ctx.fillStyle = "#FFE48A";
    ctx.font = `700 32px ${SANS}`;
    ctx.textAlign = "left"; ctx.fillText("2026.11.11 빼빼로 운세", CX + 8, 112);
    ctx.textAlign = "right"; ctx.fillText("GOLDEN · 1/100", W - CX - 8, 112);

    // 금색 카드
    ctx.save();
    ctx.shadowColor = "rgba(244,197,66,.45)"; ctx.shadowBlur = 90;
    ctx.fillStyle = "#FFF6DA";
    roundRect(ctx, CX, 170, CW, cardBottom - 170, 56); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = "#E2B33C"; ctx.lineWidth = 5;
    roundRect(ctx, CX + 22, 192, CW - 44, cardBottom - 214, 40); ctx.stroke();

    ctx.textAlign = "center";
    ctx.fillStyle = "#9A6B00";
    ctx.font = `700 30px ${SANS}`;
    if ("letterSpacing" in ctx) ctx.letterSpacing = "8px";
    ctx.fillText("GOLDEN STICK · 1/100", MID, eyebrowY);
    if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";

    // 100점 원
    ctx.fillStyle = "#E2B33C";
    ctx.beginPath(); ctx.arc(MID, circleY, 111, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#FFF6DA";
    ctx.beginPath(); ctx.arc(MID, circleY, 106, 0, Math.PI * 2); ctx.fill();
    const cg = ctx.createLinearGradient(MID - 95, circleY - 95, MID + 95, circleY + 95);
    cg.addColorStop(0, "#B8860B"); cg.addColorStop(0.5, "#FFE9A3"); cg.addColorStop(1, "#D4A017");
    ctx.fillStyle = cg;
    ctx.beginPath(); ctx.arc(MID, circleY, 95, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#3A2A06";
    ctx.font = `78px ${DISPLAY}`; ctx.fillText("100", MID, circleY + 18);
    ctx.font = `700 26px ${SANS}`; ctx.fillText("점", MID, circleY + 56);

    ctx.fillStyle = "#9A6B00";
    ctx.font = `700 34px ${SANS}`; ctx.fillText(`${f.n} · ${f.t}`, MID, metaY);
    ctx.fillStyle = "#3A2A06";
    ctx.font = `66px ${DISPLAY}`;
    headLines.forEach((ln, i) => ctx.fillText(ln, MID, headY + 52 + i * 82));
    ctx.font = `400 38px ${SANS}`;
    bodyLines.forEach((ln, i) => ctx.fillText(ln, MID, bodyY + 40 + i * 66));

    // 행운 4칸
    ctx.textAlign = "left";
    const cw = (IW - 20) / 2, chh = 110;
    lucky.forEach(([k, v], i) => {
      const x = IX + (i % 2) * (cw + 20), yy = gridY + Math.floor(i / 2) * (chh + 20);
      ctx.fillStyle = "#FFFFFF"; roundRect(ctx, x, yy, cw, chh, 26); ctx.fill();
      ctx.strokeStyle = "#E8CF8A"; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = "#7A5A12"; ctx.font = `400 26px ${SANS}`; ctx.fillText(k, x + 28, yy + 42);
      ctx.fillStyle = "#3A2A06"; ctx.font = `700 36px ${SANS}`; ctx.fillText(v, x + 28, yy + 88);
    });

    // 오늘 꼭 해 볼 한 가지
    ctx.strokeStyle = "#D9B861"; ctx.lineWidth = 2; ctx.setLineDash([8, 8]);
    ctx.beginPath(); ctx.moveTo(IX, dashY); ctx.lineTo(IX + IW, dashY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.textAlign = "center";
    ctx.fillStyle = "#9A6B00"; ctx.font = `700 30px ${SANS}`;
    ctx.fillText("오늘 꼭 해 볼 한 가지", MID, advLabelY);
    ctx.fillStyle = "#3A2A06"; ctx.font = `66px ${PEN}`;
    advLines.forEach((ln, i) => ctx.fillText(ln, MID, advY + i * 74));

    ctx.fillStyle = "#FFE48A"; ctx.font = `700 30px ${SANS}`;
    ctx.fillText("cheetahtah.com/pepero", MID, cardBottom + (H - cardBottom) / 2 + 12);
    return new Promise((res) => canvas.toBlob(res, "image/png"));
  }

  $("#saveImg").addEventListener("click", async () => {
    const btn = $("#saveImg");
    const label = btn.querySelector("span");
    btn.disabled = true;
    label.textContent = "이미지 만드는 중…";
    try {
      const blob = state.result.gold ? await renderGoldImage() : await renderResultImage();
      const name = `2026-빼빼로운세-${state.result.gold ? "황금빼빼로-" : ""}${state.result.f.file || state.result.f.n}.png`;
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
