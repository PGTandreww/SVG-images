function initGrid(rectName,gridElName,pattern,color,t)
{
trace("initGrid('"+ rectName+"','"+gridElName+"','"+pattern+"','"+color+"',"+t+")");
try{
	if (typeof GetGridColor == 'function') { color = GetGridColor(color); }
	var vert,horz,left,right,top,bottom;
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
	alertUser("Exception:  initGrid('"+ rectName+"','"+gridElName+"','"+pattern+"','"+color+"',"+t+")");
	alertUser(e);
	trace(e);
}	
}

function drawGrid(rectName,gridElName,color,t,redraw)
{
trace("drawGrid('"+ rectName+"','"+gridElName+"','"+color+"',"+t+")");
try{
var idPrefix = g("f_idprefix");
var redrawScript = 	"drawGrid('%ID%','"+gridElName+"','"+color+"',"+t+",true)";
var	vert = gN("f_"+gridElName+"v");
var	horz = gN("f_"+gridElName+"h");

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
		var gvName = (redraw?idPrefix:"")+gridElName+"v" + nVert;
		var gvVarName = gridElName+"v" + nVert;
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
		punchX  = roundToSixteenth(punchX);
		gv.getStyle().setProperty("fill",color,"");
		
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
		var desc = "LENGTH: %H%  PUNCH: %P%.";
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%P%/g,getDim(punchX));
			
		s(gvVarName,punchX);

		createDescription(gvName,desc);
			
		
	}

	var nHorz = horz;
	var hSep = h/(horz+1);
	
	for(;nHorz > 0;nHorz--)
	{	
		var ghName = (redraw?idPrefix:"")+gridElName+"h"+nHorz;	
		var ghVarName = gridElName+"h"+nHorz;	
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
		punchY = roundToSixteenth(punchY);
		
		gh.getStyle().setProperty("fill",color,"");
		gh.setAttribute("x",x); 
		gh.setAttribute("y",y + (h - punchY - (t/2)));
		gh.setAttribute("width",w);
		
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
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%P%/g,getDim(punchY));
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

