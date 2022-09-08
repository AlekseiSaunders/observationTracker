const getLocationBtn = document.getElementById('getLocation');
const latBox = document.getElementById('latitude');
const longBox = document.getElementById('longitude');
const accBox = document.getElementById('accuracy');
const locationOptions = {
  enableHightAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function success(pos) {
  const crd = pos.coords;
  latBox.value = crd.latitude.toFixed(3);
  longBox.value = crd.longitude.toFixed(3);
  accBox.value = crd.accuracy.toFixed(3);
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

// getLocationBtn.addEventListener('click', () => {
//   alert('clicked');
// });

getLocationBtn.addEventListener('click', (e) => {
  e.preventDefault();
  navigator.geolocation.getCurrentPosition(success, error, locationOptions);
});
