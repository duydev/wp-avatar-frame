var canvas = document.getElementById('ImgCanvas');
var context = canvas.getContext('2d');
var downloadURL = undefined;
var framedir = 'img/frame/';
var frameName = framedir + '';
var downloadFileName = 'avatar.jpg';
var rotate = 0;

var clickEvent = new MouseEvent("click", {
    "view": window,
    "bubbles": true,
    "cancelable": false
});

function frameload() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  var imageObj = new Image();
  imageObj.onload = function() {
    context.drawImage(this, 0, 0, imageObj.width, imageObj.height);
  };
  imageObj.src = frameName;
}

function cropImg()
{
  var sImg = $('.cropImgWrapper img').attr('src');
  if(sImg === undefined)
  {
    alert('Vui lòng tải ảnh lên trước khi tải về.');
    return;
  }
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.save();
  switch(rotate)
  {
    case 0:
        context.translate(0,0);
      break;
    case 90:
    case -270:
        context.translate(canvas.width,0);
      break;
    case -90:
    case 270:
        context.translate(0,canvas.height);
      break;
    case 180:
    case -180:
        context.translate(canvas.width,canvas.height);
      break;
  }
  context.rotate( rotate *Math.PI/180);
  var imageObj = new Image();
  imageObj.onload = function() {
    var ratio = (imageObj.height/parseInt($('.cropImgWrapper img').css('height')));
    var sX = parseInt($('.cropImgWrapper img').css('left')) * -1 * ratio;
    var sY = parseInt($('.cropImgWrapper img').css('top')) * -1 * ratio;
    var sW = imageObj.width;
    var sH = imageObj.height;
    var dH = canvas.height * ratio;
    if(rotate == 0 || rotate == 180 || rotate == -180)
    {
      context.drawImage(this, sX, sY, dH, dH, 0, 0, canvas.width, canvas.height);
    }
    else
    {
      context.drawImage(this, sY, sX, dH, dH, 0, 0, canvas.width, canvas.height);
    }
    context.restore();
    var frameImg = new Image();
    frameImg.onload = function() {
      context.drawImage(this, 0, 0, 620, 620);
      downloadURL = canvas.toDataURL('image/jpeg', 0.92);
      saveImg(downloadURL, downloadFileName);
      frameload();
    };
    frameImg.src = frameName;
  };
  imageObj.src = sImg;
}

function saveImg(data, filename)
{
  var link = document.createElement('a');
    link.download = filename;
    link.href = data;
    if ($.browser.mozilla) {
      link.dispatchEvent(clickEvent);
    } else {
      link.click(); 
    }    
}

function loadFrameList()
{
  $('#frame').html('');
  $.getJSON("api/frame/?func=selectList", function(data) {
    $.each(data, function(i, item) {
      $('#frame').append('<option value="' + data[i].value + '">' + data[i].title + '</option>');
    })
    frameName = framedir + data[0].value;
    frameload();
  });
}

function changeFrame()
{
  frameName = framedir + $('#frame').val();
  frameload();
}
