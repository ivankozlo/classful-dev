jQuery(function(){
    jQuery(document).on('click', '.menu-close, .btn-menu', function (event)
    {
        jQuery(document).find('body').toggleClass('menuopen');
    });
});

jQuery(document).ready(function(){
    var headernav = jQuery('.header-container');
    var headerHeight = headernav.outerHeight();

    jQuery(window).scroll(function(){
        if (jQuery(this).scrollTop() > headerHeight)
        {
            headernav.addClass('fixed_header');
        }
        else
        {
            headernav.removeClass('fixed_header');
        }
    });

    jQuery('.menu_btn').click(function(e)
    {
        e.stopPropagation();
        jQuery('.mobile_menu_area').slideToggle();
    });

    /*jQuery('#menu').slicknav({
        prependTo: '#menu-holder',
        label: '',
        closedSymbol: '',
        openedSymbol: ''
    });*/
});

jQuery(window).resize(function(){
    var win_width = jQuery(window).width();

    if (win_width > 768)
    {
        jQuery('.mobile_menu_area').hide();
    }
});

jQuery('body').click(function(){
    jQuery('.mobile_menu_area').fadeOut();
});

jQuery('.mobile_menu_area').click(function(e){
    e.stopPropagation();
});

/**
 * Move Elements on Responsive
 */
jQuery(document).ready(function($) {
    var $win = $(window);

	moveElementsOnMobile();
	$win.resize(moveElementsOnMobile);

	function moveElementsOnMobile() {
        $donateBoxes = $('.donate-widget-boxes');

        // Move on desktop.
        if ( $win.width() > 767 ) {
            if ( $donateBoxes.length > 0 ) {
                $donateBoxes.prependTo( '.single-teacher__sidebar' );
            }
        } else { // Move on mobile.
            if ( $donateBoxes.length > 0 ) {
                $donateBoxes.insertBefore( '.single-teacher-gallery' );
            }
        }
    }
});

jQuery(document).ready(function($) {

    // $('.validate-email').click(function(event) {
    //     event.preventDefault();
    //     userid = jQuery(this).attr("data-userid");
    //     console.log(userid);

    //     $.ajax({
    //     url: ajaxperforms.ajaxurl, // or example_ajax_obj.ajaxurl if using on frontend
    //     data: {
    //         'action': 'email_validation',
    //         'user_id' : userid
    //     },
    //     success:function(data) {
    //         // This outputs the result of the ajax request
    //         console.log(data);
    //     },
    //     error: function(errorThrown){
    //         console.log(errorThrown);
    //     }


    //     });


    // });

    $('.toogle-profile-button').change(function(){
        var teacher_id_value = $(this).val();
        console.log(teacher_id_value);
        $.ajax({
        url: ajaxperforms.ajaxurl, // or example_ajax_obj.ajaxurl if using on frontend
        data: {
            'action': 'teacher_profile_draft_undraft',
            'value' : teacher_id_value
        },
        success:function(data) {
            // This outputs the result of the ajax request
            if (data == 1 ) {
                console.log("status publish");
            }
            else{
                console.log("status draft");
            }
        },
        error: function(errorThrown){
            console.log(errorThrown);
        }


        });

    });

});

/**
 * Account Mobile Menu
 */
jQuery(document).ready(function($) {

    $(".backend-menu").before('<a href="#" class="backend-menu-btn menu-icon"><span class="menu-icon__middle"></span></a>');
    var $accountMenu = $('.backend-menu-btn');

    $accountMenu.click(function(e) {
        e.preventDefault();
        var menu = $('#menu');
        menu.slideToggle();
        $(".backend-menu-btn").toggleClass("menu-icon--close-x");
    });
});

/**
 * Scroll to error on Sign in submit
 *
 * Email error when visible scroll to error...  need to implement
 * this in main email error handling function to work correctly
 */
jQuery(document).ready(function($) {
    $('input[name=submit_fundraiser]').click(function() {
        setTimeout(function() {
            if ( $(".error-container").is(':visible') ) {
                var headerHeight = $('.main-header').outerHeight();
                $('html, body').animate({
                    scrollTop: $('.error-container').offset().top - headerHeight
                }, 500);
            }
        }, 2000);
    });
});

