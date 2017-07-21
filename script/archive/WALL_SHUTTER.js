// $import="windows.js"
// $import="shutter_routines.js"
// $return$

function generate(evt)
{

// $initialize$
// height and width are computed, so reinitialize these variables.
	height=gN("height");
	width=gN("width");
	unitCnt=s("unitCnt",gN("f_POS_COUNT"));

//NOTE:  The "applet" can an instance of either:
//		1) viewer applet (com.fc.drawings.SvgViewer)
//		2) mulled set (com.fc.drawings.MulledSet)
//		Both support the same interface.
	
// Register the overall window set so mulling seams can be
// alignment points.
	initRect("wall",0,0,width,height,"lightgray");

	drawUnits();
	
	
	if(f_applet == "true")
	{
		drawSwatches();
		applet.embedDocs();
		applet.setActiveWindow("");
	}
	
	returnConfigData();
}


function drawUnits()
{
	var unitCnt = gN("unitCnt");
	var x = 0;
	var y = 0;
	var w = 0;
	var h = 0;
	var hWall = gN("height");
	
	for(unit = 1; unit <= unitCnt; unit++)
	{
		x = gN("left"+unit);
		y = hWall - gN("bot"+unit) - gN("f_POS"+unit+"_unitHeight");
		w = gN("f_POS"+unit+"_unitWidth");
		h = gN("f_POS"+unit+"_unitHeight");
		embedSubmodel(unit,x,y,w,h);
			s("f_POS"+unit+"_x",x);
			s("f_POS"+unit+"_y",y);
	
		createDim(x,y-2,x+w,y-2,false);
		createDim(x+w+2,y,x+w+2,y+h,false);
		createDim(x+(w/2),y+h,x+(w/2),hWall,false);
		

	}
}


function setBusy(busy)
{
	//drawing.getElementById("wall").getStyle().setProperty("fill",(busy==true?"blue":"lightgray"),"");
	//applet.repaintDrawing();
	applet.evalExternalJS("showBusy(" + (busy==true ?"true":"false" )+ ");");
}

function drawSwatches()
{
	var x = gN("width")+2;
	var y = 16;
 
	initRect("swatch_PAINTED", x, 16, 3, 3, "white");
	initRect("swatch_UNFINISHED", x, 20, 3, 3, "tan");
	initRect("swatch_103", x, 24, 3, 3, "url(#103H)");
	initRect("swatch_104", x, 28, 3, 3, "url(#104H)");
	initRect("swatch_106", x, 32, 3, 3, "url(#106H)");
	initRect("swatch_105", x, 36, 3, 3, "url(#105H)");
	initRect("swatch_109", x, 40, 3, 3, "url(#109H)");
	initRect("swatch_110", x, 44, 3, 3, "url(#110H)");
	drawing.getElementById("swatch_PAINTED").setAttribute("onclick","changeFill(evt)");
	drawing.getElementById("swatch_UNFINISHED").setAttribute("onclick","changeFill(evt)");
	drawing.getElementById("swatch_103").setAttribute("onclick","changeFill(evt)");
	drawing.getElementById("swatch_104").setAttribute("onclick","changeFill(evt)");
	drawing.getElementById("swatch_106").setAttribute("onclick","changeFill(evt)");
	drawing.getElementById("swatch_105").setAttribute("onclick","changeFill(evt)");
	drawing.getElementById("swatch_109").setAttribute("onclick","changeFill(evt)");
	drawing.getElementById("swatch_110").setAttribute("onclick","changeFill(evt)");
}

function changeFill(evt)
{
	setBusy(true);

	applet.setActiveWindow("");
	var unitCnt = gN("unitCnt");

	var species = 	evt.getTarget().id;
	species = species.substring(7);
	s("species",species);
	
	var color = "WHITE";
	if(species == "PAINTED")
	{
		color = "WHITE";
	}
	else
	if(species == "UNFINISHED")
	{
		color = "TAN";
	}
	else
	{
		color = "*SPECIES";
	}
	

	for(unit = 1; unit <= unitCnt; unit++)
	{
		applet.setActiveWindow("p"+unit+"_");
		s("color",color);
		s("SPECIES",species);
		s("species",species);
		drawIt("p"+unit+"_",0,0,gN("width"),gN("height"),gN("thk_top"),gN("thk_bot"),gN("thk_div"));
	}
	setBusy(false);

}

