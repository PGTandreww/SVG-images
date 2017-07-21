





/**
 * Draw ellipse glass
 * 
 * @param id		String id
 * @param sashId	String id of containing sash/frame
 * @param x			decimal x coordinate of containing rectangle
 * @param y			decimal y coordinate of containing rectangle
 * @param d			decimal diameter/width 
 * @param f			decimal frame thickness
 * @param v			decimal visible glass inset
 * @return
 */
function initGlassEllipse(id,sashId,x, y, w, h, f /*inset*/, v /*hidden glass inset*/)
{
try
{
trace("initGlassEllipse('"+id+"','"+sashId+"',"+x+","+ y+","+ w +"," +h +","+ f+","+ v+")");
	var grp = drawing.getElementById(id);
	var idPrefix = g("f_idprefix");
	if(grp === null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id);
		drawing.getElementById("window").appendChild(grp);
	}
sss	
	
	var ellipse = drawing.getElementById(id+"_pane");
	if(ellipse === null)
	{
		trace("creating glass");
	
		ellipse = drawing.createElementNS(svgNS,"path");
		ellipse.setAttribute("id",id+"_pane");
		ellipse.setAttribute("class","glass");
		ellipse.setAttribute("d","M 0,0");
		ellipse.setAttribute("onmouseover","expose(evt,'"+idPrefix+sashId+"',true)");
		ellipse.setAttribute("onmouseout","expose(evt,'"+idPrefix+sashId+"',false)");
			//These attributes don't apply to a <path>, but they feed the grid functions
		ellipse.setAttribute("x",x);
		ellipse.setAttribute("y",y);
		ellipse.setAttribute("width",w);
		ellipse.setAttribute("height",h);
		if(g("f_imgType")=="U1" )
	{
		ellipse.getStyle().setProperty("fill-opacity","0","");
	}
		grp.appendChild(ellipse);
	}
	var t,tText;
	if(g("f_glass") == "TEMPERED")
	{
		t = drawing.getElementById(id+"_pane_t");
		if(t == null)
		{
			t = drawing.createElementNS(svgNS,"text");
			t.setAttribute("id",id+"_pane_t");
			t.setAttribute("class","glass");
   			tText = drawing.createTextNode("T");
    		t.appendChild(tText);
			grp.appendChild(t);			
		}
		t.setAttribute("x",x+w/2);
		t.setAttribute("y",y+h-2);
	}


	var path = 
		" M " + (x+f) + "," + (y+(h/2)) +
		" A " + ((w-(2*f))/2) +","+((h-(2*f))/2)+" 0 1,0 "+ (x+f) + "," + (y+(h/2)-.001)+
		" l 0,.001";
	
	trace("ellipse path="+path);	  
	ellipse.setAttribute("d",path);
	if(g("f_tn")!="true")
	{
		createDescription(id+"_pane", "GLASS ... base WIDTH: " + getDim(w-f)  +"  HEIGHT: " + getDim(h-f)  + "  VISSIBLE: " + getDim(w-f-v) + "," + getDim(h-f-v) + ".");
	}

}	
catch(e)
{
	alertUser("Exception: initGlassEllipse('"+id+"','"+sashId+"',"+x+","+ y+","+ w +","+ h +","+ f+","+ v+")");

	alertUser(e);
	trace(e);
}	
} 



/**
 * Draw elliptical frame
 * 
 * @param id		String id
 * @param x			decimal x coordinate of containing rectangle
 * @param y			decimal y coordinate of containing rectangle
 * @param w			decimal width  
 * @param h			decimal height 
 * @param f			decimal frame thickness
 * @param color		String web color code
 * @return
 */
function initEllipseFrame(id, x, y, w, h, f, color)
{
try
{
trace("initEllipseFrame('"+id+"',"+x+","+ y+","+ w +","+h+","+ f+",'"+ color+"')");

	var desc = "";
	// frame group
	var grp = drawing.getElementById(id);
	if(grp === null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id);
		
		drawing.getElementById("window").appendChild(grp);
	}

	var ellipseT = drawing.getElementById(id+"_frame_top");
	if(ellipseT === null)
	{
	trace("creating frame top");
		ellipseT = drawing.createElementNS(svgNS,"path");
		ellipseT.setAttribute("id",id+"_frame_top");
		ellipseT.setAttribute("class","frame");
		ellipseT.setAttribute("d","M 0,0");
		grp.appendChild(ellipseT);
	}
	var ellipseB = drawing.getElementById(id+"_frame_bottom");
	if(ellipseB === null)
	{
	trace("creating frame bottom");
		ellipseB = drawing.createElementNS(svgNS,"path");
		ellipseB.setAttribute("id",id+"_frame_bottom");
		ellipseB.setAttribute("class","frame");
		ellipseB.setAttribute("d","M 0,0");
		grp.appendChild(ellipseB);
	}

	var pathT = 
		"M " +	(x) + "," + (y+(h/2)) +
		" A " + (w/2) +","+(h/2)+" 0 0,1 "+ (x+w) + "," + (y+(h/2)) +
		" l -"+f+ ",0 " +
		" A " + ((w-(2*f))/2) +","+((h-(2*f))/2)+" 0 0,0 "+ (x+f) + "," + (y+(h/2))+
		" l -" + (f) + ",0";

	var pathB = 
		"M " +	(x) + "," + (y+(h/2)) +
		" A " + (w/2) +","+(h/2)+" 0 0,0 "+ (x+w) + "," + (y+(h/2)) +
		" l -"+f+ ",0 " +
		" A " + ((w-(2*f))/2) +","+((h-(2*f))/2)+" 0 0,1 "+ (x+f) + "," + (y+(h/2))+
		" l -" + (f) + ",0";
	
			  
	trace("ellipse frame top path="+pathT);	  
	ellipseT.setAttribute("d",pathT);
	ellipseT.getStyle().setProperty("fill",color,"");
	
	trace("ellipse frame bot path="+pathB);	  
	ellipseB.setAttribute("d",pathB);
	ellipseB.getStyle().setProperty("fill",color,"");

	if(g("f_tn")!="true")
	{
		createDescription(id,"FRAME ... base WIDTH: " + getDim(w)  +"  HEIGHT: " + getDim(h)  + "  THICKNESS: " + getDim(f) + "   MITRE: 67.5 degrees.");
	}

}	
catch(e)
{
	alertUser("Exception:  initEllipseFrame('"+id+"',"+x+","+ y+","+ w +","+ h +","+ f+",'"+ color+"')");
	alertUser(e);
	trace(e);
}	
} 





/**
 * Draw 3-centered arch glass
 * 
 * @param id		String id
 * @param sashId	String id of containing sash/frame
 * @param x			decimal x coordinate of containing rectangle
 * @param y			decimal y coordinate of containing rectangle
 * @param w			decimal width  
 * @param h			decimal height 
 * @param hleg		decimal height legs 
 * @param inset		decimal visible glass inset
 * @param segType	F=full, L=left qtr-round, R=right qtr-round
 * @return
 */
function initGlass3CentredArch(id, idFrame, xParm, yParm, wParm, hParm, hlegParm, inset, segType)
{
// segType: F=full, L=left half, R=right half

	trace("initGlass3CentredArch('"+id+"','"+idFrame+"',"+xParm+","+ yParm+","+ wParm+","+ hParm+","+ hlegParm+","+ inset+",'"+segType+"'");

try{	

	var x = xParm+inset;
	var y = yParm + inset;
	var w = segType == 'F' ? wParm - (2*inset) : wParm*2 - (4*inset);
	var h = hlegParm === 0 ? hParm-(2*inset) : hParm - inset;
	var h2 = hlegParm === 0 ? 0 : hlegParm - inset;
	


	var grp = drawing.getElementById(id);
	var idPrefix = g("f_idprefix");
	if(grp === null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id);
		drawing.getElementById("window").appendChild(grp);
	}
	
	
	var gls = drawing.getElementById(id+"_pane");
	if(gls === null)
	{
		trace("creating glass");
	
		gls = drawing.createElementNS(svgNS,"path");
		gls.setAttribute("id",id+"_pane");
		gls.setAttribute("class","glass");
		gls.setAttribute("d","M 0,0");
		gls.setAttribute("onmouseover","expose(evt,'"+idPrefix+idFrame+"',true)");
		gls.setAttribute("onmouseout","expose(evt,'"+idPrefix+idFrame+"',false)");
			//These attributes don't apply to a <path>, but they feed the grid functions
		gls.setAttribute("x",x);
		gls.setAttribute("y",y);
		gls.setAttribute("width",segType=="F"?w:w/2);
		gls.setAttribute("height",h+h2);
		gls.setAttribute("shape","3CTRARC");
		if(g("f_imgType")=="U1" )
	{
		gls.getStyle().setProperty("fill-opacity","0","");
	}
		
		grp.appendChild(gls);
	}

	var r1,r2,r3,af,afBisectR,afAngle,afBisectX,afBisectY,gAngle,hAngle,hHyp,hX,fPoint,gPoint,hPoint,aAngle,jAngle,jPoint,kPoint,path;
	
		
with(Math)
{

	aAngle = Math.atan2(h,w/2);
	
	r2 = (w/2) - h;
	fPoint = new Point(x+(w/2) - (Math.cos(aAngle)*r2), (y+Math.sin(aAngle)*r2));
	 
	afBisectR = (sqrt(pow(fPoint.x-x,2)+pow(y+h-fPoint.y,2)))/2; 
	trace("afBisectR="+afBisectR);
	afBisectX = cos(aAngle)*afBisectR + x;	
	afBisectY = y+h-sin(aAngle)*afBisectR;
	
	gPoint=new Point(x+w/2, afBisectY + tan((PI/2)-aAngle)*(x+(w/2)-afBisectX));
	trace("gPoint=" + gPoint.x+","+gPoint.y);
	r1 = y-gPoint.y;
	trace("r1="+r1);
	
	
	gAngle = atan2(gPoint.x-afBisectX,gPoint.y-afBisectY);
	hPoint = new Point(x+w/2-tan(gAngle)*(gPoint.y-h-y),y+h);
	trace("hPoint="+hPoint.x+","+hPoint.y);
	r3 = hPoint.x - x;
	hAngle = (PI/2) - gAngle;

	jPoint = new Point(hPoint.x - sin(gAngle)*r3,hPoint.y-cos(gAngle)*r3);
	kPoint = new Point(x+w-(jPoint.x-x), jPoint.y);
}

if(h2===0)
{
	switch(segType)
	{
		case 'F':
		 	path = 
			" M " + (x) + "," + (y+h) +
			" A " + (r3) +","+(r3)+" 0 0,1 "+ (jPoint.x) + "," + (jPoint.y)+
			" A " + (r1) +","+(r1)+" 0 0,1 "+ (kPoint.x) + "," + (kPoint.y)+
			" A " + (r3) +","+(r3)+" 0 0,1 "+ (x+w) + "," + (y+h)+
			" l -"+w+",0";
			break;
		case 'R':
		 	path = 
			" M " + (x) + "," + (y) +
			" A " + (r1) +","+(r1)+" 0 0,1 "+ (kPoint.x-(w/2)) + "," + (kPoint.y)+
			" A " + (r3) +","+(r3)+" 0 0,1 "+ (x+(w/2)) + "," + (y+h)+
			" l -"+(w/2)+",0"+
			" l 0,-"+h;
			break;
		
		case 'L':
		trace("w="+w);
		 	path = 
			" M " + (x) + "," + (y+h) +
			" A " + (r3) +","+(r3)+" 0 0,1 "+ (jPoint.x) + "," + (jPoint.y)+
			" A " + (r1) +","+(r1)+" 0 0,1 "+ (x+w/2) + "," + (y)+
			" l 0,"+h+
			" l -"+(w/2)+",0";
			break;
		default:
			break;
		}	
	
}
else
{
	switch(segType)
	{
		case 'F':
		 	path = 
			" M " + (x) + "," + (y+h) +
			" A " + (r3) +","+(r3)+" 0 0,1 "+ (jPoint.x) + "," + (jPoint.y)+
			" A " + (r1) +","+(r1)+" 0 0,1 "+ (kPoint.x) + "," + (kPoint.y)+
			" A " + (r3) +","+(r3)+" 0 0,1 "+ (x+w) + "," + (y+h)+
			" l 0,"+h2+
			" l -"+w+",0"+
			" l 0,-"+h2;
			break;
		case 'R':
		 	path = 
			" M " + (x) + "," + (y) +
			" A " + (r1) +","+(r1)+" 0 0,1 "+ (kPoint.x-(w/2)) + "," + (kPoint.y)+
			" A " + (r3) +","+(r3)+" 0 0,1 "+ (x+(w/2)) + "," + (y+h)+
			" l 0,"+h2+
			" l -"+(w/2)+",0"+
			" l 0,-"+(h+h2);
			break;
		
		case 'L':
		 	path = 
			" M " + (x) + "," + (y+h) +
			" A " + (r3) +","+(r3)+" 0 0,1 "+ (jPoint.x) + "," + (jPoint.y)+
			" A " + (r1) +","+(r1)+" 0 0,1 "+ (x+w/2) + "," + (y)+
			" l 0,"+(h+h2)+
			" l -"+w/2+",0"+
			" l 0,-"+(h2);
			break;
		default:
			break;
		}	
}
trace("glass path="+path);
	gls.setAttribute("d",path);
	
	if(g("f_tn")!="true")
	{
		createDescription(id+"_pane", "GLASS ... base WIDTH: " + getDim(w-inset)  +"  HEIGHT: " + getDim(h-inset) + ".");
	}
	

}	
catch(e)
{
	alertUser("Exception: initGlass3CentredArch('"+id+"','"+idFrame+"',"+xParm+","+ yParm+","+ wParm+","+ hParm+","+ hlegParm+","+ inset+",'"+segType+"'");

	alertUser(e);
	trace(e);
}	
} 


/**
 * Draw 3-centered arch frame (mitered)
 * 
 * @param id		String id
 * @param x			decimal x coordinate of containing rectangle
 * @param y			decimal y coordinate of containing rectangle
 * @param w			decimal width  
 * @param h			decimal height 
 * @param hleg		decimal height legs 
 * @param inset		decimal frame inset
 * @param color		String web color code
 * @param segType	F=full, L=left qtr-round, R=right qtr-round
 * @return
 */
