document.addEventListener("DOMContentLoaded", function () {
  const certifyBtn = document.querySelector(".signup__button--certify");
  const submitBtn = document.querySelector(".signup__button--submit");

  const userid = document.querySelector('input[name="userid"]');
  const password = document.querySelector('input[name="password"]');
  const email = document.querySelector('input[name="email"]');
  const name = document.querySelector('input[name="name"]');
  const birth = document.querySelector('input[name="birth"]');
  const hp = document.querySelector('input[name="hp"]');

  // 인증번호 입력창과 인증확인 버튼 추가 (HTML에 없으면 동적으로 추가)
  let certifyCodeInput = document.querySelector('input[name="certifyCode"]');
  let verifyBtn = document.querySelector('.signup__button--verify');
  if (!certifyCodeInput) {
    certifyCodeInput = document.createElement('input');
    certifyCodeInput.type = "text";
    certifyCodeInput.name = "certifyCode";
    certifyCodeInput.placeholder = "인증번호 입력";
    certifyCodeInput.style.marginTop = "1rem";
    hp.parentNode.insertBefore(certifyCodeInput, hp.nextSibling);
  }
  if (!verifyBtn) {
    verifyBtn = document.createElement('button');
    verifyBtn.type = "button";
    verifyBtn.className = "signup__button--verify";
    verifyBtn.textContent = "인증확인";
    verifyBtn.style.marginLeft = "0.5rem";
    certifyCodeInput.parentNode.insertBefore(verifyBtn, certifyCodeInput.nextSibling);
  }

  let isPhoneVerified = false; // 인증 성공 여부

  // 인증요청 버튼
  certifyBtn.addEventListener("click", async function (e) {
    e.preventDefault();
    const ph = hp.value.trim().replace(/-/g, "");
    const phRegex = /^010\d{8}$/;

    if (!phRegex.test(ph)) {
      alert("올바른 휴대폰 번호를 입력해주세요. 예: 01012345678");
      return;
    }

    try {
      const res = await fetch("/sendsms/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: ph }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "인증번호 발송 실패");
      alert("인증번호가 발송되었습니다.");
    } catch (err) {
      alert(err.message);
    }
  });

  // 인증확인 버튼
  verifyBtn.addEventListener("click", async function () {
    const ph = hp.value.trim().replace(/-/g, "");
    const code = certifyCodeInput.value.trim();

    if (!code) {
      alert("인증번호를 입력해주세요.");
      return;
    }

    try {
      const res = await fetch("/sendsms/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: ph, code }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "인증 실패");
      alert("인증이 완료되었습니다.");
      isPhoneVerified = true;
      certifyCodeInput.disabled = true;
      verifyBtn.disabled = true;
      hp.readOnly = true;
    } catch (err) {
      alert(err.message);
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

    if (!isPhoneVerified) {
      alert("휴대폰 인증을 완료해주세요.");
      certifyCodeInput.focus();
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
