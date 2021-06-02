jQuery(function($) {
  $(document).on('hover', '.acf-fc-popup li a', function() {
    var $this = $(this)
    var parent = $this.parents('.acf-fc-popup');
    var filename = $this.attr('data-layout');

    $this.addClass('active').parent('li').siblings().find('a').removeClass('active');

    if (parent.find('.preview').length > 0) {
      parent.find('.preview').html('<div class="inner-preview"><img src="' + roxi_admin.upload + filename + '.png" /></div>')
    } else {
      parent.append('<div class="preview"><div class="inner-preview"><img src="' + roxi_admin.upload + filename + '.png" /></div></div>')
    }
  })
})
