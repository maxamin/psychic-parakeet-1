import Document, {DocumentContext, Head, Html, Main, NextScript,} from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return {...initialProps}
  }

  render() {
    // noinspection HtmlRequiredTitleElement
    return (
      <Html>
        <Head/>
        <body className="tw-bg-gray-50">
        <Main/>
        <NextScript/>
        </body>
      </Html>
    )
  }
}

export default MyDocument
