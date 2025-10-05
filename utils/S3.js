const AWS = require('aws-sdk');
const YUP = require('yup');

const EXTENSIONS_CONTENT_TYPE = {
  png: "image/png",
  jpg: "image/jpg",
  jpeg: "image/jpeg",
  pdf: "application/pdf",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  xls: "application/vnd.ms-excel",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  zip: "application/zip",
  csv: "text/csv",
  json: "application/json",
};

const BUCKETS = {
  temporaryFile: {
    bucket_name: "temporary-files",
    test: { folder_name: "test", expires: 200 },
    default_expires: 150,
  },
};

const s3 = new AWS.S3();

const uploadTempFilePayloadSO = YUP.object({
  Bucket: YUP.string().trim().required('Bucket Name'),
  Key: YUP.string()
    .required()
    .default(new Date().getTime() + ''),
  ContentType: YUP.string().oneOf(Object.values(EXTENSIONS_CONTENT_TYPE), 'Please provide a valid extensions'),
  Body: YUP.mixed().required('File data'),
  ACL: YUP.string().default('public-read'),
});

async function validateUploadTempFilePayload(payload) {
  try {
    payload.ContentType = EXTENSIONS_CONTENT_TYPE[payload.ContentType];
    await uploadTempFilePayloadSO.validate(payload);
    return uploadTempFilePayloadSO.cast(payload);
  } catch (error) {
    throw { msg: 'Incorrect payload.', errorDetails: `${error?.errors.join(', ')}.`, status: 422 };
  }
}

/**
 * Uploads a temporary file to an S3 bucket and returns a signed URL for downloading the file.
 *
 * @async
 * @function
 * @param {string} foldername - The name of the folder within the S3 bucket to upload the file to.
 * @param {string} filename - The base name of the file (without extension). If not provided, defaults to 'Download'.
 * @param {string} extension - The file extension (e.g., 'pdf', 'jpg').
 * @param {Buffer} buffer - The file data to upload.
 * @returns {Promise<string>} A promise that resolves to a signed URL for downloading the uploaded file.
 * @throws {Object} Throws an error object if the bucket or folder information is not found.
 */
async function uploadTemporaryFileAndGetSignedUrl(foldername, filename, extension, buffer) {
  const currentTime = new Date().getTime() + '';

  filename = `${filename || 'Download'}-${currentTime}.${extension}`;

  const bucketInfo = BUCKETS.temporaryFile;
  if (!bucketInfo) throw { msg: 'Oops! Bucket name not found.' };

  const folderInfo = bucketInfo[foldername];
  if (!folderInfo) throw { msg: 'Oops! Folder name not found.' };

  const _expires = folderInfo.expires || bucketInfo.default_expires;

  const folder_full_path = `${folderInfo.folder_name}/${filename}`;
  const payload = {
    Bucket: bucketInfo.bucket_name,
    Key: folder_full_path,
    ContentType: extension,
    Body: buffer,
    ACL: 'public-read',
  };
  const s3Params = await validateUploadTempFilePayload(payload);
  await s3.putObject(s3Params).promise();

  // Set Content-Disposition to attachment for download
  const signedUrlParams = {
    Bucket: payload.Bucket,
    Key: payload.Key,
    Expires: _expires,
    ResponseContentDisposition: `attachment; filename="${filename}"`
  };
  return s3.getSignedUrlPromise('getObject', signedUrlParams);
}

module.exports = { uploadTemporaryFileAndGetSignedUrl };
