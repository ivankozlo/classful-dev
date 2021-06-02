/**
 * Programs payment( Paid & Donation )
 * @author sabri taieb
 * @link https://delabon.com
 */
(function($){

    var $form = $('form[name="program-checkout"]');
    var formErrors = {};

    // FREE program
    if( $form.find('[name="ajax_reserve_free_program"]').length ){
        $form.on('submit', function(e){
            e.preventDefault();    
            sendProgramForm( $form );
        });        
    }
    // Paid or donation
    else{
        // Init checkout
        var checkout = new CheckoutClass;

        /**
         * Overriding validateInputs
         */
        checkout.validateInputs = function(){

            var $errors = [];

            // Quantity (Paid or Donation)
            var totalQuantity = 0;
            
            // Quantity (Paid)
            var $quantities = $('.tickets_num');
            if( $quantities.length ){
                $quantities.each(function(){

                    var $this = $(this);
                    var quantity = parseInt($this.val());

                    if( isNaN( quantity ) || quantity < 1 ){
                        quantity = 0;
                    }

                    totalQuantity += quantity;
                });

                if( totalQuantity === 0 ){
                    var $quantity = $quantities.filter(':first');
                    $quantity.addClass('error');
                    $errors.push($quantity);
                }
            }

            // Quantity (Donation)
            $quantities = $('.donate_quantity');
            if( $quantities.length ){
                $quantities.each(function(){

                    var $this = $(this);
                    var quantity = parseInt($this.val());

                    if( isNaN( quantity ) || quantity < 1 ){
                        quantity = 0;
                    }

                    totalQuantity += quantity;
                });

                if( totalQuantity === 0 ){
                    var $quantity = $quantities.filter(':first');
                    $quantity.addClass('error');
                    $errors.push($quantity);
                }
            }

            // Donation amount
            var totalAmount = 0;
            var $donationAmounts = $('.donate_amount');

            $donationAmounts.each(function(){

                var $this = $(this);
                var value = $this.val();
                value = isNaN( parseFloat( value ) ) ? 0 : parseFloat( value );
                var quantity = $('.donate_quantity[data-typeid="'+$this.attr('data-typeid')+'"]').val();
                quantity = isNaN( parseInt(quantity) ) ? 0 : parseInt(quantity);

                if( quantity > 0 && ( value < parseFloat( $this.attr('data-min') ) || value > parseFloat( $this.attr('data-max') ) ) ){
                    $this.addClass('error');
                    $errors.push($this);
                }
            });

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

    /**
     * Send form
     * @param {jQuery} $form 
     */
    function sendProgramForm( $form ){
    
        $form.find('.error').removeClass('error');

        if( ! validateInputs() ) return false;

        // Disable the submit button to prevent repeated clicks:
        $form.find('input[name=submit_donate]').prop('disabled', true)
        .parent().find('img').css('display', 'inline-block');

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

            location.href = response.data.redirect_to;            
        });
    }
    
    /**
     * Validate Form (Free events only)
     */
    function validateInputs(){

        var $errors = [];

        // Quantity
        var total_quantity = 0;

        $('.donate_quantity').each(function(){

            var $this = $(this);
            var quantity = parseInt($this.val());

            if( isNaN( quantity ) || quantity < 1 ){
                quantity = 0;
            }

            total_quantity += quantity;
        });

        if( total_quantity === 0 ){
            var $quantity = $('.donate_quantity:first');
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
     * Calculate amount for paid types
     */
    var debounceCAP;

    function calcAmountPaid(){

        clearTimeout( debounceCAP );

        debounceCAP = setTimeout(function(){

            var types = {};

            $('.tickets_num').each(function(){

                var $this = $(this);
                
                types[ $this.data('typeid') ] = $this.val();
            });

            $.ajax({
                cache: false,
                url: $form.attr('action'),
                method: "POST",
                data: {
                    ajax_calc_paid_total: true,
                    nonce: $('[name="nonce"]').val(),
                    types: types,
                    tip_type: $('#add_gift_box').val(),
                    tip_other: $('#add_gift_box2-display').val(), 
                },
            }).done(function( response ){
                                
                if( ! response.success ){

                    if( response.data.code == 101 ){
                        var max = response.data.errorData.max_quantity;
                        var id = response.data.errorData.type_id;
                        $('.tickets_num[data-typeid="'+id+'"]').val(max).attr('max', max).trigger('change');                        
                    }

                    return false;
                }

                $form.find('[type="submit"]').val( 'Pay $' + response.data.total );
            });

        }, 100 );
    }

    /**
     * Calculate amount for donate types
     */
    var debounceCAD;

    function calcAmountDonated(){

        clearTimeout( debounceCAD );

        debounceCAD = setTimeout(function(){

            var types = {};

            $('.donate_amount').each(function(){

                var $this = $(this);
                
                types[ $this.data('typeid') ] = {
                    amount: $this.val(),
                    quantity: $('.donate_quantity[data-typeid="'+$this.data('typeid')+'"]').val()
                }
            });
            
            $.ajax({
                cache: false,
                url: $form.attr('action'),
                method: "POST",
                data: {
                    ajax_calc_donation_total: true,
                    nonce: $('[name="nonce"]').val(),
                    types: types,
                    tip_type: $('#add_gift_box').val(),
                    tip_other: $('#add_gift_box2-display').val(), 
                },
            }).done(function( response ){
                
                if( ! response.success ){

                    if( response.data.code == 101 ){
                        var max = response.data.errorData.max_quantity;
                        var id = response.data.errorData.type_id;
                        $('.donate_quantity[data-typeid="'+id+'"]').val(max).attr('max', max).trigger('change');                        
                    }

                    return false;
                }

                $form.find('[type="submit"]').val( 'Pay $' + response.data.total );
            });

        }, 100 );
    }

    /**
     * Update submit button text
     */
    function updateSubmitButtonText(){
 
        if( $form.find('[name="ajax_purchase_program"]').length ){
            calcAmountPaid();

            var total_amount = 0;

            $('.prices').each(function(){

                var $this = $(this);
                var id = $this.attr('data-typeid');
                var value = $this.val();

                if( value === '' ) value = 0;
                    
                total_amount += parseFloat( value ) * parseInt( $('.tickets_num[data-typeid="'+id+'"]').val() );
                
            });

            $('.donation-box__title').text( '$' + total_amount.toFixed(2) );
        }
        else if( $form.find('[name="ajax_donate_program"]').length ){

            calcAmountDonated();

            var total_amount = 0;

            $('.donate_amount').each(function(){

                var $this = $(this);
                var id = $this.attr('data-typeid');
                var value = $this.val();

                if( value === '' ) value = 0;
                    
                total_amount += parseFloat( value ) * parseInt( $('.donate_quantity[data-typeid="'+id+'"]').val() );
                
            });

            $('.donation-box__title').text( '$' + total_amount.toFixed(2) );
        }

    }
    updateSubmitButtonText();

    // Tip dropdown
    $('#add_gift_box').change(function(){
        updateSubmitButtonText();
    });

    // when ticket num change
    $('.tickets_num').on('change input', function(){
        updateSubmitButtonText();
    });

    // when donation quantity change
    $('.donate_quantity').on('change input', function(){
        updateSubmitButtonText();
    });

    // when donation change
    $('.enter-amount__input--display').on('input', function(){
        updateSubmitButtonText();

        var $this = $(this);
        var value = $this.val();
        var max = $this.attr('data-max') ? $this.attr('data-max') : 999999;
        var min = $this.attr('data-min') ? $this.attr('data-min') : 0;

        if( value === '' || value === '.00' ){
            value = 0;
        }

        value = parseFloat( value );

        if( value == 0 ){

            if( formErrors.hasOwnProperty( $this.attr('name') ) ){
                delete formErrors[$this.attr('name')];
            }

            $this.removeClass('error').parent().next('.donation-amount-error').hide();
        }
        else if( value < min ){
            formErrors[$this.attr('name')] = true;
            $this.addClass('error').parent().next('.donation-amount-error').show();
        }
        else if( value > max ){
            formErrors[$this.attr('name')] = true;
            $this.addClass('error').parent().next('.donation-amount-error').show();
        }
        else{
            if( formErrors.hasOwnProperty( $this.attr('name') ) ){
                delete formErrors[$this.attr('name')];
            }

            $this.removeClass('error').parent().next('.donation-amount-error').hide();
        }
        
    });    

    // when other donation amount is changed
    $('#add_gift_box2-display').on('input', function(){
        updateSubmitButtonText();
    });


})(jQuery);