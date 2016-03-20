$(document).ready(crud);

function crud() {
  // initialize posts
  $.ajax({ // read
    method: 'GET',
    url: '/api/post'
  }).complete(function(data){
    const generatedDOMstring = data.responseJSON.map(function(val){
      return blogPostHtmlGen(val);
    }).join('');

    // add them to the DOM
    $('#blog-list').append(generatedDOMstring);

    // initialize handlers on added buttons
    $('.delete-post').click(deleteHandler);
    $('.update-post').click(updateHandler);
  });

  $('#add-post').click(function(){
    const updateId = $('.blog-add-post').data('id');
    var requestData = {
      title: $('#title').val(),
      body: $('#body').val()
    };

    // Adding authed properties if user is logged in
    if(window.user) requestData.email = window.user.email;
    if(window.user && window.user.google && window.user.google.photo) {
      requestData.photo = window.user.google.photo;
      requestData.google_link = window.user.google.link;
    }
    if(window.user && window.user.facebook && window.user.facebook.photo) {
      requestData.photo = window.user.facebook.photo;
      requestData.facebook_link = window.user.facebook.link;
    }

    if(!updateId) // create
      $.ajax({
        method: 'POST',
        url: '/api/post',
        data: requestData
      })
      .complete(function(data){
        $('.blog-post').first().prepend(blogPostHtmlGen(data.responseJSON));

        // reset form values
        $('#title').val('');
        $('#body').val('');

        // add handlers to newly added buttons
        $('.delete-post[data-id='+ data.responseJSON._id +']').click(deleteHandler);
        $('.update-post[data-id='+ data.responseJSON._id +']').click(updateHandler);
      });
    else // update
      $.ajax({
        method: 'PUT',
        url: '/api/post/' + updateId,
        data: {
          title: $('#title').val(),
          body: $('#body').val(),
          createdDate: new Date()
        }
      }).complete(function(data){
        $('#' + updateId).replaceWith(blogPostHtmlGen(data.responseJSON));

        // remove update Id from blog editor
        $('.blog-add-post').data('id', '');

        // reset form values
        $('#title').val('');
        $('#body').val('');
        $('#add-post').text('Add Post');

        // add handlers to newly added buttons
        $('.delete-post[data-id='+ updateId +']').click(deleteHandler);
        $('.update-post[data-id='+ updateId +']').click(updateHandler);
      });
  });
}

function deleteHandler() { // delete
  const id = $(this).data('id');
  $.ajax({
    method: 'DELETE',
    url: '/api/post/' + id
  }).complete(function(data){
    $('#' + id).remove();
  });
}

function updateHandler() {
  const id = $(this).data('id');
  const title = $($('#'+id+' .blog-title')).text();
  const body = $($('#'+id+' .blog-body')).text();

  $('.blog-add-post').data('id', id);
  $('#title').val(title);
  $('#body').val(body);
  $('#add-post').text('Update Post');
}

function blogPostHtmlGen(postObj){

  let genStr = '<li class="blog-post" id="' + postObj._id +'">';
  genStr += '<h3 class="blog-title">' + postObj.title + '</h3>';
  genStr += '<p class="blog-body">' + postObj.body + '</p>';
  genStr += '<p class="blog-created-date">Created on: ' + prettyDate(postObj.createdDate) + '</p>';
  if(postObj.photo) genStr += '<img class="author-photo" src="' + postObj.photo + '">';
  if(postObj.email) genStr += '<span class="author-email">' + postObj.email + '</span>';
  if(postObj.google_link) genStr += '<a href="' + postObj.google_link + '" class="author-google"><i class="fa fa-google o-auth-btn"></i></a>';
  if(postObj.facebook_link) genStr += '<a href="' + postObj.facebook_link +'" class="author-facebook"><i class="fa fa-facebook o-auth-btn"></i></a>';
  genStr += '<button class="delete-post" data-id="' + postObj._id + '">Delete Post</button>';
  genStr += '<button class="update-post" data-id="' + postObj._id + '">Update Post</button>';
  genStr += '</li>';

  return genStr;
}

function prettyDate(input){
  var tempDate = new Date(input);
  return tempDate.getMonth()+1 + '/' + tempDate.getDate() + '/' + tempDate.getFullYear().toString().slice(2);
}
