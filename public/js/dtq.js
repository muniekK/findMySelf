/**
 * ES6 : LET is incompatible on ios 9 safari, so have to use var
 * Don't be suprise if this project contents differents method to do one similair principes(ajax with jquery and xhr)
 *  1. I wan to test 
 *  2. I don't realise it
 */
var facebookStream = 1;
var youtubeStream = 2;
$(document).ready(function() {

  loadTheory();

  // jquery event-delegation
  // use for embeded video of facebook/youtube into the modal
  $(document).on('click', '.videoLink', function() {
    displayVideo($(this).attr('data-link'));
  })

  // Stop playing video in iframe when modal is closed
  $("#myModal").on('hidden.bs.modal', function(e) {
    $("#myModal iframe").attr("src", $("#myModal iframe").attr("src"));
  });

  $('.homepage').click(loadTheory);

  $('#my-surveys').click(function() {
    displaySurveys('my-surveys');
  });
  $('#group-surveys').click(function() {
    displaySurveys('group-surveys');
  });

  /**
   * videos 
   */
  $('#dtq40').click(function() {
    loadVideos('dtq40')
  });

  $('#dtq60').click(function() {
    loadVideos('dtq60')
  });

  $('#dtq120').click(function() {
    loadVideos('dtq120')
  });

  $('#nlntt').click(function() {
    loadVideos('nlntt')
  });

  $('#thpt').click(function() {
    loadVideos('thpt')
  });

  $('#register').click(function() {
    loadRegisterForm();
  });

  $('#login').click(function() {
    loadLoginForm();
  });

  // = temp: update progress when user logged
	if(document.getElementById("my-surveys")){
    updateTodaySurveyProgress()
  }

  // setColor for surveys result, for more easy to see the result: setColor each time the table data changed
  $("body").on('DOMSubtreeModified', ".survey", function() {
    setColors();
  })
})

/*************************************************************************************************************
 *
 * 	Display Surveys ( My/Group )
 *
 **************************************************************************************************************/
function displaySurveys(surveyType) {
  document.getElementById('main-content').innerHTML = "<div id='hieuDiv'></div><div id='deDiv'></div><div id='canDiv'></div><div id='tinDiv'></div><div id='tubiDiv'></div><div id='thannhanDiv'></div><div id='hocvanDiv'></div>";
  async.parallel([
      function(callback) {
        loadSurvey(surveyType, 'hieu');
        callback(null, 'hieu: success');
      },
      function(callback) {
        loadSurvey(surveyType, 'de');
        callback(null, 'de: success');
      },
      function(callback) {
        loadSurvey(surveyType, 'can');
        callback(null, 'can: success');
      },
      function(callback) {
        loadSurvey(surveyType, 'tin');
        callback(null, 'tin: success');
      },
      function(callback) {
        loadSurvey(surveyType, 'tubi');
        callback(null, 'tubi: success');
      },
      function(callback) {
        loadSurvey(surveyType, 'thannhan');
        callback(null, 'thannhan: success');
      },
      function(callback) {
        loadSurvey(surveyType, 'hocvan');
        callback(null, 'hocvan: success');
      },
    ]),
    function(err, res) {
      console.log(err + ':' + res)
    }
}
/** surveyType: group-survey or my-survey */
function loadSurvey(surveyType, chapter) {

  var tableID = chapter + 'table'
  var txt = "<h3><a href=javascript:void(0)>" + getChapterTitle(chapter) + " </a></h3>" +
    "<table id=" + tableID + " class=survey><thead><tr><th>Date</th><th>Name</th>"

  for (i = 1; i < getNbCols(chapter) + 1; i++) { // nbCols + 2 for date and user
    txt += "<th class='no-sort'><a href=javascript:void(0)>";
    txt += (i < 10) ? ("0" + i + "</th>") : (i + "</a></th>"); // add 0 in front if Question is less than 2 number
  }

  txt += "<th class='hide'>notes</th></thead></tr><tbody>";
  document.getElementById(chapter + 'Div').innerHTML = txt;

  /** IMPORTANT: jQuery way */
  /** IMPORTANT:  
   * https://stackoverflow.com/questions/45136218/datatables-scrollx-causing-squashed-header?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
   * "sScrollX": "100%", "sScrollXInner": "100%", "bScrollCollapse": true, "fixedColumns": { "leftColumns": 1 }
   * ScrollX and fixedHeader aren't compatible. Need the codes to enable X scrolling, with the header responsive with the data content
   **/
  $('#' + tableID).DataTable({
    "sScrollX": "100%",
    "sScrollXInner": "100%",
    "bScrollCollapse": true,
    "bFilter":false,
    "fixedColumns": {
      "leftColumns": 1
    },
    "columns": getTableBody(chapter),
    "order": [
      ["0", "desc"]
    ], // date is on col 0 
    "columnDefs": [{
      "targets": ['hide'],
      "visible": false,
    },
    {'bSortable': false, 'aTargets': ['no-sort'] }
  ],
    serverSide: true,
    ajax: {
      url: '/dtq/' + surveyType + '/' + chapter,
      type: 'POST',
      error: function(err) {
        if (err.status) {
          loadLoginForm();
        }
      }
    },

  })
}
/**
 * src: https://github.com/vinicius0026/datatables-query
 *	req.body should be equivalent to:
 *	
 * "columns": [
 *		{
 *				"data": "name", // field name in the MongoDB Schema
 *				"searchable": "true", // mandatory
 *				"orderable": "true" // mandatory
 *		},
 *		{ // .. same structure as above for each field    }
 */
