// Select input fields
let userName = document.getElementById('username');
let userEmail = document.getElementById('email');
let userPassword = document.getElementById('password');
let userResetPassword = document.getElementById('resetpassword');

// Select validation message elements
let nameValid = document.getElementById("nameValid");
let emailValid = document.getElementById("emailValid");
let passwordValid = document.getElementById("passwordValid");
let resetPasswordValid = document.getElementById("resetPasswordValid");
let existUser = document.getElementById("existUser");

// Select login form fields
let userLoginEmail = document.getElementById('loginemail');
let userLoginPassword = document.getElementById('loginpassword');
let undefindUser = document.getElementById('undefindUser');

// Regular expressions
let emailRegx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
let passRegx = /^[a-zA-Z0-9]{8,}$/;

// ======================== Validation Functions ========================
function checkNameValid(username) {
    let inputValueName = username.value.trim();
    if (inputValueName === "") {
        nameValid.innerHTML = "Name is Required";
        nameValid.style.display = "block";
        username.style.border = "1px solid red";
        return false;
    } else if (inputValueName.length <= 3) {
        nameValid.innerHTML = "Name should be more than 3 characters";
        nameValid.style.display = "block";
        username.style.border = "1px solid red";
        return false;
    } else {
        nameValid.innerHTML = "";
        nameValid.style.display = "none";
        username.style.border = "1px solid blue";
        return true;
    }
}

function checkEmailValid(useremail) {
    let inputValueEmail = useremail.value.trim();
    if (inputValueEmail === "") {
        emailValid.innerHTML = "Email is Required";
        emailValid.style.display = "block";
        useremail.style.border = "1px solid red";
        return false;
    } else if (!emailRegx.test(inputValueEmail)) {
        emailValid.innerHTML = "Not Valid Email";
        emailValid.style.display = "block";
        useremail.style.border = "1px solid red";
        return false;
    } else {
        emailValid.innerHTML = "";
        emailValid.style.display = "none";
        useremail.style.border = "1px solid blue";
        return true;
    }
}

function checkPasswordValid(userpassword) {
    let inputValuePassword = userpassword.value.trim();
    if (inputValuePassword === "") {
        passwordValid.innerHTML = "Password is Required";
        passwordValid.style.display = "block";
        userpassword.style.border = "1px solid red";
        return false;
    } else if (!passRegx.test(inputValuePassword)) {
        passwordValid.innerHTML = "Not Valid Password (min 8 characters)";
        passwordValid.style.display = "block";
        userpassword.style.border = "1px solid red";
        return false;
    } else {
        passwordValid.innerHTML = "";
        passwordValid.style.display = "none";
        userpassword.style.border = "1px solid blue";
        return true;
    }
}

function checkResetPasswordValid() {
    let inputValueResetPassword = userResetPassword.value.trim();
    if (inputValueResetPassword === "") {
        resetPasswordValid.innerHTML = "Reset Password is Required";
        resetPasswordValid.style.display = "block";
        userResetPassword.style.border = "1px solid red";
        return false;
    } else if (inputValueResetPassword !== userPassword.value.trim()) {
        resetPasswordValid.innerHTML = "Passwords Don't Match";
        resetPasswordValid.style.display = "block";
        userResetPassword.style.border = "1px solid red";
        return false;
    } else {
        resetPasswordValid.innerHTML = "";
        resetPasswordValid.style.display = "none";
        userResetPassword.style.border = "1px solid blue";
        return true;
    }
}

// ======================== Event Listeners for Registration & Login ========================
document.addEventListener("DOMContentLoaded", function () {
    let loginForm = document.getElementById('loginForm');
    let registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!(checkNameValid(userName) && checkEmailValid(userEmail) && checkPasswordValid(userPassword) && checkResetPasswordValid())) {
                return;
            }

            var username = userName.value.trim();
            var useremail = userEmail.value.trim();
            var password = userPassword.value.trim();

            let users = JSON.parse(localStorage.getItem('users')) || [];

            let existingUser = users.find(user => user.email === useremail);
            if (existingUser) {
                existUser.innerHTML = `Email Is Already Registered, Please <a href="../Forms/login.html">Login!</a>`;
                existUser.style.display = "block";
                return false;
            } else {
                existUser.innerHTML = "";
                existUser.style.display = "none";
            }

            users.push({ name: username, email: useremail, password: password });
            localStorage.setItem('users', JSON.stringify(users));

            alert("Registration successful! You can now login.");
            username
        });

        userName.addEventListener('input', function () { checkNameValid(this); });
        userEmail.addEventListener('input', function () { checkEmailValid(this); });
        userPassword.addEventListener('input', function () { checkPasswordValid(this); });
        userResetPassword.addEventListener('input', function () { checkResetPasswordValid(); });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!(checkEmailValid(userLoginEmail) && checkPasswordValid(userLoginPassword))) {
                return;
            }

            var useremail = userLoginEmail.value.trim();
            var userpassword = userLoginPassword.value.trim();

            let users = JSON.parse(localStorage.getItem('users')) || [];

            let existingUser = users.find(user => user.email === useremail && user.password === userpassword);
            if (!existingUser) {
                undefindUser.innerHTML = `Incorrect Email or Password. Please try again Or <a href="../Forms/register.html">Register Now!</a>`;
                undefindUser.style.display = "block";
                return false;
            } else {
                undefindUser.innerHTML = "";
                undefindUser.style.display = "none";
                window.location.href = '../index.html';
            }
            
        });

        userLoginEmail.addEventListener('input', function () { checkEmailValid(this); });
        userLoginPassword.addEventListener('input', function () { checkPasswordValid(this); });
    }
});
