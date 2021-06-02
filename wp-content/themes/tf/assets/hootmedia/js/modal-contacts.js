/**
 * Add contacts modal
 * @author sabri taieb
 * @link https://delabon.com
 */
(function($){

    var doc = $(document);
    var html = $('html');
    var body = $('body');
    var modal = $('#hoot-modal-add-contacts');

    if( ! modal.length ) return;

    /**
     * Get contact item markup (Add contact modal)
     * @param {object} contact 
     * @return {string}
     */
    function get_item_markup( contact ){
        return ''+
            '<div class="contact-list-item mb-2" data-email="'+contact.email+'">'+
            '<div class="contact-list-item-td __avatar">'+
                '<div class="invite-contact__avatar invite-contact__avatar--initials rounded">'+
                    '<span>'+contact.email.split('@')[0].substr(0,2).toUpperCase()+'</span>'+
                '</div>'+
            '</div>'+
            '<div class="contact-list-item-td __email">'+contact.email+'</div>'+
            '<div class="contact-list-item-td __edit">'+
                '<a href="#" class="__delete_contact">Remove</a>'+
                '<div class="custom-control custom-checkbox custom-checkbox-no-lable">'+
                    '<input type="checkbox" name="add_contact_item[]" value="'+contact.email+'" id="add_contact_item_'+contact.email+'" class="custom-control-input" />'+
                    '<label for="add_contact_item_'+contact.email+'" class="custom-control-label"></label>'+
                '</div>'+
            '</div>'+
        '</div>'+
        '<div class="contact-list-item-controls mt-2" data-email="'+contact.email+'">'+
            '<div class="row">'+
                '<div class="col col-12 col-sm-6">'+
                    '<div class="form-group">'+
                        '<label>First name<span class="text-danger">*</span></label>'+
                        '<input type="text" class="form-control __first_name" value="'+contact.first_name+'">'+
                    '</div>'+
                '</div>'+
                '<div class="col col-12 col-sm-6">'+
                    '<div class="form-group">'+
                        '<label>Last name<span class="text-danger">*</span></label>'+
                        '<input type="text" class="form-control __last_name" value="'+contact.last_name+'">'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>';
    }

    /**
     * Get notice markup
     * @param {string} message 
     * @param {boolean} error 
     * @return {string}
     */
    function notice( message, error ){

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
     * Add contact to list
     * @param {object} contact 
     */
    function add_contact_to_list( contact ){

        if( modal.find('.contact-list .contact-list-item[data-email="'+contact.email+'"]').length ) return;

        modal.find('.contact-list').prepend( get_item_markup( contact ) );
    }

    /**
     * Open
     */
    doc.find('[data-action="open_contacts_modal"]').click(function(e){
        e.preventDefault();        
        modal.modal('show');
    });

    /**
     * Step 1: Switch ( upload contacts / sync contacts / manual )
     */
    modal.find('.hoot-input-switch').on('input', function(){
        modal.attr('data-switch', $(this).val() );
    });

    /**
     * Step 1 (Upload contacts): Upload contacts button click event
     */
    modal.find('.__switch_option_0 button').on('click', function(e){
        e.preventDefault();

        var el = modal.find('.__switch_option_0 textarea');
        var content = el.val();
        var contacts = [];

        el.removeClass('error');

        if( content.search(',') != -1 ){
            content = content.replace(/\n/g, ',');            
            content = content.replace(',,', ',');
            content = content.split(',');
        }
        else if( content.search(';') != -1 ){
            content = content.replace(/\n/g, ';');
            content = content.replace(';;', ';');
            content = content.split(';');
        }
        else{
            content = content.split("\n");
        }

        content.map(function( email ){

            email = $.trim(email);
            
            if( ! HOOT.is_email_valid(email) ) return false;

            contacts.push( {
                email: email,
                first_name: '',
                last_name: '',
            });
        });

        if( ! contacts.length ){
            el.addClass('error');
            return false;
        }

        contacts.map(function( contact, index ){
            add_contact_to_list(contact);
        });        

        modal.attr('data-step', 2);
        el.val('');
    });

    /**
     * Step 1 (Sync): Sync click
     */
    modal.find('.__switch_option_1 li a').on('click', function(e){
        e.preventDefault();

        var interval_timer;
        window.tfsync = window.open( $(this).attr('href'), "TeacherFunder Sync", 'width=800,height=600');
        
        interval_timer = setInterval(function(){
            try{
                if( window.tfsync.location.href.search('close_popup=true') != -1 ){
                    
                    tfsync.close();
                    clearInterval( interval_timer );

                    // get the
                    $.ajax({
                        method: "POST",
                        url: HOOT_PARAMS.tf_outreach_uri,
                        data: {
                            ajax_hoot_add_contacts_get_session_contacts: true,
                            nonce: HOOT_PARAMS.nonce,
                        },
                        cache: false,
                    })
                    .done(function( response ){

                        var contacts = response.data;

                        contacts.map(function( contact, index ){
                            add_contact_to_list( contact );
                        });        
                
                        modal.attr('data-step', 2);
                    });
                }
            }   
            catch( err ){}

        }, 250 );

        // used to setup the session 
        //
        $.ajax({
            method: "POST",
            url: HOOT_PARAMS.tf_outreach_uri,
            data: {
                ajax_hoot_add_contacts_sync_session_setup: true,
                nonce: HOOT_PARAMS.nonce,
            },
            cache: false,
        })
        .done(function( response ){});
    });

    /**
     * Step 1 (Group): Next button click event
     */
    modal.find('.__switch_option_2 button').on('click', function(e){
        e.preventDefault();

        var _self = $(this);
        var parent = modal.find('.__switch_option_2');
        var group_el = parent.find('.__step_1_group');

        _self.attr('disabled', 'disabled');

        $.ajax({
            method: "POST",
            url: HOOT_PARAMS.tf_outreach_uri,
            data: {
                ajax_hoot_fetch_contacts_by_group_id: true,
                nonce: HOOT_PARAMS.nonce,
                group_id: group_el.val(),
            },
            cache: false,
        })
        .done(function( response ) {

            _self.removeAttr('disabled');
            
            if( ! response.success ){
                alert( response.data.message );
                return false;
            }
            
            response.data.map(function( contact ){
                add_contact_to_list( contact );
            });

            modal.attr('data-step', 2);
            group_el.val(0);
        });
    });

    /**
     * Step 2: Delete one contact
     */
    doc.on('click', '#hoot-modal-add-contacts .__delete_contact', function(e){
        e.preventDefault();

        var _self = $(this);
        var el = _self.closest('.contact-list-item');

        el.next().remove();
        el.remove();
    });

    /**
     * Step 2: Save
     * add selected contact to memory and database
     * add selected contacts under "Enter email(s)" field
     */
    doc.on('click', '[data-action="save_modal_contacts"]', function(e){
        e.preventDefault();

        var _self = $(this);
        var is_names_enabled = parseInt( modal.attr('data-addnames') );
        var is_error_found = false;
        var contacts = [];
        var group_el = modal.find('select.__groups');
        var group_id = group_el.val();
        
        // only selected contacts
        modal.find('.contact-list [name="add_contact_item[]"]:checked').each(function(){

            var _self = $(this);
            var controls_el = modal.find('.contact-list-item-controls[data-email="'+_self.val()+'"]');
            var fnc_el = controls_el.find('.__first_name');
            var lnc_el = controls_el.find('.__last_name');
            var contact = {
                email: _self.val(),
                first_name: fnc_el.val(),
                last_name: lnc_el.val(),
            }

            if( is_names_enabled ){

                fnc_el.removeClass('error');
                lnc_el.removeClass('error');

                if( contact.first_name == '' ){
                    fnc_el.addClass('error');
                    is_error_found = true;
                }

                if( contact.last_name == '' ){
                    lnc_el.addClass('error');
                    is_error_found = true;
                }
            }

            contacts.push( contact );
        });

        if( ! contacts.length ){
            modal.find('.__step_2').prepend(notice('Please select at least 1 contact or click on close.', true));

            modal.find('.modal-body').animate({
                scrollTop: 0
            }, 500);
            return false;
        }

        if( is_error_found ){
            _self.removeAttr('disabled');
            return false;
        }
        
        _self.attr('disabled', 'disabled');

        $.ajax({
            method: "POST",
            url: HOOT_PARAMS.tf_outreach_uri,
            data: {
                ajax_hoot_add_contacts: true,
                nonce: HOOT_PARAMS.nonce,
                contacts: contacts,
                is_names_enabled: is_names_enabled,
                group_id: group_id,
                page: body.hasClass('outreach-email') ? 'email' : 'contacts',
            },
            cache: false,
        })
        .done(function( response ) {

            _self.removeAttr('disabled');
            
            if( ! response.success ){
                alert( response.data.message );
                return false;
            }

            html.trigger('outreach_save_contacts', { contacts: response.data });

            modal.modal('hide');
            modal.attr('data-step', 1);
            modal.find('.contact-list').html('');
        });
    });

    /**
     * Step 2: Show names input fields
     */
    doc.on('click', '#checkbox-add-names', function(e){

        var _self = $(this);
        var is_enabled = _self.prop('checked');

        if( is_enabled ){
            modal.attr('data-addnames', 1);
        }
        else{
            modal.attr('data-addnames', 0);
        }
    });

    /**
     * Step 2: Select all
     */
    doc.on('click', '#checkbox-add-contacts-all', function(e){

        var _self = $(this);

        if( _self.prop('checked') ){
            modal.find('.contact-list [name="add_contact_item[]"]').prop('checked', true );
        }
        else{
            modal.find('.contact-list [name="add_contact_item[]"]').prop('checked', false );
        }
    });

    /**
     * Step 2: Back to step 1
     */
    modal.find('button.__back').on('click', function(e){
        e.preventDefault();
        modal.attr('data-step', 1);
    });

    /**
     * Step 2: Add groud
     */    
    modal.find('.form-control-with-button button').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();

        var _self = $(this);
        var el = modal.find('.form-control-with-button .form-control');
        var name = el.val();

        _self.attr('disabled', 'disabled');
        el.removeClass('error');

        if( name.length < 2 ){
            el.addClass('error');
            return false;
        }
        
        $.ajax({
            method: "POST",
            url: HOOT_PARAMS.tf_outreach_uri,
            data: {
                ajax_hoot_add_contact_group: true,
                nonce: HOOT_PARAMS.nonce,
                name: name,
            },
            cache: false,
        })
        .done(function( response ) {

            _self.removeAttr('disabled');
            
            if( ! response.success ){
                alert( response.data.message );
                return false;
            }

            var select_el = modal.find('select.__groups');

            select_el.append('<option value="'+response.data+'">'+name+'</option>');
            select_el.val(response.data);
        });
    });

})( jQuery );