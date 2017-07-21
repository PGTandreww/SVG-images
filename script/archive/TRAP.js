// $import="windows.js"
// $return$

function generate(evt)
{
// $initialize$
height = gN("height");
width = gN("width");
leg_height = gN("leg_height");
handing = g("handing");

if(color === "")
{
	color = "gray";	
}	
if(color == "ALMOND")
{
	color = "TAN";  // web color
}
	
if(grid_color === "ALMOND")
{
	grid_color = "TAN"; // web color
}

if(grid == "")
{
	grid = "NONE";
}
	var frame_x = 0;
	var frame_y = 0;

	if(gls_flag == 2)
	{
			initGlassTrapezoid("glass","frame",0, 0, width, height, leg_height, adj_gls_w, .75, handing+"T");
	}
	if(grid != "NONE")
	{
		alignHorzBars("glass_pane","grid_",grid_pattern);
		initGrid("glass_pane","grid_",	grid_pattern,grid_color,grid_thick);
	}

	if(fr_flag == 2)
	{
	//	initMitredTrapezoidFrame("frame", 0, 0, width, height, leg_height, frame_t, color, handing+"T");
		initTrapezoidFrame("frame", 0, 0, width, height, leg_height, frame_t,frame_t*1.25, color, handing+"T");
		
	}

	if(fr_flag == 2  && f_nested != "true")
	{
		createDim(0,height + 3,width,height + 3,true);	//used for frame width dim
		if(handing=="L")
		{
			createDim(width + 3,0,width + 3,height,true);	//used for frame height dim
			createDim(-3,height,-3,(height-leg_height),true);  //used for leg height dim
		}
		else
		{
			createDim(-3,0,-3,height,true);	//used for frame height dim
			createDim(width+3,height,width+3,(height-leg_height),true);  //used for leg height dim
		}
		
	}

	returnConfigData();
}

function calculateDimensions()
{
	if(true) // g("model_set") == "MULTI-TRAP")
	{
		calculateDimensionsInModelset();
	}
	else
	{
		s("height",dimsToInches(g("height_ft"),g("height_in"),g("height_frac")));
		s("width",dimsToInches(g("width_ft"),g("width_in"),g("width_frac")));
	}
		
}

function calculateDimensionsInModelset()
{

/* TEMPORARY */
//s("position",gN("f_item")-1);
//s("ov_height_r",96);

	var totalWidth = gN("ov_width");
	var leftHeightTotal = gN("ov_height_l");
	var rightHeightTotal = gN("ov_height_r");
	var low = Math.min(leftHeightTotal,rightHeightTotal);
	var high = Math.max(leftHeightTotal,rightHeightTotal);
	
	var width = gN("width");
	trace("width="+width);
	if(width === 0)
	{
		width=s("width",dimsToInches(g("width_ft"),g("width_in"),g("width_frac")));
		trace("width="+width);
	}
	
	var lites = gN("no_of_lites");
	var gap = (totalWidth - (lites*width))/(lites-1);
	trace("gap="+gap);
	var pos = gN("position");
	trace("position="+pos);
	
	var angle = Math.atan2(high-low,totalWidth);
	trace("angle="+angle);
	
	var tan = Math.tan(angle);
	trace("tan="+tan);
	
	var step1,step2,relPos;
	
	
	if(leftHeightTotal <= rightHeightTotal)
	{
		s("handing","L");
		relPos = pos;
	}
	else
	{
		s("handing","R");
		relPos = lites-pos+1;
	}
	
	step1 = (relPos-1)*(width+gap)*tan;	
	step2 = step1+(width*tan);
	s("height",low+step2);
	s("leg_height",low+step1);	
	trace("height="+g("height"));
}

function alignHorzBars(glassId,varNamePrefix,grid_pattern)
{
	if(false) // g("model_set") != "MULTI-TRAP")
	{
		return;
	}
	var ix = grid_pattern.indexOf('H');
	if(ix == -1)
	{
		return; // nothing to align
	}

	var hLite = gN("height");
	var hLeg = gN("leg_height");

	var hGlass = drawing.getElementById(glassId).getAttribute("height");

	var leftHeightTotal = gN("ov_height_l");
	var rightHeightTotal = gN("ov_height_r");
	var high = Math.max(leftHeightTotal,rightHeightTotal);
	var low = Math.min(leftHeightTotal,rightHeightTotal);
	
	if(hLeg<=low)
	{
		return;  // nothing to do ... driving lite for alignment
	}
	
	var stepDown = hLeg - low;
	trace("stepDown="+stepDown);
	
	var hBars = grid_pattern.charAt(ix-1)-0;
	trace("hBars="+hBars);
	trace("low="+low);
	trace("hLite="+hLite);
	trace("hLeg="+hLeg);
	var hSep = (low+(hLite-hLeg))/(hBars+1);
	trace("hSep="+hSep);
	
	var n = 1;
	
	for(;n <= hBars; n++)
	{
		s(varNamePrefix+"h"+n,stepDown+(hSep*n));
	}

}
