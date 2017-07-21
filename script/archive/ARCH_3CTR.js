// $import="fc.js"
// $import="arch.js"
// $import="radialgrilles.js"
// $return$
function generate(evt)
{
// $initialize$
arch_height = gN("arch_height");
height = gN("height");
width = gN("width");


	
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

t=.5;
 if(gls_flag == 2)
{
// drawGlass3CentredArch("glass","frame",0,0,width,archHeight);
initGlass3CentredArch("glass","frame",0,0,width,arch_height,leg_height, t/2,"F");

}
if(grid != "NONE")
{	
	initArchGrille("glass_pane", 0,0,width,arch_height,leg_height, t/2, grid_pattern, t, grid_color,'F');
}

if(frm_flag == 2)
{
	initFrame3CentredArchWithSill("frame", 0, 0, width, arch_height, leg_height, t,t*1.5, color,'F');		
		
}



		
if( f_nested != "true")
{	
	createDim(0,height + 3,width,height + 3,true);
	if(arch_height != height)
	{
		createDim(width + 2,0,width + 2,arch_height,true);
		createDim(width + 2,arch_height,width + 2,height,true);
	}
	else
	{
		createDim(width + 2,0,width + 2,height,true);
	}
}

returnConfigData();

}

function calculateDimensions()
{
	
	if(gN("arch_height") == 0)
	{
		s("arch_height", dimsToInches(height_ft,height_in,height_frac));
		if(gN("arch_height") == 0)
		{
			s("arch_height",18);
		}
	}
	
	s("height",gN("arch_height")+gN("leg_height"));
	
	if(gN("width") == 0)
	{
		s("width", dimsToInches(width_ft,width_in,width_frac));
		if(gN("width") == 0)
		{
			s("width",36);
		}
	}
}
