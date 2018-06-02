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
    $('#progress-panel').append('<li id="' + progress_name + '" class=""><span class="item">' + progress_items[key]['label'] + '</span> <span id="' + key + '-help-button" class="help-button" > ? </span></li>');

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
    // タイトル
    if ($('input[name="post_title"]').val() != '') {
        $('#post_title-progress').addClass('done');
    } else {
        $('#post_title-progress').removeClass('done');
    }

    // 本文
    // ビジュアルモードのiframeからテキストモードのテキストエリアに同期されるのが10秒おきっぽい そのため本文反映が少し遅れる
    if ($('textarea[name="content"]').val() != '' || $('#content_ifr').contents().find('body').text() != '') {
        $('#content-progress').addClass('done');
    } else {
        $('#content-progress').removeClass('done');
    }

    // タグ
    if ($('ul.tagchecklist li').length > 0) {
        $('#tag-progress').addClass('done');
    } else {
        $('#tag-progress').removeClass('done');
    }

    // カテゴリー
    if ($('ul.categorychecklist :checked').length > 0) {
        $('#category-progress').addClass('done');
    } else {
        $('#category-progress').removeClass('done');
    }

  }, 1000);

  
});