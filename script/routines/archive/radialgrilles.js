function initArchGrille(id, glass_x,glass_y,glass_w,glass_h, leg_h, inset, grid_pattern, thk, color,segParm)
{
// segType: F=full, L=left half, R=right half

	trace("initArchGrille('"+id+"',"+ glass_x+","+glass_y+","+glass_w+","+glass_h+","+leg_h+","+","+inset+","+ grid_pattern+"',"+ thk+",'"+ color+"','"+ segParm+"')");
try{
	if (typeof GetGridColor == 'function') { color = GetGridColor(color); }
	var segType = segParm === null ? 'F':segParm;
	var arches = 0;
	var spokes = 0;
	var iSpokes = 0;
	var hBars = 0;
	var ix = 0;
	switch(grid_pattern.charAt(0))
	{
		case 'A':
				arches = grid_pattern.charAt(1) - 0;
				ix = grid_pattern.indexOf('T');
				if(ix!=-1)
				{
					iSpokes = grid_pattern.charAt(ix+1) - 0;
				}
				ix = grid_pattern.indexOf('S');
				if(ix!=-1)
				{
					spokes = grid_pattern.charAt(ix+1) - 0;
				}
				ix = grid_pattern.indexOf('H');
				if(ix!=-1)
				{
					hBars = grid_pattern.charAt(ix+1) - 0;
				}
				

				
				
				break;
		case 'S':
				spokes = grid_pattern.charAt(1) - 0;
				ix = grid_pattern.indexOf('A');
				if(ix!=-1)
				{
					arches = grid_pattern.charAt(ix+1) - 0;
				}
				ix = grid_pattern.indexOf('T');
				if(ix!=-1)
				{
					iSpokes = grid_pattern.charAt(ix+1) - 0;
				}

				if(arches === 0)
				{
					iSpokes = spokes;
					spokes = 0;
				}
				ix = grid_pattern.indexOf('H');
				if(ix!=-1)
				{
					hBars = grid_pattern.charAt(ix+1) - 0;
				}
				break;

		case 'G':
				spokes = grid_pattern.charAt(1) - 0;
				ix = grid_pattern.indexOf('H');
				if(ix!=-1)
				{
					hBars = grid_pattern.charAt(ix+1) - 0;
				}
				
				drawGothicGrille(id, glass_x,glass_y,glass_w,glass_h, leg_h, hBars, inset, spokes, thk, color, segType, false);
				return;
		
		case 'H':  // segmented hub
				hBars = grid_pattern.charAt(1) - 0;
				ix = grid_pattern.indexOf('S');
				if(ix!=-1)
				{
					spokes = grid_pattern.charAt(ix+1) - 0;
				}
				drawSegHubGrille(id, glass_x,glass_y,glass_w,glass_h, leg_h, inset, spokes, hBars, thk, color, false);
				return;
		 
		 
		default:
				break;
	}
	
	var scalloped = grid_pattern.indexOf('C') != -1;

	drawArchGrille(id, glass_x,glass_y,glass_w,glass_h, leg_h, hBars, inset, arches, spokes, iSpokes, scalloped, thk, color, segType, false);

}	
catch(e)
{
	alertUser("Exception: initArchGrille('"+id+"',"+ glass_x+","+glass_y+","+glass_w+","+glass_h+","+leg_h+",'"+inset+",'"+ grid_pattern+"',"+ thk+",'"+ color+"','"+ segParm+"')");
	alertUser(e);
	trace(e);
}
}

