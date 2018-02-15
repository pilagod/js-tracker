(function () {
  var flag = false
  var $demo = $('#demo')
  var $text = $demo.find('span')

  $demo.click(function (e) {
    if ((flag = !flag)) {
      $text[0].innerHTML = 'Nice to meet you !'
    } else {
      $text.html('Hope you like it :)')
    }
  })
})()
