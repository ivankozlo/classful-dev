/**
 * Croppa.JS - Cropping Tool
 * 
 * @version 1.12.0
 * @author Sabri Taieb
 * @url https://delabon.com
 *  
 * @param {object} options 
 */

/**
 * Get image orientation
 * @returns {string}
 */
Image.prototype.getOrientation = function(){

    if( ! this.width ) return false;
    if( ! this.height ) return false;

    var orientation;

    if( this.width > this.height ){
        orientation = 'landscape';
    } 
    else if( this.width < this.height ){
        orientation = 'portrait';
    } 
    else {
        orientation = 'even';
    }

    return orientation;
}

function Croppa( options ){
    
    // Default settings
    this.defaults = {
        image_url: null,
        container: null,
        container_size: [200, 200],
        crop_box_size: [100, 100],
        crop_box_resize: false,
        show_zoomer: false,
        cross_origin: false,
    }    

    this.settings = jQuery.extend( this.defaults, options );

    this.callbacks = {
        error: [],
        load: [],
    };

    if( ! this.settings.image_url ){
        var error = new Error('Please add an image url or base64 string or JS Image Instance');
        error.code = 1;
        error.type = 'croppa';

        this.fire('error', error);
        throw error;
    }    

    if( ! Array.isArray( this.settings.crop_box_size ) || this.settings.crop_box_size.length !== 2 ){
        var error = new Error('Please add a crop box size');
        error.code = 2;
        error.type = 'croppa';

        this.fire('error', error);
        throw error;
    }

    if( ! this.settings.container ){
        var error = new Error('Please add a container');
        error.code = 3;
        error.type = 'croppa';

        this.fire('error', error);
        throw error;
    }

    this.container = {};

    if( this.settings.container instanceof jQuery ){
        this.container.el = this.settings.container;
        this.settings.container = this.container.el.selector;
    }
    else{

        this.container.el = jQuery( this.settings.container );
    
        if( ! this.container.el.length ){
            var error = new Error('Container not found.');
            error.code = 4;
            error.type = 'croppa';

            this.fire('error', error);
            throw error;    
        }
    }
    
    if( ! Array.isArray( this.settings.container_size ) || this.settings.container_size.length !== 2 ){
        var error = new Error('Please add a container size');
        error.code = 5;
        error.type = 'croppa';

        this.fire('error', error);
        throw error;
    }

    this.data = {
        orientation: 'h',
        image_width: 0,
        image_height: 0,
        scaled_width: 0,
        scaled_height: 0,
        orig_scaled_width: 0,
        orig_scaled_height: 0,
        angle: 0,
        zoom: 1,
        //is_rotatable: true,
        resize_handler: null,
        crop_box_x: 0,
        crop_box_y: 0,
        crop_box_x_perc: 0,
        crop_box_y_perc: 0,
        crop_box_width: 0,
        crop_box_height: 0,
        crop_box_width_perc: 0,
        crop_box_height_perc: 0,
        crop_box_orig_width: 0,
        crop_box_orig_height: 0,
        crop_box_orig_width_perc: 0,
        crop_box_orig_height_perc: 0,
    };

    this.drag_object = {};
    this.resize_object = {
        top:0,
        left:0,
    };

    this.init();
}

/**
 * Add events
 */
Croppa.prototype.on = function( type, callback, data ){
        
    if( ! this.callbacks.hasOwnProperty( type ) ) return false;

    this.callbacks[type].push({ callback: callback, data: (data || null) });
}

/**
 * Fire events
 */
Croppa.prototype.fire = function( type, args ){

    if( ! this.callbacks.hasOwnProperty( type ) ) return false;

    this.callbacks[type].map(function( item ){        
        item.callback( args, item.data );        
    });
}

/**
 * Init
 */
Croppa.prototype.init = function(){

    var _self = this;

    if( this.settings.image_url instanceof Image ){
    
        this.image = this.settings.image_url;

        if( this.settings.cross_origin ){
            this.image.crossOrigin = "anonymous";
        }
    
        _self.initImageLoad( this.image );
    }
    else{
        this.image = new Image();
    
        if( this.settings.cross_origin ){
            this.image.crossOrigin = "anonymous";
        }
    
        this.image.onload = function(e){
            _self.initImageLoad( this );
        }
    
        this.image.src = this.settings.image_url;
    }
}

Croppa.prototype.initImageLoad = function( image ){
    
    this.data.crop_box_width = this.settings.crop_box_size[0];
    this.data.crop_box_height = this.settings.crop_box_size[1];

    this.data.crop_box_orig_width = this.settings.crop_box_size[0];
    this.data.crop_box_orig_height = this.settings.crop_box_size[1];

    if( this.data.crop_box_width > image.width ){

        var error = new Error('Crop box width must be smaller than the image width');
        error.code = 6;
        error.type = 'croppa';
        error.container = this.container.el;

        this.fire('error', error);
        // DO NOT THROW
        // CROPPA ALLOWS SMALL IMAGES
    }

    if( this.data.crop_box_height > image.height ){

        var error = new Error('Crop box height must be smaller than the image height');
        error.code = 7;
        error.type = 'croppa';
        error.container = this.container.el;

        this.fire('error', error);
        // DO NOT THROW
        // CROPPA ALLOWS SMALL IMAGES
    }

    // decrease image size (calculations)
    var newWidth = image.width;
    var newHeight = image.height;
    var maxWidth = this.data.crop_box_width * 1.5;
    var maxHeight = this.data.crop_box_height * 1.5;

    // VERY IMPORTANT CHECK
    // otherwise croppa will shrink the image
    if( image.width > this.data.crop_box_width && image.height > this.data.crop_box_height ){
        
        // descrease image size only if the image is big
        while( newWidth > maxWidth && newHeight > maxHeight ){
            newWidth = newWidth / 1.1;
            newHeight = newHeight / 1.1;
        }

        if( newWidth < maxWidth || newHeight < maxHeight ){
            newWidth *= 1.1;
            newHeight *= 1.1;   
        }
    }
    // crop box size is bigger than the image size
    else{
        
        if( this.data.crop_box_width > newWidth ){
            newWidth = this.data.crop_box_width;
        }

        if( this.data.crop_box_height > newHeight ){
            newHeight = this.data.crop_box_height;
        }
    }

    this.decrease_image_size( newWidth, newHeight );
}

/**
 * Decrease image size (well scaled)
 */
Croppa.prototype.decrease_image_size = function( newWidth, newHeight ){
        
    var _self = this;

    // create canvas
    var temp_canvas_1 = document.createElement("canvas");
    var temp_ctx_1 = temp_canvas_1.getContext("2d");

    temp_canvas_1.width = newWidth;
    temp_canvas_1.height = newHeight;
    
    this.draw( 
        this.image,
        temp_canvas_1,
        temp_ctx_1,
        newWidth,
        newHeight,
        0, // angle
        1  // zoom
    );

    var base64 = temp_canvas_1.toDataURL('image/jpeg', 1.0);    

    this.image.onload = null; // remove old event
    
    this.image = new Image();

    if( this.settings.cross_origin ){
        this.image.crossOrigin = "anonymous";
    }

    this.image.onload = function(e){
        _self.start();
    }

    this.image.src = base64;
}

/**
 * Croppa start
 */
Croppa.prototype.start = function(){
    
    this.data.image_width = this.image.width;
    this.data.image_height = this.image.height;
    
    // Calculate crop box width percentage & height percentage only once!
    // use the crop box size setting here
    this.data.crop_box_width_perc = ( this.settings.crop_box_size[0] * 100 ) / this.data.image_width;
    this.data.crop_box_height_perc = ( this.settings.crop_box_size[1] * 100 ) / this.data.image_height;
    
    // DO NOT MODIFY THESE
    this.data.crop_box_orig_width_perc = this.data.crop_box_width_perc;
    this.data.crop_box_orig_height_perc = this.data.crop_box_height_perc;
    
    // start 
    this.prepare_container();
    this.create_canvas();
    this.calculate_dims();
    this.create_overlay();
    this.calculate_overlay_dims();
    this.create_crop_box();

    // if( this.data.crop_box_width > this.data.image_width ){
    //     this.data.is_rotatable = false;
    // }

    // if( this.data.crop_box_height > this.data.image_width ){
    //     this.data.is_rotatable = false;
    // }

    // Make sure crop_box resize events before overlay drag listeners
    if( this.settings.crop_box_resize ){
        this.crop_box_resize_bottom_right();
        this.crop_box_resize_bottom_left();
        this.crop_box_resize_top_right();
        this.crop_box_resize_top_left();

        this.crop_box_resize_top();
        this.crop_box_resize_bottom();
        this.crop_box_resize_left();
        this.crop_box_resize_right();
    }

    // must come after crop_box resize events
    this.resize_listener();
    this.drag_listener();

    this.draw(
        this.image, // image,
        this.canvas,
        this.ctx,
        this.data.scaled_width,
        this.data.scaled_height,
        this.data.angle,
        this.data.zoom
    );

    this.create_zoomer();

    this.fire('load', this);
}

/**
 * Prepare Container
 * Add classes, id, etc.
 */
Croppa.prototype.prepare_container = function(){
    this.container.id = 'croppa-' + new Date().getTime();
    this.container.el.append('<div id="'+this.container.id+'" class="croppa-container"></div>');
    this.container.parent = this.container.el;
    this.container.el = jQuery('#'+this.container.id);

    this.container.parent.addClass('croppa-parent');
}

/**
 * Create canvas
 */
