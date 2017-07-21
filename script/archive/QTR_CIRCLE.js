// $import="windows.js"
// $return$
function generate(evt)
{
// $initialize$


if(height == null || height == 0)
	height = dimsToInches(height_ft,height_in,height_frac);
	
if(width == null || width == 0)
	width = dimsToInches(width_ft,width_in,width_frac);

var legHeight = 0;
try{
 legHeight = leg_height;
}
catch(eUndefined)
{
	legHeight = 0;
}

var archHeight;
try{
 archHeight = arch_height;
}catch(eUndefined)
{
 archHeight = height - legHeight;
}

if(t===0)
{
	t=1.75;
}

	
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
	
if(grid_color == "")
{
	grid_color = color;
}
if(grid_color == "ALMOND")
{
	grid_color = "TAN";
}

 

if(adj_gls_wth == 0)
{
	adj_gls_wth = t/2;
}

if(gls_flag == 2)
{
	initGlassArchCircular("glass", "frame", 0, 0, width, archHeight, legHeight, adj_gls_wth, handing);
}

if(grid != "NONE")
{	
	initArchGrille("glass_pane", 0, 0, width, archHeight, legHeight, adj_gls_wth, grid_pattern, 0.75, grid_color,handing);
}

if(frm_flag == 2)
{
		initArchCircular("frame", 0, 0, width, archHeight, legHeight, t, color,handing);		
		
}		
if( f_nested != "true")
{	
	createDim(0,height + 3,width,height + 3,true);
	if(archHeight != height)
	{
		createDim(width + 2,0,width + 2,archHeight,true);
		createDim(width + 2,archHeight,width + 2,height,true);
	}
	else
	{
		createDim(width + 2,0,width + 2,height,true);
	}
}

returnConfigData();

}

