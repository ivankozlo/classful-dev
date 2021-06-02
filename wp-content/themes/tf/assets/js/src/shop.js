/**
 * Dashboard/shop js part
 * @author sabri taieb
 * @link https://delabon.com
 */
(function($){

    var $doc = $(document);
    $modalQuickEdit = $('#modal-product-quick-edit');
    $modalActions = $('#shop-product-list-actions-model');

    /**
     * Get notice markup
     * 
     * @param {string} message 
     * @param {boolean} error 
     * @return {string}
     */
    function getNotice( message, error ){

        error = error || false;

        // Set the icon
        if( ! error ){
            // Info
            $notice_icon = '<i class="fas fa-info-circle"></i>';
            $notice_class = '';
        }
        else{
            // Error
            $notice_icon = '<i class="fas fa-exclamation-triangle"></i>';
            $notice_class = 'error';
        }
        
        return ''+
            '<div class="form-notice '+$notice_class+'">'+
                '<p class="clearfix">'+
                    '<span class="span-message">'+$notice_icon+' '+message+'</span>'+
                    '<span class="span-icon"><i class="fas fa-times"></i></span>'+
                '</p>'+
            '</div>';
    }

    // When order is changed
    $('#shop-list-order-select').on('change', function(){

        var order = $(this).val();

        console.log(order);
        if( order === 'asc' ){
            location.href = SHOP_PARAMS.orderAscUrl;
        }
        else{
            location.href = SHOP_PARAMS.orderDescUrl;
        }
    });

    /********************************************************************************
     * Modal: Quick edit
     ********************************************************************************/

    // Open quick edit modal
    $('[data-action="open-quick-edit-modal"]').on('click', function(e){
        e.preventDefault();

        var id = $(this).attr('data-id');

        SHOP_PRODUCTS.map(function(item){
            if( item.id == id ){
                $modalQuickEdit.find('[name="mqe_id"]').val( item.id );
                $modalQuickEdit.find('[name="mqe_title"]').val( item.name );
                $modalQuickEdit.find('[name="mqe_price"]').val( item.price );
                $modalQuickEdit.find('[name="mqe_price_per_additional_license"]').val( item.additional_license_price );

                if( item.price > 0 ){
                    $modalQuickEdit.find('[name="mqe_price_per_license"][value="Free"]').prop('checked', false).removeAttr('checked');
                    $modalQuickEdit.find('[name="mqe_price_per_license"][value="Price"]').prop('checked', true).attr('checked', 'checked');
                    $modalQuickEdit.find('.mqe_price_wrapper').removeClass('__hidden');
                }
                else{
                    $modalQuickEdit.find('[name="mqe_price_per_license"][value="Free"]').prop('checked', true).attr('checked', 'checked');
                    $modalQuickEdit.find('[name="mqe_price_per_license"][value="Price"]').prop('checked', false).removeAttr('checked');
                    $modalQuickEdit.find('.mqe_price_wrapper').addClass('__hidden');
                }

                if( item.status === 'publish' ){
                    $modalQuickEdit.find('[name="mqe_is_visible"]').val(1).prop('checked', true).attr('checked', 'checked');
                }
                else{
                    $modalQuickEdit.find('[name="mqe_is_visible"]').val(0).prop('checked', false).removeAttr('checked');
                }

                $modalQuickEdit.modal('show');
            }
        });
    });

    // When price type is changed
    $modalQuickEdit.find('[name="mqe_price_per_license"]').on('change', function(){
        if( $(this).val().toLowerCase() === 'price' ){
            $modalQuickEdit.find('.mqe_price_wrapper').removeClass('__hidden');
        }
        else{
            $modalQuickEdit.find('.mqe_price_wrapper').addClass('__hidden');
        }
    });

    // When cancel button is clicked
    $modalQuickEdit.find('[data-action="cancel_quick_edit"]').on('click', function(e){
        e.preventDefault();
        $modalQuickEdit.find('form').get(0).reset();
        $modalQuickEdit.modal('hide');
    });

    // When submit button is clicked
    $modalQuickEdit.find('[data-action="submit_quick_edit_form"]').on('click', function(e){
        e.preventDefault();

        var $btn = $(this);
        var $form = $modalQuickEdit.find('form');

        $form.find('.form-notice').remove();
        $form.find('.error').removeClass('error');

        $btn.addClass('disabled').prop('disabled', true);

        $.ajax({
            url: $form.attr('action'),
            method: 'POST',
            data: $form.serialize().replace(/mqe_/g, '') + '&nonce=' + SHOP_PARAMS.nonce,
            cache: false,
        }).done(function( response ){
            console.log(response);

            $btn.removeClass('disabled').prop('disabled', false);

            if( response.success ){

                var newItem = response.data.data;

                SHOP_PRODUCTS = SHOP_PRODUCTS.map(function( item ){

                    if( item.id == newItem.id ){
                        
                        var $porduct = $('.shop-product-item[data-id="' + item.id + '"]');
                        item.name = newItem.title;

                        $porduct.find('.spi-col-title').text(item.name);

                        if( newItem.is_visible ){
                            item.status = 'publish';
                            $porduct.find('.spi-col-actions .__action_view').removeClass('__hidden');
                        }
                        else{
                            item.status = 'draft';
                            $porduct.find('.spi-col-actions .__action_view').addClass('__hidden');
                        }

                        if( newItem.price == 0 ){
                            item.price = 0;
                            item.additional_license_price = 0;
                            $porduct.find('.spi-col-price').text(0);
                        }
                        else{
                            item.price = newItem.price;
                            item.additional_license_price = newItem.price_per_additional_license;
                            $porduct.find('.spi-col-price').text(item.price);
                        }

                        console.log(newItem.sale);

                        $porduct.find('.spi-col-sale').text(newItem.sale);
                    }

                    return item;
                });

                $modalQuickEdit.modal('hide');
            }
            else{
                        
                if( response.data.type === 'notice' ){
                    var $notice = $(getNotice(response.data.message));
                    $form.prepend($notice);   
                }
                else if( response.data.type === 'input' ){
                    $form.find(response.data.input).addClass('error');
                }

                if( $form.find('.error:first').length ){
                    $modalQuickEdit.find('.modal-body').animate({
                        scrollTop: 0
                    }, 300);
                }

                if( $form.find('.form-notice:first').length ){
                    $modalQuickEdit.find('.modal-body').animate({
                        scrollTop: 0
                    }, 300);
                }
            }

        }).fail(function( error ){
            console.log(error);
        });
        
    });


    /********************************************************************************
     * Modal: Actions
     ********************************************************************************/

    // When select all products is clicked
    $('[name="select_products"]').on('change', function(e){
        if( $(this).prop('checked') ){
            $('[name="product[]"]').prop('checked', true).attr('checked', 'checked');
        }
        else{
            $('[name="product[]"]').prop('checked', false).removeAttr('checked');
        }
    });

    // Open modal
    $('[data-action="open-list-actions-model"]').on('click', function(e){
        e.preventDefault();
        $modalActions.removeClass('__hidden');
    });

    // Close modal
    $doc.on('click', function(e){
        var $this = $(e.target);
        var isModalClicked = $this.is('#shop-product-list-actions-model') || $this.closest('#shop-product-list-actions-model').length;
        var isOpenBtnClicked = $this.is('[data-action="open-list-actions-model"]');

        if( ! isModalClicked && ! isOpenBtnClicked ){
            $modalActions.addClass('__hidden');
        }
    });

    // Delete selected products
    $('[data-action="delete_selected_products"]').on('click', function(e){
        e.preventDefault();

        if( ! confirm('Are you sure?') ){
            return false;
        }
        
        var ids = [];

        $('[name="product[]"]:checked').each(function(){
            ids.push($(this).val());
        });

        $.ajax({
            url: '/ajax/shop/',
            method: 'POST',
            data: {
                ajax_delete_selected_products: true,
                nonce: SHOP_PARAMS.nonce,
                ids: ids,
            },
            cache: false,
        }).done(function( response ){
            location.href = SHOP_PARAMS.dashboardShopUrl;
        }).fail(function( error ){
            console.log(error);
        });

    });

    /**
     * Update the status for the selected products
     */
    function updateStatusForSelectedProducts( status ){

        var ids = [];

        $('[name="product[]"]:checked').each(function(){
            ids.push($(this).val());
        });

        $.ajax({
            url: '/ajax/shop/',
            method: 'POST',
            data: {
                ajax_update_status_selected_products: true,
                nonce: SHOP_PARAMS.nonce,
                status: status,
                ids: ids,
            },
            cache: false,
        }).done(function( response ){

            console.log(response);

            ids.map(function( id ){
                SHOP_PRODUCTS = SHOP_PRODUCTS.map(function(item){
                    if( item.id == id ){
                        item.status = status;

                        if( status === 'publish' ){
                            $('.shop-product-item[data-id="' + id + '"] .spi-col-actions .__action_view').removeClass('__hidden');
                        }
                        else{
                            $('.shop-product-item[data-id="' + id + '"] .spi-col-actions .__action_view').addClass('__hidden');
                        }
                    }

                    return item;
                });
            });

            $modalActions.addClass('__hidden');

        }).fail(function( error ){
            console.log(error);
        });

    }

    // Change status to publish for the selected products
    $('[data-action="publish_selected_products"]').on('click', function(e){
        e.preventDefault();
        updateStatusForSelectedProducts('publish');
    });

    // Change status to draft for the selected products
    $('[data-action="draft_selected_products"]').on('click', function(e){
        e.preventDefault();
        updateStatusForSelectedProducts('draft');
    });

        
})(jQuery);