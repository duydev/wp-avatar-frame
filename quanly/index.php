<?php
	session_start();
	include('db.php');

	if(!isset($_SESSION['login'])){
	  header("Location: login.php");
	}

	$message = '';

	if(isset($_POST['submit'])){
		$success = true;
		$uploadDir = '../img/frame/';
		$uploadFile = $uploadDir.basename($_FILES["fileUpload"]["name"]);
		$imageFileType = pathinfo($uploadFile,PATHINFO_EXTENSION);
		$check = getimagesize($_FILES["fileUpload"]["tmp_name"]);
		if($check === false) {
			$success = false;
			$message .= "File ảnh không hợp lệ. Vui lòng chọn ảnh khác.\n";
		}
		if (file_exists($uploadFile)) {
		    $success = false;
			$message .= "File này đã tồn tại. Vui lòng đổi tên khác.\n";
		}
		if ($_FILES["fileUpload"]["size"] > 1000000) { // 1MB
			$success = false;
		    $message .= "File ảnh có kích thước vượt mức cho phép. Vui lòng chọn ảnh khác.\n";
		}
		if($imageFileType != "png" && $imageFileType != "PNG") {
		    $success = false;
			$message .= "File ảnh có kiểu không hợp lệ. Vui lòng chọn ảnh PNG khác.\n";
		}
		if (!$success) {
		    $message .= "Tập tin chưa được tải lên.";
		} else {
			if (move_uploaded_file($_FILES["fileUpload"]["tmp_name"], $uploadFile)) {
			    //$message .= "Tập tin ".basename( $_FILES["fileUpload"]["name"])." được tải lên thành công.";
			    $title = htmlentities($_POST['title']);
			    $value = basename( $_FILES["fileUpload"]["name"]);
			    $url = '/img/frame/'.$value;
			    $created_at = time();
			    $sql = "INSERT INTO frames(title, url, value, created_at) VALUES ('".$title."', '".$url."', '".$value."', ".$created_at.")";
			    if ($conn->query($sql) === TRUE) {
			        $message .= "Thêm thành công.";
			    } else {
			    	$success = false;
			        $message .= "Lỗi: " . $sql . "<br>" . $conn->error;
			    }
			} else {
				$success = false;
			    $message .= "Tập tin gặp lỗi trong quá trình tải.";
			}
		}
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
	                  	<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Xin chào, <?php echo $_SESSION['uname']; ?> <span class="caret"></span></a>
	                  <ul class="dropdown-menu">
	                    <li><a href="#">Đổi Mật Khẩu</a></li>
	                    <li role="separator" class="divider"></li>
	                    <li><a href="logout.php">Đăng Xuất</a></li>
	                  </ul>
	                </li>
	              </ul>
	            </div><!-- /.navbar-collapse -->
		</div><!-- /.container-fluid -->
    </nav>
    <div class="container">
    	<div class="row">
    		<div class="col-md-12">
    			<div class="message">
    				<?php
    					if(isset($success)) {
    						if($success) {
    							echo '<div class="alert alert-success" role="alert">'.$message.'</div>';
    						} else {
    							echo '<div class="alert alert-danger" role="alert">'.$message.'</div>';
    						}
    					}
    				?>
    			</div>
    			<form action="index.php" method="POST" enctype="multipart/form-data"> 
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
    				<?php 
    					$sql = "SELECT id, title, url FROM frames";
    					$result = $conn->query($sql);
    					if ($result->num_rows > 0) {
    						while($row = $result->fetch_assoc()) {
    				?>
    				<tr>
    					<td><?php echo $row['id']; ?></td>
    					<td><?php echo $row['title']; ?></td>
    					<td><img alt="<?php echo $row['title']; ?>" src="<?php echo $row['url']; ?>" \></td>
    					<td><a href="delete.php?id=<?php echo $row['id']; ?>">Xóa</a></td>
    				</tr>
					<?php
							}
						} else {
					?>
						<tr><td colspan="4">Không có dữ liệu nào để hiển thị.</td></tr>
					<?php
						}
					?>
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
  </body>
</html>