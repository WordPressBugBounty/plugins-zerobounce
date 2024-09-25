<?php

/**
 * Define the API functionality.
 *
 * @since      1.0.0
 * @package    Zerobounce_Email_Validator
 * @subpackage Zerobounce_Email_Validator/includes
 * @author     ZeroBounce (https://zerobounce.net/)
 */
class Zerobounce_Email_Validator_API
{
    /**
     * The ZeroBounce API Key
     *
     * @since    1.0.0
     * @access   private
     * @var      string $api_key The ZeroBounce API Key
     */
    private $api_key;

    /**
     * The ZeroBounce API Timeout
     *
     * @since    1.0.0
     * @access   private
     * @var      int $api_timeout The ZeroBounce API Timeout in seconds
     */
    private $api_timeout;

    /**
     * Save the API key for future usage.
     *
     * @since    1.0.0
     */
    public function __construct($api_key = "", $api_timeout = 50)
    {
        $this->api_key = $api_key;
        $this->api_timeout = $api_timeout;
    }

    private function getApi(): string
    {
        $apiZone = get_option('zerobounce_settings_api_zone');
        if (is_array($apiZone) && in_array('api_usa', $apiZone)) {
            return 'https://api-us.zerobounce.net/v2';
        } else {
            return 'https://api.zerobounce.net/v2';
        }
    }

    public function get_credits_info()
    {
        try {
            if (!$this->is_api_key()) {
                return -1;
            }
            $api = $this->getApi();
            $response = wp_remote_get($api . '/getcredits?api_key=' . $this->api_key, [
                'method' => 'GET',
                'data_format' => 'body',
                'timeout' => $this->api_timeout,
                'user-agent' => 'ZeroBounce Email Validator (WordPress Plugin)',
                'headers' => [
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ]
            ]);

            if ((!is_wp_error($response)) && (200 === wp_remote_retrieve_response_code($response))) {
                $body = wp_remote_retrieve_body($response);

                $body_json = json_decode($body, true);

                if (json_last_error() === JSON_ERROR_NONE) {
                    if ($body_json['Credits'] !== '-1') {
                        return number_format($body_json['Credits']);
                    }
                }
            }
        } catch (\Exception $ex) {
            error_log($ex->getMessage());
        }

        return -1;
    }

    public function validate_key($key)
    {
        try {
            $response = wp_remote_get('https://members-api.zerobounce.net/api/keys/validate/?api_key=' . $key, [
                'method' => 'GET',
                'data_format' => 'json',
                'timeout' => $this->api_timeout,
                'user-agent' => 'ZeroBounce Email Validator (WordPress Plugin)',
                'headers' => [
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ]
            ]);

            if ((!is_wp_error($response)) && (200 === wp_remote_retrieve_response_code($response))) {
                $body = wp_remote_retrieve_body($response);

                $body_json = json_decode($body, true);

                if (json_last_error() === JSON_ERROR_NONE) {

                    if (array_key_exists("valid", $body_json) && $body_json['valid']) {
                        return true;
                    }

                    return false;
                }
            }
        } catch (\Exception $ex) {
            error_log($ex->getMessage());
        }

        return false;
    }

    public function validate_email($email)
    {
        try {
            if (!$this->is_api_key()) {
                return null;
            }
            $api = $this->getApi();
            $response = wp_remote_get($api . '/validate?api_key=' . $this->api_key . '&email=' . urlencode($email), [
                'method' => 'GET',
                'data_format' => 'json',
                'timeout' => $this->api_timeout,
                'user-agent' => 'ZeroBounce Email Validator (WordPress Plugin)',
                'headers' => [
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ]
            ]);

            if ((!is_wp_error($response)) && (200 === wp_remote_retrieve_response_code($response))) {
                $body = wp_remote_retrieve_body($response);

                $body_json = json_decode($body, true);

                if (json_last_error() === JSON_ERROR_NONE) {

                    if (array_key_exists("error", $body_json)) {
                        return null;
                    }

                    return $body_json;
                }
            }
        } catch (\Exception $ex) {
            error_log($ex->getMessage());
        }

        return null;
    }

    public function is_api_key()
    {
        if (!strlen($this->api_key) || empty($this->api_key) || $this->api_key === "") {
            return false;
        }

        return true;
    }
}
