// 1) DOM 요소 가져오기
const postList = document.getElementById("postList");
const postForm = document.getElementById("postForm");

// 2) HTML 이스케이프 함수 (XSS 방지)
function escapeHtml(unsafe) {
  return unsafe.replace(
    /[&<"']/g,
    (m) => ({ "&": "&amp;", "<": "&lt;", '"': "&quot;", "'": "&#039;" }[m])
  );
}

// 3) 서버에서 게시글 목록 가져와 렌더링
async function fetchPosts() {
  const token = localStorage.getItem("token"); // 로그인 시 발급된 JWT
  if (!token) {
    alert("로그인이 필요합니다.");
    return;
  }

  try {
    const res = await fetch("/posts", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(res.statusText);

    const posts = await res.json();
    renderPosts(posts);
  } catch (err) {
    console.error("게시글 불러오기 실패:", err);
  }
}

function renderPosts(posts) {
  postList.innerHTML = "";
  posts.forEach((post) => {
    const li = document.createElement("li");
    li.className = "post-list__item";
    li.innerHTML = `
      <h3>${escapeHtml(post.title)}</h3>
      <p>${escapeHtml(post.text)}</p>
      <small>${new Date(post.createdAt).toLocaleString()}</small>
    `;
    postList.appendChild(li);
  });
}

// 4) 새 글 작성 이벤트 핸들러
postForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = postForm.title.value.trim();
  const text = postForm.text.value.trim();
  if (!title || !text) return;

  const token = localStorage.getItem("token");
  try {
    const res = await fetch("/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, text }),
    });
    if (!res.ok) throw new Error(res.statusText);

    postForm.reset();
    fetchPosts(); // 작성 후 목록 갱신
  } catch (err) {
    console.error("글 작성 실패:", err);
  }
});

// 5) 페이지 로드 시 자동으로 게시글 불러오기
document.addEventListener("DOMContentLoaded", fetchPosts);