/**
 * Scroll back to top functionality
 */
jQuery(document).ready(function($) {
    var $win         = $(window);
    var $doc         = $(document);
    var percent      = 0.2; // offset set to 20% from top
    var speed        = 500;
    var duration     = 250;
    var windowHeight = ( $doc.height() - $win.height() );
    var offset       = percent * windowHeight;
    var $topbutton   = $('.topbutton');

    $win.scroll(function() {
        if ( $doc.height() - $win.height() !== windowHeight ) {
            windowHeight = ( $doc.height() - $win.height() );
            offset = percent * windowHeight;
        }

        if ( $(this).scrollTop() < offset ) {
            $topbutton.fadeOut(duration);
        } else {
            $topbutton.fadeIn(duration);
        }
    });

    $topbutton.on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, speed);
    });
});

/**
 * Message Form Modal Window
 */
// jQuery(document).ready(function($) {
//     var $messageBox = $('#message-box');

//     $('.message-modal').click(function(e) {
//         e.preventDefault();

//         // Fade in the Popup and add close button
//         $messageBox.fadeIn( 300 );

//         // Set the center alignment padding + border
//         // var popMargTop = ($(loginBox).height() + 24) / 2;
//         // var popMargLeft = ($(loginBox).width() + 24) / 2;

//         // $(loginBox).css({
//         //     'margin-top' : -popMargTop,
//         //     'margin-left' : -popMargLeft
//         // });

//         // Add the mask to body
//         $('body').append( '<div id="mask"></div>' );
//         $('#mask').fadeIn( 300 );

//         return false;
//     });

//     // When clicking on the button close or the mask layer the popup closed
//     $('a.close, #mask').click(function(e) {
//         e.preventDefault();

//         $( '#mask, .message-popup' ).fadeOut( 300, function() {
//             $('#mask').remove();
//         });

//         return false;
//     });
// });

/**
 * AJAX Handling for message to teacher.
 */
