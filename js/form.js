import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	signOut,
	updateProfile,
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
import {
	collection,
	getDocs,
	getDoc,
	addDoc,
	doc,
	setDoc,
	updateDoc,
	arrayUnion,
	arrayRemove,
	serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";
import { db } from "./firebase.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const auth = getAuth();
let isBooking = false;
let isSignIn = true;

renderFormWhenLoginSuccess();

const doctors = [
	{
		"Thần kinh": ["Adam Taylor"],
	},
	{
		"Tâm lí": ["Alice Grue"],
	},
	{
		"Tim mạch": ["Joseph Murphy", "Alison Davis"],
	},
];

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
  
              <input type="button" value="Đồng ý" class="btn btn-skin btn-block btn-lg btn-form1" />
  
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
  
              <input type="button" value="Tiếp tục" class="btn btn-skin btn-block btn-lg btn-form3" />
  
              <span
                style="font-size: 16px; color: rgb(12, 94, 94); float: right; margin-top: 10px; cursor: pointer"
                class="switch-btn-logout"
                href="#"
                >Đăng xuất</span
              >
            </form>
          </div>
        </div>
      </div>
      `;
			else
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
                    <label for="#date">Ngày</label>
                    <input
                      type="datetime-local"
                      name="date"
                      id="date"
                      class="form-control input-md"
                    />
                  </div>
                </div>
                <div class="col-xs-6 col-sm-6 col-md-6">
                  <div class="form-group">
                    <label>Khu vực</label>
					  <select class="form-control input-md" id="area">
						<option value="Hà Nội" selected>Hà Nội</option>
						<option value="TPHCM">TPHCM</option>
						<option value="Thái Nguyên">Thái Nguyên</option>
						<option value="Lào Cai" >Lào Cai</option>
					  </select>
                  </div>
                </div>
                </div>

				<div class="row ">
                <div class="col-xs-6 col-sm-6 col-md-6">
                  <div class="form-group">
					<label>Chuyên khoa</label>
					<select class="form-control input-md" id="field" >
						<option value="Thần kinh" selected>Thần kinh</option>
						<option value="Tâm lí">Tâm lí</option>
						<option value="Tim mạch">Tim mạch</option>
					</select>
                  </div>
                </div>
                <div class="col-xs-6 col-sm-6 col-md-6">
                  <div class="form-group">
                    <label>Bác sĩ</label>
					  <select class="form-control input-md" id="doctor-name">
						<option value="Adam Taylor" selected >Adam Taylor</option>
					  </select>
                  </div>
                </div>
                </div>
    
                <input type="button" value="Đồng ý" class="btn btn-skin btn-block btn-lg btn-form4" />
    
                <p class="lead-footer" style="margin-bottom: 10px">* Chúng tôi sẽ liên hệ cho bạn qua email hoặc SĐT</p>
                
				<span
                style="font-size: 16px; color: rgb(12, 94, 94); float: right; margin-top: 10px; cursor: pointer"
                class="switch-btn-logout"
                href="#"
                >Đăng xuất</span
              >
			  <span
                style="font-size: 16px; color: rgb(12, 94, 94); float: right; margin-top: 10px; margin-right: 15px; cursor: pointer"
                class="switch-btn-check"
                href="#"
                >Xem lịch đã đặt</span
              >
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
  
              <input type="button" value="Đồng ý" class="btn btn-skin btn-block btn-lg btn-form2" />
  
              <span
                style="font-size: 16px; color: rgb(12, 94, 94); float: right; margin-top: 10px; cursor: pointer"
                class="switch-btn-logout"
                >Đăng xuất</span
			>
            </form>
          </div>
        </div>
      </div>
      `;
	}
	$(".form-wrapper").innerHTML = html;
}

