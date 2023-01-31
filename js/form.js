import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const auth = getAuth();
let isBooking = false;
let isSignIn = true;

renderFormWhenLoginSuccess();

// $("form").addEventListener("submit", (e) => {
// 	// get input value

// 	console.log("firstName", firstName?.value);
// 	console.log("lastName", lastName?.value);
// 	console.log("email", email.value);
// 	console.log("phone", phone.value);
// 	e.preventDefault();
// });

function renderFormWhenLoginSuccess() {
  let html = "";
  if (!auth.currentUser) {
    html = `
    <div class="wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.2s">
      <div class="panel panel-skin">
        <div class="panel-heading">             
          <h3 class="panel-title">
            <span class="fa fa-pencil-square-o"></span> Đặt lịch ngay <small>(Miễn phí!)</small>
          </h3>
        </div>
        <div class="panel-body">
          <form onsubmit="(e) => {e.preventDefault()}" role="form" id = "form-1" class="lead form-1">
            <div class="row ">
              <div class="col-xs-6 col-sm-6 col-md-6">
                <div class="form-group">
                  <label>Email</label>
                  <input
                  onclick="(e) => {e.stopPropagation()}"
                    placeholder="VD: quyen@gmail.com"
                    oninvalid="this.setCustomValidity('Hãy nhập email đúng format')"
                    oninput="this.setCustomValidity('')"
                    required
                    type="email"
                    name="email"
                    id="email"
                    class="form-control input-md"
                  />
                </div>
              </div>
              <div class="col-xs-6 col-sm-6 col-md-6">
                <div class="form-group">
                  <label>SĐT</label>
                  <input
                    placeholder="VD: 0123456789"
                    oninvalid="this.setCustomValidity('Hãy điền vào trường này')"
                    oninput="this.setCustomValidity('')"
                    required
                    type="number"
                    name="phone"
                    id="phone"
                    class="form-control input-md"
                  />
                </div>
              </div>
              </div>
  
              <input type="submit" value="Đồng ý" class="btn btn-skin btn-block btn-lg btn-form1" />
  
              <p class="lead-footer" style="margin-bottom: 10px">* Chúng tôi sẽ liên hệ cho bạn qua email hoặc SĐT</p>
              
              <span
                style="font-size: 16px; color: rgb(12, 94, 94); float: right; margin-left: 10px; cursor: pointer"
                class="switch-btn"
                href="#"
                >Đăng nhập</span
              >
              <span style="font-size: 16px; float:right;" class="lead-footer switch-text"> Đã có tài khoản?</span>
              
            </form>
          </div>
        </div>
      </div>`;
  } else {
    console.log(auth.currentUser);
    if (auth.currentUser.displayName) {
      if (!isBooking)
        html = `
      <div class="wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.2s">
      <div class="panel panel-skin">
        <div class="panel-heading">
          <h3 class="panel-title">
            <span class="fa fa-pencil-square-o"></span> Thông tin người dùng</small>
          </h3>
        </div>
        <div class="panel-body">
          <form onsubmit="(e) => {e.preventDefault()}" role="form" class="lead form-2">
            <div class="row">
              
              <p style = "padding: 0px 15px; font-size: 18px;">Xin chào <label style = "font-size: 20px">${auth.currentUser.displayName}<label/></p> 
              </div>
  
              <input type="submit" value="Tiếp tục" class="btn btn-skin btn-block btn-lg btn-form3" />
  
              <span
                style="font-size: 16px; color: rgb(12, 94, 94); float: right; margin-top: 10px; cursor: pointer"
                class="switch-btn-logout"
                href="#"
                >Đăng suất</span
              >
            </form>
          </div>
        </div>
      </div>
      `;
      else html = `
      <div class="wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.2s">
        <div class="panel panel-skin">
          <div class="panel-heading">             
            <h3 class="panel-title">
              <span class="fa fa-pencil-square-o"></span> Đặt lịch ngay <small>(Miễn phí!)</small>
            </h3>
          </div>
          <div class="panel-body">
            <form onsubmit="(e) => {e.preventDefault()}" role="form" id = "form-1" class="lead form-1">
              <div class="row ">
                <div class="col-xs-6 col-sm-6 col-md-6">
                  <div class="form-group">
                    <label for="#date">Ngày</label>
                    <input
                      type="date"
                      name="date"
                      id="date"
                      class="form-control input-md"
                    />
                  </div>
                </div>
                <div class="col-xs-6 col-sm-6 col-md-6">
                  <div class="form-group">
                    <label>SĐT</label>
                    <input
                      placeholder="VD: 0123456789"
                      oninvalid="this.setCustomValidity('Hãy điền vào trường này')"
                      oninput="this.setCustomValidity('')"
                      required
                      type="number"
                      name="phone"
                      id="phone"
                      class="form-control input-md"
                    />
                  </div>
                </div>
                </div>
    
                <input type="submit" value="Đồng ý" class="btn btn-skin btn-block btn-lg btn-form1" />
    
                <p class="lead-footer" style="margin-bottom: 10px">* Chúng tôi sẽ liên hệ cho bạn qua email hoặc SĐT</p>
                
                <span
                  style="font-size: 16px; color: rgb(12, 94, 94); float: right; margin-left: 10px; cursor: pointer"
                  class="switch-btn"
                  href="#"
                  >Đăng nhập</span
                >
                <span style="font-size: 16px; float:right;" class="lead-footer switch-text"> Đã có tài khoản?</span>
                
              </form>
            </div>
          </div>
        </div>`;
    } else
      html = `
      <div class="wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.2s">
      <div class="panel panel-skin">
        <div class="panel-heading">
          <h3 class="panel-title">
            <span class="fa fa-pencil-square-o"></span> Nhập tên hiển thị</small>
          </h3>
        </div>
        <div class="panel-body">
          <form onsubmit="(e) => {e.preventDefault()}" role="form" class="lead form-2">
            <div class="row">
              <div class="col-xs-6 col-sm-6 col-md-6">
                <div class="form-group">
                  <label>Họ</label>
                  <input
                    placeholder="VD: Trương"
                    oninvalid="this.setCustomValidity('Hãy điền trường này')"
                    oninput="this.setCustomValidity('')"
                    required
                    type="text"
                    name="text"
                    id="first_name"
                    class="form-control input-md"
                  />
                </div>
              </div>
              <div class="col-xs-6 col-sm-6 col-md-6">
                <div class="form-group">
                  <label>Tên</label>
                  <input
                    placeholder="VD: Quyên"
                    oninvalid="this.setCustomValidity('Hãy điền trường này')"
                    oninput="this.setCustomValidity('')"
                    required
                    type="text"
                    name="text"
                    id="last_name"
                    class="form-control input-md"
                  />
                </div>
              </div>
              </div>
  
              <input type="submit" value="Đồng ý" class="btn btn-skin btn-block btn-lg btn-form2" />
  
              <span
                style="font-size: 16px; color: rgb(12, 94, 94); float: right; margin-top: 10px; cursor: pointer"
                class="switch-btn-logout"
                href="#"
                >Đăng suất</span
              >
            </form>
          </div>
        </div>
      </div>
      `;
  }
  $(".form-wrapper").innerHTML = html;
}

