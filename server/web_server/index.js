const express = require('express');
const path = require('path');
const Bundler = require('parcel-bundler');
const fs = require('fs');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

const dist = './dist/';
if (process.env.MODE !== 'production') {
  const entry = path.join(__dirname, '../../src/index.html');
  // clear dist dir first
  if (fs.existsSync(dist)) {
    fs.rmdirSync(dist, { recursive: true });
  }
  let parcel = new Bundler(entry, {
    outDir: dist,
    logLevel: 1,
    hmr: false,
  });
  app.use(parcel.middleware());
} else {
  app.use(express.static(path.join(__dirname, '../../dist/')));

  app.get('/*', (req, res) =>
    res.sendFile(path.join(__dirname + '../../dist/index.html')),
  );
}

app.listen({ port: process.env.BASE_PORT }, () =>
  console.log(`🚀 Running a web server at ${process.env.BASE_URL}`),
);
