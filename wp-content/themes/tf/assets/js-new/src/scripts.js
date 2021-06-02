jQuery(document).ready(function($) {
    $('.user-list.load-more').simpleLoadMore({
        item: '.user-list__item',
        btnHTML: '<div class="text-center w-100"><a href="#" class="load-more__btn btn btn-grey mt-4">Load more followers <i class="fas fa-angle-down ml-1"></i></a></div>',
        count: 5
    });

    $('.user-list--donations').simpleLoadMore({
        item: '.user-list__item',
        btnHTML: '<div class="text-center w-100 show-mobile"><a href="#" class="load-more__btn btn btn-grey mt-30">View all donations</a></div>',
        count: 3,
        itemsToLoad: -1
    });

    $('.school-list.load-more').simpleLoadMore({
        item: '.school-list__item',
        btnHTML: '<div class="text-center w-100"><a href="#" class="load-more__btn btn btn-grey mt-4">See all schools</a></div>',
        count: 5
    });

    $('.comments-list.load-more').simpleLoadMore({
        item: '.comment',
        btnHTML: '<div class="text-center w-100"><a href="#" class="load-more__btn btn btn-grey mt-4">Show all comments</a></div>',
        itemsToLoad: -1
    });

    $('[data-fancybox="photos-gallery"]').fancybox({
        thumbs: { autoStart: true },
        buttons: [ "zoom", "close" ]
    });

    // Make Avatar Image Background
    $('.user-cover__image-cont').convertToBackground({
        height: 190,
        width: 190,
        responsive: true
    });

    // Make Avatar Image Background
    $('.comment__author-photo-cont').convertToBackground({
        height: 60,
        width: 60
    });

    // Make Avatar Image Background
    $('.user-photos__item > a').convertToBackground({
        height: 170,
        width: 170,
        responsive: true
    });
    
    // Replace file name on change:
    $('.custom-file-input').on('change', function (e) {
        var fileName = $(this).val().replace(/C:\\fakepath\\/i, '');
        if ( ! fileName ) {
          fileName = 'Add media';
        }
        $(this).next('.custom-file-label').addClass("selected").find('span').html(fileName);
    });
});

/**
 * Sticky Left Sidebar
 */
jQuery(document).ready(function($) {

    var $el = $('.sidebar__inner'),
        $elParent = $('.teacher-profile__content').parent(),
        offset = 0;

    offset = $('#wpadminbar').outerHeight() + 10
  
    $el.stick_in_parent({
        parent: $elParent,
        spacer: '.teacher-profile__content',
        inner_scrolling: false,
        offset_top: offset
    });
  
});
