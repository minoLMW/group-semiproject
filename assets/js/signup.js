async function sendit(event) {
  event.preventDefault();

  const userid = document.getElementById("userid");
  const password = document.getElementById("password");
  const password_re = document.getElementById("password_re");
  const email = document.getElementById("email");
  const name = document.getElementById("name");
  const hp = document.getElementById("hp");
  const birth = document.getElementById("birth");

  const expIdText = /^[A-Za-z0-9]{4,20}$/;
  const expPwText =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
  const expEmailText = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
  const expuserNameText = /^[가-힣]+$/;
  const expHpText = /^\d{3}-\d{3,4}-\d{4}$/;
  const expBirthText = /^\d{4}-\d{2}-\d{2}$/;

  if (userid.value === "") {
    alert("아이디를 입력해주세요.");
    userid.focus();
    return false;
  }
  if (!expIdText.test(userid.value)) {
    alert("아이디는 4자 이상 20자 이하의 영문자 및 숫자로 입력하세요.");
    userid.focus();
    return false;
  }

  if (password.value === "") {
    alert("비밀번호를 입력해주세요.");
    password.focus();
    return false;
  }
  if (!expPwText.test(password.value)) {
    alert(
      "비밀번호는 8자이상 20자이하의 영문자, 숫자, 특수문자를 한 자 이상 꼭 포함해야합니다."
    );
    password.focus();
    return false;
  }
  if (password_re.value === "") {
    alert("비밀번호 확인을 입력해주세요.");
    password_re.focus();
    return false;
  }
  if (password.value != password_re.value) {
    alert("비밀번호와 비밀번호 확인이 일치하지 않습니다");
    password_re.focus();
    return false;
  }
  if (email.value === "") {
    alert("이메일을 입력해주세요.");
    email.focus();
    return false;
  }
  if (!expEmailText.test(email.value)) {
    alert("이메일 확인해주세요");
    email.focus();
    return false;
  }
  if (name.value === "") {
    alert("이름을 입력해주세요.");
    name.focus();
    return false;
  }
  if (!expuserNameText.test(name.value)) {
    alert("이름은 한글로 입력하세요");
    name.focus();
    return false;
  }
  if (hp.value === "") {
    alert("전화번호를 입력해주세요.");
    hp.focus();
    return false;
  }
  if (!expHpText.test(hp.value)) {
    alert("휴대폰번호 형식이 일치하지 않습니다. \n-하이픈을 꼭 입력하세요!");
    hp.focus();
    return false;
  }
  if (!birth.value === "") {
    alert("생년월일을 입력해주세요요");
  }
  if (!expBirthText.test(birth.value)) {
    alert("생년월일 형식이 일치하지 않습니다. \n-하이픈을 꼭 입력하세요!");
    birth.focus();
    return false;
  }

  const signupData = {
    userid: userid.value,
    password: password.value,
    email: email.value,
    name: name.value,
    hp: hp.value,
    birth: birth.value,
  };

  console.log("회원가입 데이터:", signupData);

  try {
    const response = await fetch("/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signupData),
    });

    const data = await response.json();
    console.log("서버 응답:", data);

    if (response.ok) {
      alert("회원가입 성공!");
      localStorage.setItem("token", data.token);
      localStorage.setItem("userid", data.userid);
      window.location.href = "/html/main/index.html";
    } else {
      alert(data.message || "회원가입 실패");
    }
  } catch (error) {
    console.error("에러 발생:", error);
    alert("서버와 통신 중 문제가 발생했습니다.");
  }

  return false;
}
