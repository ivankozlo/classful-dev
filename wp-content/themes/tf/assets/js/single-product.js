jQuery(document).ready(function($) {

    $show_more_content = $('<div>');
    $show_more_content.addClass('show-more-content');
    $('.sp-description .section-content > *:not(:first-child):not(.show-more-link):not(.show-less-link)').each(function(){
        $show_more_content.append($(this));
    });
    $show_more_content.insertAfter($('.sp-description .section-content > *:first-child'));
    
    $(document).on('click', '.show-more-link', function(e){
        e.preventDefault();
        $(this).siblings('.show-more-content').slideDown();
        $(this).siblings('.show-less-link').css({'display':'block'});
        $(this).hide();
        return false;
    });
    $(document).on('click', '.show-less-link', function(e){
        e.preventDefault();
        $(this).siblings('.show-more-content').slideUp();
        $(this).siblings('.show-more-link').css({'display':'block'});
        $(this).hide();
        return false;
    });

    $('.product-slider').slick({
        infinite: true,
        slidesToShow: 6,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 1280,
            settings: {
              slidesToShow: 5
            }
          },
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 4
            }
          },
          {
            breakpoint: 991,
            settings: {
              slidesToShow: 3
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1
            }
          }
        ]
    });

    $(document).on('click', '#review-form-toggle', function(e){
        e.preventDefault();
        $('#review_form_wrapper').toggle();
        return false;
    });

    $(document).on('click', '.wpgs-nav .slick-slide', function(e){
      $(this).addClass('tf-active').siblings().removeClass('tf-active');
      $('.wpgs-for').slick('slickGoTo', parseInt($(this).attr('data-slick-index')), true);
    });

    $(document).on('change', '.quantity .qty', function(){
        let $input = $(this);
        let val = $input.val() ? parseInt($input.val()) : 0;
        let min = Math.max(1, parseInt($input.attr('min')));
        let max = Math.max(min, parseInt($input.attr('max')));

        if ( val < min) {
            $input.val(min);
        } else if ( val > max) {
            $input.val(max);
        }
    });
    
    $(document).on('click', '.qty-control', function(e){
        e.preventDefault();

        let $input = $(this).siblings('input');
        let val = $input.val() ? parseInt($input.val()) : 0;
        let min = Math.max(1, parseInt($input.attr('min')));
        let max = Math.max(min, parseInt($input.attr('max')));

        if ( $(this).hasClass('minus') ) {
            val--;
            if ( val < min) val = min;
        } else {
            val++;
            if ( val > max) val = max;
        }

        $input.val(val);

        return false;
    });

});