jQuery(document).ready(function($) {

    var hash             = document.location.hash,
        $headerContainer = $('.header-container'),
        $wpadminbar      = $('#wpadminbar'),
        $modal           = $('[data-remodal-id=teacher-message]').remodal(),
        $msgToTeacher    = $('.message_to_teacher'),
        $msgFormLoader   = $('.message-form__loader'),
        $sidebar         = $('.inbox-sidebar'),
        $sidebarNav      = $('.inbox-sidebar-nav'),
        $sidebarNavLinks = $sidebarNav.find('a'),
        $msgForm         = $('.message-form'),
        $msgResponse     = $msgForm.find('.message-form__response'),
        $msgsList        = $('.inbox-messages-list'),
        $msgsListItems   = $('.inbox-messages-list__item'),
        $fullMsgCont     = $('.inbox-full-message'),
        $fullMsgs        = $('.inbox-full-message__message'),
        $emptyMsg        = $('.inbox-empty'),
        $inboxHeading    = $('.inbox-messages-area__heading'),
        $composeBtn      = $('.inbox-compose-btn'),
        $composeCont     = $('.inbox-compose'),
        $composeForm     = $('.inbox-compose__form'),
        $putInTrash      = $('.put_in_trash'),
        $putReplyInTrash = $('.put_reply_in_trash'),
        $pagination      = $('[data-pagination-type]');

    /**
     * Change Hash
     * @param {string} hash
     */
    function changeHash( hash ) {
        if ( history.pushState ) {
            history.pushState( null, null, '#' + hash );
        } else {
            document.location.hash = hash;
        }
    }

    /**
     * Inbox Form Scroll Top
     * @param {string} field_type
     * @param {string} field_name
     * @param {object} $el
     */
    function inboxFormScrollTop( field_type, field_name, $el = null ) {
        var $search_field;

        // Set the type of search
        if ( $el !== null ) {
            $search_field = $el;
        } else if ( field_type == 'class' ) {
            // Search by class
            $search_field = $(field_name);
        } else {
            // Search by field type and name
            $search_field = $(field_type + '[name=' + field_name + ']');
        }

        $('html, body').animate({
            scrollTop: $search_field.offset().top - ( $headerContainer.outerHeight() + $wpadminbar.outerHeight() + 10 )
        }, 400);
    }

    // Fixed sidebar.
    var $el = $(".inbox-sidebar__inner"),
        $elParent = $('.inbox-sidebar').parent();

    $el.stick_in_parent({
        parent: $elParent,
        spacer: '.inbox-sidebar',
        inner_scrolling: false,
        offset_top: $('.header-container').outerHeight() + $('#wpadminbar').outerHeight() + 10
    });

    // Switch to "Inbox" messages.
    $sidebarNavLinks.on('click', function(e) {
        e.preventDefault();
        var $this = $(this),
            type = $this.data( 'nav-action' );

        // Change hash
        changeHash( type );

        // Add/remove 'active' class
        $this.parent().addClass('active').siblings().removeClass('active');

        // Show items.
        $msgsList.show();

        // Switch pagination.
        $pagination.hide();
        $pagination.filter(function(i, el) {
            return $(this).data('pagination-type') === type;
        }).show();

        // Hide items.
        $msgsListItems.hide();
        $fullMsgCont.hide();
        $emptyMsg.hide();
        $composeCont.hide();
        $composeBtn.removeClass('active');

        // Filter the type items and show them.
        var $filteredItems = $msgsListItems.filter(function(i, el) {
            return $(this).data('message-type') === type;
        });

        // Set the message type.
        switch ( type ) {
            case 'sent':
                $emptyMsg.text('You have no sent messages');
                $inboxHeading.text('Sent');
                break;
            case 'trash':
                $emptyMsg.text('You have no items in your trash folder');
                $inboxHeading.text('Trash');
                break;
            default:
                $emptyMsg.text('You have no received messages');
                $inboxHeading.text('Inbox');
                break;
        }

        if ( ! $filteredItems.length ) {
            $emptyMsg.show();
        }

        $filteredItems.show();

        // Recalc stickykit
        jQuery(document.body).trigger("sticky_kit:recalc");
    });

    // On clicking the item, show the full message.
    $msgsListItems.on('click', ':not(.message-check, .message-check input)', function(e) {
        e.preventDefault();
        var $this = $(this).closest('.inbox-messages-list__item'),
            msgId = $this.data('message-id'),
            msgType = $this.data('message-type'),
            statusUnread = $this.hasClass('inbox-messages-list__item--unread');

        // Change hash
        changeHash( 'message-' + msgId );

        // Hide items.
        $msgsList.hide();
        $fullMsgs.hide();
        $composeCont.hide();

        // Show items.
        $fullMsgCont.show();
        $fullMsgs.hide();
        $fullMsgs.filter(function() {
            var $this = $(this);
            return ( $this.data('messageid') === msgId && $this.data('message-type') === msgType );
        }).show();

        $composeBtn.removeClass('active');

        if ( statusUnread ) {
            $this.removeClass('inbox-messages-list__item--unread');
            $this.addClass('inbox-messages-list__item--read');
            $.ajax({
                url: '/dashboard/inbox/?ajax=sc',
                data: {
                    msgid: msgId
                },
            })
            .done(function(response) {
                console.log("success");
                console.log(response);
                if (response == 1) {
                    console.log(response);
                }
            })
            .fail(function() {
                console.log("error");
            })
            .always(function() {
                console.log("complete");
            });
        }
        // $('[data-messageid]').hide();
        // $('[data-messageid="' + msgId + '"]').show();
        // Recalc stickykit
        jQuery(document.body).trigger("sticky_kit:recalc");
    });

    // When compose button is clicked.
    $composeBtn.on('click', function(e) {
        e.preventDefault();

        $composeBtn.addClass('active');

        // Change hash
        changeHash( 'compose' );

        // Hide items.
        $msgsList.hide();
        $fullMsgCont.hide();

        $inboxHeading.text('Compose');

        // Remove active from all sidebar nav items.
        $sidebarNav.find('li').removeClass('active');

        // Show items.
        $composeCont.show();
        // Recalc stickykit
        jQuery(document.body).trigger("sticky_kit:recalc");
    });

    // Send message to the teacher.
    $msgToTeacher.click(function(e) {
        e.preventDefault();

        var path        = $msgForm.attr('action');
        var recipientid = $msgForm.data('recipientid');
        var composerid  = $msgForm.data('composerid');
        var $subject    = $msgForm.find("[name='subject']");
        var $firstName  = $msgForm.find("[name='first-name']");
        var $lastName   = $msgForm.find("[name='last-name']");
        var $email      = $msgForm.find("[name='author-email']");
        var $content    = $msgForm.find("[name='content']");

        $msgToTeacher.prop('disabled', true);

        // message will goes to teacher.php and fromt here direclty into DB
        $.ajax({
            url: path,
            type: 'post',
            data: {
                subject     : $subject.val(),
                first_name  : $firstName.val(),
                last_name   : $lastName.val(),
                email       : $email.val(),
                message     : $content.val(),
                recipientid : recipientid,
                composerid  : composerid
            },
            beforeSend: function() {
                $msgToTeacher.addClass( 'loading' ).attr( 'disabled', 'disabled' );
                $msgFormLoader.fadeIn();
            },
            success: function( response ) {

                $msgToTeacher.prop('disabled', false);

                $msgToTeacher.removeClass( 'loading' ).removeAttr( 'disabled' );
                $msgFormLoader.fadeOut();

                console.log( response );

                if ( response.success ) {
                    // $msgResponse.show().text( response.data.msg );
                    setTimeout(function() {
                        $modal.close();
                    }, 300);
                }
                // debugger;
            },
            error: function( error ) {

                $msgToTeacher.prop('disabled', false);

                $msgToTeacher.removeClass( 'loading' ).removeAttr( 'disabled' );
                $msgFormLoader.fadeOut();
                console.log( "error", error );
            }
        });
        // Recalc stickykit
        jQuery(document.body).trigger("sticky_kit:recalc");
    });

    // Compose form submit
    $composeForm.submit(function(e) {
        e.preventDefault();

        var errors      = false;
        var path        = $composeForm.attr('action');
        var composerid  = $composeForm.data('composerid');
        var $recipient  = $composeForm.find('[name="recipient"]');
        var $subject    = $composeForm.find("[name='subject']");
        var $content    = $composeForm.find("[name='content']");
        var $submitBtn  = $composeForm.find("[type=submit]");
        var $loader     = $composeForm.find(".inbox-composer__loader");
        var $successMsg = $composeForm.find(".input-compose__success");

        // Check for blanks
        // Validate recipient field.
        if ( $recipient.val() == '' ) {
            $recipient.addClass('error');
            $recipient.focus();
            inboxFormScrollTop( 'input', 'recipient', $recipient );
            errors = true;
        } else {
            $recipient.removeClass('error');
        }

        // Validate subject field.
        if ( $subject.val() == '' ) {
            $subject.addClass('error');
            $subject.focus();
            inboxFormScrollTop( 'input', 'recipient', $subject );
            errors = true;
        } else {
            $subject.removeClass('error');
        }

        // Validate message field.
        if ( $content.val() == '' ) {
            $content.addClass('error');
            $content.focus();
            inboxFormScrollTop( 'input', 'recipient', $content );
            errors = true;
        } else {
            $content.removeClass('error');
        }

        if ( path && ! errors ) {
            // message will goes to teacher.php and fromt here direclty into DB
            $.ajax({
                url: path,
                type: 'post',
                data: {
                    subject     : $subject.val(),
                    message     : $content.val(),
                    recipientid : $recipient.val(),
                    composerid  : composerid
                },
                beforeSend: function() {
                    $submitBtn.addClass( 'loading' ).attr( 'disabled', 'disabled' );
                    $loader.show();
                },
                success: function( response ) {
                    $loader.hide();
                    $submitBtn.removeClass( 'loading' ).removeAttr( 'disabled' );

                    if ( response.success ) {
                        window.location.href = '/dashboard/inbox/?msg=1';
                        // $successMsg.show().text( response.data.msg );
                    } else {
                        inboxLoopThroughErrors( response.data.errors, $composeForm );
                    }
                },
                error: function( error ) {
                    $loader.show();
                    $submitBtn.removeClass( 'loading' ).removeAttr( 'disabled' );
                }
            });
        }

        return false;
    });

    // Reply back
    $('.reply-form').submit(function(e) {
        e.preventDefault();

        var errors      = false;
        var $form       = $(this);
        var path        = $form.attr('action');
        var inboxid     = $form.data('inboxid');
        var recipientid = $form.data('recipientid');
        var composerid  = $form.data('composerid');
        var $content    = $form.find("[name=message]");
        var $submitBtn  = $form.find("[type=submit]");
        var $loader     = $form.find(".reply-form__loader");
        var $successMsg = $form.find(".reply-form__success");

        // Validate recipient field.
        // Validate message field.
        if ( $content.val() == '' ) {
            $content.addClass('error');
            $content.focus();
            inboxFormScrollTop( 'input', 'recipient', $content );
            errors = true;
        } else {
            $content.removeClass('error');
        }

        if ( path && ! errors ) {
            $.ajax({
                url: path,
                type: 'post',
                data: {
                    inboxid     : inboxid,
                    recipientid : recipientid,
                    composerid  : composerid,
                    content     : $content.val()
                },
                beforeSend: function() {
                    $loader.show();
                    $submitBtn.addClass( 'loading' ).attr( 'disabled', 'disabled' );
                },
                success: function( response ) {
                    $loader.hide();
                    $submitBtn.removeClass( 'loading' ).removeAttr( 'disabled' );
                    console.log( response );

                    if ( response.success ) {
                        // $successMsg.show().text( response.data.msg );
                        window.location.href = '/dashboard/inbox/?msg=2';
                    } else {
                        inboxLoopThroughErrors( response.data.errors, $form );
                    }
                },
                error: function( error ) {
                    $loader.hide();
                    $submitBtn.removeClass( 'loading' ).removeAttr( 'disabled' );
                    console.log( "error", error );
                }
            });
        }
    });

    function inboxLoopThroughErrors( errors, $form ) {
        if ( ! errors || typeof errors !== 'object' ) {
            return false;
        }

        for ( let i = 0; i < errors.length; i++ ) {
            var error = errors[i];
            var $el   = $form.find('[name="' + error.field + '"]');

            if ( $el.length ) {
                $el.addClass('error');
                $el.focus();
                inboxFormScrollTop( 'input', 'recipient', $el );
            }
        }
    }

    // Put in trash
    $putInTrash.click(function(e) {
        e.preventDefault();

        var inboxId = $(this).data('messageid');

        if ( inboxId ) {
            $.ajax({
                url: '/dashboard/inbox/?ajax=delete',
                type: 'post',
                data: {
                    inbox_id: inboxId,
                    type: 'message'
                },
                success: function( response ) {
                    console.log( response );
                    if ( response.success == 1 ) {
                        window.location.href = '/dashboard/inbox/?msg=3';
                    }
                },
                error: function( error ) {
                    console.log( error );
                }
            })
        }
    });

    // Put reply in trash
    $putReplyInTrash.click(function(e) {
        e.preventDefault();

        var replyId = $(this).data('replyid');

        if ( replyId ) {
            $.ajax({
                url: '/dashboard/inbox/?ajax=deletereply',
                type: 'post',
                data: {
                    reply_id: replyId,
                    type: 'reply'
                },
                success: function( response ) {
                    console.log( response );
                    if ( response.success == 1 ) {
                        window.location.href = '/dashboard/inbox/?msg=4';
                    }
                },
                error: function( error ) {
                    console.log( error );
                }
            })
        }
    });

    /**
     * Action Message
     */
    $('.inbox-action-message').click(function(e) {
        e.preventDefault();
        $(this).remove();
    });

    /**
     * Click on the link based on location.hash
     */
    if ( hash && hash != '#' ) {
        if ( hash.indexOf( 'message-' ) > -1 ) {
            $(hash).click();
        } else {
            $sidebar.find('a[href="' + hash + '"]').click();
        }
    } else {
        // $sidebarNavLinks.first().click();
    }

});

