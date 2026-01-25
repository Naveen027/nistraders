
const cards = document.querySelectorAll('.testimonial-card');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.2 });

cards.forEach(card => observer.observe(card));


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



document.addEventListener("DOMContentLoaded", function () {

  const stateRates = {
    KA: 7.2,   // Karnataka
    MH: 9.65,   // Maharashtra
    TN: 4.0,   // Tamil Nadu
    DL: 6.5,   // Delhi
    GJ: 5.9,   // Gujarat
    RJ: 6.3    // Rajasthan
  };

  const stateSelect = document.getElementById("state");
  const rateInput = document.getElementById("rate");
  const inputMethod = document.getElementById("inputMethod");
  const dynamicLabel = document.getElementById("dynamicLabel");

  // Safety check (prevents silent failure)
  if (!stateSelect || !rateInput) {
    console.error("State or Rate input not found in DOM");
    return;
  }

  // Auto-fill electricity rate
  stateSelect.addEventListener("change", function () {
    rateInput.value = stateRates[this.value] || "";
  });

  // Change input label
  inputMethod.addEventListener("change", function () {
    if (this.value === "bill") dynamicLabel.innerText = "Monthly Electricity Bill (₹)";
    if (this.value === "units") dynamicLabel.innerText = "Monthly Consumption (kWh)";
    if (this.value === "area") dynamicLabel.innerText = "Rooftop Area (sq ft)";
  });

  // Make calculateSolar global (button onclick needs it)
  window.calculateSolar = function () {

    const method = inputMethod.value;
    const value = Number(document.getElementById("inputValue").value);
    const rate = Number(rateInput.value);
    const type = document.getElementById("type").value;

    if (!value || value <= 0) {
      alert("Please enter a valid input value");
      return;
    }

    if (!rate || rate <= 0) {
      alert("Please select a state");
      return;
    }

    let systemSize;
    if (method === "bill") systemSize = value / (rate * 135);
    else if (method === "units") systemSize = value / 135;
    else systemSize = value / 100;

    systemSize = Math.max(1, Number(systemSize.toFixed(1)));

    const costPerKW = 65000;
    const totalCost = systemSize * costPerKW;
    const subsidy = type === "residential"
      ? Math.min(systemSize * 18000, 78000)
      : 0;

    const netCost = totalCost - subsidy;
    const annualProduction = systemSize * 1643;
    const annualSavings = annualProduction * rate;
    const payback = (netCost / annualSavings).toFixed(1);
    const co2 = Math.round(annualProduction * 0.9);

    document.getElementById("sysSize").innerText = systemSize + " kW";
    document.getElementById("cost").innerText = "₹" + totalCost.toLocaleString();
    document.getElementById("subsidy").innerText = "₹" + subsidy.toLocaleString();
    document.getElementById("netCost").innerText = "₹" + netCost.toLocaleString();
    document.getElementById("production").innerText = annualProduction.toFixed(0) + " kWh";
    document.getElementById("savings").innerText = "₹" + annualSavings.toLocaleString();
    document.getElementById("payback").innerText = payback + " Years";
    document.getElementById("co2").innerText = co2 + " kg";
  };

});
