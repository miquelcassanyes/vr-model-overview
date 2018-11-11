export var extendedTeleport = AFRAME.registerComponent('extended-teleport', {
    schema: {
        controls: {type: 'array', default: ['gaze', 'mouse', 'gamepad']},
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
        const el = this.el,
              sceneEl = el.sceneEl,
              data = this.data;

        this.controls = data.controls;
        delete data.controls;
        el.setAttribute('teleport-controls', this.data);
        this.startTeleport = this.startTeleport.bind(this);
        this.endTeleport = this.endTeleport.bind(this);

        if (this.controls.includes('gaze')) {
            sceneEl.canvas.addEventListener('touchend', this.startTeleport);
        }

        if (this.controls.includes('mouse')) {
            sceneEl.canvas.addEventListener('mouseup', this.startTeleport);
        }

        if (this.controls.includes('gamepad')) {
            this.gamepads = navigator.getGamepads();
            this.active = false;
            this.keyPressed = false;
        }
    },

    tick: function () {
        const el = this.el;

        if (!this.controls.includes('gamepad')) {
            return;
        }

        for (var i=0; i<this.gamepads.length; i++) {
            var gamepad = this.gamepads[i];

            if (gamepad !== null) {
                if (gamepad !== null) {
                    if (!this.active) {
                        if (!this.keyPressed && gamepad.buttons[0].pressed) {
                            this.keyPressed = true;
                        }
                        else if (this.keyPressed && !gamepad.buttons[0].pressed) {
                            this.startTeleport();
                        }
                    }
                    else {
                        if (!this.keyPressed && gamepad.buttons[0].pressed) {
                            this.keyPressed = true;
                        }
                        else if (this.keyPressed && !gamepad.buttons[0].pressed) {
                            this.endTeleport();
                        }
                    }
                }
            }
        }
    },

    remove: function () {
        const canvas = this.el.sceneEl.canvas;

        canvas.removeEventListener('touchend', this.startTeleport);
        canvas.removeEventListener('touchend', this.endTeleport);
        canvas.removeEventListener('mouseup', this.startTeleport);
        canvas.removeEventListener('mouseup', this.endTeleport);
        this.el.removeAttribute('teleport-controls');
    },

    startTeleport: function () {
        const el = this.el,
              canvas = el.sceneEl.canvas,
              controls = this.controls;

        if (controls.includes('gaze')) {
            canvas.removeEventListener('touchend', this.startTeleport);
            canvas.addEventListener('touchend', this.endTeleport);
        }

        if (controls.includes('mouse')) {
            canvas.removeEventListener('mouseup', this.startTeleport);
            canvas.addEventListener('mouseup', this.endTeleport);
        }

        if (controls.includes('gamepad')) {
            this.active = true;
            this.keyPressed = false;
        }
        this.data.startEvents.forEach(function (startEvent) {
            el.emit(startEvent);
        });
    },

    endTeleport: function () {
        const el = this.el,
              canvas = el.sceneEl.canvas,
              controls = this.controls;

        if (controls.includes('gaze')) {
            canvas.removeEventListener('touchend', this.endTeleport);
            canvas.addEventListener('touchend', this.startTeleport);
        }

        if (controls.includes('mouse')) {
            canvas.removeEventListener('mouseup', this.endTeleport);
            canvas.addEventListener('mouseup', this.startTeleport);
        }

        if (controls.includes('gamepad')) {
            this.active = false;
            this.keyPressed = false;
        }

        this.data.endEvents.forEach(function (endEvent) {
            el.emit(endEvent);
        });
    }
});