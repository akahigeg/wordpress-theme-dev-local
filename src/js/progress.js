jQuery(document).ready(function(){
  // 投稿の新規追加もしくは編集画面以外では表示しない
  if (location.pathname != '/wp-admin/post-new.php' && location.pathname != '/wp-admin/post.php') {
    return;
  }

  init_progress_bar();
});
function init_progress_bar() {
  // 投稿タイプの取得
  let post_type;
  let post_id;
  console.log('init');

  let query_string = location.search.substring(1);
  if (query_string) {
    params = query_string.split('&');
    params.forEach(element => {
      let key_value = element.split('=');
      // 新規追加の場合はURLからpost_typeを取得
      if (key_value[0] == 'post_type') {
        post_type = key_value[1];
        console.log(post_type);
        create_progress_bar(post_type);
      }
      // 編集の場合はAJAXで問い合わせるためにpost_idを記録
      if (key_value[0] == 'post') {
        post_id = key_value[1];
        console.log(post_id);
      }
    });
  }

  // 編集の場合はAJAXでpost_typeを取得 非同期になるので注意
  if (post_id) {
    console.log('ajax');
    $.ajax({
      type: 'POST',
      url: ajaxurl,
      data: {
          'action': 'ajax_post_type_by_post_id',
          'post_id': post_id
      },
      success: function(wp_post_type) {
        post_type = wp_post_type
        create_progress_bar(post_type);

        // 毎秒チェックを開始
        var timer = setInterval(function(){
          console.log(post_type);
          if (post_type == undefined) {
            return;
          }
      
          // タイトル
          if ($('input[name="post_title"]').val() != '') {
            get_progress($('#post_title-progress'));
          } else {
            lost_progress($('#post_title-progress'));
          }

          // 順序
          if ($('input[name="menu_order"]').val() != '') {
            get_progress($('#menu_order-progress'));
          } else {
            lost_progress($('#menu_order-progress'));
          }
      
          // 本文
          // ビジュアルモードのiframeからテキストモードのテキストエリアに同期されるのが10秒おきっぽい そのため本文反映が少し遅れる
          if ($('textarea[name="content"]').val() != '' || $('#content_ifr').contents().find('body').text() != '') {
            get_progress($('#content-progress'));
          } else {
            lost_progress($('#content-progress'));
          }
      
          // タグ
          if ($('ul.tagchecklist li').length > 0) {
            get_progress($('#tag-progress'));
          } else {
            lost_progress($('#tag-progress'));
          }
      
          // カテゴリー
          if ($('ul.categorychecklist :checked').length > 0) {
            get_progress($('#category-progress'));
          } else {
            lost_progress($('#category-progress'));
          }
        }, 1000);
      }
    });
  }
}

function create_progress_bar(post_type) {
  $('#screen-meta-links').before('<div><ul id="progress-panel" class="progress-panel"></ul></div>');
  $('#progress-panel').append('<li id="guide-header">入力ガイド</li>');

  // ガイドを表示する分、スペースを空ける
  $('h1.wp-heading-inline').css('padding-top', '60px');

  console.log(post_type);

  let progress_items = get_progress_items(post_type);

  for (let key in progress_items) {
    // プログレスバーの要素を追加
    let progress_name = key + '-progress'
    $('#progress-panel').append('<li id="' + progress_name + '" class="empty"><span class="item">' + progress_items[key]['label'] + '</span> <span id="' + key + '-help-button" class="help-button" > ? </span></li>');

    // ヘルプボタン クリックでモーダル表示
    $('#' + key + '-help-button').hover(
      function(e) {
        console.log($('#help-block').length == 0);
        
        if ($('#help-block').length == 0) {
          $('body').append('<div id="help-block" class="help-block">' + key + '</div>');
          let help_block = $('#help-block')
          help_block.css('top', e.clientY);
          help_block.css('left', e.clientX);
        }
      },
      function(e) {
        $('#help-block').remove();
      }
    );
  }
}

// 投稿タイプごとに入力ガイドに表示するアイテムを取得
function get_progress_items(post_type) {
  items = {
    'post': {
      'post_title': { label: 'タイトル', tag: 'input' },
      'content': { label: '本文', tag: 'textarea' },
      'tag': { label: 'タグ', tag: 'input' },
      'category': { label: 'カテゴリー', tag: 'input' },
    },
    'page': {
      'post_title': { label: 'タイトル', tag: 'input' },
      'content': { label: '本文', tag: 'textarea' },
      'menu_order': { label: '順序', tag: 'input' },
    },
  }
  return items[post_type];
}

function get_progress(selector) {
  selector.removeClass('empty');
  selector.css('animation', 'bgcolor_to_gain 1.2s');
  selector.addClass('done');
}

function lost_progress(selector) {
  selector.addClass('empty');
  selector.removeClass('done');
  selector.css('animation', 'bgcolor_to_lost 1.2s');
}