function initFrame3CentredArch(id, xParm, yParm, wParm, hParm, hlegParm, inset, color, segType)
{
// segType: F=full, L=left half, R=right half

	trace("initFrame3CentredArch('"+id+"',"+xParm+","+ yParm+","+ wParm+","+ hParm+","+ hlegParm+","+ inset+",'"+color+"','"+segType+"')");

try{	

	var x = xParm;
	var xi = xParm+inset;
	var y = yParm;
	var yi = yParm + inset;
	var w = segType == 'F' ? wParm : wParm*2;
	var wi = segType == 'F' ? wParm - (2*inset) : wParm*2 - (2*inset);
	var h = hParm;
	var hi = hParm - inset;
	var h2 = hlegParm;
	var h2i = hlegParm;
	


	var grp = drawing.getElementById(id);
	var idPrefix = g("f_idprefix");
	if(grp === null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id);
		drawing.getElementById("window").appendChild(grp);
	}
	
	
	var frame = drawing.getElementById(id+"_frame");
	if(frame === null)
	{
		frame = drawing.createElementNS(svgNS,"path");
		frame.setAttribute("id",id+"_frame");
		frame.setAttribute("class","frame");
		frame.setAttribute("d","M 0,0");
		
		grp.appendChild(frame);
	}
	
	var sill = drawing.getElementById(id+"_sill");
	if(sill === null)
	{
		sill = drawing.createElementNS(svgNS,"path");
		sill.setAttribute("id",id+"_sill");
		sill.setAttribute("class","frame");
		sill.setAttribute("d","M 0,0");
		
		grp.appendChild(sill);
	}

	var siderail,siderail2;
	if(!(segType == "F" && h2 == 0))
	{
		siderail = drawing.getElementById(id+"_siderail1");
		if(siderail === null)
		{
			siderail = drawing.createElementNS(svgNS,"path");
			siderail.setAttribute("id",id+"_siderail1");
			siderail.setAttribute("class","frame");
			siderail.setAttribute("d","M 0,0");
		
			grp.appendChild(siderail);
		}
		if(h2 > 0)
		{
			siderail2 = drawing.getElementById(id+"_siderail2");
			if(siderail2 === null)
			{
				siderail2 = drawing.createElementNS(svgNS,"path");
				siderail2.setAttribute("id",id+"_siderail2");
				siderail2.setAttribute("class","frame");
				siderail2.setAttribute("d","M 0,0");
		
				grp.appendChild(siderail2);
			}
		}
	}
	
	var r1,r1i,r2,r2i,r3,r3i,afBisectR,afBisectX,afBisectY,aAngle,aAngle,gAngle,hAngle,hHyp,hX,fPoint,gPoint,hPoint,jAngle,jPoint,kPoint,jiPoint,kiPoint,aPoint,bPoint,path;
	var pathSill = null;
	var pathRail = null;
	var pathRail2 = null;
	
	var center1;

with(Math)
{
	// outer
	aAngle = Math.atan2(h,w/2);
	
	r2 = (w/2) - h;
	fPoint = new Point(x+(w/2) - (Math.cos(aAngle)*r2), (y+Math.sin(aAngle)*r2));
	
	afBisectR = (sqrt(pow(fPoint.x-x,2)+pow(y+h-fPoint.y,2)))/2;
	afBisectX = cos(aAngle)*afBisectR + x;	
	afBisectY = y+h-sin(aAngle)*afBisectR;

	gPoint=new Point(w/2, afBisectY + tan((PI/2)-aAngle)*(x+(w/2)-afBisectX));
	r1 = y-gPoint.y;
	trace("r1="+r1);
	gAngle = atan2(gPoint.x-afBisectX,gPoint.y-afBisectY);
	hPoint = new Point(x+w/2-tan(gAngle)*(gPoint.y-h-y),y+h);

	r3 = hPoint.x - x;
	trace("r3="+r3);
	
	jPoint = new Point(hPoint.x - sin(gAngle)*r3,hPoint.y-cos(gAngle)*r3);
	kPoint = new Point(segType=="R"?x+w/2-(jPoint.x-x):x+w-(jPoint.x-x), jPoint.y);
		
	// inner
	aAngle = Math.atan2(hi,wi/2);
	
	r2i = (wi/2) - hi;
	fPoint = new Point(x+(w/2) - (Math.cos(aAngle)*r2i), (yi+Math.sin(aAngle)*r2i));
	
	afBisectR = (sqrt(pow(fPoint.x-xi,2)+pow(yi+hi-fPoint.y,2)))/2;
	afBisectX = cos(aAngle)*afBisectR + xi;	
	afBisectY = y+h-sin(aAngle)*afBisectR;

	gPoint=new Point(w/2, afBisectY + tan((PI/2)-aAngle)*(x+(w/2)-afBisectX));
	r1i = yi-gPoint.y;
	trace("r1i="+r1i);
	gAngle = atan2(gPoint.x-afBisectX,gPoint.y-afBisectY);
	hPoint = new Point(x+w/2-tan(gAngle)*(gPoint.y-h-y),y+h);
	r3i = hPoint.x - xi;

	jiPoint = new Point(hPoint.x - sin(gAngle)*r3i,hPoint.y-cos(gAngle)*r3i);
	kiPoint = new Point(segType=="R"?x+w/2-(jiPoint.x-x):x+w-(jiPoint.x-x), jiPoint.y);

	llPoint = new Point(hPoint.x-(cos(atan2(inset,hPoint.x-xi))*r3i),hPoint.y-inset); // lower left
	lrPoint = segType == "R" ?new Point(x+(w/2)-(llPoint.x-x),hPoint.y-inset):new Point(x+w-(llPoint.x-x),hPoint.y-inset); 
			
	ulPoint = new Point(x+inset,gPoint.y-sqrt(pow(r1i,2)-pow(inset,2))); // upper left, used only if segType=R
	urPoint = new Point(x+(w/2)-inset, gPoint.y-sqrt(pow(r1i,2)-pow(inset,2)));  // upper right, used only if segType=L
			
}
 
if(h2===0)
{
	switch(segType)
	{
		case 'F':
		 	path = 
			" M " + (x) + "," + (y+h) +
			" A " + (r3) +","+(r3)+" 0 0,1 "+ (jPoint.x) + "," + (jPoint.y)+
			" A " + (r1) +","+(r1)+" 0 0,1 "+ (kPoint.x) + "," + (kPoint.y)+
			" A " + (r3) +","+(r3)+" 0 0,1 "+ (x+w) + "," + (y+h)+
			" L "+lrPoint.x+","+lrPoint.y +
			" A " + (r3i) +","+(r3i)+" 0 0,0 "+ (kiPoint.x) + "," + (kiPoint.y)+
			" A " + (r1) +","+(r1)+" 0 0,0 "+ (jiPoint.x) + "," + (jiPoint.y)+
			" A " + (r3i) +","+(r3i)+" 0 0,0 "+ (llPoint.x) + "," + (llPoint.y)+
			" L " + (x) + "," + (y+h);
			
			pathSill = "M "+ (x) +","+(y+h)+
					" l "+w+",0" +
					" L "+lrPoint.x+","+lrPoint.y+
					" L "+llPoint.x+","+llPoint.y+
					" L "+ (x) +","+(y+h);
			break;
		case 'R':
		 	path = 
			" M " + (x) + "," + (y) +
			" A " + (r1) +","+(r1)+" 0 0,1 "+ (kPoint.x) + "," + (kPoint.y)+
			" A " + (r3) +","+(r3)+" 0 0,1 "+ (x+(w/2)) + "," + (y+h)+
			" L "+lrPoint.x+","+lrPoint.y +
			" A " + (r3i) +","+(r3i)+" 0 0,0 "+ (kiPoint.x) + "," + (kiPoint.y)+
			" A " + (r1i) +","+(r1i)+" 0 0,0 "+ (ulPoint.x) + "," + (ulPoint.y)+
			" L " + (x) + "," + (y);
			
			pathSill = "M "+ (x) +","+(y+h)+
					" l "+(w/2)+",0" +
					" L "+lrPoint.x+","+lrPoint.y+
					" L "+(x+inset)+","+(y+h-inset)+
					" L "+ (x) +","+(y+h);

			
			pathRail = "M "+(x)+","+(y)+
					   	" l 0,"+(h)+
						" l "+inset+",-"+inset+
						" L "+(ulPoint.x)+","+ulPoint.y+
						" L "+(x)+","+(y);
			
			break;
		
		case 'L':
		 	path = 
			" M " + (x) + "," + (y+h) +
			" A " + (r3) +","+(r3)+" 0 0,1 "+ (jPoint.x) + "," + (jPoint.y)+
			" A " + (r1) +","+(r1)+" 0 0,1 "+ (x+w/2) + "," + (y)+
			" L "+urPoint.x+","+urPoint.y+
			" A " + (r1i) +","+(r1i)+" 0 0,0 "+ (jiPoint.x) + "," + (jiPoint.y)+
			" A " + (r3i) +","+(r3i)+" 0 0,0 "+ (llPoint.x) + "," + (llPoint.y)+
			" L " + (x) + "," + (y+h);
			
			pathSill = "M "+ (x) +","+(y+h)+
					" l "+(w/2)+",0" +
					" L "+(x+(w/2)-inset)+","+(y+h-inset)+
					" L "+llPoint.x+","+llPoint.y+
					" L "+ (x) +","+(y+h);
			
			pathRail = "M "+(x+(w/2))+","+(y)+
					   	" l 0,"+(h)+
						" l -"+inset+",-"+inset+
						" L "+(urPoint.x)+","+urPoint.y+
						"M "+(x+(w/2))+","+(y);
			
			break;
		default:
			break;
		}	
}
else
{
	switch(segType)
	{
		case 'F':
		
		 	path = 
			" M " + (x) + "," + (y+h) +
			" A " + (r3) +","+(r3)+" 0 0,1 "+ (jPoint.x) + "," + (jPoint.y)+
			" A " + (r1) +","+(r1)+" 0 0,1 "+ (kPoint.x) + "," + (kPoint.y)+
			" A " + (r3) +","+(r3)+" 0 0,1 "+ (x+w) + "," + (y+h)+
			" l  -"+inset+",0"+
			" A " + (r3i) +","+(r3i)+" 0 0,0 "+ (kiPoint.x) + "," + (kiPoint.y)+
			" A " + (r1) +","+(r1)+" 0 0,0 "+ (jiPoint.x) + "," + (jiPoint.y)+
			" A " + (r3i) +","+(r3i)+" 0 0,0 "+ (x+inset) + "," + (y+h)+
			" L " + (x) + "," + (y+h);
			
			pathRail = "M "+(x)+","+(y+h)+
					   	" l 0,"+h2+
						" l "+inset+",-"+ inset +
						" L " + (x+inset) + "," + (y+h);
						" L "+(x)+","+(y+h);
		
			pathRail2 = "M "+(x+w)+","+(y+h)+
					   	" l 0,"+h2+
						" l -"+inset+",-"+ inset +
						" L "+(x+w-inset)+","+(y+h)+
						" L "+(x+w)+","+(y+h);
	
			pathSill = "M "+ (x) +","+(y+h+h2)+
					" l "+ w +",0"+
					" l -"+inset+",-"+inset +
					" l -"+ (w-(2*inset)) +",0"+
					 " L "+ (x) +","+(y+h+h2);
			
			break;
		case 'R':
		 	path = 
			" M " + (x) + "," + (y) +
			" A " + (r1) +","+(r1)+" 0 0,1 "+ (kPoint.x) + "," + (kPoint.y)+
			" A " + (r3) +","+(r3)+" 0 0,1 "+ (x+(w/2)) + "," + (y+h)+
			" L  "+(x+(w/2)-inset)+","+(y+h)+
			" A " + (r3i) +","+(r3i)+" 0 0,0 "+ (kiPoint.x) + "," + (kiPoint.y)+
			" A " + (r1i) +","+(r1i)+" 0 0,0 "+ + (ulPoint.x) + "," + (ulPoint.y)+
			" L "+x+","+y;
			
			pathRail = "M "+(x)+","+(y)+
					   	" l 0,"+(h+h2)+
						" l "+inset+",-"+inset+
						" L  "+ulPoint.x+","+ulPoint.y+
						" L "+(x)+","+(y);
		
			pathRail2 = "M "+(x+(w/2))+","+(y+h)+
					   	" l 0,"+h2+
						" l -"+inset+",-"+inset+
						" L "+(x+(w/2)-inset)+","+(y+h)+
						" L "+(x+(w/2))+","+(y+h);
	
			pathSill = "M "+ (x) +","+(y+h+h2)+
					" l "+ (w/2) +",0"+
					" l -"+inset+",-"+inset +
					" l -"+ ((w/2)-(2*inset)) +",0"+
					 " L "+ (x) +","+(y+h+h2);

				
			break;
		
		case 'L':
		 	path = 
			" M " + (x) + "," + (y+h) +
			" A " + (r3) +","+(r3)+" 0 0,1 "+ (jPoint.x) + "," + (jPoint.y)+
			" A " + (r1) +","+(r1)+" 0 0,1 "+ (x+w/2) + "," + (y)+
			" L  "+urPoint.x+","+urPoint.y+
			" A " + (r1i) +","+(r1i)+" 0 0,0 "+ (jiPoint.x) + "," + (jiPoint.y)+
			" A " + (r3i) +","+(r3i)+" 0 0,0 "+ (x+inset) + "," + (y+h)+
			" L " + (x) + "," + (y+h);
			
			pathRail = "M "+(x)+","+(y+h)+
					   	" l 0,"+h2+
						" l "+inset+",-"+ inset +
						" L  "+(x+inset) + "," + (y+h)+
						" L "+(x)+","+(y+h);
		
			pathRail2 = "M "+(x+(w/2))+","+(y)+
					   	" l 0,"+(h+h2)+
						" l -"+inset+",-"+inset+
						" L  "+urPoint.x+","+urPoint.y+
						" L "+(x+(w/2))+","+(y);
	
			pathSill = "M "+ (x) +","+(y+h+h2)+
					" l "+ (w/2) +",0"+
					" l -"+inset+",-"+inset +
					" l -"+ ((w/2)-(2*inset)) +",0"+
					 " L "+ (x) +","+(y+h+h2);

			
			break;
		default:
			break;
		}	
}
	trace("frame path="+path);
	frame.setAttribute("d",path);
	frame.getStyle().setProperty("fill",color,"");

	trace("sill path="+pathSill);
	sill.setAttribute("d",pathSill);
	sill.getStyle().setProperty("fill",color,"");

	if(pathRail !== null)
	{
		trace("rail path="+pathRail);
		siderail.setAttribute("d",pathRail);
		siderail.getStyle().setProperty("fill",color,"");
	}
	
	if(pathRail2!== null)
	{
		trace("rail2 path="+pathRail2);
		siderail2.setAttribute("d",pathRail2);
		siderail2.getStyle().setProperty("fill",color,"");
	}
	
	if(g("f_tn")!="true")
	{
		createDescription(id+"_frame", "FRAME ... base WIDTH: " + getDim(w)  +"  HEIGHT: " + getDim(h) + ".");
	}
	

}	
catch(e)
{
	alertUser("Exception: initFrame3CentredArch('"+id+","+xParm+","+ yParm+","+ wParm+","+ hParm+","+ hlegParm+","+ inset+",'"+color+"','"+segType+"')");

	alertUser(e);
	trace(e);
}	
} 



