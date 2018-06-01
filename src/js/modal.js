function open_modal(nonce) {
  jQuery.ajax({
    type: 'POST',
    url: ajaxurl,
    data: {
        'action': 'ajax_modal',
        'secure': nonce
    },
    success: function(json) {
      modal_data = JSON.parse(json);

      jQuery('body').append('<div id="modal-background" class="modal-background"></div>');
      jQuery('body').append('<div id="modal" class="modal"><div id="modal-container" class="modal-container"></div></div>');
      jQuery('#modal').css('left', (window.innerWidth - 800) / 2);

      jQuery('#modal-container').append('<h3>モーダルじゃい</h3>');
      jQuery('#modal-container').append('<ul id="modal-list" class="modal-list"></ui>');
      modal_data.items.forEach(function(item, i, items) {
        jQuery('#modal-list').append('<li><input type="checkbox" name="selected_items[]" value="' + item.id + '"> ' + item.title + '</li>');
      });

      jQuery('#modal-container').append('<div id="modal-ok" class="modal-ok button">OK</div>');
      jQuery('#modal-ok').on('click', function(){ 
        // 何らかの処理
        jQuery('#modal').remove(); jQuery('#modal-background').remove(); 
      });

      jQuery('#modal-container').append('<div id="modal-cancel" class="modal-cancel button">Cancel</div>');
      jQuery('#modal-cancel').on('click', function(){ jQuery('#modal').remove(); jQuery('#modal-background').remove(); });

    }
  });
}