function drawArchGrille(id, glass_xP,glass_yP,glass_wP,glass_hP, leg_hP, hbars, inset, arches, spokes, iSpokes, scalloped, thk, color,segType,redraw)
{
try{
	trace("drawArchGrille('"+id+"'"+glass_xP+","+glass_yP+","+glass_wP+","+glass_hP+","+leg_hP+","+inset+","+ arches+","+ spokes+","+ iSpokes+","+ scalloped +","+ thk +",'"+ color+"','"+segType+"')");
	var horzAdj = computeHorzOffset(segType=='F'?glass_wP:glass_wP*2,glass_hP,inset);
	var glass_x = segType == 'R' ? glass_xP + inset : glass_xP + inset + horzAdj;
	var glass_y = glass_yP + inset;
	
	var glass_w = segType == 'F' ? glass_wP - (2*(inset+horzAdj)) : glass_wP - horzAdj - (2*inset);
	
	var glass_h = leg_hP === 0 ? glass_hP -(2*inset) : glass_hP - inset;
	var leg_h = leg_hP === 0 ? 0 : leg_hP - inset;
	
	var yTopBar;
	var halfRound = (segType == "F" && glass_h >= (glass_w/2))
					|| (segType != "F" && glass_h >= glass_w);
	if(leg_h === 0 || halfRound || hbars === 0)
	{
		yTopBar = glass_y + glass_h;
	}
	else
	{
		yTopBar = glass_y + glass_h + (leg_h/(hbars+1));
	}


	if(spokes == iSpokes || iSpokes > 1)
	{
		spokes = 0;
	}
	
	var splitHub = 0;
	if(spokes > 0 && iSpokes == 1)
	{
		spokes = Math.floor(spokes/2) * 2;
		spokes++;
		
		splitHub = Math.ceil(spokes/2);
		trace("splitHub="+splitHub);
	}
	
	var idPrefix = g("f_idprefix");

	if(!redraw)
	{
		createClipPattern(id);
	}
	
	var grp = drawing.getElementById(id+"_grid");
	var appendGrp = false;
	if(grp === null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id+"_grid");
		grp.getStyle().setProperty("clip-path","url(#"+idPrefix+"clip_"+id+")","");
		appendGrp = true;
		// drawing.getElementById("window").appendChild(grp);
	}
	var gls = drawing.getElementById(id);
	var shape = gls == null ? null : gls.getAttribute("shape");
	if(shape == null || shape == "")
	{
		shape = "CIRCLEARC";
	}

trace("shape="+shape);

	var radiusX = segType == 'F'?glass_w/2:glass_w;
	var radiusY = glass_h;
	var cx = segType == 'R'? glass_x : glass_x+ radiusX;
	var cy = glass_y+glass_h;
	
	var lites,radius,radians,radianStart,radiansA1,radianStartA1;
	var x,y,r;
	var radialPointsOuter=null;
	
	switch(segType)
	{
		case 'F':
			computeCircleCenter(glass_x,cy,cx,glass_y,glass_x+(radiusX*2),cy);
			if(shape=="3CTRARC")
			{
				radialPointsOuter=getRadialPointsFor3CenterArc(glass_x,glass_y,glass_w,glass_h,Math.max(spokes,iSpokes),segType);
			}
			else
			{
				if(hbars>0)
				{
					r = Math.sqrt(Math.pow(glass_w/2,2)+Math.pow(yTopBar-glass_y,2));
					radialPointsOuter=getAnglePoints(	Math.PI/2,
														-Math.PI/2,
														new Point(Xo,yTopBar),r,Math.max(spokes,iSpokes),
														false, false);
				}
				else
				{
					radialPointsOuter=getRadialPoints(	new Point(glass_x,cy),
														new Point(glass_x+glass_w,cy),												
														new Point(Xo,Yo),R,Math.max(spokes,iSpokes),
														false, false);
				
				}
			}
			break;
		case 'L':
			computeCircleCenter(glass_x,cy,cx,glass_y,glass_x+(radiusX*2),cy);
			if(shape=="3CTRARC")
			{
				radialPointsOuter=getRadialPointsFor3CenterArc(glass_x,glass_y,glass_w/2,glass_h,Math.max(spokes,iSpokes),segType);
			}
			else
			{
				if(hbars>0)
				{
					r = Math.sqrt(Math.pow(glass_w,2)+Math.pow(yTopBar-glass_y,2));
					radialPointsOuter=getAnglePoints(	Math.PI/2,0,
													new Point(Xo,yTopBar),r,Math.max(spokes,iSpokes),
													false, false);
				}
				else
				{
					radialPointsOuter=getRadialPoints(	new Point(glass_x,cy),
													new Point(cx,glass_y),
													new Point(Xo,yTopBar),R,Math.max(spokes,iSpokes),
													false, false);
				}
				
			}
			break;
		case 'R':
			computeCircleCenter(glass_x-radiusX,cy,glass_x,glass_y,glass_x+radiusX,cy);
			if(shape=="3CTRARC")
			{
				radialPointsOuter=getRadialPointsFor3CenterArc(glass_x,glass_y,glass_w/2,glass_h,Math.max(spokes,iSpokes),segType);
			}
			else
			{
				if(hbars>0)
				{
					r = Math.sqrt(Math.pow(glass_w,2)+Math.pow(yTopBar-glass_y,2));
					radialPointsOuter=getAnglePoints(	0,-Math.PI/2,
														new Point(Xo,yTopBar),r,Math.max(spokes,iSpokes),
														false, false);
				}
				else
				{
					radialPointsOuter=getRadialPoints(	new Point(glass_x,glass_y),
														new Point(glass_x+glass_w,cy),
														new Point(Xo,Yo),R,Math.max(spokes,iSpokes),
														false, false);
				}
				
			}

			break;
	}

	var frameArch_center = new Point(Xo,Yo);
	var frameArch_radius = R;
		


	if(applet && !redraw)
	{
		var redrawScript = 	"drawArchGrille('"+id+"',"+glass_xP+","+glass_yP+","+glass_wP+","+glass_hP+","+leg_hP+","+hbars+","+inset+","+ arches+","+ spokes+","+ iSpokes+","+ scalloped +","+ thk +",'"+ color+"','"+segType+"',true)";
		
		applet.registerLite(idPrefix+id,glass_x+"",glass_y+"",glass_w+"",glass_h+"",redrawScript);
		var elLite = drawing.getElementById(id);
		if(elLite !== null)
		{
			elLite.setAttribute("onmousemove","dragArch(evt)");							 	
			elLite.setAttribute("onmouseup","dropArch(evt)");
		}							 	
	}
	
	var archRadiusX,archRadiusY,arch,separationX,separationY,xStartArch,yStartArch,arch_id,arch_n;
	
	var arch1_radius = 0;
	var arch1_center = new Point(cx,cy);
	var arch1_width = 0;
	var arch1_left = null;
	var arch1_right = null;
	var arch1_top = null;
	
	var spokeCounter = 0;
	var archCircumference = 0;	
	var d;
	if(arches > 0)
	{
		
		arch = 1;
	
		// adjust separation to account for the fact the arc
		// orginates at the base of the frame, not the base of the glass.
		separationX = 0;
		separationY = 0;
		yStartArch = yTopBar;
		
		if(iSpokes === 0 && spokes > 0 && arches > 0)
		{ // center hub diameter == separation of outer arches
			separationX = (radiusX)/((2*arches)+1);
			separationY = (yTopBar-glass_y)/((2*arches)+1);
		}
		else
		{
			separationX = radiusX/(arches+1);
			separationY = (yTopBar-glass_y)/(arches+1);
		}
		
		
			
		for(;arch <= arches; arch++)
		{
			arch_id = (redraw?idPrefix+id:id)+"_arch_"+arch;
			arch_n = drawing.getElementById(arch_id);
			if(arch_n === null)
			{
				arch_n = drawing.createElementNS(svgNS,"path");
				arch_n.setAttribute("id",arch_id);
				
				arch_n.setAttribute("onmousemove","dragArch(evt)");							 	
				arch_n.setAttribute("onmouseup","dropArch(evt)");
				
				grp.appendChild(arch_n);
			}
			arch_n.setAttribute("class","grid");
		
			archRadiusX = gN(id+"_aw"+arch);
			if(archRadiusX == 0)
			{
				if(iSpokes === 0 && spokes > 0)
				{ // center hub diameter == separation of outer arches
					if(arch == 1)
					{
						archRadiusX = separationX;
					}
					else
					{
						archRadiusX = separationX + (separationX*(arch-1)*2);
					}
				}
				else
				{
					archRadiusX = arch*separationX;
				}
				s(id+"_aw"+arch,archRadiusX*2);
			}
			else
			{
				archRadiusX = archRadiusX/2;
			}
			
			archRadiusY = gN(id+"_ah"+arch);
			if(archRadiusY === 0)
			{
				if(iSpokes === 0 && spokes > 0)
				{ // center hub diameter == separation of outer arches
					if(arch == 1)
					{
						archRadiusY = separationY;
					}
					else
					{
						archRadiusY = separationY + (separationY*(arch-1)*2);
					}
				}
				else
				{
					archRadiusY = arch*separationY;
				}
				s(id+"_ah"+arch,archRadiusY);
			}

			
			
			xStartArch = cx - archRadiusX;  
			cy = yTopBar;
			computeCircleCenter(xStartArch,cy,cx,cy-archRadiusY,xStartArch+(2*archRadiusX),cy);

			archCircumference = Math.atan2(Xo-xStartArch,Yo-cy)*R;		
			switch(segType)
			{
				case 'F':	
					archCircumference *= 2;	
					d="M "+xStartArch+","+cy+" A "+R+","+R+" 0 0,1 "+(xStartArch+(2*archRadiusX))+","+cy;
					if(leg_h > 0)
					{
					 	d+= " l 0,"+ leg_h + " M "+xStartArch+","+cy+" l 0,"+ leg_h; 
					}
					break;
				case 'L':		
					d="M "+xStartArch+","+cy+" A "+R+","+R+" 0 0,1 "+(xStartArch+archRadiusX)+","+(cy-archRadiusY);
					if(leg_h > 0)
					{
					 	d+= " M "+xStartArch+","+cy+" l 0,"+ leg_h; 
					}
					
					break;
				case 'R':		
					d="M "+glass_x+","+(cy-archRadiusY)+" A "+R+","+R+" 0 0,1 "+(glass_x+archRadiusX)+","+cy;
					if(leg_h > 0)
					{
					 	d+= " l 0,"+ (leg_h) ; 
					}
					
					break;
				default:
					break;	
			}
					
			if(arch == 1 && spokes > 0)
			{
				arch1_radius = R;
				arch1_center = new Point(Xo,Yo);
				arch1_width = (archRadiusX*2);
				arch1_left = new Point(xStartArch,cy);
				arch1_right = new Point(xStartArch+(2*archRadiusX),cy);
				arch1_top = new Point(xStartArch+archRadiusX,Yo-R);
			}
			if(applet)
			{
		
				registerArchElement(id,grp,arch,cx,cy-1,archRadiusX*2,archRadiusY,thk,segType,redraw);					
				
			}
			arch_n.setAttribute("d",d);
			arch_n.getStyle().setProperty("stroke",color,"");
			arch_n.getStyle().setProperty("stroke-width",thk+"","");
			createDescription2(arch_n,"RADIUS: " + getDim(archRadiusX) + "   LENGTH: "+getDim(archCircumference)+"   STOCK WIDTH: " + getDim(thk) + ".");
		} // for arch	
	} // endif(arches > 0)
	
	var x1,y1,x2,y2,len,spoke_n,ispoke_n,path;
	var spoke = 1;
	var radialPointsInner = null;
	if(spokes > 0)
	{
		switch(segType)
		{
			case "F":
				radialPointsInner=getRadialPoints(	arch1_left,
													arch1_right,
													arch1_center,
													arch1_radius,
													spokes,
													false,false);
				break;

			case "L":
				radialPointsInner=getRadialPoints(	arch1_left,
													arch1_top,
													arch1_center,
													arch1_radius,
													spokes,
													false, false);
				break;
			case "R":
				radialPointsInner=getRadialPoints(	arch1_top,
													arch1_right,
													arch1_center,
													arch1_radius,
													spokes,
													false,false);
				break;
			default:
				break;
		}
		for(spoke=1;spoke<=radialPointsInner.length;spoke++)
		{			
			spoke_n = drawing.getElementById(idPrefix+id+"_spoke_"+spoke);
			if(spoke_n === null)
			{
				spoke_n = drawing.createElementNS(svgNS,"path");
				spoke_n.setAttribute("id",idPrefix+id+"_spoke_"+spoke);
				spoke_n.setAttribute("class","grid")
				grp.appendChild(spoke_n);
			}
			x1=radialPointsOuter[spoke-1].x;
			y1=radialPointsOuter[spoke-1].y;
			x2=radialPointsInner[spoke-1].x;
			if(spoke == splitHub)
			{
				y2=cy;
			}
			else
			{
				y2=radialPointsInner[spoke-1].y;
			}
			spokeCounter++;
			s(id+"_S"+spoke+"I",radialPointsInner[spoke-1].c);
			s(id+"_S"+spoke+"O",radialPointsOuter[spoke-1].c);
			path="M " + (x1) + "," +(y1) + " L " + (x2) + "," + (y2);
			len = Math.sqrt(Math.pow(x2-x1,2)+ Math.pow(y2-y1,2));
			spoke_n.setAttribute("d",path);
			spoke_n.getStyle().setProperty("stroke",color,"");
			spoke_n.getStyle().setProperty("stroke-width",thk+"","");
			createDescription2(spoke_n,"LENGTH: " + getDim(len) + "   STOCK WIDTH: " + getDim(thk) +"  RADIUS OFFSET (in/out): " +getDim(radialPointsInner[spoke-1].c) + ","+getDim(radialPointsOuter[spoke-1].c)+".");
		}
	}

	var ispoke = 1;	

	if(iSpokes > 0 && splitHub == 0)
	{
	
		for(;ispoke <= iSpokes; ispoke++)
		{
			ispoke_n = drawing.getElementById(idPrefix+id+"_ispoke_"+ispoke);
			if(ispoke_n === null)
			{
				ispoke_n = drawing.createElementNS(svgNS,"path");
				ispoke_n.setAttribute("id",idPrefix+id+"_ispoke_"+ispoke);
				ispoke_n.setAttribute("class","grid");
				grp.appendChild(ispoke_n);
			}
			
			x=radialPointsOuter[ispoke-1].x;
			y=radialPointsOuter[ispoke-1].y;

			switch(segType)
			{
				case "F":
					path="M " + (glass_x+glass_w/2) + "," +(cy) + " L " + (x) + "," + (y);
					break;
				case "L":
					path="M " + (glass_x+glass_w) + "," +(cy) + " L " + (x) + "," + (y);
					break;
				case "R":
					path="M " + (glass_x) + "," +(cy) + " L " + (x) + "," + (y);
					break;
				default:
					break;
			}
			s(id+"_S"+spoke+"O",radialPointsOuter[ispoke-1].c);
			
			ispoke_n.setAttribute("d",path);
			ispoke_n.getStyle().setProperty("stroke",color,"");
			ispoke_n.getStyle().setProperty("stroke-width",thk+"","");
			spokeCounter++;
		
			len = Math.sqrt(Math.pow(x-(cx-(thk/2)),2)+ Math.pow(y-(cy-(thk/2)),2));
				
			createDescription2(ispoke_n,"LENGTH: " +getDim(len)+ "   STOCK WIDTH: " + getDim(thk) +"   RADIAL OFFSET:"+ getDim(radialPointsOuter[ispoke-1].c)+".");
		}
	}

	var centerVBar;
	if((iSpokes > 0 || splitHub !== 0) && leg_h > 0 && segType == "F")
	{
	
			centerVBar = drawing.getElementById(idPrefix+id+"_split");
			if(centerVBar === null)
			{
				centerVBar = drawing.createElementNS(svgNS,"path");
				centerVBar.setAttribute("id",idPrefix+id+"_split");
				centerVBar.setAttribute("class","grid");
				grp.appendChild(centerVBar);
			}
			
			x1=x2=glass_x+glass_w/2;
			y1=yTopBar;
			y2=yTopBar+leg_h;

			path="M " + (x1) + "," +(y1) + " L " + (x2) + "," + (y2);
			
			centerVBar.setAttribute("d",path);
			centerVBar.getStyle().setProperty("stroke",color,"");
			centerVBar.getStyle().setProperty("stroke-width",thk+"","");
				
			createDescription2(centerVBar,"  LENGTH: " +getDim(leg_h)+ "   STOCK WIDTH: " + getDim(thk) +".");
	
	}

	var nScallop = 0;
	var xScallop = 0;
	var radialPointsScallop = null;
	var scallopInset = g("f_scallop_inset");
	var scallopExtraEndPoints = 0;
	if(scalloped && radialPointsOuter.length > 0)
	{
		
		if(scallopInset == null)
		{
			scallopInset = 1.25;
		}
		
				
		switch(segType)
		{
		case 'F':
			scallopExtraEndPoints = leg_h == 0 ? 2 : 0;
			computeCircleCenter(glass_x+scallopInset,cy,cx,glass_y+scallopInset,glass_x+(radiusX*2)-scallopInset,cy);
			radialPointsScallop=getRadialPoints(new Point(glass_x+scallopInset,cy),
												new Point(glass_x+glass_w-scallopInset,cy),
												new Point(Xo,Yo),R,
												Math.max(spokes,iSpokes)+2, //scallopExtraEndPoints,
												true, true);
			break;
		case 'L':
			scallopExtraEndPoints = leg_h == 0 ? 2 : 1;
		
			computeCircleCenter(glass_x+scallopInset,cy,cx,glass_y+scallopInset,glass_x+(radiusX*2)-scallopInset,cy);
			radialPointsScallop=getRadialPoints(new Point(glass_x+scallopInset,cy),
												new Point(cx,glass_y+scallopInset),
												new Point(Xo,Yo),R,Math.max(spokes,iSpokes)+2,// scallopExtraEndPoints,
												true,true);
			break;
		case 'R':
			scallopExtraEndPoints = leg_h == 0 ? 2 : 1;
		
			computeCircleCenter(glass_x-radiusX+scallopInset,cy,glass_x,glass_y+scallopInset,glass_x+radiusX-scallopInset,cy);
			radialPointsScallop=getRadialPoints(new Point(glass_x,glass_y+scallopInset),
												new Point(glass_x+glass_w-scallopInset,cy),
												new Point(Xo,Yo),R,Math.max(spokes,iSpokes)+2,// scallopExtraEndPoints,
												true,true);


			break;
		}
		
		for(;xScallop<(radialPointsScallop.length-1);xScallop++)
		{
			nScallop++;
			createScallop(id, nScallop,grp,frameArch_radius,
							new Point(radialPointsScallop[xScallop].x,radialPointsScallop[xScallop].y),
							new Point(radialPointsScallop[xScallop+1].x,radialPointsScallop[xScallop+1].y),
							color,thk,redraw);
		}
	}
	if(hbars > 0)
	{
		drawHorizontalBars(id,grp,glass_x,glass_y+glass_h,glass_w,leg_h,hbars,color,thk,halfRound,redraw);
	
	}
	if(appendGrp == true)
	{
		drawing.getElementById("window").appendChild(grp);
	}
}catch(e)
{
	alertUser("Exception: 	drawArchGrille('"+id+"'"+glass_xP+","+glass_yP+","+glass_wP+","+glass_hP+","+leg_hP+","+inset+","+ arches+","+ spokes+","+ iSpokes+","+ scalloped +","+ thk +",'"+ color+"','"+segType+"')");
	alertUser(e);
	trace(e);
}		
}

