jQuery(document).ready(function($){
    if ($(window).width() >= 768)
    {
        $(".toggle-search-filter-school-teachers i").addClass("fa-sort-up");
        $(".toggle-search-sorting i").addClass("fa-sort-up");
    }
    else
    {
        $(".toggle-search-filter-school-teachers i").addClass("fa-sort-down");
        $(".toggle-search-sorting i").addClass("fa-sort-down");
    }

    $(".popup-options ul li").click(function(){

        if ($(this).find("i").hasClass("fa-square")){
            $(this).find("i").removeClass("fa-square");
            $(this).find("i").addClass("fa-check-square");
        }else{
            $(this).find("i").removeClass("fa-check-square");
            $(this).find("i").addClass("fa-square");
        }

    });

    $(".cta-filter").click(function(){
        $(".cta-filter").removeClass("activated");
        $(this).addClass("activated");
    });

    $(".options-cta span").click(function(){
        $(".popup-options").hide();
        $(".cta-filter").removeClass("activated");
    });

    $(".ul-search-filter-school-teachers li a").click(function(){
        $(".ul-search-filter-school-teachers li a").removeClass("activated");
        $(this).addClass("activated");
    });

    $(".ul-search-sorting li a").click(function(){
        $(".ul-search-sorting li a").removeClass("activated");
        $(this).addClass("activated");
    });

    $(".cta-follow-tab").click(function(){

        $(".cta-follow-tab").removeClass("activated");
        $(this).addClass("activated");

    });

    $(".toggle-search-sorting").click(function(){        
        if ($(".toggle-search-sorting i").hasClass("fa-sort-up")){
            $(".toggle-search-sorting i").removeClass("fa-sort-up");
            $(".toggle-search-sorting i").addClass("fa-sort-down");
        }else{
            $(".toggle-search-sorting i").removeClass("fa-sort-down");
            $(".toggle-search-sorting i").addClass("fa-sort-up");
        }
        $(".ul-search-sorting").slideToggle();
    });

    $(".toggle-search-filter-school-teachers").click(function(){
        if ($(".toggle-search-filter-school-teachers i").hasClass("fa-sort-up")){
            $(".toggle-search-filter-school-teachers i").removeClass("fa-sort-up");
            $(".toggle-search-filter-school-teachers i").addClass("fa-sort-down");
        }else{
            $(".toggle-search-filter-school-teachers i").removeClass("fa-sort-down");
            $(".toggle-search-filter-school-teachers i").addClass("fa-sort-up");
        }
        $(".ul-search-filter-school-teachers").slideToggle();
    });    


    $(".span-followers").click(function(){
        $(this).addClass("activated");
        $(".span-following").removeClass("activated");
        $(".following-list").hide();
        $(".followers-list .following-list").show();
        $(".followers-list").fadeIn("slow");
    });

    $(".span-following").click(function(){
        $(this).addClass("activated");
        $(".span-followers").removeClass("activated");
        $(".followers-list").hide();
        $(".following-list").fadeIn("slow");
    });

    $(".span-users").click(function(){
        $(this).addClass("activated");
        $(".span-corporations").removeClass("activated");
        $(".corporations-list").hide();
        $(".users-list").fadeIn("slow");
    });

    $(".span-corporations").click(function(){
        $(this).addClass("activated");
        $(".span-users").removeClass("activated");
        $(".users-list").hide();
        $(".corporations-list").fadeIn("slow");
    });
    
    
    
    
    $(".span-my-story").click(function(){
        $(this).addClass("activated");
        $(".span-updates").removeClass("activated");
        $(".profile-header-updates").hide();
        $(".profile-header-my-story").fadeIn("slow");
    });
    
    $(".span-updates").click(function(){
        $(this).addClass("activated");
        $(".span-my-story").removeClass("activated");
        $(".profile-header-my-story").hide();
        $(".profile-header-updates").fadeIn("slow");
    });
    
    
    

    $(".cover-photo").click(function(){

        $(".span-cover-photo").removeClass("activated");
        $(this).find(".span-cover-photo").addClass("activated");

    });


    $(window).scroll(function(){
        
        /*if ($(document).scrollTop() < 80)
        {
            $('header').removeClass('header-scroll-on');
        }
        else
        {
            $('header').addClass('header-scroll-on');
        }*/


        /*if ($(document).scrollTop() > $(".account-settings-content").offset().top && $(document).scrollTop() < $("footer").offset().top - 450 && $(window).width() >= 768){
            $('.ul-account-settings').addClass('ul-account-settings-scroll-on');
            var left_position = $('.ul-account-settings-container').position().left;
            $('.ul-account-settings').css('left', left_position + 'px');
            $('.ul-account-settings').css('max-width', '220px');
        }else{
            $('.ul-account-settings').removeClass('ul-account-settings-scroll-on');
            $('.ul-account-settings').css('max-width', 'initial');
        }*/


    });
    
    $('#span-popular-schools').click(function(){
        $('#span-popular-schools').addClass('span-popular-selected');
        $('#span-popular-cities').removeClass('span-popular-selected');
        $('#popular-cities').hide();
        $('#popular-schools').fadeIn('slow');
    });
    
    $('#span-popular-cities').click(function(){
        $('#span-popular-cities').addClass('span-popular-selected');
        $('#span-popular-schools').removeClass('span-popular-selected');
        $('#popular-schools').hide();
        $('#popular-cities').fadeIn('slow');
    });
    
    $('.menu-toggle').click(function(){
        $('.header-menus').slideToggle();
    });
    
    $(document).ready(function(){
        $('.funding-progress').each(function (i, obj)
        {
            var funding_goal = parseInt($(this).attr('data-funding-goal'));
            var funding_value = parseInt($(this).attr('data-funding-value'));
            
            if (funding_goal != 0 && funding_value != 0)
            {
                var progress = (funding_value / funding_goal) * 100;
                progress = parseInt(progress);
                
                if (progress >= 100)
                {
                    progress = 100;
                }
                
                $(this).css('width', progress + '%');
            }
        });
    });
    
    $(window).resize(function(){
        if ($(window).width() >= 768)
        {
            $('.header-menus').show();
        }
    });

    $(".form-notice .span-icon").click(function(){
        $(".form-notice").fadeOut("slow");
    });

    $(".cta-choose").click(function(){
        $(".cta-choose").removeClass("cta-activated");
        $(this).addClass("cta-activated");
    });

    $('.testimonial .testimonial__text').matchHeight({ property: 'min-height' });
    $('.mass-donation-box__img').matchHeight({ property: 'min-height' });
    
    // Select all previous rating stars on hover.
    $('.rating label').hover(function() {
        $(this).nextAll().removeClass('temp-selected');
        $(this).prevAll().addClass('temp-selected');
    }, function() {
        $(this).siblings().removeClass('temp-selected');
    });
});



function initAutocomplete() {
        
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 41.850033, lng: -87.6500523},
        zoom: 3,
        mapTypeId: 'roadmap'
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            }));

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
        });
          
        map.fitBounds(bounds);
    });
    
}

/**
 * Various JS Code
 */
jQuery(document).ready(function($) {

    // MatchHeight
    $('.teacher-dashboard-card').matchHeight({ property: 'min-height' });
    $('.promote-connect__box').matchHeight({ property: 'min-height' });
    
    // Make Avatar Image Background
    $('.menu-user-image, .ssh-featured-image').convertToBackground();
    
    // Make Avatar Image Background
    $('.school-single-container .user-bar__image-cont, .users-corporations-image__cont').convertToBackground({
        height: 50,
        width: 50
    });

    // Make Avatar Image Background
    $('[data-convert-to-background]').convertToBackground({
        height: 22,
        width: 22
    });

    // Make Avatar Image Background
    $('.reply-box__avatar, .comment-author-photo').convertToBackground({
        height: 40,
        width: 40
    });

    // Make Avatar Image Background
    $('.reply-box__avatar, .comment-author-photo').convertToBackground({
        height: 40,
        width: 40
    });

    // Make Avatar Image Background
    $('.home-funded-teacher-image').convertToBackground({
        width: 260,
        height: 143,
        responsive: true
    });

    // Copy to clipboard.
    $('[data-copy-to-clipboard]').each(function(i, el) {
        var $this = $(this);

        $this.on('click', function(e) {
            e.preventDefault();
            var cpText = $this.data('clipboard-text');
            var origText = $this.data('clipboard-text');

            copyToClipboard( cpText );
        });
    });

    // Open Bootstrap modal on Page Load
    if ( window.location.hash && window.location.href.indexOf('?redesign') === -1 ) {
        jQuery(window.location.hash + '.modal').modal('show');
    }

    // Report Form on Teacher Page
    $(document).on('submit', '.report-form', function(e) {
        var $this = $(this),
            $reportMessage = $this.find('#reportMessage'),
            errors = false;

        if ( $reportMessage.val() == '' ) {
            errors = true;
            
            $reportMessage.addClass('is-invalid');
            
            if ( ! $reportMessage.next('.form-error ').length ) {
                $reportMessage.after('<p class="form-error text-danger">Please enter your comment.</p>');
            }
        } else {
            $reportMessage.removeClass('is-invalid');
            $reportMessage.next('.form-error').remove();
        }
        
        if ( errors ) {
            return false;
        } else {
            $this.find('.form-loader-img').fadeIn();
        }
    });

    // Scroll down the page on load
    if ( window.location.hash.indexOf('#comment-') > -1 )
    {
        $('html, body').animate({
            scrollTop: $(window.location.hash).offset().top
        });
    }
});

/**
 * Form Validation
 */
jQuery(document).ready(function($) {

    // Invite Teacher/Friend Form on Teacher Page
    $(document).on('submit', '.invite-teacher-friend-modal form', function(e) {
        var $form = $(this),
            errors = false,
            inviteType = 'friend';

        $form.find('input[type="text"]').each(function(e) {
            errors = validateTextField( $(this), errors );
        });

        $form.find('input[type="email"]').each(function(e) {
            errors = validateEmailField( $(this), errors );
        });

        if ( $form.closest('#inviteTeacherModal') )
        {
            inviteType = 'teacher';
        }
        
        if ( ! errors ) {
            var data = 'action=tf_ajax_handler&handler=send_invite_teacher_email&ajax_nonce=' + tf_ajax.ajax_nonce + '&' + $form.serialize();
            var $formNotice = $('<div class="form-notice mb-3"><p class="clearfix p-0"><span class="span-message"><i class="fas fa-info-circle"></i> <span class="overwritable"></span></span><span class="span-icon"><i class="fas fa-times"></i></span></p></div>');

            $.ajax({
                url: tf_ajax.ajax_url,
                type: 'POST',
                // data: $form.serialize(),
                data: data,
                
                // Before Sending
                beforeSend: function() {
                    $form.find('.form-loader-img').fadeIn();
                },
                
                // On Success
                success: function( res ) {
                    var data = res.data;

                    $formNotice.find('.overwritable').text(res.data.msg);
                    $form.prepend($formNotice);
                    if ( ! res.success ) {
                        $formNotice.addClass('error');
                    }
                    $('.modal.show .modal-content').animate({ scrollTop: 0 });
                    $form.find('input[type=text], input[type=email], textarea').val('');
                },

                // On Error
                error: function( error ) {
                    $formNotice.find('.overwritable').text(res.data.msg);
                    $form.prepend($formNotice);
                }
            }).always(function() {
                $form.find('.form-loader-img').fadeOut();
            });
        }
        return false;
    });
    
    /**
     * Validate Email Address
     * @param {string} email email to be validated
     */
    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    /**
     * Validate Text Field
     * @param {object} $field input field to be valided and applied changes on.
     */
    function validateEmailField( $field, errors ) {
        var val = $field.val(),
            validEmail = validateEmail( $field.val() ),
            errorMsg = 'This field is required.';

        if ( ! validEmail && val != '' ) errorMsg = 'Please enter a valid email address';

        if ( val == '' || ! validEmail ) {

            $field.addClass('is-invalid');

            if ( ! $field.next('.form-error ').length ) {
                $field.after('<p class="form-error text-danger">' + errorMsg + '</p>');
            }

            return true;
        } else {
            $field.removeClass('is-invalid');
            $field.next('.form-error').remove();
        }

        return errors;
    }

    /**
     * Validate Text Field
     * @param {object} $field input field to be valided and applied changes on.
     */
    function validateTextField( $field, errors ) {
        if ( $field.val() == '' ) {

            $field.addClass('is-invalid');

            if ( ! $field.next('.form-error ').length ) {
                $field.after('<p class="form-error text-danger">This field is required.</p>');
            }

            errors = true;
        } else {
            $field.removeClass('is-invalid');
            $field.next('.form-error').remove();
        }

        return errors;
    }
});

