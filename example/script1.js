var button = document.getElementsByTagName('button')[0];

button.addEventListener('click', function () {
  if (this.innerHTML === 'unclicked') {
    this.innerHTML = 'clicked';
  } else {
    this.innerHTML = 'unclicked';
  }
});
