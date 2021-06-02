/**
 * Maps
 */
jQuery(document).ready(function($) {

  var $win = $(window);

  // global var
  var schoolMap = tfnewNewMap( $('#schoolMap') );

});

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
  const $ = jQuery;

  // Return if $el does not exists.
  if ( ! $el.length ) return;

  let lat = $el.data('map-lat') ? $el.data('map-lat') : 0,
      lng = $el.data('map-lng') ? $el.data('map-lng') : 0,
      zoom = $el.data('map-zoom') ? $el.data('map-zoom') : 15,
      showCircle = ( $el.data('map-circle') === true ) ? true : false,
      circleRadius = $el.data('map-circle-radius') ? $el.data('map-circle-radius') : 50;

  // var
  var $markers = $el.find('.marker');

  // vars
  var args = {
    zoom : zoom,
    center : new google.maps.LatLng(lat, lng),
    mapTypeId : google.maps.MapTypeId.ROADMAP
  };

  // create map
  var map = new google.maps.Map( $el[0], args );

  // add a markers reference
  map.markers = [];

  // add markers
  $markers.each(function(){
    tfnewAddMarker( $(this), map );
  });

  // Add Circle to map.
  if ( showCircle ) {
    tfnewAddCircleToMap( map, { lat: lat, lng: lng }, circleRadius );
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
  const $ = jQuery;

  // var
  var latlng = new google.maps.LatLng( $marker.attr('data-lat'), $marker.attr('data-lng') );

  var markerData = {
    position : latlng,
    map : map
  };

  if ( $marker.attr('data-icon') ) {
    var image = {
      url: $marker.attr('data-icon')
    };

    // if ( $win.width() < 768 ) {
    //   image['size'] = new google.maps.Size(30, 30);
    //   // The origin for this image is (0, 0).
    //   image['scaledSize'] = new google.maps.Size(30, 30);
    // }

    markerData['icon'] = image;
  }

  // create marker
  var marker = new google.maps.Marker( markerData );

  // add to array
  map.markers.push( marker );

  // if marker contains HTML, add it to an infoWindow
  if( $marker.html() )
  {
    // create info window
    var infowindow = new google.maps.InfoWindow({
      content		: $marker.html()
    });

    // show info window when marker is clicked
    google.maps.event.addListener(marker, 'click', function() {

      infowindow.open( map, marker );

    });
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
function tfnewCenterMap( map, zoom = 16 ) {

  // Set $ as jQuery.
  const $ = jQuery;

  // vars
  var bounds = new google.maps.LatLngBounds();

  // loop through all markers and create bounds
  $.each( map.markers, function( i, marker ){

    var latlng = new google.maps.LatLng( marker.position.lat(), marker.position.lng() );

    bounds.extend( latlng );

  });

  // only 1 marker?
  if( map.markers.length == 1 )
  {
    // set center of map
      map.setCenter( bounds.getCenter() );
      map.setZoom( zoom );
  }
  else
  {
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
function tfnewAddCircleToMap( map, center, radius = 50, style = {} ) {

  const strokeColor = style.strokeColor ? style.strokeColor : '#0FC3B2',
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