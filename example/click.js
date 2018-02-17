(function () {
  var contentSwitch = false
  var $content = $('#demo').find('.content')

  $content.click(function (e) {
    (contentSwitch = !contentSwitch)
      ? $content[0].innerHTML = 'Nice to meet you !'
      : $content.html('Hope you like it :)')
  })
})()
