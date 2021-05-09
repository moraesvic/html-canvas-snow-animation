function randint(a, b){
    /* returns random integer in [a, b[ */
    a = Math.floor(a);
    b = Math.floor(b);
    return a + Math.floor(Math.random() * (b - a));
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

class Rect
{
    constructor(x, y, xsize, ysize, xvel, yvel, rgb)
    {
        this.x = x;
        this.y = y;
        this.xsize = xsize;
        this.ysize = ysize;
        this.xvel = xvel;
        this.yvel = yvel;
        this.rgb = rgb;
        this.age = randint(0,50);
        this.life = randint(300,500);
    }

    draw(canvas)
    {
        if(this.age > this.life)
            return;

        const ctx = canvas.getContext('2d');
        const a = this.age > (this.life / 3.0) ?
            1.0 - this.age/this.life :
            0.66;
        
        ctx.fillStyle = RGBAToString(this.rgb, a);
        ctx.fillRect(this.x, this.y, this.xsize, this.ysize);
    }

    move(canvas)
    {
        if(this.age > this.life)
            return;

        this.age++;
        this.x += this.xvel;
        if(this.x > canvas.width)
        {
            this.x = canvas.width;
            this.xvel = -this.xvel;
        }
        else if(this.x < 0)
        {
            this.x = 0;
            this.xvel = -this.xvel;
        }

        this.y += this.yvel;
        if(this.y > canvas.height)
        {
            this.y = canvas.height;
            this.yvel = -this.yvel;
        }
        else if(this.y < 0)
        {
            this.y = 0;
            this.yvel = -this.yvel;
        }
    }
}

function smooth(x)
{
    /* [0, 255] -> [0, 255] */
    return 255 * Math.sin(Math.PI/512 * x);
}

async function main(){
    console.log('hi');
    const layer1 = document.getElementById('canvasLayer1');
    const layer2 = document.getElementById('canvasLayer2');
    if(!layer1 || !layer2){
        alert('could not load canvas. website will not load properly. sorry :(');
        return;
    }

    const ctx1 = layer1.getContext('2d');
    const width = layer1.width;
    const height = layer2.height;

    var rgbSky = new RGB(0,0x20,0xff);
    

    var loopNumber = 0;
    /*
    const SkyEnum = Object.freeze(
    {
        'brighter':{},
        'darker1':{},
        'darker2':{}
    });

    rgbSky.dir = SkyEnum.brighter;
    */
    var t1 = 0;
    var sinAlphaT1 = 0;

    var t2 = 0;
    var sinAlphaT2 = 0;

    const FPS   = 20;
    const MS_PER_FRAME = 1000.0 / FPS;

    const PERIOD = 20.0; /* given in seconds */
    const ALPHA  = 2*Math.PI / (PERIOD * FPS);
    const R_AMP  = 0x80;
    const G_AMP  = 0xd0;
    const B_AMP  = 0xc0;

    var path = 1;

    while(true)
    {
        var timer = new Promise(res => setTimeout(res, MS_PER_FRAME));
        ctx1.fillStyle = RGBAToString(rgbSky, 1.0);
        ctx1.fillRect(0, 0, width, height);

        if(path === 1)
        {
            sinAlphaT1 = Math.sin(ALPHA * t1);

            rgbSky.r = R_AMP * sinAlphaT1;
            rgbSky.g = G_AMP * sinAlphaT1;

            if(sinAlphaT1 < 0)
            {
                rgbSky.r = 0;
                rgbSky.g = 0;
                t1 = 0;
                path = 2;
            }
            else
                t1++;
        }
        else if(path === 2)
        {
            sinAlphaT2 = Math.sin(ALPHA * t2);
            rgbSky.b = 0xff - B_AMP * sinAlphaT2;
            if(sinAlphaT2 < 0)
            {
                rgbSky.b = 0xff;
                t2 = 0;
                path = 1;
            }
            else
            {
                t2++;
            }
        }

        if(loopNumber % 60 === 0)
        {
            rgbSky.r = Math.floor(rgbSky.r);
            rgbSky.g = Math.floor(rgbSky.g);
            rgbSky.b = Math.floor(rgbSky.b);
            console.log(rgbSky);
        }

        loopNumber++;
        await timer;
    }
    
    
    /* */
    
    
}