# PubSub
An implementation of [Publish Subscribe pattern](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) in JavaScript, in both browser either server compatible versions

## Setup
#### Browser
```
<script src="pubsub.js"></script>
```
#### Server (requires node version 4 or higher)
Install from npm register
```
npm install jspubsub
```
Import or require in your module
```
import PubSub from 'jspubsub';
```
```
const PubSub = require('jspubsub');
```
## Usage
#### Set a new subscriber object calling the Subscribe class with a topic and a callback assigned as parameters
```
let subscriber = new PubSub.Subscribe('test', (data) => {
	console.log(data.test)
});
```
The executor callback will be fired when the static 'publish' method is called with the related toipc as first argument.
You can pass moreover arbitrary object data as the second parameter
```
PubSub.publish('test', { test: 'very nice test' });
// console logs 'very nice test'
```
## Working with the subscriber instance
## Count getter
Every instance of PubSub.Subscribe class has a getter that expose the number of times the topic has been called,<br>
you might find this useful for debugging:

```
let subscriber = new PubSub.Subscribe('test', (data) => {
	console.log(data.test)
});
PubSub.publish('test', { test: 'very nice test' });
for (let i = 0; i < 5; i++) {
	PubSub.publish('test');
}
console.log(subscriber.count) // 5
```
#### Remove the subscription
The 'remove' method, when called disconnect the subscriber from listening the topic
```
let subscriber = new PubSub.Subscribe('test', (data) => {
	console.log(data.test)
});
subscriber.remove();
PubSub.publish('test', { test: 'very nice test' });
// console logs nothing
```
## Note about async and sync publishing
PubSub's method has been designed to be asynchronous, so topic published will not block the main thread and your program will be more predictable. If you want instead to do actions that need to be executend soon there is a 'publishSync' method:
```
let result = null;
let subscriber = new PubSub.Subscribe('test', (data) => {
	result = data.test;
});
PubSub.publishSync('test', { test: 'very nice test' });
console.log(result) // 'very nice test'
```
## Tests
You can find tests in test/test.js <br>
Install dependencies first with ```npm install``` and run tests with ```npm test``` command.
