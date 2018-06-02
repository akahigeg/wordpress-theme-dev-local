jQuery(document).ready(function(){
  $('#titlewrap').before('<div><ul id="progress-panel" class="progress-panel"></ul></div>');
  $('#progress-panel').append('<li id="guide-header">入力ガイド</li>');

  var progress_items = {
    'post_title': { label: 'タイトル', tag: 'input' },
    'content': { label: '本文', tag: 'textarea' },
    'tag': { label: 'タグ', tag: 'input' },
    'post_category\[\]': { label: 'カテゴリー', tag: 'input' },
    
  }


  for (let key in progress_items) {
    let progress_name = key + '-progress'
    $('#progress-panel').append('<li id="' + progress_name + '" class=""><span class="item">' + progress_items[key]['label'] + '</span> <span class="help-button" > ? </span></li>');
  }
  // tagchecklist

  // 毎秒チェック
  var timer = setInterval(function(){
    // タイトル
    console.log($('input[name="post_title"]').val());
    if ($('input[name="post_title"]').val() != '') {
        $('#post_title-progress').addClass('done');
    } else {
        $('#post_title-progress').removeClass('done');
    }

    // 本文
    console.log($('#content_ifr').contents().find('body').text());
    // ビジュアルモードのiframeからテキストモードのテキストエリアに同期されるのが10秒おきっぽい そのため本文反映が少し遅れる
    if ($('textarea[name="content"]').val() != '' || $('#content_ifr').contents().find('body').text() != '') {
        $('#content-progress').addClass('done');
    } else {
        $('#content-progress').removeClass('done');
    }

    // タグ
    console.log($('ul.tagchecklist li').length);
    if ($('ul.tagchecklist li').length > 0) {
        $('#tag-progress').addClass('done');
    } else {
        $('#tag-progress').removeClass('done');
    }

  }, 1000);

  
});