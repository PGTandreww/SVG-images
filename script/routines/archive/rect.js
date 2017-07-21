
/**
 * Create a rectangular glass pane.
 * 
 * @param id		String id 
 * @param sashId	String id of containing sash/frame
 * @param x		decimal x
 * @param y		decimal y
 * @param w		decimal width
 * @param h		decimal height
 * @param v		decimal invisible inset
 * @param color         string color
 * @return
 */

function initGlass(id,sashId,x, y, w, h, v, color)
{
try
{
trace("initGlass('"+id+"','"+sashId+"',"+x+","+ y+","+ w+","+ h+","+ v+",'"+color+"')");
	var grp = drawing.getElementById(id);
	var idPrefix = g("f_idprefix");
	if(grp == null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id);
		drawing.getElementById("window").appendChild(grp);
	}
	
	var gls = drawing.getElementById(id+"_pane");
	var gExists = gls != null;
	if(!gExists)
	{
		
		gls = drawing.createElementNS(svgNS,"rect");
		gls.setAttribute("id",id+"_pane");
		gls.setAttribute("class","glass");
		gls.setAttribute("onmouseover","expose(evt,'"+idPrefix+sashId+"',true)");
		gls.setAttribute("onmouseout","expose(evt,'"+idPrefix+sashId+"',false)");
	}

	gls.setAttribute("x",x);
	gls.setAttribute("y",y);
	gls.setAttribute("width",w);
	gls.setAttribute("height",h);
	gls.setAttribute("inset",v); // non-SVG info
        gls.getStyle().setProperty("fill",color,"");
	if(g("f_imgType")==="U1" )
	{
		gls.getStyle().setProperty("fill-opacity","0","");
	}

	if(!gExists)
	{
		grp.appendChild(gls);
	}
	var t,tText;
	if(g("f_glass") === "TEMPERED")
	{
	trace("creating T");
		t = drawing.getElementById(id+"_pane_t");
		if(t === null)
		{
			t = drawing.createElementNS(svgNS,"text");
			t.setAttribute("id",id+"_pane_t");
			t.setAttribute("class","glass");
   			tText = drawing.createTextNode("T");
    		t.appendChild(tText);
			grp.appendChild(t);			
		}
		t.setAttribute("x",x+w-inchesToMM(3));
		t.setAttribute("y",y+h-inchesToMM(2));
	}
	

	if(g("f_tn")!=="true")
	{
		var desc = "WIDTH: %W%  HEIGHT: %H%  VISIBLE: %WV%X%HV%.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%WV%/g,getDim(w-(2*v)));
		desc = desc.replace(/%HV%/g,getDim(h-(2*v)));
		createDescription(id+"_pane",desc);
	}
}	
catch(e)
{
	alertUser("Exception:  initGlass('"+id+"','"+sashId+"',"+x+","+ y+","+ w+","+ h+","+ v+")");
	alertUser(e);
	trace(e);
}	
} 


/**
 * Create a rectangular grille pattern
 * 
 * @param rectName String ID of containing glass pane
 * @param gridElName String name of grille used as a prefix for naming
 * 							the individual grille elements and punch point
 * 							variables.
 * @param pattern	String grille pattern code
 * 							#V#H rectangular grid
 * 							#H#V rectangular grid
 * 							C#V#H craftsman grid
 * 							D#V#H diamond grille
 * 							P#T#B#L#R prairie
 * @param color String webcolor
 * @param t String thickness of grille element
 * @return void
 */
function initGrid(rectName,gridElName,patternParm,color,t)
{
trace("initGrid('"+ rectName+"','"+gridElName+"','"+patternParm+"','"+color+"',"+t+")");
try{
	if (typeof GetGridColor == 'function') { color = GetGridColor(color); }
	var vert,horz,left,right,top,bottom;
	var pattern = new String(patternParm);
	switch(pattern.charAt(0))
	{
		case 'C': // Craftman
		//	vert = gN(gridElName+"v");
		//	if(vert == 0)
				s("f_"+gridElName+"v",pattern.charAt(1));
		//	horz =  gN(gridElName+"h");
		//	if(horz == 0)
				s("f_"+gridElName+"h",pattern.charAt(3));
		//	top = g(gridElName+"t");
		//	if(top == null)
				s("f_"+gridElName+"t",pattern.charAt(5));
			drawCraftsmanGrid(rectName,gridElName,color,t,false);
			break;	

		case 'D': // Diamond
		//	vert = gN(gridElName+"v");
		//	if(vert == 0)
				s("f_"+gridElName+"v",pattern.charAt(1));
		//	horz =  gN(gridElName+"h");
		//	if(horz == 0)
				s("f_"+gridElName+"h",pattern.charAt(3));
			drawDiamondGrid(rectName,gridElName,color,t,false);
			break;	
		
	
		case 'P': // Prairie
		//	top = g(gridElName+"t");
		//	if(top == null)
				s("f_"+gridElName+"t",pattern.charAt(1));
		//	bottom = g(gridElName+"b");
		//	if(bottom == null)
				s("f_"+gridElName+"b",pattern.charAt(3));
		//	left = g(gridElName+"l");
		//	if(left == null)
				s("f_"+gridElName+"l",pattern.charAt(5));
		//	right = g(gridElName+"r");
		//	if(right == null)
				s("f_"+gridElName+"r",pattern.charAt(7));
			drawPrairieGrid(rectName,gridElName,color,t,false);
			break;	

		case 'H': //Heritage Grids
				s("f_"+gridElName+"t",pattern.charAt(1));
				s("f_"+gridElName+"b",pattern.charAt(3));
				s("f_"+gridElName+"l",pattern.charAt(5));
				s("f_"+gridElName+"r",pattern.charAt(7));
				s("f_"+gridElName+"St",pattern.charAt(9));
				s("f_"+gridElName+"Sb",pattern.charAt(10));
				s("f_"+gridElName+"Sl",pattern.charAt(11));
				s("f_"+gridElName+"Sr",pattern.charAt(12));				
			drawPerm(rectName,gridElName,color,t,false);
			break;			
		
		case 'O': // Perimeter grid (Award)				
				s("f_"+gridElName+"t",pattern.charAt(1));
				s("f_"+gridElName+"b",pattern.charAt(3));
				s("f_"+gridElName+"l",pattern.charAt(5));
				s("f_"+gridElName+"r",pattern.charAt(7));
				s("f_"+gridElName+"St",pattern.charAt(9));
				s("f_"+gridElName+"Sb",pattern.charAt(10));
				s("f_"+gridElName+"Sl",pattern.charAt(11));
				s("f_"+gridElName+"Sr",pattern.charAt(12));	
				drawPerm(rectName,gridElName,color,t,false);
			break;	
		
		case 'E': // Empress Award				
				s("f_"+gridElName+"t",pattern.charAt(1));
				s("f_"+gridElName+"b",pattern.charAt(3));
				s("f_"+gridElName+"l",pattern.charAt(5));
				s("f_"+gridElName+"r",pattern.charAt(7));
				s("f_"+gridElName+"St",pattern.charAt(9));
				s("f_"+gridElName+"Sb",pattern.charAt(10));
				s("f_"+gridElName+"Sl",pattern.charAt(11));
				s("f_"+gridElName+"Sr",pattern.charAt(12));	
				drawPerm(rectName,gridElName,color,t,false);
			break;
					
		case 'L': // Ladder
				s("f_"+gridElName+"v",pattern.charAt(1));
				s("f_"+gridElName+"h",pattern.charAt(3));
				s("f_"+gridElName+"t",pattern.charAt(6));
				s("f_"+gridElName+"b",pattern.charAt(8));
				s("f_"+gridElName+"l",pattern.charAt(10));
				s("f_"+gridElName+"r",pattern.charAt(12));				
				drawLadderGrid(rectName,gridElName,color,t,false);				
				break;

		case 'U': // Suspended
					s("f_"+gridElName+"longHorz",pattern.charAt(1));
					s("f_"+gridElName+"shortVert",pattern.charAt(3));
					drawSuspended(rectName,gridElName,color,t,false);			
				break;	
			
		default:
		//	vert = gN(gridElName+"v");
		//	if(vert == 0)
				s("f_"+gridElName+"v",pattern.charAt(0));
		//	horz =  gN(gridElName+"h");
		//	if(horz == 0)
				s("f_"+gridElName+"h",pattern.charAt(2));
			drawGrid(rectName,gridElName,color,t,false);
			break;
	}
}catch(e)
{
	alertUser("Exception:  initGrid('"+ rectName+"','"+gridElName+"','"+patternParm+"','"+color+"',"+t+")");
	alertUser(e);
	trace(e);
}	
}



/**
 * Draw a rectangular grid pattern.
 * 
 * @param rectName String id of glass pane
 * @param gridElName String id and prefix for element names and punch
 * 							point variables.
 * @param color	String web color of grille
 * @param t	Decimal thickness of grille element
 * @param redraw boolean Is it a call to redraw the grid?
 * @return void
 */
function drawGrid(rectName,gridElName,color,tt,redraw)
{
trace("drawGrid('"+ rectName+"','"+gridElName+"','"+color+"',"+tt+")");
try{
var idPrefix = g("f_idprefix");
var redrawScript = 	"drawGrid('%ID%','"+gridElName+"','"+color+"',"+tt+",true)";
var	vert = gN("f_"+gridElName+"v");
var	horz = gN("f_"+gridElName+"h");
var t = tt-0;

createClipPattern(rectName);
	
	var rect = drawing.getElementById(rectName);
	if(rect == null)
	{
		trace("drawGrid() failed because " + rectName + " does not exist.");
		return;
	}
	
	
	var x = rect.getAttribute("x") - 0;
	var y = rect.getAttribute("y") - 0;
	var h = rect.getAttribute("height") - 0;
	var w = rect.getAttribute("width") - 0;
	var inset = rect.getAttribute("inset")-0;

	inset = inset === null ? 0 : inset-0;
	 
	if(applet && !redraw)
	{
			applet.registerLite(idPrefix+rectName,x+"",y+"",w+"",h+"",redrawScript);
			var elLite = drawing.getElementById(rectName);
			if(elLite != null)
			{
				elLite.setAttribute("onmousemove","drag(evt)");							 	
				elLite.setAttribute("onmouseup","drop(evt)");
			}							 	
	}
	

	var nVert = 1;
	trace("vSep="+vSep);
	trace("w="+w);
	trace("t="+t);
	trace("inset="+inset);
	trace("vert="+vert);
 	var vSep = (w-(inset*2)+t)/(vert+1);
	trace("vSep="+vSep);
	var window = drawing.getElementById("window");
	var grp = drawing.getElementById(gridElName);
	if(grp == null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",gridElName);
		grp.getStyle().setProperty("clip-path","url(#"+idPrefix+"clip_"+rectName+")","");

		var ins = rect.nextSibling;
		if(ins == null)
		{
			window.appendChild(grp);
		}
		else
		{
			ins.parentNode.insertBefore(grp,ins);
		}
	}


	for(;nVert <= vert;nVert++)
	{
		var gvName = (redraw?idPrefix:"")+gridElName+"h" + nVert;
		var gvVarName = gridElName+"h" + nVert;
		var gv = drawing.getElementById(gvName);
		var gvExists = true;
		if(gv == null)
		{
			gvExists = false;
			gv = drawing.createElementNS(svgNS,"rect");
			gv.setAttribute("id",gvName);
		//	gv.setAttribute("class","grid");
			gv.setAttribute("width",t);
			
			gv.setAttribute("onmousedown","startDragX(evt)");							 	
			gv.setAttribute("onmousemove","drag(evt)");							 	
			gv.setAttribute("onmouseup","drop(evt)");	
	 		gv.setAttribute("onmouseout","evt.stopPropagation()");
		}

		var punchX =  gN(gvVarName);
		if(punchX == 0)
		{
			punchX = (nVert*vSep)+inset-(.5*t);
			punchX = Math.round(punchX*100000)/100000;
		}
		else
		{
		//	trace(">>>>>> punchX = "+punchX);
		}
	//	punchX  = roundToSixteenth(punchX);
	
		gv.getStyle().setProperty("fill",color,"");
//		gv.getStyle().setProperty("stroke-width",".0625","");
		
		gv.setAttribute("x",x + punchX - (t/2)); 
		gv.setAttribute("y",y);
		gv.setAttribute("height",h);
		if(!redraw && applet)
		{
			applet.registerVertElement(	idPrefix+gvName,
										idPrefix+rectName,
										(x + punchX - (t/2)) +"", 	
										t + "",
										"s(\""+gvVarName+"\",%X%)");
			// return point
			applet.registerVertElement(	idPrefix,
										"",
										(x + punchX - (t/2)) +"", 	
										t + "",
										null);
										
										
		}
		if(!gvExists)
		{
			grp.appendChild(gv);
		}
		var desc = "LENGTH: %H% THICK: %T% PUNCH: %P%.";
		desc = desc.replace(/%H%/g,getDim(gridLen(rectName, gvName)));
		desc = desc.replace(/%P%/g,getDim(punchX)); //getDim(punchX));
		desc = desc.replace(/%T%/g,getDim(t)); // getDim(punchY));
			
		s(gvVarName,punchX);

		createDescription(gvName,desc);
			
		
	}

	var nHorz = horz;
	var hSep = (h-(inset*2)+t)/(horz+1);
	
	for(;nHorz > 0;nHorz--)
	{	
		var ghName = (redraw?idPrefix:"")+gridElName+"v"+nHorz;	
		var ghVarName = gridElName+"v"+nHorz;	
		var gh = drawing.getElementById(ghName);
		var ghExists = true;
		if(gh == null)
		{
			ghExists = false;
			gh = drawing.createElementNS(svgNS,"rect");
			gh.setAttribute("id",ghName);
		//	gh.setAttribute("class","grid");
			gh.setAttribute("height",t);
			
			gh.setAttribute("onmousedown","startDragY(evt)");							 	
 			gh.setAttribute("onmousemove","drag(evt)");							 	
 			gh.setAttribute("onmouseup","drop(evt)");
	 		gh.setAttribute("onmouseout","evt.stopPropagation()");	
	 		trace(">>>>>>>>>INITIAL " + ghVarName + " = " + gN(ghVarName));
		}
	
		var punchY =  gN(ghVarName);

		if(punchY == 0)
		{
			punchY = (hSep*nHorz)+inset-(.5*t);
					punchY = Math.round(punchY*100000)/100000;
		}
		else
		{
			trace(">>>>>> punchY = "+punchY);
		}
	//	punchY = roundToSixteenth(punchY);
		
		gh.getStyle().setProperty("fill",color,"");
//		gh.getStyle().setProperty("stroke-width",".0625","");
		
		trace(">>>>>> gh height = " + gh.getAttribute("height"));
		
		gh.setAttribute("x",x); 
		gh.setAttribute("y",(y + (h - punchY - (t/2))));
		gh.setAttribute("width",w);
		
		if(!redraw && applet)
		{
	//	trace(">>>>>>>>"+"s(\""+ghVarName+"\","+h+"-%Y%)");
			applet.registerHorzElement( idPrefix+ghName,
										idPrefix+rectName,
										(y + (h - punchY - (t/2))) +"", 	
										t + "",
										"s(\""+ghVarName+"\","+h+"-%Y%)");
			// return point
			applet.registerHorzElement( idPrefix,
										"",
										(y + (h - punchY - (t/2))) +"", 	
										t + "",
										null);
		}
		
		if(!ghExists)
		{
			grp.appendChild(gh);
		}
		var desc = "LENGTH: %W% THICK: %T%  PUNCH: %P%.";
		desc = desc.replace(/%W%/g,getDim(gridLen(rectName, ghName)));
		desc = desc.replace(/%P%/g,getDim(punchY)); // getDim(punchY));
		desc = desc.replace(/%T%/g,getDim(t)); // getDim(punchY));
		s(ghVarName,punchY);
		createDescription(ghName,desc);
	}
}catch(e)
{
	alertUser("Exception:  drawGrid('"+ rectName+"','"+gridElName+"','"+color+"',"+t+")");
	alertUser(e);
	trace(e);
}
}









/**
 * Draw rectangular grid in lower portion of the lite.
 * Requires caller to set these properties in the variable map:
 * 
 * s("f_"+gridElName+"v",<vertical bars>);
 * s("f_"+gridElName+"h", <horizonatal bars>);
 * s("f_"+gridElName+"t", <ladder count>);
 * 
 * @param rectName 		String id of containing glass pane
 * @param gridElName	String id of grid used as prefix of individual element IDs
 * @param color			String web color code
 * @param t				decimal thickness of element
 * @param redraw		boolean redrawing
 * @return				void
 */


function drawCraftsmanGrid(rectName,gridElName,color,t,redraw)
{
trace("drawCraftmanGrid('"+ rectName+"','"+gridElName+"','"+color+"',"+t+")");
try{
var idPrefix = g("f_idprefix");
var redrawScript = 	"drawCraftsmanGrid('%ID%','"+gridElName+"','"+color+"',"+t+",true)";
var	vert = gN("f_"+gridElName+"v");
var	horz = gN("f_"+gridElName+"h");
var	top = gN("f_"+gridElName+"t");  // ladder count

	
	var rect = drawing.getElementById(rectName);
	if(rect == null)
	{
		trace("drawCraftsmanGrid() failed because " + rectName + " does not exist.");
		return;
	}
	
	
	var x = rect.getAttribute("x") - 0;
	var y = rect.getAttribute("y") - 0;
	var h = rect.getAttribute("height") - 0;
	var w = rect.getAttribute("width") - 0;
	var inset = rect.getAttribute("inset")-0;

	var vSep = (w-(2*inset)+t)/(vert+1);
	var hSep = (h-(2*inset)+t)/(horz+1);
	
	
	if(applet && !redraw)
	{
			applet.registerLite(idPrefix+rectName,x+"",y+"",w+"",h+"",redrawScript);
			var elLite = drawing.getElementById(rectName);
			if(elLite != null)
			{
				elLite.setAttribute("onmousemove","drag(evt)");							 	
				elLite.setAttribute("onmouseup","drop(evt)");
			}							 	
	}
	

	var nVert = 1;
	var window = drawing.getElementById("window");
	createClipPattern(rectName);
	var grp = drawing.getElementById(gridElName);
	if(grp == null)
	{
				grp = drawing.createElementNS(svgNS,"g");
				grp.setAttribute("id",gridElName);
				grp.getStyle().setProperty("clip-path","url(#"+idPrefix+"clip_"+rectName+")","");

				var ins = rect.nextSibling;
				if(ins == null)
				{
					window.appendChild(grp);
				}
				else
				{
					ins.parentNode.insertBefore(grp,ins);
				}
	}
	
	
	for(;nVert <= vert;nVert++)
	{
		var gvName = (redraw?idPrefix:"")+gridElName+"h" + nVert;
		var gvVarName = gridElName+"h" + nVert;
		var gv = drawing.getElementById(gvName);
		var gvExists = true;
		if(gv == null)
		{
			gvExists = false;
			gv = drawing.createElementNS(svgNS,"rect");
			gv.setAttribute("id",gvName);
			gv.setAttribute("class","grid");
			gv.setAttribute("width",t);
			
			gv.setAttribute("onmousedown","startDragX(evt)");							 	
			gv.setAttribute("onmousemove","drag(evt)");							 	
			gv.setAttribute("onmouseup","drop(evt)");	
	 		gv.setAttribute("onmouseout","evt.stopPropagation()");
		}
		var t = gv.getAttribute("width")-0;
		var punchX =  gN(gvVarName);
		if(punchX === 0)
		{
			punchX = (nVert*vSep)+inset-(0.5*t);
		}
	//	punchX  = roundToSixteenth(punchX);
		punchX = Math.round(punchX*1000)/1000;
		gv.getStyle().setProperty("fill",color,"");
		
		gv.setAttribute("x",x + punchX - (t/2)); 
		gv.setAttribute("y",y);
		gv.setAttribute("height",(top*hSep)-inset);
		if(!redraw && applet)
		{
			applet.registerVertElement(	idPrefix+gvName,
										idPrefix+rectName,
										(x + punchX - (t/2)) +"", 	
										t + "",
										"s(\""+gvVarName+"\",%X%)");
			// return point
			applet.registerVertElement(	idPrefix,
										"",
										(x + punchX - (t/2)) +"", 	
										t + "",
										null);
										
										
		}
		if(!gvExists)
		{
			grp.appendChild(gv);
		}
		var desc = "LENGTH: %H%  PUNCH: %P%.";
		desc = desc.replace(/%H%/g,getDim(gridLen(rectName, gvName)));
		desc = desc.replace(/%P%/g,getDim(punchX)); // getDim(punchX));
			
		s(gvVarName,punchX);

		createDescription(gvName,desc);
			
		
	}

	var nHorz = 1;
	
	for(;nHorz <= top;nHorz++)
	{	
		var ghName = (redraw?idPrefix:"")+gridElName+"v"+nHorz;	
		var ghVarName = gridElName+"v"+nHorz;	
		var gh = drawing.getElementById(ghName);
		var ghExists = true;
		if(gh == null)
		{
			ghExists = false;
			gh = drawing.createElementNS(svgNS,"rect");
			gh.setAttribute("id",ghName);
			gh.setAttribute("class","grid");
			gh.setAttribute("height",t);
			
			gh.setAttribute("onmousedown","startDragY(evt)");							 	
 			gh.setAttribute("onmousemove","drag(evt)");							 	
 			gh.setAttribute("onmouseup","drop(evt)");
	 		gh.setAttribute("onmouseout","evt.stopPropagation()");	
		}
		var t = gh.getAttribute("height")-0;
	
		var punchY =  gN(ghVarName);

		if(punchY === 0)
		{
			punchY = (hSep*(nHorz-1)) +  (h - (top*hSep))+inset-(.5*t);
		}
		// punchY = roundToSixteenth(punchY);
		punchY = Math.round(punchY*1000)/1000;

		gh.getStyle().setProperty("fill",color,"");
		gh.setAttribute("x",x); 
		gh.setAttribute("y",y + h - punchY - (t/2));
		gh.setAttribute("width",w);
		
		if(!redraw && applet)
		{
			applet.registerHorzElement( idPrefix+ghName,
										idPrefix+rectName,
										(y + h - punchY - (t/2)) +"", 	
										t + "",
										"s(\""+ghVarName+"\","+h+"-%Y%)");
			// return point
			applet.registerHorzElement( idPrefix,
										"",
										(y + h - punchY - (t/2)) +"", 	
										t + "",
										null);
		}
		
		if(!ghExists)
		{
			grp.appendChild(gh);
		}
		var desc = "LENGTH: %W%  PUNCH: %P%.";
		desc = desc.replace(/%W%/g,getDim(gridLen(rectName, ghName)));
		desc = desc.replace(/%P%/g,getDim(punchY)); //getDim(punchY));
		s(ghVarName,punchY);
		createDescription(ghName,desc);
	}
}catch(e)
{
	alertUser("Exception:  drawCraftsmanGrid('"+ rectName+"','"+gridElName+"','"+color+"',"+t+")");
	alertUser(e);
	trace(e);
}
}

/**
 * Draw a prairie grid.
 * 
 * Requires caller to first set these values in the variable map:
 * s("f_"+gridElName+"l", <bars on left>);
 * s("f_"+gridElName+"r", <bars on right>);
 * s("f_"+gridElName+"t", <bars at top>);
 * s("f_"+gridElName+"b", <bars at bottom>);
 * s("f_"+gridElName+"sep", <separation of bars>);
 * 
 * 
 * @param rectName		String id of glass pane
 * @param gridElName	String id of grille and prefix of element IDs
 * @param color			String web color code
 * @param t				decimal thickness of elements
 * @param redraw		boolean redrawing
 * @return				void
 */

