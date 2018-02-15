(function () {
  var demo = document.getElementById('demo')

  demo.addEventListener('mouseenter', function () {
    demo.classList.add('hover')
  })

  demo.addEventListener('mouseleave', function () {
    demo.classList.remove('hover')
  })
})()
