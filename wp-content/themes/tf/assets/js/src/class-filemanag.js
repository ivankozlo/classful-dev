/**
 * Upload manager
 * @author sabri taieb
 * @link https://delabon.com
 */
(function($){

    /**
     * File Manager
     * Handles upload, edit, crop etc
     */
    var FileManag = function( args ){
        
        this.dropAreaSelector = args.dropAreaSelector || null;
        this.previewSelector = args.previewSelector || null; // only if isMultiple is disabled
        this.croppingAreaSelector = args.croppingAreaSelector || null;
        this.selector = args.selector || null;
        this.isMultiple = args.isMultiple || false; // allow multiple uploads (one by one)
        this.isImageEditable = args.isImageEditable || false;
        this.allowedMimes = args.allowedMimes || [];
        this.files = [];
        this.croppa = null;
        this.croppingIndex = 0;
        this.$ = {};

        if( ! this.selector ){
            return new Error("FileManag: Selector option is misssing.");
        }
        
        this.$.el = $(this.selector);

        if( ! this.$.el.length ){
            return new Error("FileManag: Element not found. Please check the selector.");
        }

        if( this.$.el.length > 1 ){
            return new Error("FileManag: Element is not unique. Found " + this.$.el.length + " element with the same selector.");
        }

        if( this.dropAreaSelector ){
            this.$.dropArea = $(this.dropAreaSelector);
        }
        else{
            this.$.dropArea = null;
        }

        if( this.previewSelector ){
            this.$.preview = $(this.previewSelector);
        }
        else{
            this.$.preview = null;
        }

        if( this.croppingAreaSelector ){
            this.$.croppingArea = $(this.croppingAreaSelector);

            if( this.isImageEditable && this.$.croppingArea.length === 0 ){
                return new Error("FileManag: Cropping area does not exist(Selector: " + this.croppingAreaSelector + ").");
            }

            if( this.$.croppingArea > 1 ){
                return new Error("FileManag: Cropping area is not unique. Found " + this.$.croppingAreaSelector.length + " element with the same selector.");
            }
        }
        else if( ! this.croppingAreaSelector && this.isImageEditable ){
            return new Error("FileManag: Please set a croppingAreaSelector option or set isImageEditable to false.");
        }
        else{
            this.$.croppingArea = null;
        }

        this.generateId();
        this.bindEvents();
    }

    /**
     * Generate unique id base on the selector
     */
    FileManag.prototype.generateId = function(){

        var str = this.selector;
        var hash = 0;
        var date = new Date();

        if( str.length == 0 ) this.id = date.getTime();

        for (i = 0; i < str.length; i++) {
            char = str.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }

        this.id = hash + date.getTime().toString();        
    }

    /**
     * Bind events
     */
    FileManag.prototype.bindEvents = function(){

        this.eventListenForFileSelect();
        this.eventListenForFileDrop();
        this.eventListenForDropAreaClick();
        this.eventListenForImageRotate();
        this.eventListenForImageSave();
        this.eventListenForImageEdit();
        this.eventListenForFileDelete();

    }

    /**
     * Handle file selection
     */
    FileManag.prototype.handleFileSelection = function( file ){
        
        var _this = this;

        // Destroy old croppa instance
        if( _this.croppa ){
            _this.croppa.destroy();
            _this.croppa = null;
        }

        // FileReader support
        if( FileReader && file instanceof File ){

            var fr = new FileReader();
            
            // when file is loaded
            fr.onload = function () {

                var type = file.type.split('/')[0];
                
                // allowed mimes only
                if( _this.allowedMimes.length && ! _this.allowedMimes.includes( file.type ) ){
                    alert('This type of file is not allowed.');
                    return false;
                }

                if( ! file.type || file.type === '' || file.type === undefined ){
                    var nameParts = file.name.split('.');
                    type = nameParts[ nameParts.length - 1 ];
                }
                else{
                    type = file.type.split('/')[0];
                }

                var fileObject = {
                    file: file,
                    type: type,
                };

                if( type === 'image' && _this.isImageEditable ){
                    
                    fileObject.base64 = fr.result;
                    fileObject.origBase64 = fr.result;
                    
                    // Make sure the .cropping-area div exists
                    if( ! _this.$.croppingArea.find('.cropping-area').length ){
                        _this.$.croppingArea.prepend('<div class="cropping-area"></div>');
                    }

                    _this.$.croppingArea.find('.cropping-area-controls').removeClass('__hidden');

                    // Init Croppa
                    _this.croppa = new Croppa({
                        image_url: fr.result,
                        container: _this.croppingAreaSelector + ' .cropping-area',
                        container_size: [ 800, 600 ],
                        crop_box_size: [600, 400],
                        crop_box_resize: true,
                        show_zoomer: false,
                        cross_origin: true,
                    });

                    // Scroll to cropping area
                    _this.croppa.on('load', function( me ){
                        $('html, body').animate({
                            scrollTop: _this.$.croppingArea.offset().top - 20
                        }, 500);
                    });
                }
                else if( type === 'video' || type === 'image' ){
                    fileObject.base64 = fr.result;
                    fileObject.origBase64 = fr.result;
                }

                if( _this.isMultiple ){
                    _this.files.push( fileObject );
                    $( _this.previewMarkup( fileObject, (_this.files.length - 1), true, true ) ).insertBefore( _this.$.el );
                }
                else{

                    // override the array
                    _this.files = [fileObject]; 

                    // Preview
                    if( _this.$.dropArea ){
                        _this.$.dropArea.addClass('__hidden');
                    }
                    
                    // Delete old preview
                    $('.uploaded-file-preview[data-parent="' + _this.id + '"][data-index="0"]').remove();
                    
                    // Insert the new one
                    var $preview = $( _this.previewMarkup( fileObject, 0, true, true ) );
                    $preview.insertBefore( _this.$.el );

                    setTimeout(function(){
                        $('html, body').animate({
                            scrollTop: $preview.offset().top - 20
                        }, 200);
                    }, 20);
                }

                if( type === 'image' && _this.isImageEditable ){
                    _this.croppingIndex = _this.files.length - 1;
                }
            }

            fr.readAsDataURL(file);
        }
    }

    /**
     * Handle file selection ( No croppa init, no scroll)
     * Used by setFile
     */
    FileManag.prototype.handleBasicFileSelection = function( file ){
        
        var _this = this;

        // Destroy old croppa instance
        if( _this.croppa ){
            _this.croppa.destroy();
            _this.croppa = null;
        }

        // FileReader support
        if( FileReader && file instanceof File ){

            var fr = new FileReader();
            
            // when file is loaded
            fr.onload = function () {

                var type = file.type.split('/')[0];
                
                // allowed mimes only
                if( _this.allowedMimes.length && ! _this.allowedMimes.includes( file.type ) ){
                    alert('This type of file is not allowed.');
                    return false;
                }

                if( ! file.type || file.type === '' || file.type === undefined ){
                    var nameParts = file.name.split('.');
                    type = nameParts[ nameParts.length - 1 ];
                }
                else{
                    type = file.type.split('/')[0];
                }

                var fileObject = {
                    file: file,
                    type: type,
                };

                if( type === 'video' || type === 'image' ){
                    fileObject.base64 = fr.result;
                    fileObject.origBase64 = fr.result;
                }

                if( _this.isMultiple ){
                    _this.files.push( fileObject );
                    $( _this.previewMarkup( fileObject, (_this.files.length - 1), true, true ) ).insertBefore( _this.$.el );
                }
                else{

                    // override the array
                    _this.files = [fileObject]; 

                    // Preview
                    if( _this.$.dropArea ){
                        _this.$.dropArea.addClass('__hidden');
                    }
                    
                    // Delete old preview
                    $('.uploaded-file-preview[data-parent="' + _this.id + '"][data-index="0"]').remove();
                    
                    // Insert the new one
                    var $preview = $( _this.previewMarkup( fileObject, 0, true, true ) );
                    $preview.insertBefore( _this.$.el );
                }

                if( type === 'image' && _this.isImageEditable ){
                    _this.croppingIndex = _this.files.length - 1;
                }

            }

            fr.readAsDataURL(file);
        }
    }

    /**
     * Action when file is selected from file dialog
     */
    FileManag.prototype.eventListenForFileSelect = function(){

        var _this = this;

        this.$.el.on('change', function(e){
            e.preventDefault();

            var tgt = e.target || window.event.srcElement,
            files = tgt.files;
            
            if( files.length ){
                _this.handleFileSelection(files[0]);
            }
        });
    }
    
    /**
     * Action when file is dropped
     */
    FileManag.prototype.eventListenForFileDrop = function(){

        var _this = this;

        if( ! _this.dropAreaSelector ) return;
        if( ! _this.$.dropArea.length ) return;

        _this.$.dropArea.on('dragenter', function(e){
            e.preventDefault();
        });
    
        _this.$.dropArea.on('dragover', function(e){
            e.preventDefault();
        });

        _this.$.dropArea.on('drop', function(e){
            e.preventDefault();
            
            var files = e.originalEvent.dataTransfer.files;

            if( files.length ){
                _this.handleFileSelection( files[0] );
            }
        });
    }

    /**
     * Action when drop area is clicked
     */
    FileManag.prototype.eventListenForDropAreaClick = function(){

        var _this = this;

        if( ! this.dropAreaSelector ) return;
        if( ! this.$.dropArea.length ) return;

        this.$.dropArea.on('click', function(e){
            _this.$.el.trigger('click');
        });

    }

    /**
     * When rotate buttons are clicked
     */
    FileManag.prototype.eventListenForImageRotate = function(){
        
        var _this = this;

        if( ! _this.isImageEditable ) return;

        // when rotate left is clicked
        this.$.croppingArea.find('[data-action="rotate-left"]').on('click', function(e){
            e.preventDefault();
            if( ! _this.croppa ) return;
            _this.croppa.rotate_left();
        });

        // when rotate right is clicked
        this.$.croppingArea.find('[data-action="rotate-right"]').on('click', function(e){
            e.preventDefault();
            if( ! _this.croppa ) return;
            _this.croppa.rotate_right();
        });
    }

    /**
     * When save image is clicked
     */
    FileManag.prototype.eventListenForImageSave = function(){

        var _this = this;

        if( ! _this.isImageEditable ) return;

        this.$.croppingArea.find('[data-action="save-croppa-image"]').on('click', function(e){
            e.preventDefault();

            var date = new Date();
            var base64 = _this.croppa.result();
            var blob = _this.base64ToBinary( base64 ); // convert it to Blob
            // jpeg because Croppa returns jpeg base64 image
            var file = new File( [blob], "img-" + date.getTime() + ".jpeg", {type:"image/jpeg", lastModified:date} );

            // Updated files with the new image
            _this.files = _this.files.map(function(item, i){

                if( i === _this.croppingIndex ){
                    return {
                        file: file,
                        type: 'image',
                        base64: base64,
                        origBase64: item.origBase64,
                    }
                }

                return item;
            });

            // Disable edit mode
            _this.$.croppingArea.find('.cropping-area-controls').addClass('__hidden');
            _this.croppa.destroy();
            _this.croppa = null;

            // Replace preview
            var $preview = $( _this.previewMarkup( _this.files[ _this.croppingIndex ], _this.croppingIndex, true, true ) );
            $('.uploaded-file-preview[data-parent="' + _this.id + '"][data-index="' + _this.croppingIndex + '"]').replaceWith($preview);
            
            // Scroll to the new preview
            $('html, body').animate({
                scrollTop: $preview.offset().top - 20
            }, 300);
        });
    }

    /**
     * When edit image is clicked
     */
    FileManag.prototype.eventListenForImageEdit = function(){

        var _this = this;

        if( ! _this.isImageEditable ) return;

        $(document).on('click', '.uploaded-file-preview [data-action="edit-image"]', function(e){
            e.preventDefault();
            e.stopPropagation();

            var $this = $(this);
            var index =  parseInt($this.closest('.uploaded-file-preview').attr('data-index'));

            if( typeof _this.files[index] === 'undefined') {
                return new Error('FileManag: Cannot edit the image with the index of "' + index + '" because it does not exist.');
            }

            var fileObject = _this.files[index];
            
            // Make sure the .cropping-area div exists
            if( ! _this.$.croppingArea.find('.cropping-area').length ){
                _this.$.croppingArea.prepend('<div class="cropping-area"></div>');
            }

            _this.$.croppingArea.find('.cropping-area-controls').removeClass('__hidden');

            // Init Croppa
            _this.croppa = new Croppa({
                image_url: fileObject.origBase64,
                container: _this.croppingAreaSelector + ' .cropping-area',
                container_size: [ 800, 600 ],
                crop_box_size: [600, 400],
                crop_box_resize: true,
                show_zoomer: false,
                cross_origin: true,
            });

            // Scroll to cropping area
            _this.croppa.on('load', function( me ){
                $('html, body').animate({
                    scrollTop: _this.$.croppingArea.offset().top - 20
                }, 500);
            });

            _this.croppingIndex = index;
        });
    }

    /**
     * When delete is clicked
     */
    FileManag.prototype.eventListenForFileDelete = function(){

        var _this = this;

        $(document).on('click', '.uploaded-file-preview[data-parent="' + this.id + '"] [data-action="delete-file"]', function(e){
            e.preventDefault();
            e.stopPropagation();

            var $this = $(this);
            var index =  parseInt($this.closest('.uploaded-file-preview').attr('data-index'));

            if( typeof _this.files[index] === 'undefined') {
                return new Error('FileManag: Cannot delete the file with the index of "' + index + '" because it does not exist.');
            }

            _this.files = _this.files.filter(function( item, i ){
                if( i === index ){

                    // Remove preview
                    $('.uploaded-file-preview[data-parent="' + _this.id + '"][data-index="' + index + '"]').remove();

                    return false;
                }

                item.oldIndex = i;
                return true
            });

            // Reorder
            _this.files.map(function(item, i){ 
                $('.uploaded-file-preview[data-parent="' + _this.id + '"][data-index="' + item.oldIndex + '"]').attr('data-index', i);
            });

        });

    }

    /**
     * Set file (used in edit post mode)
     * 
     * @param {string} file
     * @param {string} type
     */
    FileManag.prototype.setFile = function( data ){

        var _this = this;
        var date = new Date();

        this.urlToBase64( data.url, function( base64 ){
            var blob = _this.base64ToBinary(base64);
            var file = new File( [blob], data.name, { type:data.mime, lastModified:date });
            _this.handleBasicFileSelection(file);
        });
    }

    /**
     * Convert file url to base64
     * 
     * @param {string} url 
     * @param {function} callback 
     */
    FileManag.prototype.urlToBase64 = function(url, callback){

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
    FileManag.prototype.base64ToBinary = function( base64 ){

        var byteString;
        var dataURI = base64;

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
     * Return files
     */
    FileManag.prototype.getFiles = function(){
        return this.files.map(function(item){
            return item.file;
        });
    }

    /**
     * Return first file
     */
    FileManag.prototype.getFile = function(){
        if( this.files.length ){
            return this.files[0].file;
        }

        return false;
    }

    /**
     * Return preview markup
     * 
     * @param {object} file 
     * @param {boolean} is_editable 
     * @param {boolean} is_deletadble
     * @returns {string} 
     */
    FileManag.prototype.previewMarkup = function( file, index, is_editable, is_deletadble ){

        is_editable = is_editable || false;
        is_deletadble = is_deletadble || false;
        var output = '';

        if( file.type === 'video' ){
            output = '<div class="uploaded-file-preview" data-index="' + index + '" data-parent="' + this.id + '">';
            output += '<video controls src="' + file.base64 + '"></video>';
        }
        else if( file.type === 'image') {
            output = '<div class="uploaded-file-preview" data-index="' + index + '" data-parent="' + this.id + '" style="background-image:url(' + file.base64 + ')">';
        }
        else{
            output = '<div class="uploaded-file-preview" data-index="' + index + '" data-parent="' + this.id + '">';
            output += '<div>' + file.file.name + '</div>';
        }

        if( is_editable && file.type === 'image' ){
            output += '<i class="fa fa-pen" data-action="edit-image"></i>';
        }

        if( is_deletadble ){
            output += '<i class="fa fa-trash" data-action="delete-file"></i>';
        }

        output += '</div>';

        return output;
    }

    window.FileManag = FileManag;

})(jQuery)