function changeSlatSize(size)
{
	setBusy(true);
	applet.setActiveWindow("");
	var unitCnt = gN("unitCnt");
	s("louver",size);
	
	for(unit = 1; unit <= unitCnt; unit++)
	{
		applet.setActiveWindow("p"+unit+"_");
		s("louver",size);
		drawIt("p"+unit+"_",0,0,gN("width"),gN("height"),gN("thk_top"),gN("thk_bot"),gN("thk_div"));
	}
	applet.setActiveWindow("");
	redrawAlignmentLines();
	drawing.getElementById("window").setAttribute("cursor","default");
	setBusy(false);
}

var grpAlign = null;

function showAlignment(show)
{
	trace("showAlignment("+(show==true?"true":"false")+")");
	if(grpAlign === null)
	{
		drawAlignmentLines();
	}
	
	grpAlign.getStyle().setProperty("visibility",show==true?"visible":"hidden","");
}

function moveAlignment(unit,adjust)
{
	trace("moveAlingment('"+unit+"',"+adjust+")");

	var g =	drawing.getElementById(unit+"g_align");
	if(g === null)
	{
		trace("moveAlignment() failed...unit="+unit);
		return;
	}
	
	var t = g.getAttribute("transform");
	var y = eval(t.substring(t.indexOf(",")+1,t.indexOf(")")));
	t = t.substring(0,t.indexOf(",")+1)+(y+adjust)+")";
	trace("transform="+t);
	g.setAttribute("transform",t);

}
function redrawAlignmentLines()
{
	if(grpAlign !== null)
	{
		drawing.getElementById("window").removeChild(grpAlign);
	}
	grpAlign = null;
}


function drawAlignmentLines()
{
	trace("drawAlignmentLines()");
	var grp = drawing.createElementNS(svgNS,"g");
	grp.setAttribute("id","alignment_lines");
	grp.getStyle().setProperty("visibility","hidden","");
	drawing.getElementById("window").appendChild(grp);
	var unitGrp = null;
	var line = null;
	applet.setActiveWindow("");
	var unitCnt = gN("unitCnt");
	var hWall = gN("height");
	var x = 0;
	var y = 0;
	var w = 0;
	var h = 0;
	var t = 0;
	var s = 0;
	var b1,b2,e1,e2;
	var ix = 0;
	var st = 0;
	var lastEnd = 0;

	for(unit = 1; unit <= unitCnt; unit++)
	{
		applet.setActiveWindow("");
		
		x = gN("left"+unit);
		y = hWall - gN("bot"+unit) - gN("f_POS"+unit+"_unitHeight");
		w =  gN("f_POS"+unit+"_unitWidth");
		h =  gN("f_POS"+unit+"_unitHeight");
		applet.setActiveWindow("p"+unit+"_");
		t = gN("thk_top");
		st = gN("louver")-0.5;
		s = gN("slats");

		applet.setActiveWindow("");
	
		unitGrp = drawing.createElementNS(svgNS,"g");
		unitGrp.setAttribute("id","p"+unit+"_g_align");
		if(unit == 1)
		{
			unitGrp.setAttribute("transform","translate("+(x+w)+","+(y+t)+")");
			b2=0;
			e2= (gN("left"+(unit+1))- (x + w))/2;
			lastEnd = x+w+e2;
		}
		else
		{
			unitGrp.setAttribute("transform","translate("+(lastEnd)+","+(y+t)+")");
			b1=0;
			e1=x-lastEnd;
			if(unit < unitCnt)
			{
				b2=e1+w;
				e2 = b2 + (gN("left"+(unit+1))- (x + w))/2;
				lastEnd = x+w+(gN("left"+(unit+1))- (x + w))/2
			}
		}

		grp.appendChild(unitGrp);


		
		if(unit > 1)
		{
			for(ix=0;ix<s;ix++)
			{
				line = drawing.createElementNS(svgNS,"line");
				line.setAttribute("class","align");
				line.setAttribute("x1",b1);
				line.setAttribute("x2",e1);
				line.setAttribute("y1",st*ix);
				line.setAttribute("y2",st*ix);
				unitGrp.appendChild(line);
			}
		}
		if(unit < unitCnt)
		{
			for(ix=0;ix<s;ix++)
			{
				line = drawing.createElementNS(svgNS,"line");
				line.setAttribute("class","align");
				line.setAttribute("x1",b2);
				line.setAttribute("x2",e2);
				line.setAttribute("y1",st*ix);
				line.setAttribute("y2",st*ix);
				unitGrp.appendChild(line);
			}
		}
	}
	
	grpAlign = grp;
}



