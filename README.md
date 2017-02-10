# PubSub
An implementation of Publish Subscribe pattern in JavaScript, in both browser either server compatible version

## Usage
### set a new subricber object with a topic and a callback assigned
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
### remove the subscription
remove method, when called disconnect the subscriber from listening the topic
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
You can find test in the test/test.js file.
run test with ```npm test``` command
