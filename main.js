let allContent = $('body');
let pageURL = window.location.href;
let currQuery;
const URL = 'http://localhost:3000';

// check if there is a querry in chrome local storage
// if there is, display it in the overlay
// if you're on a google search page, display text from search input in the overlay

// instead of saving to local storage, insert each query into database

$.get(`${URL}/query`, function (data) {
  if (data) {
    if (pageURL.includes('https://www.google.com/search?')) {
      newGoogleQuery();
    } else {
      allContent.prepend(overlayMaker(data[data.length - 1].query));
    }
  } else {
    console.log('no query');
    allContent.prepend(overlayMaker('no query'));
  }
});

chrome.storage.local.get('currQuery', function (result) {
});

function newGoogleQuery() {
  console.log('you better be on Google\'s search page!!');
  let cQ = document.getElementById('lst-ib').value;
  allContent.prepend(overlayMaker(cQ));
  saveQuery(cQ);
}


// insert completed query (query and solution) into completedqueries collection
// remove incomplete query from query collection
// refresh overlay with next incomplete query

function completeQuery() {
  $.post(`${URL}/completedqueries`, { query: 'testQ', solution: pageURL }, function (data) {
    console.log(data);
  });
}

function saveQuery(cQ) {
  $.post(`${URL}/query`, { query: cQ }, function (data) {
    console.log(data);
  });
}

function overlayMaker(cQ) {
  return `<div id="query-overlay">
            You are trying to understand:
            <div id="current-query">
              ${cQ}
            </div>
            <div id="overlay-buttons">
              <button type="button" id="complete-query" onclick="(function() {

                let thisQuery = $('#current-query').text().trim();
              
                $.post('http://localhost:3000/completedqueries', { query: thisQuery, solution: '${pageURL}' }, function (data) {
                  console.log(data);
                });
               
                $.post('http://localhost:3000/delquery', { query: thisQuery }, function(result) {
                  console.log(result);
                });

                $.get('http://localhost:3000/query', function (data) {
                  if (data) {
                    let nQ = data[data.length - 1].query
                    $('#current-query').text(nQ);
                  } else {
                    $('#current-query').text('you are free of questions');
                  }
                });
              })()">complete</button>

              <button type="button" id="complete query" onclick="(function() {
                
                let thisQuery = $('#current-query').text().trim();
                
                $.post('http://localhost:3000/delquery', { query: thisQuery }, function(result) {
                  console.log(result);
                });
                
                $.get('http://localhost:3000/query', function (data) {
                  if (data) {
                    let nQ = data[data.length - 1].query
                    $('#current-query').text(nQ);
                  } else {
                    $('#current-query').text('you are free of questions');
                  }
                });

              })()">remove</button>
              <button type="button">move down one</button>
            </div>
          </div>`;
}

// HELPER FUNCTIONS

// get domain info
function extractHostname(url) {
  var hostname;
  if (url.indexOf("://") > -1) {
    hostname = url.split('/')[2];
  }
  else {
    hostname = url.split('/')[0];
  }
  hostname = hostname.split(':')[0];
  hostname = hostname.split('?')[0];
  return hostname;
}

function extractRootDomain(url) {
  let domain = extractHostname(url),
    splitArr = domain.split('.'),
    arrLen = splitArr.length;
  if (arrLen > 1) {
    domain = splitArr[arrLen - 2];
  }
  return domain;
}

