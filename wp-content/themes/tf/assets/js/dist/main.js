/**
 * Conversation
 *
 * ------> js/src/custom/conversation.js
 */
jQuery( document ).ready( function ( $ ) {
  var $win = $( window ),
    $body = $( 'body' ),
    $conv = $( '.conversation' );
    
  // Check if conversation is present on this page.
  if ( $conv.length > 0 ) {
    /**
     * Toggle Submit Button
     * @param {Object} $el jQuery element object.
     */
    var toggleSubmit = function toggleSubmit( $el ) {
      if ( $el.val() !== '' ) {
        $convSubmit.removeAttr( 'disabled' );
        $convSubmit.removeClass( 'disabled' );
      } else {
        $convSubmit.attr( 'disabled', 'disabled' );
        $convSubmit.addClass( 'disabled' );
      }
    };

    var $convField = $( '#conversationMessageField' ),
      $convSubmit = $( '#conversationMessageSubmit' );

    // Apply autogrow functionality to the textarea message field.
    $convField.autogrow();

    // Event: On keyup
    $convField.on( 'keyup', debounce( function ( e ) {
      var $this = $( this );
      toggleSubmit( $this );
    }, 200 ) );
  }
} );

/**
 * Forms
 */
jQuery( document ).ready( function ( $ ) {
  // Fancy Checkboxes
  $( '.gform_wrapper input[type="checkbox"]' ).ezMark();

  // read get parameters
  var url_string = window.location.href;
  var url = new URL(url_string);
  var typeParam = url.searchParams.get("type");
  var sortParam = url.searchParams.get("sort");
  
  // init selectbox
  $( 'select:not(body.outreach-template select):not(.no-selectbox select)' ).selectbox();
  $('.sbOptions li a[rel="' + typeParam + '"]').parent().addClass('sbActive');
  $('.sbOptions li a[rel="' + sortParam + '"]').parent().addClass('sbActive');
  $( '.sbOptions li a' ).click( function () {
    var $this = $( this );
    $this.closest( 'li' ).addClass( 'sbActive' ).siblings().removeClass( 'sbActive' );
  } );

  // Run on GravityForm post render event.

  $( document ).on( 'gform_post_render', function ( event, form_id, current_page ) {
    // Reinitialize ezMark
    var $checkboxes = $( '.gform_wrapper input[type="checkbox"]' );

    if ( ! $checkboxes.closest( '.ez-checkbox' ).length ) {
      $( '.gform_wrapper input[type="checkbox"]' ).ezMark();
    }

    // Reinitialize Selectbox.
    $( 'select:not(body.outreach-template select):not(.no-selectbox select)' ).selectbox();
    $( '.sbOptions li:first-child' ).addClass( 'active' );
  } );
  /**
   * Range Slider
   */

  $( '.range-slider' ).each( function () {
    var $this = $( this ),
      options = {
        // hide_min_max: true,
        onChange: function onChange( slider ) { // console.log(slider);
        },
        onFinish: function onFinish( slider ) { // console.log(slider);
        }
      };

    // If the range slider is two side, then add
    // a custom CSS class to the container.
    if ( $this.data( 'type' ) === 'double' ) {
      options[ 'extra_classes' ] = 'range-slider--double';
    }

    // If the range slider is single, then add
    // a custom CSS class to the container.
    if ( $this.data( 'type' ) === 'single' ) {
      options[ 'extra_classes' ] = 'range-slider--single';
    }

    $this.ionRangeSlider( options );
    var thisRange = $this.data( 'ionRangeSlider' );
  } );
} );

/**
 * Submit Search on Enter
 */
jQuery( document ).ready( function ( $ ) {
  // Traversing: Run through each item
  $( '.submit-on-enter' ).each( function ( i, el ) {
    var $this = $( el ),
      $input = $this.find( 'input.form-control' );

    // Event: On keyup
    $input.on( 'keyup', function ( e ) {
      if ( e.which == 13 ) {
        $this.submit();
      }
    } );
  } );
} );

/**
 * Checkable Table
 */
