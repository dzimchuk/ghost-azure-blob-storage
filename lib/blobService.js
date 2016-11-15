var Promise = require('bluebird');
var azure = require('azure-storage');

function BlobService(options) {
    this.container = options.container;

    var retryOperations = new azure.ExponentialRetryPolicyFilter();
    this.blobService = Promise.promisifyAll(azure.createBlobService(options.connectionString).withFilter(retryOperations));
}

BlobService.prototype.createContainerIfNotExistsAsync = function() {
    return this.blobService.createContainerIfNotExistsAsync(this.container, { publicAccessLevel : 'blob' }).bind(this);
};

BlobService.prototype.createBlockBlobFromLocalFileAsync = function(blobName, localPath, blobOptions) {
    return this.createContainerIfNotExistsAsync().then(function() {
        return this.blobService.createBlockBlobFromLocalFileAsync(this.container, blobName, localPath, blobOptions);
    }).bind();
};

BlobService.prototype.getUrl = function(blobName) {
    return this.blobService.getUrl(this.container, blobName);
};

BlobService.prototype.doesBlobExist = function(blobName) {
    return this.createContainerIfNotExistsAsync().then(function() {
        return this.blobService.doesBlobExistAsync(this.container, blobName);
    })
    .then(function(blobResult) {
        return blobResult.exists;
    }).bind();
};

BlobService.prototype.delete = function(blobName) {
    return this.createContainerIfNotExistsAsync().then(function() {
        return this.blobService.deleteBlobIfExistsAsync(this.container, blobName);
    }).bind();
};

module.exports = BlobService;