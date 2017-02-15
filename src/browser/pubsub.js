/**
 * Created by luca ronca on 08/02/2017.
 */

(function () {

    function PubSub() {};
    // topic private collection
    var _topics = {};
    // shorthand bound function
    var _hasTopic = Object.prototype.hasOwnProperty.bind(_topics);

    // Subscribe class function
    PubSub.Subscribe = function(topic, executor) {

        this.topic = topic;
        this.executor = executor;
        this.isSingleton = this.isSingleton || false;
        _attachExecutor.call(this);

    };

    PubSub.Subscribe.prototype = {

        //count topic executions
        get count() {
            return _topics[this.topic].executions;
        },
        // Provide handle back for removal of topic
        remove: function() {
            delete _topics[this.topic].executors[this.index];
        }

    };

    // Subscribe singleton modality
    PubSub.SubscribeOnce = function() {
        this.isSingleton = true;
        // Call parent constructor
        PubSub.Subscribe.apply(this, arguments);
    }

    // SubscribeOnce extends Subscribe
    PubSub.SubscribeOnce.prototype = Object.create(PubSub.Subscribe.prototype);

    // correct the constructor pointer because it points to PubSub.SubscribeOnce
    PubSub.SubscribeOnce.prototype.constructor = PubSub.SubscribeOnce;

    // static method 'publish'
    PubSub.publish = function(topic, data) {

        // If the topic doesn't exist, or there's no listeners in queue, just leave
        if(!_hasTopic(topic)) return;

        topic = _checkValidTypes(topic);
        if(!topic) return;
        // if async is not defined, fallback value will be true
        this.async = (this.async === undefined);

        // trigger the executors
        if (this.async) return setTimeout(_fireExecutors.bind(null, topic, data), 0);
        _fireExecutors(topic, data);
         
    };

    // static method 'publishSync'
    PubSub.publishSync = function(topic, data) {
        // extend the publish function with the async variable
        this.async = false;
        this.publish.call(this, topic, data);
    };

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

    function _fireExecutors(topic, data) {
        // Cycle through _topics queue, fire!
        if (_topics[topic].isSingleton && _topics[topic].executions != 0) return;
        _topics[topic].executors.forEach(function(executor) {
            executor(data || {});
            _topics[topic].executions++;
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
