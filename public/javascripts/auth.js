$(document).ready(auth);

function auth(){
  // check if user is authed upon initialization
  $.ajax({
    method: 'GET',
    url: '/auth/session'
  }).complete(handleSuccessfulAuth);

  $('#local-auth').click(function(){
    $.ajax({
      method: 'POST',
      url: '/auth/login',
      data: {
        email: $('#email').val() || window.user.email,
        password: $('#password').val()
      }
    }).complete(handleSuccessfulAuth);
  });

  $('#logout').click(function(){
    $.ajax({
      method: 'GET',
      url: '/auth/logout'
    }).complete(handleSuccessfulLogOut);
  });
}

function handleSuccessfulAuth(res){
  const user = res.responseJSON;
  console.log(user);


  if(user && user.email && !$('#email').hasClass('hide')){
    $('#email').addClass('hide');
    $('#logout').addClass('show');
  }

  if(user && user.hasPassword && !$('#password').hasClass('hide')){
    $('#password').addClass('hide');
    $('#local-auth').addClass('hide');
  }

  if(user && user.google && user.google.photo && !$('#google-auth').hasClass('hide')) {
    $('#google-photo').attr('style', 'background-image: url("'+ user.google.photo +'");').addClass('show');
    $('#google-auth').addClass('hide');
  }

  if(user && user.facebook && user.facebook.photo && !$('#facebook-auth').hasClass('hide')) {
    $('#facebook-photo').attr('style', 'background-image: url("'+ user.facebook.photo +'");').addClass('show');
    $('#facebook-auth').addClass('hide');
  }

  if(user && user.email && user.hasPassword && user.google && user.google.photo && user.facebook && user.facebook.photo && !$('#login-section').hasClass('hide'))
    $('#login-section').addClass('hide');

  window.user = user;
}

function handleSuccessfulLogOut(res) {
  $('#email').removeClass('hide');
  $('#password').removeClass('hide');
  $('#local-auth').removeClass('hide');
  $('#google-auth').removeClass('hide');
  $('#facebook-auth').removeClass('hide');
  $('#login-section').removeClass('hide');
  $('#logout').removeClass('show');
  $('#google-photo').attr('style', 'background-image: url("");').removeClass('show');
  $('#facebook-photo').attr('style', 'background-image: url("");').removeClass('show');
}
