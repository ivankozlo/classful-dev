/**
 * Event payment
 * @author sabri taieb
 * @link https://delabon.com
 */
(function($){

    var $form = jQuery('form[name="event-checkout"]');
    var orig_price = parseFloat( $('[name="price"]').val() );
    
    // Free
    if( EVENT.type === 'free' ){            
        // when the form is submitted
        $form.on('submit', function(e){
            e.preventDefault();
            ajaxSubmitForm( $form );
        });
    }
    // Paid
    else{

        var checkout = new CheckoutClass;

        /**
         * Overriding validateInputs
         */
        checkout.validateInputs = function(){

            var $errors = [];

            // Quantity
            var $quantity = $('[name="quantity"]');
            var quantity = parseInt($quantity.val());
            if( isNaN( quantity ) || quantity < 1 ){
                $quantity.addClass('error');
                $errors.push($quantity);
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
    }

    ///
    /// Custom code per form
    ///

    /**
     * Send form
     * @param {jQuery} $form 
     */
    function ajaxSubmitForm( $form ){

        $form.find('.error').removeClass('error');

        if( ! validateInputs() ) return false;

        // Disable the submit button to prevent repeated clicks:
        $form.find('input[name=submit_donate]').prop('disabled', true);
        jQuery('.submit-donate-loader').show();
    
        $.ajax({
            cache: false,
            url: $form.attr('action'),
            method: "POST",
            data: $form.serialize(),
        }).done(function( response ){

            //console.log(response);
            
            if( ! response.success ){

                $form.find('input[name=submit_donate]').prop('disabled', false);
                jQuery('.submit-donate-loader').css('display', 'none');

                if( response.data.type === 'flash' || response.data.type === 'refresh' || response.data.type === 'reload' ){
                    location.reload();
                }
                else if( response.data.type === 'input' ){
                    $form.find(response.data.input).addClass('error');
                }

                if( $form.find('.error:first').length ){
                    $('html, body').animate({
                        scrollTop: $form.find('.error:first').offset().top - 80
                    }, 300);
                }

                return false;
            }

            location.href = '/events/' + EVENT.slug;            
        });
    }

    /**
     * Validate Form (Free events only)
     */
    function validateInputs(){

        var $errors = [];

        // Quantity
        var $quantity = $('[name="quantity"]');
        var quantity = parseInt($quantity.val());
        if( isNaN( quantity ) || quantity < 1 ){
            $quantity.addClass('error');
            $errors.push($quantity);
        }
        
        // First name
        var $firstName = $('[name="billing_first_name"]');
        if( $firstName.val() === '' ){
            $firstName.addClass('error');
            $errors.push($firstName);
        }

        // Last name
        var $lastName = $('[name="billing_last_name"]');
        if( $lastName.val() === '' ){
            $lastName.addClass('error');
            $errors.push($lastName);
        }

        // Email
        var $email = $('[name="billing_email"]');
        if( ! /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($email.val() ) ){
            $email.addClass('error');
            $errors.push($email);
        }

        // Country
        var $country = $('[name="billing_country"]');
        if( $country.val() === '' ){
            $country.addClass('error');
            $errors.push($country);
        }

        // Postal code
        var $postCode = $('[name="billing_postcode"]');
        if( $postCode.val() === '' ){
            $postCode.addClass('error');
            $errors.push($postCode);
        }

        if( $errors.length ){

            $('html, body').animate({
                scrollTop: $errors[0].offset().top - 80
            }, 300);

            return false;
        }

        return true;
    }

    /**
     * Calculate amount for paid events
     */
    function calcAmount(){

        var price = orig_price * parseInt( $('[name="quantity"]').val() );
        var pledge_amount = price;
        var tip_amount_percent = $('#add_gift_box').val();

        if( tip_amount_percent === 'other' ){

            var tip = $('#add_gift_box2-display').val();

            if( tip == '' || tip == '.00' ){
                tip = 0;
            }
            
            price += parseFloat( tip );
        }
        else{

            price = ( ( price * parseInt(tip_amount_percent) ) / 100 ) + price;            
        }

        $('.donation-box__title').text('$' + pledge_amount.toFixed(2));

        return price.toFixed(2);
    }

    /**
     * Update submit button text
     */
    function updateSubmitButtonText(){
        if( EVENT.type === 'free' ){
            $form.find('[type="submit"]').val('Confirm');
        }
        else{
            $form.find('[type="submit"]').val('Pay $' + calcAmount());
        }
    }
    updateSubmitButtonText();

    // Tip dropdown
    $('#add_gift_box').change(function(){
        updateSubmitButtonText();
    });
    
    // when other donation amount is changed
    $('#add_gift_box2-display').on('input', function(){
        updateSubmitButtonText();
    });

    // when quantity is changed
    $('[name="quantity"]').on('input change', function(){
        updateSubmitButtonText();
    });
    
})(jQuery);