Croppa.prototype.create_canvas = function(){
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.container.el.append('<div class="croppa-inner-container"></div>');
    this.container.el.find('.croppa-inner-container').append( this.canvas );
}

/**
 * Calculate best dimensions
 */
Croppa.prototype.calculate_dims = function(){

    var maxWidth = this.settings.container_size[0]; // Max width for the image
    var maxHeight = this.settings.container_size[1]; // Max height for the image
    var ratio = 0; // Used for aspect ratio
    var width = this.data.image_width; // Current image width
    var height = this.data.image_height; // Current image height
    var newWidth = width;
    var newHeight = height;
        
    if( this.container.parent.width() < maxWidth ){
        maxWidth = this.container.parent.width();
    }    

    // Check if the current width is larger than the max
    if( width > maxWidth ){
        ratio = maxWidth / width; // get ratio for scaling image
        newWidth = maxWidth;
        newHeight = height * ratio;
        height = height * ratio; // Reset height to match scaled image
        width = width * ratio; // Reset width to match scaled image     
    }

    // Check if current height is larger than max
    if( height > maxHeight && this.image.getOrientation() === 'portrait' ){
        ratio = maxHeight / height; // get ratio for scaling image
        newHeight = maxHeight;
        newWidth = width * ratio;
        width = width * ratio; // Reset width to match scaled image
    }

    this.canvas.width = newWidth;
    this.canvas.height = newHeight;
    this.data.scaled_width = newWidth;
    this.data.scaled_height = newHeight;
    this.container.el.find('.croppa-illusion-container').width(maxWidth);
    this.container.el.find('.croppa-illusion-container').height(maxHeight);

    if( this.data.orientation === 'v' ){ 
        this.canvas.width = newHeight;
        this.canvas.height = newWidth;
    }
    else{
        this.data.orig_scaled_width = newWidth;
        this.data.orig_scaled_height = newHeight;
    }
}

/**
 * Create overlay ( crop box )
 */
Croppa.prototype.create_overlay = function(){

    // create dom element
    this.overlay = {};
    this.container.el.find('.croppa-inner-container').append('<div class="croppa-overlay"></div>');
    this.overlay.el = this.container.el.find('.croppa-overlay');
}

/**
 * Calculate overlay dims ( crop box )
 */
Croppa.prototype.calculate_overlay_dims = function(){

    var canvas_bounds = this.canvas.getBoundingClientRect();
    var canvas_width = canvas_bounds.width;
    var canvas_height = canvas_bounds.height;
        
    this.data.crop_box_width = canvas_width * this.data.crop_box_width_perc / 100;
    this.data.crop_box_height = canvas_height * this.data.crop_box_height_perc / 100;
    
    this.data.crop_box_orig_width = canvas_width * this.data.crop_box_orig_width_perc / 100;
    this.data.crop_box_orig_height = canvas_height * this.data.crop_box_orig_height_perc / 100;

    this.data.crop_box_x = canvas_width * this.data.crop_box_x_perc / 100;
    this.data.crop_box_y = canvas_height * this.data.crop_box_y_perc / 100;
    
    this.overlay.el.css({
        width: this.data.crop_box_width + 'px',
        height: this.data.crop_box_height + 'px',
        left: this.data.crop_box_x + 'px',
        top: this.data.crop_box_y + 'px',
    });
}

/**
 * Create crop box
 */
Croppa.prototype.create_crop_box = function(){

    this.container.el.append('<div class="croppa-crop-box-parent"><div class="croppa-crop-box"></div></div>');
    this.cropbox = {};
    this.cropbox.parent = this.container.el.find('.croppa-crop-box-parent');
    this.cropbox.el = this.container.el.find('.croppa-crop-box');

    var canvas_bounds = this.canvas.getBoundingClientRect();
    
    this.cropbox.parent.css({
        width: canvas_bounds.width + 'px',
        height: canvas_bounds.height + 'px',
    });

    this.cropbox.el.css({
        width: this.data.crop_box_width + 'px',
        height: this.data.crop_box_height + 'px',
        left: this.data.crop_box_x + 'px',
        top: this.data.crop_box_y + 'px',
    });

    // create resize elements
    if( this.settings.crop_box_resize ){

        this.cropbox.el.append('<div class="croppa-resizer-top"></div><div class="croppa-resizer-right"></div><div class="croppa-resizer-bottom"></div><div class="croppa-resizer-left"></div><div class="croppa-resizer-tl"></div><div class="croppa-resizer-tr"></div><div class="croppa-resizer-bl"></div><div class="croppa-resizer-br"></div>');

        this.resizer = {};
        this.resizer.els = {};
        this.resizer.els.tl = this.cropbox.el.find('.croppa-resizer-tl');
        this.resizer.els.tr = this.cropbox.el.find('.croppa-resizer-tr');
        this.resizer.els.bl = this.cropbox.el.find('.croppa-resizer-bl');
        this.resizer.els.br = this.cropbox.el.find('.croppa-resizer-br');

        this.resizer.els.top = this.cropbox.el.find('.croppa-resizer-top');
        this.resizer.els.right = this.cropbox.el.find('.croppa-resizer-right');
        this.resizer.els.bottom = this.cropbox.el.find('.croppa-resizer-bottom');
        this.resizer.els.left = this.cropbox.el.find('.croppa-resizer-left');

    } 
}

/**
 * Update crop box
 */
Croppa.prototype.update_crop_box = function(){

    var canvas_bounds = this.canvas.getBoundingClientRect();

    this.cropbox.parent.css({
        width: canvas_bounds.width + 'px',
        height: canvas_bounds.height + 'px',
    });

    this.cropbox.el.css({        
        width: this.data.crop_box_width + 'px',
        height: this.data.crop_box_height + 'px',
        left: this.data.crop_box_x + 'px',
        top: this.data.crop_box_y + 'px',
    });
}

/**
 * Draw image to canvas
 * 
 * @param {object} image
 * @param {object} canvas
 * @param {object} ctx
 * @param {float} image_width
 * @param {float} image_height
 * @param {int} angle 
 * @param {float} scale
 */
Croppa.prototype.draw = function( image, canvas, ctx, image_width, image_height, angle, scale ){
    
    var width = canvas.width;
    var height = canvas.height;

    // clear all pixels
    ctx.clearRect(0, 0, width, height);

    ctx.save();    

    // Move registration point to the center of the canvas
    ctx.translate( width/2, height/2 );

    // rotate
    ctx.rotate( angle* Math.PI / 180 );// angle must be in radians

    // zoom
    ctx.scale( scale, scale );
    
    // Move registration point back to the top left corner of canvas
    ctx.translate( -(width/2), -(height/2) );

    ctx.drawImage( 
        image, 
        width/2 - image_width/2, 
        height/2 - image_height/2, 
        image_width, 
        image_height 
    );

    ctx.restore();
}

/**
 * Crop
 * 
 * @param {float} crop_x
 * @param {float} crop_y
 * @param {float} crop_width
 * @param {float} crop_height
 * @return {string} base64 image
 */
Croppa.prototype.crop = function( crop_x, crop_y, crop_width, crop_height ){

    // create canvas
    var temp_canvas_1 = document.createElement("canvas");
    var temp_ctx_1 = temp_canvas_1.getContext("2d");

    temp_canvas_1.width = this.data.image_width;
    temp_canvas_1.height = this.data.image_height;

    if( this.data.orientation === 'v' ){
        temp_canvas_1.width = this.data.image_height;
        temp_canvas_1.height = this.data.image_width;
    }

    this.draw( 
        this.image,
        temp_canvas_1,
        temp_ctx_1,
        this.data.image_width,
        this.data.image_height,
        this.data.angle,
        this.data.zoom  
    );

    // get image data
    var image_data = temp_ctx_1.getImageData(
        crop_x, 
        crop_y, 
        crop_width, 
        crop_height
    );
    
    // create a new canvas with the correct size
    var temp_canvas_2 = document.createElement("canvas");
    var temp_ctx_2 = temp_canvas_2.getContext("2d");

    temp_canvas_2.width = crop_width;
    temp_canvas_2.height = crop_height;
    temp_ctx_2.putImageData(image_data, 0, 0);

    var base64 = temp_canvas_2.toDataURL('image/jpeg', 1.0);

    // free up memory
    delete temp_canvas_1;
    delete temp_canvas_2;
    delete temp_ctx_1;
    delete temp_ctx_2;
    delete image_data;

    return base64;
}

/**
 * Get result
 */
Croppa.prototype.result = function(){

    var image_width = this.data.image_width;
    var image_height = this.data.image_height;

    var width = this.data.crop_box_width_perc * image_width / 100;
    var height = this.data.crop_box_height_perc * image_height / 100;    
    
    if( this.data.orientation === 'v' ){

        image_width = this.data.image_height;
        image_height = this.data.image_width;

        width = this.data.crop_box_width_perc * this.data.image_height / 100;
        height = this.data.crop_box_height_perc * this.data.image_width / 100;    
    }

    var x = this.data.crop_box_x_perc * image_width / 100;
    var y = this.data.crop_box_y_perc * image_height / 100;
    
    return this.crop(
        x, 
        y, 
        width,
        height
    );    
}

/**
 * Zoom
 * 
 * @param {int} value
 */
Croppa.prototype.zoom = function( value ){

    if( value < 0.1 ) return false;
    
    this.draw(
        this.image,
        this.canvas,
        this.ctx,
        this.data.scaled_width,
        this.data.scaled_height,
        this.data.angle,
        value
    );

    this.data.zoom = value;
}