jQuery( document ).ready( function ( $ ) {
  checkableTable();

  function checkableTable() {
    // Define variables.
    var $table = $( this ),
      $rows = $table.find( 'tbody > tr' ),
      $mainCheckbox = $table.find( 'thead input[type=checkbox]' ),
      $mainTitle = $table.find( 'thead .table-col-title' ),
      mainOrigTitle = $mainTitle.text(),
      $checkboxes = $rows.find( 'input[type=checkbox]' );

    // Event: On click
    $rows.on( 'click', function ( e ) {
      var $thisRow = $( this ),
        $checkbox = $thisRow.find( 'input[type=checkbox]' );

      if ( e.target.type !== 'checkbox' ) {
        $( ':checkbox', this ).trigger( 'click' );
      }
    } );

    // Event: On change
    $checkboxes.on( 'change', function ( e ) {
      var $checkbox = $( this );

      if ( $checkbox ) {}
    } );

    // On change of the checkboxes.
    $checkboxes.on( 'change', function () {
      var $checkbox = $( this ),
        checkedLength = getCheckedLength( $rows );

      // Check if any of the checkbox in this table is checked.
      if ( checkedLength > 0 ) {
        if ( ! $mainCheckbox.is( ':checked' ) ) {
          checkMainCheckbox();
        }

        $mainTitle.text( checkedLength + ' selected' );
      } else {
        if ( $mainCheckbox.is( ':checked' ) ) {
          uncheckMainCheckbox();
        }

        $mainTitle.text( mainOrigTitle );
      }
    } );

    // Event: On click
    $mainCheckbox.on( 'click', function ( e ) {
      // Traversing: Run through each item
      $checkboxes.each( function ( i, el ) {
        el.checked = e.target.checked;
      } );

      // Check if any of the checkbox in this table is checked.
      if ( e.target.checked ) {
        $mainTitle.text( $checkboxes.length + ' selected' );
      } else {
        $mainTitle.text( mainOrigTitle );
      }
    } );

    // Event: On click
    $mainTitle.on( 'click', function ( e ) {
      $mainCheckbox.click();
    } );

    /**
     * Is Any Checkbox Checked
     * @param {object} $el element to find all the checkbox in
     */
    function getCheckedLength( $el ) {
      return $el.find( 'input[type=checkbox]' ).filter( ':checked' ).length;
    }

    /**
     * Check Main Checkbox
     */
    function checkMainCheckbox() {
      $mainCheckbox[ 0 ].checked = true;
    }

    /**
     * Uncheck Main Checkbox
     */
    function uncheckMainCheckbox() {
      $mainCheckbox[ 0 ].checked = false;
    }

    /**
     * Uncheck Main Checkbox
     */
    function toggleMainCheckbox() {
      if ( ! $mainCheckbox.is( ':checked' ) ) {
        checkMainCheckbox();
      } else {
        uncheckMainCheckbox();
      }
    }
  }
} );

/**
 * Maps
 */
jQuery( document ).ready( function ( $ ) {
  var $win = $( window );

  // global var
  var schoolMap = tfnewNewMap( $( '#schoolMap' ) );
} );

/**
 * tfnewNewMap
 *
 * This function will render a Google Map onto the selected jQuery element
 *
 * @type	function
 * @date	8/11/2013
 * @since	4.3.0
 *
 * @param	$el (jQuery element)
 * @return	n/a
 */

