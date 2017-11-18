function loadJSON(callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'nintendo.json', true);
  xobj.onreadystatechange = function() {
    if (xobj.readyState == 4 && xobj.status == "200") {
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

function formatVolume(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

loadJSON(function(response) {
  data = JSON.parse(response);

  // Highest Stock Price
  const highPrices = data.map(entry => entry.high);
  const highestPrice = highPrices.reduce((a, b) => {
    return Math.max(a, b);
  });
  const highestPriceKey = Object.keys(data).find(key => data[key].high === highestPrice);
  const highestPriceDate = data[highestPriceKey].date;
  document.querySelector('#highest-price').textContent = `${highestPrice} (${highestPriceDate})`;

  // Lowest Stock Price
  const lowPrices = data.map(entry => entry.low);
  const lowestPrice = lowPrices.reduce((a, b) => {
    return Math.min(a, b);
  });
  const lowestPriceKey = Object.keys(data).find(key => data[key].low === lowestPrice);
  const lowestPriceDate = data[lowestPriceKey].date;
  document.querySelector('#lowest-price').textContent = `${lowestPrice} (${lowestPriceDate})`;

  // Top 5 Volumes
  const sortedDesc = data.sort((a, b) => a.volume > b.volume ? -1 : 1)
                     .slice(0, 5)
                     .forEach(function(x, i) {
                       document.querySelector(`#volume-top-${i + 1}`).textContent = x.date + ' - ' + formatVolume(x.volume);
                     });

  // Bottom 5 Volumes (excluding 0)
  const hasTransaction = data.filter(entry => entry.volume > 0);
  const sortedAsc = hasTransaction.sort((a, b) => a.volume < b.volume ? -1 : 1)
                    .slice(0, 5)
                    .forEach(function(x, i){
                      document.querySelector(`#volume-bottom-${i + 1}`).textContent = x.date + ' - ' + formatVolume(x.volume);
                    });

  // Ups and Downs
  const netChanges = data.map(entry => entry.close - entry.open);
  const netChangeObj = netChanges.reduce(function(obj, entry) {
    obj['up'] = obj['up'] ? obj['up'] : 0;
    obj['even'] = obj['even'] ? obj['even'] : 0;
    obj['down'] = obj['down'] ? obj['down'] : 0;

    if (entry > 0) {
      obj['up']++;
    } else if (entry === 0) {
      obj['even']++;
    } else {
      obj['down']++;
    }
    return obj;
  }, {});

  document.querySelector('#totaldays').textContent = netChanges.length;
  document.querySelector('#updays').textContent = netChangeObj.up;
  document.querySelector('#downdays').textContent = netChangeObj.down;
  document.querySelector('#evendays').textContent = netChangeObj.even;

  // Top Daily Ranges
  const dailyRangesDesc = data.sort((a, b) => {
    prevRange = a.high - a.low;
    nextRange = b.high - b.low;
    return prevRange > nextRange ? -1 : 1;
  })
  .slice(0, 5)
  .forEach(function(x, i){
    document.querySelector(`#range-top-${i + 1}`).textContent = `${x.date} - $${(x.high - x.low).toFixed(2)} (High: $${x.high}, Low: $${x.low}, Volume: ${formatVolume(x.volume)})`;
  });
});