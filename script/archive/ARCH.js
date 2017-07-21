
// $import="windows.js"
function generate(evt)
{
// $initialize$

var height = dimsToInches(height_ft,height_in,height_frac);
var width = dimsToInches(width_ft,width_in,width_frac);

if(height == 0)
	height = 24;
if(width == 0)	
	width = 48;

if(color == "")
	color = "gray";	
if(color == "ALMOND")
	color = "BlanchedAlmond";  // web color
if(grid == "")
	grid = "NONE";
if(grid_pattern == "")
	grid_pattern = "";

var FW = 3; // width of the frame extrusion
var frame_w = 0;
var frame_h = 0;

	
	frame_w = width; 
	frame_h = height; 
	
	var frame = drawing.getElementById("frame");
	
//	var d = "M 0,%H% A %H%,%H% 0 0,1 %W%,%H% L 0,%H%";
	var d = "M 0,%H% A %H%,%H% 0 0,1 %W%,%H% l -%FW%,0 " +
		    "A %H2%,%H2% 180 0,0 %FW%,%H% l -%FW%,0";
	
	d=d.replace(/%W%/g,frame_w);
	d=d.replace(/%H%/g,frame_h);
	d=d.replace(/%W2%/g,frame_w-FW);
	d=d.replace(/%H2%/g,frame_h-FW);
	d=d.replace(/%FW%/g,FW);
	
	try{
//	alert("frame d="+d);
		frame.setAttribute("d",d);
		frame.setAttribute("style","fill: "+color);
	}
	catch(e){alert("frame d="+d);}
	createDescription("frame", "Arch WIDTH: " + width + "  HEIGHT: " + height + ".");
	
	var glass = drawing.getElementById("glass_pane");
	d = "M %FW%,%H% A %HG%,%HG% 0 0,1 %WG%,%H% L %FW%,%H%";
	d=d.replace(/%H%/g,frame_h);
	d=d.replace(/%WG%/g,(frame_w-FW+1)+"");
	d=d.replace(/%HG%/g,(frame_h-FW+1)+"");
	d=d.replace(/%FW%/g,FW-1);
	try{
//	alert("glass d="+d);
		glass.setAttribute("d",d);
	}
	catch(e){alert("glass d="+d);}
	createDescription("glass_pane", "Glass Arch WIDTH: " + (frame_w-FW+1) + "  HEIGHT: " + (frame_h-FW+1) + ".");
	
	var glassBottom = drawing.getElementById("frame_base");
	d = d="M %FWX%,%HGB% L %WGB%,%HGB% l 1,%FW% l -%WGB2%,0 l 1,-%FW% ";
	d=d.replace(/%HGB%/g,frame_h-(FW));
	d=d.replace(/%WGB%/g,frame_w-FW+.25);
	d=d.replace(/%WGB2%/g,frame_w-(2*FW)+2);
	d=d.replace(/%FW%/g,FW);
	d=d.replace(/%FWX%/g,FW+.25);
	try{
//	alert("frame_base d="+d);
		glassBottom.setAttribute("d",d);
		glassBottom.setAttribute("style","fill: "+color);
		
	}
	catch(e){alert("frame_base d="+d);}
	createDescription("frame_base", "Base WIDTH: " + (frame_w-FW) + "  HEIGHT: " + (frame_h-FW) + ".");

		
	createDim(0,frame_h + 3,frame_w,frame_h + 3,true);
	createDim(frame_w + 2,0,frame_w + 2,frame_h,true);
	
	
	var arches = 0;
	var spokes = 1;
//	alert("grid pattern="+grid_pattern);
	switch(grid_pattern.charAt(0))
	{
		case 'A':
				arches = grid_pattern.charAt(1);
				spokes = grid_pattern.substring(3);
				drawArchGrids(width,height,FW,arches-0,spokes-0, false, color);
				break;
		case 'S':
				spokes = grid_pattern.charAt(1);
				arches = grid_pattern.length == 4 ? grid_pattern.substring(3) : 0;
						 
				drawArchGrids(width,height,FW,arches-0, spokes-0, true, color);
				break;
		default:
				break;
	}
}

