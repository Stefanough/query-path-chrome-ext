let allContent = $('body');
let pageURL = window.location.href;
let currQuery;

// check if there is a querry in chrome local storage
// if there is, display it in the overlay
// if you're on a google search page, display text from search input in the overlay

// instead of saving to local storage, insert each query into database

// getQuery();

$.get('http://localhost:3000', function (data) {
  console.log(data[data.length - 1]);
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

function overlayMaker(cQ) {
  return `<div id="query-overlay">
            You are trying to understand:
            ${cQ}
            <div id="overlay-buttons">
              <button type="button">complete</button>
              <button type="button">remove</button>
              <button type="button">move down one</button>
            </div>
          </div>`;
}


function saveQuery(cQ) {
  $.post('http://localhost:3000', { query: cQ }, function (data) {
    console.log(data);
  });

  // chrome.storage.local.set({ currQuery: cQ }, function () {
  //   console.log(`success inserting ${{ currQuery: cQ }} into chrome local`)
  // });
}

// HELPER FUNCTIONSa

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

