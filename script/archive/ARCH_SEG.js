// $import="windows.js"
// $return$


function generate(evt)
{
// $initialize$

if(pLT === undefined)
{
	calculateDimensionsInModelset();
}

height = g("height");
width = g("width");

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
if(archHeight === 0)
{
	archHeight = height - legHeight;
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
 

initGlassArchCircularSeg("glass", "frame", pLT, pRT, pLB, pRB, pC, r, t/2);

if(grid != "NONE")
{	
	switch(grid_pattern.charAt(0))
	{
		case 'A':
		case 'S':
		case 'G':
			initArchGrille("glass_pane", -adjX,-adjY,ov_width,ov_arch_height, ov_height-ov_arch_height, t/2, grid_pattern, 0.75, color,"F");
			break;
		default:
			alignHorzBars("glass_pane","grid_",grid_pattern);
			initGrid("glass_pane","grid_",	grid_pattern, color, 0.75);
			break;
	}
}

initArchCircularSeg("frame", pLT, pRT, pLB, pRB, pC, r, t, color);
		
if( f_nested != "true")
{	
	createDim(0,pRB.y + 3,pRT.x,pRB.y + 3,true);
	if(pLT.y != pRT.y)
	{
		createDim(pRB.x + 2,0,pRB.x + 2,Math.abs(pLT.y-pRT.y),true);
		createDim(pRB.x + 2,Math.abs(pLT.y-pRT.y),pRB.x + 2,pRB.y,true);
	}
	else
	{
		createDim(pRB.x + 2,0,pRB.x + 2,pRB.y,true);
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

var pLT, pRT, pLB, pRB, pC, r, adjX, adjY;


function calculateDimensionsInModelset()
{
trace("calculateDimensionsInModelset()");

	var totalWidth = gN("ov_width");
	var totalHeight = gN("ov_height");
	var totalArchHeight = gN("ov_arch_height");
	
	var legHeight = totalHeight - totalArchHeight;
	
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

	computeCircleCenter(0,totalArchHeight,totalWidth/2,0,totalWidth,totalArchHeight); 
	r = R;
	var xCenter = Xo;
	var yCenter = Yo;
	
	var xLeft = (pos-1)*(width+gap);
	var xRight = xLeft+width;
	var yLeft = xLeft<xCenter?yCenter-Math.sqrt(Math.pow(r,2)-Math.pow(xCenter-xLeft,2)):
							  yCenter-Math.sqrt(Math.pow(r,2)-Math.pow(xLeft-xCenter,2));
	var yRight = xRight<xCenter?yCenter-Math.sqrt(Math.pow(r,2)-Math.pow(xCenter-xRight,2)):
								yCenter-Math.sqrt(Math.pow(r,2)-Math.pow(xRight-xCenter,2));
	
	adjX = xLeft
	adjY = yLeft==yRight ? 0 : Math.min(yLeft,yRight);
	
	pLT = new Point(xLeft-adjX,yLeft-adjY);
	pRT = new Point(xRight-adjX,yRight-adjY);
	pLB = new Point(xLeft-adjX,totalHeight-adjY);
	pRB = new Point(xRight-adjX,totalHeight-adjY);
	pC = new Point(xCenter-adjX,yCenter-adjY);							
	trace("pLT="+pLT.x+","+pLT.y);	
	trace("pRT="+pRT.x+","+pRT.y);	
	trace("pLB="+pLB.x+","+pLB.y);	
	trace("pRB="+pRB.x+","+pRB.y);	
	trace("pC="+pC.x+","+pC.y);	
	trace("r="+r);	

	s("height",totalHeight - adjY);
	s("leg_height",legHeight);
	trace("height="+g("height"));
}

function alignHorzBars(glassId,varNamePrefix,grid_pattern)
{
	if(false) // g("model_set") != "MULTI-ARCHSEG")
	{
		return;
	}
	
	var ix = grid_pattern.indexOf('H');
	if(ix == -1)
	{
		return; // nothing to align
	}

	var totalHeight = gN("ov_height");
	var totalArchHeight = gN("ov_arch_height");
	var legHeight = totalHeight - totalArchHeight;

	var hGlass = drawing.getElementById(glassId).getAttribute("height");
	
	var hBars = grid_pattern.charAt(ix-1)-0;
	var hSep = legHeight/(hBars);
	trace("hSep="+hSep);
	
	var n = hBars;
	
	for(;n > 0; n--)
	{
		s(varNamePrefix+"h"+n,hGlass- (hSep*(hBars-n+1)));
	}

}
