// Inicializar el mapa centrado en NYC
const map = L.map('map').setView([40.7128, -74.006], 13);

// Capa base OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Referencia al modal Bootstrap
const modalElement = document.getElementById('formModal');
const bootstrapModal = new bootstrap.Modal(modalElement);

// Referencias a inputs del formulario
const latInput = document.getElementById('lat');
const lngInput = document.getElementById('lng');
const locationForm = document.getElementById('locationForm');

// Cuando el usuario da click en el mapa:
map.on('click', (e) => {
  // Guardar latitud y longitud en los inputs ocultos
  latInput.value = e.latlng.lat.toFixed(6);
  lngInput.value = e.latlng.lng.toFixed(6);

  // Limpiar formulario (por si quedó algo)
  locationForm.reset();

  // Mostrar el modal
  bootstrapModal.show();
});

// Manejar envío del formulario
locationForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('placeName').value.trim();
  const description = document.getElementById('description').value.trim();
  const type = document.getElementById('placeType').value;
  const lat = latInput.value;
  const lng = lngInput.value;

  // Validar mínimo (ya lo hace required pero más seguro)
  if (!name || !type) {
    alert('Por favor, completa los campos requeridos.');
    return;
  }

  // Agregar un marcador en el mapa con popup con la info
  const marker = L.marker([lat, lng]).addTo(map);
  marker.bindPopup(`<b>${name}</b><br>Tipo: ${type}<br>${description ? description : ''}`).openPopup();

  // Cerrar modal
  bootstrapModal.hide();
});