function drawPrairieGrid(rectName,gridElName,color,t,redraw)
{
trace("drawPrairieGrid('"+ rectName+"','"+gridElName+"','"+color+"',"+t+")");
try{
var idPrefix = g("f_idprefix");
var redrawScript = 	"drawGrid('%ID%','"+gridElName+"','"+color+"',"+t+",true)";
var	left = gN("f_"+gridElName+"l");
var	right = gN("f_"+gridElName+"r");
var	top = gN("f_"+gridElName+"t");
var	bottom = gN("f_"+gridElName+"b");
var sep = gN("f_"+gridElName+"sep");
if(sep === 0)
{
	sep = gN("grid_sep");
	if(sep === 0)
		sep = 4;
}
var nVert = 0;
var nHorz = top+bottom+1;
var desc,grp,ins, t,punchX,punchY;
	
	var rect = drawing.getElementById(rectName);
	if(rect == null)
	{
		trace("drawGrid() failed because " + rectName + " does not exist.");
		return;
	}
	
	
	var x = rect.getAttribute("x") - 0;
	var y = rect.getAttribute("y") - 0;
	var h = rect.getAttribute("height") - 0;
	var w = rect.getAttribute("width") - 0;
	var inset = rect.getAttribute("inset")-0;

	if(applet && !redraw)
	{
			applet.registerLite(idPrefix+rectName,x+"",y+"",w+"",h+"",redrawScript);
			var elLite = drawing.getElementById(rectName);
			if(elLite != null)
			{
				elLite.setAttribute("onmousemove","drag(evt)");							 	
				elLite.setAttribute("onmouseup","drop(evt)");
			}							 	
	}
	

	var nLeft = 1;
	var window = drawing.getElementById("window");
	createClipPattern(rectName);
	var grp = drawing.getElementById(gridElName);
	if(grp == null)
	{
				grp = drawing.createElementNS(svgNS,"g");
				grp.setAttribute("id",gridElName);
				grp.getStyle().setProperty("clip-path","url(#"+idPrefix+"clip_"+rectName+")","");

				var ins = rect.nextSibling;
				if(ins == null)
				{
					window.appendChild(grp);
				}
				else
				{
					ins.parentNode.insertBefore(grp,ins);
				}
	}
	
	for(;nLeft <= left;nLeft++)
	{
		nVert++;
		var glName = (redraw?idPrefix:"")+gridElName+"h" + nVert;
		var glVarName = gridElName+"h" + nVert;
		var gl = drawing.getElementById(glName);
		var glExists = true;
		if(gl == null)
		{
			glExists = false;
			gl = drawing.createElementNS(svgNS,"rect");
			gl.setAttribute("id",glName);
			gl.setAttribute("class","grid");
			gl.setAttribute("width",t);
			
			gl.setAttribute("onmousedown","startDragX(evt)");							 	
			gl.setAttribute("onmousemove","drag(evt)");							 	
			gl.setAttribute("onmouseup","drop(evt)");	
	 		gl.setAttribute("onmouseout","evt.stopPropagation()");
		}
		punchX =  gN(glVarName);
		if(punchX === 0)
		{
			punchX = nLeft*(sep+0.5*t)+inset;
		}
		punchX = Math.round(punchX*1000)/1000;
//		punchX  = roundToSixteenth(punchX);
		gl.getStyle().setProperty("fill",color,"");
		
		gl.setAttribute("x",x + punchX - (t/2)); 
		gl.setAttribute("y",y);
		gl.setAttribute("height",h);
		if(!redraw && applet)
		{
			applet.registerVertElement(	idPrefix+glName,
										idPrefix+rectName,
										(x + punchX - (t/2)) +"", 	
										t + "",
										"s(\""+glVarName+"\",%X%)");
			// return point
			applet.registerVertElement(	idPrefix,
										"",
										(x + punchX - (t/2)) +"", 	
										t + "",
										null);
										
										
		}
		if(!glExists)
		{
			grp.appendChild(gl);
		}
		desc = "LENGTH: %H%  PUNCH: %P%.";
		desc = desc.replace(/%H%/g,getDim(gridLen(rectName, glName)));
		desc = desc.replace(/%P%/g,getDim(punchX)); // getDim(punchX));
			
		s(glVarName,punchX);

		createDescription(glName,desc);
	}


	var nRight = 1;
	for(;nRight <= right;nRight++)
	{
		nVert++;
		var grName = (redraw?idPrefix:"")+gridElName+"h" + nVert;
		var grVarName = gridElName+"h" + nVert;
		var gr = drawing.getElementById(grName);
		var grExists = true;
		if(gr == null)
		{
			grExists = false;
			gr = drawing.createElementNS(svgNS,"rect");
			gr.setAttribute("id",grName);
			gr.setAttribute("class","grid");
			gr.setAttribute("width",t);
			
			gr.setAttribute("onmousedown","startDragX(evt)");							 	
			gr.setAttribute("onmousemove","drag(evt)");							 	
			gr.setAttribute("onmouseup","drop(evt)");	
	 		gr.setAttribute("onmouseout","evt.stopPropagation()");
		}
		punchX =  gN(grVarName);
		trace("punchX="+punchX);
		if(punchX === 0)
		{
		trace("t="+t);
		trace("sep="+sep);
		trace("inset="+inset);
		trace("nRight="+nRight);
		trace("w="+w);
			punchX = w - ((nRight*(sep+0.5*t))+inset);
		}
//		punchX  = roundToSixteenth(punchX);
		punchX = Math.round(punchX*1000)/1000;

		gr.getStyle().setProperty("fill",color,"");
		
		gr.setAttribute("x",x + punchX - (t/2)); 
		gr.setAttribute("y",y);
		gr.setAttribute("height",h);
		if(!redraw && applet)
		{
			applet.registerVertElement(	idPrefix+grName,
										idPrefix+rectName,
										(x + punchX - (t/2)) +"", 	
										t + "",
										"s(\""+glVarName+"\",%X%)");
			// return point
			applet.registerVertElement(	idPrefix,
										"",
										(x + punchX - (t/2)) +"", 	
										t + "",
										null);
										
										
		}
		if(!grExists)
		{
			grp.appendChild(gr);
		}
		desc = "LENGTH: %H%  PUNCH: %P%.";
		desc = desc.replace(/%H%/g,getDim(gridLen(rectName, grName)));
		desc = desc.replace(/%P%/g,getDim(punchX)); //getDim(punchX));
			
		s(grVarName,punchX);

		createDescription(grName,desc);
	}


	var nTop = 1;
	
	for(;nTop <= top;nTop++)
	{	
		nHorz--;
		var gtName = (redraw?idPrefix:"")+gridElName+"v"+nHorz;	
		var gtVarName = gridElName+"v"+nHorz;	
		var gt = drawing.getElementById(gtName);
		var gtExists = true;
		if(gt == null)
		{
			gtExists = false;
			gt = drawing.createElementNS(svgNS,"rect");
			gt.setAttribute("id",gtName);
			gt.setAttribute("class","grid");
			gt.setAttribute("height",t);
			
			gt.setAttribute("onmousedown","startDragY(evt)");							 	
 			gt.setAttribute("onmousemove","drag(evt)");							 	
 			gt.setAttribute("onmouseup","drop(evt)");
	 		gt.setAttribute("onmouseout","evt.stopPropagation()");	
		}
		punchY =  gN(gtVarName);

		if(punchY === 0)
		{
			punchY = h - (((sep+0.5*t)*nTop)+inset);
		}
		//punchY = roundToSixteenth(punchY);
		punchY = Math.round(punchY*1000)/1000;

		gt.getStyle().setProperty("fill",color,"");
		gt.setAttribute("x",x); 
		gt.setAttribute("y",y + h - punchY - (t/2));
		gt.setAttribute("width",w);
		
		if(!redraw && applet)
		{
			applet.registerHorzElement( idPrefix+gtName,
										idPrefix+rectName,
										(y + h - punchY - (t/2)) +"", 	
										t + "",
										"s(\""+gtVarName+"\","+h+"-%Y%)");
			// return point
			applet.registerHorzElement( idPrefix,
										"",
										(y + h - punchY - (t/2)) +"", 	
										t + "",
										null);
		}
		
		if(!gtExists)
		{
			grp = drawing.getElementById(gridElName);
			if(grp == null)
			{
				grp = drawing.createElementNS(svgNS,"g");
				grp.setAttribute("id",gridElName);
			
				ins = rect.nextSibling;
				if(ins == null)
				{
					window.appendChild(grp);
				}
				else
				{
					ins.parentNode.insertBefore(grp,ins);
				}
			}
			grp.appendChild(gt);
		}
		desc = "LENGTH: %W%  PUNCH: %P%.";
		desc = desc.replace(/%W%/g,getDim(gridLen(rectName, gtName)));
		desc = desc.replace(/%P%/g,getDim(punchY)); // getDim(punchY));
		s(gtVarName,punchY);
		createDescription(gtName,desc);
	}
	
	var nBottom = 1;
	
	for(;nBottom <= bottom;nBottom++)
	{	
		nHorz--;
		var gbName = (redraw?idPrefix:"")+gridElName+"v"+nHorz;	
		var gbVarName = gridElName+"v"+nHorz;	
		var gb = drawing.getElementById(gbName);
		var gbExists = true;
		if(gb == null)
		{
			gbExists = false;
			gb = drawing.createElementNS(svgNS,"rect");
			gb.setAttribute("id",gbName);
			gb.setAttribute("class","grid");
			gb.setAttribute("height",t);
			
			gb.setAttribute("onmousedown","startDragY(evt)");							 	
 			gb.setAttribute("onmousemove","drag(evt)");							 	
 			gb.setAttribute("onmouseup","drop(evt)");
	 		gb.setAttribute("onmouseout","evt.stopPropagation()");	
		}
		punchY =  gN(gbVarName);

		if(punchY === 0)
		{
			punchY = ((sep+0.5*t)*nBottom)+inset;
		}
		// punchY = roundToSixteenth(punchY);
		punchY = Math.round(punchY*1000)/1000;

		gb.getStyle().setProperty("fill",color,"");
		gb.setAttribute("x",x); 
		gb.setAttribute("y",y + h - punchY - (t/2));
		gb.setAttribute("width",w);
		
		if(!redraw && applet)
		{
			applet.registerHorzElement( idPrefix+gbName,
										idPrefix+rectName,
										(y + h - punchY - (t/2)) +"", 	
										t + "",
										"s(\""+gbVarName+"\","+h+"-%Y%)");
			// return point
			applet.registerHorzElement( idPrefix,
										"",
										(y + h - punchY - (t/2)) +"", 	
										t + "",
										null);
		}
		
		if(!gbExists)
		{
			grp = drawing.getElementById(gridElName);
			if(grp == null)
			{
				grp = drawing.createElementNS(svgNS,"g");
				grp.setAttribute("id",gridElName);
			
				ins = rect.nextSibling;
				if(ins == null)
				{
					window.appendChild(grp);
				}
				else
				{
					ins.parentNode.insertBefore(grp,ins);
				}
			}
			grp.appendChild(gb);
		}
		desc = "LENGTH: %W%  PUNCH: %P%.";
		desc = desc.replace(/%W%/g,getDim(gridLen(rectName, gbName)));
		desc = desc.replace(/%P%/g,getDim(punchY)); // getDim(punchY));
		s(gbVarName,punchY);
		createDescription(gbName,desc);
	}
}catch(e)
{
	alertUser("Exception:  drawPrairieGrid('"+ rectName+"','"+gridElName+"','"+color+"',"+t+")");
	alertUser(e);
	trace(e);
}
}


/**
 * PRIVATE Create an element for a diamond grille pattern
 *   
 * @param gridElName 	String group id of grille 
 * @param n				integer 
 * @param color
 * @param t
 * @param grp
 * @param redraw
 * @return
 */
function createDiamondPathElement(gridElName,n,color,t,grp,redraw)
{
	var gdName = (redraw?idPrefix:"")+gridElName+"d" + n;
	var gd = drawing.getElementById(gdName);
	var gdExists = true;
	if(gd === null)
	{
		gdExists = false;
//		gd = drawing.createElementNS(svgNS,"path");
		gd = drawing.createElementNS(svgNS,"line");
		gd.setAttribute("id",gdName);
		gd.setAttribute("class","grid");
		gd.setAttribute("d","M 0,0");
		gd.setAttribute("x1","0");
		gd.setAttribute("y1","0");
		gd.setAttribute("x2","1");
		gd.setAttribute("y2","1");
		gd.getStyle().setProperty("stroke",color,"");
		gd.getStyle().setProperty("stroke-width",t,"");
		
		grp.appendChild(gd);
		
		createDescription(gdName," XXXXXXX");
	}
	return gd;
}


/**
 * Draw a diamond grille pattern.
 * 
 * Caller must first set the number vertical and horizonal lites
 * in the variable map:
 * s("f_"+gridElName+"v",<vertical lites>);
 * s("f_"+gridElName+"h",<horizontal lites>);
 * 
 * @param rectName		String id of glass pane
 * @param gridElName	String id and prefix of element IDs
 * @param color			String web color code
 * @param t				decimal element thickness
 * @param redraw		boolean redrawing
 * @return				void
 */

function drawDiamondGrid(rectName,gridElName,color,t,redraw)
{
trace("drawDiamondGrid('"+ rectName+"','"+gridElName+"','"+color+"',"+t+")");
try{
var idPrefix = g("f_idprefix");
var redrawScript = 	"drawDiamondGrid('%ID%','"+gridElName+"','"+color+"',"+t+",true)";
var	tb = gN("f_"+gridElName+"v");
var	lr = gN("f_"+gridElName+"h");


	var window = drawing.getElementById("window");
	var rect = drawing.getElementById(rectName);
	if(rect === null)
	{
		trace("drawDiamondGrid() failed because " + rectName + " does not exist.");
		return;
	}


	createClipPattern(rectName);
	var grp = drawing.getElementById(gridElName);
	if(grp == null)
	{
				grp = drawing.createElementNS(svgNS,"g");
				grp.setAttribute("id",gridElName);
				grp.getStyle().setProperty("clip-path","url(#"+idPrefix+"clip_"+rectName+")","");

				var ins = rect.nextSibling;
				if(ins == null)
				{
					window.appendChild(grp);
				}
				else
				{
					ins.parentNode.insertBefore(grp,ins);
				}
	}
		
	var x = rect.getAttribute("x") - 0;
	var y = rect.getAttribute("y") - 0;
	var h = rect.getAttribute("height") - 0;
	var w = rect.getAttribute("width") - 0;
	if(applet && !redraw)
	{
			applet.registerLite(idPrefix+rectName,x+"",y+"",w+"",h+"",redrawScript);
	}

	var nLR,nTB;
	var hSep = w/lr;
	var vSep = h/tb;
	
	// calculate the vertical (top/bottom) punch points
	var nV = 1;
	for(;nV < lr;nV++)
	{
		var gvVarName = gridElName+"v" + nV;
		var punchX =  g(gvVarName);
		if(punchX === null || punchX === 0)
		{
			punchX = (nV*hSep);
		}
		punchX  = roundToSixteenth(punchX);
		s(gvVarName,punchX);
		
		if(!redraw && applet)
		{
			// alignment point
			applet.registerVertElement(	idPrefix,
										"",
										(x + punchX - (t/2)) +"", 	
										t + "",
										null);
						
		}
	}
	
	// calculate the horizontal (sides) punch points
	var nH = 1;
	for(;nH < tb;nH++)
	{
		var ghVarName = gridElName+"h" + nH;
		var punchY =  g(ghVarName);
		if(punchY === null || punchY === 0)
		{
			punchY = (nH*vSep);
		}
		punchY  = roundToSixteenth(punchY);
		s(ghVarName,punchY);
		
		if(!redraw && applet)
		{
			// alignment point
			applet.registerHorzElement(	idPrefix,
										"",
										(y + punchY - (t/2)) +"", 	
										t + "",
										null);
						
		}
	}
	
	var gd,x1,y1,x2,y2,path,cornerX,cornerY,edgeX,edgeY;
	var nD = 0;

		cornerX = cornerY = Math.sqrt(Math.pow(t,2)/2);
		edgeX = edgeY = Math.sqrt(Math.pow(t,2)*2);
		
		
		if( lr == tb)
		{
			trace("lines from top to right");
			for(nLR=0; nLR < lr; nLR++)
			{ 
				nD++;
				gd = createDiamondPathElement(gridElName,nD,color,t,grp,redraw);
				y1 = y;
				x1 = x + (hSep*nLR);
				x2 = x+w;
				y2 = y + h - (vSep*(nLR-lr+tb));
			
				gd.setAttribute("x1",x1);
				gd.setAttribute("y1",y1);
				gd.setAttribute("x2",x2);
				gd.setAttribute("y2",y2);
       createDescription(gridElName,"LENGTH: " + getDim(gridLen(rectName, gridElName)) + "  THICKNESS: " + getDim(t));
			
			}

			trace("lines from right to bottom");
			for(nTB=0; nTB < tb; nTB++)
			{    
				nD++;
				gd = createDiamondPathElement(gridElName,nD,color,t,grp,redraw);

				x1 = x+w;
				y1 = y+nTB*vSep;
				x2 = x + nTB*hSep;
				y2 = y+h;
				
				gd.setAttribute("x1",x1);
				gd.setAttribute("y1",y1);
				gd.setAttribute("x2",x2);
				gd.setAttribute("y2",y2);
	      createDescription(gridElName,"LENGTH: " + getDim(gridLen(rectName, gridElName)) + "  THICKNESS: " + getDim(t));
			
			}
			trace("lines from bottom to left");
			for(nLR=1; nLR <= lr; nLR++)
			{  
				
				nD++;
				gd = createDiamondPathElement(gridElName,nD,color,t,grp,redraw);
				x1 = (x+nLR*hSep);
				y1 = y+h;
				x2 = x;
				y2 = y+h-(nLR*vSep);

				gd.setAttribute("x1",x1);
				gd.setAttribute("y1",y1);
				gd.setAttribute("x2",x2);
				gd.setAttribute("y2",y2);
       createDescription(gridElName,"LENGTH: " + getDim(gridLen(rectName, gridElName)) + "  THICKNESS: " + getDim(t));
			}			
		
			trace("lines from left to top");
			for(nLR=1; nLR < lr; nLR++)
			{  
				
				nD++;
				gd = createDiamondPathElement(gridElName,nD,color,t,grp,redraw);
				x1 = x;
				y1 = y+(nLR*vSep);
				x2 = x+(nLR*hSep);
				y2 = y;

				gd.setAttribute("x1",x1);
				gd.setAttribute("y1",y1);
				gd.setAttribute("x2",x2);
				gd.setAttribute("y2",y2);
			
       createDescription(gridElName,"LENGTH: " + getDim(gridLen(rectName, gridElName)) + "  THICKNESS: " + getDim(t));
			}			

		}
		else
		if( lr < tb)
		{
			trace("lines from top to right");
			for(nLR=0; nLR < lr; nLR++)
			{ 
				nD++;
				gd = createDiamondPathElement(gridElName,nD,color,t,grp,redraw);
				y1 = y;
				x1 = x + (hSep*nLR);
				x2 = x+w;
				y2 = y + (vSep*(lr - nLR));
			
				gd.setAttribute("x1",x1);
				gd.setAttribute("y1",y1);
				gd.setAttribute("x2",x2);
				gd.setAttribute("y2",y2);
       createDescription(gridElName,"LENGTH: " + getDim(gridLen(rectName, gridElName)) + "  THICKNESS: " + getDim(t));
			}

			trace("lines from right to left/bottom");
			for(nTB=0; nTB < tb; nTB++)
			{    
				nD++;
				gd = createDiamondPathElement(gridElName,nD,color,t,grp,redraw);

				x1 = x+w;
				y1 = y+nTB*vSep;
				x2 = nTB > (tb-lr) ? x + (nTB - (tb-lr))*hSep : x;
				y2 = nTB > (tb-lr) ? y+h : y1+(lr*vSep);
				
				gd.setAttribute("x1",x1);
				gd.setAttribute("y1",y1);
				gd.setAttribute("x2",x2);
				gd.setAttribute("y2",y2);
       createDescription(gridElName,"LENGTH: " + getDim(gridLen(rectName, gridElName)) + "  THICKNESS: " + getDim(t));
			}
			trace("lines from bottom to left");
			for(nLR=1; nLR <= lr; nLR++)
			{  
				
				nD++;
				gd = createDiamondPathElement(gridElName,nD,color,t,grp,redraw);
				x1 = (x+nLR*hSep);
				y1 = y+h;
				x2 = x;
				y2 = y+h-(nLR*vSep);

				gd.setAttribute("x1",x1);
				gd.setAttribute("y1",y1);
				gd.setAttribute("x2",x2);
				gd.setAttribute("y2",y2);
       createDescription(gridElName,"LENGTH: " + getDim(gridLen(rectName, gridElName)) + "  THICKNESS: " + getDim(t));
			}			
		
			trace("lines from left to top");
			for(nLR=1; nLR <= lr; nLR++)
			{  
				
				nD++;
				gd = createDiamondPathElement(gridElName,nD,color,t,grp,redraw);
				x1 = x;
				y1 = y+(nLR*vSep);
				x2 = x+(nLR*hSep);
				y2 = y;

				gd.setAttribute("x1",x1);
				gd.setAttribute("y1",y1);
				gd.setAttribute("x2",x2);
				gd.setAttribute("y2",y2);
       createDescription(gridElName,"LENGTH: " + getDim(gridLen(rectName, gridElName)) + "  THICKNESS: " + getDim(t));
			}			

			trace("lines from left to right");
			for(nLR=1; nLR <= (tb-lr); nLR++)
			{  
				
				nD++;
				gd = createDiamondPathElement(gridElName,nD,color,t,grp,redraw);
				x1 = x;
				y1 = y+(nLR*vSep);
				x2 = x+w;
				y2 = y1+(lr*vSep);

				gd.setAttribute("x1",x1);
				gd.setAttribute("y1",y1);
				gd.setAttribute("x2",x2);
				gd.setAttribute("y2",y2);
       createDescription(gridElName,"LENGTH: " + getDim(gridLen(rectName, gridElName)) + "  THICKNESS: " + getDim(t));
			}	

		}
		
	
		else
		if( lr > tb)
		{
			trace("lines from top to right");
			for(nLR=0; nLR < lr; nLR++)
			{ 
				nD++;
				gd = createDiamondPathElement(gridElName,nD,color,t,grp,redraw);
				y1 = y;
				x1 = x + (hSep*nLR);
				x2 = nLR > tb ? x+w : x1+(tb*hSep);
				y2 = nLR > tb ? y+((nLR-tb)*vSep): y + h;
			
				gd.setAttribute("x1",x1);
				gd.setAttribute("y1",y1);
				gd.setAttribute("x2",x2);
				gd.setAttribute("y2",y2);
       createDescription(gridElName,"LENGTH: " + getDim(gridLen(rectName, gridElName)) + "  THICKNESS: " + getDim(t));
			}

			trace("lines from right to bottom");
			for(nTB=0; nTB < tb; nTB++)
			{    
				nD++;
				gd = createDiamondPathElement(gridElName,nD,color,t,grp,redraw);

				x1 = x+w;
				y1 = y+(nTB*vSep);
				x2 = x + (lr-tb+nTB)*hSep;
				y2 = y+h;
				
				gd.setAttribute("x1",x1);
				gd.setAttribute("y1",y1);
				gd.setAttribute("x2",x2);
				gd.setAttribute("y2",y2);
       createDescription(gridElName,"LENGTH: " + getDim(gridLen(rectName, gridElName)) + "  THICKNESS: " + getDim(t));
			
			}
			trace("lines from bottom to left/top");
			for(nLR=1; nLR <= lr; nLR++)
			{  
				
				nD++;
				
				x1 = (x+(nLR*hSep));
				y1 = y+h;
				x2 = x;
				y2 = y+h-(nLR*vSep);
				
				if(x2 == x && y2 == y)
					continue;

			gd = createDiamondPathElement(gridElName,nD,color,t,grp,redraw);

				gd.setAttribute("x1",x1);
				gd.setAttribute("y1",y1);
				gd.setAttribute("x2",x2);
				gd.setAttribute("y2",y2);
       createDescription(gridElName,"LENGTH: " + getDim(gridLen(rectName, gridElName)) + "  THICKNESS: " + getDim(t));
			}			
		
			trace("lines from left to top");
			for(nLR=1; nLR <= lr; nLR++)
			{  
				
				nD++;
				gd = createDiamondPathElement(gridElName,nD,color,t,grp,redraw);
				x1 = x;
				y1 = y+(nLR*vSep);
				x2 = x+(nLR*hSep);
				y2 = y;

				gd.setAttribute("x1",x1);
				gd.setAttribute("y1",y1);
				gd.setAttribute("x2",x2);
				gd.setAttribute("y2",y2);
       createDescription(gridElName,"LENGTH: " + getDim(gridLen(rectName, gridElName)) + "  THICKNESS: " + getDim(t));
			}			

			

		}
	
		

}catch(e)
{
	alertUser("Exception:  drawDiamondGrid('"+ rectName+"','"+gridElName+"','"+color+"',"+t+")");
	alertUser(e);
	trace(e);
}
}



