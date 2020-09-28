const express = require('express');
const path = require('path');
const Bundler = require('parcel-bundler');
const dotenv = require('dotenv');
const compression = require('compression');
const rmdir = require('rimraf');

const app = express();
dotenv.config();
app.use(compression({ filter: shouldCompress }));

function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false;
  }

  // fallback to standard filter function
  return compression.filter(req, res);
}

if (process.env.NODE_ENV !== 'production') {
  // remove the dist dir
  rmdir(path.resolve(__dirname, '../../dist'), function(error) {});

  const entry = path.resolve(__dirname, '../../src/index.html');
  let parcel = new Bundler(entry, {
    outDir: './dist/',
    logLevel: 1,
    hmr: true,
  });
  app.use(parcel.middleware());
} else {
  app.use('/', express.static(path.resolve(__dirname, '../../dist')));

  app.get('/*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../../dist', 'index.html')),
  );
}

app.listen({ port: process.env.BASE_PORT }, () =>
  console.log(`🚀 Running a web server at ${process.env.BASE_URL}`),
);
