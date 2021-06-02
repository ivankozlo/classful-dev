            </div>
            
            <?php
            // Extra footer classes
            $footer_classes = '';
            
            // Support footer
            if (
                preg_match('/^\/support\//i', $_SERVER['REQUEST_URI']) ||
                preg_match('/^\/brand\//i', $_SERVER['REQUEST_URI'])
            )
            {
                // Add footer class
                $footer_classes .= ' footer--support ';
                ?>
                <div class="footer-contact-support section bg-secondary">
                    <div class="container" style="position: relative;">
                        <div class="row">
                            <div class="col-lg-8">
                                <div class="left">
                                    <p class="footer-contact-support__text">Still cant find the answers to your questions? <strong>Contact us</strong> to assist you further.</p>
                                </div>
                            </div>
                            
                            <div class="col-lg-4">
                                <div class="right text-center text-lg-right">
                                    <a href="#" class="btn btn-white btn-jumbo footer-contact-support__btn" data-toggle="modal" data-target="#messageModel">Contact support</a>
                                </div>
                            </div>
                        </div>
                        
                        <img class="footer-contact-support__img" src="<?php echo get_template_directory_uri() . '/assets/img/decorative-brush-support-footer.svg'; ?>" alt="">
                    </div>
                </div>
                <?php
            }
            ?>
            
            <footer class="footer <?php echo $footer_classes; ?>">
                <div class="footer__top">
                    <div class="container-fluid container-fluid--max">
                        <div class="row">
                            <div class="col-lg-3 col-md-12">
                                <div class="footer__brand mb-3 pr-0 pr-lg-2 pr-xl-8">
                                    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/logo-cf-white.png" alt="" style="width: auto; height: 40px;">
                                </div>
                            </div>
                            
                            <div class="col-lg-3 col-md-6">
                                <h4 class="h5 footer__heading">Company</h4>
                                
                                <ul class="footer__nav list-unstyled">
                                    <li><a href="/about/">About Us</a></li>
                                    <li><a href="/blog/">Blog</a></li>
                                    <li><a href="/brand/">Brand Guide</a></li>
                                    <li><a href="/terms/">Terms of Use</a></li>
                                    <li><a href="/privacy/">Privacy Policy</a></li>
                                </ul>
                            </div>
                            
                            <div class="col-lg-3 col-md-6">
                                <h4 class="h5 footer__heading">Members & Donors</h4>
                                
                                <ul class="footer__nav list-unstyled">
                                    <li><a href="/register/">Sign Up</a></li>
                                    <li><a href="/register/?sa=1">Claim a School</a></li>
                                    <li><a href="/dashboard/">My Account</a></li>
                                    <li><a href="/support/">Support</a></li>
                                    <li><a href="#" class="footer-modal-invite" data-toggle="modal" data-target="#inviteFriendModal" data-invite-type="teacher">Invite a Teacher</a></li>
                                    <li><a href="#" class="footer-modal-invite" data-toggle="modal" data-target="#inviteFriendModal" data-invite-type="friend">Invite a Friend</a></li>
                                    <li><a href="/schools/">For Schools</a></li>
                                    <li><a href="/teachers/">For Teachers</a></li>
                                </ul>
                            </div>
                            
                            <div class="col-lg-3 col-md-6">
                                <h4 class="h5 footer__heading">Community</h4>
                                
                                <ul class="footer__nav list-unstyled footer__social">
                                    <li><a href="https://www.instagram.com/classful.official/" target="_blank"><i class="fab fa-instagram"></i><span>Instagram</span></a></li>
                                    <li><a href="https://www.facebook.com/Classful-114236910414796" target="_blank"><i class="fab fa-facebook"></i><span>Facebook</span></a></li>
                                    <li><a href="https://twitter.com/Classful_" target="_blank"><i class="fab fa-twitter"></i><span>Twitter</span></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="footer__bottom">
                    <div class="container-fluid container-fluid--max">
                        <div class="row">
                            <div class="col-12">
                                <p class="footer__copy mb-2 mb-md-0 text-center">
                                    <strong>&copy;<?php echo date('Y'); ?> <?php echo FMT_COMPANY_NAME; ?>&trade; All rights reserved.</strong>
                                    <br />
                                    <span style="font-size: .9rem">Made with <i class="fas fa-heart"></i> in Las Vegas, NV</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>

        <div class="modal fade invite-teacher-friend-modal" id="inviteFriendModal" tabindex="-1" role="dialog" aria-labelledby="inviteFriendLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                    
                <div class="modal-content">
                    
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true"><img src="<?php echo get_template_directory_uri(); ?>/assets/images/back-arrow.svg" class="" alt="alt text"></span>
                        </button>
        
                        <h5 class="modal-title text-lg" id="teacherUpdatesModalLabel">
                            <span class="ml-2 d-inline-block align-middle">Invite your <span class="modal-invite-type-label">friend</span> via Facebook, Twitter or Email</span>
                        </h5>
                    </div>
                    
                    <div class="modal-body">
                        <form id="form_invite_friend_form" name="invite_friend_form" action="/" method="post">
                            <input type="hidden" name="invite_type" value="friend">
                            <div class="form-notice" style="display: none;">
                                <p class="clearfix">
                                    <span class="span-message"><i class="fas fa-info-circle"></i> Your invite has been sent</span>
                                    <span class="span-icon"><i class="fas fa-times"></i></span>
                                </p>
                            </div>
                            
                            <div class="share-donation__buttons mb-4">
                                <div class="row">
                                    <div class="col-md-6">
                                        <a href="#" class="share-donation__btn share-donation__btn--fb invite-fb" data-url="<?php echo urlencode(site_url('/')); ?>">
                                            <div class="btn btn-block text-left py-6 btn-with-icon btn--login-facebook mb-4 mt-4" style="margin: 0 0 10px 0 !important;">
                                                <img src="/wp-content/themes/tf/assets/img/facebook-icon-new2.svg" alt="Continue with Facebook">
                                                <span>Share on Facebook</span>
                                            </div>
                                        </a>
                                    </div>
                                    <div class="col-md-6">
                                        <a href="https://twitter.com/intent/tweet?text=<?php echo urlencode( 'I found this cool website where we can donate to teachers ' . site_url() . ' via @teacherfunder' ) ?>" target="_blank" class="share-donation__btn" style="background: #1da1f2 !important;">
                                            <div class="btn btn-block text-left py-6 btn-with-icon btn--login-facebook mb-4 mt-4" style="margin: 0 0 10px 0 !important; background: #1da1f2 !important;">
                                                <i class="icon icon-twitter" style="color: #fff;"></i>
                                                <span>Share on Twitter</span>
                                            </div>
                                        </a>
    
                                        <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="user-line-delimiter mb-4">
                                <span>Or share via email</span>
                            </div>
                            
                            <div class="form-group">
                                <label for="inviteFriendSenderName">Sender name</label>
                                <input type="text" class="form-control" id="inviteFriendSenderName" name="sender_name" placeholder="Your name" />
                            </div>
                            
                            <div class="form-group">
                                <label for="inviteFriendSenderEmail">Sender email</label>
                                <input type="email" class="form-control" id="inviteFriendSenderEmail" name="sender_email" placeholder="Your email address" />
                            </div>
                            
                            <div class="form-group">
                                <label for="inviteFriendRecipientName"><span class="modal-invite-type-label-uc">Friend</span>'s name</label>
                                <input type="text" class="form-control" id="inviteFriendRecipientName" name="recipient_name" placeholder="Recipient's name" />
                            </div>
                            
                            <div class="form-group mb-6">
                                <label for="inviteFriendRecipientEmail"><span class="modal-invite-type-label-uc">Friend</span>'s email</label>
                                <input type="email" class="form-control" id="inviteFriendRecipientEmail" name="recipient_email" placeholder="Recipient's email address" />
                            </div>
                            
                            <div class="form-group mb-0">
                                <div id="g-recaptcha"></div>
                                
                                <div class="recaptcha-error" style="display: none;">
                                    Please complete the captcha to continue
                                </div>
                            </div>
                        </form>
                    </div>
    
                    <div class="modal-footer justify-content-between">
                        <div class="custom-control custom-checkbox">
                            <a href="#" class="cta-secondary dark" style="color: #868686;" data-dismiss="modal" aria-label="Close"><i class="fas fa-times" style="color: #868686;"></i> No Thanks</a>
                        </div>
        
                        <input type="submit" form="form_invite_friend_form" name="submit_invite_friend" value="Send Invite" class="cta-send-message btn btn-secondary" />
                    </div>
                </div><!--modal-content-->

            </div>
        </div>

        <?php wp_footer(); ?>
    </body>
</html>
