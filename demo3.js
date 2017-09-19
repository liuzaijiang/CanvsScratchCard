var canvasWidth = 320;
var canvasHeight = 510;
var canvasClipRaduis = 20;
var c = document.getElementById("blur-canvas");
var ctx = c.getContext("2d");
c.width = canvasWidth;
c.height = canvasHeight;

var clipRegion = {
	x : Math.floor(Math.random() * (canvasWidth - canvasClipRaduis * 2)) + canvasClipRaduis + 1,
	y : Math.floor(Math.random() * (canvasHeight - canvasClipRaduis * 2)) + canvasClipRaduis + 1,
	r : canvasClipRaduis
};

var img = new Image();
img.src = 'image2.jpg'
	img.onload = function () {
	draw(img, clipRegion);
}

function draw(img, clipRegion) {
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
}



$("#blur-canvas").mousedown(function (e) {
		$("#blur-canvas").mousemove(function (e) {
			clipRegion.x = e.clientX - c.getBoundingClientRect().left;
			clipRegion.y = e.clientY - c.getBoundingClientRect().top;	
            mosaic(clipRegion.x-clipRegion.r,clipRegion.y-clipRegion.r,clipRegion.r*2,clipRegion.r*2)
		})
})

$("#blur-canvas").mouseup(function (e) {
	$("#blur-canvas").unbind("mousemove");
})

function mosaic(mx,my,mw,mh) {
    var tmpImageData=ctx.getImageData(mx, my, mw, mh);
    var tmpPixelData=tmpImageData.data;
    
    var imageData=ctx.getImageData(mx,my, mw, mh);
    var pixelData=imageData.data;
    
    var size=10;
    var totalnum=size*size;
    for(var i=0;i<mh;i+=size)
    {
        for(var j=0;j<mw;j+=size)
        {
            var totalr=0,totalg=0;totalb=0;
            for(var dx=0;dx<size;dx++)
            {
                for(var dy=0;dy<size;dy++)
                {
                    var x=i+dx;
                    var y=j+dy;
                    
                    var p=x*mw+y;
                    totalr+=tmpPixelData[p*4+0];
                    totalg+=tmpPixelData[p*4+1];
                    totalb+=tmpPixelData[p*4+2];
                }
            }
            var p=i*mw+j;  
            var resr=totalr/totalnum;
            var resg=totalg/totalnum;
            var resb=totalb/totalnum;
            
            for( var dx=0;dx<size;dx++)
            {
                for(var dy=0;dy<size;dy++)
                {
                    var x=i+dx;
                    var y=j+dy;
                    
                    var p=x*mw+y
                    pixelData[p*4+0]=resr
                    pixelData[p*4+1]=resg
                    pixelData[p*4+2]=resb
                }                    
            }
        }
    }
	ctx.putImageData(imageData,mx,my);
}

function reset(){
    draw(img, clipRegion);
}
