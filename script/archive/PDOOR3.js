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

if(sash_width == null || sash_width == 0)
{
	sash_width = dimsToInches("",sash_in,sash_frac);
}

if(color == "")
{
	color = "gray";	
}
if(color == "ALMOND")
{
	color = "TAN";  // web color
}
if(grid_color == "ALMOND")
{
	grid_color = "TAN"; //web color
}
if(grid == "")
{
	grid = "NONE";
}
	var frame_x = 0;
	var frame_y = 0;
	var frame_w = width; 
	var frame_h = height; 
	var w3 = (frame_w-(((frame_t-adj_sash_w)+frame_t)*2)-((adj_sash_w+adj_gls_w)*2))/3;

if(handing == "OOX")
{
	if(material == "VINYL" || material == "ALUM")
	{
		if(l_gls_flag == 2)
		{
				initGlass("l_glass","l_sash",
					frame_x + l_sash_t + adj_gls_w, // x 
					frame_y + l_sash_t + adj_gls_h,	// y
					sash_width-(adj_gls_w*2)-(muntin_thick/2),	// w
					frame_h - (l_sash_t) - (adj_gls_h*2),	// h
					adj_gls_h);			// o (sash overlap)

				if(grid != "NONE")
				{
					vert = grid_pattern.charAt(0)-0;
					horz = grid_pattern.charAt(2)-0;
					drawGrid("l_glass_pane","l_grid_",	vert,horz,grid_color,grid_thick);
				}
		}
		if(l_sash_flag == 2)
		{
			initLeftSash("l_sash",
				frame_x + l_sash_t, // x 
				frame_y + l_sash_t,	// y
				sash_width-(adj_gls_w/3)-(muntin_thick/2),	// w
				frame_h - (l_sash_t),	// h
					l_sash_t,color);			// f (sash frame extrusion width)
		}
	}
	if(material == "WOOD")
	{
		if(l_gls_flag == 2)
		{
			initGlass("l_glass","l_sash",
					frame_x + l_sash_t + adj_gls_w, // x 
					frame_y + l_sash_t + adj_gls_h,	// y
					sash_width-(adj_gls_w*2)-(muntin_thick/2),	// w
					frame_h - (l_sash_t) - (adj_gls_h*2),	// h
					adj_gls_h);			// o (sash overlap)

			if(grid != "NONE")
				{
				vert = grid_pattern.charAt(0)-0;
				horz = grid_pattern.charAt(2)-0;
				drawGrid("l_glass_pane","l_grid_",	vert,horz,grid_color,grid_thick);
				}
		}
		if(l_sash_flag == 2)
		{

			initNonMtrdLeftSash("l_sash",
				frame_x + l_sash_t, // x 
				frame_y + l_sash_t,	// y
				sash_width-(adj_gls_w/3)-(muntin_thick/2),	// w
				frame_h - (l_sash_t),	// h
					l_sash_t,color);			// f (sash frame extrusion width)
		}
	}
	if(material == "VINYL" || material == "ALUM")
	{
		if(r_gls_flag == 2)
		{
			initGlass("r_glass","r_sash",
				frame_w - sash_width-(adj_gls_w/2), // x 
				frame_y + r_sash_t +adj_gls_h,	// y
				sash_width-(adj_gls_w*2),	// w
				frame_h - (r_sash_t) - (adj_gls_h*2),	// h
				adj_gls_h);			// o (sash overlap)
			if(grid != "NONE")
				{
				vert = grid_pattern.charAt(0)-0;
				horz = grid_pattern.charAt(2)-0;
				drawGrid("r_glass_pane","r_grid_", vert,horz,grid_color,grid_thick);
				}
		}
		if(r_sash_flag == 2)
		{
			initRightSash("r_sash",
				frame_w - sash_width-r_sash_t+(adj_gls_w/2), // x 
				frame_y + r_sash_t,	// y
				sash_width-(adj_gls_w/3),	// w
				frame_h - (r_sash_t),	// h
				r_sash_t,color);			// f (sash frame extrusion width)
		}
	}
	if(material == "WOOD")
	{
		if(r_gls_flag == 2)
		{
			initGlass("r_glass","r_sash",
				frame_w - sash_width-(adj_gls_w/2), // x 
				frame_y + r_sash_t +adj_gls_h,	// y
				sash_width-(adj_gls_w*2),	// w
				frame_h - (r_sash_t) - (adj_gls_h*2),	// h
				adj_gls_h);			// o (sash overlap)
			if(grid != "NONE")
				{
				vert = grid_pattern.charAt(0)-0;
				horz = grid_pattern.charAt(2)-0;
				drawGrid("r_glass_pane","r_grid_", vert,horz,grid_color,grid_thick);
				}
		}
		if(r_sash_flag == 2)
		{
			initNonMtrdRightSash("r_sash",
				frame_w - sash_width-r_sash_t+(adj_gls_w/2), // x 
				frame_y + r_sash_t,	// y
				sash_width-(adj_gls_w/3),	// w
				frame_h - (r_sash_t),	// h
				r_sash_t,color);			// f (sash frame extrusion width)
		}
	}
	if(material == "VINYL" || material == "ALUM")		//defines material view
	{
		if(c_gls_flag == 2)				//determines if center glass is needed
		{
			initGlass("c_glass","c_sash",
				frame_x + sash_width+(adj_gls_w*2)+(muntin_thick*2), // x 
				frame_y + c_sash_t +adj_gls_h,	// y
				frame_w - sash_width-sash_width-(muntin_thick*2)-(adj_gls_w*3),	// w
				frame_h - (c_sash_t) - (adj_gls_h*2),	// h
				adj_gls_h);			// o (sash overlap)
			if(grid != "NONE")						//sets 
				{
				vert = grid_pattern.charAt(0)-0;
				horz = grid_pattern.charAt(2)-0;
				drawGrid("c_glass_pane","c_grid_", vert,horz,grid_color,grid_thick);
				}
		}
		if(c_sash_flag == 2)
		{
			initMiteredSash("c_sash",
				frame_x + sash_width+(adj_gls_w/2) + (muntin_thick*2), // x 
				frame_y + c_sash_t,	// y
				frame_w-sash_width-sash_width-(adj_gls_w/2)-(muntin_thick*2),	// w
				frame_h - (c_sash_t),	// h
				c_sash_t,color);			// f (sash frame extrusion width)
		}
	}
	if(material == "WOOD")
	{
		if(c_gls_flag == 2)				//determines if center glass is needed
		{
			initGlass("c_glass","c_sash",
				frame_x + sash_width+(adj_gls_w*2)+(muntin_thick*2), // x 
				frame_y + c_sash_t +adj_gls_h,	// y
				frame_w - sash_width-sash_width-(muntin_thick*2)-(adj_gls_w*3),	// w
				frame_h - (c_sash_t) - (adj_gls_h*2),	// h
				adj_gls_h);			// o (sash overlap)
			if(grid != "NONE")						//sets 
				{
				vert = grid_pattern.charAt(0)-0;
				horz = grid_pattern.charAt(2)-0;
				drawGrid("c_glass_pane","c_grid_", vert,horz,grid_color,grid_thick);
				}
		}
		if(c_sash_flag == 2)
		{
			initMiteredSash("c_sash",
				frame_x + sash_width+(adj_gls_w/2) + (muntin_thick*2), // x 
				frame_y + c_sash_t,	// y
				frame_w-sash_width-sash_width-(adj_gls_w/2)-(muntin_thick*2),	// w
				frame_h - (c_sash_t),	// h
				c_sash_t,color);			// f (sash frame extrusion width)
		}
	}
	var vert = 0;
	var horz = 0;
}
if(handing == "XOO")
{
	if(material == "VINYL" || material == "ALUM")
	{
		if(l_gls_flag == 2)
		{
				initGlass("l_glass","l_sash",
					frame_x + l_sash_t + adj_gls_w, // x 
					frame_y + l_sash_t + adj_gls_h,	// y
					sash_width,	// w
					frame_h - (l_sash_t) - (adj_gls_h*2),	// h
					adj_gls_h);			// o (sash overlap)

				if(grid != "NONE")
				{
					vert = grid_pattern.charAt(0)-0;
					horz = grid_pattern.charAt(2)-0;
					drawGrid("l_glass_pane","l_grid_",	vert,horz,grid_color,grid_thick);
				}
		}
		if(l_sash_flag == 2)
		{

			initLeftSash("l_sash",
				frame_x + l_sash_t, // x 
				frame_y + l_sash_t,	// y
				sash_width,	// w
				frame_h - (l_sash_t),	// h
					l_sash_t,color);			// f (sash frame extrusion width)
		}
	}
	if(material == "WOOD")
	{
		if(l_gls_flag == 2)
		{
			initGlass("l_glass","l_sash",
					frame_x + l_sash_t + adj_gls_w, // x 
					frame_y + l_sash_t + adj_gls_h,	// y
					sash_width-(adj_gls_w*2),	// w
					frame_h - (l_sash_t) - (adj_gls_h*2),	// h
					adj_gls_h);			// o (sash overlap)

			if(grid != "NONE")
				{
				vert = grid_pattern.charAt(0)-0;
				horz = grid_pattern.charAt(2)-0;
				drawGrid("l_glass_pane","l_grid_",	vert,horz,grid_color,grid_thick);
				}
		}
		if(l_sash_flag == 2)
		{
			initNonMtrdLeftSash("l_sash",
				frame_x + l_sash_t, // x 
				frame_y + l_sash_t,	// y
				sash_width-(adj_gls_w/3),	// w
				frame_h - (l_sash_t),	// h
					l_sash_t,color);			// f (sash frame extrusion width)
		}
	}
	if(material == "VINYL" || material == "ALUM")
	{
		if(r_gls_flag == 2)
		{
			initGlass("r_glass","r_sash",
				frame_w - sash_width-(adj_gls_w/2)+(muntin_thick), // x 
				frame_y + r_sash_t +adj_gls_h,	// y
				sash_width-(adj_gls_w*2)-(muntin_thick),	// w
				frame_h - (r_sash_t) - (adj_gls_h*2),	// h
				adj_gls_h);			// o (sash overlap)
			if(grid != "NONE")
				{
				vert = grid_pattern.charAt(0)-0;
				horz = grid_pattern.charAt(2)-0;
				drawGrid("r_glass_pane","r_grid_", vert,horz,grid_color,grid_thick);
				}
		}
		if(r_sash_flag == 2)
		{
			initRightSash("r_sash",
				frame_w - sash_width-r_sash_t+(adj_gls_w/2)+(muntin_thick), // x 
				frame_y + r_sash_t,	// y
				sash_width-(adj_gls_w/3)-(muntin_thick),	// w
				frame_h - (r_sash_t),	// h
				r_sash_t,color);			// f (sash frame extrusion width)
		}
	}
	if(material == "WOOD")
	{
		if(r_gls_flag == 2)
		{
			initGlass("r_glass","r_sash",
				frame_w - sash_width-(adj_gls_w/2)+(muntin_thick/2), // x 
				frame_y + r_sash_t +adj_gls_h,	// y
				sash_width-(adj_gls_w*2)-(muntin_thick/2),	// w
				frame_h - (r_sash_t) - (adj_gls_h*2),	// h
				adj_gls_h);			// o (sash overlap)
			if(grid != "NONE")
				{
				vert = grid_pattern.charAt(0)-0;
				horz = grid_pattern.charAt(2)-0;
				drawGrid("r_glass_pane","r_grid_", vert,horz,grid_color,grid_thick);
				}
		}
		if(r_sash_flag == 2)
		{
			initRightSash("r_sash",
				frame_w - sash_width-r_sash_t+(adj_gls_w/2)+(muntin_thick/2), // x 
				frame_y + r_sash_t,	// y
				sash_width-(adj_gls_w/3)-(muntin_thick/2),	// w
				frame_h - (r_sash_t),	// h
				r_sash_t,color);			// f (sash frame extrusion width)
		}
	}
	if(material == "VINYL" || material == "ALUM")		//defines material view
	{
		if(c_gls_flag == 2)				//determines if center glass is needed
		{
			initGlass("c_glass","c_sash",
				frame_x + sash_width+(adj_gls_w*2)+(muntin_thick), // x 
				frame_y + c_sash_t +adj_gls_h,	// y
				frame_w - sash_width-sash_width-(muntin_thick*2)-(adj_gls_w*3),	// w
				frame_h - (c_sash_t) - (adj_gls_h*2),	// h
				adj_gls_h);			// o (sash overlap)
			if(grid != "NONE")						//sets 
				{
				vert = grid_pattern.charAt(0)-0;
				horz = grid_pattern.charAt(2)-0;
				drawGrid("c_glass_pane","c_grid_", vert,horz,grid_color,grid_thick);
				}
		}
		if(c_sash_flag == 2)
		{
			initMiteredSash("c_sash",
				frame_x + sash_width+(adj_gls_w/2) + (muntin_thick), // x 
				frame_y + c_sash_t,	// y
				frame_w-sash_width-sash_width-(adj_gls_w/2)-(muntin_thick*2),	// w
				frame_h - (c_sash_t),	// h
				c_sash_t,color);			// f (sash frame extrusion width)
		}
	}
	if(material == "WOOD")
	{
		if(c_gls_flag == 2)				//determines if center glass is needed
		{
			initGlass("c_glass","c_sash",
				frame_x + sash_width+(adj_gls_w*2)+(muntin_thick*2), // x 
				frame_y + c_sash_t +adj_gls_h,	// y
				frame_w - sash_width-sash_width-(muntin_thick*2)-(adj_gls_w*3),	// w
				frame_h - (c_sash_t) - (adj_gls_h*2),	// h
				adj_gls_h);			// o (sash overlap)
			if(grid != "NONE")						//sets 
				{
				vert = grid_pattern.charAt(0)-0;
				horz = grid_pattern.charAt(2)-0;
				drawGrid("c_glass_pane","c_grid_", vert,horz,grid_color,grid_thick);
				}
		}
		if(c_sash_flag == 2)
		{
			initMiteredSash("c_sash",
				frame_x + sash_width+(adj_gls_w/2) + (muntin_thick*2), // x 
				frame_y + c_sash_t,	// y
				frame_w-sash_width-sash_width-(adj_gls_w/2)-(muntin_thick*2),	// w
				frame_h - (c_sash_t),	// h
				c_sash_t,color);			// f (sash frame extrusion width)
		}
	}
}
if(handing == "OXOR")
{
	if(material == "VINYL" || material == "ALUM")
	{
		if(l_gls_flag == 2)
		{
				initGlass("l_glass","l_sash",
					frame_x + l_sash_t + adj_gls_w, // x 
					frame_y + l_sash_t + adj_gls_h,	// y
					sash_width-(adj_gls_w*2),	// w
					frame_h - (l_sash_t) - (adj_gls_h*2),	// h
					adj_gls_h);			// o (sash overlap)

				if(grid != "NONE")
				{
					vert = grid_pattern.charAt(0)-0;
					horz = grid_pattern.charAt(2)-0;
					drawGrid("l_glass_pane","l_grid_",	vert,horz,grid_color,grid_thick);
				}
		}
		if(l_sash_flag == 2)
		{
			initLeftSash("l_sash",
				frame_x + l_sash_t, // x 
				frame_y + l_sash_t,	// y
				sash_width-(adj_gls_w/3),	// w
				frame_h - (l_sash_t),	// h
					l_sash_t,color);			// f (sash frame extrusion width)
		}
	}
	if(material == "WOOD")
	{
		if(l_gls_flag == 2)
		{
			initGlass("l_glass","l_sash",
					frame_x + l_sash_t + adj_gls_w, // x 
					frame_y + l_sash_t + adj_gls_h,	// y
					sash_width-(adj_gls_w*2),	// w
					frame_h - (l_sash_t) - (adj_gls_h*2),	// h
					adj_gls_h);			// o (sash overlap)

			if(grid != "NONE")
				{
				vert = grid_pattern.charAt(0)-0;
				horz = grid_pattern.charAt(2)-0;
				drawGrid("l_glass_pane","l_grid_",	vert,horz,grid_color,grid_thick);
				}
		}
		if(l_sash_flag == 2)
		{

			initNonMtrdLeftSash("l_sash",
				frame_x + l_sash_t, // x 
				frame_y + l_sash_t,	// y
				sash_width-(adj_gls_w/3),	// w
				frame_h - (l_sash_t),	// h
					l_sash_t,color);			// f (sash frame extrusion width)
		}
	}
	if(material == "VINYL" || material == "ALUM")		//defines material view
	{
		if(c_gls_flag == 2)				//determines if center glass is needed
		{
			initGlass("c_glass","c_sash",
				frame_x + sash_width+(adj_gls_w)+(muntin_thick/2), // x 
				frame_y + c_sash_t +adj_gls_h,	// y
				frame_w - sash_width-sash_width-(muntin_thick/2)-(adj_gls_w*2),	// w
				frame_h - (c_sash_t ) - (adj_gls_h*2),	// h
				adj_gls_h);			// o (sash overlap)
			if(grid != "NONE")						//sets 
				{
				vert = grid_pattern.charAt(0)-0;
				horz = grid_pattern.charAt(2)-0;
				drawGrid("c_glass_pane","c_grid_", vert,horz,grid_color,grid_thick);
				}
		}
		if(c_sash_flag == 2)
		{
			initMiteredSash("c_sash",
				frame_x + sash_width+(adj_gls_w/4) + (muntin_thick/2), // x 
				frame_y + c_sash_t,	// y
				frame_w-sash_width-sash_width-(adj_gls_w/3)-(muntin_thick/2),	// w
				frame_h - (c_sash_t),	// h
				c_sash_t,color);			// f (sash frame extrusion width)
		}
	}
	if(material == "WOOD")
	{
		if(c_gls_flag == 2)				//determines if center glass is needed
		{
			initGlass("c_glass","c_sash",
				frame_x + sash_width+(adj_gls_w)+(muntin_thick/2), // x 
				frame_y + c_sash_t +adj_gls_h,	// y
				frame_w - sash_width-sash_width-(muntin_thick/2)-(adj_gls_w*2),	// w
				frame_h - (c_sash_t) - (adj_gls_h*2),	// h
				adj_gls_h);			// o (sash overlap)
			if(grid != "NONE")						//sets 
				{
				vert = grid_pattern.charAt(0)-0;
				horz = grid_pattern.charAt(2)-0;
				drawGrid("c_glass_pane","c_grid_", vert,horz,grid_color,grid_thick);
				}
		}
		if(c_sash_flag == 2)
		{
			initMiteredSash("c_sash",
				frame_x + sash_width+(adj_gls_w/4) + (muntin_thick/2), // x 
				frame_y + c_sash_t,	// y
				frame_w-sash_width-sash_width-(adj_gls_w/3)-(muntin_thick/2),	// w
				frame_h - (c_sash_t),	// h
				c_sash_t,color);			// f (sash frame extrusion width)
		}
	}
	if(material == "VINYL" || material == "ALUM")
	{
		if(r_gls_flag == 2)
		{
			initGlass("r_glass","r_sash",
				frame_w - sash_width-(adj_gls_w/2), // x 
				frame_y + r_sash_t +adj_gls_h,	// y
				sash_width-(adj_gls_w*2),	// w
				frame_h - (r_sash_t) - (adj_gls_h*2),	// h
				adj_gls_h);			// o (sash overlap)
			if(grid != "NONE")
				{
				vert = grid_pattern.charAt(0)-0;
				horz = grid_pattern.charAt(2)-0;
				drawGrid("r_glass_pane","r_grid_", vert,horz,grid_color,grid_thick);
				}
		}
		if(r_sash_flag == 2)
		{
			initRightSash("r_sash",
				frame_w - sash_width-r_sash_t+(adj_gls_w/2), // x 
				frame_y + r_sash_t,	// y
				sash_width-(adj_gls_w/3),	// w
				frame_h - (r_sash_t),	// h
				r_sash_t,color);			// f (sash frame extrusion width)
		}
	}
	if(material == "WOOD")
	{
		if(r_gls_flag == 2)
		{
			initGlass("r_glass","r_sash",
				frame_w - sash_width-(adj_gls_w/2), // x 
				frame_y + r_sash_t +adj_gls_h,	// y
				sash_width-(adj_gls_w*2),	// w
				frame_h - (r_sash_t) - (adj_gls_h*2),	// h
				adj_gls_h);			// o (sash overlap)
			if(grid != "NONE")
				{
				vert = grid_pattern.charAt(0)-0;
				horz = grid_pattern.charAt(2)-0;
				drawGrid("r_glass_pane","r_grid_", vert,horz,grid_color,grid_thick);
				}
		}
		if(r_sash_flag == 2)
		{
			initNonMtrdRightSash("r_sash",
				frame_w - sash_width-r_sash_t+(adj_gls_w/2), // x 
				frame_y + r_sash_t,	// y
				sash_width-(adj_gls_w/3),	// w
				frame_h - (r_sash_t),	// h
				r_sash_t,color);			// f (sash frame extrusion width)
		}
	}
}
if(handing == "OXOL")
{
	if(material == "VINYL" || material == "ALUM")
	{
		if(l_gls_flag == 2)
		{
				initGlass("l_glass","l_sash",
					frame_x + l_sash_t + adj_gls_w, // x 
					frame_y + l_sash_t + adj_gls_h,	// y
					sash_width-(adj_gls_w*2),	// w
					frame_h - (l_sash_t) - (adj_gls_h*2),	// h
					adj_gls_h);			// o (sash overlap)

				if(grid != "NONE")
				{
					vert = grid_pattern.charAt(0)-0;
					horz = grid_pattern.charAt(2)-0;
					drawGrid("l_glass_pane","l_grid_",	vert,horz,grid_color,grid_thick);
				}
		}
		if(l_sash_flag == 2)
		{

			initLeftSash("l_sash",
				frame_x + l_sash_t, // x 
				frame_y + l_sash_t,	// y
				sash_width-(adj_gls_w/3),	// w
				frame_h - (l_sash_t),	// h
					l_sash_t,color);			// f (sash frame extrusion width)
		}
	}
	if(material == "WOOD")
	{
		if(l_gls_flag == 2)
		{
			initGlass("l_glass","l_sash",
					frame_x + l_sash_t + adj_gls_w, // x 
					frame_y + l_sash_t + adj_gls_h,	// y
					sash_width-(adj_gls_w*2),	// w
					frame_h - (l_sash_t) - (adj_gls_h*2),	// h
					adj_gls_h);			// o (sash overlap)

			if(grid != "NONE")
				{
				vert = grid_pattern.charAt(0)-0;
				horz = grid_pattern.charAt(2)-0;
				drawGrid("l_glass_pane","l_grid_",	vert,horz,grid_color,grid_thick);
				}
		}
		if(l_sash_flag == 2)
		{
			initNonMtrdLeftSash("l_sash",
				frame_x + l_sash_t, // x 
				frame_y + l_sash_t,	// y
				sash_width-(adj_gls_w/3),	// w
				frame_h - (l_sash_t),	// h
					l_sash_t,color);			// f (sash frame extrusion width)
		}
	}
	if(material == "VINYL" || material == "ALUM")
	{
		if(r_gls_flag == 2)
		{
			initGlass("r_glass","r_sash",
				frame_w - sash_width-(adj_gls_w/2)+(muntin_thick/2), // x 
				frame_y + r_sash_t +adj_gls_h,	// y
				sash_width-(adj_gls_w*2)-(muntin_thick/2),	// w
				frame_h - (r_sash_t) - (adj_gls_h*2),	// h
				adj_gls_h);			// o (sash overlap)
			if(grid != "NONE")
				{
				vert = grid_pattern.charAt(0)-0;
				horz = grid_pattern.charAt(2)-0;
				drawGrid("r_glass_pane","r_grid_", vert,horz,grid_color,grid_thick);
				}
		}
		if(r_sash_flag == 2)
		{
			initRightSash("r_sash",
				frame_w - sash_width-r_sash_t+(adj_gls_w/2)+(muntin_thick/2), // x 
				frame_y + r_sash_t,	// y
				sash_width-(adj_gls_w/3)-(muntin_thick/2),	// w
				frame_h - (r_sash_t),	// h
				r_sash_t,color);			// f (sash frame extrusion width)
		}
	}
	if(material == "WOOD")
	{
		if(r_gls_flag == 2)
		{
			initGlass("r_glass","r_sash",
				frame_w - sash_width-(adj_gls_w/2)+(muntin_thick/2), // x 
				frame_y + r_sash_t +adj_gls_h,	// y
				sash_width-(adj_gls_w*2)-(muntin_thick/2),	// w
				frame_h - (r_sash_t) - (adj_gls_h*2),	// h
				adj_gls_h);			// o (sash overlap)
			if(grid != "NONE")
				{
				vert = grid_pattern.charAt(0)-0;
				horz = grid_pattern.charAt(2)-0;
				drawGrid("r_glass_pane","r_grid_", vert,horz,grid_color,grid_thick);
				}
		}
		if(r_sash_flag == 2)
		{
			initRightSash("r_sash",
				frame_w - sash_width-r_sash_t+(adj_gls_w/2)+(muntin_thick/2), // x 
				frame_y + r_sash_t,	// y
				sash_width-(adj_gls_w/3)-(muntin_thick/2),	// w
				frame_h - (r_sash_t),	// h
				r_sash_t,color);			// f (sash frame extrusion width)
		}
	}
	if(material == "VINYL" || material == "ALUM")		//defines material view
	{
		if(c_gls_flag == 2)				//determines if center glass is needed
		{
			initGlass("c_glass","c_sash",
				frame_x + sash_width+(adj_gls_w), // x 
				frame_y + c_sash_t +adj_gls_h,	// y
				frame_w - sash_width-sash_width-(adj_gls_w*2)-(muntin_thick/2),	// w
				frame_h - (c_sash_t) - (adj_gls_h*2),	// h
				adj_gls_h);			// o (sash overlap)
			if(grid != "NONE")						//sets 
				{
				vert = grid_pattern.charAt(0)-0;
				horz = grid_pattern.charAt(2)-0;
				drawGrid("c_glass_pane","c_grid_", vert,horz,grid_color,grid_thick);
				}
		}
		if(c_sash_flag == 2)
		{
			initMiteredSash("c_sash",
				frame_x + sash_width+(adj_gls_w/4), // x 
				frame_y + c_sash_t,	// y
				frame_w-sash_width-sash_width-(adj_gls_w/3)-(muntin_thick/2),	// w
				frame_h - (c_sash_t),	// h
				c_sash_t,color);			// f (sash frame extrusion width)
		}
	}
	if(material == "WOOD")
	{
		if(c_gls_flag == 2)				//determines if center glass is needed
		{
			initGlass("c_glass","c_sash",
				frame_x + sash_width+(adj_gls_w), // x 
				frame_y + c_sash_t +adj_gls_h,	// y
				frame_w - sash_width-sash_width-(adj_gls_w*2)-(muntin_thick/2),	// w
				frame_h - (c_sash_t) - (adj_gls_h*2),	// h
				adj_gls_h);			// o (sash overlap)
			if(grid != "NONE")						//sets 
				{
				vert = grid_pattern.charAt(0)-0;
				horz = grid_pattern.charAt(2)-0;
				drawGrid("c_glass_pane","c_grid_", vert,horz,grid_color,grid_thick);
				}
		}
		if(c_sash_flag == 2)
		{
			initMiteredSash("c_sash",
				frame_x + sash_width+(adj_gls_w/4), // x 
				frame_y + c_sash_t,	// y
				frame_w-sash_width-sash_width-(adj_gls_w/3)-(muntin_thick/2),	// w
				frame_h - (c_sash_t),	// h
				c_sash_t,color);			// f (sash frame extrusion width)
		}
	}
}
	if(material == "VINYL" || material == "ALUM")
	{
		if(frame_flag == 2)
		{
			initDoorMiterFrame("frame",
				0, // x 
				0,	// y
				width,	// w
				height,	// y
				frame_t,color);			// f (frame extrusion width)
		}
	}
	if(material == "WOOD")
	{
		if(frame_flag == 2)
		{
			trace("frame_t="+frame_t);
			initDoorNonMtrdFrame("frame",
				0, // x 
				0,	// y
				width,	// w
				height,	// y
				frame_t,color);			// f (frame extrusion width)
		}
	}

	if(frame_flag == 2 && l_sash_flag == 2 && r_sash_flag && c_sash_flag == 2)
	{
	createDim(0,frame_h + 7,frame_w,frame_h + 7,true);
	createDim(0, frame_h + 3, sash_width, frame_h + 3,true);
	createDim(frame_w + 3,0,frame_w + 3,frame_h,true);
	}
	if(frame_flag == 2 && l_sash_flag != 2 && r_sash_flag != 2 && c_sash_flag !=2)
	{
	createDim(0,frame_h + 3,frame_w,frame_h + 3,true);
	createDim(frame_w + 3,0,frame_w + 3,frame_h,true);
	}
	if(frame_flag != 2 && l_sash_flag == 2 && r_sash_flag != 2)
	{
	createDim(l_sash_t, frame_h +3,sash_width-adj_gls_w,frame_h+3,true);
	createDim(sash_width+3,l_sash_t,sash_width+3,frame_h-l_sash_t,true);
	}
	if(frame_flag != 2 && r_sash_flag == 2 && l_sash_flag != 2)
	{
	createDim(sash_width-r_sash_t,frame_h+3,frame_w-r_sash_t,frame_h+3,true);
	createDim(frame_w+3,r_sash_t,frame_w+3,frame_h-r_sash_t,true);
	}
	if(frame_flag != 2 && r_sash_flag == 2 && l_sash_flag == 2)
	{
	createDim(l_sash_t,frame_h+3,sash_width-adj_gls_w,frame_h+3,true);
	createDim(sash_width-r_sash_t,frame_h+7,frame_w-r_sash_t,frame_h+7,true);
	createDim(frame_w+3,r_sash_t,frame_w+3,frame_h-r_sash_t,true);
	}
	if(l_gls_flag == 2 && l_sash_flag !=2)
	{
	createDim(l_sash_t+adj_gls_w,frame_h+3,sash_width-l_sash_t,frame_h+3,true);
	}
	if(l_gls_flag == 2 && l_sash_flag !=2 && r_gls_flag !=2)
	{
	createDim(sash_width+2,frame_h-l_sash_t-adj_gls_h, sash_width+2,l_sash_t+adj_gls_h,true);
	}
	if(r_gls_flag ==2 && r_sash_flag !=2)
	{
	createDim(sash_width, frame_h+3,frame_w-r_sash_t-adj_gls_w,frame_h+3,true);
	createDim(frame_w+2,frame_h-r_sash_t-adj_gls_h,frame_w+2,r_sash_t+adj_gls_h,true);
	}
	if(grid != "NONE")
	{
		var vert = grid_pattern.charAt(0)-0;
		var horz = grid_pattern.charAt(2)-0;
		drawGrid("f_glass_pane","f_grid_",	vert,horz,grid_color,grid_thick);
		drawGrid("s_glass_pane","s_grid_", vert,horz,grid_color,grid_thick);
	}


	// Display slide direction indications
	if(r_sash_flag == 2 && handing == "OOX")
		{
		initDirection("r_direction","r_glass_pane","L");
		}
	if(l_sash_flag == 2 && handing == "XOO")
		{
		initDirection("l_direction","l_glass_pane","R");
		}
	if(c_sash_flag == 2 && handing == "OXOR")
		{
		initDirection("c_direction","c_glass_pane","R");
		}
	if(c_sash_flag == 2 && handing == "OXOL")
		{
		initDirection("c_direction","c_glass_pane","L");
		}
	
	returnConfigData();
	
}