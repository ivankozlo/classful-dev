/**
 * Outreach social editor js part
 * @author sabri taieb
 * @link https://delabon.com
 */
(function($){

    if( ! HOOT.body.hasClass('outreach-socials') ) return;

    var fb_size = [ 940, 788 ]; // facebook optimal image size
    var pt_size = [ 564, 846 ]; // pinterest optimal image size
    var tw_size = [ 1024, 512 ]; // twitter optimal image size

    var form_data = {
        social: 'facebook',
        type: 'text',
        text: '',
        media: null,
    };

    var croppa;

    /**
     * Class social file
     * Handle upload, edit, crop etc
     */
    var SocialFile = function(){
        
        this.type = null; // image || video
        this.file = null;
        this.croppa = null;
        
        this.base64 = null;
        this.$ = {};
        this.$.form = $('#hoot-editor');
        this.$.preview = $('#hoot-preview');
        this.$.imageWrapper = $('');
        this.$.videoWrapper = $('');
        this.$.icons = this.$.form.find('.hoot-editor-footer-icons i');
        this.bindEvents();
    }

    /**
     * Bind events
     */
    SocialFile.prototype.bindEvents = function(){

        // When image or video icon is clicked
        this.eventListenForIconClick();

        // When file is selected
        this.eventListenForFileSelect();

        // When rotate buttons are clicked
        this.eventListenForImageRotate();

        // When image save button is clicked
        this.eventListenForImageSave();

        // When image edit button is clicked
        this.eventListenForImageEdit();

        // When delete is clicked
        this.eventListenForFileDelete();
    }

    /**
     * When image or video icon is clicked
     * Open dialog window
     */
    SocialFile.prototype.eventListenForIconClick = function(){

        this.$.icons.on('click', function(e){
            e.preventDefault();
            e.stopPropagation();

            var _self = $(this);
            var file_el = $('#hoot-upload-file');

            if( _self.is('[data-type="image"]') ){
                file_el.attr('accept', 'image/*');
            }
            else if( _self.is('[data-type="video"]') ){
                file_el.attr('accept', 'video/*');
            }

            file_el.trigger('click');
        });
    }

    /**
     * Action when file is selected from file dialog
     */
    SocialFile.prototype.eventListenForFileSelect = function(){

        var _this = this;

        HOOT.doc.on('change', '#hoot-editor #hoot-upload-file', function(e){

            e.preventDefault();

            var tgt = e.target || window.event.srcElement,
            files = tgt.files;
            
            // Destroy old croppa instance
            if( _this.croppa ){
                _this.croppa.destroy();
                _this.croppa = null;
                _this.base64 = null;
            }

            // FileReader support
            if( FileReader && files && files.length ){

                var fr = new FileReader();
                
                // when file is loaded
                fr.onload = function () {

                    var file = files[0];
                    var type = file.type.split('/')[0];
                    
                    if( ! (type === 'image' || type === 'video') ){
                        return false;
                    }

                    _this.base64 = fr.result;
                    _this.type = type;

                    // Editor
                    _this.$.form.attr('data-type', type );
                    _this.$.form.find('.hoot-editor-media').attr('data-mode', 'preview').attr('data-type', type);
                    _this.$.form.find('.hoot-editor-media-preview').find('img, video').remove();

                    // Preview
                    _this.$.preview.attr('data-type', type );

                    // image
                    if( type === 'image' ){
                        
                        _this.file = fr.result;

                        _this.$.form.find('.hoot-editor-footer-icons i').hide();
                        _this.$.form.find('.hoot-editor-media').attr('data-mode', 'edit');
                        _this.$.form.find('.hoot-editor-media-preview').prepend('<img src="'+_this.base64+'">');
                        _this.$.preview.find('.hoot-preview-post-body .__media').html('<img src="'+_this.base64+'">').show();

                        var crop_box_size = fb_size;

                        if( _this.$.form.attr('data-social') === 'twitter' ){
                            crop_box_size = tw_size;
                        }
                        else if( _this.$.form.attr('data-social') === 'pinterest' ){
                            crop_box_size = pt_size;
                        }
                                            
                        _this.croppa = new Croppa({
                            image_url: _this.base64,
                            container: '#hoot-editor .hoot-editor-media-edit .cropping-area',
                            container_size: [ 800, 600 ],
                            crop_box_size: crop_box_size,
                            crop_box_resize: true,
                            show_zoomer: false,
                            cross_origin: true,
                        });
                    }
                    // video
                    else if( type === 'video' ){

                        _this.file = file;
                        
                        _this.$.form.find('.hoot-editor-media-preview').prepend('<video controls src="'+_this.base64+'"></video>');
                        _this.$.preview.find('.hoot-preview-post-body .__media').html('<video controls src="'+_this.base64+'"></video>').show();
                    }

                    _this.$.form.find('#hoot-uploaded-file-url').val('');
                }

                fr.readAsDataURL(files[0]);
            }

        });
    }
    
    /**
     * When rotate buttons are clicked
     */
    SocialFile.prototype.eventListenForImageRotate = function(){
        
        var _this = this;

        // when rotate left is clicked
        this.$.form.find('[data-action="rotate-left"]').on('click', function(e){
            e.preventDefault();
            _this.croppa.rotate_left();
        });

        // when rotate right is clicked
        this.$.form.find('[data-action="rotate-right"]').on('click', function(e){
            e.preventDefault();
            _this.croppa.rotate_right();
        });
    }

    /**
     * When save image is clicked
     */
    SocialFile.prototype.eventListenForImageSave = function(){

        var _this = this;

        this.$.form.find('[data-action="save-croppa-image"]').on('click', function(e){
            e.preventDefault();

            _this.file = _this.croppa.result();

            if( _this.$.form.find('.hoot-editor-media-preview img').length ){
                _this.$.form.find('.hoot-editor-media-preview img').attr( 'src', _this.file );
            }
            else{
                _this.$.form.find('.hoot-editor-media-preview').prepend('<img src="' + _this.file + '">');
            }

            _this.$.form.find('.hoot-editor-media').attr('data-mode', 'preview');
            _this.$.form.find('.hoot-editor-footer-icons i').show();
            _this.$.preview.find('.hoot-preview-post-body .__media').html('<img src="' + _this.file + '">').show();
        });
    }

    /**
     * When edit image is clicked
     */
    SocialFile.prototype.eventListenForImageEdit = function(){

        var _this = this;

        // When edit is clicked
        HOOT.doc.on('click', '#hoot-editor .hoot-editor-media .edit-photo', function(e){
            e.preventDefault();
            _this.$.form.find('.hoot-editor-media').attr('data-mode', 'edit');
        });
    }

    /**
     * When delete is clicked
     */
    SocialFile.prototype.eventListenForFileDelete = function(){

        var _this = this;

        HOOT.doc.on('click', '#hoot-editor .hoot-editor-media .delete-photo', function(e){
            e.preventDefault();
            
            this.file = null;

            var social = _this.$.form.attr('data-social');

            if( social === 'facebook' || social === 'twitter' ){
                _this.$.form.attr('data-type', 'text');
                _this.$.preview.attr('data-type', 'text' );
            }

            if( _this.croppa ){
                _this.croppa.destroy();
                _this.croppa = null;
                _this.base64 = null;
            }

            // reset file input
            var file_el = _this.$.form.find('#hoot-upload-file');
            file_el.replaceWith(file_el.val('').clone(true));

            _this.$.form.find('.hoot-editor-media').removeAttr('data-mode').removeAttr('data-type');
            _this.$.form.find('.hoot-editor-media-preview').find('img, video').remove();
            _this.$.form.find('.hoot-editor-footer-icons i').show();

            _this.$.preview.find('.hoot-preview-post-body .__media').html('').hide();

            if( _this.$.form.attr('data-social') != 'youtube' ){
                _this.$.preview.find('.hoot-preview-post-body .__video_title').html('').hide();
            }
        });

    }

    /**
     * Set file (used in edit post more)
     * 
     * @param {string} file
     * @param {string} type
     */
    SocialFile.prototype.setFile = function( url, type ){

        var _this = this;

        if( type === 'image' ){

            this.urlToBase64( url, function( fileContent ){
    
                _this.type = 'image';
                _this.file = fileContent;
                
                // Destroy old croppa instance
                if( _this.croppa ){
                    _this.croppa.destroy();
                    _this.croppa = null;
                    _this.base64 = null;
                }
    
                // Set image size
                var crop_box_size = fb_size;
    
                if( _this.$.form.attr('data-social') === 'twitter' ){
                    crop_box_size = tw_size;
                }
                else if( _this.$.form.attr('data-social') === 'pinterest' ){
                    crop_box_size = pt_size;
                }
    
                // Load image
                var tmp_image = new Image;
                tmp_image.crossOrigin = "anonymous";
                
                tmp_image.onload = function(e){
                    
                    _this.$.form.find('.hoot-editor-footer-icons i').hide();
                    _this.$.form.find('.hoot-editor-media').attr('data-mode', 'edit').attr('data-type', 'image');
                    _this.$.preview.find('.hoot-preview-post-body .__media').html(tmp_image).show();
    
                    if( _this.$.form.find('.hoot-editor-media-preview img').length ){
                        _this.$.form.find('.hoot-editor-media-preview img').attr('src', tmp_image);
                    }
                    else{
                        _this.$.form.find('.hoot-editor-media-preview').prepend(tmp_image);
                    }
    
                    _this.croppa = new Croppa({
                        image_url: tmp_image,
                        container: '#hoot-editor .hoot-editor-media-edit .cropping-area',
                        container_size: [ 800, 600 ],
                        crop_box_size: crop_box_size,
                        crop_box_resize: true,
                        show_zoomer: false,
                        cross_origin: true,
                    });
                };
    
                // Set image
                tmp_image.src = fileContent;
            
            });
    
        }
        else if( type === 'video' ){

            this.urlToBase64( url, function( fileContent ){
    
                _this.type = 'video';
                _this.file = fileContent;
    
                _this.$.form.find('.hoot-editor-media').attr('data-mode', 'preview').attr('data-type', 'video');
                _this.$.preview.find('.hoot-preview-post-body .__media').html('<video src="' + fileContent + '" ></video>').show();
    
                if( _this.$.form.find('.hoot-editor-media .hoot-editor-media-preview video').length ){
                    _this.$.form.find('.hoot-editor-media .hoot-editor-media-preview video').attr( 'src', fileContent );
                }
                else{
                    _this.$.form.find('.hoot-editor-media .hoot-editor-media-preview').prepend('<video src="' + fileContent + '" ></video>');
                }

            });
        
        }
    }

    /**
     * Convert file url to base64
     * 
     * @param {string} url 
     * @param {function} callback 
     */
    SocialFile.prototype.urlToBase64 = function(url, callback){
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            var reader = new FileReader();
            reader.onloadend = function() {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }

    /** 
     * convert base64/URLEncoded data component to raw binary data held in a string
     */ 
    SocialFile.prototype.base64ToBinary = function(){

        if( ! this.file || this.file === '' ) return false;

        var byteString;
        var dataURI = this.file;

        if( dataURI.split(',')[0].indexOf('base64') >= 0 ){
            byteString = atob(dataURI.split(',')[1]);
        }
        else{
            byteString = unescape(dataURI.split(',')[1]);
        }

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        
        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {type:mimeString});
    }

    /**
     * Return file
     */
    SocialFile.prototype.getFile = function(){
        return this.file;
    }

    var socialFile = new SocialFile();

    /**
     * JS debounce
     * 
     * @param {function} func 
     * @param {int} wait 
     * @param {boolean} immediate 
     */
    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    /**
     * Document click event
     * 
     * Close post tooltip
     * 
     */
    HOOT.doc.on('click', function(e){

        var _self = $(e.target);        
        var is_post_tooltip = _self.is('.custom-tooltip--outreach') 
            || _self.is('.tooltip-trigger--outreach')
            || _self.closest('.custom-tooltip--outreach').length;
                
        if( ! is_post_tooltip ){
            $('.custom-tooltip--outreach').removeClass('show');
        }
    });

    /**
     * Init
     * 
     * + Edit Post 
     */
    HOOT.doc.ready(function(){

        // Post editing mode
        if( HOOT_PARAMS.hasOwnProperty('post') ){
            
            var post = HOOT_PARAMS.post;

            // add a hidden id field
            HOOT.editor_el.prepend('<input type="hidden" class="hoot-editor-input-id" value="'+post.id+'" required>');

            // type 
            HOOT.editor_el.attr( 'data-type', post.post_type );
            HOOT.editor_el.attr( 'data-social', post.post_social );
            HOOT.preview_el.attr( 'data-type', post.post_type );
            HOOT.preview_el.attr( 'data-social', post.post_social );

            // text
            HOOT.editor_el.find('.hoot-editor-input-text-preview').text( post.post_data.text );
            HOOT.preview_el.find('.hoot-preview-post-body .__text').html( HOOT.hashtag_highlighter(post.post_data.text) ).show();

            // media
            if( post.post_data.hasOwnProperty('media') ){
                socialFile.setFile( post.post_data.media, post.post_type );
            }

            // by social
            if( post.post_social === 'pinterest' ){
                HOOT.editor_el.find('.hoot-editor-input-pinterest-board').val( post.post_data.board );
                HOOT.editor_el.find('.hoot-editor-input-url').val( post.post_data.url );                
            }
            else if( post.post_social === 'facebook' ){

                HOOT.editor_el.find( '.hoot-editor-input-facebook-page' ).val( post.post_data.fb_page );
                
                if( post.post_data.videoTitle ){
                    HOOT.editor_el.find( '.hoot-editor-input-video-title' ).val( post.post_data.videoTitle ).trigger('input');
                }
            }
            else if( post.post_social === 'youtube' ){

                if( post.post_data.videoTitle ){
                    HOOT.editor_el.find( '.hoot-editor-input-video-title' ).val( post.post_data.videoTitle ).trigger('input');
                }

                if( post.post_data.videoTags ){
                    HOOT.editor_el.find( '.hoot-editor-input-video-tags' ).val( post.post_data.videoTags );
                }

                if( post.post_data.videoStatus ){
                    HOOT.editor_el.find( '.hoot-editor-input-youtube-status' ).val( post.post_data.videoStatus );
                }

                if( post.post_data.videoCategory ){
                    HOOT.editor_el.find( '.hoot-editor-input-youtube-category' ).val( post.post_data.videoCategory );
                }
            }
            else if( post.post_social === 'linkedin' ){

                if( post.post_data.url ){
                    HOOT.editor_el.find( '.hoot-editor-input-url' ).val( post.post_data.url );
                }
            }
            else if( post.post_social === 'twitter' ){

                if( post.post_data.url ){
                    HOOT.editor_el.find( '.hoot-editor-input-url' ).val( post.post_data.url );
                }
            }

            // Datetime
            var dateObj = HOOT.prepare_date(
                parseInt(post.date_queue_year),
                parseInt(post.date_queue_month), // don't -1 here
                parseInt(post.date_queue_day),
                parseInt(post.date_queue_hours),
                parseInt(post.date_queue_minutes)
            );

            $startDate.setDate({
                year: parseInt(post.date_queue_year),
                month: parseInt(post.date_queue_month), // don't -1 here
                day: parseInt(post.date_queue_day),
                hour: parseInt(post.date_queue_hours_12),
                minute: parseInt(post.date_queue_minutes),
                pam: post.date_queue_pam,
            });

            HOOT.editor_el.find('.hoot-editor-footer-schedule-info span').text( dateObj.format('d M Y h:ia') );
        }
        // New Post mode
        else if( HOOT.editor_el.attr('data-social') === 'facebook' ){
            var $tmp_fb_pages = HOOT.editor_el.find('.hoot-editor-input-facebook-page');
            var tmp_fb_pages = $tmp_fb_pages.find('option');
            $tmp_fb_pages.val(tmp_fb_pages.filter(':not([value="0"]):first').val()).trigger('change');
        }
    });

    /**
     * Post menu click event (Open Tooltip)
     */
    HOOT.doc.on('click', '.tooltip-trigger--outreach', function(e){
        e.preventDefault();

        var tooltip = jQuery(this).closest('.promote-post-panel__single').find('.custom-tooltip--outreach');

        if( !tooltip.hasClass('show') ) {
            tooltip.addClass('show');
        } 
        else{
            tooltip.removeClass('show');
        }
    });

    // When main content lose focus
    HOOT.editor_el.find('.hoot-editor-input-text-preview').on('focusout', function(){
        
        var $preview = HOOT.editor_el.find('.hoot-editor-input-text-preview');        

        if( $preview.text() === "" ){
            $preview.text('Enter your post...');
        }
    });

    // When main content is changed
    HOOT.editor_el.find('.hoot-editor-input-text-preview').on('keypress', function(){
        $(this).removeClass('error');
    });

    // Init datetime picker
    var $startDate = new HOOT.dateTimePickerModal({
        selector: '#hoot-editor .start_date_component',
        step: 5,
    });
    
    if( $startDate instanceof HOOT.dateTimePickerModal ){
        $startDate.on('save', function( date ){
            HOOT.editor_el.find('.hoot-editor-footer-schedule-info span').text( date.format('d M Y h:ia') );
            HOOT.preview_el.find('.__queue_date').text( date.format('d M Y h:ia') );
        });
    }

    // When change schedule is clicked
    HOOT.editor_el.find('.hoot-editor-footer-schedule-info a').on('click', function(e){
        e.preventDefault();
        $startDate.show();
    });

    /**
     * Ajax: Submit
     */

    /**
     * Upload image
     * 
     * @param {function} callback 
     */
    function upload_image( callback ){
        $.post( HOOT_PARAMS.ajaxurl, {
            action: 'hoot_upload_base64_image',
            nonce: HOOT_PARAMS.nonce,
            image: socialFile.getFile(),
        }, function(response){
            callback( response );
        });
    }

    /**
     * Upload video
     * 
     * @param {function} callback 
     */
    function upload_video( callback ){

        var file = socialFile.getFile(); // return JS File instance
        
        if( ! file ){
            callback({
                success: false,
            });
            return;
        }

        var formData = new FormData();
        formData.append('media', file);
        formData.append('action', 'hoot_upload_media');
        formData.append('nonce', HOOT_PARAMS.nonce);
        formData.append('social', HOOT.editor_el.attr('data-social'));
        formData.append('type', HOOT.editor_el.attr('data-type'));

        $.ajax({
            url: HOOT_PARAMS.ajaxurl,
            type: 'POST',
            data: formData,
            contentType: false,
            cache: false,
            processData: false,
            success: function(response){
                callback( response );
            }
        });
    }

    /**
     * Validate inputs
     */
    function validateInputs(){

        var social = HOOT.editor_el.attr('data-social');
        var type = HOOT.editor_el.attr('data-type');
        var errors = [];

        HOOT.editor_el.find('.error').removeClass('error');
        HOOT.editor_el.find('.form-notice').remove();

        if( social === 'facebook' ){

            var $page = HOOT.editor_el.find('.hoot-editor-input-facebook-page');
            var $description = HOOT.editor_el.find('.hoot-editor-input-text-preview');
            var $videoTitle = HOOT.editor_el.find('.hoot-editor-input-video-title');

            if( $description.text() === '' || $description.text() === 'Enter your post...' ){
                errors.push($description);
            }

            if( type === 'image' && ( ! socialFile.getFile() || socialFile.getFile() === '' ) ){
                var $notice = $(HOOT.notice('Invalid image.', true));
                HOOT.editor_el.prepend($notice);
                errors.push($notice);
            }

            if( type === 'video' && ( $videoTitle.val() === '' ) ){
                errors.push($videoTitle);
            }

            if( type === 'video' && ( ! socialFile.getFile() || socialFile.getFile() === '' ) ){
                var $notice = $(HOOT.notice('Invalid video.', true));
                HOOT.editor_el.prepend($notice);
                errors.push($notice);
            }

            if( $page.val() == 0 ){
                errors.push($page);
            }
        }
        else if( social === 'twitter' ){
         
            var $description = HOOT.editor_el.find('.hoot-editor-input-text-preview');
   
            if( type === 'text' && ( $description.text() === '' || $description.text() === 'Enter your post...' ) ){
                errors.push($description);
            }

            if( type === 'image' && ( ! socialFile.getFile() || socialFile.getFile() === '' ) ){
                var $notice = $(HOOT.notice('Invalid image.', true));
                HOOT.editor_el.prepend($notice);
                errors.push($notice);
            }

            if( type === 'video' && ( ! socialFile.getFile() || socialFile.getFile() === '' ) ){
                var $notice = $(HOOT.notice('Invalid video.', true));
                HOOT.editor_el.prepend($notice);
                errors.push($notice);
            }
        }
        else if( social === 'youtube' ){

            var $description = HOOT.editor_el.find('.hoot-editor-input-text-preview');
            var $videoTitle = HOOT.editor_el.find('.hoot-editor-input-video-title');
            var $videoCategory = HOOT.editor_el.find('.hoot-editor-input-youtube-category');
            var $videoStatus = HOOT.editor_el.find('.hoot-editor-input-youtube-status');

            if( $description.text() === '' || $description.text() === 'Enter your post...' ){
                errors.push($description);
            }

            if( $videoTitle.val() === '' ){
                errors.push($videoTitle);
            }

            if( $videoCategory.val() == 0 || $videoCategory.val() === '' ){
                errors.push($videoCategory);
            }

            if( $videoCategory.val() == 0 || $videoCategory.val() === '' ){
                errors.push($videoCategory);
            }

            if( $videoStatus.val() == 0 || $videoStatus.val() === '' ){
                errors.push($videoStatus);
            }

            if( ! socialFile.getFile() || socialFile.getFile() === '' ){
                var $notice = $(HOOT.notice('Invalid video.', true));
                HOOT.editor_el.prepend($notice);
                errors.push($notice);
            }
        }
        else if( social === 'pinterest' ){

            var $board = HOOT.editor_el.find('.hoot-editor-input-pinterest-board');

            if( $board.val() == 0 || $board.val() === '' ){
                errors.push($board);
            }

            if( ! socialFile.getFile() || socialFile.getFile() === '' ){
                var $notice = $(HOOT.notice('Invalid image.', true));
                HOOT.editor_el.prepend($notice);
                errors.push($notice);
            }
        }
        
        if( errors.length ){

            errors.map(function($item){
                $item.addClass('error');
            });

            $('html, body').animate({
                scrollTop: errors[0].offset().top - 70
            }, 500);

            return false;
        }

        return true;
    }

    // submit form
    function submit_form( data, submit_el ){
        $.post( HOOT_PARAMS.ajaxurl, data, function(response){
                         
            if( response.success ){
                location.href = HOOT_PARAMS.tf_outreach_uri + 'scheduled/';
            }
            else{
                if( response.data.hasOwnProperty('errors') ){
                    response.data.errors.map(function( error ){
                        if( error.type === 'alert' ){
                            alert( error.message );
                        }
                        else if( error.type === 'input' ){
                            $(error.input).addClass('error');
                        }
                    });
                }
                else if( response.data.type === 'alert' ){
                    alert( response.data.message );
                }
                else if( response.data.type === 'input' ){
                    $(response.data.input).addClass('error');
                }
                else{
                    location.reload();
                }

                if(  HOOT.editor_el.find('.error:first').length ){
                    $('html, body').animate({
                        scrollTop: HOOT.editor_el.find('.error:first').offset().top - 20
                    }, 500);
                }

                submit_el.removeAttr('disabled');
            }
        });
    }

    // when form is submitted
    HOOT.doc.on('submit', '#hoot-editor', function(e){
        e.preventDefault();     
        
        if( ! validateInputs() ){
            return false;
        }

        var data = form_data;
        var submit_el = HOOT.editor_el.find('[type="submit"]');
        var id_el = HOOT.editor_el.find('.hoot-editor-input-id');

        data.social = HOOT.editor_el.attr('data-social');
        data.type = HOOT.editor_el.attr('data-type');
        
        HOOT.editor_el.find('.error').removeClass('error');        
        submit_el.attr('disabled', 'disabled');        
        
        if( data.social === 'pinterest' ){

            data.type = 'image';
            data.text = HOOT.editor_el.find('.hoot-editor-input-text-preview').text();
            data.board = HOOT.editor_el.find('.hoot-editor-input-pinterest-board').val();
            data.url = HOOT.editor_el.find('.hoot-editor-input-url').val();
        }
        else if( data.social === 'facebook' ){

            data.fb_page = HOOT.editor_el.find('.hoot-editor-input-facebook-page').val();
            data.text = HOOT.editor_el.find('.hoot-editor-input-text-preview').text();
            data.videoTitle = HOOT.editor_el.find('.hoot-editor-input-video-title').val();
        }
        else if( data.social === 'youtube' ){

            data.type = 'video';
            data.text = HOOT.editor_el.find('.hoot-editor-input-text-preview').text();
            data.videoTitle = HOOT.editor_el.find('.hoot-editor-input-video-title').val();
            data.videoTags = HOOT.editor_el.find('.hoot-editor-input-video-tags').val();
            data.videoStatus = HOOT.editor_el.find('.hoot-editor-input-youtube-status').val();
            data.videoCategory = HOOT.editor_el.find('.hoot-editor-input-youtube-category').val();
        }
        else if( data.social === 'linkedin' ){

            data.text = HOOT.editor_el.find('.hoot-editor-input-text-preview').text();
        }
        else if( data.social === 'twitter' ){

            data.text = HOOT.editor_el.find('.hoot-editor-input-text-preview').text();
        }

        data.action = 'hoot_save_post';
        data.nonce = HOOT_PARAMS.nonce;
        data.id = id_el.length ? id_el.val() : 0;
        data.datetime_str = $startDate.toString();
        
        if( data.type === 'image' ){

            upload_image( function( response ){

                if( response.success ){
                    data.media = response.data.url;
                }

                submit_form( data, submit_el );
            });
        }
        else if( data.type === 'video' ){

            upload_video( function( response ){

                if( response.success ){
                    data.media = response.data.url;
                }

                submit_form( data, submit_el );
            });
        }
        else{
            
            submit_form( data, submit_el );
        }
    });

    /**
     * Ajax: Delete Queue Post
     */
    HOOT.doc.on('click', '.custom-tooltip--outreach .__delete', function(e){
        e.preventDefault();

        if( ! confirm( HOOT_PARAMS.queue_delete_confirm ) ){
            return false;
        }

        var _self = $(this);

        _self.closest('.custom-tooltip--outreach').removeClass('show');

        $.post(
            HOOT_PARAMS.ajaxurl, 
            {
                action: 'hoot_delete_queue_post',
                nonce: HOOT_PARAMS.nonce,
                id: _self.attr('data-id'),
            }, 
            function(response){
                if( response.success ){
                    location.reload();
                }
                else{
                    alert( response.data.message );
                }
            }
        );
    });

    /** 
     * Ajax: Sync FB Pages
     */
    HOOT.doc.on('click', '.hoot-btn-sync-fb-pages', function(e){
        e.preventDefault();

        var _self = $(this);
        var text = _self.text();

        if( _self.hasClass('__sync') ) return false;

        _self.addClass('__sync').text('...');
        
        $.post(
            HOOT_PARAMS.ajaxurl, 
            {
                action: 'hoot_sync_fb_pages',
                nonce: HOOT_PARAMS.nonce,
            }, 
            function(response){
                
                if( response.success ){

                    var select_el = $('.hoot-editor-input-facebook-page');

                    select_el.find('option').each(function(i){
                        if( i != 0 ){
                            $(this).remove();
                        }
                    });

                    Object.keys(response.data).map(function( key ){
                        var item = response.data[key];                        
                        select_el.append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                }
                else{
                    alert( response.data.message );
                }

                _self.removeClass('__sync').text( text );
            }
        );
    });

    /**
     * Ajax: Sync Pinterest Boards
     */
    HOOT.doc.on('click', '.hoot-btn-sync-pt-boards', function(e){
        e.preventDefault();

        var _self = $(this);
        var text = _self.text();

        if( _self.hasClass('__sync') ) return false;

        _self.addClass('__sync').text('...');

        $.post(
            HOOT_PARAMS.ajaxurl, 
            {
                action: 'hoot_sync_pt_boards',
                nonce: HOOT_PARAMS.nonce,
            }, 
            function(response){
                if( response.success ){
                    
                    var select_el = $('.hoot-editor-input-pinterest-board');

                    select_el.find('option').each(function(i){
                        if( i != 0 ){
                            $(this).remove();
                        }
                    });

                    response.data.map(function( item ){                        
                        select_el.append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                }
                else{
                    alert( response.data.message );
                }

                _self.removeClass('__sync').text( text );
            }
        );
    });

    /**
     * Ajax: Sync Youtube Categories
     */
    HOOT.doc.on('click', '.hoot-btn-sync-yt-categories', function(e){
        e.preventDefault();
        
        var _self = $(this);
        var text = _self.text();

        if( _self.hasClass('__sync') ) return false;

        _self.addClass('__sync').text('...');

        $.post(
            HOOT_PARAMS.ajaxurl, 
            {
                action: 'hoot_sync_yt_categories',
                nonce: HOOT_PARAMS.nonce,
            }, 
            function(response){

                if( response.success ){
                    
                    var select_el = $('.hoot-editor-input-youtube-category');

                    select_el.find('option').each(function(i){
                        if( i != 0 ){
                            $(this).remove();
                        }
                    });
                    
                    Object.keys(response.data).map(function(key) {
                        var item = response.data[key];
                        select_el.append('<option value="'+item.id+'">'+item.title+'</option>');
                    });
                }
                else{
                    alert( response.data.message );
                }

                _self.removeClass('__sync').text( text );
            }
        );
    });

    // When main content lose focus
    HOOT.editor_el.find('.hoot-editor-input-text-preview').on('focus', function(){
    
        var $preview = HOOT.editor_el.find('.hoot-editor-input-text-preview');        

        if( $preview.text() === "Enter your post..." ){
            $preview.text('');
        }
    });

    // When paste to main content
    // remove html tags
    // add hashtag highlighter
    HOOT.editor_el.find('.hoot-editor-input-text-preview').on('paste', function(e){

        var $this = $(this);
        
        if( (e.ctrlKey && e.keyCode === 86) || typeof e.keyCode === "undefined" || ! e.keyCode ){
            setTimeout(function(){
                console.log(('first'));
                $this.html( HOOT.stripHtml( $this.html() ) );
            }, 30);
        }

    });

    // When main content is changed
    // Find url and fetch a preview of it
    HOOT.editor_el.find('.hoot-editor-input-text-preview').on('keyup', function(e){

        var $this = $(this);

        if( HOOT.editor_el.attr('data-type') !== 'text' ){
            HOOT.preview_el.find('.__url_preview').hide();
            return false;
        }
        
        // Must be executed after the paste event setTimeout
        setTimeout(function(){

            var matches = $this.html().match(/https?::?\/\/.+?(\s|$)/ig);

            if( ! matches ) return false;
            if( ! matches.length ) return false;

            // Get preview
            var url = $.trim(matches[0]);
        
            $.ajax({
                url: "/ajax/outreach/url/preview/",
                method: "POST",
                data: {
                    fetch_url_data: true,
                    url: url,
                }
            }).done(function( response ){

                if( ! response.success ){
                    HOOT.preview_el.find('.__url_preview').hide();
                    return false;
                }

                if( response.data.image ){
                    HOOT.preview_el.find('.__url_preview img').attr( 'src', response.data.image );
                }
                else{
                    HOOT.preview_el.find('.__url_preview img').removeAttr('src');
                }

                if( response.data.domain ){
                    HOOT.preview_el.find('.__url_preview_domain').text( response.data.domain );
                }

                if( response.data.title ){
                    HOOT.preview_el.find('.__url_preview_title').text( response.data.title );
                }

                if( response.data.description ){
                    HOOT.preview_el.find('.__url_preview_description').text( response.data.description_small );
                }

                HOOT.preview_el.find('.__url_preview').attr('href', response.data.url).show();
            });
        
        }, 150);
    });
    
})(jQuery);
