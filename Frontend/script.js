const cars = [
  {
    name: "Toyota Corolla",
    price: 2800,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEL8MT83NM8D5uKBqEwTclUUAeUdiGKDGw0Q&s"
  },
  {
    name: "Hyundai Creta",
    price: 3500,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/2020_Hyundai_Creta_LX_Plus_1.6.jpg/640px-2020_Hyundai_Creta_LX_Plus_1.6.jpg"
  },
  {
    name: "BMW 5 Series",
    price: 7200,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/BMW_520d_G30_IMG_0793.jpg/640px-BMW_520d_G30_IMG_0793.jpg"
  }
];


if (window.location.pathname.includes("index.html") || window.location.pathname === "/" || window.location.pathname.endsWith("/")) {
  window.saveFormAndGo = function () {
    const formData = {
      pickupLocation: document.getElementById('pickupLocation').value,
      pickupDate: document.getElementById('pickupDate').value,
      pickupTime: document.getElementById('pickupTime').value,
      dropoffDate: document.getElementById('dropoffDate').value,
      dropoffTime: document.getElementById('dropoffTime').value
    };
    localStorage.setItem("formData", JSON.stringify(formData));
    window.location.href = "details.html";
  };
}

if (window.location.pathname.includes("details.html")) {
  window.onload = function () {
    const formData = JSON.parse(localStorage.getItem("formData"));
    const formSummary = document.getElementById("formSummary");
    const carList = document.getElementById("carList");

    if (formData && formSummary) {
      formSummary.innerHTML = `
        <p><strong>Pickup Location:</strong> ${formData.pickupLocation}</p>
        <p><strong>Pickup Date & Time:</strong> ${formData.pickupDate} ${formData.pickupTime}</p>
        <p><strong>Drop-off Date & Time:</strong> ${formData.dropoffDate} ${formData.dropoffTime}</p>
      `;
    }

    if (carList) {
      cars.forEach((car, index) => {
        const card = document.createElement("div");
        card.className = "car-card";
        card.innerHTML = `
          <img src="${car.image}" alt="${car.name}" />
          <h4>${car.name}</h4>
          <p>Price: ₹${car.price}</p>
          <button onclick='selectCar(${index})'>View Details</button>
        `;
        carList.appendChild(card);
      });
    }

    window.selectCar = function (index) {
      const selected = cars[index];
      const formData = JSON.parse(localStorage.getItem("formData"));
      const fullData = { ...formData, selectedCar: selected };
      localStorage.setItem("reservationData", JSON.stringify(fullData));
      window.location.href = "confirmation.html";
    };
  };
}
