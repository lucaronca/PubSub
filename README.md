# PubSub
An implementation of Publish Subscribe pattern in JavaScript, in both browser either server compatible version

## Usage
```
let result = null;
let subscriber = new PubSub.Subscribe('test', (data) => {
	result = data.test;
});

PubSub.publish('test', { test: 'very nice test' });
console.log(result); // 'very nice test'
```
