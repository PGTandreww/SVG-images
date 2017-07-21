// $import="windows.js"
// $return$

function generate(evt)
{
// $initialize$
if(height == null || height == 0)
{
	height = dimsToInches(height_ft,height_in,height_frac);
	leg_height = height/2;
}
if(width == null || width == 0)
{
	width = dimsToInches(width_ft,width_in,width_frac);
	head_width = width/2;
}

if(color == "")
	color = "gray";	
	
if(color == "ALMOND")
	color = "TAN";  // web color
if(grid_color == "ALMOND")
	grid_color = "TAN"; // web color

if(grid == "")
	grid = "NONE";


	if(gls_flag == 2)
	{
		initGlassClipTrap("glass","frame",0, 0, width, head_width, height, leg_height, adj_gls_w, .5, handing +"T");
	}
	if(grid != "NONE")
	{
		initGrid("glass_pane","grid_",	grid_pattern,grid_color,grid_thick);
	}

	if(fr_flag == 2)
	{
	//	initMitredClipTrapFrame("frame", 0, 0, width, head_width, height, leg_height, frame_t, color, handing + "T");
		initClipTrapFrame("frame", 0, 0, width, head_width, height, leg_height, frame_t,frame_t*1.5, color, handing + "T");
	}

	if(fr_flag == 2  && f_nested != "true")
	{
		if(handing == "L")
		{
			createDim(0,height + 4,width,height + 4,true);	//used for frame width dim
			createDim(width + 3,0,width + 3,height,true);	//used for frame height dim
			createDim(-3,height,-3,(height-leg_height),true);  //used for leg height dim
			createDim((width-head_width),-3,width,-3,true); // used for head width dim
		}
		if(handing == "R")
		{
			createDim(0,height + 4,width,height + 4,true);	//used for frame width dim
			createDim(-3,0,-3,height,true);	//used for frame height dim
			createDim(width+3,height,width+3,(height-leg_height),true);  //used for leg height dim
			createDim(0, -3,head_width,-3,true); // used for head width dim 
		}
	}

	returnConfigData();
}

