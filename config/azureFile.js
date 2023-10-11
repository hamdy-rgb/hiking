const {
  ShareServiceClient,
  StorageSharedKeyCredential: ShareStorageSharedKeyCredential,
  ShareSASPermissions,
  generateFileSASQueryParameters,
} = require("@azure/storage-file-share");

const {
  BlobServiceClient,
  StorageSharedKeyCredential: BlobStorageSharedKeyCredential,
  BlobSASPermissions,
  generateBlobSASQueryParameters,
} = require("@azure/storage-blob");
const { addOneHour } = require("../utils/time");

// Retrieve the Azure Storage account name and account key from environment variables
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

// Check if the required environment variables are set, and throw an error if not
if (!accountName) throw Error("Azure Storage accountName not found");
if (!accountKey) throw Error("Azure Storage accountKey not found");

// Create a shared key credential for accessing Azure File Storage
const sharedKeyCredential = new ShareStorageSharedKeyCredential(
  accountName,
  accountKey,
);

// Create a shared key credential for accessing Azure Blob Storage
const blobStorageSharedKeyCredential = new BlobStorageSharedKeyCredential(
  accountName,
  accountKey,
);

// Create a ShareServiceClient instance for interacting with Azure File Storage
const shareServiceClient = new ShareServiceClient(
  `https://${accountName}.file.core.windows.net`,
  sharedKeyCredential,
);

// Create a BlobServiceClient instance for interacting with Azure Blob Storage
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  blobStorageSharedKeyCredential,
);

// Generate a SAS token for Azure File Storage
const generateFileStorageSasToken = (
  expiryTime = addOneHour(),
  shareName = process.env.AZURE_SHARED_FILE_NAME,
) => {
  const shareSASPermissions = new ShareSASPermissions();
  // permissions
  shareSASPermissions.read = true;

  const sasQueryParameters = generateFileSASQueryParameters(
    {
      shareName, // Name of the Azure File Share
      permissions: shareSASPermissions, // Permissions
      startsOn: new Date(), // Optional: Start time for the SAS token
      expiresOn: expiryTime, // Expiry time for the SAS token
    },
    sharedKeyCredential, // Your shared key credential
  );

  return sasQueryParameters.toString();
};

// Generate a SAS token for Azure Blob Storage
const generateBlobStorageSasToken = (
  containerName,
  expiryTime = addOneHour(),
) => {
  const blobSASPermissions = new BlobSASPermissions();
  //  permissions
  blobSASPermissions.read = true;

  const sasQueryParameters = generateBlobSASQueryParameters(
    {
      containerName, // Name of the Azure Blob Storage container
      permissions: blobSASPermissions, // Permissions
      startsOn: new Date(), // Optional: Start time for the SAS token
      expiresOn: expiryTime, // Expiry time for the SAS token
    },
    blobStorageSharedKeyCredential, // Your Blob Storage shared key credential
  );

  return sasQueryParameters.toString();
};

module.exports = {
  shareServiceClient,
  blobServiceClient,
  generateFileStorageSasToken,
  generateBlobStorageSasToken,
};