function getTableBody(chapter) {
  var txt;
  var obj = [{
      "data": "date",
      "searchable": "true",
      //"orderable": "true",
      "render": function(data, type, row, meta) {
        var value = "<a href=javascript:void(0) data-link = '" + row.notes + "' ";
        value += (row.notes !== "") ? " class= has-note " : ""
        value += "onclick=loadChild(this); return false; > " + data.substring(0, 10) + "</a>"
        return value // display notes on child when click on date
      }
    },
    {
      "data": "user",
      "searchable": "true",
     // "orderable": "true"
    }
  ];

  for (var i = 1; i < getNbCols(chapter) + 1; i++) { // nbCols + 1 because we started at i = 1
    txt = (i < 10) ? 'Q0' : 'Q';
    obj.push({
      data: txt + i,
      "searchable": "true",
     // "orderable": "true"
    })
  }

  //=temp: without this, notes are note available in render.row
  obj.push({
    "data": "notes",
    "searchable": "true",
    //"orderable": "true",
    "render": function(data, type, row, meta) {
      return "<td class=hide>" + data + "</td>"
    }
  })

  return obj;
}

function getNbCols(chapter) {
  return {
    'hieu': 24,
    'de': 13,
    'can': 24,
    'tin': 15,
    'tubi': 21,
    'thannhan': 4,
    'hocvan': 13
  }[chapter]
}
/*************************************************************************************************************
 *
 * 	USER Register and Login
 *
 **************************************************************************************************************/
function loadRegisterForm() {
  var html = "<form action=/users/register method=post class='was-validated' id='registerForm'>" +
    "<div class=form-group>" +
    "<label for='name'>Name:</label>" +
    "<input name='name' type='text' class='form-control' id='name'/>" +
    "</div>" +
    "<div class=form-group>" +
    "<label for='email'>Email:</label>" +
    "<input name='email' type='text' class='form-control' id='email'/>" +
    "<div id=invalid-email class='text-danger'></div>" +
    "</div>" +
    "<div class=form-group>" +
    "<label for='username'>Username:</label>" +
    "<input name='username' type='text' class='form-control' id='username'/>" +
    "<div id=invalid-username class='text-danger'></div>" +
    "</div>" +
    "<div class=form-group>" +
    "<label for='password'>Password:</label>" +
    "<input name='password' type='password' class='form-control' id='password'/>" +
    "<div id=invalid-password class='text-danger'></div>" +
    "</div>" +
    "<div class=form-group>" +
    "<label for='password2'>Confirm Password:</label>" +
    "<input name='password2' type='password' class='form-control' id='password2'/>" +
    "<div id=invalid-password2 class='text-danger'></div>"

    +
    "</div><br/>" +
    "</form>" +
    "<input type='button' value='Submit' class='btn btn-primary' onclick='submitRegister()'/>"

  document.getElementById('main-content').innerHTML = html;
}

