const postList = document.getElementById("postList");
const postForm = document.getElementById("postForm");
const submitButton = postForm.querySelector('button[type="submit"]');

const currentUserId = localStorage.getItem("userid");

let editingPostId = null;

function escapeHtml(unsafe) {
  return unsafe.replace(
    /[&<"']/g,
    (m) => ({ "&": "&amp;", "<": "&lt;", '"': "&quot;", "'": "&#039;" }[m])
  );
}

async function fetchPosts() {
  const token = localStorage.getItem("token");
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
    const dateStr = new Date(post.createAt).toLocaleString();
    const isMine = post.userid === currentUserId;

    // 리스트 아이템 생성
    const li = document.createElement("li");
    li.className = "post-list__item";
    li.innerHTML = `
      <div class="post-list__badge">
        <h2>ID : ${post.userid}</h2>
        <h3>${escapeHtml(post.title)}</h3>
        <p class="post-list__badge-p">${escapeHtml(post.text)}</p>
        <time datetime="${post.createAt}">${dateStr}</time>
        ${
          isMine
            ? `<button type="button" class="post-list__badge__change">수정</button>
             <button type="button" class="post-list__badge__delete">삭제</button>`
            : ``
        }
      </div>
    `;
    postList.appendChild(li);
    if (!isMine) return;

    // 수정 버튼
    li.querySelector(".post-list__badge__change").addEventListener(
      "click",
      () => {
        postForm.title.value = post.title;
        postForm.text.value = post.text;

        // 수정 모드로 전환
        editingPostId = post._id.toString();
        submitButton.textContent = "수정 완료";
        postForm.scrollIntoView({ behavior: "smooth" });
      }
    );

    // 삭제 버튼
    li.querySelector(".post-list__badge__delete").addEventListener(
      "click",
      async () => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        try {
          const res = await fetch(`/posts/${post._id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          if (!res.ok) throw new Error(res.statusText);
          fetchPosts();
        } catch (err) {
          console.error("삭제 실패:", err);
        }
      }
    );
  });
}

postForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = postForm.title.value.trim();
  const text = postForm.text.value.trim();
  if (!title || !text) return;

  const token = localStorage.getItem("token");
  const url = editingPostId ? `/posts/${editingPostId}` : "/posts";
  const method = editingPostId ? "PUT" : "POST";

  if (editingPostId) {
    if (!confirm("수정을 완료하시겠습니까?")) return;
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, text }),
    });
    if (!res.ok) throw new Error(res.statusText);

    // 수정 모드였다면 초기 상태로 복귀
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

document.addEventListener("DOMContentLoaded", fetchPosts);
