var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var axios = require('axios');
var Promise = require('bluebird');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

// exports.readListOfUrls = function(callback) {
//   fs.readFile(exports.paths.list, 'utf8', function(err, data) {
//     callback(data.split('\n'));
//   });
// };

exports.readListOfUrls = function() {
  return new Promise(function(resolve, reject) {
    fs.readFile(exports.paths.list, 'utf8', function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data.split('\n'));
      }
    });
  });
};

// exports.isUrlInList = function(url, callback) {
//   exports.readListOfUrls(function(array) {
//     callback(array.includes(url));
//   });
// };

exports.isUrlInList = function(url) {
  return new Promise(function(resolve, reject) {
    exports.readListOfUrls()
    .then(function(array) {
      resolve(array.includes(url));
    });
  });
};

// exports.addUrlToList = function(url, callback) {
//   fs.appendFile(exports.paths.list, url + '\n', callback);
// };

exports.addUrlToList = function(url) {
  return new Promise(function(resolve, reject) {
    fs.appendFile(exports.paths.list, url + '\n', function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// exports.isUrlArchived = function(url, callback) {
//   callback(fs.existsSync(path.join(exports.paths.archivedSites, url)));
// };

exports.isUrlArchived = function(url) {
  return new Promise(function(resolve, reject) {
    resolve(fs.existsSync(path.join(exports.paths.archivedSites, url)));
  });
};

// exports.downloadUrls = function(urls) {
//   urls.forEach(function(url) {
//     axios.get('http://' + url).then(function(response) {
//       fs.writeFileSync(path.join(exports.paths.archivedSites, url), response.data, 'utf8');
//     }).catch(function(error) {
//       console.log(error);
//     });
//   });
// };

exports.downloadUrls = function(urls) {
  return new Promise(function(resolve, reject) {
    urls.forEach(function(url) {
      axios.get('http://' + url).then(function(response) {
        fs.writeFileSync(path.join(exports.paths.archivedSites, url), response.data, 'utf8');
      }).catch(function(error) {
        reject(error);
      });
    });
    resolve();
  });
};