//https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Sending_forms_through_JavaScript
function submitRegister() {
  var url = '/users/register',
    name = document.getElementById('name').value,
    email = document.getElementById('email').value,
    username = document.getElementById('username').value,
    password = document.getElementById('password').value,
    password2 = document.getElementById('password2').value

  var params = `name=${name}&email=${email}&username=${username}&password=${password}&password2=${password2}`;

  var isValid = true;

  // Basic client-side first validation
  if (email == "" || isValidEmail(email)) {
    document.getElementById('invalid-email').innerHTML = ''
  } else {
    document.getElementById('invalid-email').innerHTML = "email is invalid";
    isValid = false;
  }

  if (username == "") {
    document.getElementById('invalid-username').innerHTML = 'this field is required';
    isValid = false;
  } else {
    document.getElementById('invalid-username').innerHTML = '';
  }

  if (password == "") {
    document.getElementById('invalid-password').innerHTML = 'this field is required';
    isValid = false;
  } else {
    document.getElementById('invalid-password').innerHTML = '';
  }

  if (password2 !== password) {
    document.getElementById('invalid-password2').innerHTML = "password doesn't match";
    isValid = false;
  } else {
    document.getElementById('invalid-password2').innerHTML = '';
  }

  if (isValid) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4)
        if (xhr.status == 409) {
          document.getElementById('invalid-username').innerHTML = 'username already existed'
        }
      else if (xhr.status == 201) {
        loadLoginForm();
      }
    };
    xhr.send(params)
  }
}

function loadLoginForm() {
  var html = "<form action=/users/register method=post class='was-validated'>" +
    "<div class=form-group>" +
    "<label for='username'>Username:</label>" +
    "<input name='username' type='text' class='form-control' id='username'/>" +
    "<div id=invalid-username class='text-danger'></div>" +
    "</div>" +
    "<div class=form-group>" +
    "<label for='password'>Password:</label>" +
    "<input name='password' type='password' class='form-control' id='password'/>" +
    "<div id=invalid-password class='text-danger'></div>" +
    "</div>" +
    "<br/>" +
    "</form>" +
    "<input type='button' value='Submit' class='btn btn-primary' onclick='submitLogin()'/>"

  document.getElementById('main-content').innerHTML = html;
}

function submitLogin() {
  var url = '/users/login';

  var username = document.getElementById('username').value,
    password = document.getElementById('password').value;

  var params = 'username=' + username + '&password=' + password;

  var isValid = true;

  if (username == "") {
    document.getElementById('invalid-username').innerHTML = 'this field is required';
    isValid = false;
  } else {
    document.getElementById('invalid-username').innerHTML = '';
  }
  if (password == "") {
    document.getElementById('invalid-password').innerHTML = 'this field is required';
    isValid = false;
  } else {
    document.getElementById('invalid-password').innerHTML = '';
  }

  if (isValid) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4)
        if (xhr.status == 401) {
          document.getElementById('invalid-password').innerHTML = 'username/password invalid'
        }
      if (xhr.status == 202) {
        window.location = '/';
      }
    };
    xhr.send(params)
  }
}

function isValidEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

/*************************************************************************************************************
 *
 * 	DTQ Home Page
 *
 **************************************************************************************************************/

function loadTheory() {
  $.ajax({
    url: '/dtq/theory',
    success: function(result) {
      var obj = JSON.parse(JSON.stringify(result));
      var dtqTheory = JSON.parse(obj.dtqTheory)
      var dtq120 = JSON.parse(obj.dtq120)
      var nlntt = JSON.parse(obj.nlntt)

      var html = '<table id=dtq-table class=display><thead><tr><th width=70%></th><th width=12%>DTQ 120</th><th width=5%>DTQ Giảng</th><th width=13%>true Story</th></tr></thead><tbody>';

      // Order is important
      html += getChapterHtml(dtqTheory.chapter01) + getChapterHtml(dtqTheory.chapter02) + getChapterHtml(dtqTheory.chapter03) + getChapterHtml(dtqTheory.chapter04) + getChapterHtml(dtqTheory.chapter05) + getChapterHtml(dtqTheory.chapter06) + getChapterHtml(dtqTheory.chapter07);

      var finalObj = dtqTheory.chapter01.concat(dtqTheory.chapter02).concat(dtqTheory.chapter03).concat(dtqTheory.chapter04).concat(dtqTheory.chapter05).concat(dtqTheory.chapter06).concat(dtqTheory.chapter07);

      document.getElementById('main-content').innerHTML = html;

      setDtq120(dtq120.chapters);
      setDtqGiang(finalObj);
      setNlntt(nlntt);

      $('table.display').DataTable({
        paging: false,
        ordering: false
      });
    }
  });
}

