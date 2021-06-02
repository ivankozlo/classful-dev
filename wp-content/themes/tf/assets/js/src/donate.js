/**
 * Donate
 * @author sabri taieb
 * @link https://delabon.com
 */
(function($){

    /**
     * Checkout Class
     */
    var Checkout = function(){

        // vars
        this.$form = jQuery('form.woocommerce-checkout');
        this.$firstName = $('[name="billing_first_name"]');
        this.$lastName = $('[name="billing_last_name"]');
        this.stripe = null;

        if( window.hasOwnProperty('Stripe') ){
            this.stripe = Stripe(donateParams.stripe_client_id);
        }

        this.events();
    }

    /**
     * CC Save Step 1
     * Create a payment method.
     * Used when save cc is checked
     * 
     * @param {object} data
     */
    Checkout.prototype.stripeCreateCustomer = function(data){

        var self = this;

        data.ajax_stripe_create_customer = true; // ajax action

        $.ajax({
            cache: false,
            url: '/ajax/stripe/',
            method: "POST",
            data: data,
        }).done(function( response ){

            if( ! response.success ){
                if( response.data.type === 'flash' ){
                    location.reload();
                }
            }
            else{
                delete data.ajax_stripe_create_customer;
                data.customer_id = response.data.id;
                self.$form.prepend('<input type="hidden" name="stripe_customer_id" value="'+data.customer_id+'">');
                self.stripeCreateSetupIntent( data );
            }

        });
    }

    /**
     * CC Save Step 2
     * Create a payment method.
     * Used when save cc is checked
     * 
     * @param {object} data
     */
    Checkout.prototype.stripeCreateSetupIntent = function(data){

        var self = this;

        data.ajax_stripe_create_setup_intent = true; // ajax action

        $.ajax({
            cache: false,
            url: '/ajax/stripe/',
            method: "POST",
            data: data,
        }).done(function( response ){

            if( ! response.success ){
                if( response.data.type === 'flash' ){
                    location.reload();
                }
            }
            else{
                delete data.ajax_stripe_create_setup_intent;
                self.stripeCreatePaymentMethod( response.data.client_secret, data );
            }

        });
    }

    /**
     * CC Save Step 3
     * Create a payment method.
     * Used when save cc is checked
     * 
     * @param {string} clientSecrect
     * @param {object} data
     */
    Checkout.prototype.stripeCreatePaymentMethod = function( clientSecrect, data){

        var self = this;

        data.ajax_stripe_create_payment_method = true; // ajax action
        data.name = self.$firstName.val() + ' ' + self.$lastName.val();

        $.ajax({
            cache: false,
            url: '/ajax/stripe/',
            method: "POST",
            data: data,
        }).done(function( response ){

            if( ! response.success ){
                if( response.data.type === 'flash' ){
                    location.reload();
                }
            }
            else{
                delete data.ajax_stripe_create_payment_method;

                if( self.$form.find('[name="stripe_payment_method"]').length ){

                    self.$form.find('[name="stripe_payment_method"]').val(response.data.id);
                    self.$form.find('[name="stripe_payment_method_brand"]').val(response.data.brand);
                    self.$form.find('[name="stripe_payment_method_last_4"]').val(response.data.last_4);
                }
                else{

                    self.$form.prepend('<input type="hidden" name="stripe_payment_method" value="'+response.data.id+'">');
                    self.$form.prepend('<input type="hidden" name="stripe_payment_method_brand" value="'+response.data.brand+'">');
                    self.$form.prepend('<input type="hidden" name="stripe_payment_method_last_4" value="'+response.data.last_4+'">');
                }

                self.stripeConfirmCardSetup( clientSecrect, response.data.id );
            }

        });
    }

    /**
     * CC Save Step 4
     * Stripe setup intent confirm card setup
     * 
     * @param {string} clientSecrect
     * @param {*} paymentMethodID 
     */
    Checkout.prototype.stripeConfirmCardSetup = function( clientSecret, paymentMethodID ){

        var self = this;

        this.stripe.confirmCardSetup(
            clientSecret,
            {
                payment_method: paymentMethodID, // payment method id
            }
        ).then(function(result){
            
            // Display error.message in your UI.
            if( result.error ){
                alert(error.message);
            } 
            // Success
            else {
                //console.log(result);
                self.stripeCharge();
            }
        });
    }

    /**
     * CC Save Step 5
     * Charge with setup intent payment method
     */
    Checkout.prototype.stripeCharge = function(){

        var self = this;

        $.ajax({
            cache: false,
            url: self.$form.attr('action'),
            method: "POST",
            data: self.$form.serialize(),
        }).done(function( response ){
            self.handleAjaxSubmitResponse(response);
        });
    }

    /**
     * Create stripe charge token (used to charge without saving cc)
     * 
     * @param {object} data
     */
    Checkout.prototype.stripeRequestChargeToken = function(data){

        var self = this;

        data.ajax_stripe_create_card_token = true; // ajax action

        $.ajax({
            cache: false,
            url: '/ajax/stripe/',
            method: "POST",
            data: data,
        }).done(function( response ){

            delete data.ajax_stripe_create_card_token;

            if( ! response.success ){
                if( response.data.type === 'flash' ){
                    location.reload();
                }
            }
            else{

                if( self.$form.find('[name="stripeToken"]').length ){
                    self.$form.find('[name="stripeToken"]').val(response.data.id);
                }
                else{
                    self.$form.prepend('<input type="hidden" name="stripeToken" value="'+response.data.id+'">');
                }

                self.stripeCharge();
            }

        });
    }

    /**
     * Charge with saved payment method
     * 
     * @param {string} paymentMethodId
     */
    Checkout.prototype.stripeCheckSavedCard = function( paymentMethodId ){

        var self = this;
    
        $.ajax({
            cache: false,
            url: '/ajax/stripe/',
            method: "POST",
            data: {
                ajax_stripe_check_saved_card: true, // ajax action
                payment_method_id: paymentMethodId,
            },
        }).done(function( response ){

            if( ! response.success ){
                if( response.data.type === 'flash' ){
                    location.reload();
                }
            }
            else{

                if( self.$form.find('[name="stripe_customer_id"]').length ){
                    self.$form.find('[name="stripe_customer_id"]').val(response.data.customer_id);
                }
                else{
                    self.$form.prepend('<input type="hidden" name="stripe_customer_id" value="'+response.data.customer_id+'">');
                }

                if( self.$form.find('[name="stripe_payment_method"]').length ){
                    self.$form.find('[name="stripe_payment_method"]').val(response.data.id);
                    self.$form.find('[name="stripe_payment_method_brand"]').val(response.data.brand);
                    self.$form.find('[name="stripe_payment_method_last_4"]').val(response.data.last_4);
                }
                else{
                    self.$form.prepend('<input type="hidden" name="stripe_payment_method" value="'+response.data.id+'">');
                    self.$form.prepend('<input type="hidden" name="stripe_payment_method_brand" value="'+response.data.brand+'">');
                    self.$form.prepend('<input type="hidden" name="stripe_payment_method_last_4" value="'+response.data.last_4+'">');
                }

                self.stripeCharge();
            }

        });

    }

    /**
     * All events go here
     */
    Checkout.prototype.events = function(){

        var self = this;

        // When form is submitted
        self.$form.on( 'submit', function(e){
            e.preventDefault();

            // Remove old error classes
            self.$form.find('.error').removeClass('error');

            // Validate inputs
            if( ! self.validateInputs() ) return false;

            // Disable the submit button to prevent repeated clicks:
            self.$form.find('input[type="submit"]').prop('disabled', true);
            // Show loader
            $('.submit-donate-loader').css('display', 'inline-block');
            
            var data = {
                number: jQuery('#paypal_pro-card-number').val().replace(' ', ''),
                cvc: jQuery('#paypal_pro-card-cvc').val(),
                exp_month: jQuery('#paypal_pro-card-expiry').val().split('/')[0],
                exp_year: jQuery('#paypal_pro-card-expiry').val().split('/')[1],
                address_zip: jQuery('#billing_postcode').val() 
            };

            var paymentMethodId = self.$form.find('[name="payment_method"]:checked').val();
            var saveCC = self.$form.find('[name="checkout-save-details"]').val();

            // Charge with saved card
            if( paymentMethodId && paymentMethodId !== 'new' && donateParams.user_id != 0 ){
                self.stripeCheckSavedCard(paymentMethodId);
            }
            // Create a new payment method and charge
            else if( saveCC == 1 ){
                self.stripeCreateCustomer(data);
            }
            // Charge directly
            else{
                self.stripeRequestChargeToken(data);
            }
        });
    }

    /**
     * Validate Form
     * Can be overrided
     */
    Checkout.prototype.validateInputs = function(){

        var $errors = [];

        // Donate amount (only /donate/ page)
        var $donateAmount = $('#form-checkout-teacher-school [name="donate_amount"]');
        var donateAmount = isNaN( parseFloat($donateAmount.val()) ) ? 0 : parseFloat($donateAmount.val()); 
        
        if( $donateAmount.length && donateAmount < 5 ){
            $donateAmount.addClass('error');
            $errors.push($donateAmount);
        }

        // Tip amount
        var $tipOtherAmount = $('[name="add_gift_box2_display"]');
        if( $('[name="add_gift_box"]').val() === 'other' && isNaN( parseFloat( $tipOtherAmount.val() ) ) ){
            $tipOtherAmount.addClass('error');
            $errors.push($tipOtherAmount);
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

        // CC number
        $ccNumber = $('[name="paypal_pro-card-number"]');
        if( $ccNumber.val() === '' || ! this.validateCreditCard( $ccNumber.val().replace(' ', '') ) ){
            $ccNumber.addClass('error');
            $errors.push($ccNumber);
        }

        // CC exp
        $ccExp = $('[name="paypal_pro-card-expiry"]');
        if( ! /^[0-9]{1,2}\/[0-9]{1,2}$/.test( $ccExp.val().replace(/ /g, '') ) ){
            $ccExp.addClass('error');
            $errors.push($ccExp);
        }
        var ccExpParts = $ccExp.val().split('/');
        var ccExpMonth = parseInt( ccExpParts[0] );
        var ccExpYear = parseInt( ccExpParts[1] );

        if( ccExpMonth < 1 || ccExpMonth > 12 ){
            $ccExp.addClass('error');
            $errors.push($ccExp);
        }

        // CVC
        var $cvc = $('[name="paypal_pro-card-cvc"]');
        if( $cvc.val() === '' ){
            $cvc.addClass('error');
            $errors.push($cvc);
        }
        
        if( $errors.length ){

            $errors[0].focus();
            
            $('html, body').animate({
                scrollTop: $errors[0].offset().top - 80
            }, 300);

            return false;
        }

        return true;
    }

    /**
     * Takes a credit card string value and returns true on valid number
     * 
     * @param {int} value 
     */
    Checkout.prototype.validateCreditCard = function( value ){

        // Accept only digits, dashes or spaces
        if (/[^0-9-\s]+/.test(value)) return false;

        // The Luhn Algorithm. It's so pretty.
        var nCheck = 0;
        var bEven = false;
        value = value.replace(/\D/g, "");

        for( var n = value.length - 1; n >= 0; n-- ){

            var cDigit = value.charAt(n);
            var nDigit = parseInt(cDigit, 10);

            if (bEven && (nDigit *= 2) > 9) nDigit -= 9;

            nCheck += nDigit;
            bEven = !bEven;
        }

        return (nCheck % 10) == 0;
    }

    /**
     * Handle ajax submit response
     */
    Checkout.prototype.handleAjaxSubmitResponse = function( response ){
        
        //console.log(response);
    
        if( ! response.success ){

            this.$form.find('input[type="submit"]').prop('disabled', false);
            $('.submit-donate-loader').css('display', 'none');

            if( response.data.type === 'flash' ){
                location.reload();
            }
            else if( response.data.type === 'input' ){
                this.$form.find(response.data.input).addClass('error');
            }

            if( this.$form.find('.error:first').length ){
                $('html, body').animate({
                    scrollTop: this.$form.find('.error:first').offset().top - 80
                }, 300);
            }
        }
        else{
            location.href = '/donate/complete/' + response.data.order_id + '/' + response.data.order_key + '/';
        }
    }

    // to use with event/programs/mass
    window.CheckoutClass = Checkout; 

    ///
    /// Events used on many checkout pages
    ///

    // Init zeros plugin
    $('.jquery-zeros-input').zeros();

    // Disable enter key
    $('html').on('keypress', function(e){
        if (e.keyCode == 13 || e.code.toLowerCase() === 'enter' ){
            return false;
        }
    });

    // Tip dropdown
    $('#add_gift_box').on('change', function(){

        var gift = $('#add_gift_box').val();

        if( gift === 'other' ){
            $('#add_gift_box2_field').css('display', 'block');
            $('#add_gift_box2-display').focus();
        }
        else{
            $('#add_gift_box2_field').css('display', 'none');
        }
    });

    // core.js is required
    $('[name="checkout-save-details"]').on('input', function(){

        var $this = jQuery(this);
        var $parent = $this.closest('.checkout-save-details-wrapper');
        
        if( $this.val() == 1 ){
            $parent.find('.row').removeClass('__hidden');
        }
        else{
            $parent.find('.row').addClass('__hidden');
        }
    });

    // One time or Monthly donation
    $('[name="one_time_or_monthly"]').on('input', function(){

        var $this = $(this);
        var value = $this.val();

        if( value === 'one_time' ){
            $('.checkout-save-details-wrapper').removeClass('__hidden').next('hr').removeClass('__hidden');
        }
        else{
            $('.checkout-save-details-wrapper').addClass('__hidden').next('hr').addClass('__hidden');
        }
    });

    // Show card type image
    $(document).ready(function(){
        $('#paypal_pro-card-number').trigger('keyup');
    });

    // When payment method is changed
    $('[name="payment_method"]').on('change', function(){

        var value = $('[name="payment_method"]:checked').val();

        // new card
        if( value === 'new' ){
            $('.card-inputs-wrapper').removeClass('__hidden');
        }
        else{
            $('.card-inputs-wrapper').addClass('__hidden');
        }
    });

    // when teachers or schools switch is changed 
    $('[name="teachers_or_schools"]').on('input', function(){

        var $this = $(this);
        var value = $this.val();
        var $tax = $('[name="is_tax_deductible"]');

        if( value === 'teachers' ){
            $('.__change_this_singular').text('teacher');
            $('.__change_this_plural').text('teachers');

            $('.__change_this_singular_c').text('Teacher');
            $('.__change_this_plural_c').text('Teachers');

            $('.tax-deductible-or-not-wrapper').removeClass('__hidden');
            $('.school-donation-notice-wrapper').addClass('__hidden');

            if( $tax.val() == 1 ){
                $('.teacher-donation-notice-wrapper').addClass('__hidden');
            }
            else{
                $('.teacher-donation-notice-wrapper').removeClass('__hidden');
            }
        }
        else{
            $('.__change_this_singular').text('school');
            $('.__change_this_plural').text('schools');

            $('.__change_this_singular_c').text('School');
            $('.__change_this_plural_c').text('Schools');

            $('.tax-deductible-or-not-wrapper').addClass('__hidden');

            $('.school-donation-notice-wrapper').removeClass('__hidden');
            $('.teacher-donation-notice-wrapper').addClass('__hidden');
        }

    });

    // when is_tax_deductible is changed
    $('[name="is_tax_deductible"]').on('input', function(){
    
        var $this = $(this);
        var value = $this.val();

        if( value == 1 ){
            $('.teacher-donation-notice-wrapper').addClass('__hidden');
        }
        else{
            $('.teacher-donation-notice-wrapper').removeClass('__hidden');
        }
    });

    ///
    /// Custom code per form
    ///

    // Teacher or School Donation
    if( $('#form-checkout-teacher-school').length ){

        // Init
        var donate = new Checkout;
        window.checkout = checkout; // to use with event/programs/mass
    
        /**
         * Calculate Amount
         */
        function calcAmount(){

            var value = $('[name="donate_amount"]').val();
            var tip_type = $('[name="add_gift_box"]').val();
            var tip_other = $('[name="add_gift_box2_display"]').val();
            var tip = 0;

            if( value === '' ){
                value = 0;
            }

            value = parseFloat( value );

            // calculate tip
            if( tip_type === 'other' ){

                if( tip_other === '' ){
                    tip_other = 0;
                }

                tip = parseFloat( tip_other );
            }
            else{
                tip = (value * parseInt(tip_type)) / 100;
            }

            donate.$form.find('[type="submit"]').val('Pay $' + (value + tip).toFixed(2) );
        }

        // when donate amout is changed
        $('[name="donate_amount"]').on('input', function(){

            var $this = $(this);
            var value = $this.val();
            
            if( value === '' ){
                value = 0;
            }

            value = parseFloat( value );

            if( value < 5 ){
                $this.addClass('error');
                donate.$form.find('.donation-amount-error').show();
            }
            else{
                $this.removeClass('error');
                donate.$form.find('.donation-amount-error').hide();
            }

            calcAmount();
        });

        // When suggested tip is changed
        $('[name="add_gift_box"]').on('change', function(){
            calcAmount();
        });

        // When other tip amount is changed
        $('[name="add_gift_box2_display"]').on('change', function(){
            calcAmount();
        });

    }
    
})(jQuery);