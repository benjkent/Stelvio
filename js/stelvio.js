//window.addEventListener('load',eventAssetsLoaded,false);

var outputText = document.getElementById('positionOutput');
var startStopButton = document.getElementById("startStopAnimation");
startStopButton.addEventListener('click',startStopClick);

var pixels = window.devicePixelRatio;
var theCanvas = document.getElementById("canvasOne");
var context = theCanvas.getContext("2d");
var canvasWidth = theCanvas.width;
var canvasHeight = theCanvas.height;

var isDrawing = false;
var timer;

var curve = function(attenuation,lineWidth,opacity){
    this.attenuation = attenuation;
    this.lineWidth = lineWidth;
    this.opacity = opacity;
    this.color = "rgba(0, 255,255, " + this.opacity + ")";
}

var curves = new Array();
curves.push(new curve(1, 1.5, 1));
curves.push(new curve(-2, 1, 0.6));
curves.push(new curve(2, 1, 0.6));
curves.push(new curve(-6, 1, 0.2));
curves.push(new curve(4, 1, 0.4 ));
// Use this to auto play animation when page is loaded
//  function eventAssetsLoaded(){
//     canvasApp();
//  }

// Event listener for start-stop button
function startStopClick(){
    if(isDrawing == false){
        startStopButton.textContent ="Stop";
        canvasApp();
    }
    else{
        startStopButton.textContent ="Start";
        clearInterval(timer);
        context.clearRect(0,0,canvasWidth,canvasHeight);
    }
    isDrawing = !isDrawing;
}
function canvasApp(){
   
    var speed = 0.1;
    var ATT_FACTOR = 4;
    var Amplitude_Factor = 0.6;
    var ratio = pixels;
    var height = ratio * canvasHeight;
    var phase = 0;
    var heightMax = (height / 2) - 6;
    var amplitude = 1;   // Use amplitude to reduce to zero for start and stop.
    var frequency = 6;
    var GRAPH_X = 2;

        
    function drawScreen(){
        
         phase = (phase + (Math.PI / 2) * speed) % (2 * Math.PI);
                
        // Define the canvas background
        context.fillStyle = "#021a35";
        context.fillRect(0,0,theCanvas.width,theCanvas.height);
        // Box outline
        context.strokeStyle = "#ffffff";
        context.strokeRect(1,1,theCanvas.width -2,theCanvas.height -2);
                
        // draw all the waves
        for(var i = 0; i < curves.length; i++){
                drawWave(curves[i].attenuation, curves[i].lineWidth,curves[i].color);
        }
                
        // USE for DEBUGGING ANY values
        //outputText.innerText = ("Phase: "+ Math.round(phase * 100) / 100);       
    }

    // Does all the canvas drawing for each wave
    function drawWave(waveAttenuation, waveThickness, waveColor){
        context.beginPath();
        context.strokeStyle = waveColor;
        for(let i = -2; i < 2; i += 0.01){
            const x = xpos(i);
            const y = ypos(i,waveAttenuation);
            context.lineTo(x,y + (canvasHeight / 2));
        }
        context.lineWidth = waveThickness;
        context.stroke();
    }
    function globalAttFn(x){
        return Math.pow(ATT_FACTOR / (ATT_FACTOR + Math.pow(x, ATT_FACTOR)), ATT_FACTOR);
    }
    function xpos(i){
        return canvasWidth * ((i + GRAPH_X) / (GRAPH_X * 2));
    }
    function ypos(i, attenuation){
        return (
            Amplitude_Factor *    
            (globalAttFn(i) * 
                (heightMax * amplitude) *
                (1 / attenuation) * 
                Math.sin(frequency * i - getPhase(phase)))
        );
    }
    function getPhase(p){
        return (p + (Math.PI / 2) * speed) % (2 * Math.PI);
    }
    
    timer = setInterval(drawScreen,33); 
}

