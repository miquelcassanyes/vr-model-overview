export var trackingData = AFRAME.registerComponent('tracking-data', {
    init: function () {
        const sceneEl = this.el.sceneEl,
              objects = sceneEl.querySelectorAll('[tracked]');

        window.trackingData = {
            objectsSeen : [],
            objectsTime: {}
        };

        if (objects.length) {
            for (var i=0; i<objects.length; i++) {
                objects[i].addEventListener('mouseenter', this.onLookStart.bind(this));
                window.trackingData.objectsTime[objects[i].getAttribute('tracked')] = 0;
                objects[i].addEventListener('mouseleave', this.onLookEnd.bind(this));
            }
        }
    },

    remove: function () {
        const sceneEl = this.el.sceneEl,
              objects = sceneEl.querySelectorAll('[tracked]');

        if (objects.length) {
            for (var i=0; i<objects.length; i++) {
                objects[i].removeEventListener('mouseenter', this.onLookStart);
                objects[i].removeEventListener('mouseleave', this.onLookEnd.bind(this));
            }
        }
    },

    onLookStart: function (event) {
        window.trackingData.objectsSeen.push(event.target.getAttribute('tracked'));
        this.gazeStart = Date.now();
    },

    onLookEnd: function (event) {
        window.trackingData.objectsTime[event.target.getAttribute('tracked')] += (Date.now() - this.gazeStart) / 1000;
    }
});