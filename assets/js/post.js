async function createPost(event) {
  event.preventDefault();

  const postTitle = document.getElementById("postTitle");
  const postContent = document.getElementById("postContent");

  if (postTitle.value.trim() === "") {
    alert("제목을 입력해주세요.");
    postTitle.focus();
    return false;
  }
  if (postContent.value.trim() === "") {
    alert("비밀번호를 입력해주세요.");
    postContent.focus();
    return false;
  }

  const createPostData = {
    postTitle: postTitle.value,
    postContent: postContent.value,
  };

  try {
    const response = await fetch("/posts/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createPostData),
    });

    const data = await response.json();
    console.log("서버 응답:", data);

    if (response.ok) {
      const { token, userid } = data;

      if (token && userid) {
        localStorage.setItem("token", token);
        localStorage.setItem("userid", userid);

        alert("로그인 성공!");
        window.location.href = "/html/main/index.html"; 
      } else {
        alert("아이디 혹은 비번이 틀렸습니다");
      }
    } else {
      alert(data.message || "로그인 실패");
    }
  } catch (error) {
    console.error("에러 발생:", error);
    alert("서버와 통신 중 문제가 발생했습니다.");
  }

  return false;
}