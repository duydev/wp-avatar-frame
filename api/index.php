<?php
  include('../quanly/db.php');
  header('content-type: application/json; charset=utf-8');

  $sql = "SELECT title, value FROM frames ORDER BY id DESC";
  $result = $conn->query($sql);

  $rows = array();

  while($row = $result->fetch_assoc()) {
    $rows[] = $row;
  }

  

  // $frames = array(
  //             array(
  //               'title' => 'Mùa Hè Xanh 2016',
  //               'value' => 'mhx2016',
  //             ),
  //             array(
  //               'title' => 'Chào Mừng 21 Năm Thành Lập HUTECH',
  //               'value' => '21namhutech',
  //             ),
  //             array(
  //               'title' => 'Chào Mừng 85 Thành Lập Đoàn TNCS Hồ Chí Minh',
  //               'value' => 'avatar85hutech',
  //             ),
  //           );

  echo json_encode($rows, true);
?>