/**
 * Draw a mitred frame where the sides, the top, and the bottom
 * frame thickness can all vary.
 * 
 * @param id		String id
 * @param x			decimal x coordinate
 * @param y			decimal y coordinate
 * @param w			decimal width
 * @param h			decimal height
 * @param f			decimal side frame thickness
 * @param fTop		decimal top frame thickness
 * @param fBot		decimal bottom frame thickness
 * @param color		String web color code
 * @return
 */

function initOuterMiterFrame(id, x, y, w, h, f,fTop,fBot, color)
{
try
{
trace("initOuterMiterFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+","+ fTop+","+ fBot+",'"+ color+"')");

	var ws = w - (2*f);
	var hs = h - fTop - fBot;
	var desc = "";
	var tn = g("f_tn") == "true";


	// frame group
	var grp = drawing.getElementById(id);
	if(grp === null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id);
		drawing.getElementById("window").appendChild(grp);
	}
	// top
	var top = drawing.getElementById(id+"_header");
	if(top === null)
	{
		top = drawing.createElementNS(svgNS,"path");
		top.setAttribute("id",id+"_header");
		top.setAttribute("class","frame");
		top.setAttribute("d","M 0,0");
		grp.appendChild(top);
	}
	var path = "M "+x+","+y+" l "+w+",0 ";
	if(fTop <= f)
	{
		path += "l -"+fTop+","+fTop+ " l -"+(w-(fTop*2))+",0 l -"+fTop+",-"+fTop;
	}
	else
	if(fTop > f)
	{
			path += "l -"+f+","+f+ " l 0,"+(fTop-f)+" l -"+(w-(f*2))+",0 l 0,-"+(fTop-f)+" l -"+f+",-"+f;
	}
	top.setAttribute("d",path);
	top.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		top.setAttribute("class","frameTN");
	}
	else
	{	
		desc = "LENGTH: %W% ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%F%/g,getDim(fTop));
		createDescription(id+"_header",desc);
	}
	
	// bottom
	var bot = drawing.getElementById(id+"_sill");
	if(bot === null)
	{
		bot = drawing.createElementNS(svgNS ,"path");
		bot.setAttribute("id",id+"_sill");
		bot.setAttribute("d","M 0,0");
		bot.setAttribute("class","frame");
		
		grp.appendChild(bot);
	}
	path = "M "+x+","+(y+h)+" l "+w+",0 ";
	if(fBot <= f)
	{
		path += "l -"+fBot+",-"+fBot+ " l -"+(w-(fBot*2))+",0 l -"+fBot+","+fBot;
	}
	else
	if(fBot > f)
	{
			path += "l -"+f+",-"+f+ " l 0,-"+(fBot-f)+" l -"+(w-(f*2))+",0 l 0,"+(fBot-f)+" l -"+f+","+f;
	}
	bot.setAttribute("d",path);
	bot.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		bot.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %W% ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%F%/g,getDim(fBot));
		createDescription(id+"_sill",desc);
	}
	
	// left
	var left = drawing.getElementById(id+"_left_jamb");
	if(left === null)
	{
		left = drawing.createElementNS(svgNS,"path");
		left.setAttribute("id",id+"_left_jamb");
		left.setAttribute("d","M 0,0");
		left.setAttribute("class","frame");
		
		grp.appendChild(left);
	}
	
	path = "M "+x+","+(y)+" l 0,"+h;
	if(fBot >= f)
	{
		path += " l "+f+",-"+f;
	}
	else
	if(fBot < f)
	{
		path += " l "+fBot+",-"+fBot + " l "+(f - fBot)+",0 ";
	}
	if(fTop >= f)
	{
		path += " l 0,-"+(h-f-Math.min(fBot,f))+" l -"+f+",-"+f;
	}
	else
	if(fTop < f)
	{
		path += " l 0,-"+(h-fTop-Math.min(fBot,f))+" l -"+(f-fTop)+",0 l -"+fTop+",-"+fTop;
	}
	left.setAttribute("d",path);
	left.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		left.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H% ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_left_jamb",desc);
	}
	
	// right
	var right = drawing.getElementById(id+"_right_jamb");
	if(right === null)
	{
		right = drawing.createElementNS(svgNS, "path");
		right.setAttribute("id",id+"_right_jamb");
		right.setAttribute("d","M 0,0");
		right.setAttribute("class","frame");
		
		grp.appendChild(right);
	}
	path = "M "+(x+w)+","+(y)+" l 0,"+h;
	if(fBot >= f)
	{
		path += " l -"+f+",-"+f;
	}
	else
	if(fBot < f)
	{
		path += " l -"+fBot+",-"+fBot + " l -"+(f - fBot)+",0 ";
	}
	if(fTop >= f)
	{
		path += " l 0,-"+(h-f-Math.min(fBot,f))+" l "+f+",-"+f;
	}
	else
	if(fTop < f)
	{
		path += " l 0,-"+(h-fTop-Math.min(fBot,f))+" l "+(f-fTop)+",0 l "+fTop+",-"+fTop;
	}
	right.setAttribute("d",path);
	right.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		right.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H%  ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_right_jamb",desc);
	
		desc = "WIDTH: %W% HEIGHT: %H% ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));

		createDescription(id,desc);
	}
}	
catch(e)
{
	alertUser("Exception:  initOuterMiterFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+","+ fTop+","+ fBot+",'"+ color+"')");
	alertUser(e);
	trace(e);
}	
} 



/**
 * Draw a non-mitred frame where the sides, the top, and the bottom
 * frame thickness can all vary.
 * 
 * @param id		string id
 * @param x			decimal x coordinate
 * @param y			decimal y coordinate
 * @param total_w	decimal width
 * @param total_h	decimal height
 * @param f_side	decimal side frame thickness
 * @param f_top		decimal top frame thickness
 * @param top_thru	boolean top runs total width
 * @param f_bot		decimal bottom frame thickness
 * @param bot_thru	boolean bottom runs total width
 * @param color		string web color code
 * @return
 */


function initOuterNonMtrdFrame(id, x, y, total_w, total_h, f_side, f_top, top_thru, f_bot, bot_thru, color)
{
/** Modified by PGT 
 *  2/24/17 - Greg W
 *		added ability to specify top and/or bottom through jointery
 *		replaced config call data with variables to make for easier calcs within rule
 *		reformatted using proper indentation for easier reading
 */				
	try
	{
		trace("initOuterNonMtrdFrame('"+id+"',"+x+","+y+","+total_w+","+total_h+","+f_side+","+f_top+","+toString(top_thru)+","+f_bot+","+toString(bot_thru)+",'"+ color+"')");
		trace("rect.js modified again");
		
		var desc = "";
		var tn = g("f_tn") == "true";


		// frame group
		var grp = drawing.getElementById(id);
		if(grp === null)
		{
			grp = drawing.createElementNS(svgNS,"g");
			grp.setAttribute("id",id);
			drawing.getElementById("window").appendChild(grp);
		}
		
		// top
		// default values work for top thru
		var top_x = x;
		var top_y = y;
		var top_w = total_w;
		var top_h = f_top;
		
		if(top_thru === false)
		{
			//top_x would be adjusted to be inside the side
			top_x = x + f_side;
			// subtract the side_w to get the top_w
			top_w = total_w - (2 * f_side);
		}
		
		var top = drawing.getElementById(id+"_header");
		if(top === null)
		{
			top = drawing.createElementNS(svgNS,"rect");
			top.setAttribute("id",id+"_header");
			top.setAttribute("class","frame");
			top.setAttribute("x",top_x);
			top.setAttribute("y",top_y);
			top.setAttribute("width",top_w);
			top.setAttribute("height",top_h);
			top.getStyle().setProperty("fill",color,"");
			grp.appendChild(top);
		}
		else
		{
			top.setAttribute("x",top_x);
			top.setAttribute("y",top_y);
			top.setAttribute("width",top_w);
			top.setAttribute("height",top_h);
			top.getStyle().setProperty("fill",color,"");
		}
		if(tn)
		{
			top.setAttribute("class","frameTN");
		}
		else
		{	
			desc = "LENGTH: %W% ... %F% extrusion stock.";
			desc = desc.replace(/%W%/g,getDim(top_w));
			desc = desc.replace(/%F%/g,getDim(f_top));
			createDescription(id+"_header",desc);
		}

		// bottom
		// default values work for bot thru
		var bot_x = x;
		var bot_y = y + (total_h - f_bot);
		var bot_w = total_w;
		var bot_h = f_bot;
		
		if(bot_thru === false)
		{
			// bot_x would be adjusted to be inside the side
			bot_x = x + f_side;
			// subtract the side_w to get the bot_w
			bot_w = total_w - (2 * f_side);
		}
		
		var bot = drawing.getElementById(id+"_sill");
		if(bot === null)
		{
			bot = drawing.createElementNS(svgNS ,"rect");
			bot.setAttribute("id",id+"_sill");
			bot.setAttribute("class","frame");
			bot.setAttribute("x",bot_x);
			bot.setAttribute("y",bot_y);
			bot.setAttribute("width",bot_w);
			bot.setAttribute("height",bot_h);
			bot.getStyle().setProperty("fill",color,"");
			
			grp.appendChild(bot);
		}
		else
		{
			bot.setAttribute("x",bot_x);
			bot.setAttribute("y",bot_y);
			bot.setAttribute("width",bot_w);
			bot.setAttribute("height",bot_h);
			bot.getStyle().setProperty("fill",color,"");
		}
		if(tn)
		{
			bot.setAttribute("class","frameTN");
		}
		else
		{	
			desc = "LENGTH: %W% ... %F% extrusion stock.";
			desc = desc.replace(/%W%/g,getDim(bot_w));
			desc = desc.replace(/%F%/g,getDim(f_bot));
			createDescription(id+"_sill",desc);
		}
		bot.getStyle().setProperty("fill",color,"");
		
			
		// left
		// default values work for not top or bot thru
		var left_x = x;
		var left_y = y;
		var left_w = f_side;
		var left_h = total_h;

		if(top_thru === true)
		{
			// if top thru then adjust starting position and height			
			left_y = left_y + top_h;
			left_h = left_h - top_h;
		}
		
		if(bot_thru === true)
		{
			// if bottom thru then the height needs to be adjusted
			left_h = left_h - bot_h;
		}
		
		var left = drawing.getElementById(id+"_left_jamb");
		if(left === null)
		{
			left = drawing.createElementNS(svgNS,"rect");
			left.setAttribute("id",id+"_left_jamb");
			left.setAttribute("class","frame");
			left.setAttribute("x",left_x);
			left.setAttribute("y",left_y);
			left.setAttribute("width",left_w);
			left.setAttribute("height",left_h);
			left.getStyle().setProperty("fill",color,"");
			grp.appendChild(left);
		}
		else
		{
			left.setAttribute("x",left_x);
			left.setAttribute("y",left_y);
			left.setAttribute("width",left_w);
			left.setAttribute("height",left_h);
			left.getStyle().setProperty("fill",color,"");
		}
		if(tn)
		{
			left.setAttribute("class","frameTN");
		}
		else
		{
			desc = "LENGTH: %H% ... %F% extrusion stock.";
			desc = desc.replace(/%H%/g,getDim(left_h));
			desc = desc.replace(/%F%/g,getDim(f_side));
			createDescription(id+"_left_jamb",desc);
		}
		
		// right
		// default values work for not top or bot thru
		var right_x = x + (total_w - f_side);
		var right_y = y;
		var right_w = f_side;
		var right_h = total_h;

		if(top_thru === true)
		{
			// if top thru then adjust starting position and height			
			right_y = right_y + top_h;
			right_h = right_h - top_h;
		}
		
		if(bot_thru === true)
		{
			// if bottom thru then the height needs to be adjusted
			right_h = right_h - bot_h;
		}
		
		var right = drawing.getElementById(id+"_right_jamb");
		if(right === null)
		{
			right = drawing.createElementNS(svgNS, "rect");
			right.setAttribute("id",id+"_right_jamb");
			right.setAttribute("class","frame");
			right.setAttribute("x",right_x);
			right.setAttribute("y",right_y);
			right.setAttribute("width",right_w);
			right.setAttribute("height",right_h);
			right.getStyle().setProperty("fill",color,"");
			grp.appendChild(right);
		}
		else
		{
			right.setAttribute("x",right_x);
			right.setAttribute("y",right_y);
			right.setAttribute("width",right_w);
			right.setAttribute("height",right_h);
			right.getStyle().setProperty("fill",color,"");
		}
		if(tn)
		{
			right.setAttribute("class","frameTN");
		}
		else
		{
			desc = "LENGTH: %H%  ... %F% extrusion stock.";
			desc = desc.replace(/%H%/g,getDim(right_h));
			desc = desc.replace(/%F%/g,getDim(f_side));
			createDescription(id+"_right_jamb",desc);
		
//			desc = "WIDTH: %W% HEIGHT: %H% ... %F% extrusion stock.";
//			desc = desc.replace(/%W%/g,getDim(total_w));
//			desc = desc.replace(/%H%/g,getDim(total_h));
//			desc = desc.replace(/%F%/g,getDim(f));

			createDescription(id,desc);
		}
	}	
	catch(e)
	{
		alertUser("Exception:  initOuterNonMtrdFrame('"+id+"',"+x+","+ y+","+ total_w+","+ total_h+","+ f_side+","+ f_top+","+ top_thru+",'"+ f_bot+","+ bot_thru+",'"+ color+"')");
		alertUser(e);
		trace(e);
	}	
} 


/**
 * Draw a shutter frame where the sides, the top, and the bottom
 * frame thickness can all vary.
 * 
 * @param id		String id
 * @param x			decimal x coordinate
 * @param y			decimal y coordinate
 * @param w			decimal width
 * @param h			decimal height
 * @param f			decimal side frame thickness
 * @param fTop		decimal top frame thickness
 * @param fBot		decimal bottom frame thickness
 * @param color		String web color code or SPECIES code for wood grain
 * @return
 */
function initShutterFrame(id, x, y, w, h, f,fTop,fBot, color)
{
try
{
trace("initShutterFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+","+fTop+","+ fBot+",'"+ color+"')");

	var ws = w - (2*f);
	var hs = h - fBot;
	var desc = "";
	var tn = g("f_tn") == "true";

	var fillH = color.charAt(0) == '*' ? "url(#"+ g(color.substring(1))+"H)" : color;
	var fillV = color.charAt(0) == '*' ? "url(#"+ g(color.substring(1))+"V)" : color;
	// frame group
	var grp = drawing.getElementById(id);
	if(grp === null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id);
		drawing.getElementById("window").appendChild(grp);
	}
	// top
	var top = drawing.getElementById(id+"_header");
	if(top === null)
	{
		top = drawing.createElementNS(svgNS,"rect");
		top.setAttribute("id",id+"_header");
		top.setAttribute("class","frame");
		top.setAttribute("x",x+f);
		top.setAttribute("y",y);
		top.setAttribute("width",ws);
		top.setAttribute("height",fTop);
		top.getStyle().setProperty("fill",fillH,"");
		grp.appendChild(top);
	}
	else
	{
		top.setAttribute("x",x+f);
		top.setAttribute("y",y);
		top.setAttribute("width",ws);
		top.setAttribute("height",fTop);
		top.getStyle().setProperty("fill",fillH,"");
	}
	if(tn)
	{
		top.setAttribute("class","frameTN");
	}
	else
	{	
				desc = "LENGTH: %W% ... %F% basswood stock.";
				desc = desc.replace(/%W%/g,getDim(ws));
				desc = desc.replace(/%F%/g,getDim(fTop));
				createDescription(id+"_header",desc);
	}

	// bottom
	var bot = drawing.getElementById(id+"_sill");
	if(bot === null)
	{
		bot = drawing.createElementNS(svgNS ,"rect");
		bot.setAttribute("id",id+"_sill");
		bot.setAttribute("class","frame");
		bot.setAttribute("x",x+f);
		bot.setAttribute("y",y+h-fBot);
		bot.setAttribute("width",ws);
		bot.setAttribute("height",fBot);
		bot.getStyle().setProperty("fill",fillH,"");
		
		grp.appendChild(bot);
	}
	else
	{
		bot.setAttribute("x",x+f);
		bot.setAttribute("y",y+h-fBot);
		bot.setAttribute("width",ws);
		bot.setAttribute("height",fBot);
		bot.getStyle().setProperty("fill",fillH,"");
	}
	if(tn)
	{
		top.setAttribute("class","frameTN");
	}
	else
	{	
		desc = "LENGTH: %W% ... %F% basswood stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%F%/g,getDim(fBot));
		createDescription(id+"_sill",desc);
	}
	
		
	// left
	var left = drawing.getElementById(id+"_left_jamb");
	if(left === null)
	{
		left = drawing.createElementNS(svgNS,"rect");
		left.setAttribute("id",id+"_left_jamb");
		left.setAttribute("class","frame");
		left.setAttribute("x",x);
		left.setAttribute("y",y);
		left.setAttribute("width",f);
		left.setAttribute("height",h);
		left.getStyle().setProperty("fill",fillV,"");
		grp.appendChild(left);
	}
	else
	{
		left.setAttribute("x",x);
		left.setAttribute("y",y);
		left.setAttribute("width",f);
		left.setAttribute("height",h);
		left.getStyle().setProperty("fill",fillV,"");
	}
	if(tn)
	{
		left.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H% ... %F% basswood stock.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_left_jamb",desc);
	}
	
	// right
	var right = drawing.getElementById(id+"_right_jamb");
	if(right === null)
	{
		right = drawing.createElementNS(svgNS, "rect");
		right.setAttribute("id",id+"_right_jamb");
		right.setAttribute("class","frame");
		right.setAttribute("x",x+ws+f);
		right.setAttribute("y",y);
		right.setAttribute("width",f);
		right.setAttribute("height",h);
		right.getStyle().setProperty("fill",fillV,"");
		grp.appendChild(right);
	}
	else
	{
		right.setAttribute("x",x+ws+f);
		right.setAttribute("y",y);
		right.setAttribute("width",f);
		right.setAttribute("height",h);
		right.getStyle().setProperty("fill",fillV,"");
	}
	if(tn)
	{
		right.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H%  ... %F% basswood stock.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_right_jamb",desc);
	
		desc = "WIDTH: %W% HEIGHT: %H% ... %F% basswood stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));

		createDescription(id,desc);
	}
}	
catch(e)
{
	alertUser("Exception:  initShutterFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+","+fTop+","+ fBot+",'"+ color+"')");
	alertUser(e);
	trace(e);
}	
}


/**
 * Draw a mitred door frame.
 * 
 * @param id		String id
 * @param x			decimal x coordinate
 * @param y			decimal y coordinate
 * @param w			decimal width
 * @param h			decimal height
 * @param f			decimal side frame thickness
 * @param color		String web color code
 * @return
 */
function initDoorMiterFrame(id, x, y, w, h, f, color)
{
try
{
trace("initMitredFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+",'"+ color+"')");

	var ws = w - (2*f);
	var hs = h - (2*f);
	var desc = "";
	var tn = g("f_tn") == "true";


	// frame group
	var grp = drawing.getElementById(id);
	if(grp == null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id);
		drawing.getElementById("window").appendChild(grp);
	}
	// top
	var top = drawing.getElementById(id+"_header");
	if(top == null)
	{
		top = drawing.createElementNS(svgNS,"path");
		top.setAttribute("id",id+"_header");
		top.setAttribute("class","frame");
		top.setAttribute("d","M 0,0");
		grp.appendChild(top);
	
		var path = "M %X%,%Y% l %WL%,0 l -%F%,%F% l -%WS%,0 l -%F%,-%F%";
		path=path.replace(/%X%/g,x);
		path=path.replace(/%Y%/g,y);
		path=path.replace(/%WL%/g,w);
		path=path.replace(/%WS%/g,ws);
		path=path.replace(/%F%/g,f);
		top.setAttribute("d",path);
		top.getStyle().setProperty("fill",color,"");
			if(tn)
			{
				top.setAttribute("class","frameTN");
			}
			else
			{	
				desc = "LENGTH: %W% ... Mitred 45% %F% extrusion stock.";
				desc = desc.replace(/%W%/g,getDim(w));
				desc = desc.replace(/%F%/g,getDim(f));
				createDescription(id+"_header",desc);
			}
	}
	// bottom
	var bot = drawing.getElementById(id+"_threshold");
	if(bot === null)
	{
		bot = drawing.createElementNS(svgNS ,"path");
		bot.setAttribute("id",id+"_threshold");
		bot.setAttribute("d","M 0,0");
		bot.setAttribute("class","frame");
		
		grp.appendChild(bot);
	}
	path = "M %X%,%Y% l %WL%,0 l 0,-%F% l -%WL%,0 l 0,%F%";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y+h);
	path=path.replace(/%WL%/g,w);
	path=path.replace(/%WS%/g,ws);
	path=path.replace(/%F%/g,f/2);
	bot.setAttribute("d",path);
	bot.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		bot.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %W% ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_threshold",desc);
	}
	
	// left
	var left = drawing.getElementById(id+"_left_jamb");
	if(left === null)
	{
		left = drawing.createElementNS(svgNS,"path");
		left.setAttribute("id",id+"_left_jamb");
		left.setAttribute("d","M 0,0");
		left.setAttribute("class","frame");
		
		grp.appendChild(left);
	}
	
	path = "M %X%,%Y% l 0,%HL% l %F%,0 l 0,-%HS% l -%F%,-%F%";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%HL%/g,h-(f/2));
	path=path.replace(/%HS%/g,hs+(f/2));
	path=path.replace(/%F%/g,f);
	left.setAttribute("d",path);
	left.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		left.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H% ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_left_jamb",desc);
	}
	
	// right
	var right = drawing.getElementById(id+"_right_jamb");
	if(right === null)
	{
		right = drawing.createElementNS(svgNS, "path");
		right.setAttribute("id",id+"_right_jamb");
		right.setAttribute("d","M 0,0");
		right.setAttribute("class","frame");
		
		grp.appendChild(right);
	}
	path = "M %X%,%Y% l 0,%HL% l -%F%,0 l 0,-%HS% l %F%,-%F%";
	path=path.replace(/%X%/g,x+w);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%HL%/g,h-(f/2));
	path=path.replace(/%HS%/g,hs+(f/2));
	path=path.replace(/%F%/g,f);
	right.setAttribute("d",path);
	right.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		right.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H%  ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_right_jamb",desc);
	
		desc = "WIDTH: %W% HEIGHT: %H% ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));

		createDescription(id,desc);
	}
}	
catch(e)
{
	alertUser("Exception:  initMitredFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+",'"+ color+"')");
	alertUser(e);
	trace(e);
}	
} 

