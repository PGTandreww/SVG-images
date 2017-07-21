// $import="windows.js"
// $return$

function generate(evt)
{
// $initialize$
if(height == null || height == 0)
{
	height = dimsToInches(height_ft,height_in,height_frac);
}
if(width == null || width == 0)
{
	width = dimsToInches(width_ft,width_in,width_frac);
}

if(color == "")
	color = "gray";	
	
if(color == "ALMOND")
	color = "TAN";  // web color
if(grid_color == "ALMOND")
	grid_color = "TAN"; // web color
var vert = 0;
var horz = 0;

if(grid == "")
	grid = "NONE";

	var frame_x = 0;
	var frame_y = 0;


	if(gls_flag == 2)
	{
		initGlassHomePlate("glass","frame",0, 0, width, height, leg_height, adj_gls_w, .5, "T");
	}
	if(grid != "NONE")
	{
			initGrid("glass_pane","grid_",	grid_pattern,grid_color,grid_thick);
	}

	if(fr_flag == 2)
	{
		// initMitredHomePlateFrame("frame", 0, 0, width, height, leg_height, frame_t, color, "T")
		initHomePlateFrame("frame", 0, 0, width, height, leg_height, frame_t,frame_t*1.5, color, "T")
	}



	if(fr_flag == 2  && f_nested != "true")
	{
		createDim(0,height + 3,width,height + 3,true);	//used for frame width dim
		createDim(width + 6,0,width + 6,height,true);	//used for frame height dim
		createDim(width+3,height,width+3,(height-leg_height),true);  //used for leg height dim

	}

	returnConfigData();
}

