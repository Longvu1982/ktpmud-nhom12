import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const auth = getAuth();

let isSignIn = false;

$("form").addEventListener("submit", (e) => {
  // get input value
  const firstName = $("#first_name");
  const lastName = $("#last_name");
  const email = $("#email");
  const phone = $("#phone");
  console.log("firstName", firstName?.value);
  console.log("lastName", lastName?.value);
  console.log("email", email.value);
  console.log("phone", phone.value);
  e.preventDefault();
  if (!isSignIn)
    createUserWithEmailAndPassword(auth, email.value, phone.value)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        // console.log(errorCode)
        // const errorMessage = error.message;
        errorCode == "auth/email-already-in-use" &&
          alert("Email đã tồn tại, hãy đăng nhập");
        // ..
      });
  else
    signInWithEmailAndPassword(auth, email.value, phone.value)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
});

$(".switch-btn").addEventListener("click", () => {
  isSignIn = !isSignIn;
  console.log(isSignIn);
  const innerSwitch = !isSignIn ? ` Đã có tài khoản?` : ` Chưa có tài khoản?`;
  const innerSwitchBtn = !isSignIn ? ` Đăng nhập` : ` Đăng kí`;
  $(".switch-text").innerText = innerSwitch;
  $(".switch-btn").innerText = innerSwitchBtn;
});
