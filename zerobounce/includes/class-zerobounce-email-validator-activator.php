<?php

/**
 * Fired during plugin activation.
 *
 * @since      1.0.0
 * @package    Zerobounce_Email_Validator
 * @subpackage Zerobounce_Email_Validator/includes
 * @author     ZeroBounce (https://zerobounce.net/)
 */
class Zerobounce_Email_Validator_Activator
{

    /**
     * Bumped whenever the schema changes so existing installs can run
     * dbDelta on upgrade without requiring a manual reactivation.
     */
    const DB_VERSION = '2';

    /**
     * @since    1.0.0
     */
    public static function activate($network_wide)
    {
        Zerobounce_Email_Validator_Activator::setup_tables($network_wide);
        update_option('zerobounce_db_version', self::DB_VERSION);

        $validation_forms = [
            'validation_contact_form_7',
            'validation_wpforms',
            'validation_ninjaforms',
            'validation_formidableforms',
            'validation_woocommerce',
            'validation_wordpress_comments',
            'validation_wordpress_registration',
            'validation_mc4wp_mailchimp',
            'validation_gravity_forms',
            'validation_fluent_forms',
            'validation_ws_forms',
            'validation_mailster_forms',
            'validation_forminator_forms',
            'validation_bws_forms',
        ];

        update_option('zerobounce_settings_validation_forms', $validation_forms);

        $validation_pass = [
            'valid' => 'valid',
            'catch-all' => 'catch-all',
            'unknown' => 'unknown',
        ];

        update_option('zerobounce_settings_validation_pass', $validation_pass);
        update_option('zerobounce_settings_did_you_mean', ['did_you_mean']);
    }

    public static function setup_site_table($id): void
    {
        switch_to_blog($id);
        self::create_validation_logs();
        self::create_bulk_file_validation();
        restore_current_blog();
    }

    private static function setup_tables($network_wide): void
    {
        if (is_multisite() && $network_wide) {
            $sites = get_sites();
            foreach ($sites as $site) {
                self::setup_site_table($site->blog_id);
            }
        } else {
            self::create_validation_logs();
            self::create_bulk_file_validation();
        }
    }

//    private static function create_credit_usage_logs(): void
//    {
//        global $wpdb;
//
//        $charset_collate = $wpdb->get_charset_collate();
//        $table_name = $wpdb->prefix . 'zerobounce_credit_usage_logs';
//
//        $sql = "CREATE TABLE $table_name (
//    		id mediumint(9) NOT NULL AUTO_INCREMENT,
//			credits_used mediumint(9) NULL,
//    		date date DEFAULT '0000-00-00' NOT NULL,
//    		UNIQUE KEY id (id),
//    		UNIQUE KEY `date` (`date`)
//    	) $charset_collate;";
//
//        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
//        dbDelta($sql);
//    }

    private static function create_validation_logs(): void
    {
        global $wpdb;

        $charset_collate = $wpdb->get_charset_collate();
        $table_name = $wpdb->prefix . 'zerobounce_validation_logs';

        // Indexes are critical for the Logs page: without zb_date_time the
        // default `ORDER BY date_time DESC LIMIT ...` is a filesort over the
        // entire table, and without zb_email the search box scans every row.
        $sql = "CREATE TABLE $table_name (
    		id mediumint(9) NOT NULL AUTO_INCREMENT,
			source varchar(255) NOT NULL,
			form_id smallint(5) NULL,
			email varchar(255) NOT NULL,
			status varchar(50) NOT NULL,
			sub_status varchar(50) NOT NULL,
			ip_address varchar(50) NOT NULL,
    		result TEXT NOT NULL,
    		date_time datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
    		UNIQUE KEY id (id),
    		KEY zb_date_time (date_time),
    		KEY zb_email (email(191)),
    		KEY zb_status (status)
    	) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }

    /**
     * Idempotent migration runner. Re-runs dbDelta whenever the bundled
     * DB_VERSION differs from the value stored in options, which lets
     * plugin updates (e.g. via wordpress.org auto-update) pick up schema
     * changes without requiring the user to deactivate/reactivate.
     */
    public static function maybe_upgrade_db(): void
    {
        if (get_option('zerobounce_db_version') === self::DB_VERSION) {
            return;
        }

        self::create_validation_logs();
        self::create_bulk_file_validation();

        update_option('zerobounce_db_version', self::DB_VERSION);
    }

    private static function create_bulk_file_validation()
    {
        global $wpdb;

        $table_name = $wpdb->prefix . 'zerobounce_file_bulk_validation';
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            file_name varchar(255) NOT NULL,
            file_id varchar(255) NOT NULL,
            validation_status varchar(100) NOT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY (id)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }

}
