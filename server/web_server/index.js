const express = require('express');
const path = require('path');
const Bundler = require('parcel-bundler');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

if (process.env.NODE_ENV !== 'production') {
  const entry = path.resolve('src', 'index.html');
  let parcel = new Bundler(entry, {
    outDir: './dist/',
    logLevel: 1,
    hmr: false,
  });
  app.use(parcel.middleware());
} else {
  app.use(express.static(path.resolve('dist')));

  app.get('/*', (req, res) => res.sendFile(path.resolve('dist', 'index.html')));
}

app.listen({ port: process.env.BASE_PORT }, () =>
  console.log(`🚀 Running a web server at ${process.env.BASE_URL}`),
);
