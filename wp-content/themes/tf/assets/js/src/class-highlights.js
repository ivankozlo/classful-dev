/**
 * Classroom highlights
 * @author sabri taieb
 * @link https://delabon.com
 */
(function($){

    var ClassHighlights = function( args ){

        this.number = args.number || false;
        this.selector = args.selector || false;
        this.items = args.items || [];
        this.text_value_label = args.text_value_label || 'Value';
        this.text_value_placeholder = args.text_value_placeholder || 'Value';
        this.text_title_label = args.text_title_label || 'Title';
        this.text_title_placeholder = args.text_title_placeholder || 'Title';
        this.text_subtitle_label = args.text_subtitle_label || 'Sub title';
        this.text_subtitle_placeholder = args.text_subtitle_placeholder || 'Sub title';

        if( ! this.number ){
            var error = new Error('ClassHighlights: no number is passed (Must be unique).');
            return error;
        }

        if( ! this.selector ){
            var error = new Error('ClassHighlights: no selector');
            return error;
        }

        this.$ = {};
        this.$.el = $(this.selector);

        if( ! this.$.el.length ){
            var error = new Error('ClassHighlights: selector not found: ' + this.selector);
            return error;
        }

        this.$.el.attr('id', 'component-highlights-' + this.number);
        this.$.el.attr('data-number', this.number);
        this.$.el.addClass('component-highlights');

        this.getItemsFromDom();
        this.bindEvents();
    }

    /**
     * Return items
     */
    ClassHighlights.prototype.getItems = function(){
        return this.items();
    }

    /**
     * Search DOM items for this component and load them
     */
    ClassHighlights.prototype.getItemsFromDom = function(){

        var _this = this;

        this.$.el.find('.component-highlight-item').each(function(){

            var $item = $(this);

            _this.items.push({
                value: $item.find('[data-name="value"]').val(),
                title: $item.find('[data-name="title"]').val(),
                subtitle: $item.find('[data-name="subtitle"]').val(),
            });
        });

    }

    /**
     * Add new item
     */
    ClassHighlights.prototype.add = function( data ){

        console.log(data);
        this.items.push(data);

        this.$.el.append(''+
            '<div class="component-highlight-item" data-index="' + this.items.length + '">'+
                '<div class="component-highlight-item-inner">'+
                    '<label><strong>' + this.text_value_label + '</strong>'+
                        '<input type="text" data-name="value" name="component_highlight_' + this.number + '[item_' + this.items.length + '][value]" value="' + data.value + '" placeholder="' + this.text_value_placeholder + '" class="form-control" >'+
                    '</label>'+
                    '<label><strong>' + this.text_title_label + '</strong>'+
                        '<input type="text" data-name="title" name="component_highlight_' + this.number + '[item_' + this.items.length + '][title]" value="' + data.title + '" placeholder="' + this.text_title_placeholder + '" class="form-control" >'+
                    '</label>'+
                    '<label><strong>' + this.text_subtitle_label + '</strong>'+
                        '<input type="text" data-name="subtitle" name="component_highlight_' + this.number + '[item_' + this.items.length + '][subtitle]" value="' + data.subtitle + '" placeholder="' + this.text_subtitle_placeholder + '" class="form-control" >'+
                    '</label>'+
                '</div>'+
                '<div class="component-highlight-item-actions">'+
                    '<span class="component-highlight-item-close"><i class="fas fa-times"></i></span>'+
                    '<span class="component-highlight-item-move"><i class="fas fa-sort"></i></span>'+
                '</div>'+
            '</div>'
        );

        $('.component-highlights[data-number="' + this.number + '"] .component-highlight-item-move').off();
        $('.component-highlights[data-number="' + this.number + '"] .component-highlight-item-close').off();
    }
    
    /**
     * Remove item from DOM and this.items
     */
    ClassHighlights.prototype.remove = function( index ){

        index = parseInt(index) - 1;

        this.items = this.items.filter(function( item, i ){
            if( i != index ) return true;

            return false;
        });

        this.$.el.find('.component-highlight-item[data-index="'+(index + 1)+'"]').remove();

        this.reOrder();
    }

    /**
     * Reorder DOM items
     */
    ClassHighlights.prototype.reOrder = function(){

        var _this = this;
        this.items = [];

        this.$.el.find('.component-highlight-item').each(function(i){

            var $item = $(this);
            var index = i + 1;
            var data = {};

            $item.attr('data-index', index );

            $item.find('input').each(function(){

                var $subItem = $(this);

                $subItem.attr('name', 'component_highlight_' + _this.number +'[item_' + index + '][' + $subItem.attr('data-name') + ']' );

                data[$subItem.attr('data-name')] = $subItem.val();
            });

            _this.items.push(data);
        });
    }

    /**
     * Bind events
     */
    ClassHighlights.prototype.bindEvents = function( index ){

        var _this = this;

        // When delete icon is clicked
        this.$.el.on('click', '.component-highlight-item-close', function(e){
            e.preventDefault();
            e.stopPropagation();

            _this.remove( $(this).closest('.component-highlight-item').attr('data-index') );
        });

        // When sort icon is clicked
        Sortable.create(document.querySelector(this.selector),{
            handle: '.component-highlight-item-move',
            draggable: '.component-highlight-item',
            direction: 'vertical',
            onUpdate: function(){
                this.reOrder();
            }.bind(this)
        });

        // this.$.el.sortable({
        //     handle: '.component-highlight-item-move',
        //     items: '.component-highlight-item',
        //     containment: "parent",
        //     helper : 'clone',
        //     update: function( event, ui ) {
        //         this.reOrder();
        //     }.bind(this),
        // });

        // this.$.el.disableSelection();

        // When input is changed
        this.$.el.on('input', 'input', function(e){

            var $this = $(this);
            var index = $this.closest('.component-highlight-item').attr('data-index');
            index = parseInt(index) - 1;

            _this.items = _this.items.map(function( item, i ){
                if( i == index ){
                    item[$this.attr('data-name')] = $this.val();
                }

                return item;
            });
        });
    }

    window.ClassHighlights = ClassHighlights;

})(jQuery);