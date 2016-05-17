<?php
header('content-type: application/json; charset=utf-8');

$frames = array(
            array(
              'title' => 'Mùa Hè Xanh 2016',
              'value' => 'mhx2016',
            ),
          );

echo json_encode($frames, true);
?>