function drawHorizontalBars(liteName,grp,x,y,w,h,horz,color,t,startAtTop,redraw)
{
trace("drawHorizontalBars('"+liteName+"','"+gridElName+"',"+x+","+y+","+w+","+h+","+horz+",'"+color+"',"+t+","+startAtTop+")");
try{
var idPrefix = g("f_idprefix");
var redrawScript = 	"drawHorizontalBars('"+liteName+"','"+gridElName+"',"+x+","+y+","+w+","+h+","+horz+",'"+color+"',"+t+","+startAtTop+","+true+")";

	
	var nHorz = 1;
	var hSep = startAtTop?h/(horz):h/(horz+1);
	var ghName,ghVarName,gh,punchY,desc;
	var gridElName = grp.getAttribute("id")+"_";
	for(;nHorz <= horz;nHorz++)
	{	
		ghName = (redraw?idPrefix:"")+gridElName+"h"+nHorz;	
		ghVarName = gridElName+"h"+nHorz;	
		punchY =  g(ghVarName);

		if(punchY == null || punchY == 0)
		{
			punchY = (hSep*(startAtTop?nHorz-1:nHorz));
		}
		punchY = roundToSixteenth(punchY);
		
		gh = drawing.getElementById(ghName);
		if(gh === null)
		{
			gh = drawing.createElementNS(svgNS,"rect");
			gh.setAttribute("id",ghName);
			gh.setAttribute("class","grid");
			gh.setAttribute("x",x); 
			gh.setAttribute("y",y + h - punchY - (t/2));
			gh.setAttribute("width",w);
			gh.setAttribute("height",t);
			
			gh.setAttribute("onmousedown","startDragY(evt)");							 	
 			gh.setAttribute("onmousemove","drag(evt)");							 	
 			gh.setAttribute("onmouseup","drop(evt)");
	 		gh.setAttribute("onmouseout","evt.stopPropagation()");	
	 		grp.appendChild(gh);
		}
		
		gh.getStyle().setProperty("fill",color,"");
		gh.setAttribute("x",x); 
		gh.setAttribute("y",y + h - punchY - (t/2));
		gh.setAttribute("width",w);
		gh.setAttribute("height",t);
		
		
		if(!redraw && applet)
		{
			applet.registerHorzElement( idPrefix+ghName,
										idPrefix+liteName,
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
		
		desc = "LENGTH: %W%  PUNCH: %P%.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%P%/g,getDim(punchY));
		s(ghVarName,punchY);
		createDescription(ghName,desc);
	}
}catch(e)
{
	alertUser("Exception: drawHorizontalBars('"+liteName+"','"+gridElName+"',"+x+","+y+","+w+","+h+","+horz+",'"+color+"',"+t+","+startAtTop+")");

	alertUser(e);
	trace(e);
}
}
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
	var vSep = w/(vert+1);
	var hSep = h/(horz+1);
	
	
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
		var gvName = (redraw?idPrefix:"")+gridElName+"v" + nVert;
		var gvVarName = gridElName+"v" + nVert;
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
		var punchX =  g(gvVarName);
		if(punchX == null || punchX == 0)
		{
			punchX = (nVert*vSep);
		}
		punchX  = roundToSixteenth(punchX);
		gv.getStyle().setProperty("fill",color,"");
		
		gv.setAttribute("x",x + punchX - (t/2)); 
		gv.setAttribute("y",y);
		gv.setAttribute("height",top*hSep);
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
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%P%/g,getDim(punchX));
			
		s(gvVarName,punchX);

		createDescription(gvName,desc);
			
		
	}

	var nHorz = 1;
	
	for(;nHorz <= top;nHorz++)
	{	
		var ghName = (redraw?idPrefix:"")+gridElName+"h"+nHorz;	
		var ghVarName = gridElName+"h"+nHorz;	
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
	
		var punchY =  g(ghVarName);

		if(punchY == null || punchY == 0)
		{
			punchY = (hSep*(nHorz-1)) +  (h - (top*hSep));
		}
		punchY = roundToSixteenth(punchY);
		
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
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%P%/g,getDim(punchY));
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
function drawPrairieGrid(rectName,gridElName,color,t,redraw)
{
trace("drawGrid('"+ rectName+"','"+gridElName+"','"+color+"',"+t+")");
try{
var idPrefix = g("f_idprefix");
var redrawScript = 	"drawGrid('%ID%','"+gridElName+"','"+color+"',"+t+",true)";
var	left = gN("f_"+gridElName+"l");
var	right = gN("f_"+gridElName+"r");
var	top = gN("f_"+gridElName+"t");
var	bottom = gN("f_"+gridElName+"b");
var sep = gN("f_"+gridElName+"sep");
if(sep == 0)
{
	sep = gN("grid_sep");
	if(sep == 0)
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
		var glName = (redraw?idPrefix:"")+gridElName+"v" + nVert;
		var glVarName = gridElName+"v" + nVert;
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
		punchX =  g(glVarName);
		if(punchX == null || punchX == 0)
		{
			punchX = (nLeft*sep);
		}
		punchX  = roundToSixteenth(punchX);
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
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%P%/g,getDim(punchX));
			
		s(glVarName,punchX);

		createDescription(glName,desc);
	}


	var nRight = 1;
	for(;nRight <= right;nRight++)
	{
		nVert++;
		var grName = (redraw?idPrefix:"")+gridElName+"v" + nVert;
		var grVarName = gridElName+"v" + nVert;
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
		punchX =  g(grVarName);
		if(punchX == null || punchX == 0)
		{
			punchX = w - (nRight*sep);
		}
		punchX  = roundToSixteenth(punchX);
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
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%P%/g,getDim(punchX));
			
		s(grVarName,punchX);

		createDescription(grName,desc);
	}


	var nTop = 1;
	
	for(;nTop <= top;nTop++)
	{	
		nHorz--;
		var gtName = (redraw?idPrefix:"")+gridElName+"h"+nHorz;	
		var gtVarName = gridElName+"h"+nHorz;	
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
		punchY =  g(gtVarName);

		if(punchY == null || punchY == 0)
		{
			punchY = h - (sep*nTop);
		}
		punchY = roundToSixteenth(punchY);
		
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
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%P%/g,getDim(punchY));
		s(gtVarName,punchY);
		createDescription(gtName,desc);
	}
	
	var nBottom = 1;
	
	for(;nBottom <= bottom;nBottom++)
	{	
		nHorz--;
		var gbName = (redraw?idPrefix:"")+gridElName+"h"+nHorz;	
		var gbVarName = gridElName+"h"+nHorz;	
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
		punchY =  g(gbVarName);

		if(punchY == null || punchY == 0)
		{
			punchY = (sep*nBottom);
		}
		punchY = roundToSixteenth(punchY);
		
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
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%P%/g,getDim(punchY));
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
	}
	return gd;
}

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
			
				trace(x1+","+y1+" --- "+x2+","+y2);
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
				trace(x1+","+y1+" --- "+x2+","+y2);
			
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
			
				trace(x1+","+y1+" --- "+x2+","+y2);
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
			
				trace(x1+","+y1+" --- "+x2+","+y2);
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
			
				trace(x1+","+y1+" --- "+x2+","+y2);
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
				trace(x1+","+y1+" --- "+x2+","+y2);
			
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
			
				trace(x1+","+y1+" --- "+x2+","+y2);
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
			
				trace(x1+","+y1+" --- "+x2+","+y2);
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
			
				trace(x1+","+y1+" --- "+x2+","+y2);
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
			
				trace(x1+","+y1+" --- "+x2+","+y2);
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
				trace(x1+","+y1+" --- "+x2+","+y2);
			
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
			
				trace(x1+","+y1+" --- "+x2+","+y2);
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
			
				trace(x1+","+y1+" --- "+x2+","+y2);
			}			

			

		}
	
		

}catch(e)
{
	alertUser("Exception:  drawDiamondGrid('"+ rectName+"','"+gridElName+"','"+color+"',"+t+")");
	alertUser(e);
	trace(e);
}
}



