<?php
  session_start();
  include('../../inc/mainfile.php');
  header('content-type: application/json; charset=utf-8');

  switch ($_GET['func']) {
    case 'selectList':
        getSelectList();
      break;
    case 'framelist':
        getFrameList();
      break;
    case 'delete':
        f_delete();
      break;
    case 'add':
        add();
      break;
    default:
        echo "Oop! Something went wrong.";
      break;
  }

  function getSelectList()
  {
    global $conn;
    $sql = "SELECT title, value FROM frames ORDER BY id DESC";
    $result = $conn->query($sql);    
    $rows = array();
    while($row = $result->fetch_assoc()) {
      $rows[] = $row;
    }
    echo json_encode($rows, true);
  }

  function getFrameList()
  {
    if(!isset($_SESSION['login']))
    {
      die("Oop! Access Denied.");
    }
    global $conn;
    $sql = "SELECT id, title, url FROM frames ORDER BY id DESC";
    $result = $conn->query($sql);    
    $rows = array();
    while($row = $result->fetch_assoc()) {
      $rows[] = $row;
    }
    echo json_encode($rows, true);
  }

  function f_delete()
  {
    if(!isset($_SESSION['login']))
    {
      die("Oop! Access Denied.");
    }
    global $conn;
    $sql = "SELECT url FROM frames WHERE id = ".$_GET['id'];
    $result = $conn->query($sql);
    if($result->num_rows > 0)
    {
      $row = $result->fetch_row();      
      unlink('../../'.$row[0]);
      $sql = "DELETE FROM frames WHERE id = ".$_GET['id'];
      $result = $conn->query($sql);
    }    
    echo json_encode(array('success'=>true, 'message'=>'Xóa thành công.'), true);
  }

  function add()
  {
    global $conn;
    $success = true;
    $message = '';

    $title = htmlentities($_POST['title']);

    $uploadDir = '../../img/frame/';
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
              $message = "Thêm thành công.";
          } else {
            $success = false;
              $message .= "Lỗi: " . $sql . "<br>" . $conn->error;
          }
      } else {
        $success = false;
          $message .= "Tập tin gặp lỗi trong quá trình tải.";
      }
    }

    echo json_encode(array('success'=>$success, 'message'=>$message),true);
  }

?>