function getChapterHtml(chapter) {
  var html = `<tr><td><h3> ${chapter[0].vietnamese} / ${chapter[0].english} </h3></td><td></td><td></td><td></td></tr>`;

  for (i = 1; i < chapter.length; i++) {
    var shortMeaning = chapter[i].shortMeaning

    html += `<tr><td><h7><a href=javascript:void(0) data-link= '${shortMeaning}'`;

    if (shortMeaning !== '')
      html += ' class=has-note '

    html += `onclick=loadChild(this)> [${chapter[i].code}] ${chapter[i].vietnamese} </a></h7><br>` +
      `<h8>▪${chapter[i].english}</h8><br>` +
      `<h9>▪${chapter[i].french}</h9></td><td></td><td></td><td></td></tr>`;

  }
  return html;
}

function setDtq120(videos) {
  var dtq120Col = 1;
  var table = document.getElementById('dtq-table');

  for (var i = 1, row; row = table.rows[i]; i++) {
    if (typeof videos[i - 1] !== 'undefined' && videos[i - 1].frSub) {
      var link = `<a href=javascript:void(0) data-link= ${videos[i - 1].frSub} class=videoLink> ${videos[i - 1].title} <span class=fr-sub>(fr)</span></a>`;
      row.cells[dtq120Col].innerHTML = link;
    } else if (typeof videos[i - 1] !== 'undefined' && videos[i - 1].embedVideo) {
      var link = `<a href=javascript:void(0) data-link= ${videos[i - 1].embedVideo} class=videoLink> ${videos[i - 1].title} </a>`;
      row.cells[dtq120Col].innerHTML = link;
    }
  }
}

function setDtqGiang(chapter) {
  var dtqTlhCol = 2;
  var i, j, html = '';
  var table = document.getElementById('dtq-table');

  for (i = 0; i < chapter.length; i++) {
    var links = chapter[i].video; // max 3 lines in the db

    if (links[0]) {
      html = `<a href=javascript:void(0) data-link= ${links[0].p} class=videoLink>part1</a>`;
    }
    if (links[1]) {
      html += `<br><a href=javascript:void(0) data-link= ${links[1].p} class=videoLink>part2</a>`;
    }
    if (links[2]) {
      html += `<br><a href=javascript:void(0) data-link= ${links[2].p} class=videoLink>part3</a>`;
    }
    var row = table.rows[i + 1];
    row.cells[dtqTlhCol].innerHTML = html;
  }
}

function setNlntt(objMovies) {
  var dtqNlnttCol = 3;
  var fullChapters = objMovies.chapter01.concat(objMovies.chapter02).concat(objMovies.chapter03).concat(objMovies.chapter04).concat(objMovies.chapter05).concat(objMovies.chapter06).concat(objMovies.chapter07);
  var table = document.getElementById('dtq-table');

  for (var i = 0, row; row = table.rows[i]; i++) {
    if (typeof fullChapters[i] !== 'undefined' && fullChapters[i].movies) {
      var currChapter = fullChapters[i].movies;

      var html = '',
        num = 1;
      for (var j in currChapter) {
        if (currChapter[j].link) {
          html += `<a href=javascript:void(0) data-link= ${currChapter[j].link} class=videoLink>  no${num} </a>`;
          num++;
        }
      }
      var row = table.rows[i + 1];
      row.cells[dtqNlnttCol].innerHTML = html;
    }
  }
}

//https://datatables.net/release-datatables/examples/api/row_details.html
function loadChild(x) {
  var tableID = $(x).closest('table').attr('id');
  var table = $('#' + tableID).DataTable();
  var notes = x.getAttribute('data-link');
  var tr = $(x).closest('tr'); // closet parent	
  var link = $(x).closest('a');
  var row = table.row(tr);

  if (row.child.isShown()) {
    row.child.hide(); // This row is already open - close it
  } else {
    row.child(childRow(notes)).show(); // Open this row
  }
}

function childRow(notes) {
  return `<table><tr class=child-row><td>[Note] ${notes} </td></tr></table>`;
}

