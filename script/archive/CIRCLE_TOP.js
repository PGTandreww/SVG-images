// $import="fc.js"
// $import="elliptical.js"
// $return$
function generate(evt)
{
// $initialize$
arch_height = gN("arch_height");
height = gN("height");
width = gN("width");
if(arch_height ===0)
{
	arch_height = s("arch_height", height - gN("leg_height"));
}
if(t === 0)
{
	t = s("t",1.75);
}
if(glass_type=="CTCT")
{
	s("f_glass","TEMPERED");
}
	
if(color == "ALMOND")
{
	color = s("color","TAN");  // web color
}
if(grid_color == "ALMOND")
{
	grid_color = s("grid_color","TAN"); //web color
}
 
if(adj_gls_wth == 0)
{
	adj_gls_wth = t/2;
}
s("f_material",material);
//leg_height = .5;
if(gls_flag == 2)
{
	initGlassArchCircular("glass", "frame", 0,0,width,arch_height,leg_height,adj_gls_wth,'F');
}

if(grid != "NONE")
{	
	initArchGrille("glass_pane", 0,0,width,arch_height,leg_height, .5, grid_pattern, 0.75, grid_color,'F');
}

if(frm_flag == 2)
{
		initArchCircular("frame", 0, 0, width, arch_height, leg_height, t, color,'F');		
		
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
	
	if(gN("arch_height") === 0)
	{
		s("arch_height", dimsToInches(gN("height_ft"),gN("height_in"),g("height_frac")));
		if(gN("arch_height") === 0)
		{
			s("arch_height",18);
		}
	}
	
	s("height",gN("arch_height")+gN("leg_height"));
	
	if(gN("width") === 0)
	{
		s("width", dimsToInches(gN("width_ft"),gN("width_in"),g("width_frac")));
		if(gN("width") === 0)
		{
			s("width",36);
		}
	}
}
