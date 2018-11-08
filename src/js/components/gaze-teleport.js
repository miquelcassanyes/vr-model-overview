export var gazeTeleport = AFRAME.registerComponent('gaze-teleport', {
    schema: {
        type: {default: 'parabolic', oneOf: ['parabolic', 'line']},
        button: {default: 'trackpad', oneOf: ['trackpad', 'trigger', 'grip', 'menu']},
        startEvents: {type: 'array', default: ['start-teleport']},
        endEvents: {type: 'array', default: ['end-teleport']},
        collisionEntities: {type: 'selector', default: ''},
        hitEntity: {type: 'string'},
        cameraRig: {type: 'string'},
        teleportOrigin: {type: 'string'},
        hitCylinderColor: {type: 'color', default: '#99ff99'},
        hitCylinderRadius: {default: 0.25, min: 0},
        hitCylinderHeight: {default: 0.3, min: 0},
        maxLength: {type: 'number', default: 10, min: 0, if: {type: ['line']}},
        curveNumberPoints: {type: 'int', default: 30, min: 2, if: {type: ['parabolic']}},
        curveLineWidth: {type: 'number', default: 0.025},
        curveHitColor: {type: 'color', default: '#99ff99'},
        curveMissColor: {type: 'color', default: '#ff0000'},
        curveShootingSpeed: {type: 'number', default: 5, min: 0, if: {type: ['parabolic']}},
        defaultPlaneSize: {type: 'number', default: 100 },
        landingNormal: {type: 'vec3', default: { x: 0, y: 1, z: 0 }},
        landingMaxAngle: {default: '45', min: 0, max: 360}
    },

    init: function () {
        this.el.setAttribute('teleport-controls', this.data);
        this.startTeleport = this.startTeleport.bind(this);
        this.endTeleport = this.endTeleport.bind(this);
        this.el.sceneEl.canvas.addEventListener('touchend', this.startTeleport);
    },

    startTeleport: function () {
        const el = this.el,
              canvas = el.sceneEl.canvas;

        canvas.removeEventListener('touchend', this.startTeleport);
        canvas.addEventListener('touchend', this.endTeleport);
        this.data.startEvents.forEach(function (startEvent) {
            el.emit(startEvent);
        })
    },

    endTeleport: function () {
        const el = this.el,
            canvas = el.sceneEl.canvas;

        canvas.removeEventListener('touchend', this.endTeleport);
        canvas.addEventListener('touchend', this.startTeleport);
        this.data.endEvents.forEach(function (endEvent) {
            el.emit(endEvent);
        })
    },

    remove: function () {
        const canvas = this.el.sceneEl.canvas;

        canvas.removeEventListener('touchend', this.startTeleport);
        canvas.removeEventListener('touchend', this.endTeleport);
        this.el.removeAttribute('teleport-controls');
    }
});