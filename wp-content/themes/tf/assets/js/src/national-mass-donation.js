/**
 * Mass donation js part
 * @author sabri taieb
 * @link https://delabon.com
 */
(function($){
        
    var $form = $('#mass-donate-form');
    var totalTeachersFound = 0;

    // Init checkout
    var checkout = new CheckoutClass();

    /**
     * Overriding validateInputs
     */
    checkout.validateInputs = function(){

        var $errors = [];

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
    
    /**
     * Get total teachers to donate to
     * By country
     */
    function ajaxGetTotalTeachersByCountry(){
        $.ajax({
            cache: false,
            url: $form.attr('action'),
            method: "POST",
            data: {
                country_updated: true,
                nonce: $('[name="nonce"]').val(),
                country: $('[name="donor_ip_country"]').val(),
                total_teachers: $('[name="total_teachers"]').val(),
                teachers_or_schools: $('[name="teachers_or_schools"]').val(),
                is_tax_deductible: $('[name="is_tax_deductible"]').val(), 
            },
        }).done(function( response ){
            
            //console.log( response );

            if( response.success ){
                totalTeachersFound = parseInt(response.data.total_quantity);
                calcTotal();
            }
        });
    }

    /**
     * Calculate total
     */
    function calcTotal(){

        var quantity = totalTeachersFound;
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
        ajaxGetTotalTeachersByCountry();
    });

    // when suggested tip is changed
    $form.find('#add_gift_box').on('change', function(e){
        calcTotal();
    });

    // when custom tip is changed
    $form.find('#add_gift_box2-display').on('input', function(e){
        calcTotal();
    });

    // when country is changed
    $form.find('[name="billing_country"]').on('change', function(e){
        var $this = $(this);
        $form.find('[name="donor_ip_country"]').val( $this.val() );
        ajaxGetTotalTeachersByCountry();
    });

    // when teachers or schools switch is changed 
    $('[name="teachers_or_schools"]').on('input', function(){
        ajaxGetTotalTeachersByCountry();
    });

    // when is_tax_deductible is changed
    $('[name="is_tax_deductible"]').on('input', function(){
        ajaxGetTotalTeachersByCountry(); 
    });
    
    /*************************************************************
     * GEO
    *************************************************************/
    $.get('https://geo.teacherfunder.com/detect-geo.php?get_locale=1', function(data){
        var json = $.parseJSON(data);

        if( json.country_code ){
            $('[name="donor_ip_country"]').val(json.country_code).trigger('input');
            ajaxGetTotalTeachersByCountry();
        }
    });

})(jQuery);