/**
 * Teacher GalleryPopup
 */
jQuery(document).ready(function($) {
    var $teacherGallery = $('#teacherPhotosGallery'),
        $body = $('body');
    
    // $teacherGallery.on('slide.bs.carousel', function (e) {
    //     var $this = $(this),
    //         nextH = $(e.relatedTarget).height();

    //     if ($body.hasClass('modal-open')) {
    //         $this.find('div.active').parent().animate({ height: nextH }, 500);
    //     } else {
    //         setTimeout(function() {
    //             $this.find('div.active').parent().animate({ height: nextH }, 500);
    //         }, 2000);
    //     }
    // });
    
    $('.profile-photo-entry img, .profile-header-overlay, .profile-header-photo img, .profile-header-photo-image').on('click', function() {
        var targetId = $(this).data('target-id'),
            targetIndex = $('[data-id="' + targetId + '"]').index();

        if ( targetIndex ) {
            $teacherGallery.carousel( targetIndex );
        } else {
            $teacherGallery.carousel( 0 );
        }
    });
});

/**
 * Donate Share Buttons÷
 */
jQuery(document).ready(function($) {
    $('.share-donation__btn--fb, .promote-connect__btn--fb').click(function(e) {
        e.preventDefault();
        $this = $(this);
        postToFeed( $this.attr('href') );
        return false;
    });

    function postToFeed(url) {
      /* You said you wanted it to be redirect_uri, so you put 
       * the url parameter there
       */
       var obj = {
        method: 'feed',
        link: url, 
        picture: '',
        name: 'I just helped fund a teacher on TeacherFunder.com',
        description: 'I just helped fund a teacher on TeacherFunder.com ' + url
      };

      function callback(response) {
        // document.getElementById('msg').innerHTML = "Post ID: " + response['post_id'];
      }

      FB.ui(obj, callback);
    }
});

/**
 * Users List
 */
jQuery(document).ready(function($) {
    $('.users-list__view-more').on('click', function(e) {
        e.preventDefault();
        var $this = $(this),
            $elements = $this.closest('.users-list').find('.users-corporations-row').filter(':hidden').slice(0, 5);

        // Show the selected elements.
        if ( $elements.length > 0 ) {
            $elements.fadeIn();
        }

        // Hide the 'View More' button 
        // if the elements lenght is less than 5.
        if ( $elements.length < 5 ) {
            $this.remove();
        }
    });
});

/**
 * Mobile Nav Collapsable
 */
jQuery(document).ready(function($) {

    var $nav = $('.menu-ul-right'),
        $hasSubNav = $('.menu-ul-right > li.has-sub-nav'),
        $subNavItems = $('.menu-ul-right .mobile-sub-nav');

    $subNavItems.hide();
    
    $hasSubNav.each(function(i, el) {
        var $thisItem = $(this),
            $arrow = $('<button class="sub-nav-trigger"><i class="fas fa-chevron-up" style="display: none;"></i></i><i class="fas fa-chevron-down"></i></i></button>');

        $arrow.insertBefore( $thisItem.find('.mobile-sub-nav') );
    });
  
    $('body').on('click', '.sub-nav-trigger', function(e) {
        e.preventDefault();
        var $this = $(this),
            $thisNavItem = $this.closest('.has-sub-nav');
            
        $thisNavItem.toggleClass('active');
        $thisNavItem.find('.fa-chevron-up, .fa-chevron-down').toggle();
        $thisNavItem.find('.mobile-sub-nav').slideToggle();
    });
});

/**
 * Followers List
 */
jQuery(document).ready(function($) {
    $('.followers-list').find('.following-list').hide();
    $('.followers-list').find('.following-list').slice(0, 5).show();

    $('.following-followers__view-more').on('click', function(e) {
        e.preventDefault();
        var $this = $(this),
            $elements = $this.closest('.following-followers').find('.following-list').filter(':hidden').slice(0, 5);

        // Show the selected elements.
        if ( $elements.length > 0 ) {
            $elements.fadeIn();
        }

        // Hide the 'View More' button 
        // if the elements lenght is less than 5.
        if ( $elements.length < 5 ) {
            $this.remove();
        }
    });
});

/**
 * View More Functionality
 */
jQuery(document).ready(function($) {
    $('.view-more').simpleLoadMore({
        item: '.past-updates',
        btnHTML: '<div class="load-more-container text-center"><a href="#" class="load-more__btn see-more">See more updates <i class="fas fa-angle-down"></i></a></div>'
    });
    
    $('.dashboard-donations').simpleLoadMore({
        item: '.recent-donation',
        btnHTML: '<div class="load-more-container text-center mt-4"><a href="#" class="load-more__btn see-more">See more donations <i class="fas fa-angle-down"></i></a></div>'
    });
    
    $('.recent-contributions').simpleLoadMore({
        item: '.recent-donation',
        btnHTML: '<div class="load-more-container text-center mt-4"><a href="#" class="load-more__btn see-more">See more donations <i class="fas fa-angle-down"></i></a></div>'
    });
    
    $('.dashboard-contacts__items .tab-pane').simpleLoadMore({
        item: '.recent-donation',
        count: 10, 
        btnHTML: '<div class="load-more-container text-center mt-4"><a href="#" class="load-more__btn see-more">See more contacts <i class="fas fa-angle-down"></i></a></div>'
    });
    
    $('.updates-from-following').simpleLoadMore({
        item: '.comment-preview',
        btnHTML: '<div class="load-more-container text-center mt-4"><a href="#" class="load-more__btn see-more">See more donations <i class="fas fa-angle-down"></i></a></div>'
    });
    
    $('#comments').simpleLoadMore({
        item: '> .comment',
        btnHTML: '<a href="#" class="load-more__btn see-more">Show all comments</a>'
    });
    
    $('.tabs-content--style-1 .user-bars').simpleLoadMore({
        item: '.user-bar',
        btnHTML: '<div class="text-center"><a href="#" class="following-followers__view-more cta-secondary">View More <i class="fas fa-angle-down"></i></a></div>'
    });
});

/**
 * Copy Text to Clipboard
 * @param {string} str 
 */
function copyToClipboard( str ) {
    const el = document.createElement('textarea');  // Create a <textarea> element
    el.value = str;                                 // Set its value to the string that you want copied
    el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
    el.style.position = 'absolute';                 
    el.style.left = '-9999px';                      // Move outside the screen to make it invisible
    document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
    const selected =            
        document.getSelection().rangeCount > 0        // Check if there is any content selected previously
        ? document.getSelection().getRangeAt(0)     // Store selection if found
        : false;                                    // Mark as false to know no selection existed before
    el.select();                                    // Select the <textarea> content
    document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(el);                  // Remove the <textarea> element
    if (selected) {                                 // If a selection existed before copying
        document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
        document.getSelection().addRange(selected);   // Restore the original selection
    }
}

/**
 * Fix Footer to the Bottom of The Page
 * 
 * This script makes sure the footer always remain to the bottom
 * of the page. It works by adding a min-height property to the
 * content of the page. 
 */
jQuery(document).ready(function($) {
    var $main       = $('.site-content, .site-content > .not-found'),
        $header     = $('.main-menu'),
        $footer     = $('.site-footer'),
        $win        = $(window),
        $wpadminbar = $('#wpadminbar'),
        height;

    // Initialize the function. 
    // You can also run this on .resize() or any other event.
    increaseFooterHeight();
    
    $win.resize(function() {
        increaseFooterHeight();
    });
        
    /**
     * Increase Footer Height
     */
    function increaseFooterHeight() {
        var headerH     = $header.outerHeight(),
            footerH     = $footer.outerHeight(),
            winH        = $win.outerHeight(),
            wpadminbarH = $wpadminbar.outerHeight();

        // Calculate height. Remove as needed. Or set custom value.
        height = winH - headerH - wpadminbarH - footerH;
            
        // Apply the height to the $main.
        $main.css( 'min-height', height );
    }
});

/**
 * Simple Load More
 *
 * Version: 0.2
 * Author: Zeshan Ahmed
 * Website: https://zeshanahmed.com/
 * Github: https://github.com/zeshanshani/simple-load-more/
 */
!function(d){d.fn.simpleLoadMore=function(n){var l=d.extend({count:5,btnHTML:"",item:""},n);d(this).each(function(n,e){var t=d(this),o=t.find(l.item),a=l.btnHTML?l.btnHTML:'<a href="#" class="load-more__btn">View More <i class="fas fa-angle-down"></i></a>',i=d(a);t.addClass("load-more"),o.addClass("load-more__item"),!t.find(".load-more__btn").length&&o.length>l.count&&t.append(i),$btn=t.find(".load-more__btn"),$btn.length||($btn=i),o.length>l.count&&o.slice(l.count).hide(),$btn.on("click",function(n){n.preventDefault();var e=d(this),t=o.filter(":hidden").slice(0,l.count);0<t.length&&t.fadeIn(),t.length<l.count&&e.remove()})})}}(jQuery);

