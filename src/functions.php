<?php
// 管理画面にCSSとJSの読み込みを追加
function enqueue_progress_files() {
  wp_enqueue_style('progress-style' , get_stylesheet_directory_uri() . '/css/progress.css');
  wp_enqueue_script('progress-js' , get_stylesheet_directory_uri() . '/js/progress.js');

  wp_enqueue_style('modal-style' , get_stylesheet_directory_uri() . '/css/modal.css');
}
add_action('admin_enqueue_scripts', 'enqueue_progress_files');

// 指定されたpost_idの投稿の投稿タイプを返す
function ajax_post_type_by_post_id() {
  if ($_POST['post_type'] != '') {
    // post_typeがわたってきた場合はそのまま返す
    echo $_POST['post_type'];
  } else {
    // post_idがわたってきた場合は投稿タイプを判別して返す
    echo get_post_type($_POST['post_id']);
  }
  die();
}
add_action('wp_ajax_ajax_post_type_by_post_id', 'ajax_post_type_by_post_id');

function ajax_guide_html() {
  $template_file = get_stylesheet_directory() . '/guide/' . $_POST['item_key'] . '.html';
  if (file_exists($template_file)) {
    $html = file_get_contents($template_file);
  } else {
    $html = $template_file;
  }

  echo $html;
  die();
}
add_action('wp_ajax_ajax_guide_html', 'ajax_guide_html');

/**
 * 入力ガイド機能
 * - [OK] ヘルプボタンを押すと入力項目に関するヘルプを表示 モーダルウィンドウで表示する
 * - [OK] ヘルプの内容をテンプレートから読み込んで表示
 * - [OK] タイマーで全ての入力欄を監視し、入力されたものはグリーンに
 * - [OK] 画面上部にfixで表示
 * - [OK] ガイドを画面上部か下部に固定
 * - [OK] 必須項目とそうでない項目がわかるといい
 * - [OK] 必須項目を埋めないと公開ボタンを押せない
 * - [OK] 汎用的に処理できるようにコードを整理する 処理のブロックを関数に分離するなど
 * - [OK] 投稿タイプごとに項目をカスタマイズ
 * - [OK] 投稿のページでのみ表示
 * 
 * なくした機能
 * - [x] 入力欄を順番にガイド
 * - [x] 入力順になったものは矢印のアニメ＆ハイライトで注意を引く（アニメも入力順がきたもののみ）
 * - [x] すでに入力されているものはハイライトしない
 * - [x] 非表示/表示を切り替えられるようにする
 */