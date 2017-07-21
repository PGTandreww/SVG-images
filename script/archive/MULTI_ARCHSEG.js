// $import="windows.js"
// $return$

function generate(evt)
{

// $initialize$
	if(f_mulling == "true")
	{
		return;  // do nothing ... align() will be called by MulledSet.createInstance().
	}



var i=1;
var x=0;
var y=0;
var w=0;
var h=0;
var item=0;
var pn = "";
var drawModel = "";
var hdim_offset = 0;
var vdim_offset = 0;
var img_url = "";

var mulledSet = null;
var masterUnit = null;
if(f_applet == "true")
{
	applet.registerLite("p0_",0,0,f_width,f_height,null);
}


var totalWidth = gN("ov_width");
var totalHeight = gN("ov_height");
var unitWidth = gN("width_in");
var lites = gN("no_of_lites");
var gap = (totalWidth - (lites*unitWidth))/(lites-1);
var archHeight = gN("ov_arch_height");
createDim(-4,0,-4,totalHeight,false);
createDim(0,-4,totalWidth,-4,false);

// f_POS_COUNT = 1;
for(;i<=lites;i++)
{
	x = (i-1)*(unitWidth+gap);
	w = unitWidth;
	h = getUnitHeight(i);
	y = totalHeight - h;
	
	item = g("f_POS"+i+"_ITEM") - 0;
	pn = g("f_POS"+i+"_PN");
	drawModel = g("f_POS"+i+"_DRAWING");
	img_url = g("f_POS"+i+"_IMGURL");
	
	if(f_applet == "true")
	{
		embedSubmodelSvg(img_url,i,x,y,w,h,pn);
	}
	else
	{
		embedSubmodelImage(img_url,i,x,y,w,h);
	}
	
	createDim(x,y+h+4,x+w,y+h+4,false);
	createDim(x+w+(gap/2),totalHeight- getUnitRightHeight(i),x+w+(gap/2),totalHeight,false);
	
}
	createDim(totalWidth+(gap/2),0,totalWidth+(gap/2),archHeight,false);
	if(f_applet == "true")
	{
		applet.embedDocs();
	}

	returnConfigData();
}

function embedSubmodelSvg(url,pos,x,y,w,h,pn)
{
try{
	trace("embedSubmodelSvg('"+url+"',"+pos+","+x+","+y+","+w+","+h+")");
	var grpWindow = drawing.getElementById("window");
	if(grpWindow == null)
	{
		alert("<g id=window ... is required in all drawings.");
		return;
	}
// Generate Download Progress
	var	grp = drawing.createElementNS(svgNS,"g");
	grp.setAttribute("id","p" + pos);
	grp.setAttribute("transform","translate("+x+","+y+")");
	
	var	progress = drawing.createElementNS(svgNS,"g");
	
	progress.setAttribute("id","p" + pos + "_PROGRESS");
	progress.setAttribute("transform","translate("+(w/2)+","+(h/2)+")");

	var use = drawing.createElementNS(svgNS,"use");
	use.setAttribute("id","p" + pos + "_PROGRESS_WHEEL");
	use.setAttributeNS(xlinkNS,"href","#progress");
	use.setAttribute("transform","translate(12,2)");
	use.setAttribute("visibility","hidden");
	var text = drawing.createElementNS(svgNS,"text");
	text.setAttribute("x","12");
	text.setAttribute("y","3");
	text.setAttribute("class","prod");
	var textContent = drawing.createTextNode(pn);
	text.appendChild(textContent);
	
	progress.appendChild(use);
	progress.appendChild(text);
	grp.appendChild(progress);
	
	applet.registerVertElement("p0_V_SEAM_"+pos,
								"p0",
								x,
								gN("mullion_thk"),							 	
								null);

	
	grpWindow.appendChild(grp);
	
	applet.addEmbed("p" + pos, url);

}catch(e)
{
	alertUser("Exception:  embedSubmodelSvg('"+url+"',"+pos+","+x+","+y+","+w+","+h+")");
	alertUser(e);
	trace(e);
}			
}

function embedSubmodelImage(url,pos,x,y,w,h)
{
try{
	trace("embedSubmodelImage('"+url+"',"+pos+","+x+","+y+","+w+","+h+")");

	var grpWindow = drawing.getElementById("window");
	if(grpWindow == null)
	{
		trace("<g id=window ... is required in all drawings.");
		return;
	}

	var	img = drawing.createElementNS(svgNS,"image");
	img.setAttribute("id","EMBED_POS_" + pos);
	img.setAttribute("x",x);
	img.setAttribute("y",y);
	img.setAttribute("width",w);
	img.setAttribute("height",h);
	img.setAttributeNS(xlinkNS,"href",url);
	grpWindow.appendChild(img);
}catch(e)
{
	alertUser("Exception:  embedSubmodelSvg('"+url+"',"+pos+","+x+","+y+","+w+","+h+")");
	alertUser(e);
	trace(e);
}		
}

