function initGlassTrapezoid(id,sashId,x, y, w, h, hs, f /*inset*/, v /*hidden glass inset*/, type)
{
try
{
trace("initGlassTrapezoid('"+id+"','"+sashId+"',"+x+","+ y+","+ w+","+ h+","+ hs+","+ f+","+ v+",'"+type+"')");
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
		gls.setAttribute("width",w);
		gls.setAttribute("height",h);
		
		grp.appendChild(gls);
	}
	
	var t,tText;
	if(g("f_glass") == "TEMPERED")
	{
	trace("creating T");
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
		switch(type)
		{
			case "RT":
			case "LT":
			case "IT":
			case "LB":
				t.setAttribute("x",x+w-2);
				t.setAttribute("y",y+h-2);
				break;
				
			case "RB":
			case "IB":
				t.setAttribute("x",x+2);
				t.setAttribute("y",y+2);
				break;
			default:
				t.setAttribute("x",x+2);
				t.setAttribute("y",y+2);
				break;
		}
	}
	
	var path,angleA,angleB,angleC,pointA, pointB, pointC, pointD, insetX, insetY,wV,hV, hsV,wNet,hNet, hsNet, lDiag;

	switch(type)
	{
		case "RT":  // facing right, pointy end up
		{
			angleA = Math.atan2(w,(h-hs));
			insetY = f/Math.tan(angleA/2);
			pointA = new Point(x+f,y+insetY);
									
			angleB = Math.PI - angleA;
			insetY = f/Math.tan(angleB/2);
			
			pointB = new Point(x+w-f,y+(h-hs)+insetY);
			
			pointC = new Point(x+w-f,y+h-f);
			
			pointD = new Point(x+f,y+h-f);
			
		
		}
		break;
		case "RB": // facing right, pointy end down
		{
			angleA = Math.atan2(w,(h-hs));
			insetY = f/Math.tan(angleA/2);
			pointA = new Point(x+f,y+h-insetY);
			
			angleB = Math.PI - angleA;
			insetY = f/Math.tan(angleB/2);
			
			pointB = new Point(x+w-f,y+hs-insetY);
			
			pointC = new Point(x+w-f,y-f);
			pointD = new Point(x+f,y+f);
			
		}
			break;
		case "LT":  // facing left, pointy end up
		{
			angleA = Math.atan2(w,(h-hs));
			insetY = f/Math.tan(angleA/2);
			pointA = new Point(x+w-f,y+insetY);
			
			angleB = Math.PI - angleA;
			insetY = f/Math.tan(angleB/2);
			
			pointB = new Point(x+f,y+(h-hs)+insetY);
			pointC = new Point(x+f,y+h-f);
			pointD = new Point(x+w-f,y+h-f);
		}
		break;
		case "LB": // facing left, pointy end down
		{
			angleA = Math.atan2(w,(h-hs));
			insetY = f/Math.tan(angleA/2);
			pointA = new Point(x+w-f,y+h+insetY);
				
			angleB = Math.PI - angleA;
			insetY = f/Math.tan(angleB/2);
			
			pointB = new Point(x+f,y+hs-insetY);
			
			
			pointC = new Point(x+f,y+f);
			pointD = new Point(x+w-f,y+f);
		}
			break;	

		case "IT": // narrow end Up
		{
			pointA = new Point(x+((w-hs)/2),y+f);
			pointB = new Point(x+f,y+h-f);
			pointC = new Point(x+w-f,y+h-f);
			pointD = new Point(x+w-((w-hs)/2),y+f);
		}
			break;	

		case "IB": // narrow end Down
		{
			pointA = new Point(x+w-((w-hs)/2),y+h-f);
			pointB = new Point(x+w-f,y+f);
			pointC = new Point(x+f,y+f);
			pointD = new Point(x+((w-hs)/2),y+h-f);
		}
			break;	
		default:
			break;
	}
	




	path = "M " + pointA.x + "," + pointA.y + " L "+ pointB.x + "," + pointB.y + " L " + pointC.x + "," + pointC.y + " L " + pointD.x + "," + pointD.y + " L " + pointA.x + "," + pointA.y;
	gls.setAttribute("d",path);


	if(g("f_tn")!="true")
	{
		var desc = "WIDTH: %W%  HEIGHT: %H%  VISIBLE: %WV%X%HV%.";
		desc = desc.replace(/%W%/g,getDim(wNet));
		desc = desc.replace(/%H%/g,getDim(hNet));
		desc = desc.replace(/%WV%/g,getDim(wV));
		desc = desc.replace(/%HV%/g,getDim(hV));
		createDescription(id+"_pane",desc);
	}
}	
catch(e)
{
	alertUser("Exception: initGlassTrapezoid('"+id+"','"+sashId+"',"+x+","+ y+","+ w+","+ h+","+ hs+","+ f+","+ v+",'"+type+"')");

	alertUser(e);
	trace(e);
}	
}

