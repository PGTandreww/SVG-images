
function drawIt(idprefix, x, y, width, height,thk_top,thk_bot,thk_div)
{
trace("drawIt('"+idprefix+"',"+x+","+y+","+width+","+height+","+thk_top+","+thk_bot+","+thk_div+")");
var panel_layout = g("panel_layout");
var thk_side = gN("thk_side");
var louver = gN("louver");
var handlePos = gN("handlePos");
var color = g("color");
var spacing = 0.125;


switch(panel_layout)
{ 
case 'P2.2D.1L':
	drawShutter(idprefix+"shutter_frame_1",x,y,width,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_2",x,y+((height-spacing)/2)+spacing,width,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	break;

case 'P2.2D.2':
	drawShutter(idprefix+"shutter_frame_1",y,0,(width-spacing)/2,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_2",x+(width-spacing)/2+spacing,y,(width-spacing)/2,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);

	drawShutter(idprefix+"shutter_frame_3",x,y+((height-spacing)/2)+spacing,(width-spacing)/2,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_4",x+(width-spacing)/2+spacing,y+((height-spacing)/2)+spacing,(width-spacing)/2,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);

	break;

case 'P2.2D.3L':
	drawShutter(idprefix+"shutter_frame_1",x,y,(width-(2*spacing))/3,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_2",x+(width-(2*spacing))/3+spacing,y,(width-(2*spacing))/3,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_3",x+2*((width-(2*spacing))/3+spacing),y,(width-(2*spacing))/3,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);

	drawShutter(idprefix+"shutter_frame_4",x,y+((height-spacing)/2)+spacing,(width-(2*spacing))/3,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_5",x+(width-(2*spacing))/3+spacing,y+((height-spacing)/2)+spacing,(width-(2*spacing))/3,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_6",x+2*((width-(2*spacing))/3+spacing),y+((height-spacing)/2)+spacing,(width-(2*spacing))/3,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);

	break;

case 'P2.2D.4':
	drawShutter(idprefix+"shutter_frame_1",x,y,(width-(3*spacing))/4,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_2",x+(width-(3*spacing))/4+spacing,y,(width-(3*spacing))/4,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_3",x+2*((width-(3*spacing))/4+spacing),y,(width-(3*spacing))/4,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_4",x+3*((width-(3*spacing))/4+spacing),y,(width-(3*spacing))/4,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);

	drawShutter(idprefix+"shutter_frame_5",x,y+((height-spacing)/2)+spacing,(width-(3*spacing))/4,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_6",x+(width-(3*spacing))/4+spacing,y+((height-spacing)/2)+spacing,(width-(3*spacing))/4,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_7",x+2*((width-(3*spacing))/4+spacing),y+((height-spacing)/2)+spacing,(width-(3*spacing))/4,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_8",x+3*((width-(3*spacing))/4+spacing),y+((height-spacing)/2)+spacing,(width-(3*spacing))/4,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);

	break;
	
case 'P2.2D.6':
	drawShutter(idprefix+"shutter_frame_1",x,y,(width-(5*spacing))/6,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_2",x+(width-(5*spacing))/6+spacing,y,(width-(5*spacing))/6,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_3",x+2*((width-(5*spacing))/6+spacing),y,(width-(5*spacing))/6,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_4",x+3*((width-(5*spacing))/6+spacing),y,(width-(5*spacing))/6,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_5",x+4*((width-(5*spacing))/6+spacing),y,(width-(5*spacing))/6,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_6",x+5*((width-(5*spacing))/6+spacing),y,(width-(5*spacing))/6,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);

	drawShutter(idprefix+"shutter_frame_7",x,y+((height-spacing)/2)+spacing,(width-(5*spacing))/6,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_8",x+(width-(5*spacing))/6+spacing,y+((height-spacing)/2)+spacing,(width-(5*spacing))/6,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_9",x+2*((width-(5*spacing))/6+spacing),y+((height-spacing)/2)+spacing,(width-(5*spacing))/6,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_10",x+3*((width-(5*spacing))/6+spacing),y+((height-spacing)/2)+spacing,(width-(5*spacing))/6,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_11",x+4*((width-(5*spacing))/6+spacing),y+((height-spacing)/2)+spacing,(width-(5*spacing))/6,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_12",x+5*((width-(5*spacing))/6+spacing),y+((height-spacing)/2)+spacing,(width-(5*spacing))/6,(height-spacing)/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);

	break;	
			
case 'P.1C.1':
	drawShutter(idprefix+"shutter_frame",x,y+height/2,width,height/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	break;
case 'P2.1C.2':
	drawShutter(idprefix+"shutter_frame_1",x,y+height/2,(width-spacing)/2,height/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_2",x+(width-spacing)/2+spacing,y+height/2,(width-spacing)/2,height/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	break;	
case 'P.1C.3':
	drawShutter(idprefix+"shutter_frame_1",x,y+height/2,(width-(2*spacing))/3,height/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_2",x+(width-(2*spacing))/3+spacing,y+height/2,(width-(2*spacing))/3,height/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_3",x+2*((width-(2*spacing))/3+spacing),y+height/2,(width-(2*spacing))/3,height/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	break;
case 'P2.1C.4':
	drawShutter(idprefix+"shutter_frame_1",x,y+height/2,(width-(3*spacing))/4,height/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_2",x+(width-(3*spacing))/4+spacing,y+height/2,(width-(3*spacing))/4,height/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_3",x+2*((width-(3*spacing))/4+spacing),y+height/2,(width-(3*spacing))/4,height/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_4",x+3*((width-(3*spacing))/4+spacing),y+height/2,(width-(3*spacing))/4,height/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	break;		
case 'P2.1C.6':
	drawShutter(idprefix+"shutter_frame_1",x,y+height/2,(width-(5*spacing))/6,height/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_2",x+(width-(5*spacing))/6+spacing,y+height/2,(width-(5*spacing))/6,height/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_3",x+2*((width-(5*spacing))/6+spacing),y+height/2,(width-(5*spacing))/6,height/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_4",x+3*((width-(5*spacing))/6+spacing),y+height/2,(width-(5*spacing))/6,height/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_5",x+4*((width-(5*spacing))/6+spacing),y+height/2,(width-(5*spacing))/6,height/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_6",x+5*((width-(5*spacing))/6+spacing),y+height/2,(width-(5*spacing))/6,height/2,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	break;		


case 'P.1F.1':
	drawShutter(idprefix+"shutter_frame",x,y,width,height,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	break;
case 'P2.1F.2':
	drawShutter(idprefix+"shutter_frame_1",x,y,(width-spacing)/2,height,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_2",x+(width-spacing)/2+spacing,y,(width-spacing)/2,height,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	break;	
case 'P.1F.3':
	drawShutter(idprefix+"shutter_frame_1",x,y,(width-(2*spacing))/3,height,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_2",x+(width-(2*spacing))/3+spacing,y,(width-(2*spacing))/3,height,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_3",x+2*((width-(2*spacing))/3+spacing),y,(width-(2*spacing))/3,height,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	break;
case 'P2.1F.4':
	drawShutter(idprefix+"shutter_frame_1",x,y,(width-(3*spacing))/4,height,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_2",x+(width-(3*spacing))/4+spacing,y,(width-(3*spacing))/4,height,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_3",x+2*((width-(3*spacing))/4+spacing),y,(width-(3*spacing))/4,height,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_4",x+3*((width-(3*spacing))/4+spacing),y,(width-(3*spacing))/4,height,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	break;		
case 'P2.1F.6':
	drawShutter(idprefix+"shutter_frame_1",x,y,(width-(5*spacing))/6,height,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_2",x+(width-(5*spacing))/6+spacing,y,(width-(5*spacing))/6,height,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_3",x+2*((width-(5*spacing))/6+spacing),y,(width-(5*spacing))/6,height,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_4",x+3*((width-(5*spacing))/6+spacing),y,(width-(5*spacing))/6,height,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_5",x+4*((width-(5*spacing))/6+spacing),y,(width-(5*spacing))/6,height,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_6",x+5*((width-(5*spacing))/6+spacing),y,(width-(5*spacing))/6,height,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	break;		

case 'P.1D.1':
	drawShutter(idprefix+"shutter_frame",x,y,width,height,thk_side,thk_top,thk_bot,thk_div,louver,handlePos,color);
	break;
case 'P2.1D.2':
	drawShutter(idprefix+"shutter_frame_1",x,y,(width-spacing)/2,height,thk_side,thk_top,thk_bot,thk_div,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_2",x+(width-spacing)/2+spacing,y,(width-spacing)/2,height,thk_side,thk_top,thk_bot,thk_div,louver,handlePos,color);
	break;	
case 'P.1D.3':
	drawShutter(idprefix+"shutter_frame_1",x,y,(width-(2*spacing))/3,height,thk_side,thk_top,thk_bot,thk_div,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_2",x+(width-(2*spacing))/3+spacing,y,(width-(2*spacing))/3,height,thk_side,thk_top,thk_bot,thk_div,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_3",x+2*((width-(2*spacing))/3+spacing),y,(width-(2*spacing))/3,height,thk_side,thk_top,thk_bot,thk_div,louver,handlePos,color);
	break;
case 'P2.1D.4':
	drawShutter(idprefix+"shutter_frame_1",x,y,(width-(3*spacing))/4,height,thk_side,thk_top,thk_bot,thk_div,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_2",x+(width-(3*spacing))/4+spacing,y,(width-(3*spacing))/4,height,thk_side,thk_top,thk_bot,thk_div,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_3",x+2*((width-(3*spacing))/4+spacing),y,(width-(3*spacing))/4,height,thk_side,thk_top,thk_bot,thk_div,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_4",x+3*((width-(3*spacing))/4+spacing),y,(width-(3*spacing))/4,height,thk_side,thk_top,thk_bot,thk_div,louver,handlePos,color);
	break;		
case 'P2.1D.6':
	drawShutter(idprefix+"shutter_frame_1",x,y,(width-(5*spacing))/6,height,thk_side,thk_top,thk_bot,thk_div,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_2",x+(width-(5*spacing))/6+spacing,y,(width-(5*spacing))/6,height,thk_side,thk_top,thk_bot,thk_div,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_3",x+2*((width-(5*spacing))/6+spacing),y,(width-(5*spacing))/6,height,thk_side,thk_top,thk_bot,thk_div,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_4",x+3*((width-(5*spacing))/6+spacing),y,(width-(5*spacing))/6,height,thk_side,thk_top,thk_bot,thk_div,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_5",x+4*((width-(5*spacing))/6+spacing),y,(width-(5*spacing))/6,height,thk_side,thk_top,thk_bot,thk_div,louver,handlePos,color);
	drawShutter(idprefix+"shutter_frame_6",x+5*((width-(5*spacing))/6+spacing),y,(width-(5*spacing))/6,height,thk_side,thk_top,thk_bot,thk_div,louver,handlePos,color);
	break;		
	
default:
	drawShutter(idprefix+"shutter_frame",x,y,width,height,thk_side,thk_top,thk_bot,0,louver,handlePos,color);
	break;
}

if(applet && resizeObj != null)
{
	refreshControls();
}
}


function drawShutter(id,x,y,w,h,ts,tt,tb,td,louver,handlePos,color)
{
trace("drawShutter('"+id+"',"+x+","+y+","+w+","+h+","+ts+","+tt+","+tb+","+td+","+louver+","+handlePos+",'"+color+")");
initShutterFrame(id, x, y, w, h, ts,tt,tb, color);

if(applet) // && g("f_idprefix") === "")
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
trace("drawLouvers('"+id+"',"+x+","+y+","+w+","+h+","+louver+","+handlePos+","+opening+",'"+color+"')");	
var inApplet = g("f_applet") == "true";
var inModelset = g("f_idprefix") !== "";
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
var louverGroup = drawing.getElementById(id+"g_louvers");
var cntSlats = (h)/louverSpacing;
var iSlat = Math.floor(cntSlats);
var shading = null;
var shadingOpacity = 0;
var slat=null;
s("slats",iSlat);

trace("1>>>>>>>>>>>>>>>>>>>>");
if(louverGroup === null)
{
	louverGroup = drawing.createElementNS(svgNS,"g");
	louverGroup.setAttribute("id",id+"g_louvers");
	window.appendChild(louverGroup);
}
else
{
	while(louverGroup.firstChild) 
	 {
		louverGroup.removeChild(louverGroup.firstChild);
	 };
}
trace("2>>>>>>>>>>>>>>>>>>>>");
for(xSlat=0; xSlat < iSlat; xSlat++)
{
	louverPos = y + (xSlat*louverSpacing)
			+ (opening > (louverSpacing/2) ? opening-louverShow: opening);
	initRectInParent(id+"_slat_"+(xSlat+1),louverGroup, x, louverPos, w, louverShow, color);
if(inApplet)
{
	if(xSlat ===0)// && !inModelset )
	{
		drawing.getElementById(id+"_slat_"+(xSlat+1)).setAttribute("onclick","displayControls(evt)");
	}

	shading = drawing.createElementNS(svgNS,"rect");
	shading.setAttribute("id",id+"_shade_"+(xSlat+1));
	shading.setAttribute("x",x);
	shading.setAttribute("y",louverPos);
	shading.setAttribute("width",w);
	shading.setAttribute("height",louverShow);
	shading.getStyle().setProperty("stroke-width","0","");
	if(opening === 0)
	{
		shading.getStyle().setProperty("fill","none","");
		trace("2.1>>>>>>>>>>>>>>>>>>>>");
	}
	else
	if(opening>(louverSpacing/2))
	{
		shading.getStyle().setProperty("fill","url(#down)","");
		trace("2.2>>>>>>>>>>>>>>>>>>>>");
	}
	else
	{
		shading.getStyle().setProperty("fill","url(#up)","");
		trace("2.3>>>>>>>>>>>>>>>>>>>>");
	}
	louverGroup.appendChild(shading);
}	
}
trace("3>>>>>>>>>>>>>>>>>>>>");
var handleLength= ((iSlat-1)*louverSpacing)+ ((louver-.5)/2);
var handleY = y+opening;
var dHandle = "M "+(x+handlePos)+","+handleY+
		" m -.375,0 " + 
		" m 0,-" + (((louver-.5)/2)-.375) +
		" a .375,.375 0 0,1 .75,0 " +
		" l 0," + handleLength +
		" a .375,.375 0 0,1 -.75,0 " +
 		" l 0,-" +handleLength ;

var handleGroup = drawing.getElementById(id+"_g_handle");
if(handleGroup !== null)
{
	while(handleGroup.firstChild) 
	 {
		handleGroup.removeChild(handleGroup.firstChild);
	 };
}
else
{
	handleGroup = drawing.createElementNS(svgNS,"g");
	handleGroup.setAttribute("id",id+"_g_handle");
	window.appendChild(handleGroup);
}

trace("4>>>>>>>>>>>>>>>>>>>>");handleGroup
var handle = drawing.createElementNS(svgNS,"path");
	handle.setAttribute("id",id+"_handle");
	handle.setAttribute("class","sash");
	handle.setAttribute("d",dHandle);	
	handle.getStyle().setProperty("fill",fillV,"");

	
	handleGroup.appendChild(handle);
	if(inApplet)// && !inModelset)
	{
	trace("registering Event Handlers");
	handle.setAttribute("onmousedown","startDragHandle(evt)");
	handle.setAttribute("onmousemove","dragHandle(evt)");							 	
	handle.setAttribute("onmouseup","endDragHandle(evt)");
	handle.setAttribute("onmouseout","endDragHandle(evt)");
	}

trace("5>>>>>>>>>>>>>>>>>>>>");
var desc = "WIDTH: " + inchesToInchesDim(0.75) + " HEIGHT: " + inchesToInchesDim(handleLength) + ".";
createDescription(id+"_handle",desc);
trace("6>>>>>>>>>>>>>>>>>>>>");
 return h - (iSlat*louverSpacing) - .5;
}


