<?php
	session_start();
	include('../inc/mainfile.php');

	if(!isset($_SESSION['login'])){
	  header("Location: login.php");
	}
?>
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="author" content="Trần Nhật Duy">

    <title>Trang Quản Lý</title>
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
    <nav class="navbar navbar-inverse">
    	<div class="container-fluid">
    	    <div class="navbar-header">
				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
					<span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>
    	        <a class="navbar-brand" href="#">TND</a>
	        </div>
	        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
	        	<ul class="nav navbar-nav">
	        	        <li class="active"><a href="index.php">Quản Lý Khung Ảnh <span class="sr-only">(current)</span></a></li>
	        	</ul>
	            <ul class="nav navbar-nav navbar-right">
	                <li class="dropdown">
	                  	<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Xin chào, <?php echo $_SESSION['userfullname']; ?> <span class="caret"></span></a>
	                  <ul class="dropdown-menu">
	                    <li><a href="#">Đổi Mật Khẩu</a></li>
	                    <li role="separator" class="divider"></li>
	                    <li><a role="button" onclick="logout()">Đăng Xuất</a></li>
	                  </ul>
	                </li>
	              </ul>
	            </div><!-- /.navbar-collapse -->
		</div><!-- /.container-fluid -->
    </nav>
    <div class="container">
    	<div class="row">
    		<div class="col-md-12">
    			<div class="message"></div>
    			<form> 
    			  <div class="form-group">
    			    <label for="title">Tiêu đề</label>
    			    <input type="text" class="form-control" id="title" name="title" placeholder="Nhập tiêu đề...">
    			  </div>  
    			  <div class="form-group">
    			    <label for="file">File ảnh</label>
    			    <input type="file" id="file" name="fileUpload">
    			    <p class="help-block">Kích thước file ảnh là 620x620(px). Kiểu file là PNG. Kích thước tối đa là 1MB. Đặt tên file không chứa khoảng cách.</p>
    			  </div>
    			  <button type="submit" class="btn btn-default" name="submit">Thêm</button>
    			</form>
    		</div>
    	</div>
    	<div class="row">
    		<div class="col-md-12 table-responsive">
    			<table class="table table-bordered">
    				<tr>
    					<th>Id</th>
    					<th>Tiêu đề</th>
    					<th>Hình ảnh</th>
    					<th>Xóa?</th>
    				</tr>
    			</table>
    		</div>
    	</div>
    	<div class="row">
        	<div class="col-md-12">
          		<h3 class="text-center">&copy 2016 - Xây dựng và phát triển bởi <a href="mailto:tui@duydev.me">Trần Nhật Duy</a>. Toàn quyền bảo lưu.</h3>
        	</div>
      	</div>
    </div>
    <script type="text/javascript" src="../js/jquery-2.2.3.min.js"></script>
    <script src="../js/bootstrap.min.js"></script>
    <script type="text/javascript">
        $(document).ready(function(){
            loadTable();

            $("form").submit(function(e){
              event.preventDefault();
              
              var formData = new FormData($(this)[0]);
              $.ajax({
                url: '../api/frame/?func=add',
                type: 'POST',
                data: formData,
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                  if(data.success)
                  {
                    $('.message').html('<div class="alert alert-success" role="alert">' + data.message + '</div>');
                    $('form input').val(''); // Clean Form
                    loadTable();                                        
                  } else {
                    $('.message').html('<div class="alert alert-danger" role="alert">' + data.message + '</div>');
                  }
                }
              }); 

              return false;
            });
        });

        function logout()
        {
            $.get('../api/user/?func=logout', function(data) {
                console.log("Đăng xuất thành công.");
                location.reload();
            });
        }

        function loadTable()
        {
            $('table tr').not(':first').remove();
            $.getJSON( "../api/frame/?func=framelist", function( data ) {
                $.each( data, function( idx, item ) {
                  $('table').append('<tr><td>' + data[idx].id + '</td><td>' + data[idx].title + '</td><td><img alt="' + data[idx].title + '" src="' + data[idx].url + '" /></td><td><a role="button" onclick="f_delete(' + data[idx].id + ')">Xóa</a></td></tr>');
                });
                if(data[0] === undefined)
                {
                    $('table').append('<tr><td colspan="4" class="text-center">Không có dữ liệu để hiển thị.</td></tr>');
                }
            });
        }

        function f_delete(id)
        {
            $.getJSON('../api/frame/?func=delete', {"id": id}, function(data) {
                $('.message').html('<div class="alert alert-success" role="alert">' + data.message + '</div>');
                loadTable();
            });
        }
    </script>
  </body>
</html>