function randint(a, b){
    /* returns random integer in [a, b[ */
    a = Math.floor(a);
    b = Math.floor(b);
    return a + Math.floor(Math.random() * (b - a));
}

function randfloat(a, b){
    /* returns random float in [a, b] */
    return a + Math.random() * (b - a);
}

const GAUSSIAN_SAMPLE = 100;

function randfloatGaussian(a, b){
    var sum = 0;
    for(var i = 0; i < GAUSSIAN_SAMPLE; i++)
        sum += Math.random();
    return (b - a) / 2 * (1 + randsign() * sum / GAUSSIAN_SAMPLE);
}

function randsign(){
    return Math.random() > 0.5 ? 1 : -1;
}

class RGB
{
    constructor(r,g,b)
    {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}

function RGBAToString(rgb, a)
{
    var retString = 'rgb(' + rgb.r + ','
                           + rgb.g + ','
                           + rgb.b + ','
                           + a + ')';
    return retString;                           
}

async function sky(canvas){
    /* CONSTANTS AND CONTROLLERS */
    const FPS   = 20;
    const MS_PER_FRAME = 1000.0 / FPS;

    /* The length of the day/night is in trigonometric terms
       actually a half-period.
       Alpha calculation takes that into consideration */
    /* given in seconds */
    const LENGTH_DAY = 10.0;
    const ALPHA_DAY  = Math.PI / (LENGTH_DAY * FPS);
    const LENGTH_NIGHT = 20.0;
    const ALPHA_NIGHT  = Math.PI / (LENGTH_NIGHT * FPS);
    const R_AMP  = 0x40;
    const G_AMP  = 0xa0;
    const B_AMP  = 0xc0;

    const SkyEnum = Object.freeze({ 'day':{}, 'night':{} });

    /* STARTING STUFF */
    const ctx = canvas.getContext('2d');
    var rgbSky = new RGB(0,0x20,0xff);
    var t = sinAlphaT = loopNumber = 0;
    var timeOfDay = SkyEnum.day;

    while(true)
    {
        var timer = new Promise(res => setTimeout(res, MS_PER_FRAME));
        ctx.fillStyle = RGBAToString(rgbSky, 1.0);
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if(timeOfDay === SkyEnum.day)
        {
            sinAlphaT = Math.sin(ALPHA_DAY * t);
            rgbSky.r = R_AMP * sinAlphaT;
            rgbSky.g = G_AMP * sinAlphaT;

            if(sinAlphaT < 0)
            {
                rgbSky.r = 0;
                rgbSky.g = 0;
                t = 0;
                timeOfDay = SkyEnum.night;
            }
            else
                t++;
        }
        else if(timeOfDay === SkyEnum.night)
        {
            sinAlphaT = Math.sin(ALPHA_NIGHT * t);
            rgbSky.b = 0xff - B_AMP * sinAlphaT;
            if(sinAlphaT < 0)
            {
                rgbSky.b = 0xff;
                t = 0;
                timeOfDay = SkyEnum.day;
            }
            else
                t++;
        }

        /* FOR DEBUG */
        if(loopNumber % 60 === 0)
        {
            rgbSky.r = Math.floor(rgbSky.r);
            rgbSky.g = Math.floor(rgbSky.g);
            rgbSky.b = Math.floor(rgbSky.b);
            // console.log(rgbSky);
        }

        loopNumber++;
        await timer;
    }
}

/* Snowflake constants */
const SF =
{
    fps:        30.0,
    msPerFrame: 33,
    minRadius:  0.5,
    maxRadius:  2.0,
    minXVel:    0.0,
    maxXVel:    0.5,
    minYVel:    1.0,
    maxYVel:    2.0,
    minAmp:  10.0,
    maxAmp:  500.0,
    /* periods given in seconds */
    minPeriod: 10.0,
    maxPeriod: 20.0,
    startAngle: 0,
    endAngle:   Math.PI*2,
    white:      Object.freeze(new RGB(0xff,0xff,0xff))
}

class Snowflake
{
    constructor(width)
    {
        this.x = randint(0,width);
        this.y = 0;
        this.radius = randfloatGaussian(SF.minRadius,SF.maxRadius);
        this.transparency = 0.4 + 0.35 * Math.random();

        this.t = 0;
        this.xVel = randsign() * randfloat(SF.minXVel, SF.maxXVel);
        this.yVel = randfloat(SF.minYVel, SF.maxYVel);

        const period = 2.0*Math.PI / randfloat(SF.minPeriod,SF.maxPeriod) / SF.msPerFrame;
        const amp    = randfloat(SF.minAmp,SF.maxAmp);
        this.xPos = t => randint(0,width) + amp*Math.sin(period*t);
    }

    draw(ctx)
    {
        if(this.x > 1.1 * canvasWidth || this.x < -0.1 * canvasWidth
            || this.y > 1.1 * canvasHeight || this.y < -0.1 * canvasHeight)
                return;
            
        ctx.fillStyle = RGBAToString(SF.white, this.transparency);
        ctx.strokeStyle = RGBAToString(SF.white, this.transparency);
        ctx.translate(this.x + 0.5,this.y + 0.5);

        for(var i = 0; i < 3; i++)
        {
            ctx.rotate(2 * Math.PI / 3);
            ctx.beginPath();
            ctx.moveTo(-this.radius, 0);
            ctx.lineTo(this.radius, 0);
            ctx.stroke();
        }

        ctx.translate(-this.x - 0.5,-this.y - 0.5);
        
        /*
        ctx.arc(this.x, this.y, this.radius, SF.startAngle, SF.endAngle);
        ctx.fill();
        */

    }

    move()
    {
        this.x += this.xVel / this.radius;
        this.xVel += randfloat(-SF.maxXVel, SF.maxXVel) / 10.0;

        this.y += this.yVel;
        ///this.yVel += 0.05;
        if(this.radius < 1.5)
            this.y -= 0.8 * randfloat(SF.minYVel, SF.maxYVel);

        this.t++;
        if(this.t > 1200)
            this.transparency -= 0.005;
    }
}

async function snow(canvas){
    /* */
    const ctx = canvas.getContext('2d');
    
    var flakes = [];
    
    for(var loopNumber = 0; ; loopNumber++)
    {
        var timer = new Promise(res => setTimeout(res, SF.msPerFrame));
        ctx.clearRect(0,0,canvas.width,canvas.height);

        flakes.forEach(el =>
        {
            el.move();
            el.draw(ctx);
        });

        flakes.push(new Snowflake(canvas.width));
        
        if(loopNumber % 120 === 0)
        {
            console.log(flakes.length);
            for(var i = 0; i < flakes.length; i++)
                if(flakes[i].transparency <= 0.0)
                    flakes.splice(i,1);
        }

        await timer;
    }
}

var canvasWidth, canvasHeight;

function resizeCanvas(){
    const canvasContainer = document.getElementById('canvasContainer');
    const desiredHeight = canvasContainer.offsetWidth * 9.0 / 16.0;
    canvasWidth = document.getElementById('canvasLayer1').width;
    canvasHeight = document.getElementById('canvasLayer1').height;
    canvasContainer.setAttribute('style','height:' + desiredHeight + 'px');
}

async function main(){
    console.log('hi');
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    

    const layer1 = document.getElementById('canvasLayer1');
    const layer2 = document.getElementById('canvasLayer2');
    if(!layer1 || !layer2){
        alert('could not load canvas. website will not load properly. sorry :(');
        return;
    }

    sky(layer1);
    snow(layer2);
    

    
    
    /* */
    
    
}