/**
 * Draw 3-centered arch frame (non-mitered)
 * 
 * @param id		String id
 * @param x			decimal x coordinate of containing rectangle
 * @param y			decimal y coordinate of containing rectangle
 * @param w			decimal width  
 * @param h			decimal height 
 * @param hleg		decimal height legs 
 * @param inset		decimal frame inset
 * @param sillThk	decimal sill thickness
 * @param color		String web color code
 * @param segType	F=full, L=left qtr-round, R=right qtr-round
 * @return
 */
function initFrame3CentredArchWithSill(id, xParm, yParm, wParm, hParm, hlegParm, inset, sillThk, color, segType)
{
// segType: F=full, L=left half, R=right half

	trace("initFrame3CentredArchWithSill('"+id+"',"+xParm+","+ yParm+","+ wParm+","+ hParm+","+ hlegParm+","+ inset+","+ sillThk+",'"+color+"','"+segType+"')");

try{	

	var x = xParm;
	var xi = xParm+inset;
	var y = yParm;
	var yi = yParm + inset;
	var w = segType == 'F' ? wParm : wParm*2;
	var wi = segType == 'F' ? wParm - (2*inset) : wParm*2 - (2*inset);
	var h = hlegParm === 0 ? hParm-sillThk: (sillThk > hlegParm ? hParm+hlegParm-sillThk : hParm);
	var hi = h - inset;
	var h2 = hlegParm === 0 || hlegParm < sillThk ? 0 : hlegParm-sillThk;
	var h2i = h2;
	


	var grp = drawing.getElementById(id);
	var idPrefix = g("f_idprefix");
	if(grp === null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id);
		drawing.getElementById("window").appendChild(grp);
	}
	
	
	var frame = drawing.getElementById(id+"_frame");
	if(frame === null)
	{
		frame = drawing.createElementNS(svgNS,"path");
		frame.setAttribute("id",id+"_frame");
		frame.setAttribute("class","frame");
		frame.setAttribute("d","M 0,0");
		
		grp.appendChild(frame);
	}
	
	var sill = drawing.getElementById(id+"_sill");
	if(sill === null)
	{
		sill = drawing.createElementNS(svgNS,"path");
		sill.setAttribute("id",id+"_sill");
		sill.setAttribute("class","frame");
		sill.setAttribute("d","M 0,0");
		
		grp.appendChild(sill);
	}

	var siderail,siderail2;
	if(!(segType == "F" && h2 == 0))
	{
		siderail = drawing.getElementById(id+"_siderail1");
		if(siderail === null)
		{
			siderail = drawing.createElementNS(svgNS,"path");
			siderail.setAttribute("id",id+"_siderail1");
			siderail.setAttribute("class","frame");
			siderail.setAttribute("d","M 0,0");
		
			grp.appendChild(siderail);
		}
		if(h2 > 0)
		{
			siderail2 = drawing.getElementById(id+"_siderail2");
			if(siderail2 === null)
			{
				siderail2 = drawing.createElementNS(svgNS,"path");
				siderail2.setAttribute("id",id+"_siderail2");
				siderail2.setAttribute("class","frame");
				siderail2.setAttribute("d","M 0,0");
		
				grp.appendChild(siderail2);
			}
		}
	}

	
	var r1,r1i,r2,r2i,r3,r3i,afBisectR,afBisectX,afBisectY,aAngle,gAngle,hAngle,hHyp,hX,fPoint,gPoint,hPoint,jAngle,jPoint,kPoint,jiPoint,kiPoint,aPoint,bPoint,path,pathSill;
	
	var center1;
	var pathRail=null;
	var pathRail2=null;

with(Math)
{
	// outer
	aAngle = Math.atan2(h,w/2);
	
	r2 = (w/2) - h;
	fPoint = new Point(x+(w/2) - (Math.cos(aAngle)*r2), (y+Math.sin(aAngle)*r2));
	
	afBisectR = (sqrt(pow(fPoint.x-x,2)+pow(y+h-fPoint.y,2)))/2;
	afBisectX = cos(aAngle)*afBisectR + x;	
	afBisectY = y+h-sin(aAngle)*afBisectR;

	gPoint=new Point(w/2, afBisectY + tan((PI/2)-aAngle)*(x+(w/2)-afBisectX));
	r1 = y-gPoint.y;
	trace("r1="+r1);
	gAngle = atan2(gPoint.x-afBisectX,gPoint.y-afBisectY);
	hPoint = new Point(x+w/2-tan(gAngle)*(gPoint.y-h-y),y+h);

	r3 = hPoint.x - x;
	trace("r3="+r3);
	
	jPoint = new Point(hPoint.x - sin(gAngle)*r3,hPoint.y-cos(gAngle)*r3);
	kPoint = new Point(segType=="R"?x+w/2-(jPoint.x-x):x+w-(jPoint.x-x), jPoint.y);
		
	// inner
	aAngle = Math.atan2(hi,wi/2);
	
	r2i = (wi/2) - hi;
	fPoint = new Point(x+(w/2) - (Math.cos(aAngle)*r2i), (yi+Math.sin(aAngle)*r2i));
	
	afBisectR = (sqrt(pow(fPoint.x-xi,2)+pow(yi+hi-fPoint.y,2)))/2;
	afBisectX = cos(aAngle)*afBisectR + xi;	
	afBisectY = y+h-sin(aAngle)*afBisectR;

	gPoint=new Point(w/2, afBisectY + tan((PI/2)-aAngle)*(x+(w/2)-afBisectX));
	r1i = yi-gPoint.y;
	trace("r1i="+r1i);
	gAngle = atan2(gPoint.x-afBisectX,gPoint.y-afBisectY);
	hPoint = new Point(x+w/2-tan(gAngle)*(gPoint.y-h-y),y+h);
	r3i = hPoint.x - xi;

	jiPoint = new Point(hPoint.x - sin(gAngle)*r3i,hPoint.y-cos(gAngle)*r3i);
	kiPoint = new Point(segType=="R"?x+w/2-(jiPoint.x-x):x+w-(jiPoint.x-x), jiPoint.y);

	llPoint = new Point(hPoint.x-(cos(atan2(inset,hPoint.x-xi))*r3i),hPoint.y-inset); // lower left
	lrPoint = segType == "R" ?new Point(x+(w/2)-(llPoint.x-x),hPoint.y-inset):new Point(x+w-(llPoint.x-x),hPoint.y-inset); 
			
	ulPoint = new Point(x+inset,gPoint.y-sqrt(pow(r1i,2)-pow(inset,2))); // upper left, used only if segType=R
	urPoint = new Point(x+(w/2)-inset, gPoint.y-sqrt(pow(r1i,2)-pow(inset,2)));  // upper right, used only if segType=L
			
}
 
if(h2===0)
{
	switch(segType)
	{
		case 'F':
		 	path = 
			" M " + (x) + "," + (y+h) +
			" A " + (r3) +","+(r3)+" 0 0,1 "+ (jPoint.x) + "," + (jPoint.y)+
			" A " + (r1) +","+(r1)+" 0 0,1 "+ (kPoint.x) + "," + (kPoint.y)+
			" A " + (r3) +","+(r3)+" 0 0,1 "+ (x+w) + "," + (y+h)+
			" l -"+inset+",0"+
			" A " + (r3i) +","+(r3i)+" 0 0,0 "+ (kiPoint.x) + "," + (kiPoint.y)+
			" A " + (r1) +","+(r1)+" 0 0,0 "+ (jiPoint.x) + "," + (jiPoint.y)+
			" A " + (r3i) +","+(r3i)+" 0 0,0 "+ (xi) + "," + (y+h)+
			" l -"+inset+",0";
			pathSill = "M "+ (x) +","+(y+h)+
					" l "+ (w) +",0"+
					" l 0,"+ sillThk +
					" l -"+ (w) + ",0"+
					" l 0,-"+ sillThk;
			break;
		case 'R':
		 	path = 
			" M " + (x) + "," + (y) +
			" A " + (r1) +","+(r1)+" 0 0,1 "+ (kPoint.x) + "," + (kPoint.y)+
			" A " + (r3) +","+(r3)+" 0 0,1 "+ (x+(w/2)) + "," + (y+h)+
			" l -"+inset+",0"+
			" A " + (r3i) +","+(r3i)+" 0 0,0 "+ (kiPoint.x) + "," + (kiPoint.y)+
			" A " + (r1i) +","+(r1i)+" 0 0,0 "+ (ulPoint.x) + "," + (ulPoint.y)+
			" L " + (x) + "," + (y);
			
			pathRail = "M "+(x)+","+(y)+
					   	" l 0,"+(h)+
						" l "+inset+",0"+
						" L "+(ulPoint.x) + "," + (ulPoint.y)+
						" L "+(x)+","+(y);
			
			pathSill = "M "+ (x) +","+(y+h)+
					" l "+ (w/2) +",0"+
					" l 0,"+ sillThk +
					" l -"+ (w/2) + ",0"+
					" l 0,-"+ sillThk;
			
			break;
		
		case 'L':
		 	path = 
			" M " + (x) + "," + (y+h) +
			" A " + (r3) +","+(r3)+" 0 0,1 "+ (jPoint.x) + "," + (jPoint.y)+
			" A " + (r1) +","+(r1)+" 0 0,1 "+ (x+w/2) + "," + (y)+
			" L "+urPoint.x+","+urPoint.y+
			" A " + (r1i) +","+(r1i)+" 0 0,0 "+ (jiPoint.x) + "," + (jiPoint.y)+
			" A " + (r3i) +","+(r3i)+" 0 0,0 "+ (xi) + "," + (y+h)+
			" L " + (x) + "," + (y+h);
			
			pathRail = "M "+(x+(w/2))+","+(y)+
					   	" l 0,"+(h)+
						" l -"+inset+",0"+
						" L "+urPoint.x+","+urPoint.y+
						" L "+(x+(w/2))+","+(y);
			
			pathSill = "M "+ (x) +","+(y+h)+
					" l "+ (w/2) +",0"+
					" l 0,"+ sillThk +
					" l -"+ (w/2) + ",0"+
					" l 0,-"+ sillThk;
			
			break;
		default:
			break;
		}	
}
else
{
	switch(segType)
	{
		case 'F':
		
		 	path = 
			" M " + (x) + "," + (y+h) +
			" A " + (r3) +","+(r3)+" 0 0,1 "+ (jPoint.x) + "," + (jPoint.y)+
			" A " + (r1) +","+(r1)+" 0 0,1 "+ (kPoint.x) + "," + (kPoint.y)+
			" A " + (r3) +","+(r3)+" 0 0,1 "+ (x+w) + "," + (y+h)+
			" l -"+inset+",0"+
			" A " + (r3i) +","+(r3i)+" 0 0,0 "+ (kiPoint.x) + "," + (kiPoint.y)+
			" A " + (r1) +","+(r1)+" 0 0,0 "+ (jiPoint.x) + "," + (jiPoint.y)+
			" A " + (r3i) +","+(r3i)+" 0 0,0 "+ (xi) + "," + (y+h)+
			" l -"+inset+",0";
				
			pathRail = "M "+(x)+","+(y+h)+
					   	" l 0,"+h2+
						" l "+inset+",0"+
						" l 0,-"+h2+
						" l -"+inset+",0";
		
			pathRail2 = "M "+(x+w)+","+(y+h)+
					   	" l 0,"+h2+
						" l -"+inset+",0"+
						" l 0,-"+h2+
						" l "+inset+",0";
	
			pathSill = "M "+ (x) +","+(y+h+h2)+
					" l "+ (w) +",0"+
					" l 0,"+ sillThk +
					" l -"+ (w) + ",0"+
					" l 0,-"+ sillThk;
			
			break;
		case 'R':
		 	path = 
			" M " + (x) + "," + (y) +
			" A " + (r1) +","+(r1)+" 0 0,1 "+ (kPoint.x) + "," + (kPoint.y)+
			" A " + (r3) +","+(r3)+" 0 0,1 "+ (x+(w/2)) + "," + (y+h)+
			" l -"+inset+",0"+
			" A " + (r3i) +","+(r3i)+" 0 0,0 "+ (kiPoint.x) + "," + (kiPoint.y)+
			" A " + (r1i) +","+(r1i)+" 0 0,0 "+ (ulPoint.x) + "," + (ulPoint.y)+
			" L " + (x) + ","+ (y);
		
			pathRail = "M "+(x)+","+(y)+
					   	" l 0,"+(h+h2)+
						" l "+inset+",0"+
						" L "+(ulPoint.x) + "," + (ulPoint.y)+
						" L "+(x)+","+(y);
		
			pathRail2 = "M "+(x+w/2)+","+(y+h)+
					   	" l 0,"+h2+
						" l -"+inset+",0"+
						" l 0,-"+h2+
						" l "+inset+",0";

			pathSill = "M "+ (x) +","+(y+h+h2)+
					" l "+ (w/2) +",0"+
					" l 0,"+ sillThk +
					" l -"+ (w/2) + ",0"+
					" l 0,-"+ sillThk;
				
			break;
		
		case 'L':
	
		 	path = 
			" M " + (x) + "," + (y+h) +
			" A " + (r3) +","+(r3)+" 0 0,1 "+ (jPoint.x) + "," + (jPoint.y)+
			" A " + (r1) +","+(r1)+" 0 0,1 "+ (x+w/2) + "," + (y)+
			" L  "+urPoint.x+","+urPoint.y+
			" A " + (r1i) +","+(r1i)+" 0 0,0 "+ (jiPoint.x) + "," + (jiPoint.y)+
			" A " + (r3i) +","+(r3i)+" 0 0,0 "+ (x+inset) + "," + (y+h)+
			" L " + (x) + "," + (y+h);
			
			pathRail = "M "+(x)+","+(y+h)+
					   	" l 0,"+h2+
						" l "+inset+",0"+
						" L  "+(x+inset) + "," + (y+h)+
						" L "+(x)+","+(y+h);
		
			pathRail2 = "M "+(x+(w/2))+","+(y)+
					   	" l 0,"+(h+h2)+
						" l -"+inset+",0"+
						" L  "+urPoint.x+","+urPoint.y+
						" L "+(x+(w/2))+","+(y);
	
			pathSill = "M "+ (x) +","+(y+h+h2)+
					" l "+ (w/2) +",0"+
					" l 0,"+ sillThk +
					" l -"+ (w/2) + ",0"+
					" l 0,-"+ sillThk;
	
			
			break;
		default:
			break;
		}	
}
	trace("frame path="+path);
	frame.setAttribute("d",path);
	frame.getStyle().setProperty("fill",color,"");

	trace("sill path="+pathSill);
	sill.setAttribute("d",pathSill);
	sill.getStyle().setProperty("fill",color,"");

	if(pathRail !== null)
	{
		trace("rail path="+pathRail);
		siderail.setAttribute("d",pathRail);
		siderail.getStyle().setProperty("fill",color,"");
	}
	
	if(pathRail2!== null)
	{
		trace("rail2 path="+pathRail2);
		siderail2.setAttribute("d",pathRail2);
		siderail2.getStyle().setProperty("fill",color,"");
	}
	
	if(g("f_tn")!="true")
	{
		createDescription(id+"_frame", "FRAME ... base WIDTH: " + getDim(w)  +"  HEIGHT: " + getDim(h) + ".");
	}
	

}	
catch(e)
{
	alertUser("Exception: 	initFrame3CentredArchWithSill('"+id+"',"+xParm+","+ yParm+","+ wParm+","+ hParm+","+ hlegParm+","+ inset+","+ sillThk+",'"+color+"','"+segType+"')");

	alertUser(e);
	trace(e);
}	
}


