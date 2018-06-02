jQuery(document).ready(function(){
  $('#titlewrap').before('<div><ul id="progress-panel" class="progress-panel"></ul></div>');
  $('#progress-panel').append('<li id="guide-header">入力ガイド</li>');

  var progress_items = {
    'post_title': { label: 'タイトル', tag: 'input' },
    'content': { label: '本文', tag: 'textarea' },
    'newtag\[post_tag\]': { label: 'タグ', tag: 'input' },
    'post_category\[\]': { label: 'カテゴリー', tag: 'input' },
    
  }


  for (let key in progress_items) {
    let progress_name = key + '-progress'
    $('#progress-panel').append('<li id="' + progress_name + '" class=""><span class="item">' + progress_items[key]['label'] + '</span> <span class="help-button" > ? </span></li>');

    $(progress_items[key]['tag'] + '[name="' + key + '"]').on('change', function(){
      console.log($(this).val())
      console.log(key + '-progress')
      if ($(this).val() != '') {
        $('#' + progress_name).addClass('done');
      } else {
        console.log('removed')
        $('#' + progress_name).removeClass('done');
      }
    });
  }

  // 毎秒チェック
  var timer = setInterval(function(){
    // console.log($('textarea[name="content"]').val());
    console.log($('#content_ifr').contents().find('body').text());
    if ($('textarea[name="content"]').val() == '' || $('#content_ifr').contents().find('body').text() == '') {
        $('#content-progress').removeClass('done');
    } else {
        $('#content-progress').addClass('done');
    }

  }, 1000);

  
});