function initTrapezoidFrame(id, x, y, w, h, hs, f,sillThk, color, type)
{
try
{
trace("initTrapezoidFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+hs+","+ f+",'"+sillThk+",'"+ color+"','"+ type+"')");

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

	var sideA = drawing.getElementById(id+"_a");
	if(sideA === null)
	{
		sideA = drawing.createElementNS(svgNS,"path");
		sideA.setAttribute("id",id+"_a");
		sideA.setAttribute("class","frame");
		sideA.setAttribute("d","M 0,0");
		
		grp.appendChild(sideA);
	}
	
	var sideB = drawing.getElementById(id+"_b");
	if(sideB === null)
	{
		sideB = drawing.createElementNS(svgNS,"path");
		sideB.setAttribute("id",id+"_b");
		sideB.setAttribute("class","frame");
		sideB.setAttribute("d","M 0,0");
		
		grp.appendChild(sideB);
	}
	
	var sideC = drawing.getElementById(id+"_c");
	if(sideC === null)
	{
		sideC = drawing.createElementNS(svgNS,"path");
		sideC.setAttribute("id",id+"_c");
		sideC.setAttribute("class","frame");
		sideC.setAttribute("d","M 0,0");
		
		grp.appendChild(sideC);
	}

	var sideD = drawing.getElementById(id+"_d");
	if(sideD === null)
	{
		sideD = drawing.createElementNS(svgNS,"path");
		sideD.setAttribute("id",id+"_d");
		sideD.setAttribute("class","frame");
		sideD.setAttribute("d","M 0,0");
		
		grp.appendChild(sideD);
	}
		
	var angleA,angleB,angleC,degA,degB,degC,pointA, pointB, pointC, pointD, pathA, pathB, pathC, insetX, insetY;
	

	switch(type)
	{
		case "RT":  // facing right, pointy end up
		{
			angleA = Math.atan2(w,(h-hs));
			
			degA = (angleA / Math.PI)*90;
			
			insetY = f/Math.tan(angleA/2);
			
			pointA = new Point(x+f,y+insetY);
			
							
			angleB = Math.PI - angleA;
			degB = (angleB / Math.PI)*90;
			insetY = f/Math.tan(angleB/2);
			
			pointB = new Point(x+w-f,y+(h-hs)+insetY);
			
			
			
			
			
			pointC = new Point(x+w-f,y+h-sillThk);
			
			pointD = new Point(x+f,y+h-sillThk);
			
			
			pathA = "M " + x + "," + y + " l "+ w+","+ (h-hs) + " L "+ pointB.x+","+pointB.y+
						" L "+ pointA.x+","+pointA.y + " L " +x+","+y;
			
			pathB = "M " + (x+w) + "," + (y+h-hs) + " l 0,"+(y+hs-sillThk)+" L "+pointC.x+","+pointC.y+
						" L "+ pointB.x+","+pointB.y + " L " +(x+w)+","+(y+h-hs);
				
			pathC = "M " + (x+w) + "," + (y+h) + " l -"+w+",0 l 0,-"+ sillThk+
						" l "+ w+",0 l 0,"+sillThk;
		
			pathD = "M " + (x) + "," + (y) + " l 0,"+(h-sillThk)+" L "+ pointD.x+","+pointD.y+
						" L "+ pointA.x+","+pointA.y + " L "+ (x) + "," + (y);
		
			createDescription(id+"_a", "HEAD-RAIL... base LENGTH: " + getDim(Math.sqrt(Math.pow(w,2)+Math.pow((h-hs),2)))  + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA)+"," + Math.round(degB) + " degrees.");
			createDescription(id+"_b", "SIDE-RAIL... base LENGTH: " + getDim(hs-sillThk) + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degB) + " degrees.");
			createDescription(id+"_c", "SILL... base LENGTH: " + getDim(w) + "  THICKNESS: " + getDim(sillThk) + ".");
			createDescription(id+"_d", "SIDE-RAIL...base LENGTH: " + getDim(h-sillThk) + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA)+" degrees.");
		
		}
		break;

		case "LT":  // facing left, pointy end up
		{
			angleA = Math.atan2(w,(h-hs));
			
			degA = (angleA / Math.PI)*90;
			
			insetY = f/Math.tan(angleA/2);
			
			pointA = new Point(x+w-f,y+insetY);
			
			angleB = Math.PI - angleA;
			degB = (angleB / Math.PI)*90;
			insetY = f/Math.tan(angleB/2);
			
			pointB = new Point(x+f,y+(h-hs)+insetY);
			
			pointC = new Point(x+f,y+h-sillThk);
			
			pointD = new Point(x+w-f,y+h-sillThk);
			
			
			pathA = "M " + (x+w) + "," + (y) + " l -"+ w+","+ (h-hs) + " L "+ pointB.x+","+pointB.y+
						" L "+ pointA.x+","+pointA.y + " L " +(x+w)+","+(y);
			
			pathB = "M " + (x) + "," + (y+(h-hs)) + " l 0,"+(hs-sillThk)+" L "+pointC.x+","+pointC.y+
						" L "+ pointB.x+","+pointB.y + " L " +(x)+","+(y+(h-hs));
				
			pathC = "M " + (x+w) + "," + (y+h) + " l -"+w+",0 l 0,-"+ sillThk+
						" l "+ w+",0 l 0,"+sillThk;
		
			pathD = "M " + (x+w) + "," + (y+h-sillThk) + " l 0,-"+(h-sillThk)+" L "+ pointA.x+","+pointA.y+
						" L "+ pointD.x+","+pointD.y + " L "+ (x+w) + "," + (y+h-sillThk);
		
			createDescription(id+"_a", "CROSS-RAIL... base LENGTH: " + getDim(Math.sqrt(Math.pow(w,2)+Math.pow((h-hs),2)))  + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA)+"," + Math.round(degB) + " degrees.");
			createDescription(id+"_b", "SIDE-RAIL... base LENGTH: " + getDim(hs-sillThk) + "  THICKNESS: " + getDim(f) + "   MITRE: "+Math.round(degB)+" degrees.");
			createDescription(id+"_c", "SILL... base LENGTH: " + getDim(w) + "  THICKNESS: " + getDim(sillThk) + ".");
			createDescription(id+"_d", "SIDE-RAIL...base LENGTH: " + getDim(h-sillThk) + "  THICKNESS: " + getDim(f) + "   MITRE: "+ Math.round(degA)+" degrees.");
			
		}
		break;


		default:
			break;
	}
	
	sideA.setAttribute("d",pathA);
	sideB.setAttribute("d",pathB);
	sideC.setAttribute("d",pathC);
	sideD.setAttribute("d",pathD);
	
	sideA.getStyle().setProperty("fill",color,"");
	sideB.getStyle().setProperty("fill",color,"");
	sideC.getStyle().setProperty("fill",color,"");
	sideD.getStyle().setProperty("fill",color,"");
	
	
		

	

}	
catch(e)
{
	alertUser("Exception:  initTrapezoidFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+hs+","+ f+",'"+sillThk+",'"+ color+"','"+ type+"')");
	alertUser(e);
	trace(e);
}	
}

