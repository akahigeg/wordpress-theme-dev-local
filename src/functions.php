<?php
// 管理画面にスタイルの追加
function enqueue_modal_files() {
  wp_enqueue_style('modal-style' , get_stylesheet_directory_uri() . '/css/modal.css');
  wp_enqueue_script('modal-js' , get_stylesheet_directory_uri() . '/js/modal.js');
}
add_action('admin_enqueue_scripts', 'enqueue_modal_files');

// AJAXリクエストに対して参照ポストのJSONを返す
function ajax_modal() {
    // csrf対策
    check_ajax_referer('ajax_modal', 'secure');
    $items = array(
      array('id' => '1', 'title' => 'foo'), 
      array('id' => '2', 'title' => 'bar'), 
    );
    
    echo json_encode(array('items' => $items));
    die();
}
add_action('wp_ajax_ajax_modal', 'ajax_modal');

// モーダルボタンの表示
function open_modal_script() {
  // nonceが必要なためPHPからJavaScript出力
  echo "
  <script>
    jQuery(document).ready(function(){
      jQuery('#titlewrap').append(\" <a href='#' id='open-modal-button' class='button'>モーダルウィンドウを開く</a>\");
      jQuery('#open-modal-button').on('click', function(){ open_modal('" . wp_create_nonce('ajax_modal') . "') });
    });
  </script>
  ";
}    
add_action('admin_head', 'open_modal_script', 1);
