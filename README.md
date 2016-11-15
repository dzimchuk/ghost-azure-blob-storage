# [Ghost](https://github.com/TryGhost/Ghost) image storage adapter for Azure Blob Storage

Azure Blob Storage adapter for Ghost 0.10+

## Installation

```
npm install ghost-azure-blob-storage
mkdir -p ./content/storage
cp -r ./node_modules/ghost-azure-blob-storage ./content/storage/azure-blob-storage
```

## Configuration

In your config.js file, you'll need to add a new `storage` block to whichever environment you want to change: 

```
storage: {
  active: 'azure-blob-storage',
  azure-blob-storage: {
    connectionString: 'your storage account connection string', // if not found, the module will try to use 'AZURE_STORAGE_CONNECTION_STRING' environment variable
    container: 'your container name', // lowercase, 3-63 characters, only letters, numbers or dashes (-), default is 'ghost'
    cdnUrl: 'your CDN endpoint', // optional
    useHttps: true|false // use https CDN endpoint, optional, default is 'false'
  }
}
```

## License

[MIT](./LICENSE)