/**
 * Draw a non-mitred door frame.
 * 
 * @param id		String id
 * @param x			decimal x coordinate
 * @param y			decimal y coordinate
 * @param w			decimal width
 * @param h			decimal height
 * @param f			decimal side frame thickness
 * @param color		String web color code
 * @return
 */
function initDoorNonMtrdFrame(id, x, y, w, h, f, color)
{
try
{
trace("initMitredFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+",'"+ color+"')");

	var ws = w - (2*f);
	var hs = h - (f);
	var desc = "";
	var tn = g("f_tn") == "true";


	// frame group
	var grp = drawing.getElementById(id);
	if(grp == null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id);
		drawing.getElementById("window").appendChild(grp);
	}
	// top
	var top = drawing.getElementById(id+"_header");
	if(top == null)
	{
		top = drawing.createElementNS(svgNS,"path");
		top.setAttribute("id",id+"_header");
		top.setAttribute("class","frame");
		top.setAttribute("d","M 0,0");
		grp.appendChild(top);
	
		var path = "M %F%,%Y% l %WS%,0 l 0,%F% l -%WS%,0 l 0,-%F%";
		path=path.replace(/%X%/g,x);
		path=path.replace(/%Y%/g,y);
		path=path.replace(/%WL%/g,w);
		path=path.replace(/%WS%/g,ws);
		path=path.replace(/%F%/g,f);
		top.setAttribute("d",path);
		top.getStyle().setProperty("fill",color,"");
			if(tn)
			{
				top.setAttribute("class","frameTN");
			}
			else
			{	
				desc = "LENGTH: %W% ... %F% extrusion stock.";
				desc = desc.replace(/%W%/g,getDim(w));
				desc = desc.replace(/%F%/g,getDim(f));
				createDescription(id+"_header",desc);
			}
	}
	// bottom
	var bot = drawing.getElementById(id+"_threshold");
	if(bot === null)
	{
		bot = drawing.createElementNS(svgNS ,"path");
		bot.setAttribute("id",id+"_threshold");
		bot.setAttribute("d","M 0,0");
		bot.setAttribute("class","frame");
		
		grp.appendChild(bot);
	}
	path = "M %X%,%Y% l %WL%,0 l 0,-%F% l -%WL%,0 l 0,%F%";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y+h);
	path=path.replace(/%WL%/g,w);
	path=path.replace(/%WS%/g,ws);
	path=path.replace(/%F%/g,f/2);
	bot.setAttribute("d",path);
	bot.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		bot.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %W% ... %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_threshold",desc);
	}
	
	// left
	var left = drawing.getElementById(id+"_left_jamb");
	if(left === null)
	{
		left = drawing.createElementNS(svgNS,"path");
		left.setAttribute("id",id+"_left_jamb");
		left.setAttribute("d","M 0,0");
		left.setAttribute("class","frame");
		
		grp.appendChild(left);
	}
	
	path = "M %X%,%Y% l 0,%HL% l %F%,0 l 0,-%HL% l -%F%,0";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%HL%/g,h-(f/2));
	path=path.replace(/%HS%/g,h);
	path=path.replace(/%F%/g,f);

	left.setAttribute("d",path);
	left.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		left.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H% ... %F% extrusion stock.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_left_jamb",desc);
	}
	
	// right
	var right = drawing.getElementById(id+"_right_jamb");
	if(right === null)
	{
		right = drawing.createElementNS(svgNS, "path");
		right.setAttribute("id",id+"_right_jamb");
		right.setAttribute("d","M 0,0");
		right.setAttribute("class","frame");
		
		grp.appendChild(right);
	}
	path = "M %X%,%Y% l 0,%HL% l -%F%,0 l 0,-%HL% l %F%,0";
	path=path.replace(/%X%/g,x+w);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%HL%/g,h-(f/2));
	path=path.replace(/%HS%/g,h);
	path=path.replace(/%F%/g,f);
	right.setAttribute("d",path);
	right.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		right.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H%  ... %F% extrusion stock.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_right_jamb",desc);
	
		desc = "WIDTH: %W% HEIGHT: %H% ... %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));

		createDescription(id,desc);
	}
}	
catch(e)
{
	alertUser("Exception:  initMitredFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+",'"+ color+"')");
	alertUser(e);
	trace(e);
}	
} 


/**
 * Draw a non-mitred 3-sided door frame.
 * 
 * @param id		String id
 * @param x			decimal x coordinate
 * @param y			decimal y coordinate
 * @param w			decimal width
 * @param h			decimal height
 * @param f			decimal side frame thickness
 * @param fTop		decimal top frame thickness
 * @param color		String web color code
 * @return
 */
function initDoorNoThresholdNonMtrdFrame(id, x, y, w, h, f, fTop, color)
{
try
{
trace("initDoorNoThresholdNonMtrdFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+","+ fTop+",'"+ color+"')");

	var ws = w - (2*f);
	var hs = h - (f);
	var desc = "";
	var tn = g("f_tn") == "true";


	// frame group
	var grp = drawing.getElementById(id);
	if(grp == null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id);
		drawing.getElementById("window").appendChild(grp);
	}
	// top
	var top = drawing.getElementById(id+"_header");
	if(top == null)
	{
		top = drawing.createElementNS(svgNS,"path");
		top.setAttribute("id",id+"_header");
		top.setAttribute("class","frame");
		top.setAttribute("d","M 0,0");
		grp.appendChild(top);
	}
	var path = "M %X%,%Y% l %W%,0 l 0,%F% l -%W%,0 l 0,-%F%";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%W%/g,w);
	path=path.replace(/%F%/g,fTop);
	top.setAttribute("d",path);
	top.getStyle().setProperty("fill",color,"");
	if(tn)
	{
				top.setAttribute("class","frameTN");
	}
	else
	{	
				desc = "LENGTH: %W% ... %F% extrusion stock.";
				desc = desc.replace(/%W%/g,getDim(w));
				desc = desc.replace(/%F%/g,getDim(fTop));
				createDescription(id+"_header",desc);
	}
	
		
	// left
	var left = drawing.getElementById(id+"_left_jamb");
	if(left === null)
	{
		left = drawing.createElementNS(svgNS,"path");
		left.setAttribute("id",id+"_left_jamb");
		left.setAttribute("class","frame");
		
		grp.appendChild(left);
	}
	
	path = "M %X%,%Y% l 0,%HS% l %F%,0 l 0,-%HS% l -%F%,0";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y+fTop);
	path=path.replace(/%HS%/g,hs);
	path=path.replace(/%F%/g,f);

	left.setAttribute("d",path);
	left.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		left.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H% ... %F% extrusion stock.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_left_jamb",desc);
	}
	
	// right
	var right = drawing.getElementById(id+"_right_jamb");
	if(right === null)
	{
		right = drawing.createElementNS(svgNS, "path");
		right.setAttribute("id",id+"_right_jamb");
		right.setAttribute("d","M 0,0");
		right.setAttribute("class","frame");
		
		grp.appendChild(right);
	}
	path = "M %X%,%Y% l 0,%HS% l -%F%,0 l 0,-%HS% l %F%,0";
	path=path.replace(/%X%/g,x+w);
	path=path.replace(/%Y%/g,y+fTop);
	path=path.replace(/%HS%/g,hs);
	path=path.replace(/%F%/g,f);
	right.setAttribute("d",path);
	right.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		right.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H%  ... %F% extrusion stock.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_right_jamb",desc);
	
		desc = "WIDTH: %W% HEIGHT: %H% ... %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));

		createDescription(id,desc);
	}
}	
catch(e)
{
	alertUser("Exception:  initDoorNoThresholdNonMtrdFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+","+ fTop+",'"+ color+"')");
	alertUser(e);
	trace(e);
}	
} 


/**
 * Draw top sash (mitred) for a double-hung.
 * 
 * @param id		String id
 * @param x			decimal x coordinate
 * @param y			decimal y coordinate
 * @param w			decimal width
 * @param h			decimal height
 * @param f			decimal side frame thickness
 * @param color		String web color code
 * @return
 */
function initTopSash(id, x, y, w, h, f, color)
{
try
{
trace("initMitredFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+",'"+ color+"')");
	var tn = g("tn") == "true";
	var idPrefix = g("f_idprefix");

	var ws = w - (2*f);
	var hs = h - (2*f);
	var desc = "";
	
	// frame group
	var grp = drawing.getElementById(id);
	if(grp === null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id);
		
		drawing.getElementById("window").appendChild(grp);
	}
	
	// top
	var top = drawing.getElementById(id+"_handle_rail");
	if(top === null)
	{
		top = drawing.createElementNS(svgNS,"path");
		top.setAttribute("id",id+"_handle_rail");
		top.setAttribute("class","frame");
		top.setAttribute("d","M 0,0");
		
		grp.appendChild(top);
	}
	var path = "M %X%,%Y% l %WL%,0 l -%F%,%F% l -%WS%,0 l -%F%,-%F%";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%WL%/g,w);
	path=path.replace(/%WS%/g,ws);
	path=path.replace(/%F%/g,f);
	top.setAttribute("d",path);
	top.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		top.setAttribute("class","frameTN");
	}
	else
	{	
		desc = "LENGTH: %W% ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_handle_rail",desc);

	}
	
	// bottom
	var bot = drawing.getElementById(id+"_lock_rail");
	if(bot === null)
	{
		bot = drawing.createElementNS(svgNS ,"path");
		bot.setAttribute("id",id+"_lock_rail");
		bot.setAttribute("d","M 0,0");
		bot.setAttribute("class","frame");
		
		grp.appendChild(bot);
	}
	path = "M %X%,%Y% l %WL%,0 l -%F%,-%F% l -%WS%,0 l -%F%,%F%";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y+h);
	path=path.replace(/%WL%/g,w);
	path=path.replace(/%WS%/g,ws);
	path=path.replace(/%F%/g,f);
	bot.setAttribute("d",path);
	bot.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		bot.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %W% ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_lock_rail",desc);


		if(applet)
		{
			applet.registerHorzElement(idPrefix+id+"_lock_rail",
										"",
										y +"", 	
										f + "",
										null);
				
										
										
		}
	}
	
	// left
	var left = drawing.getElementById(id+"_left_stile");
	if(left === null)
	{
		left = drawing.createElementNS(svgNS,"path");
		left.setAttribute("id",id+"_left_stile");
		left.setAttribute("d","M 0,0");
		left.setAttribute("class","frame");
		
		grp.appendChild(left);
	}
	
	path = "M %X%,%Y% l 0,%HL% l %F%,-%F% l 0,-%HS% l -%F%,-%F%";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%HL%/g,h);
	path=path.replace(/%HS%/g,hs);
	path=path.replace(/%F%/g,f);
	left.setAttribute("d",path);
	left.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		left.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H% ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_left_stile",desc);
	}
	
	// right
	var right = drawing.getElementById(id+"_right_stile");
	if(right === null)
	{
		right = drawing.createElementNS(svgNS, "path");
		right.setAttribute("id",id+"_right_stile");
		right.setAttribute("d","M 0,0");
		right.setAttribute("class","frame");
		
		grp.appendChild(right);
	}
	path = "M %X%,%Y% l 0,%HL% l -%F%,-%F% l 0,-%HS% l %F%,-%F%";
	path=path.replace(/%X%/g,x+w);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%HL%/g,h);
	path=path.replace(/%HS%/g,hs);
	path=path.replace(/%F%/g,f);
	right.setAttribute("d",path);
	right.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		right.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H%  ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_right_stile",desc);
	
		desc = "WIDTH: %W% HEIGHT: %H% ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));

		createDescription(id,desc);
		//grp.setAttribute("onmousedown","showDescription(evt,true)");
		//grp.setAttribute("onmouseup","showDescription(evt,false)");
	}
}	
catch(e)
{
	alertUser("Exception:  initMitredFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+",'"+ color+"')");
	alertUser(e);
	trace(e);
}	
} 

/**
 * Draw top sash (non-mitred) for a double-hung.
 * 
 * @param id		String id
 * @param x			decimal x coordinate
 * @param y			decimal y coordinate
 * @param w			decimal width
 * @param h			decimal height
 * @param f			decimal side frame thickness
 * @param color		String web color code
 * @return
 */
function initNonMtrdTopSash(id, x, y, w, h, f, color)
{
try
{
trace("initMitredFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+",'"+ color+"')");
	var tn = g("tn") == "true";
	var idPrefix = g("f_idprefix");

	var ws = w - (2*f);
	var hs = h - (2*f);
	var desc = "";
	
	// frame group
	var grp = drawing.getElementById(id);
	if(grp === null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id);
		
		drawing.getElementById("window").appendChild(grp);
	}
	
	// top
	var top = drawing.getElementById(id+"_handle_rail");
	if(top === null)
	{
		top = drawing.createElementNS(svgNS,"path");
		top.setAttribute("id",id+"_handle_rail");
		top.setAttribute("class","frame");
		top.setAttribute("d","M 0,0");
		
		grp.appendChild(top);
	}
	var path = "M %X%,%Y% l %WS%,0 l 0,%F% l -%WS%,0 l 0,-%F%";
	path=path.replace(/%X%/g,x+f);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%WL%/g,w);
	path=path.replace(/%WS%/g,ws);
	path=path.replace(/%F%/g,f);
	top.setAttribute("d",path);
	top.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		top.setAttribute("class","frameTN");
	}
	else
	{	
		desc = "LENGTH: %W% ... %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_handle_rail",desc);
	}
	
	// bottom
	var bot = drawing.getElementById(id+"_lock_rail");
	if(bot === null)
	{
		bot = drawing.createElementNS(svgNS ,"path");
		bot.setAttribute("id",id+"_lock_rail");
		bot.setAttribute("d","M 0,0");
		bot.setAttribute("class","frame");
		
		grp.appendChild(bot);
	}
	path = "M %X%,%Y% l %WS%,0 l 0,-%F% l -%WS%,0 l 0,%F%";
	path=path.replace(/%X%/g,x+f);
	path=path.replace(/%Y%/g,y+h);
	path=path.replace(/%WL%/g,w);
	path=path.replace(/%WS%/g,ws);
	path=path.replace(/%F%/g,f);
	bot.setAttribute("d",path);
	bot.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		bot.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %W% ... %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_lock_rail",desc);

		if(applet)
		{
			applet.registerHorzElement(idPrefix+id+"_lock_rail",
										
										"",
										y +"", 	
										f + "",
										null);
		}
	}
	
	// left
	var left = drawing.getElementById(id+"_left_stile");
	if(left === null)
	{
		left = drawing.createElementNS(svgNS,"path");
		left.setAttribute("id",id+"_left_stile");
		left.setAttribute("d","M 0,0");
		left.setAttribute("class","frame");
		
		grp.appendChild(left);
	}
	
	path = "M %X%,%Y% l 0,%HL% l %F%,0 l 0,-%HL% l -%F%,0";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%HL%/g,h);
	path=path.replace(/%HS%/g,hs);
	path=path.replace(/%F%/g,f);
	left.setAttribute("d",path);
	left.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		left.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H% ... %F% extrusion stock.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_left_stile",desc);
	}
	
	// right
	var right = drawing.getElementById(id+"_right_stile");
	if(right === null)
	{
		right = drawing.createElementNS(svgNS, "path");
		right.setAttribute("id",id+"_right_stile");
		right.setAttribute("d","M 0,0");
		right.setAttribute("class","frame");
		
		grp.appendChild(right);
	}
	path = "M %X%,%Y% l 0,%HL% l -%F%,0 l 0,-%HL% l %F%,0";
	path=path.replace(/%X%/g,x+w);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%HL%/g,h);
	path=path.replace(/%HS%/g,hs);
	path=path.replace(/%F%/g,f);
	right.setAttribute("d",path);
	right.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		right.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H%  ... %F% extrusion stock.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_right_stile",desc);
	
		desc = "WIDTH: %W% HEIGHT: %H% ... %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));

		createDescription(id,desc);
		//grp.setAttribute("onmousedown","showDescription(evt,true)");
		//grp.setAttribute("onmouseup","showDescription(evt,false)");
	}
}	
catch(e)
{
	alertUser("Exception:  initMitredFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+",'"+ color+"')");
	alertUser(e);
	trace(e);
}	
} 

/**
 * Draw bottom sash (mitred) for a double-hung.
 * 
 * @param id		String id
 * @param x			decimal x coordinate
 * @param y			decimal y coordinate
 * @param w			decimal width
 * @param h			decimal height
 * @param f			decimal side frame thickness
 * @param color		String web color code
 * @return
 */
function initBottomSash(id, x, y, w, h, f, color)
{
try
{
trace("initBottomSash('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+",'"+ color+"')");
	var tn = g("tn") == "true";
	var idPrefix = g("f_idprefix");

	var ws = w - (2*f);
	var hs = h - (2*f);
	var desc = "";
	
	// frame group
	var grp = drawing.getElementById(id);
	if(grp == null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id);
		
		drawing.getElementById("window").appendChild(grp);
	}
	
	// top
	var top = drawing.getElementById(id+"_lock_rail");
	if(top === null)
	{
		top = drawing.createElementNS(svgNS,"path");
		top.setAttribute("id",id+"_lock_rail");
		top.setAttribute("class","frame");
		top.setAttribute("d","M 0,0");
		
		grp.appendChild(top);
	}
	var path = "M %X%,%Y% l %WL%,0 l -%F%,%F% l -%WS%,0 l -%F%,-%F%";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%WL%/g,w);
	path=path.replace(/%WS%/g,ws);
	path=path.replace(/%F%/g,f);
	top.setAttribute("d",path);
	top.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		top.setAttribute("class","frameTN");
	}
	else
	{	
		desc = "LENGTH: %W% ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_lock_rail",desc);

		if(applet)
		{
			applet.registerHorzElement(idPrefix+id+"_lock_rail",
										idPrefix+"this",
										y +"", 	
										f + "",
										null);
		}
	}
	
	// bottom
	var bot = drawing.getElementById(id+"_handle_rail");
	if(bot === null)
	{
		bot = drawing.createElementNS(svgNS ,"path");
		bot.setAttribute("id",id+"_handle_rail");
		bot.setAttribute("d","M 0,0");
		bot.setAttribute("class","frame");
		
		grp.appendChild(bot);
	}
	path = "M %X%,%Y% l %WL%,0 l -%F%,-%F% l -%WS%,0 l -%F%,%F%";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y+h);
	path=path.replace(/%WL%/g,w);
	path=path.replace(/%WS%/g,ws);
	path=path.replace(/%F%/g,f);
	bot.setAttribute("d",path);
	bot.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		bot.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %W% ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_handle_rail",desc);
	}
	
	// left
	var left = drawing.getElementById(id+"_left_stile");
	if(left === null)
	{
		left = drawing.createElementNS(svgNS,"path");
		left.setAttribute("id",id+"_left_stile");
		left.setAttribute("d","M 0,0");
		left.setAttribute("class","frame");
		
		grp.appendChild(left);
	}
	
	path = "M %X%,%Y% l 0,%HL% l %F%,-%F% l 0,-%HS% l -%F%,-%F%";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%HL%/g,h);
	path=path.replace(/%HS%/g,hs);
	path=path.replace(/%F%/g,f);
	left.setAttribute("d",path);
	left.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		left.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H% ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_left_stile",desc);
	}
	
	// right
	var right = drawing.getElementById(id+"_right_stile");
	if(right === null)
	{
		right = drawing.createElementNS(svgNS, "path");
		right.setAttribute("id",id+"_right_stile");
		right.setAttribute("d","M 0,0");
		right.setAttribute("class","frame");
		
		grp.appendChild(right);
	}
	path = "M %X%,%Y% l 0,%HL% l -%F%,-%F% l 0,-%HS% l %F%,-%F%";
	path=path.replace(/%X%/g,x+w);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%HL%/g,h);
	path=path.replace(/%HS%/g,hs);
	path=path.replace(/%F%/g,f);
	right.setAttribute("d",path);
	right.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		right.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H%  ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_right_stile",desc);
	
		desc = "WIDTH: %W% HEIGHT: %H% ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));

		createDescription(id,desc);
		// grp.setAttribute("onmousedown","showDescription(evt,true)");
		// grp.setAttribute("onmouseup","showDescription(evt,false)");
	}
}	
catch(e)
{
	alertUser("Exception:  initMitredFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+",'"+ color+"')");
	alertUser(e);
	trace(e);
}	
}

/**
 * Draw bottom sash (non-mitred) for a double-hung.
 * 
 * @param id		String id
 * @param x			decimal x coordinate
 * @param y			decimal y coordinate
 * @param w			decimal width
 * @param h			decimal height
 * @param f			decimal side frame thickness
 * @param color		String web color code
 * @return
 */
function initNonMtrdBottomSash(id, x, y, w, h, f, color)
{
try
{
trace("initMitredFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+",'"+ color+"')");
	var tn = g("tn") == "true";
	var idPrefix = g("f_idprefix");

	var ws = w - (2*f);
	var hs = h - (2*f);
	var desc = "";
	
	// frame group
	var grp = drawing.getElementById(id);
	if(grp == null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id);
		
		drawing.getElementById("window").appendChild(grp);
	}
	
	
	// top
	var top = drawing.getElementById(id+"_lock_rail");
	if(top === null)
	{
		top = drawing.createElementNS(svgNS,"path");
		top.setAttribute("id",id+"_lock_rail");
		top.setAttribute("class","frame");
		top.setAttribute("d","M 0,0");
		
		grp.appendChild(top);
	}
	var path = "M %X%,%Y% l %WS%,0 l 0,%F% l -%WS%,0 l 0,-%F%";
	path=path.replace(/%X%/g,x+f);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%WL%/g,w);
	path=path.replace(/%WS%/g,ws);
	path=path.replace(/%F%/g,f);
	top.setAttribute("d",path);
	top.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		top.setAttribute("class","frameTN");
	}
	else
	{	
		desc = "LENGTH: %W% ... %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_lock_rail",desc);
		if(applet)
		{
			applet.registerHorzElement(idPrefix+id+"_lock_rail",
										
										idPrefix+"this",
										y +"", 	
										f + "",
										null);
		}
	}

	// bottom
	var bot = drawing.getElementById(id+"_handle_rail");
	if(bot === null)
	{
		bot = drawing.createElementNS(svgNS ,"path");
		bot.setAttribute("id",id+"_handle_rail");
		bot.setAttribute("d","M 0,0");
		bot.setAttribute("class","frame");
		
		grp.appendChild(bot);
	}
	path = "M %X%,%Y% l %WS%,0 l 0,-%F% l -%WS%,0 l 0,%F%";
	path=path.replace(/%X%/g,x+f);
	path=path.replace(/%Y%/g,y+h);
	path=path.replace(/%WL%/g,w);
	path=path.replace(/%WS%/g,ws);
	path=path.replace(/%F%/g,f);
	bot.setAttribute("d",path);
	bot.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		bot.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %W% ... %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_handle_rail",desc);
	}
	
	// left
	var left = drawing.getElementById(id+"_left_stile");
	if(left === null)
	{
		left = drawing.createElementNS(svgNS,"path");
		left.setAttribute("id",id+"_left_stile");
		left.setAttribute("d","M 0,0");
		left.setAttribute("class","frame");
		
		grp.appendChild(left);
	}
	
	path = "M %X%,%Y% l 0,%HL% l %F%,0 l 0,-%HL% l -%F%,0";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%HL%/g,h);
	path=path.replace(/%HS%/g,hs);
	path=path.replace(/%F%/g,f);
	left.setAttribute("d",path);
	left.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		left.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H% ... %F% extrusion stock.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_left_stile",desc);
	}
	
	// right
	var right = drawing.getElementById(id+"_right_stile");
	if(right === null)
	{
		right = drawing.createElementNS(svgNS, "path");
		right.setAttribute("id",id+"_right_stile");
		right.setAttribute("d","M 0,0");
		right.setAttribute("class","frame");
		
		grp.appendChild(right);
	}
	path = "M %X%,%Y% l 0,%HL% l -%F%,0 l 0,-%HL% l %F%,0";
	path=path.replace(/%X%/g,x+w);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%HL%/g,h);
	path=path.replace(/%HS%/g,hs);
	path=path.replace(/%F%/g,f);
	right.setAttribute("d",path);
	right.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		right.setAttribute("class","frameTN");


	}
	else
	{
		desc = "LENGTH: %H%  ... %F% extrusion stock.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_right_stile",desc);
	
		desc = "WIDTH: %W% HEIGHT: %H% ... %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));

		createDescription(id,desc);
		// grp.setAttribute("onmousedown","showDescription(evt,true)");
		// grp.setAttribute("onmouseup","showDescription(evt,false)");
	}

}	
catch(e)
{
	alertUser("Exception:  initMitredFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+",'"+ color+"')");
	alertUser(e);
	trace(e);
}	
} 