function initMitredTrapezoidFrame(id, x, y, w, h, hs, f, color, type)
{
try
{
trace("initMitredTrapezoidFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+hs+","+ f+",'"+ color+"','"+ type+"')");

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

	var sideA = drawing.getElementById(id+"_a");
	if(sideA === null)
	{
		sideA = drawing.createElementNS(svgNS,"path");
		sideA.setAttribute("id",id+"_a");
		sideA.setAttribute("class","frame");
		sideA.setAttribute("d","M 0,0");
		
		grp.appendChild(sideA);
	}
	
	var sideB = drawing.getElementById(id+"_b");
	if(sideB === null)
	{
		sideB = drawing.createElementNS(svgNS,"path");
		sideB.setAttribute("id",id+"_b");
		sideB.setAttribute("class","frame");
		sideB.setAttribute("d","M 0,0");
		
		grp.appendChild(sideB);
	}
	
	var sideC = drawing.getElementById(id+"_c");
	if(sideC === null)
	{
		sideC = drawing.createElementNS(svgNS,"path");
		sideC.setAttribute("id",id+"_c");
		sideC.setAttribute("class","frame");
		sideC.setAttribute("d","M 0,0");
		
		grp.appendChild(sideC);
	}

	var sideD = drawing.getElementById(id+"_d");
	if(sideD === null)
	{
		sideD = drawing.createElementNS(svgNS,"path");
		sideD.setAttribute("id",id+"_d");
		sideD.setAttribute("class","frame");
		sideD.setAttribute("d","M 0,0");
		
		grp.appendChild(sideD);
	}
		
	var angleA,angleB,angleC,degA,degB,degC,pointA, pointB, pointC, pointD, pathA, pathB, pathC, insetX, insetY;
	

	switch(type)
	{
		case "RT":  // facing right, pointy end up
		{
			angleA = Math.atan2(w,(h-hs));
			
			degA = (angleA / Math.PI)*90;
			
			insetY = f/Math.tan(angleA/2);
			
			pointA = new Point(x+f,y+insetY);
			
							
			angleB = Math.PI - angleA;
			degB = (angleB / Math.PI)*90;
			insetY = f/Math.tan(angleB/2);
			
			pointB = new Point(x+w-f,y+(h-hs)+insetY);
			
			
			
			
			
			pointC = new Point(x+w-f,y+h-f);
			
			pointD = new Point(x+f,y+h-f);
			
			
			pathA = "M " + x + "," + y + " l "+ w+","+ (h-hs) + " L "+ pointB.x+","+pointB.y+
						" L "+ pointA.x+","+pointA.y + " L " +x+","+y;
			
			pathB = "M " + (x+w) + "," + (y+h-hs) + " l 0,"+(y+hs)+" L "+pointC.x+","+pointC.y+
						" L "+ pointB.x+","+pointB.y + " L " +(x+w)+","+(y+h-hs);
				
			pathC = "M " + (x+w) + "," + (y+h) + " l -"+w+",0 L "+ pointD.x+","+pointD.y+
						" L "+ pointC.x+","+pointC.y + " L "+ (x+w) + "," + (y+h);
		
			pathD = "M " + (x) + "," + (y) + " l 0,"+h+" L "+ pointD.x+","+pointD.y+
						" L "+ pointA.x+","+pointA.y + " L "+ (x) + "," + (y);
		
			createDescription(id+"_a", "HEAD-RAIL... base LENGTH: " + getDim(Math.sqrt(Math.pow(w,2)+Math.pow((h-hs),2)))  + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA)+"," + Math.round(degB) + " degrees.");
			createDescription(id+"_b", "SIDE-RAIL... base LENGTH: " + getDim(hs) + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degB) + ",45 degrees.");
			createDescription(id+"_c", "SILL... base LENGTH: " + getDim(w) + "  THICKNESS: " + getDim(f) + "   MITRE: 45,45 degrees.");
			createDescription(id+"_d", "SIDE-RAIL...base LENGTH: " + getDim(h) + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA)+",45 degrees.");
		
		}
		break;
		case "RB": // facing right, pointy end down
		{
			angleA = Math.atan2(w,(h-hs));
			
			degA = (angleA / Math.PI)*90;
			
			insetY = f/Math.tan(angleA/2);
			
			pointA = new Point(x+f,y+h-insetY);
			
			
			angleB = Math.PI - angleA;
			degB = (angleB / Math.PI)*90;
			insetY = f/Math.tan(angleB/2);
			
			pointB = new Point(x+w-f,y+hs-insetY);
			
			
			
			pointC = new Point(x+w-f,y-f);
			
			pointD = new Point(x+f,y+f);
			
			
			pathA = "M " + x + "," + (y+h) + " l "+ w+",-"+ (h-hs) + " L "+ pointB.x+","+pointB.y+
						" L "+ pointA.x+","+pointA.y + " L " +x+","+(y+h);
			
			pathB = "M " + (x+w) + "," + (y+hs) + " l 0,-"+(hs)+" L "+pointC.x+","+pointC.y+
						" L "+ pointB.x+","+pointB.y + " L " +(x+w)+","+(y+hs);
				
			pathC = "M " + (x) + "," + (y) + " l "+w+",0 L "+ pointC.x+","+pointC.y+
						" L "+ pointD.x+","+pointD.y + " L "+ (x) + "," + (y);
		
			pathD = "M " + (x) + "," + (y) + " l 0,"+h+" L "+ pointA.x+","+pointA.y+
						" L "+ pointD.x+","+pointD.y + " L "+ (x) + "," + (y);
		
			createDescription(id+"_a", "CROSS-RAIL... base LENGTH: " + getDim(Math.sqrt(Math.pow(w,2)+Math.pow((h-hs),2)))  + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA)+"," + Math.round(degB) + " degrees.");
			createDescription(id+"_b", "SIDE-RAIL... base LENGTH: " + getDim(hs) + "  THICKNESS: " + getDim(f) + "   MITRE: "+Math.round(degB)+",45 degrees.");
			createDescription(id+"_c", "HEAD-RAIL... base LENGTH: " + getDim(w) + "  THICKNESS: " + getDim(f) + "   MITRE: 45,45 degrees.");
			createDescription(id+"_d", "SIDE-RAIL...base LENGTH: " + getDim(h) + "  THICKNESS: " + getDim(f) + "   MITRE: 45,"+ Math.round(degA)+" degrees.");
			
		
		}
			break;
		case "LT":  // facing left, pointy end up
		{
			angleA = Math.atan2(w,(h-hs));
			
			degA = (angleA / Math.PI)*90;
			
			insetY = f/Math.tan(angleA/2);
			
			pointA = new Point(x+w-f,y+insetY);
			
			angleB = Math.PI - angleA;
			degB = (angleB / Math.PI)*90;
			insetY = f/Math.tan(angleB/2);
			
			pointB = new Point(x+f,y+(h-hs)+insetY);
			
			pointC = new Point(x+f,y+h-f);
			
			pointD = new Point(x+w-f,y+h-f);
			
			
			pathA = "M " + (x+w) + "," + (y) + " l -"+ w+","+ (h-hs) + " L "+ pointB.x+","+pointB.y+
						" L "+ pointA.x+","+pointA.y + " L " +(x+w)+","+(y);
			
			pathB = "M " + (x) + "," + (y+(h-hs)) + " l 0,"+(hs)+" L "+pointC.x+","+pointC.y+
						" L "+ pointB.x+","+pointB.y + " L " +(x)+","+(y+(h-hs));
				
			pathC = "M " + (x) + "," + (y+h) + " l "+w+",0 L "+ pointD.x+","+pointD.y+
						" L "+ pointC.x+","+pointC.y + " L "+ (x) + "," + (y+h);
		
			pathD = "M " + (x+w) + "," + (y+h) + " l 0,-"+h+" L "+ pointA.x+","+pointA.y+
						" L "+ pointD.x+","+pointD.y + " L "+ (x+w) + "," + (y+h);
		
			createDescription(id+"_a", "CROSS-RAIL... base LENGTH: " + getDim(Math.sqrt(Math.pow(w,2)+Math.pow((h-hs),2)))  + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA)+"," + Math.round(degB) + " degrees.");
			createDescription(id+"_b", "SIDE-RAIL... base LENGTH: " + getDim(hs) + "  THICKNESS: " + getDim(f) + "   MITRE: 45,"+Math.round(degB)+" degrees.");
			createDescription(id+"_c", "SILL... base LENGTH: " + getDim(w) + "  THICKNESS: " + getDim(f) + "   MITRE: 45,45 degrees.");
			createDescription(id+"_d", "SIDE-RAIL...base LENGTH: " + getDim(h) + "  THICKNESS: " + getDim(f) + "   MITRE: 45,"+ Math.round(degA)+" degrees.");
			
		}
		break;
		case "LB": // facing left, pointy end down
		{
			angleA = Math.atan2(w,(h-hs));
			
			degA = (angleA / Math.PI)*90;
			
			insetY = f/Math.tan(angleA/2);
			
			pointA = new Point(x+w-f,y+h+insetY);
			
			
			
			angleB = Math.PI - angleA;
			degB = (angleB / Math.PI)*90;
			insetY = f/Math.tan(angleB/2);
			
			pointB = new Point(x+f,y+hs-insetY);
			
			
			
			
			pointC = new Point(x+f,y+f);
			
			pointD = new Point(x+w-f,y+f);
			
			
			pathA = "M " + (x+w) + "," + (y+h) + " l -"+ w+",-"+ (h-hs) + " L "+ pointB.x+","+pointB.y+
						" L "+ pointA.x+","+pointA.y + " L " +(x+w)+","+(y+h);
			
			pathB = "M " + (x) + "," + (y+hs) + " l 0,-"+(hs)+" L "+pointC.x+","+pointC.y+
						" L "+ pointB.x+","+pointB.y + " L " +(x)+","+(y+hs);
				
			pathC = "M " + (x) + "," + (y) + " l "+w+",0 L "+ pointD.x+","+pointD.y+
						" L "+ pointC.x+","+pointC.y + " L "+ (x) + "," + (y);
		
			pathD = "M " + (x+w) + "," + (y) + " l 0,"+h+" L "+ pointA.x+","+pointA.y+
						" L "+ pointD.x+","+pointD.y + " L "+ (x+w) + "," + (y);
		
			createDescription(id+"_a", "CROSS-RAIL... base LENGTH: " + getDim(Math.sqrt(Math.pow(w,2)+Math.pow((h-hs),2)))  + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA)+"," + Math.round(degB) + " degrees.");
			createDescription(id+"_b", "SIDE-RAIL... base LENGTH: " + getDim(hs) + "  THICKNESS: " + getDim(f) + "   MITRE: "+Math.round(degB)+",45 degrees.");
			createDescription(id+"_c", "HEAD-RAIL... base LENGTH: " + getDim(w) + "  THICKNESS: " + getDim(f) + "   MITRE: 45,45 degrees.");
			createDescription(id+"_d", "SIDE-RAIL...base LENGTH: " + getDim(h) + "  THICKNESS: " + getDim(f) + "   MITRE: 45,"+ Math.round(degA)+" degrees.");
		
		}
			break;	

		case "IT": // isosoles trap, narrow end up
		{
			angleA = Math.atan2((w-hs)/2,h) + Math.PI/2;
			
			degA = degD = (angleA / Math.PI)*90;
			insetX = f/Math.tan(angleA/2);
			
			pointA = new Point(x+((w-hs)/2)+insetX,y+f);
			pointD = new Point(x+w-((w-hs)/2)-insetX,y+f);
	
			angleB = Math.atan2(h,(w-hs)/2);
			insetX = f/Math.tan(angleB/2);
			degB = degC  = (angleB / Math.PI)*90; 
			pointB = new Point(x+insetX,y+h-f);
			pointC = new Point(x+w-insetX,y+h-f);
			
			
			pathA = "M " + (x+((w-hs)/2)) + "," + (y) + " l -"+((w-hs)/2)+","+ (h) + " L "+ pointB.x+","+pointB.y+
						" L "+ pointA.x+","+pointA.y + " L " +(x+((w-hs)/2)) + "," + (y);
			
			pathB = "M " + (x) + "," + (y+h) + " l "+w+",0 L "+pointC.x+","+pointC.y+
						" L "+ pointB.x+","+pointB.y + " L " +(x) + "," + (y+h);
				
			pathC = "M " + (x+w) + "," + (y+h) + " l -"+h+",-"+((w-hs)/2)+" L "+ pointD.x+","+pointD.y+
						" L "+ pointC.x+","+pointC.y + " L "+ (x+w) + "," + (y+h);
		
			pathD = "M " + (x+w-(w-hs)/2) + "," + (y) + " l -"+hs+",0 L "+ pointA.x+","+pointA.y+
						" L "+ pointD.x+","+pointD.y + " L "+ (x+w-(w-hs)/2) + "," + (y);
		
			createDescription(id+"_a", "SIDE-RAIL... base LENGTH: " + getDim(Math.sqrt(Math.pow((w-hs)/2,2)+Math.pow((h),2)))  + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA)+"," + Math.round(degB) + " degrees.");
			createDescription(id+"_c", "SIDE-RAIL... base LENGTH: " + getDim(Math.sqrt(Math.pow((w-hs)/2,2)+Math.pow((h),2)))  + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA)+"," + Math.round(degB) + " degrees.");
			createDescription(id+"_d", "HEAD-RAIL... base LENGTH: " + getDim(hs) + "  THICKNESS: " + getDim(f) + "   MITRE: "+degD+","+degA+" degrees.");
			createDescription(id+"_b", "SILL... base LENGTH: " + getDim(h) + "  THICKNESS: " + getDim(f) + "   MITRE: "+degB+","+degC+" degrees.");
		
		}
		break;
		
		case "IB": // isosoles trap, narrow end down
		{
			angleA = Math.atan2((w-hs)/2,h) + Math.PI/2;
			
			degA = degD = (angleA / Math.PI)*90;
			insetX = f/Math.tan(angleA/2);
			
			pointD = new Point(x+((w-hs)/2)+insetX,y+h-f);
			pointA = new Point(x+w-((w-hs)/2)-insetX,y+h-f);
	
			angleB = Math.atan2(h,(w-hs)/2);
			insetX = f/Math.tan(angleB/2);
			degB = degC  = (angleB / Math.PI)*90; 
			pointC = new Point(x+insetX,y+f);
			pointB = new Point(x+w-insetX,y-f);
			
			pathA = "M " + (x+w-((w-hs)/2)) + "," + (y+h) + " l "+((w-hs)/2)+",-"+ (h) + " L "+ pointB.x+","+pointB.y+
						" L "+ pointA.x+","+pointA.y + " L " +(x+w-((w-hs)/2)) + "," + (y+h);
			
			pathB = "M " + (x+w) + "," + (y) + " l -"+w+",0 L "+pointC.x+","+pointC.y+
						" L "+ pointB.x+","+pointB.y + " L " +(x+w) + "," + (y);
				
			pathC = "M " + (x) + "," + (y) + " l "+((w-hs)/2)+","+h+" L "+ pointD.x+","+pointD.y+
						" L "+ pointC.x+","+pointC.y + " L "+ (x) + "," + (y);
		
			pathD = "M " + (x+(w-hs)/2) + "," + (y) + " l "+hs+",0 L "+ pointA.x+","+pointA.y+
						" L "+ pointD.x+","+pointD.y + " L "+ (x+(w-hs)/2) + "," + (y);
			createDescription(id+"_a", "SIDE-RAIL... base LENGTH: " + getDim(Math.sqrt(Math.pow((w-hs)/2,2)+Math.pow((h),2)))  + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA)+"," + Math.round(degB) + " degrees.");
			createDescription(id+"_c", "SIDE-RAIL... base LENGTH: " + getDim(Math.sqrt(Math.pow((w-hs)/2,2)+Math.pow((h),2)))  + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA)+"," + Math.round(degB) + " degrees.");
			createDescription(id+"_d", "SILL... base LENGTH: " + getDim(hs) + "  THICKNESS: " + getDim(f) + "   MITRE: "+degD+","+degA+" degrees.");
			createDescription(id+"_b", "HEAD-RAIL... base LENGTH: " + getDim(h) + "  THICKNESS: " + getDim(f) + "   MITRE: "+degB+","+degC+" degrees.");
		
		}
			break;		


		default:
			break;
	}
	
	sideA.setAttribute("d",pathA);
	sideB.setAttribute("d",pathB);
	sideC.setAttribute("d",pathC);
	sideD.setAttribute("d",pathD);
	
	sideA.getStyle().setProperty("fill",color,"");
	sideB.getStyle().setProperty("fill",color,"");
	sideC.getStyle().setProperty("fill",color,"");
	sideD.getStyle().setProperty("fill",color,"");
	
	
		

	

}	
catch(e)
{
	alertUser("Exception:  initMitredTrapezoidFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+hs+","+ f+",'"+ color+"','"+ type+"')");
	alertUser(e);
	trace(e);
}	
}

