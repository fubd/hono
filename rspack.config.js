import { defineConfig } from '@rspack/cli'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  entry: {
    client: './client/main.tsx'
  },
  devtool: false,
  output: {
    filename: 'client.js',
    path: path.resolve(__dirname, 'static'),
    publicPath: '/',
  },
  builtins: {
    html: [
      {
        template: './public/index.html',
        filename: 'index.html',
        inject: 'body'
      }
    ],
  },
  module: {
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
  }
})
