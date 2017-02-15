// private variables
const _topics = {};
const _hasTopic = Object.prototype.hasOwnProperty.bind(_topics);

class Subscribe {

  constructor(topic, executor, isSingleton = false) {
    this.topic = topic;
    this.executor = executor;
    this.isSingleton = isSingleton;
    _attachExecutor.call(this);
  }

  get count() {
    return _topics[this.topic].executions;
  }
  
  remove() {
    // Provide handle back for removal of topic
    delete _topics[this.topic].executors[this.index];
  }

}

// Subscribe singleton modality, SubscribeOnce extends Subscribe
class SubscribeOnce extends Subscribe {

  constructor(topic, executor) {
    // call parent constructor
    super(topic, executor, true);
  }

}

class Publish {
  constructor(topic, data, async) {
    this.topic = topic;
    this.data = data;
    this.async = async;
  }
  fire() {
    // If the topic doesn't exist, or there's no listeners in queue, just leave
    if(!_hasTopic(this.topic)) return;

    this.topic = _checkValidTypes(this.topic);
    if(!this.topic) return;

    // trigger the executors
    if (this.async) return setTimeout(_fireExecutors.bind(this), 0);
    _fireExecutors.call(this);
  }
}

function _attachExecutor() {
  // Create the topic's object if not yet created
  if(!_hasTopic(this.topic)) _topics[this.topic] = { 
    'executors': [],
    'executions': 0,
    'isSingleton': this.isSingleton
  };

  if (typeof this.executor != 'function'){
      console.error('Subscribe executor must be a function')
      return;
  }
  // Add the listener to queue
  this.index = _topics[this.topic].executors.push(this.executor) -1;
}

function _fireExecutors() {
  // Cycle through _topics queue, fire!
  if (_topics[this.topic].isSingleton && _topics[this.topic].executions != 0) return;
  _topics[this.topic].executors.forEach((executor) => {
    executor(this.data || {});
    _topics[this.topic].executions++;
  });
}

function _checkValidTypes(entry) {
    if (typeof entry != 'string' && typeof entry != 'number') {
        console.error('topic parameter must be a valide type');
        return false;
    }
    return String(entry);
}

const PubSub = {
  Subscribe,
  SubscribeOnce,
  publish: (topic, data) => {
    let pub = new Publish(topic, data, true);
    return pub.fire();
  },
  publishSync: (topic, data) => {
    let pub = new Publish(topic, data, false);
    return pub.fire();
  }
}

module.exports = PubSub;