function align()
{
	trace("ALIGNING ORDER #" + g("f_order"));
	var rule = g("alignRule");
	var hWall = gN("height");
	if(rule == "M")
	{
		return;
	}
	
	var slatSize = gN("louver")-0.5;
	
	var mulledSet = MulledSet.getInstance(g("f_order"));
	var modelSetUnit = MulledUnit.getInstance(g("f_order"),g("f_item"));
	
	var drivingUnitId = Math.max(1,gN("drivingUnit"));
	var drivingUnit = mulledSet.getUnit(drivingUnitId);
	var alignedUnit = null;

	var driverSlat = 
			hWall 
			- gN("bot"+drivingUnitId) 
			- gN("f_POS"+drivingUnitId+"_unitHeight")
			+(drivingUnit.getVar("thk_top")-0);

	var alignSlat = 0;
	var offset = 0;
	var cntUnits = mulledSet.getCountUnits();
	var minTop = 0;
	var n = 1;
	for(n=1;n <= cntUnits; n++)
	{
		if(n == drivingUnitId)
		{
			continue;
		}
		alignUnit = mulledSet.getUnit(n);
		alignSlat = 
			hWall 
			- gN("bot"+n) 
			- gN("f_POS"+n+"_unitHeight")
			+(alignUnit.getVar("thk_top")-0);
		
		
		offset = Math.abs(driverSlat - alignSlat)%slatSize;
		if(alignSlat > driverSlat)
		{
			offset = -offset;
		}
		
		if(offset > (0.5*slatSize))
		{
			offset = (offset-slatSize);
			alignUnit.setVar("slats",(alignUnit.getVar("slats")-0+1));
		}
		if((alignUnit.getVar("thk_top")-0+offset) < (alignUnit.getVar("min_top")-0))
		{
			offset+=slatSize;
			alignUnit.setVar("slats",(alignUnit.getVar("slats")-1));
		}
		if(offset !== 0)
		{	
			alignUnit.setVar("thk_top", (alignUnit.getVar("thk_top")-0)+offset);
			if((alignUnit.getVar("thk_bot")-offset-0)<(alignUnit.getVar("min_bot")-0))
			{
				alignUnit.setVar("slats",(alignUnit.getVar("slats")-1));
				alignUnit.setVar("thk_bot", (alignUnit.getVar("thk_bot")-0)-offset+slatSize);
			}
			else
			{
				alignUnit.setVar("thk_bot", (alignUnit.getVar("thk_bot")-0)-offset);
			}
		}
	}
}

var timeOut = null;
function ratchetUp(evt)
{
	evt.getTarget().setAttribute("class","unpressed");
	applet.setActiveWindow(activeWindow);
	var script = null;
	if(timeOut !== null)
	{
		clearTimeout(timeOut);
		timeOut = null;
	}

	switch(resizeMode)
	{
		case "TOP":
			s("thk_top",gN("thk_top")-0.125);
			setText("txt_element_dim", inchesToInchesDim(gN("thk_top")));
			moveAlignment(g("f_idprefix"),-0.125);
			script ="applet.setActiveWindow('"+activeWindow+"');"+
					"setBusy(true);"+
					"drawIt('"+g("f_idprefix")+"',0,0,"+gN("width")+","+gN("height")+","+gN("thk_top")+","+gN("thk_bot")+","+gN("thk_div")+");"+
					"setBusy(false);";
			break;
		case "BOT":
			s("thk_bot",gN("thk_bot")+gN("louver"));
			setText("txt_element_dim", inchesToInchesDim(gN("thk_bot")));
			script ="applet.setActiveWindow('"+activeWindow+"');"+
			"setBusy(true);"+
			"drawIt('"+g("f_idprefix")+"',0,0,"+gN("width")+","+gN("height")+","+gN("thk_top")+","+gN("thk_bot")+","+gN("thk_div")+");"+
			"setBusy(false);";

			break;
		case "SLAT":
			s("louver",gN("louver")-.5);
			setText("txt_element_dim", inchesToInchesDim(gN("louver")));
			script ="changeSlatSize("+gN("louver")+");";

			break;
			
	}
	timeOut = setTimeout(script,500);
}