/**
 * Draw the left sash (mitred) for a slider.
 * 
 * @param id		String id
 * @param x			decimal x coordinate
 * @param y			decimal y coordinate
 * @param w			decimal width
 * @param h			decimal height
 * @param f			decimal side frame thickness
 * @param color		String web color code
 * @return
 */
function initLeftSash(id, x, y, w, h, f, color)
{
try
{
trace("initMitredFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+",'"+ color+"')");

	var ws = w - (2*f);
	var hs = h - (2*f);
	var desc = "";
	var tn = g("f_tn") == "true";
	
	// frame group
	var grp = drawing.getElementById(id);
	if(grp === null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id);
		
		drawing.getElementById("window").appendChild(grp);
	}
	
	// top
	var top = drawing.getElementById(id+"_top_rail");
	if(top === null)
	{
		top = drawing.createElementNS(svgNS,"path");
		top.setAttribute("id",id+"_top_rail");
		top.setAttribute("class","frame");
		top.setAttribute("d","M 0,0");
		
		grp.appendChild(top);
	}
	var path = "M %X%,%Y% l %WL%,0 l -%F%,%F% l -%WS%,0 l -%F%,-%F%";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%WL%/g,w);
	path=path.replace(/%WS%/g,ws);
	path=path.replace(/%F%/g,f);
	top.setAttribute("d",path);
	top.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		top.setAttribute("class","frameTN");
	}
	else
	{	
		desc = "LENGTH: %W% ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_top_rail",desc);
	}
	
	// bottom
	var bot = drawing.getElementById(id+"_bottom_rail");
	if(bot === null)
	{
		bot = drawing.createElementNS(svgNS ,"path");
		bot.setAttribute("id",id+"_bottom_rail");
		bot.setAttribute("d","M 0,0");
		bot.setAttribute("class","frame");
		
		grp.appendChild(bot);
	}
	path = "M %X%,%Y% l %WL%,0 l -%F%,-%F% l -%WS%,0 l -%F%,%F%";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y+h);
	path=path.replace(/%WL%/g,w);
	path=path.replace(/%WS%/g,ws);
	path=path.replace(/%F%/g,f);
	bot.setAttribute("d",path);
	bot.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		bot.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %W% ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_bottom_rail",desc);
	}
	
	// left
	var left = drawing.getElementById(id+"_handle_stile");
	if(left === null)
	{
		left = drawing.createElementNS(svgNS,"path");
		left.setAttribute("id",id+"_handle_stile");
		left.setAttribute("d","M 0,0");
		left.setAttribute("class","frame");
		
		grp.appendChild(left);
	}
	
	path = "M %X%,%Y% l 0,%HL% l %F%,-%F% l 0,-%HS% l -%F%,-%F%";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%HL%/g,h);
	path=path.replace(/%HS%/g,hs);
	path=path.replace(/%F%/g,f);
	left.setAttribute("d",path);
	left.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		left.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H% ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_handle_stile",desc);
	}
	
	// right
	var right = drawing.getElementById(id+"_lock_stile");
	if(right === null)
	{
		right = drawing.createElementNS(svgNS, "path");
		right.setAttribute("id",id+"_lock_stile");
		right.setAttribute("d","M 0,0");
		right.setAttribute("class","frame");
		
		grp.appendChild(right);
	}
	path = "M %X%,%Y% l 0,%HL% l -%F%,-%F% l 0,-%HS% l %F%,-%F%";
	path=path.replace(/%X%/g,x+w);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%HL%/g,h);
	path=path.replace(/%HS%/g,hs);
	path=path.replace(/%F%/g,f);
	right.setAttribute("d",path);
	right.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		right.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H%  ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_lock_stile",desc);
	
		desc = "WIDTH: %W% HEIGHT: %H% ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));

		createDescription(id,desc);
	}
}	
catch(e)
{
	alertUser("Exception:  initMitredFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+",'"+ color+"')");
	alertUser(e);
	trace(e);
}	
} 


/**
 * Draw the left sash (mitred) for a slider.
 * 
 * @param id		String id
 * @param x			decimal x coordinate
 * @param y			decimal y coordinate
 * @param w			decimal width
 * @param h			decimal height
 * @param f			decimal side frame thickness
 * @param color		String web color code
 * @return
 */
function initNonMtrdLeftSash(id, x, y, w, h, f, color)
{
try
{
trace("initMitredFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+",'"+ color+"')");

	var ws = w - (2*f);
	var hs = h - (2*f);
	var desc = "";
	var tn = g("f_tn") == "true";
	
	// frame group
	var grp = drawing.getElementById(id);
	if(grp === null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id);
		
		drawing.getElementById("window").appendChild(grp);
	}
	
	// top
	var top = drawing.getElementById(id+"_top_rail");
	if(top === null)
	{
		top = drawing.createElementNS(svgNS,"path");
		top.setAttribute("id",id+"_top_rail");
		top.setAttribute("class","frame");
		top.setAttribute("d","M 0,0");
		
		grp.appendChild(top);
	}
	var path = "M %X%,%Y% l %WS%,0 l 0,%F% l -%WS%,0 l 0,-%F%";
	path=path.replace(/%X%/g,x+f);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%WL%/g,w);
	path=path.replace(/%WS%/g,ws);
	path=path.replace(/%F%/g,f);
	top.setAttribute("d",path);
	top.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		top.setAttribute("class","frameTN");
	}
	else
	{	
		desc = "LENGTH: %W% ... %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_top_rail",desc);
	}
	
	// bottom
	var bot = drawing.getElementById(id+"_bottom_rail");
	if(bot === null)
	{
		bot = drawing.createElementNS(svgNS ,"path");
		bot.setAttribute("id",id+"_bottom_rail");
		bot.setAttribute("d","M 0,0");
		bot.setAttribute("class","frame");
		
		grp.appendChild(bot);
	}
	path = "M %X%,%Y% l %WS%,0 l 0,-%F% l -%WS%,0 l 0,%F%";
	path=path.replace(/%X%/g,x+f);
	path=path.replace(/%Y%/g,y+h);
	path=path.replace(/%WL%/g,w);
	path=path.replace(/%WS%/g,ws);
	path=path.replace(/%F%/g,f);
	bot.setAttribute("d",path);
	bot.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		bot.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %W% ... %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_bottom_rail",desc);
	}
	
	// left
	var left = drawing.getElementById(id+"_handle_stile");
	if(left === null)
	{
		left = drawing.createElementNS(svgNS,"path");
		left.setAttribute("id",id+"_handle_stile");
		left.setAttribute("d","M 0,0");
		left.setAttribute("class","frame");
		
		grp.appendChild(left);
	}
	
	path = "M %X%,%Y% l 0,%HL% l %F%,0 l 0,-%HL% l -%F%,0";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%HL%/g,h);
	path=path.replace(/%HS%/g,hs);
	path=path.replace(/%F%/g,f);
	left.setAttribute("d",path);
	left.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		left.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H% ... %F% extrusion stock.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_handle_stile",desc);
	}
	
	// right
	var right = drawing.getElementById(id+"_lock_stile");
	if(right === null)
	{
		right = drawing.createElementNS(svgNS, "path");
		right.setAttribute("id",id+"_lock_stile");
		right.setAttribute("d","M 0,0");
		right.setAttribute("class","frame");
		
		grp.appendChild(right);
	}
	path = "M %X%,%Y% l 0,%HL% l -%F%,0 l 0,-%HL% l %F%,0";
	path=path.replace(/%X%/g,x+w);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%HL%/g,h);
	path=path.replace(/%HS%/g,hs);
	path=path.replace(/%F%/g,f);
	right.setAttribute("d",path);
	right.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		right.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H%  ... %F% extrusion stock.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_lock_stile",desc);
	
		desc = "WIDTH: %W% HEIGHT: %H% ... %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));

		createDescription(id,desc);
	}
}	
catch(e)
{
	alertUser("Exception:  initMitredFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+",'"+ color+"')");
	alertUser(e);
	trace(e);
}	
}


/**
 * Draw the right sash (mitred) for a slider.
 * 
 * @param id		String id
 * @param x			decimal x coordinate
 * @param y			decimal y coordinate
 * @param w			decimal width
 * @param h			decimal height
 * @param f			decimal side frame thickness
 * @param color		String web color code
 * @return
 */
function initRightSash(id, x, y, w, h, f, color)
{
try
{
trace("initMitredFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+",'"+ color+"')");

	var ws = w - (2*f);
	var hs = h - (2*f);
	var desc = "";
	var tn = g("f_tn") == "true";
	
	// frame group
	var grp = drawing.getElementById(id);
	if(grp === null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id);
		
		drawing.getElementById("window").appendChild(grp);
	}
	
	// top
	var top = drawing.getElementById(id+"_top_rail");
	if(top === null)
	{
		top = drawing.createElementNS(svgNS,"path");
		top.setAttribute("id",id+"_top_rail");
		top.setAttribute("class","frame");
		top.setAttribute("d","M 0,0");
		
		grp.appendChild(top);
	}
	var path = "M %X%,%Y% l %WL%,0 l -%F%,%F% l -%WS%,0 l -%F%,-%F%";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%WL%/g,w);
	path=path.replace(/%WS%/g,ws);
	path=path.replace(/%F%/g,f);
	top.setAttribute("d",path);
	top.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		top.setAttribute("class","frameTN");
	}
	else
	{	
		desc = "LENGTH: %W% ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_top_rail",desc);
	}
	
	// bottom
	var bot = drawing.getElementById(id+"_bottom_rail");
	if(bot === null)
	{
		bot = drawing.createElementNS(svgNS ,"path");
		bot.setAttribute("id",id+"_bottom_rail");
		bot.setAttribute("d","M 0,0");
		bot.setAttribute("class","frame");
		
		grp.appendChild(bot);
	}
	path = "M %X%,%Y% l %WL%,0 l -%F%,-%F% l -%WS%,0 l -%F%,%F%";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y+h);
	path=path.replace(/%WL%/g,w);
	path=path.replace(/%WS%/g,ws);
	path=path.replace(/%F%/g,f);
	bot.setAttribute("d",path);
	bot.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		bot.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %W% ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_bottom_rail",desc);
	}
	
	// left
	var left = drawing.getElementById(id+"_lock_stile");
	if(left === null)
	{
		left = drawing.createElementNS(svgNS,"path");
		left.setAttribute("id",id+"_lock_stile");
		left.setAttribute("d","M 0,0");
		left.setAttribute("class","frame");
		
		grp.appendChild(left);
	}
	
	path = "M %X%,%Y% l 0,%HL% l %F%,-%F% l 0,-%HS% l -%F%,-%F%";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%HL%/g,h);
	path=path.replace(/%HS%/g,hs);
	path=path.replace(/%F%/g,f);
	left.setAttribute("d",path);
	left.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		left.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H% ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_lock_stile",desc);
	}
	
	// right
	var right = drawing.getElementById(id+"_handle_stile");
	if(right === null)
	{
		right = drawing.createElementNS(svgNS, "path");
		right.setAttribute("id",id+"_handle_stile");
		right.setAttribute("d","M 0,0");
		right.setAttribute("class","frame");
		
		grp.appendChild(right);
	}
	path = "M %X%,%Y% l 0,%HL% l -%F%,-%F% l 0,-%HS% l %F%,-%F%";
	path=path.replace(/%X%/g,x+w);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%HL%/g,h);
	path=path.replace(/%HS%/g,hs);
	path=path.replace(/%F%/g,f);
	right.setAttribute("d",path);
	right.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		right.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H%  ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_handle_stile",desc);
	
		desc = "WIDTH: %W% HEIGHT: %H% ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));

		createDescription(id,desc);
		grp.setAttribute("onmousedown","showDescription(evt,true)");
		grp.setAttribute("onmouseup","showDescription(evt,false)");
	}
}	
catch(e)
{
	alertUser("Exception:  initMitredFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+",'"+ color+"')");
	alertUser(e);
	trace(e);
}	
} 

/**
 * Draw the right sash (non-mitred) for a slider.
 * 
 * @param id		String id
 * @param x			decimal x coordinate
 * @param y			decimal y coordinate
 * @param w			decimal width
 * @param h			decimal height
 * @param f			decimal side frame thickness
 * @param color		String web color code
 * @return
 */
function initNonMtrdRightSash(id, x, y, w, h, f, color)
{
try
{
trace("initMitredFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+",'"+ color+"')");

	var ws = w - (2*f);
	var hs = h - (2*f);
	var desc = "";
	var tn = g("f_tn") == "true";

	
	// frame group
	var grp = drawing.getElementById(id);
	if(grp === null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id);
		
		drawing.getElementById("window").appendChild(grp);
	}
	
	// top
	var top = drawing.getElementById(id+"_top_rail");
	if(top === null)
	{
		top = drawing.createElementNS(svgNS,"path");
		top.setAttribute("id",id+"_top_rail");
		top.setAttribute("class","frame");
		top.setAttribute("d","M 0,0");
		
		grp.appendChild(top);
	}
	var path = "M %X%,%Y% l %WS%,0 l 0,%F% l -%WS%,0 l 0,-%F%";
	path=path.replace(/%X%/g,x+f);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%WL%/g,w);
	path=path.replace(/%WS%/g,ws);
	path=path.replace(/%F%/g,f);
	top.setAttribute("d",path);
	top.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		top.setAttribute("class","frameTN");
	}
	else
	{	
		desc = "LENGTH: %W% ... %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_top_rail",desc);
	}
	// bottom
	var bot = drawing.getElementById(id+"_bottom_rail");
	if(bot === null)
	{
		bot = drawing.createElementNS(svgNS ,"path");
		bot.setAttribute("id",id+"_bottom_rail");
		bot.setAttribute("d","M 0,0");
		bot.setAttribute("class","frame");
		
		grp.appendChild(bot);
	}
	path = "M %X%,%Y% l %WS%,0 l 0,-%F% l -%WS%,0 l 0,%F%";
	path=path.replace(/%X%/g,x+f);
	path=path.replace(/%Y%/g,y+h);
	path=path.replace(/%WL%/g,w);
	path=path.replace(/%WS%/g,ws);
	path=path.replace(/%F%/g,f);
	bot.setAttribute("d",path);
	bot.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		bot.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %W% ... %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_bottom_rail",desc);
	}
	
	// left
	var left = drawing.getElementById(id+"_lock_stile");
	if(left === null)
	{
		left = drawing.createElementNS(svgNS,"path");
		left.setAttribute("id",id+"_lock_stile");
		left.setAttribute("d","M 0,0");
		left.setAttribute("class","frame");
		
		grp.appendChild(left);
	}
	
	path = "M %X%,%Y% l 0,%HL% l %F%,0 l 0,-%HL% l -%F%,0";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%HL%/g,h);
	path=path.replace(/%HS%/g,hs);
	path=path.replace(/%F%/g,f);
	left.setAttribute("d",path);
	left.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		left.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H% ... %F% extrusion stock.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_lock_stile",desc);
	}
	
	// right
	var right = drawing.getElementById(id+"_handle_stile");
	if(right === null)
	{
		right = drawing.createElementNS(svgNS, "path");
		right.setAttribute("id",id+"_handle_stile");
		right.setAttribute("d","M 0,0");
		right.setAttribute("class","frame");
		
		grp.appendChild(right);
	}
	path = "M %X%,%Y% l 0,%HL% l -%F%,0 l 0,-%HL% l %F%,0";
	path=path.replace(/%X%/g,x+w);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%HL%/g,h);
	path=path.replace(/%HS%/g,hs);
	path=path.replace(/%F%/g,f);
	right.setAttribute("d",path);
	right.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		right.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H%  ... %F% extrusion stock.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_handle_stile",desc);
	
		desc = "WIDTH: %W% HEIGHT: %H% ... %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));

		createDescription(id,desc);
	}
}	
catch(e)
{
	alertUser("Exception:  initMitredFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+",'"+ color+"')");
	alertUser(e);
	trace(e);
}	
}


/**
 * Draw a sash frame (mitred).
 * 
 * @param id		String id
 * @param x			decimal x coordinate
 * @param y			decimal y coordinate
 * @param w			decimal width
 * @param h			decimal height
 * @param f			decimal side frame thickness
 * @param color		String web color code
 * @return
 */
function initMiteredSash(id, x, y, w, h, f, color)
{
try
{
trace("initMitredSash('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+",'"+ color+"')");

	var ws = w - (2*f);
	var hs = h - (2*f);
	var desc = "";
	var tn = g("f_tn") == "true";
	
	// sash group
	var grp = drawing.getElementById(id);
	if(grp == null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id);
		
		drawing.getElementById("window").appendChild(grp);
	}
	
	// top
	var top = drawing.getElementById(id+"_top_rail");
	if(top == null)
	{
		top = drawing.createElementNS(svgNS,"path");
		top.setAttribute("id",id+"_top_rail");
		top.setAttribute("class","frame");
		top.setAttribute("d","M 0,0");
		
		grp.appendChild(top);
	}
	var path = "M %X%,%Y% l %WL%,0 l -%F%,%F% l -%WS%,0 l -%F%,-%F%";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%WL%/g,w);
	path=path.replace(/%WS%/g,ws);
	path=path.replace(/%F%/g,f);
	top.setAttribute("d",path);
	top.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		top.setAttribute("class","frameTN");
	}
	else
	{	
		desc = "LENGTH: %W% ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_top_rail",desc);
	}
	
	// bottom
	var bot = drawing.getElementById(id+"_bottom");
	if(bot == null)
	{
		bot = drawing.createElementNS(svgNS ,"path");
		bot.setAttribute("id",id+"_bottom_rail");
		bot.setAttribute("d","M 0,0");
		bot.setAttribute("class","frame");
		
		grp.appendChild(bot);
	}
	path = "M %X%,%Y% l %WL%,0 l -%F%,-%F% l -%WS%,0 l -%F%,%F%";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y+h);
	path=path.replace(/%WL%/g,w);
	path=path.replace(/%WS%/g,ws);
	path=path.replace(/%F%/g,f);
	bot.setAttribute("d",path);
	bot.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		bot.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %W% ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_bottom_rail",desc);
	}
	
	// left
	var left = drawing.getElementById(id+"_left_stile");
	if(left == null)
	{
		left = drawing.createElementNS(svgNS,"path");
		left.setAttribute("id",id+"_left_stile");
		left.setAttribute("d","M 0,0");
		left.setAttribute("class","frame");
		
		grp.appendChild(left);
	}
	
	path = "M %X%,%Y% l 0,%HL% l %F%,-%F% l 0,-%HS% l -%F%,-%F%";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%HL%/g,h);
	path=path.replace(/%HS%/g,hs);
	path=path.replace(/%F%/g,f);
	left.setAttribute("d",path);
	left.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		left.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H% ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_left_stile",desc);
	}
	
	// right
	var right = drawing.getElementById(id+"_right_stile");
	if(right == null)
	{
		right = drawing.createElementNS(svgNS, "path");
		right.setAttribute("id",id+"_right_stile");
		right.setAttribute("d","M 0,0");
		right.setAttribute("class","frame");
		
		grp.appendChild(right);
		trace("right created");
	}
	path = "M %X%,%Y% l 0,%HL% l -%F%,-%F% l 0,-%HS% l %F%,-%F%";
	path=path.replace(/%X%/g,x+w);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%HL%/g,h);
	path=path.replace(/%HS%/g,hs);
	path=path.replace(/%F%/g,f);
	right.setAttribute("d",path);
	trace("right path="+path);

	right.getStyle().setProperty("fill",color,"");
	trace("right color="+color);
	
	if(tn)
	{
		right.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H%  ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_right_stile",desc);
	
		desc = "WIDTH: %W% HEIGHT: %H% ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));

		createDescription(id,desc);
	}
}	
catch(e)
{
	alertUser("Exception:  initMitredSash('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+",'"+ color+"')");
	alertUser(e);
	trace(e);
}	
} 


/**
 * Draw a sash frame (non-mitred).
 * 
 * @param id		String id
 * @param x			decimal x coordinate
 * @param y			decimal y coordinate
 * @param w			decimal width
 * @param h			decimal height
 * @param f			decimal side frame thickness
 * @param color		String web color code
 * @return
 */
