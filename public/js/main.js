
$(document).ready(function() {
  $('.homepage').click(loadFeedbackForm);
  loadFeedbackForm();
})

function loadFeedbackForm() {

    var html = "<form action=/main/feedback method=post class='was-validated' id='commentForm'>" +
    "<div class=form-group>" +
    "<label for='comment'></label>" +
    "<textarea class='form-control' rows='5' id='comment' placeholder='Ưu điểm, khuyết điểm, hàm hồ, sai sót, không hiểu, nghi hoặc...'></textarea>" +
    "<div id=invalid-comment class='text-danger'></div>" +
    "</div>" +
    "</form>" +
    "<input type='button' value='GỬI' class='btn btn-primary btn-block' onclick='submitFeedback()'/>"

  document.getElementById('main-content').innerHTML = html;
  
}

function submitFeedback() {
  var url = '/feedback';

  var comment = document.getElementById('comment').value;

  var params = 'comment=' + comment;

  var isValid = true;

  if (comment == "") {
    document.getElementById('invalid-comment').innerHTML = 'Nội dung cần phải điền ở trên.';
    isValid = false;
  } 

  if (isValid) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
      if (xhr.status == 201) {
        document.getElementById('main-content').innerHTML = '<h7>A di đà phật, cảm ơn quý vị đã đóng góp ý kiến.</h7>';
      }
    };
    xhr.send(params)
  }
}