/**
 * Zoom in
 */
Croppa.prototype.zoom_in = function(){
    this.zoom( this.data.zoom + 0.1 );
}

/**
 * Zoom out
 */
Croppa.prototype.zoom_out = function(){
    this.zoom( this.data.zoom - 0.1 );
}

/**
 * Update overlay dims before rotating
 */
Croppa.prototype.update_overlay_dims_before_rotating = function(){

    var canvas_bounds = this.canvas.getBoundingClientRect();
    var el = this.overlay.el.get(0);
    var el_bounds = el.getBoundingClientRect();
    
    var top = parseFloat( el.style.top ) || 0;
    var left = parseFloat( el.style.left ) || 0;

    if( (el_bounds.x + el_bounds.width) > (canvas_bounds.x +canvas_bounds.width) ){
        el.style.left = '0px';
        left = 0;
        if( el_bounds.width > canvas_bounds.width ){
            el.style.width = canvas_bounds.width + 'px';
        }
    }

    if( (el_bounds.y + el_bounds.height) > (canvas_bounds.y +canvas_bounds.height) ){
        el.style.top = '0px';
        top = 0;
        if( el_bounds.height > canvas_bounds.height ){
            el.style.height = canvas_bounds.height + 'px';
        }
    }

    this.data.crop_box_width = parseFloat( el.style.width );
    this.data.crop_box_height = parseFloat( el.style.height );
    
    this.data.crop_box_orig_width = this.data.crop_box_width;
    this.data.crop_box_orig_height = this.data.crop_box_height;

    // Calculate NEW crop box width & height percentages
    this.data.crop_box_width_perc = ( this.data.crop_box_width * 100 ) / canvas_bounds.width;
    this.data.crop_box_height_perc = ( this.data.crop_box_height * 100 ) / canvas_bounds.height;
    
    this.data.crop_box_orig_width_perc  = this.data.crop_box_width_perc;
    this.data.crop_box_orig_height_perc = this.data.crop_box_height_perc;

    // Calculate NEW crop box x & y percentages
    this.data.crop_box_x = left;
    this.data.crop_box_y = top;

    this.data.crop_box_x_perc = ( left * 100) / canvas_bounds.width;
    this.data.crop_box_y_perc = ( top * 100) / canvas_bounds.height;
}

/**
 * Rotate
 */
Croppa.prototype.rotate = function( value ){

    value = parseInt( value );

    // 90 or 270
    if( ( Math.abs( value ) / 90 ) % 2 === 1 ){
        this.data.orientation = 'v';
    }
    else{
        this.data.orientation = 'h';
    }

    this.calculate_dims();
    this.update_overlay_dims_before_rotating();

    this.draw(
        this.image,
        this.canvas,
        this.ctx,
        this.data.scaled_width,
        this.data.scaled_height,
        value,
        this.data.zoom
    );
    
    this.data.angle = value;

    this.update_crop_box();
}

/**
 * Rotate left
 */
Croppa.prototype.rotate_left = function(){
    this.rotate( this.data.angle - 90 );
}

/**
 * Rotate right
 */
Croppa.prototype.rotate_right = function(){
    this.rotate( this.data.angle + 90 );
}

/**
 * Create zoomer
 */
Croppa.prototype.create_zoomer = function(){
    
    if( ! this.settings.show_zoomer ) return false;

    var _self = this;
    this.zoomer = {};
    this.zoomer.id = this.container.id + '-zoomer';
    this.container.el.after('<input id="' + this.zoomer.id + '" class="croppa-slider" type="range" step="0.01" min="0.5" max="5" value="1">');
    this.zoomer.el = jQuery('#' + this.zoomer.id);
    
    this.zoomer.el.on('input', function(e){
        _self.zoom( _self.zoomer.el.val() );
    });
}

/**
 * When resizing
 */
Croppa.prototype.resize_listener = function(){

    var _self = this;
    var timer;

    this.data.resize_handler = function(){

        clearTimeout( timer );

        timer = setTimeout(function(){

            _self.calculate_dims();
            _self.calculate_overlay_dims();

            _self.draw(
                _self.image,
                _self.canvas,
                _self.ctx,
                _self.data.scaled_width,
                _self.data.scaled_height,
                _self.data.angle,
                _self.data.zoom
            );
            
            _self.update_crop_box();
        }, 20);

    };

    jQuery(window).on('resize', this.data.resize_handler ); // do not use .resize() it causes a wierd bug
}

/**
 * When dragging the cropping box
 */
Croppa.prototype.drag_listener = function(){

    var _self = this;
    var el = this.cropbox.el.get(0);
    var overlay_el = this.overlay.el.get(0);

    this.drag_object.active = false;

    /**
     * Drag start
     */
    this.drag_object.drag_start = function(e){
        
        if( e.target !== el ) return false;

        e.stopPropagation();
        e.preventDefault();

        _self.drag_object.active = true;

        if( "ontouchstart" in document.documentElement ){
            document.addEventListener("touchend", _self.drag_object.drag_end, { capture: false, passive: false });
            document.addEventListener("touchmove", _self.drag_object.drag, { passive: false } );    
        }
        else{
            document.addEventListener("mouseup", _self.drag_object.drag_end, { capture: false, passive: false });
            document.addEventListener("mousemove", _self.drag_object.drag, { capture: false, passive: false });
        }

        var x; 
        var y;
        
        if( e.type === "touchstart" ){
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }
        else {
            x = e.clientX;
            y = e.clientY;
        }

        var canvas_bounds = _self.canvas.getBoundingClientRect();
        var el_bounds = el.getBoundingClientRect();

        // parentNode is our bounding box
        // the minimum boundary is based on the top left corner of our container
        _self.drag_object.minBoundX = canvas_bounds.x;
        _self.drag_object.minBoundY = canvas_bounds.y;
        
        // the maximum is the bottom right corner of the container
        // or.. the top left (x,y) + the height and width (h,y) - the size of the square
        _self.drag_object.maxBoundX = _self.drag_object.minBoundX + canvas_bounds.width - el_bounds.width;
        _self.drag_object.maxBoundY = _self.drag_object.minBoundY + canvas_bounds.height - el_bounds.height;
                
        _self.drag_object.posX = x - el_bounds.x;
        _self.drag_object.posY = y - el_bounds.y;

        _self.drag_object.parentWidth = canvas_bounds.width;
        _self.drag_object.parentHeight = canvas_bounds.height;
    }

    /**
     * dragging
     */
    this.drag_object.drag = function(e){

    	e.stopPropagation();
        e.preventDefault();
        
        if( ! _self.drag_object.active ) return false;

        var x; 
        var y;
        
        if( e.type === "touchmove" ){
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }
        else {
            x = e.clientX;
            y = e.clientY;
        }
        
        var left = Math.max( _self.drag_object.minBoundX, Math.min(x - _self.drag_object.posX, _self.drag_object.maxBoundX));
        var top = Math.max( _self.drag_object.minBoundY, Math.min(y - _self.drag_object.posY, _self.drag_object.maxBoundY));
        
        var moved_x = (left - _self.drag_object.minBoundX);
        var moved_y = (top - _self.drag_object.minBoundY);

        el.style.left = moved_x + 'px';
        el.style.top = moved_y + 'px';

        overlay_el.style.left = moved_x + 'px';
        overlay_el.style.top = moved_y + 'px';

        _self.data.crop_box_x = moved_x;
        _self.data.crop_box_y = moved_y;

        var moved_x_perc = ( moved_x * 100) / _self.drag_object.parentWidth;
        var moved_y_perc = ( moved_y * 100) / _self.drag_object.parentHeight;

        _self.data.crop_box_x_perc = moved_x_perc;
        _self.data.crop_box_y_perc = moved_y_perc;
    }

    /**
     * Drag end
     */
    this.drag_object.drag_end = function(e){

        e.stopPropagation();
        e.preventDefault();

        _self.drag_object.active = false;
        
        if( "ontouchstart" in document.documentElement ){
            document.removeEventListener("touchend", _self.drag_object.drag_end, { capture: false, passive: false });
            document.removeEventListener("touchmove", _self.drag_object.drag, { capture: false, passive: false });
        }
        else{
            document.removeEventListener("mouseup", _self.drag_object.drag_end, { capture: false, passive: false });
            document.removeEventListener("mousemove", _self.drag_object.drag, { capture: false, passive: false });
        }

        // fix ios drag and scroll issue
        document.querySelector('body').classList.remove('no-scroll');
    }

    if( "ontouchstart" in document.documentElement ){
        document.addEventListener("touchstart", this.drag_object.drag_start, { capture: false, passive: false } );
    }
    else{
        document.addEventListener("mousedown", this.drag_object.drag_start, { capture: false, passive: false } );
    }

}

/**
 * Calculate min crop box size
 */
Croppa.prototype.calculate_min_crop_box_size = function(){
    
    var orig_width = this.data.crop_box_orig_width;
    var orig_height = this.data.crop_box_orig_height;
    var minHeight = 0;
    var minWidth = 0;

    if( orig_width > orig_height ){

        minHeight = orig_height;
        minWidth = orig_width;

        while ( minHeight > 0 ) {
            minHeight -= 1;
            minWidth -= 1;
        }
    }
    else if( orig_height > orig_width ){

        minHeight = orig_height;
        minWidth = orig_width;

        while ( minWidth > 0 ) {
            minHeight -= 1;
            minWidth -= 1;
        }
    }
    else{

        minHeight = orig_height;
        minWidth = orig_width;

        while ( minWidth > 0 ) {
            minHeight -= 1;
            minWidth -= 1;
        }
    }

    return [ minWidth, minHeight ];
}