/**
 * Get an array of end points for a radial grille.
 * 
 * @param p1Radians			decimal angle(radians) of arc beginning
 * @param p2Radians			decimal	angle(radians) of arc end
 * @param center			Point	center point
 * @param radius			decimal radius
 * @param spokes			integer number of spokes
 * @param includeStartPoint	boolean spoke at beginning
 * @param includeEndPoint	boolean spoke at end
 * @return	Array of Points
 */

function getAnglePoints(p1Radians,p2Radians,center,radius,spokes,includeStartPoint, includeEndPoint)
{
trace("getAnglePoints("+p1Radians+","+p2Radians+",("+center.x+","+center.y+"),"+radius+","+spokes+","+includeStartPoint+","+includeEndPoint+")");
	var spokeEndPoints = new Array(spokes);
	
	var radians = p2Radians - p1Radians;
	var segs = spokes+1;
	if(includeStartPoint)
	{
		segs--;
	}
	if(includeEndPoint)
	{
		segs--;
	}
	var radianSeg = radians/segs;
	var circumSeg = Math.abs(radianSeg*radius);
	trace("radianSeg="+radianSeg);
	trace("circumSeg="+circumSeg);
	
	var x,y,c,a,aTotal;
	
	var spoke=1;
	if(includeStartPoint)
	{
		a = p1Radians;
		c = 0;
		
		x = center.x - Math.sin(a)*radius;
		y = center.y - Math.abs(Math.cos(a)*radius);
		spokeEndPoints[0] =	new RadialPoint(x,y,c,a);
		trace(" x="+x+" y="+y +" c="+c+" a="+a);
		spoke++;
	}
	for(;spoke<=spokes;spoke++)
	{
		a = p1Radians+radianSeg*(includeStartPoint?spoke-1:spoke);
		c = circumSeg*(includeStartPoint?spoke-1:spoke);
		
		x = center.x - Math.sin(a)*radius;
		y = center.y - Math.abs(Math.cos(a)*radius);
		spokeEndPoints[spoke-1] = 
				new RadialPoint(x,y,c,a);
		trace(" x="+x+" y="+y +" c="+c+" a="+a);
		
	}
	return spokeEndPoints;
}




/**
 * Get an array of end points for a radial grille.
 * 
 * @param p1				Point	point at arc beginning
 * @param p2				Point	point at arc end
 * @param center			Point	center point
 * @param radius			decimal radius
 * @param spokes			integer number of spokes
 * @param includeStartPoint	boolean spoke at beginning
 * @param includeEndPoint	boolean spoke at end
 * @return	Array of Points
 */

function getRadialPoints(p1,p2,center,radius,spokes,includeStartPoint, includeEndPoint)
{
trace("getRadialPoints(("+p1.x+","+p1.y+"),("+p2.x+","+p2.y+"),("+center.x+","+center.y+"),"+radius+","+spokes+","+includeStartPoint+","+includeEndPoint+")");
	var spokeEndPoints = new Array(spokes);
	
	var p1Radians = Math.atan2(center.x-p1.x,center.y-p1.y);
	var p2Radians = Math.atan2(center.x-p2.x,center.y-p2.y);
	trace("p1Radians="+p1Radians);
	trace("p2Radians="+p2Radians);
	var radians = p2Radians - p1Radians;
	var segs = spokes+1;
	if(includeStartPoint)
	{
		segs--;
	}
	if(includeEndPoint)
	{
		segs--;
	}
	var radianSeg = radians/segs;
	var circumSeg = Math.abs(radianSeg*radius);
	trace("radianSeg="+radianSeg);
	trace("circumSeg="+circumSeg);
	
	var spoke=1;
	if(includeStartPoint)
	{
		spokeEndPoints[0] = new RadialPoint(p1.x,p1.y,0,0);
		spoke++;
	}
	var x,y,c,a,aTotal;
	for(;spoke<=spokes;spoke++)
	{
		a = p1Radians+radianSeg*(includeStartPoint?spoke-1:spoke);
		c = circumSeg*(includeStartPoint?spoke-1:spoke);
		
		x = center.x - Math.sin(a)*radius;
		y = center.y - Math.abs(Math.cos(a)*radius);
		spokeEndPoints[spoke-1] = 
				new RadialPoint(x,y,c,a);
		trace(" x="+x+" y="+y +" c="+c+" a="+a);
		
	}
	return spokeEndPoints;
}



/**
 * Get an array of end points for a radial grille.
 * Same as getRadialPoints() except it supports an arch segment
 * within a wall-of-windows modelset.
 * 
 * @param p1				Point	point at arc beginning
 * @param p2				Point	point at arc end
 * @param center			Point	center point
 * @param radius			decimal radius
 * @param spokes			integer number of spokes
 * @param includeStartPoint	boolean spoke at beginning
 * @param includeEndPoint	boolean spoke at end
 * @return	Array of Points
 */

function getRadialPointsByHorzSegments(p1,p2,center,radius,spokes,includeStartPoint, includeEndPoint)
{
trace("getRadialPointsByHorzSegments(("+p1.x+","+p1.y+"),("+p2.x+","+p2.y+"),("+center.x+","+center.y+"),"+radius+","+spokes+","+includeStartPoint+","+includeEndPoint+")");
	var spokeEndPoints = new Array(spokes);
	
	var p1Radians = Math.atan2(center.x-p1.x,center.y-p1.y);
	var p2Radians = Math.atan2(center.x-p2.x,center.y-p2.y);
	trace("p1Radians="+p1Radians);
	trace("p2Radians="+p2Radians);
	var radians = p2Radians - p1Radians;
	var segs = spokes+1;
	if(includeStartPoint)
	{
		segs--;
	}
	if(includeEndPoint)
	{
		segs--;
	}

	var horzSeg = (p2.x - p1.x)/segs;
	trace("horzSeg="+horzSeg);
	
	var spoke=1;
	if(includeStartPoint)
	{
		spokeEndPoints[0] = new RadialPoint(p1.x,p1.y,0,0);
		spoke++;
	}
	var x,y,c,a,h,aTotal;
	for(;spoke<=spokes;spoke++)
	{
		h = (includeStartPoint?spoke-1:spoke)*horzSeg;
		a = Math.atan2((p1.x+h)-center.x,Math.sqrt(Math.pow(radius,2)-Math.pow(center.x-(p1.x+h),2)));
		c = a*radius;
		
		x = p1.x+ h;
		y = center.y - Math.abs(Math.cos(a)*radius);
		spokeEndPoints[spoke-1] = 
				new RadialPoint(x,y,c,a);
		trace(" x="+x+" y="+y +" c="+c+" a="+a);
		
	}
	return spokeEndPoints;
}






/**
 * Get an array of spoke end points for a radial grille pattern applied
 * to a 3-centered arch.
 * UNDER DEVELOPMENT ... USE WITH CAUTION!
 * 
 * @param xP		decimal x coordinate of containing rectangle
 * @param y			decimal y coordinate of containing rectangle
 * @param wP		decimal width coordinate of containing rectangle
 * @param h			decimal height coordinate of containing rectangle
 * @param spokes	integer number of spokes
 * @param segType	character F=full, L=left qtr-round, R=right qtr-round
 * @return
 */

function getRadialPointsFor3CenterArc(xP,y,wP,h,spokes,segType)
{
trace("getRadialPointsFor3CenterArc("+xP+","+y+","+wP+","+h+","+spokes+",'"+segType+"')");
	var spokeEndPoints = new Array(spokes);
	
	var x = segType=="L" ? xP-wP : xP;
	var w = segType=="F" ? wP : wP*2;
	
	var r1,r2,r3,af,afBisectR,afAngle,afBisectX,afBisectY,gAngle,hAngle,hHyp,hX,fPoint,gPoint,hPoint,iPoint,aAngle,jAngle,jPoint,kPoint,path;
	
	var c1,c2,c3;
		
	with(Math)
	{

	aAngle = Math.atan2(h,w/2);
	trace("aAngle="+aAngle);
	r2 = (w/2) - h;
	trace("r2="+r2);
	trace("w="+w);
	trace("x="+x);
	trace("cos(aAngle)*r2="+(cos(aAngle)*r2));
	fPoint = new Point(x+(w/2) - (cos(aAngle)*r2), (y+sin(aAngle)*r2));
	trace("fPoint="+fPoint.x+","+fPoint.y);
	 
	afBisectR = (sqrt(pow(fPoint.x-x,2)+pow(y+h-fPoint.y,2)))/2; 
	trace("afBisectR="+afBisectR);
	afBisectX = cos(aAngle)*afBisectR + x;	
	afBisectY = y+h-sin(aAngle)*afBisectR;
	
	gPoint=new Point(x+w/2, afBisectY + tan((PI/2)-aAngle)*(x+(w/2)-afBisectX));
	trace("gPoint=" + gPoint.x+","+gPoint.y);
	r1 = gPoint.y-y;
	trace("r1="+r1);
	
	
	gAngle = atan2(gPoint.x-afBisectX,gPoint.y-afBisectY);
	hPoint = new Point(x+w/2-tan(gAngle)*(gPoint.y-h-y),y+h);
	trace("hPoint="+hPoint.x+","+hPoint.y);
	r3 = hPoint.x - x;
	trace("r3="+r3);
	trace("gAngle="+gAngle);
	hAngle = (PI/2) - abs(gAngle);
	trace("hAngle="+hAngle);

	iPoint = new Point(x+w/2+tan(gAngle)*(gPoint.y-h-y),y+h);
	trace("iPoint="+iPoint.x+","+iPoint.y);
	
	jPoint = new Point(hPoint.x - sin(gAngle)*r3,hPoint.y-cos(gAngle)*r3);
	trace("jPoint="+jPoint.x+","+jPoint.y);
	
	kPoint = new Point(x+w-(jPoint.x-x), jPoint.y);
	trace("kPoint="+kPoint.x+","+kPoint.y);
	
	c1=c3=abs(r3*hAngle);
	c2=abs(r1*gAngle*2);
	
	}
trace("c1="+c1);
trace("c2="+c2);
trace("c3="+c3);

	var cSeg = (c1+c2+c3)/(spokes+1);
	trace("cSeg="+cSeg);

	
	var spoke=1;
	var xx,yy,aa,aTotal;
	var cc = 0;
	var ccRem = 0;
	for(;spoke<=spokes;spoke++)
	{
		cc = cSeg*spoke;
		trace("cc="+cc);
		if(cc <= c1)
		{
		trace("11111");
			aa = cc/r3;
				trace("aa="+aa);
					trace("Math.cos(aa)="+Math.cos(aa));
					trace("Math.sin(aa)="+Math.sin(aa));
			xx = hPoint.x - Math.abs(Math.cos(aa)*r3);
			yy = hPoint.y - Math.abs(Math.sin(aa)*r3);			
		}
		else
		if(cc > c1 && cc <= (c1+c2))
		{
			trace("222222");
		
			
			ccRem = cc - c1;
			trace("ccRem="+ccRem);
			if(ccRem < c2/2)
			{
				aa = Math.abs(((c2/2)-ccRem)/r1);
				trace("aa="+aa);
				trace("Math.cos(aa)="+Math.cos(aa));
				trace("Math.sin(aa)="+Math.sin(aa));
				xx = gPoint.x - Math.sin(aa)*r1;
				yy = gPoint.y - Math.cos(aa)*r1;
			}
			else
			{
				aa = Math.abs((ccRem - (c2/2))/r1);
				trace("aa="+aa);
				trace("Math.cos(aa)="+Math.cos(aa));
				trace("Math.sin(aa)="+Math.sin(aa));
				xx = gPoint.x + Math.sin(aa)*r1;
				yy = gPoint.y - Math.cos(aa)*r1;
				
			}
			
		}
		else
		{
			trace("3333333");
		
			ccRem = (c1+c2+c3) - cc;
			aa = ccRem/r3;
					trace("aa="+aa);
					trace("Math.cos(aa)="+Math.cos(aa));
					trace("Math.sin(aa)="+Math.sin(aa));
			
			xx = iPoint.x + Math.abs(Math.cos(aa)*r3);
			yy = iPoint.y - Math.abs(Math.sin(aa)*r3);
		}
		
		spokeEndPoints[spoke-1] = 
				new RadialPoint(xx,yy,cc,0);
		trace(" x="+xx+" y="+yy +" c="+cc+" a=0");
		
	}
	return spokeEndPoints;
}




/////////// Functions to calculate circle center 
/////////// and radius given 3 points (e.g. left,top,right).

var zero = parseFloat("0");
var Xo, Yo;
var R;
var P = [[zero,zero],[zero,zero],[zero,zero]];

/**
 * Determine the center point of a circle given 3 points on an arc.
 * Will be indeterminant if points do not fall on a circular arc.
 * 
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @param x3
 * @param y3
 * @return
 */
function computeCircleCenter(x1,y1,x2,y2,x3,y3)
{
    P[0][0] = x1;
    P[0][1] = y1;
    P[1][0] = x2;
    P[1][1] = y2;
    P[2][0] = x3;
    P[2][1] = y3;

    // check input
    if (isNaN(P[0][0])||isNaN(P[0][1])||
        isNaN(P[1][0])||isNaN(P[1][1])||
        isNaN(P[2][0])||isNaN(P[2][1]))
    {
        window.alert("Invalid input!");
        return;
    }
  
    var r = circle();
    if (r > 0)
    {
       // calc.x0.value = Xo;
       // calc.y0.value = Yo;
       // calc.r0.value = r;
       R = r;
    }
    else
       alert("Internal logic error.. computeCircleCenter()"); // calc.r0.value = "Not a circle";
}

