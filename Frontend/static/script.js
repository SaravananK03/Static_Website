// Navbar toggle
document.getElementById("menu-toggle").addEventListener("click", () => {
  const nav = document.getElementById("nav-links");
  nav.classList.toggle("active");
});

// Save form and redirect
function saveFormAndGo() {
  const pickupLocation = document.getElementById("pickupLocation").value.trim();
  const pickupDate = document.getElementById("pickupDate").value;
  const pickupTime = document.getElementById("pickupTime").value;
  const dropoffDate = document.getElementById("dropoffDate").value;
  const dropoffTime = document.getElementById("dropoffTime").value;
  
  if (!pickupLocation || !pickupDate || !pickupTime || !dropoffDate || !dropoffTime) {
    alert("Please fill in all fields before continuing.");
    return; // Stop the function
  }  

  const formData = {
    pickupLocation,
    pickupDate,
    pickupTime,
    dropoffDate,
    dropoffTime
  };

  localStorage.setItem("reservationData", JSON.stringify(formData));
  window.location.href = "./templates/details.html";
}

// Enable Google Maps Autocomplete for pickup location
function initAutocomplete() {
  const input = document.getElementById("pickupLocation");
  if (input) {
    new google.maps.places.Autocomplete(input);
  }
}

// Wait for Maps API to load and call initAutocomplete
window.initAutocomplete = initAutocomplete;

// If Google script uses callback (optional way):
if (typeof google !== "undefined" && google.maps && google.maps.places) {
  initAutocomplete();
}


// Load form summary and show cars
window.addEventListener("DOMContentLoaded", () => {
  const formData = JSON.parse(localStorage.getItem("reservationData"));
  const summary = document.getElementById("formSummary");

  if (summary && formData) {
    summary.innerHTML = `
      <p><strong>Pickup:</strong> ${formData.pickupLocation}</p>
      <p><strong>Date:</strong> ${formData.pickupDate}</p>
      <p><strong>Time:</strong> ${formData.pickupTime}</p>
      <p><strong>Drop-off:</strong> ${formData.dropoffDate} ${formData.dropoffTime}</p>
    `;
  }

  const carList = document.getElementById("carList");
  if (carList && formData?.pickupDate && formData?.dropoffDate) {
    const pickup = new Date(formData.pickupDate);
    const dropoff = new Date(formData.dropoffDate);
    const days = Math.max(1, Math.ceil((dropoff - pickup) / (1000 * 60 * 60 * 24)));

    const cars = [
      { name: "Maruti Swift", price: 2500, image: "https://img.autocarindia.com/ExtraImages/20240912121327_Swift%20CNG%20Web.jpg?w=700&c=1" },
      { name: "Hyundai i20", price: 3000, image: "https://images.livemint.com/img/2020/02/20/1600x900/hyundai-i20-2021---fotos-vazadas_(3)_1582018912930_1582181092871.jpg" },
      { name: "Toyota Innova", price: 4500, image: "https://images.timesdrive.in/photo/msid-151019843,thumbsize-382800,width-560,height-250,false/151019843.jpg" },
      { name: "BMW X7", price: 7500, image: "https://images.carexpert.com.au/resize/3000/-/app/uploads/2022/11/2023-BMW-X7-M60i-HERO-16x9-1.jpg" },
      { name: "RR Classic", price: 15000, image: "https://static1.hotcarsimages.com/wordpress/wp-content/uploads/2022/04/MG-VA-Via--Flickr-Staffan-Andersson-Using-Albums!-MG-VA.jpeg" },
      { name: "Benz AMG", price: 9500, image: "https://images.pexels.com/photos/2365572/pexels-photo-2365572.jpeg?cs=srgb&dl=pexels-mikebirdy-2365572.jpg&fm=jpg" }
    ];

    cars.forEach(car => {
      const totalPrice = car.price * days;

      const div = document.createElement("div");
      div.className = "car-card";
      div.innerHTML = `
        <img src="${car.image}" alt="${car.name}" />
        <div class="car-info">
          <h3>${car.name}</h3>
          <p>₹${car.price} / day</p>
          <p><strong>Total:</strong> ₹${totalPrice} for ${days} day${days > 1 ? "s" : ""}</p>
        </div>
      `;

      div.addEventListener("click", () => {
        const updatedFormData = {
          ...formData,
          selectedCar: {
            ...car,
            totalPrice,
            rentalDays: days
          }
        };
        localStorage.setItem("reservationData", JSON.stringify(updatedFormData));
        window.location.href = "confirmation.html";
      });

      carList.appendChild(div);
    });
  }
});

