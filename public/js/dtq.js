/**
 * ES6 : LET is incompatible on ios 9 safari, so have to use var
 */
var facebookStream = 1;
var youtubeStream = 2;
$(document).ready(function() {

  loadTheory();

  $('.homepage').click(loadTheory);

  //jquery event-delegation
  $(document).on('click', '.videoLink', function() {
    displayVideo($(this).attr('data-link'));
  })
})

function displayVideo(dataURL) {
  var bodycontent;

  switch (identifiedStreamer(dataURL)) {
    case facebookStream:
      bodyContent = `<div class=video-responsive><iframe src=${dataURL} style=border:none;overflow:hidden scrolling=no frameborder=0 allowTransparency=true allowFullScreen=true></iframe></div>`;
      break;
    case youtubeStream:
      console.log(dataURL)
      bodyContent = `<div class=video-responsive><iframe src=${dataURL} frameborder=0 allow=autoplay; encrypted-media allowfullscreen></iframe></div>`;
      break;
  }

  //dynamically-change-bootstrap-modal-body
  var mymodal = $('#myModal');
  mymodal.find('.modal-body').html(bodyContent);
  mymodal.modal('show');
}

function identifiedStreamer(videoLink) {
  return videoLink.includes("youtu") ? 2 : 1; // youtu:2, face:1
}

function loadTheory() {
  $.ajax({
    url: '/dtq/theory',
    success: function(result) {
      var obj = JSON.parse(JSON.stringify(result));
      var dtqTheory = JSON.parse(obj.dtqTheory)
      var dtq120 = JSON.parse(obj.dtq120)
      var nlntt = JSON.parse(obj.nlntt)

      var html = '<table id=dtq-table class=dtqTheory><thead><tr><th width=70%></th><th width=12%>DTQ 120</th><th width=5%>DTQ Giảng</th><th width=13%>true Story</th></tr></thead><tbody>';

      // Order is important
      html += getChapterHtml(dtqTheory.chapter01) + getChapterHtml(dtqTheory.chapter02) + getChapterHtml(dtqTheory.chapter03) + getChapterHtml(dtqTheory.chapter04) + getChapterHtml(dtqTheory.chapter05) + getChapterHtml(dtqTheory.chapter06) + getChapterHtml(dtqTheory.chapter07);

      var finalObj = dtqTheory.chapter01.concat(dtqTheory.chapter02).concat(dtqTheory.chapter03).concat(dtqTheory.chapter04).concat(dtqTheory.chapter05).concat(dtqTheory.chapter06).concat(dtqTheory.chapter07);

      document.getElementById('main-content').innerHTML = html;

      setDtq120(dtq120.chapters);
      setDtqGiang(finalObj);
      setNlntt(nlntt);

      $('#dtq-table').DataTable({
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
      var link = `<a href=javascript:void(0) data-link= ${videos[i-1].frSub} class=videoLink> ${videos[i-1].title} <span class=fr-sub>(fr)</span></a>`;
      row.cells[dtq120Col].innerHTML = link;
    } else if (typeof videos[i - 1] !== 'undefined' && videos[i - 1].embedVideo) {
      var link = `<a href=javascript:void(0) data-link= ${videos[i-1].embedVideo} class=videoLink> ${videos[i-1].title} </a>`;
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