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

if(adj_gls_wth == 0)
{
	adj_gls_wth = t/2;
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
 
if(gls_flag == 2)
{
	initGlassArchCircular("glass", "sash", 0,0,width,archHeight,legHeight,adj_gls_wth,'F');
}

if(grid != "NONE")
{	
	initArchGrille("glass_pane", 0,0,width,archHeight,legHeight, adj_gls_wth, grid_pattern, 0.75, grid_color,'F');
	initGrid("glass_pane","grid_",	grid_pattern,grid_color,grid_thick);
}
if(s_flag == 2)
{
	if(model == "CASE-CT")
		{
		initArchCircular("sash", adj_gls_wth, adj_gls_hgt, width-(adj_gls_wth*2), (archHeight-(adj_gls_wth*2)), legHeight, t, color, 'F'); 
		}
	if(model == "CASE-EYE")
		{
		initArchCircular("sash", adj_gls_wth, adj_gls_hgt, width-(adj_gls_wth*2), archHeight, (legHeight-(adj_gls_wth*2)), t, color, 'F'); 
		}
}
if(frm_flag == 2)
{
		initArchCircular("frame", 0, 0, width, archHeight, legHeight, t, color,'F');		
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

	initHanding2("handing","glass_pane", handing,0,(height/4),width,(height*(2/3)));

returnConfigData();

}