$(".form-wrapper").addEventListener("click", (e) => {
  // e.preventDefault();
  if (e.target.closest(".switch-btn")) {
    isSignIn = !isSignIn;
    console.log(isSignIn);
    const innerSwitch = isSignIn ? ` Đã có tài khoản?` : ` Chưa có tài khoản?`;
    const innerSwitchBtn = isSignIn ? ` Đăng nhập` : ` Đăng kí`;
    $(".switch-text").innerText = innerSwitch;
    $(".switch-btn").innerText = innerSwitchBtn;
  } else if (e.target.closest(".switch-btn-logout")) {
    signOut(auth)
      .then(() => {
        console.log("logout", auth.currentUser);
        isSignIn = !isSignIn;
        renderFormWhenLoginSuccess();
      })
      .catch((error) => {
        // An error happened.
      });
  } else if (e.target.closest(".btn-form1")) {
    // $('.form-1').preventDefault()
    var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    const email = $("#email");
    const phone = $("#phone");
    if (email.value.trim() === "" || phone.value.trim() === "")
      alert("Hãy điền đầy đủ các trường");
    if (email.value.trim() !== "" && !regexEmail.test(email.value))
      alert("Hãy nhập email đúng format");
    if (isSignIn)
      createUserWithEmailAndPassword(auth, email.value, phone.value)
        .then((userCredential) => {
          // user = userCredential.user;
          // console.log(user);
          console.log("signup", auth.currentUser);
          renderFormWhenLoginSuccess();
        })
        .catch((error) => {
          const errorCode = error.code;
          errorCode == "auth/email-already-in-use" &&
            alert("Email đã tồn tại, hãy đăng nhập");
        });
    else
      signInWithEmailAndPassword(auth, email.value, phone.value)
        .then((userCredential) => {
          // user = userCredential.user;
          console.log("login", auth.currentUser);
          renderFormWhenLoginSuccess();
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          errorCode == "auth/user-not-found" &&
            alert("Tài khoản email không tồn tại");
          errorCode == "auth/wrong-password" && alert("Sai mật khẩu");
        });
  } else if (e.target.closest(".btn-form2")) {
    const first_name = $("#first_name").value;
    const last_name = $("#last_name").value;

    if (first_name.trim() === "" || last_name.trim() === "")
      alert("Hãy điền đầy đủ các trường");

    updateProfile(auth.currentUser, {
      displayName: `${last_name} ${first_name}`,
    })
      .then(() => {
        renderFormWhenLoginSuccess();
      })
      .catch((error) => {
        // An error occurred
        // ...
      });
  } else if (e.target.closest(".btn-form3")) {
    console.log($('.btn-form3'))
    isBooking = true;
    renderFormWhenLoginSuccess()
  }
});
{
  /* <p style = "padding: 0px 5px; font-size: 18px;">Xin chào <label style = "font-size: 20px">${auth.currentUser.displayName}<label/></p> */
}