/**
 * Crop box bottom right resize listeners
 */
Croppa.prototype.crop_box_resize_bottom_right = function(){

    var _self = this;
    var el = this.cropbox.el.get(0);
    var overlay_el = this.overlay.el.get(0);
    var handle_el = this.resizer.els.br;

    this.resize_object.active = false;

    /**
     * Drag start
     */
    this.resize_object.br_drag_start = function(e){
    
        if( e.target !== handle_el.get(0) ) return false;
        
        e.stopPropagation();
        e.preventDefault();

        _self.resize_object.active = true;

        // disabled overlay drag listeners
        if( "ontouchstart" in document.documentElement ){
            document.removeEventListener("touchstart", _self.drag_object.drag_start, { capture: false, passive: false });
            document.addEventListener("touchmove", _self.resize_object.br_drag, { capture: false, passive: false });
            document.addEventListener("touchend", _self.resize_object.br_drag_end, { capture: false, passive: false });
        }
        else{
            document.removeEventListener("mousedown", _self.drag_object.drag_start, { capture: false, passive: false });
            document.addEventListener("mousemove", _self.resize_object.br_drag, { capture: false, passive: false });
            document.addEventListener("mouseup", _self.resize_object.br_drag_end, { capture: false, passive: false });
        }

        var x; 
        var y;
        
        if( e.type === "touchstart" ){
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }
        else {
            x = e.clientX;
            y = e.clientY;
        }

        _self.resize_object.posX = x;
        _self.resize_object.posY = y;

        var canvas_bounds = _self.canvas.getBoundingClientRect();
        var el_bounds = _self.overlay.el.get(0).getBoundingClientRect();
        
        // Calculate max width & height
        // use the lowest
        var height_diff = ( canvas_bounds.y + canvas_bounds.height ) - ( el_bounds.y + el_bounds.height );
        var width_diff = ( canvas_bounds.x + canvas_bounds.width ) - ( el_bounds.x + el_bounds.width );
        // var diff = height_diff;
    
        // if( height_diff > width_diff ){
        //     diff = width_diff;
        // }
    
        _self.resize_object.maxWidth = el_bounds.width + width_diff;
        _self.resize_object.maxHeight = el_bounds.height + height_diff;

        // var min_crop_box_size = _self.calculate_min_crop_box_size();
        
        // _self.resize_object.minWidth = min_crop_box_size[0];
        // _self.resize_object.minHeight = min_crop_box_size[1];
    }

    /**
     * dragging
     */
    this.resize_object.br_drag = function(e){
        
        if( ! _self.resize_object.active ) return false;
        
        e.stopPropagation();
        e.preventDefault();

        var x; 
        var y;
        
        if( e.type === "touchmove" ){
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }
        else {
            x = e.clientX;
            y = e.clientY;
        }
        
        var moved_x = x - _self.resize_object.posX;
        var moved_y = y - _self.resize_object.posY;
        var moved = moved_x > moved_y ? moved_x : moved_y;

        var newWidth = _self.data.crop_box_width + moved_x;
        var newHeight = _self.data.crop_box_height + moved_y;

        var width = Math.max( 2, Math.min( newWidth, _self.resize_object.maxWidth  ) );
        var height = Math.max( 2, Math.min( newHeight, _self.resize_object.maxHeight  ) );
        
        el.style.width = width + 'px';
        el.style.height = height + 'px';
        overlay_el.style.width = el.style.width;
        overlay_el.style.height = el.style.height;
    }

    /**
     * Drag end
     */
    this.resize_object.br_drag_end = function(e){

        e.stopPropagation();
        e.preventDefault();

        var canvas_bounds = _self.canvas.getBoundingClientRect();

        _self.resize_object.active = false;

        _self.data.crop_box_width = parseFloat( el.style.width );
        _self.data.crop_box_height = parseFloat( el.style.height );
        
        // Calculate NEW crop box width & height percentages
        _self.data.crop_box_width_perc = ( _self.data.crop_box_width * 100 ) / canvas_bounds.width;
        _self.data.crop_box_height_perc = ( _self.data.crop_box_height * 100 ) / canvas_bounds.height;
        
        // Calculate NEW crop box x & y percentages
        var top = parseFloat( el.style.top ) || 0;
        var left = parseFloat( el.style.left ) || 0;

        _self.data.crop_box_x = left;
        _self.data.crop_box_y = top;

        _self.data.crop_box_x_perc = ( left * 100) / canvas_bounds.width;
        _self.data.crop_box_y_perc = ( top * 100) / canvas_bounds.height;

        if( "ontouchstart" in document.documentElement ){
            document.removeEventListener("touchend", _self.resize_object.br_drag_end, { capture: false, passive: false });
            document.removeEventListener("touchmove", _self.resize_object.br_drag, { capture: false, passive: false });

            // enabled overlay drag listeners
            document.addEventListener("touchstart", _self.drag_object.drag_start, { capture: false, passive: false });
        }
        else{
            document.removeEventListener("mouseup", _self.resize_object.br_drag_end, { capture: false, passive: false });
            document.removeEventListener("mousemove", _self.resize_object.br_drag, { capture: false, passive: false });
            
            // enabled overlay drag listeners
            document.addEventListener("mousedown", _self.drag_object.drag_start, { capture: false, passive: false });
        }
        
    }

    if( "ontouchstart" in document.documentElement ){
        document.addEventListener("touchstart", this.resize_object.br_drag_start, { capture: false, passive: false });
    }
    else{
        document.addEventListener("mousedown", this.resize_object.br_drag_start, { capture: false, passive: false });
    }

}

/**
 * Crop box bottom left resize listeners
 */
Croppa.prototype.crop_box_resize_bottom_left = function(){

    var _self = this;
    var el = this.cropbox.el.get(0);
    var overlay_el = this.overlay.el.get(0);
    var handle_el = this.resizer.els.bl;

    this.resize_object.active = false;

    /**
     * Drag start
     */
    this.resize_object.bl_drag_start = function(e){
       
        if( e.target !== handle_el.get(0) ) return false;
    
        e.stopPropagation();
        e.preventDefault();
        
        _self.resize_object.active = true;

        if( "ontouchstart" in document.documentElement ){
            // disabled overlay drag listeners
            document.removeEventListener("touchstart", _self.drag_object.drag_start, { capture: false, passive: false });

            document.addEventListener("touchmove", _self.resize_object.bl_drag, { capture: false, passive: false });
            document.addEventListener("touchend", _self.resize_object.bl_drag_end, { capture: false, passive: false });
        }
        else{
            // disabled overlay drag listeners
            document.removeEventListener("mousedown", _self.drag_object.drag_start, { capture: false, passive: false });

            document.addEventListener("mousemove", _self.resize_object.bl_drag, { capture: false, passive: false });
            document.addEventListener("mouseup", _self.resize_object.bl_drag_end, { capture: false, passive: false });
        }        

        var x; 
        var y;
        
        if( e.type === "touchstart" ){
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }
        else {
            x = e.clientX;
            y = e.clientY;
        }

        _self.resize_object.posX = x;
        _self.resize_object.posY = y;

        _self.resize_object.left = parseFloat(el.style.left || 0);   
        
        var canvas_bounds = _self.canvas.getBoundingClientRect();
        var el_bounds = _self.overlay.el.get(0).getBoundingClientRect();

        // use the lowest
        height_diff = ( canvas_bounds.y +  canvas_bounds.height ) - ( el_bounds.y + el_bounds.height);
        width_diff = el_bounds.x - canvas_bounds.x;
        diff = height_diff;

        if( height_diff > width_diff ){
            diff = width_diff;
        }

        _self.resize_object.maxWidth = el_bounds.width + width_diff;    
        _self.resize_object.maxHeight = el_bounds.height + height_diff;

        // var min_crop_box_size = _self.calculate_min_crop_box_size();

        // _self.resize_object.minWidth = min_crop_box_size[0];
        // _self.resize_object.minHeight = min_crop_box_size[1];
    }

    /**
     * dragging
     */
    this.resize_object.bl_drag = function(e){
        
        if( ! _self.resize_object.active ) return false;
        
        e.stopPropagation();
        e.preventDefault();

        var x; 
        var y;
        
        if( e.type === "touchmove" ){
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }
        else {
            x = e.clientX;
            y = e.clientY;
        }
        
        var moved_x = (x - _self.resize_object.posX) * -1;
        var moved_y = y - _self.resize_object.posY;
        // var moved = moved_y;

        // if( moved_x > moved_y ){
        //     moved = moved_x * -1;
        // }
        
        var newWidth = _self.data.crop_box_width + moved_x;
        var newHeight = _self.data.crop_box_height + moved_y;

        var width = Math.max( 2, Math.min( newWidth, _self.resize_object.maxWidth ) );
        var height = Math.max( 2, Math.min( newHeight, _self.resize_object.maxHeight ) );       
        
        el.style.width = width + 'px';
        el.style.height = height + 'px';
        overlay_el.style.width = el.style.width;
        overlay_el.style.height = el.style.height;

        el.style.left = ( _self.resize_object.left - ( width - _self.data.crop_box_width ) ) + 'px';
        overlay_el.style.left = el.style.left;
    }

    /**
     * Drag end
     */
    this.resize_object.bl_drag_end = function(e){

        e.stopPropagation();
        e.preventDefault();

        var canvas_bounds = _self.canvas.getBoundingClientRect();

        _self.resize_object.active = false;

        _self.data.crop_box_width = parseFloat( el.style.width );
        _self.data.crop_box_height = parseFloat( el.style.height );
        
        // Calculate NEW crop box width & height percentages
        _self.data.crop_box_width_perc = ( _self.data.crop_box_width * 100 ) / canvas_bounds.width;
        _self.data.crop_box_height_perc = ( _self.data.crop_box_height * 100 ) / canvas_bounds.height;
    
        // Calculate NEW crop box x & y percentages
        var top = parseFloat( el.style.top ) || 0;
        var left = parseFloat( el.style.left ) || 0;

        _self.data.crop_box_x_perc = ( left * 100) / canvas_bounds.width;
        _self.data.crop_box_y_perc = ( top * 100) / canvas_bounds.height;

        if( "ontouchstart" in document.documentElement ){
            document.removeEventListener("touchend", _self.resize_object.bl_drag_end, { capture: false, passive: false });
            document.removeEventListener("touchmove", _self.resize_object.bl_drag, { capture: false, passive: false });
            
            // enabled overlay drag listeners
            document.addEventListener("touchstart", _self.drag_object.drag_start, { capture: false, passive: false });
        }
        else{
            document.removeEventListener("mouseup", _self.resize_object.bl_drag_end, { capture: false, passive: false });
            document.removeEventListener("mousemove", _self.resize_object.bl_drag, { capture: false, passive: false });
            
            // enabled overlay drag listeners
            document.addEventListener("mousedown", _self.drag_object.drag_start, { capture: false, passive: false });
        }        

    }

    if( "ontouchstart" in document.documentElement ){
        document.addEventListener("touchstart", this.resize_object.bl_drag_start, { capture: false, passive: false });
    }
    else{
        document.addEventListener("mousedown", this.resize_object.bl_drag_start, { capture: false, passive: false });
    }

}

