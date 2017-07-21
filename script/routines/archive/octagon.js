function initGlassOctagon(id,sashId,x, y, d, f /*inset*/, v /*hidden glass inset*/)
{
try
{
trace("initGlassOctagon('"+id+"','"+sashId+"',"+x+","+ y+","+ d+","+ f+","+ v+")");
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
		gls.setAttribute("onmouseover","expose(evt,'"+idPrefix+sashId+"',true)");
		gls.setAttribute("onmouseout","expose(evt,'"+idPrefix+sashId+"',false)");
		gls.setAttribute("d","M 0,0");
	//These attributes don't apply to a <path>, but they feed the grid functions
		gls.setAttribute("x",x);
		gls.setAttribute("y",y);
		gls.setAttribute("width",d);
		gls.setAttribute("height",d);
		
		
		grp.appendChild(gls);
	}
	
	var s = (d-(2*f))*.414211;
	var sd = Math.sqrt(Math.pow(s,2)/2);
	
	
	insetXY = Math.tan(Math.PI/8)*f;
	
	var point1 = new Point(x+f+sd+insetXY, y+f);
	var point2 = new Point(x+f+sd+s-insetXY, y+f);
	var point3 = new Point(x+f+sd+s+sd, y+f+sd+insetXY);
	var point4 = new Point(x+f+sd+s+sd, y+f+sd+s-insetXY);
	var point5 = new Point(x+f+sd+s-insetXY, y+f+sd+s+sd);
	var point6 = new Point(x+f+sd+insetXY, y+f+sd+s+sd);
	var point7 = new Point(x+f, y+f+sd+s-insetXY);
	var point8 = new Point(x+f, y+f+sd+insetXY);
	


	path = 
		"M " +	point1.x + "," + point1.y + 
		" L "+  point2.x + "," + point2.y + 
		" L "+  point3.x + "," + point3.y + 
		" L "+  point4.x + "," + point4.y + 
		" L "+  point5.x + "," + point5.y + 
		" L "+  point6.x + "," + point6.y + 
		" L "+  point7.x + "," + point7.y + 
		" L "+  point8.x + "," + point8.y +
		" L "+  point1.x + "," + point1.y ; 
	gls.setAttribute("d",path);
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
		t.setAttribute("x",point5.x-2);
		t.setAttribute("y",point5.y-2);
	}


	if(g("f_tn")!="true")
	{
		var desc = "DIAMETER: %D% VISIBLE: %DV%.";
		desc = desc.replace(/%D%/g,getDim(d-f));
		desc = desc.replace(/%DV%/g,getDim(d-f-v));
		createDescription(id+"_pane",desc);
	}
}	
catch(e)
{
	alertUser("Exception: initGlassOctagon('"+id+"','"+sashId+"',"+x+","+ y+","+ d +","+ f+","+ v+")");

	alertUser(e);
	trace(e);
}	
}

