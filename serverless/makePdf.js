const _awsS3 = require('../utils/S3');
const { htmlToPdf } = require('../utils/htmlToPdf');
exports.handler = async event => {
  try {
    const { html, htmlOptions = {}, filename = new Date().getTime() } = event;
    if (!html)
      return {
        statusCode: 400,
        body: JSON.stringify({ msg: 'Html parameter missing.' }),
      };
    const buffer = await htmlToPdf(html, htmlOptions);
    if (!buffer) {
      return {
        statusCode: 500,
        body: JSON.stringify({ msg: 'Error while generating PDF.' }),
      };
    }

    const data = await _awsS3.uploadTemporaryFileAndGetSignedUrl('test', filename, 'pdf', buffer);
    return {
      statusCode: 200,
      body: JSON.stringify({ msg: 'PDF generated successfully', data }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: 'Error while generating PDF', error: error.message }),
    };
  }
};
