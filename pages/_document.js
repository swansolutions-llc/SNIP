import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="stylesheet" href="https://cdn.datatables.net/1.13.7/css/jquery.dataTables.css" />
          <link rel="icon" href="/images/snip-faveicon.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <script
            src="https://code.jquery.com/jquery-3.7.1.min.js"
            integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="
            crossOrigin="anonymous"
            defer // Add the defer attribute to load the script asynchronously
          />
          <script
            src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.js"
            defer // Add the defer attribute to load the script asynchronously
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
