# Azure Blob Storage adapter for [Ghost](https://github.com/TryGhost/Ghost) 1.x

## Installation

### Windows

```
mkdir .\content\adapters\storage\azure-blob-storage
cd .\content\adapters\storage\azure-blob-storage
npm install ghost-azure-blob-storage --production
```

## Configuration

In your config.{env}.json file, you'll need to add a new `storage` block: 

```
"storage": {
  "active": "azure-blob-storage",
  "azure-blob-storage": {
      "connectionString": "your storage account connection string",
      "container": "container name, lowercase, 3-63 characters, only letters, numbers or dashes (-), default is 'ghost'",
      "cdnUrl": "your CDN endpoint (optional), e.g. https://{endpoint}.azureedge.net"
  }
}
```
### CDN

If you use CDN you need to make sure that it points to the container and not to the storage account base URL as the adapter will omit the container name when constructing the resulting image URL.

Storage image URL:
```
https://{account}.blob.core.windows.net/{container}/2017/08/image.jpg
```

CDN image URL:
```
https://{endpoint}.azureedge.net/2017/08/image.jpg
```

### Environment variables

The following environment variables can be used to provide values for the above settings:

- storage_connectionString
- storage_container
- storage_cdnUrl

Environment variables take precedence over config.{env}.json values and defaults.

## License

[MIT](./LICENSE)