function align()
{
return;
	trace("ALIGNING ORDER #" + g("f_order"));
	
	var mulledSet = MulledSet.getInstance(g("f_order"));
	var modelSetUnit = MulledUnit.getInstance(g("f_order"),g("f_item"));
	
	
	var drivingUnit = null;
	var alignedUnit = null;
	var unit = null;
	var nDrivingUnit = 0;
	var cntUnits = mulledSet.getCountUnits();
	
	var n,m = 1;
	var totalHeight = Math.max(gN("ov_height_l"),gN("ov_height_r"));
	
	var minHeight = totalHeight
	// driving unit
	for(n=1;n <= cntUnits; n++)
	{
		unit = mulledSet.getUnit(n);
		if((unit.getVar("height")-0) < minHeight)
		{
			drivingUnit = unit;
			minHeight = unit.getVar("height")-0;
			nDrivingUnit = n;
		}
	}
	for(n=1;n <= cntUnits; n++)
	{
		if(n == nDrivingUnit)
		{
			continue;
		}
		alignedUnit = mulledSet.getUnit(n);
		alignedUnit.horzAlignTo(drivingUnit, "BT", "Center", 32);
	}
	
	// mulledSet.setErrorMsg("Please review and adjust grid alignment.");
}

function getUnitHeight(pos)
{
	var totalWidth = gN("ov_width");
	var totalHeight = gN("ov_height");
	var totalArchHeight = gN("ov_arch_height");
	
	var legHeight = totalHeight - totalArchHeight;
	
	var width = gN("width_in");
	trace("width="+width);
	if(width === 0)
	{
		width=s("width",dimsToInches(g("width_ft"),g("width_in"),g("width_frac")));
		trace("width="+width);
	}
	var lites = gN("no_of_lites");
	var gap = (totalWidth - (lites*width))/(lites-1);
	trace("gap="+gap);
	trace("position="+pos);

	computeCircleCenter(0,totalArchHeight,totalWidth/2,0,totalWidth,totalArchHeight); 
	var r = R;
	var xCenter = Xo;
	var yCenter = Yo;
	
	var xLeft = (pos-1)*(width+gap);
	var xRight = xLeft+width;
	var yLeft = xLeft<xCenter?yCenter-Math.sqrt(Math.pow(r,2)-Math.pow(xCenter-xLeft,2)):
							  yCenter-Math.sqrt(Math.pow(r,2)-Math.pow(xLeft-xCenter,2));
	var yRight = xRight<xCenter?yCenter-Math.sqrt(Math.pow(r,2)-Math.pow(xCenter-xRight,2)):
								yCenter-Math.sqrt(Math.pow(r,2)-Math.pow(xRight-xCenter,2));
	trace("yLeft="+yLeft);
	trace("yRight="+yRight);
	trace("totalHeight="+totalHeight);
	
	var adjY = yLeft==yRight ? 0 : Math.min(yLeft,yRight);
	
	return totalHeight - adjY;
}

function getUnitRightHeight(pos)
{
	var totalWidth = gN("ov_width");
	var totalHeight = gN("ov_height");
	var totalArchHeight = gN("ov_arch_height");
	
	var legHeight = totalHeight - totalArchHeight;
	
	var width = gN("width_in");
	trace("width="+width);
	if(width === 0)
	{
		width=s("width",dimsToInches(g("width_ft"),g("width_in"),g("width_frac")));
		trace("width="+width);
	}
	var lites = gN("no_of_lites");
	var gap = (totalWidth - (lites*width))/(lites-1);
	trace("gap="+gap);

	computeCircleCenter(0,totalArchHeight,totalWidth/2,0,totalWidth,totalArchHeight); 
	var r = R;
	var xCenter = Xo;
	var yCenter = Yo;
	
	var xLeft = (pos-1)*(width+gap);
	var xRight = xLeft+width;
	var yLeft = xLeft<xCenter?yCenter-Math.sqrt(Math.pow(r,2)-Math.pow(xCenter-xLeft,2)):
							  yCenter-Math.sqrt(Math.pow(r,2)-Math.pow(xLeft-xCenter,2));
	var yRight = xRight<xCenter?yCenter-Math.sqrt(Math.pow(r,2)-Math.pow(xCenter-xRight,2)):
								yCenter-Math.sqrt(Math.pow(r,2)-Math.pow(xRight-xCenter,2));
	
	
	
	
	return (totalHeight - yRight);

}	


function calculateDimensions()
{
var totalWidth = gN("ov_width");
var totalHeight = gN("ov_height");
var width = gN("width_in");
var lites = gN("no_of_lites");
var gap = (totalWidth - (lites*width))/(lites-1);

		s("height",totalHeight);
		s("width",totalWidth+gap);
}