function initNonMiteredSash(id, x, y, w, h, f, color)
{
try
{
trace("initNonMiteredSash('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+",'"+ color+"')");

	var ws = w - (2*f);
	var hs = h - (2*f);
	var desc = "";
	var tn = g("f_tn") == "true";

	
	// frame group
	var grp = drawing.getElementById(id);
	if(grp == null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id);
		
		drawing.getElementById("window").appendChild(grp);
	}
	
	// top
	var top = drawing.getElementById(id+"_lock_rail");
	if(top === null)
	{
		top = drawing.createElementNS(svgNS,"path");
		top.setAttribute("id",id+"_lock_rail");
		top.setAttribute("class","frame");
		top.setAttribute("d","M 0,0");
		
		grp.appendChild(top);
	}
	var path = "M %X%,%Y% l %WS%,0 l 0,%F% l -%WS%,0 l 0,-%F%";
	path=path.replace(/%X%/g,x+f);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%WL%/g,w);
	path=path.replace(/%WS%/g,ws);
	path=path.replace(/%F%/g,f);
	top.setAttribute("d",path);
	top.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		top.setAttribute("class","frameTN");
	}
	else
	{	
		desc = "LENGTH: %W% ... %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_lock_rail",desc);
	}

	// bottom
	var bot = drawing.getElementById(id+"_handle_rail");
	if(bot === null)
	{
		bot = drawing.createElementNS(svgNS ,"path");
		bot.setAttribute("id",id+"_handle_rail");
		bot.setAttribute("d","M 0,0");
		bot.setAttribute("class","frame");
		
		grp.appendChild(bot);
	}
	path = "M %X%,%Y% l %WS%,0 l 0,-%F% l -%WS%,0 l 0,%F%";
	path=path.replace(/%X%/g,x+f);
	path=path.replace(/%Y%/g,y+h);
	path=path.replace(/%WL%/g,w);
	path=path.replace(/%WS%/g,ws);
	path=path.replace(/%F%/g,f);
	bot.setAttribute("d",path);
	bot.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		bot.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %W% ... %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_handle_rail",desc);
	}
	
	// left
	var left = drawing.getElementById(id+"_left_stile");
	if(left === null)
	{
		left = drawing.createElementNS(svgNS,"path");
		left.setAttribute("id",id+"_left_stile");
		left.setAttribute("d","M 0,0");
		left.setAttribute("class","frame");
		
		grp.appendChild(left);
	}
	
	path = "M %X%,%Y% l 0,%HL% l %F%,0 l 0,-%HL% l -%F%,0";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%HL%/g,h);
	path=path.replace(/%HS%/g,hs);
	path=path.replace(/%F%/g,f);
	left.setAttribute("d",path);
	left.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		left.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H% ... %F% extrusion stock.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_left_stile",desc);
	}
	
	// right
	var right = drawing.getElementById(id+"_right_stile");
	if(right === null)
	{
		right = drawing.createElementNS(svgNS, "path");
		right.setAttribute("id",id+"_right_stile");
		right.setAttribute("d","M 0,0");
		right.setAttribute("class","frame");
		
		grp.appendChild(right);
	}
	path = "M %X%,%Y% l 0,%HL% l -%F%,0 l 0,-%HL% l %F%,0";
	path=path.replace(/%X%/g,x+w);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%HL%/g,h);
	path=path.replace(/%HS%/g,hs);
	path=path.replace(/%F%/g,f);
	right.setAttribute("d",path);
	right.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		right.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H%  ... %F% extrusion stock.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_right_stile",desc);
	
		desc = "WIDTH: %W% HEIGHT: %H% ... %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));

		createDescription(id,desc);
	}

}	
catch(e)
{
	alertUser("Exception:  initNonMitredFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+",'"+ color+"')");
	alertUser(e);
	trace(e);
}	
} 



/**
 * Draw a mitred frame.
 * 
 * @param id	String id
 * @param x		decimal x coordinate
 * @param y		decimal y coordinate
 * @param w		decimal width
 * @param h		decimal height
 * @param f		decimal frame thickness
 * @param color	String web color code
 * @return
 */
function initMitredFrame(id, x, y, w, h, f, color)
{
try
{
trace("initMitredFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+",'"+ color+"')");

	var ws = w - (2*f);
	var hs = h - (2*f);
	var desc = "";
	var tn = g("f_tn") == "true";
	// frame group
	var grp = drawing.getElementById(id);
	if(grp == null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id);
		
		drawing.getElementById("window").appendChild(grp);
	}
	
	// top
	var top = drawing.getElementById(id+"_top");
	if(top == null)
	{
		top = drawing.createElementNS(svgNS,"path");
		top.setAttribute("id",id+"_top");
		top.setAttribute("class","frame");
		top.setAttribute("d","M 0,0");
		
		grp.appendChild(top);
	}
	var path = "M %X%,%Y% l %WL%,0 l -%F%,%F% l -%WS%,0 l -%F%,-%F%";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%WL%/g,w);
	path=path.replace(/%WS%/g,ws);
	path=path.replace(/%F%/g,f);
	top.setAttribute("d",path);
	top.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		top.setAttribute("class","frameTN");
	}
	else
	{	
		desc = "LENGTH: %W% ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_top",desc);
	}
	
	// bottom
	var bot = drawing.getElementById(id+"_bottom");
	if(bot == null)
	{
		bot = drawing.createElementNS(svgNS ,"path");
		bot.setAttribute("id",id+"_bottom");
		bot.setAttribute("d","M 0,0");
		bot.setAttribute("class","frame");
		
		grp.appendChild(bot);
	}
	path = "M %X%,%Y% l %WL%,0 l -%F%,-%F% l -%WS%,0 l -%F%,%F%";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y+h);
	path=path.replace(/%WL%/g,w);
	path=path.replace(/%WS%/g,ws);
	path=path.replace(/%F%/g,f);
	bot.setAttribute("d",path);
	bot.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		bot.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %W% ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_bottom",desc);
	}
	
	// left
	var left = drawing.getElementById(id+"_left");
	if(left == null)
	{
		left = drawing.createElementNS(svgNS,"path");
		left.setAttribute("id",id+"_left");
		left.setAttribute("d","M 0,0");
		left.setAttribute("class","frame");
		
		grp.appendChild(left);
	}
	
	path = "M %X%,%Y% l 0,%HL% l %F%,-%F% l 0,-%HS% l -%F%,-%F%";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%HL%/g,h);
	path=path.replace(/%HS%/g,hs);
	path=path.replace(/%F%/g,f);
	left.setAttribute("d",path);
	left.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		left.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H% ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_left",desc);
	}
	
	// right
	var right = drawing.getElementById(id+"_right");
	if(right == null)
	{
		right = drawing.createElementNS(svgNS, "path");
		right.setAttribute("id",id+"_right");
		right.setAttribute("d","M 0,0");
		right.setAttribute("class","frame");
		
		grp.appendChild(right);
	}
	path = "M %X%,%Y% l 0,%HL% l -%F%,-%F% l 0,-%HS% l %F%,-%F%";
	path=path.replace(/%X%/g,x+w);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%HL%/g,h);
	path=path.replace(/%HS%/g,hs);
	path=path.replace(/%F%/g,f);
	right.setAttribute("d",path);
	right.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		right.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H%  ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));
		createDescription(id+"_right",desc);
	
		desc = "WIDTH: %W% HEIGHT: %H% ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(f));

		createDescription(id,desc);
	//	grp.setAttribute("onmousedown","showDescription(evt,true)");
	//	grp.setAttribute("onmouseup","showDescription(evt,false)");
	}
}	
catch(e)
{
	alertUser("Exception:  initMitredFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+",'"+ color+"')");
	alertUser(e);
	trace(e);
}	
} 

/**
 * Draw a 3-sided door frame (mitred).
 * 
 * @param id	String id
 * @param x		decimal x coordinate
 * @param y		decimal y coordinate
 * @param w		decimal width
 * @param h		decimal height
 * @param fTop		decimal frame thickness at top
 * @param fSide		decimal frame thickness on the sides
 * @param color	String web color code
 * @return
 */
function initDoorNoThresholdMitredFrame(id, x, y, w, h, fTop, fSide, color)
{
try
{
trace("initDoorNoThresholdMitredFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ fTop+","+fSide+",'"+ color+"')");

	var ws = w - (2*fSide);
	var hs = h - fTop;
	var desc = "";
	var tn = g("f_tn") == "true";
	// frame group
	var grp = drawing.getElementById(id);
	if(grp == null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id);
		
		drawing.getElementById("window").appendChild(grp);
	}
	
	// top
	var top = drawing.getElementById(id+"_top");
	if(top == null)
	{
		top = drawing.createElementNS(svgNS,"path");
		top.setAttribute("id",id+"_top");
		top.setAttribute("class","frame");
		
		grp.appendChild(top);
	}
	var path = "M %X%,%Y% l %WL%,0 l -%F%,%FT% l -%WS%,0 M %X%,%Y%";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%WL%/g,w);
	path=path.replace(/%WS%/g,ws);
	path=path.replace(/%F%/g,fSide);
	path=path.replace(/%FT%/g,fTop);
	top.setAttribute("d",path);
	top.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		top.setAttribute("class","frameTN");
	}
	else
	{	
		desc = "LENGTH: %W% ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%F%/g,getDim(fTop));
		createDescription(id+"_top",desc);
	}
	
	// left
	var left = drawing.getElementById(id+"_left");
	if(left == null)
	{
		left = drawing.createElementNS(svgNS,"path");
		left.setAttribute("id",id+"_left");
		left.setAttribute("d","M 0,0");
		left.setAttribute("class","frame");
		
		grp.appendChild(left);
	}
	
	path = "M %X%,%Y% l 0,%HL% l %FS%,0 l 0,-%HS% L %X%,%Y%";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%HL%/g,h);
	path=path.replace(/%HS%/g,hs);
	path=path.replace(/%FS%/g,fSide);
	left.setAttribute("d",path);
	left.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		left.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H% ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(fSide));
		createDescription(id+"_left",desc);
	}
	
	// right
	var right = drawing.getElementById(id+"_right");
	if(right == null)
	{
		right = drawing.createElementNS(svgNS, "path");
		right.setAttribute("id",id+"_right");
		right.setAttribute("class","frame");
		
		grp.appendChild(right);
	}
	path = "M %X%,%Y% l 0,%HL% l -%FS%,0 l 0,-%HS% L %X%,%Y%";
	path=path.replace(/%X%/g,x+w);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%HL%/g,h);
	path=path.replace(/%HS%/g,hs);
	path=path.replace(/%FS%/g,fSide);
	right.setAttribute("d",path);
	right.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		right.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H%  ... Mitred 45% %F% extrusion stock.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%F%/g,getDim(fSide));
		createDescription(id+"_right",desc);
	
		desc = "WIDTH: %W% HEIGHT: %H%.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%H%/g,getDim(h));

		createDescription(id,desc);
	//	grp.setAttribute("onmousedown","showDescription(evt,true)");
	//	grp.setAttribute("onmouseup","showDescription(evt,false)");
	}
}	
catch(e)
{
	alertUser("Exception:  initDoorNoThresholdMitredFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ fTop+","+fSide+",'"+ color+"')");
	alertUser(e);
	trace(e);
}	
}



//Perimeter
//Double Perimeter
//Heritage
//Double Heritage
//Empress
function drawPerm(rectName,gridElName,color,tt,redraw)
{
trace("drawPerm('"+ rectName+"','"+gridElName+"','"+color+"',"+tt+")");
try{
var t = tt-0;
var blnDebug = "false";
var ser = gN("ser");
var idPrefix = g("f_idprefix");
var redrawScript = 	"drawPerm('%ID%','"+gridElName+"','"+color+"',"+tt+",true)";

//Top Right Left Bottom grids
var	left = gN("f_"+gridElName+"l");
var	right = gN("f_"+gridElName+"r");
var	top = gN("f_"+gridElName+"t");
var	bottom = gN("f_"+gridElName+"b");

//Vertical and Horz Side Bars - //side bars used for double heritage and single heritage
var	SideBarsL = gN("f_"+gridElName+"Sl");
var	SideBarsR = gN("f_"+gridElName+"Sr"); 
var	SideBarsT = gN("f_"+gridElName+"St");
var	SideBarsB = gN("f_"+gridElName+"Sb");
trace("t="+top+" b="+bottom+" l="+left +" r=" +right);

//Seperation to first grid.....Edge of glass to mid point of grid
var sep = gN("f_"+gridElName+"sep");
var sep2 = gN("f_"+gridElName+"sep2");
var sep3 = gN("f_"+gridElName+"sep3");
if(sep === 0)
{
	sep = gN("grid_sep");
	if(ser == 1000)
		{
		sep = inchesToMM(6);
		}
	else	
	if(sep === 0)
		{
		sep = inchesToMM(3.5);
		}
}
//Seperation to second grid from first grid....Mid point to mid point
if(sep2 === 0)
{
	sep2 = gN("grid_space");
	if(sep2 === 0)
	{
		sep2 =  inchesToMM(2.5);
	}
}
sep2 = sep + sep2;
//Third sep for Empress Grills
if(sep3 === 0)
{
	sep3 = gN("grid_space");
	if(sep3 === 0)
	{
		sep3 = inchesToMM(2.5);
	}
}
sep3 = sep2 + sep3;

var nVert = 0;
var nHorz = top + bottom + 1;
if (SideBarsL > SideBarsR)
    nHorz = nHorz + SideBarsL;
else
    nHorz = nHorz + SideBarsR;
    
var desc,grp,ins,punchX,punchY;
	
	var rect = drawing.getElementById(rectName);
	if(rect === null)
	{
		trace("drawGrid() failed because " + rectName + " does not exist.");
		return;
	}
	
	var x = rect.getAttribute("x") - 0;
	var y = rect.getAttribute("y") - 0;
	var h = rect.getAttribute("height") - 0;
	var w = rect.getAttribute("width") - 0;
	var eLite;
	if(applet && !redraw)
	{
			applet.registerLite(idPrefix+rectName,x+"",y+"",w+"",h+"",redrawScript);
			elLite = drawing.getElementById(rectName);
			if(elLite !== null)
			{
				elLite.setAttribute("onmousemove","drag(evt)");							 	
				elLite.setAttribute("onmouseup","drop(evt)");
			}							 	
	}
	
	var nLeft = 1;
	var window = drawing.getElementById("window");
	createClipPattern(rectName);
	grp = drawing.getElementById(gridElName);
	
	if(grp === null)
	{
				grp = drawing.createElementNS(svgNS,"g");
				grp.setAttribute("id",gridElName);
				grp.getStyle().setProperty("clip-path","url(#"+idPrefix+"clip_"+rectName+")","");

				ins = rect.nextSibling;
				if(ins === null)
				{
					window.appendChild(grp);
				}
				else
				{
					ins.parentNode.insertBefore(grp,ins);
				}
	}
	var glName,glVarName,gl,glExists;
	for(;nLeft <= left;nLeft++)
	{
		nVert++;
		glName = (redraw?idPrefix:"")+gridElName+"h" + nVert;
		glVarName = gridElName+"h" + nVert;
		gl = drawing.getElementById(glName);
		glExists = true;
		if(gl === null)
		{
			glExists = false;
			gl = drawing.createElementNS(svgNS,"rect");
			gl.setAttribute("id",glName);
			gl.setAttribute("class","grid");
			gl.setAttribute("width",t);
			
			gl.setAttribute("onmousedown","startDragX(evt)");							 	
			gl.setAttribute("onmousemove","drag(evt)");							 	
			gl.setAttribute("onmouseup","drop(evt)");	
	 		gl.setAttribute("onmouseout","evt.stopPropagation()");
		}
		punchX =  gN(glVarName);
		if(punchX === 0)
		{
			if (nLeft == 1)
			{
				punchX = sep;
			}
			else
			{
				punchX = sep2;
			}
			punchX = roundTo(punchX,roundingFactor);
		}
		gl.getStyle().setProperty("fill",color,"");
		
		gl.setAttribute("x",x + punchX - (t/2)); 
		gl.setAttribute("y",y);
		gl.setAttribute("height",h);
		if(!redraw && applet)
		{
			applet.registerVertElement(	idPrefix+glName,
										idPrefix+rectName,
										(x + punchX - (t/2)) +"", 	
										t + "",
										"s(\""+glVarName+"\",%X%)");
			// return point
			applet.registerVertElement(	idPrefix,
										"",
										(x + punchX - (t/2)) +"", 	
										t + "",
										null);
										
										
		}
		if(!glExists)
		{
			grp.appendChild(gl);
		}
		desc = "LENGTH: %H%  PUNCH: %P%.";
		desc = desc.replace(/%H%/g,getDim(gridLen(rectName, glName)));
		desc = desc.replace(/%P%/g,getDim(punchX));
			
		s(glVarName,punchX);
		createDescription(glName,desc);
	}
	var lastLeftBar = punchX;  //Save the last bottom bars y postion to calc side bars
	var grName,grVarName,gr,grExists;
	var nRight = 1;
	var iAdd = 0;
	for(;nRight <= right;nRight++)
	{
		nVert++;
		if (SideBarsT > SideBarsB)
		    iAdd = SideBarsT + nVert;
		else
		    iAdd = SideBarsB + nVert;

		if (right == 2 && nRight == 1)
		    iAdd = iAdd + 1;
		else if (right == 2 && nRight == 2)
		    iAdd = iAdd - 1;
  
		grName = (redraw ? idPrefix : "") + gridElName + "h" + iAdd;
		grVarName = gridElName+"h" + iAdd;
		gr = drawing.getElementById(grName);
		grExists = true;
		if(gr === null)
		{
			grExists = false;
			gr = drawing.createElementNS(svgNS,"rect");
			gr.setAttribute("id",grName);
			gr.setAttribute("class","grid");
			gr.setAttribute("width",t);
			
			gr.setAttribute("onmousedown","startDragX(evt)");							 	
			gr.setAttribute("onmousemove","drag(evt)");							 	
			gr.setAttribute("onmouseup","drop(evt)");	
	 		gr.setAttribute("onmouseout","evt.stopPropagation()");
		}
		punchX =  gN(grVarName);
		if(punchX === 0)
		{
			if (nRight == 1)
			{
				punchX = w - sep;
			}
			else
			{
				punchX = w - sep2;
			}
		}
		punchX = roundTo(punchX,roundingFactor);

		gr.getStyle().setProperty("fill",color,"");
		
		gr.setAttribute("x",x + punchX - (t/2)); 
		gr.setAttribute("y",y);
		gr.setAttribute("height",h);
		if(!redraw && applet)
		{
			applet.registerVertElement(	idPrefix+grName,
										idPrefix+rectName,
										(x + punchX - (t/2)) +"", 	
										t + "",
										"s(\""+grVarName+"\",%X%)");
			// return point
			applet.registerVertElement(	idPrefix,
										"",
										(x + punchX - (t/2)) +"", 	
										t + "",
										null);				
		}
		if(!grExists)
		{
			grp.appendChild(gr);
		}
		desc = "LENGTH: %H%  PUNCH: %P%.";
		desc = desc.replace(/%H%/g,getDim(gridLen(rectName, grName)));
		desc = desc.replace(/%P%/g,getDim(punchX));
			
		s(grVarName,punchX);
		createDescription(grName,desc);
	}
	var lastRightBar = punchX;  //Save the last bottom bars y postion to calc side bars
	
	var gtName,gtVarName,gt,gtExists;
	var nTop = 1;
	for(;nTop <= top;nTop++)
	{	
		nHorz--;
		gtName = (redraw ? idPrefix : "") + gridElName + "v" + nHorz;	
		gtVarName = gridElName+"v"+nHorz;	
		gt = drawing.getElementById(gtName);
		gtExists = true;
		if(gt === null)
		{
			gtExists = false;
			gt = drawing.createElementNS(svgNS,"rect");
			gt.setAttribute("id",gtName);
			gt.setAttribute("class","grid");
			gt.setAttribute("height",t);
			
			gt.setAttribute("onmousedown","startDragY(evt)");							 	
 			gt.setAttribute("onmousemove","drag(evt)");							 	
 			gt.setAttribute("onmouseup","drop(evt)");
	 		gt.setAttribute("onmouseout","evt.stopPropagation()");	
		}
		punchY =  gN(gtVarName);

		if(punchY === 0)
		{
			if (nTop == 1)
			{
				punchY = h - sep;
			}
			else if(nTop ==2)
			{
				punchY = h - sep2;
			}
			else
			{
				punchY = h - sep3;
			}
			punchY = roundTo(punchY,roundingFactor);

		}
		
		gt.getStyle().setProperty("fill",color,"");
		gt.setAttribute("x",x); 
		gt.setAttribute("y",y + (h - punchY - (t/2)));
		gt.setAttribute("width",w);
		
		if(!redraw && applet)
		{
			applet.registerHorzElement( idPrefix+gtName,
										idPrefix+rectName,
										(y + (h - punchY - (t/2))) +"", 	
										t + "",
										"s(\""+gtVarName+"\","+h+"-%Y%)");
			// return point
			applet.registerHorzElement( idPrefix,
										"",
										(y + (h - punchY - (t/2))) +"", 	
										t + "",
										null);
		}
		
		if(!gtExists)
		{
			grp = drawing.getElementById(gridElName);
			if(grp === null)
			{
				grp = drawing.createElementNS(svgNS,"g");
				grp.setAttribute("id",gridElName);
			
				ins = rect.nextSibling;
				if(ins === null)
				{
					window.appendChild(grp);
				}
				else
				{
					ins.parentNode.insertBefore(grp,ins);
				}
			}
			grp.appendChild(gt);
		}
		desc = "LENGTH: %W%  PUNCH: %P%.";
		desc = desc.replace(/%W%/g,getDim(gridLen(rectName, gtName)));
		desc = desc.replace(/%P%/g,getDim(punchY));
		s(gtVarName,punchY);
		createDescription(gtName,desc);
	}
	var LastTopbar = punchY;  //Save the last bottom bars y postion to calc side bars
	var LastTopBarNum = nHorz; //Last top bar drawn
	var gbName,gbVarName,gb,gbExists;
	var nBottom = 1;
	iAdd = 0;
	for(;nBottom <= bottom;nBottom++)
	{
	    iAdd++;
		nHorz--;
		gbName = (redraw?idPrefix:"")+gridElName+"v"+iAdd;	
		gbVarName = gridElName+"v"+iAdd;	
		gb = drawing.getElementById(gbName);
		gbExists = true;
		if(gb === null)
		{
			gbExists = false;
			gb = drawing.createElementNS(svgNS,"rect");
			gb.setAttribute("id",gbName);
			gb.setAttribute("class","grid");
			gb.setAttribute("height",t);
			
			gb.setAttribute("onmousedown","startDragY(evt)");							 	
 			gb.setAttribute("onmousemove","drag(evt)");							 	
 			gb.setAttribute("onmouseup","drop(evt)");
	 		gb.setAttribute("onmouseout","evt.stopPropagation()");	
		}
		punchY =  gN(gbVarName);

		if(punchY === 0)
		{
			if (nBottom == 1)
			{
				punchY = sep;
			}
			else
			{
				punchY = sep2;
			}
      punchY = roundTo(punchY,roundingFactor);
		}
		
		gb.getStyle().setProperty("fill",color,"");
		gb.setAttribute("x",x); 
		gb.setAttribute("y",(y + (h - punchY - (t/2))));
		gb.setAttribute("width",w);
		
		if(!redraw && applet)
		{
			applet.registerHorzElement( idPrefix+gbName,
										idPrefix+rectName,
										(y + (h - punchY - (t/2))) +"", 	
										t + "",
										"s(\""+gbVarName+"\","+h+"-%Y%)");
			// return point
			applet.registerHorzElement( idPrefix,
										"",
										(y + (h - punchY - (t/2))) +"", 	
										t + "",
										null);
		}
		
		if(!gbExists)
		{
			grp = drawing.getElementById(gridElName);
			if(grp === null)
			{
				grp = drawing.createElementNS(svgNS,"g");
				grp.setAttribute("id",gridElName);
			
				ins = rect.nextSibling;
				if(ins === null)
				{
					window.appendChild(grp);
				}
				else
				{
					ins.parentNode.insertBefore(grp,ins);
				}
			}
			grp.appendChild(gb);
		}
		desc = "LENGTH: %W%  PUNCH: %P%.";
		desc = desc.replace(/%W%/g,getDim(gridLen(rectName, gbName)));
		desc = desc.replace(/%P%/g,getDim(punchY));
		s(gbVarName,punchY);
		createDescription(gbName,desc);		
	}
	var LastBotbar = punchY;  //Save the last bottom bars y postion to calc side bars


//Add Side bars if needed	
	var nSideBars = 1;
 
	nHorz = bottom+top+1+(SideBarsL + SideBarsR);
	var i = 1; var y1 = 0; var y2 = 0;
	
	var sTotDistance,sTotGrid,sTemp,sGlass;
	if (SideBarsL == 2)
	{
		sTotDistance = h;
		sTotGrid = 0;
		sTemp = sTotDistance - sTotGrid;
		sGlass = sTemp/3;
		
		y1 = sGlass;
		y2 = y1 + sGlass;
	}
	else if (SideBarsL == 1)
	{
		y1 = h/2;
	}
	var gsName,gsVarName,gs,gsExists;

	if (SideBarsL == 2)
	    iAdd = LastTopBarNum - 3;
	else
	    iAdd = LastTopBarNum - 2;
	//Left side bars
	var vPunches = false;
	for(;nSideBars <= SideBarsL;nSideBars++)
	{
		nHorz--;
		iAdd++;
		vPunches = true;
		gsName = (redraw?idPrefix:"")+gridElName+"v"+iAdd;	
		gsVarName = gridElName+"v"+iAdd;	
		gs = drawing.getElementById(gsName);
		gsExists = true;
		if(gs === null)
		{
			gsExists = false;
			gs = drawing.createElementNS(svgNS,"rect");
			gs.setAttribute("id",gsName);
			gs.setAttribute("class","grid");
			gs.setAttribute("height",t);
			
			gs.setAttribute("onmousedown","startDragY(evt)");							 	
			gs.setAttribute("onmousemove","drag(evt)");							 	
			gs.setAttribute("onmouseup","drop(evt)");
			gs.setAttribute("onmouseout","evt.stopPropagation()");	
		}
		
		//Y-int
		punchY =  gN(gsVarName);
		if(punchY === 0)
		{
			if (SideBarsL == 2)
			{
				if (nSideBars == 1)
				{
					punchY = y1;
				}
				else if (nSideBars == 2)
				{
					punchY = y2;
				}
			}
			else if (SideBarsL == 1)
			{
				punchY = y1;
			}
      punchY = roundTo(punchY,roundingFactor);
		}
			
		gs.getStyle().setProperty("fill",color,"");
		gs.setAttribute("y",y + h - punchY - (t/2));
		gs.setAttribute("x",x);

		if (left == 1)
		{
			gs.setAttribute("width",sep);
		}
		else if (left == 2)
			{
        gs.setAttribute("width",sep2);
			}
		if(!redraw && applet)
		{
			applet.registerHorzElement( idPrefix+gsName,
										idPrefix+rectName,
										(y + h - punchY - (t/2)) +"", 	
										t + "",
										"s(\""+gsVarName+"\","+h+"-%Y%)");
			// return point
			applet.registerHorzElement( idPrefix,
										"",
										(y + h - punchY - (t/2)) +"", 	
										t + "",
										null);
		}
		
		if(!gsExists)
		{
			grp = drawing.getElementById(gridElName);
			if(grp === null)
			{
				grp = drawing.createElementNS(svgNS,"g");
				grp.setAttribute("id",gridElName);
			
				ins = rect.nextSibling;
				if(ins === null)
				{
					window.appendChild(grp);
				}
				else
				{
					ins.parentNode.insertBefore(grp,ins);
				}
			}
			grp.appendChild(gs);
		}
			desc = "LENGTH: %W%  PUNCH: %P%.";
		desc = desc.replace(/%W%/g,getDim(gridLen(rectName, gsName)));
			desc = desc.replace(/%P%/g,getDim(punchY));
			s(gsVarName,punchY);
			createDescription(gsName,desc);
	}//nSideBars++
	
	
	
	nSideBars = 1;
	if (SideBarsR == 2)
	{
		sTotDistance = h;
		sTotGrid = 0;
		sTemp = sTotDistance - sTotGrid;
		sGlass = sTemp/3;
		
		y1 = sGlass;
		y2 = y1 + sGlass;
	}
	else if (SideBarsR == 1)
	{
		y1 = h/2;
	}	
	//right side bars
	if (SideBarsR == 2)
	    iAdd = LastTopBarNum - 3;
	else
	    iAdd = LastTopBarNum - 2;
	    	
	for(;nSideBars <= SideBarsR;nSideBars++)
	{
	    nHorz--;
	    iAdd++;
		if (vPunches == true) {
		    gsName = (redraw ? idPrefix : "") + gridElName + "vs" + iAdd; ;
		    gsVarName = gridElName + "vs" + iAdd;
		}
		else {
		    gsName = (redraw ? idPrefix : "") + gridElName + "v" + iAdd;
		    gsVarName = gridElName + "v" + iAdd;		
		}	
		gs = drawing.getElementById(gsName);
		gsExists = true;
		if(gs === null)
		{
			gsExists = false;
			gs = drawing.createElementNS(svgNS,"rect");
			gs.setAttribute("id",gsName);
			gs.setAttribute("class","grid");
			gs.setAttribute("height",t);
			
			gs.setAttribute("onmousedown","startDragY(evt)");							 	
			gs.setAttribute("onmousemove","drag(evt)");							 	
			gs.setAttribute("onmouseup","drop(evt)");
			gs.setAttribute("onmouseout","evt.stopPropagation()");	
		}
		
		//Y-int
		punchY =  gN(gsVarName);
		if(punchY === 0)
		{
			if (SideBarsR == 2)
			{
				if (nSideBars == 1)
				{
					punchY = y1;
				}
				else if (nSideBars == 2)
				{
					punchY = y2;
				}
			}
			else if (SideBarsR == 1)
			{
				punchY = y1;
			}
      punchY = roundTo(punchY,roundingFactor);
		}
		
		gs.getStyle().setProperty("fill",color,"");
		gs.setAttribute("y",y + h - punchY - (t/2));
		

		if (right == 1)
		{		
			gs.setAttribute("width",w - sep);
			gs.setAttribute("x",x + w - sep);
		}
		else if (right == 2)
		{
			gs.setAttribute("width",w - sep2);
			gs.setAttribute("x",x + w - sep2);
		}	
		if(!redraw && applet)
		{
			applet.registerHorzElement( idPrefix+gsName,
										idPrefix+rectName,
										(y + h - punchY - (t/2)) +"", 	
										t + "",
										"s(\""+gsVarName+"\","+h+"-%Y%)");
			// return point
			applet.registerHorzElement( idPrefix,
										"",
										(y + h - punchY - (t/2)) +"", 	
										t + "",
										null);
		}
		
		if(!gsExists)
		{
			grp = drawing.getElementById(gridElName);
			if(grp === null)
			{
				grp = drawing.createElementNS(svgNS,"g");
				grp.setAttribute("id",gridElName);
			
				ins = rect.nextSibling;
				if(ins === null)
				{
					window.appendChild(grp);
				}
				else
				{
					ins.parentNode.insertBefore(grp,ins);
				}
			}
			grp.appendChild(gs);
		}
			desc = "LENGTH: %W%  PUNCH: %P%.";
      desc = desc.replace(/%W%/g,getDim(gridLen(rectName, gsName)));
			desc = desc.replace(/%P%/g,getDim(punchY));
			s(gsVarName,punchY);
			createDescription(gsName,desc);
	}//nSideBars++


	
	nSideBars = 1;
	if (SideBarsT == 2)
	{
		sTotDistance = w;
		sTotGrid = 0;
		sTemp = sTotDistance - sTotGrid;
		sGlass = sTemp/3;
		
		y1 = sGlass;
		y2 = y1 + sGlass;
	}
	else if (SideBarsT == 1)
	{
		y1 = w/2;
	}	
	//top side bars
	iAdd = 0;
	tVert = nVert;
	var sPunches = false;
	for(;nSideBars <= SideBarsT;nSideBars++)
	{
		nVert++;
		iAdd = nVert - right;
		sPunches = true;
		gsName = (redraw ? idPrefix : "") + gridElName + "h" + iAdd;
	    gsVarName = gridElName + "h" + iAdd;	
		gs = drawing.getElementById(gsName);
		gsExists = true;
		if(gs === null)
		{
			gsExists = false;
			gs = drawing.createElementNS(svgNS,"rect");
			gs.setAttribute("id",gsName);
			gs.setAttribute("class","grid");
			gs.setAttribute("width",t);
			
			gs.setAttribute("onmousedown","startDragX(evt)");							 	
			gs.setAttribute("onmousemove","drag(evt)");							 	
			gs.setAttribute("onmouseup","drop(evt)");	
	 		gs.setAttribute("onmouseout","evt.stopPropagation()");
		}
		
		//Y-int
		punchX =  gN(gsVarName);
		if(punchX === 0)
		{
			if (SideBarsT == 2)
			{
				if (nSideBars == 1)
				{
					punchX = y1;
				}
				else if (nSideBars == 2)
				{
					punchX = y2;
				}
			}
			else if (SideBarsT == 1)
			{
				punchX = y1;
			}
			punchX = roundTo(punchX,roundingFactor);
		}

		
		gs.getStyle().setProperty("fill",color,"");
		gs.setAttribute("x",x + punchX - (t/2));
		gs.setAttribute("width", t);

		if (top == 1)
		{		
			gs.setAttribute("height",sep);
			gs.setAttribute("y",y);
		}
		else if (top == 2)
		{
			gs.setAttribute("height",sep2);
			gs.setAttribute("y",y);
		}	
		else if (top == 3)
		{
			gs.setAttribute("height",sep3);
			gs.setAttribute("y",y);
		}			
		if(!redraw && applet)
		{
			
			applet.registerVertElement(	idPrefix+gsName,
										idPrefix+rectName,
										(x + punchX - (t/2)) +"", 	
										t + "",
										"s(\""+gsVarName+"\",%X%)");
			// return point
			applet.registerVertElement(	idPrefix,
										"",
										(x + punchX - (t/2)) +"", 	
										t + "",
										null);				
		}
		
		if(!gsExists)
		{
			grp = drawing.getElementById(gridElName);
			if(grp === null)
			{
				grp = drawing.createElementNS(svgNS,"g");
				grp.setAttribute("id",gridElName);
			
				ins = rect.nextSibling;
				if(ins === null)
				{
					window.appendChild(grp);
				}
				else
				{
					ins.parentNode.insertBefore(grp,ins);
				}
			}
			grp.appendChild(gs);
		}
			desc = "LENGTH: %W%  PUNCH: %P%.";
      desc = desc.replace(/%W%/g,getDim(gridLen(rectName, gsName)));
			desc = desc.replace(/%P%/g,getDim(punchX));
			s(gsVarName,punchX);
			createDescription(gsName,desc);
	}//nSideBars++
	

	nSideBars = 1;
	if (SideBarsB == 2)
	{
		sTotDistance = w;
		sTotGrid = 0;
		sTemp = sTotDistance - sTotGrid;
		sGlass = sTemp/3;
		
		y1 = sGlass;
		y2 = y1 + sGlass;
	}
	else if (SideBarsB == 1)
	{
		y1 = w/2;
	}	
	//bottom side bars
	nVert = tVert;
	for(;nSideBars <= SideBarsB;nSideBars++)
	{
	    nVert++;
	    iAdd = nVert - right;
	    if (sPunches == true) {
	        //Punches created on top
	        gsName = (redraw ? idPrefix : "") + gridElName + "bh" + iAdd;
	        gsVarName = gridElName + "bh" + iAdd;
	    }
	    else {
	        //only on bottom create punches
	        gsName = (redraw ? idPrefix : "") + gridElName + "h" + iAdd;
	        gsVarName = gridElName + "h" + iAdd;	        
	    }
		gs = drawing.getElementById(gsName);
		gsExists = true;
		if(gs === null)
		{
			gsExists = false;
			gs = drawing.createElementNS(svgNS,"rect");
			gs.setAttribute("id",gsName);
			gs.setAttribute("class","grid");
			gs.setAttribute("width",t);
			
			gs.setAttribute("onmousedown","startDragX(evt)");							 	
			gs.setAttribute("onmousemove","drag(evt)");							 	
			gs.setAttribute("onmouseup","drop(evt)");	
	 		gs.setAttribute("onmouseout","evt.stopPropagation()");
		}
		
		//Y-int
		punchX =  gN(gsVarName);
		if(punchX === 0)
		{
			if (SideBarsB == 2)
			{
				if (nSideBars == 1)
				{
					punchX = y1;
				}
				else if (nSideBars == 2)
				{
					punchX = y2;
				}
			}
			else if (SideBarsB == 1)
			{
				punchX = y1;
			}
			punchX = roundTo(punchX,roundingFactor);
		}
		
		gs.getStyle().setProperty("fill",color,"");
		gs.setAttribute("x",x + punchX - (t/2));
		gs.setAttribute("width", t);

		if (bottom == 1)
		{		
			gs.setAttribute("height",sep);
			gs.setAttribute("y",y + h - sep);
		}
		else if (bottom == 2)
		{
			gs.setAttribute("height",sep2);
			gs.setAttribute("y",y + h - sep2);
		}	
		if(!redraw && applet)
		{
			
			applet.registerVertElement(	idPrefix+gsName,
										idPrefix+rectName,
										(x + punchX - (t/2)) +"", 	
										t + "",
										"s(\""+gsVarName+"\",%X%)");
			// return point
			applet.registerVertElement(	idPrefix,
										"",
										(x + punchX - (t/2)) +"", 	
										t + "",
										null);				
		}
		
		if(!gsExists)
		{
			grp = drawing.getElementById(gridElName);
			if(grp === null)
			{
				grp = drawing.createElementNS(svgNS,"g");
				grp.setAttribute("id",gridElName);
			
				ins = rect.nextSibling;
				if(ins === null)
				{
					window.appendChild(grp);
				}
				else
				{
					ins.parentNode.insertBefore(grp,ins);
				}
			}
			grp.appendChild(gs);
		}
			desc = "LENGTH: %W%  PUNCH: %P%.";
		  desc = desc.replace(/%W%/g,getDim(gridLen(rectName, gsName)));
			desc = desc.replace(/%P%/g,getDim(punchX));
			s(gsVarName,punchX);
			createDescription(gsName,desc);
	}//nSideBars++


	
}catch(e)
{
	alertUser("Exception:  drawPerm('"+ rectName+"','"+gridElName+"','"+color+"',"+t+")");
	alertUser(e);
	trace(e);
}
}


