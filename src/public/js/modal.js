$(document).on('click', '#closeBtn', function () {
	$("#modal").css('display', 'none')
})

$(document).on('click', '#modalClose', function () {
	$("#modal").css('display', 'none')
})

function modalOpen(str) {
	let scrollTop = document.scrollingElement.scrollTop
	$('#modal').css('display', 'flex')
	$('#modal.modal-overlay').css('top', scrollTop)        //내가 올린 스크롤만큼 밑으로 이동
	$('#context').html(str)
}

let url = ''

async function modalClose() {
	$('#modal').css('display', 'none')
	$('#modal').css('left', '0')
	$('#modal').css('top', '0')
	if (refresh == 1) {
		refresh = 0
		location.href = url
	}
}