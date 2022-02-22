const https = require('https');

export function isValidIsbn(isbn: string) {
  return !Number.isNaN(parseInt(isbn, 10)) && [10, 13].includes(isbn.length);
}

export function makeGoodreadsRequest(goodreadsApiKey: string) {
  return (isbn: string) => {
    return new Promise((resolve, reject) => {
      const req = https.get(
        `https://www.goodreads.com/book/isbn_to_id/${isbn}?key=${goodreadsApiKey}`,
        (res) => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            return reject(new Error(`statusCode=${res.statusCode}`));
          }

          let data = '';
          res.on('data', (chunk: string) => {
            data += chunk;
          });

          res.on('end', () => {
            resolve(data);
          });

          return null;
        }
      );

      req.on('error', (e: { message: string }) => {
        reject(e.message);
      });
    });
  };
}

export default null;
