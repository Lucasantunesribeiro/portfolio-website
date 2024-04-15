let slideAtualUm = 1;
let slideAtualDois = 1;

function mostrarSlideUm(n) {
  const slides = document.getElementsByClassName("slide");
  if (n > slides.length) { slideAtualUm = 1 }
  if (n < 1) { slideAtualUm = slides.length }
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[slideAtualUm - 1].style.display = "flex";
}

function mostrarSlideDois(n) {
  const slides = document.getElementsByClassName("slides");
  if (n > slides.length) { slideAtualDois = 1 }
  if (n < 1) { slideAtualDois = slides.length }
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[slideAtualDois - 1].style.display = "flex";
}

function anteriorSlideUm() {
  mostrarSlideUm(slideAtualUm -= 1);
}

function proximoSlideUm() {
  mostrarSlideUm(slideAtualUm += 1);
}

function anteriorSlideDois() {
  mostrarSlideDois(slideAtualDois -= 1);
}

function proximoSlideDois() {
  mostrarSlideDois(slideAtualDois += 1);
}

mostrarSlideUm(slideAtualUm);
mostrarSlideDois(slideAtualDois);