async function renderFinalList() {
	let finalList;
	const currentUser = auth.currentUser;
	const userDocRef = doc(db, "users", currentUser.email);
	const getFinalList = async () => {
		const docSnap = await getDoc(userDocRef);
		finalList = docSnap.data().list;
	};
	await getFinalList();

	let html = `
	<div class="wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.2s">
	<div class="panel panel-skin">
	  <div class="panel-heading">
		<h3 class="panel-title" style = "display: flex; justify-content: space-between; align-items: center;">
		  <span><span class="fa fa-pencil-square-o"></span> Lịch của ${auth.currentUser.displayName}</span>
		  <!--<ul class="pagination justify-content-center" style = "margin: 0">
			<li class="page-item" style = "font-size: 10px">
				<a class="page-link" href="#" tabindex="-1">${"<"}</a>
			</li>
			<li class="page-item" style = "font-size: 10px"><a class="page-link" href="#">1</a></li>
			<li class="page-item" style = "font-size: 10px"><a class="page-link" href="#">2</a></li>
			<li class="page-item" style = "font-size: 10px"><a class="page-link" href="#">3</a></li>
			<li class="page-item" style = "font-size: 10px">
				<a class="page-link" href="#">${">"}</a>
			</li>
  		</ul>-->
		</h3>
	  </div>
	  <div class="panel-body">
		<form onsubmit="(e) => {e.preventDefault()}" role="form" class="lead form-2">
		<div class="list-container" style="height: 250px; overflow-y:scroll; overflow-x: hidden">
		${
			finalList.length === 0
				? "<p style ='font-size: 16px'><span class='fa fa-exclamation-circle' style='color: yellow; margin-right: 10px'></span>Không có lịch để hiển thị</p>"
				: finalList
						.map((item) => {
							return `
					<div class = "row">
						<div class = "col-xs-12 col-sm-12 list-item col-md-12" style = "display: flex; align-items: start; margin-bottom: 10px; padding-right: 10px; height: 55px">
						<span class="fa fa-calendar" style="margin-right: 15px; font-size: 16px; margin-top: 10px"></span>
						<div style="width: 80%; flex-shrink: 0; flex-grow: 0;">
							<p style = "font-size: 16px; font-weight: 600; margin: 0; line-height: 25px"></span>  ${
								item.area
							} <span style = "font-weight: lighter; color: #ddd">|</span> ${
								item.field
							} <span style = "font-weight: lighter; color: #ddd">|</span>
								${item.doctors} 
								<!--<span style = "font-weight: lighter; color: #ddd">|</span> </p>-->
							<p style = "font-size: 16px; font-weight: 600; margin: 0; line-height: 25px">
								 ${new Date(item.time).toLocaleDateString()} -  ${new Date(item.time).toLocaleTimeString()}
							</p>
						</div>	
							<span class="fa fa-times list-item-edit" id="${
								item.uid
							}" style="font-size: 16px; justify-self: flex-end; margin-left: 25px; margin-top: 10px"></span>
						</div>
					</div>
					`;
						})
						.join("")
		}
		</div>
			<input type="button" value="Tiếp tục" class="btn btn-skin btn-block btn-lg btn-form3" />

			<span
			  style="font-size: 16px; color: rgb(12, 94, 94); float: right; margin-top: 10px; cursor: pointer"
			  class="switch-btn-logout"
			  href="#"
			  >Đăng xuất</span
			>
		  </form>
		</div>
	  </div>
	</div>
	`;
	$(".form-wrapper").innerHTML = html;

	//handle delete

	const listDeleteBtns = $$(".list-item-edit");
	listDeleteBtns.forEach((item, _index) => {
		item.addEventListener("click", async () => {
			const selectedDeleteListItem = finalList.find((selectedItem) => selectedItem.uid === item.id);
			await updateDoc(userDocRef, {
				list: arrayRemove(selectedDeleteListItem),
			});
			renderFinalList();
		});
	});
	const selectedDeleteListItem = finalList.find((item) => item.uid);
}

