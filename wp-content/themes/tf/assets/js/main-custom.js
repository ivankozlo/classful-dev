let selected_post_type = 'home'
let tags = []

jQuery(document).ready(function($){

  let update_tags = () => {
    let template = ''
    if(tags.length != 0 && tags.length <= 10){
      tags.forEach(tag => {
        template += `
          <div class="tag" data-name="${tag}">
            <span class="tag-name">${tag}</span>
            <button type="button" name="button" class="remove-tag"><i class="fas fa-times"></i></button>
          </div>
        `
      })
    }
    document.querySelector('.tags').innerHTML = template
    document.querySelector('.tags-count').innerHTML = 10 - tags.length
    if(tags.length == 10){
      document.querySelector('.tags-left').classList.add('text-danger')
    }else{
      document.querySelector('.tags-left').classList.remove('text-danger')
    }
    document.querySelectorAll('.remove-tag').forEach(t => {
      t.addEventListener('click', function(){
        let tag = this.parentElement.getAttribute('data-name')
        tags = [...tags.filter(item => item != tag)]
        update_tags()
      })
    })
  }


  $('#add_post').on('click', function(){
    $('#post_create').show('slow');
  });
  $('#post_to').on('click', function(){
    var feature = $("#features option:selected").val();
    var title = $("#title").val();
    var url = $("#url").val();
    var tags = $("#tags").val();
    if (title.length === 0) {
      $('#title').addClass('warning');
    }else{
    var data = {
      //var pid = $('.console-pid').val();
        'action': 'create_feed',
        'feature': feature,
        'title': title,
        'url':url,
        'tags':tags

    };
    jQuery.post(ajax_object.ajax_url, data, function(response) {
      alert('Post Added Successfully');
      location.reload(true);
    });
  }
  });
  $('ul.mylist').each(function(){
    x=5;
   // var li_elem = $(this).find('li')
    $(this).find('li:lt('+x+')').show();
    $(this).next('.button-load').find('.loadMore').click(function (e) {
      e.preventDefault();
      var size_li = $(this).parent().prev('.mylist').find("li").size();
      //alert(size_li);
      x= (x+3 <= size_li) ? x+3 : size_li;
      $(this).parent().prev('.mylist').find('li:lt('+x+')').show();
      if(x == size_li){
        $(this).hide();
      }
    });
  });

  $('.post-type-item').click(function(){
    selected_post_type = $(this).text().trim().toLowerCase()
    $('.post-type-item').removeClass('active')
    $(this).addClass('active')
  })

  $('input[name="tag-name"]').keyup(function(e){
    if(e.keyCode == 13 && $(this).val() && tags.length < 10){
      let tag = $(this).val().trim().replace(/\s/g, '')
      if(!tags.includes(tag)){
        tags.push(tag)
      }
      $(this).val('')
      update_tags()
    }
  })
  $('.add-tag').click(function(){
    if($('input[name="tag-name"]').val() && tags.length < 10){
      let tag = $('input[name="tag-name"]').val().trim().replace(/\s/g, '')
      if(!tags.includes(tag)){
        tags.push(tag)
      }
      $('input[name="tag-name"]').val('')
      update_tags()
    }
  })
  $('.showmore').click(function(){
    if($('.post-tags').hasClass('showall')){
      $('.post-tags').removeClass('showall')
      $(this).text('View more')
    }else{
      $('.post-tags').addClass('showall')
      $(this).text('View less')
    }
  })
});
