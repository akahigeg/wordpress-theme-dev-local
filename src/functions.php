<?php
// 管理画面にCSSとJSの読み込みを追加
function enqueue_post_guide_files() {
  wp_enqueue_style('post-guide-style' , get_stylesheet_directory_uri() . '/css/post_guide.css');
  wp_enqueue_script('post-guide-js' , get_stylesheet_directory_uri() . '/js/post_guide.js');
}
add_action('admin_enqueue_scripts', 'enqueue_post_guide_files');

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

function ajax_post_guide_html() {
  $guide_content_path = get_stylesheet_directory() . '/post_guide/' . $_POST['item_key'] . '.html';
  if (file_exists($guide_content_path)) {
    $html = file_get_contents($guide_content_path);
  } else {
    $html = $guide_content;
  }

  echo $html;
  die();
}
add_action('wp_ajax_ajax_post_guide_html', 'ajax_post_guide_html');

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