function ratchetDown(evt)
{
	evt.getTarget().setAttribute("class","unpressed");
	applet.setActiveWindow(activeWindow);
	var script = null;
	if(timeOut !== null)
	{
		clearTimeout(timeOut);
		timeOut = null;
	}
	switch(resizeMode)
	{
		case "TOP":
			s("thk_top",gN("thk_top")+0.125);
			setText("txt_element_dim", inchesToInchesDim(gN("thk_top")));
			moveAlignment(g("f_idprefix"),0.125);
			script ="applet.setActiveWindow('"+activeWindow+"');"+
				"setBusy(true);"+
				"drawIt('"+g("f_idprefix")+"',0,0,"+gN("width")+","+gN("height")+","+gN("thk_top")+","+gN("thk_bot")+","+gN("thk_div")+");"+
				"setBusy(false);";
			
			break;
	
		case "BOT":
			s("thk_bot",gN("thk_bot")-gN("louver"));
			setText("txt_element_dim", inchesToInchesDim(gN("thk_bot")));
			script ="applet.setActiveWindow('"+activeWindow+"');"+
			"setBusy(true);"+
			"drawIt('"+g("f_idprefix")+"',0,0,"+gN("width")+","+gN("height")+","+gN("thk_top")+","+gN("thk_bot")+","+gN("thk_div")+");"+
			"setBusy(false);";

			break;
			
		case "SLAT":
			s("louver",gN("louver")+.5);
			setText("txt_element_dim", inchesToInchesDim(gN("louver")));
			script ="changeSlatSize("+gN("louver")+");";

			break;
			
	}

	timeOut = setTimeout(script,500);
}
function ratchetLeft(evt)
{
	evt.getTarget().setAttribute("class","unpressed");
	var script = null;
	if(timeOut !== null)
	{
		clearTimeout(timeOut);
		timeOut = null;
	}

	switch(resizeMode)
	{
		case "LEFT":
			s("thk_side",gN("thk_side")-.25);
			setText("txt_element_dim", inchesToInchesDim(gN("thk_side")));

			break;
	
		case "RIGHT":
			s("thk_side",gN("thk_side")+.25);
			setText("txt_element_dim", inchesToInchesDim(gN("thk_side")));

			break;

	}
	script ="applet.setActiveWindow('"+activeWindow+"');drawIt('"+g("f_idprefix")+"',0,0,"+gN("width")+","+gN("height")+","+gN("thk_top")+","+gN("thk_bot")+","+gN("thk_div")+");";

	timeOut = setTimeout(script,500);

}

function ratchetRight(evt)
{
	evt.getTarget().setAttribute("class","unpressed");
	var script = null;
	if(timeOut !== null)
	{
		clearTimeout(timeOut);
		timeOut = null;
	}	
	switch(resizeMode)
	{
		case "LEFT":
			s("thk_side",gN("thk_side")+.25);
			setText("txt_element_dim", inchesToInchesDim(gN("thk_side")));
			break;
	
		case "RIGHT":
			s("thk_side",gN("thk_side")-.25);
			setText("txt_element_dim", inchesToInchesDim(gN("thk_side")));
			break;

	}
	script ="applet.setActiveWindow('"+activeWindow+"');drawIt('"+g("f_idprefix")+"',0,0,"+gN("width")+","+gN("height")+","+gN("thk_top")+","+gN("thk_bot")+","+gN("thk_div")+");";

	timeOut = setTimeout(script,500);

}


var dragHandleObj = null;
var dragHandleStart = null;


function startDragHandle(evt)
{
	if(applet==null)
		return;
trace("startDragHandle");
	dragHandleObj = evt.getTarget();
	dragHandleStart = getY(evt); 

	applet.setActiveWindow("p"+dragHandleObj.id.charAt(1)+"_");
}

function dragHandle(evt)
{
	

}



