var div = document.createElement('div')
div.id = 'id'
div.style.color = 'red'
div.removeAttribute('style')
div.innerText = 'js-tracker'
div.addEventListener('click', function () {
  div.focus()
})
for (let i = 0; i < 3; i++) {
  div.classList.add('class' + i)
}