function drawSegHubGrille(id, glass_xP,glass_yP,glass_wP,arch_hP, leg_hP, inset, vBars, hBars, thk, color, redraw)
{
try{
	trace("drawSegHubGrille('"+id+"'"+glass_xP+","+glass_yP+","+glass_wP+","+arch_hP+","+ leg_hP+","+ inset+","+ vBars+","+ hBars +","+ thk +",'"+ color+"')");
	var horzAdj = computeHorzOffset(glass_wP,arch_hP+leg_hP,inset);
	var glass_x = glass_xP + inset + horzAdj;
	var glass_y = glass_yP + inset;
	
	var glass_w = glass_wP - (2*(inset+horzAdj));
		
	var leg_h = leg_hP - inset;
	var arch_h = arch_hP - inset;
	var glass_h = leg_h+arch_h;
	
	var idPrefix = g("f_idprefix");

	var arches = 1; // Math.floor(vBars/2);
	
	var spokes = vBars;
	

	if(!redraw)
	{
		createClipPattern(id);
	}
	
	var grp = drawing.getElementById(id+"_grid");
	var appendGrp = false;
	if(grp === null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id+"_grid");
		grp.getStyle().setProperty("clip-path","url(#"+idPrefix+"clip_"+id+")","");
		
		appendGrp = true;
		// drawing.getElementById("window").appendChild(grp);
	}


	var cx = glass_x+ glass_w/2;
	var cy = glass_y+ glass_h - leg_h;
	
	var x,y,lites,radius,radians,radianStart,radiansA1,radianStartA1,hSpacing,vSpacing;
	
	computeCircleCenter(glass_x,cy,cx,glass_y,glass_x+glass_w,cy);

	var frameArch_center = new Point(Xo,Yo);
	var frameArch_radius = R;
	var radialPointsOuter=getRadialPoints(new Point(glass_x,cy),
													new Point(glass_x+glass_w,cy),
													new Point(Xo,Yo),R,spokes,
													true, true);
		


	if(applet && !redraw)
	{
		var redrawScript = "drawSegHubGrille('"+id+"'"+glass_xP+","+glass_yP+","+glass_wP+","+arch_hP+","+ leg_hP+","+ inset+","+ vBars+","+ hBars +","+ thk +",'"+ color+"',true)";
		
		applet.registerLite(idPrefix+id,glass_x+"",glass_y+"",glass_w+"",glass_h+"",redrawScript);
		var elLite = drawing.getElementById(id);
		if(elLite !== null)
		{
			elLite.setAttribute("onmousemove","dragArch(evt)");							 	
			elLite.setAttribute("onmouseup","dropArch(evt)");
		}							 	
	}
	
	var archRadiusX,archRadiusY,arch,separationX,separationY,xStartArch,yStartArch,arch_id,arch_n;
	

	var arch_radius;
	var arch_height;
	
	var spoke = 1;

	var spokeCounter = 0;
	var radialPointsInner;	
	arch = 1;
	
		separationY = (leg_h/(hBars+1))/(arches+1);
		separationX = glass_w/(vBars+1);
			
			arch_id = (redraw?idPrefix+id:id)+"_arch_"+arch;
			arch_n = drawing.getElementById(arch_id);
			if(arch_n === null)
			{
				arch_n = drawing.createElementNS(svgNS,"path");
				arch_n.setAttribute("id",arch_id);
				
				arch_n.setAttribute("onmousemove","dragArch(evt)");							 	
				arch_n.setAttribute("onmouseup","dropArch(evt)");
				
				grp.appendChild(arch_n);
			}
			arch_n.setAttribute("class","grid");
		
			archRadiusX = gN(id+"_aw"+arch)/2;
			if(archRadiusX === 0)
			{
				archRadiusX = (separationX*(spokes-1))/2;
				s(id+"_aw"+arch,archRadiusX*2);
			}
			
			cy = glass_y + glass_h - (hBars*(leg_h/(hBars+1))) - (arch*separationY); 
			xStartArch = glass_x+separationX;;
			
			if(g("f_material") == "WOOD")
			{
				arch_radius = frameArch_radius;
				
				Yo = Math.sqrt(Math.pow(arch_radius,2)-Math.pow(cx-xStartArch,2)) + cy;
				computeCircleCenter(xStartArch,cy,cx,Yo-arch_radius,(xStartArch+(2*archRadiusX)),cy);
				arch_radius = R;
				trace("R="+R);
				
			}
			else
			{
				arch_height = (archRadiusX*2)*(arch_h/glass_w);		
				computeCircleCenter(xStartArch,cy,cx,cy-arch_height,(xStartArch+(2*archRadiusX)),cy);
				arch_radius = R;
			}
			radialPointsInner=getRadialPointsByHorzSegments(new Point(xStartArch,cy),
															new Point(	(xStartArch+(2*archRadiusX)),cy),
															new Point(Xo,Yo),
															arch_radius,
															spokes,
															true,true);
				
			
			d="M "+xStartArch+","+(cy)+ 
			  " A "+arch_radius+","+arch_radius+" 0 0,1 "+(xStartArch+(2*archRadiusX))+","+cy;
				
			if(applet)
			{
		
			//	registerArchElement(id,arch,cx,cy-1,archRadiusX*2,archRadiusY,thk,segType,redraw);					
				
			}
			trace("arch d="+d);
			arch_n.setAttribute("d",d);
			arch_n.getStyle().setProperty("stroke",color,"");
			arch_n.getStyle().setProperty("stroke-width",thk+"","");
			createDescription2(arch_n,"RADIUS: " + getDim(archRadiusX) + "   STOCK WIDTH: " + getDim(thk) + ".");

	
	var x1,y1,x2,y2,len,spoke_n,path,vBar;
	
			
		for(spoke=1;spoke <= spokes; spoke++)
		{
			
			spoke_n = drawing.getElementById(idPrefix+id+"_spoke_"+spoke);
			if(spoke_n === null)
			{
				spoke_n = drawing.createElementNS(svgNS,"path");
				spoke_n.setAttribute("id",idPrefix+id+"_spoke_"+spoke);
				spoke_n.setAttribute("class","grid");
				grp.appendChild(spoke_n);
			}
			
			vBar = drawing.getElementById(idPrefix+id+"_v"+spoke);
			if(vBar === null)
			{
				vBar = drawing.createElementNS(svgNS,"path");
				vBar.setAttribute("id",idPrefix+id+"_v"+spoke);
				vBar.setAttribute("class","grid");
				grp.appendChild(vBar);
			}
	
			spokeCounter++;
			
			path="M " + (radialPointsInner[spoke-1].x) + "," +(radialPointsInner[spoke-1].y) + 
					" L " + (radialPointsOuter[spoke-1].x) + "," + (radialPointsOuter[spoke-1].y);
			len = Math.sqrt(Math.pow(radialPointsInner[spoke-1].x-radialPointsOuter[spoke-1].x,2)+
							 Math.pow(radialPointsInner[spoke-1].y-radialPointsOuter[spoke-1].y,2));
			
			trace("spoke path="+path);
			spoke_n.setAttribute("d",path);
			spoke_n.getStyle().setProperty("stroke",color,"");
			spoke_n.getStyle().setProperty("stroke-width",thk+"","");
			createDescription2(spoke_n,"LENGTH: " + getDim(len) + "   STOCK WIDTH: " + getDim(thk) +".");

			path="M " + (radialPointsInner[spoke-1].x) + "," +(radialPointsInner[spoke-1].y) + 
					" L " + (radialPointsInner[spoke-1].x) + "," + (glass_y+glass_h);
					
			len = (glass_y+glass_h) - radialPointsInner[spoke-1].y;
			vBar.setAttribute("d",path);
			vBar.getStyle().setProperty("stroke",color,"");
			vBar.getStyle().setProperty("stroke-width",thk+"","");
			createDescription2(vBar,"LENGTH: " + getDim(len) + "   STOCK WIDTH: " + getDim(thk) +".");

		}



		
		var hBar = 1;
		var hBarSep = leg_h/(hBars+1);
		for(;hBar <= hBars; hBar++)
		{
			arch_id = (redraw?idPrefix+id:id)+"_h"+hBar;
			arch_n = drawing.getElementById(arch_id);
			if(arch_n === null)
			{
				arch_n = drawing.createElementNS(svgNS,"path");
				arch_n.setAttribute("id",arch_id);
				
				//arch_n.setAttribute("onmousemove","dragArch(evt)");							 	
				//arch_n.setAttribute("onmouseup","dropArch(evt)");
				
				grp.appendChild(arch_n);
			}
			arch_n.setAttribute("class","grid");
			arch_n.getStyle().setProperty("stroke",color,"");
			
			y = glass_y+arch_h+(hBar*hBarSep);
			
			path = "M " + glass_x +","+ y + " l " + (glass_w)+",0";
			
			arch_n.setAttribute("d",path);
			arch_n.getStyle().setProperty("stroke",color,"");
			arch_n.getStyle().setProperty("stroke-width",thk+"","");
			createDescription2(arch_n,"LENGTH: " + getDim(glass_w) + "   STOCK WIDTH: " + getDim(thk) +".");
		}
			
	if(hBars > 0)
	{
		drawHorizontalBars(id,grp,glass_x,glass_y+glass_h,glass_w,leg_h,hBars,color,thk,false,redraw);
	
	}
	if(appendGrp == true)
	{
		drawing.getElementById("window").appendChild(grp);
	}
	
}catch(e)
{
	alertUser("Exception:  drawSegHubGrille('"+id+"'"+glass_xP+","+glass_yP+","+glass_wP+","+arch_hP+","+ leg_hP+","+ inset+","+ vBars+","+ hBars +","+ thk +",'"+ color+"')");
	alertUser(e);
	trace(e);
}		
}