/*
 Sticky-kit v1.1.2 | WTFPL | Leaf Corcoran 2015 | http://leafo.net
 */
(function(){var b,f;b=this.jQuery||window.jQuery;f=b(window);b.fn.stick_in_parent=function(d){var A,w,J,n,B,K,p,q,k,E,t;null==d&&(d={});t=d.sticky_class;B=d.inner_scrolling;E=d.recalc_every;k=d.parent;q=d.offset_top;p=d.spacer;w=d.bottoming;null==q&&(q=0);null==k&&(k=void 0);null==B&&(B=!0);null==t&&(t="is_stuck");A=b(document);null==w&&(w=!0);J=function(a,d,n,C,F,u,r,G){var v,H,m,D,I,c,g,x,y,z,h,l;if(!a.data("sticky_kit")){a.data("sticky_kit",!0);I=A.height();g=a.parent();null!=k&&(g=g.closest(k));
if(!g.length)throw"failed to find stick parent";v=m=!1;(h=null!=p?p&&a.closest(p):b("<div />"))&&h.css("position",a.css("position"));x=function(){var c,f,e;if(!G&&(I=A.height(),c=parseInt(g.css("border-top-width"),10),f=parseInt(g.css("padding-top"),10),d=parseInt(g.css("padding-bottom"),10),n=g.offset().top+c+f,C=g.height(),m&&(v=m=!1,null==p&&(a.insertAfter(h),h.detach()),a.css({position:"",top:"",width:"",bottom:""}).removeClass(t),e=!0),F=a.offset().top-(parseInt(a.css("margin-top"),10)||0)-q,
  u=a.outerHeight(!0),r=a.css("float"),h&&h.css({width:a.outerWidth(!0),height:u,display:a.css("display"),"vertical-align":a.css("vertical-align"),"float":r}),e))return l()};x();if(u!==C)return D=void 0,c=q,z=E,l=function(){var b,l,e,k;if(!G&&(e=!1,null!=z&&(--z,0>=z&&(z=E,x(),e=!0)),e||A.height()===I||x(),e=f.scrollTop(),null!=D&&(l=e-D),D=e,m?(w&&(k=e+u+c>C+n,v&&!k&&(v=!1,a.css({position:"fixed",bottom:"",top:c}).trigger("sticky_kit:unbottom"))),e<F&&(m=!1,c=q,null==p&&("left"!==r&&"right"!==r||a.insertAfter(h),
    h.detach()),b={position:"",width:"",top:""},a.css(b).removeClass(t).trigger("sticky_kit:unstick")),B&&(b=f.height(),u+q>b&&!v&&(c-=l,c=Math.max(b-u,c),c=Math.min(q,c),m&&a.css({top:c+"px"})))):e>F&&(m=!0,b={position:"fixed",top:c},b.width="border-box"===a.css("box-sizing")?a.outerWidth()+"px":a.width()+"px",a.css(b).addClass(t),null==p&&(a.after(h),"left"!==r&&"right"!==r||h.append(a)),a.trigger("sticky_kit:stick")),m&&w&&(null==k&&(k=e+u+c>C+n),!v&&k)))return v=!0,"static"===g.css("position")&&g.css({position:"relative"}),
  a.css({position:"absolute",bottom:d,top:"auto"}).trigger("sticky_kit:bottom")},y=function(){x();return l()},H=function(){G=!0;f.off("touchmove",l);f.off("scroll",l);f.off("resize",y);b(document.body).off("sticky_kit:recalc",y);a.off("sticky_kit:detach",H);a.removeData("sticky_kit");a.css({position:"",bottom:"",top:"",width:""});g.position("position","");if(m)return null==p&&("left"!==r&&"right"!==r||a.insertAfter(h),h.remove()),a.removeClass(t)},f.on("touchmove",l),f.on("scroll",l),f.on("resize",
    y),b(document.body).on("sticky_kit:recalc",y),a.on("sticky_kit:detach",H),setTimeout(l,0)}};n=0;for(K=this.length;n<K;n++)d=this[n],J(b(d));return this}}).call(this);
