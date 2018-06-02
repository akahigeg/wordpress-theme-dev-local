<?php
// 管理画面にCSSとJSの読み込みを追加
function enqueue_progress_files() {
  wp_enqueue_style('progress-style' , get_stylesheet_directory_uri() . '/css/progress.css');
  wp_enqueue_script('progress-js' , get_stylesheet_directory_uri() . '/js/progress.js');
}
add_action('admin_enqueue_scripts', 'enqueue_progress_files');

/**
 * 入力ガイド機能
 * - [] ヘルプボタンを押すと入力項目に関するヘルプを表示 モーダルウィンドウで表示する
 * - [OK] タイマーで全ての入力欄を監視し、入力されたものはグリーンに
 * - [OK] 画面上部にfixで表示
 * - [OK] ガイドを画面上部か下部に固定
 * - [] 必須項目とそうでない項目がわかるといい
 * - [] 必須項目を埋めないと公開ボタンを押せない
 * - [] 汎用的に処理できるようにコードを整理する 処理のブロックを関数に分離するなど
 * - [] 投稿タイプごとに項目をカスタマイズ
 * - [] 投稿のページでのみ表示
 * 
 * なくした機能
 * - [x] 入力欄を順番にガイド
 * - [x] 入力順になったものは矢印のアニメ＆ハイライトで注意を引く（アニメも入力順がきたもののみ）
 * - [x] すでに入力されているものはハイライトしない
 * - [x] 非表示/表示を切り替えられるようにする
 */