function drawGothicGrille(id, glass_xP,glass_yP,glass_wP,glass_hP, leg_hP, hBars, inset, spokes, thk, color, segType, redraw)
{
try{
	trace("drawGothicGrille('"+id+"'"+glass_xP+","+glass_yP+","+glass_wP+","+glass_hP+","+ spokes+",'"+ thk +",'"+ color+"','"+ segType+"',"+redraw+")");
	var horzAdj = computeHorzOffset(segType=='F'?glass_wP:glass_wP*2,glass_hP,inset);
	var glass_x = segType == 'R' ? glass_xP + inset : glass_xP + inset + horzAdj;
	var glass_y = glass_yP + inset;
	
	var glass_w = segType == 'F' ? glass_wP - (2*(inset+horzAdj)) : glass_wP - horzAdj - (2*inset);
	
	var glass_h = leg_hP === 0 ? glass_hP -(2*inset) : glass_hP - inset;
	var leg_h = leg_hP === 0 ? 0 : leg_hP - inset;

	var idPrefix = g("f_idprefix");

	createClipPattern(id);
	var grp = drawing.getElementById(id+"grille");
	var appendGrp = false;
	if(grp === null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id+"grille");
		grp.getStyle().setProperty("clip-path","url(#"+idPrefix+"clip_"+id+")","");
		appendGrp = true;
		//drawing.getElementById("window").appendChild(grp);
	}


	if(applet && !redraw)
	{
		applet.registerLite(idPrefix+id,glass_x+"",glass_y+"",glass_w+"",glass_h+"","");
		var elLite = drawing.getElementById(id);
		if(elLite !== null)
		{
			elLite.setAttribute("onmousemove","dragArch(evt)");							 	
			elLite.setAttribute("onmouseup","dropArch(evt)");
		}	
	}
	

	var radiusX = segType == 'F'?glass_w/2:glass_w;
	var radiusY = glass_h;
	var cx = segType == 'R'? glass_x : glass_x+ radiusX;
	var cy = glass_y+glass_h;
	
	var lites,radius,radians,radianStart,radiansA1,radianStartA1;
	var x,y;
	
	switch(segType)
	{
		case 'F':
			computeCircleCenter(glass_x,cy,cx,glass_y,glass_x+(radiusX*2),cy);
			break;
		case 'L':
			computeCircleCenter(glass_x,cy,cx,glass_y,glass_x+(radiusX*2),cy);
			break;
		case 'R':
			computeCircleCenter(glass_x-radiusX,cy,glass_x,glass_y,glass_x+radiusX,cy);
			break;
		default:
			break;
	}

	var frameArch_center = new Point(Xo,Yo);
	var frameArch_radius = R;
		
	var sep = glass_w/(spokes+1);
	var spoke_x = glass_x;
	var dL,dR;
	var spoke = 1;
	for(;spoke <= spokes; spoke++)
	{
			var spoke_nL = drawing.getElementById(id+"_spoke_"+spoke+"L");
			if(spoke_nL === null)
			{
				spoke_nL = drawing.createElementNS(svgNS,"path");
				spoke_nL.setAttribute("id",id+"_spoke_"+spoke+"L");
				spoke_nL.setAttribute("class","grid");
				spoke_nL.getStyle().setProperty("stroke",color,"");
				spoke_nL.getStyle().setProperty("stroke-width",thk+"","");
				
				grp.appendChild(spoke_nL);
			}
	
			var spoke_nR = drawing.getElementById(id+"_spoke_"+spoke+"R");
			if(spoke_nR === null)
			{
				spoke_nR = drawing.createElementNS(svgNS,"path");
				spoke_nR.setAttribute("id",id+"_spoke_"+spoke+"R");
				spoke_nR.setAttribute("class","grid");
				spoke_nR.getStyle().setProperty("stroke",color,"");
				spoke_nR.getStyle().setProperty("stroke-width",thk+"","");
				grp.appendChild(spoke_nR);
			}
			spoke_x+=sep;
			dL = "M "+(spoke_x)+","+(glass_y+glass_h)+" a "+R+","+R+" 180 0,0 -"+(glass_w/2)+",-"+glass_h;
			dR = "M "+(spoke_x)+","+(glass_y+glass_h)+" a "+R+","+R+" 0 0,1 "+(glass_w/2)+",-"+glass_h;
			
			if(leg_h > 0)
			{
				dR+="M "+(spoke_x)+","+(glass_y+glass_h)+" l 0,"+ leg_h;
			}
			
			spoke_nL.setAttribute("d",dL);
			spoke_nR.setAttribute("d",dR);
			
			if(applet && !redraw)
			{
					applet.registerVertElement( idPrefix+id+"_spoke_"+spoke+"R",
										idPrefix + id,
										(spoke_x-(thk/2))+"",
										thk+"",
										"");
			}
	}
	
	if(hBars > 0)
	{
		drawHorizontalBars(id,grp,glass_x,glass_y+glass_h,glass_w,leg_h,hBars,color,thk,true,redraw);
	
	}
	if(appendGrp == true)
	{
		drawing.getElementById("window").appendChild(grp);
	}
}catch(e)
{
	alertUser("Exception:  drawGothicGrille('"+id+"'"+glass_xP+","+glass_yP+","+glass_wP+","+glass_hP+","+ spokes+",'"+ thk +",'"+ color+"','"+ segType+"',"+redraw+")");
	alertUser(e);
	trace(e);
}
}

