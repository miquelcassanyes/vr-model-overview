export var orbitMenu = AFRAME.registerComponent('orbit-menu', {
    schema: {
        camera: {type: 'selector', default: '[camera]'},
        menu: {type: 'selector', default: '#menu'},
        angle: {type: 'number', default: '-40'},
        disableOn: {type: 'array'},
        enableOn: {type: 'string'},
        initDisabled: {type: 'boolean', default: false}
    },

    init: function () {
        this.angle = this.degToRad(this.data.angle);
        this.menuVisible = false;
        this.disabled = this.data.initDisabled;
        this.addEventListeners();
    },

    tick: function () {
        const cameraRotation = this.data.camera.object3D.rotation,
              menu = this.data.menu,
              menuVisible = this.menuVisible,
              angle = this.angle;

        if (!this.disabled) {
            this.el.object3D.rotation.y = cameraRotation.y;

            if (!menuVisible && cameraRotation.x < angle) {
                menu.setAttribute('visible', true);
                this.menuVisible = true;
            }
            else if (menuVisible && cameraRotation.x > angle) {
                menu.setAttribute('visible', false);
                this.menuVisible = false;
            }
        }
        else if (this.menuVisible) {
            menu.setAttribute('visible', false);
            this.menuVisible = false;
        }
    },

    remove: function () {

    },

    addEventListeners: function () {
        var data = this.data;

        for (var i=0; i<data.disableOn.length; i++) {
            this.el.sceneEl.addEventListener(data.disableOn[i], function () {
                this.disabled = true;
            });
        }

        for (var i=0; i<data.enableOn.length; i++) {
            this.el.sceneEl.addEventListener(data.enableOn[i], function () {
                this.disabled = false;
            })
        }
    },

    degToRad: function (degrees) {
        return degrees * (Math.PI / 180);
    }
});