"use strict";

module.exports = onbar;

var util = require("util"),
    config = require("../util/config"),
    barsUtil = require("../util/bars"),
    orderUtil = require("../util/order");

var SETUP = {
    instruments: {
        "EUR_USD": true,
        "USD_JPY": true,
        "GBP_USD": true,
        "EUR_GBP": true,
        "EUR_JPY": true,
        "USD_CAD": true,
        "AUD_USD": true,
        "GBP_JPY": true
    },

    granularity: "M5",
    count: 10,
    units: 10,
    threshold: 30
};

function onbar(bar) {
    var instruments = SETUP.instruments,
        granularity = SETUP.granularity,
        count = SETUP.count,
        units = SETUP.units,
        threshold = SETUP.threshold,
        instrument = bar.instrument,
        pip = config.pips[instrument];

    if (!instruments[instrument] || bar.granularity !== granularity) {
        return;
    }

    util.log(bar.time, instrument, bar.granularity, bar.volume);

    barsUtil.getHistBars({
        instrument: instrument,
        granularity: granularity,
        count: count + 1
    }, function (err, bars) {
        var greens,
            reds,
            highs,
            lows,
            max,
            min,
            delta,
            side,
            trailingStop;

        if (err) {
            util.log(err);
            return;
        }

        bars.splice(0, 1); // remove first element, because it is incomplete

        greens = bars.map(function (x) {
            return x.mid.o >= x.mid.c ? 1 : 0;
        }).reduce(function (a, b) {
            return a + b;
        });

        reds = count - greens;

        highs = bars.map(function (x) {
            return x.mid.h;
        });

        lows = bars.map(function (x) {
            return x.mid.l;
        });

        max = Math.max.apply(null, highs);
        min = Math.min.apply(null, lows);
        delta = parseInt((max - min) / pip, 10);

        util.log("Hist Bars loaded for", instrument, greens, reds, delta);

        if (delta >= threshold) {
            side = getWeightedRandomItem(["buy", "sell"],
                [greens / count, reds / count]);

            trailingStop = parseInt(delta / 2, 10);

            orderUtil.fillOrder({
                instrument: instrument,
                type: "MARKET",
                side: side,
                units: side === "buy" ? units : -units,
                trailingStopLossOnFill: {
                    distance: (trailingStop * pip).toPrecision(2)
                }
            }, function (orderErr) {
                if (orderErr) {
                    util.log(orderErr);
                }
            });
        }
    });
}

/*eslint-disable max-len */
// http://codetheory.in/weighted-biased-random-number-generation-with-javascript-based-on-probability/
/*eslint-enable max-len */

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function getWeightedRandomItem(list, weight) {
    var totalWeight = weight.reduce(function (prev, cur) {
        return prev + cur;
    });

    var randomNum = rand(0, totalWeight);
    var weightSum = 0;

    var ans;

    list.some(function (item, i) {
        weightSum += weight[i];
        weightSum = +weightSum.toFixed(2);

        if (randomNum <= weightSum) {
            ans = item;
            return true;
        }

        return false;
    });

    return ans;
}