function createScallop(idGlass,nScallop,grp,r,p1,p2,color,thk,redraw)
{
	trace("createScallop('"+idGlass+"',"+nScallop+",grp,"+r+",p("+p1.x+","+p1.y+"),p("+p2.x+","+p2.y+","+color+"',"+thk+")");

try{
	var idPrefix = g("f_idprefix");
			var scallop_id = (redraw?idPrefix+idGlass:idGlass)+"scallop_"+nScallop;
			var scallop = drawing.getElementById(scallop_id);
			if(scallop == null)
			{
			trace("creating scallop "+ nScallop);
				scallop = drawing.createElementNS(svgNS,"path");
				scallop.setAttribute("id",scallop_id);
				scallop.setAttribute("class","grid");
				scallop.getStyle().setProperty("stroke",color,"");
				scallop.getStyle().setProperty("stroke-width",thk,"");
				grp.appendChild(scallop);
			}
			
			var d="M " + p1.x + "," + p1.y + " A "+ r + "," + r + " 0 0,0 " + p2.x + "," + p2.y;
			trace("scallop d="+d);
			scallop.setAttribute("d",d);
}
catch(e)
{
	alertUser("Exception:  createScallop('"+idGlass+"',"+nScallop+",grp,"+r+",p("+p1.x+","+p1.y+"),p("+p2.x+","+p2.y+")");
	alertUser(e);
	trace(e);
}				
}

