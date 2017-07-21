// $import="windows.js"
var drawing = null;
// $return$

function generate(evt)
{
drawing = evt.getTarget().getOwnerDocument();

// $initialize$

var PAD = nested=="true"?0:9;
adjustDocSize(width,height,docWidth,docHeight,PAD);

if(color === "")
{
	color = "gray";	
}
	
if(color == "ALMOND")
{
	color = "BlanchedAlmond";  // web color
}

if(grid === "")
{
	grid = "NONE";
}

	var frame_x = 0;
	var frame_y = 0;

	var frame_w = width; 
	var frame_h = height; 

	initMitredFrame("frame",
				0, // x 
				0,	// y
				width,	// w
				height,	// y
				1.25,color);			// f (frame extrusion width)

	initRect("sill",0,frame_h - 1,frame_w,1,color);


	initGlass("t_glass","t_sash",
				frame_x + 1.25 + 0.75, // x 
				frame_y + 1.25 + 0.75,	// y
				frame_w - 2.5 - 1.5,	// w
				frame_h - sash_height - 2.5,	// h
				0.75);			// o (sash overlap)

	var vert = 0;
	var horz = 0;

	if(grid != "NONE")
	{
		vert = grid_pattern.charAt(0)-0;
		horz = grid_pattern.charAt(2)-0;
		drawGrid("t_glass_pane","t_grid_",vert,horz,color);
	}

	initMitredFrame("t_sash",
				frame_x + 1.25, // x 
				frame_y + 1.25,	// y
				frame_w - 2.5,	// w
				frame_h - sash_height - 2.5 + 1.5,	// h
				1.5,color);			// f (sash frame extrusion width)

	initGlass("b_glass","b_sash",
				frame_x + 1.25 + 0.75, // x 
				frame_y + (frame_h - sash_height - 1.25) + 0.75,	// y
				frame_w - 2.5 - 1.5,	// w
				sash_height - 1.5,	// h
				0.75);			// o (sash overlap)
	
	if(grid != "NONE")
	{
		vert = grid_pattern.charAt(0)-0;
		horz = grid_pattern.charAt(2)-0;
		drawGrid("b_glass_pane","b_grid_", vert,horz,color);
	}
	
	initMitredFrame("b_sash",
				frame_x + 1.25, // x 
				frame_y + (frame_h - sash_height - 1.25),	// y
				frame_w - 2.5,	// w
				sash_height,	// h
				1.5,color);			// f (sash frame extrusion width)
	createDim(0,frame_h + 3,frame_w,frame_h + 3,true);
	createDim(frame_w + 2,frame_h - sash_height - 1.25, frame_w + 2, frame_h - 1 ,true);
	createDim(frame_w + 6,0,frame_w + 6,frame_h,true);

	// Display slide direction indications
	initDirection("t_direction","t_glass_pane","D");
	initDirection("b_direction","b_glass_pane","U");



// INSERT YOUR SCRIPTING HERE!!!!!



	returnConfigData();  // post values to confguration code
}

