var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if (req.method === 'GET' && req.url === '/') {
    httpHelpers.serveAssets(res, archive.paths.siteAssets + '/index.html', function(data) {
      res.end(data);
    });
  } else if (req.method === 'GET') {
    archive.isUrlArchived(req.url, function(exists) {
      if (exists === true) {
        httpHelpers.serveAssets(res, archive.paths.archivedSites + req.url, function(data) {
          res.end(data);
        }); 
      } else {
        res.writeHead(404, httpHelpers.headers);
        res.end('Someone deserves to feel bad about this.');
      }
    });
  } else if (req.method === 'POST' && req.url === '/') {
    req.on('data', function(data) {
      var url = data.toString().split('=')[1];
      archive.isUrlInList(url, function(inList) {
        if (inList) {
          archive.isUrlArchived(url, function(exists) {
            if (!exists) {
              httpHelpers.serveAssets(res, archive.paths.siteAssets + '/loading.html', function(data) {
                res.writeHead(302, httpHelpers.headers);
                res.end(data);
              });
            } else {
              res.writeHead(302, {
                Location: '/' + url
              });  
            }
          });
        } else {
          archive.addUrlToList(url, function() {
            httpHelpers.serveAssets(res, archive.paths.siteAssets + '/loading.html', function(data) {
              res.writeHead(302, httpHelpers.headers);
              res.end(data);
            });
          });
        }
      });
    });
  }
};
