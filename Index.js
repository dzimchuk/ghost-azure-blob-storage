var Promise = require('bluebird'),
    util = require('util'),
    url = require('url'),
    path = require('path'),
    BlobService = require('./lib/blobService.js'),
    config = require('../../../core/server/config'),
    BaseStore = require('../../../core/server/storage/base'),
    options = {},
    mimeTypes = {
        '.jpg':  'image/jpeg',
        '.jpe':  'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif':  'image/gif',
        '.png':  'image/png',
        '.svg':  'image/svg+xml',
        '.svgz': 'image/svg+xml',
        '.bmp':  'image/bmp',
        '.tiff': 'image/tiff'
    };

function AzureBlobStore(config) {
    BaseStore.call(this);

    options = config || {};
    options.connectionString = options.connectionString || process.env.AZURE_STORAGE_CONNECTION_STRING;
    options.container = options.container || 'ghost';
    options.useHttps = options.useHttps == true;
}

util.inherits(AzureBlobStore, BaseStore);

// - image is the express image object
// - returns a promise which ultimately returns the full url to the uploaded image
AzureBlobStore.prototype.save = function (image, targetDir) {
    targetDir = targetDir || this.getTargetDir(config.getContentPath('images'));
    
    var blobService = new BlobService(options);
    var blobName;

    return this.getUniqueFileName(this, image, targetDir).then(function (filename) {
        blobName = filename;
        var blobOptions = {
            contentSettings = {
                cacheControl: 'public, max-age=31536000'
            }
        }
        
        var ext = path.extname(image.name);
        if (ext) {
            var contentType = mimeTypes[ext];
            if (contentType) {
                blobOptions.contentSettings.contentType = contentType; // image.type?
            }
        }

        return blobService.createBlockBlobFromLocalFileAsync(blobName, image.path, blobOptions);
    }).then(function () {
        var blobUrl = blobService.getUrl(blobName);
        
        if(!options.cdnUrl) {
            return blobUrl;
        }

        var parsedUrl = url.parse(blobUrl, true, true);
        var protocol = (options.useHttps ? "https" : "http") + "://";
        return protocol + options.cdnUrl  + parsedUrl.path;
    }).catch(function (e) {
        console.error('Error', e);
        return Promise.reject(e);
    });
};

AzureBlobStore.prototype.exists = function (fileName) {
    var blobService = new BlobService(options);
    return blobService.doesBlobExist(fileName).catch(function (e) {
        console.error('Error', e);
        return Promise.reject(e);
    });
};

AzureBlobStore.prototype.serve = function() {
    return function (req, res, next) {
      next();
    };
};

AzureBlobStore.prototype.delete = function (fileName, targetDir) {
    targetDir = targetDir || this.getTargetDir(config.getContentPath('images'));
    var pathToDelete = path.join(targetDir, fileName);

    var blobService = new BlobService(options);
    return blobService.doesBlobExist(pathToDelete).catch(function (e) {
        console.error('Error', e);
        return Promise.reject(e);
    });
};

module.exports = AzureBlobStore;