// Existing Razorpay payButton click handler
document.getElementById('payButton').onclick = function (e) {
  e.preventDefault();

  const name = document.getElementById('customer-name');
  const email = document.getElementById('customer-email');
  const number = document.getElementById('customer-number');

  let valid = true;

  document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
  document.querySelectorAll('input').forEach(el => el.classList.remove('input-error'));

  // Name validation
  if (!name.value.trim()) {
    name.classList.add("input-error");
    name.classList.remove("input-valid");
    document.getElementById("name-error").style.display = "block";
    valid = false;
  } else {
    name.classList.remove("input-error");
    name.classList.add("input-valid");
    document.getElementById("name-error").style.display = "none";
  }

  // Email validation
  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!emailPattern.test(email.value.trim())) {
    email.classList.add("input-error");
    email.classList.remove("input-valid");
    document.getElementById("email-error").style.display = "block";
    valid = false;
  } else {
    email.classList.remove("input-error");
    email.classList.add("input-valid");
    document.getElementById("email-error").style.display = "none";
  }

  // Phone validation
  const phonePattern = /^[0-9]{10}$/;
  if (!phonePattern.test(number.value.trim())) {
    number.classList.add("input-error");
    number.classList.remove("input-valid");
    document.getElementById("number-error").style.display = "block";
    valid = false;
  } else {
    number.classList.remove("input-error");
    number.classList.add("input-valid");
    document.getElementById("number-error").style.display = "none";
  }

  if (!valid) return;

  const data = JSON.parse(localStorage.getItem("reservationData"));
  const amount = data.selectedCar?.totalPrice || 0;

  const options = {
    key: "rzp_test_PMMLte4CIjePoq",
    amount: amount * 100,
    currency: "INR",
    name: name.value,
    description: `Booking: ${data.selectedCar?.name || "Car"}`,
    handler: function (response) {
      alert("Payment Successful!");
      alert("Transaction ID: " + response.razorpay_payment_id);
    },
    prefill: {
      name: name.value,
      email: email.value,
      contact: number.value
    },
    theme: {
      color: "#3399cc"
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
};

// ✅ Real-time validation (place this AFTER payButton code)
document.addEventListener('DOMContentLoaded', () => {
  const name = document.getElementById('customer-name');
  const email = document.getElementById('customer-email');
  const number = document.getElementById('customer-number');

  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  const phonePattern = /^[0-9]{10}$/;

  name.addEventListener("input", () => {
    if (!name.value.trim()) {
      name.classList.add("input-error");
      name.classList.remove("input-valid");
      document.getElementById("name-error").style.display = "block";
    } else {
      name.classList.remove("input-error");
      name.classList.add("input-valid");
      document.getElementById("name-error").style.display = "none";
    }
  });

  email.addEventListener("input", () => {
    if (!emailPattern.test(email.value.trim())) {
      email.classList.add("input-error");
      email.classList.remove("input-valid");
      document.getElementById("email-error").style.display = "block";
    } else {
      email.classList.remove("input-error");
      email.classList.add("input-valid");
      document.getElementById("email-error").style.display = "none";
    }
  });

  number.addEventListener("input", () => {
    if (!phonePattern.test(number.value.trim())) {
      number.classList.add("input-error");
      number.classList.remove("input-valid");
      document.getElementById("number-error").style.display = "block";
    } else {
      number.classList.remove("input-error");
      number.classList.add("input-valid");
      document.getElementById("number-error").style.display = "none";
    }
  });
});

// Cancel button functionality
document.getElementById('cancelButton').onclick = function () {
  window.location.href = "details.html";
};




