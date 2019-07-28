import * as R from "ramda";
import uniqid from 'uniqid';

/**
 * Constants
 * */
const tickTime = 1000 / 60;
const mouse = {x: undefined, y: undefined};
const core = {
    initiated: false
};

/**
 * Common Functions
 * */
let isHover = function (ctx, mouse) {
    return ctx.isPointInPath(mouse.x, mouse.y);
};
let Geom = (function () {
    let object = {
        PI: Math.PI,
        rads: function (degrees) {
            return degrees / (180 / Math.PI);
        },
        degrees: function (rads) {
            return rads * (180 / Math.PI) % 360;
        },
        sin: function (degrees) {
            return Math.sin(this.rads(degrees))
        },
        cos: function (degrees) {
            return Math.cos(this.rads(degrees))
        },
        triangle: Triangle
    };

    function Triangle(dots, agles, sides) {
        this.A = dots.A;
        this.B = dots.B;
        this.C = dots.C;
        this.alpha = agles.alpha ? object.rads(agles.alpha) : undefined;
        this.beta = agles.beta ? object.rads(agles.beta) : undefined;
        this.gamma = agles.gamma ? object.rads(agles.gamma) : undefined;
        this.a = sides.a !== undefined ? sides.a : undefined;
        this.b = sides.b;
        this.c = sides.c;

        if (this.alpha === undefined) {
            this.alpha = this.calcAngle('alpha');
        }
    }

    Triangle.prototype.info = 'AB(c) - AC(b) (alpha); BA(c) - BC(a) (beta); CB(a) - CA(b) (gamma)';
    Triangle.prototype.getSide = function (name) {
        if (this.alpha === undefined)
            return undefined;

        if (name === 'a') {
            return this.a !== undefined ? this.a : (function () {
                if (this.c !== undefined) {
                    return Math.sin(this.alpha) * this.c;
                } else if (this.b !== undefined) {
                    return Math.tan(this.alpha) * this.b;
                }

            }.bind(this))()
        } else if (name === 'b') {
            return this.b !== undefined ? this.b : (function () {
                if (this.c !== undefined) {
                    return Math.cos(this.alpha) * this.c;
                } else if (this.a !== undefined) {
                    return 1 / Math.tan(this.alpha) * this.a;
                }

            }.bind(this))()
        } else if (name === 'c') {
            // return this.b !== undefined ? this.b : (function () {
            //     if(this.c !== undefined){
            //         return Math.cos(this.alpha) * this.c;
            //     }else if (this.a !== undefined) {
            //         return 1 / Math.tan(this.alpha) * this.a;
            //     }
            //
            // }.bind(this))()
            return this.c !== undefined ? this.c : undefined
        }


    };
    Triangle.prototype.setAngle = function (name, set, value) {
        if (['alpha', 'beta', 'gamma'].indexOf(name) === -1) {
            return undefined;
        }
        if (set === 'rad') {
            this[name] = value;
        } else if (set === 'deg') {
            this[name] = object.rads(value);
        }
        return this[name];
    };
    Triangle.prototype.getAngle = function (name) {
        if (['alpha', 'beta', 'gamma'].indexOf(name) === -1) {
            return undefined;
        }
        return object.degrees(this[name]);
    };
    Triangle.prototype.calcAngle = function (name) {
        if (['alpha', 'beta', 'gamma'].indexOf(name) === -1) {
            return undefined;
        }
        if (name === 'alpha') {
            return this.b === 0 || this.a === 0 ? 0 : this.a / this.b;
        } else if (name === 'beta') {
            return undefined
        } else {
            return undefined
        }
    };

    return object;
})();
let LinearTimingFunction = function (configs) {
    this.value = configs.value;
    this.initValue = configs.value;
    this.from = configs.from || 0;
    this.to = configs.to || 0;
    this.timeAcc = 0;
    this.time = configs.time || 1000;
    this.progress = 0; /**0 - 1*/
    this.direction = true;
    this.action = false;

    this.main = function () {
        if (this.action) {
            this.timeAcc = this.direction ? Math.ceil(this.timeAcc + tickTime) : Math.ceil(this.timeAcc - tickTime);

            this.progress = this.timeAcc / this.time;
            this.value = this.initValue + this.progress * (this.to - this.from);

            if(this.progress >= 1) {
                this.timeAcc = this.time;
                this.action = false;
                this.progress = 1;
                this.value = this.to;
                this.direction = false;
            } else if(this.progress <= 0) {
                this.timeAcc = 0;
                this.action = false;
                this.progress = 0;
                this.value = this.from;
                this.direction = true;
            }

            console.log(this.progress + '  ' + this.value + '  ' + this.direction);
        }
    };
};

