# htmlToPdf

A serverless AWS Lambda function that converts HTML content to PDF files using Puppeteer and Chromium. The generated PDFs are uploaded to AWS S3 with temporary signed URLs for easy access.

## 🚀 Features

- **HTML to PDF Conversion**: Convert any HTML content to high-quality PDF files
- **Serverless Architecture**: Built with AWS Lambda for scalability and cost-effectiveness
- **AWS S3 Integration**: Automatic upload of generated PDFs to S3 with signed URLs
- **Customizable PDF Options**: Support for various PDF generation options
- **Fast and Reliable**: Uses Puppeteer with optimized Chromium for consistent results

## 📋 Prerequisites

- Node.js 20.x or higher
- AWS CLI configured with appropriate permissions
- Serverless Framework installed globally
- AWS S3 bucket named `temporary-files` (or modify the bucket name in the configuration)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/d-rat/htmlToPdf.git
   cd htmlToPdf
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Serverless Framework globally** (if not already installed)
   ```bash
   npm install -g serverless
   ```

4. **Configure AWS credentials**
   ```bash
   aws configure
   ```

## 🚀 Deployment

Deploy the service to AWS:

```bash
serverless deploy
```

This will:
- Create the Lambda function
- Set up the necessary IAM roles and permissions
- Create the Lambda layer with dependencies
- Configure the AWS API Gateway endpoint

## 📖 Usage

### API Endpoint

Once deployed, you can invoke the Lambda function with the following payload:

```json
{
  "html": "<html><body><h1>Hello World</h1></body></html>",
  "htmlOptions": {
    "format": "A4",
    "printBackground": true,
    "margin": {
      "top": "1cm",
      "right": "1cm",
      "bottom": "1cm",
      "left": "1cm"
    }
  },
  "filename": "my-document"
}
```

### Parameters

- **html** (required): The HTML content to convert to PDF
- **htmlOptions** (optional): PDF generation options (follows Puppeteer's PDF options)
- **filename** (optional): Custom filename for the generated PDF (defaults to timestamp)

### Response

```json
{
  "statusCode": 200,
  "body": {
    "msg": "PDF generated successfully",
    "data": {
      "signedUrl": "https://temporary-files.s3.amazonaws.com/...",
      "key": "test/filename.pdf"
    }
  }
}
```

### Local Development

For local testing, you can use the serverless-offline plugin:

```bash
npm install -g serverless-offline
serverless offline
```

## 🏗️ Project Structure

```
htmlToPdf/
├── serverless/
│   └── makePdf.js          # Main Lambda handler
├── utils/
│   ├── htmlToPdf.js        # HTML to PDF conversion logic
│   └── S3.js               # AWS S3 upload utilities
├── package.json            # Dependencies and scripts
├── serverless.yml          # Serverless configuration
├── LICENSE                 # GNU GPL v3 License
└── README.md              # This file
```

## ⚙️ Configuration

### AWS Permissions

The Lambda function requires the following AWS permissions:
- `s3:PutObject` - Upload PDF files to S3
- `s3:PutObjectAcl` - Set object permissions
- `s3:GetObject` - Retrieve objects (for signed URLs)
- `s3:DeleteObject` - Clean up temporary files
- `s3:ListBucket` - List bucket contents

### Environment Variables

The function uses the following environment configuration:
- **AWS Region**: `ap-south-1` (configurable in `serverless.yml`)
- **Runtime**: Node.js 20.x
- **Timeout**: 30 seconds
- **S3 Bucket**: `temporary-files`

## 🔧 Customization

### PDF Options

You can customize the PDF generation by passing options in the `htmlOptions` parameter. Supported options include:

- `format`: Paper format (A4, A3, Legal, Letter, etc.)
- `width`, `height`: Custom dimensions
- `margin`: Page margins
- `printBackground`: Include background graphics
- `landscape`: Orientation
- `pageRanges`: Specific pages to print

### S3 Configuration

To use a different S3 bucket, modify the `BUCKETS` configuration in `utils/S3.js` and update the IAM permissions in `serverless.yml`.

## 🧪 Testing

Currently, the project uses a basic test setup. To run tests:

```bash
npm test
```

*Note: Comprehensive tests are planned for future releases.*

## 📝 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

## 🔗 Dependencies

- **[@sparticuz/chromium](https://github.com/Sparticuz/chromium)**: Chromium binary for AWS Lambda
- **[puppeteer-core](https://github.com/puppeteer/puppeteer)**: Headless Chrome Node.js API
- **[aws-sdk](https://github.com/aws/aws-sdk-js)**: AWS SDK for JavaScript
- **[yup](https://github.com/jquense/yup)**: Schema validation library
- **[serverless-offline](https://github.com/dherault/serverless-offline)**: Local development plugin

---

Made with ❤️ for converting HTML to PDF seamlessly in the cloud.