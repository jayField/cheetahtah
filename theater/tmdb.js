// TMDB (https://www.themoviedb.org) 조회 전용 키
window.TMDB = (() => {
  const KEY = "faa715e6dd4ee1691d921318e77622bc";
  const BASE = "https://api.themoviedb.org/3";
  const IMG = "https://image.tmdb.org/t/p/";

  // 영화·TV 장르 (TV 장르 일부는 한글 번역이 없어 직접 붙임)
  const GENRES = {
    28: "액션", 12: "모험", 16: "애니메이션", 35: "코미디", 80: "범죄", 99: "다큐멘터리", 18: "드라마",
    10751: "가족", 14: "판타지", 36: "역사", 27: "공포", 10402: "음악", 9648: "미스터리", 10749: "로맨스",
    878: "SF", 10770: "TV 영화", 53: "스릴러", 10752: "전쟁", 37: "서부",
    10759: "액션", 10762: "키즈", 10763: "뉴스", 10764: "리얼리티", 10765: "SF·판타지",
    10766: "연속극", 10767: "토크", 10768: "전쟁·정치",
  };
  const genreNames = (ids) => [...new Set((ids || []).map((id) => GENRES[id]).filter(Boolean))];

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
      genres: genreNames(r.genre_ids),
    };
  }

  // 상세 정보: 장르, 회차 수, 출연진
  async function details({ type, id }) {
    const d = await get(`/${type}/${id}`, { append_to_response: "credits" });
    return {
      genres: genreNames((d.genres || []).map((g) => g.id)),
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
