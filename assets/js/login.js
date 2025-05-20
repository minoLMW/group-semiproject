async function sendit(event) {
  event.preventDefault();

  // ID·비밀번호 요소 가져오기
  const useridEl = document.getElementById("userid");
  const passwordEl = document.getElementById("password");

  // 빈 값 검증
  if (!useridEl.value.trim()) {
    alert("아이디를 입력해주세요.");
    useridEl.focus();
    return false;
  }
  if (!passwordEl.value.trim()) {
    alert("비밀번호를 입력해주세요.");
    passwordEl.focus();
    return false;
  }

  // 전송할 데이터 구성
  const loginData = {
    userid: useridEl.value.trim(),
    password: passwordEl.value.trim(),
  };
  console.log("로그인 데이터:", loginData);

  try {
    // 로그인 API 호출
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });

    const result = await response.json();
    console.log("서버 응답:", result);

    if (!response.ok) {
      throw new Error(result.message || "로그인에 실패했습니다.");
    }

    // 토큰·아이디 저장 및 이동
    localStorage.setItem("token", result.token);
    localStorage.setItem("userid", result.userid ?? useridEl.value.trim());

    // 성공 메시지 + 리다이렉트
    alert("로그인 성공! 메인페이지로 이동합니다.");
    window.location.href = "/main/index.html";
  } catch (err) {
    console.error("에러 발생:", err);
    alert(err.message);
  }

  return false;
}

// 1) cmd 터미널 입력 값: npm run dev
// 2) http://localhost:8080/common/login.html url 접속