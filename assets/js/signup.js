document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM 로드 완료");

  // 버튼 선택
  const sendCertifyBtn = document.getElementById("send-certify");
  const verifyCertifyBtn = document.getElementById("verify-certify");
  const submitBtn = document.querySelector(".signup__button--submit");
  const certificationField = document.getElementById("certification-field");

  //console.log("인증 요청 버튼:", sendCertifyBtn);
  //console.log("인증 확인 버튼:", verifyCertifyBtn);

  const userid = document.querySelector('input[name="userid"]');
  const password = document.querySelector('input[name="password"]');
  const email = document.querySelector('input[name="email"]');
  const name = document.querySelector('input[name="name"]');
  const birth = document.querySelector('input[name="birth"]');
  const hp = document.querySelector('input[name="hp"]');
  const certification = document.querySelector('input[name="certification"]');

  // 인증번호 발송 버튼
  if (sendCertifyBtn) {
    sendCertifyBtn.addEventListener("click", async function (e) {
      e.preventDefault();
      console.log("인증 요청 버튼 클릭");
      
      const ph = hp.value.trim();
      const phRegex = /^01[0|1|6-9]-?\d{3,4}-?\d{4}$/;

      if (!phRegex.test(ph)) {
        alert("올바른 휴대폰 번호를 입력해주세요. 예: 010-1234-5678");
        return;
      }

      try {
        // 랜덤 인증번호 생성 (6자리)
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("생성된 인증번호:", code);
        
        const response = await fetch("/auth/send-verification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            phone: ph,
            code: code
          })
        });

        const result = await response.json();
        console.log("인증번호 발송 응답:", result);

        if (!response.ok) {
          throw new Error(result.message || "인증번호 발송에 실패했습니다.");
        }

        // 인증번호 입력 필드 표시
        certificationField.style.display = "flex";
        alert("인증번호가 발송되었습니다.");
        
        //콘솔에 인증번호 출력 
        console.log("인증번호:", result.code);
      } catch (error) {
        console.error("인증번호 발송 오류:", error);
        alert(error.message);
      }
    });
  } else {
    console.error("인증 요청 버튼을 찾을 수 없습니다.");
  }

  // 인증번호 확인 버튼
  if (verifyCertifyBtn) {
    verifyCertifyBtn.addEventListener("click", async function (e) {
      e.preventDefault();
      console.log("인증 확인 버튼 클릭");
      
      const ph = hp.value.trim();
      const code = certification.value.trim();

      if (!code) {
        alert("인증번호를 입력해주세요.");
        return;
      }

      try {
        console.log("인증번호 확인 요청:", { phone: ph, code: code });
        
        const response = await fetch("/auth/verify-code", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            phone: ph,
            code: code
          })
        });

        const result = await response.json();
        console.log("인증번호 확인 응답:", result);

        if (!response.ok) {
          throw new Error(result.message || "인증번호 확인에 실패했습니다.");
        }

        if (result.verified) {
          alert("인증이 완료되었습니다.");
          submitBtn.disabled = false; // 제출 버튼 활성화
          certificationField.style.display = "none"; // 인증번호 입력 필드 숨김
        } else {
          throw new Error("인증번호가 일치하지 않습니다. 다시 확인해주세요.");
        }
      } catch (error) {
        console.error("인증번호 확인 오류:", error);
        alert(error.message);
        certification.value = ""; // 인증번호 입력 필드 초기화
        certification.focus(); // 인증번호 입력 필드로 포커스
      }
    });
  } else {
    console.error("인증 확인 버튼을 찾을 수 없습니다.");
  }

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