function registerArchElement(id,grp,n,xC,y,w,h,thk,segType,redraw)
{
trace("registerArchElement('"+id+"',"+n+","+xC+","+y+","+w+","+h+","+thk+",'"+segType+"',"+redraw+")");

	whRatio = w/h;
	
	var archId = id+"_arch_"+n;
	var idPrefix = g("f_idprefix");
//	var grp = drawing.getElementById(id+"_grid");


	if(segType == 'F' || segType == 'L')
	{
		applet.registerVertElement( idPrefix+id+"_arch_"+n,
										idPrefix + id,
										(xC - (w/2)-(thk/2))+"",
										thk+"",
										"");
	}
	if(segType == 'F' || segType == 'R')
	{
		applet.registerVertElement( idPrefix+id+"_arch_"+n,
										idPrefix + id,
										(xC + (w/2)-(thk/2))+"",
										thk+"",
										"");
	}
				

	var script = 
		 "moveArch('"+id+"',"+n+",%X%,"+xC+","+y+","+whRatio+","+thk+",'"+segType+"');";
	var m = null;
	var append = false;
	if(segType == 'F' || segType == 'L')
	{
		m = drawing.getElementById((redraw?idPrefix:"")+archId+"_left");
		if(m===null)
		{
			m = drawing.createElementNS(svgNS,"rect");
			m.setAttribute("id",(redraw?idPrefix:"")+archId+"_left");
			append = true;
		}
	
		m.setAttribute("class","draghide");
		m.setAttribute("x",(xC - (w/2)-(thk/2)));
		
		m.setAttribute("y",y-thk);
		m.setAttribute("width",thk);
		m.setAttribute("height",thk);

		m.setAttribute("onmousedown","startDragArch(evt)");							 	
		m.setAttribute("onmousemove","dragArch(evt)");							 	
		m.setAttribute("onmouseup","dropArch(evt)");	
		m.setAttribute("onmouseover","showHandle('"+idPrefix+archId+"_left',true);");
		m.setAttribute("onmouseout","showHandle('"+idPrefix+archId+"_left',false);");

		if(append)
		{
			grp.appendChild(m);
		}
		
		applet.registerVertElement(idPrefix+archId+"_left",
								idPrefix+id,
								(xC - (w/2)-(thk/2))+"", 	
								thk+"",
								script);
	}
	append = false;
	if(segType == 'F' || segType == 'L')
	{
							
		m = drawing.getElementById((redraw?idPrefix:"")+archId+"_right");
		
		if(m===null)
		{
			m = drawing.createElementNS(svgNS,"rect");
			m.setAttribute("id",(redraw?idPrefix:"")+archId+"_right");
			append = true;
		}
	
		m.setAttribute("class","draghide");
		m.setAttribute("x",(xC + (w/2)-(thk/2)));
		
		m.setAttribute("y",y-thk);
		m.setAttribute("width",thk);
		m.setAttribute("height",thk);
		m.setAttribute("onmousedown","startDragArch(evt)");							 	
		m.setAttribute("onmousemove","dragArch(evt)");							 	
		m.setAttribute("onmouseup","dropArch(evt)");	
		m.setAttribute("onmouseover","showHandle('"+idPrefix+archId+"_right',true);");
		m.setAttribute("onmouseout","showHandle('"+idPrefix+archId+"_right',false);");
	
		if(append)
		{
			grp.appendChild(m);
		}

	
		applet.registerVertElement(idPrefix+archId+"_right",
								idPrefix+id,
								(xC + (w/2)-(thk/2))+"", 	
								thk+"",
								script);							
	}
}


