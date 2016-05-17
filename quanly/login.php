<?php
  session_start();
  include('db.php');
  
  if(isset($_SESSION['login'])){
    header("Location: index.php");
  }

  if(isset($_POST['submit'])){
    $usr = htmlentities($_POST['username']);
    $pwd = md5(htmlentities($_POST['password']));
    
    $sql = "SELECT id, username FROM users WHERE username = '$usr' AND password = '$pwd'";
    $result = $conn->query($sql);
  
    if ($result->num_rows > 0) {
      $row = $result->fetch_row();
      $_SESSION['login'] = 1;
      $_SESSION['uid'] = $row[0];
      $_SESSION['uname'] = $row[1];
      header("Location: index.php");
    }

    $error = true;
    $message = "Đăng nhập thất bại. Vui lòng thử lại.";
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
          <div class="message">
            <?php
              if($error):
            ?>
              <div class="alert alert-danger" role="alert"><?php echo $message; ?></div>
            <?php
              endif;
            ?>
          </div>
          <form id="myForm" method="POST" action="login.php">
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
  </body>
</html>