const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/users.sqlite");

const ioServer = {
  emitPrice: async () => {
    let socketResponse;
    await db.all('SELECT product, price FROM products',
    (err, rows) => {
      if (err) {
        return {
          message: err
        }
      }

      ioServer.socketResponse = {
        products: []
      }
      rows.forEach(resp => {
        ioServer.socketResponse.products.push({
          product: resp.product,
          price: resp.price
        });
      });
    });
    return ioServer.socketResponse;
  }
}

module.exports = ioServer