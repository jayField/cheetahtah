(() => {
  const D = window.THEATER;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const BGS = ["#2E3B55", "#5A2E3A", "#2F4A3C", "#4A3B24", "#3B2F5C", "#24434A"];
  const KIND_COLOR = { 영화: "#F2B544", 드라마: "#7FD1B9", 애니: "#F07A8A" };
  const KINDS = ["전체", "영화", "드라마", "애니"];

  // 홈 화면에 보이는 줄
  const HOME_ROWS = [
    { name: "우리의 인생작", pick: (w) => w.status === "best" },
    { name: "애니 정주행 목록", pick: (w) => w.anime },
    { name: "다음에 같이 볼 거", pick: (w) => w.status === "want" && !w.anime },
  ];
  // 상단 메뉴별 화면
  const VIEWS = {
    watched: { name: "봤어요", pick: (w) => w.status === "best" || w.status === "watched" },
    best: { name: "인생작", pick: (w) => w.status === "best" },
    want: { name: "볼 거예요", pick: (w) => w.status === "want" },
  };

  const state = { view: "home", kind: "전체", q: "" };

  // ---------- 기기에 저장 (초안: 이 브라우저에서만 유지) ----------
  const KEY = "theater:watching";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const save = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {} };
  const saved = load();
  const watching = { ...D.watching, ...(saved.title === D.watching.title ? saved : {}) };

  // ---------- 종류 탭 ----------
  function renderTabs() {
    const count = (k) => (k === "전체" ? D.works.length : D.works.filter((w) => w.kind === k).length);
    $("#tabs").innerHTML = KINDS.map(
      (k) => `<button class="tab" role="tab" type="button" data-kind="${k}" aria-selected="${k === state.kind}">${k} <span>${count(k)}</span></button>`
    ).join("");
  }
  $("#tabs").addEventListener("click", (e) => {
    const b = e.target.closest(".tab");
    if (!b) return;
    state.kind = b.dataset.kind;
    renderTabs();
    renderRows();
  });

  // ---------- 상단 메뉴 ----------
  $("#nav").addEventListener("click", (e) => {
    const a = e.target.closest("a[data-view]");
    if (!a) return;
    e.preventDefault();
    setView(a.dataset.view);
  });
  function setView(view) {
    state.view = view;
    document.querySelectorAll("#nav a").forEach((a) => a.classList.toggle("on", a.dataset.view === view));
    renderRows();
  }

  // ---------- 검색 ----------
  $("#q").addEventListener("input", (e) => {
    state.q = e.target.value.trim().toLowerCase();
    renderRows();
  });

  // ---------- 작품 줄 ----------
  const card = (w, i) => `
    <div class="item">
      <div class="poster" style="background:${BGS[i % BGS.length]}">
        <span class="kind" style="color:${KIND_COLOR[w.kind]}">${esc(w.kind)}</span>
        <span>${esc(w.title)}</span>
      </div>
      <div class="item-meta">${esc(w.meta)}</div>
    </div>`;

  function renderRows() {
    const match = (w) =>
      (state.kind === "전체" || w.kind === state.kind) && (!state.q || w.title.toLowerCase().includes(state.q));
    const rows = state.view === "home" ? HOME_ROWS : [VIEWS[state.view]];
    const html = rows
      .map((row) => {
        const items = D.works.filter((w) => row.pick(w) && match(w));
        if (!items.length) return "";
        const more = state.view === "home" ? `<a href="#" data-more="${esc(row.name)}">전체 보기</a>` : "";
        return `<section class="row">
          <div class="row-head"><h2>${esc(row.name)}</h2>${more}</div>
          <div class="grid">${items.map(card).join("")}</div>
        </section>`;
      })
      .join("");
    $("#rows").innerHTML = html;
    $("#empty").hidden = !!html;
    $("#hero").hidden = state.view !== "home" || !!state.q;
  }
  // 홈의 "전체 보기" → 해당 메뉴로
  $("#rows").addEventListener("click", (e) => {
    const a = e.target.closest("a[data-more]");
    if (!a) return;
    e.preventDefault();
    const to = { "우리의 인생작": "best", "애니 정주행 목록": "want", "다음에 같이 볼 거": "want" }[a.dataset.more];
    if (to) setView(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ---------- 지금 같이 보는 중 ----------
  function renderHero() {
    const w = watching;
    const pct = Math.round((w.done / w.total) * 100);
    $("#heroPoster").style.background = w.poster;
    $("#heroPoster").innerHTML = esc(w.title).replace(" ", "<br>");
    $("#heroTitle").textContent = w.title;
    $("#heroMeta").textContent = w.meta;
    $("#heroDone").textContent = w.done >= w.total ? "다 봤어요!" : `${w.done}화까지 봤어요`;
    $("#heroPct").textContent = `${pct}%`;
    $("#heroBar").style.width = `${pct}%`;
    const btn = $("#checkEp");
    btn.disabled = w.done >= w.total;
    btn.textContent = w.done >= w.total ? "완주했어요" : `${w.done + 1}화 봤다고 체크`;
    $("#heroReview").hidden = !w.review;
    $("#heroReview").textContent = w.review ? `“${w.review}”` : "";
    $("#writeReview").textContent = w.review ? "한줄평 고치기" : "한줄평 남기기";
  }
  const persist = () => save({ title: watching.title, done: watching.done, review: watching.review });

  $("#checkEp").addEventListener("click", () => {
    if (watching.done >= watching.total) return;
    watching.done += 1;
    persist();
    renderHero();
  });
  $("#writeReview").addEventListener("click", () => {
    const v = prompt("한줄평을 남겨 주세요", watching.review || "");
    if (v === null) return;
    watching.review = v.trim();
    persist();
    renderHero();
  });

  renderTabs();
  renderHero();
  renderRows();
})();
