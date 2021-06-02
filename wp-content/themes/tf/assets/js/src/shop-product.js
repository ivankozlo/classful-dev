/**
 * Dashboard/shop/product js part
 * @author sabri taieb
 * @link https://delabon.com
 */
(function($){

    var $form = $('#product-form');
    var $modalEducationStandards = $('#modal-education-standards');

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

    /**
     * Submit form
     * 
     * @param {string} status 
     * @param {object} $btn 
     */
    function submitForm( status, $btn ){

        $form.find('.form-notice').remove();
        $form.find('.error').removeClass('error');

        var data = {};
        data.nonce = $form.find('[name="nonce"]').val();
        data.title = $form.find('[name="title"]').val();
        data.product_type = $form.find('[name="product_type"]').val();
        data.description = $form.find('[name="description"]').val();
        data.is_visible = $form.find('[name="is_visible"]').val();
        data.copyright = $form.find('[name="copyright"]').val();
        data.intended_audience = $form.find('[name="intended_audience"]').val();
        data.video_type = $form.find('[name="video_type"]').val();
        data.is_free = $form.find('[name="price_per_license"]:checked').val().toLowerCase() === 'free' ? 1 : 0;
        data.license_price = $form.find('[name="license_price"]').val();
        data.additional_license_price = $form.find('[name="additional_license_price"]').val();
        data.education_standard = $modalEducationStandards.find('[name="esm_type_select"]').val();
        data.education_standard_cselc_cose = [];
        data.education_standard_cselc_kol = [];
        data.education_standard_cselc_vaau = [];
        data.grades = [];

        if( data.copyright == 0 || data.copyright === '' ){
            
            var noticeMarkup = getNotice('Please agree to the copyright terms to continue.', true);
            var $notice = $(noticeMarkup);

            $form.prepend($notice);
            
            $('html, body').animate({
                scrollTop: $notice.offset().top - 20
            }, 300);
            
            return false;
        }

        if( status === 'draft' ){
            data.is_visible = 0;
        }

        // Prepare grades 
        $form.find('[name="grades[]"]:checked').each(function(){
            data.grades.push($(this).val());
        });

        // Prepare Education standard - cselc cose
        $modalEducationStandards.find('.esm_type_tab:not(.__hidden) [type="checkbox"][data-parent="standard_cselc_cose"]:checked').each(function(){
            data.education_standard_cselc_cose.push($(this).val());
        });

        // Prepare Education standard - cselc kol
        $modalEducationStandards.find('.esm_type_tab:not(.__hidden) [type="checkbox"][data-parent="standard_cselc_kol"]:checked').each(function(){
            data.education_standard_cselc_kol.push($(this).val());
        });

        // Prepare Education standard - cselc vaau
        $modalEducationStandards.find('.esm_type_tab:not(.__hidden) [type="checkbox"][data-parent="standard_cselc_vaau"]:checked').each(function(){
            data.education_standard_cselc_vaau.push($(this).val());
        });
        
        // Prepare action
        var $id = $form.find('[name="id"]');

        if( $id.length ){
            data.id = $id.val();
            data.ajax_update_product = true;
        }
        else{
            data.ajax_add_new_product = true;
        }

        // Prepare FormData
        var formData = new FormData();
        
        for( var key in data ){
            formData.append( key, data[key] );
        }

        // Get product image
        var productImage = productImageFileM.getFile();

        if( productImage ){
            formData.append( 'product_image', productImage );
        }

        // Get product file
        var productFile = productMainFileM.getFile();

        if( productFile ){
            formData.append( 'product_file', productFile );
        }

        // Get product additional files
        var productAdditionFiles = productAdditionalFileM.getFiles();

        if( productAdditionFiles && productAdditionFiles.length ){
            productAdditionFiles.map(function( file, i ){
                formData.append( 'product_additiona_file_' + i, file );
            });
        }
        
        $btn.addClass('disabled').prop('disabled', true);

        $.ajax({
            url: $form.attr('action'),
            method: 'POST',
            data: formData,
            contentType: false,
            cache: false,
            processData: false,
        }).done(function(response){

            console.log(response);

            if( response.success ){
                location.href = '/dashboard/shop/';
            }
            else{
                $btn.removeClass('disabled').prop('disabled', false);

                response.data.map(function( error ){
                        
                    if( error.type === 'flash' ){
                        location.reload();
                    }
                    else if( error.type === 'notice' ){
                        var $notice = $(getNotice(error.message));
                        $form.prepend($notice);   
                    }
                    else if( error.type === 'alert' ){
                        alert( error.message );
                    }
                    else if( error.type === 'input' ){
                        $form.find(error.input).addClass('error');
                    }
                    else if( error.type === 'scroll' ){
                        $('html, body').animate({
                            scrollTop: $form.offset().top - 20
                        }, 300);
                    }
                });

                if( $form.find('.error:first').length ){
                    $('html, body').animate({
                        scrollTop: $form.find('.error:first').offset().top - 80
                    }, 300);
                }

                if( $form.find('.form-notice:first').length ){
                    $('html, body').animate({
                        scrollTop: $form.find('.form-notice:first').offset().top - 20
                    }, 300);
                }

            }
        
        }).fail(function(error){
            console.log(error);
        });
    }

    // When form submitted
    $('[data-action="publish_shop_product"]').on('click', function(e){
        e.preventDefault();
        submitForm('publish', $(this));
    });

    $form.on('submit', function(e){
        e.preventDefault();
        submitForm('publish', $('[data-action="publish_shop_product"]'));
    });

    // When save for later is clicked
    $('[data-action="draft_shop_product"]').on('click', function(e){
        e.preventDefault();
        submitForm('draft', $(this));
    });

    // When price type is changed
    $('[name="price_per_license"]').on('change', function(){
        if( $(this).val().toLowerCase() === 'free'){
            $form.find('.price_wrapper').addClass('__hidden');
        }
        else{
            $form.find('.price_wrapper').removeClass('__hidden');
        }
    });

    /********************************************************************************
     * Education standards modal
     ********************************************************************************/

    function updateEducationStandardsPreview(){

        var output = '';

        $('.esm_type_tab:not(.__hidden)').find('[type="checkbox"]:checked').each(function(){
            var $item = $(this);
            output += '<li data-parent="' + $item.attr('data-parent') + '" data-id="' + $item.val() + '"><span>' + $item.attr('data-name') + '</span><span class="__delete">&times</span></li>';
        });

        $('.education-standards-preview ul').html(output);
        
        if( $('[name="esm_type_select"]').val() != 0 ){
            PRODUCT_EDUCATION_STANDARDS.map(function(item){
                if( $('[name="esm_type_select"]').val() == item.term_id ){
                    $('.education-standards-preview > strong').text( item.name );
                }
            });
        }
        else{
            $('.education-standards-preview > strong').text('');
            $('.education-standards-preview ul').html('');
        }
    }

    // Open modal
    $('[data-action="open_education_standards_modal"]').on('click', function(e){
        e.preventDefault();
        $modalEducationStandards.modal('show')
    });

    // When type of standards is changed (left side)
    $('[name="esm_type_radio"]').on('change', function(){

        var $this = $(this);
        var value = $this.val();
        
        $('[name="esm_type_select"]').val(value);
        $modalEducationStandards.find('.esm_type_tab').addClass('__hidden').filter('[data-id="'+value+'"]').removeClass('__hidden');

        updateEducationStandardsPreview();
    });

    // When type of standards is changed (right side)
    $('[name="esm_type_select"]').on('change', function(){

        var value = $(this).val();
        
        $('[name="esm_type_radio"]').filter(':checked').removeAttr('checked').prop('checked', false);
        $('[name="esm_type_radio"][value="' + value + '"]').attr('checked','checked').prop('checked', true);
        $modalEducationStandards.find('.esm_type_tab').addClass('__hidden').filter('[data-id="'+value+'"]').removeClass('__hidden');

        updateEducationStandardsPreview();
    });

    // When modal checkbox is changed
    $('.esm_type_tab [type="checkbox"]').on('change', function(){

        var $this = $(this);
        
        if( $this.prop('checked') ){
            $this.attr('checked', 'checked');
        }
        else{
            $this.removeAttr('checked');
        }
    
        updateEducationStandardsPreview();
    });

    // When preview delete button is clicked
    $(document).on('click', '.education-standards-preview li .__delete', function(e){
        e.preventDefault();

        var $this = $(this);
        var $parent = $this.parent();

        $modalEducationStandards.find('[data-parent="' + $parent.attr('data-parent') + '"][value="' + $parent.attr('data-id') + '"]').prop('checked', false).removeAttr('checked');
        $parent.remove();
    });

    /********************************************************************************
     * Product featured image
     ********************************************************************************/

    var productImageFileM = new FileManag({
        selector: '#product-form [name="product_image"]',
        isMultiple: false,
        isImageEditable: true,
        croppingAreaSelector: '#product-image-cropping-area',
        dropAreaSelector: '#drop-area-product-image',
        allowedMimes: [
            'image/jpg',
            'image/jpeg',
            'image/png',
            'image/gif', 
        ],
    });

    /********************************************************************************
     * Product main file
     ********************************************************************************/

    var productMainFileM = new FileManag({
        selector: '#product-form [name="product_file"]',
        isMultiple: false,
        isImageEditable: true,
        croppingAreaSelector: '#product-file-cropping-area',
        dropAreaSelector: '#drop-area-product-file',
        allowedMimes: [
            'image/jpg',
            'image/jpeg',
            'image/png',
            'image/gif', 
            'application/pdf', 
            'application/msword', // doc 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
            'video/mp4', // mp4, m4v 
            'video/webm',
            'video/avi', 
            'video/quicktime', // mov
            'audio/mpeg', // mp3, m4a, m4b
            'audio/wav',
            'audio/aac',
        ],
    });

    /********************************************************************************
     * Product additional files
     ********************************************************************************/

    var productAdditionalFileM = new FileManag({
        selector: '#product-form [name="product_additional_files"]',
        isMultiple: true,
        isImageEditable: true,
        croppingAreaSelector: '#product-additional-files-cropping-area',
        dropAreaSelector: '#drop-area-product-additional-files',
        allowedMimes: [
            'image/jpg',
            'image/jpeg',
            'image/png',
            'image/gif', 
            'application/pdf', 
            'application/msword', // doc 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
            'video/mp4', // mp4, m4v 
            'video/webm',
            'video/avi', 
            'video/quicktime', // mov
            'audio/mpeg', // mp3, m4a, m4b
            'audio/wav',
            'audio/aac',
        ],
    });

    /********************************************************************************
     * Edit Mode
     ********************************************************************************/
    if( window.hasOwnProperty('PRODUCT_DATA') ){
        
        $form.prepend('<input type="hidden" name="id" value="' + PRODUCT_DATA.id + '">');
        $form.find('[name="title"]').val(PRODUCT_DATA.title);
        $form.find('[name="description"]').val(PRODUCT_DATA.description);
        $form.find('[name="video_type"]').val(PRODUCT_DATA.video_type);
        $form.find('[name="intended_audience"]').val(PRODUCT_DATA.intended_audience);
        $form.find('[name="product_type"]').val(PRODUCT_DATA.type);

        // Price
        if( PRODUCT_DATA.price > 0 ){
            $form.find('[name="license_price"]').val(PRODUCT_DATA.price);
            $form.find('[name="additional_license_price"]').val(PRODUCT_DATA.additional_license_price);
            $form.find('[name="price_per_license"]').prop('checked', false).removeAttr('checked');
            $form.find('[name="price_per_license"][value="Price"]').prop('checked', true).attr('checked', 'checked').trigger('change');
        }

        // Visibility
        if( PRODUCT_DATA.status === 'publish' ){
            $form.find('[name="is_visible"]').val(1).prop('checked', true).attr('checked', 'checked');
        }

        // Featured image
        if( PRODUCT_DATA.image_id ){
            productImageFileM.setFile( PRODUCT_DATA.image );
        }

        // Main file
        if( PRODUCT_DATA.files.length ){
            productMainFileM.setFile( PRODUCT_DATA.files[0] );

            // Delete main file
            PRODUCT_DATA.files = PRODUCT_DATA.files.filter(function(item, i){
                if( i === 0 ) return false;
                return true;
            });
        }

        // Additional files
        PRODUCT_DATA.files.map(function(item){
            productAdditionalFileM.setFile(item);
        });

        // Grades
        PRODUCT_DATA.grades.map(function(item){
            $form.find('[name="grades[]"][value="' + item + '"]').prop('checked', true).attr('checked', 'checked');
        });

        // Education standard
        $modalEducationStandards.find('[name="esm_type_select"]').val( PRODUCT_DATA.education_standard );

        // Education standard - CSELC - COSE
        PRODUCT_DATA.education_standard_cselc_cose.map(function(item){
            $modalEducationStandards.find('[data-parent="standard_cselc_cose"][value="' + item + '"]').prop('checked', true).attr('checked', 'checked');
        });

        // Education standard - CSELC - KOL
        PRODUCT_DATA.education_standard_cselc_kol.map(function(item){
            $modalEducationStandards.find('[data-parent="standard_cselc_kol"][value="' + item + '"]').prop('checked', true).attr('checked', 'checked');
        });

        // Education standard - CSELC - VAAU
        PRODUCT_DATA.education_standard_cselc_vaau.map(function(item){
            $modalEducationStandards.find('[data-parent="standard_cselc_vaau"][value="' + item + '"]').prop('checked', true).attr('checked', 'checked');
        });

        updateEducationStandardsPreview();
    }

})(jQuery);