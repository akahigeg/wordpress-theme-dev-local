jQuery(document).ready(function () {
  // 投稿の新規追加もしくは編集画面以外では表示しない
  if (location.pathname != '/wp-admin/post-new.php' && location.pathname != '/wp-admin/post.php') {
    return;
  }

  // 投稿ガイドの表示
  initPostGuide();
});

function initPostGuide() {
  // 投稿タイプの取得
  let post_type;
  let post_id;

  let query_string = location.search.substring(1);
  if (query_string) {
    params = query_string.split('&');
    params.forEach(element => {
      let key_value = element.split('=');
      // 新規追加の場合はURLからpost_typeを取得
      if (key_value[0] == 'post_type') {
        post_type = key_value[1];
        console.log(post_type);
      }
      // 編集の場合はAJAXで問い合わせるためにpost_idを記録
      if (key_value[0] == 'post') {
        post_id = key_value[1];
        console.log(post_id);
      }
    });
  }

  // postの新規追加の場合は引数にpost_typeもpost_idもない
  if (!post_type && !post_id) {
    post_type = 'post';
  }

  // AJAXでpost_typeを問い合わせ 引数から分かる場合もコードを共通化するために問い合わせる 非同期になるので注意
  $.ajax({
    type: 'POST',
    url: ajaxurl,
    data: {
      'action': 'ajax_post_type_by_post_id',
      'post_id': post_id,
      'post_type': post_type
    },
    success: function (wp_post_type) {
      post_type = wp_post_type
      buildProgressGuide(post_type);

      // 毎秒チェックを開始
      var timer = setInterval(function () {
        console.log(post_type);
        if (post_type == undefined) {
          return;
        }

        let progress_items = getGuideItems(post_type);
        for (let key in progress_items) {
          progress(key, progress_items[key]);
        }
      }, 1000);
    }
  });
}

function progress(key, items) {
  // テキストインプット
  if (items['tag'] == 'input' && items['type'] && items['type'] == 'text') {
    if ($('input[name="' + key + '"]').val() != '') {
      gainProgress($('#' + key + '-progress'));
    } else {
      lostProgress($('#' + key + '-progress'));
    }
  }

  // 本文
  if (key == 'content') {
    // ビジュアルモードのiframeからテキストモードのテキストエリアに同期されるのが10秒おきっぽい そのため本文反映が少し遅れる
    if ($('textarea[name="content"]').val() != '' || $('#content_ifr').contents().find('body').text() != '') {
      gainProgress($('#content-progress'));
    } else {
      lostProgress($('#content-progress'));
    }
  }

  // タグ
  if ($('ul.tagchecklist li').length > 0) {
    gainProgress($('#tag-progress'));
  } else {
    lostProgress($('#tag-progress'));
  }

  // カテゴリー
  if ($('ul.categorychecklist :checked').length > 0) {
    gainProgress($('#category-progress'));
  } else {
    lostProgress($('#category-progress'));
  }

}

// ガイドバーの構築
function buildProgressGuide(post_type) {
  $('#screen-meta-links').before('<div><ul id="progress-panel" class="progress-panel"></ul></div>');
  $('#progress-panel').append('<li id="guide-header">入力ガイド</li>');

  // ガイドバーを表示する分、スペースを空ける
  $('h1.wp-heading-inline').css('padding-top', '60px');

  console.log(post_type);

  let progress_items = getGuideItems(post_type);

  for (let key in progress_items) {
    // ガイドバーの要素を追加
    let progress_name = key + '-progress'
    $('#progress-panel').append('<li id="' + progress_name + '" class="empty"><span class="item">' + progress_items[key]['label'] + '</span> <span id="' + key + '-help-button" class="help-button" > ? </span></li>');

    // ヘルプボタン クリックでモーダル表示
    $('#' + key + '-help-button').on('click', function(){
      openGuideModal();
    });
  }
}

function openGuideModal() {
  jQuery.ajax({
    type: 'POST',
    url: ajaxurl,
    data: {
        'action': 'ajax_guide_html'
    },
    success: function(html) {
      jQuery('body').append('<div id="modal-background" class="modal-background"></div>');
      jQuery('body').append('<div id="modal" class="modal"><div id="modal-container" class="modal-container">' + html + '</div></div>');
      jQuery('#modal').css('left', (window.innerWidth - 800) / 2);

      jQuery('#modal-container').append('<div id="modal-ok" class="modal-ok button">OK</div>');
      jQuery('#modal-background').on('click', function(){ 
        jQuery('#modal').remove(); jQuery('#modal-background').remove(); 
      });

      jQuery('#modal-ok').on('click', function(){ 
        jQuery('#modal').remove(); jQuery('#modal-background').remove(); 
      });
    }
  });
}

// 投稿タイプごとに入力ガイドに表示するアイテムを取得
function getGuideItems(post_type) {
  items = {
    'post': {
      'post_title': { label: 'タイトル', tag: 'input', type: 'text' },
      'content': { label: '本文', tag: 'textarea' },
      'tag': { label: 'タグ', tag: 'input' },
      'category': { label: 'カテゴリー', tag: 'input' },
    },
    'page': {
      'post_title': { label: 'タイトル', tag: 'input', type: 'text' },
      'content': { label: '本文', tag: 'textarea' },
      'menu_order': { label: '順序', tag: 'input', type: 'text' },
    },
  }
  return items[post_type];
}

// 入力があったとき
function gainProgress(selector) {
  selector.removeClass('empty');
  selector.css('animation', 'bgcolor_to_gain 1.2s');
  selector.addClass('done');
}

// 入力が空白の場合
function lostProgress(selector) {
  selector.addClass('empty');
  selector.removeClass('done');
  selector.css('animation', 'bgcolor_to_lost 1.2s');
}