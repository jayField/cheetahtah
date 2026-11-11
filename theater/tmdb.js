// TMDB (https://www.themoviedb.org) 조회 전용 키
window.TMDB = (() => {
  const KEY = "faa715e6dd4ee1691d921318e77622bc";
  const BASE = "https://api.themoviedb.org/3";
  const IMG = "https://image.tmdb.org/t/p/";

  async function get(path, params = {}) {
    const q = new URLSearchParams({ api_key: KEY, language: "ko-KR", ...params });
    const res = await fetch(`${BASE}${path}?${q}`);
    if (!res.ok) throw new Error(`TMDB ${res.status}`);
    return res.json();
  }

  // 영화·TV를 한 번에 검색
  async function search(query) {
    const d = await get("/search/multi", { query, include_adult: "false" });
    return d.results.filter((r) => r.media_type === "movie" || r.media_type === "tv").map(normalize);
  }

  function normalize(r) {
    const type = r.media_type;
    const anime = (r.genre_ids || []).includes(16);
    const date = r.release_date || r.first_air_date || "";
    return {
      tmdb: { type, id: r.id },
      title: r.title || r.name || "",
      original: r.original_title || r.original_name || "",
      kind: anime ? "애니" : type === "movie" ? "영화" : "드라마",
      form: type === "movie" ? "영화" : "시리즈",
      year: date.slice(0, 4),
      overview: r.overview || "",
      poster: r.poster_path || "",
    };
  }

  // 상세 정보: 장르, 회차 수, 출연진
  async function details({ type, id }) {
    const d = await get(`/${type}/${id}`, { append_to_response: "credits" });
    return {
      genres: (d.genres || []).map((g) => g.name),
      runtime: d.runtime || (d.episode_run_time || [])[0] || 0,
      episodes: d.number_of_episodes || 0,
      seasons: d.number_of_seasons || 0,
      cast: ((d.credits && d.credits.cast) || []).slice(0, 5).map((c) => c.name),
      overview: d.overview || "",
    };
  }

  const img = (path, size = "w342") => (path ? `${IMG}${size}${path}` : "");

  return { search, details, img };
})();
