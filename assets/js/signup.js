  document.addEventListener("DOMContentLoaded", function () {
    const certifyBtn = document.querySelector(".signup__button--certify");
    const submitBtn = document.querySelector(".signup__button--submit");

    const userid = document.querySelector('input[name="userid"]');
    const userpw = document.querySelector('input[name="userpw"]');
    const useremail = document.querySelector('input[name="useremail"]');
    const username = document.querySelector('input[name="username"]');
    const userbirth = document.querySelector('input[name="userbirth"]');
    const userhp = document.querySelector('input[name="userhp"]');

    //인증요청 버튼
    certifyBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const phone = userhp.value.trim();
      const phoneRegex = /^01[0|1|6-9]-?\d{3,4}-?\d{4}$/;

      if (!phoneRegex.test(phone)) {
        alert("올바른 휴대폰 번호를 입력해주세요. 예: 010-1234-5678");
      } else {
        alert("인증번호가 발송되었습니다.");
        // coolsms api
      }
    });

    // 제출하기 버튼
    submitBtn.addEventListener("click", function (e) {
      e.preventDefault();

      if (!userid.value.trim()) {
        alert("아이디를 입력해주세요.");
        userid.focus();
        return;
      }

      if (!userpw.value.trim()) {
        alert("비밀번호를 입력해주세요.");
        userpw.focus();
        return;
      }

      if (!useremail.value.trim()) {
        alert("이메일을 입력해주세요.");
        useremail.focus();
        return;
      }

      if (!username.value.trim()) {
        alert("이름을 입력해주세요.");
        username.focus();
        return;
      }

      if (!userbirth.value.trim()) {
        alert("생년월일을 입력해주세요.");
        userbirth.focus();
        return;
      }

      if (!userhp.value.trim()) {
        alert("휴대폰 번호를 입력해주세요.");
        userhp.focus();
        return;
      }

      // 모든 입력 완료 후
      alert("🎉 회원가입이 완료되었습니다!");
  });
 });
