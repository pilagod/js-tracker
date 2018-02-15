(function () {
  var count = 0
  var $demo = $('#demo')
  var $text = $demo.find('span')

  $demo.click(function (e) {
    switch (count = (count % 2) + 1) {
      case 1:
        $text[0].innerHTML = 'Nice to meet you !'
        break
      case 2:
        $text.html('Thanks for your coming :)')
        break
    }
  })
})()