function initGlassClipTrap(id,sashId,x, y, w, ws, h, hs, f /*inset*/, v /*hidden glass inset*/, type)
{
try
{
trace("initGlassClipTrap('"+id+"','"+sashId+"',"+x+","+ y+","+ w+","+ws+","+ h+","+ hs+","+ f+","+ v+",'"+type+"')");
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
		gls.setAttribute("width",w);
		gls.setAttribute("height",h);
		
		grp.appendChild(gls);
	}
	
	var t,tText;
	if(g("f_glass") == "TEMPERED")
	{
	trace("creating T");
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
		switch(type)
		{
			case "RT":
			case "LT":
			case "LB":
				t.setAttribute("x",x+w-2);
				t.setAttribute("y",y+h-2);
				break;
				
			case "RB":
				t.setAttribute("x",x+2);
				t.setAttribute("y",y+2);
				break;
			default:
				t.setAttribute("x",x+2);
				t.setAttribute("y",y+2);
				break;
		}
	}
	
	
	var path,angleA,angleB,angleC,pointA, pointB, pointC, pointD, pointE, insetX, insetY,wV,hV, hsV,wNet,hNet, hsNet, lDiag;

	switch(type)
	{
		case "RT":  // facing right, narrow end up
		{
			angleA = Math.atan2((w-ws),(h-hs))+(Math.PI/2);
			insetX = f/Math.tan(angleA/2);
			pointA = new Point(x+ws-insetX,y+f);

			angleB = Math.atan2((h-hs),(w-ws))+(Math.PI/2);
			insetY = f/Math.tan((angleB/2));

			pointB = new Point(x+w-f,y+(h-hs)+insetY);
									
			pointC = new Point(x+w-f,y+h-f);
			pointD = new Point(x+f,y+h-f);
			pointE = new Point(x+f,y+f);
			
		
		}
		break;
		case "RB": // facing right, pointy end down
		{
			angleA = Math.atan2((w-ws),(h-hs))+(Math.PI/2);
			insetX = f/Math.tan(angleA/2);
			pointA = new Point(x+ws-insetX,y+h-f);

			angleB = Math.atan2((h-hs),(w-ws))+(Math.PI/2);
			insetY = f/Math.tan((angleB/2));
			pointB = new Point(x+w,y+hs-insetY);
									
			pointC = new Point(x+w-f,y+f);
			pointD = new Point(x+f,y+f);
			pointE = new Point(x+f,y+h-f);

			
		}
			break;
		case "LT":  // facing left, pointy end up
		{
			angleA = Math.atan2((w-ws),(h-hs))+(Math.PI/2);
			insetX = f/Math.tan(angleA/2);
			pointA = new Point(x+(w-ws)+insetX,y+f);

			angleB = Math.atan2((h-hs),(w-ws))+(Math.PI/2);
			insetY = f/Math.tan((angleB/2));
			pointB = new Point(x+f,y+(h-hs)+insetY);
									
			pointC = new Point(x+f,y+h-f);
			pointD = new Point(x+w-f,y+h-f);
			pointE = new Point(x+w-f,y+f);

		}
		break;
		case "LB": // facing left, pointy end down
		{
			angleA = Math.atan2((w-ws),(h-hs))+(Math.PI/2);
			insetX = f/Math.tan(angleA/2);
			pointA = new Point(x+(w-ws)+insetX,y+h-f);

			angleB = Math.atan2((h-hs),(w-ws))+(Math.PI/2);
			insetY = f/Math.tan((angleB/2));
			pointB = new Point(x+f,y+hs-insetY);
									
			pointC = new Point(x+f,y+f);
			pointD = new Point(x+w+f,y+f);
			pointE = new Point(x+w+f,y+h-f);

		}
			break;	

		default:
			break;
	}
	




	path = "M " + pointA.x + "," + pointA.y + 
					" L " + pointB.x + "," + pointB.y + 
					" L " + pointC.x + "," + pointC.y + 
					" L " + pointD.x + "," + pointD.y + 
					" L " + pointE.x + "," + pointE.y + 
					" L " + pointA.x + "," + pointA.y;
	gls.setAttribute("d",path);


	if(g("f_tn")!="true")
	{
		var desc = "WIDTH: %W%  HEIGHT: %H%  VISIBLE: %WV%X%HV%.";
		desc = desc.replace(/%W%/g,getDim(wNet));
		desc = desc.replace(/%H%/g,getDim(hNet));
		desc = desc.replace(/%WV%/g,getDim(wV));
		desc = desc.replace(/%HV%/g,getDim(hV));
		createDescription(id+"_pane",desc);
	}
}	
catch(e)
{
	alertUser("Exception: initGlassClipTrap('"+id+"','"+sashId+"',"+x+","+ y+","+ w+","+ h+","+ hs+","+ f+","+ v+",'"+type+"')");

	alertUser(e);
	trace(e);
}	
}

