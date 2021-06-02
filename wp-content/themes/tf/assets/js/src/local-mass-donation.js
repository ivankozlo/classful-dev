/**
 * Mass donation js part
 * @author sabri taieb
 * @link https://delabon.com
 */
(function($){
    
    var $form = $('#mass-donate-form');
    var totalTeachersFound = 0;
    var mapData = {
        map: null,
        marker: null,
        circle: null,
        circleData:{
            map: null,
            radius: 80467.2,    // 50 miles in metres
            fillColor: '#C0E3F0',
            fillOpacity: 0.5,
            strokeColor: "#000",
            strokeOpacity: 0.5,
            strokeWeight: 1,
        },
        zoom: 8,
        lat: 0,
        long: 0,
    };

    // Init checkout
    var checkout = new CheckoutClass();

    /**
     * Overriding validateInputs
     */
    checkout.validateInputs = function(){

        var $errors = [];

        // Zip code
        var $zipCode = $('[name="search_zip_code"]');
       if( $zipCode.val() === '' ){
            $zipCode.addClass('error');
            $errors.push($zipCode);
        }

        // Amount per teacher
        var $amountPerTeacher = $('[name="amount_per_teacher"]');
        var $amountPerTeacherOther = $('[name="amount_per_teacher_other"]');
        var amountPerTeacherOther = isNaN(parseFloat($amountPerTeacherOther.val())) ? 0 : parseFloat($amountPerTeacherOther.val());
        if( $amountPerTeacher === 'other' && amountPerTeacherOther < 5 ){
            $amountPerTeacherOther.addClass('error');
            $errors.push($amountPerTeacherOther);
        }

        // call parent validateInputs
        var result = CheckoutClass.prototype.validateInputs.call(this);

        if( $errors.length ){

            $errors[0].focus();

            $('html, body').animate({
                scrollTop: $errors[0].offset().top - 80
            }, 300);

            return false;
        }

        if( ! result ) return false;

        return true;
    } 

    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            }, wait);
            if (immediate && !timeout) func.apply(context, args);
        };
    }

    /**
     * Calculate total
     */
    function calcTotal(){

        if( $('#search_zip_code').val() === '' ) return false;

        var quantity = parseInt($('[name="total_teachers"]').val());

        if( totalTeachersFound < quantity ){
            quantity = totalTeachersFound;
        }
        
        var price = $('[name="amount_per_teacher"]:checked').val();
        var tip = $('#add_gift_box').val();
        var total = 0;

        if( price === 'other' ){

            price = $('[name="amount_per_teacher_other"]').val();
            if( price === '' ) price = 0;
        }
        
        price = parseFloat( price ) * quantity;

        if( tip === 'other' ){

            tip = $('#add_gift_box2-display').val();
            if( tip === '' ) tip = 0;
        }
        else{
            tip = ( price * tip ) / 100;            
        }

        tip = parseFloat( tip );
        total = tip + price;

        $form.find('[type="submit"]').val('Donate $' + total.toFixed(2));
        $('.donation-box__title').text('$'+price.toFixed(2));
        $('.donation-box .__total').text(price.toFixed(2));
        $('.donation-box .__quantity').text(quantity);

        return {
            price: price,
            tip: tip,
            total: total,
        };
    }

    calcTotal();

    // when amount is selected
    $form.find('[name="amount_per_teacher"]').on('change', function(e){

        var $this = $form.find('[name="amount_per_teacher"]:checked');
        var value = $this.val();
        
        if( value === 'other' ){
            $('.amount_per_teacher_other_wrapper').removeClass('__hidden');
        }
        else{
            $('.amount_per_teacher_other_wrapper').addClass('__hidden');
        }

        calcTotal();
    });

    // when custom amount is changed
    $form.find('[name="amount_per_teacher_other"]').on('input', function(e){

        var $this = $(this);
        var value = parseFloat($(this).val());

        if( value < 5 ){
            $this.val(5).trigger('input');
        }

        calcTotal();
    });

    // when total teachers is changed
    $form.find('[name="total_teachers"]').on('change', function(e){
        calcTotal();
        ajaxGetTotalTeachersByRadius();
    });

    // when suggested tip is changed
    $form.find('#add_gift_box').on('change', function(e){
        calcTotal();
    });

    // when custom tip is changed
    $form.find('#add_gift_box2-display').on('input', function(e){
        calcTotal();
    });

    // when search range is changed
    var radiusChangedDebounce = debounce(function() {
        ajaxGetTotalTeachersByRadius();
    }, 100);

    $form.find('[name="search_range"]').on('input', function(e){

        var $this = $(this);
        var value = parseInt($this.val());

        $form.find('.md-form__range-miles span').text(value);

        // redraw map
        if( mapData.map ){
            mapData.circleData.radius = getMeters(value);

            if( value >= 58 ){
                mapData.zoom = 7;
            }
            else if( value < 10 ){
                mapData.zoom = 10;
            }
            else if( value < 25 ){
                mapData.zoom = 9;
            }
            else{
                mapData.zoom = 8;
            }

            redrawMap();
        }
        
        radiusChangedDebounce();        
    });

    // when search zip code is changed (zip example: 97623 || 33616)
    var zipCodeChangedDebounce = debounce(function( value ) {
        getLatLongFromZip( value );
        ajaxGetTotalTeachersByRadius();
    }, 250);

    $form.find('[name="search_zip_code"]').on('input', function(e){

        var $this = $(this);
        var value = parseInt($this.val());

        if( ! value ) return false;

        zipCodeChangedDebounce( (value).toString() );
    });

    // when teachers or schools switch is changed 
    $('[name="teachers_or_schools"]').on('input', function(){
        ajaxGetTotalTeachersByRadius();
    });

    // when is_tax_deductible is changed
    $('[name="is_tax_deductible"]').on('input', function(){
        ajaxGetTotalTeachersByRadius(); 
    });

    /**
     * Get total teachers to donate to
     * By zip code and radius
     */
    function ajaxGetTotalTeachersByRadius(){
        $.ajax({
            cache: false,
            url: $form.attr('action'),
            method: "POST",
            data: {
                zip_code_updated: true,
                nonce: $('[name="nonce"]').val(),
                search_zip_code: $('[name="search_zip_code"]').val(),
                search_range: $('[name="search_range"]').val(),
                total_teachers: $('[name="total_teachers"]').val(),
                teachers_or_schools: $('[name="teachers_or_schools"]').val(),
                is_tax_deductible: $('[name="is_tax_deductible"]').val(), 
            },
        }).done(function( response ){
            
            //console.log(response);

            if( response.success ){
                totalTeachersFound = parseInt(response.data.total_quantity);
                $('.total-teachers-found-wrapper strong').text(totalTeachersFound).parent().show();
                calcTotal();
            }
        });
    }

    /*************************************************************
     * GEO
    *************************************************************/
    $.get('https://geo.teacherfunder.com/detect-geo.php?get_locale=1', function(data){
        var json = $.parseJSON(data);
    
        if( json.postal_code ){
            $('[name="search_zip_code"]').val(json.postal_code).trigger('input');
        }
    });

    /*************************************************************
     * Google Maps
    *************************************************************/

    /**
     * init Google Map
     */
    function initMap() {

        var zipCode = $form.find('[name="search_zip_code"]').val();

        if( zipCode === '' ){
            $form.find('#google-maps-wrapper').addClass('__hidden');
            return false;
        }

        $form.find('#google-maps-wrapper').removeClass('__hidden');

        mapData.map = new google.maps.Map( document.getElementById('google-maps-wrapper'), {
            zoom: mapData.zoom,
            center: {
                lat: mapData.lat, 
                lng: mapData.long,
            },
        });

        // Create marker 
        mapData.marker = new google.maps.Marker({
            map: mapData.map,
            position: new google.maps.LatLng(mapData.lat, mapData.long),
            title: 'location'
        });

        // Add circle overlay and bind to marker
        mapData.circleData.map = mapData.map;
        mapData.circle = new google.maps.Circle(mapData.circleData);
        mapData.circle.bindTo('center', mapData.marker, 'position');
    }

    /**
     * Redraw Map Components
     */
    function redrawMap(){

        if( ! mapData.map ){
            return false;
        }

        // delete components
        mapData.marker.setMap(null);
        mapData.circle.setMap(null);

        // change map to new position
        mapData.map.setCenter({
            lat: mapData.lat, 
            lng: mapData.long
        });

        // change zoom
        mapData.map.setZoom(mapData.zoom);

        // draw components

        // Create marker 
        mapData.marker = new google.maps.Marker({
            map: mapData.map,
            position: new google.maps.LatLng(mapData.lat, mapData.long),
            title: 'location'
        });

        // Add circle overlay and bind to marker
        mapData.circleData.map = mapData.map;
        mapData.circle = new google.maps.Circle(mapData.circleData);
        mapData.circle.bindTo('center', mapData.marker, 'position');
    }

    /**
     * Get lat & long from zip code
     * 
     * @param {string} zipCode
     * @return {boolean}
     */
    function getLatLongFromZip( zipCode ){
    
        var geocoder = new google.maps.Geocoder();

        geocoder.geocode(
            {componentRestrictions: { 
                country: 'US',
                postalCode: zipCode
            }}, 
            function (results, status) {
                
                if (status == google.maps.GeocoderStatus.OK) {
                    
                    var latLong = {
                        lat: results[0].geometry.location.lat(),
                        long: results[0].geometry.location.lng(),
                    };

                    mapData.lat = latLong.lat;
                    mapData.long = latLong.long;

                    // first time
                    if( ! mapData.map ){
                        initMap();
                    }
                    // redraw
                    else{
                        redrawMap();
                    }

                    return true;
                } 
                else {
                    return false;
                }
            }
        );
    }

    /**
     * Convert miles to meters
     * @param {int} i 
     */
    function getMeters(i) {
        return i*1609.344;
    }

    window.massDonationInitMap = initMap;

})(jQuery);
