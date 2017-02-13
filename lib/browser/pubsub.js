/**
 * Created by luca ronca on 08/02/2017.
 */

(function () {

    function PubSub() {};
    // topic private collection
    var _topics = {};
    // shorthand fbound function
    var _hasTopic = Object.prototype.hasOwnProperty.bind(_topics);

    // Subscribe class function
    PubSub.Subscribe = function(topic, executor) {

        this.topic = topic;
        this.executor = executor;

        _setExecutor.call(this);

    };

    PubSub.Subscribe.prototype.remove = function() {
        // Provide handle back for removal of topic
        delete _topics[this.topic][this.index];
    };

    // static method 'publish'
    PubSub.publish = function(topic, data) {

        // If the topic doesn't exist, or there's no listeners in queue, just leave
        if(!_hasTopic(topic)) return;

        topic = _checkValidTypes(topic);
        if(!topic) return;
        // if async is not defined, fallback value will be true
        this.async = (this.async === undefined);

        // trigger the executors
        if (this.async) setTimeout(_fireExecutors.bind(null, topic, data), 0);
        else _fireExecutors(topic, data);
         
    };

    // static method 'publishSync'
    PubSub.publishSync = function(topic, data) {
        // extend the publish function with the async variable
        this.async = false;
        this.publish.call(this, topic, data);
    };

    function _setExecutor() {
        // Create the topic's object if not yet created
        if(!_hasTopic(this.topic)) _topics[this.topic] = [];

        if (typeof this.executor != 'function'){
            console.error('Subscribe executor must be a function')
            return;
        }
        // Add the listener to queue
        this.index = _topics[this.topic].push(this.executor) -1;

    }

    function _fireExecutors(topic, data) {
        // Cycle through _topics queue, fire!
        _topics[topic].forEach(function(executor) {
            executor(data || {});
        });
    }

    function _checkValidTypes(entry) {
        if (typeof entry != 'string' && typeof entry != 'number') {
            console.error('topic parameter must be a valide type');
            return false;
        }
        return String(entry);
    }

    // setup the plugin as a global window's variable
    (this === window && typeof window === 'object') && (window.PubSub = window.PubSub || PubSub)

})();
