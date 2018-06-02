jQuery(document).ready(function(){
  $('#titlewrap').before('<div><ul id="progress-panel" class="progress-panel"></ul></div>');
  $('#progress-panel').append('<li id="guide-header">入力ガイド</li>');

  var progress_items = {
    'post_title': { label: 'タイトル', tag: 'input' },
    'content': { label: '本文', tag: 'textarea' },
    'tag': { label: 'タグ', tag: 'input' },
    'category': { label: 'カテゴリー', tag: 'input' },
  }

  for (let key in progress_items) {
    // プログレスバーの要素を追加
    let progress_name = key + '-progress'
    $('#progress-panel').append('<li id="' + progress_name + '" class="empty"><span class="item">' + progress_items[key]['label'] + '</span> <span id="' + key + '-help-button" class="help-button" > ? </span></li>');

    // ヘルプボタン
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


  // 毎秒チェック
  var timer = setInterval(function(){
    let next;
    // タイトル
    if ($('input[name="post_title"]').val() != '') {
      get_progress($('#post_title-progress'));
    } else {
      lost_progress($('#post_title-progress'));
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

    $('#progress-panel li span.item').css('animation', '');
    // $('#progress-panel li[class="empty"]:first span.item').css('animation', 'arrow 1.2s infinite');

  }, 1000);
});

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