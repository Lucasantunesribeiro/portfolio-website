document.addEventListener('DOMContentLoaded', function () {
  function updateActiveLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    let currentSection = '';

    // Adiciona um pequeno ajuste para garantir que a primeira seção também seja considerada ativa
    const scrollPosition = window.scrollY + 200; // Ajuste de 60px para considerar possíveis headers fixos

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionBottom = sectionTop + sectionHeight;

      // Verifica se a posição de rolagem atual está dentro dos limites da seção
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        currentSection = section.getAttribute('id');
      }
    });

    // Atualiza a classe 'active' nos links de navegação
    navLinks.forEach(link => {
      const href = link.getAttribute('href').substring(1); // Remove o '#' para comparar com o ID
      if (href === currentSection) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  this.getElementById

  // Atualiza o status ao carregar a página
  updateActiveLink();

  // Atualiza ao rolar ou redimensionar a página
  window.addEventListener('scroll', updateActiveLink);
  window.addEventListener('resize', updateActiveLink);
});








emailjs.init("51HfTfGhe5JDB4zti");
; // Substitua com seu User ID

function sendEmail(event) {
  event.preventDefault(); // Evita o envio padrão do formulário

  emailjs.sendForm('service_kypy5sb', 'template_116cotg', '#contact-form')
    .then((response) => {
      console.log('Success:', response);
      Swal.fire({
        title: "Realizado!",
        text: "Mensagem foi enviada com sucesso!",
        icon: "success"
      });
    })
    .catch((error) => {
      console.error('Error:', error);
      Swal.fire({
        title: "Erro!",
        text: "Houve um problema ao enviar a mensagem.",
        icon: "error"
      });
    });
}