//  Calculate center and radius of circle given three points
function circle()
{
    var i;
    var r, m11, m12, m13, m14;
    var a = [[zero,zero,zero],[zero,zero,zero],[zero,zero,zero]];

    for (i = 0; i < 3; i++)                    // find minor 11
    {
        a[i][0] = P[i][0];
        a[i][1] = P[i][1];
        a[i][2] = 1;
    }
    m11 = determinant( a, 3 );

    for (i = 0; i < 3; i++)                    // find minor 12 
    {
        a[i][0] = P[i][0]*P[i][0] + P[i][1]*P[i][1];
        a[i][1] = P[i][1];
        a[i][2] = 1;
    }
    m12 = determinant( a, 3 );

    for (i = 0; i < 3; i++)                    // find minor 13
    {
        a[i][0] = P[i][0]*P[i][0] + P[i][1]*P[i][1];
        a[i][1] = P[i][0]
        a[i][2] = 1;
    }
    m13 = determinant( a, 3 );

    for (i = 0; i < 3; i++)                    // find minor 14
    {
        a[i][0] = P[i][0]*P[i][0] + P[i][1]*P[i][1];
        a[i][1] = P[i][0];
        a[i][2] = P[i][1];
    }
    m14 = determinant( a, 3 );

    if (m11 == 0)
    {
        r = 0;                                 // not a circle
    }
    else
    {
        Xo =  0.5 * m12 / m11;                 // center of circle
        Yo = -0.5 * m13 / m11;
        r  = Math.sqrt( Xo*Xo + Yo*Yo + m14/m11 );
    }

    return r;                                  // the radius
}

// Recursive definition of determinate using expansion by minors.
function determinant( a, n )
{
    var i, j, j1, j2;
    var d = parseFloat("0");
    var m = [[zero,zero,zero],[zero,zero,zero],[zero,zero,zero]];

    if (n == 2)                                // terminate recursion
    {
        d = a[0][0]*a[1][1] - a[1][0]*a[0][1];
    }
    else 
    {
        d = 0;
        for (j1 = 0; j1 < n; j1++ )            // do each column
        {
            for (i = 1; i < n; i++)            // create minor
            {
                j2 = 0;
                for (j = 0; j < n; j++)
                {
                    if (j == j1) continue;
                    m[i-1][j2] = a[i][j];
                    j2++;
                }
            }
            
            // sum (+/-)cofactor * minor  
            d = d + Math.pow(-1.0, j1)*a[0][j1]*determinant( m, n-1 );
        }
    }

    return d;
}


/**
 * Draw a circular arch frame inside a specified rectangle.
 * 
 * Frame corners are mitered.
 *  
 * @param id		String id
 * @param x			decimal x coordinate
 * @param y			decimal y coordinate
 * @param w			decimal width
 * @param h			decimal height
 * @param h2		decimal height legs
 * @param inset		decimal frame thickness
 * @param color		String web color code
 * @param segParm	char L (left), R (right), F (full)
 * @return
 */
function initArchCircular(id, x, y, w, h, h2, inset, color, segParm)
{
// segType: F=full, L=left half, R=right half
try
{
trace("initArchCircular'"+id+"',"+x+","+ y+","+ w+","+ h+","+ h2 + ","+ inset+",'"+ color+"','"+segParm+"')");

var segType = segParm === null ? "F":segParm;

	var pLT,pRT,pLB,pRB,pC;
	if(h2 == 0)
	{	
		switch(segType)
		{
			case 'F':
				computeCircleCenter(x,y+h,x+w/2,y,x+w,y+h); // sets global R
				pLT = new Point(x,y+h);
				pRT = new Point(x+w,y+h);
				pLB = new Point(x,y+h);
				pRB = new Point(x+w,y+h);
				break;

			case 'L':
				computeCircleCenter(x,y+h,x+w,y,x+(2*w),y+h); // sets global R
				pLT = new Point(x,y+h);
				pRT = new Point(x+w,y);
				pLB = new Point(x,y+h);
				pRB = new Point(x+w,y+h);
				break;
							
			case 'R':
				computeCircleCenter(x-w,y+h,x,y,x+w,y+h); // sets global R
				pLT = new Point(x,y);
				pRT = new Point(x+w,y+h);
				pLB = new Point(x,y+h);
				pRB = new Point(x+w,y+h);
				break;
						
			default:
				break;				
		}
	}
	else
	{
		switch(segType)
		{
			case 'F':
				computeCircleCenter(x,y+h,x+w/2,y,x+w,y+h); // sets global R
				pLT = new Point(x,y+h);
				pRT = new Point(x+w,y+h);
				pLB = new Point(x,y+h+h2);
				pRB = new Point(x+w,y+h+h2);
				break;

			case 'L':
				computeCircleCenter(x,y+h,x+w,y,x+(2*w),y+h); // sets global R
				pLT = new Point(x,y+h);
				pRT = new Point(x+w,y);
				pLB = new Point(x,y+h+h2);
				pRB = new Point(x+w,y+h+h2);
				break;			
							
			case 'R':
				computeCircleCenter(x-w,y+h,x,y,x+w,y+h); // sets global R
				pLT = new Point(x,y);
				pRT = new Point(x+w,y+h);
				pLB = new Point(x,y+h+h2);
				pRB = new Point(x+w,y+h+h2);
				break;
				
			default:
				break;						
		}
	}
	pC = new Point(Xo,Yo);
	initArchCircularSeg(id, pLT, pRT, pLB, pRB, pC, R, inset, color);
	
}	
catch(e)
{
	alertUser("Exception:  initArchCircular('"+id+"',"+x+","+ y+","+ w+","+ h+","+ inset+",'"+ color+"','"+segParm+"')");
	alertUser(e);
	trace(e);
}
}

/**
 * Draw a circular arch frame inside a specified rectangle.
 * 
 * The base of the frame (sill) is squared.
 *  
 * @param id		String id
 * @param x			decimal x coordinate
 * @param y			decimal y coordinate
 * @param w			decimal width
 * @param h			decimal height
 * @param h2		decimal height legs
 * @param inset		decimal frame thickness
 * @param sill		decimal sill thickness
 * @param color		String web color code
 * @param segParm	char L (left), R (right), F (full)
 * @return
 */
function initArchCircularWithSill(id, x, y, w, h, hLeg, inset, sill, color, segParm)
{
// segType: F=full, L=left half, R=right half
try
{
trace("initArchCircularWithSill"+id+"',"+x+","+ y+","+ w+","+ h+","+ hLeg + ","+ inset+ ","+ sill+",'"+ color+"','"+segParm+"')");

var segType = segParm === null ? "F":segParm;

	var h2 = hLeg;
	if(sill > hLeg && hLeg > 0)
	{
		h2 = 0;
		h += hLeg;  
	}
		
	var pLT,pRT,pLB,pRB,pC;
	if(h2 == 0)
	{	
		switch(segType)
		{
			case 'F':
				computeCircleCenter(x,y+h-sill,x+w/2,y,x+w,y+h-sill); // sets global R
				pLT = new Point(x,y+h-sill);
				pRT = new Point(x+w,y+h-sill);
				pLB = new Point(x,y+h-sill);
				pRB = new Point(x+w,y+h-sill);
				break;

			case 'L':
				computeCircleCenter(x,y+h-sill,x+w,y,x+(2*w),y+h-sill); // sets global R
				pLT = new Point(x,y+h-sill);
				pRT = new Point(x+w,y);
				pLB = new Point(x,y+h-sill);
				pRB = new Point(x+w,y+h-sill);
				break;
							
			case 'R':
				computeCircleCenter(x-w,y+h-sill,x,y,x+w,y+h-sill); // sets global R
				pLT = new Point(x,y);
				pRT = new Point(x+w,y+h-sill);
				pLB = new Point(x,y+h-sill);
				pRB = new Point(x+w,y+h-sill);
				break;
						
			default:
				break;				
		}
	}
	else
	{
		switch(segType)
		{
			case 'F':
				computeCircleCenter(x,y+h,x+w/2,y,x+w,y+h); // sets global R
				pLT = new Point(x,y+h);
				pRT = new Point(x+w,y+h);
				pLB = new Point(x,y+h+h2-sill);
				pRB = new Point(x+w,y+h+h2-sill);
				break;

			case 'L':
				computeCircleCenter(x,y+h,x+w,y,x+(2*w),y+h); // sets global R
				pLT = new Point(x,y+h);
				pRT = new Point(x+w,y);
				pLB = new Point(x,y+h+h2-sill);
				pRB = new Point(x+w,y+h+h2-sill);
				break;			
							
			case 'R':
				computeCircleCenter(x-w,y+h,x,y,x+w,y+h); // sets global R
				pLT = new Point(x,y);
				pRT = new Point(x+w,y+h);
				pLB = new Point(x,y+h+h2-sill);
				pRB = new Point(x+w,y+h+h2-sill);
				break;
				
			default:
				break;						
		}
	}
	pC = new Point(Xo,Yo);
	initArchCircularSegWithSill(id, pLT, pRT, pLB, pRB, pC, R, inset, sill, color);
	
}	
catch(e)
{
	alertUser("Exception:  initArchCircularWithSill"+id+"',"+x+","+ y+","+ w+","+ h+","+ h2 + ","+ inset+ ","+ sill+",'"+ color+"','"+segParm+"')");
	alertUser(e);
	trace(e);
}
}

/**
 * Compute a horizontal adjustment factor used to center a radial shape 
 * inside the containing frame.
 * 
 * @param w		decimal width of the frame
 * @param h		decimal height of the frame
 * @param inset	decimal inset from base of frame to the glass 
 * @return	decimal 
 */

function computeHorzOffset(w,h,inset)
{
		computeCircleCenter(0,h,(w/2),0,w,h);
		
		var adj =  (w/2) - Math.sqrt(Math.pow(R,2) - Math.pow(Yo-h+inset,2));
		
		return Math.abs(adj);
}



/**
 * Draw a radial shape glass.
 * 
 * @param id		String id
 * @param idFrame	String id of containing glass
 * @param x			decimal x coordinate of <u>frame</u>
 * @param y			decimal x coordinate of <u>frame</u>
 * @param w			decimal width of frame
 * @param h			decimal height of frame
 * @param h2		decimal height of legs
 * @param inset		decimal inset with the frame
 * @param segParm	char F=full, L=left half, R=right half
 * @return
 */
function initGlassArchCircular(id, idFrame, x, y, w, h, h2, inset, segParm)
{
// segType: F=full, L=left half, R=right half

	trace("initGlassArchCircular('"+id+"','"+idFrame+"',"+x+","+ y+","+ w+","+ h+","+ h2+","+ inset+",'"+segParm+"'");

try{	



	var segType = segParm === null ? "F":segParm;
	
	
	var pLT,pRT,pLB,pRB,pC;
	if(h2 == 0)
	{	
		switch(segType)
		{
			case 'F':
				computeCircleCenter(x,y+h,x+w/2,y,x+w,y+h); // sets global R
				pLT = new Point(x,y+h);
				pRT = new Point(x+w,y+h);
				pLB = new Point(x,y+h);
				pRB = new Point(x+w,y+h);
				break;

			case 'L':
				computeCircleCenter(x,y+h,x+w,y,x+(2*w),y+h); // sets global R
				pLT = new Point(x,y+h);
				pRT = new Point(x+w,y);
				pLB = new Point(x,y+h);
				pRB = new Point(x+w,y+h);
				break;
							
			case 'R':
				computeCircleCenter(x-w,y+h,x,y,x+w,y+h); // sets global R
				pLT = new Point(x,y);
				pRT = new Point(x+w,y+h);
				pLB = new Point(x,y+h);
				pRB = new Point(x+w,y+h);
				break;
						
			default:
				break;				
		}
	}
	else
	{
		switch(segType)
		{
			case 'F':
				computeCircleCenter(x,y+h,x+w/2,y,x+w,y+h); // sets global R
				pLT = new Point(x,y+h);
				pRT = new Point(x+w,y+h);
				pLB = new Point(x,y+h+h2);
				pRB = new Point(x+w,y+h+h2);
				break;

			case 'L':
				computeCircleCenter(x,y+h,x+w,y,x+(2*w),y+h); // sets global R
				pLT = new Point(x,y+h);
				pRT = new Point(x+w,y);
				pLB = new Point(x,y+h+h2);
				pRB = new Point(x+w,y+h+h2);
				break;			
							
			case 'R':
				computeCircleCenter(x-w,y+h,x,y,x+w,y+h); // sets global R
				pLT = new Point(x,y);
				pRT = new Point(x+w,y+h);
				pLB = new Point(x,y+h+h2);
				pRB = new Point(x+w,y+h+h2);
				break;
				
			default:
				break;						
		}
	}
	pC = new Point(Xo,Yo);
	
	initGlassArchCircularSeg(id,idFrame, pLT, pRT, pLB, pRB, pC, R, inset);
	
	
}	
catch(e)
{
	alertUser("Exception:  initGlassArchCircular('"+id+"','"+idFrame+"',"+x+","+ y+","+ w+","+ h+","+ h2+","+ inset+",'"+segParm+"')");
	
	alertUser(e);
	trace(e);
}
}















/**
 * Draw a horizontal segment of a radial glass.
 * 
 * @param id		String id
 * @param idFrame	String id of containing frame
 * @param pLT		Point left top
 * @param pRT		Point right top
 * @param pLB		Point left bottom
 * @param pRB		Point right bottom
 * @param pC		Point center of the arc
 * @param r			decimal radius of the arc
 * @param inset		inset inside the frame
 * @return
 */

