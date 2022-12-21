

const fs = require('fs');
const archiver = require('archiver');
const path = require('path');

// create a file to stream archive data to.

const output = fs.createWriteStream(path.join(__dirname, '..', '..') + '/theme.zip');
const archive = archiver('zip', {
  zlib: {level: 9}
});

// listen for all archive data to be written
// 'close' event is fired only when a file descriptor is involved

output.on('close', function (){
  console.log(archive.pointer() + ' total bytes');
  console.log('Archiver has been finalized and the output file descriptor has closed. theme.zip has been created');
});

// This event is fired when the data source is drained no matter what was the data source.
// It is not part of this library but rather from the NodeJS Stream API.
// @see: https://nodejs.org/api/stream.html#stream_event_end

output.on('end', function() {
  console.log('Data has been drained');
});

// good practice to catch warnings (ie stat failures and other non-blocking errors)
archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    // log warning
  } else {
    // throw error
    throw err;
  }
});

// good practice to catch this error explicitly
archive.on('error', function(err) {
  throw err;
});

// pipe archive data to the file
archive.pipe(output);

archive.directory(path.join(__dirname, '..', '..') + '/assets', 'assets');
archive.directory(path.join(__dirname, '..', '..') + '/config', 'config');
archive.directory(path.join(__dirname, '..', '..') + '/layout', 'layout');
archive.directory(path.join(__dirname, '..', '..') + '/locales', 'locales');
archive.directory(path.join(__dirname, '..', '..') + '/sections', 'sections');
archive.directory(path.join(__dirname, '..', '..') + '/snippets', 'snippets');
archive.directory(path.join(__dirname, '..', '..') + '/templates', 'templates');


// finalize the archive (ie we are done appending files but streams have to finish yet)
// 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
archive.finalize();
