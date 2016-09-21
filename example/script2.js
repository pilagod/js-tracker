var button = $('button')

button.on('mouseenter', function () {
  $(this).addClass('hover');
});

button.on('mouseleave', function (event) {
  event.target.classList.remove('hover');
});
