jQuery(document).ready(function () {
  // 投稿の新規追加もしくは編集画面以外では表示しない
  if (location.pathname != '/wp-admin/post-new.php' && location.pathname != '/wp-admin/post.php') {
    return;
  }

  // 投稿ガイドの表示
  initPostGuide();
});

// ガイドの初期化と構築
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
      buildPostGuide(post_type);

      // 毎秒チェックを開始
      var timer = setInterval(function () {
        console.log(post_type);
        if (post_type == undefined) {
          return;
        }

        let guide_items = getGuideItems(post_type);
        let publish_disabled = false;
        for (let key in guide_items) {
          watchProgress(key, guide_items[key]);
          if (guide_items[key]['required'] && !($('#' + key + '-guide').hasClass('done'))) {
            publish_disabled = true;
          }
        }

        // doneになってないrequiredの項目がひとつでもあれば公開ボタンをdisabledに そうでなければdisabledは解除される
        $('#publish').prop('disabled', publish_disabled);
      }, 1000);
    }
  });
}

// 入力状態の監視と、状態に応じたガイドの表示の変更
function watchProgress(key, items) {
  // テキストインプットの場合
  if (items['tag'] == 'input' && items['type'] && items['type'] == 'text') {
    if ($('input[name="' + key + '"]').val() != '') {
      gainProgress($('#' + key + '-guide'));
    } else {
      lostProgress($('#' + key + '-guide'));
    }
  }

  // 本文の場合
  if (key == 'content') {
    // ビジュアルモードのiframeからテキストモードのテキストエリアに同期されるのが10秒おきっぽい そのため本文反映が少し遅れる
    if ($('textarea[name="content"]').val() != '' || $('#content_ifr').contents().find('body').text() != '') {
      gainProgress($('#content-guide'));
    } else {
      lostProgress($('#content-guide'));
    }
  }

  // タグの場合
  if ($('ul.tagchecklist li').length > 0) {
    gainProgress($('#tag-guide'));
  } else {
    lostProgress($('#tag-guide'));
  }

  // カテゴリーの場合
  if ($('ul.categorychecklist :checked').length > 0) {
    gainProgress($('#category-guide'));
  } else {
    lostProgress($('#category-guide'));
  }

}

// ガイドの構築
function buildPostGuide(post_type) {
  console.log('build');
  $('#screen-meta-links').before('<div><ul id="post-guide-panel" class="post-guide-panel"></ul></div>');
  $('#post-guide-panel').append('<li id="guide-header">投稿ガイド</li>');

  // ガイドバーを表示する分、スペースを空ける
  $('h1.wp-heading-inline').css('padding-top', '60px');

  console.log(post_type);

  let guide_items = getGuideItems(post_type);

  for (let key in guide_items) {
    // ガイドバーの要素を追加
    let guide_name = key + '-guide'
    let label;
    if (guide_items[key]['required']) {
      // 必須項目の場合はルビで表示
      label = '<ruby>' + guide_items[key]['label'] + '<rt>required</rt></ruby>';
    } else {
      label = guide_items[key]['label'];
    }
    $('#post-guide-panel').append('<li id="' + guide_name + '" class="empty"><span class="item">' + label + '</span> <span id="' + key + '-help-button" class="help-button" > ? </span></li>');

    // ヘルプボタン クリックでモーダル表示
    $('#' + key + '-help-button').on('click', function(){
      openGuideHelpModal(key);
    });
  }
}

// ヘルプをAJAXで読み込みモーダルで表示
function openGuideHelpModal(item_key) {
  $.ajax({
    type: 'POST',
    url: ajaxurl,
    data: {
        'action': 'ajax_guide_html',
        'item_key': item_key
    },
    success: function(html) {
      $('body').append('<div id="modal-background" class="modal-background"></div>');
      $('body').append('<div id="modal" class="modal"><div id="modal-container" class="modal-container">' + html + '</div></div>');
      $('#modal').css('left', (window.innerWidth - 800) / 2);

      $('#modal-container').append('<div id="modal-close" class="modal-close">×</div>');
      $('#modal-background').on('click', function(){ 
        $('#modal').remove(); $('#modal-background').remove(); 
      });

      $('#modal-close').on('click', function(){ 
        $('#modal').remove(); $('#modal-background').remove(); 
      });
    }
  });
}

// 投稿タイプごとに入力ガイドに表示するアイテムを取得
function getGuideItems(post_type) {
  items = {
    'post': {
      'post_title': { label: 'タイトル', tag: 'input', type: 'text', required: true },
      'content': { label: '本文', tag: 'textarea', required: true },
      'tag': { label: 'タグ', tag: 'input' },
      'category': { label: 'カテゴリー', tag: 'input', required: true },
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