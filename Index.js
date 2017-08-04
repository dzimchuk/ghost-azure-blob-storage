var Promise = require('bluebird'),
    util = require('util'),
    url = require('url'),
    path = require('path'),
    BlobService = require('./lib/blobService.js'),
    BaseStore = require('../../../core/server/storage/base'),
    options = {},
    blobUrlPattern = {},
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
    options.connectionString = process.env.storage_connectionString || process.env.AZURE_STORAGE_CONNECTION_STRING || options.connectionString;
    options.container = process.env.storage_container || options.container || 'ghost';
    options.cdnUrl = process.env.storage_cdnUrl || options.cdnUrl;

    blobUrlPattern = new RegExp('^.*/' + options.container + '(/.+)$');
}

util.inherits(AzureBlobStore, BaseStore);

AzureBlobStore.prototype.save = function (image, targetDir) {
    targetDir = targetDir || this.getTargetDir();
    
    var blobService = new BlobService(options);
    var blobName;

    return this.getUniqueFileName(this, image, targetDir).then(function (filename) {
        blobName = filename;
        var blobOptions = {
            contentSettings: {
                cacheControl: 'public, max-age=31536000'
            }
        };
        
        var ext = path.extname(image.name);
        if (ext) {
            var contentType = mimeTypes[ext];
            if (contentType) {
                blobOptions.contentSettings.contentType = contentType; // image.type?
            }
        }

        return blobService.createBlockBlobFromLocalFileAsync(blobName, image.path, blobOptions);
    })
    .delay(500)
    .then(function () {
        var blobUrl = blobService.getUrl(blobName);
        
        if(!options.cdnUrl) {
            return blobUrl;
        }

        var parsedUrl = url.parse(blobUrl, true, true);
        
        var match = blobUrlPattern.exec(parsedUrl.path);
        if (match == null) {
            return blobUrl;
        }

        return url.resolve(options.cdnUrl, match[1]);
    });
};

AzureBlobStore.prototype.exists = function (blobName) {
    var blobService = new BlobService(options);
    return blobService.doesBlobExist(blobName);
};

AzureBlobStore.prototype.serve = function() {
    return function (req, res, next) {
      next();
    };
};

AzureBlobStore.prototype.delete = function (fileName, targetDir) {
    targetDir = targetDir || this.getTargetDir();
    var blobName = path.join(targetDir, fileName);

    var blobService = new BlobService(options);
    return blobService.delete(blobName);
};

module.exports = AzureBlobStore;