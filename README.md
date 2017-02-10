# PubSub
An implementation of Publish Subscribe pattern in JavaScript, in both browser either server compatible version

## Usage
### Set a new subscriber object calling the Subscribe class with a topic and a callback assigned
```
let result = null;
let subscriber = new PubSub.Subscribe('test', (data) => {
	result = data.test;
});
```
The executor callback will be fired when the static 'publish' method is called with the related toipc as first argument.
You can pass moreover arbitrary object data as the second parameter
```
PubSub.publish('test', { test: 'very nice test' });
console.log(result); // 'very nice test'
```
### Remove the subscription
'Remove' method, when called disconnect the subscriber from listening the topic
```
let result = null;
let subscriber = new PubSub.Subscribe('test', (data) => {
	result = data.test;
});
subscriber.remove();
PubSub.publish('test', { test: 'very nice test' });
console.log(result); // null
```
## Tests
You can find test in the tests/test.js file. <br>
Install dependencies first with ```npm install``` and run tests with ```npm test``` command.