/**
 * Point
 * */
function Point(center, radius, color, text, id) {
    this.destroyed = false;
    this.hovered = false;
    this.center = center;
    this.radius = radius;
    this.color = color;
    this.text = text;
    this.id = id === undefined ? uniqid.process() : id;
    this.tF = new LinearTimingFunction({value: radius, from: radius, to: radius * 2, time: 400});
}
Point.centerGet = function () {
    return JSON.parse(this.center);
};
Point.centerSet = function (center) {
    this.center = Object.assign(this.center, center);
};
Point.draw = function (ctx) {
    ctx.save();

    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2, false);

    if (isHover(ctx, mouse) && !this.hovered) {
        this.tF.action = true;
        this.tF.direction = true;
        this.text = Number.prototype.toFixed.call(this.radius, 3);
        this.hovered = true;
    } else if (!isHover(ctx, mouse) && this.hovered) {
        this.tF.action = true;
        this.tF.direction = false;
        this.text = undefined;
        this.hovered = false;
    }

    this.tF.main();
    this.radius = this.tF.value;

    if (this.hovered) {
        ctx.fillStyle = 'blue';
    } else {
        ctx.fillStyle = this.color;
    }

    ctx.fill();
    ctx.restore();
    ctx.save();

    ctx.fillStyle = 'black';
    ctx.beginPath();
    // if (this.text !== undefined) {
    //     ctx.strokeStyle = 'white';
    //     ctx.textAlign = 'center';
    //     ctx.strokeText(this.text, this.center.x, this.center.y);
    // }
    ctx.fill();
    ctx.restore();
};
Point.render = function (ctx) {
    if (this.destroyed) return;

    this.draw(ctx);
};
Point.prototype = (function () {
    return {
        centerGet: Point.centerGet,
        centerSet: Point.centerSet,
        draw: Point.draw,
        render: Point.render,
        constructor: Point
    };
}());

/**
 * Circle points
 */
