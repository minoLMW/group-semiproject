document.addEventListener("DOMContentLoaded", function () {
  const certifyBtn = document.querySelector(".signup__button--certify");
  const submitBtn = document.querySelector(".signup__button--submit");

  const userid = document.querySelector('input[name="userid"]');
  const password = document.querySelector('input[name="password"]');
  const email = document.querySelector('input[name="email"]');
  const name = document.querySelector('input[name="name"]');
  const birth = document.querySelector('input[name="birth"]');
  const hp = document.querySelector('input[name="hp"]');

  //인증요청 버튼
  certifyBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const ph = hp.value.trim();
    const phRegex = /^01[0|1|6-9]-?\d{3,4}-?\d{4}$/;

    if (!phRegex.test(ph)) {
      alert("올바른 휴대폰 번호를 입력해주세요. 예: 010-1234-5678");
    } else {
      alert("인증번호가 발송되었습니다.");
      // coolsms api
    }
  });

  // 제출하기 버튼
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
