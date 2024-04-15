const formDesktop = document.querySelector(".contato__registro");
const fullNameDesktop = document.getElementById("nome");
const emailDesktop = document.getElementById("email");
const phoneDesktop = document.getElementById("numero");
const subjectDesktop = document.getElementById("assunto");
const messDesktop = document.getElementById("message");


const formMobile = document.querySelector(".contato__registro__celular");
const fullNameMobile = document.getElementById("nomecelular");
const emailMobile = document.getElementById("emailcelular");
const phoneMobile = document.getElementById("numerocelular");
const subjectMobile = document.getElementById("assuntocelular");
const messMobile = document.getElementById("messagecelular");

function sendEmail(fullName, email, phone, subject, mess) {
  const bodyMessage = `Nome completo: ${fullName.value}<br> Email:${email.value}<br> Celular:${phone.value}<br> Assunto:${subject.value}<br> Messagem:${mess.value}`;
  Email.send({
    Host: "smtp.elasticemail.com",
    Username: "lucas.afvr2006@gmail.com",
    Password: "27DD77A1A9A6DE8D28D1649B29634E6FC65A",
    To: "lucas.afvr2006@gmail.com",
    From: "lucas.afvr2006@gmail.com",
    Subject: subject.value,
    Body: bodyMessage
  }).then(
    message => {
      if (message == "OK") {
        Swal.fire({
          title: "Realizado!",
          text: "Mensagem foi enviado com sucesso!",
          icon: "success"
        });
      }
    }
  );
}

function checkInputs(fullName, email, phone, subject, mess) {
  const items = [fullName, email, phone, subject, mess];

  for (const item of items) {
    item.addEventListener("keyup", () => {
      if (item.value.trim() !== "") {
        item.classList.remove("erro");
        item.parentElement.classList.remove("erro");
      } else {
        item.classList.add("erro");
        item.parentElement.classList.add("erro");
      }
    });
  }
}

function checkEmail(email) {
  const emailRegex = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,3})(\.[a-z]{2,3})?$/;
  const errorTxtEmail = email.nextElementSibling;

  if (!email.value.match(emailRegex)) {
    email.classList.add("erro");
    email.parentElement.classList.add("erro");

    if (email.value.trim() !== "") {
      errorTxtEmail.innerText = "Coloque um endereço de email válido";
    } else {
      errorTxtEmail.innerText = "Seu e-mail não pode ser deixado em branco";
    }
  } else {
    email.classList.remove("erro");
    email.parentElement.classList.remove("erro");
  }
}

formDesktop.addEventListener("submit", (e) => {
  e.preventDefault();
  checkInputs(fullNameDesktop, emailDesktop, phoneDesktop, subjectDesktop, messDesktop);
  checkEmail(emailDesktop);

  if (!fullNameDesktop.classList.contains("erro") && !emailDesktop.classList.contains("erro") && !phoneDesktop.classList.contains("erro") && !subjectDesktop.classList.contains("erro") && !messDesktop.classList.contains("erro")) {
    sendEmail(fullNameDesktop, emailDesktop, phoneDesktop, subjectDesktop, messDesktop);

    formDesktop.reset();
    return false;
  }
});

formMobile.addEventListener("submit", (e) => {
  e.preventDefault();
  checkInputs(fullNameMobile, emailMobile, phoneMobile, subjectMobile, messMobile);
  checkEmail(emailMobile);

  if (!fullNameMobile.classList.contains("erro") && !emailMobile.classList.contains("erro") && !phoneMobile.classList.contains("erro") && !subjectMobile.classList.contains("erro") && !messMobile.classList.contains("erro")) {
    sendEmail(fullNameMobile, emailMobile, phoneMobile, subjectMobile, messMobile);

    formMobile.reset();
    return false;
  }
});






/*
const form = document.querySelector("form");
const fullName = document.getElementById("nome");
const email = document.getElementById("email");
const phone = document.getElementById("numero");
const subject = document.getElementById("assunto");
const mess = document.getElementById("message");

function sendEmail() {
  const bodyMessage = `Nome completo: ${fullName.value}<br> Email:${email.value}<br> Celular:${phone.value}<br> Assunto:${subject.value}<br> Messagem:${mess.value}`

  Email.send({
    Host: "smtp.elasticemail.com",
    Username: "lucas.afvr2006@gmail.com",
    Password: "27DD77A1A9A6DE8D28D1649B29634E6FC65A",
    To: "lucas.afvr2006@gmail.com",
    From: "lucas.afvr2006@gmail.com",
    Subject: subject.value,
    Body: bodyMessage
  }).then(
    message => {
      if (message == "OK") {
        Swal.fire({
          title: "Realizado!",
          text: "Mensagem foi enviado com sucesso!",
          icon: "success"
        });
      }
    }
  );
}


function checkInputs() {
  const items = document.querySelectorAll(".item");

  for (const item of items) {
    if (item.value == "") {
      item.classList.add("erro");
      item.parentElement.classList.add("erro");
    }

    if (items[1].value != "") {
      checkEmail();
    }

    items[1].addEventListener("keyup", () => {
      checkEmail();
    });

    item.addEventListener("keyup", () => {
      if (item.value != "") {
        item.classList.remove("erro");
        item.parentElement.classList.remove("erro");
      }
      else {
        item.classList.add("erro");
        item.parentElement.classList.add("erro");
      }
    })
  }
}

function checkEmail() {
  const emailRegex = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,3})(\.[a-z]{2,3})?$/;
  const errorTxtEmail = document.querySelector(".error-text.email")

  if (!email.value.match(emailRegex)) {
    email.classList.add("erro");
    email.parentElement.classList.add("erro");

    if (email.value != "") {
      errorTxtEmail.innerText = "Coloque um endereço de email válido "
    }
    else {
      errorTxtEmail.innerText = "Seu e-mail não pode ser deixado em branco"
    }
  }
  else {
    email.classList.remove("erro");
    email.parentElement.classList.remove("erro");
  }
}


form.addEventListener("submit", (e) => {
  e.preventDefault();
  checkInputs();

  if (!fullName.classList.contains("erro") && !email.classList.contains("erro") && !phone.classList.contains("erro") && !subject.classList.contains("erro") && !mess.classList.contains("erro")){
    sendEmail();

    form.reset();
    return false;
  }


});


*/










