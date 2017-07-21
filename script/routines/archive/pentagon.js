function initGlassHomePlate(id,sashId,x, y, w, h, hs, f /*inset*/, v /*hidden glass inset*/, type)
{
try
{
trace("initGlassHomePlate('"+id+"','"+sashId+"',"+x+","+ y+","+ w+","+ h+","+ hs+","+ f+","+ v+",'"+type+"')");
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
			case "T":
				t.setAttribute("x",x+w-2);
				t.setAttribute("y",y+h-2);
				break;
				
			case "B":
				t.setAttribute("x",x+2);
				t.setAttribute("y",y+2);
				break;
			default:
				t.setAttribute("x",x+2);
				t.setAttribute("y",y+2);
				break;
		}
	}
	
	
	
	var path,angleA,angleB,angleC,angleD,angleE,pointA, pointB, pointC, pointD, pointE, insetX, insetY,wV,hV, hsV,wNet,hNet, hsNet;

	switch(type)
	{
		case "T":  // pointy end up
		{
			angleA = Math.atan2(w/2,h-hs);
			insetY = Math.sqrt(Math.pow(f/Math.tan(angleA),2)+Math.pow(f,2));
			pointA = new Point(x+(w/2),y+insetY);
									
			angleE = angleB = Math.PI - angleA;
			insetY = f/Math.tan(angleB/2);
			
			pointB = new Point(x+w-f,y+(h-hs)+insetY);
			pointE = new Point(x+f,y+(h-hs)+insetY);
			
			pointC = new Point(x+w-f,y+h-f);
			
			pointD = new Point(x+f,y+h-f);
			
		
		}
		break;
		case "B": // pointy end down
		{
			angleA = Math.atan2(w/2,h-hs);
			insetY = Math.sqrt(Math.pow(f/Math.tan(angleA),2)+Math.pow(f,2));
			pointA = new Point(x+(w/2),y+h-insetY);
			
			angleE = angleB = Math.PI - angleA;
			insetY = f/Math.tan(angleB/2);
			
			pointB = new Point(x+f,y+(hs)-insetY);
			pointE = new Point(x+w-f,y+(hs)-insetY);
			
			pointC = new Point(x+f,y+f);
			
			pointD = new Point(x+w-f,y+f);
			
		}
			break;

		default:
			break;
	}
	




	path = "M " + pointA.x + "," + pointA.y + " L "+ pointB.x + "," + pointB.y + " L " + 
				pointC.x + "," + pointC.y + " L " + pointD.x + "," + pointD.y + " L " + pointE.x + "," + pointE.y +
				 " L " + pointA.x + "," + pointA.y;
	trace("glass path="+path);
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
	alertUser("Exception: initGlassHomePlate('"+id+"','"+sashId+"',"+x+","+ y+","+ w+","+ h+","+ hs+","+ f+","+ v+",'"+type+"')");

	alertUser(e);
	trace(e);
}	
}

