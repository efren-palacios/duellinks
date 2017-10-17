var is_mobile = false

$('#cards .deckcards').hover(
  function () {
    $('.info').attr('src', $(this).attr('src'))
    $(this).css('box-shadow', '0 0  10px #203CFD')
  },
  function () {
    $(this).css('box-shadow', 'none')
  }
)

$(function () {
  if ($('.stats').css('display') == 'none') {
    is_mobile = true
  }
})

$(function () {
  if (is_mobile == true) {
    $('.item a').each(function (index) {
     $(this).attr('href', $(this).find('img').attr('src'))
      .addClass('fancybox')
   })
    $('.fancybox').fancybox()
  }
})

$(window).on('resize', function () {
  is_mobile = $('.stats').css('display') == 'none'
  if (is_mobile == true) {
    $('.item a').each(function (index) {
     $(this).attr('href', $(this).find('img').attr('src'))
      .addClass('fancybox')
   })
    $('.fancybox').fancybox()
  }
  if (is_mobile == false) {
    $('.item a').removeAttr('href').unbind('click.fb-start').removeClass('fancybox')

  }
})
