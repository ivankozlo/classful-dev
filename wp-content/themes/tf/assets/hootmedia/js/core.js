(function($){
    
    window.HOOT = {};
    HOOT.doc = $(document);
    HOOT.html = $('html');
    HOOT.body = $('body');
    HOOT.editor_el = $('#hoot-editor');
    HOOT.preview_el = $('#hoot-preview');
    HOOT.datetime = {
        current: null,
        min: null,
    };

    /**
     * Validate email
     * @param {string} email 
     * @return {boolean}
     */
    HOOT.is_email_valid = function(email) {
        if (/^[\w\.\-\_]+?@[\w\-\_]+?\.\w{2,7}$/.test(email)){
            return true;
        }

        return false;
    }

    /**
     * Get notice markup
     * @param {string} message 
     * @param {boolean} error 
     * @return {string}
     */
    HOOT.notice = function( message, error ){

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
     * Remove all html tags
     * @param {string} html 
     */
    HOOT.stripHtml = function(html){

        html = html.replace(/\<\/?br\>/ig, "__NEWLINENEWLINE__");
        html = html.replace(/\<\/(.+?)\>/ig, "\<\/$1\>__NEWSPACENEWSPACE__");

        var tmp = document.createElement("div");
        tmp.innerHTML = html;

        var text = tmp.innerText;
        text = text.replace('__NEWSPACENEWSPACE____NEWSPACENEWSPACE____NEWSPACENEWSPACE____NEWSPACENEWSPACE____NEWSPACENEWSPACE____NEWSPACENEWSPACE____NEWSPACENEWSPACE____NEWSPACENEWSPACE____NEWSPACENEWSPACE__', "__NEWSPACENEWSPACE__");
        text = text.replace('__NEWSPACENEWSPACE____NEWSPACENEWSPACE____NEWSPACENEWSPACE____NEWSPACENEWSPACE____NEWSPACENEWSPACE____NEWSPACENEWSPACE____NEWSPACENEWSPACE____NEWSPACENEWSPACE__', "__NEWSPACENEWSPACE__");
        text = text.replace('__NEWSPACENEWSPACE____NEWSPACENEWSPACE____NEWSPACENEWSPACE____NEWSPACENEWSPACE____NEWSPACENEWSPACE____NEWSPACENEWSPACE____NEWSPACENEWSPACE__', "__NEWSPACENEWSPACE__");
        text = text.replace('__NEWSPACENEWSPACE____NEWSPACENEWSPACE____NEWSPACENEWSPACE____NEWSPACENEWSPACE____NEWSPACENEWSPACE____NEWSPACENEWSPACE__', "__NEWSPACENEWSPACE__");
        text = text.replace('__NEWSPACENEWSPACE____NEWSPACENEWSPACE____NEWSPACENEWSPACE____NEWSPACENEWSPACE____NEWSPACENEWSPACE__', "__NEWSPACENEWSPACE__");
        text = text.replace('__NEWSPACENEWSPACE____NEWSPACENEWSPACE____NEWSPACENEWSPACE____NEWSPACENEWSPACE__', "__NEWSPACENEWSPACE__");
        text = text.replace('__NEWSPACENEWSPACE____NEWSPACENEWSPACE____NEWSPACENEWSPACE__', "__NEWSPACENEWSPACE__");
        text = text.replace('__NEWSPACENEWSPACE____NEWSPACENEWSPACE__', "__NEWSPACENEWSPACE__");
        text = text.replace(/__NEWSPACENEWSPACE__/ig, " ");
        text = text.replace(/__NEWLINENEWLINE__/ig, "<br>");

        return text;
    }

    /**
     * Return the date as it is, no user timezone converting.
     * 
     * @param {int} year
     * @param {int} month 
     * @param {int} day 
     * @param {int} hours 
     * @param {int} minutes
     * @param {string} pam
     * @returns Object
     */
    HOOT.prepare_date = function( year, month, day, hours, minutes, pam ){

        pam = pam || null;
        hours = parseInt(hours);
        minutes = parseInt(minutes);
        year = parseInt(year);
        month = parseInt(month);
        day = parseInt(day);

        if( pam === 'pm' ){

            hours += 12;

            if( hours === 24 ){
                hours = 0;
            }
        }
        else if( pam === 'am' && hours === 12 ){
            hours = 0;
        }

        var date = new Date();
        date.setFullYear(year);
        date.setMonth(month);
        date.setDate(day);
        date.setHours(hours);
        date.setMinutes(minutes);

        return date;
    }

    /**
     * Parse datetime string date (picker format: 2020-02-28 10:05 AM)
     * 
     * @param {string} date_str 
     * @return {object}
     */
    HOOT.parse_date = function( date_str ){

        var parts = date_str.split(' ');
        var date = parts[0];
        var date_parts = date.split('-');
        var time = parts[1];
        var time_parts = time.split(':');
        var pam = parts[2];
        var year = parseInt(date_parts[0]);
        var month = parseInt(date_parts[1]) - 1; // js month starts from 0
        var day = parseInt(date_parts[2]);
        var hour = parseInt(time_parts[0]);
        var minute = parseInt(time_parts[1]);

        if( pam === 'PM' && hour != 12 ){
            hour = hour + 12;
        }
        else if( pam === 'AM' && hour == 12 ){
            hour = 00;
        }

        var date_obj = {
            year: year,
            month: month,
            day: day,
            hour: hour,
            minute: minute,
        };

        return date_obj;
    }

    /**
     * Check if url is valid
     * @param {string} url 
     */
    HOOT.isValidUrl = function( url ){

        try {
            return new URL(string);
        } 
        catch (e){
            return false;  
        }
    }

    /**
     * Human readable number
     * Add k/m/b to numbers
     * 
     * @param {int} number 
     */
    HOOT.human_number = function(number){

        var SI_SYMBOL = ["", "K", "M", "G", "T", "P", "E"];

        // what tier? (determines SI symbol)
        var tier = Math.log10(number) / 3 | 0;

        // if zero, we don't need a suffix
        if(tier == 0) return number;

        // get suffix and determine scale
        var suffix = SI_SYMBOL[tier];
        var scale = Math.pow(10, tier * 3);

        // scale the number
        var scaled = number / scale;

        // format number and add suffix
        return scaled.toFixed(1) + suffix;
    }

    /**
     * Capitalize first letter
     * 
     * @param {string}
     * @returns {string}
     */
    HOOT.ucfirst = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    /**
     * Hashtag highlighter
     * 
     * @param {string}
     * @returns {string}
     */
    HOOT.hashtag_highlighter = function( string ){        
        return string.replace( /\#\w*/g, '<strong>$&</strong>');
    }
    
    /**
     * Disconnect confirm
     */
    $('.__hoot_confirm_disconnect').on('click', function(e){
        if( ! confirm(HOOT_PARAMS.disconnect_confirm) ){
            e.preventDefault();
        }
    });

    /**
     * Component: Datetime Submit 
     * Open Event
     * 
     * Options:
     * - data-mindate - datetime picker minDate
     */
    HOOT.datetimepicker;
    HOOT.datetimepickerData = {
        dateFormat : 'yy-mm-dd',
        timeFormat: 'hh:mm TT',
        timeInput: false,
        controlType: 'select',
        changeMonth: true,
        changeYear: true,
        showButtonPanel: false,
        stepMinute: 5,
        show: true,
        onSelect: function ( str, instance){

            var _self = $(this);
            var component = _self.closest('.hoot-component-datetime-submit');
            
            component.find('[type="hidden"]').val( str );
            _self.change();
        },
    };
    
    HOOT.doc.ready(function(){

        var component = $('.hoot-component-datetime-submit');

        if( ! component.length ) return true;

    });

    // open
    HOOT.doc.on('click', '.hoot-component-datetime-submit [data-action="open-datepicker"]', function(e){
        e.preventDefault();
        e.stopPropagation();

        var _self = $(this).closest('.hoot-component-datetime-submit');           
        var picker_el = _self.find('.hoot-component-date-picker-picker');
        var input_el = _self.find('[type="hidden"]');
        var date_str = input_el.val();
        var min_date_str = input_el.attr('data-mindate');
        var date_object;
        var min_date_object;
        
        date_object = HOOT.parse_date( date_str );  
        date_object = HOOT.prepare_date(
            date_object.year,
            date_object.month,
            date_object.day,
            date_object.hour,
            date_object.minute
        );

        min_date_object = HOOT.parse_date( min_date_str );  
        min_date_object = HOOT.prepare_date(
            min_date_object.year,
            min_date_object.month,
            min_date_object.day,
            min_date_object.hour,
            min_date_object.minute
        );

        try {
            HOOT.datetimepickerData.minDate = min_date_object;
            HOOT.datetimepicker = picker_el.datetimepicker(HOOT.datetimepickerData);
            HOOT.datetimepicker.datetimepicker( 'setDate', date_object );
        } 
        catch (error) {
            //console.log(error);
        }

        _self.find('.hoot-input-datetime-wrapper').show();

        HOOT.html.trigger('hoot_component_datetime', [ _self, 'opened' ]);
    });

    // close / save
    HOOT.doc.on('click', '.hoot-component-datetime-submit [data-action="close-datepicker"], .hoot-component-datetime-submit [data-action="save-datepicker"]', function(e){
        e.preventDefault();
        
        var _self = $(this).closest('.hoot-component-datetime-submit');
    
        _self.find('.hoot-input-datetime-wrapper').hide();
    });

    HOOT.doc.on('click', '.hoot-component-datetime-submit button[type="submit"]', function(e){
        $(this).closest('.hoot-component-datetime-submit').attr('data-clicked', 1);
    });

    /**
     * Component: Switch
     * 
     * Select Event
     */
    HOOT.doc.on('click', '.hoot-component-switch button', function(e){
        e.preventDefault();

        var _self = $(this);
        var component = _self.closest('.hoot-component-switch');

        component.find('button').attr('data-selected', 0);
        component.find('button[data-key="'+_self.attr('data-key')+'"]').attr('data-selected', 1);

        component.find('[type="hidden"]').val(_self.attr('data-key')).trigger('input');
    });

    /**
     * Component: Number
     * 
     * Select Event
     */
    HOOT.doc.on('click', '.hoot-component-number button', function(e){
        e.preventDefault();

        var _self = $(this);
        var component = _self.closest('.hoot-component-number');
        var el = component.find('input');
        var num = parseInt( el.val() );
        var min = parseInt( component.data('min') );
        var max = parseInt( component.data('max') );

        if( _self.attr('data-type') === 'plus' ){

            if( (num + 1) > max ) return false;

            num += 1;
        }
        else{

            if( (num - 1) < min ) return false;
            
            num -= 1;
        }

        component.find('span').text( num );
        el.val( num ).trigger('change');
    });

    /**
     * Component: Date picker 
     * Open Event
     * 
     * Options:
     * - data-mindate - date picker minDate
     */
    var com_date_picker;
    var com_date_picker_data = {
        dateFormat : 'yy-mm-dd',
        changeMonth: true,
        changeYear: true,
        //showButtonPanel: true,
        //show: true,
        onSelect: function ( str, instance){

            var _self = $(this);

            _self.parent().find('[type="hidden"]').val( str ).trigger('input');
        },
    };

    // open
    HOOT.doc.on('click', '.hoot-component-date-picker [data-action="open-datepicker"]', function(e){
        e.preventDefault();

        var _self = $(this).closest('.hoot-component-date-picker');
        var el = _self.find('.hoot-component-date-picker-picker');  
        var date_str = _self.find('[type="hidden"]').val();  
    
        _self.find('.hoot-component-date-picker-modal').show();

        if( ! el.hasClass('.hasDatepicker') ){
            try {
                com_date_picker = el.datepicker( com_date_picker_data );
                com_date_picker.datepicker( 'setDate', date_str );
            } 
            catch (error) {
                //console.log(error);
            }
        }
    });

    // close / save
    HOOT.doc.on('click', '.hoot-component-date-picker [data-action="close-datepicker"], .hoot-component-date-picker [data-action="save-datepicker"]', function(e){
        e.preventDefault();
        
        var _self = $(this).closest('.hoot-component-date-picker');
    
        _self.find('[type="hidden"]').trigger('input');

        _self.find('.hoot-component-date-picker-modal').hide();
    });

    /**
     * Add afterShow trigger to jquery ui datepicker
     */
    if( $.datepicker ){
        $.datepicker._updateDatepicker_original = $.datepicker._updateDatepicker;
        $.datepicker._updateDatepicker = function(inst) {
            $.datepicker._updateDatepicker_original(inst);
            var afterShow = this._get(inst, 'afterShow');
            if (afterShow)
                afterShow.apply((inst.input ? inst.input[0] : null));  // trigger custom callback
        }
    }
    
    /**
     * Single datepicker modal component
     * 
     * @param object args
     */
    var SingleDatePickerModal = function( args ){

        if( ! args ){
            return new Error('No args');
        }

        this.selector = args.selector || '';
        this.autoSelect = args.autoSelect || false;
        this.closeOnSelect = args.closeOnSelect || false;
        this.hideButtons = args.hideButtons || false;
        this.visible = args.visible || false;

        if ( this.selector instanceof jQuery ){
            this.$el = this.selector;
        }
        else{
            this.$el = jQuery(this.selector);
        }

        if( ! this.$el.length ){
            return new Error("Element not found, please make sure the jQuery selector is correct.");
        }

        this.$datepicker = null;
        this.$hidden = this.$el.find('[type="hidden"]');
        this.date = this.$hidden.val();
        
        this.pickerArgs = {
            dateFormat : 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            //showButtonPanel: true,
            //show: true,
            onSelect: function( str, inst ){
                
                this.date = str;

                if( this.autoSelect ){
                    this.$hidden.val( this.toString() ).trigger('input');
                }

                if( this.closeOnSelect && this.autoSelect ){
                    this.$el.find('.hc-modal').hide();
                }

            }.bind(this),
        }

        this.init();
        this.bindEvents();
    }

    SingleDatePickerModal.prototype.init = function() {

        if( ! this.$datepicker ){
            this.$datepicker = this.$el.find('.hc-picker').datepicker( this.pickerArgs );
            this.$datepicker.datepicker( 'setDate', this.date );
        }

        if( this.hideButtons ){
            this.$el.find('.hc-buttons').css('display', 'none');
        }

        if( this.visible ){
            this.$el.addClass('__visible');
        }
    }

    SingleDatePickerModal.prototype.bindEvents = function() {

        this.$el.find('[data-action="open-datepicker-modal"]').on('click', function(e){
            e.preventDefault();
            this.$el.find('.hc-modal').show();            
        }.bind(this));

        this.$el.find('[data-action="close-datepicker-modal"]').on('click', function(e){
            e.preventDefault();
            this.$el.find('.hc-modal').hide();
        }.bind(this));

        this.$el.find('[data-action="save-datepicker-modal"]').on('click', function(e){
            e.preventDefault();
            this.$hidden.val( this.toString() ).trigger('input');
            this.$el.find('.hc-modal').hide();
        }.bind(this));
    }

    SingleDatePickerModal.prototype.getDateObject = function() {
        return this.$datepicker.datepicker( "getDate" );
    }

    SingleDatePickerModal.prototype.getDate = function() {
        return this.date;
    }

    SingleDatePickerModal.prototype.setDate = function( date ) {
        this.date = date;
        this.$hidden.val(date);
        this.$datepicker.datepicker( "setDate", date );
    }

    SingleDatePickerModal.prototype.toString = function() {
        return this.date;
    }

    SingleDatePickerModal.prototype.destroy = function(){

        this.$datepicker.datepicker( "destroy" );

        this.$el.find('[data-action="open-datepicker-modal"]').off();
        this.$el.find('[data-action="close-datepicker-modal"]').off();
        this.$el.find('[data-action="save-datepicker-modal"]').off();
    }

    HOOT.SingleDatePickerModal = SingleDatePickerModal;

    /**
     * Multiple datepicker modal component
     * 
     * @param object args
     */

    var MultipleDatePickerModal = function( args ){

        if( ! args ) {
            return new Error("Args");
        }

        this.selector = args.selector || '';
        this.autoSelect = args.autoSelect || false;
        this.hideButtons = args.hideButtons || false;
        this.visible = args.visible || false;

        if ( this.selector instanceof jQuery ){
            this.$el = this.selector;
        }
        else{
            this.$el = jQuery(this.selector);
        }

        if( ! this.$el.length ){
            return new Error("Element not found, please make sure the jQuery selector is correct.");
        }

        this.$datepicker = null;
        this.$hidden = this.$el.find('[type="hidden"]');
        this.dates = this.$hidden.val().split('|').filter(function( item ){ return item !== ''; });
        
        this.pickerArgs = {
            dateFormat : 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            //showButtonPanel: true,
            //show: true,
            onSelect: function( str, inst ){
                
                this.addOrRemoveDate( str );

                if( this.autoSelect ){
                    this.$hidden.val( this.toString() ).trigger('input');
                }

            }.bind(this),
            beforeShowDay: function(date){
                
                var gotDate = $.inArray(
                    $.datepicker.formatDate( this.pickerArgs.dateFormat, date ), 
                    this.dates
                );
                
                if (gotDate >= 0) {
                    return [ true, "ui-state-multiple-selected", "Selected" ];
                }

                return [true, "ui-state-multiple-unselected", "Unselect"];
            }.bind(this),
            afterShow: function(){

                if( this.$datepicker ){
                    this.$datepicker.find('.ui-state-multiple-unselected .ui-state-active').removeClass('ui-state-active');
                }
                
            }.bind(this),
        }

        this.init();
        this.bindEvents();
    }

    MultipleDatePickerModal.prototype.init = function() {

        if( ! this.$datepicker ){
            this.$datepicker = this.$el.find('.hc-picker').datepicker( this.pickerArgs );
        }

        if( this.hideButtons ){
            this.$el.find('.hc-buttons').css('display', 'none');
        }

        if( this.visible ){
            this.$el.addClass('__visible');
        }
    }

    MultipleDatePickerModal.prototype.bindEvents = function() {

        this.$datepicker.on("change", function() {
            //console.log("Change event");
        });

        this.$el.find('[data-action="open-datepicker-modal"]').on('click', function(e){
            e.preventDefault();
            this.$el.find('.hc-modal').show();
        }.bind(this));

        this.$el.find('[data-action="close-datepicker-modal"]').on('click', function(e){
            e.preventDefault();
            this.$el.find('.hc-modal').hide();
        }.bind(this));

        this.$el.find('[data-action="save-datepicker-modal"]').on('click', function(e){
            e.preventDefault();
            this.$hidden.val( this.toString() ).trigger('input');
            this.$el.find('.hc-modal').hide();
        }.bind(this));
    }

    MultipleDatePickerModal.prototype.getDates = function() {
        return this.dates;
    }

    MultipleDatePickerModal.prototype.getDatesObjects = function() {

        var objects = [];
        
        this.dates.map(function( date ){
            var parts = date.split('-');            
            objects.push( HOOT.prepare_date( parts[0], parseInt(parts[1] - 1), parts[2], 0, 0 ) );
        });

        return objects;
    }

    MultipleDatePickerModal.prototype.setDates = function( dates ) {
        this.dates = dates;
        this.$hidden.val(dates.join('|'));
        this.$datepicker.datepicker( "refresh" );
    }

    MultipleDatePickerModal.prototype.toString = function() {        
        return this.dates.join('|');
    }

    MultipleDatePickerModal.prototype.removeDate = function(index) {
        this.dates.splice(index, 1);
    }

    MultipleDatePickerModal.prototype.addDate = function(date) {
        if (jQuery.inArray(date, this.dates) < 0) {
            this.dates.push(date);
        }
    }

    MultipleDatePickerModal.prototype.addOrRemoveDate = function(date) {
        
        var index = jQuery.inArray(date, this.dates);
        
        if (index >= 0) {
            this.removeDate(index);
        }
        else {
            this.addDate(date);
        }
    }

    MultipleDatePickerModal.prototype.destroy = function(){

        this.$datepicker.datepicker( "destroy" );

        this.$el.find('[data-action="open-datepicker-modal"]').off();
        this.$el.find('[data-action="close-datepicker-modal"]').off();
        this.$el.find('[data-action="save-datepicker-modal"]').off();
    }

    HOOT.MultipleDatePickerModal = MultipleDatePickerModal;

    /**
     * Single datetimepicker modal component
     * 
     * @param object args
     */
    var dateTimePickerModal = function( args ){

        if( ! args ){
            return new Error('No args');
        }

        this.$ = {}; // cached jquery elements
        this.selector = args.selector || '';
        this.hideButtons = args.hideButtons || false;
        this.visible = args.visible || false;
        this.step = args.step || 1;

        if ( this.selector instanceof jQuery ){
            this.$.el = this.selector;
        }
        else{
            this.$.el = jQuery(this.selector);
        }

        if( ! this.$.el.length ){
            return new Error("Element not found, please make sure the jQuery selector is correct.");
        }

        this.callbacks = {
            change: [],
            close: [],
            save: [],
        };

        this.$.datepicker = null;
        this.$.hidden = this.$.el.find('[type="hidden"]');
        this.$.hour = this.$.el.find('[data-type="hour"]');
        this.$.minute = this.$.el.find('[data-type="minute"]');
        this.$.pam = this.$.el.find('[data-type="pam"]');        
        
        this.passedData = window['hootcDatepickerData' + this.$.el.attr('data-index')];
        this.year = parseInt(this.passedData.date.year);
        this.month = parseInt(this.passedData.date.month);
        this.day = parseInt(this.passedData.date.day);
        this.hour = parseInt(this.passedData.date.hour);
        this.minute = parseInt(this.passedData.date.minute);
        this.pam = this.passedData.date.pam.toLowerCase();
        this.date = null;

        this.updateDate();

        // min date
        this.isMinDateEnabled = false;
    
        if( this.passedData.hasOwnProperty('minDate') ){

            this.isMinDateEnabled = true;
            this.minYear = parseInt(this.passedData.minDate.year);
            this.minMonth = parseInt(this.passedData.minDate.month);
            this.minDay = parseInt(this.passedData.minDate.day);
            this.minHour = parseInt(this.passedData.minDate.hour);
            this.minMinute = parseInt(this.passedData.minDate.minute);
            this.minPam = this.passedData.minDate.pam.toLowerCase();

            this.minDate = HOOT.prepare_date(
                this.minYear,
                this.minMonth - 1,
                this.minDay,
                this.minHour,
                this.minMinute,
                this.minPam
            );
        }

        this.pickerArgs = {
            dateFormat : 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            //showButtonPanel: true,
            //show: true,
            onSelect: function( str, inst ){
                
                this.dateParts = str.split('-');
                this.year = parseInt(this.dateParts[0]);
                this.month = parseInt(this.dateParts[1]);
                this.day = parseInt(this.dateParts[2]);

                this.updateMinDateInputs();
                this.updateSteps();
                this.updateDate();

            }.bind(this),
        }

        if( this.isMinDateEnabled ){
            this.pickerArgs.minDate = this.minDate;
        }

        this.init();
        this.bindEvents();
    }

    dateTimePickerModal.prototype.init = function() {

        if( ! this.$.datepicker ){
            this.$.datepicker = this.$.el.find('.hc-picker').datepicker( this.pickerArgs );
            this.$.datepicker.datepicker( 'setDate', this.date );
        }

        if( this.hideButtons ){
            this.$.el.find('.hc-buttons').css('display', 'none');
        }

        if( this.visible ){
            this.$.el.addClass('__visible');
        }

        this.updateMinDateInputs();
        this.updateSteps();
        this.fixPM12();

        this.$.hidden.val(this.toString());
    }

    dateTimePickerModal.prototype.fixPM12 = function(){

        if( this.pam === 'pm' ){
            this.$.hour.find('[value="12"]').addClass('__hidden');
            
            if( this.hour === 12 ){
                this.hour = 11;
                this.$.hour.val(this.hour);
            }

            this.updateDate();
        }
        else{
            this.$.hour.find('[value="12"]').removeClass('__hidden');
        }
    }

    dateTimePickerModal.prototype.updateSteps = function(){
        
        if( this.step < 2 ) return false;

        for( var i = 0; i <= 60; i++ ){
            if( i % this.step !== 0 ){
                this.$.minute.find('[value="'+i+'"]').addClass('__hidden');
            }
        }

        if( this.minute % this.step !== 0 ){
            for( var i = this.minute; i <= 60; i++ ){
                if( i % this.step === 0 ){
                    this.$.minute.val(i);
                    break;
                }
            }
        }
    }

    dateTimePickerModal.prototype._updateMinHoursMinutes = function(){

        var minHour = this.minHour;
        var minMinute = this.minMinute;

        for( var i = 1; i < minHour; i++ ){
            this.$.hour.find('[value="'+i+'"]').addClass('__hidden');
        }

        for( var i = 0; i < minMinute; i++ ){
            this.$.minute.find('[value="'+i+'"]').addClass('__hidden');
        }

        var firstHour = parseInt(this.$.hour.find('option:not(.__hidden):first').val());
        var firstMinute = parseInt(this.$.minute.find('option:not(.__hidden):first').val());

        if( this.hour < firstHour ){
            this.hour = firstHour;
            this.$.hour.val(this.hour);
        }

        if( this.minute < firstMinute ){
            this.minute = firstMinute;
            this.$.minute.val(this.minute);
        }

    }

    dateTimePickerModal.prototype.updateMinDateInputs = function() {

        if( ! this.isMinDateEnabled ) return false;
        
        // Same day
        if( this.year === this.minYear && this.month === this.minMonth && this.day === this.minDay ){

            if( this.minPam === 'am' && this.pam === 'pm' ){
                this.$.hour.find('.__hidden').removeClass('__hidden');
                this.$.minute.find('.__hidden').removeClass('__hidden');
                this.$.pam.find('.__hidden').removeClass('__hidden');
            }
            else if( this.minPam === 'am' && this.pam === 'am' ){
                this._updateMinHoursMinutes();
            }
            else if( this.minPam === 'pm' ){
                this._updateMinHoursMinutes();
                this.$.pam.val('pm');
                this.$.pam.find('[value="am"]').addClass('__hidden');
            }
        }
        // Not the same day
        else{
            this.$.hour.find('.__hidden').removeClass('__hidden');
            this.$.minute.find('.__hidden').removeClass('__hidden');
            this.$.pam.find('.__hidden').removeClass('__hidden');
        }
    }
    
    dateTimePickerModal.prototype.updateDate = function(){

        this.date = HOOT.prepare_date(
            this.year,
            this.month - 1,
            this.day,
            this.hour,
            this.minute,
            this.pam
        );

        this.fire('change');
    }

    dateTimePickerModal.prototype.toString = function(){
        var monthStr = this.month < 10 ? '0' + this.month : this.month;
        var dayStr = this.day < 10 ? '0' + this.day : this.day;
        var hourStr = this.hour < 10 ? '0' + this.hour : this.hour;
        var minuteStr = this.minute < 10 ? '0' + this.minute : this.minute;

        return this.year + '-' + monthStr + '-' + dayStr + ' ' + hourStr + ':' + minuteStr + this.pam;
    }

    dateTimePickerModal.prototype.bindEvents = function(){

        var _this = this;

        this.$.pam.on('change', function(){
            _this.pam = $(this).val();

            _this.updateMinDateInputs();
            _this.updateSteps();
            _this.fixPM12();
            _this.updateDate();
        });

        this.$.hour.on('change', function(){
            _this.hour = parseInt($(this).val());
            _this.updateDate();
        });

        this.$.minute.on('change', function(){
            _this.minute = parseInt($(this).val());
            _this.updateDate();
        });

        this.$.el.find('[data-action="open-datepicker-modal"]').on('click', function(e){
            e.preventDefault();
            this.show()
        }.bind(this));

        this.$.el.find('[data-action="close-datepicker-modal"]').on('click', function(e){
            e.preventDefault();
            this.hide();
        }.bind(this));

        this.$.el.find('[data-action="save-datepicker-modal"]').on('click', function(e){
            e.preventDefault();            
            this.$.hidden.val( this.toString() ).trigger('input');
            this.fire('save');
            this.hide();
        }.bind(this));
    }

    dateTimePickerModal.prototype.show = function(){
        this.$.el.find('.hc-modal').show();
    }

    dateTimePickerModal.prototype.hide = function(){
        this.$.el.find('.hc-modal').hide();
        this.fire('close');
    }

    /** register callbacks */
    dateTimePickerModal.prototype.on = function( event, callback ){
        
        if( ! this.callbacks.hasOwnProperty(event) ){
            throw "No event called: " + event;
        }

        this.callbacks[event].push( callback );
    }

    /** fire callbacks */
    dateTimePickerModal.prototype.fire = function( type ){
        
        if( ! this.callbacks.hasOwnProperty(type) ) return false;

        this.callbacks[type].map(function( callback ){            
            callback( this.getDateObject() );
        }.bind(this));
    }

    dateTimePickerModal.prototype.getDateObject = function() {
        return this.date;
    }

    dateTimePickerModal.prototype.setDate = function( date ) {

        if( typeof date !== 'object' ){
            throw new Error('The date parameter must be an object.')
        }

        if( ! date.hasOwnProperty('year') ){
            throw new Error('The date.year is missing.')
        }

        if( ! date.hasOwnProperty('month') ){
            throw new Error('The date.month is missing.')
        }

        if( ! date.hasOwnProperty('day') ){
            throw new Error('The date.day is missing.')
        }

        if( ! date.hasOwnProperty('hour') ){
            throw new Error('The date.hour is missing.')
        }

        if( ! date.hasOwnProperty('minute') ){
            throw new Error('The date.minute is missing.')
        }

        if( ! date.hasOwnProperty('pam') ){
            throw new Error('The date.pam is missing.')
        }

        this.year = parseInt(date.year);
        this.month = parseInt(date.month);
        this.day = parseInt(date.day);
        this.hour = parseInt(date.hour);
        this.minute = parseInt(date.minute);
        this.pam = date.pam.toLowerCase();
        this.updateDate();
        
        this.updateMinDateInputs();
        this.updateSteps();
        this.fixPM12();

        this.$.hidden.val(this.toString()).trigger('input');
        this.$.datepicker.datepicker( "setDate", this.date );
        this.$.hour.val( this.hour ).trigger('input');
        this.$.minute.val( this.minute ).trigger('input');
        this.$.pam.val( this.pam ).trigger('change');
    }

    dateTimePickerModal.prototype.destroy = function(){

        this.$.datepicker.datepicker( "destroy" );

        this.$.el.find('[data-action="open-datepicker-modal"]').off();
        this.$.el.find('[data-action="close-datepicker-modal"]').off();
        this.$.el.find('[data-action="save-datepicker-modal"]').off();

        this.$.pam.off();
        this.$.hour.off();
        this.$.minute.off();
    }

    HOOT.dateTimePickerModal = dateTimePickerModal;

    /**
     * Component: Toggle
     * 
     * Click Event
     */
    HOOT.doc.on('click', '.hoot-component-toggle [type="checkbox"]', function(e){

        var _self = $(this);
        
        if( _self.is(':checked') ){
            _self.val(1);
        }
        else{
            _self.val(0);
        }
    });

    /**
     * Document click event
     * 
     * Close datetime picker box
     */
    HOOT.doc.on('click', function(e){

        var _self = $(e.target);        
        var is_picker = _self.is('.hoot-input-datetime-wrapper') || _self.closest('.hoot-input-datetime-wrapper').length;

        if( ! is_picker ){
            $('.hoot-input-datetime-wrapper').hide();
        }
    });

})( jQuery );