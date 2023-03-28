let canvas;
let ctx;
let circleRadius = 340
let sqrtCircleRadius = Math.sqrt(circleRadius)
let circleWidth = 5
let gravity = 0.2

window.onload  = function () {
    canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

    } else {
        console.log("Canvas is not supported!!")
    }

    b = new Ball([canvas.width/2 + 100, canvas.height/2-100])

    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //Draw Circle
    detail = 1000

    for (i = 0; i <= detail; i++) {
        angle = i / detail * Math.PI / 2

        color = HSVtoRGB(i / detail, 1, 1);

        hue = 1

        strColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${hue})`;

        point = [canvas.width / 2 + Math.cos(angle) * circleRadius,
            canvas.height / 2 + Math.sin(angle) * circleRadius]

        drawCircle(ctx, point[0], point[1], circleWidth, strColor, false, 0)
        drawCircle(ctx, canvas.width - point[0], point[1], circleWidth, strColor, false, 0)
    }

    bound = circleRadius-5

    for (x=canvas.width/2-bound;x<canvas.width/2+bound;x++) {
        for (y=canvas.height/2-bound;y<canvas.height/2+bound;y++) {
            if ( (canvas.width/2 - x)**2 + (canvas.height/2 - y)**2 < (bound)**2) {
                    ctx.fillStyle = "rgba(255,0,0,1)";
                    ctx.fillRect( x, y, 1, 1 );
            }
        }
    }



    function loop () {


        b.update()
    }
};

let tAngle, nAngle, cAngle
let speed, newAngle, d, p, t, color, hue
class Ball{
    constructor(pos) {
        this.pos = pos
        this.vel = [0, 0]
        this.acc = [0, gravity]
        this.radius = 10
        this.lastColor = 'rgba(255, 255, 255, 1)'
        this.bounces = 0
    }

    update() {
        this.pos = addVec( this.pos, this.vel )
        this.vel = addVec( this.vel, this.acc )

        if (Math.sqrt((canvas.width/2-this.pos[0])**2 + (canvas.height/2-this.pos[1])**2) + this.radius + circleWidth > circleRadius) {
            this.vel[1] *= -1
            if ((canvas.width/2-this.pos[0]) != 0) {
                nAngle = Math.atan((canvas.height / 2 - this.pos[1]) / (canvas.width / 2 - this.pos[0])) + Math.PI
                //nAngle = Math.acos(( this.pos[0] - canvas.width/2 ) / ( circleRadius - circleWidth - this.radius )) + Math.PI

            } else {
                nAngle = Math.PI / 2
            }
            speed = Math.sqrt( this.vel[0]**2 + this.vel[1]**2 )
            tAngle = Math.acos( this.vel[0] / speed ) + Math.PI
            newAngle = 2 * nAngle - tAngle
            this.vel = [speed * Math.cos( newAngle ),
                        speed * Math.sin( newAngle )]

            d = [this.pos[0] + 50 * Math.cos(newAngle), this.pos[1] + 50 * Math.sin(newAngle)]
            p = [this.pos[0] + 50 * Math.cos(nAngle), this.pos[1] + 50 * Math.sin(nAngle)]
            t = [this.pos[0] + 50 * Math.cos(tAngle), this.pos[1] + 50 * Math.sin(tAngle)]

            //drawLine(ctx, this.pos, d, 'rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 1)', 5)
            //drawLine(ctx, this.pos, p, 'rgba(255, 255, 255, 1)', 'rgba(0, 0, 255, 1)', 5)
            //drawLine(ctx, this.pos, t, 'rgba(255, 255, 255, 1)', 'rgba(255, 0, 0, 1)', 5)

            cAngle = Math.atan((canvas.height / 2 - this.pos[1]) / -Math.abs(canvas.width / 2 - this.pos[0])) + Math.PI

            color = HSVtoRGB(2 * cAngle / Math.PI , 1, 1);

            hue = 1

            this.lastColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${hue})`;

            this.bounces  ++

        }

        this.draw()
    }

    draw() {
        drawCircle(ctx, this.pos[0], this.pos[1], this.radius, this.lastColor, false, 0)
    }
}


function drawCircle(ctx, x, y, radius, fill, stroke, strokeWidth) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
    }
    if (stroke) {
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = stroke;
        ctx.stroke();
    }
}

function drawLine(ctx, p1,p2, fill, stroke, strokeWidth) {
    ctx.beginPath();
    ctx.moveTo(p1[0],p1[1]);
    ctx.lineTo(p2[0],p2[1]);
    ctx.closePath();

    if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
    }
    if (stroke) {
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = stroke;
        ctx.stroke();
    }
}

function drawTriangle(ctx, p1, p2, p3, fill, stroke, strokeWidth) {
    ctx.beginPath();
    ctx.moveTo(p1[0],p1[1]);
    ctx.lineTo(p2[0],p2[1]);
    ctx.lineTo(p3[0],p3[1]);
    ctx.closePath();

    if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
    }
    if (stroke) {
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = stroke;
        ctx.stroke();
    }
}

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255)
    ];
}

function addVec(a, b) {
    return [a[0] + b[0], a[1] + b[1]];
}
