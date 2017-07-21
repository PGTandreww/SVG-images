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
