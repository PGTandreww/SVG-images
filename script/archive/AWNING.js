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
{
	color = "gray";	
}	
if(color == "ALMOND")
{
	color = "TAN";  // web color
}
if(grid_color == "")
{
	grid_color = "gray";
}
if(grid_color == "ALMOND")
{
	grid_color = "TAN";	// web color
}
if(grid == "")
{
	grid = "NONE";
}

if(glassType == "CTCT")
{
	s("f_glass","TEMPERED");
}

var vert = 0;
var horz = 0;

	var frame_x = 0;
	var frame_y = 0;

	var frame_w = width; 
	var frame_h = height; 

if(have_sash == "Y")
{
	if(gls_flag == 2)
	{
		initGlass("glass","sash",
				frame_x+ adj_sash_w + adj_gls_w, // x 
				frame_y+ adj_sash_h + adj_gls_h,	// y
				frame_w - (adj_sash_w * 2)  - (adj_gls_w * 2),	// w
				frame_h - (adj_sash_h * 2)  - (adj_gls_h * 2),	// y
				sash_t);			// o (sash overlap)
		
		if(grid != "NONE")
		{
			initGrid("glass_pane","grid_",grid_pattern,	grid_color,grid_thick);
		}			
	}
	if(s_flag == 2)
	{
		if(material == "VINYL" || material == "ALUM")
		{
			initMiteredSash("sash",
				frame_x + adj_sash_w, // x 
				frame_y + adj_sash_h,	// y
				frame_w - (adj_sash_w * 2),	// w
				frame_h - (adj_sash_h * 2),	// y
				sash_t,color);			// f (sash frame extrusion width)
		}
		if(material == "WOOD")
		{
			initNonMiteredSash("sash",
				frame_x + adj_sash_w, // x 
				frame_y + adj_sash_h,	// y
				frame_w - (adj_sash_w * 2),	// w
				frame_h - (adj_sash_h * 2),	// y
				sash_t,color);			// f (sash frame extrusion width)
		}
	}
}
else
{
	if(gls_flag == 2)
	{
		initGlass("glass","frame",
				frame_x + adj_gls_w, // x 
				frame_y + adj_gls_h,	// y
				frame_w  - (adj_gls_w * 2),	// w
				frame_h  - (adj_gls_h * 2),	// y
				sash_t);			// o (sash overlap)
				
		if(grid != "NONE")
		{
			initGrid("glass_pane","grid_",grid_pattern,	grid_color,grid_thick);
		}		
	}

}
	if(fr_flag == 2)
	{
		if(material == "VINYL" || material == "ALUM")
		{
			initOuterMiterFrame("frame",
				0, // x 
				0,	// y
				width,	// w
				height,	// y
				frame_t,frame_t,frame_t,color);			// f (frame extrusion width)
		}
		if(material == "WOOD")
		{
			initOuterNonMtrdFrame("frame",
				0, // x 
				0,	// y
				width,	// w
				height,	// y
				frame_t,frame_t,frame_t,color);			// f (frame extrusion width)
		}		
	}


if( f_nested != "true")
{	

	if(fr_flag == 2)
	{
		createDim(0,frame_h + 3,frame_w,frame_h + 3,true); //used for frame width dim
		createDim(frame_w + 2,0,frame_w + 2,frame_h,true); //used for frame height dim
	}
	if(s_flag == 2 && fr_flag !=2)
	{
		createDim(frame_w +2,frame_h-adj_sash_h+0.25,frame_w+2,adj_sash_h,true);  //used for sash height dim (when frame is not ordered)
		createDim(adj_sash_w,frame_h +2,frame_w-adj_sash_w,frame_h+2,true);	  //used for sash width dim (when frame is not ordered)
	}
	if(gls_flag == 2 && s_flag != 2)
	{	
		createDim(adj_sash_w+adj_gls_w,frame_h+2,frame_w-adj_gls_w-adj_sash_w,frame_h+2,true);	    //used for glass width dim (when glass only ordered)
		createDim(frame_w +2,frame_h-adj_sash_h - adj_gls_h, frame_w+2,adj_gls_h+adj_sash_h,true);   //used for glass height dim (when glass only ordered)
	}
}
	
	// HANDING
	initHanding("handing","glass_pane",handing);

	returnConfigData();

}