// $import="windows.js"
// $return$

function generate(evt)
{
// $initialize$
drawing.getElementById("window").setAttribute("onmouseup","endDragHandle(evt)");
initImage("palmtree", null, "palmtree.jpg",0,0,width,height);
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
	//s("SPECIES","106");
	 s("SPECIES",species);
}
s("color",color);
drawIt();
createDim(0,-3,width,-3,false); //used for frame width dim
createDim(-3,0,-3,height,false); //used for frame height dim



	returnConfigData();

}

function drawIt()
{
var panel_layout = g("panel_layout");
var width = gN("width");
var height = gN("height");
var thk_side = gN("thk_side");
var thk_top = gN("thk_top");
var thk_bot = gN("thk_bot");
var thk_div = gN("thk_div");
var louver = gN("louver");
var handlePos = gN("handlePos");
var color = g("color");
var spacing = .125;


switch(panel_layout)
{ 
case 'P2.2D.1L':
	drawShutter("shutter_frame_1",0,0,width,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_2",0,((height-spacing)/2)+spacing,width,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	break;

case 'P2.2D.2':
	drawShutter("shutter_frame_1",0,0,(width-spacing)/2,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_2",(width-spacing)/2+spacing,0,(width-spacing)/2,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);

	drawShutter("shutter_frame_3",0,((height-spacing)/2)+spacing,(width-spacing)/2,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_4",(width-spacing)/2+spacing,((height-spacing)/2)+spacing,(width-spacing)/2,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);

	break;

case 'P2.2D.3L':
	drawShutter("shutter_frame_1",0,0,(width-(2*spacing))/3,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_2",(width-(2*spacing))/3+spacing,0,(width-(2*spacing))/3,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_3",2*((width-(2*spacing))/3+spacing),0,(width-(2*spacing))/3,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);

	drawShutter("shutter_frame_4",0,((height-spacing)/2)+spacing,(width-(2*spacing))/3,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_5",(width-(2*spacing))/3+spacing,((height-spacing)/2)+spacing,(width-(2*spacing))/3,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_6",2*((width-(2*spacing))/3+spacing),((height-spacing)/2)+spacing,(width-(2*spacing))/3,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);

	break;

case 'P2.2D.4':
	drawShutter("shutter_frame_1",0,0,(width-(3*spacing))/4,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_2",(width-(3*spacing))/4+spacing,0,(width-(3*spacing))/4,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_3",2*((width-(3*spacing))/4+spacing),0,(width-(3*spacing))/4,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_4",3*((width-(3*spacing))/4+spacing),0,(width-(3*spacing))/4,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);

	drawShutter("shutter_frame_5",0,((height-spacing)/2)+spacing,(width-(3*spacing))/4,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_6",(width-(3*spacing))/4+spacing,((height-spacing)/2)+spacing,(width-(3*spacing))/4,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_7",2*((width-(3*spacing))/4+spacing),((height-spacing)/2)+spacing,(width-(3*spacing))/4,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_8",3*((width-(3*spacing))/4+spacing),((height-spacing)/2)+spacing,(width-(3*spacing))/4,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);

	break;
	
case 'P2.2D.6':
	drawShutter("shutter_frame_1",0,0,(width-(5*spacing))/6,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_2",(width-(5*spacing))/6+spacing,0,(width-(5*spacing))/6,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_3",2*((width-(5*spacing))/6+spacing),0,(width-(5*spacing))/6,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_4",3*((width-(5*spacing))/6+spacing),0,(width-(5*spacing))/6,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_5",4*((width-(5*spacing))/6+spacing),0,(width-(5*spacing))/6,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_6",5*((width-(5*spacing))/6+spacing),0,(width-(5*spacing))/6,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);

	drawShutter("shutter_frame_7",0,((height-spacing)/2)+spacing,(width-(5*spacing))/6,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_8",(width-(5*spacing))/6+spacing,((height-spacing)/2)+spacing,(width-(5*spacing))/6,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_9",2*((width-(5*spacing))/6+spacing),((height-spacing)/2)+spacing,(width-(5*spacing))/6,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_10",3*((width-(5*spacing))/6+spacing),((height-spacing)/2)+spacing,(width-(5*spacing))/6,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_11",4*((width-(5*spacing))/6+spacing),((height-spacing)/2)+spacing,(width-(5*spacing))/6,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_12",5*((width-(5*spacing))/6+spacing),((height-spacing)/2)+spacing,(width-(5*spacing))/6,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);

	break;	
			
case 'P.1C.1':
	drawShutter("shutter_frame",0,height/2,width,height/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	break;
case 'P2.1C.2':
	drawShutter("shutter_frame_1",0,height/2,(width-spacing)/2,height/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_2",(width-spacing)/2+spacing,height/2,(width-spacing)/2,height/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	break;	
case 'P.1C.3':
	drawShutter("shutter_frame_1",0,height/2,(width-(2*spacing))/3,height/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_2",(width-(2*spacing))/3+spacing,height/2,(width-(2*spacing))/3,height/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_3",2*((width-(2*spacing))/3+spacing),height/2,(width-(2*spacing))/3,height/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	break;
case 'P2.1C.4':
	drawShutter("shutter_frame_1",0,height/2,(width-(3*spacing))/4,height/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_2",(width-(3*spacing))/4+spacing,height/2,(width-(3*spacing))/4,height/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_3",2*((width-(3*spacing))/4+spacing),height/2,(width-(3*spacing))/4,height/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_4",3*((width-(3*spacing))/4+spacing),height/2,(width-(3*spacing))/4,height/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	break;		
case 'P2.1C.6':
	drawShutter("shutter_frame_1",0,height/2,(width-(5*spacing))/6,height/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_2",(width-(5*spacing))/6+spacing,height/2,(width-(5*spacing))/6,height/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_3",2*((width-(5*spacing))/6+spacing),height/2,(width-(5*spacing))/6,height/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_4",3*((width-(5*spacing))/6+spacing),height/2,(width-(5*spacing))/6,height/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_5",4*((width-(5*spacing))/6+spacing),height/2,(width-(5*spacing))/6,height/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_6",5*((width-(5*spacing))/6+spacing),height/2,(width-(5*spacing))/6,height/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	break;		


case 'P.1F.1':
	drawShutter("shutter_frame",0,0,width,height,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	break;
case 'P2.1F.2':
	drawShutter("shutter_frame_1",0,0,(width-spacing)/2,height,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_2",(width-spacing)/2+spacing,0,(width-spacing)/2,height,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	break;	
case 'P.1F.3':
	drawShutter("shutter_frame_1",0,0,(width-(2*spacing))/3,height,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_2",(width-(2*spacing))/3+spacing,0,(width-(2*spacing))/3,height,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_3",2*((width-(2*spacing))/3+spacing),0,(width-(2*spacing))/3,height,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	break;
case 'P2.1F.4':
	drawShutter("shutter_frame_1",0,0,(width-(3*spacing))/4,height,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_2",(width-(3*spacing))/4+spacing,0,(width-(3*spacing))/4,height,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_3",2*((width-(3*spacing))/4+spacing),0,(width-(3*spacing))/4,height,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_4",3*((width-(3*spacing))/4+spacing),0,(width-(3*spacing))/4,height,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	break;		
case 'P2.1F.6':
	drawShutter("shutter_frame_1",0,0,(width-(5*spacing))/6,height,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_2",(width-(5*spacing))/6+spacing,0,(width-(5*spacing))/6,height,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_3",2*((width-(5*spacing))/6+spacing),0,(width-(5*spacing))/6,height,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_4",3*((width-(5*spacing))/6+spacing),0,(width-(5*spacing))/6,height,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_5",4*((width-(5*spacing))/6+spacing),0,(width-(5*spacing))/6,height,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter("shutter_frame_6",5*((width-(5*spacing))/6+spacing),0,(width-(5*spacing))/6,height,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	break;		

case 'P.1D.1':
	drawShutter("shutter_frame",0,0,width,height,thk_side,thk_top,thk_bot,thk_div,louver,handlePos,color);
	break;
case 'P2.1D.2':
	drawShutter("shutter_frame_1",0,0,(width-spacing)/2,height,thk_side,thk_top,thk_bot,thk_div,louver,handlePos,color);
	drawShutter("shutter_frame_2",(width-spacing)/2+spacing,0,(width-spacing)/2,height,thk_side,thk_top,thk_bot,thk_div,louver,handlePos,color);
	break;	
case 'P.1D.3':
	drawShutter("shutter_frame_1",0,0,(width-(2*spacing))/3,height,thk_side,thk_top,thk_bot,thk_div,louver,handlePos,color);
	drawShutter("shutter_frame_2",(width-(2*spacing))/3+spacing,0,(width-(2*spacing))/3,height,thk_side,thk_top,thk_bot,thk_div,louver,handlePos,color);
	drawShutter("shutter_frame_3",2*((width-(2*spacing))/3+spacing),0,(width-(2*spacing))/3,height,thk_side,thk_top,thk_bot,thk_div,louver,handlePos,color);
	break;
case 'P2.1D.4':
	drawShutter("shutter_frame_1",0,0,(width-(3*spacing))/4,height,thk_side,thk_top,thk_bot,thk_div,louver,handlePos,color);
	drawShutter("shutter_frame_2",(width-(3*spacing))/4+spacing,0,(width-(3*spacing))/4,height,thk_side,thk_top,thk_bot,thk_div,louver,handlePos,color);
	drawShutter("shutter_frame_3",2*((width-(3*spacing))/4+spacing),0,(width-(3*spacing))/4,height,thk_side,thk_top,thk_bot,thk_div,louver,handlePos,color);
	drawShutter("shutter_frame_4",3*((width-(3*spacing))/4+spacing),0,(width-(3*spacing))/4,height,thk_side,thk_top,thk_bot,thk_div,louver,handlePos,color);
	break;		
case 'P2.1D.6':
	drawShutter("shutter_frame_1",0,0,(width-(5*spacing))/6,height,thk_side,thk_top,thk_bot,thk_div,louver,handlePos,color);
	drawShutter("shutter_frame_2",(width-(5*spacing))/6+spacing,0,(width-(5*spacing))/6,height,thk_side,thk_top,thk_bot,thk_div,louver,handlePos,color);
	drawShutter("shutter_frame_3",2*((width-(5*spacing))/6+spacing),0,(width-(5*spacing))/6,height,thk_side,thk_top,thk_bot,thk_div,louver,handlePos,color);
	drawShutter("shutter_frame_4",3*((width-(5*spacing))/6+spacing),0,(width-(5*spacing))/6,height,thk_side,thk_top,thk_bot,thk_div,louver,handlePos,color);
	drawShutter("shutter_frame_5",4*((width-(5*spacing))/6+spacing),0,(width-(5*spacing))/6,height,thk_side,thk_top,thk_bot,thk_div,louver,handlePos,color);
	drawShutter("shutter_frame_6",5*((width-(5*spacing))/6+spacing),0,(width-(5*spacing))/6,height,thk_side,thk_top,thk_bot,thk_div,louver,handlePos,color);
	break;		
	
default:
	drawShutter("shutter_frame",0,0,width,height,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	break;
}

if(applet && resizeObj != null)
{
	refreshControls();
}
}


function drawShutter(id,x,y,w,h,ts,tt,tb,td,louver,handlePos,color)
{
initShutterFrame(id, x, y, w, h, ts,tt,tb, color);

if(applet)
{
	createFrameEventHandlers(id);
}
var grp = drawing.getElementById(id);
	var fillH = color.charAt(0) == '*' ? "url(#"+ g(color.substring(1))+"H)" : color;

var rabbitLeft = drawing.getElementById(id +"_rbtLeft");
if(rabbitLeft == null)
{
	rabbitLeft = drawing.createElementNS(svgNS,"line");
	rabbitLeft.setAttribute("id",id +"_rbtLeft");
	rabbitLeft.setAttribute("class","rabbit");
	rabbitLeft.setAttribute("x1",x+ts-0.25);
	rabbitLeft.setAttribute("x2",x+ts-0.25);
	rabbitLeft.setAttribute("y1",y);
	rabbitLeft.setAttribute("y2",y+h);
	grp.appendChild(rabbitLeft);
}
	rabbitLeft.setAttribute("x1",x+ts-0.25);
	rabbitLeft.setAttribute("x2",x+ts-0.25);
	rabbitLeft.setAttribute("y1",y);
	rabbitLeft.setAttribute("y2",y+h);



var rabbitRight = drawing.getElementById(id +"_rbtRight");
if(rabbitRight == null)
{
	rabbitRight = drawing.createElementNS(svgNS,"line");
	rabbitRight.setAttribute("id",id +"_rbtRight");
	rabbitRight.setAttribute("class","rabbit");
	rabbitRight.setAttribute("x1",x+w-ts+0.25);
	rabbitRight.setAttribute("x2",x+w-ts+0.25);
	rabbitRight.setAttribute("y1",y);
	rabbitRight.setAttribute("y2",y+h);
	grp.appendChild(rabbitRight);
}

	rabbitRight.setAttribute("x1",x+w-ts+0.25);
	rabbitRight.setAttribute("x2",x+w-ts+0.25);
	rabbitRight.setAttribute("y1",y);
	rabbitRight.setAttribute("y2",y+h);

var upperLip = drawing.getElementById(id +"_upperLip");
if(upperLip == null)
{
	upperLip = drawing.createElementNS(svgNS,"rect");
	upperLip.setAttribute("id",id +"_upperLip");
	upperLip.setAttribute("class","frame");
	upperLip.setAttribute("x",x+ts);
	upperLip.setAttribute("y",y+tt);
	upperLip.setAttribute("width",w - (2*ts));
	upperLip.setAttribute("height",0.5);
	upperLip.getStyle().setProperty("fill",fillH,"");
	grp.appendChild(upperLip);
}
	upperLip.setAttribute("x",x+ts);
	upperLip.setAttribute("y",y+tt);
	upperLip.setAttribute("width",w - (2*ts));
	upperLip.setAttribute("height",0.5);




	var mouseHolePos = handlePos === 0? x + (w/2) : x + ts + handlePos;

var mouseHole = drawing.getElementById(id +"_mouseHole");
if(mouseHole == null)
{
	mouseHole = drawing.createElementNS(svgNS,"path");
	mouseHole.setAttribute("id",id +"_mouseHole");
	mouseHole.setAttribute("class","sash");
	mouseHole.setAttribute("d","M 0,0");	
	grp.appendChild(mouseHole);
}	
var dMH = "M "+mouseHolePos+","+(y+tt)+
		" l -.375,0 " + 
		" l 0,-" + (((louver-.5)/2)-.375) +
		" a .375,.375 0 0,1 .75,0 " +
		" l 0," + (((louver-.5)/2)-.375) +
 		" l -.375,0 ";
 	mouseHole.setAttribute("d",dMH);	
	mouseHole.getStyle().setProperty("fill","BLACK","");
	mouseHole.getStyle().setProperty("fill-opacity",".5","");



var opening = gN("openstate");
var spacing = .125;
var adjBot = 0;
var posDiv = 0;
var	desc = "LENGTH: %W% ... %F% basswood stock.";

if(td ===0)
{
	adjBot=drawLouvers(id,x+ts+spacing,                    // x
							y+tt,						// y
							w-(ts*2)-(2*spacing), // w
							h - tt - tb,     // h
							louver,                         // louver thickness
							mouseHolePos - x - ts - spacing,              // handle position
							opening,                              // opening
							color); 
}
else
{
	var hOpening  = (h - tt - tb - td)/2;
	adjBot=drawLouvers(id+"T",x+ts+spacing,                    // x
							y+tt,						// y
							w-(ts*2)-(2*spacing), // w
							hOpening,     // h
							louver,                         // louver thickness
							mouseHolePos - x - ts - spacing,              // handle position
							opening,                              // opening
							color); 
	
	var divider = drawing.getElementById(id +"_divider");
if(divider == null)
{
	divider = drawing.createElementNS(svgNS,"rect");
	divider.setAttribute("id",id+"_divider");
	divider.setAttribute("class","frame");
	divider.setAttribute("x",x+ts);
	divider.setAttribute("y",y+tt+hOpening-adjBot);
	divider.setAttribute("width",w - (2*ts));
	divider.setAttribute("height",td + adjBot);
	divider.getStyle().setProperty("fill",fillH,"");
	grp.appendChild(divider);	

}
	divider.setAttribute("x",x+ts);
	divider.setAttribute("y",y+tt+hOpening-adjBot);
	divider.setAttribute("width",w - (2*ts));
	divider.setAttribute("height",td + adjBot);

	
	desc = "LENGTH: %W% ... %F% basswood stock.";
	desc = desc.replace(/%W%/g,inchesToInchesDim(divider.getAttribute("width")));
	desc = desc.replace(/%F%/g,inchesToInchesDim(divider.getAttribute("height")));
	createDescription(id+"_sill",desc);
	
	mouseHole = drawing.getElementById(id +"_mouseHole2");
	if(mouseHole == null)
	{
		mouseHole = drawing.createElementNS(svgNS,"path");
		mouseHole.setAttribute("id",id +"_mouseHole2");
	
		mouseHole = drawing.createElementNS(svgNS,"path");
		mouseHole.setAttribute("class","sash");
		mouseHole.setAttribute("d","M 0,0");
		grp.appendChild(mouseHole);
	}	
	dMH = "M "+mouseHolePos+","+(y+tt+hOpening+td)+
		" l -.375,0 " + 
		" l 0,-" + (((louver-.5)/2)-.375) +
		" a .375,.375 0 0,1 .75,0 " +
		" l 0," + (((louver-.5)/2)-.375) +
 		" l -.375,0 ";
 	mouseHole.setAttribute("d",dMH);	
	mouseHole.getStyle().setProperty("fill","BLACK","");
	mouseHole.getStyle().setProperty("fill-opacity",".5","");
	
	adjBot=drawLouvers(id+"B",x+ts+spacing,                    // x
							y+tt+hOpening+td,						// y
							w-(ts*2)-(2*spacing), // w
							hOpening,     // h
							louver,                         // louver thickness
							mouseHolePos - x - ts - spacing,              // handle position
							opening,                              // opening
							color); 
						

}

	var bot = drawing.getElementById(id+"_sill");

if(adjBot != 0)
{
trace("adjBot="+adjBot);
	
	if(bot !== null)
	{
		
		bot.setAttribute("y",(bot.getAttribute("y")-0)-adjBot);
		bot.setAttribute("height",(bot.getAttribute("height")-0)+adjBot);
		desc = "LENGTH: %W% ... %F% basswood stock.";
		desc = desc.replace(/%W%/g,inchesToInchesDim(bot.getAttribute("width")));
		desc = desc.replace(/%F%/g,inchesToInchesDim(bot.getAttribute("height")));
		createDescription(id+"_sill",desc);
		s("thk_bot",bot.getAttribute("height"));
		
	}
	
}
	s("bot_rail_len",bot.getAttribute("width"));



}

function drawLouvers(id,x,y,w,h,louver,handlePos,opening,color)
{
var inApplet = g("f_applet") == "true";
s(id+"_x",x);
s(id+"_y",y);
s(id+"_w",w);
s(id+"_h",h);
s(id+"_handlePos",handlePos);

var fillV = color.charAt(0) == '*' ? "url(#"+ g(color.substring(1))+"V)" : color;

var louverSpacing = louver - .5;


s(id+"_open",opening);

var thk_louver = 0.25;
var louverShow = Math.max(thk_louver,Math.abs(louver - (opening*2)));
var louverPos = 0;
var window = drawing.getElementById("window");
var cntSlats = (h)/louverSpacing;
var iSlat = Math.floor(cntSlats);
var shading = null;
var shadingOpacity = 0;
var slat=null;
s("slats",iSlat);
if(inApplet)
{
for(xSlat=0;;xSlat++)
{
	slat = drawing.getElementById(id+"_slat_"+(xSlat+1));
	shading = drawing.getElementById(id+"shade_"+(xSlat+1));
	
	if(slat !== null)
	{
		window.removeChild(slat);
		window.removeChild(shading);
	}
	else
	{
		break;
	}		
}
}
for(xSlat=0; xSlat < iSlat; xSlat++)
{
	louverPos = y + (xSlat*louverSpacing)
			+ (opening > (louverSpacing/2) ? opening-louverShow: opening);
	initRect(id+"_slat_"+(xSlat+1), x, louverPos, w, louverShow, color);
if(inApplet)
{
	if(xSlat ===0 )
	{
		drawing.getElementById(id+"_slat_"+(xSlat+1)).setAttribute("onclick","displayControls(evt)");
	}

	shading = drawing.getElementById(id+"shade_"+(xSlat+1));
		shading = drawing.createElementNS(svgNS,"rect");
		shading.setAttribute("id",id+"shade_"+(xSlat+1));
		shading.setAttribute("x",x);
		shading.setAttribute("y",louverPos);
		shading.setAttribute("width",w);
		shading.setAttribute("height",louverShow);
		window.appendChild(shading);
	shading.getStyle().setProperty("stroke-width","0","");
	if(opening == 0)
	{
		shading.getStyle().setProperty("fill","none","");
	}
	else
	if(opening>(louverSpacing/2))
	{
		shading.getStyle().setProperty("fill","url(#down)","");
	}
	else
	{
		shading.getStyle().setProperty("fill","url(#up)","");
	}
}	
}

var handleLength= ((iSlat-1)*louverSpacing)+ ((louver-.5)/2);
var handleY = y+opening;
var dHandle = "M "+(x+handlePos)+","+handleY+
		" m -.375,0 " + 
		" m 0,-" + (((louver-.5)/2)-.375) +
		" a .375,.375 0 0,1 .75,0 " +
		" l 0," + handleLength +
		" a .375,.375 0 0,1 -.75,0 " +
 		" l 0,-" +handleLength ;

var handle = drawing.getElementById(id+"_handle");
if(handle !== null)
{
	window.removeChild(handle);
}
	handle = drawing.createElementNS(svgNS,"path");
	handle.setAttribute("id",id+"_handle");
	handle.setAttribute("class","sash");
	handle.setAttribute("d",dHandle);	
	handle.getStyle().setProperty("fill",fillV,"");

	
	drawing.getElementById("window").appendChild(handle);
	if(inApplet)
	{
	trace("registering Event Handlers");
	handle.setAttribute("onmousedown","startDragHandle(evt)");
	handle.setAttribute("onmousemove","dragHandle(evt)");							 	
	handle.setAttribute("onmouseup","endDragHandle(evt)");
	handle.setAttribute("onmouseout","endDragHandle(evt)");
	}


var desc = "WIDTH: " + inchesToInchesDim(0.75) + " HEIGHT: " + inchesToInchesDim(handleLength) + ".";
createDescription(id+"_handle",desc);

 return h - (iSlat*louverSpacing) - .5;
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
		
	}
	else
	{
		resizeObj = evt.getTarget();
		resizeObjId = resizeObj.id;
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
			resizeMode = "TOP";
			xC = (resizeObj.getAttribute("x")-0)+(resizeObj.getAttribute("width")/2);
			yC = (resizeObj.getAttribute("y")-0)+(resizeObj.getAttribute("height")-0);
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
			xC = (resizeObj.getAttribute("x")-0)+(resizeObj.getAttribute("width")/2);
			yC = (resizeObj.getAttribute("y")-0);
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
			resizeMode = "LEFT";
			xC = (resizeObj.getAttribute("x")-0)+(resizeObj.getAttribute("width"));
			yC = (resizeObj.getAttribute("y")-0)+(resizeObj.getAttribute("height")/2);
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
			resizeMode = "SLAT";
			xC = (resizeObj.getAttribute("x")-0)+(resizeObj.getAttribute("width")/2);
			yC = (resizeObj.getAttribute("y")-0)+(resizeObj.getAttribute("height")-0);
			
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
	
	function ratchetUp(evt)
	{
		evt.getTarget().setAttribute("class","unpressed");
		
		switch(resizeMode)
		{
			case "TOP":
				s("thk_top",gN("thk_top")-.25);
				drawIt();
				break;
			case "BOT":
				s("thk_bot",gN("thk_bot")+gN("louver"));
				drawIt();
				break;
			case "SLAT":
				s("louver",gN("louver")-.5);
				drawIt();
				break;
				
		}
	
	}
	
	function ratchetDown(evt)
	{
		evt.getTarget().setAttribute("class","unpressed");
	
		switch(resizeMode)
		{
			case "TOP":
				s("thk_top",gN("thk_top")+.25);
				drawIt();
				break;
		
			case "BOT":
				s("thk_bot",gN("thk_bot")-gN("louver"));
				drawIt();
				break;
				
			case "SLAT":
				s("louver",gN("louver")+.5);
				drawIt();
				break;
				
		}
	}
	function ratchetLeft(evt)
	{
		evt.getTarget().setAttribute("class","unpressed");
	
		switch(resizeMode)
		{
			case "LEFT":
				s("thk_side",gN("thk_side")-.25);
				drawIt();
				break;
		
			case "RIGHT":
				s("thk_side",gN("thk_side")+.25);
				drawIt();
				break;

		}
	}

	function ratchetRight(evt)
	{
		evt.getTarget().setAttribute("class","unpressed");
	
		switch(resizeMode)
		{
			case "LEFT":
				s("thk_side",gN("thk_side")+.25);
				drawIt();
				break;
		
			case "RIGHT":
				s("thk_side",gN("thk_side")-.25);
				drawIt();
				break;

		}
	}

