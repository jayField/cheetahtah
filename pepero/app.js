(() => {
  const COATS = {
    milk:  { label: "밀크", color: "#6b3a22", shine: "#8b5236" },
    dark:  { label: "다크", color: "#3a1d12", shine: "#55301f" },
    straw: { label: "딸기", color: "#f39ab0", shine: "#f9bfcd" },
    white: { label: "화이트", color: "#f6ecd9", shine: "#fffaf0" },
    matcha:{ label: "말차", color: "#8bae5a", shine: "#a8c77b" },
    cookie:{ label: "쿠앤크", color: "#efe8df", shine: "#fffaf4" },
  };
  const TOPS = {
    none:     { label: "없음" },
    almond:   { label: "아몬드" },
    sprinkle: { label: "스프링클" },
    crunch:   { label: "크런치" },
    drizzle:  { label: "드리즐" },
  };
  const BOXES = ["#e8344e", "#ff8a3d", "#f2b8c6", "#7b4cc2", "#2d7d6b", "#2b3a67", "#3b2116"];

  const state = { coat: "milk", top: "almond", box: BOXES[0], count: 5 };
  const $ = (s) => document.querySelector(s);

  // ---------- 스틱 SVG ----------
  // 결정적인 난수(같은 seed → 같은 토핑 배치)
  const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

  function stickSVG(coatKey, topKey, seed) {
    const W = 16, H = 190, bare = 40, coatH = H - bare;
    const c = COATS[coatKey] || COATS.milk;
    const r = rng(seed * 97 + 13);
    let deco = "";

    if (coatKey === "cookie") {
      for (let i = 0; i < 18; i++) {
        deco += `<circle cx="${2 + r() * 12}" cy="${6 + r() * (coatH - 10)}" r="${0.8 + r() * 1.4}" fill="#2a1a12"/>`;
      }
    }
    if (topKey === "almond") {
      for (let i = 0; i < 12; i++) {
        deco += `<rect x="${1 + r() * 10}" y="${6 + r() * (coatH - 12)}" width="${3 + r() * 3}" height="${2 + r() * 2}" rx="1.2" fill="#e2b77a" transform="rotate(${r() * 60 - 30} 8 ${i * 10})"/>`;
      }
    } else if (topKey === "sprinkle") {
      const cols = ["#ff5d7a", "#ffd23f", "#4fc3f7", "#7ddc7a", "#fff", "#b388ff"];
      for (let i = 0; i < 26; i++) {
        const x = 2 + r() * 12, y = 6 + r() * (coatH - 10), a = r() * 180;
        deco += `<rect x="${x}" y="${y}" width="4" height="1.6" rx=".8" fill="${cols[i % cols.length]}" transform="rotate(${a} ${x + 2} ${y + 0.8})"/>`;
      }
    } else if (topKey === "crunch") {
      for (let i = 0; i < 30; i++) {
        deco += `<circle cx="${1 + r() * 14}" cy="${5 + r() * (coatH - 8)}" r="${0.6 + r() * 1.3}" fill="#f1d3a1" opacity=".9"/>`;
      }
    } else if (topKey === "drizzle") {
      const lc = coatKey === "white" || coatKey === "cookie" || coatKey === "straw" ? "#5a2e1c" : "#fff4e6";
      let d = "M0 8";
      for (let y = 8; y < coatH - 6; y += 9) d += ` L16 ${y + 4.5} L0 ${y + 9}`;
      deco += `<path d="${d}" stroke="${lc}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".9"/>`;
    }

    return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true">
      <defs><clipPath id="c${seed}"><rect x="0" y="0" width="${W}" height="${coatH}" rx="8"/></clipPath></defs>
      <rect x="1" y="${coatH - 10}" width="${W - 2}" height="${bare + 10}" rx="6" fill="#e9c08a"/>
      <rect x="3" y="${coatH}" width="3" height="${bare - 6}" rx="1.5" fill="#f6d9ad"/>
      <g clip-path="url(#c${seed})">
        <rect x="0" y="0" width="${W}" height="${coatH}" fill="${c.color}"/>
        <rect x="3" y="4" width="3" height="${coatH - 14}" rx="1.5" fill="${c.shine}" opacity=".8"/>
        ${deco}
      </g>
    </svg>`;
  }

  function renderSticks(container, s) {
    const n = Math.max(1, Math.min(11, s.count | 0));
    let html = "";
    for (let i = 0; i < n; i++) {
      const mid = (n - 1) / 2;
      const tilt = (i - mid) * 4;
      const lift = -Math.abs(i - mid) * 6 + ((i * 7) % 3) * 4;
      html += `<span class="stick" style="transform: translateY(${-lift}px) rotate(${tilt}deg)">${stickSVG(s.coat, s.top, i + 1)}</span>`;
    }
    container.innerHTML = html;
  }

  function setBoxColor(color) {
    document.documentElement.style.setProperty("--box", color);
  }

  // ---------- 링크 인코딩 (UTF-8 → base64url) ----------
  function encode(obj) {
    const bytes = new TextEncoder().encode(JSON.stringify(obj));
    let bin = "";
    bytes.forEach((b) => (bin += String.fromCharCode(b)));
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function decode(str) {
    try {
      const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
      const bin = atob(b64 + "===".slice((b64.length + 3) % 4));
      const bytes = Uint8Array.from(bin, (ch) => ch.charCodeAt(0));
      return JSON.parse(new TextDecoder().decode(bytes));
    } catch {
      return null;
    }
  }

  // ---------- 배경 ----------
  function rainSticks() {
    const wrap = $(".bg-sticks");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (let i = 0; i < 14; i++) {
      const el = document.createElement("i");
      el.style.left = `${Math.random() * 100}%`;
      el.style.animationDuration = `${9 + Math.random() * 10}s`;
      el.style.animationDelay = `${-Math.random() * 18}s`;
      el.style.setProperty("--r", `${(Math.random() * 120 - 60) | 0}deg`);
      wrap.appendChild(el);
    }
  }

  // ---------- 카운트다운 ----------
  function countdown() {
    const el = $("#countdown");
    const tick = () => {
      const now = new Date();
      let target = new Date(now.getFullYear(), 10, 11);
      const end = new Date(now.getFullYear(), 10, 12);
      if (now >= target && now < end) {
        el.textContent = "오늘은 빼빼로데이! 🍫";
        return;
      }
      if (now >= end) target = new Date(now.getFullYear() + 1, 10, 11);
      const ms = target - now;
      const d = Math.floor(ms / 864e5);
      const h = Math.floor((ms % 864e5) / 36e5);
      const m = Math.floor((ms % 36e5) / 6e4);
      const s = Math.floor((ms % 6e4) / 1e3);
      el.textContent = d > 0
        ? `빼빼로데이까지 ${d}일 ${h}시간 ${m}분`
        : `빼빼로데이까지 ${h}시간 ${m}분 ${s}초`;
    };
    tick();
    setInterval(tick, 1000);
  }

  // ---------- 만들기 ----------
  function initMaker() {
    const chipGroups = document.querySelectorAll(".chips");
    chipGroups.forEach((group) => {
      const key = group.dataset.key;
      const entries =
        key === "coat" ? Object.entries(COATS) :
        key === "top" ? Object.entries(TOPS) :
        BOXES.map((c) => [c, { label: c }]);

      group.innerHTML = entries.map(([val, o]) => {
        if (key === "box") {
          return `<button type="button" class="chip" data-val="${val}" aria-label="상자 색 ${val}" style="background:${val}"></button>`;
        }
        const dot = key === "coat" ? `<span class="dot" style="background:${o.color}"></span>` : "";
        return `<button type="button" class="chip" data-val="${val}">${dot}${o.label}</button>`;
      }).join("");

      group.addEventListener("click", (e) => {
        const btn = e.target.closest(".chip");
        if (!btn) return;
        state[key] = btn.dataset.val;
        update();
      });
    });

    $("#count").addEventListener("input", (e) => {
      state.count = +e.target.value;
      update();
    });
    $("#msg").addEventListener("input", (e) => {
      $("#msgLen").textContent = e.target.value.length;
    });

    $("#form").addEventListener("submit", (e) => {
      e.preventDefault();
      const gift = {
        c: state.coat,
        t: state.top,
        b: state.box,
        n: state.count,
        to: $("#to").value.trim(),
        fr: $("#from").value.trim(),
        m: $("#msg").value.trim(),
      };
      const url = new URL(location.href);
      url.search = "";
      url.hash = "";
      url.searchParams.set("g", encode(gift));
      const link = url.toString();

      $("#link").value = link;
      $("#peek").href = link;
      $("#share").hidden = false;
      $("#share").scrollIntoView({ behavior: "smooth", block: "center" });
    });

    $("#copy").addEventListener("click", async () => {
      const btn = $("#copy");
      try {
        await navigator.clipboard.writeText($("#link").value);
      } catch {
        $("#link").select();
        document.execCommand("copy");
      }
      btn.textContent = "복사됨!";
      setTimeout(() => (btn.textContent = "복사"), 1500);
    });

    if (navigator.share) {
      const nb = $("#native");
      nb.hidden = false;
      nb.addEventListener("click", () => {
        navigator.share({
          title: "빼빼로가 도착했어요 🍫",
          text: "너를 위해 빼빼로를 만들었어!",
          url: $("#link").value,
        }).catch(() => {});
      });
    }

    function update() {
      chipGroups.forEach((g) => {
        g.querySelectorAll(".chip").forEach((b) => {
          b.setAttribute("aria-pressed", String(b.dataset.val === state[g.dataset.key]));
        });
      });
      $("#countOut").textContent = state.count;
      setBoxColor(state.box);
      renderSticks($("#previewSticks"), state);
    }

    update();
    countdown();
  }

  // ---------- 받기 ----------
  function initReceiver(g) {
    $("#maker").hidden = true;
    $("#receiver").hidden = false;

    const s = {
      coat: COATS[g.c] ? g.c : "milk",
      top: TOPS[g.t] ? g.t : "none",
      box: /^#[0-9a-f]{6}$/i.test(g.b) ? g.b : BOXES[0],
      count: g.n,
    };
    setBoxColor(s.box);
    renderSticks($("#giftSticks"), s);

    const to = String(g.to || "").slice(0, 20);
    const fr = String(g.fr || "").slice(0, 20);
    const msg = String(g.m || "").slice(0, 200);

    $("#rTo").textContent = to ? `To. ${to}` : "11 · 11";
    $("#rMsg").textContent = msg || "빼빼로데이 축하해! 🍫";
    $("#rFrom").textContent = fr ? `From. ${fr}` : "";
    document.title = to ? `${to}님에게 빼빼로가 도착했어요` : "빼빼로가 도착했어요";

    const gift = $("#gift");
    gift.addEventListener("click", () => {
      if (gift.classList.contains("opened")) return;
      gift.classList.add("opened");
      $("#giftBox").classList.add("open");
      setTimeout(() => {
        $("#letter").hidden = false;
        $("#makeOwn").hidden = false;
      }, 1200);
    }, { once: true });
  }

  // ---------- 시작 ----------
  rainSticks();
  const param = new URLSearchParams(location.search).get("g");
  const gift = param && decode(param);
  if (gift && typeof gift === "object") initReceiver(gift);
  else initMaker();
})();