/*
* jquery-match-height 0.7.2 by @liabru
* http://brm.io/jquery-match-height/
* License MIT
*/
!function(t){"use strict";"function"==typeof define&&define.amd?define(["jquery"],t):"undefined"!=typeof module&&module.exports?module.exports=t(require("jquery")):t(jQuery)}(function(t){var e=-1,o=-1,n=function(t){return parseFloat(t)||0},a=function(e){var o=1,a=t(e),i=null,r=[];return a.each(function(){var e=t(this),a=e.offset().top-n(e.css("margin-top")),s=r.length>0?r[r.length-1]:null;null===s?r.push(e):Math.floor(Math.abs(i-a))<=o?r[r.length-1]=s.add(e):r.push(e),i=a}),r},i=function(e){var o={
byRow:!0,property:"height",target:null,remove:!1};return"object"==typeof e?t.extend(o,e):("boolean"==typeof e?o.byRow=e:"remove"===e&&(o.remove=!0),o)},r=t.fn.matchHeight=function(e){var o=i(e);if(o.remove){var n=this;return this.css(o.property,""),t.each(r._groups,function(t,e){e.elements=e.elements.not(n)}),this}return this.length<=1&&!o.target?this:(r._groups.push({elements:this,options:o}),r._apply(this,o),this)};r.version="0.7.2",r._groups=[],r._throttle=80,r._maintainScroll=!1,r._beforeUpdate=null,
r._afterUpdate=null,r._rows=a,r._parse=n,r._parseOptions=i,r._apply=function(e,o){var s=i(o),h=t(e),l=[h],c=t(window).scrollTop(),p=t("html").outerHeight(!0),u=h.parents().filter(":hidden");return u.each(function(){var e=t(this);e.data("style-cache",e.attr("style"))}),u.css("display","block"),s.byRow&&!s.target&&(h.each(function(){var e=t(this),o=e.css("display");"inline-block"!==o&&"flex"!==o&&"inline-flex"!==o&&(o="block"),e.data("style-cache",e.attr("style")),e.css({display:o,"padding-top":"0",
"padding-bottom":"0","margin-top":"0","margin-bottom":"0","border-top-width":"0","border-bottom-width":"0",height:"100px",overflow:"hidden"})}),l=a(h),h.each(function(){var e=t(this);e.attr("style",e.data("style-cache")||"")})),t.each(l,function(e,o){var a=t(o),i=0;if(s.target)i=s.target.outerHeight(!1);else{if(s.byRow&&a.length<=1)return void a.css(s.property,"");a.each(function(){var e=t(this),o=e.attr("style"),n=e.css("display");"inline-block"!==n&&"flex"!==n&&"inline-flex"!==n&&(n="block");var a={
display:n};a[s.property]="",e.css(a),e.outerHeight(!1)>i&&(i=e.outerHeight(!1)),o?e.attr("style",o):e.css("display","")})}a.each(function(){var e=t(this),o=0;s.target&&e.is(s.target)||("border-box"!==e.css("box-sizing")&&(o+=n(e.css("border-top-width"))+n(e.css("border-bottom-width")),o+=n(e.css("padding-top"))+n(e.css("padding-bottom"))),e.css(s.property,i-o+"px"))})}),u.each(function(){var e=t(this);e.attr("style",e.data("style-cache")||null)}),r._maintainScroll&&t(window).scrollTop(c/p*t("html").outerHeight(!0)),
this},r._applyDataApi=function(){var e={};t("[data-match-height], [data-mh]").each(function(){var o=t(this),n=o.attr("data-mh")||o.attr("data-match-height");n in e?e[n]=e[n].add(o):e[n]=o}),t.each(e,function(){this.matchHeight(!0)})};var s=function(e){r._beforeUpdate&&r._beforeUpdate(e,r._groups),t.each(r._groups,function(){r._apply(this.elements,this.options)}),r._afterUpdate&&r._afterUpdate(e,r._groups)};r._update=function(n,a){if(a&&"resize"===a.type){var i=t(window).width();if(i===e)return;e=i;
}n?o===-1&&(o=setTimeout(function(){s(a),o=-1},r._throttle)):s(a)},t(r._applyDataApi);var h=t.fn.on?"on":"bind";t(window)[h]("load",function(t){r._update(!1,t)}),t(window)[h]("resize orientationchange",function(t){r._update(!0,t)})});

/**
 * Text Read More
 */
jQuery(document).ready(function($) {
  
    $('.my-story__content').textReadMore({
        height: 166,
        btnHTML: '<a href="#" class="text-more__btn btn btn-grey">Read more</a>'
    });
    
});

/**
 * Text Read More
 *
 * Version: 1.0.0
 * Author: Zeshan Ahmed
 * Website: https://zeshanahmed.com/
 * Github: https://github.com/zeshanshani/text-read-more/
 */
(function($) {
  $.fn.textReadMore = function( options ) {
    // Settings.
    var settings = $.extend({
      height: 200,
      btnHTML: ''
    }, options);

    // Variables
    var $els = $(this);

    // Run through all the elements.
    $els.each(function(i, el) {

      // Variables.
      var $thisEl  = $(this);
      var btnHTML  = settings.btnHTML ? settings.btnHTML : '<a href="#" class="text-more__btn">Read more</a>';
      var $btn = $(btnHTML);

      $btn.addClass('text-more__btn');

      // Add classes
      $thisEl.addClass('text-more');
      $thisEl.wrapInner('<div class="text-more__inner"></div>');

      var $thisElInner = $thisEl.find('.text-more__inner');

      // Add button.
      if ( ! $thisEl.find( '.text-more__btn' ).length && $thisEl.outerHeight() > settings.height ) {
        $thisEl.append( $btn );

        // Hide.
        showLess();
      }

      $btn = $thisEl.find( '.text-more__btn' );

      // Check if button is not present. If not, then attach $btn to the $btn variable.
      if ( ! $btn.length ) {
        $btn = $btn;
      }

      // Add click event on button.
      $btn.on('click', function(e) {
        e.preventDefault();
        var $this = $(this);

        if ( $thisEl.hasClass('text-more--less') ) {
          showMore();
        } else {
          showLess();
        }
      });

      function showLess() {
        // Add CSS to limit text.
        $thisElInner.css({
          height: settings.height,
          overflow: 'hidden'
        });
        $thisEl.addClass('text-more--less').removeClass('text-more--more');
        $btn.text('Read more');
      }

      function showMore() {
        // Add CSS to limit text.
        $thisElInner.css({
          height: '',
          overflow: ''
        });
        $thisEl.addClass('text-more--more').removeClass('text-more--less');
        $btn.text('Read less');
      }
    });
  }
}( jQuery ));

/**
 * Mass Donate JS
 */
jQuery(document).ready(function($) {
    var $form              = $('.md-form'),
        $preAmount         = $('.md-form__amount input[name="amount_per_teacher"]'),
        $otherAmount       = $('#amount-per-teacher-custom'),
        $productTotal      = $('.md-form__product-total'),
        $donateType        = $form.find('input[name="donate_type"]'),
        $productTotalField = $('#product_total'),
        $teachersField     = $('#total-teachers'),
        $miles             = $('.md-form__range-miles'),
        $teachersFound     = $('.md-form__teachers-found'),
        $teachersTotal     = $('.md-form__teachers-total'),
        $donateable        = $('.donateable-teachers'),
        $teachersIds       = $('input[name="teachers_ids"]'),
        $updateZip         = $('.md-update-zip'),
        $billingPostcode   = $('#billing_postcode_2'),
        $tip               = $('#add_gift_box'),
        $customTip         = $('#add_gift_box2'),
        // teachersCount   = null,
        isNationally       = false,
        isLocally          = false,
        totalAmount        = 0,
        $tip_percentage    = $('input[name=add_gift_box]'),
        $tip_other         = $('input[name=add_gift_box2]');

    if ($donateType.val() === 'locally') {
        isLocally = true;
    } else {
        isNationally = true;
    }

    // Declare a global window property 'teacherCount'.
    window.teachersCount = null;
    window.searchedTeachers = null;

    var markersArray = [];

    // Only run if 'isLocally' is true.
    if (isLocally) {
        /**
         * Locate teachers on page load.
         */
        findTeachersAddMarkers($("#search_range").val());
    }

    /**
     * On Form Submit
     */
    $form.on('submit', function(e) {
        if ($preAmount.val() === '') {
            return false;
        }
    });
    
    // Only run if 'isLocally' is true.
    if (isLocally) {
        /**
         * Initialize Range slider
         */
        $("#search_range").ionRangeSlider({
            min: 5,
            max: 100,
            from: 50,
            onChange: function(slider) {
                // console.log(slider.input.val());
                $miles.find('span').text(slider.input.val());
                if (massDonateCircle !== undefined) {
                    massDonateCircle.setRadius(slider.input.val() * 1609.344);
                }
            },
            onFinish: function(slider) {
                if (massDonateMap !== undefined) {
                    massDonateMap.fitBounds(massDonateCircle.getBounds());
                    
                    findTeachersAddMarkers(slider.input.val(), massDonateCircle.getCenter().lat(), massDonateCircle.getCenter().lng());
                    
                    // $.ajax({
                    //   type: 'GET',
                    //   url: '/ajax/teachers-in-area.php',
                    //   data: {
                    //     radius: slider.input.val(),
                    //     limit: 1000,
                    //     teachers_limit: $teachersField.val(),
                    //     lat: massDonateMapLatLng.lat,
                    //     lng: massDonateMapLatLng.lng
                    //   },
                    //   success: function(response) {
                    //     console.log(response);
                    //     clearOverlays();
                    //     for (let i = 0; i < response.length; i++) {
                    //         const teacher = response[i];
                            
                    //         var marker = new google.maps.Marker({
                    //           position: {
                    //               lat: parseFloat( teacher.latitude ),
                    //               lng: parseFloat( teacher.longitude )
                    //           },
                    //           map: massDonateMap,
                    //           title: 'Hello World!'
                    //         });

                    //         markersArray.push(marker);
                    //         google.maps.event.addListener(marker,"click",function(){});
                    //     }
                    //   }
                    // });
                    // var center = massDonateCircle.getCenter();

                    // massDonateMap.setCenter({
                    //     lat: center.lat(), 
                    //     lng: center.lng()
                    // });

                    // massDonateMap.fitBounds();
                }
            }
        });
    }

    /**
     * When Zip is updated.
     */
    $updateZip.click(function() {
        if ($billingPostcode.val()) {
            addCircleOnZipUpdate($billingPostcode.val());
        }
    });
    
    /**
     * On Zip change
     */
    // Allow 5 lenght only.
    $billingPostcode.attr('maxlength', 5);

    $billingPostcode.on('keydown', function(e) {
        if (e.keyCode === 13) {
            $updateZip.click();
            return false;
        }
    });
    
    // Allow digits only.
    $billingPostcode.inputFilter(function(value) {
      return /^\d*$/.test(value);
    });
    
    /**
     * On Pre-Defined Amount click
     */
    $preAmount.click(function() {
        var $this = $(this),
            thisVal = $this.val();

        if ( thisVal === 'other' ) {
            $('.md-form__custom-amount').show();
            $('#amount-per-teacher-custom').focus();
            updateTotalAmount( $otherAmount.val() );
        } else {
            $('.md-form__custom-amount').hide();
            updateTotalAmount( thisVal );
        }
    });

    /**
     * On $otherAmount focus out.
     */
    $otherAmount.on('blur', function() {
        var $this = $(this),
            thisVal = $this.val(),
            newVal = '';

        newVal = thisVal.replace(/\D/g, '');

        if (newVal && newVal < 5) {
            newVal = 5;
        }
        
        $this.val( newVal );
        updateTotalAmount( newVal );
    });

    /**
     * On teachers change
     */
    $teachersField.change(function() {
        calculateAmountFromOtherField();
        updateDonatableTeachers($(this).val());
    });

    /**
     * On tip change
     */
    $tip.on('change', function() {
        calculateAmountFromOtherField();
    });

    /**
     * On custom tip change
     */
    $customTip.on('blur', function() {
        calculateAmountFromOtherField();
    });

    /**
     * Calcualte Amount from Other Field
     */
    function calculateAmountFromOtherField() {
        var preAmountVal = $preAmount.filter(':checked').val(),
            otherAmountVal = $otherAmount.val();

        if ( preAmountVal !== 'other' && preAmountVal !== '' && preAmountVal !== undefined ) {
            updateTotalAmount( preAmountVal );
        } else if ( ! $otherAmount.is(':hidden') ) {
            if ( ! otherAmountVal || otherAmountVal < 5 ) {
                $otherAmount.val(5);
                updateTotalAmount(5);
            } else {
                updateTotalAmount( otherAmountVal );
            }
        }
    }

    /**
     * Add Circle on Zip Update
     * @param {string} zip 
     */
    function addCircleOnZipUpdate( zip ) {
        massDonateGeocoder.geocode( { 'address': zip }, function(results, status) {
            if (status == 'OK') {
                var radius = $("#search_range").val();
                var location = results[0].geometry.location;
                // console.log(results[0].geometry.location);
                
                addCircleToMap(massDonateMap, results[0].geometry.location, (radius ? radius : 50));
                findTeachersAddMarkers($("#search_range").val(), location.lat(), location.lng());
                $billingPostcode.next('.md-form__error').hide();
            } else {
                // alert('The entered Zip code is incorrect. Please enter correct Zip: ' + status);
                if ($billingPostcode.next('.md-form__error').length) {
                    $billingPostcode.next('.md-form__error').show();
                } else {
                    $('<p class="md-form__error md-form__info text-danger">Zip code is invalid.</p>').insertAfter($billingPostcode);
                }
            }
        });
    }

    /**
     * Calculate total amount
     * @param {string} amount
     */
    function calculateTotalAmount( amount ) {
        amount = parseInt(amount);
        
        var teachers = parseInt($teachersField.val()),
            tipValue = $tip.val(),
            customTipValue = parseInt($customTip.val()),
            tipAmount = 0,
            totalAmount = amount;

        if (parseInt(teachersCount) !== null && teachers > parseInt(teachersCount)) {
            teachers = parseInt(teachersCount);
        }
        
        totalAmount = totalAmount * teachers;

        // Check tip amount.
        if (tipValue === 'other' && ! isNaN(customTipValue)) {
            tipAmount = customTipValue;
        } else if (!isNaN(parseInt(tipValue)) && parseInt(tipValue) > 0) {
            tipAmount = ((totalAmount * parseInt(tipValue)) / 100);
        }

        // Add tip amount to the total
        totalAmount += parseInt(tipAmount);
        
        return totalAmount;
    }

    /**
     * Update total amount
     * @param {string} amount 
     */
    function updateTotalAmount( amount ) {
        var totalAmount = calculateTotalAmount( amount );
        $productTotal.find('span').text( totalAmount );
        $productTotalField.val( totalAmount );
    }
    
    /**
     * Clear All Overlays/Markers
     */
    function clearOverlays() {
        for ( var i = 0; i < markersArray.length; i++ ) {
            markersArray[i].setMap(null);
        }
        markersArray.length = 0;
    }

    /**
     * Add Markers on the Map for Found Teachers
     */
    function findTeachersAddMarkers(radius, lat = '', lng = '') {
        $.ajax({
            type: 'POST',
            url: tf_ajax.ajax_url,
            data: {
                action: 'tf_ajax_handler',
                handler: 'get_teachers_in_radius',
                ajax_nonce: tf_ajax.ajax_nonce,
                radius: radius,
                limit: 1000,
                latitude: lat,
                longitude: lng,
                // limit: $teachersField.val()
            },
            beforeSend: function() {
                $('.md-form').addClass('md-form--loading');
            },
            success: function(response) {
                // console.log(response);
                $('.md-form').removeClass('md-form--loading');
                clearOverlays();
                if (response.success && response.data) {
                    var dataLength = response.data.length;

                    // Show total number of teachers on page.
                    $teachersFound.find('strong').text(dataLength);
                    $teachersFound.show();
                    window.searchedTeachers = dataLength;
                    
                    // If the available teachers length is less than what user has selected,
                    // show a field below teachers dropdown.
                    if ($teachersField.val() > dataLength) {
                        $teachersTotal.find('strong').text(dataLength);
                        // teachersCount = dataLength;
                        window.teachersCount = dataLength;
                        $teachersTotal.show();
                    } else {
                        $teachersTotal.hide();
                        window.teachersCount = null;
                    }

                    updateDonatableTeachers($teachersField.val(), dataLength);
                    
                    $teachersFound.find('strong').text(dataLength);
                    $teachersFound.show();
                    
                    var teachersDonateToIds = [];
                    
                    for (var i = 0; i < dataLength; i++) {
                        var teacher = response.data[i];
                        var marker = new google.maps.Marker({
                            position: {
                                lat: parseFloat(teacher.latitude),
                                lng: parseFloat(teacher.longitude)
                            },
                            map: massDonateMap,
                            title: teacher.first_name + ' ' + teacher.last_name
                        });
                        markersArray.push(marker);
                        google.maps.event.addListener(marker, "click", function() {});
                        teachersDonateToIds.push(teacher.post_id);
                    }

                    $teachersIds.val(teachersDonateToIds);

                    // Update amount on radius change.
                    updateAmountOnRadiusChange();
                    
                    // for (const teachers in response.data) {
                    //     if (response.data.hasOwnProperty(teachers)) {
                    //         console.log(response.data[teachers]);
                            
                    //         const teachers = response.data[teachers].teachers;
    
                    //         for (let i = 0; i < teachers.length; i++) {
                    //             const teacher = teachers[i];
                    //             var marker = new google.maps.Marker({
                    //                 position: {
                    //                     lat: parseFloat(teacher.latitude),
                    //                     lng: parseFloat(teacher.longitude)
                    //                 },
                    //                 map: massDonateMap,
                    //                 title: 'Hello World!'
                    //             });
    
                    //             markersArray.push(marker);
                    //             google.maps.event.addListener(marker,"click",function(){});
                    //         }
                    //     }
                    // }
                }
            },
            error: function() {
                $('.md-form').removeClass('md-form--loading');
            },
            always: function() {
                $('.md-form').removeClass('md-form--loading');
            },
        });
    }

    /**
     * Update Amount on Radius Change
     */
    function updateAmountOnRadiusChange() {
        var $preAmountChecked = $preAmount.filter(':checked');

        if ($preAmountChecked.length) {
            if ($preAmountChecked.val() === 'other') {
                updateTotalAmount($otherAmount.val());
            } else {
                updateTotalAmount($preAmountChecked.val());
            }
        }
    }
    
    /**
     * Update Donateable Teachers
     * @param {number} selected 
     * @param {number} total 
     */
    function updateDonatableTeachers(val, total) {
        if (total === undefined) {
            total = window.searchedTeachers;
        }

        if (val === undefined || val === null) {
            val = $teachersField.val();
        }

        // If the available teachers length is less than what user has selected,
        // show a field below teachers dropdown.
        if (val > total && total !== null) {
            $donateable.text(total);
        } else {
            $donateable.text(val);
        }
    }
  
});

