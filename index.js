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

function randomRGB(){
    var myRandomRGB = new RGB
    (
        randint(0,256),
        randint(0,256),
        randint(0,256)
    );
    console.log(myRandomRGB);
    return myRandomRGB;
}

function randomRGBString(){
    var myRandomRGB = randomRGB();
    var retString = 'rgb(' + myRandomRGB.r + ','
                           + myRandomRGB.g + ','
                           + myRandomRGB.b
                           + ')'
    console.log(retString);
    return retString;
}

function RGBToString(rgb)
{
    var retString = 'rgb(' + rgb.r + ','
                           + rgb.g + ','
                           + rgb.b + ','
                           + ')';
    return retString;                           
}

function randomRGBAString(a){
    var myRandomRGB = randomRGB();
    var retString = 'rgb(' + myRandomRGB.r + ','
                           + myRandomRGB.g + ','
                           + myRandomRGB.b + ','
                           + a + ')';
    console.log(retString);
    return retString;
}

function RGBAToString(rgb, a)
{
    var retString = 'rgb(' + rgb.r + ','
                           + rgb.g + ','
                           + rgb.b + ','
                           + a + ')';
    return retString;                           
}

function createRect(canvas, sizeX, sizeY){
    const width = canvas.width;
    const height = canvas.height;

    const ctx = canvas.getContext('2d');
    var a, b;
    a = randint(-sizeX, width);
    b = randint(-sizeY, height);
    
    ctx.fillStyle = randomRGBAString(0.5);
    ctx.fillRect(a, b, sizeX, sizeY);
}

function createRect2(){
    const canvas = document.getElementById('canvasMain');

    const width = canvas.width;
    const height = canvas.height;

    const sizeX = 50;
    const sizeY = 50;

    const ctx = canvas.getContext('2d');
    var a, b;
    a = randint(-sizeX, width);
    b = randint(-sizeY, height);
    
    ctx.fillStyle = randomRGBAString(0.5);
    ctx.fillRect(a, b, sizeX, sizeY);
}

var myRects = [];

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

function createRect3(){
    const canvas = document.getElementById('canvasMain');

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const maxx = 100;
    const maxy = 100;
    const maxvelx = 5;
    const maxvely = 5;

    const xsize = randint(0,maxx);
    const ysize = randint(0,maxy);

    myRects.push(new Rect
    (
        randint(-xsize,width),
        randint(-ysize,height),
        xsize,
        ysize,
        randint(-maxvelx,maxvelx),
        randint(-maxvely,maxvely),
        randomRGB()
    ));
}

function superCreate(){
    for(var i = 0; i < 10; i++)
        createRect3();
}

async function main(){
    console.log('hi');
    const canvas = document.getElementById('canvasMain');
    if(!canvas){
        alert('could not load canvas. website will not load properly. sorry :(');
        return;
    }

    canvas.addEventListener('click',superCreate);
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const maxrects = 5;
    
    for(var i = 0; i < maxrects; i++)
        createRect3();

    /* LOOP */
    var loopNumber = 1;
    while(true)
    {
        var timer = new Promise(res => setTimeout(res, 20));
        console.log(myRects.length);
        ctx.clearRect(0,0,width,height);
        for(var i = 0; i < myRects.length; i++)
        {
            myRects[i].move(canvas);
            myRects[i].draw(canvas);
        }

        if(loopNumber % 60 === 0)
            for(var i = 0; i < myRects.length; i++)
            {
                if(myRects[i].age > myRects[i].life)
                {
                    myRects.splice(i, 1);
                    i--;
                }
            }

        loopNumber++;
        await timer;
    }
    
    
    /* */
    
    
}