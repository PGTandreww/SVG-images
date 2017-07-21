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

// f_POS_COUNT = 1;
for(;i<=f_POS_COUNT;i++)
{
	x = g("f_POS"+i+"_x") - 0;
	y = g("f_POS"+i+"_y") - 0;
	w = g("f_POS"+i+"_w") - 0;
	h = g("f_POS"+i+"_h") - 0;
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
	
	hdim_offset = g("f_POS"+i+"_HDIMOFFSET") - 0;
	if(hdim_offset != 0)
	{
		createDim(x,f_height + hdim_offset,x+w,f_height + hdim_offset,false);
	}
	
	vdim_offset = g("f_POS"+i+"_VDIMOFFSET") - 0;
	if(vdim_offset != 0)
	{
		createDim(f_width+vdim_offset,y,f_width + vdim_offset,y+h,false);
	}
	
}
	
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
	
	var mulledSet = null;
	if(g("f_mulling") == "true")
	{
		mulledSet = MulledSet.getInstance(g("f_order"));
		mulledSet.setPosition(pos,x,y);
		return;
	}

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
//	img.setAttribute("preserveAspectRatio","none");
	
	img.setAttributeNS(xlinkNS,"href",url);
	grpWindow.appendChild(img);
}catch(e)
{
	alertUser("Exception:  embedSubmodelImage('"+url+"',"+pos+","+x+","+y+","+w+","+h+")");
	alertUser(e);
	trace(e);
}		
}

function align()
{

	trace("ALIGNING ORDER #" + g("f_order"));
	
	var mulledSet = MulledSet.getInstance(g("f_order"));
	var modelSetUnit = MulledUnit.getInstance(g("f_order"),g("f_item"));
	
	
	var drivingUnit = null;
	var alignedUnit = null;

	
	var cntUnits = mulledSet.getCountUnits();
	
	var n,m = 1;
	for(n=1;n <= cntUnits; n++)
	{
		drivingUnit = mulledSet.getUnit(n);
		if(drivingUnit.isLeftmostUnit())
		{
			for(m=1;m <= cntUnits; m++)
			{
				alignedUnit = mulledSet.getUnit(m);
				if(m!=n && alignedUnit.isRight(drivingUnit))
				{
				trace("Horizontally aligning P"+n+" to P"+m);
				trace("driver...x="+drivingUnit.getX()+" y="+drivingUnit.getY()+" w="+drivingUnit.getW()+" h="+drivingUnit.getH());
				trace("aligned..x="+alignedUnit.getX()+" y="+alignedUnit.getY()+" w="+alignedUnit.getW()+" h="+alignedUnit.getH());
					alignedUnit.horzAlignTo(drivingUnit,"BT","Center",4);
				}
			}
		}
	}

	for(n=1;n <= cntUnits; n++)
	{
		topUnit = mulledSet.getUnit(n);
		if(topUnit.isTopUnit())
		{
			for(m=1;m <= cntUnits; m++)
			{
				drivingUnit = mulledSet.getUnit(m);
				if(m!=n && drivingUnit.isBelow(topUnit))
				{
				trace("Vertically aligning P"+n+" to P"+m);
				trace("driver...x="+drivingUnit.getX()+" y="+drivingUnit.getY()+" w="+drivingUnit.getW()+" h="+drivingUnit.getH());
				trace("aligned..x="+topUnit.getX()+" y="+topUnit.getY()+" w="+topUnit.getW()+" h="+topUnit.getH());
				
					topUnit.vertAlignTo(drivingUnit,"LR","Center",4);
				}
			}
			drivingUnit = mulledSet.getMasterUnit();
			topUnit.vertAlignTo(drivingUnit,"LR","Center",4);
		}
	}
	
	mulledSet.setErrorMsg("Please review and adjust grid alignment.");
}
