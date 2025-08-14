import { defineConfig } from '@rspack/cli'
import path from 'path'
import { fileURLToPath } from 'url'
import { rspack } from '@rspack/core';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  experiments: {
    css: true,
  },
  entry: {
    client: './client/main.tsx'
  },
  devtool: false,
  output: {
    filename: '[contenthash].bundle.js',
    path: path.resolve(__dirname, 'static'),
    publicPath: '/static',
    clean: true,
  },
  module: {
    parser: {
      'css/auto': {
        namedExports: false,
      },
    },
    rules: [
      {
        test: /\.jsx$/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'ecmascript',
                jsx: true,
              },
            },
          },
        },
        type: 'javascript/auto',
      },
      {
        test: /\.tsx$/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: true,
              },
            },
          },
        },
        type: 'javascript/auto',
      },
      
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  plugins: [new rspack.HtmlRspackPlugin({
    templateContent: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>rspack</title>
        </head>
        <body>
          <div id="root"></div>
        </body>
      </body>
      </html>
    `,
  })],
})