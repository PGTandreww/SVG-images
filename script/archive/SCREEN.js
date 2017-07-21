// $import="windows.js"
// $XXXreturn$

function generate(evt)
{
// $initialize$


if(height == 0)
	height = 48;
if(width == 0)	
	width = 36;


var color = "white";  // TODO: inherit finish from window
if(color == "")
	color = "gray";	
	
if(color == "ALMOND")
	color = "BlanchedAlmond";  // web color

if(screen_matl == "")
	screen_matl = "FIBERGLASS";
	
	var frame_x = 0;
	var frame_y = 0;

	var frame_w = width; 
	var frame_h = height; 

	initMitredFrame("frame",
				0, // x 
				0,	// y
				width,	// w
				height,	// y
				.75,color);			// f (frame extrusion width)
	
	createDescription("frame","Screen frame " +width + " X " + height + " 3/4\" aluminum screen frame extrusion.");
	
	set("screen","style", (screen_matl == "FIBERGLASS"? "fill: url(#screen_fiberglass)":"fill: url(#screen_wire)") );
	set("screen","x",  frame_x + .75 );
	set("screen","y",  frame_y + .75 );
	set("screen","width",  frame_w - 1.5 );
	set("screen","height", frame_h -  1.5 );
//	createDescription("screen",screen_matl + " mesh screen ");
			
	createDim(0,frame_h + 3,frame_w,frame_h + 3,true);
	createDim(frame_w + 2,0,frame_w + 2,frame_h,true);
	
//	returnConfigData();
}