/**
 * Crop box top right resize listeners
 */
Croppa.prototype.crop_box_resize_top_right = function(){

    var _self = this;
    var el = this.cropbox.el.get(0);
    var overlay_el = this.overlay.el.get(0);
    var handle_el = this.resizer.els.tr;

    this.resize_object.active = false;

    /**
     * Drag start
     */
    this.resize_object.tr_drag_start = function(e){
                
        if( e.target !== handle_el.get(0) ) return false;

        e.stopPropagation();
        e.preventDefault();

        _self.resize_object.active = true;
        
        if( "ontouchstart" in document.documentElement ){
            // disabled overlay drag listeners
            document.removeEventListener("touchstart", _self.drag_object.drag_start, { capture: false, passive: false });

            document.addEventListener("touchmove", _self.resize_object.tr_drag, { capture: false, passive: false });
            document.addEventListener("touchend", _self.resize_object.tr_drag_end, { capture: false, passive: false });
        }
        else{
            // disabled overlay drag listeners
            document.removeEventListener("mousedown", _self.drag_object.drag_start, { capture: false, passive: false });
            
            document.addEventListener("mousemove", _self.resize_object.tr_drag, { capture: false, passive: false });
            document.addEventListener("mouseup", _self.resize_object.tr_drag_end, { capture: false, passive: false });
        }

        var x; 
        var y;
        
        if( e.type === "touchstart" ){
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }
        else {
            x = e.clientX;
            y = e.clientY;
        }

        _self.resize_object.posX = x;
        _self.resize_object.posY = y;

        _self.resize_object.top = parseFloat(el.style.top || 0);
        
        var canvas_bounds = _self.canvas.getBoundingClientRect();
        var el_bounds = _self.overlay.el.get(0).getBoundingClientRect();
        
        // use the lowest
        var height_diff = el_bounds.y - canvas_bounds.y;
        var width_diff = ( canvas_bounds.x + canvas_bounds.width ) - ( el_bounds.x + el_bounds.width );
        // var diff = height_diff;

        // if( height_diff > width_diff ){
        //     diff = width_diff;
        // }

        _self.resize_object.maxWidth = el_bounds.width + width_diff;    
        _self.resize_object.maxHeight = el_bounds.height + height_diff;

        // var min_crop_box_size = _self.calculate_min_crop_box_size();

        // _self.resize_object.minWidth = min_crop_box_size[0];
        // _self.resize_object.minHeight = min_crop_box_size[1];
    }

    /**
     * dragging
     */
    this.resize_object.tr_drag = function(e){
        
        if( ! _self.resize_object.active ) return false;
        
        e.stopPropagation();
        e.preventDefault();

        var x; 
        var y;
        
        if( e.type === "touchmove" ){
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }
        else {
            x = e.clientX;
            y = e.clientY;
        }

        var moved_x = x - _self.resize_object.posX;
        var moved_y = ( y - _self.resize_object.posY ) * -1;
        //var moved = moved_x > moved_y ? moved_x : moved_y * -1;

        var newWidth = _self.data.crop_box_width + moved_x;
        var newHeight = _self.data.crop_box_height + moved_y;

        var width = Math.max( 2, Math.min( newWidth, _self.resize_object.maxWidth  ) );
        var height = Math.max( 2, Math.min( newHeight, _self.resize_object.maxHeight  ) );       
        
        el.style.width = width + 'px';
        el.style.height = height + 'px';

        overlay_el.style.width = el.style.width;
        overlay_el.style.height = el.style.height;
                
        el.style.top =  ( _self.resize_object.top - ( height - _self.data.crop_box_height ) ) + 'px';
        overlay_el.style.top = el.style.top;
    }

    /**
     * Drag end
     */
    this.resize_object.tr_drag_end = function(e){

        e.stopPropagation();
        e.preventDefault();

        var canvas_bounds = _self.canvas.getBoundingClientRect();

        _self.resize_object.active = false;

        _self.data.crop_box_width = parseFloat( el.style.width );
        _self.data.crop_box_height = parseFloat( el.style.height );
    
        // Calculate NEW crop box width & height percentages
        _self.data.crop_box_width_perc = ( _self.data.crop_box_width * 100 ) / canvas_bounds.width;
        _self.data.crop_box_height_perc = ( _self.data.crop_box_height * 100 ) / canvas_bounds.height;
    
        // Calculate NEW crop box x & y percentages
        var top = parseFloat( el.style.top ) || 0;
        var left = parseFloat( el.style.left ) || 0;

        _self.data.crop_box_x_perc = ( left * 100) / canvas_bounds.width;
        _self.data.crop_box_y_perc = ( top * 100) / canvas_bounds.height;

        if( "ontouchstart" in document.documentElement ){
            document.removeEventListener("touchend", _self.resize_object.tr_drag_end, { capture: false, passive: false });
            document.removeEventListener("touchmove", _self.resize_object.tr_drag, { capture: false, passive: false });
            
            // enabled overlay drag listeners
            document.addEventListener("touchstart", _self.drag_object.drag_start, { capture: false, passive: false });
        }
        else{
            document.removeEventListener("mouseup", _self.resize_object.tr_drag_end, { capture: false, passive: false });
            document.removeEventListener("mousemove", _self.resize_object.tr_drag, { capture: false, passive: false });

            // enabled overlay drag listeners
            document.addEventListener("mousedown", _self.drag_object.drag_start, { capture: false, passive: false });
        }

    }

    if( "ontouchstart" in document.documentElement ){
        document.addEventListener("touchstart", this.resize_object.tr_drag_start, { capture: false, passive: false });
    }
    else{
        document.addEventListener("mousedown", this.resize_object.tr_drag_start, { capture: false, passive: false });
    }

}

/**
 * Crop box top left resize listeners
 */
