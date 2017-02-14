// private variables
const _topics = {};
const _hasTopic = Object.prototype.hasOwnProperty.bind(_topics);

class Subscribe {

  constructor(topic, executor) {
    this.topic = topic;
    this.executor = executor;

    // Create the topic's object if not yet created
    if(!_hasTopic(this.topic)) _topics[this.topic] = [];

    if (typeof this.executor != 'function'){
        console.error('Subscribe executor must be a function')
        return;
    }
    // Add the listener to queue
    this.index = _topics[this.topic].push(this.executor) -1;

  }
  
  remove() {
    // Provide handle back for removal of topic
    delete _topics[this.topic][this.index];
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
    if (this.async) setTimeout(_fireExecutors.bind(this), 0);
    else _fireExecutors.call(this);
  }
}

function _fireExecutors() {
    // Cycle through _topics queue, fire!
    _topics[this.topic].forEach((executor) => {
      executor(this.data || {});
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