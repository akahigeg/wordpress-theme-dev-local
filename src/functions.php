<?php
// 管理画面にCSSとJSの読み込みを追加
function enqueue_progress_files() {
  wp_enqueue_style('progress-style' , get_stylesheet_directory_uri() . '/css/progress.css');
  wp_enqueue_script('progress-js' , get_stylesheet_directory_uri() . '/js/progress.js');
}
add_action('admin_enqueue_scripts', 'enqueue_progress_files');

/**
 * 入力ガイド機能
 * - 入力欄を順番にガイド
 * - ヘルプボタンを押すと入力項目に関するヘルプを表示
 * - 入力順になったものは矢印のアニメ＆ハイライトで注意を引く（アニメも入力順がきたもののみ）
 * - すでに入力されているものはハイライトしない
 * - タイマーで全ての入力欄を監視し、入力されたものはグリーンに
 * - 画面上部にfixで表示
 * - 必須項目とそうでない項目がわかるといい
 * - 必須項目を埋めないと公開ボタンを押せない
 */