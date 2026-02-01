function toggleMenu(btn) {
  const menu = document.querySelector("nav ul");
  menu.classList.toggle("show");
  btn.classList.toggle("active");
}

/* Auto close when clicking menu link */
document.querySelectorAll("nav ul li a").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelector("nav ul").classList.remove("show");
    document.querySelector(".hamburger").classList.remove("active");
  });
});

const slides = document.querySelectorAll(".hero-slider .slide");
    let current = 0;

    setInterval(() => {
        slides[current].classList.remove("active");
        current = (current + 1) % slides.length;
        slides[current].classList.add("active");
    }, 1000);


const cards = document.querySelectorAll('.testimonial-card');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.2 });

cards.forEach(card => observer.observe(card));




