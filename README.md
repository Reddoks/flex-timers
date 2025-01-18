# Flex timers

Inspired [Safe-Timers](https://github.com/Wizcorp/safe-timers), but with more concise and understandable typescript code.
Provide ability to run timers like `setInterval`, but without maximum timeout limitations.

## Features

You may set timeouts longer than Node JS limit (24.85 days) and with three scenarios:
- Run in N milliseconds (like classic `setInterval`);
- Run at definded time;
- Run in infinite loop every N milliseconds

## Installation

```sh
npm i flex-timers
```

## Usage

Run in 10 seconds:
```ts
import { FlexTimerType, FlexTimer } from 'flex-timers';
const timer = new FlexTimer(
  FlexTimerType.RUN_IN,
  10000,
  ()=>{console.log("Timer timeout")}
)
timer.start();
```
Run at defined time and also pass params in callback with timer definition:
```ts
import { FlexTimerType, FlexTimer } from 'flex-timers';
const timer = new FlexTimer(
  FlexTimerType.RUN_AT,
  Date.now() + 10000,
  ()=>{console.log("Timer timeout")},
  {param: "test"}
)
timer.start();
```
Run every 10 seconds, and also you can override callback parameters for specific run:
```ts
import { FlexTimerType, FlexTimer } from 'flex-timers';
const timer = new FlexTimer(
  FlexTimerType.RUN_EVERY,
  10000,
  ()=>{console.log("Timer timeout")},
  {param: "test"}
)
timer.start({param: "overrided"});
// To stop timer you can use
timer.stop()
```