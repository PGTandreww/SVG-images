// $import="windows.js"
// $return$

function generate(evt)
{
// $initialize$
	if(color == "ALMOND")
	{
		color = s("color","TAN");  // web color
	}
	if(grid_color == "ALMOND")
	{
		grid_color = s("grid_color","TAN"); //web color
	}
	if(glass_type=="CTCT")
	{
		s("f_glass","TEMPERED");
	}
		
	initGlass("glass",  // glass ID
			"sash",		// ID of containing frame
			adj_sash_w + adj_gls_w, // x 
			adj_sash_h + adj_gls_h,	// y
			width - (adj_sash_w * 2)  - (adj_gls_w * 2),	// w
			height - (adj_sash_h * 2)  - (adj_gls_h * 2),	// h
			sash_t);			// o (sash overlap)

	if(grid != "NONE")
	{
		initGrid(	"glass_pane",	// ID of glass pane (always ID of glass + "_pane")
					"grid_",		// grille element prefix
					grid_pattern,	// grille pattern
					grid_color,		// grille element color
					grid_thick);	// grille element thickness
	}
	
	if(material == "VINYL" || material == "ALUM")
	{
		initMiteredSash("sash",  // sash ID
			adj_sash_w, // x 
			adj_sash_h,	// y
			width - (adj_sash_w * 2),	// w
			height - (adj_sash_h * 2),	// h
			sash_t,			// sash frame thickness
			color);			// color
	}
	else
	if(material == "WOOD")
	{
		initNonMiteredSash("sash", // sash ID
				adj_sash_w, // x 
				adj_sash_h,	// y
				width - (adj_sash_w * 2),	// w
				height - (adj_sash_h * 2),	// h
				sash_t,			// sash frame thickness
				color);			// color
	}

	if(material == "VINYL" || material == "ALUM")
	{
		initOuterMiterFrame("frame",  // id
			0, 			// x 
			0,			// y
			width,		// w
			height,		// y
			frame_t,  	// side frame thickness
			frame_t,  	// top frame thickness
			frame_t,	// bottom frame thickness
			color);		// color/fill pattern
	}
	else
	if(material == "WOOD")
	{
		initOuterNonMtrdFrame("frame", // id
				0, 			// x 
				0,			// y
				width,		// w
				height,		// y
				frame_t,  	// side frame thickness
				frame_t,  	// top frame thickness
				frame_t,	// bottom frame thickness
				color);		// color/fill pattern
	}		
	
	if(f_nested != "true")
	{	
		createDim(0,-3,width,-3,true);	//used for frame width dim
		createDim(-3,0,-3,height,true);	//used for frame height dim
	}
	
	returnConfigData();  // post values to confguration code
}

