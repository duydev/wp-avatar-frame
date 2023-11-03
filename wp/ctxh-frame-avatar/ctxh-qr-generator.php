<?php

/**
 * Plugin Name: CTXH QR Generator
 * Plugin URI: https://ctxhhutech.com
 * Description: CTXH QR Generator
 * Version: 1.0
 * Author: Trần Nhật Duy
 * Author URI: https://duydev.io.vn
 * License: GPLv2 or later 
 */

if (!class_exists('CTXH_QR_Generator')) {
    class CTXH_QR_Generator
    {
        function __construct()
        {
            if (!function_exists('add_shortcode')) {
                return;
            }

            add_shortcode('ctxh_qr_generator', array(&$this, 'handler'));
        }

        function handler($atts = array(), $content = null)
        {
            $logo_url = plugins_url('/assets/logo-ctxh.png', __FILE__);

            return '<div id="ctxh-qr-generator" data-logo-url="' . $logo_url . '"></div>';
        }
    }
}

function cqg_load()
{
    global $cqg;
    $cqg = new CTXH_QR_Generator();
}

add_action('plugins_loaded', 'cqg_load');

function cqg_enqueue_scripts_and_styles()
{
    wp_register_style('cqg_style', plugins_url('/assets/index.css', __FILE__));
    wp_enqueue_style('cqg_style');

    wp_register_script('cqg_script', plugins_url('/assets/index.js', __FILE__));
    wp_enqueue_script('cqg_script', '', array(), false, array('strategy'  => 'defer'));
}

add_action('wp_enqueue_scripts', 'cqg_enqueue_scripts_and_styles');
