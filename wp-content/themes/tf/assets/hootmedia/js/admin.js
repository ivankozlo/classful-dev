(function($){

    /**
     * Checkbox input
    **/
   $('.dlb_input_checkbox' ).click( function( event ){

        var _self = $(this);
        var hidden = _self.find('.__input');
                
        if( hidden.val() == 0 ){
            hidden.val(1);
            _self.attr('data-checked', 1);
        }
        else{
            hidden.val(0);   
            _self.attr('data-checked', 0);
        }

        hidden.trigger('input');
    });

})( jQuery );