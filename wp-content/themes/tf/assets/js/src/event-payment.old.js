/**
 * Event payment
 * @author sabri taieb
 * @link https://delabon.com
 */
(function($){

    var $form = jQuery('form[name="event-checkout"]');
    var orig_per_text = $('.__per_family_or_student').text();
    var orig_price = parseFloat( $('[name="price"]').val() );
    
    /**
     * Send payment form
     * @param {jQuery} $form 
     */
    function sendEventPaymentForm( $form ){

        $form.find('.error').removeClass('error');

        $.ajax({
            cache: false,
            url: $form.attr('action'),
            method: "POST",
            data: $form.serialize(),
        }).done(function( response ){

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

            if( EVENT.type === 'free' ){
                location.href = '/events/' + EVENT.slug;
            }
            else{
                location.href = "/donate/complete/" + response.data.order_id + "/" + response.data.order_key + "/";
            }
            
        });
    }
            
    /**
     * Stripe response handler
     * @param {*} status 
     * @param {*} response 
     */
    function stripeResponseHandler(status, response){
        
        if (response.error){

            // Problem!
            // Show the errors on the form:
            $form.find('.payment-errors').html(response.error.message + '<br />Please click "Previous" below to update your credit card details.');
            $form.find('input[name=submit_donate]').prop('disabled', false); // Re-enable submission
            
            // Hide loader
            jQuery('.submit-donate-loader').hide();
        }
        else{

            // Token was created!
            // Get the token ID:
            var token = response.id;
            
            // Clear errors
            $form.find('.payment-errors').html('');
        
            // Insert the token ID into the form so it gets submitted to the server:
            $form.append(jQuery('<input type="hidden" name="stripeToken">').val(token));

            // Show loader
            jQuery('.submit-donate-loader').css('display', 'inline-block');
            
            // ajax
            sendEventPaymentForm( $form );
        }
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

        // if( pledge_amount > orig_price || pledge_amount == 0 ){
        //     $('.__per_family_or_student').text( '$' + orig_price.toFixed(2) + ' ' + orig_per_text );
        // }
        // else{
        //     $('.__per_family_or_student').text( orig_per_text );
        // }

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

    // when the form is submitted
    $form.on('submit', function(e){
        e.preventDefault();

        // Disable the submit button to prevent repeated clicks:
        $form.find('input[name=submit_donate]').prop('disabled', true);
    
        if( EVENT.type === 'free' ){            
            jQuery('.submit-donate-loader').show();
            sendEventPaymentForm( $form );
            return false;
        }

        // PAID
        var data = {
            number: jQuery('#paypal_pro-card-number').val().replace(' ', ''),
            cvc: jQuery('#paypal_pro-card-cvc').val(),
            exp_month: jQuery('#paypal_pro-card-expiry').val().split('/')[0],
            exp_year: jQuery('#paypal_pro-card-expiry').val().split('/')[1],
            address_zip: jQuery('#billing_postcode').val() 
        };
        
        // Request a token from Stripe:
        Stripe.card.createToken( data, stripeResponseHandler );

    });

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