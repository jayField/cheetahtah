(() => {
  const D = window.THEATER;
  const T = window.TMDB;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const BGS = ["#2E3B55", "#5A2E3A", "#2F4A3C", "#4A3B24", "#3B2F5C", "#24434A"];
  const KIND_COLOR = { 영화: "#F2B544", 드라마: "#7FD1B9", 애니: "#F07A8A" };
  const KINDS = ["전체", "영화", "드라마", "애니"];

  const HOME_ROWS = [
    { name: "우리의 인생작", pick: (w) => w.status === "best", to: "best" },
    { name: "최근 관람작", pick: (w) => w.status === "watched", to: "watched" },
    { name: "상영 예정작", pick: (w) => w.status === "want", to: "want" },
  ];
  const VIEWS = {
    watched: { name: "관람작", pick: (w) => w.status === "best" || w.status === "watched" },
    best: { name: "인생작", pick: (w) => w.status === "best" },
    want: { name: "상영 예정", pick: (w) => w.status === "want" },
  };

  // ---------- 저장 (지금은 이 브라우저에만) ----------
  const store = {
    get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };
  const WORKS_KEY = "theater:works:v1";
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  // 처음 들어오면 예시 목록으로 시작
  let works = store.get(WORKS_KEY, null);
  if (!Array.isArray(works)) {
    works = D.works.map((w, i) => ({ id: "seed" + i, ...w, added: i }));
    store.set(WORKS_KEY, works);
  }
  // 예전 예시 작품은 지우고 직접 추가한 작품만 남김
  if (works.some((w) => String(w.id).startsWith("seed"))) {
    works = works.filter((w) => !String(w.id).startsWith("seed"));
    store.set(WORKS_KEY, works);
  }
  const saveWorks = () => store.set(WORKS_KEY, works);

  // 이름: 나 → 재현, 너 → 다진 (예전에 저장된 문구도 바꿈)
  const ME = "재현", YOU = "다진";
  const rename = (t) => (t || "")
    .replace(/(^|· )나 ★/g, `$1${ME} ★`).replace(/(^|· )너 ★/g, `$1${YOU} ★`)
    .replace(/나의 추천/g, `${ME} 추천`).replace(/너의 추천/g, `${YOU} 추천`);
  let renamed = false;
  works.forEach((w) => {
    for (const k of ["meta", "memo"]) {
      if (w[k] && rename(w[k]) !== w[k]) { w[k] = rename(w[k]); renamed = true; }
    }
  });
  if (renamed) saveWorks();

  const state = { view: "home", kind: "전체", genre: "", q: "" };

  // 카드에 붙일 장르 태그 (종류와 겹치는 장르는 빼고 2개까지)
  const tagsOf = (w) => (w.genres || []).filter((g) =>
    !(g === "애니메이션" && w.kind === "애니") && !(g === "드라마" && w.kind === "드라마"));

  // ---------- 별점 표시 ----------
  const star = (v) => (v ? `★${v}` : "");
  function metaOf(w) {
    if (w.me || w.you) {
      if (w.me && w.me === w.you) return `둘 다 ${star(w.me)}`;
      return [w.me && `${ME} ${star(w.me)}`, w.you && `${YOU} ${star(w.you)}`].filter(Boolean).join(" · ");
    }
    return w.memo || w.meta || (w.year ? `${w.year}` : "");
  }

  // ---------- 종류 탭 ----------
  function renderTabs() {
    const count = (k) => (k === "전체" ? works.length : works.filter((w) => w.kind === k).length);
    $("#tabs").innerHTML = KINDS.map(
      (k) => `<button class="tab" role="tab" type="button" data-kind="${k}" aria-selected="${k === state.kind}">${k} <span>${count(k)}</span></button>`
    ).join("");
  }
  function renderGenres() {
    const pool = works.filter((w) => state.kind === "전체" || w.kind === state.kind);
    const count = {};
    pool.forEach((w) => tagsOf(w).forEach((g) => (count[g] = (count[g] || 0) + 1)));
    const list = Object.keys(count).sort((a, b) => count[b] - count[a]);
    if (state.genre && !count[state.genre]) state.genre = "";
    $("#genres").hidden = !list.length;
    $("#genres").innerHTML = ["", ...list].map((g) =>
      `<button type="button" class="chip" data-genre="${esc(g)}" aria-pressed="${g === state.genre}">${g ? "#" + esc(g) : "모든 장르"}</button>`
    ).join("");
  }
  $("#genres").addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    state.genre = b.dataset.genre === state.genre ? "" : b.dataset.genre;
    renderGenres();
    renderRows();
  });

  $("#tabs").addEventListener("click", (e) => {
    const b = e.target.closest(".tab");
    if (!b) return;
    state.kind = b.dataset.kind;
    renderTabs();
    renderGenres();
    renderRows();
  });

  // ---------- 상단 메뉴 / 검색 ----------
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
  $("#q").addEventListener("input", (e) => {
    state.q = e.target.value.trim().toLowerCase();
    renderRows();
  });

  // ---------- 작품 카드 ----------
  const card = (w, i) => {
    const img = T.img(w.poster);
    return `
    <button class="item" type="button" data-id="${esc(w.id)}">
      <div class="poster${img ? " has-img" : ""}" style="background-color:${BGS[i % BGS.length]}">
        ${img ? `<img src="${img}" alt="" loading="lazy" />` : ""}
        <span class="kind" style="color:${KIND_COLOR[w.kind] || "#fff"}">${esc(w.kind)}</span>
        <span class="poster-title">${esc(w.title)}</span>
      </div>
      <div class="item-meta">${esc(metaOf(w))}</div>
      ${tagsOf(w).length ? `<div class="tags">${[...tagsOf(w)].sort((x, y) => (y === state.genre) - (x === state.genre)).slice(0, 2).map((g) => `<span>#${esc(g)}</span>`).join("")}</div>` : ""}
    </button>`;
  };

  function renderRows() {
    const match = (w) =>
      (state.kind === "전체" || w.kind === state.kind) &&
      (!state.genre || tagsOf(w).includes(state.genre)) && (!state.q || w.title.toLowerCase().includes(state.q));
    const sorted = [...works].sort((a, b) => (b.added || 0) - (a.added || 0));
    const rows = state.view === "home" ? HOME_ROWS : [VIEWS[state.view]];
    const html = rows
      .map((row) => {
        let items = sorted.filter((w) => row.pick(w) && match(w));
        if (!items.length) return "";
        const limit = state.view === "home" ? 12 : Infinity;
        const more = state.view === "home" ? `<a href="#" data-more="${row.to}">전체 보기</a>` : "";
        return `<section class="row">
          <div class="row-head"><h2>${esc(row.name)} <small>${items.length}</small></h2>${more}</div>
          <div class="grid">${items.slice(0, limit).map(card).join("")}</div>
        </section>`;
      })
      .join("");
    $("#rows").innerHTML = html;
    $("#empty").hidden = !!html;
    $("#empty").textContent = works.length ? "찾는 작품이 없어요." : "아직 작품이 없어요. ‘+ 작품 추가’로 시작해 보세요.";
    $("#hero").hidden = !D.watching || state.view !== "home" || !!state.q;
  }
  $("#rows").addEventListener("click", (e) => {
    const a = e.target.closest("a[data-more]");
    if (a) {
      e.preventDefault();
      setView(a.dataset.more);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const it = e.target.closest(".item");
    if (it) openEdit(works.find((w) => w.id === it.dataset.id));
  });
  const renderAll = () => { renderTabs(); renderGenres(); renderRows(); };

  // ---------- 지금 같이 보는 중 ----------
  const WATCH_KEY = "theater:watching";
  const savedW = store.get(WATCH_KEY, {});
  const watching = D.watching ? { ...D.watching, ...(savedW.title === D.watching.title ? savedW : {}) } : null;
  function renderHero() {
    const w = watching;
    if (!w) return;
    const pct = Math.round((w.done / w.total) * 100);
    const hp = $("#heroPoster");
    hp.style.background = w.poster;
    hp.innerHTML = w.posterPath
      ? `<img src="${T.img(w.posterPath, "w500")}" alt="" />`
      : esc(w.title).replace(" ", "<br>");
    hp.classList.toggle("has-img", !!w.posterPath);
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
  const persistW = () => store.set(WATCH_KEY, { title: watching.title, done: watching.done, review: watching.review, posterPath: watching.posterPath });
  $("#checkEp").addEventListener("click", () => {
    if (watching.done >= watching.total) return;
    watching.done += 1;
    persistW();
    renderHero();
  });
  $("#writeReview").addEventListener("click", () => {
    const v = prompt("한줄평을 남겨 주세요", watching.review || "");
    if (v === null) return;
    watching.review = v.trim();
    persistW();
    renderHero();
  });

  // ---------- 작품 추가 / 수정 창 ----------
  const modal = $("#modal");
  const form = $("#editPane");
  const RATES = ["", "0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5"];
  form.querySelectorAll("select").forEach((s) => {
    s.innerHTML = RATES.map((r) => `<option value="${r}">${r ? "★" + r : "아직"}</option>`).join("");
  });
  let draft = null; // 지금 편집 중인 작품

  function showPane(name) {
    $("#searchPane").hidden = name !== "search";
    form.hidden = name !== "edit";
  }
  function openSearch() {
    showPane("search");
    $("#tq").value = "";
    $("#results").innerHTML = "";
    $("#searchHint").textContent = "제목을 입력하면 TMDB에서 찾아요.";
    modal.showModal();
    setTimeout(() => $("#tq").focus(), 50);
  }
  $("#openAdd").addEventListener("click", openSearch);
  $("#closeModal").addEventListener("click", () => modal.close());
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });

  // 검색 (입력 멈추면 실행)
  let timer, lastQ = "", found = [];
  $("#tq").addEventListener("input", (e) => {
    clearTimeout(timer);
    const q = e.target.value.trim();
    if (!q) { $("#results").innerHTML = ""; $("#searchHint").textContent = "제목을 입력하면 TMDB에서 찾아요."; return; }
    timer = setTimeout(() => runSearch(q), 350);
  });
  async function runSearch(q) {
    lastQ = q;
    $("#searchHint").textContent = "찾는 중…";
    try {
      const list = await T.search(q);
      if (q !== lastQ) return;
      found = list;
      $("#searchHint").textContent = list.length ? "추가할 작품을 골라요." : "검색 결과가 없어요. 다른 제목으로 찾아 보세요.";
      $("#results").innerHTML = list.slice(0, 12).map((r, i) => {
        const have = works.some((w) => w.tmdb && w.tmdb.id === r.tmdb.id && w.tmdb.type === r.tmdb.type);
        return `<li><button type="button" data-i="${i}">
          <span class="thumb">${r.poster ? `<img src="${T.img(r.poster, "w92")}" alt="" loading="lazy" />` : ""}</span>
          <span class="r-body"><b>${esc(r.title)}</b><small>${esc([r.kind, r.form !== r.kind ? r.form : "", r.year].filter(Boolean).join(" · "))}${r.original && r.original !== r.title ? " · " + esc(r.original) : ""}</small></span>
          ${have ? '<span class="have">추가됨</span>' : ""}
        </button></li>`;
      }).join("");
    } catch {
      $("#searchHint").textContent = "TMDB에 연결하지 못했어요. 잠시 후 다시 해 보세요.";
    }
  }
  $("#results").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-i]");
    if (!b) return;
    const r = found[+b.dataset.i];
    const existing = works.find((w) => w.tmdb && w.tmdb.id === r.tmdb.id && w.tmdb.type === r.tmdb.type);
    openEdit(existing || { ...r, status: "watched", me: "", you: "", memo: "" }, !existing);
  });
  $("#eBack").addEventListener("click", () => showPane("search"));

  function openEdit(w, isNew = false) {
    if (!w) return;
    draft = { ...w, isNew };
    const img = T.img(w.poster, "w342");
    $("#ePoster").innerHTML = img ? `<img src="${img}" alt="" />` : `<span>${esc(w.title)}</span>`;
    $("#eKind").textContent = w.kind;
    $("#eKind").style.color = KIND_COLOR[w.kind] || "#fff";
    $("#eTitle").textContent = w.title;
    $("#eSub").textContent = [w.year, w.form && w.form !== w.kind ? w.form : "", w.original && w.original !== w.title ? w.original : ""].filter(Boolean).join(" · ");
    $("#eExtra").textContent = "";
    $("#eOverview").textContent = w.overview || "";
    $("#eOverview").hidden = !w.overview;
    form.status.value = w.status || "watched";
    form.me.value = w.me || "";
    form.you.value = w.you || "";
    form.memo.value = w.memo || "";
    $("#eDelete").hidden = isNew;
    $("#eBack").hidden = !isNew;
    $("#eSave").textContent = isNew ? "추가하기" : "저장";
    showPane("edit");
    if (!modal.open) modal.showModal();
    // 장르·회차·출연진은 따로 불러옴
    if (w.tmdb) {
      T.details(w.tmdb).then((d) => {
        if (!draft || draft.title !== w.title) return;
        const bits = [d.genres.slice(0, 3).map((g) => "#" + g).join(" "), d.episodes ? `${d.episodes}화` : d.runtime ? `${d.runtime}분` : "", d.cast.length ? d.cast.slice(0, 3).join(", ") : ""];
        $("#eExtra").textContent = bits.filter(Boolean).join(" · ");
        if (!w.overview && d.overview) { $("#eOverview").textContent = d.overview; $("#eOverview").hidden = false; draft.overview = d.overview; }
        draft.genres = d.genres;
        draft.episodes = d.episodes;
      }).catch(() => {});
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!draft) return;
    const { isNew, ...w } = draft;
    Object.assign(w, {
      status: form.status.value,
      me: form.me.value,
      you: form.you.value,
      memo: form.memo.value.trim(),
    });
    delete w.meta; // 예시 문구 대신 별점/메모로 표시
    if (isNew) {
      w.id = uid();
      w.added = Date.now();
      works.push(w);
    } else {
      const i = works.findIndex((x) => x.id === w.id);
      if (i >= 0) works[i] = w;
    }
    saveWorks();
    modal.close();
    renderAll();
  });
  $("#eDelete").addEventListener("click", () => {
    if (!draft || !confirm(`‘${draft.title}’을(를) 목록에서 지울까요?`)) return;
    works = works.filter((w) => w.id !== draft.id);
    saveWorks();
    modal.close();
    renderAll();
  });

  // ---------- 예시 작품에 포스터 붙이기 (제목으로 한 번만 찾음) ----------
  async function fillPosters() {
    const pending = works.filter((w) => !w.tmdb && !w.tmdbTried);
    for (const w of pending) {
      try {
        const [hit] = await T.search(w.title);
        w.tmdbTried = 1;
        if (hit) Object.assign(w, { tmdb: hit.tmdb, poster: hit.poster, year: hit.year, overview: hit.overview, original: hit.original, form: hit.form, genres: hit.genres });
      } catch { break; }
    }
    // 예전에 추가돼 장르가 없는 작품은 상세 정보에서 장르를 가져옴
    const noGenre = works.filter((w) => w.tmdb && !w.genres);
    for (const w of noGenre) {
      try { w.genres = (await T.details(w.tmdb)).genres; } catch { break; }
    }
    if (pending.length || noGenre.length) { saveWorks(); renderAll(); }
    if (watching && !watching.posterPath) {
      try {
        const [hit] = await T.search(watching.title);
        if (hit && hit.poster) { watching.posterPath = hit.poster; persistW(); renderHero(); }
      } catch {}
    }
  }

  renderHero();
  renderAll();
  fillPosters();
})();
