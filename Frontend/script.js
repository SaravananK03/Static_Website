const form = document.getElementById('reservationForm');
const summary = document.getElementById('summary');

function loadReservation() {
  const data = localStorage.getItem('reservation');
  if (data) {
    const res = JSON.parse(data);
    summary.innerHTML = `
      <h3>Reservation Summary</h3>
      <p><strong>Pickup:</strong> ${res.pickupLocation} on ${res.pickupDate}</p>
      <p><strong>Drop-off:</strong> ${res.dropoffLocation} on ${res.dropoffDate}</p>
      <p><strong>Car Type:</strong> ${res.carType}</p>
    `;
  }
}

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const reservation = {
    pickupLocation: document.getElementById('pickupLocation').value,
    dropoffLocation: document.getElementById('dropoffLocation').value,
    pickupDate: document.getElementById('pickupDate').value,
    dropoffDate: document.getElementById('dropoffDate').value,
    carType: document.getElementById('carType').value,
  };

  localStorage.setItem('reservation', JSON.stringify(reservation));
  loadReservation();
  alert('Reservation Saved!');
});

window.onload = loadReservation;