/*************************************************************************************************************
 *
 * 	DTQ VIDEOs Page
 *
 **************************************************************************************************************/
function loadVideos(title) {
  var html = '';

  $.ajax({
    url: `/dtq/videos/${title}`,
    success: function(res) {
      var obj = JSON.parse(res.videos);
      html += "<table class=display><thead><tr><th>Title</th><th>Theories</th><th>without Sub</th><th>english Sub</th><th>french Sub</th></tr></thead><tbody>";

      var chapters = obj.chapters;
      for (var i in chapters) {

        html += `<tr><td> ${chapters[i].title} </td>` +
          `<td> ${getTheoryParts(chapters[i].theory)} </td>` +
          `<td><a class=videoLink href=javascript:void(0) data-link=${chapters[i].embedVideo} > ${addLinkIfNotEmpty(chapters[i].embedVideo)} </a></td>` +
          `<td><a class=videoLink href=javascript:void(0) data-link=${chapters[i].enSub} > ${addLinkIfNotEmpty(chapters[i].enSub)} </a></td>` +
          `<td><a class=videoLink href=javascript:void(0) data-link=${chapters[i].frSub} > ${addLinkIfNotEmpty(chapters[i].frSub)} </a></td>`;
      }
      html += "</tbody></table>";

      document.getElementById('main-content').innerHTML = html;

      $("table.display").DataTable({
        paging: false,
        autoWidth: false,
        "columnDefs": [{
            "width": "25%",
            "targets": 0
          },
          {
            "width": "10%",
            "targets": 2
          }
        ]
      })
    }
  });
}

function getTheoryParts(theories) {
  var html = "<table><tr>";
  for (i in theories) {
    html += `<td> ${theories[i].p} </td>`
  }
  html += "</tr></table>";
  return html;
}

function addLinkIfNotEmpty(data) {
  return (data) ? 'click to view' : '';
}

/*************************************************************************************************************
 *
 * 	MODAL for embeded videos
 *
 **************************************************************************************************************/
function displayVideo(dataURL) {
  var bodyContent = getStreamLink(dataURL);

  //dynamically-change-bootstrap-modal-body
  var mymodal = $('#myModal');
  mymodal.find('.modal-body').html(bodyContent);
  mymodal.modal('show');
}

function getStreamLink(dataURL) {
  return { //1: facebookstream, 2:youtubestream;
    1: `<div class=video-responsive><iframe src=${dataURL} style=border:none;overflow:hidden scrolling=no frameborder=0 allowTransparency=true allowFullScreen=true></iframe></div>`,
    2: `<div class=video-responsive><iframe src=${dataURL} frameborder=0 allow=autoplay; encrypted-media allowfullscreen></iframe></div>`
  }[identifiedStreamer(dataURL)]
}

function identifiedStreamer(videoLink) {
  return videoLink.includes("youtu") ? 2 : 1; // youtu:2, face:1
}

/*************************************************************************************************************
 *
 * 	NEW Survey
 *
 **************************************************************************************************************/

// switch alternative: https://toddmotto.com/deprecating-the-switch-statement-for-object-literals/
function getChapterTheory(theory, chapter) {
  return {
    'hieu': theory.chapter01,
    'de': theory.chapter02,
    'can': theory.chapter03,
    'tin': theory.chapter04,
    'tubi': theory.chapter05,
    'thannhan': theory.chapter06,
    'hocvan': theory.chapter07
  }[chapter]
}