Croppa.prototype.crop_box_resize_top_left = function(){

    var _self = this;
    var el = this.cropbox.el.get(0);
    var overlay_el = this.overlay.el.get(0);
    var handle_el = this.resizer.els.tl;

    this.resize_object.active = false;

    /**
     * Drag start
     */
    this.resize_object.tl_drag_start = function(e){
                
        if( e.target !== handle_el.get(0) ) return false;

        e.stopPropagation();
        e.preventDefault();

        _self.resize_object.active = true;

        if( "ontouchstart" in document.documentElement ){
            // disabled overlay drag listeners
            document.removeEventListener("touchstart", _self.drag_object.drag_start, { capture: false, passive: false });
            document.addEventListener("touchmove", _self.resize_object.tl_drag, { capture: false, passive: false });
            document.addEventListener("touchend", _self.resize_object.tl_drag_end, { capture: false, passive: false });
        }
        else{
            // disabled overlay drag listeners
            document.removeEventListener("mousedown", _self.drag_object.drag_start, { capture: false, passive: false });    
            document.addEventListener("mousemove", _self.resize_object.tl_drag, { capture: false, passive: false });
            document.addEventListener("mouseup", _self.resize_object.tl_drag_end, { capture: false, passive: false });
        }

        var x; 
        var y;
        
        if( e.type === "touchstart" ){
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }
        else {
            x = e.clientX;
            y = e.clientY;
        }

        _self.resize_object.posX = x;
        _self.resize_object.posY = y;

        _self.resize_object.top = parseFloat(el.style.top || 0);
        _self.resize_object.left = parseFloat(el.style.left || 0);

        var canvas_bounds = _self.canvas.getBoundingClientRect();
        var el_bounds = _self.overlay.el.get(0).getBoundingClientRect();
        
        // use the lowest
        var height_diff = el_bounds.y - canvas_bounds.y;
        var width_diff = el_bounds.x - canvas_bounds.x;
        // var diff = height_diff;

        // if( height_diff > width_diff ){
        //     diff = width_diff;
        // }

        _self.resize_object.maxWidth = el_bounds.width + width_diff;    
        _self.resize_object.maxHeight = el_bounds.height + height_diff;

        // var min_crop_box_size = _self.calculate_min_crop_box_size();
        
        // _self.resize_object.minWidth = min_crop_box_size[0];
        // _self.resize_object.minHeight = min_crop_box_size[1];
    }

    /**
     * dragging
     */
    this.resize_object.tl_drag = function(e){
        
        if( ! _self.resize_object.active ) return false;
        
        e.stopPropagation();
        e.preventDefault();

        var x; 
        var y;
        
        if( e.type === "touchmove" ){
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }
        else {
            x = e.clientX;
            y = e.clientY;
        }
        
        var moved_x = ( x - _self.resize_object.posX ) * -1;
        var moved_y = ( y - _self.resize_object.posY ) * -1;
        
        var newWidth = _self.data.crop_box_width + moved_x;
        var newHeight = _self.data.crop_box_height + moved_y;

        var width = Math.max( 2, Math.min( newWidth, _self.resize_object.maxWidth  ) );
        var height = Math.max( 2, Math.min( newHeight, _self.resize_object.maxHeight  ) );       
        
        el.style.width = width + 'px';
        el.style.height = height + 'px';

        overlay_el.style.width = el.style.width;
        overlay_el.style.height = el.style.height;

        el.style.top =  ( _self.resize_object.top - ( height - _self.data.crop_box_height ) ) + 'px';
        el.style.left =  ( _self.resize_object.left - ( width - _self.data.crop_box_width ) ) + 'px';

        overlay_el.style.top = el.style.top;
        overlay_el.style.left = el.style.left;
    }

    /**
     * Drag end
     */
    this.resize_object.tl_drag_end = function(e){

        e.stopPropagation();
        e.preventDefault();
        
        var canvas_bounds = _self.canvas.getBoundingClientRect();

        _self.resize_object.active = false;

        _self.data.crop_box_width = parseFloat( el.style.width );
        _self.data.crop_box_height = parseFloat( el.style.height );

        // Calculate NEW crop box width & height percentages
        _self.data.crop_box_width_perc = ( _self.data.crop_box_width * 100 ) / canvas_bounds.width;
        _self.data.crop_box_height_perc = ( _self.data.crop_box_height * 100 ) / canvas_bounds.height;
    
        // Calculate NEW crop box x & y percentages
        var top = parseFloat( el.style.top ) || 0;
        var left = parseFloat( el.style.left ) || 0;

        _self.data.crop_box_x_perc = ( left * 100) / canvas_bounds.width;
        _self.data.crop_box_y_perc = ( top * 100) / canvas_bounds.height;

        if( "ontouchstart" in document.documentElement ){
            document.removeEventListener("touchend", _self.resize_object.tl_drag_end, { capture: false, passive: false });
            document.removeEventListener("touchmove", _self.resize_object.tl_drag, { capture: false, passive: false });
            // enabled overlay drag listeners
            document.addEventListener("touchstart", _self.drag_object.drag_start, { capture: false, passive: false });
        }
        else{
            document.removeEventListener("mouseup", _self.resize_object.tl_drag_end, { capture: false, passive: false });
            document.removeEventListener("mousemove", _self.resize_object.tl_drag, { capture: false, passive: false });
            // enabled overlay drag listeners
            document.addEventListener("mousedown", _self.drag_object.drag_start, { capture: false, passive: false });
        }

    }

    if( "ontouchstart" in document.documentElement ){
        document.addEventListener("touchstart", this.resize_object.tl_drag_start, { capture: false, passive: false });
    }
    else{
        document.addEventListener("mousedown", this.resize_object.tl_drag_start, { capture: false, passive: false });
    }

}

/**
 * Crop box right resize listeners
 */
Croppa.prototype.crop_box_resize_right = function(){

    var _self = this;
    var el = this.cropbox.el.get(0);
    var overlay_el = this.overlay.el.get(0);
    var handle_el = this.resizer.els.right;

    this.resize_object.active = false;

    /**
     * Drag start
     */
    this.resize_object.right_drag_start = function(e){
    
        if( e.target !== handle_el.get(0) ) return false;

        e.stopPropagation();
        e.preventDefault();

        _self.resize_object.active = true;

        if( "ontouchstart" in document.documentElement ){
            // disabled overlay drag listeners
            document.removeEventListener("touchstart", _self.drag_object.drag_start, { capture: false, passive: false });
            document.addEventListener("touchmove", _self.resize_object.right_drag, { capture: false, passive: false });
            document.addEventListener("touchend", _self.resize_object.right_drag_end, { capture: false, passive: false });
        }
        else{
            // disabled overlay drag listeners
            document.removeEventListener("mousedown", _self.drag_object.drag_start, { capture: false, passive: false });
            document.addEventListener("mousemove", _self.resize_object.right_drag, { capture: false, passive: false });
            document.addEventListener("mouseup", _self.resize_object.right_drag_end, { capture: false, passive: false });
        }

        var x; 
        var y;
        
        if( e.type === "touchstart" ){
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }
        else {
            x = e.clientX;
            y = e.clientY;
        }

        _self.resize_object.posX = x;
        _self.resize_object.posY = y;

        var canvas_bounds = _self.canvas.getBoundingClientRect();
        var el_bounds = _self.overlay.el.get(0).getBoundingClientRect();
        
        // Calculate max width & height
        // use the lowest
        //var height_diff = ( canvas_bounds.y + canvas_bounds.height ) - ( el_bounds.y + el_bounds.height );
        var width_diff = ( canvas_bounds.x + canvas_bounds.width ) - ( el_bounds.x + el_bounds.width );
        // var diff = height_diff;
    
        // if( height_diff > width_diff ){
        //     diff = width_diff;
        // }
    
        _self.resize_object.maxWidth = el_bounds.width + width_diff;
        //_self.resize_object.maxHeight = el_bounds.height + height_diff;

        // var min_crop_box_size = _self.calculate_min_crop_box_size();
        
        // _self.resize_object.minWidth = min_crop_box_size[0];
        // _self.resize_object.minHeight = min_crop_box_size[1];
    }

    /**
     * dragging
     */
    this.resize_object.right_drag = function(e){
        
        if( ! _self.resize_object.active ) return false;
        
        e.stopPropagation();
        e.preventDefault();

        var x; 
        var y;
        
        if( e.type === "touchmove" ){
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }
        else {
            x = e.clientX;
            y = e.clientY;
        }
        
        var moved_x = x - _self.resize_object.posX;
        //var moved_y = y - _self.resize_object.posY;
        //var moved = moved_x > moved_y ? moved_x : moved_y;

        var newWidth = _self.data.crop_box_width + moved_x;
        //var newHeight = _self.data.crop_box_height + moved_y;

        var width = Math.max( 2, Math.min( newWidth, _self.resize_object.maxWidth  ) );
        //var height = Math.max( 2, Math.min( newHeight, _self.resize_object.maxHeight  ) );
        
        el.style.width = width + 'px';
        //el.style.height = height + 'px';

        overlay_el.style.width = el.style.width;
    }

    /**
     * Drag end
     */
    this.resize_object.right_drag_end = function(e){

        e.stopPropagation();
        e.preventDefault();

        var canvas_bounds = _self.canvas.getBoundingClientRect();

        _self.resize_object.active = false;

        _self.data.crop_box_width = parseFloat( el.style.width );
        _self.data.crop_box_height = parseFloat( el.style.height );
        
        // Calculate NEW crop box width & height percentages
        _self.data.crop_box_width_perc = ( _self.data.crop_box_width * 100 ) / canvas_bounds.width;
        _self.data.crop_box_height_perc = ( _self.data.crop_box_height * 100 ) / canvas_bounds.height;
        
        // Calculate NEW crop box x & y percentages
        var top = parseFloat( el.style.top ) || 0;
        var left = parseFloat( el.style.left ) || 0;

        _self.data.crop_box_x = left;
        _self.data.crop_box_y = top;

        _self.data.crop_box_x_perc = ( left * 100) / canvas_bounds.width;
        _self.data.crop_box_y_perc = ( top * 100) / canvas_bounds.height;

        if( "ontouchstart" in document.documentElement ){
            document.removeEventListener("touchend", _self.resize_object.right_drag_end, { capture: false, passive: false });
            document.removeEventListener("touchmove", _self.resize_object.right_drag, { capture: false, passive: false });
            // enabled overlay drag listeners
            document.addEventListener("touchstart", _self.drag_object.drag_start, { capture: false, passive: false });
        }
        else{
            document.removeEventListener("mouseup", _self.resize_object.right_drag_end, { capture: false, passive: false });
            document.removeEventListener("mousemove", _self.resize_object.right_drag, { capture: false, passive: false });
            // enabled overlay drag listeners
            document.addEventListener("mousedown", _self.drag_object.drag_start, { capture: false, passive: false });
        }

    }

    if( "ontouchstart" in document.documentElement ){
        document.addEventListener("touchstart", this.resize_object.right_drag_start, { capture: false, passive: false });
    }
    else{
        document.addEventListener("mousedown", this.resize_object.right_drag_start, { capture: false, passive: false });
    }

}

/**
 * Crop box right resize listeners
 */