// Restricts input for each element in the set of matched elements to the given inputFilter.
(function($) {
  $.fn.inputFilter = function(inputFilter) {
    return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function() {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      }
    });
  };
}(jQuery));

/**
 * Convert To Background
 *
 * Version: 1.1.1
 * Author: Zeshan Ahmed
 * Website: https://zeshanahmed.com/
 * Github: https://github.com/zeshanshani/jquery-convert-to-background/
 */
!function(p){p.fn.convertToBackground=function(t){var g=p.extend({repeat:"no-repeat",position:"center center",size:"cover",attachment:"",fallbackSrc:"",width:"",height:"",responsive:!1},t);p(this).each(function(t,e){var i=p(this),a=i.find("img").eq(0),n=a.attr("src"),o=!0===g.responsive,c=g.width,r=c?"100%":"",d=g.height,h=p("<div></div>"),s="";o&&c&d&&(i.append(h),d=0,s=100*g.height/g.width+"%"),o&&i.find(h)?h.css({backgroundRepeat:g.repeat,backgroundPosition:g.position,backgroundSize:g.size,backgroundAttachment:g.attachment,backgroundImage:"url("+(n||g.fallbackSrc)+")",height:d,width:"100%",paddingBottom:s}):i.css({backgroundRepeat:g.repeat,backgroundPosition:g.position,backgroundSize:g.size,backgroundAttachment:g.attachment,backgroundImage:"url("+(n||g.fallbackSrc)+")",height:d,paddingBottom:s}),i.css({width:c,maxWidth:r}),a.css({position:"absolute",width:"1px",height:"1px",padding:"0",overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap",border:"0"})})}}(jQuery);

// Ion.RangeSlider, 2.3.0, © Denis Ineshin, 2010 - 2018, IonDen.com, Build date: 2018-12-12 00:00:37
!function(i){!jQuery&&"function"==typeof define&&define.amd?define(["jquery"],function(t){return i(t,document,window,navigator)}):jQuery||"object"!=typeof exports?i(jQuery,document,window,navigator):i(require("jquery"),document,window,navigator)}(function(a,c,l,t,_){"use strict";var i,s,o=0,e=(i=t.userAgent,s=/msie\s\d+/i,0<i.search(s)&&s.exec(i).toString().split(" ")[1]<9&&(a("html").addClass("lt-ie9"),!0));Function.prototype.bind||(Function.prototype.bind=function(o){var e=this,h=[].slice;if("function"!=typeof e)throw new TypeError;var r=h.call(arguments,1),n=function(){if(this instanceof n){var t=function(){};t.prototype=e.prototype;var i=new t,s=e.apply(i,r.concat(h.call(arguments)));return Object(s)===s?s:i}return e.apply(o,r.concat(h.call(arguments)))};return n}),Array.prototype.indexOf||(Array.prototype.indexOf=function(t,i){var s;if(null==this)throw new TypeError('"this" is null or not defined');var o=Object(this),e=o.length>>>0;if(0===e)return-1;var h=+i||0;if(Math.abs(h)===1/0&&(h=0),e<=h)return-1;for(s=Math.max(0<=h?h:e-Math.abs(h),0);s<e;){if(s in o&&o[s]===t)return s;s++}return-1});var h=function(t,i,s){this.VERSION="2.3.0",this.input=t,this.plugin_count=s,this.current_plugin=0,this.calc_count=0,this.update_tm=0,this.old_from=0,this.old_to=0,this.old_min_interval=null,this.raf_id=null,this.dragging=!1,this.force_redraw=!1,this.no_diapason=!1,this.has_tab_index=!0,this.is_key=!1,this.is_update=!1,this.is_start=!0,this.is_finish=!1,this.is_active=!1,this.is_resize=!1,this.is_click=!1,i=i||{},this.$cache={win:a(l),body:a(c.body),input:a(t),cont:null,rs:null,min:null,max:null,from:null,to:null,single:null,bar:null,line:null,s_single:null,s_from:null,s_to:null,shad_single:null,shad_from:null,shad_to:null,edge:null,grid:null,grid_labels:[]},this.coords={x_gap:0,x_pointer:0,w_rs:0,w_rs_old:0,w_handle:0,p_gap:0,p_gap_left:0,p_gap_right:0,p_step:0,p_pointer:0,p_handle:0,p_single_fake:0,p_single_real:0,p_from_fake:0,p_from_real:0,p_to_fake:0,p_to_real:0,p_bar_x:0,p_bar_w:0,grid_gap:0,big_num:0,big:[],big_w:[],big_p:[],big_x:[]},this.labels={w_min:0,w_max:0,w_from:0,w_to:0,w_single:0,p_min:0,p_max:0,p_from_fake:0,p_from_left:0,p_to_fake:0,p_to_left:0,p_single_fake:0,p_single_left:0};var o,e,h,r=this.$cache.input,n=r.prop("value");for(h in o={skin:"flat",type:"single",min:10,max:100,from:null,to:null,step:1,min_interval:0,max_interval:0,drag_interval:!1,values:[],p_values:[],from_fixed:!1,from_min:null,from_max:null,from_shadow:!1,to_fixed:!1,to_min:null,to_max:null,to_shadow:!1,prettify_enabled:!0,prettify_separator:" ",prettify:null,force_edges:!1,keyboard:!0,grid:!1,grid_margin:!0,grid_num:4,grid_snap:!1,hide_min_max:!1,hide_from_to:!1,prefix:"",postfix:"",max_postfix:"",decorate_both:!0,values_separator:" — ",input_values_separator:";",disable:!1,block:!1,extra_classes:"",scope:null,onStart:null,onChange:null,onFinish:null,onUpdate:null},"INPUT"!==r[0].nodeName&&console&&console.warn&&console.warn("Base element should be <input>!",r[0]),(e={skin:r.data("skin"),type:r.data("type"),min:r.data("min"),max:r.data("max"),from:r.data("from"),to:r.data("to"),step:r.data("step"),min_interval:r.data("minInterval"),max_interval:r.data("maxInterval"),drag_interval:r.data("dragInterval"),values:r.data("values"),from_fixed:r.data("fromFixed"),from_min:r.data("fromMin"),from_max:r.data("fromMax"),from_shadow:r.data("fromShadow"),to_fixed:r.data("toFixed"),to_min:r.data("toMin"),to_max:r.data("toMax"),to_shadow:r.data("toShadow"),prettify_enabled:r.data("prettifyEnabled"),prettify_separator:r.data("prettifySeparator"),force_edges:r.data("forceEdges"),keyboard:r.data("keyboard"),grid:r.data("grid"),grid_margin:r.data("gridMargin"),grid_num:r.data("gridNum"),grid_snap:r.data("gridSnap"),hide_min_max:r.data("hideMinMax"),hide_from_to:r.data("hideFromTo"),prefix:r.data("prefix"),postfix:r.data("postfix"),max_postfix:r.data("maxPostfix"),decorate_both:r.data("decorateBoth"),values_separator:r.data("valuesSeparator"),input_values_separator:r.data("inputValuesSeparator"),disable:r.data("disable"),block:r.data("block"),extra_classes:r.data("extraClasses")}).values=e.values&&e.values.split(","),e)e.hasOwnProperty(h)&&(e[h]!==_&&""!==e[h]||delete e[h]);n!==_&&""!==n&&((n=n.split(e.input_values_separator||i.input_values_separator||";"))[0]&&n[0]==+n[0]&&(n[0]=+n[0]),n[1]&&n[1]==+n[1]&&(n[1]=+n[1]),i&&i.values&&i.values.length?(o.from=n[0]&&i.values.indexOf(n[0]),o.to=n[1]&&i.values.indexOf(n[1])):(o.from=n[0]&&+n[0],o.to=n[1]&&+n[1])),a.extend(o,i),a.extend(o,e),this.options=o,this.update_check={},this.validate(),this.result={input:this.$cache.input,slider:null,min:this.options.min,max:this.options.max,from:this.options.from,from_percent:0,from_value:null,to:this.options.to,to_percent:0,to_value:null},this.init()};h.prototype={init:function(t){this.no_diapason=!1,this.coords.p_step=this.convertToPercent(this.options.step,!0),this.target="base",this.toggleInput(),this.append(),this.setMinMax(),t?(this.force_redraw=!0,this.calc(!0),this.callOnUpdate()):(this.force_redraw=!0,this.calc(!0),this.callOnStart()),this.updateScene()},append:function(){var t='<span class="irs irs--'+this.options.skin+" js-irs-"+this.plugin_count+" "+this.options.extra_classes+'"></span>';this.$cache.input.before(t),this.$cache.input.prop("readonly",!0),this.$cache.cont=this.$cache.input.prev(),this.result.slider=this.$cache.cont,this.$cache.cont.html('<span class="irs"><span class="irs-line" tabindex="0"></span><span class="irs-min">0</span><span class="irs-max">1</span><span class="irs-from">0</span><span class="irs-to">0</span><span class="irs-single">0</span></span><span class="irs-grid"></span>'),this.$cache.rs=this.$cache.cont.find(".irs"),this.$cache.min=this.$cache.cont.find(".irs-min"),this.$cache.max=this.$cache.cont.find(".irs-max"),this.$cache.from=this.$cache.cont.find(".irs-from"),this.$cache.to=this.$cache.cont.find(".irs-to"),this.$cache.single=this.$cache.cont.find(".irs-single"),this.$cache.line=this.$cache.cont.find(".irs-line"),this.$cache.grid=this.$cache.cont.find(".irs-grid"),"single"===this.options.type?(this.$cache.cont.append('<span class="irs-bar irs-bar--single"></span><span class="irs-shadow shadow-single"></span><span class="irs-handle single"><i></i><i></i><i></i></span>'),this.$cache.bar=this.$cache.cont.find(".irs-bar"),this.$cache.edge=this.$cache.cont.find(".irs-bar-edge"),this.$cache.s_single=this.$cache.cont.find(".single"),this.$cache.from[0].style.visibility="hidden",this.$cache.to[0].style.visibility="hidden",this.$cache.shad_single=this.$cache.cont.find(".shadow-single")):(this.$cache.cont.append('<span class="irs-bar"></span><span class="irs-shadow shadow-from"></span><span class="irs-shadow shadow-to"></span><span class="irs-handle from"><i></i><i></i><i></i></span><span class="irs-handle to"><i></i><i></i><i></i></span>'),this.$cache.bar=this.$cache.cont.find(".irs-bar"),this.$cache.s_from=this.$cache.cont.find(".from"),this.$cache.s_to=this.$cache.cont.find(".to"),this.$cache.shad_from=this.$cache.cont.find(".shadow-from"),this.$cache.shad_to=this.$cache.cont.find(".shadow-to"),this.setTopHandler()),this.options.hide_from_to&&(this.$cache.from[0].style.display="none",this.$cache.to[0].style.display="none",this.$cache.single[0].style.display="none"),this.appendGrid(),this.options.disable?(this.appendDisableMask(),this.$cache.input[0].disabled=!0):(this.$cache.input[0].disabled=!1,this.removeDisableMask(),this.bindEvents()),this.options.disable||(this.options.block?this.appendDisableMask():this.removeDisableMask()),this.options.drag_interval&&(this.$cache.bar[0].style.cursor="ew-resize")},setTopHandler:function(){var t=this.options.min,i=this.options.max,s=this.options.from,o=this.options.to;t<s&&o===i?this.$cache.s_from.addClass("type_last"):o<i&&this.$cache.s_to.addClass("type_last")},changeLevel:function(t){switch(t){case"single":this.coords.p_gap=this.toFixed(this.coords.p_pointer-this.coords.p_single_fake),this.$cache.s_single.addClass("state_hover");break;case"from":this.coords.p_gap=this.toFixed(this.coords.p_pointer-this.coords.p_from_fake),this.$cache.s_from.addClass("state_hover"),this.$cache.s_from.addClass("type_last"),this.$cache.s_to.removeClass("type_last");break;case"to":this.coords.p_gap=this.toFixed(this.coords.p_pointer-this.coords.p_to_fake),this.$cache.s_to.addClass("state_hover"),this.$cache.s_to.addClass("type_last"),this.$cache.s_from.removeClass("type_last");break;case"both":this.coords.p_gap_left=this.toFixed(this.coords.p_pointer-this.coords.p_from_fake),this.coords.p_gap_right=this.toFixed(this.coords.p_to_fake-this.coords.p_pointer),this.$cache.s_to.removeClass("type_last"),this.$cache.s_from.removeClass("type_last")}},appendDisableMask:function(){this.$cache.cont.append('<span class="irs-disable-mask"></span>'),this.$cache.cont.addClass("irs-disabled")},removeDisableMask:function(){this.$cache.cont.remove(".irs-disable-mask"),this.$cache.cont.removeClass("irs-disabled")},remove:function(){this.$cache.cont.remove(),this.$cache.cont=null,this.$cache.line.off("keydown.irs_"+this.plugin_count),this.$cache.body.off("touchmove.irs_"+this.plugin_count),this.$cache.body.off("mousemove.irs_"+this.plugin_count),this.$cache.win.off("touchend.irs_"+this.plugin_count),this.$cache.win.off("mouseup.irs_"+this.plugin_count),e&&(this.$cache.body.off("mouseup.irs_"+this.plugin_count),this.$cache.body.off("mouseleave.irs_"+this.plugin_count)),this.$cache.grid_labels=[],this.coords.big=[],this.coords.big_w=[],this.coords.big_p=[],this.coords.big_x=[],cancelAnimationFrame(this.raf_id)},bindEvents:function(){this.no_diapason||(this.$cache.body.on("touchmove.irs_"+this.plugin_count,this.pointerMove.bind(this)),this.$cache.body.on("mousemove.irs_"+this.plugin_count,this.pointerMove.bind(this)),this.$cache.win.on("touchend.irs_"+this.plugin_count,this.pointerUp.bind(this)),this.$cache.win.on("mouseup.irs_"+this.plugin_count,this.pointerUp.bind(this)),this.$cache.line.on("touchstart.irs_"+this.plugin_count,this.pointerClick.bind(this,"click")),this.$cache.line.on("mousedown.irs_"+this.plugin_count,this.pointerClick.bind(this,"click")),this.$cache.line.on("focus.irs_"+this.plugin_count,this.pointerFocus.bind(this)),this.options.drag_interval&&"double"===this.options.type?(this.$cache.bar.on("touchstart.irs_"+this.plugin_count,this.pointerDown.bind(this,"both")),this.$cache.bar.on("mousedown.irs_"+this.plugin_count,this.pointerDown.bind(this,"both"))):(this.$cache.bar.on("touchstart.irs_"+this.plugin_count,this.pointerClick.bind(this,"click")),this.$cache.bar.on("mousedown.irs_"+this.plugin_count,this.pointerClick.bind(this,"click"))),"single"===this.options.type?(this.$cache.single.on("touchstart.irs_"+this.plugin_count,this.pointerDown.bind(this,"single")),this.$cache.s_single.on("touchstart.irs_"+this.plugin_count,this.pointerDown.bind(this,"single")),this.$cache.shad_single.on("touchstart.irs_"+this.plugin_count,this.pointerClick.bind(this,"click")),this.$cache.single.on("mousedown.irs_"+this.plugin_count,this.pointerDown.bind(this,"single")),this.$cache.s_single.on("mousedown.irs_"+this.plugin_count,this.pointerDown.bind(this,"single")),this.$cache.edge.on("mousedown.irs_"+this.plugin_count,this.pointerClick.bind(this,"click")),this.$cache.shad_single.on("mousedown.irs_"+this.plugin_count,this.pointerClick.bind(this,"click"))):(this.$cache.single.on("touchstart.irs_"+this.plugin_count,this.pointerDown.bind(this,null)),this.$cache.single.on("mousedown.irs_"+this.plugin_count,this.pointerDown.bind(this,null)),this.$cache.from.on("touchstart.irs_"+this.plugin_count,this.pointerDown.bind(this,"from")),this.$cache.s_from.on("touchstart.irs_"+this.plugin_count,this.pointerDown.bind(this,"from")),this.$cache.to.on("touchstart.irs_"+this.plugin_count,this.pointerDown.bind(this,"to")),this.$cache.s_to.on("touchstart.irs_"+this.plugin_count,this.pointerDown.bind(this,"to")),this.$cache.shad_from.on("touchstart.irs_"+this.plugin_count,this.pointerClick.bind(this,"click")),this.$cache.shad_to.on("touchstart.irs_"+this.plugin_count,this.pointerClick.bind(this,"click")),this.$cache.from.on("mousedown.irs_"+this.plugin_count,this.pointerDown.bind(this,"from")),this.$cache.s_from.on("mousedown.irs_"+this.plugin_count,this.pointerDown.bind(this,"from")),this.$cache.to.on("mousedown.irs_"+this.plugin_count,this.pointerDown.bind(this,"to")),this.$cache.s_to.on("mousedown.irs_"+this.plugin_count,this.pointerDown.bind(this,"to")),this.$cache.shad_from.on("mousedown.irs_"+this.plugin_count,this.pointerClick.bind(this,"click")),this.$cache.shad_to.on("mousedown.irs_"+this.plugin_count,this.pointerClick.bind(this,"click"))),this.options.keyboard&&this.$cache.line.on("keydown.irs_"+this.plugin_count,this.key.bind(this,"keyboard")),e&&(this.$cache.body.on("mouseup.irs_"+this.plugin_count,this.pointerUp.bind(this)),this.$cache.body.on("mouseleave.irs_"+this.plugin_count,this.pointerUp.bind(this))))},pointerFocus:function(t){var i,s;this.target||(i=(s="single"===this.options.type?this.$cache.single:this.$cache.from).offset().left,i+=s.width()/2-1,this.pointerClick("single",{preventDefault:function(){},pageX:i}))},pointerMove:function(t){if(this.dragging){var i=t.pageX||t.originalEvent.touches&&t.originalEvent.touches[0].pageX;this.coords.x_pointer=i-this.coords.x_gap,this.calc()}},pointerUp:function(t){this.current_plugin===this.plugin_count&&this.is_active&&(this.is_active=!1,this.$cache.cont.find(".state_hover").removeClass("state_hover"),this.force_redraw=!0,e&&a("*").prop("unselectable",!1),this.updateScene(),this.restoreOriginalMinInterval(),(a.contains(this.$cache.cont[0],t.target)||this.dragging)&&this.callOnFinish(),this.dragging=!1)},pointerDown:function(t,i){i.preventDefault();var s=i.pageX||i.originalEvent.touches&&i.originalEvent.touches[0].pageX;2!==i.button&&("both"===t&&this.setTempMinInterval(),t||(t=this.target||"from"),this.current_plugin=this.plugin_count,this.target=t,this.is_active=!0,this.dragging=!0,this.coords.x_gap=this.$cache.rs.offset().left,this.coords.x_pointer=s-this.coords.x_gap,this.calcPointerPercent(),this.changeLevel(t),e&&a("*").prop("unselectable",!0),this.$cache.line.trigger("focus"),this.updateScene())},pointerClick:function(t,i){i.preventDefault();var s=i.pageX||i.originalEvent.touches&&i.originalEvent.touches[0].pageX;2!==i.button&&(this.current_plugin=this.plugin_count,this.target=t,this.is_click=!0,this.coords.x_gap=this.$cache.rs.offset().left,this.coords.x_pointer=+(s-this.coords.x_gap).toFixed(),this.force_redraw=!0,this.calc(),this.$cache.line.trigger("focus"))},key:function(t,i){if(!(this.current_plugin!==this.plugin_count||i.altKey||i.ctrlKey||i.shiftKey||i.metaKey)){switch(i.which){case 83:case 65:case 40:case 37:i.preventDefault(),this.moveByKey(!1);break;case 87:case 68:case 38:case 39:i.preventDefault(),this.moveByKey(!0)}return!0}},moveByKey:function(t){var i=this.coords.p_pointer,s=(this.options.max-this.options.min)/100;s=this.options.step/s,t?i+=s:i-=s,this.coords.x_pointer=this.toFixed(this.coords.w_rs/100*i),this.is_key=!0,this.calc()},setMinMax:function(){if(this.options){if(this.options.hide_min_max)return this.$cache.min[0].style.display="none",void(this.$cache.max[0].style.display="none");if(this.options.values.length)this.$cache.min.html(this.decorate(this.options.p_values[this.options.min])),this.$cache.max.html(this.decorate(this.options.p_values[this.options.max]));else{var t=this._prettify(this.options.min),i=this._prettify(this.options.max);this.result.min_pretty=t,this.result.max_pretty=i,this.$cache.min.html(this.decorate(t,this.options.min)),this.$cache.max.html(this.decorate(i,this.options.max))}this.labels.w_min=this.$cache.min.outerWidth(!1),this.labels.w_max=this.$cache.max.outerWidth(!1)}},setTempMinInterval:function(){var t=this.result.to-this.result.from;null===this.old_min_interval&&(this.old_min_interval=this.options.min_interval),this.options.min_interval=t},restoreOriginalMinInterval:function(){null!==this.old_min_interval&&(this.options.min_interval=this.old_min_interval,this.old_min_interval=null)},calc:function(t){if(this.options&&(this.calc_count++,(10===this.calc_count||t)&&(this.calc_count=0,this.coords.w_rs=this.$cache.rs.outerWidth(!1),this.calcHandlePercent()),this.coords.w_rs)){this.calcPointerPercent();var i=this.getHandleX();switch("both"===this.target&&(this.coords.p_gap=0,i=this.getHandleX()),"click"===this.target&&(this.coords.p_gap=this.coords.p_handle/2,i=this.getHandleX(),this.options.drag_interval?this.target="both_one":this.target=this.chooseHandle(i)),this.target){case"base":var s=(this.options.max-this.options.min)/100,o=(this.result.from-this.options.min)/s,e=(this.result.to-this.options.min)/s;this.coords.p_single_real=this.toFixed(o),this.coords.p_from_real=this.toFixed(o),this.coords.p_to_real=this.toFixed(e),this.coords.p_single_real=this.checkDiapason(this.coords.p_single_real,this.options.from_min,this.options.from_max),this.coords.p_from_real=this.checkDiapason(this.coords.p_from_real,this.options.from_min,this.options.from_max),this.coords.p_to_real=this.checkDiapason(this.coords.p_to_real,this.options.to_min,this.options.to_max),this.coords.p_single_fake=this.convertToFakePercent(this.coords.p_single_real),this.coords.p_from_fake=this.convertToFakePercent(this.coords.p_from_real),this.coords.p_to_fake=this.convertToFakePercent(this.coords.p_to_real),this.target=null;break;case"single":if(this.options.from_fixed)break;this.coords.p_single_real=this.convertToRealPercent(i),this.coords.p_single_real=this.calcWithStep(this.coords.p_single_real),this.coords.p_single_real=this.checkDiapason(this.coords.p_single_real,this.options.from_min,this.options.from_max),this.coords.p_single_fake=this.convertToFakePercent(this.coords.p_single_real);break;case"from":if(this.options.from_fixed)break;this.coords.p_from_real=this.convertToRealPercent(i),this.coords.p_from_real=this.calcWithStep(this.coords.p_from_real),this.coords.p_from_real>this.coords.p_to_real&&(this.coords.p_from_real=this.coords.p_to_real),this.coords.p_from_real=this.checkDiapason(this.coords.p_from_real,this.options.from_min,this.options.from_max),this.coords.p_from_real=this.checkMinInterval(this.coords.p_from_real,this.coords.p_to_real,"from"),this.coords.p_from_real=this.checkMaxInterval(this.coords.p_from_real,this.coords.p_to_real,"from"),this.coords.p_from_fake=this.convertToFakePercent(this.coords.p_from_real);break;case"to":if(this.options.to_fixed)break;this.coords.p_to_real=this.convertToRealPercent(i),this.coords.p_to_real=this.calcWithStep(this.coords.p_to_real),this.coords.p_to_real<this.coords.p_from_real&&(this.coords.p_to_real=this.coords.p_from_real),this.coords.p_to_real=this.checkDiapason(this.coords.p_to_real,this.options.to_min,this.options.to_max),this.coords.p_to_real=this.checkMinInterval(this.coords.p_to_real,this.coords.p_from_real,"to"),this.coords.p_to_real=this.checkMaxInterval(this.coords.p_to_real,this.coords.p_from_real,"to"),this.coords.p_to_fake=this.convertToFakePercent(this.coords.p_to_real);break;case"both":if(this.options.from_fixed||this.options.to_fixed)break;i=this.toFixed(i+.001*this.coords.p_handle),this.coords.p_from_real=this.convertToRealPercent(i)-this.coords.p_gap_left,this.coords.p_from_real=this.calcWithStep(this.coords.p_from_real),this.coords.p_from_real=this.checkDiapason(this.coords.p_from_real,this.options.from_min,this.options.from_max),this.coords.p_from_real=this.checkMinInterval(this.coords.p_from_real,this.coords.p_to_real,"from"),this.coords.p_from_fake=this.convertToFakePercent(this.coords.p_from_real),this.coords.p_to_real=this.convertToRealPercent(i)+this.coords.p_gap_right,this.coords.p_to_real=this.calcWithStep(this.coords.p_to_real),this.coords.p_to_real=this.checkDiapason(this.coords.p_to_real,this.options.to_min,this.options.to_max),this.coords.p_to_real=this.checkMinInterval(this.coords.p_to_real,this.coords.p_from_real,"to"),this.coords.p_to_fake=this.convertToFakePercent(this.coords.p_to_real);break;case"both_one":if(this.options.from_fixed||this.options.to_fixed)break;var h=this.convertToRealPercent(i),r=this.result.from_percent,n=this.result.to_percent-r,a=n/2,c=h-a,l=h+a;c<0&&(l=(c=0)+n),100<l&&(c=(l=100)-n),this.coords.p_from_real=this.calcWithStep(c),this.coords.p_from_real=this.checkDiapason(this.coords.p_from_real,this.options.from_min,this.options.from_max),this.coords.p_from_fake=this.convertToFakePercent(this.coords.p_from_real),this.coords.p_to_real=this.calcWithStep(l),this.coords.p_to_real=this.checkDiapason(this.coords.p_to_real,this.options.to_min,this.options.to_max),this.coords.p_to_fake=this.convertToFakePercent(this.coords.p_to_real)}"single"===this.options.type?(this.coords.p_bar_x=this.coords.p_handle/2,this.coords.p_bar_w=this.coords.p_single_fake,this.result.from_percent=this.coords.p_single_real,this.result.from=this.convertToValue(this.coords.p_single_real),this.result.from_pretty=this._prettify(this.result.from),this.options.values.length&&(this.result.from_value=this.options.values[this.result.from])):(this.coords.p_bar_x=this.toFixed(this.coords.p_from_fake+this.coords.p_handle/2),this.coords.p_bar_w=this.toFixed(this.coords.p_to_fake-this.coords.p_from_fake),this.result.from_percent=this.coords.p_from_real,this.result.from=this.convertToValue(this.coords.p_from_real),this.result.from_pretty=this._prettify(this.result.from),this.result.to_percent=this.coords.p_to_real,this.result.to=this.convertToValue(this.coords.p_to_real),this.result.to_pretty=this._prettify(this.result.to),this.options.values.length&&(this.result.from_value=this.options.values[this.result.from],this.result.to_value=this.options.values[this.result.to])),this.calcMinMax(),this.calcLabels()}},calcPointerPercent:function(){this.coords.w_rs?(this.coords.x_pointer<0||isNaN(this.coords.x_pointer)?this.coords.x_pointer=0:this.coords.x_pointer>this.coords.w_rs&&(this.coords.x_pointer=this.coords.w_rs),this.coords.p_pointer=this.toFixed(this.coords.x_pointer/this.coords.w_rs*100)):this.coords.p_pointer=0},convertToRealPercent:function(t){return t/(100-this.coords.p_handle)*100},convertToFakePercent:function(t){return t/100*(100-this.coords.p_handle)},getHandleX:function(){var t=100-this.coords.p_handle,i=this.toFixed(this.coords.p_pointer-this.coords.p_gap);return i<0?i=0:t<i&&(i=t),i},calcHandlePercent:function(){"single"===this.options.type?this.coords.w_handle=this.$cache.s_single.outerWidth(!1):this.coords.w_handle=this.$cache.s_from.outerWidth(!1),this.coords.p_handle=this.toFixed(this.coords.w_handle/this.coords.w_rs*100)},chooseHandle:function(t){return"single"===this.options.type?"single":this.coords.p_from_real+(this.coords.p_to_real-this.coords.p_from_real)/2<=t?this.options.to_fixed?"from":"to":this.options.from_fixed?"to":"from"},calcMinMax:function(){this.coords.w_rs&&(this.labels.p_min=this.labels.w_min/this.coords.w_rs*100,this.labels.p_max=this.labels.w_max/this.coords.w_rs*100)},calcLabels:function(){this.coords.w_rs&&!this.options.hide_from_to&&("single"===this.options.type?(this.labels.w_single=this.$cache.single.outerWidth(!1),this.labels.p_single_fake=this.labels.w_single/this.coords.w_rs*100,this.labels.p_single_left=this.coords.p_single_fake+this.coords.p_handle/2-this.labels.p_single_fake/2):(this.labels.w_from=this.$cache.from.outerWidth(!1),this.labels.p_from_fake=this.labels.w_from/this.coords.w_rs*100,this.labels.p_from_left=this.coords.p_from_fake+this.coords.p_handle/2-this.labels.p_from_fake/2,this.labels.p_from_left=this.toFixed(this.labels.p_from_left),this.labels.p_from_left=this.checkEdges(this.labels.p_from_left,this.labels.p_from_fake),this.labels.w_to=this.$cache.to.outerWidth(!1),this.labels.p_to_fake=this.labels.w_to/this.coords.w_rs*100,this.labels.p_to_left=this.coords.p_to_fake+this.coords.p_handle/2-this.labels.p_to_fake/2,this.labels.p_to_left=this.toFixed(this.labels.p_to_left),this.labels.p_to_left=this.checkEdges(this.labels.p_to_left,this.labels.p_to_fake),this.labels.w_single=this.$cache.single.outerWidth(!1),this.labels.p_single_fake=this.labels.w_single/this.coords.w_rs*100,this.labels.p_single_left=(this.labels.p_from_left+this.labels.p_to_left+this.labels.p_to_fake)/2-this.labels.p_single_fake/2,this.labels.p_single_left=this.toFixed(this.labels.p_single_left)),this.labels.p_single_left=this.checkEdges(this.labels.p_single_left,this.labels.p_single_fake))},updateScene:function(){this.raf_id&&(cancelAnimationFrame(this.raf_id),this.raf_id=null),clearTimeout(this.update_tm),this.update_tm=null,this.options&&(this.drawHandles(),this.is_active?this.raf_id=requestAnimationFrame(this.updateScene.bind(this)):this.update_tm=setTimeout(this.updateScene.bind(this),300))},drawHandles:function(){this.coords.w_rs=this.$cache.rs.outerWidth(!1),this.coords.w_rs&&(this.coords.w_rs!==this.coords.w_rs_old&&(this.target="base",this.is_resize=!0),(this.coords.w_rs!==this.coords.w_rs_old||this.force_redraw)&&(this.setMinMax(),this.calc(!0),this.drawLabels(),this.options.grid&&(this.calcGridMargin(),this.calcGridLabels()),this.force_redraw=!0,this.coords.w_rs_old=this.coords.w_rs,this.drawShadow()),this.coords.w_rs&&(this.dragging||this.force_redraw||this.is_key)&&((this.old_from!==this.result.from||this.old_to!==this.result.to||this.force_redraw||this.is_key)&&(this.drawLabels(),this.$cache.bar[0].style.left=this.coords.p_bar_x+"%",this.$cache.bar[0].style.width=this.coords.p_bar_w+"%","single"===this.options.type?(this.$cache.bar[0].style.left=0,this.$cache.bar[0].style.width=this.coords.p_bar_w+this.coords.p_bar_x+"%",this.$cache.s_single[0].style.left=this.coords.p_single_fake+"%"):(this.$cache.s_from[0].style.left=this.coords.p_from_fake+"%",this.$cache.s_to[0].style.left=this.coords.p_to_fake+"%",(this.old_from!==this.result.from||this.force_redraw)&&(this.$cache.from[0].style.left=this.labels.p_from_left+"%"),(this.old_to!==this.result.to||this.force_redraw)&&(this.$cache.to[0].style.left=this.labels.p_to_left+"%")),this.$cache.single[0].style.left=this.labels.p_single_left+"%",this.writeToInput(),this.old_from===this.result.from&&this.old_to===this.result.to||this.is_start||(this.$cache.input.trigger("change"),this.$cache.input.trigger("input")),this.old_from=this.result.from,this.old_to=this.result.to,this.is_resize||this.is_update||this.is_start||this.is_finish||this.callOnChange(),(this.is_key||this.is_click)&&(this.is_key=!1,this.is_click=!1,this.callOnFinish()),this.is_update=!1,this.is_resize=!1,this.is_finish=!1),this.is_start=!1,this.is_key=!1,this.is_click=!1,this.force_redraw=!1))},drawLabels:function(){if(this.options){var t,i,s,o,e,h=this.options.values.length,r=this.options.p_values;if(!this.options.hide_from_to)if("single"===this.options.type)t=h?this.decorate(r[this.result.from]):(o=this._prettify(this.result.from),this.decorate(o,this.result.from)),this.$cache.single.html(t),this.calcLabels(),this.labels.p_single_left<this.labels.p_min+1?this.$cache.min[0].style.visibility="hidden":this.$cache.min[0].style.visibility="visible",this.labels.p_single_left+this.labels.p_single_fake>100-this.labels.p_max-1?this.$cache.max[0].style.visibility="hidden":this.$cache.max[0].style.visibility="visible";else{s=h?(this.options.decorate_both?(t=this.decorate(r[this.result.from]),t+=this.options.values_separator,t+=this.decorate(r[this.result.to])):t=this.decorate(r[this.result.from]+this.options.values_separator+r[this.result.to]),i=this.decorate(r[this.result.from]),this.decorate(r[this.result.to])):(o=this._prettify(this.result.from),e=this._prettify(this.result.to),this.options.decorate_both?(t=this.decorate(o,this.result.from),t+=this.options.values_separator,t+=this.decorate(e,this.result.to)):t=this.decorate(o+this.options.values_separator+e,this.result.to),i=this.decorate(o,this.result.from),this.decorate(e,this.result.to)),this.$cache.single.html(t),this.$cache.from.html(i),this.$cache.to.html(s),this.calcLabels();var n=Math.min(this.labels.p_single_left,this.labels.p_from_left),a=this.labels.p_single_left+this.labels.p_single_fake,c=this.labels.p_to_left+this.labels.p_to_fake,l=Math.max(a,c);this.labels.p_from_left+this.labels.p_from_fake>=this.labels.p_to_left?(this.$cache.from[0].style.visibility="hidden",this.$cache.to[0].style.visibility="hidden",this.$cache.single[0].style.visibility="visible",l=this.result.from===this.result.to?("from"===this.target?this.$cache.from[0].style.visibility="visible":"to"===this.target?this.$cache.to[0].style.visibility="visible":this.target||(this.$cache.from[0].style.visibility="visible"),this.$cache.single[0].style.visibility="hidden",c):(this.$cache.from[0].style.visibility="hidden",this.$cache.to[0].style.visibility="hidden",this.$cache.single[0].style.visibility="visible",Math.max(a,c))):(this.$cache.from[0].style.visibility="visible",this.$cache.to[0].style.visibility="visible",this.$cache.single[0].style.visibility="hidden"),n<this.labels.p_min+1?this.$cache.min[0].style.visibility="hidden":this.$cache.min[0].style.visibility="visible",l>100-this.labels.p_max-1?this.$cache.max[0].style.visibility="hidden":this.$cache.max[0].style.visibility="visible"}}},drawShadow:function(){var t,i,s,o,e=this.options,h=this.$cache,r="number"==typeof e.from_min&&!isNaN(e.from_min),n="number"==typeof e.from_max&&!isNaN(e.from_max),a="number"==typeof e.to_min&&!isNaN(e.to_min),c="number"==typeof e.to_max&&!isNaN(e.to_max);"single"===e.type?e.from_shadow&&(r||n)?(t=this.convertToPercent(r?e.from_min:e.min),i=this.convertToPercent(n?e.from_max:e.max)-t,t=this.toFixed(t-this.coords.p_handle/100*t),i=this.toFixed(i-this.coords.p_handle/100*i),t+=this.coords.p_handle/2,h.shad_single[0].style.display="block",h.shad_single[0].style.left=t+"%",h.shad_single[0].style.width=i+"%"):h.shad_single[0].style.display="none":(e.from_shadow&&(r||n)?(t=this.convertToPercent(r?e.from_min:e.min),i=this.convertToPercent(n?e.from_max:e.max)-t,t=this.toFixed(t-this.coords.p_handle/100*t),i=this.toFixed(i-this.coords.p_handle/100*i),t+=this.coords.p_handle/2,h.shad_from[0].style.display="block",h.shad_from[0].style.left=t+"%",h.shad_from[0].style.width=i+"%"):h.shad_from[0].style.display="none",e.to_shadow&&(a||c)?(s=this.convertToPercent(a?e.to_min:e.min),o=this.convertToPercent(c?e.to_max:e.max)-s,s=this.toFixed(s-this.coords.p_handle/100*s),o=this.toFixed(o-this.coords.p_handle/100*o),s+=this.coords.p_handle/2,h.shad_to[0].style.display="block",h.shad_to[0].style.left=s+"%",h.shad_to[0].style.width=o+"%"):h.shad_to[0].style.display="none")},writeToInput:function(){"single"===this.options.type?(this.options.values.length?this.$cache.input.prop("value",this.result.from_value):this.$cache.input.prop("value",this.result.from),this.$cache.input.data("from",this.result.from)):(this.options.values.length?this.$cache.input.prop("value",this.result.from_value+this.options.input_values_separator+this.result.to_value):this.$cache.input.prop("value",this.result.from+this.options.input_values_separator+this.result.to),this.$cache.input.data("from",this.result.from),this.$cache.input.data("to",this.result.to))},callOnStart:function(){this.writeToInput(),this.options.onStart&&"function"==typeof this.options.onStart&&(this.options.scope?this.options.onStart.call(this.options.scope,this.result):this.options.onStart(this.result))},callOnChange:function(){this.writeToInput(),this.options.onChange&&"function"==typeof this.options.onChange&&(this.options.scope?this.options.onChange.call(this.options.scope,this.result):this.options.onChange(this.result))},callOnFinish:function(){this.writeToInput(),this.options.onFinish&&"function"==typeof this.options.onFinish&&(this.options.scope?this.options.onFinish.call(this.options.scope,this.result):this.options.onFinish(this.result))},callOnUpdate:function(){this.writeToInput(),this.options.onUpdate&&"function"==typeof this.options.onUpdate&&(this.options.scope?this.options.onUpdate.call(this.options.scope,this.result):this.options.onUpdate(this.result))},toggleInput:function(){this.$cache.input.toggleClass("irs-hidden-input"),this.has_tab_index?this.$cache.input.prop("tabindex",-1):this.$cache.input.removeProp("tabindex"),this.has_tab_index=!this.has_tab_index},convertToPercent:function(t,i){var s,o=this.options.max-this.options.min,e=o/100;return o?(s=(i?t:t-this.options.min)/e,this.toFixed(s)):(this.no_diapason=!0,0)},convertToValue:function(t){var i,s,o=this.options.min,e=this.options.max,h=o.toString().split(".")[1],r=e.toString().split(".")[1],n=0,a=0;if(0===t)return this.options.min;if(100===t)return this.options.max;h&&(n=i=h.length),r&&(n=s=r.length),i&&s&&(n=s<=i?i:s),o<0&&(o=+(o+(a=Math.abs(o))).toFixed(n),e=+(e+a).toFixed(n));var c,l=(e-o)/100*t+o,_=this.options.step.toString().split(".")[1];return l=_?+l.toFixed(_.length):(l/=this.options.step,+(l*=this.options.step).toFixed(0)),a&&(l-=a),(c=_?+l.toFixed(_.length):this.toFixed(l))<this.options.min?c=this.options.min:c>this.options.max&&(c=this.options.max),c},calcWithStep:function(t){var i=Math.round(t/this.coords.p_step)*this.coords.p_step;return 100<i&&(i=100),100===t&&(i=100),this.toFixed(i)},checkMinInterval:function(t,i,s){var o,e,h=this.options;return h.min_interval?(o=this.convertToValue(t),e=this.convertToValue(i),"from"===s?e-o<h.min_interval&&(o=e-h.min_interval):o-e<h.min_interval&&(o=e+h.min_interval),this.convertToPercent(o)):t},checkMaxInterval:function(t,i,s){var o,e,h=this.options;return h.max_interval?(o=this.convertToValue(t),e=this.convertToValue(i),"from"===s?e-o>h.max_interval&&(o=e-h.max_interval):o-e>h.max_interval&&(o=e+h.max_interval),this.convertToPercent(o)):t},checkDiapason:function(t,i,s){var o=this.convertToValue(t),e=this.options;return"number"!=typeof i&&(i=e.min),"number"!=typeof s&&(s=e.max),o<i&&(o=i),s<o&&(o=s),this.convertToPercent(o)},toFixed:function(t){return+(t=t.toFixed(20))},_prettify:function(t){return this.options.prettify_enabled?this.options.prettify&&"function"==typeof this.options.prettify?this.options.prettify(t):this.prettify(t):t},prettify:function(t){return t.toString().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g,"$1"+this.options.prettify_separator)},checkEdges:function(t,i){return this.options.force_edges&&(t<0?t=0:100-i<t&&(t=100-i)),this.toFixed(t)},validate:function(){var t,i,s=this.options,o=this.result,e=s.values,h=e.length;if("string"==typeof s.min&&(s.min=+s.min),"string"==typeof s.max&&(s.max=+s.max),"string"==typeof s.from&&(s.from=+s.from),"string"==typeof s.to&&(s.to=+s.to),"string"==typeof s.step&&(s.step=+s.step),"string"==typeof s.from_min&&(s.from_min=+s.from_min),"string"==typeof s.from_max&&(s.from_max=+s.from_max),"string"==typeof s.to_min&&(s.to_min=+s.to_min),"string"==typeof s.to_max&&(s.to_max=+s.to_max),"string"==typeof s.grid_num&&(s.grid_num=+s.grid_num),s.max<s.min&&(s.max=s.min),h)for(s.p_values=[],s.min=0,s.max=h-1,s.step=1,s.grid_num=s.max,s.grid_snap=!0,i=0;i<h;i++)t=+e[i],t=isNaN(t)?e[i]:(e[i]=t,this._prettify(t)),s.p_values.push(t);("number"!=typeof s.from||isNaN(s.from))&&(s.from=s.min),("number"!=typeof s.to||isNaN(s.to))&&(s.to=s.max),"single"===s.type?(s.from<s.min&&(s.from=s.min),s.from>s.max&&(s.from=s.max)):(s.from<s.min&&(s.from=s.min),s.from>s.max&&(s.from=s.max),s.to<s.min&&(s.to=s.min),s.to>s.max&&(s.to=s.max),this.update_check.from&&(this.update_check.from!==s.from&&s.from>s.to&&(s.from=s.to),this.update_check.to!==s.to&&s.to<s.from&&(s.to=s.from)),s.from>s.to&&(s.from=s.to),s.to<s.from&&(s.to=s.from)),("number"!=typeof s.step||isNaN(s.step)||!s.step||s.step<0)&&(s.step=1),"number"==typeof s.from_min&&s.from<s.from_min&&(s.from=s.from_min),"number"==typeof s.from_max&&s.from>s.from_max&&(s.from=s.from_max),"number"==typeof s.to_min&&s.to<s.to_min&&(s.to=s.to_min),"number"==typeof s.to_max&&s.from>s.to_max&&(s.to=s.to_max),o&&(o.min!==s.min&&(o.min=s.min),o.max!==s.max&&(o.max=s.max),(o.from<o.min||o.from>o.max)&&(o.from=s.from),(o.to<o.min||o.to>o.max)&&(o.to=s.to)),("number"!=typeof s.min_interval||isNaN(s.min_interval)||!s.min_interval||s.min_interval<0)&&(s.min_interval=0),("number"!=typeof s.max_interval||isNaN(s.max_interval)||!s.max_interval||s.max_interval<0)&&(s.max_interval=0),s.min_interval&&s.min_interval>s.max-s.min&&(s.min_interval=s.max-s.min),s.max_interval&&s.max_interval>s.max-s.min&&(s.max_interval=s.max-s.min)},decorate:function(t,i){var s="",o=this.options;return o.prefix&&(s+=o.prefix),s+=t,o.max_postfix&&(o.values.length&&t===o.p_values[o.max]?(s+=o.max_postfix,o.postfix&&(s+=" ")):i===o.max&&(s+=o.max_postfix,o.postfix&&(s+=" "))),o.postfix&&(s+=o.postfix),s},updateFrom:function(){this.result.from=this.options.from,this.result.from_percent=this.convertToPercent(this.result.from),this.result.from_pretty=this._prettify(this.result.from),this.options.values&&(this.result.from_value=this.options.values[this.result.from])},updateTo:function(){this.result.to=this.options.to,this.result.to_percent=this.convertToPercent(this.result.to),this.result.to_pretty=this._prettify(this.result.to),this.options.values&&(this.result.to_value=this.options.values[this.result.to])},updateResult:function(){this.result.min=this.options.min,this.result.max=this.options.max,this.updateFrom(),this.updateTo()},appendGrid:function(){if(this.options.grid){var t,i,s,o,e,h,r=this.options,n=r.max-r.min,a=r.grid_num,c=0,l=4,_="";for(this.calcGridMargin(),r.grid_snap&&(a=n/r.step),50<a&&(a=50),s=this.toFixed(100/a),4<a&&(l=3),7<a&&(l=2),14<a&&(l=1),28<a&&(l=0),t=0;t<a+1;t++){for(o=l,100<(c=this.toFixed(s*t))&&(c=100),e=((this.coords.big[t]=c)-s*(t-1))/(o+1),i=1;i<=o&&0!==c;i++)_+='<span class="irs-grid-pol small" style="left: '+this.toFixed(c-e*i)+'%"></span>';_+='<span class="irs-grid-pol" style="left: '+c+'%"></span>',h=this.convertToValue(c),_+='<span class="irs-grid-text js-grid-text-'+t+'" style="left: '+c+'%">'+(h=r.values.length?r.p_values[h]:this._prettify(h))+"</span>"}this.coords.big_num=Math.ceil(a+1),this.$cache.cont.addClass("irs-with-grid"),this.$cache.grid.html(_),this.cacheGridLabels()}},cacheGridLabels:function(){var t,i,s=this.coords.big_num;for(i=0;i<s;i++)t=this.$cache.grid.find(".js-grid-text-"+i),this.$cache.grid_labels.push(t);this.calcGridLabels()},calcGridLabels:function(){var t,i,s=[],o=[],e=this.coords.big_num;for(t=0;t<e;t++)this.coords.big_w[t]=this.$cache.grid_labels[t].outerWidth(!1),this.coords.big_p[t]=this.toFixed(this.coords.big_w[t]/this.coords.w_rs*100),this.coords.big_x[t]=this.toFixed(this.coords.big_p[t]/2),s[t]=this.toFixed(this.coords.big[t]-this.coords.big_x[t]),o[t]=this.toFixed(s[t]+this.coords.big_p[t]);for(this.options.force_edges&&(s[0]<-this.coords.grid_gap&&(s[0]=-this.coords.grid_gap,o[0]=this.toFixed(s[0]+this.coords.big_p[0]),this.coords.big_x[0]=this.coords.grid_gap),o[e-1]>100+this.coords.grid_gap&&(o[e-1]=100+this.coords.grid_gap,s[e-1]=this.toFixed(o[e-1]-this.coords.big_p[e-1]),this.coords.big_x[e-1]=this.toFixed(this.coords.big_p[e-1]-this.coords.grid_gap))),this.calcGridCollision(2,s,o),this.calcGridCollision(4,s,o),t=0;t<e;t++)i=this.$cache.grid_labels[t][0],this.coords.big_x[t]!==Number.POSITIVE_INFINITY&&(i.style.marginLeft=-this.coords.big_x[t]+"%")},calcGridCollision:function(t,i,s){var o,e,h,r=this.coords.big_num;for(o=0;o<r&&!(r<=(e=o+t/2));o+=t)h=this.$cache.grid_labels[e][0],s[o]<=i[e]?h.style.visibility="visible":h.style.visibility="hidden"},calcGridMargin:function(){this.options.grid_margin&&(this.coords.w_rs=this.$cache.rs.outerWidth(!1),this.coords.w_rs&&("single"===this.options.type?this.coords.w_handle=this.$cache.s_single.outerWidth(!1):this.coords.w_handle=this.$cache.s_from.outerWidth(!1),this.coords.p_handle=this.toFixed(this.coords.w_handle/this.coords.w_rs*100),this.coords.grid_gap=this.toFixed(this.coords.p_handle/2-.1),this.$cache.grid[0].style.width=this.toFixed(100-this.coords.p_handle)+"%",this.$cache.grid[0].style.left=this.coords.grid_gap+"%"))},update:function(t){this.input&&(this.is_update=!0,this.options.from=this.result.from,this.options.to=this.result.to,this.update_check.from=this.result.from,this.update_check.to=this.result.to,this.options=a.extend(this.options,t),this.validate(),this.updateResult(t),this.toggleInput(),this.remove(),this.init(!0))},reset:function(){this.input&&(this.updateResult(),this.update())},destroy:function(){this.input&&(this.toggleInput(),this.$cache.input.prop("readonly",!1),a.data(this.input,"ionRangeSlider",null),this.remove(),this.input=null,this.options=null)}},a.fn.ionRangeSlider=function(t){return this.each(function(){a.data(this,"ionRangeSlider")||a.data(this,"ionRangeSlider",new h(this,t,o++))})},function(){for(var h=0,t=["ms","moz","webkit","o"],i=0;i<t.length&&!l.requestAnimationFrame;++i)l.requestAnimationFrame=l[t[i]+"RequestAnimationFrame"],l.cancelAnimationFrame=l[t[i]+"CancelAnimationFrame"]||l[t[i]+"CancelRequestAnimationFrame"];l.requestAnimationFrame||(l.requestAnimationFrame=function(t,i){var s=(new Date).getTime(),o=Math.max(0,16-(s-h)),e=l.setTimeout(function(){t(s+o)},o);return h=s+o,e}),l.cancelAnimationFrame||(l.cancelAnimationFrame=function(t){clearTimeout(t)})}()});