function loadNewSurveyForm(chapter) {
  var html = "";
  $.ajax({
    url: '/dtq/theory',
    success: function(resultat) {
      var theory = JSON.parse(JSON.parse(JSON.stringify(resultat)).dtqTheory)
      chapterTheory = getChapterTheory(theory, chapter);

      html += `<form action=/dtq/newSurvey/${chapter} method=post id='newSurveyForm'>` +
        `<h3> ${getChapterTitle(chapter)} </h3>` +
        `<table id=new-survey><thead><tr><th>Description</th><th>OUI</th><th>NON</th><th>NA</th></tr></thead>` +
        `<tbody>`;

      for (i in chapterTheory) {
        if (!isTitle(chapterTheory[i].code)) {
          html += `<tr><td><h7>[${chapterTheory[i].code}] ${chapterTheory[i].vietnamese} </h7><br><h8>▪${chapterTheory[i].english}</h8><br><h9>▪${chapterTheory[i].french}</h9></td>`

          for (j = 1; j < 2; j++) {
            var name = (i < 10) ? 'Q0' + i : 'Q' + i;
            html += `<td><input type=radio name = ${name} value=oui></td>` +
              `<td><input type=radio name = ${name} value=non></td>` +
              `<td><input type=radio name = ${name} value=na></td>`;
          }

          html += '</tr>'
        }
      }

      html += `</tbody></table><br><h7>Thêm Chi Tiết</h7><br><h8>Additional-notes </h8><textarea name=notes id=noteID placeholder='${chapterTheory[0].code}: write something'></textarea>` +
        `</form><input id=submitID type=button value=submit onclick=submitNewSurvey('${chapter}') class='btn btn-primary'>` +
        `<div id=error class='text-danger'></div>`

      document.getElementById('main-content').innerHTML = html;
      $('#new-survey').DataTable({
        paging: false,
        ordering: false,
        bFilter: false
      });
    }
  });
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequestEventTarget/onload
 * https://stackoverflow.com/questions/374644/how-do-i-capture-response-of-form-submit
 * http://blog.teamtreehouse.com/create-ajax-contact-form
 */
function submitNewSurvey(chapter) {

  var form = $('#newSurveyForm');
  var formData = $(form).serialize();

  $.ajax({
    type: 'POST',
    url: '/dtq/newSurvey/' + chapter,
    data: formData,
    statusCode: {
      201: function() {
        updateTodaySurveyProgress();
        displaySurveys('my-surveys');
      },
      409: function() {
        document.getElementById('error').innerHTML = 'This chapter already done for today';
      },
      500: function() {
        console.log('Server errors')
      }
    }
  })
}
function updateTodaySurveyProgress(){  
	var i;
	var chapters = ["hieu", "de", "can", "tin", "tubi", "thannhan", "hocvan"];
	for (i = 0; i < chapters.length; i++) {
		checkIfChapterDone(chapters[i]);
	}
}

function checkIfChapterDone(chapter){
  var url = "/dtq/my-last-survey/" + chapter;	
  
  $.ajax({
    url: url,
    success: function(value) {
      if(typeof value[0] !== "undefined" && getCurrDate().substring(0, 10).localeCompare(value[0].date.substring(0, 10)) == 0) {
        $('#new-survey-'+chapter).addClass('disable')
      } 
    }
  })
}

// switch alternative by object: https://toddmotto.com/deprecating-the-switch-statement-for-object-literals/
function getChapterTitle(chapter) {
  return {
    'hieu': 'Hiếu - At home, be dutiful to my parents',
    'de': 'Đệ - Standards for a younger brother/sister',
    'can': 'Cẩn - Be cautious in my daily life',
    'tin': 'Tín - Be trustworthy',
    'tubi': 'Từ Bi - Love all equally',
    'thannhan': 'Thân Nhân - Be close to and learn from people of virtue and compassion',
    'hocvan': 'Học Văn - After all above are accomplished, I should study further and learn more to improve my cultural and spiritual life',
  }[chapter]
}

function isTitle(str) {
  var patt = new RegExp("00");
  return patt.test(str);
}

function setColors() {
  var td_array = document.getElementsByTagName("td"),
    check_good = "oui",
    check_bad = "non",
    check_else = "na";

  for (i = 0; i < td_array.length; i++) {
    if (td_array[i].textContent == check_good) {
      td_array[i].style.backgroundColor = "#b3ff66";
    } else if (td_array[i].textContent == check_bad) {
      td_array[i].style.backgroundColor = "#ffa366";
    } else if (td_array[i].textContent == check_else) {
      td_array[i].style.backgroundColor = "#ffff66";
    };
  };
};

function getCurrDate() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();
	var hour = today.getHours();
	var min = today.getMinutes();
	var sec = today.getSeconds();

	if(dd<10) { dd = '0'+dd} 
	if(mm<10) { mm = '0'+mm }
	if(hour<10) { hour = '0'+hour }
  if(min<10) { min = '0'+min }
  if(sec<10) { sec = '0'+sec } 	

	return yyyy + '/' + mm + '/' + dd + " " + hour + ":" + min +":" + sec;
}