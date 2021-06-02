/**
 * Shop payment
 * @author sabri taieb
 * @link https://delabon.com
 */
(function($){

    var $form = jQuery('form[name="shop-checkout"]');
    var orig_price = parseFloat( $form.find('[name="price"]').val() );
    var checkout = new CheckoutClass;

    /**
     * Overriding validateInputs
     */
    checkout.validateInputs = function(){

        var $errors = [];

        // Example:
        // var $quantity = $('[name="quantity"]');
        // var quantity = parseInt($quantity.val());
        // if( isNaN( quantity ) || quantity < 1 ){
        //     $quantity.addClass('error');
        //     $errors.push($quantity);
        // }

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
    
    ///
    /// Custom code per form
    ///

    /**
     * Calculate amount for paid events
     */
    function calcAmount(){

        var price = orig_price;
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
        $form.find('[type="submit"]').val('Pay $' + calcAmount());
    }
    updateSubmitButtonText();

    // Tip dropdown
    $('#add_gift_box').on('change', function(){
        updateSubmitButtonText();
    });
    
    // when other donation amount is changed
    $('#add_gift_box2-display').on('input', function(){
        updateSubmitButtonText();
    });

})(jQuery);