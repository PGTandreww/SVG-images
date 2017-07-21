// $import="windows.js"
// $return$
function generate(evt)
{
// $initialize$


if(height == null || height == 0)
	height = dimsToInches(height_ft,height_in,height_frac);
	
if(width == null || width == 0)
	width = dimsToInches(width_ft,width_in,width_frac);

if(sash_height === null || sash_height === 0)
{
	sash_height = dimsToInches("",sash_in,sash_frac);
}
if(sash_height === null || sash_height === 0)
{
	sash_height = height/2;
}
var frame_x = 0;
var frame_y = 0;
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

if(adj_gls_w == 0)
{
	adj_gls_w = t/2;
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
 
if(t_gls_flag == 2)
{
	initGlassArchCircular("t_glass", "t_sash", 0,0,width,archHeight,legHeight-sash_height,adj_gls_w,'F');
}

if(grid != "NONE")
{	
	initArchGrille("t_glass_pane", 0,0,width,archHeight,legHeight, adj_gls_w, grid_pattern, grid_thick, grid_color,'F');
	initGrid("t_glass_pane","t_grid_",	grid_pattern,grid_color,grid_thick);
}
if(t_sash_flag == 2)
{
	if(model == "SH-CT")
		{
		initArchCircular("sash", adj_gls_w, adj_gls_h, width-(adj_gls_w*2), (archHeight-(adj_gls_w*2)), legHeight-sash_height+adj_gls_w, t, color, 'F'); 
		}
	if(model == "SH-EYE")
		{
		initArchCircular("sash", adj_gls_w, adj_gls_h, width-(adj_gls_w*2), archHeight, (legHeight-sash_height-adj_gls_w), t, color, 'F'); 
		}
}


if(b_gls_flag == 2)		//determines that bottom glass is present
		{
			initGlass("b_glass","b_sash",		//defines bottom glass size and location
				adj_sash_w + adj_gls_w, // x 
				(height - sash_height - adj_sash_h) + adj_gls_h,	// y
				width - (adj_sash_w * 2) - (adj_gls_w * 2),	// w
				sash_height - (adj_gls_h * 2),	// h
				adj_gls_h);			// o (sash overlap)
			if(grid != "NONE")		//defines grids
			{
				initGrid("b_glass","b_grid_", grid_pattern,grid_color,grid_thick);
			}		//ends grid definition (grid)
		}			// ends bottom glass definition (bottom glass flag)

		if(b_sash_flag == 2)		//determines if bottom sash is present
		{
			initBottomSash("b_sash",	//defines bottom sash size and location
				b_sash_t, // x 
				(height - sash_height - b_sash_t),	// y
				width - (b_sash_t *2),	// w
				sash_height,	// h
				b_sash_t,color);			// f (sash frame extrusion width)
		}		//ends criteria for bottom sash definition (bottom sash flag)

if(frm_flag == 2)
{
		initArchCircular("frame", 0, 0, width, archHeight, legHeight, t, color,'F');		
}
		
if( f_nested != "true")
{	
	createDim(0,height + 3,width,height + 3,true);
	if(archHeight != height)
	{
		createDim(width + 8,0,width + 8,archHeight,true);
		createDim(width + 8,archHeight,width + 8,height,true);
		createDim(width + 3,height - sash_height - 1.25, width + 3, height,true);  //creates sash height dim (for complete units) at right of window
	}
	else
	{
		createDim(width + 8,0,width + 8,height,true);
		createDim(width + 3,height - sash_height - 1.25, width + 3, height,true);  //creates sash height dim (for complete units) at right of window
	}
}

	if(b_sash_flag == 2)		//determines if bottom sash is present
		{
		initDirection("b_direction","b_glass_pane","U");	//defines direction of arrow
		}

returnConfigData();

}

