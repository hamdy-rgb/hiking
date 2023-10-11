const fs = require("node:fs");
const { v4: uuidv4 } = require("uuid");

const {
  shareServiceClient,
  blobServiceClient,
} = require("../config/azureFile");
const {
  extractDirectoryNameFromURL,
  extractFileNameFromURL,
} = require("./url");

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;

const createDirectory = async (
  directoryName,
  path = null,
  shareName = process.env.AZURE_SHARED_FILE_NAME,
) => {
  try {
    const shareClient = shareServiceClient.getShareClient(shareName);

    let directoryPath = directoryName;
    if (path) {
      directoryPath = `${path}/${directoryName}`;
    }

    const directoryClient = shareClient.getDirectoryClient(directoryPath);

    // Check if the directory already exists before creating it
    const exists = await directoryClient.exists();
    if (exists) {
      return directoryPath;
    }

    // Create the directory
    await directoryClient.create();
    return directoryPath;
  } catch (error) {
    throw new Error(`Creating directory failed: ${error.message}`);
  }
};

const deleteDirectory = async (
  directoryPath,
  shareName = process.env.AZURE_SHARED_FILE_NAME,
) => {
  try {
    // Create directory client
    const directoryClient = shareServiceClient
      .getShareClient(shareName)
      .getDirectoryClient(directoryPath);

    // Check if the directory exists before attempting to delete it
    const exists = await directoryClient.exists();
    if (!exists) {
      throw new Error("File does not exist.");
    }

    // Delete the directory and its contents
    await directoryClient.delete();
    return true;
  } catch (error) {
    throw new Error(`Error deleting directory: ${error.message}`);
  }
};

const uploadFile = async (
  file,
  directoryPath,
  shareName = process.env.AZURE_SHARED_FILE_NAME,
) => {
  try {
    // Create directory client
    const directoryClient = shareServiceClient
      .getShareClient(shareName)
      .getDirectoryClient(directoryPath);

    // Generate a unique filename using UUID (v4) and the original file extension
    const originalFileName = file.name;
    const fileExtension = originalFileName.substring(
      originalFileName.lastIndexOf("."),
    );
    const fileName = `${uuidv4()}${fileExtension}`;

    // Upload file to Azure File Storage
    const fileClient = directoryClient.getFileClient(fileName);
    await fileClient.uploadFile(file.path, {
      rangeSize: 4 * 1024 * 1024,
      parallelism: 20,
    });

    // Get the URL for the uploaded file
    const fileURL = `https://${accountName}.file.core.windows.net/${shareName}/${directoryPath}/${fileName}`;
    return fileURL;
  } catch (error) {
    if (error instanceof RangeError) {
      throw new Error("File upload failed: Invalid range size provided.");
    } else if (error.code === "REQUEST_SEND_ERROR") {
      throw new Error(
        "File upload failed: Failed to send the request to the server.",
      );
    } else {
      throw new Error(`File upload failed: ${error.message}`);
    }
  }
};

const updateFile = async (
  file,
  fileUrl,
  shareName = process.env.AZURE_SHARED_FILE_NAME,
) => {
  try {
    const directoryName = extractDirectoryNameFromURL(fileUrl, shareName);
    const fileName = extractFileNameFromURL(fileUrl);

    // Create directory client
    const directoryClient = shareServiceClient
      .getShareClient(shareName)
      .getDirectoryClient(directoryName);

    // Check if the file exists before attempting to update it
    const fileClient = directoryClient.getFileClient(fileName);
    const exists = await fileClient.exists();
    if (!exists) {
      throw new Error("File does not exist.");
    }

    // Upload the updated file content and overwrite the existing file
    await fileClient.uploadFile(file.path, {
      rangeSize: 4 * 1024 * 1024,
      parallelism: 20,
      overwrite: true,
    });

    return true;
  } catch (error) {
    throw new Error(`Error updating file: ${error.message}`);
  }
};

const deleteFile = async (
  fileUrl,
  shareName = process.env.AZURE_SHARED_FILE_NAME,
) => {
  try {
    const directoryName = extractDirectoryNameFromURL(fileUrl, shareName);
    const fileName = extractFileNameFromURL(fileUrl);

    const directoryClient = shareServiceClient
      .getShareClient(shareName)
      .getDirectoryClient(directoryName);

    const fileClient = directoryClient.getFileClient(fileName);

    // Check if the file exists before attempting to delete it
    const exists = await fileClient.exists();
    if (!exists) {
      throw new Error("File does not exist.");
    }
    await fileClient.delete();
    return true;
  } catch (error) {
    throw new Error(`Error deleting file: ${error.message}`);
  }
};

const transferFileToArchiveStorage = async (
  fileUrl,
  destinationContainerName,
  shareName = process.env.AZURE_SHARED_FILE_NAME,
) => {
  try {
    const directoryName = extractDirectoryNameFromURL(fileUrl, shareName);
    const fileName = extractFileNameFromURL(fileUrl);

    // Get the source directory and file clients
    const sourceDirectoryClient = shareServiceClient
      .getShareClient(shareName)
      .getDirectoryClient(directoryName);

    const sourceFileClient = sourceDirectoryClient.getFileClient(fileName);

    // Get the type of share files
    const sourceFileClientProperties = await sourceFileClient.getProperties();

    // Check if the file exists before attempting to transfer it
    const fileExists = await sourceFileClient.exists();
    if (!fileExists) {
      throw new Error(`File "${fileName}" does not exist in Azure File Share.`);
    }

    // Read the file data from Azure File Share
    const fileData = await sourceFileClient.downloadToBuffer();

    // Get the destination container client
    const destinationContainerClient = blobServiceClient.getContainerClient(
      destinationContainerName,
    );

    // Create a new blob in Azure Archive Storage with the same name as the source file
    const destinationBlobClient =
      destinationContainerClient.getBlockBlobClient(fileName);

    // Upload the file data to the new blob in Azure Archive Storage
    await destinationBlobClient.uploadData(fileData, {
      blobHTTPHeaders: {
        blobContentType: sourceFileClientProperties.contentType,
      },
      tier: "Archive", // Set the access tier to Archive
      metadata: sourceFileClient.metadata, // Copy metadata from the source file if needed
    });

    await sourceFileClient.delete();

    const destinationBlobUrl = destinationBlobClient.url;

    return destinationBlobUrl;
  } catch (error) {
    throw new Error(`Error archeving file: ${error.message}`);
  }
};

const updateBlobFile = async (file, fileUrl, containerName) => {
  try {
    // Get a reference to the container and blob
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const fileName = extractFileNameFromURL(fileUrl);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    const { size, path } = file;

    const fileBuffer = fs.readFileSync(path);

    // Upload the new content to the blob
    await blockBlobClient.upload(fileBuffer, size, {
      overwrite: true,
    });

    return true;
  } catch (error) {
    throw new Error(`Error updating file: ${error.message}`);
  }
};

module.exports = {
  createDirectory,
  deleteDirectory,
  uploadFile,
  updateFile,
  deleteFile,
  transferFileToArchiveStorage,
  updateBlobFile,
};