function moveArch(id,n,x,xC,y,whRatio,thk,segType)
{
trace("moveArch("+id+","+n+","+x+","+xC+","+whRatio+")");
	var r = (x+thk) - xC;
	
	var w = Math.abs(r*2);
	var h = w/whRatio;


	s(id+"_aw"+n, w);
	s(id+"_ah"+n, h);
	
//	registerArchElement(id,n,xC,y,w,h,thk,segType,true);
}

function showHandle(id,show)
{
	if(applet===null)
		return;
	var el = drawing.getElementById(id);
	if(el != null)
	{	
		el.setAttribute("class",show?"dragshow":"draghide");
	}
}

function startDragArch(evt)
{
	if(applet===null)
		return;
	
	var rightClick =  (evt.which && evt.which == 3)
						||
						(evt.button && evt.button == 2);

	var el = evt.getTarget();
	dragObj = el;
	dragOffset = getX(evt) - el.getAttribute("x");  
	dragType = "A";
	
	applet.startDragX(el.id,"");
	dragObj.setAttribute("class","dragshow");

}



function dragArch(evt)
{
	if(dragObj === null)
		return;
		

	dragObj.setAttribute("x",getX(evt)-dragOffset);
	applet.dragX(dragObj.id);
}



function dropArch(evt)
{
	if(dragObj === null)
		return;
		


	dragObj.setAttribute("x",getX(evt)-dragOffset);
	applet.dropX(dragObj.id);
	dragObj = null;
	dragOffset = 0;
	dragType = "";	
}