function initGlassArchCircularSeg(id,idFrame, pLT, pRT, pLB, pRB, pC, r, inset)
{

try
{
trace("initGlassArchCircularSeg'"+id+"',("+pLT.x+","+ pLT.y+"),("+pRT.x+","+ pRT.y+"),("+pLB.x+","+ pLB.y+"),("+pRB.x+","+ pRB.y+"),("+pC.x+","+ pC.y+"),"+ r+","+ inset+")");

	var x = pLT.x;
	var y = Math.min(pLT.y,pRT.y);
	var w = pRT.x-pLT.x;
	var h = pRB.y-y;
	var segType = "F"; // segType: F=full, L=left, R=right
	if(pLT.y < pRT.y)
	{
		segType = "R";
	}
	else
	if(pLT.y > pRT.y)
	{
		segType = "L";
	}
	




	var iLT,iRT,iLB,iRB;
	
	var hLegs = pLB.y - Math.max(pLT.y,pRT.y);


	var	rInner = r - inset;
		
	if(hLegs === 0)
	{
		switch(segType)
		{
			case "F":
				iLT = new Point( pC.x - Math.sqrt(Math.pow(rInner,2)-Math.pow(pC.y-(pLT.y-inset),2)),
								pLT.y - inset);
				iRT = new Point(pC.x + Math.sqrt(Math.pow(rInner,2)-Math.pow(pC.y-(pLT.y-inset),2)),
								pRT.y - inset);	
				
				d = "M "+iLT.x+","+iLT.y+" A "+rInner+","+rInner+" 0 0,1 "+iRT.x+","+iRT.y+ " L "+iLT.x+","+iLT.y;
				iLB = iLT;
				iRB = iRT;
				break;
			case "L":
				iLT = new Point( pC.x - Math.sqrt(Math.pow(rInner,2)-Math.pow(pC.y-(pLT.y-inset),2)),
								pLT.y - inset);
				iRT = new Point( pRT.x - inset,
								pC.y - Math.sqrt(Math.pow(rInner,2)-Math.pow(pC.x - pRT.x + inset,2)));
				iRB = new Point(pRB.x-inset,pRB.y-inset);
				d = "M "+iLT.x+","+iLT.y+" A "+rInner+","+rInner+" 0 0,1 "+iRT.x+","+iRT.y+
				 " L "+iRB.x+","+iRB.y+
				 " L "+iLT.x+","+iLT.y;
				iLB = iLT;
				break;
			case "R":
				iLT = new Point( pLT.x + inset,
								pC.y - Math.sqrt(Math.pow(rInner,2)-Math.pow(pLT.x + inset - pC.x,2)));
				
				iRT = new Point( pC.x + Math.sqrt(Math.pow(rInner,2)-Math.pow(pC.y-(pRT.y-inset),2)),
								pRT.y - inset);
								
				iLB = new Point(pLB.x+inset,pLB.y-inset);
				d = "M "+iLT.x+","+iLT.y+" A "+rInner+","+rInner+" 0 0,1 "+iRT.x+","+iRT.y+
				 " L "+iLB.x+","+iLB.y+
				 " L "+iLT.x+","+iLT.y;
				iRB = iRT;

				break;
			default:
				break;	
		}
	}
	else
	{
		switch(segType)
		{
			case "F":
				iLT = new Point( pLT.x+inset,
								 pC.y - Math.sqrt(Math.pow(rInner,2)-Math.pow(pC.x-pLT.x-inset,2)));
				iRT = new Point( pRT.x - inset,
								 pC.y - Math.sqrt(Math.pow(rInner,2)-Math.pow(pRT.x-inset-pC.x,2)));
				iLB = new Point( pLB.x+inset,pLB.y-inset);
				iRB = new Point( pRB.x-inset,pLB.y-inset);
				break;
				
			case "L":
				iLT = new Point( pLT.x+inset,
								 pC.y - Math.sqrt(Math.pow(rInner,2)-Math.pow(pC.x-pLT.x-inset,2)));
				iRT = new Point( pRT.x - inset,
								pC.y - Math.sqrt(Math.pow(rInner,2)-Math.pow(pC.x - pRT.x + inset,2)));
				trace("iRT.x="+pRT.x-inset);
				iRB = new Point(pRB.x-inset,pRB.y-inset);
				iLB = new Point(pLB.x+inset,pRB.y-inset);
				break;
			case "R":
				iLT = new Point( pLT.x + inset,
								pC.y - Math.sqrt(Math.pow(rInner,2)-Math.pow(pLT.x + inset - pC.x,2)));
				
				iRT = new Point( pRT.x - inset,
								pC.y - + Math.sqrt(Math.pow(rInner,2)-Math.pow(pRT.x-inset-pC.x,2)));
				iRB = new Point(pRB.x-inset,pRB.y-inset);
				iLB = new Point(pLB.x+inset,pLB.y-inset);
				break;
			default:
				break;	
				
		}
		d = "M "+iLT.x+","+iLT.y+" A "+rInner+","+rInner+" 0 0,1 "+iRT.x+","+iRT.y+
					 " L "+iRB.x+","+iRB.y+
					 " L "+iLB.x+","+iLB.y+
					 " L "+iLT.x+","+iLT.y;
			
	}

  	var glass = drawing.getElementById(id);

	var grp = drawing.getElementById(id);
	var idPrefix = g("f_idprefix");
	if(grp === null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id);

		drawing.getElementById("window").appendChild(grp);
	}
 	
	var gls = drawing.getElementById(id+"_pane");
	if(gls === null)
	{
		
		gls = drawing.createElementNS(svgNS,"path");
		gls.setAttribute("id",id+"_pane");
		gls.setAttribute("class","glass");
		gls.setAttribute("onmouseover","expose(evt,'"+idPrefix+idFrame+"',true)");
		gls.setAttribute("onmouseout","expose(evt,'"+idPrefix+idFrame+"',false)");
		//These attributes don't apply to a <path>, but they feed the grid functions
		gls.setAttribute("x",x);
		gls.setAttribute("y",(segType == "F" ? pC.y - r : y));
		gls.setAttribute("width",w);
		gls.setAttribute("height",
			(segType == "F" ? iLB.y - (pC.y - r)
							: iLB.y - Math.min(iLT.y,iRT.y)));
		
		if(g("f_imgType")=="U1" )
    {
      gls.getStyle().setProperty("fill-opacity","0","");
    }
    
		grp.appendChild(gls);
	}

	var t,tText;
	if(g("f_glass") == "TEMPERED")
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
		t.setAttribute("x",x+w-inchesToMM(4));
		t.setAttribute("y",y+h-inchesToMM(4));
	}


		try
		{
			trace("d="+d);
			gls.setAttribute("d",d);
		}
		catch(e){alert(id + "_arch d="+d);}
		createDescription(id , "Arch WIDTH: " + getDim(w) +"  HEIGHT: " + getDim(h) + "  HEIGHT LEGS: " + getDim(hLegs) +  "  RADIUS: "+getDim(r)+".");



}	
catch(e)
{
	alertUser("Exception:  initGlassArchCircularSeg'"+id+"',("+pLT.x+","+ pLT.y+"),("+pRT.x+","+ pRT.y+"),("+pLB.x+","+ pLB.y+"),("+pRB.x+","+ pRB.y+"',("+pC.x+","+ pC.y+"),"+ r+","+ inset+")");
	alertUser(e);
	trace(e);
}
}


















/**
 * Draw a horizontal segment of a radial glass.
 * 
 * @param id		String id
 * @param idFrame	String id of containing frame
 * @param pLT		Point left top
 * @param pRT		Point right top
 * @param pLB		Point left bottom
 * @param pRB		Point right bottom
 * @param pC		Point center of the arc
 * @param r			decimal radius of the arc
 * @param inset		inset inside the frame
 * @return
 */

