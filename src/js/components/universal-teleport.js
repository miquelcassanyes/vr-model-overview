export var universalTeleport = AFRAME.registerComponent('universal-teleport', {
    schema: {
        type: {default: 'parabolic', oneOf: ['parabolic', 'line']},
        button: {default: 'trackpad', oneOf: ['trackpad', 'trigger', 'grip', 'menu']},
        startEvents: {type: 'array', default: ['start-teleport']},
        endEvents: {type: 'array', default: ['end-teleport']},
        collisionEntities: {type: 'string', default: ''},
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
        this.el.setAttribute('mouse-teleport', this.data);
        this.el.setAttribute('gaze-teleport', this.data);
    },

    remove: function () {
        this.el.removeAttribute('mouse-teleport gaze-teleport teleport-controls');
    }
});