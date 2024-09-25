<?php

/**
 * Provide a admin area view for the plugin
 *
 * @package    Zerobounce_Email_Validator
 * @subpackage Zerobounce_Email_Validator/admin/partials
 * @author     ZeroBounce (https://zerobounce.net/)
 */
?>

<div class="wrap">
    <header class="p-3 mb-3 bg-white border-bottom">
    <div class="container-fluid">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <a href="/" class="d-flex align-items-center mb-2 mb-lg-0 mx-3 text-dark text-decoration-none">
          <img src="<?php echo plugin_dir_url(dirname(__FILE__)) . 'img/logo.svg'; ?>" class="img-fluid" title="ZeroBounce" alt="ZeroBounce">
        </a>
        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0 fw-bold">
          <li><a href="<?php echo get_admin_url()."admin.php?page=zerobounce-email-validator"; ?>" class="nav-link px-2 <?php if (isset($_GET['page']) && $_GET['page'] === "zerobounce-email-validator") { echo "link-secondary"; } else { echo "link-dark"; } ?>"><?php _e('Dashboard', 'zerobounce-email-validator') ?></a></li>
          <li><a href="<?php echo get_admin_url()."admin.php?page=zerobounce-email-validator-settings"; ?>" class="nav-link px-2 <?php if (isset($_GET['page']) && $_GET['page'] === "zerobounce-email-validator-settings") { echo "link-secondary"; } else { echo "link-dark"; } ?>"><?php _e('Settings', 'zerobounce-email-validator') ?></a></li>
          <li><a href="<?php echo get_admin_url()."admin.php?page=zerobounce-email-validator-tools"; ?>" class="nav-link px-2 <?php if (isset($_GET['page']) && $_GET['page'] === "zerobounce-email-validator-tools") { echo "link-secondary"; } else { echo "link-dark"; } ?>"><?php _e('Tools', 'zerobounce-email-validator') ?></a></li>
          <li><a href="<?php echo get_admin_url()."admin.php?page=zerobounce-email-validator-logs"; ?>" class="nav-link px-2 <?php if (isset($_GET['page']) && $_GET['page'] === "zerobounce-email-validator-logs") { echo "link-secondary"; } else { echo "link-dark"; } ?>"><?php _e('Logs', 'zerobounce-email-validator') ?></a></li>
        </ul>
        <div class="text-end">
            <span id="zb-current-credits" ><div id="zb-current-credits-loader" class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">0</span></div></span>&nbsp;<span><?php _e('credits', 'zerobounce-email-validator') ?></span>
            <span class="dashicons dashicons-info-outline" style="vertical-align: middle !important; font-size: 1rem !important;" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="<?php _e('Credits can be used for either validation or scoring. 1 credit = 1 successfully processed email address.', 'zerobounce-email-validator') ?>"></span>
            <a href="https://www.zerobounce.net/members/pricing" class="btn btn-warning border-0 fw-bold" target="_blank" title="<?php _e('Buy Credits', 'zerobounce-email-validator') ?>"><?php _e('Buy Credits', 'zerobounce-email-validator') ?></a>
        </div>     
      </div>
    </div>
  </header> 
  <div class="container-fluid g-0">
        <div class="row">
            <div class="col-6">
                <div class="card rounded-0 p-3 m-0">
                    <div class="card-body">        
                        <form action="<?php echo esc_url(admin_url('admin-post.php')); ?>" method="POST" id="validate-form" disabled>
                            <div class="validate-form-container">
                                <p><?php _e('Enter an email below to validate', 'zerobounce-email-validator') ?></p>
                                <div class="form-input form-group field-input-email">
                                    <input type="text" class="email-form-input" name="email" id="email" placeholder="<?php _e('Email', 'zerobounce-email-validator') ?>" value="" required>
                                    <input type="submit" name="submit" id="submit" class="button button-primary" value="<?php _e('Validate', 'zerobounce-email-validator') ?>">
                                </div>
                                    
                                <div id="validate-form-result" style="overflow-x:auto;">
                                    <p class="text-danger"></p>
                                </div>
            
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <!-- <div class="col-6">
                <div class="card rounded-0 p-3 m-0">
                    <div class="card-body">
                        <p>More tools coming soon.</p>
                    </div>
                </div>
            </div>
            -->
        </div>
    </div>
</div>