function initClipTrapFrame(id, x, y, w, ws, h, hs, f,sillThk, color, type)
{
try
{
trace("initClipTrapFrame('"+id+"',"+x+","+ y+","+ w+","+ws+",",h+","+hs+","+ f+","+sillThk+",'"+ color+"','"+ type+"')");

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

	var sideA = drawing.getElementById(id+"_a");
	if(sideA === null)
	{
		sideA = drawing.createElementNS(svgNS,"path");
		sideA.setAttribute("id",id+"_a");
		sideA.setAttribute("class","frame");
		sideA.setAttribute("d","M 0,0");
		
		grp.appendChild(sideA);
	}
	
	var sideB = drawing.getElementById(id+"_b");
	if(sideB === null)
	{
		sideB = drawing.createElementNS(svgNS,"path");
		sideB.setAttribute("id",id+"_b");
		sideB.setAttribute("class","frame");
		sideB.setAttribute("d","M 0,0");
		
		grp.appendChild(sideB);
	}
	
	var sideC = drawing.getElementById(id+"_c");
	if(sideC === null)
	{
		sideC = drawing.createElementNS(svgNS,"path");
		sideC.setAttribute("id",id+"_c");
		sideC.setAttribute("class","frame");
		sideC.setAttribute("d","M 0,0");
		
		grp.appendChild(sideC);
	}

	var sideD = drawing.getElementById(id+"_d");
	if(sideD === null)
	{
		sideD = drawing.createElementNS(svgNS,"path");
		sideD.setAttribute("id",id+"_d");
		sideD.setAttribute("class","frame");
		sideD.setAttribute("d","M 0,0");
		
		grp.appendChild(sideD);
	}
	
	var sideE = drawing.getElementById(id+"_e");
	if(sideE === null)
	{
		sideE = drawing.createElementNS(svgNS,"path");
		sideE.setAttribute("id",id+"_e");
		sideE.setAttribute("class","frame");
		sideE.setAttribute("d","M 0,0");
		
		grp.appendChild(sideE);
	}		
	var angleA,angleB,angleC,degA,degB,degC,pointA, pointB, pointC, pointD, pointE, pathA, pathB, pathC, pathD, pathE, insetX, insetY;
	

	switch(type)
	{
		case "RT":  // facing right, narrow end up
		{
		
			angleA = Math.atan2((w-ws),(h-hs))+(Math.PI/2);
			insetX = f/Math.tan(angleA/2);
			pointA = new Point(x+ws-insetX,y+f);
			degA = (angleA / Math.PI)*90;

			angleB = Math.atan2((h-hs),(w-ws))+(Math.PI/2);
			insetY = f/Math.tan((angleB/2));
			pointB = new Point(x+w-f,y+(h-hs)+insetY);
			degB = (angleB / Math.PI)*90;
			
			pointC = new Point(x+w-f,y+h-sillThk);
			
			pointD = new Point(x+f,y+h-sillThk);

			pointE = new Point(x+f,y+f);
			
			pathA = "M " + (x+ws) + "," + y + " L "+ (x+w)+","+ (y+(h-hs)) + 
						" L "+ pointB.x+","+pointB.y+
						" L "+ pointA.x+","+pointA.y + " L " +(x+ws)+","+y;
			
			pathB = "M " + (x+w) + "," + (y+h-hs) + " l 0,"+(hs-sillThk)+
						" L "+pointC.x+","+pointC.y+
						" L "+ pointB.x+","+pointB.y + 
						" L " +(x+w)+","+(y+h-hs);
				
			pathC = "M " + (x+w) + "," + (y+h) + " l -"+w+",0 l 0,-"+ sillThk+
						" l "+ w+",0 l 0,"+sillThk;
		
			pathD = "M " + (x) + "," + (y+h-sillThk) + " l 0,-"+(h-sillThk)+" L "+ pointE.x+","+pointE.y+
						" L "+ pointD.x+","+pointD.y + " L "+ (x) + "," + (y+h-sillThk);

			pathE = "M " + (x) + "," + (y) + " l "+(ws)+",0 L "+ pointA.x+","+pointA.y+
						" L "+ pointE.x+","+pointE.y + " L "+ (x) + "," + (y);
		
			createDescription(id+"_a", "CROSS-RAIL... base LENGTH: " + getDim(Math.sqrt(Math.pow((w-ws),2)+Math.pow((h-hs),2)))  + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA)+"," + Math.round(degB) + " degrees.");
			createDescription(id+"_e", "HEAD-RAIL... base LENGTH: " + getDim(ws) + "  THICKNESS: " + getDim(f) + "   MITRE: 45," + Math.round(degA) + " degrees.");
			createDescription(id+"_b", "SIDE-RAIL... base LENGTH: " + getDim(hs-sillThk) + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degB) + " degrees.");
			createDescription(id+"_c", "SILL... base LENGTH: " + getDim(w) + "  THICKNESS: " + getDim(sillThk) + ".");
			createDescription(id+"_d", "SIDE-RAIL...base LENGTH: " + getDim(h-sillThk) + "  THICKNESS: " + getDim(f) + "   MITRE: 45 degrees.");
		
		}
		break;

		case "LT":  // facing left, pointy end up
		{
			angleA = Math.atan2((w-ws),(h-hs))+(Math.PI/2);
			insetX = f/Math.tan(angleA/2);
			pointA = new Point(x+(w-ws)+insetX,y+f);
			degA = (angleA / Math.PI)*90;

			angleB = Math.atan2((h-hs),(w-ws))+(Math.PI/2);
			insetY = f/Math.tan((angleB/2));
			pointB = new Point(x+f,y+(h-hs)+insetY);
			degB = (angleB / Math.PI)*90;
			
			pointC = new Point(x+f,y+h-sillThk);
			
			pointD = new Point(x+w-f,y+h-sillThk);

			pointE = new Point(x+w-f,y+f);
			
			pathA = "M " + (x+(w-ws)) + "," + y + " L "+ (x)+","+ (y+(h-hs)) + 
						" L "+ pointB.x+","+pointB.y+
						" L "+ pointA.x+","+pointA.y + " L " +(x+(w-ws))+","+y;
			
			pathB = "M " + (x) + "," + (y+(h-hs)) + " l 0,"+(hs-sillThk)+
						" L "+pointC.x+","+pointC.y+
						" L "+ pointB.x+","+pointB.y + 
						" L " +(x)+","+(y+h-hs);
				
			pathC = "M " + (x+w) + "," + (y+h) + " l -"+w+",0 l 0,-"+ sillThk+
						" l "+ w+",0 l 0,"+sillThk;
		
			pathD = "M " + (x+w) + "," + (y+h-sillThk) + " l 0,-"+(h-sillThk)+" L "+ pointE.x+","+pointE.y+
						" L "+ pointD.x+","+pointD.y + " L "+ (x+w) + "," + (y+h-sillThk);

			pathE = "M " + (x+w) + "," + (y) + " l -"+ws+",0  L "+ pointA.x+","+pointA.y+
						" L "+ pointE.x+","+pointE.y + " L "+ (x+w) + "," + (y);
		
			createDescription(id+"_a", "CROSS-RAIL... base LENGTH: " + getDim(Math.sqrt(Math.pow((w-ws),2)+Math.pow((h-hs),2)))  + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA)+"," + Math.round(degB) + " degrees.");
			createDescription(id+"_e", "HEAD-RAIL... base LENGTH: " + getDim(ws) + "  THICKNESS: " + getDim(f) + "   MITRE: 45," + Math.round(degA) + " degrees.");
			createDescription(id+"_b", "SIDE-RAIL... base LENGTH: " + getDim(hs) + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degB) + " degrees.");
			createDescription(id+"_c", "SILL... base LENGTH: " + getDim(w) + "  THICKNESS: " + getDim(f) + ".");
			createDescription(id+"_d", "SIDE-RAIL...base LENGTH: " + getDim(h) + "  THICKNESS: " + getDim(f) + "   MITRE: 45 degrees.");
		}
		break;


		default:
			break;
	}
	
	sideA.setAttribute("d",pathA);
	sideB.setAttribute("d",pathB);
	sideC.setAttribute("d",pathC);
	sideD.setAttribute("d",pathD);
	sideE.setAttribute("d",pathE);
	
	sideA.getStyle().setProperty("fill",color,"");
	sideB.getStyle().setProperty("fill",color,"");
	sideC.getStyle().setProperty("fill",color,"");
	sideD.getStyle().setProperty("fill",color,"");
	sideE.getStyle().setProperty("fill",color,"");

}	
catch(e)
{
	alertUser("Exception:  initClipTrapFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+hs+","+ f+","+sillThk+",'"+ color+"','"+ type+"')");
	alertUser(e);
	trace(e);
}	
}

