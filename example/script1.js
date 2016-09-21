var button = document.getElementsByTagName('button')[0];

button.addEventListener('click', function () {
  this.innerHTML =
    this.innerHTML === 'unclicked' ? 'clicked' : 'unclicked';
});
