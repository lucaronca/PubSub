// private variables
const _topics = {};
const _hasTopic = Object.prototype.hasOwnProperty.bind(_topics);

class Subscribe {

  constructor(topic, executor) {
    this.topic = topic;
    this.executor = executor;
    // push the listener execution at the end of the callstack
    // so the originator of topics will not be blocked while consumers process them.
    setTimeout(_setListener.bind(this), 0);
    
    // private method
    function _setListener() {
      // Create the topic's object if not yet created
      if(!_hasTopic(this.topic)) _topics[this.topic] = [];

      // Add the listener to queue
      if (typeof this.executor != 'function') return;
      this.index = _topics[this.topic].push(this.executor) -1;

    }
  }
  
  remove() {
    // Provide handle back for removal of topic
    delete _topics[this.topic][this.index];
  }

}

const PubSub = {

  Subscribe,

  publish: function(topic, data) {
    // If the topic doesn't exist, or there's no listeners in queue, just leave
    if(!_hasTopic(topic)) return;

    // Cycle through _topics queue, fire!
    _topics[topic].forEach(function(listener) {
      listener(data || {});
    });
  }

}

module.exports = PubSub;
