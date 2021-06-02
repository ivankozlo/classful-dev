/**
 * Program types (collection & type)
 * @author sabri taieb
 * @link https://delabon.com
 */
(function( $ ){
    
    /**
     * Program Type Collection
     */
    var TypeCollection = function (){
        this.types = [];
    };

    TypeCollection.prototype.add = function( type ){
        type.render();
        this.types.push( type );
    }

    TypeCollection.prototype.removeLast = function(){
        this.types[ this.types.length - 1 ].destroy();
        this.types.pop();
    }

    TypeCollection.prototype.toArray = function(){

        var arr = [];

        this.types.map(function( type ){
            arr.push( type.getAll() );
        });

        return arr;
    }

    TypeCollection.prototype.count = function(){
        return this.types.length;
    }

    TypeCollection.prototype.reset = function(){
        
        this.types.map(function( type ){
            type.destroy();
        });

        this.types = [];
    }

    /**
     * Program type (paid, free or donation)
     * 
     * @param {int} id 
     * @param {string} type 
     */
    var Type = function ( index, args ){
        
        this.index = index || 1;
        this.id = args.id || 0;
        this.type = args.type || 'paid';
        this.name = args.name || '';
        this.description = args.description || '';
        this.quantity = args.quantity || '';
        this.min_price = args.min_price || '';
        this.max_price = args.max_price || '';
        this.is_discount_enabled = args.is_discount_enabled || 0;
        this.sale_starts = args.sale_starts || new Date().format('Y-m-d');
        this.sale_ends = args.sale_ends || new Date().format('Y-m-d');
        this.discount_one_time = args.discount_one_time || 0;
        this.min_tickets = args.min_tickets || '';
        this.max_tickets = args.max_tickets || '';
        this.discount_percentage = args.discount_percentage || '';
        
        this.$html = $('html');

        this.create();
        this.bindEvents();
    };

    Type.prototype.create = function(){

        var _self = this;

        this.$parent = $('.program-create-'+ this.type +'-types');
        this.$el = $( $('#program-type-tmpl').html() );

        this.$el.addClass( '__type_' + this.type );

        this.$el.find('[name*="{id}"]').each(function(){
            $(this).attr('name', $(this).attr('name').replace('{id}', _self.type + '-' + _self.index ) );
        });

        this.$el.find('[id*="{id}"]').each(function(){
            $(this).attr('id', $(this).attr('id').replace('{id}', _self.type + '-' + _self.index ) );
        });

        this.$el.find('[for*="{id}"]').each(function(){
            $(this).attr('for', $(this).attr('for').replace('{id}', _self.type + '-' + _self.index ) );
        });

        this.$id = this.$el.find('.type_id');
        this.$id.val( this.id );

        this.$name = this.$el.find('.type_name');
        this.$name.val( this.name );

        this.$description = this.$el.find('.type_description');
        this.$description.val( this.description );

        if( this.description !== '' ){
            this.$el.find('.__type_description_area').removeClass('__hidden');
            this.$el.find('[data-action="show-type-description"]').addClass('__hidden');
        }

        this.$quantity = this.$el.find('.type_quantity');
        this.$quantity.val( this.quantity );

        this.$min_price = this.$el.find('.type_min_price');
        this.$min_price.val( this.min_price );

        this.$max_price = this.$el.find('.type_max_price');
        this.$max_price.val( this.max_price );

        this.$is_discount_enabled = this.$el.find('.type_is_discount_enabled');
        this.$is_discount_enabled.val( this.is_discount_enabled );

        this.$sale_starts = this.$el.find('.type_sale_starts [type="hidden"]');
        this.$sale_starts.val( this.sale_starts );
        this.$sale_starts_datepicker = new HOOT.SingleDatePickerModal({
            selector: this.$el.find('.type_sale_starts'),
        });

        this.$sale_ends = this.$el.find('.type_sale_ends [type="hidden"]');
        this.$sale_ends.val( this.sale_ends );
        this.$sale_ends_datepicker = new HOOT.SingleDatePickerModal({
            selector: this.$el.find('.type_sale_ends'),
        });

        this.$discount_one_time = this.$el.find('.type_discount_one_time');
        this.$discount_one_time.val( this.discount_one_time );

        this.$min_tickets = this.$el.find('.type_min_tickets');
        this.$min_tickets.val( this.min_tickets );

        this.$max_tickets = this.$el.find('.type_max_tickets');
        this.$max_tickets.val( this.max_tickets );

        this.$discount_percentage = this.$el.find('.type_discount_percentage');
        this.$discount_percentage.val( this.discount_percentage );

        // Views
        if( this.is_discount_enabled == 1 ){
            this.$is_discount_enabled.attr('checked', 'checked');
            this.$is_discount_enabled.closest('.program-create-toggle-area').find('.__area_to_toggle').removeClass('__hidden');
        }
        else{
            this.$is_discount_enabled.removeAttr('checked');
            this.$is_discount_enabled.closest('.program-create-toggle-area').find('.__area_to_toggle').addClass('__hidden');
        }

        if( this.discount_one_time == 1 ){
            this.$discount_one_time.attr('checked', 'checked');
        }
        else{
            this.$discount_one_time.removeAttr('checked');
        }
    }

    Type.prototype.render = function(){
        this.$parent.append( this.$el );
    }

    Type.prototype.getAll = function(){
        return{
            id: this.id,
            name: this.name,
            description: this.description,
            quantity: this.quantity,
            min_price: this.min_price,
            max_price: this.max_price,
            is_discount_enabled: this.is_discount_enabled,
            sale_starts: this.sale_starts,
            sale_ends: this.sale_ends,
            discount_one_time: this.discount_one_time,
            min_tickets: this.min_tickets,
            max_tickets: this.max_tickets,
            discount_percentage: this.discount_percentage,
        }
    }

    Type.prototype.bindEvents = function(){

        var _self = this;

        // Show description field
        this.$el.find('[data-action="show-type-description"]').one('click', function(e){
            e.preventDefault();
            $(this).hide();
            _self.$el.find('.__type_description_area').removeClass('__hidden');
        });

        // Show/Hide 
        this.$el.find('.hoot-component-toggle input').on('change', function (){   
        
            var _self = $(this);
            var $area = _self.closest('.program-create-toggle-area').find('.__area_to_toggle');
    
            if( $(this).val() == 0 ){
                $area.addClass('__hidden');
            }
            else{
                $area.removeClass('__hidden');
            }
        });

        // Inputs change
        this.$name.on('input', function(){
            _self.name = _self.$name.val();
            _self.fire(_self.$name);
        });

        this.$description.on('input', function(){
            _self.description = _self.$description.val();
            _self.fire(_self.$description);
        });

        this.$quantity.on('input', function(){
            _self.quantity = _self.$quantity.val();
            _self.fire(_self.$quantity);
        });

        this.$min_price.on('input', function(){
            _self.min_price = _self.$min_price.val();
            _self.fire(_self.$min_price);
        });

        this.$max_price.on('input', function(){
            _self.max_price = _self.$max_price.val();
            _self.fire(_self.$max_price);
        });

        this.$is_discount_enabled.on('change', function(){
            _self.is_discount_enabled = _self.$is_discount_enabled.val();

            if( _self.is_discount_enabled == 1 ){
                _self.$is_discount_enabled.closest('.program-create-toggle-area').find('.__area_to_toggle').removeClass('__hidden');
            }
            else{
                _self.$is_discount_enabled.closest('.program-create-toggle-area').find('.__area_to_toggle').addClass('__hidden');
            }
            _self.fire(_self.$is_discount_enabled);
        });

        this.$sale_starts.on('input', function(){            
            _self.sale_starts = _self.$sale_starts.val();
            _self.fire(_self.$sale_starts);
        });
        
        this.$sale_ends.on('input', function(){
            _self.sale_ends = _self.$sale_ends.val();
            _self.fire(_self.$sale_ends);
        });

        this.$discount_one_time.on('change', function(){
            if( _self.$discount_one_time.is(':checked') ){
                _self.discount_one_time = 1;
            }
            else{
                _self.discount_one_time = 0;
            }
            _self.fire(_self.$discount_one_time);
        });

        this.$min_tickets.on('input', function(){
            _self.min_tickets = _self.$min_tickets.val();
            _self.fire(_self.$min_tickets);
        });

        this.$max_tickets.on('input', function(){
            _self.max_tickets = _self.$max_tickets.val();
            _self.fire(_self.$max_tickets);
        });

        this.$discount_percentage.on('input', function(){
            _self.discount_percentage = _self.$discount_percentage.val();
            _self.fire(_self.$discount_percentage);
        });
    }

    Type.prototype.destroy = function(){
        
        // unbind events
        this.$el.find('.hoot-component-toggle input').off();
        this.$name.off();
        this.$description.off();
        this.$quantity.off();
        this.$min_price.off();
        this.$max_price.off();
        this.$is_discount_enabled.off();
        this.$sale_starts.off();
        this.$sale_ends.off();
        this.$discount_one_time.off();
        this.$min_tickets.off();
        this.$max_tickets.off();
        this.$discount_percentage.off();

        this.$sale_starts_datepicker.destroy();
        this.$sale_ends_datepicker.destroy();

        this.$el.remove();
    }

    Type.prototype.on = function( event, callback ){
        if( this.callbacks.hasOwnProperty( event ) ){
            this.callbacks[event].push(callback);
        }
    }

    Type.prototype.fire = function( element ){
        this.$html.trigger('program_type_is_updated', {
            index: this.index,
            type: this.type,
            element: element,
        });
    }

    window.ProgramTypeCollection = TypeCollection;
    window.ProgramType = Type;

})( jQuery );
