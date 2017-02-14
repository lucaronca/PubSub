import assert from 'assert';
import PubSub from '../src/server/pubsub';

describe('PubSub', () => {

	describe('#publish', (done) => {

		it('When is published a certain topic, the related subscriber trigger its callback asynchronously', () => {
			let result = null;
			const subscriber3 = new PubSub.Subscribe('test3', (data) => {
				let value = data.test;
				assert.equal('very nice test', value);
				done();
			});
			// publish the topic
			PubSub.publish('test3', { test: 'very nice test' });
			// note that the variable has been yet changed, since publish method is asynchronous
			assert.notEqual('very nice test', result);
		});

	});

	describe('#publishSync', (done) => {

		it('publishSync blocks the execution of the main thread, calling directly the topic executor', () => {
			let result = null;
			const subscriber4 = new PubSub.Subscribe('test4', (data) => {
				result = data.test;
			});
			// publish the topic
			PubSub.publishSync('test4', { test: 'very nice test' });
			// in this case result variable has been changed, since the executor was called immediately
			assert.equal('very nice test', result);
		});

	});

	describe('Subscribe class', () => {

		const subscriber = new PubSub.Subscribe('test');

		it('instance of Subscribe class is a new subscriber Object', () => {
			assert.equal('object', typeof subscriber);
		});

		describe('#remove', (done) => {

			let result = null;
			const subscriber2 = new PubSub.Subscribe('test2', (data) => {
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
				PubSub.publish('test2', { test: 'very nice test' });
				setTimeout(() => {
					assert.notEqual('very nice test', result, 'setTimeout check the result asynchronously');
					done();
				}, 0);
			});

		});

		describe('#count', () => {

			const subscriber5 = new PubSub.Subscribe('test5', () => {
				return true;
			});

			it('subscriber instance has a count method', () => {
				for (let i = 0; i < 5; i++) {
					PubSub.publishSync('test5');
				}
				assert.equal(subscriber5.count, 5);
			});

		});

	});

});