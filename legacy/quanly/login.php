<?php
  session_start();
  if(isset($_SESSION['login'])){
    header("Location: index.php");
  }
?>

<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="author" content="Trần Nhật Duy">

    <title>Đăng Nhập</title>
    <link rel="shortcut icon" type="image/ico" href="../img/favicon.ico" />
    <!-- Bootstrap -->
    <link href="../css/bootstrap.min.css" rel="stylesheet">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>
  <body>
    <div class="container">
      <div class="row">
        <div class="col-md-offset-4 col-md-4">
          <h1 class="text-center text-uppercase">Đăng Nhập</h1>
          <div class="message"></div>
          <form>
            <div class="form-group">
              <label for="username">Tên đăng nhập</label>
              <input type="text" class="form-control" id="username" name="username" placeholder="Nhập tên đăng nhập...">
            </div>
            <div class="form-group">
              <label for="password">Mật khẩu</label>
              <input type="password" class="form-control" id="password" name="password" placeholder="Nhập mật khẩu...">
            </div>
            <button type="submit" id="loginBtn" name="submit" class="btn btn-default">Đăng Nhập</button>
          </form>
        </div>
      </div>
    </div>
    <script type="text/javascript" src="../js/jquery-2.2.3.min.js"></script>
    <script src="../js/bootstrap.min.js"></script>
    <script type="text/javascript">
      $('form').submit(function(e) {
        e.preventDefault();
        $.post('http://avatar.ithu.tech/api/user/?func=login', {username: $('#username').val(), password: $('#password').val()}, function(data, textStatus, xhr) {
            if(data.success)
            {
              console.log('Đăng nhập thành công.');
              location.reload();
            } else {
              $('.message').html('<div class="alert alert-danger" role="alert">'+data.message+'</div>');
            }
        }).fail(function() {
          console.log('Đăng nhập gặp lỗi.');
        });
        return;
      });
    </script>
  </body>
</html>