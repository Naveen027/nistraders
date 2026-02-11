window.addEventListener("load", function () {
  setTimeout(() => {
    document.getElementById("flyerModal").classList.add("show");
  }, 5000);
});

function closeFlyer() {
  document.getElementById("flyerModal").classList.remove("show");
}
  //----------------------------------------------------------------------- Show popup on page load
  window.addEventListener("load", function () {
    const popup = document.getElementById("districtPopup");
    if (popup) {
      popup.style.display = "flex";
    }
  });

  // Close popup
  function closePopup() {
    const popup = document.getElementById("districtPopup");
    if (popup) {
      popup.style.display = "none";
    }
  }
// -----------------------------------------------------------------------hamburger----------------------------------------
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


// -------------------------------------------------------------------------------------testimonal-------------------------
const cards = document.querySelectorAll('.testimonial-card');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.2 });

cards.forEach(card => observer.observe(card));
// -----------------------------------------------------------------calculator----------------------------------------------

document.addEventListener("DOMContentLoaded", function () {

  const stateRates = {
    KA: 7.2,
    MH: 9.65,
    TN: 4.0,
    DL: 6.5,
    GJ: 5.9,
    RJ: 6.3
  };

  const stateSelect = document.getElementById("state");
  const rateInput = document.getElementById("rate");
  const inputMethod = document.getElementById("inputMethod");
  const dynamicLabel = document.getElementById("dynamicLabel");

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

  window.calculateSolar = function () {

    const method = inputMethod.value;
    const value = Number(document.getElementById("inputValue").value);
    const rate = Number(rateInput.value);
    const type = document.getElementById("type").value;
    const manual = Number(document.getElementById("manualSize").value);

    if (!manual && (!value || value <= 0)) {
      alert("Please enter a valid input value");
      return;
    }

    if (!rate || rate <= 0) {
      alert("Please select a state");
      return;
    }

    let systemSize;

    // Auto system sizing
    if (method === "bill") {
      systemSize = value / (rate * 135);
    } 
    else if (method === "units") {
      systemSize = value / 135;
    } 
    else {
      systemSize = value / 100;
    }

    // Manual override
    if (manual) {
      systemSize = manual;
    }

    systemSize = Math.max(1, Number(systemSize.toFixed(1)));

    const costPerKW = 65000;
    const totalCost = systemSize * costPerKW;

    // Govt subsidy logic
    let subsidy = 0;

    if (type === "residential") {
      if (systemSize >= 3) subsidy = 78000;
      else if (systemSize >= 2) subsidy = 60000;
      else subsidy = 30000;
    }

    const netCost = totalCost - subsidy;

    // Production estimate
    const annualProduction = systemSize * 1643;

    // Annual bill calculation
    let annualBill;

    if (method === "bill") {
      annualBill = value * 12;
    } 
    else if (method === "units") {
      annualBill = value * rate * 12;
    } 
    else {
      annualBill = annualProduction * rate; // fallback
    }

    const solarValue = annualProduction * rate;

    // ✅ Realistic savings cap
    const annualSavings = Math.min(solarValue, annualBill);

    // Payback
    const payback = annualSavings > 0
      ? (netCost / annualSavings).toFixed(1)
      : "N/A";

    // CO₂ savings
    const co2 = Math.round(annualProduction * 0.9);

    // Output
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



