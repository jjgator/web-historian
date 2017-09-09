#!/usr/bin/env node
// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archiveHelpers = require('../helpers/archive-helpers');

var urlsToDownload = [];

archiveHelpers.readListOfUrls(function(urls) {
  urls.forEach(function(url) {
    archiveHelpers.isUrlArchived(url, function(exists) {
      if (!exists) {
        urlsToDownload.push(url);
      }
    });
  });

  archiveHelpers.downloadUrls(urlsToDownload);
});