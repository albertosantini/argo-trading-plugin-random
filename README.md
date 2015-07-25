# ARGO-TRADING PLUGIN RANDOM

[![NPM version](https://badge.fury.io/js/argo-trading-plugin-random.png)](http://badge.fury.io/js/argo-trading-plugin-random)
[![NGN Dependencies](https://david-dm.org/albertosantini/argo-trading-plugin-random.png)](https://david-dm.org/albertosantini/argo-trading-plugin-random)
[![Build Status](https://travis-ci.org/albertosantini/argo-trading-plugin-random.png)](https://travis-ci.org/albertosantini/argo-trading-plugin-random)

`argo-tradin-plugin-random` is a plugin for [Argo][], the open source trading
platform, connecting directly with [OANDA][] through the powerful [API][].

For demo purpose only it implements a strategy (`lib/custom/onbar.js`) based on
weighted random count of the latest candles.


## Getting Started

```
npm install -g argo-trading-plugin-random
```

After starting Argo and logging in, the plugin can be started with the following
command:

```
argo-trading-plugin-random
```

Don't forget to enable the plugin in `Plugins` tab of Argo.

## Disclaimer

NOT INVESTMENT ADVICE AND WILL LOSE LOTS OF MONEY SO PROCEED WITH CAUTION.

[Argo]: https://github.com/albertosantini/argo
[OANDA]: http://fxtrade.oanda.co.uk/
[API]: http://developer.oanda.com/