function drawLadderGrid(rectName,gridElName,color,t,redraw)
{
trace("drawLadderGrid('"+ rectName+"','"+gridElName+"','"+color+"',"+t+")");
try{
var idPrefix = g("f_idprefix");
var redrawScript = 	"drawLadderGrid('%ID%','"+gridElName+"','"+color+"',"+t+",true)";
var	vert = gN("f_"+gridElName+"v");
var	horz = gN("f_"+gridElName+"h");
var	left = gN("f_"+gridElName+"l");
var	right = gN("f_"+gridElName+"r");
var	top = gN("f_"+gridElName+"t");
var	bottom = gN("f_"+gridElName+"b");

createClipPattern(rectName);
	
	var rect = drawing.getElementById(rectName);
	if(rect == null)
	{
		trace("drawLadderGrid() failed because " + rectName + " does not exist.");
		return;
	}
	
	
	var x = rect.getAttribute("x") - 0;
	var y = rect.getAttribute("y") - 0;
	var h = rect.getAttribute("height") - 0;
	var w = rect.getAttribute("width") - 0;
	if(applet && !redraw)
	{
			applet.registerLite(idPrefix+rectName,x+"",y+"",w+"",h+"",redrawScript);
			var elLite = drawing.getElementById(rectName);
			if(elLite != null)
			{
				elLite.setAttribute("onmousemove","drag(evt)");							 	
				elLite.setAttribute("onmouseup","drop(evt)");
			}							 	
	}
	

	var nVert = 1;
	var vSep = w/(vert+1);
	
	var nHorz = horz;
	var hSep = h/(horz+1);
	
	var window = drawing.getElementById("window");
	var grp = drawing.getElementById(gridElName);
	if(grp == null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",gridElName);
		grp.getStyle().setProperty("clip-path","url(#"+idPrefix+"clip_"+rectName+")","");

		var ins = rect.nextSibling;
		if(ins == null)
		{
			window.appendChild(grp);
		}
		else
		{
			ins.parentNode.insertBefore(grp,ins);
		}
	}

	//Vertical Grids
	var vCount = 0;
	for(;nVert <= vert;nVert++)
	{
	    vCount++;
		var gvName = (redraw?idPrefix:"")+gridElName+"h" + vCount;
		var gvVarName = gridElName + "h" + vCount;
		
		var gv = drawing.getElementById(gvName);
		var gvExists = true;
		if(gv == null)
		{
			gvExists = false;
			gv = drawing.createElementNS(svgNS,"rect");
			gv.setAttribute("id",gvName);
			gv.setAttribute("class","grid");
			gv.setAttribute("width",t);
			
			gv.setAttribute("onmousedown","startDragX(evt)");							 	
			gv.setAttribute("onmousemove","drag(evt)");							 	
			gv.setAttribute("onmouseup","drop(evt)");	
	 		gv.setAttribute("onmouseout","evt.stopPropagation()");
		}

		var punchX =  g(gvVarName);
		if(punchX == null || punchX == 0)
		{
			punchX = (nVert*vSep);
		}
		punchX = roundTo(punchX,roundingFactor);
		gv.getStyle().setProperty("fill",color,"");
		
		gv.setAttribute("x",x + punchX - (t/2)); 
		gv.setAttribute("y",y);

		//bars that go full height
		if (nVert == 1 && left != 0) {
		    gv.setAttribute("height", h);
		}
		else if (nVert == 2 && left == 2) {
		    gv.setAttribute("height", h);
		}
		else if (nVert == vert && right != 0) {
		    gv.setAttribute("height", h);
		}
		else if (nVert == vert - 1 && right == 2) {
		    gv.setAttribute("height", h);
		}
		//end bars that go full height
		else if (top == 0 && bottom == 0) {
		    vCount--;
		    continue;
		}
		//Partial Bars
		else
		{
		    if (top != 0 && bottom != 0) {
		        //just take punches from the top
		        var iCount = 1;
		        for (; iCount < 3; iCount++) {
		            if (iCount == 1) { //Top
		                if (top == 1) {
		                    gv.setAttribute("height", hSep);
		                }
		                else if (top == 2) {
		                    gv.setAttribute("height", hSep * 2);
		                }
		            }
		            else if (iCount == 2) { //Bottom 
		                gvName = (redraw ? idPrefix : "") + gridElName + "bh" + vCount; //rename to not create puch
		                gvVarName = gridElName + "bh" + vCount;                         //when both top and bottom exist       
		                gv = drawing.getElementById(gvName);
		                gvExists = true;
		                if (gv == null) {
		                    gvExists = false;
		                    gv = drawing.createElementNS(svgNS, "rect");
		                    gv.setAttribute("id", gvName);
		                    gv.setAttribute("class", "grid");
		                    gv.setAttribute("width", t);

		                    gv.setAttribute("onmousedown", "startDragX(evt)");
		                    gv.setAttribute("onmousemove", "drag(evt)");
		                    gv.setAttribute("onmouseup", "drop(evt)");
		                    gv.setAttribute("onmouseout", "evt.stopPropagation()");
		                }

		                var punchX = g(gvVarName);
		                if (punchX == null || punchX == 0) {
		                    punchX = (nVert * vSep);
		                }
		                punchX = roundTo(punchX, roundingFactor);
		                gv.getStyle().setProperty("fill", color, "");
		                gv.setAttribute("x", x + punchX - (t / 2));

		                if (bottom == 1) {
		                    gv.setAttribute("y", y + h - hSep);
		                    gv.setAttribute("height", hSep);
		                }
		                    else if (bottom == 2) {
		                    gv.setAttribute("y", y + h - (hSep * 2));
		                    gv.setAttribute("height", hSep * 2);
		                }		                            
		            }
                    
		            if (!redraw && applet) {
		                applet.registerVertElement(idPrefix + gvName,
										idPrefix + rectName,
										(x + punchX - (t / 2)) + "",
										t + "",
										"s(\"" + gvVarName + "\",%X%)");
		                // return point
		                applet.registerVertElement(idPrefix,
										"",
										(x + punchX - (t / 2)) + "",
										t + "",
										null);
		            }
		            if (!gvExists) {
		                grp.appendChild(gv);
		            }
		            var desc = "LENGTH: %H%  PUNCH: %P%.";
		            desc = desc.replace(/%H%/g, getDim(gridLen(rectName, gvName)));
		            desc = desc.replace(/%P%/g, getDim(punchX));

		            s(gvVarName, punchX);
		            createDescription(gvName, desc);	

		        }//end iCount For (short bars top and bottom)
		        continue; //Grid already created need to skip to next for
		    }
		    else if (top != 0) {
		        if (top == 1) {
		            gv.setAttribute("height", hSep);
		        }
		        else if (top == 2) {
		            gv.setAttribute("height", hSep * 2);
		        } 
		    }
		    else if (bottom != 0) {
		        if (bottom == 1) {
		            gv.setAttribute("y", y + h - hSep);
		            gv.setAttribute("height", hSep);
		        }
		        else if (bottom == 2) {
		            gv.setAttribute("y", y + h - (hSep * 2));
		            gv.setAttribute("height", hSep * 2);
		        } 
		    }

		}
		
		if(!redraw && applet)
		{
			applet.registerVertElement(	idPrefix+gvName,
										idPrefix+rectName,
										(x + punchX - (t/2)) +"", 	
										t + "",
										"s(\""+gvVarName+"\",%X%)");
			// return point
			applet.registerVertElement(	idPrefix,
										"",
										(x + punchX - (t/2)) +"", 	
										t + "",
										null);
										
										
		}
		if(!gvExists)
		{
			grp.appendChild(gv);
		}
		var desc = "LENGTH: %H%  PUNCH: %P%.";
		desc = desc.replace(/%H%/g,getDim(gridLen(rectName, gvName)));
		desc = desc.replace(/%P%/g,getDim(punchX));
			
		s(gvVarName,punchX);

		createDescription(gvName,desc);
	}
	//Horz bars

	var hBarCount = 0;
	var hCount = 0;
	if (left == 0 & right == 0) {
	    hCount = top + bottom + 1;  //Only drawing the full bars for top and bottom
	} else {
	    hCount = horz + 1;
	}
	
	for(;nHorz > 0;nHorz--) {
	    hCount--;
	    var ghName = (redraw ? idPrefix : "") + gridElName + "v" + hCount;
	    var ghVarName = gridElName + "v" + hCount;
		var gh = drawing.getElementById(ghName);
		var ghExists = true;
		if(gh == null)
		{
			ghExists = false;
			gh = drawing.createElementNS(svgNS,"rect");
			gh.setAttribute("id",ghName);
			gh.setAttribute("class","grid");
			gh.setAttribute("height",t);
			
			gh.setAttribute("onmousedown","startDragY(evt)");							 	
 			gh.setAttribute("onmousemove","drag(evt)");							 	
 			gh.setAttribute("onmouseup","drop(evt)");
	 		gh.setAttribute("onmouseout","evt.stopPropagation()");	
		}
	
		var punchY =  g(ghVarName);

		if(punchY == null || punchY == 0)
		{
			punchY = (hSep*nHorz);
		}
		punchY = roundTo(punchY,roundingFactor);
		
		gh.getStyle().setProperty("fill",color,"");
		gh.setAttribute("x",x); 
		gh.setAttribute("y",y + (h - punchY - (t/2)));
		//bars that go full width
		if (nHorz == 1 && bottom != 0) {
		    gh.setAttribute("width", w);
		}
		else if (nHorz == 2 && bottom == 2) {
		    gh.setAttribute("width", w);
		}
		else if (nHorz == horz && top != 0) {
		    gh.setAttribute("width", w);
		}
		else if (nHorz == horz - 1 && top == 2) {
		    gh.setAttribute("width", w);
		}
		//end bars that go full height
		else if (left == 0 && right == 0) {
		    hCount++;  //Adding 1 because we skipped drawing this bar
		    continue;  //Only need to draw the full bars
		}
		//partial bars
		else {
		    if (left != 0 && right != 0) {
		        //just take punches from the Left
		        var tCount = 1;
		        for (; tCount < 3; tCount++) {
		            if (tCount == 1) { //Left
		                if (left == 1) {
		                    gh.setAttribute("width", vSep);
		                }
		                else if (left == 2) {
		                    gh.setAttribute("width", vSep * 2);
		                }
		            }
		            else if (tCount == 2) { //Right
		                var ghName = (redraw ? idPrefix : "") + gridElName + "rv" + hCount;
		                var ghVarName = gridElName + "rv" + hCount;
		                var gh = drawing.getElementById(ghName);
		                var ghExists = true;
		                if (gh == null) {
		                    ghExists = false;
		                    gh = drawing.createElementNS(svgNS, "rect");
		                    gh.setAttribute("id", ghName);
		                    gh.setAttribute("class", "grid");
		                    gh.setAttribute("height", t);

		                    gh.setAttribute("onmousedown", "startDragY(evt)");
		                    gh.setAttribute("onmousemove", "drag(evt)");
		                    gh.setAttribute("onmouseup", "drop(evt)");
		                    gh.setAttribute("onmouseout", "evt.stopPropagation()");
		                }

		                var punchY = g(ghVarName);

		                if (punchY == null || punchY == 0) {
		                    punchY = (hSep * nHorz);
		                }
		                punchY = roundTo(punchY, roundingFactor);

		                gh.getStyle().setProperty("fill", color, "");
		                gh.setAttribute("x", x);
		                gh.setAttribute("y", y + (h - punchY - (t / 2)));

		                if (right == 1) {
		                    gh.setAttribute("x", x + w - vSep);
		                    gh.setAttribute("width", vSep);
		                }
		                else if (right == 2) {
		                    gh.setAttribute("x", x + w - (vSep * 2));
		                    gh.setAttribute("width", vSep * 2);
		                }
		            }

		            if (!redraw && applet) {
		                applet.registerHorzElement(idPrefix + ghName,
										idPrefix + rectName,
										(y + (h - punchY - (t / 2))) + "",
										t + "",
										"s(\"" + ghVarName + "\"," + h + "-%Y%)");
		                // return point
		                applet.registerHorzElement(idPrefix,
										"",
										(y + (h - punchY - (t / 2))) + "",
										t + "",
										null);
		            }

		            if (!ghExists) {
		                grp.appendChild(gh);
		            }
		            var desc = "LENGTH: %W%  PUNCH: %P%.";
		            desc = desc.replace(/%W%/g, getDim(gridLen(rectName, ghName)));
		            desc = desc.replace(/%P%/g, getDim(punchY));
		            s(ghVarName, punchY);
		            createDescription(ghName, desc);
		        } //end iCount For (short bars top and bottom)
		        continue; //Grid already created need to skip to next for
		    }
		    else if (left != 0) {
		        if (left == 1) {
		            gh.setAttribute("width", vSep);
		        }
		        else if (left == 2) {
		            gh.setAttribute("width", vSep * 2);
		        }
		    }
		    else if (right != 0) {
		        if (right == 1) {
		            gh.setAttribute("x", x + w - vSep);
		            gh.setAttribute("width", vSep);
		        }
		        else if (right == 2) {
		            gh.setAttribute("x", x + w - (vSep * 2));
		            gh.setAttribute("width", vSep * 2);
		        }
		    }
		} //end else
			
		if(!redraw && applet)
		{
			applet.registerHorzElement( idPrefix+ghName,
										idPrefix+rectName,
										(y + (h - punchY - (t/2))) +"", 	
										t + "",
										"s(\""+ghVarName+"\","+h+"-%Y%)");
			// return point
			applet.registerHorzElement( idPrefix,
										"",
										(y + (h - punchY - (t/2))) +"", 	
										t + "",
										null);
		}
		
		if(!ghExists)
		{
			grp.appendChild(gh);
		}
		var desc = "LENGTH: %W%  PUNCH: %P%.";
		desc = desc.replace(/%W%/g,getDim(gridLen(rectName, ghName)));
		desc = desc.replace(/%P%/g,getDim(punchY));
		s(ghVarName,punchY);
		createDescription(ghName,desc);
	}
	
}catch(e)
{
	alertUser("Exception:  drawLadderGrid('"+ rectName+"','"+gridElName+"','"+color+"',"+t+")");
	alertUser(e);
	trace(e);
}
}





