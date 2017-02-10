import assert from 'assert';
import PubSub from '../lib/es6';

describe('PubSub', () => {
	describe('Subscribe class', () => {

		let subscriber = new PubSub.Subscribe('test');

		it('instance of Subscribe class is a new subscriber Object', () => {
			assert.equal('object', typeof subscriber);
		});

		describe('#remove', (done) => {

			let result = null;
			let subscriber2 = new PubSub.Subscribe('test2', (data) => {
				result = data.test;
				done();
			});

			it('subscriber Object has a remove method', () => {
				assert.equal('function', typeof subscriber2.remove);
			});

			it('remove method, when called disconnect the subscriber from listening the topic', (done) => {
				// unsubscribe
				subscriber2.remove();
				// publish the topic
				PubSub.publish('test', { test: 'very nice test' });
				setTimeout(() => {
					assert.notEqual('very nice test', result, 'after 1s none topic callback has been called');
					done();
				}, 1000);
			});

		});

	});

	describe('#publish', (done) => {

		it('When is published a certain topic, the related subscriber trigger its callback', () => {
			let result = null;
			let subscriber3 = new PubSub.Subscribe('test3', (data) => {
				result = data.test;
				assert.equal('very nice test', result);
				done();
			});
			// publish the topic
			PubSub.publish('test', { test: 'very nice test' });
		});

	});

});