Croppa.prototype.crop_box_resize_bottom = function(){

    var _self = this;
    var el = this.cropbox.el.get(0);
    var overlay_el = this.overlay.el.get(0);
    var handle_el = this.resizer.els.bottom;

    this.resize_object.active = false;

    /**
     * Drag start
     */
    this.resize_object.bottom_drag_start = function(e){
    
        if( e.target !== handle_el.get(0) ) return false;

        e.stopPropagation();
        e.preventDefault();

        _self.resize_object.active = true;

        if( "ontouchstart" in document.documentElement ){
            // disabled overlay drag listeners
            document.removeEventListener("touchstart", _self.drag_object.drag_start, { capture: false, passive: false });
            document.addEventListener("touchmove", _self.resize_object.bottom_drag, { capture: false, passive: false });
            document.addEventListener("touchend", _self.resize_object.bottom_drag_end, { capture: false, passive: false });
        }
        else{
            // disabled overlay drag listeners
            document.removeEventListener("mousedown", _self.drag_object.drag_start, { capture: false, passive: false });
            document.addEventListener("mousemove", _self.resize_object.bottom_drag, { capture: false, passive: false });
            document.addEventListener("mouseup", _self.resize_object.bottom_drag_end, { capture: false, passive: false });
        }

        var x; 
        var y;
        
        if( e.type === "touchstart" ){
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }
        else {
            x = e.clientX;
            y = e.clientY;
        }

        _self.resize_object.posX = x;
        _self.resize_object.posY = y;

        var canvas_bounds = _self.canvas.getBoundingClientRect();
        var el_bounds = _self.overlay.el.get(0).getBoundingClientRect();
        
        // Calculate max width & height
        // use the lowest
        var height_diff = ( canvas_bounds.y + canvas_bounds.height ) - ( el_bounds.y + el_bounds.height );
        //var width_diff = ( canvas_bounds.x + canvas_bounds.width ) - ( el_bounds.x + el_bounds.width );
        // var diff = height_diff;
    
        // if( height_diff > width_diff ){
        //     diff = width_diff;
        // }
    
        //_self.resize_object.maxWidth = el_bounds.width + width_diff;
        _self.resize_object.maxHeight = el_bounds.height + height_diff;

        // var min_crop_box_size = _self.calculate_min_crop_box_size();
        
        // _self.resize_object.minWidth = min_crop_box_size[0];
        // _self.resize_object.minHeight = min_crop_box_size[1];
    }

    /**
     * dragging
     */
    this.resize_object.bottom_drag = function(e){
        
        if( ! _self.resize_object.active ) return false;
        
        e.stopPropagation();
        e.preventDefault();

        var x; 
        var y;
        
        if( e.type === "touchmove" ){
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }
        else {
            x = e.clientX;
            y = e.clientY;
        }
        
        //var moved_x = x - _self.resize_object.posX;
        var moved_y = y - _self.resize_object.posY;
        //var moved = moved_x > moved_y ? moved_x : moved_y;

        //var newWidth = _self.data.crop_box_width + moved_x;
        var newHeight = _self.data.crop_box_height + moved_y;

        //var width = Math.max( 2, Math.min( newWidth, _self.resize_object.maxWidth  ) );
        var height = Math.max( 2, Math.min( newHeight, _self.resize_object.maxHeight  ) );
        
        //el.style.width = width + 'px';
        el.style.height = height + 'px';

        overlay_el.style.height = el.style.height;
    }

    /**
     * Drag end
     */
    this.resize_object.bottom_drag_end = function(e){
        
        e.stopPropagation();
        e.preventDefault();

        var canvas_bounds = _self.canvas.getBoundingClientRect();

        _self.resize_object.active = false;

        _self.data.crop_box_width = parseFloat( el.style.width );
        _self.data.crop_box_height = parseFloat( el.style.height );
        
        // Calculate NEW crop box width & height percentages
        _self.data.crop_box_width_perc = ( _self.data.crop_box_width * 100 ) / canvas_bounds.width;
        _self.data.crop_box_height_perc = ( _self.data.crop_box_height * 100 ) / canvas_bounds.height;
        
        // Calculate NEW crop box x & y percentages
        var top = parseFloat( el.style.top ) || 0;
        var left = parseFloat( el.style.left ) || 0;

        _self.data.crop_box_x = left;
        _self.data.crop_box_y = top;

        _self.data.crop_box_x_perc = ( left * 100) / canvas_bounds.width;
        _self.data.crop_box_y_perc = ( top * 100) / canvas_bounds.height;

        if( "ontouchstart" in document.documentElement ){
            document.removeEventListener("touchend", _self.resize_object.bottom_drag_end, { capture: false, passive: false });
            document.removeEventListener("touchmove", _self.resize_object.bottom_drag, { capture: false, passive: false });
            // enabled overlay drag listeners
            document.addEventListener("touchstart", _self.drag_object.drag_start, { capture: false, passive: false });
        }
        else{
            document.removeEventListener("mouseup", _self.resize_object.bottom_drag_end, { capture: false, passive: false });
            document.removeEventListener("mousemove", _self.resize_object.bottom_drag, { capture: false, passive: false });
            // enabled overlay drag listeners
            document.addEventListener("mousedown", _self.drag_object.drag_start, { capture: false, passive: false });
        }

    }

    if( "ontouchstart" in document.documentElement ){
        document.addEventListener("touchstart", this.resize_object.bottom_drag_start, { capture: false, passive: false });
    }
    else{
        document.addEventListener("mousedown", this.resize_object.bottom_drag_start, { capture: false, passive: false });
    }

}

/**
 * Crop box top resize listeners
 */
Croppa.prototype.crop_box_resize_top = function(){

    var _self = this;
    var el = this.cropbox.el.get(0);
    var overlay_el = this.overlay.el.get(0);
    var handle_el = this.resizer.els.top;

    this.resize_object.active = false;

    /**
     * Drag start
     */
    this.resize_object.top_drag_start = function(e){

        if( e.target !== handle_el.get(0) ) return false;

        e.stopPropagation();
        e.preventDefault();

        _self.resize_object.active = true;
        
        if( "ontouchstart" in document.documentElement ){
            // disabled overlay drag listeners
            document.removeEventListener("touchstart", _self.drag_object.drag_start, { capture: false, passive: false });
            document.addEventListener("touchmove", _self.resize_object.top_drag, { capture: false, passive: false });
            document.addEventListener("touchend", _self.resize_object.top_drag_end, { capture: false, passive: false });
        }
        else{
            // disabled overlay drag listeners
            document.removeEventListener("mousedown", _self.drag_object.drag_start, { capture: false, passive: false });
            document.addEventListener("mousemove", _self.resize_object.top_drag, { capture: false, passive: false });
            document.addEventListener("mouseup", _self.resize_object.top_drag_end, { capture: false, passive: false });
        }

        var x; 
        var y;
        
        if( e.type === "touchstart" ){
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }
        else {
            x = e.clientX;
            y = e.clientY;
        }

        _self.resize_object.posX = x;
        _self.resize_object.posY = y;

        _self.resize_object.top = parseFloat(el.style.top || 0);
        
        var canvas_bounds = _self.canvas.getBoundingClientRect();
        var el_bounds = _self.overlay.el.get(0).getBoundingClientRect();
        
        // use the lowest
        var height_diff = el_bounds.y - canvas_bounds.y;
        //var width_diff = ( canvas_bounds.x + canvas_bounds.width ) - ( el_bounds.x + el_bounds.width );
        // var diff = height_diff;

        // if( height_diff > width_diff ){
        //     diff = width_diff;
        // }

        //_self.resize_object.maxWidth = el_bounds.width + width_diff;    
        _self.resize_object.maxHeight = el_bounds.height + height_diff;

        // var min_crop_box_size = _self.calculate_min_crop_box_size();

        // _self.resize_object.minWidth = min_crop_box_size[0];
        // _self.resize_object.minHeight = min_crop_box_size[1];        
    }

    /**
     * dragging
     */
    this.resize_object.top_drag = function(e){
        
        if( ! _self.resize_object.active ) return false;
        
        e.stopPropagation();
        e.preventDefault();

        var x; 
        var y;
        
        if( e.type === "touchmove" ){
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }
        else {
            x = e.clientX;
            y = e.clientY;
        }

        //var moved_x = x - _self.resize_object.posX;
        var moved_y = ( y - _self.resize_object.posY ) * -1;
        //var moved = moved_x > moved_y ? moved_x : moved_y * -1;

        //var newWidth = _self.data.crop_box_width + moved_x;
        var newHeight = _self.data.crop_box_height + moved_y;

        //var width = Math.max( 2, Math.min( newWidth, _self.resize_object.maxWidth  ) );
        var height = Math.max( 2, Math.min( newHeight, _self.resize_object.maxHeight  ) );       
        
        //el.style.width = width + 'px';
        el.style.height = height + 'px';
                
        overlay_el.style.height = el.style.height;

        el.style.top = ( _self.resize_object.top - ( height - _self.data.crop_box_height ) ) + 'px';

        overlay_el.style.top = el.style.top;
    }

    /**
     * Drag end
     */
    this.resize_object.top_drag_end = function(e){

        e.stopPropagation();
        e.preventDefault();

        var canvas_bounds = _self.canvas.getBoundingClientRect();

        _self.resize_object.active = false;

        _self.data.crop_box_width = parseFloat( el.style.width );
        _self.data.crop_box_height = parseFloat( el.style.height );
    
        // Calculate NEW crop box width & height percentages
        _self.data.crop_box_width_perc = ( _self.data.crop_box_width * 100 ) / canvas_bounds.width;
        _self.data.crop_box_height_perc = ( _self.data.crop_box_height * 100 ) / canvas_bounds.height;
    
        // Calculate NEW crop box x & y percentages
        var top = parseFloat( el.style.top ) || 0;
        var left = parseFloat( el.style.left ) || 0;

        _self.data.crop_box_x_perc = ( left * 100) / canvas_bounds.width;
        _self.data.crop_box_y_perc = ( top * 100) / canvas_bounds.height;

        if( "ontouchstart" in document.documentElement ){
            document.removeEventListener("touchend", _self.resize_object.top_drag_end, { capture: false, passive: false });
            document.removeEventListener("touchmove", _self.resize_object.top_drag, { capture: false, passive: false });
            // enabled overlay drag listeners
            document.addEventListener("touchstart", _self.drag_object.drag_start, { capture: false, passive: false });
        }
        else{
            document.removeEventListener("mouseup", _self.resize_object.top_drag_end, { capture: false, passive: false });
            document.removeEventListener("mousemove", _self.resize_object.top_drag, { capture: false, passive: false });
            // enabled overlay drag listeners
            document.addEventListener("mousedown", _self.drag_object.drag_start, { capture: false, passive: false });
        }

    }

    if( "ontouchstart" in document.documentElement ){
        document.addEventListener("touchstart", this.resize_object.top_drag_start, { capture: false, passive: false });
    }
    else{
        document.addEventListener("mousedown", this.resize_object.top_drag_start, { capture: false, passive: false });
    }

}