function initArchCircularSeg(id, pLT, pRT, pLB, pRB, pC, r, inset, color)
{
// segType: F=full, L=left half, R=right half
try
{
trace("initArchCircularSeg'"+id+"',("+pLT.x+","+ pLT.y+"),("+pRT.x+","+ pRT.y+"),("+pLB.x+","+ pLB.y+"),("+pRB.x+","+ pRB.y+"',("+pC.x+","+ pC.y+"),"+ r+","+ inset+",'"+ color+"')");

	var x = pLT.x;
	var y = Math.min(pLT.y,pRT.y);
	var w = pRT.x-pLT.x;
	
	var yBase = Math.max(pLT.y,pRT.y);
	var segType = "F";
	if(pLT.y < pRT.y)
	{
		segType = "R";
	}
	else
	if(pLT.y > pRT.y)
	{
		segType = "L";
	}
	
	var grp = drawing.getElementById(id);
	if(grp === null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id);
		
		drawing.getElementById("window").appendChild(grp);
	}
	var hLegs = pLB.y - Math.max(pLT.y,pRT.y);
	
	var iLT,iRT,iLB,iRB;
	


	var d = null;
	var dSill = null;
	var dLeft = null;
	var dRight = null;
	var angleSill = null;
	var	rInner = r - inset;
	trace("rInner="+rInner);	
	if(hLegs === 0)
	{
		switch(segType)
		{
			case "F":
				iLT = new Point( pC.x - Math.sqrt(Math.pow(rInner,2)-Math.pow(pC.y-pLT.y+inset,2)),
								pLT.y - inset);
				iRT = new Point(pC.x + Math.sqrt(Math.pow(rInner,2)-Math.pow(pC.y-pRT.y+inset,2)),
								pLT.y - inset);	
				
			
				d =  "M " + pLT.x + "," + pLT.y + " A " + r+","+r+" 0 0,1 " +pRT.x+","+pRT.y +
					" L " + iRT.x+","+iRT.y +
					" A "+rInner+","+rInner+" 180 0,0 "+ iLT.x+","+iLT.y +
					" L " + pLT.x +","+ pLT.y;
				trace(">>>> d = " + d);
				dSill = "M " +pLT.x+","+pLT.y +
						" L " + pRT.x+","+pRT.y +
						" L " + iRT.x+","+iRT.y +
						" L " + iLT.x+","+iLT.y +
						" L " +pLT.x+"," +pLT.y;	
				angleSill = Math.atan2(pLT.y-iLT.y,iLT.x-pLT.x);

				trace(">>>> dSill = " + dSill);		
				break;
			case "L":
				iLT = new Point( pC.x - Math.sqrt(Math.pow(rInner,2)-Math.pow(pC.y-(pLT.y-inset),2)),
								pLT.y - inset);
				iRT = new Point( pRT.x - inset,
								pC.y == pRT.y ? pC.y :
								pC.y - Math.sqrt(Math.pow(rInner,2)-Math.pow(inset,2)));
				iRB = new Point(pRB.x-inset,pRB.y-inset);
				d =  "M " + pLT.x + "," + pLT.y + " A " + r+","+r+" 0 0,1 " +pRT.x+","+pRT.y +
					" L " + iRT.x+","+iRT.y +
					" A "+rInner+","+rInner+" 180 0,0 "+ iLT.x+","+iLT.y +
					" L " + pLT.x +","+ pLT.y;
				dRight = "M "+ pRT.x+","+pRT.y+
						" L "+pRB.x+","+pRB.y+
						" L "+iRB.x+","+iRB.y+
						" L "+iRT.x+","+iRT.y+
						" L	"+pRT.x+","+pRT.y;
				dSill = "M " +pLT.x+","+pLT.y +
						" L " + pRB.x+","+pRB.y +
						" L " + iRB.x+","+iRB.y +
						" L " + iLT.x+","+iLT.y +
						" L " +pLT.x+"," +pLT.y;	
				angleSill = Math.atan2(pLT.y-iLT.y,iLT.x-pLT.x);
						
				break;
			case "R":
				iLT = new Point( pLT.x + inset,
								pC.y == pLT.y ? pC.y :
								pC.y - Math.sqrt(Math.pow(rInner,2)-Math.pow(inset,2)));
				
				iRT = new Point(pC.x + Math.sqrt(Math.pow(rInner,2)-Math.pow(pC.y-(pRT.y-inset),2)),
								pRT.y - inset);	
				
								
				iLB = new Point(pLB.x+inset,pLB.y-inset);
				d =  "M " + pLT.x + "," + pLT.y + " A " + r+","+r+" 0 0,1 " +pRT.x+","+pRT.y +
					" L " + iRT.x+","+iRT.y +
					" A "+rInner+","+rInner+" 180 0,0 "+ iLT.x+","+iLT.y +
					" L " + pLT.x +","+ pLT.y;
				dLeft = "M "+ pLT.x+","+pLT.y+
						" L "+pLB.x+","+pLB.y+
						" L "+iLB.x+","+iLB.y+
						" L "+iLT.x+","+iLT.y+
						" L	"+pLT.x+","+pLT.y;
				dSill = "M " +pLB.x+","+pLB.y +
						" L " + pRT.x+","+pRT.y +
						" L " + iRT.x+","+iRT.y +
						" L " + iLB.x+","+iLB.y +
						" L " +pLB.x+"," +pLB.y;	
				
				angleSill = Math.atan2(pRT.y-iRT.y,pRT.x-iRT.x);
						
				break;
			default:
				break;	
		}
	}
	
	else
	if(hLegs > 0 && hLegs <= inset )
	{
		switch(segType)
		{
			case "F":
				iLT = new Point( pC.x - Math.sqrt(Math.pow(rInner,2)-Math.pow(pC.y-(pLT.y-inset),2)),
								pLT.y - inset);
				iRT = new Point(pC.x + Math.sqrt(Math.pow(rInner,2)-Math.pow(pC.y-(pRT.y-inset),2)),
								pLT.y - inset);	
				
			
				d =  "M " + pLT.x + "," + (pLT.y + (inset-hLegs)) +
					" L " + pLT.x + "," + pLT.y + 
					" A " + r+","+r+" 0 0,1 " +pRT.x+","+pRT.y +
					" L " + pRT.x + "," + (pRT.y + (inset-hLegs)) +
					" L " + iRT.x+","+(iRT.y + (inset-hLegs)) +
					" L " + iRT.x+","+iRT.y + 
					" A "+rInner+","+rInner+" 180 0,0 "+ iLT.x+","+iLT.y +
					" L " + iLT.x+","+(iLT.y + (inset-hLegs))+
					" L " + pLT.x +","+ (pLT.y + (inset-hLegs));
				dSill = "M " +pLT.x+","+(pLT.y + (inset-hLegs))+
						" L " + pRT.x+","+(pRT.y + (inset-hLegs))+
						" L " + iRT.x+","+ (iRT.y + (inset-hLegs)) +
						" L " + iLT.x+","+(iLT.y + (inset-hLegs))+
						" L " +pLT.x+"," +(pLT.y + (inset-hLegs));	
				
				angleSill = Math.atan2((pLT.y + (inset-hLegs))-(iLT.y + (inset-hLegs)),pLT.x-iLT.x);
						
				break;
			case "L":
				iLT = new Point( pC.x - Math.sqrt(Math.pow(rInner,2)-Math.pow(pC.y-(pLT.y-inset),2)),
								pLT.y - inset);
				iRT = new Point( pRT.x - inset,
								pC.y == pRT.y ? pC.y :
								pC.y - Math.sqrt(Math.pow(rInner,2)-Math.pow(inset,2)));
				iRB = new Point(pRB.x-inset,pRB.y-inset);
				d =  "M " + pLT.x + "," + pLT.y + " A " + r+","+r+" 0 0,1 " +pRT.x+","+pRT.y +
					" L " + iRT.x+","+iRT.y +
					" A "+rInner+","+rInner+" 180 0,0 "+ iLT.x+","+iLT.y +
					" L " + pLT.x +","+ pLT.y;
				dRight = "M "+ pRT.x+","+pRT.y+
						" L "+pRB.x+","+pRB.y+
						" L "+iRB.x+","+iRB.y+
						" L "+iRT.x+","+iRT.y+
						" L	"+pRT.x+","+pRT.y;
				dSill = "M " +pLT.x+","+pLT.y +
						" L " + pRB.x+","+pRB.y +
						" L " + iRB.x+","+iRB.y +
						" L " + iLT.x+","+iLT.y +
						" L " +pLT.x+"," +pLT.y;	
				angleSill = Math.atan2((pLT.y + (inset-hLegs))-(iLT.y + (inset-hLegs)),pLT.x-iLT.x);
						
				break;
			case "R":
				iLT = new Point( pLT.x + inset,
								pC.y == pLT.y ? pC.y :
								pC.y - Math.sqrt(Math.pow(rInner,2)-Math.pow(inset,2)));
				
				iRT = new Point( pC.x + Math.sqrt(Math.pow(rInner,2)-Math.pow(pC.y-(pRT.y-inset),2)),
								pRT.y - inset);
								
				iLB = new Point(pLB.x+inset,pLB.y-inset);
				d =  "M " + pLT.x + "," + pLT.y + " A " + r+","+r+" 0 0,1 " +pRT.x+","+pRT.y +
					" L " + iRT.x+","+iRT.y +
					" A "+rInner+","+rInner+" 180 0,0 "+ iLT.x+","+iLT.y +
					" L " + pLT.x +","+ pLT.y;
				dLeft = "M "+ pLT.x+","+pLT.y+
						" L "+pLB.x+","+pLB.y+
						" L "+iLB.x+","+iLB.y+
						" L "+iLT.x+","+iLT.y+
						" L	"+pLT.x+","+pLT.y;
				dSill = "M " +pLB.x+","+pLB.y +
						" L " + pRT.x+","+pRT.y +
						" L " + iRT.x+","+iRT.y +
						" L " + iLB.x+","+iLB.y +
						" L " +pLB.x+"," +pLB.y;	
				
				angleSill = Math.atan2((pRT.y + (inset-hLegs))-(iRT.y + (inset-hLegs)),pRT.x-iRT.x);
				
				break;
			default:
				break;	
		}
	}
	else
	{
		angleSill = .125 * Math.PI;
		switch(segType)
		{
			case "F":
				iLT = new Point( pLT.x+inset,
									pC.y == pLT.y ? pC.y :
								 	pC.y - Math.sqrt(Math.pow(rInner,2)-Math.pow(pC.x-(pLT.x+inset),2)));
				iRT = new Point( pRT.x - inset,
								pC.y == pRT.y ? pC.y :
								pC.y - Math.sqrt(Math.pow(rInner,2)-Math.pow(pRT.x-inset-pC.x,2)));
				iLB = new Point( pLB.x+inset,pLB.y-inset);
				iRB = new Point( pRB.x-inset,pLB.y-inset);
				break;
				
			case "L":
				trace("pC.y="+pC.y);
				trace("pC.x="+pC.x);
				trace("pLT.x="+pLT.x);
				trace("pLT.y="+pLT.y);
				iLT = new Point( pLT.x+inset,
									pC.y == pLT.y ? pC.y :
								 	pC.y - Math.sqrt(Math.pow(rInner,2)-Math.pow(pC.x-pLT.x-inset,2)));
				iRT = new Point( pRT.x - inset,
								pC.y == pRT.y ? pC.y :
								pC.y - Math.sqrt(Math.pow(rInner,2)-Math.pow(pC.x-(pRT.x-inset),2)));
				iRB = new Point(pRB.x-inset,pRB.y-inset);
				iLB = new Point(pLB.x+inset,pRB.y-inset);
				break;
			case "R":
				trace("pC.y="+pC.y);
				trace("pC.x="+pC.x);
				trace("pLT.x="+pLT.x);
				trace("pLT.y="+pLT.y);
			
				iLT = new Point( pLT.x + inset,
								pC.y == pLT.y ? pC.y :
								pC.y - Math.sqrt(Math.pow(rInner,2)-Math.pow(pC.x-pLT.x-inset,2)));
				
				iRT = new Point( pRT.x - inset,
								pC.y == pRT.y ? pC.y :
								pC.y - + Math.sqrt(Math.pow(rInner,2)-Math.pow(pRT.x-pC.x-inset,2)));
				iRB = new Point(pRB.x-inset,pRB.y-inset);
				iLB = new Point(pLB.x+inset,pLB.y-inset);
				break;
			default:
				break;	
				
		}
				d =  "M " + pLT.x + "," + pLT.y + " A " + r+","+r+" 0 0,1 " +pRT.x+","+pRT.y +
					" L " + iRT.x+","+iRT.y +
					" A "+rInner+","+rInner+" 180 0,0 "+ iLT.x+","+iLT.y +
					" L " + pLT.x +","+ pLT.y;
				
				dLeft = "M "+ pLT.x+","+pLT.y+
						" L "+pLB.x+","+pLB.y+
						" L "+iLB.x+","+iLB.y+
						" L "+iLT.x+","+iLT.y+
						" L	"+pLT.x+","+pLT.y;
				dRight = "M "+pRT.x+","+pRT.y+
						" L "+pRB.x+","+pRB.y+
						" L "+iRB.x+","+iRB.y+
						" L "+iRT.x+","+iRT.y+
						" L	"+pRT.x+","+pRT.y;
				dSill = "M " +pLB.x+","+pLB.y +
						" L " + pRB.x+","+pRB.y +
						" L " + iRB.x+","+iRB.y +
						" L " + iLB.x+","+iLB.y +
						" L " +pLB.x+"," +pLB.y;	
			
	}
	angleSill = Math.round(100*((angleSill) / Math.PI)*180)/100;
	
	var archCircumference = Math.abs(Math.atan2(pC.x-pLT.x, pC.y-pLT.y) - Math.atan2(pC.x-pRT.x, pC.y-pRT.y))*R;		
	
  
		var arch = drawing.getElementById(id + "_arch");
		if(arch === null && d != null)
		{
			arch = drawing.createElementNS(svgNS,"path");
			arch.setAttribute("id",id+"_arch");
			arch.setAttribute("class","frame");
			grp.appendChild(arch);
		}
		
		
		try
		{
			trace("d="+d);
			arch.setAttribute("d",d);
			arch.setAttribute("style","fill: "+color);
		}
		catch(e){alert(id + "_arch d="+d);}
		createDescription(id + "_arch", "ARCH WIDTH: " + getDim(w) + "    LENGTH: " +getDim(archCircumference)+"  OUTER RADIUS: "+getDim(r)+".");


		var bottomRail;
		if(dSill !== null)
		{
			bottomRail = drawing.getElementById(id + "_bottom_rail");
			if(bottomRail === null)
			{
				bottomRail = drawing.createElementNS(svgNS,"path");
				bottomRail.setAttribute("id",id+"_bottom_rail");
				bottomRail.setAttribute("class","frame");
				grp.appendChild(bottomRail);
			}
			try
			{
				trace("d="+dSill);
				bottomRail.setAttribute("d",dSill);
				bottomRail.setAttribute("style","fill: "+color);
			}
			catch(e){alert(id + "_bottom_rail d="+dSill);}
			trace("pLB.x="+pLB.x);
			trace("pRB.x="+pRB.x);
			createDescription(id + "_bottom_rail", "SILL WIDTH: " + getDim(pRB.x-pLB.x) + "  THICKNESS: "+getDim(inset)+"  MITRE: " + angleSill + " .");
			
		}	
		
		var leftRail;
		if(dLeft !== null)
		{
			leftRail = drawing.getElementById(id + "_left_rail");
			if(leftRail === null)
			{
				leftRail = drawing.createElementNS(svgNS,"path");
				leftRail.setAttribute("id",id+"_left_rail");
				leftRail.setAttribute("class","frame");
				grp.appendChild(leftRail);
			}
			try
			{
				trace("d="+dLeft);
				leftRail.setAttribute("d",dLeft);
				leftRail.setAttribute("style","fill: "+color);
			}
			catch(e){alert(id + "_left_rail d="+dSill);}
			createDescription(id + "_left_rail", "LEFT RAIL LENGTH: " + getDim(pLB.y-pLT.y) + "  THICKNESS: "+getDim(inset)+".");
			
		}	

		var rightRail;
		if(dRight !== null)
		{
			rightRail = drawing.getElementById(id + "_right_rail");
			if(rightRail === null && dRight != null)
			{
				rightRail = drawing.createElementNS(svgNS,"path");
				rightRail.setAttribute("id",id+"_right_rail");
				rightRail.setAttribute("class","frame");
				grp.appendChild(rightRail);
			}

			try
			{
				trace("d="+dRight);
				rightRail.setAttribute("d",dRight);
				rightRail.setAttribute("style","fill: "+color);
			}
			catch(e){alert(id + "_right_rail d="+dSill);}
			createDescription(id + "_right_rail", "RIGHT RAIL LENGTH: " + getDim(pRB.y-pRT.y) + "  THICKNESS: "+getDim(inset)+".");
		}
	

}	
catch(e)
{
	alertUser("Exception:  initArchCircularSeg'"+id+"',("+pLT.x+","+ pLT.y+"),("+pRT.x+","+ pRT.y+"),("+pLB.x+","+ pLB.y+"),("+pRB.x+","+ pRB.y+"',("+pC.x+","+ pC.y+"),"+ r+","+ inset+",'"+ color+"')");
	alertUser(e);
	trace(e);
}
}




/**
 * Draw a horizontal segment of a radial frame with a square base (i.e. sill)
 * 
 * 
 * @param id		String id
  * @param pLT		Point left top
 * @param pRT		Point right top
 * @param pLB		Point left bottom
 * @param pRB		Point right bottom
 * @param pC		Point center of the arc
 * @param r			decimal radius of the arc
 * @param inset		frame thickness
 * @param sill 		sill thinkness
 * @param color		frame flll color
 * @return
 */

