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

function caf_add_type_attribute($tag, $handle, $src)
{
    if ('caf_script' !== $handle) {
        return $tag;
    }

    $tag = '<script type="module" id="' . $handle . '" src="' . esc_url($src) . '" defer data-wp-strategy="defer"></script>';
    return $tag;
}

add_filter('script_loader_tag', 'caf_add_type_attribute', 10, 3);

function caf_register_pods_config()
{
    if (function_exists('pods_register_config_path')) {
        pods_register_config_path(plugin_dir_path(__FILE__));
    }
}

add_action('init', 'caf_register_pods_config');

function caf_list_all_photo_frames()
{
    $cdn_domain = get_option('sm_custom_domain');

    $posts = get_posts([
        'post_type' => 'photo_frame',
        'post_status' => 'published',
        'orderby' => 'ID',
        'order' => 'DESC',
        'posts_per_page' => 5,
        'paged' => 1
    ]);

    $result = [];

    foreach ($posts as $post) {
        $img_url = null;

        if (function_exists('pods_field')) {
            $image = pods_field('photo_frame', $post->ID, 'photo_frame_img', true);


            if ($image) {
                $image_path = get_post_meta($image['ID'], '_wp_attached_file', true);
                $img_url = $cdn_domain ? $cdn_domain . '/' . $image_path : $image['guid'];
            }
        }

        $result[] = [
            'id' => $post->ID,
            'title' => $post->post_title,
            'url' => $img_url,
            'created_at' => $post->post_date,
            'updated_at' => $post->post_modified
        ];
    }

    return $result;
}

add_action('rest_api_init', function () {
    register_rest_route('ctxh-frame-avatar/v1', '/photo_frames/', array(
        'methods' => 'GET',
        'callback' => 'caf_list_all_photo_frames'
    ));
});
