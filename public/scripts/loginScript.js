const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

const submitLogin = document.getElementById("submitLogin");

submitLogin.addEventListener("click", async (e) => {
  e.preventDefault();
  var username = document.getElementById("usernameInputLogin").value;
  var password = document.getElementById("passwordInputLogin").value;
  var url = "/auth/login"
  var data = { username, password }
  const option = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }
  const result = await fetch(url, option);
  const hasil = await result.json();
  console.log(hasil);
  if (hasil.user) {
    // berhasil login
    if (hasil.user.mudhohi) {
      // mudhohi
      location.assign("/mudhohi");
    }
    else {
      if (hasil.user.role == "admin") {
        location.assign("/admin");
      }
      else if (hasil.user.role == "panitLt1") {
        location.assign("/panitLt1");
      }
      else if (hasil.user.role == "panitLt2") {
        location.assign("/panitLt2");
      }
      else {
        location.assign("/panitLt3");
      }
    }
  }
  else {
    // gagal login
    console.log(hasil.message);
  }
})


const submitSignUp = document.getElementById("submitSignUp");
submitSignUp.addEventListener("click", async (e) => {
  e.preventDefault();
  var username = document.getElementById("usernameInputSignUp").value;
  var password = document.getElementById("passwordInputSignUp").value;
  var name = document.getElementById("nameInputSignUp").value;
  var role = document.getElementById("role").value;
  if (role == "mudhohi") {
    var address = document.getElementById("addressInputSignUp").value;
    var phoneNumber = document.getElementById("phoneNumberInputSignUp").value;
    var nomorSapi = document.getElementById("nomorSapiInputSignUp").value;
    // console.log({ username, password, name, role, address, phoneNumber, nomorSapi });
    var url = "/postMudhohi"
    var data = { username, password, name, alamat: address, noHP: phoneNumber, noSapi: nomorSapi };
    const option = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
    const result = await fetch(url, option);
    const hasil = await result.json();
    console.log(hasil);
  }
  else if (role == "panitia-lantai-1") {
    var url = "/postPanitLt1"
    var data = { username, password, name };
    const option = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
    const result = await fetch(url, option);
    const hasil = await result.json();
    console.log(hasil);
  }
  else if (role == "panitia-lantai-2") {
    var url = "/postPanitLt2"
    var data = { username, password, name };
    const option = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
    const result = await fetch(url, option);
    const hasil = await result.json();
    console.log(hasil);
  }
  else {
    // panit-lantai-3
    var url = "/postPanitLt3"
    var data = { username, password, name };
    const option = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
    const result = await fetch(url, option);
    const hasil = await result.json();
    console.log(hasil);
  }
})