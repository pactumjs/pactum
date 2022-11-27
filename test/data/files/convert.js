const fs = require('fs');
const zlib = require('zlib');

const READ_FILE_NAME = 'data.txt';
const WRITE_FILE_NAME = 'data.txt.br';

const read_stream = fs.createReadStream(READ_FILE_NAME);
const write_stream = fs.createWriteStream(WRITE_FILE_NAME);

const compress = zlib.createBrotliCompress();


read_stream.pipe(compress).pipe(write_stream);