function initHomePlateFrame(id, x, y, w, h, hs, f,sillThk, color, type)
{
try
{
trace("initHomePlateFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+hs+","+ f+","+sillThk+",'"+ color+"','"+ type+"')");

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
		
	var angleA,angleB,angleC,angleEdegA,degB,degC,degE, pointA, pointB, pointC, pointD, pointE, pathA, pathB, pathC, pathD, pathE, insetX, insetY;
	

	switch(type)
	{
		case "T":  // pointy end up
		{
		
			angleA = Math.atan2(w/2,(h-hs));
						
			insetY = Math.sqrt(Math.pow(f/Math.tan(angleA),2)+Math.pow(f,2));
			pointA = new Point(x+(w/2),y+insetY);
				
			degA = (angleA / Math.PI)*90;
			
										
			angleB = angleE = Math.PI - angleA;
			degB = degE = (angleB / Math.PI)*90;
			insetY = f/Math.tan(angleB/2);
			
			pointB = new Point(x+w-f,y+(h-hs)+insetY);
			pointE = new Point(x+f,y+(h-hs)+insetY);
				
			
			pointC = new Point(x+w-f,y+h-sillThk);
			
			pointD = new Point(x+f,y+h-sillThk);
			
			
			pathA = "M " + (x+(w/2)) + "," + y + " l "+ (w/2)+","+ (h-hs) + " L "+ pointB.x+","+pointB.y+
						" L "+ pointA.x+","+pointA.y + " L " +(x+(w/2))+","+y;
			trace("pathA="+pathA);	
			
			pathB = "M " + (x+w) + "," + (y+h-hs) + " l 0,"+(hs-sillThk)+" L "+pointC.x+","+pointC.y+
						" L "+ pointB.x+","+pointB.y + " L " +(x+w)+","+(y+h-hs);
			trace("pathB="+pathB);	
			
			pathC = "M " + (x+w) + "," + (y+h) + " l -"+w+",0 l 0,-"+ sillThk+
						" l "+ w+",0 l 0,"+sillThk;
			trace("pathC="+pathC);	
		
			pathD = "M " + (x) + "," + (y+h-hs) + " l 0,"+(hs-sillThk)+" L "+ pointD.x+","+pointD.y+
						" L "+ pointE.x+","+pointE.y + " L "+ (x) + "," + (y+h-hs);
			trace("pathD="+pathD);	

			pathE = "M " + (x) + "," + (y+h-hs) + " l "+(w/2)+",-"+(h-hs)+" L "+ pointA.x+","+pointA.y+
						" L "+ pointE.x+","+pointE.y + " L "+ (x) + "," + (y+h-hs);
			trace("pathE="+pathE);	
		
			createDescription(id+"_a", "HEAD-RAIL... base LENGTH: " + getDim(Math.sqrt(Math.pow(w,2)+Math.pow((h-hs),2)))  + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA)+"," + Math.round(degB) + " degrees.");
			createDescription(id+"_e", "HEAD-RAIL... base LENGTH: " + getDim(Math.sqrt(Math.pow(w,2)+Math.pow((h-hs),2)))  + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA)+"," + Math.round(degB) + " degrees.");
			createDescription(id+"_b", "SIDE-RAIL... base LENGTH: " + getDim(hs-sillThk) + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degB) + " degrees.");
			createDescription(id+"_d", "SIDE-RAIL... base LENGTH: " + getDim(hs-sillThk) + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degB) + " degrees.");
			createDescription(id+"_c", "SILL... base LENGTH: " + getDim(w) + "  THICKNESS: " + getDim(sillThk) + ".");
		
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
	alertUser("Exception:  initHomePlateFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+hs+","+ f+","+sillThk+",'"+ color+"','"+ type+"')");
	alertUser(e);
	trace(e);
}	
}

