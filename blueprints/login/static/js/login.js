$(document).ready(function () {
  //ログイン
  $("#login").on("click", function (event) {
    data = {
      login_username: $("#username").val(),
      login_Password: $("#inputPassword").val(),
    };
    json = JSON.stringify(data);
    //②Ajax通信
    $.ajax({
      type: "POST",
      url: "/login/login",
      data: json,
      contentType: "application/json",
    }).done(function (response) {
      // リダイレクト先のURLを取得し、リダイレクト
      window.location.href = response.redirect_url;
    });
    event.preventDefault();
  });
  //新規登録
  $("#create-user").on("click", function (event) {
    data = {
      create_username: $("#username").val(),
      create_Password: $("#inputPassword").val(),
    };
    json = JSON.stringify(data);
    //②Ajax通信
    $.ajax({
      type: "POST",
      url: "/login/createuser",
      data: json,
      contentType: "application/json",
    }).done(function (response) {
      // リダイレクト先のURLを取得し、リダイレクト
      window.location.href = response.redirect_url;
    });
    event.preventDefault();
  });
});
