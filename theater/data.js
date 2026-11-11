// 초안용 예시 데이터 (시안 "02 밤의 상영관" 내용 그대로)
// status: best 인생작 · watched 봤어요 · want 볼 거예요
window.THEATER = {
  watching: {
    title: "스물다섯 스물하나",
    kind: "드라마",
    meta: "드라마 · 16부작 · 매주 금요일 밤에 2화씩",
    total: 16,
    done: 9,
    poster: "#3B2F5C",
  },
  works: [
    { title: "헤어질 결심", kind: "영화", status: "best", meta: "둘 다 ★5" },
    { title: "나의 아저씨", kind: "드라마", status: "best", meta: "둘 다 ★5" },
    { title: "센과 치히로의 행방불명", kind: "애니", status: "best", meta: "둘 다 ★5" },
    { title: "이터널 선샤인", kind: "영화", status: "best", meta: "나 ★5 · 너 ★4.5" },
    { title: "응답하라 1988", kind: "드라마", status: "best", meta: "너 ★5" },
    { title: "바이올렛 에버가든", kind: "애니", status: "best", meta: "둘 다 ★4.5" },

    { title: "어바웃 타임", kind: "영화", status: "watched", meta: "나 ★4 · 너 ★4.5" },
    { title: "라라랜드", kind: "영화", status: "watched", meta: "나 ★4.5 · 너 ★3.5" },
    { title: "우리들의 블루스", kind: "드라마", status: "watched", meta: "둘 다 ★4" },

    { title: "너의 이름은.", kind: "애니", status: "want", meta: "영화 · 나의 추천", anime: 1 },
    { title: "스즈메의 문단속", kind: "애니", status: "want", meta: "영화 · 둘 다 찜", anime: 1 },
    { title: "장송의 프리렌", kind: "애니", status: "want", meta: "시리즈 · 너의 추천", anime: 1 },
    { title: "하이큐!!", kind: "애니", status: "want", meta: "시리즈 · 나의 추천", anime: 1 },
    { title: "스파이 패밀리", kind: "애니", status: "want", meta: "시리즈 · 둘 다 찜", anime: 1 },
    { title: "날씨의 아이", kind: "애니", status: "want", meta: "영화 · 너의 추천", anime: 1 },

    { title: "비포 선라이즈", kind: "영화", status: "want", meta: "너의 추천" },
    { title: "멜로가 체질", kind: "드라마", status: "want", meta: "나의 추천" },
    { title: "리틀 포레스트", kind: "영화", status: "want", meta: "둘 다 찜" },
    { title: "미스터 션샤인", kind: "드라마", status: "want", meta: "너의 추천" },
    { title: "패터슨", kind: "영화", status: "want", meta: "너의 추천" },
    { title: "동주", kind: "영화", status: "want", meta: "둘 다 찜" },
  ],
};
