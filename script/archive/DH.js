// $import="fc.js"
// $import="rect.js"
// $return$

function generate(evt)
{
// $initialize$

var frm_f = frame_flag;
if(glass_type=="CTCT")
{
	s("f_glass","TEMPERED");
}
	
if(height === null || height === 0)
{
	height = dimsToInches(height_ft,height_in,height_frac);
}
if(width === null || width === 0)
{
	width = dimsToInches(width_ft,width_in,width_frac);
}

if(sash_height === null || sash_height === 0)
{
	sash_height = dimsToInches("",sash_in,sash_frac);
}
if(sash_height === null || sash_height === 0)
{
trace("height="+height);
trace("t_sash_t="+t_sash_t);
	sash_height = (height-(t_sash_t*3))/2;
trace("sash_height="+sash_height);	
}
		
	
if(color == "ALMOND")
{
	color = s("color","TAN");  // web color
}
if(grid_color == "ALMOND")
{
	grid_color = s("grid_color","TAN"); //web color
}

if(grid === "")
{
	grid = "NONE";
}

	var frame_x = 0;
	var frame_y = 0;

	var frame_w = width; 
	var frame_h = height; 
	var vert = 0;
	var horz = 0;

	if(material == "VINYL" || material == "ALUM")		// defines sash to have mitered corners
	{
		if(t_gls_flag == 2)			//determines that top glass is present
		{
				initGlass("t_glass","t_sash",		//defines top glass size and position
					frame_x + adj_sash_w + adj_gls_w, // x 
					frame_y + adj_sash_h + adj_gls_h,	// y
					frame_w - (adj_sash_w * 2) - (adj_gls_w * 2),	// w
					frame_h - sash_height - (adj_sash_h * 2) - (adj_gls_h),	// h
					adj_gls_h);			// o (sash overlap)

				if(grid != "NONE")	//defines grids (not fully developed
				{
					initGrid("t_glass_pane","t_grid_",	grid_pattern,grid_color,grid_thick);
				} //ends criteria for top grids
		}		//ends criteria for top glass (top glass flag)
		if(t_sash_flag == 2)		//determines that top sash is present
		{

			initTopSash("t_sash",		//defines top sash size and location
				frame_x + t_sash_t, // x 
				frame_y + t_sash_t,	// y
				frame_w - (t_sash_t * 2),	// w
				frame_h - sash_height - (t_sash_t * 2) + adj_gls_h,	// h
					t_sash_t,color);			// f (sash frame extrusion width)
		}		//ends criteria for top sash definition (top sash flag)
	}  		//ends mitered corner top sash (material vinyl or aluminum)
	if(material == "WOOD")				//defines sash to have not-mitered corners
	{
		if(t_gls_flag == 2)			//determines that top glass is present
		{
			initGlass("t_glass","t_sash",		//defines top glass size and location
				frame_x + adj_sash_w + adj_gls_w, // x 
				frame_y + adj_sash_h + adj_gls_h,	// y
				frame_w - (adj_sash_w * 2) - (adj_gls_w * 2),	// w
				frame_h - sash_height - (adj_sash_h * 2) - (adj_gls_h),	// h
				adj_gls_h);			// o (sash overlap)

			if(grid != "NONE") 		//defines grids
			{
				initGrid("t_glass_pane","t_grid_",	grid_pattern ,grid_color,grid_thick);
			}	//ends criteria for top grids (grid)
		}			//ends criteria for top glass (top glass flag)
		if(t_sash_flag == 2)		//determines that top sash is present
		{

			initNonMtrdTopSash("t_sash",		//defines top sash size and location
				frame_x + t_sash_t, // x 
				frame_y + t_sash_t,	// y
				frame_w - (t_sash_t * 2),	// w
				frame_h - sash_height - (t_sash_t * 2) + adj_gls_h,	// h
					t_sash_t,color);			// f (sash frame extrusion width)
		}		//ends criteria for top sash definition (top sash flag)
	}		//ends non-mitered corner top sash (material wood)



	
	if(material == "VINYL" || material == "ALUM")		//defines bottom sash to have mitered corners
	{
		if(b_gls_flag == 2)		//determines that bottom glass is present
		{
			initGlass("b_glass","b_sash",		//defines bottom glass size and location
				frame_x + adj_sash_w + adj_gls_w, // x 
				frame_y + (frame_h - sash_height - adj_sash_h) + adj_gls_h,	// y
				frame_w - (adj_sash_w * 2) - (adj_gls_w * 2),	// w
				sash_height - (adj_gls_h * 2),	// h
				adj_gls_h);			// o (sash overlap)
			if(grid != "NONE")		//defines grids
			{
				initGrid("b_glass_pane","b_grid_", grid_pattern,grid_color,grid_thick);
			}		//ends grid definition (grid)
		}			// ends bottom glass definition (bottom glass flag)
		if(b_sash_flag == 2)		//determines if bottom sash is present
		{
			initBottomSash("b_sash",	//defines bottom sash size and location
				frame_x + b_sash_t, // x 
				frame_y + (frame_h - sash_height - b_sash_t),	// y
				frame_w - (b_sash_t *2),	// w
				sash_height,	// h
				b_sash_t,color);			// f (sash frame extrusion width)
		}		//ends criteria for bottom sash definition (bottom sash flag)
	}		//ends definition of mitered corner bottom sash (material vinyl or aluminum)
	if(material == "WOOD")		//determines if bottom sash has non-mitered corner
	{
		if(b_gls_flag == 2)		//determines if bottom glass is present
		{
			initGlass("b_glass","b_sash",		//defines bottom glass size and location
				frame_x + adj_sash_w + adj_gls_w, // x 
				frame_y + (frame_h - sash_height - adj_sash_h) + adj_gls_h,	// y
				frame_w - (adj_sash_w * 2) - (adj_gls_w * 2),	// w
				sash_height - (adj_gls_h * 2),	// h
				adj_gls_h);			// o (sash overlap)
			if(grid != "NONE")		//determines grid definition
			{
				initGrid("b_glass_pane","b_grid_", grid_pattern,grid_color,grid_thick);
			}		//ends definition of grids (grids)
		}		//ends criteria of defining the bottom glass (bottom glass flag)
		if(b_sash_flag == 2)	//determines if bottom sash flag is present
		{
			initNonMtrdBottomSash("b_sash",		//defines bottom sash size and location
				frame_x + b_sash_t, // x 
				frame_y + (frame_h - sash_height - b_sash_t),	// y
				frame_w - (b_sash_t *2),	// w
				sash_height,	// h
				b_sash_t,color);			// f (sash frame extrusion width)
		}		//ends criteria of bottom sash definition (bottom sash flag)
	}		//ends definition of non-mitered bottom sash (material Wood)
	if(material == "VINYL" || material == "ALUM")		//determines if frame has mitered corner
	{
		if(frame_flag == 2)		//determines if frame is present
		{
			initOuterMiterFrame("frame",		//defines frame size and location
				0, // x 
				0,	// y
				width,	// w
				height,	// y
				frame_t,frame_t,frame_t,color);			// f (frame extrusion width)
		}	//ends criteria for frame (frame flag)
	}	//ends criteria for mitered corner frame (material is vinyl or aluminum)
	if(material == "WOOD")		//determines if frame has non-mitered corners
	{
		if(frame_flag == 2)	//determines if frame is present
		{
			trace("frame_t="+frame_t);	
			initOuterNonMtrdFrame("frame",		//defines frame size and location
				0, // x 
				0,	// y
				width,	// w
				height,	// y
				frame_t,frame_t,frame_t,color);			// f (frame extrusion width)
		}	//ends criteria for frame (frame flag)
	}	//ends criteria for non-mitered corner frame (material is wood)
	if(frame_flag == 2 && f_nested != "true")
	{
	createDim(0,frame_h + 3,frame_w,frame_h + 3,true);	//creates width dim (of overall frame) at bottom of window
	createDim(frame_w + 6,0,frame_w + 6,frame_h,true);	//creates height dim (of overall frame) at right of window
	}
	if(t_sash_flag == 2 && frame_flag == 2 && b_sash_flag == 2  && f_nested != "true")
	{
		createDim(frame_w + 2,frame_h - sash_height - 1.25, frame_w + 2, frame_h,true);  //creates sash height dim (for complete units) at right of window
	}
	if(t_sash_flag == 2 && frame_flag !=2  && f_nested != "true")
	{
		createDim(frame_w +2,frame_h - sash_height -0.5, frame_w +2, adj_sash_h-0.5,true);	//creates top sash Height dim (if frame not ordered)
		
	}
	if(t_sash_flag == 2 && b_sash_flag != 2 && frame_flag != 2  && f_nested != "true")
	{
		createDim(adj_sash_w-0.5,sash_height+2, frame_w-adj_sash_w+0.5,sash_height+2,true);	//creates top sash width dim if bottom sash not ordered (if frame not ordered)
	}
	if(b_sash_flag == 2 && frame_flag!=2  && f_nested != "true")
	{	
		createDim(frame_w +6,frame_h-sash_height -1.25,frame_w+6,frame_h-adj_sash_h+.25,true);	//creates bottom sash height dim (if frame not ordered)
		createDim(adj_sash_w-.5,frame_h+2,frame_w-adj_sash_w+.5,frame_h+2,true);		//creates bottom sash width dim (if frame not ordered)
	}
	if(t_gls_flag == 2 && t_sash_flag != 2  && f_nested != "true")
	{
		createDim(frame_w+2,frame_h - sash_height - (adj_gls_h*2), frame_w+2, adj_sash_h+adj_gls_h,true); //creates top glass height dim (if sash not ordered)
	}
	if(t_gls_flag == 2 && b_gls_flag != 2 && t_sash_flag !=2  && f_nested != "true")
	{
		createDim(adj_sash_w+adj_gls_w,sash_height+2,frame_w-adj_gls_w-adj_sash_w,sash_height+2,true);  //creates top glass width dim (if top sash not ordered and bottom glass not ordered)
	}
	if(b_gls_flag ==2 && b_sash_flag !=2  && f_nested != "true")
	{
		createDim(frame_w +6,frame_h-sash_height - adj_gls_h, frame_w+6,frame_h-adj_gls_h-adj_sash_h,true);	//creates bottom glass height dim (if sash not ordered)
		createDim(adj_sash_w+adj_gls_w,frame_h+2,frame_w-adj_gls_w-adj_sash_w,frame_h+2,true);			//creates bottom glass width dim (if sash not ordered)
	}
	
	// Display slide direction indications
	if(t_sash_flag == 2)		//determines if top sash is present
		{
		initDirection("t_direction","t_glass_pane","D");  //defines direction of arrow
		}
	if(b_sash_flag == 2)		//determines if bottom sash is present
		{
		initDirection("b_direction","b_glass_pane","U");	//defines direction of arrow
		}

	returnConfigData();
}	//ends function generate routine (from the top)