function tfnewNewMap( $el ) {
  // Set $ as jQuery.
  var $ = jQuery;

  // Return if $el does not exists.
  if ( ! $el.length ) return;
  var lat = $el.data( 'map-lat' ) ? $el.data( 'map-lat' ) : 0,
    lng = $el.data( 'map-lng' ) ? $el.data( 'map-lng' ) : 0,
    zoom = $el.data( 'map-zoom' ) ? $el.data( 'map-zoom' ) : 15,
    showCircle = $el.data( 'map-circle' ) === true ? true : false,
    circleRadius = $el.data( 'map-circle-radius' ) ? $el.data( 'map-circle-radius' ) : 50;

  // var
  var $markers = $el.find( '.marker' );

  // vars
  var args = {
    zoom: zoom,
    center: new google.maps.LatLng( lat, lng ),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  // create map
  var map = new google.maps.Map( $el[ 0 ], args );

  // add a markers reference
  map.markers = [];

  // add markers
  $markers.each( function () {
    tfnewAddMarker( $( this ), map );
  } );

  // Add Circle to map.
  if ( showCircle ) {
    tfnewAddCircleToMap( map, {
      lat: lat,
      lng: lng
    }, circleRadius );
  }

  // center map
  tfnewCenterMap( map, zoom );

  // return
  return map;
}

/**
 * tfnewAddMarker
 *
 * This function will add a marker to the selected Google Map
 *
 * @type	function
 * @date	8/11/2013
 * @since	4.3.0
 *
 * @param	$marker (jQuery element)
 * @param	map (Google Map object)
 * @return	n/a
 */
function tfnewAddMarker( $marker, map ) {
  // Set $ as jQuery.
  var $ = jQuery;

  // var
  var latlng = new google.maps.LatLng( $marker.attr( 'data-lat' ), $marker.attr( 'data-lng' ) );
  var markerData = {
    position: latlng,
    map: map
  };

  if ( $marker.attr( 'data-icon' ) ) {
    var image = {
      url: $marker.attr( 'data-icon' )
    };

    // if ( $win.width() < 768 ) {
    //   image['size'] = new google.maps.Size(30, 30);
    //   // The origin for this image is (0, 0).
    //   image['scaledSize'] = new google.maps.Size(30, 30);
    // }

    markerData[ 'icon' ] = image;
  }

  // create marker
  var marker = new google.maps.Marker( markerData );

  // add to array
  map.markers.push( marker );

  // if marker contains HTML, add it to an infoWindow
  if ( $marker.html() ) {
    // create info window
    var infowindow = new google.maps.InfoWindow( {
      content: $marker.html()
    } );

    // show info window when marker is clicked
    google.maps.event.addListener( marker, 'click', function () {
      infowindow.open( map, marker );
    } );
  }
}

/**
 * tfnewCenterMap
 *
 * This function will center the map, showing all markers attached to this map
 *
 * @type	function
 * @date	8/11/2013
 * @since	4.3.0
 *
 * @param	map (Google Map object)
 * @param	zoom
 * @return	n/a
 */
function tfnewCenterMap( map ) {
  var zoom = arguments.length > 1 && arguments[ 1 ] !== undefined ? arguments[ 1 ] : 16;
  // Set $ as jQuery.
  var $ = jQuery;

  // vars
  var bounds = new google.maps.LatLngBounds();

  // loop through all markers and create bounds
  $.each( map.markers, function ( i, marker ) {
    var latlng = new google.maps.LatLng( marker.position.lat(), marker.position.lng() );
    bounds.extend( latlng );
  } );

  // only 1 marker?
  if ( map.markers.length == 1 ) {
    // set center of map
    map.setCenter( bounds.getCenter() );
    map.setZoom( zoom );
  } else {
    // fit to bounds
    map.fitBounds( bounds );
  }
}

/**
 * tfnewAddCircleToMap
 *
 * This function will add a circle to map.
 *
 * @type	function
 * @date	8/11/2013
 * @since	4.3.0
 *
 * @param	map (Google Map object)
 * @param	center
 * @param	radius
 * @param	style
 * @return	n/a
 */
function tfnewAddCircleToMap( map, center ) {
  var radius = arguments.length > 2 && arguments[ 2 ] !== undefined ? arguments[ 2 ] : 50;
  var style = arguments.length > 3 && arguments[ 3 ] !== undefined ? arguments[ 3 ] : {};
  var strokeColor = style.strokeColor ? style.strokeColor : '#0FC3B2',
      strokeOpacity = style.strokeOpacity ? style.strokeOpacity : '0.2',
      strokeWeight = style.strokeWeight ? style.strokeWeight : 0,
      fillColor = style.fillColor ? style.fillColor : '#0FC3B2',
      fillOpacity = style.fillOpacity ? style.fillOpacity : '0.2';

  // Add the circle for this city to the map.
  var circle = new google.maps.Circle( {
    strokeColor: strokeColor,
    strokeOpacity: strokeOpacity,
    strokeWeight: strokeWeight,
    fillColor: fillColor,
    fillOpacity: fillOpacity,
    map: map,
    center: center,
    radius: tfnewGetMeters( radius )
  } );
  map.fitBounds( circle.getBounds() );
}

/**
 * tfnewGetMeters
 *
 * This function will add a circle to map.
 *
 * @type	function
 * @date	8/11/2013
 * @since	4.3.0
 *
 * @param	miles
 * @return Number
 */
function tfnewGetMeters( miles ) {
  return miles * 1609.344;
}

/**
 * Sliders
 */
jQuery( document ).ready( function ( $ ) {
  //
  // Slick Slider
  //
  $( '.images' ).slick( {
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: false,
    arrows: false,
    dots: true
  } );

  //
  // Slick Slider
  //
  $( '.images-slider' ).slick( {
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: false,
    arrows: false,
    dots: true
  } );
} );

/**
 * Custom jQuery Code
 */
jQuery( document ).ready( function ( $ ) {
  var $heroContact = $( '.hero-contact' );
  $( '.hero-contact__scroll' ).on( 'click', function ( e ) {
    e.preventDefault();
    $( 'html,body' ).animate( {
      scrollTop: $heroContact.outerHeight() + $heroContact.offset().top
    } );
  } );
  $( '.footer__scroll-top' ).on( 'click', function ( e ) {
    e.preventDefault();
    $( 'html,body' ).animate( {
      scrollTop: 0
    } );
  } );

  // Initialize AOS animations.
  AOS.init( {
    once: true,
    delay: 100,
    duration: 800
  } );

  // Features Matchheight
  $( '.feature__icon' ).matchHeight( {
    property: 'min-height'
  } );

  // Portal boxes content.
  $( '.portal-box__content' ).matchHeight( {
    property: 'min-height'
  } );

  // Fancybox defaults
  $( '[data-fancybox="gallery"], [data-fancybox="photos-gallery"]' ).fancybox( {
    thumbs: {
      autoStart: true,
      axis: 'x'
    }
  } );

  // Apply autogrow functionality to the textarea message field.
  $( '.followers-message__field' ).autogrow();
} );

/**
 * Fix Navbar on Scroll
 *
 * replace {.navbar} width your header CSS class selector
 * replace {navbar-fixed-top} with your CSS class for fixed header
 */
/*
jQuery( document ).ready( function ( $ ) {
  var $body = $( 'body' ),
      $window = $( window );

  if ( ! $( '.navbar' ).hasClass( 'navbar--is-sticky' ) ) {
    var fixNavbarOnScroll = function fixNavbarOnScroll( width ) {
      var $navbar = $( '.navbar' ),
        $wpadminbar = $( '#wpadminbar' ),
        navbarTop,
        $navbarWrapper;

      if ( ! $navbar.parent( '.navbar-wrapper' ).length ) {
        $navbar.wrapAll( '<div class="navbar-wrapper"></div>' );
      }

      $navbarWrapper = $navbar.closest( '.navbar-wrapper' );
      navbarTop = $navbarWrapper.offset().top - $wpadminbar.outerHeight();
      $navbarWrapper.css( {
        minHeight: $navbar.outerHeight()
      } );
      $window.scroll( function () {
        if ( $( this ).scrollTop() >= navbarTop ) {
          $navbar.addClass( 'navbar-fixed-top' );
        } else {
          $navbar.removeClass( 'navbar-fixed-top' );
        }
      } );
    };

    $window.ready( fixNavbarOnScroll ).resize( function () {
      fixNavbarOnScroll();
    } );
    $window.load( fixNavbarOnScroll );
  }
} );
*/

/**
 * Smooth Bottom
 *
 * This works with the anchor links in the URL too. It also changes the
 * URL hash
 *
 * Replace .offset_element_selector with the offset element, e.g., .navbar
 */
jQuery( document ).ready( function ( $ ) {
  var $scroll = $( '.section__scroll' ),
      $navbar = $( '.navbar' ),
      $wpadminbar = $( '#wpadminbar' );
  $scroll.on( 'click', function ( e ) {
    e.preventDefault();
    var $this = $( this ),
        $section = $this.closest( '.section' ),
        offset = $wpadminbar.outerHeight();

    if ( $section.length > 0 ) {
      scrollPastSection( $section );
    }
  } );

  function scrollPastSection( $el ) {
    var offset = $wpadminbar.outerHeight();
    if ( ! $navbar.hasClass( 'navbar--is-transparent' ) ) offset += $navbar.outerHeight();
    $( 'html, body' ).animate( {
      scrollTop: $el.offset().top + $el.outerHeight() - offset
    }, 500 );
  }
} );

/**
 * Smooth Anchor Links
 *
 * This works with the anchor links in the URL too. It also changes the
 * URL hash
 *
 * Replace .offset_element_selector with the offset element, e.g., .navbar
 */
jQuery( document ).ready( function ( $ ) {
  var hash = window.location.hash,
      $links = $( 'a[href^="#"]' ),
      $wpadminbar = $( '#wpadminbar' ),
      offset = 0,
      $navbar = $( '.navbar:not(.navbar--is-transparent):not(.navbar--is-sticky)' );

    // Check if URL has hash and smooth scroll to that.

  if ( hash && false ) {
    var $hashEl = $( hash );

    if ( $hashEl.length ) {
      scrollToAnchor( $hashEl );
      $( window ).load( function () {
        scrollToAnchor( $hashEl );
      } );
    }
  }

  $links.on( 'click', function ( e ) {
    var $this = $( this ),
      thisHref = $this.attr( 'href' );

    if ( thisHref !== '#' ) {
      if ( $( thisHref ).length ) {
        e.preventDefault();
        scrollToAnchor( $( thisHref ) );
      }
    }
  } );

  function scrollToAnchor( $el ) {
    offset = $wpadminbar.outerHeight() + $navbar.outerHeight();
    $( 'html, body' ).animate( {
      scrollTop: $el.offset().top - offset
    }, 500 );
  }
} );

/**
 * FullScreen Navbar
 */
jQuery( document ).ready( function ( $ ) {
  var $body = $( 'body' ),
    $navbar = $( '.navbar-nav' ),
    $navbarBtn = $( '.navbar__btn' ),
    $navbarClose = $( '.navbar-nav__close' );

    // $navbar.hide();

  $navbarBtn.on( 'click', function ( e ) {
    e.preventDefault();

    if ( $navbar.hasClass( 'navbar-nav--active' ) ) {
      $navbar.removeClass( 'navbar-nav--active' ).fadeOut();
      $body.removeClass( 'navbar-active' );
      $navbarBtn.removeClass( 'navbar__btn--active' );
    } else {
      $navbar.addClass( 'navbar-nav--active' ).fadeIn();
      $body.addClass( 'navbar-active' );
      $navbarBtn.addClass( 'navbar__btn--active' );
    }
  } );
  $navbarClose.on( 'click', function ( e ) {
    e.preventDefault();

    if ( $navbar.hasClass( 'navbar-nav--active' ) ) {
      $navbar.removeClass( 'navbar-nav--active' ).fadeOut();
      $body.removeClass( 'navbar-active' );
      $navbarBtn.removeClass( 'navbar__btn--active' );
    }
  } );
} );

/**
 * Crop Image
 */
jQuery( document ).ready( function ( $ ) {
  if ( typeof croppie != 'function' ) return;
  var $image = $( 'img.crop-image, .crop-image > img' );
  $image.croppie( {
    viewport: {
      width: 225,
      height: 250,
      type: 'square'
    }
  } );

  // $image.cropper({
  //   aspectRatio: 16 / 9,
  //   crop: function(event) {
  //     console.log(event.detail.x);
  //     console.log(event.detail.y);
  //     console.log(event.detail.width);
  //     console.log(event.detail.height);
  //     console.log(event.detail.rotate);
  //     console.log(event.detail.scaleX);
  //     console.log(event.detail.scaleY);
  //   }
  // });
  // // Get the Cropper.js instance after initialized
  // var cropper = $image.data('cropper');
} );


/*
* Header navigation and search
*/
var mobileMenuFullscreen = jQuery('#menu-mobile-fullscreen');

jQuery("#hamb-icon").on('click', function() {
    if (!mobileMenuFullscreen.hasClass('show')) {
        mobileMenuFullscreen.addClass('show');
        if (jQuery(window).width() < 421) {
            jQuery('body').addClass('mobile-menu-active');
        }
    }
});

jQuery("#close-mobile-menu").on('click', function() {
    if (mobileMenuFullscreen.hasClass('show')) {
        mobileMenuFullscreen.removeClass('show');
        if (jQuery(window).width() < 421) {
            jQuery('body').removeClass('mobile-menu-active');
        }
    }
});

var mobileSearchFullscreen = jQuery('#search-mobile-fullscreen');

jQuery("#navbar-search-mobile__toggle").on('click', function() {
    if (!mobileSearchFullscreen.hasClass('show')) {
        mobileSearchFullscreen.addClass('show');
        if (jQuery(window).width() < 421) {
            jQuery('body').addClass('mobile-menu-active');
        }
    }
});

jQuery("#close-mobile-search").on('click', function() {
    if (mobileSearchFullscreen.hasClass('show')) {
        mobileSearchFullscreen.removeClass('show');
        if (jQuery(window).width() < 421) {
            jQuery('body').removeClass('mobile-menu-active');
        }
    }
});

var headerSearchInput = jQuery('.header-main .navbar-search__input');

jQuery('#navbar-search__toggle').one('click', function(evt) {
    evt.preventDefault();
    if (!headerSearchInput.hasClass('show')) {
        headerSearchInput.addClass('show');
        headerSearchInput.focus();
    }
});

jQuery('.autocomplete-header-top, .autocomplete-home-top, .autocomplete-search-school-verification').on('input', function() {
    var inputWidth = jQuery(this).outerWidth();
    var inputPosLeft = jQuery(this).offset().left;
    jQuery('.autocomplete-suggestions').css("width", inputWidth);
    jQuery('.autocomplete-suggestions').css("left", inputPosLeft);
});


/*
* my account submenu toggle on click
*/
// jQuery('.logged-in .main-nav .dashboard-link a, .logged-in .menu-mobile-fullscreen__nav .dashboard-link a').on('click', function(evt) {
//   evt.preventDefault();
//   var submenu = jQuery(this).siblings('.sub-menu');
//   var parent = jQuery(this).parent();

//   if( !submenu.hasClass('show') ) {
//     parent.addClass('expanded');
//     submenu.addClass('show');
//   } else {
//     parent.removeClass('expanded');
//     submenu.removeClass('show');
//   }
  
// });

  
/*
* custom tooltip toggle
*/
jQuery('[data-tooltip]').on('click', function(evt) {
  evt.preventDefault();
  var targetTooltip = jQuery(this).attr('data-tooltip');
  var tooltip = jQuery(document).find(targetTooltip);

  if ( !tooltip.hasClass('show') ) {
    tooltip.addClass('show');
  } else {
    tooltip.removeClass('show');
  }

});

jQuery('.tooltip-close').on('click', function() {
  var tooltip = jQuery(this).parent();
  if ( tooltip.hasClass('show') ) {
    tooltip.removeClass('show');
  }
});


/*
* logged in user dropdown trigger
*/
jQuery('.logged-user-info__dropdown-trigger').on('click', function(e) {
  e.preventDefault();
  var dropdown = jQuery('.logged-user-info__dropdown');

  if (!dropdown.hasClass('show')) 
  {
    dropdown.addClass('show');
    jQuery(this).addClass('active');
    jQuery('.overlay-clickable').addClass('active');
  }
  else
  {
    dropdown.removeClass('show');
    jQuery(this).removeClass('active');
    jQuery('.overlay-clickable').removeClass('active');
  }
});


jQuery('.overlay-clickable').on('click', function(){
  jQuery(this).removeClass('active');
  jQuery('.logged-user-info__dropdown').removeClass('show');
});
