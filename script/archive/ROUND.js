// $import="windows.js"
// $return$
function generate(evt)
{
// $initialize$


if(height === null || height === 0)
	height = dimsToInches(height_ft,height_in,height_frac);
	
if(width === null || width === 0)
	width = dimsToInches(width_ft,width_in,width_frac);


switch(color)
{
 	case "": 	color = "gray";	
 				break;
	case "ALMOND":
			color = "TAN";  // web color
			break;
	default:
			break;
}
if(grid_thick === 0)
{
	grid_thick = 1;
}
if(grid_color == "")
{
	grid_color = color;
}
if(grid_color == "ALMOND")
{
	grid_color = "TAN";
}
if(gls_flag == 2)
{
	initGlassEllipse("glass", "frame", 0,0,width,height,(.75*t),.5);
}


if(grid != "NONE")	//defines grids (not fully developed
{
		initGrid("glass_pane","grid_",grid_pattern,grid_color,grid_thick);
} //ends criteria for grids
	
if(fr_flag == 2)
{
		initEllipseFrame("frame", 0, 0, width, height, t, color);		
}

if(fr_flag == 2  && f_nested != "true")
	{
		createDim(0,height + 3,width,height + 3,true);	//used for frame width dim
		createDim(width + 6,0,width + 6,height,true);	//used for frame height dim
	}

returnConfigData();

}

