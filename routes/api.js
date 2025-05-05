'use strict';
async function getStock(stock){
  const response = await fetch(
    `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`
  );
  const { symbol, latestPrice } = await response.json();
  return { symbol, latestPrice };
}

module.exports = function (app) {
  //https://stock-price-checker-proxy.freecodecamp.rocks/v2/stock/goog/quote

  app.route('/api/stock-prices')
    .get(async function (req, res){
      const { stock, like } = req.query;
      if(Array.isArray(stock)){
        const {symbol, latestPrice} = await getStock(stock[0]);
        const {symbol: symbol2, latestPrice: latestPrice2} = await getStock(stock[1]);

        const firstStock = {symbol: stock[0], likes: like ? [req.ip] : []};
        const secondStock = {symbol: stock[1], likes: like ? [req.ip] : []};

        let stockData = [];
        if (!symbol) {
          stockData.push({
            rel_likes: firstStock.likes.length - secondStock.likes.length,
          });
        } else {
          stockData.push({
            stock: symbol,
            price: latestPrice,
            rel_likes: firstStock.likes.length - secondStock.likes.length,
          });
        }
        if (!symbol2) {
          stockData.push({
            rel_likes: secondStock.likes.length - firstStock.likes.length,
          });
        } else {
          stockData.push({
            stock: symbol2,
            price: latestPrice2,
            rel_likes: secondStock.likes.length - firstStock.likes.length,
          });
        }
        // console.log(stockData);
        res.json({
          stockData,
        });
        return;
      }
      const { symbol, latestPrice } = await getStock(stock);
      if(!symbol){
        res.json({ stockData: {likes: like ? 1 : 0} });
        return;
      }

      const oneStockData = { stock: symbol, likes: like ? [req.ip] : [] }; 
      console.log("One Stock Data", oneStockData);

      res.json({
        stockData: {
          stock: symbol,
          price: latestPrice,
          likes: oneStockData.likes.length,
        },
      })
    });
    
};
