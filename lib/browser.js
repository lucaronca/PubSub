/**
 * Created by luca ronca on 08/02/2017.
 */

(function () {

    function PubSub() {};
    var _topics = {};
    var _hasTopic = Object.prototype.hasOwnProperty.bind(_topics);

    // Subscribe class function
    PubSub.Subscribe = function(topic, cbListener) {

        this.topic = topic;
        this.cbListener = cbListener;

        // push the listener execution at the end of the callstack
        // so the originator of topics will not be blocked while consumers process them.
        setTimeout(_setListener.bind(this), 0);

    };

    PubSub.Subscribe.prototype.remove = function() {
        // Provide handle back for removal of topic
        delete _topics[this.topic][this.index];
    };

    // static method 'publish'
    PubSub.publish = function(topic, data) {
        // If the topic doesn't exist, or there's no listeners in queue, just leave
        if(!_hasTopic(topic)) return;

        // Cycle through _topics queue, fire!
        _topics[topic].forEach(function(listener) {
            listener(data || {});
        });
    };

    function _setListener() {
        // Create the topic's object if not yet created
        if(!_hasTopic(this.topic)) _topics[this.topic] = [];

        // Add the listener to queue
        if (typeof this.cbListener != 'function') return;
        this.index = _topics[this.topic].push(this.cbListener) -1;

    }

    // setup the plugin as a global window's variable
    (this === window && typeof window === 'object') && (window.PubSub = window.PubSub || PubSub)

})();