$(".form-wrapper").addEventListener("click", (e) => {
	//   e.preventDefault();
	if ($("#field")) {
		$("#field").onchange = () => {
			const filterKey = $("#field").value;
			const doctorSelectArray = doctors.find((item) => item.hasOwnProperty(filterKey))[filterKey];
			const innerDoctorSelectHTML = doctorSelectArray
				.map((item) => {
					return `
					<option value="${item}" selected >${item}</option>
				`;
				})
				.join("");

			$("#doctor-name").innerHTML = innerDoctorSelectHTML;
		};
	}
	if ($(".switch-btn-check")) {
		$(".switch-btn-check").onclick = () => {
			renderFinalList();
		};
	}
	if (e.target.closest(".switch-btn")) {
		isSignIn = !isSignIn;
		const innerSwitch = isSignIn ? ` Đã có tài khoản?` : ` Chưa có tài khoản?`;
		const innerSwitchBtn = isSignIn ? ` Đăng nhập` : ` Đăng kí`;
		$(".switch-text").innerText = innerSwitch;
		$(".switch-btn").innerText = innerSwitchBtn;
	} else if (e.target.closest(".switch-btn-check")) {
		renderFinalList();
	} else if (e.target.closest(".switch-btn-logout")) {
		signOut(auth)
			.then(() => {
				isSignIn = !isSignIn;
				renderFormWhenLoginSuccess();
				window.location.reload();
			})
			.catch((error) => {
				// An error happened.
			});
	} else if (e.target.closest(".btn-form1")) {
		// $('.form-1').preventDefault()
		var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
		const email = $("#email");
		const phone = $("#phone");
		if (email.value.trim() === "" || phone.value.trim() === "") {
			alert("Hãy điền đầy đủ các trường");
			return;
		}
		if (email.value.trim() !== "" && !regexEmail.test(email.value)) {
			alert("Hãy nhập email đúng format");
			return;
		}
		if (isSignIn)
			createUserWithEmailAndPassword(auth, email.value, phone.value)
				.then((userCredential) => {
					// user = userCredential.user;
					const addInit = async () => {
						await setDoc(
							doc(db, "users", userCredential.user.email),
							{
								role: 1,
								list: [],
							},
							{
								merge: true,
							}
						);
					};
					addInit().then(renderFormWhenLoginSuccess());
				})
				.catch((error) => {
					const errorCode = error.code;
					errorCode == "auth/email-already-in-use" && alert("Email đã tồn tại, hãy đăng nhập");
				});
		else
			signInWithEmailAndPassword(auth, email.value, phone.value)
				.then((userCredential) => {
					// user = userCredential.user;
					const userDocRef = doc(db, "users", userCredential.user.email);
					const checkRole = async () => {
						const docSnap = await getDoc(userDocRef);
						const role = docSnap.data().role;
						if (role === 2) {
							alert("Sai tài khoản/ mật khẩu");
							return;
						} else renderFormWhenLoginSuccess();
					};
					checkRole();
				})
				.catch((error) => {
					const errorCode = error.code;
					const errorMessage = error.message;
					errorCode == "auth/user-not-found" && alert("Tài khoản email không tồn tại");
					errorCode == "auth/wrong-password" && alert("Sai mật khẩu");
				});
	} else if (e.target.closest(".btn-form2")) {
		const first_name = $("#first_name").value;
		const last_name = $("#last_name").value;

		if (first_name.trim() === "" || last_name.trim() === "") {
			alert("Hãy điền đầy đủ thông tin");
			return;
		}

		updateProfile(auth.currentUser, {
			displayName: `${first_name} ${last_name}`,
		})
			.then(() => {
				// renderFormWhenLoginSuccess();
				const userDocRef = doc(db, "users", auth.currentUser.email);

				const addDocList = async () => {
					try {
						await setDoc(
							userDocRef,
							{
								displayName: `${first_name} ${last_name}`
							},
							{
								merge: true,
							}
						)
						renderFormWhenLoginSuccess()
					} catch (e) {
						console.error("Error adding document: ", e);
					}
				};
				addDocList();
			})
			.catch((error) => {
				// An error occurred
				// ...
			});
	} else if (e.target.closest(".btn-form3")) {
		isBooking = true;
		renderFormWhenLoginSuccess();

		let tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		tomorrow = tomorrow.toISOString().slice(0, 16);

		$("#date").setAttribute("min", tomorrow);
	} else if (e.target.closest(".btn-form4")) {
		const currentUser = auth.currentUser;
		const selectedDate = $("#date").value;
		const selectedArea = $("#area").value;
		const selectedField = $("#field").value;
		const selectedDoctors = $("#doctor-name").value;

		if (!selectedDate || !selectedArea || !selectedField || !selectedDoctors) {
			alert("Hãy điền đầy đủ thông tin");
			return;
		}


		const userDocRef = doc(db, "users", currentUser.email);
		const addList = async () => {
			const docSnap = await getDoc(userDocRef);
			if (!docSnap.exists()) {
				addDocList();
			} else {
				updateDocList();
			}
		};
		addList();

		const addDocList = async () => {
			try {
				await setDoc(
					userDocRef,
					{
						list: [
							{
								uid: new Date().toISOString(),
								time: selectedDate,
								area: selectedArea,
								field: selectedField,
								doctors: selectedDoctors,
							},
						],
					},
					{
						merge: true,
					}
				);
			} catch (e) {
				console.error("Error adding document: ", e);
			}
		};

		const updateDocList = async () => {
			await updateDoc(userDocRef, {
				list: arrayUnion({
					uid: new Date().toISOString(),
					time: selectedDate,
					area: selectedArea,
					field: selectedField,
					doctors: selectedDoctors,
				}),
			});
			renderFinalList();
		};

		// const element = <p>something</p>
	}
});