function initMitredClipTrapFrame(id, x, y, w, ws, h, hs, f, color, type)
{
try
{
trace("initMitredClipTrapFrame('"+id+"',"+x+","+ y+","+ w+","+ws+",",h+","+hs+","+ f+",'"+ color+"','"+ type+"')");

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

	var sideA = drawing.getElementById(id+"_a");
	if(sideA === null)
	{
		sideA = drawing.createElementNS(svgNS,"path");
		sideA.setAttribute("id",id+"_a");
		sideA.setAttribute("class","frame");
		sideA.setAttribute("d","M 0,0");
		
		grp.appendChild(sideA);
	}
	
	var sideB = drawing.getElementById(id+"_b");
	if(sideB === null)
	{
		sideB = drawing.createElementNS(svgNS,"path");
		sideB.setAttribute("id",id+"_b");
		sideB.setAttribute("class","frame");
		sideB.setAttribute("d","M 0,0");
		
		grp.appendChild(sideB);
	}
	
	var sideC = drawing.getElementById(id+"_c");
	if(sideC === null)
	{
		sideC = drawing.createElementNS(svgNS,"path");
		sideC.setAttribute("id",id+"_c");
		sideC.setAttribute("class","frame");
		sideC.setAttribute("d","M 0,0");
		
		grp.appendChild(sideC);
	}

	var sideD = drawing.getElementById(id+"_d");
	if(sideD === null)
	{
		sideD = drawing.createElementNS(svgNS,"path");
		sideD.setAttribute("id",id+"_d");
		sideD.setAttribute("class","frame");
		sideD.setAttribute("d","M 0,0");
		
		grp.appendChild(sideD);
	}
	
	var sideE = drawing.getElementById(id+"_e");
	if(sideE === null)
	{
		sideE = drawing.createElementNS(svgNS,"path");
		sideE.setAttribute("id",id+"_e");
		sideE.setAttribute("class","frame");
		sideE.setAttribute("d","M 0,0");
		
		grp.appendChild(sideE);
	}		
	var angleA,angleB,angleC,degA,degB,degC,pointA, pointB, pointC, pointD, pointE, pathA, pathB, pathC, pathD, pathE, insetX, insetY;
	

	switch(type)
	{
		case "RT":  // facing right, narrow end up
		{
		
			angleA = Math.atan2((w-ws),(h-hs))+(Math.PI/2);
			insetX = f/Math.tan(angleA/2);
			pointA = new Point(x+ws-insetX,y+f);
			degA = (angleA / Math.PI)*90;

			angleB = Math.atan2((h-hs),(w-ws))+(Math.PI/2);
			insetY = f/Math.tan((angleB/2));
			pointB = new Point(x+w-f,y+(h-hs)+insetY);
			degB = (angleB / Math.PI)*90;
			
			pointC = new Point(x+w-f,y+h-f);
			
			pointD = new Point(x+f,y+h-f);

			pointE = new Point(x+f,y+f);
			
			pathA = "M " + (x+ws) + "," + y + " L "+ (x+w)+","+ (y+(h-hs)) + 
						" L "+ pointB.x+","+pointB.y+
						" L "+ pointA.x+","+pointA.y + " L " +(x+ws)+","+y;
			
			pathB = "M " + (x+w) + "," + (y+h-hs) + " l 0,"+hs+
						" L "+pointC.x+","+pointC.y+
						" L "+ pointB.x+","+pointB.y + 
						" L " +(x+w)+","+(y+h-hs);
				
			pathC = "M " + (x+w) + "," + (y+h) + " l -"+w+",0 L "+ pointD.x+","+pointD.y+
						" L "+ pointC.x+","+pointC.y + " L "+ (x+w) + "," + (y+h);
		
			pathD = "M " + (x) + "," + (y+h) + " l 0,-"+h+" L "+ pointE.x+","+pointE.y+
						" L "+ pointD.x+","+pointD.y + " L "+ (x) + "," + (y+h);

			pathE = "M " + (x) + "," + (y) + " l "+(ws)+",0 L "+ pointA.x+","+pointA.y+
						" L "+ pointE.x+","+pointE.y + " L "+ (x) + "," + (y);
		
			createDescription(id+"_a", "CROSS-RAIL... base LENGTH: " + getDim(Math.sqrt(Math.pow((w-ws),2)+Math.pow((h-hs),2)))  + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA)+"," + Math.round(degB) + " degrees.");
			createDescription(id+"_e", "HEAD-RAIL... base LENGTH: " + getDim(ws) + "  THICKNESS: " + getDim(f) + "   MITRE: 45," + Math.round(degA) + " degrees.");
			createDescription(id+"_b", "SIDE-RAIL... base LENGTH: " + getDim(hs) + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degB) + ",45 degrees.");
			createDescription(id+"_c", "SILL... base LENGTH: " + getDim(w) + "  THICKNESS: " + getDim(f) + "   MITRE: 45,45 degrees.");
			createDescription(id+"_d", "SIDE-RAIL...base LENGTH: " + getDim(h) + "  THICKNESS: " + getDim(f) + "   MITRE: 45,45 degrees.");
		
		}
		break;
		case "RB": // facing right, narrow end down
		{
			angleA = Math.atan2((w-ws),(h-hs))+(Math.PI/2);
			insetX = f/Math.tan(angleA/2);
			pointA = new Point(x+ws-insetX,y+h-f);
			degA = (angleA / Math.PI)*90;

			angleB = Math.atan2((h-hs),(w-ws))+(Math.PI/2);
			insetY = f/Math.tan((angleB/2));
			pointB = new Point(x+w-f,y+hs-insetY);
			degB = (angleB / Math.PI)*90;
			
			pointC = new Point(x+w-f,y+f);
			
			pointD = new Point(x+f,y+f);

			pointE = new Point(x+f,y+h-f);
			
			pathA = "M " + (x+ws) + "," + (y+h) + " L "+ (x+w)+","+ (y+hs) + 
						" L "+ pointB.x+","+pointB.y+
						" L "+ pointA.x+","+pointA.y + " L " +(x+ws)+","+(y+h);
			
			pathB = "M " + (x+w) + "," + (y+hs) + " l 0,-"+hs+
						" L "+pointC.x+","+pointC.y+
						" L "+ pointB.x+","+pointB.y + 
						" L " +(x+w)+","+(y+hs);
				
			pathC = "M " + (x+w) + "," + (y) + " l -"+w+",0 L "+ pointD.x+","+pointD.y+
						" L "+ pointC.x+","+pointC.y + " L "+ (x+w) + "," + (y);
		
			pathD = "M " + (x) + "," + (y) + " l 0,"+h+" L "+ pointE.x+","+pointE.y+
						" L "+ pointD.x+","+pointD.y + " L "+ (x) + "," + (y);

			pathE = "M " + (x) + "," + (y+h) + " l "+ws+",0 L "+ pointA.x+","+pointA.y+
						" L "+ pointE.x+","+pointE.y + " L "+ (x) + "," + (y+h);
		
			createDescription(id+"_a", "CROSS-RAIL... base LENGTH: " + getDim(Math.sqrt(Math.pow((w-ws),2)+Math.pow((h-hs),2)))  + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA)+"," + Math.round(degB) + " degrees.");
			createDescription(id+"_e", "SILL... base LENGTH: " + getDim(ws) + "  THICKNESS: " + getDim(f) + "   MITRE: 45," + Math.round(degA) + " degrees.");
			createDescription(id+"_b", "SIDE-RAIL... base LENGTH: " + getDim(hs) + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degB) + ",45 degrees.");
			createDescription(id+"_c", "HEAD-RAIL... base LENGTH: " + getDim(w) + "  THICKNESS: " + getDim(f) + "   MITRE: 45,45 degrees.");
			createDescription(id+"_d", "SIDE-RAIL...base LENGTH: " + getDim(h) + "  THICKNESS: " + getDim(f) + "   MITRE: 45,45 degrees.");
			
		}
			break;
		case "LT":  // facing left, pointy end up
		{
			angleA = Math.atan2((w-ws),(h-hs))+(Math.PI/2);
			insetX = f/Math.tan(angleA/2);
			pointA = new Point(x+(w-ws)+insetX,y+f);
			degA = (angleA / Math.PI)*90;

			angleB = Math.atan2((h-hs),(w-ws))+(Math.PI/2);
			insetY = f/Math.tan((angleB/2));
			pointB = new Point(x+f,y+(h-hs)+insetY);
			degB = (angleB / Math.PI)*90;
			
			pointC = new Point(x+f,y+h-f);
			
			pointD = new Point(x+w-f,y+h-f);

			pointE = new Point(x+w-f,y+f);
			
			pathA = "M " + (x+(w-ws)) + "," + y + " L "+ (x)+","+ (y+(h-hs)) + 
						" L "+ pointB.x+","+pointB.y+
						" L "+ pointA.x+","+pointA.y + " L " +(x+(w-ws))+","+y;
			
			pathB = "M " + (x) + "," + (y+(h-hs)) + " l 0,"+hs+
						" L "+pointC.x+","+pointC.y+
						" L "+ pointB.x+","+pointB.y + 
						" L " +(x)+","+(y+h-hs);
				
			pathC = "M " + (x) + "," + (y+h) + " l "+w+",0 L "+ pointD.x+","+pointD.y+
						" L "+ pointC.x+","+pointC.y + " L "+ (x) + "," + (y+h);
		
			pathD = "M " + (x+w) + "," + (y+h) + " l 0,-"+h+" L "+ pointE.x+","+pointE.y+
						" L "+ pointD.x+","+pointD.y + " L "+ (x+w) + "," + (y+h);

			pathE = "M " + (x+w) + "," + (y) + " l -"+ws+",0  L "+ pointA.x+","+pointA.y+
						" L "+ pointE.x+","+pointE.y + " L "+ (x+w) + "," + (y);
		
			createDescription(id+"_a", "CROSS-RAIL... base LENGTH: " + getDim(Math.sqrt(Math.pow((w-ws),2)+Math.pow((h-hs),2)))  + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA)+"," + Math.round(degB) + " degrees.");
			createDescription(id+"_e", "HEAD-RAIL... base LENGTH: " + getDim(ws) + "  THICKNESS: " + getDim(f) + "   MITRE: 45," + Math.round(degA) + " degrees.");
			createDescription(id+"_b", "SIDE-RAIL... base LENGTH: " + getDim(hs) + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degB) + ",45 degrees.");
			createDescription(id+"_c", "SILL... base LENGTH: " + getDim(w) + "  THICKNESS: " + getDim(f) + "   MITRE: 45,45 degrees.");
			createDescription(id+"_d", "SIDE-RAIL...base LENGTH: " + getDim(h) + "  THICKNESS: " + getDim(f) + "   MITRE: 45,45 degrees.");
		}
		break;
		case "LB": // facing left, pointy end down
		{
			angleA = Math.atan2((h-hs),(w-ws));
			insetX = f/Math.tan(angleA);
			pointA = new Point(x+(w-ws)+insetX,y-f);
			degA = (angleA / Math.PI)*90;

			angleB = Math.atan2((h-hs),(w-ws))+(Math.PI/2);
			insetY = f/Math.tan((angleB/2));
			pointB = new Point(x+f,y+(hs)-insetY);
			degB = (angleB / Math.PI)*90;
			
			pointC = new Point(x+f,y+f);
			
			pointD = new Point(x+w-f,y+f);

			pointE = new Point(x+w-f,y+h-f);
			
			pathA = "M " + (x+(w-ws)) + "," + (y+h) + " L "+ (x)+","+ (y+hs) + 
						" L "+ pointB.x+","+pointB.y+
						" L "+ pointA.x+","+pointA.y + " L " +(x+(w-ws))+","+(y+h);
			
			pathB = "M " + (x) + "," + (y+hs) + " l 0,-"+hs+
						" L "+pointC.x+","+pointC.y+
						" L "+ pointB.x+","+pointB.y + 
						" L " +(x)+","+(y+hs);
				
			pathC = "M " + (x) + "," + (y) + " l "+w+",0 L "+ pointD.x+","+pointD.y+
						" L "+ pointC.x+","+pointC.y + " L "+ (x) + "," + (y);
		
			pathD = "M " + (x+w) + "," + (y) + " l 0,"+h+" L "+ pointE.x+","+pointE.y+
						" L "+ pointD.x+","+pointD.y + " L "+ (x+w) + "," + (y);

			pathE = "M " + (x+w) + "," + (y+h) + " l -"+ws+",0 L "+ pointA.x+","+pointA.y+
						" L "+ pointE.x+","+pointE.y + " L "+ (x+w) + "," + (y+h);
		
			createDescription(id+"_a", "CROSS-RAIL... base LENGTH: " + getDim(Math.sqrt(Math.pow((w-ws),2)+Math.pow((h-hs),2)))  + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA)+"," + Math.round(degB) + " degrees.");
			createDescription(id+"_e", "SILL... base LENGTH: " + getDim(ws) + "  THICKNESS: " + getDim(f) + "   MITRE: 45," + Math.round(degA) + " degrees.");
			createDescription(id+"_b", "SIDE-RAIL... base LENGTH: " + getDim(hs) + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degB) + ",45 degrees.");
			createDescription(id+"_c", "HEAD-RAIL... base LENGTH: " + getDim(w) + "  THICKNESS: " + getDim(f) + "   MITRE: 45,45 degrees.");
			createDescription(id+"_d", "SIDE-RAIL...base LENGTH: " + getDim(h) + "  THICKNESS: " + getDim(f) + "   MITRE: 45,45 degrees.");
			
		}
			break;	

		default:
			break;
	}
	
	sideA.setAttribute("d",pathA);
	sideB.setAttribute("d",pathB);
	sideC.setAttribute("d",pathC);
	sideD.setAttribute("d",pathD);
	sideE.setAttribute("d",pathE);
	
	sideA.getStyle().setProperty("fill",color,"");
	sideB.getStyle().setProperty("fill",color,"");
	sideC.getStyle().setProperty("fill",color,"");
	sideD.getStyle().setProperty("fill",color,"");
	sideE.getStyle().setProperty("fill",color,"");

}	
catch(e)
{
	alertUser("Exception:  initMitredClipTrapFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+hs+","+ f+",'"+ color+"','"+ type+"')");
	alertUser(e);
	trace(e);
}	
}