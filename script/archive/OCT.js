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
var base_lng = 0;

var leg_lng = width/2.4142;
if(width<= height)
	base_lng = width/3.4142;
if(height< width)
	base_lng = height/3.4142;
// TODO:  assuming width==height
var side = height*.414211;
var corner = Math.sqrt(Math.pow(side,2)/2);


if(grid == "")
	grid = "NONE";


	if(gls_flag == 2)
	{
			initGlassOctagon("glass","frame",0, 0, width, adj_gls_w, .5);
	}
	if(grid != "NONE")
	{
			initGrid("glass_pane","grid_",	grid_pattern,grid_color,grid_thick);
	}

	if(fr_flag == 2)
	{
		initMitredOctagonFrame("frame", 0, 0, width, frame_t, color);
	}



	if(fr_flag == 2  && f_nested != "true")
	{
		createDim(0,height + 3,width,height + 3,true);	//used for frame width dim
		createDim(width + 3,0,width + 3,height,true);	//used for frame height dim
		createDim(-3,0,-3,corner,true);  //used for side height dim
		createDim(-3,corner,-3,corner+side,true);  //used for side height dim
		createDim(-3,corner+side,-3,height,true);  //used for side height dim
		createDim(0,-3,corner,-3,true);  //used for side width dim
		createDim(corner,-3,corner+side,-3,true);  //used for side width dim
		createDim(corner+side,-3,width,-3,true);  //used for side width dim

	}

	returnConfigData();
}