function CirclePoints(center, radius) {
    this.destroyed = false;
    this.calculation = false;
    this.points = [];
    this.center = center;
    this.radius = radius;
}
CirclePoints.centerGet = function () {
    return JSON.parse(this.center);
};
CirclePoints.centerSet = function (center) {
    this.center = Object.create(this.center, center);
};
CirclePoints.pointInit = function (point) {
    let _point = Object.assign(point, R.clone(point));

    _point.centerSet(this.center);

    this.points.push(_point);
};
CirclePoints.deletePoint = function (id) {
    if(id !== undefined ) {
        const pointIndex = this.points.findIndex(p => p.id === id);
        if(pointIndex !== -1){
            const point = this.points.splice(pointIndex, 1);
            point.destroyed = true;
        }
    }else {
        const point = this.points.pop();
        point.destroyed = true;
    }
};
CirclePoints.pointsPositionSet = function () {
    let angle = 0,
        index,
        triangle,
        angles = [];

    if (!this.calculation) {
        this.calculation = true;
        initialPointAngleSet.call(this);

        if (Math.ceil(angle) - 360 > 10) {
            this.radius += Math.floor((Math.ceil(angle) - 360) / 15);
        } else if (Math.ceil(angle) - 360 < -30) {
            this.radius += Math.floor((Math.ceil(angle) - 360) / 15);
        }
        if(this.radius < 1){
            this.radius = 1;
        }

        pointAngleSet.call(this);
        this.calculation = false;
    }


    function initialPointAngleSet() {
        for (index = 0; index < this.points.length; index++) {
            let sideA = this.points[index].radius * 4;

            if (this.points[index - 1] !== undefined && this.points[index - 1].radius > this.points[index].radius) {
                sideA = this.points[index - 1].radius * 4;
            } else if (index > 0) {
                sideA = this.points[index].radius * 4;
            } else if (this.points[this.points.length - 1] !== undefined && this.points[this.points.length - 1].radius > this.points[index].radius) {
                sideA = this.points[this.points.length - 1].radius * 4;
            }

            triangle = new Geom.triangle({}, {}, {a: sideA, b: this.radius});
            angle += (Geom.degrees(triangle.alpha));
            angles.push(angle);
        }
    }

    function pointAngleSet() {
        let angleSum = 0,
            different = 360 - angle;

        for (index = 0; index < this.points.length; index++) {
            let a = angles[index],
                p = this.points[index],
                _angle = a + angleSum;

            angleSum += different / angles.length;

            p.center.x = this.center.x + (this.radius * Math.cos(Geom.rads(_angle)));
            p.center.y = this.center.y + (this.radius * Math.sin(Geom.rads(_angle)));
        }
    }
};
CirclePoints.drawPoints = function (ctx) {
    this.points.forEach(function (point) {
        point.render(ctx);
    });
};
CirclePoints.draw = function (ctx) {
    ctx.save();

    //ctx.strokeStyle = 'RGBA(255,0,0,0.1)'; //red
    // ctx.beginPath();
    // ctx.arc(this.center.x, this.center.y, this.radius, Geom.rads(0), Geom.rads(360), false);
    //
    // ctx.stroke();
    // ctx.restore();

    this.drawPoints(ctx);
};
CirclePoints.render = function (ctx) {
    if (this.destroyed) return;

    this.pointsPositionSet();
    this.draw(ctx);
};
CirclePoints.prototype = (function () {

    return {
        centerGet: CirclePoints.centerGet,
        centerSet: CirclePoints.centerSet,
        pointInit: CirclePoints.pointInit,
        deletePoint: CirclePoints.deletePoint,
        drawPoints: CirclePoints.drawPoints,
        pointsPositionSet: CirclePoints.pointsPositionSet,
        draw: CirclePoints.draw,
        render: CirclePoints.render,
    };
}());

/**
 * Side Functions
 * */
function addPoint(radius, id) {
    const _radius = radius !== undefined ? radius : Math.random() * 45 + 5;
    if(core.hasOwnProperty('CP')){
        const newPoint = new Point(
            {x: 300, y: 300},
            _radius,
            'RGBA(50,50,50, 1)',
            undefined,
            id
        );
        core.CP.pointInit(newPoint);
    }
}
function removePoint(id) {
    if(core.hasOwnProperty('CP')){
        core.CP.deletePoint(id);
    }
}
function getPoints() {
    if(core.hasOwnProperty('CP')){
        return core.CP.points.map(p => p.id);
    }else {
        return [];
    }
}

/**
 * Initialize
 * */
function CanvasInit(canvasId) {
    /**
     * requestAnimationFrame SET
     */
    window.requestAnimationFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, tickTime);
            };
    })();

    // Vars
    let canvas, context,
        screenWidth, screenHeight;

    // Event Listeners
    function resize(e) {
        screenWidth = canvas.width = canvas.parentNode.offsetWidth;
        screenHeight = canvas.height = canvas.parentNode.offsetHeight;
        context = canvas.getContext('2d');
    }

    // Init
    canvas = document.getElementById(canvasId);
    window.addEventListener('resize', resize, false);
    resize(null);

    canvas.onmousemove = function (e) {
        let rect = this.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    };

    core.CP = new CirclePoints({x: canvas.width / 2, y: canvas.height / 2}, 300);

    // core.CP.pointInit(new Point({x: 300, y: 300}, 20, 'RGBA(50,50,50, 1)'));
    // core.CP.pointInit(new Point({x: 300, y: 300}, 25, 'RGBA(50,50,50, 1)'));
    // core.CP.pointInit(new Point({x: 300, y: 300}, 30, 'RGBA(50,50,50, 1)'));

    // Start Update

    const loop = function () {

        context.save();
        context.fillStyle = 'white';
        context.fillRect(0, 0, screenWidth, screenHeight);
        context.restore();

        /**Circle Points*/
        core.CP.render(context);

        requestAnimationFrame(loop);
    };
    loop();
    core.initiated = true;
}

export default {
    init: CanvasInit,
    addPoint,
    removePoint,
    getPoints,
    isInitiated: () => core.initiated,
    destroy: () => core.initiated = false
}