function endDragHandle(evt)
{
	if(dragHandleObj == null)
		return;
	var louver = gN("louver");	
	var louverSpacing = louver - 0.5;	
	var posNow = getY(evt); 	
	var id = dragHandleObj.getAttribute("id");
	id = id.substring(0,id.indexOf("_handle"));
	var netChange = -((dragHandleStart - posNow)/2);
	var openingNow = gN(id+"_open");
	var opening = openingNow + netChange;
	if(opening > louver)
	{
		opening = louver;
	}
	else
	if(opening < 0)
	{
		opening = 0;
	}
	if(Math.abs(opening - openingNow) < 0.25
		&& 
		!(openingNow != 0 && opening == 0))
	{
		return;
	}
	
	trace("dragHandle opening="+opening);
	var x = gN(id+"_x");
	var y = gN(id+"_y");
	var w = gN(id+"_w");
	var h = gN(id+"_h");
	var handlePos = gN(id+"_handlePos");
	
	 drawLouvers(id,x,y,w,h,louver,handlePos,opening,g("color"));

	trace("endDragHandle");
	dragHandleObj =  null;
	dragHandleStop = 0;
}

function createFrameEventHandlers(id)
{
	var top = drawing.getElementById(id+"_header");
	top.setAttribute("onclick","displayControls(evt)");
	
	var bottom = drawing.getElementById(id+"_sill");
	bottom.setAttribute("onclick","displayControls(evt)");
	
	var left = drawing.getElementById(id+"_left_jamb");
	left.setAttribute("onclick","displayControls(evt)");

	var right = drawing.getElementById(id+"_right_jamb");
	right.setAttribute("onclick","displayControls(evt)");

}

var resizeObj = null; 
var resizeObjId = null;
var resizeMode = null;
var activeWindow = null;
var xBase = 0;
var yBase = 0;

function displayControls(evt)
{

	if(resizeObj != null && resizeObj == evt.getTarget())
	{
		resizeObj = null;
		resizeObjId = null;
		
		resizeMode = null;
		drawing.getElementById("g_control_up").getStyle().setProperty("visibility","hidden","");
		drawing.getElementById("g_control_down").getStyle().setProperty("visibility","hidden","");
		drawing.getElementById("g_control_left").getStyle().setProperty("visibility","hidden","");
		drawing.getElementById("g_control_right").getStyle().setProperty("visibility","hidden","");
		drawing.getElementById("g_element_dim").getStyle().setProperty("visibility","hidden","");
		showAlignment(false);
		
	}
	else
	{
		timeOut = null;
		resizeObj = evt.getTarget();
		resizeObjId = resizeObj.id;
		applet.setActiveWindow("");
		activeWindow = "p"+resizeObjId.charAt(1)+"_";
		xBase = gN("f_POS"+resizeObjId.charAt(1)+"_x");
		yBase = gN("f_POS"+resizeObjId.charAt(1)+"_y");
		applet.setActiveWindow(activeWindow);
		refreshControls();
	}
	
}