function initArchCircularSegWithSill(id, pLT, pRT, pLB, pRB, pC, r, inset, sill, color)
{
// segType: F=full, L=left half, R=right half
try
{
trace("initArchCircularSegWithSill'"+id+"',("+pLT.x+","+ pLT.y+"),("+pRT.x+","+ pRT.y+"),("+pLB.x+","+ pLB.y+"),("+pRB.x+","+ pRB.y+"',("+pC.x+","+ pC.y+"),"+ r+","+ inset+","+ sill+",'"+ color+"')");

	var x = pLT.x;
	var y = Math.min(pLT.y,pRT.y);
	var w = pRT.x-pLT.x;
	
	var yBase = Math.max(pLT.y,pRT.y);
	var segType = "F";
	if(pLT.y < pRT.y)
	{
		segType = "R";
	}
	else
	if(pLT.y > pRT.y)
	{
		segType = "L";
	}
	
	var grp = drawing.getElementById(id);
	if(grp === null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id);
		
		drawing.getElementById("window").appendChild(grp);
	}
	var hLegs = pLB.y - Math.max(pLT.y,pRT.y);
	
	var iLT,iRT,iLB,iRB;
	


	var d = null;
	var dSill = null;
	var dLeft = null;
	var dRight = null;
	
	var	rInner = r - inset;
		
	if(hLegs === 0)
	{
		switch(segType)
		{
			case "F":
				iLT = new Point( pC.x - Math.sqrt(Math.pow(rInner,2)-Math.pow(pC.y-pLT.y,2)),
								pLT.y);
				iRT = new Point(pC.x + Math.sqrt(Math.pow(rInner,2)-Math.pow(pRT.y-pC.y,2)),
								pLT.y);	
				
			
				d =  "M " + pLT.x + "," + pLT.y + " A " + r+","+r+" 0 0,1 " +pRT.x+","+pRT.y +
					" L " + iRT.x+","+iRT.y +
					" A "+rInner+","+rInner+" 180 0,0 "+ iLT.x+","+iLT.y +
					" L " + pLT.x +","+ pLT.y;
				dSill = "M " +pLT.x+","+(pLT.y+sill) +
						" L " + pRT.x+","+(pRT.y+sill) +
						" L " + pRT.x+","+pRT.y +
						" L " + pLT.x+","+pLT.y +
						" L " +pLT.x+"," +(pLT.y+sill);	
						
				break;
			case "L":
				iLT = new Point( pC.x - Math.sqrt(Math.pow(rInner,2)-Math.pow(pC.y-pLT.y,2)),
								pLT.y);
				iRT = new Point( pRT.x - inset,
								pC.y - Math.sqrt(Math.pow(rInner,2)-Math.pow(inset,2)));
				iRB = new Point(pRB.x-inset,pRB.y);
				d =  "M " + pLT.x + "," + pLT.y + " A " + r+","+r+" 0 0,1 " +pRT.x+","+pRT.y +
					" L " + iRT.x+","+iRT.y +
					" A "+rInner+","+rInner+" 180 0,0 "+ iLT.x+","+iLT.y +
					" L " + pLT.x +","+ pLT.y;
				dRight = "M "+ pRT.x+","+pRT.y+
						" L "+pRB.x+","+pRB.y+
						" L "+iRB.x+","+iRB.y+
						" L "+iRT.x+","+iRT.y+
						" L	"+pRT.x+","+pRT.y;
				dSill = "M " +pLT.x+","+(pLT.y+sill) +
						" L " + pRB.x+","+(pRB.y+sill) +
						" L " + pRB.x+","+pRB.y +
						" L " + pLT.x+","+pLT.y +
						" L " +pLT.x+"," +(pLT.y+sill);	
						
				break;
			case "R":
				iLT = new Point( pLT.x + inset,
								pC.y - Math.sqrt(Math.pow(rInner,2)-Math.pow(inset,2)));
				
				iRT = new Point( pC.x + Math.sqrt(Math.pow(rInner,2)-Math.pow(pC.y-pRT.y,2)),
								pRT.y);
								
				iLB = new Point(pLB.x+inset,pLB.y);
				d =  "M " + pLT.x + "," + pLT.y + " A " + r+","+r+" 0 0,1 " +pRT.x+","+pRT.y +
					" L " + iRT.x+","+iRT.y +
					" A "+rInner+","+rInner+" 180 0,0 "+ iLT.x+","+iLT.y +
					" L " + pLT.x +","+ pLT.y;
				dLeft = "M "+ pLT.x+","+pLT.y+
						" L "+pLB.x+","+pLB.y+
						" L "+iLB.x+","+iLB.y+
						" L "+iLT.x+","+iLT.y+
						" L	"+pLT.x+","+pLT.y;
				dSill = "M " +pLB.x+","+(pLB.y+sill) +
						" L " + pRT.x+","+(pRT.y+sill) +
						" L " + pRT.x+","+pRT.y +
						" L " + pLB.x+","+pLB.y +
						" L " +pLB.x+"," +(pLB.y+sill);	
				break;
			default:
				break;	
		}
	}
	else
	{
		switch(segType)
		{
			case "F":
				iLT = new Point( pLT.x+inset,
									pC.y == pLT.y ? pC.y :
								 	pC.y - Math.sqrt(Math.pow(rInner,2)-Math.pow(pC.x-(pLT.x+inset),2)));
				iRT = new Point( pRT.x - inset,
								pC.y == pRT.y ? pC.y :
								pC.y - Math.sqrt(Math.pow(rInner,2)-Math.pow(pRT.x-inset-pC.x,2)));
				iLB = new Point( pLB.x+inset,pLB.y);
				iRB = new Point( pRB.x-inset,pLB.y);
				break;
				
			case "L":
				iLT = new Point( pLT.x+inset,
								 pC.y == pLT.y ? pC.y :
								 pC.y - Math.sqrt(Math.pow(rInner,2)-Math.pow(pC.x-pLT.x-inset,2)));
				iRT = new Point( pRT.x - inset,
								pC.y == pRT.y ? pC.y :
								pC.y - Math.sqrt(Math.pow(rInner,2)-Math.pow(inset,2)));
				iRB = new Point(pRB.x-inset,pRB.y);
				iLB = new Point(pLB.x+inset,pRB.y);
				break;
			case "R":
				iLT = new Point( pLT.x + inset,
								pC.y == pLT.y ? pC.y :
								pC.y - Math.sqrt(Math.pow(rInner,2)-Math.pow(inset,2)));
				
				iRT = new Point( pRT.x - inset,
								pC.y == pRT.y ? pC.y :
								pC.y - Math.sqrt(Math.pow(rInner,2)-Math.pow(pRT.x-inset-pC.x,2)));
				iRB = new Point(pRB.x-inset,pRB.y);
				iLB = new Point(pLB.x+inset,pLB.y);
				break;
			default:
				break;	
				
		}
				d =  "M " + pLT.x + "," + pLT.y + " A " + r+","+r+" 0 0,1 " +pRT.x+","+pRT.y +
					" L " + iRT.x+","+iRT.y +
					" A "+rInner+","+rInner+" 180 0,0 "+ iLT.x+","+iLT.y +
					" L " + pLT.x +","+ pLT.y;
				
				dLeft = "M "+ pLT.x+","+pLT.y+
						" L "+pLB.x+","+pLB.y+
						" L "+iLB.x+","+iLB.y+
						" L "+iLT.x+","+iLT.y+
						" L	"+pLT.x+","+pLT.y;
				dRight = "M "+pRT.x+","+pRT.y+
						" L "+pRB.x+","+pRB.y+
						" L "+iRB.x+","+iRB.y+
						" L "+iRT.x+","+iRT.y+
						" L	"+pRT.x+","+pRT.y;
				dSill = "M " +pLB.x+","+(pLB.y+sill) +
						" L " + pRB.x+","+(pRB.y+sill) +
						" L " + pRB.x+","+pRB.y +
						" L " + pLB.x+","+pLB.y +
						" L " +pLB.x+"," +(pLB.y+sill);	
			
	}
	var archCircumference = Math.abs(Math.atan2(pC.x-pLT.x, pC.y-pLT.y) - Math.atan2(pC.x-pRT.x, pC.y-pRT.y))*R;		
	
  
		var arch = drawing.getElementById(id + "_arch");
		if(arch === null && d != null)
		{
			arch = drawing.createElementNS(svgNS,"path");
			arch.setAttribute("id",id+"_arch");
			arch.setAttribute("class","frame");
			grp.appendChild(arch);
		}
		
		
		try
		{
			trace("d="+d);
			arch.setAttribute("d",d);
			arch.setAttribute("style","fill: "+color);
		}
		catch(e){alert(id + "_arch d="+d);}
		createDescription(id + "_arch", "ARCH WIDTH: " + getDim(w) + "    LENGTH: " +getDim(archCircumference)+"  OUTER RADIUS: "+getDim(r)+".");


		var bottomRail;
		if(dSill !== null)
		{
			bottomRail = drawing.getElementById(id + "_sill");
			if(bottomRail === null)
			{
				bottomRail = drawing.createElementNS(svgNS,"path");
				bottomRail.setAttribute("id",id+"_sill");
				bottomRail.setAttribute("class","frame");
				grp.appendChild(bottomRail);
			}
			try
			{
				trace("d="+dSill);
				bottomRail.setAttribute("d",dSill);
				bottomRail.setAttribute("style","fill: "+color);
			}
			catch(e){alert(id + "_sill d="+dSill);}
			createDescription(id + "_sill", "SILL LENGTH: " + getDim(pRB.x-pLB.x) + "  THICKNESS: "+getDim(sill)+ ".");
			
		}	
		
		var leftRail;
		if(dLeft !== null)
		{
			leftRail = drawing.getElementById(id + "_left_rail");
			if(leftRail === null)
			{
				leftRail = drawing.createElementNS(svgNS,"path");
				leftRail.setAttribute("id",id+"_left_rail");
				leftRail.setAttribute("class","frame");
				grp.appendChild(leftRail);
			}
			try
			{
				trace("d="+dLeft);
				leftRail.setAttribute("d",dLeft);
				leftRail.setAttribute("style","fill: "+color);
			}
			catch(e){alert(id + "_left_rail d="+dSill);}
			createDescription(id + "_left_rail", "LEFT RAIL LENGTH: " + getDim(pLB.y-pLT.y) + "  THICKNESS: "+getDim(inset)+".");
			
		}	

		var rightRail;
		if(dRight !== null)
		{
			rightRail = drawing.getElementById(id + "_right_rail");
			if(rightRail === null && dRight != null)
			{
				rightRail = drawing.createElementNS(svgNS,"path");
				rightRail.setAttribute("id",id+"_right_rail");
				rightRail.setAttribute("class","frame");
				grp.appendChild(rightRail);
			}

			try
			{
				trace("d="+dRight);
				rightRail.setAttribute("d",dRight);
				rightRail.setAttribute("style","fill: "+color);
			}
			catch(e){alert(id + "_right_rail d="+dSill);}
			createDescription(id + "_right_rail", "RIGHT RAIL LENGTH: " + getDim(pRB.y-pRT.y) + "  THICKNESS: "+getDim(inset)+".");
		}
	

}	
catch(e)
{
	alertUser("Exception: initArchCircularSegWithSill'"+id+"',("+pLT.x+","+ pLT.y+"),("+pRT.x+","+ pRT.y+"),("+pLB.x+","+ pLB.y+"),("+pRB.x+","+ pRB.y+"',("+pC.x+","+ pC.y+"),"+ r+","+ inset+","+ sill+",'"+ color+"')");
	alertUser(e);
	trace(e);
}
}





/**
 * Draw an arch grille pattern
 * 
 * @param id			String id of grille group
 * @param glass_x		decimal x coordinate of rectangle encompassing the glass 
 * @param glass_y		decimal y coordinate of rectangle encompassing the glass
 * @param glass_w		decimal width of rectangle encompassing the glass
 * @param glass_h		decimal height of rectangle encompassing the glass
 * @param leg_h			decimal leg height
 * @param inset			decimal inset from the containing frame
 * @param grid_pattern	String grid pattern
 * @param thk			decimal thickness of grille element 
 * @param color			String web color of grille
 * @param segParm		char F=full, L=left qtr-round, R=right qtr-round
 * @return
 */

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


/**
 * Draw arch grille
 * 
 * @param id 			String id
 * @param glass_xP		decimal x coordinate of the glass rectangle
 * @param glass_yP		decimal y coordinate of the glass rectangle
 * @param glass_wP		decimal width of the glass rectangle
 * @param glass_hP		decimal height of the glass rectangle
 * @param leg_hP		decimal leg height of the glass
 * @param hbars			integer horizontal bars
 * @param inset			decimal inset from from the containing frame
 * @param arches		integer arches
 * @param spokes		integer spokes radiating from inner arch
 * @param iSpokes		integer spokes radiating from center
 * @param scalloped		boolean true/false scolloped
 * @param thk			decimal thickness of grille element
 * @param color			String web color of elements
 * @param segType		char	F=full,L=left qtr-round, R=right qtr-round
 * @param redraw		boolean redrawing
 * @return	void
 */
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
	if(grp === null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id+"_grid");
		grp.getStyle().setProperty("clip-path","url(#"+idPrefix+"clip_"+id+")","");
		
		drawing.getElementById("window").appendChild(grp);
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
		
				registerArchElement(id,arch,cx,cy-1,archRadiusX*2,archRadiusY,thk,segType,redraw);					
				
			}
			arch_n.setAttribute("d",d);
			arch_n.getStyle().setProperty("stroke",color,"");
			arch_n.getStyle().setProperty("stroke-width",thk+"","");
			createDescription(arch_id,"RADIUS: " + getDim(archRadiusX) + "   LENGTH: "+getDim(archCircumference)+"   STOCK WIDTH: " + getDim(thk) + ".");
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
			createDescription(idPrefix+id+"_spoke_"+spoke,"LENGTH: " + getDim(len) + "   STOCK WIDTH: " + getDim(thk) +"  RADIUS OFFSET (in/out): " +getDim(radialPointsInner[spoke-1].c) + ","+getDim(radialPointsOuter[spoke-1].c)+".");
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
				
			createDescription(idPrefix+id+"_ispoke_"+ispoke,"LENGTH: " +getDim(len)+ "   STOCK WIDTH: " + getDim(thk) +"   RADIAL OFFSET:"+ getDim(radialPointsOuter[ispoke-1].c)+".");
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
				
			createDescription(idPrefix+id+"_split","  LENGTH: " +getDim(leg_h)+ "   STOCK WIDTH: " + getDim(thk) +".");
	
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
}catch(e)
{
	alertUser("Exception: 	drawArchGrille('"+id+"'"+glass_xP+","+glass_yP+","+glass_wP+","+glass_hP+","+leg_hP+","+inset+","+ arches+","+ spokes+","+ iSpokes+","+ scalloped +","+ thk +",'"+ color+"','"+segType+"')");
	alertUser(e);
	trace(e);
}		
}









/**
 * Draw seg hub grille
 * 
 * @param id 			String id
 * @param glass_xP		decimal x coordinate of the glass rectangle
 * @param glass_yP		decimal y coordinate of the glass rectangle
 * @param glass_wP		decimal width of the glass rectangle
 * @param arch_hP		decimal height of the arch
 * @param leg_hP		decimal leg height of the glass
 * @param hbars			integer horizontal bars
 * @param inset			decimal inset from from the containing frame
 * @param vBars			integer arches
 * @param hBars			integer spokes radiating from inner arch
 * @param thk			decimal thickness of grille element
 * @param color			String web color of elements
 * @param redraw		boolean redrawing
 * @return	void
 */

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
	if(grp === null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id+"_grid");
		grp.getStyle().setProperty("clip-path","url(#"+idPrefix+"clip_"+id+")","");
		
		drawing.getElementById("window").appendChild(grp);
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
			createDescription(arch_id,"RADIUS: " + getDim(archRadiusX) + "   STOCK WIDTH: " + getDim(thk) + ".");

	
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
			createDescription(idPrefix+id+"_spoke_"+spoke,"LENGTH: " + getDim(len) + "   STOCK WIDTH: " + getDim(thk) +".");

			path="M " + (radialPointsInner[spoke-1].x) + "," +(radialPointsInner[spoke-1].y) + 
					" L " + (radialPointsInner[spoke-1].x) + "," + (glass_y+glass_h);
					
			len = (glass_y+glass_h) - radialPointsInner[spoke-1].y;
			vBar.setAttribute("d",path);
			vBar.getStyle().setProperty("stroke",color,"");
			vBar.getStyle().setProperty("stroke-width",thk+"","");
			createDescription(idPrefix+id+"_v"+spoke,"LENGTH: " + getDim(len) + "   STOCK WIDTH: " + getDim(thk) +".");

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
			createDescription(arch_id,"LENGTH: " + getDim(glass_w) + "   STOCK WIDTH: " + getDim(thk) +".");
		}
			
	if(hBars > 0)
	{
		drawHorizontalBars(id,grp,glass_x,glass_y+glass_h,glass_w,leg_h,hBars,color,thk,false,redraw);
	
	}

	
}catch(e)
{
	alertUser("Exception:  drawSegHubGrille('"+id+"'"+glass_xP+","+glass_yP+","+glass_wP+","+arch_hP+","+ leg_hP+","+ inset+","+ vBars+","+ hBars +","+ thk +",'"+ color+"')");
	alertUser(e);
	trace(e);
}		
}













/**
 * Draw gothic grille
 * 
 * @param id 			String id
 * @param glass_xP		decimal x coordinate of the glass rectangle
 * @param glass_yP		decimal y coordinate of the glass rectangle
 * @param glass_wP		decimal width of the glass rectangle
 * @param glass_hP		decimal height of the glass rectangle
 * @param leg_hP		decimal leg height of the glass
 * @param hbars			integer horizontal bars
 * @param inset			decimal inset from from the containing frame
 * @param spokes		integer arc spokes 
 * @param thk			decimal thickness of grille element
 * @param color			String web color of elements
 * @param segType		char	F=full,L=left qtr-round, R=right qtr-round
 * @param redraw		boolean redrawing
 * @return	void
 */

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
	if(grp === null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id+"grille");
		grp.getStyle().setProperty("clip-path","url(#"+idPrefix+"clip_"+id+")","");
		
		drawing.getElementById("window").appendChild(grp);
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

}catch(e)
{
	alertUser("Exception:  drawGothicGrille('"+id+"'"+glass_xP+","+glass_yP+","+glass_wP+","+glass_hP+","+ spokes+",'"+ thk +",'"+ color+"','"+ segType+"',"+redraw+")");
	alertUser(e);
	trace(e);
}
}

/**
 * Creates a arch scallop
 * 
 * @param idGlass		String id of glass
 * @param nScallop		integer ordinal number
 * @param grp			Node parent group
 * @param r				decimal radius
 * @param p1			Point start
 * @param p2			Point end
 * @param color			String web color code
 * @param thk			decimal thickness of grille element
 * @param redraw		boolean redrawing
 * @return
 */

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




/**
 * Register an arch element for alignment
 * 
 * @param id		String id
 * @param n			integer ordinal number
 * @param xC		decimal x coordinate of the center
 * @param y			decimal y coordinate of top
 * @param w			decimal width of the arch
 * @param h			decimal height of the arch
 * @param thk		decimal thickness of the grille element
 * @param segType	char	F=full,L=left qtr-round, R=right qtr-round
 * @param redraw	boolean redrawing
 * @return
 */

function registerArchElement(id,n,xC,y,w,h,thk,segType,redraw)
{
trace("registerArchElement('"+id+"',"+n+","+xC+","+y+","+w+","+h+","+thk+",'"+segType+"',"+redraw+")");

	whRatio = w/h;
	
	var archId = id+"_arch_"+n;
	var idPrefix = g("f_idprefix");
	var grp = drawing.getElementById(id+"_grid");


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


 