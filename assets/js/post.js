// 1) DOM 요소 가져오기
const postList = document.getElementById("postList");
const postForm = document.getElementById("postForm");
const submitButton = postForm.querySelector('button[type="submit"]');

// 2) 현재 편집 중인 게시물 ID 저장 변수
let editingPostId = null;

// 3) HTML 이스케이프 함수 (XSS 방지)
function escapeHtml(unsafe) {
  return unsafe.replace(/[&<"']/g, m =>
    ({ '&': '&amp;', '<': '&lt;', '"': '&quot;', "'": '&#039;' })[m]
  );
}

// 4) 서버에서 게시글 목록 가져와 렌더링
async function fetchPosts() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("로그인이 필요합니다.");
    return;
  }

  try {
    const res = await fetch("/posts", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error(res.statusText);

    const posts = await res.json();
    console.log(posts);  // _id 필드명 확인용
    renderPosts(posts);
  } catch (err) {
    console.error("게시글 불러오기 실패:", err);
  }
}

// 5) 게시글 렌더링 + 수정·삭제 이벤트 연결
function renderPosts(posts) {
  postList.innerHTML = "";

  posts.forEach(post => {
    const li = document.createElement("li");
    const date = new Date(post.createAt || post.createdAt).toLocaleString();
    li.className = "post-list__item";
    li.innerHTML = `
      <div class="post-list__badge">
        <h2>Id : ${escapeHtml(post.userId || post.userid)}</h2>
        <h3>${escapeHtml(post.title)}</h3>
        <p>${escapeHtml(post.text)}</p>
        <time datetime="${post.createAt || post.createdAt}">${date}</time>
        <button type="button" class="post-list__badge__change">수정</button>
        <button type="button" class="post-list__badge__delete">삭제</button>
      </div>
    `;
    postList.appendChild(li);

    // --- 수정 버튼 핸들러 ---
    li.querySelector(".post-list__badge__change").addEventListener("click", () => {
      // 폼에 기존 데이터 채우기
      postForm.title.value = post.title;
      postForm.text.value = post.text;
      // 백엔드에서 반환된 고유 ID 필드명은 _id 이므로 toString()으로 문자열로 변환
      editingPostId = post._id.toString();
      submitButton.textContent = "수정 완료";
      postForm.scrollIntoView({ behavior: "smooth" });
    });

    // --- 삭제 버튼 핸들러 ---
    li.querySelector(".post-list__badge__delete").addEventListener("click", async () => {
      if (!confirm("정말 삭제하시겠습니까?")) return;

      try {
        const res = await fetch(`/posts/${post._id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (!res.ok) throw new Error(res.statusText);
        fetchPosts();  // 삭제 후 목록 갱신
      } catch (err) {
        console.error("삭제 실패:", err);
      }
    });
  });
}

// 6) 폼 제출 처리 (등록 ↔ 수정 모드)
postForm.addEventListener("submit", async e => {
  e.preventDefault();

  const title = postForm.title.value.trim();
  const text = postForm.text.value.trim();
  if (!title || !text) return;

  const token = localStorage.getItem("token");
  const url = editingPostId ? `/posts/${editingPostId}` : "/posts";
  const method = editingPostId ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title, text })
    });
    if (!res.ok) throw new Error(res.statusText);

    // 수정 모드였으면 초기 상태로 복귀
    if (editingPostId) {
      editingPostId = null;
      submitButton.textContent = "등록";
    }
    postForm.reset();
    fetchPosts();
  } catch (err) {
    console.error(`${method} 요청 실패:`, err);
  }
});

// 7) 페이지 로드 시 자동으로 게시글 불러오기
document.addEventListener("DOMContentLoaded", fetchPosts);