function refreshControls()
{	
		
		var xC = 0;
		var yC = 0;
		resizeObj = drawing.getElementById(resizeObjId);
		drawing.getElementById("g_control_up").getStyle().setProperty("visibility","hidden","");
		drawing.getElementById("g_control_down").getStyle().setProperty("visibility","hidden","");
		drawing.getElementById("g_control_left").getStyle().setProperty("visibility","hidden","");
		drawing.getElementById("g_control_right").getStyle().setProperty("visibility","hidden","");
		drawing.getElementById("g_element_dim").getStyle().setProperty("visibility","hidden","");
		
		
		if(resizeObj.id.indexOf("_header") != -1)
		{
			showAlignment(true);
			applet.setActiveWindow(activeWindow);
			resizeMode = "TOP";
			xC = xBase+(resizeObj.getAttribute("x")-0)+(resizeObj.getAttribute("width")/2);
			yC = yBase+(resizeObj.getAttribute("y")-0)+(resizeObj.getAttribute("height")-0);
			if(gN("thk_top") > gN("min_top"))
			{
				drawing.getElementById("g_control_up").getStyle().setProperty("visibility","visible","");
				drawing.getElementById("g_control_up").setAttribute("transform","translate("+xC+","+yC+")" );
			}
			
			drawing.getElementById("g_control_down").getStyle().setProperty("visibility","visible","");
			drawing.getElementById("g_control_down").setAttribute("transform","translate("+xC+","+yC+")" );
		
			drawing.getElementById("g_element_dim").getStyle().setProperty("visibility","visible","");
			drawing.getElementById("g_element_dim").setAttribute("transform","translate("+(xC+2)+","+yC+")" );
			
			
			setText("txt_element_dim", inchesToInchesDim(gN("thk_top")));
			
		}
		else
		if(resizeObj.id.indexOf("_sill") != -1)
		{
			resizeMode = "BOT";
			xC = xBase+(resizeObj.getAttribute("x")-0)+(resizeObj.getAttribute("width")/2);
			yC = yBase+(resizeObj.getAttribute("y")-0);
			drawing.getElementById("g_control_up").getStyle().setProperty("visibility","visible","");
			drawing.getElementById("g_control_up").setAttribute("transform","translate("+xC+","+yC+")" );
			
			if(gN("thk_bot") > gN("louver"))
			{
				drawing.getElementById("g_control_down").getStyle().setProperty("visibility","visible","");
				drawing.getElementById("g_control_down").setAttribute("transform","translate("+xC+","+yC+")" );
			}
			drawing.getElementById("g_element_dim").getStyle().setProperty("visibility","visible","");
			drawing.getElementById("g_element_dim").setAttribute("transform","translate("+(xC+2)+","+yC+")" );
			setText("txt_element_dim", inchesToInchesDim(gN("thk_bot")));
				
		}
		else
		if(resizeObj.id.indexOf("_left") != -1)
		{
			showAlignment(false);
			applet.setActiveWindow(activeWindow);
			resizeMode = "LEFT";
			xC = xBase+(resizeObj.getAttribute("x")-0)+((resizeObj.getAttribute("width")-0));
			yC = yBase+(resizeObj.getAttribute("y")-0)+(resizeObj.getAttribute("height")/2);
			trace("xC="+xC);
			if(gN("thk_side") > gN("min_side"))
			{
				drawing.getElementById("g_control_left").getStyle().setProperty("visibility","visible","");
				drawing.getElementById("g_control_left").setAttribute("transform","translate("+xC+","+yC+")" );
			}
			
			if(gN("thk_side") < 6)
			{
				drawing.getElementById("g_control_right").getStyle().setProperty("visibility","visible","");
				drawing.getElementById("g_control_right").setAttribute("transform","translate("+xC+","+yC+")" );
			}
			drawing.getElementById("g_element_dim").getStyle().setProperty("visibility","visible","");
			drawing.getElementById("g_element_dim").setAttribute("transform","translate("+xC+","+(yC+2)+")" );
			setText("txt_element_dim", inchesToInchesDim(gN("thk_side")));
			
			
		}
		else
		if(resizeObj.id.indexOf("_right") != -1)
		{
		
		}
		else
		if(resizeObj.id.indexOf("_slat") != -1)
		{
			showAlignment(false);
			applet.setActiveWindow(activeWindow);
			resizeMode = "SLAT";
			xC = xBase+(resizeObj.getAttribute("x")-0)+(resizeObj.getAttribute("width")/2);
			yC = yBase+(resizeObj.getAttribute("y")-0)+(resizeObj.getAttribute("height")-0);
			
			if(gN("louver") > 2)
			{
				drawing.getElementById("g_control_up").getStyle().setProperty("visibility","visible","");
				drawing.getElementById("g_control_up").setAttribute("transform","translate("+xC+","+yC+")" );
			}
			if(gN("louver") <= 4)
			{
				drawing.getElementById("g_control_down").getStyle().setProperty("visibility","visible","");
				drawing.getElementById("g_control_down").setAttribute("transform","translate("+xC+","+yC+")" );
			}
			drawing.getElementById("g_element_dim").getStyle().setProperty("visibility","visible","");
			drawing.getElementById("g_element_dim").setAttribute("transform","translate("+(xC+2)+","+yC+")" );
			setText("txt_element_dim", inchesToInchesDim(gN("louver")));

		}
	
	}

	function press(evt)
	{
		evt.getTarget().setAttribute("class","pressed");
	}

	function calculateDimensions()
	{
		if(gN("height") === 0)
		{
			s("height",100);
		}
		var unitCnt = s("unitCnt",gN("f_POS_COUNT"));
		var x = 0;
		var y = 0;
		var w = 0;
		var h = 0;
		var left = 0;
		var hWall = gN("height");
		
		for(unit = 1; unit <= unitCnt; unit++)
		{
			left = gN("left"+unit);
			if(unit > 1 && left === 0)
			{
				left = s("left"+unit, x+12);
			}
			x = left+gN("f_POS"+unit+"_unitWidth");
		}
		if(gN("width") === 0)
		{
			s("width",x+12);
		}

		
	}

