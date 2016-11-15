# [Ghost](https://github.com/TryGhost/Ghost) image storage adapter for Azure Blob Storage

Azure Blob Storage adapter for Ghost 0.10+

## Installation

```
npm install ghost-azure-blob-storage --production
mkdir .\content\storage\azure-blob-storage
xcopy .\node_modules\ghost-azure-blob-storage .\content\storage\azure-blob-storage /E /Y
```

## Configuration

In your config.js file, you'll need to add a new `storage` block to whichever environment you want to change: 

```
storage: {
  active: 'azure-blob-storage',
  'azure-blob-storage': {
    connectionString: 'your storage account connection string',
    container: 'your container name', // lowercase, 3-63 characters, only letters, numbers or dashes (-), default is 'ghost'
    cdn: 'your CDN endpoint', // optional
    useHttps: true|false // use https CDN endpoint, optional, default is 'false'
  }
}
```

The following environment variables can be used to provide values for the above settings:

- storage_connectionString or AZURE_STORAGE_CONNECTION_STRING
- storage_container
- storage_cdn
- storage_use_https

Environment variables take precedence over config.js values and defaults.

## License

[MIT](./LICENSE)