/**
 * Crop box top left resize listeners
 */
Croppa.prototype.crop_box_resize_left = function(){

    var _self = this;
    var el = this.cropbox.el.get(0);
    var overlay_el = this.overlay.el.get(0);
    var handle_el = this.resizer.els.left;

    this.resize_object.active = false;

    /**
     * Drag start
     */
    this.resize_object.left_drag_start = function(e){
                
        if( e.target !== handle_el.get(0) ) return false;

        e.stopPropagation();
        e.preventDefault();

        _self.resize_object.active = true;

        if( "ontouchstart" in document.documentElement ){
            // disabled overlay drag listeners
            document.removeEventListener("touchstart", _self.drag_object.drag_start, { capture: false, passive: false });
            document.addEventListener("touchmove", _self.resize_object.left_drag, { capture: false, passive: false });
            document.addEventListener("touchend", _self.resize_object.left_drag_end, { capture: false, passive: false });
        }
        else{
            // disabled overlay drag listeners
            document.removeEventListener("mousedown", _self.drag_object.drag_start, { capture: false, passive: false });
            document.addEventListener("mousemove", _self.resize_object.left_drag, { capture: false, passive: false });
            document.addEventListener("mouseup", _self.resize_object.left_drag_end, { capture: false, passive: false });
        }

        var x; 
        var y;
        
        if( e.type === "touchstart" ){
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }
        else {
            x = e.clientX;
            y = e.clientY;
        }

        _self.resize_object.posX = x;
        _self.resize_object.posY = y;

        _self.resize_object.top = parseFloat(el.style.top||0);
        _self.resize_object.left = parseFloat(el.style.left||0);

        var canvas_bounds = _self.canvas.getBoundingClientRect();
        var el_bounds = _self.overlay.el.get(0).getBoundingClientRect();
        
        // use the lowest
        //var height_diff = el_bounds.y - canvas_bounds.y;
        var width_diff = el_bounds.x - canvas_bounds.x;
        // var diff = height_diff;

        // if( height_diff > width_diff ){
        //     diff = width_diff;
        // }

        _self.resize_object.maxWidth = el_bounds.width + width_diff;    
        //_self.resize_object.maxHeight = el_bounds.height + height_diff;

        // var min_crop_box_size = _self.calculate_min_crop_box_size();
        
        // _self.resize_object.minWidth = min_crop_box_size[0];
        // _self.resize_object.minHeight = min_crop_box_size[1];
    }

    /**
     * dragging
     */
    this.resize_object.left_drag = function(e){

        if( ! _self.resize_object.active ) return false;        

        e.stopPropagation();
        e.preventDefault();

        var x; 
        var y;
        
        if( e.type === "touchmove" ){
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }
        else {
            x = e.clientX;
            y = e.clientY;
        }
        
        var moved_x = ( x - _self.resize_object.posX ) * -1;
        //var moved_y = ( y - _self.resize_object.posY ) * -1;
        // var moved = moved_x > moved_y ? moved_x : moved_y;
        // moved *= -1;

        var newWidth = _self.data.crop_box_width + moved_x;
        //var newHeight = _self.data.crop_box_height + moved_y;

        var width = newWidth;
        //var height = newHeight;
    
        var width = Math.max( 2, Math.min( newWidth, _self.resize_object.maxWidth  ) );
        //var height = Math.max( 2, Math.min( newHeight, _self.resize_object.maxHeight  ) );       
        
        el.style.width = width + 'px';
        //el.style.height = height + 'px';

        overlay_el.style.width = el.style.width;

        el.style.left = ( _self.resize_object.left - ( width - _self.data.crop_box_width ) ) + 'px';
        //el.style.top =  ( _self.resize_object.top - ( height - _self.data.crop_box_height ) ) + 'px';

        overlay_el.style.left = el.style.left;
    }

    /**
     * Drag end
     */
    this.resize_object.left_drag_end = function(e){

        e.stopPropagation();
        e.preventDefault();

        var canvas_bounds = _self.canvas.getBoundingClientRect();

        _self.resize_object.active = false;

        _self.data.crop_box_width = parseFloat( el.style.width );
        _self.data.crop_box_height = parseFloat( el.style.height );

        // Calculate NEW crop box width & height percentages
        _self.data.crop_box_width_perc = ( _self.data.crop_box_width * 100 ) / canvas_bounds.width;
        _self.data.crop_box_height_perc = ( _self.data.crop_box_height * 100 ) / canvas_bounds.height;
    
        // Calculate NEW crop box x & y percentages
        var top = parseFloat( el.style.top ) || 0;
        var left = parseFloat( el.style.left ) || 0;

        _self.data.crop_box_x_perc = ( left * 100) / canvas_bounds.width;
        _self.data.crop_box_y_perc = ( top * 100) / canvas_bounds.height;

        if( "ontouchstart" in document.documentElement ){
            document.removeEventListener("touchend", _self.resize_object.left_drag_end, { capture: false, passive: false });
            document.removeEventListener("touchmove", _self.resize_object.left_drag, { capture: false, passive: false });
            // enabled overlay drag listeners
            document.addEventListener("touchstart", _self.drag_object.drag_start, { capture: false, passive: false });
        }
        else{
            document.removeEventListener("mouseup", _self.resize_object.left_drag_end, { capture: false, passive: false });
            document.removeEventListener("mousemove", _self.resize_object.left_drag, { capture: false, passive: false });
            // enabled overlay drag listeners
            document.addEventListener("mousedown", _self.drag_object.drag_start, { capture: false, passive: false });
        }

    }

    if( "ontouchstart" in document.documentElement ){
        document.addEventListener("touchstart", this.resize_object.left_drag_start, { capture: false, passive: false });
    }
    else{
        document.addEventListener("mousedown", this.resize_object.left_drag_start, { capture: false, passive: false });
    }

}

/**
 * Destroy
 */
Croppa.prototype.destroy = function(){

    if( this.drag_object ){

        if( "ontouchstart" in document.documentElement ){
            document.removeEventListener("touchstart", this.drag_object.drag_start, { capture: false, passive: false });
        }
        else{
            document.removeEventListener("mousedown", this.drag_object.drag_start, { capture: false, passive: false });
        }

    }

    if( this.resize_object ){

        if( "ontouchstart" in document.documentElement ){
            document.removeEventListener("touchstart", this.resize_object.tl_drag_start, { capture: false, passive: false });
            document.removeEventListener("touchstart", this.resize_object.tr_drag_start, { capture: false, passive: false });
            document.removeEventListener("touchstart", this.resize_object.bl_drag_start, { capture: false, passive: false });
            document.removeEventListener("touchstart", this.resize_object.br_drag_start, { capture: false, passive: false });
            document.removeEventListener("touchstart", this.resize_object.top_drag_start, { capture: false, passive: false });
            document.removeEventListener("touchstart", this.resize_object.right_drag_start, { capture: false, passive: false });
            document.removeEventListener("touchstart", this.resize_object.bottom_drag_start, { capture: false, passive: false });
            document.removeEventListener("touchstart", this.resize_object.left_drag_start, { capture: false, passive: false });
        }
        else{
            document.removeEventListener("mousedown", this.resize_object.tl_drag_start, { capture: false, passive: false });
            document.removeEventListener("mousedown", this.resize_object.tr_drag_start, { capture: false, passive: false });
            document.removeEventListener("mousedown", this.resize_object.bl_drag_start, { capture: false, passive: false });        
            document.removeEventListener("mousedown", this.resize_object.br_drag_start, { capture: false, passive: false });
            document.removeEventListener("mousedown", this.resize_object.top_drag_start, { capture: false, passive: false });
            document.removeEventListener("mousedown", this.resize_object.right_drag_start, { capture: false, passive: false });
            document.removeEventListener("mousedown", this.resize_object.bottom_drag_start, { capture: false, passive: false });
            document.removeEventListener("mousedown", this.resize_object.left_drag_start, { capture: false, passive: false });
        }
        
    }

    this.container.parent.removeClass('croppa-parent');
    this.container.el.remove();
    this.image.onload = null;
    
    if( this.data.resize_handler ){
        jQuery(window).off('resize', this.data.resize_handler);
    }
}