function initMitredHomePlateFrame(id, x, y, w, h, hs, f, color, type)
{
try
{
trace("initMitredHomePlateFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+hs+","+ f+",'"+ color+"','"+ type+"')");

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
		
	var angleA,angleB,angleC,angleEdegA,degB,degC,degE, pointA, pointB, pointC, pointD, pointE, pathA, pathB, pathC, pathD, pathE, insetX, insetY;
	

	switch(type)
	{
		case "T":  // pointy end up
		{
		
			angleA = Math.atan2(w/2,(h-hs));
						
			insetY = Math.sqrt(Math.pow(f/Math.tan(angleA),2)+Math.pow(f,2));
			pointA = new Point(x+(w/2),y+insetY);
				
			degA = (angleA / Math.PI)*90;
			
										
			angleB = angleE = Math.PI - angleA;
			degB = degE = (angleB / Math.PI)*90;
			insetY = f/Math.tan(angleB/2);
			
			pointB = new Point(x+w-f,y+(h-hs)+insetY);
			pointE = new Point(x+f,y+(h-hs)+insetY);
				
			
			pointC = new Point(x+w-f,y+h-f);
			
			pointD = new Point(x+f,y+h-f);
			
			
			pathA = "M " + (x+(w/2)) + "," + y + " l "+ (w/2)+","+ (h-hs) + " L "+ pointB.x+","+pointB.y+
						" L "+ pointA.x+","+pointA.y + " L " +(x+(w/2))+","+y;
			trace("pathA="+pathA);	
			
			pathB = "M " + (x+w) + "," + (y+h-hs) + " l 0,"+(hs)+" L "+pointC.x+","+pointC.y+
						" L "+ pointB.x+","+pointB.y + " L " +(x+w)+","+(y+h-hs);
			trace("pathB="+pathB);	
			pathC = "M " + (x+w) + "," + (y+h) + " l -"+w+",0 L "+ pointD.x+","+pointD.y+
						" L "+ pointC.x+","+pointC.y + " L "+ (x+w) + "," + (y+h);
			trace("pathC="+pathC);	
		
			pathD = "M " + (x) + "," + (y+h-hs) + " l 0,"+hs+" L "+ pointD.x+","+pointD.y+
						" L "+ pointE.x+","+pointE.y + " L "+ (x) + "," + (y+h-hs);
			trace("pathD="+pathD);	

			pathE = "M " + (x) + "," + (y+h-hs) + " l "+(w/2)+",-"+(h-hs)+" L "+ pointA.x+","+pointA.y+
						" L "+ pointE.x+","+pointE.y + " L "+ (x) + "," + (y+h-hs);
			trace("pathE="+pathE);	
		
			createDescription(id+"_a", "HEAD-RAIL... base LENGTH: " + getDim(Math.sqrt(Math.pow(w,2)+Math.pow((h-hs),2)))  + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA)+"," + Math.round(degB) + " degrees.");
			createDescription(id+"_e", "HEAD-RAIL... base LENGTH: " + getDim(Math.sqrt(Math.pow(w,2)+Math.pow((h-hs),2)))  + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA)+"," + Math.round(degB) + " degrees.");
			createDescription(id+"_b", "SIDE-RAIL... base LENGTH: " + getDim(hs) + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degB) + ",45 degrees.");
			createDescription(id+"_d", "SIDE-RAIL... base LENGTH: " + getDim(hs) + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degB) + ",45 degrees.");
			createDescription(id+"_c", "SILL... base LENGTH: " + getDim(w) + "  THICKNESS: " + getDim(f) + "   MITRE: 45,45 degrees.");
		
		}
		break;
		case "B": // pointy end down
		{
			angleA = Math.atan2(w/2,(h-hs));
			degA = (angleA / Math.PI)*90;
			
			insetY = f/Math.tan(angleA);
			pointA = new Point(x+(w/2),y+h-insetY);
										
			angleB = angleE = Math.PI - angleA;
			degB = degE = (angleB / Math.PI)*90;
			insetY = f/Math.tan(angleB/2);
			
			pointB = new Point(x+f,y-hs+insetY);
			pointE = new Point(x+f,y-hs+insetY);
				
			
			pointC = new Point(x+f,y+f);
			
			pointD = new Point(x+w-f,y+f);
			
			
			pathA = "M " + (x+(w/2)) + "," + (y+h) + " l -"+ (w/2)+",-"+ (h-hs) + " L "+ pointB.x+","+pointB.y+
						" L "+ pointA.x+","+pointA.y + " L " +(x+(w/2))+","+(y+h);
			
			pathB = "M " + (x) + "," + (y+hs) + " l 0,-"+(hs)+" L "+pointC.x+","+pointC.y+
						" L "+ pointB.x+","+pointB.y + " L " +(x)+","+(y+hs);
				
			pathC = "M " + (x) + "," + (y) + " l "+w+",0 L "+ pointD.x+","+pointD.y+
						" L "+ pointC.x+","+pointC.y + " L "+ (x) + "," + (y);
		
			pathD = "M " + (x+w) + "," + (y) + " l 0,"+hs+" L "+ pointE.x+","+pointE.y+
						" L "+ pointD.x+","+pointD.y + " L "+ (x+w) + "," + (y);

			pathE = "M " + (x+w) + "," + (y+hs) + " l -"+(w/2)+","+(h-hs)+" L "+ pointA.x+","+pointA.y+
						" L "+ pointE.x+","+pointE.y + " L "+ (x+w) + "," + (y+hs);
		
			createDescription(id+"_a", "CROSS-RAIL... base LENGTH: " + getDim(Math.sqrt(Math.pow(w/2,2)+Math.pow((h-hs),2)))  + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA)+"," + Math.round(degB) + " degrees.");
			createDescription(id+"_e", "CROSS-RAIL... base LENGTH: " + getDim(Math.sqrt(Math.pow(w/2,2)+Math.pow((h-hs),2)))  + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA)+"," + Math.round(degB) + " degrees.");
			createDescription(id+"_b", "SIDE-RAIL... base LENGTH: " + getDim(hs) + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degB) + ",45 degrees.");
			createDescription(id+"_d", "SIDE-RAIL... base LENGTH: " + getDim(hs) + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degB) + ",45 degrees.");
			createDescription(id+"_c", "HEAD-RAIL... base LENGTH: " + getDim(w) + "  THICKNESS: " + getDim(f) + "   MITRE: 45,45 degrees.");
		
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
	alertUser("Exception:  initMitredHomePlateFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+hs+","+ f+",'"+ color+"','"+ type+"')");
	alertUser(e);
	trace(e);
}	
}