//Calc distance between grids:
function calcGridDistance(dimen, gridThick, qtyGrid)
{
	var GlassSpaces = qtyGrid + 1;
	var TotGridSpace = (gridThick * qtyGrid);
	var tmp = dimen - TotGridSpace;
	var Space = tmp/GlassSpaces;

	return Space;
}

function drawSuspended(rectName,gridElName,color,t,redraw)
{
trace("drawSuspended('"+ rectName+"','"+gridElName+"','"+color+"',"+t+")");
try
{
	var idPrefix = g("f_idprefix");
	var redrawScript = 	"drawSuspended('%ID%','"+gridElName+"','"+color+"',"+t+",true)";
	var	topH = gN("f_"+gridElName+"longHorz");
	var	shortV = gN("f_"+gridElName+"shortVert");
	
	var t2 = gN("grid_thick2");
	if (t2 == 0)
	{ t2 = t;}
	
	var nVert = 0;
	var nHorz = 0;
	var desc,grp,ins,punchX,punchY;
	
	var rect = drawing.getElementById(rectName);
	if(rect == null)
	{
		trace("drawSuspended() failed because " + rectName + " does not exist.");
		return;
	}
	
	
	var x = rect.getAttribute("x") - 0;
	var y = rect.getAttribute("y") - 0;
	var h = rect.getAttribute("height") - 0;
	var w = rect.getAttribute("width") - 0;
	var inset = rect.getAttribute("inset");
	
	inset = inset === null ? 0 : inset-0;	
	
	if(applet && !redraw)
	{
			applet.registerLite(idPrefix+rectName,x+"",y+"",w+"",h+"",redrawScript);
			var elLite = drawing.getElementById(rectName);
			if(elLite != null)
			{
				elLite.setAttribute("onmousemove","drag(evt)");							 	
				elLite.setAttribute("onmouseup","drop(evt)");
			}							 	
	}
	var window = drawing.getElementById("window");
	createClipPattern(rectName);
	var grp = drawing.getElementById(gridElName);
	if(grp == null)
	{
				grp = drawing.createElementNS(svgNS,"g");
				grp.setAttribute("id",gridElName);
				grp.getStyle().setProperty("clip-path","url(#"+idPrefix+"clip_"+rectName+")","");

				var ins = rect.nextSibling;
				if(ins == null)
				{
					window.appendChild(grp);
				}
				else
				{
					ins.parentNode.insertBefore(grp,ins);
				}
	}	
	
	//Calc from OSM
	var sep = gN("grid_sep");

	if (sep == 0)
	{	sep = inchesToMM(8);	}

	//Find distance from edge of visible glass to center of grid
	var DistanceEdge2Grid = sep - y;
	var DistanceY2Grid = DistanceEdge2Grid - inset;
	
	//Start long Horz suspended grids	
	nHorz = 0;
	var nTop = 1;
	for(;nTop <= topH;nTop++)
	{			
		nHorz++;
		var gtName = (redraw?idPrefix:"")+gridElName+"v" + nHorz;
		var gtVarName = gridElName+"v" + nHorz;
		var gt = drawing.getElementById(gtName);
		var gtExists = true;
		if(gt == null)
		{
			gtExists = false;
			gt = drawing.createElementNS(svgNS,"rect");
			gt.setAttribute("id",gtName);
			gt.setAttribute("class","grid");	
			gt.setAttribute("onmousedown","startDragY(evt)");							 	
			gt.setAttribute("onmousemove","drag(evt)");							 	
			gt.setAttribute("onmouseup","drop(evt)");	
	 		gt.setAttribute("onmouseout","evt.stopPropagation()");
		}
		punchY =  gN(gtVarName);
		if(punchY === 0)
		{
				if (nHorz == 1)
				{
					punchY = h - DistanceEdge2Grid; 
				}
				else
				{
					punchY = h - DistanceY2Grid/2 - inset;
				}
		}
		
		if (nTop == 2 && topH == 2)
		{
			gt.setAttribute("height",t);
			gt.setAttribute("y",y + h - (punchY) - t/2); 
		}
		else
		{
			gt.setAttribute("height",t2);
			gt.setAttribute("y",y + h - (punchY) - t2/2); 
		}	
		
		punchY = roundTo(punchY,roundingFactor);
		gt.getStyle().setProperty("fill",color,"");
		
		gt.setAttribute("x",x);
		
		gt.setAttribute("width",w);
		if(!redraw && applet)
		{
			applet.registerHorzElement(	idPrefix+gtName,
										idPrefix+rectName,
										y+((nTop*punchY - t/2)) +"", 	
										t + "",
										"s(\""+gtVarName+"\",%Y%)");
			// return point
			applet.registerHorzElement(	idPrefix,
										"",
										y+((nTop*punchY - t/2)) +"", 	
										t + "",
										null);						
		}
		if(!gtExists)
		{
			grp.appendChild(gt);
		}
		desc = "LENGTH: %H%  PUNCH: %P%.";
		desc = desc.replace(/%H%/g,getDim(gridLen(rectName, gtName)));
		desc = desc.replace(/%P%/g,getDim(punchY));

		s(gtVarName,punchY);

		createDescription(gtName,desc);
	} //end for TopSide 1
	
	
	var vSep = (w-(2*inset)+t)/(shortV+1);
	
//	createDim(x + inset, -30, x + w - inset, -30, true)
	
	nVert = 1;
	for(;nVert <= shortV;nVert++)
	{

		var glName = (redraw?idPrefix:"")+gridElName+"h" + nVert;
		var glVarName = gridElName+"h" + nVert;
		var gl = drawing.getElementById(glName);
		var glExists = true;
		if(gl == null)
		{
			glExists = false;
			gl = drawing.createElementNS(svgNS,"rect");
			gl.setAttribute("id",glName);
			gl.setAttribute("class","grid");
			gl.setAttribute("width",t);
			
			gl.setAttribute("onmousedown","startDragX(evt)");							 	
			gl.setAttribute("onmousemove","drag(evt)");							 	
			gl.setAttribute("onmouseup","drop(evt)");	
	 		gl.setAttribute("onmouseout","evt.stopPropagation()");
		}
		punchX =  gN(glVarName);
		if(punchX === 0)
		{
			  punchX = (nVert*vSep)+inset-(.5*t);
		}
		punchX = roundTo(punchX,roundingFactor);
    gl.getStyle().setProperty("fill",color,"");
	
		gl.setAttribute("x",x + punchX - (t/2)); 
		gl.setAttribute("y",y);
		gl.setAttribute("height",DistanceEdge2Grid);

		if(!redraw && applet)
		{
			applet.registerVertElement(	idPrefix+glName,
										idPrefix+rectName,
										(x + punchX - (t/2)) +"", 	
										t + "",
										"s(\""+glVarName+"\",%X%)");
			// return point
			applet.registerVertElement(	idPrefix,
										"",
										(x + punchX - (t/2)) +"", 	
										t + "",
										null);				
		}
		if(!glExists)
		{
			grp.appendChild(gl);
		}
		desc = "LENGTH: %H%  PUNCH: %P%.";
		desc = desc.replace(/%H%/g,getDim(gridLen(rectName, glName)));
		desc = desc.replace(/%P%/g,getDim(punchX));
		s(glVarName,punchX);

		createDescription(glName,desc);
	} //end for LeftSide 1
	
}
catch(e)
{
	alertUser("Exception:  drawSuspended('"+ rectName+"','"+gridElName+"','"+color+"',"+t+")");
	alertUser(e);
	trace(e);
}
}

function alignlite_h(DrivingGlassID, DrivingGridID, AlignGlassID, AlignGridID, Direction, variable)
{
trace("alignlite_h("+DrivingGlassID+","+DrivingGridID+","+AlignGlassID+","+ AlignGridID+","+ Direction+","+ variable+")");
    if(variable === 0)
    {
      variable = Math.min(computeHorizontalAlignTolerance(DrivingGlassID,DrivingGridID),computeHorizontalAlignTolerance(AlignGlassID,AlignGridID));
    }
    

		var desc, punchY;
		var i = 1; //counter
		var u = 1; //counter	
		
		var baseOffset = (drawing.getElementById(AlignGlassID).getAttribute("y") - 0)	-
                      (drawing.getElementById(DrivingGlassID).getAttribute("y") - 0);	

		//Driving Grid
		var h1name = DrivingGridID+"v" + "1";
		var h1 = drawing.getElementById(h1name);
		//Aligning Grid
		var h2name = AlignGridID+"v" + "1";
		var h2VarName = AlignGridID+"v" + "1";
		var h2 = drawing.getElementById(h2name);	
    var rC,h2Y,desc; 
		while (h1 !== null)
		{
			
			rC = (h1.getAttribute("y")-0) + ((h1.getAttribute("height")-0)/2);

			u = 1;
			h2name = AlignGridID+"v" + u;
			h2 = drawing.getElementById(h2name);			
			while (h2 !== null)
			{
				u++;
				h2Y = (h2.getAttribute("y")-0) + ((h2.getAttribute("height")-0)/2);
				if ((rC + variable) >= h2Y && (rC - variable) <= h2Y  && Math.abs(rC-h2Y) > 0.001)
				{				

					punchY = gN(h2VarName);
					h2.setAttribute("y", (rC - ((h2.getAttribute("height")-0)/2)));
					punchY = punchY + (rC - h2Y);
          punchY = roundTo(punchY,roundingFactor);
					
					desc = "LENGTH: %H%  PUNCH: %P%.";
					desc = desc.replace(/%H%/g,inchesToInchesDim(h2.getAttribute("width")));
					desc = desc.replace(/%P%/g,inchesToInchesDim(punchY));
					createDescription(h2name,desc);	
					s(h2VarName,punchY);
									
				}
				h2name = AlignGridID+"v" + u;
				h2VarName = AlignGridID+"v" + u;
				h2 = drawing.getElementById(h2name);				
			}
			
			//Get the next Horz grid to be aligned to
			i++;
			h1name = DrivingGridID+"v" + i;
			h1 = drawing.getElementById(h1name);			
		}
		checkAlignLite_h(DrivingGlassID, DrivingGridID, AlignGlassID, AlignGridID);
		checkAlignLite_h(AlignGlassID, AlignGridID, DrivingGlassID, DrivingGridID);
}


function checkAlignLite_h(DrivingGlassID, DrivingGridID, AlignGlassID, AlignGridID)
{
trace("checkAlignLite_h("+DrivingGlassID+","+DrivingGridID+","+AlignGlassID+","+ AlignGridID+")");

		var i = 1; //counter
		var u = 1; //counter	
		
		var baseOffset = (drawing.getElementById(AlignGlassID).getAttribute("y") - 0)	 -
                      (drawing.getElementById(DrivingGlassID).getAttribute("y") - 0);	
trace("baseOffset="+baseOffset);

		//Driving Grid
		var h1name = DrivingGridID+"v" + "1";
		var h1 = drawing.getElementById(h1name);
		//Aligning Grid
		var h2name = AlignGridID+"v" + "1";
		var h2VarName = AlignGridID+"v" + "1";
		var h2 = drawing.getElementById(h2name);	
		var rC,h2Y;
    var haveMatch = false;
    var cntH2 = 0;
		while (h1 !== null)
		{
			
			rC = (h1.getAttribute("y")-0) + ((h1.getAttribute("height")-0)/2)  - 0;
      haveMatch = false;
			u = 1;
			h2name = AlignGridID+"v" + u;
			h2 = drawing.getElementById(h2name);	
			trace(">>>"+h1name+"="+rC);		
			while (h2 !== null)
			{
        cntH2++;
				u++;
				h2Y = (h2.getAttribute("y")-0) + ((h2.getAttribute("height")-0)/2);

				trace(">>>>>>"+ h2name+"="+h2Y);		

				if (rC == h2Y)
				{				
          haveMatch = true;
          break;
				}
				h2name = AlignGridID+"v" + u;
				h2VarName = AlignGridID+"v" + u;
				h2 = drawing.getElementById(h2name);				
			}
			if(cntH2 === 0)
			{
        return true;
			}
      if(!haveMatch)
      {
        s("f_errorMsg","Please review grille alignment.");
        return false;
      }   
      
			//Get the next Horz grid to be aligned to
			i++;
			h1name = DrivingGridID+"v" + i;
			h1 = drawing.getElementById(h1name);			
		}
		return true;
		
		
}

function  computeHorizontalAlignTolerance(GlassID,GridID)
	{
	trace("computeHorizontalAlignTolerance("+GlassID+","+GridID+")");

		var minDistance = 1000000;
		var i = 1; //counter
		var u = 1; //counter	
		
		//Driving Grid
		var h1name = GridID+"v" + "1";
		var h1 = drawing.getElementById(h1name);
		var h2,h2Name;
		var elH1 = drawing.getElementById(GlassID);
    var h1Top = elH1.getAttribute("y")-0;
    var h1Bot = h1Top + (elH1.getAttribute("height")-0);
    var rC1 = 0;
    var rC2 = 0;
		while (h1 !== null)
		{
			
			rC1 = (h1.getAttribute("y") - 0) + (h1.getAttribute("height") - 0)/2;
      
      minDistance = Math.min(minDistance,rC1-h1Top);
      minDistance = Math.min(minDistance,h1Bot-rC1);
      
			u = 1;
			h2name = GridID+"v" + u;
			h2 = drawing.getElementById(h2name);			
			while (h2 !== null)
			{
				
				if(u!=i)
				{
          rC2 = (h2.getAttribute("y") - 0) + (h2.getAttribute("height") - 0)/2;
          minDistance = Math.min(minDistance,Math.abs(rC1-rC2));
        }
        u++;
        h2name = GridID+"v" + u;
        h2 = drawing.getElementById(h2name);			
 	    }   
      
			//Get the next Horz grid to be aligned to
			i++;
			h1name = GridID+"v" + i;
			h1 = drawing.getElementById(h1name);			
		}
    trace("computed Horz tolerance = "+minDistance*0.49999);
		return minDistance*0.49999;
}

function alignlite_v(DrivingGlassID, DrivingGridID, AlignGlassID, AlignGridID, Direction, variable)
{
trace("alignlite_v("+DrivingGlassID+","+DrivingGridID+","+AlignGlassID+","+ AlignGridID+","+ Direction+","+ variable+")");
   if(variable === 0)
    {
      variable = Math.min(computeVerticalAlignTolerance(DrivingGlassID,DrivingGridID),computeVerticalAlignTolerance(AlignGlassID,AlignGridID));
    }
    
		var desc, punchX;
		var i = 1; //counter
		var u = 1; //counter		
	
		//Driving Grid
		var v1name = DrivingGridID+"h" + "1";
		var v1 = drawing.getElementById(v1name);
		//Aligning Grid
		var v2name = AlignGridID+"h" + "1";
		var v2VarName = AlignGridID+"h" + "1";
		var v2 = drawing.getElementById(v2name);	
		var rC,v2X,desc;
	
		while (v1 !== null)
		{
        rC = (v1.getAttribute("x") - 0) + ((v1.getAttribute("width")-0)/2);
			
			u = 1;
			v2name = AlignGridID+"h" + u;
			v2 = drawing.getElementById(v2name);			
			while (v2 !== null)
			{
				u++;
				v2X = (v2.getAttribute("x")-0)+((v2.getAttribute("width")-0)/2);
				if ((rC + variable) >= v2X && (rC - variable) <= v2X && Math.abs(rC-v2X) > 0.001)
				{				

					punchX = gN(v2VarName);
					v2.setAttribute("x", (rC - ((v2.getAttribute("width")-0)/2)));
					
					punchX = punchX - (rC - v2X);
          punchX = roundTo(punchX,roundingFactor);
					
					desc = "LENGTH: %V%  PUNCH: %P%.";
					desc = desc.replace(/%V%/g,inchesToInchesDim(v2.getAttribute("height")));
					desc = desc.replace(/%P%/g,inchesToInchesDim(punchX));
					createDescription(v2name,desc);	
					s(v2VarName,punchX);
									
				}
				v2name = AlignGridID+"h" + u;
				v2VarName = AlignGridID+"h" + u;
				v2 = drawing.getElementById(v2name);				
			}
			
			//Get the next Vert grid to be aligned to
			i++;
			v1name = DrivingGridID+"h" + i;
			v1 = drawing.getElementById(v1name);			
		}
		checkAlignLite_v(DrivingGlassID, DrivingGridID, AlignGlassID, AlignGridID);
    checkAlignLite_v(AlignGlassID, AlignGridID,DrivingGlassID, DrivingGridID);
}


function checkAlignLite_v(DrivingGlassID, DrivingGridID, AlignGlassID, AlignGridID)
{
trace("checkAlignLite_v("+DrivingGlassID+","+DrivingGridID+","+AlignGlassID+","+ AlignGridID+")");
		var desc, punchX;
		var i = 1; //counter
		var u = 1; //counter		
	
		//Driving Grid
		var v1name = DrivingGridID+"h" + "1";
		var v1 = drawing.getElementById(v1name);
		//Aligning Grid
		var v2name = AlignGridID+"h" + "1";
		var v2VarName = AlignGridID+"h" + "1";
		var v2 = drawing.getElementById(v2name);	
		var v2x,rC;
    var haveMatch = false;
    
    var cntV2=0
		while (v1 !== null)
		{
    	rC = v1.getAttribute("x") - ((v1.getAttribute("width")-0)/2);
			
			u = 1;
			v2name = AlignGridID+"h" + u;
			v2 = drawing.getElementById(v2name);			
			while (v2 !== null)
			{
        cntV2++;
				u++;
				v2X = v2.getAttribute("x") - ((v1.getAttribute("width")-0)/2);
				if (rC == v2X)
				{				
          haveMatch = true;
          break;
									
				}
				v2name = AlignGridID+"h" + u;
				v2VarName = AlignGridID+"h" + u;
				v2 = drawing.getElementById(v2name);				
			}
			if(cntV2 === 0)
			{
        return true;
			}
     if(!haveMatch)
      {
        s("f_errorMsg","Please review grille alignment.");
        return false;
      }   
  		//Get the next Horz grid to be aligned to
			i++;
			v1name = DrivingGridID+"h" + i;
			v1 = drawing.getElementById(v1name);			
		}
		return true;
	
}

function  computeVerticalAlignTolerance(GlassID,GridID)
	{
		trace("computeVerticalAlignTolerance("+GlassID+","+GridID+")");

		var minDistance = 1000000;
		var i = 1; //counter
		var u = 1; //counter	
		
		//Driving Grid
		var v1name = GridID+"h" + "1";
		var v1 = drawing.getElementById(v1name);
		var v2Name,v2;
		var elV1 = drawing.getElementById(GlassID);
    var v1Left = elV1.getAttribute("x")-0;
    var v1Right = v1Top + (elV1.getAttribute("width")-0);
    var rC1 = 0;
    var rC2 = 0;
		while (v1 !== null)
		{
			
			rC1 = (v1.getAttribute("x") - 0) + (v1.getAttribute("width") - 0)/2;
      
      minDistance = Math.min(minDistance,rC1-v1Left);
      minDistance = Math.min(minDistance,v1Right-rC1);
      
			u = 1;
			v2name = GridID+"h" + u;
			v2 = drawing.getElementById(v2name);			
			while (v2 !== null)
			{
				if(u!=i)
				{
           rC2 = (v2.getAttribute("x") - 0) + (v2.getAttribute("width") - 0)/2;
          minDistance = Math.min(minDistance,Math.abs(rC1-rC2));
        }
        u++;
        v2name = GridID+"h" + u;
        v2 = drawing.getElementById(v2name);			
  	   }   
      
			//Get the next Horz grid to be aligned to
			i++;
			v1name = GridID+"h" + i;
			v1 = drawing.getElementById(v1name);			
		}
    trace("computed Vertical tolerance="+minDistance*0.49999);
		return minDistance*0.49999;
}



