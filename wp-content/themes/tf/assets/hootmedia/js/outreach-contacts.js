/**
 * Outreach contacts page js part
 * @author sabri taieb
 * @link https://delabon.com
 */
(function($){

    var body = $('body');

    // Only contacts page
    if( ! body.hasClass('outreach-contacts') ) return;

    var doc = $(document);
    var html = $('html');
    var contact_modal_el = $('#hoot-modal-contact');
    var group_modal_el = $('#hoot-modal-group');
    var edit_options_modal_el = $('#hoot-contacts-edit-options-modal');

    /**
     * Event: Save contacts ( add contacts modal )
     */
    html.on('outreach_save_contacts', function( e, data ){
        location.reload();
    });

    /**
     * Select all contacts
     */
    doc.on('change', '.contacts-panel #checkbox-all', function(e){

        var _self = $(this);
        
        // select all
        if( _self.prop('checked') ){
            $('.contacts-panel .invite-contacts [type="checkbox"]').prop('checked', true).trigger('change');
        }
        // diselect all
        else{
            $('.contacts-panel .invite-contacts [type="checkbox"]').prop('checked', false).trigger('change');
        }
    });

    /**
     * Open Contact Modal
     */
    $('.contacts-panel [data-action="open_contact_modal"]').on('click', function(e){
        e.preventDefault();

        var _self = $(this);
        var mode = ! _self.attr('data-id') ? 'add' : 'edit';

        contact_modal_el.find('form .error').removeClass('error');

        // Add
        if( mode === 'add' ){
            contact_modal_el.find('[name="id"]').remove();
            contact_modal_el.find('form [name="email"]').val('');
            contact_modal_el.find('form [name="first_name"]').val('');
            contact_modal_el.find('form [name="last_name"]').val('');
            contact_modal_el.find('form [name="group_id"]').val(0);
        }
        // Edit
        else{
            var id = _self.attr('data-id');

            HOOT_CONTACT_LIST.map(function( contact ){                
                if( contact.id == id ){
                    contact_modal_el.find('form [name="email"]').val(contact.email);
                    contact_modal_el.find('form [name="first_name"]').val(contact.first_name);
                    contact_modal_el.find('form [name="last_name"]').val(contact.last_name);
                    contact_modal_el.find('form [name="group_id"]').val(contact.group_id);
                }
            });

            contact_modal_el.find('form').prepend('<input type="hidden" name="id" value="'+id+'" >');
        }

        contact_modal_el.attr('data-mode', mode).modal('show');
    });

    /**
     * Show/Hide contact options
     */
    edit_options_modal_el.find('[data-action="move_contact_to_group"]').on('click', function(e){
        e.preventDefault();

        var form = $('.contacts-panel form.invite-contacts');
        var count = 0;

        form.find('[name="contact_item[]"]:checked').each(function( index ){
            $('.contact-list-item-controls[data-id="'+$(this).val()+'"]').removeClass('__hidden');
            count += 1;
        });

        edit_options_modal_el.removeClass('show');

        if( ! count ){
            alert('No contact(s) is selected');
            return;
        }

        $('.contacts-panel [data-action="update_selected_contacts"]').removeClass('__hidden');
    });

    /**
     * Show/Hide group options
     */
    edit_options_modal_el.find('[data-action="update_group_name"]').on('click', function(e){
        e.preventDefault();

        var form = $('.contacts-panel form.invite-contacts');
        var count = 0;

        form.find('[name="contact_item[]"]:checked').each(function( index ){
            $('.contact-list-item-controls[data-id="'+$(this).val()+'"]').removeClass('__hidden');
            count += 1;
        });

        edit_options_modal_el.removeClass('show');

        if( ! count ){
            alert('No group(s) is selected');
            return;
        }

        $('.contacts-panel [data-action="update_selected_groups"]').removeClass('__hidden');
    });

    /**
     * When item is selected
     */
    $('.contacts-panel form.invite-contacts [name="contact_item[]"]').on('change', function(e){

        var count = 0;
        var $el = $('.contacts-panel-footer-counter');

        $('.contacts-panel form.invite-contacts [name="contact_item[]"]:checked').each(function( index ){
            count += 1;
        });

        $el.find('span').text(count);
    });

    /**
     * Ajax: Update selected contacts (group & email)
     */
    $('.contacts-panel [data-action="update_selected_contacts"]').on('click', function(e){
        e.preventDefault();        

        var _self = $(this);        
        var form = $('.contacts-panel form.invite-contacts');
        var count = 0;
        var contacts = [];

        form.find('[name="contact_item[]"]:checked').each(function( index ){

            count += 1;
            var id = $(this).val();
            var contact_el = $('.contact-list-item-controls[data-id="'+id+'"]');

            contacts.push({
                id: id,
                email: contact_el.find('.__email').val(),
                group_id: contact_el.find('.__group_id').val(),
            });
        });     

        if( ! count ){
            alert('No contact(s) is selected');
            return false;
        }

        _self.attr('disabled', 'disabled');
        form.find('.error').removeClass('error');

        data = {};
        data.ajax_hoot_update_selected_contacts_email_and_group = true;
        data.nonce = HOOT_PARAMS.nonce;
        data.contacts = contacts;
        
        $.post( 
            HOOT_PARAMS.tf_outreach_uri,
            data,
            function( response ){

                _self.removeAttr('disabled');

                if( ! response.success ){

                    if( response.data.hasOwnProperty('errors') ){   

                        response.data.errors.map(function(error){
                            $('.contacts-panel').find( error.input ).addClass('error');
                        });
                        
                    }
                    else if( response.data.type === 'alert' ){
                        alert( response.data.message );
                    }

                }
                else{ 
                    location.reload();
                }

            }
        );        
    });    

    /**
     * Ajax: Update selected groups
     */
    $('.contacts-panel [data-action="update_selected_groups"]').on('click', function(e){
        e.preventDefault();        

        var _self = $(this);        
        var form = $('.contacts-panel form.invite-contacts');
        var count = 0;
        var groups = [];

        form.find('[name="contact_item[]"]:checked').each(function( index ){

            count += 1;
            var id = $(this).val();
            var $group = $('.contact-list-item-controls[data-id="'+id+'"]');

            groups.push({
                id: id,
                name: $group.find('.__name').val(),
            });
        });     

        if( ! count ){
            alert('No group(s) is selected');
            return false;
        }

        _self.attr('disabled', 'disabled');
        form.find('.error').removeClass('error');

        data = {};
        data.ajax_hoot_update_selected_groups_name = true;
        data.nonce = HOOT_PARAMS.nonce;
        data.groups = groups;
        
        $.post( 
            HOOT_PARAMS.tf_outreach_uri,
            data,
            function( response ){

                _self.removeAttr('disabled');

                if( ! response.success ){

                    if( response.data.hasOwnProperty('errors') ){   

                        response.data.errors.map(function(error){
                            $('.contacts-panel').find( error.input ).addClass('error');
                        });
                        
                    }
                    else if( response.data.type === 'alert' ){
                        alert( response.data.message );
                    }

                }
                else{ 
                    location.reload();
                }

            }
        );        
    });    

    /**
     * Ajax: Add OR Edit Contact
     */
    contact_modal_el.find('form').on('submit', function(e){
        e.preventDefault();

        var _self = $(this);
        var submit_el = _self.find('[type="submit"]');

        submit_el.attr('disabled', 'disabled');
        contact_modal_el.find('form .error').removeClass('error');

        data = {};
        data.nonce = HOOT_PARAMS.nonce;
        data.id = null;
        data.email = _self.find('[name="email"]').val();
        data.first_name = _self.find('[name="first_name"]').val();
        data.last_name = _self.find('[name="last_name"]').val();
        data.group_id = _self.find('[name="group_id"]').val();

        if( _self.find('[name="id"]').length ){
            data.id = _self.find('[name="id"]').val();
            data.ajax_hoot_edit_contact = true;
        }
        else{
            data.ajax_hoot_add_contact = true;
        }        
        
        $.post( 
            HOOT_PARAMS.tf_outreach_uri,
            data,
            function( response ){

                if( ! response.success ){

                    if( response.data.hasOwnProperty('errors') ){   
                        
                        response.data.errors.map(function(error){
                            contact_modal_el.find('form ' + error.input ).addClass('error');
                        });
                        
                    }
                    else if( response.data.type === 'alert' ){
                        alert( response.data.message );
                    }

                    submit_el.removeAttr('disabled');
                }
                else{
                    if( data.id ){
                        location.reload();
                    }
                    else if( data.group_id != 0 ){
                        location.href = HOOT_PARAMS.tf_outreach_uri + 'contacts/?group=' + data.group_id;
                    }
                    else{
                        location.href = HOOT_PARAMS.tf_outreach_uri + 'contacts/';
                    }
                }
            }
        );        
    });

    /**
     * Ajax: Delete One Contact
     */
    contact_modal_el.find('.hoot-delete-contact').on('click', function(e){
        e.preventDefault();

        if( ! confirm('Are you sure?') ) return false;

        var _self = $(this);
        var submit_el = _self.find('[type="submit"]');

        submit_el.attr('disabled', 'disabled');

        data = {};
        data.nonce = HOOT_PARAMS.nonce;
        data.ajax_hoot_delete_one_contact = true
        data.id = null;

        if( contact_modal_el.find('[name="id"]').length ){
            data.id = contact_modal_el.find('[name="id"]').val();
        }        

        $.post( 
            HOOT_PARAMS.tf_outreach_uri,
            data,
            function( response ){
                if( ! response.success ){
                    alert( response.data.message );
                    submit_el.removeAttr('disabled');
                }
                else{
                    location.reload();
                }
            }
        );        
    });

    /**
     * Edit options modal (footer button): Open/Close
     */
    $('[data-action="open_edit_options_modal"]').on('click', function(e){
        e.preventDefault();
        edit_options_modal_el.toggleClass('show');
    });

    /**
     * Ajax: Add OR Edit Group
     */
    group_modal_el.find('form').on('submit', function(e){
        e.preventDefault();
        
        var _self = $(this);
        var submit_el = _self.find('[type="submit"]');

        submit_el.attr('disabled', 'disabled');
        contact_modal_el.find('form .error').removeClass('error');

        data = {};
        data.nonce = HOOT_PARAMS.nonce;
        data.name = _self.find('[name="name"]').val();
        data.id = null;

        if( _self.find('[name="id"]').length ){
            data.id = _self.find('[name="id"]').val();
            data.ajax_hoot_edit_contact_group = true;
        }
        else{
            data.ajax_hoot_add_contact_group = true;
        }        

        $.post( 
            HOOT_PARAMS.tf_outreach_uri,
            data,
            function( response ){

                if( ! response.success ){

                    if( response.data.type === 'input' ){   
                        $( response.data.input ).addClass('error');
                    }
                    else if( response.data.type === 'alert' ){
                        alert( response.data.message );
                    }

                    submit_el.removeAttr('disabled');
                }
                else{
                    location.reload();
                }
            }
        );        
    });

    /**
     * Ajax: Delete selected contacts
     */
    edit_options_modal_el.find('[data-action="delete_selected_contacts"]').on('click', function(e){
        e.preventDefault();        
        
        if( ! confirm('Are you sure?') ) return false;

        var _self = $(this);
        var form = $('form.invite-contacts');

        _self.attr('disabled', 'disabled');
        
        $.ajax({
            method: "POST",
            url: HOOT_PARAMS.tf_outreach_uri,
            data: 'ajax_hoot_delete_contacts=true&nonce=' + HOOT_PARAMS.nonce + '&' + form.serialize(),
            cache: false,
        })
        .done(function( response ) {
            
            _self.removeAttr('disabled');

            if( ! response.success ){
                alert( response.data.message )
            }
            else{
                location.href = HOOT_PARAMS.tf_outreach_uri + 'contacts/';
            }

        });

    });

    /**
     * Ajax: Delete selected groups
     */
    edit_options_modal_el.find('[data-action="delete_selected_groups"]').on('click', function(e){
        e.preventDefault();        
        
        if( ! confirm('Are you sure?') ) return false;

        var _self = $(this);
        var form = $('form.invite-contacts');

        _self.attr('disabled', 'disabled');
        
        $.ajax({
            method: "POST",
            url: HOOT_PARAMS.tf_outreach_uri,
            data: 'ajax_hoot_delete_groups=true&nonce=' + HOOT_PARAMS.nonce + '&' + form.serialize(),
            cache: false,
        })
        .done(function( response ) {

            _self.removeAttr('disabled');

            if( ! response.success ){
                alert( response.data.message )
            }
            else{
                location.reload();
            }

        });

    });

    /**
     * Ajax: Update contact group (contact list view)
     */
    $('.contact-list-item-td.__group .__group_selection').on('change', function(){

        var $this = $(this);
        var id = $this.attr('data-contactid');
        var groupId = $this.val();

        // update group in controls
        $('.contact-list-item-controls[data-id="'+id+'"] .__group_id').val(groupId);

        $.ajax({
            method: "POST",
            url: HOOT_PARAMS.tf_outreach_uri,
            data:{
                ajax_hoot_update_contact_group: true,
                nonce: HOOT_PARAMS.nonce,
                id: id,
                group_id: groupId,
            },
            cache: false,
        })
        .done(function( response ) {
            //console.log(response);
        });

    });

    /**
     * Open Group Modal
     */
    $('[data-action="open_group_modal"]').on('click', function(e){
        e.preventDefault();

        var _self = $(this);
        var mode = ! _self.attr('data-id') ? 'add' : 'edit';

        group_modal_el.find('form .error').removeClass('error');

        // Add
        if( mode === 'add' ){
            group_modal_el.find('form [name="id"]').remove();
            group_modal_el.find('form [name="name"]').val('');
        }
        // Edit
        else{
            group_modal_el.find('form').prepend('<input type="hidden" name="id" value="'+_self.attr('data-id')+'" >');
            group_modal_el.find('form [name="name"]').val(_self.attr('data-name'));
        }

        group_modal_el.attr('data-mode', mode).modal('show');
    });

    /**
     * Ajax: Remove from group
     */
    edit_options_modal_el.find('[data-action="remove_contact_from_group"]').on('click', function(e){
        e.preventDefault();        

        if( ! confirm('Are you sure?') ) return false;

        var _self = $(this);
        var form = $('form.invite-contacts');

        _self.attr('disabled', 'disabled');
        
        $.ajax({
            method: "POST",
            url: HOOT_PARAMS.tf_outreach_uri,
            data: 'ajax_hoot_remove_contacts_from_group=true&nonce=' + HOOT_PARAMS.nonce + '&' + form.serialize(),
            cache: false,
        })
        .done(function( response ) {
            
            _self.removeAttr('disabled');

            if( ! response.success ){
                alert( response.data.message )
            }
            else{
                location.href = HOOT_PARAMS.tf_outreach_uri + 'contacts/';
            }

        });

    });

    /**
     * Ajax: Remove group
     */
    $('.contacts-panel-header-buttons [data-action="remove_group"]').on('click', function(e){
        e.preventDefault();        

        if( ! confirm("Are you sure? \nAll contacts will be moved to 'All contacts' group.") ) return false;

        var _self = $(this);

        _self.attr('disabled', 'disabled');
        
        $.ajax({
            method: "POST",
            url: HOOT_PARAMS.tf_outreach_uri,
            data: {
                ajax_hoot_remove_contact_group: true,
                nonce:  HOOT_PARAMS.nonce,
                id: _self.attr('data-id'),
            },
            cache: false,
        })
        .done(function( response ) {
            
            _self.removeAttr('disabled');

            if( ! response.success ){
                alert( response.data.message )
            }
            else{
                location.href = HOOT_PARAMS.tf_outreach_uri + 'contacts/';
            }

        });

    });

    /**
     * Ajax: Remove group
     */
    var rowsPerPage = $('.contacts-panel-footer-rows-per-page select').val();

    $('.contacts-panel-footer-rows-per-page select').on('click', function(){

        var count = $(this).val();

        if( rowsPerPage == count ) return false;

        $.ajax({
            method: "POST",
            url: HOOT_PARAMS.tf_outreach_uri,
            data: {
                ajax_hoot_update_rows_per_page: true,
                nonce:  HOOT_PARAMS.nonce,
                count: count,
            },
            cache: false,
        }).done(function( response ) {
            location.href = location.href.split('?')[0].replace(/\#.*/, '');
        });

    });

    /**
     * Document click event
     * 
     * Close Edit options modal
     * 
     */
    doc.on('click', function(e){

        var _self = $(e.target);        
        var is_edit_options_modal = _self.is('#hoot-contacts-edit-options-modal') 
                                    || _self.closest('.hoot-button-options-modal-wrapper').length;

        if( ! is_edit_options_modal ){
            edit_options_modal_el.removeClass('show');
        }
    });

})( jQuery );