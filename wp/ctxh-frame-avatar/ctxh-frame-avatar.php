<?php

/**
 * Plugin Name: CTXH Frame Avatar
 * Plugin URI: https://ctxhhutech.com
 * Description: CTXH Frame Avatar
 * Version: 1.0
 * Author: Trần Nhật Duy
 * Author URI: https://duydev.io.vn
 * License: GPLv2 or later 
 */

if (!class_exists('CTXH_Frame_Avatar')) {
    class CTXH_Frame_Avatar
    {
        function __construct()
        {
            if (!function_exists('add_shortcode')) {
                return;
            }

            add_shortcode('ctxh_frame_avatar', array(&$this, 'handler'));
        }

        function handler($atts = array(), $content = null)
        {
            $user_photo = plugins_url('/assets/default.png', __FILE__);
            $frame_photo = plugins_url('/assets/frame.png', __FILE__);

            return '<div id="ctxh-avatar-frame" data-user-photo="' . $user_photo . '" data-frame-photo="' . $frame_photo . '"></div>';
        }
    }
}

function caf_load()
{
    global $cqg;
    $cqg = new CTXH_Frame_Avatar();
}

add_action('plugins_loaded', 'caf_load');

function caf_enqueue_scripts_and_styles()
{
    wp_register_style('caf_style', plugins_url('/assets/index.css', __FILE__));
    wp_enqueue_style('caf_style');

    wp_register_script('caf_script', plugins_url('/assets/index.js', __FILE__));
    wp_enqueue_script('caf_script', '', array(), false, array('strategy'  => 'defer'));
}

add_action('wp_enqueue_scripts', 'caf_enqueue_scripts_and_styles');