function initMitredOctagonFrame(id, x, y, d, f, color)
{
try
{
trace("initMitredOctagonFrame('"+id+"',"+x+","+ y+","+ d +","+ f+",'"+ color+"')");

	var desc = "";
	// frame group
	var grp = drawing.getElementById(id);
	if(grp === null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id);
		
		drawing.getElementById("window").appendChild(grp);
	}

	var side1 = drawing.getElementById(id+"_1");
	if(side1 === null)
	{
		side1 = drawing.createElementNS(svgNS,"path");
		side1.setAttribute("id",id+"_1");
		side1.setAttribute("class","frame");
		side1.setAttribute("d","M 0,0");
		grp.appendChild(side1);
	}

	var side2 = drawing.getElementById(id+"_2");
	if(side2 === null)
	{
		side2 = drawing.createElementNS(svgNS,"path");
		side2.setAttribute("id",id+"_2");
		side2.setAttribute("class","frame");
		side2.setAttribute("d","M 0,0");
		grp.appendChild(side2);
	}
	
	var side3 = drawing.getElementById(id+"_3");
	if(side3 === null)
	{
		side3 = drawing.createElementNS(svgNS,"path");
		side3.setAttribute("id",id+"_3");
		side3.setAttribute("class","frame");
		side3.setAttribute("d","M 0,0");
		grp.appendChild(side3);
	}
	var side4 = drawing.getElementById(id+"_4");
	if(side4 === null)
	{
		side4 = drawing.createElementNS(svgNS,"path");
		side4.setAttribute("id",id+"_4");
		side4.setAttribute("class","frame");
		side4.setAttribute("d","M 0,0");
		grp.appendChild(side4);
	}
	var side5 = drawing.getElementById(id+"_5");
	if(side5 === null)
	{
		side5 = drawing.createElementNS(svgNS,"path");
		side5.setAttribute("id",id+"_5");
		side5.setAttribute("class","frame");
		side5.setAttribute("d","M 0,0");
		grp.appendChild(side5);
	}
	var side6 = drawing.getElementById(id+"_6");
	if(side6 === null)
	{
		side6 = drawing.createElementNS(svgNS,"path");
		side6.setAttribute("id",id+"_6");
		side6.setAttribute("class","frame");
		side6.setAttribute("d","M 0,0");
		grp.appendChild(side6);
	}
	var side7 = drawing.getElementById(id+"_7");
	if(side7 === null)
	{
		side7 = drawing.createElementNS(svgNS,"path");
		side7.setAttribute("id",id+"_7");
		side7.setAttribute("class","frame");
		side7.setAttribute("d","M 0,0");
		grp.appendChild(side7);
	}
	var side8 = drawing.getElementById(id+"_8");
	if(side8 === null)
	{
		side8 = drawing.createElementNS(svgNS,"path");
		side8.setAttribute("id",id+"_8");
		side8.setAttribute("class","frame");
		side8.setAttribute("d","M 0,0");
		grp.appendChild(side8);
	}
	
	var s = d*.414211;
	var sd = Math.sqrt(Math.pow(s,2)/2);
	insetXY = Math.tan(Math.PI/8)*f;
	trace("insetXY="+insetXY);
	





	
	var point1a = new Point(x+sd, y);
	var point2a = new Point(x+sd+s, y);
	var point3a = new Point(x+sd+s+sd, y+sd);
	var point4a = new Point(x+sd+s+sd, y+sd+s);
	var point5a = new Point(x+sd+s, y+sd+s+sd);
	var point6a = new Point(x+sd, y+sd+s+sd);
	var point7a = new Point(x, y+sd+s);
	var point8a = new Point(x, y+sd);

	var point1b = new Point(x+sd+insetXY, y+f);
	var point2b = new Point(x+sd+s-insetXY, y+f);
	var point3b = new Point(x+sd+s+sd-f, y+sd+insetXY);
	var point4b = new Point(x+sd+s+sd-f, y+sd+s-insetXY);
	var point5b = new Point(x+sd+s-insetXY, y+sd+s+sd-f);
	var point6b = new Point(x+sd+insetXY, y+sd+s+sd-f);
	var point7b = new Point(x+f, y+sd+s-insetXY);
	var point8b = new Point(x+f, y+sd+insetXY);
	


	var path = 
		"M " +	point1a.x + "," + point1a.y + 
		" L "+  point2a.x + "," + point2a.y + 
		" L "+  point2b.x + "," + point2b.y + 
		" L "+  point1b.x + "," + point1b.y + 
		" L "+  point1a.x + "," + point1a.y;
	side1.setAttribute("d",path);
	side1.getStyle().setProperty("fill",color,"");
trace(path);
	path = 
		"M " +	point2a.x + "," + point2a.y + 
		" L "+  point3a.x + "," + point3a.y + 
		" L "+  point3b.x + "," + point3b.y + 
		" L "+  point2b.x + "," + point2b.y + 
		" L "+  point2a.x + "," + point2a.y;
	side2.setAttribute("d",path);
	side2.getStyle().setProperty("fill",color,"");

	path = 
		"M " +	point3a.x + "," + point3a.y + 
		" L "+  point4a.x + "," + point4a.y + 
		" L "+  point4b.x + "," + point4b.y + 
		" L "+  point3b.x + "," + point3b.y + 
		" L "+  point3a.x + "," + point3a.y;
	side3.setAttribute("d",path);
	side3.getStyle().setProperty("fill",color,"");

	path = 
		"M " +	point4a.x + "," + point4a.y + 
		" L "+  point5a.x + "," + point5a.y + 
		" L "+  point5b.x + "," + point5b.y + 
		" L "+  point4b.x + "," + point4b.y + 
		" L "+  point4a.x + "," + point4a.y;
	side4.setAttribute("d",path);
	side4.getStyle().setProperty("fill",color,"");
	
	path = 
		"M " +	point5a.x + "," + point5a.y + 
		" L "+  point6a.x + "," + point6a.y + 
		" L "+  point6b.x + "," + point6b.y + 
		" L "+  point5b.x + "," + point5b.y + 
		" L "+  point5a.x + "," + point5a.y;
	side5.setAttribute("d",path);
	side5.getStyle().setProperty("fill",color,"");

	path = 
		"M " +	point6a.x + "," + point6a.y + 
		" L "+  point7a.x + "," + point7a.y + 
		" L "+  point7b.x + "," + point7b.y + 
		" L "+  point6b.x + "," + point6b.y + 
		" L "+  point6a.x + "," + point6a.y;
	side6.setAttribute("d",path);
	side6.getStyle().setProperty("fill",color,"");
	
	path = 
		"M " +	point7a.x + "," + point7a.y + 
		" L "+  point8a.x + "," + point8a.y + 
		" L "+  point8b.x + "," + point8b.y + 
		" L "+  point7b.x + "," + point7b.y + 
		" L "+  point7a.x + "," + point7a.y;
	side7.setAttribute("d",path);
	side7.getStyle().setProperty("fill",color,"");

	path = 
		"M " +	point8a.x + "," + point8a.y + 
		" L "+  point1a.x + "," + point1a.y + 
		" L "+  point1b.x + "," + point1b.y + 
		" L "+  point8b.x + "," + point8b.y + 
		" L "+  point8a.x + "," + point8a.y;
	side8.setAttribute("d",path);
	side8.getStyle().setProperty("fill",color,"");

	var ix=1;
	if(g("f_tn")!="true")
	{
		for(;ix<=8;ix++)
		{
			createDescription(id+"_"+ix, "FRAME SEGMENT... base LENGTH: " + getDim(s)  + "  THICKNESS: " + getDim(f) + "   MITRE: 67.5 degrees.");
		}
	}

}	
catch(e)
{
	alertUser("Exception:  initMitredOctagonFrame('"+id+"',"+x+","+ y+","+ d +","+ f+",'"+ color+"')");
	alertUser(e);
	trace(e);
}	
}