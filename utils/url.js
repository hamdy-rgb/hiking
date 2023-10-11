const extractDirectoryNameFromURL = (url, keyword) => {
  // Regular expression to match the path segment between the keyword and the last "/"
  const pathRegex = new RegExp(`${keyword}/(.+?)(?=\\/[^/]+$|$)`);

  // Executing the regex on the URL to extract the path segment
  const match = url.match(pathRegex);

  if (match && match[1]) {
    return match[1];
  }
  return null;
};

const extractFileNameFromURL = (url) => {
  // Regular expression to match the last part of the URL after the last "/"
  const pathRegex = /\/([^/]+)$/;

  // Executing the regex on the URL to extract the last part
  const match = url.match(pathRegex);

  if (match && match[1]) {
    return match[1];
  }
  return null;
};

module.exports = { extractDirectoryNameFromURL, extractFileNameFromURL };
