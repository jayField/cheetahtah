// 공유 저장소 (Firebase Firestore): 누가 어디서 들어와도 같은 목록을 봄
// 이 설정값은 공개돼도 괜찮음. 접근 범위는 Firestore 규칙에서 정함
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, collection, doc, onSnapshot, setDoc, deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = initializeApp({
  apiKey: "AIzaSyBuCSnL8wdPkAAgzxm7x1NeeRd3rQEgxTs",
  authDomain: "theater-7e3e2.firebaseapp.com",
  projectId: "theater-7e3e2",
  storageBucket: "theater-7e3e2.firebasestorage.app",
  messagingSenderId: "679388802718",
  appId: "1:679388802718:web:e8f5f630602b014abe158f",
});
const db = getFirestore(app);
const works = collection(db, "works");

window.TheaterDB = {
  // 목록이 바뀔 때마다 cb(작품 배열) 호출
  subscribe(cb, onError) {
    return onSnapshot(works, (snap) => cb(snap.docs.map((d) => ({ ...d.data(), id: d.id }))), onError);
  },
  // undefined 값은 Firestore가 받지 않아서 JSON으로 한 번 걸러서 저장
  save: (w) => setDoc(doc(works, String(w.id)), JSON.parse(JSON.stringify(w))),
  remove: (id) => deleteDoc(doc(works, String(id))),
};
window.dispatchEvent(new Event("theaterdb:ready"));
