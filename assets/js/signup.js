document.addEventListener("DOMContentLoaded", function () {
  const certifyBtn = document.querySelector(".signup__button--certify");
  const submitBtn = document.querySelector(".signup__button--submit");

  const userid = document.querySelector('input[name="userid"]');
  const password = document.querySelector('input[name="password"]');
  const email = document.querySelector('input[name="email"]');
  const name = document.querySelector('input[name="name"]');
  const birth = document.querySelector('input[name="birth"]');
  const hp = document.querySelector('input[name="hp"]');


  //coolsms 인증요청
  document.addEventListener("DOMContentLoaded", function () {
  const sendBtn = document.getElementById("btn-send-code");
  const verifyBtn = document.getElementById("btn-verify-code");
  const phoneInput = document.getElementById("hp");
  const codeInput = document.getElementById("auth-code");
  const resultText = document.getElementById("sms-result");
  const codeArea = document.getElementById("code-area");
  const submitBtn = document.querySelector(".signup__button--submit");

  // 초기 상태: 제출 버튼 비활성화
  if (submitBtn) submitBtn.disabled = true;

  // 1. 인증 요청
  sendBtn.addEventListener("click", async () => {
    const phone = phoneInput.value.trim();

    if (!/^010\d{8}$/.test(hp)) {
      alert("휴대폰 번호를 정확히 입력해주세요. (예: 01012345678)");
      return;
    }

    try {
      const res = await fetch("/sms/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hp }),
      });

      const data = await res.json();
      resultText.textContent = data.message || data.error;
      resultText.style.color = data.message ? "green" : "red";

      if (res.ok) {
        codeArea.style.display = "block"; // 인증번호 입력창 보이기
      }

    } catch (err) {
      resultText.textContent = "문자 요청 중 오류 발생";
      resultText.style.color = "red";
    }
  });

  // 2. 인증 확인
  verifyBtn.addEventListener("click", async () => {
    const phone = phoneInput.value.trim();
    const code = codeInput.value.trim();

    try {
      const res = await fetch("/sms/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hp, code }),
      });

      const data = await res.json();
      resultText.textContent = data.message || data.error;
      resultText.style.color = data.message ? "green" : "red";

      // 인증 성공 시 제출 버튼 활성화
      if (res.ok && data.message) {
        if (submitBtn) submitBtn.disabled = false;
      }

    } catch (err) {
      resultText.textContent = "인증 확인 중 오류 발생";
      resultText.style.color = "red";
    }
  });
});


  ///회원가입 제출버튼/////
  submitBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    if (!userid.value.trim()) {
      alert("아이디를 입력해주세요.");
      userid.focus();
      return;
    }

    if (!password.value.trim()) {
      alert("비밀번호를 입력해주세요.");
      password.focus();
      return;
    }

    if (!email.value.trim()) {
      alert("이메일을 입력해주세요.");
      email.focus();
      return;
    }

    if (!name.value.trim()) {
      alert("이름을 입력해주세요.");
      name.focus();
      return;
    }

    if (!birth.value.trim()) {
      alert("생년월일을 입력해주세요.");
      birth.focus();
      return;
    }

    if (!hp.value.trim()) {
      alert("휴대폰 번호를 입력해주세요.");
      hp.focus();
      return;
    }

    const signupData = {
      userid: userid.value.trim(),
      password: password.value.trim(),
      email: email.value.trim(),
      name: name.value.trim(),
      birth: birth.value.trim(),
      ph: hp.value.trim(),
    };

    try {
      // 회원가입 API 호출
      const res = await fetch("/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      const result = await res.json();

      if (!res.ok) {
        // 서버가 보낸 에러 메시지 표시
        throw new Error(result.message || "회원가입에 실패했습니다.");
      }

      // 성공 처리
      alert("🎉 회원가입이 완료되었습니다! 기본 포인트 4500P 지급되었습니다");
      window.location.href = "/common/login.html";
    } catch (err) {
      console.error("회원가입 오류:", err);
      alert(err.message);
    }
  });
});

// 1) cmd 터미널 입력 값: npm run dev
// 2) http://localhost:8080/common/signup.html url 접속