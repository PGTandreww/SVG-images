
/**
 * Draw glass triangle
 * 
 * @param id		String id
 * @param sashId	String id of containing sash
 * @param x			decimal x coordinate of containing rectangle
 * @param y			decimal y coordinate of containing rectangle
 * @param w			decimal width of containing rectangle
 * @param h			decimal height of containing rectangle
 * @param f			decimal frame thickness
 * @param v			decimal hidden glass inset
 * @param type		String LT=left/top,LB=left/bottom, RT=right/top, RB=right/bottom, 
 * 							IT=isosolese/top, IB=isosolese/bottom,
 * @return
 */
function initGlassTriangle(id,sashId,x, y, w, h, f /*inset*/, v /*hidden glass inset*/, type)
{
try
{
trace("initGlassTriangle('"+id+"','"+sashId+"',"+x+","+ y+","+ w+","+ h+","+ f+","+ v+",'"+type+"')");
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
		gls.setAttribute("shape","triangle");
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
				t.setAttribute("x",x+inchesToMM(4));
				t.setAttribute("y",y+h-inchesToMM(4));
				break;
			case "LT":
				t.setAttribute("x",x+w-inchesToMM(4));
				t.setAttribute("y",y+h-inchesToMM(4));			
				break;
			case "IT":
				t.setAttribute("x",x+w-inchesToMM(4));
				t.setAttribute("y",y+h-inchesToMM(4));			
				break;
			case "LB":
				t.setAttribute("x",x+w-inchesToMM(4));
				t.setAttribute("y",y+inchesToMM(4));
				break;
				
			case "RB":
				t.setAttribute("x",x+inchesToMM(4));
				t.setAttribute("y",y+inchesToMM(4));
				break;
			case "IB":
				t.setAttribute("x",x+inchesToMM(4));
				t.setAttribute("y",y+inchesToMM(4));
				break;	
			default:
				t.setAttribute("x",x+inchesToMM(4));
				t.setAttribute("y",y+inchesToMM(4));
				break;
		}

	}
	var path,angleA,angleB,angleC,pointA, pointB, pointC, insetX, insetY,wV,hV,wNet,vNet;

	switch(type)
	{
		case "RT":  // right triangle, facing right, pointy end up
		{
			angleA = Math.atan2(w,h);
			insetY = f/Math.tan(angleA/2);
			pointA = new Point(x+f,y+insetY);
			
			angleB = Math.atan2(h,w);
			insetX = f/Math.tan(angleB/2);
			pointB = new Point(x+w-insetX,y+h-f);
			
			pointC = new Point(x+f,y+h-f);
			
			wNet = w - (f+insetX);
			hNet = h - (f+insetY);
			
			insetY = (f+v)/Math.tan(angleA/2);
			insetX = (f+v)/Math.tan(angleB/2);

			wV = w - ((f+v)+insetX);
			hV = h - ((f+v)+insetY);
		
		
		}
		break;
		case "RB": // right triangle, facing right, pointy end down
		{
			angleA = Math.atan2(w,h);
			insetY = f/Math.tan(angleA/2);
			pointA = new Point(x+f,y+h-insetY);
			
			angleB = Math.atan2(h,w);
			insetX = f/Math.tan(angleB/2);
			pointB = new Point(x+w-insetX,y+f);
			
			pointC = new Point(x+f,y+f);
						
			wNet = w - (f+insetX);
			hNet = h - (f+insetY);
			
			insetY = (f+v)/Math.tan(angleA/2);
			insetX = (f+v)/Math.tan(angleB/2);

			wV = w - ((f+v)+insetX);
			hV = h - ((f+v)+insetY);
			
		}
			break;
		case "LT":  // right triangle, facing left, pointy end up
		{
			angleA = Math.atan2(w,h);
			insetY = f/Math.tan(angleA/2);
			pointA = new Point(x+w-f,y+insetY);
			
			angleB = Math.atan2(h,w);
			insetX = f/Math.tan(angleB/2);
			pointB = new Point(x+insetX,y+h-f);
			
			pointC = new Point(x+w-f,y+h-f);
						
			wNet = w - (f+insetX);
			hNet = h - (f+insetY);
			
			insetY = (f+v)/Math.tan(angleA/2);
			insetX = (f+v)/Math.tan(angleB/2);

			wV = w - ((f+v)+insetX);
			hV = h - ((f+v)+insetY);
			
		}
		break;
		case "LB": // right triangle, facing left, pointy end down
		{
			angleA = Math.atan2(w,h);
			insetY = f/Math.tan(angleA/2);
			
			angleB = Math.atan2(h,w);
			insetX = f/Math.tan(angleB/2);
			pointA = new Point(x+insetX,y+f);
			pointB = new Point(x+w-f,y+h-insetY);
			
			pointC = new Point(x+w-f,y+f);
						
			wNet = w - (f+insetX);
			hNet = h - (f+insetY);
			
			insetY = (f+v)/Math.tan(angleA/2);
			insetX = (f+v)/Math.tan(angleB/2);

			wV = w - ((f+v)+insetX);
			hV = h - ((f+v)+insetY);
			
		
		}
			break;	
		case "IT":  // isosoles, pointy end up
		{
			angleA = Math.atan2(w/2,h);
			insetY = Math.sqrt(Math.pow(f/Math.tan(angleA),2)+Math.pow(f,2));
			pointA = new Point(x+(w/2),y+insetY);
		
			angleB = Math.atan2(h,w/2);
			insetX = f/Math.tan(angleB/2);
			pointB = new Point(x+insetX,y+h-f);
				
			pointC = new Point(x+w-insetX,y+h-f);
			
						
			
			wNet = w - (2*insetX);
			hNet = h - (f+insetY);
			
			insetY = (f+v)/Math.tan(angleA/2);
			insetX = (f+v)/Math.tan(angleB/2);

			wV = w - (2*insetX);
			hV = h - ((f+v)+insetY);
			
			
							
		}
		break;
		case "IB":  // isosoles, pointy end down
		{
			angleA = Math.atan2(w/2,h);
			insetY = f/Math.tan(angleA);
			pointA = new Point(x+(w/2),y+h-insetY);
			
			angleB = Math.atan2(h,w/2);
			insetX = f/Math.tan(angleB/2);
			pointB = new Point(x+w-insetX,y+f);
			
			pointC = new Point(x+insetX,y+f);
		
			wNet = w - (2*insetX);
			hNet = h - (f+insetY);
			
			insetY = (f+v)/Math.tan(angleA/2);
			insetX = (f+v)/Math.tan(angleB/2);

			wV = w - (2*insetX);
			hV = h - ((f+v)+insetY);
			
			
		
		}
		break;
		default:
			break;
	}
	




	path = "M " + pointA.x + "," + pointA.y + " L "+ pointB.x + "," + pointB.y + " L " + pointC.x + "," + pointC.y + " L " + pointA.x + "," + pointA.y;
	gls.setAttribute("d",path);
  gls.setAttribute("x1",pointA.x);
  gls.setAttribute("y1",pointA.y);
  gls.setAttribute("x2",pointB.x);
  gls.setAttribute("y2",pointB.y);
  gls.setAttribute("x3",pointC.x);
  gls.setAttribute("y3",pointC.y);


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
	alertUser("Exception: initGlassTriangle('"+id+"','"+sashId+"',"+x+","+ y+","+ w+","+ h+","+ f+","+ v+",'"+type+"')");

	alertUser(e);
	trace(e);
}	
} 


/**
 * Draw triangle frame, mitred
 * 
 * @param id		String id
 * @param x			decimal x coordinate of containing rectangle
 * @param y			decimal y coordinate of containing rectangle
 * @param w			decimal width of containing rectangle
 * @param h			decimal height of containing rectangle
 * @param f			decimal frame thickness
 * @param color		String web color code
 * @param type		String LT=left/top,LB=left/bottom, RT=right/top, RB=right/bottom, 
 * 							IT=isosolese/top, IB=isosolese/bottom,
 * @return
 */
function initMitredTriangleFrame(id, x, y, w, h, f, color, type)
{
try
{
trace("initMitredTriangleFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+",'"+ color+"','"+ type+"')");

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

	var sideA = drawing.getElementById(id+"_a");
	if(sideA == null)
	{
		sideA = drawing.createElementNS(svgNS,"path");
		sideA.setAttribute("id",id+"_a");
		sideA.setAttribute("class","frame");
		sideA.setAttribute("d","M 0,0");
		
		grp.appendChild(sideA);
	}
	
	var sideB = drawing.getElementById(id+"_b");
	if(sideB == null)
	{
		sideB = drawing.createElementNS(svgNS,"path");
		sideB.setAttribute("id",id+"_b");
		sideB.setAttribute("class","frame");
		sideB.setAttribute("d","M 0,0");
		
		grp.appendChild(sideB);
	}
	
	var sideC = drawing.getElementById(id+"_c");
	if(sideC == null)
	{
		sideC = drawing.createElementNS(svgNS,"path");
		sideC.setAttribute("id",id+"_c");
		sideC.setAttribute("class","frame");
		sideC.setAttribute("d","M 0,0");
		
		grp.appendChild(sideC);
	}
	
	var angleA,angleB,angleC,degA,degB,degC,pointA, pointB, pointC, pathA, pathB, pathC, insetX, insetY;
	

	switch(type)
	{
		case "RT":  // right triangle, facing right, pointy end up
		{
			angleA = Math.atan2(w,h);
			
			degA = (angleA / Math.PI)*180;
			
			insetY = f/Math.tan(angleA/2);
			pointA = new Point(x+f,y+insetY);
			
			angleB = Math.atan2(h,w);
			degB = ((angleB) / Math.PI)*180;
			
			insetX = f/Math.tan(angleB/2);
			pointB = new Point(x+w-insetX,y+h-f);
			
			pointC = new Point(x+f,y+h-f);
			
			pathA = "M " + x + "," + y + " l 0," + h + " L "+ pointC.x+","+pointC.y
						+" L "+ pointA.x+","+pointA.y + " L " +x+","+y;
			
			pathB = "M " + x + "," + (y+h) + " l "+w+",0 L "+pointB.x+","+pointB.y
						+" L "+ pointC.x+","+pointC.y + " L " +x+","+(y+h);
				
			pathC = "M " + x + "," + y + " l "+w+"," + h + " L "+ pointB.x+","+pointB.y
						+" L "+ pointA.x+","+pointA.y + " L " +x+","+y;
		
			createDescription(id+"_b", "SILL... base LENGTH: " + getDim(w) + "  THICKNESS: " + getDim(f) + "   MITRE: 45," + Math.round(degB) + " degrees.");
			createDescription(id+"_a", "SIDE-RAIL... base LENGTH: " + getDim(h) + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA) + ",45 degrees.");
			createDescription(id+"_c", "CROSS-RAIL...base LENGTH: " + getDim(Math.sqrt(Math.pow(w,2)+Math.pow(h,2))) + "  THICKNESS: " + getDim(f) + "   MITRE: 45," + Math.round(degB) + " degrees.");
		
		}
		break;
		case "RB": // right triangle, facing right, pointy end down
		{
			angleA = Math.atan2(w,h);
			degA = ((angleA/2) / Math.PI)*180;
			
			insetY = f/Math.tan(angleA/2);
			pointA = new Point(x+f,y+h-insetY);
			
			angleB = Math.atan2(h,w);
			degB = ((angleB/2) /Math.PI)*180;
			
			insetX = f/Math.tan(angleB/2);
			pointB = new Point(x+w-insetX,y+f);
			
			pointC = new Point(x+f,y+f);
			
			pathA = "M " + x + "," + (y+h) + " l 0,-" + h + " L "+ pointC.x+","+pointC.y
						+" L "+ pointA.x+","+pointA.y + " L " +x+","+(y+h);
			
			pathB = "M " + x + "," + y + " l "+w+",0 L "+pointB.x+","+pointB.y
						+" L "+ pointC.x+","+pointC.y + " L " +x+","+y;
				
			pathC = "M " + (x+w) + "," + y + " l -"+w+"," + h + " L "+ pointA.x+","+pointA.y
						+" L "+ pointB.x+","+pointB.y + " L " +(x+w)+","+y;

			createDescription(id+"_b", "TOP-RAIL... base LENGTH: " + getDim(w) + "  THICKNESS: " + (f) + "   MITRE: 45," + Math.round(degB) + " degrees.");
			createDescription(id+"_a", "SIDE-RAIL... base LENGTH: " + getDim(h) + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA) + ",45 degrees.");
			createDescription(id+"_c", "CROSS-RAIL...base LENGTH: " + getDim(Math.sqrt(Math.pow(w,2)+Math.pow(h,2))) + "  THICKNESS: " + getDim(f) + "   MITRE: 45," + Math.round(degB) + " degrees.");
		
		
		}
			break;
		case "LT":  // right triangle, facing left, pointy end up
		{
			angleA = Math.atan2(w,h);
			
			degA = ((angleA/2) / Math.PI)*180;
			
			insetY = f/Math.tan(angleA/2);
			pointA = new Point(x+w-f,y+insetY);
			
			angleB = Math.atan2(h,w);
			degB = ((angleB/2) / Math.PI)*180;
			
			insetX = f/Math.tan(angleB/2);
			
			pointB = new Point(x+insetX,y+h-f);
			
			pointC = new Point(x+w-f,y+h-f);
			
			pathA = "M " + (x+w) + "," + y + " l 0," + h + " L "+ pointC.x+","+pointC.y
						+" L "+ pointA.x+","+pointA.y + " L " +(x+w)+","+y;
			
			pathB = "M " + x + "," + (y+h) + " l "+w+",0 L "+pointC.x+","+pointC.y
						+" L "+ pointB.x+","+pointB.y + " L " +x+","+(y+h);
				
			pathC = "M " + (x+w) + "," + y + " l -"+w+"," + h + " L "+ pointB.x+","+pointB.y
						+" L "+ pointA.x+","+pointA.y + " L " +(x+w)+","+y;

			createDescription(id+"_b", "SILL... base LENGTH: " + getDim(w) + "  THICKNESS: " + getDim(f) + "   MITRE: 45," + Math.round(degB) + " degrees.");
			createDescription(id+"_a", "SIDE-RAIL... base LENGTH: " + getDim(h) + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA) + ",45 degrees.");
			createDescription(id+"_c", "CROSS-RAIL...base LENGTH: " + getDim(Math.sqrt(Math.pow(w,2)+Math.pow(h,2))) + "  THICKNESS: " + getDim(f) + "   MITRE: 45," + Math.round(degB) + " degrees.");
		
		}
		break;
		case "LB": // right triangle, facing left, pointy end down
		{
//			angleA = Math.atan2(w,h);
//			insetY = f/Math.tan(angleA/2);
//			angleB = Math.atan2(h,w);
//			insetX = f/Math.tan(angleB/2);
//			pointA = new Point(x+f+insetX,y+f);
//			pointB = new Point(x+w-f,y+h-insetY);
			
//			pointC = new Point(x+w-f,y+f);
			angleA = Math.atan2(w,h);
			degA = ((angleA/2) /Math.PI)*180;
			
			insetY = f/Math.tan(angleA/2);

			
			angleB = Math.atan2(h,w);
			degB = ((angleB/2) / Math.PI)*180;
			
			insetX = f/Math.tan(angleB/2);
			pointA = new Point(x+insetX,y+f);
			pointB = new Point(x+w-f,y+h-insetY);
			
			pointC = new Point(x+w-f,y+f);
			
			pathA = "M " + x + "," + y + " l "+w+",0 L "+ pointC.x+","+pointC.y
						+" L "+ pointA.x+","+pointA.y + " L " +x+","+y;
			
			pathB = "M " + (x+w) + "," + y + " l 0,"+h+" L "+pointB.x+","+pointB.y
						+" L "+ pointC.x+","+pointC.y + " L " +(x+w)+","+y;
				
			pathC = "M " + x + "," + y + " l "+w+"," + h + " L "+ pointB.x+","+pointB.y
						+" L "+ pointA.x+","+pointA.y + " L " +x+","+y;

			createDescription(id+"_a", "TOP-RAIL... base LENGTH: " + getDim(w) + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA) + ",45 degrees.");
			createDescription(id+"_b", "SIDE-RAIL... base LENGTH: " + getDim(h) + "  THICKNESS: " + getDim(f) + "   MITRE: 45," + Math.round(degA) + " degrees.");
			createDescription(id+"_c", "CROSS-RAIL...base LENGTH: " + getDim(Math.sqrt(Math.pow(w,2)+Math.pow(h,2))) + "  THICKNESS: " + getDim(f) + "   MITRE: 45," + Math.round(degB) + " degrees.");
		
		}
			break;	
		case "IT":  // isosoles, pointy end up
		{
			angleA = Math.atan2(w/2,h);
			degA = (angleA / Math.PI)*180;
						
			insetY = Math.sqrt(Math.pow(f/Math.tan(angleA),2)+Math.pow(f,2));
			pointA = new Point(x+(w/2),y+insetY);
		
			angleB = Math.atan2(h,w/2);
			degB = ((angleB/2) / Math.PI)*180;
			
			insetX = f/Math.tan(angleB/2);
			pointB = new Point(x+insetX,y+h-f);
				
			pointC = new Point(x+w-insetX,y+h-f);
			
			pathA = "M " + (x+(w/2)) + "," + y + " l -"+(w/2)+","+ h + " L "+ pointB.x+","+pointB.y
						+" L "+ pointA.x+","+pointA.y + " L " +(x+(w/2))+","+y;
			pathB = "M " + (x+(w/2)) + "," + y + " l "+(w/2)+","+ h + " L "+ pointC.x+","+pointC.y
						+" L "+ pointA.x+","+pointA.y + " L " +(x+(w/2))+","+y;
			pathC = "M " + (x) + "," + (y+h) + " l "+w+",0 L "+ pointC.x+","+pointC.y
						+" L "+ pointB.x+","+pointB.y + " L " +x+","+(y+h);
						
			createDescription(id+"_a", "SIDE-RAIL... base LENGTH: " + getDim(Math.sqrt(Math.pow(w/2,2)+Math.pow(h,2)))+ "  THICKNESS: " + (f) + "   MITRE: " + Math.round(degA) + ","+Math.round(degB) + " degrees.");
			createDescription(id+"_b", "SIDE-RAIL... base LENGTH: " + getDim(Math.sqrt(Math.pow(w/2,2)+Math.pow(h,2))) + "  THICKNESS: " + (f) + "   MITRE: " + Math.round(degA) + ","+Math.round(degB) + " degrees.");
			createDescription(id+"_c", "SILL...base LENGTH: " + getDim(w) + "  THICKNESS: " + getDim(f) + "   MITRE: "+ Math.round(degB)+"," + Math.round(degB) + " degrees.");
						
		}
		break;
		case "IB":  // isosoles, pointy end down
		{
			angleA = Math.atan2(w/2,h);
			degA = (angleA / Math.PI)*180;
			
			insetY = f/Math.tan(angleA);
			pointA = new Point(x+(w/2),y+h-insetY);
			
			angleB = Math.atan2(h,w/2);
			degB = ((angleB/2) / Math.PI)*180;
			
			insetX = f/Math.tan(angleB/2);
			pointB = new Point(x+w-insetX,y+f);
			
			pointC = new Point(x+insetX,y+f);
			
			pathA = "M " + x + "," + y + " l "+(w/2)+","+ h + " L "+ pointA.x+","+pointA.y
						+" L "+ pointC.x+","+pointC.y + " L " +x+","+y;
			pathB = "M " + (x+w) + "," + y + " l -"+(w/2)+","+ h + " L "+ pointA.x+","+pointA.y
						+" L "+ pointB.x+","+pointB.y + " L " +(x+w)+","+y;
			pathC = "M " + x + "," + y + " l "+w+",0 L "+ pointB.x+","+pointB.y
						+" L "+ pointC.x+","+pointC.y + " L " +x+","+y;
						
			createDescription(id+"_a", "SIDE-RAIL... base LENGTH: " + getDim(Math.sqrt(Math.pow(w/2,2)+Math.pow(h,2)))+ "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA) + ","+Math.round(degB) + " degrees.");
			createDescription(id+"_b", "SIDE-RAIL... base LENGTH: " + getDim(Math.sqrt(Math.pow(w/2,2)+Math.pow(h,2))) + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA) + ","+Math.round(degB) + " degrees.");
			createDescription(id+"_c", "TOP-RAIL...base LENGTH: " + getDim(w) + "  THICKNESS: " + getDim(f) + "   MITRE: 45," + Math.round(degB) + " degrees.");
						
		
		}
		break;
		default:
			break;
	}
	
	sideA.setAttribute("d",pathA);
	sideB.setAttribute("d",pathB);
	sideC.setAttribute("d",pathC);
	
	sideA.getStyle().setProperty("fill",color,"");
	sideB.getStyle().setProperty("fill",color,"");
	sideC.getStyle().setProperty("fill",color,"");
	
	
		

	

}	
catch(e)
{
	alertUser("Exception:  initMitredTriangleFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+",'"+ color+"','"+ type+"')");
	alertUser(e);
	trace(e);
}	
} 



/**
 * Draw trapezoid glass
 * 
 * @param id		String id
 * @param sashId 	String id of containing sash/frame
 * @param x			decimal x coordinate of containing rectangle
 * @param y			decimal y coordinate of containing rectangle
 * @param w			decimal width 
 * @param h			decimal height of long side
 * @param hs		decimal height of short side
 * @param f			decimal frame thickness
 * @param v			decimal visible inset
 * @param type		String LT=left/top,LB=left/bottom, RT=right/top, RB=right/bottom, 
 * 							IT=isosolese/top, IB=isosolese/bottom,
 * @return
 */
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
		gls.setAttribute("shape","trapezoid");
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
				t.setAttribute("x",x+inchesToMM(4));
				t.setAttribute("y",y+h-inchesToMM(4));
				break;
			case "LT":
				t.setAttribute("x",x+w-inchesToMM(4));
				t.setAttribute("y",y+h-inchesToMM(4));			
				break;			
			case "IT":
				t.setAttribute("x",x+w-inchesToMM(4));
				t.setAttribute("y",y+h-inchesToMM(4));			
				break;
			case "LB":
				t.setAttribute("x",x+w-inchesToMM(4));
				t.setAttribute("y",y+inchesToMM(4));
				break;
				
			case "RB":
				t.setAttribute("x",x+inchesToMM(4));
				t.setAttribute("y",y+inchesToMM(4));
				break;			
			case "IB":
				t.setAttribute("x",x+inchesToMM(4));
				t.setAttribute("y",y+inchesToMM(4));
				break;	
			case "RS":
				t.setAttribute("x",x+inchesToMM(4));
				t.setAttribute("y",y+inchesToMM(4));
				break;
			case "LS":
				t.setAttribute("x",x+inchesToMM(4));
				t.setAttribute("y",y+inchesToMM(4));
				break;
			default:
				t.setAttribute("x",x+inchesToMM(4));
				t.setAttribute("y",y+inchesToMM(4));
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
			
			pointC = new Point(x+w-f,y+f);
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
			pointA = new Point(x+w-f,y+h-insetY);
				
			angleB = Math.PI - angleA;
			insetY = f/Math.tan(angleB/2);
			
			pointB = new Point(x+f,y+hs-insetY);
			
			
			pointC = new Point(x+f,y+f);
			pointD = new Point(x+w-f,y+f);
		}
			break;	

		case "IT": // narrow end Up
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

		}
			break;	

		case "IB": // narrow end Down
		{
			angleA = Math.atan2((w-hs)/2,h) + Math.PI/2;
			
			degA = degD = (angleA / Math.PI)*90;
			insetX = f/Math.tan(angleA/2);
			pointA = new Point(x+w-((w-hs)/2)+insetX,y+h-f);
			pointD = new Point(x+((w-hs)/2)-insetX,y+h-f);
			
			angleB = Math.atan2(h,(w-hs)/2);
			insetX = f/Math.tan(angleB/2);
			degB = degC  = (angleB / Math.PI)*90; 
			pointB = new Point(x+w-insetX,y+f);
			pointC = new Point(x+insetX,y+f);

		}
			break;	
		case "RS":  // facing right, pointy end right
		{
			angleA = Math.atan2(w,(h-hs));
			insetY = f/Math.tan(angleA/2);
			pointA = new Point(x+w-f,y+h-insetY);
			
			angleB = Math.PI - angleA;
			insetY = f/Math.tan(angleB/2);
			
			pointB = new Point(x+hs-f,y+insetY);
			pointC = new Point(x+f,y+f);
			pointD = new Point(x+f,y+h-f);
		}
		break;
		case "LS":  // facing left, pointy end left
		{
			angleA = Math.atan2(w,(h-hs));
			insetY = f/Math.tan(angleA/2);
			pointA = new Point(x+f,y+h-insetY);
									
			angleB = Math.PI - angleA;
			insetY = f/Math.tan(angleB/2);
			pointB = new Point(x+w-hs+f,y+insetY);
			pointC = new Point(x+w-f,y+f);
			pointD = new Point(x+w-f,y+h-f);
		}
			break;	
		default:
			break;
	}
	




	path = "M " + pointA.x + "," + pointA.y + " L "+ pointB.x + "," + pointB.y + " L " + pointC.x + "," + pointC.y + " L " + pointD.x + "," + pointD.y + " L " + pointA.x + "," + pointA.y;
	gls.setAttribute("d",path);
  gls.setAttribute("x1",pointA.x);
  gls.setAttribute("y1",pointA.y);
  gls.setAttribute("x2",pointB.x);
  gls.setAttribute("y2",pointB.y);
  gls.setAttribute("x3",pointC.x);
  gls.setAttribute("y3",pointC.y);
  gls.setAttribute("x4",pointD.x);
  gls.setAttribute("y4",pointD.y);


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



/**
 * Draw trapezoid frame (non-mitred)
 * 
 * @param id		String id
 * @param x			decimal x coordinate of containing rectangle
 * @param y			decimal y coordinate of containing rectangle
 * @param w			decimal width 
 * @param h			decimal height of long side
 * @param hs		decimal height of short side
 * @param f			decimal frame thickness
 * @param sillThk	decimal sill thickness
 * @param color 	String web color code
 * @param type		String LT=left/top,LB=left/bottom, RT=right/top, RB=right/bottom, 
 * 							IT=isosolese/top, IB=isosolese/bottom,
 * @return
 */
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


/**
 * Draw trapezoid frame (mitred)
 * 
 * @param id		String id
 * @param x			decimal x coordinate of containing rectangle
 * @param y			decimal y coordinate of containing rectangle
 * @param w			decimal width 
 * @param h			decimal height of long side
 * @param hs		decimal height of short side
 * @param f			decimal frame thickness
 * @param color 	String web color code
 * @param type		String LT=left/top,LB=left/bottom, RT=right/top, RB=right/bottom, 
 * 							IT=isosolese/top, IB=isosolese/bottom,
 * @return
 */
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
			pointA = new Point(x+w-f,y+h-insetY);
			
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
				
			pathC = "M " + (x+w) + "," + (y+h) + " l -"+((w-hs)/2)+",-"+h+" L "+ pointD.x+","+pointD.y+
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
		case "LS":  // facing left, pointy end left
		{
			angleA = Math.atan2(w,(h-hs));
			degA = (angleA / Math.PI)*90;
			insetX = f/Math.tan(angleA/2);

							
			angleB = Math.PI - angleA;
			degB = (angleB / Math.PI)*90;
			insetY = f/Math.tan(angleB/2);
			pointA = new Point(x+insetY+f,y+h-f);
			pointB = new Point(x+w-hs+insetY,y+f);			

			pointC = new Point(x+w-f,y+f);
			pointD = new Point(x+w-f,y+h-f);
			
			
			pathA = "M " + x + "," + (y+h) + " L "+ (x+w-hs)+","+ y + " L "+ pointB.x+","+pointB.y+
						" L "+ pointA.x+","+pointA.y + " L " +x+","+(y+h);
			
			pathB = "M " + (x+w-hs) + "," + y + " L "+(x+w)+",0 L "+pointC.x+","+pointC.y+
						" L "+ pointB.x+","+pointB.y + " L " +(x+w-hs)+","+(y);
				
			pathC = "M " + (x+w) + "," + y + " l 0,"+(y+h)+" L "+ pointD.x+","+pointD.y+
						" L "+ pointC.x+","+pointC.y + " L "+ (x+w) + "," + (y);
		
			pathD = "M " + (x) + "," + (y+h) + " l "+(x+w)+",0 L "+ pointD.x+","+pointD.y+
						" L "+ pointA.x+","+pointA.y + " L "+ (x) + "," + (y+h);
		
			createDescription(id+"_a", "ANGLED-SIDE-RAIL... base LENGTH: " + getDim(Math.sqrt(Math.pow(w,2)+Math.pow((h-hs),2)))  + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA)+"," + Math.round(degB) + " degrees.");
			createDescription(id+"_b", "HEAD-RAIL... base LENGTH: " + getDim(hs) + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degB) + ",45 degrees.");
			createDescription(id+"_c", "SIDE-RAIL... base LENGTH: " + getDim(w) + "  THICKNESS: " + getDim(f) + "   MITRE: 45,45 degrees.");
			createDescription(id+"_d", "SILL...base LENGTH: " + getDim(h) + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA)+",45 degrees.");
		
		}
		break;
		case "RS":  // facing right, pointy end right
		{
			angleA = Math.atan2(w,(h-hs));
			degA = (angleA / Math.PI)*90;
			insetY = f/Math.tan(angleA/2);

			
			angleB = Math.PI - angleA;
			degB = (angleB / Math.PI)*90;
			insetY = f/Math.tan(angleB/2);
			pointA = new Point(x+w-insetY-f,y+h-f);
			pointB = new Point(x+hs-insetY,y+f);

			pointC = new Point(x+f,y+f);
			pointD = new Point(x+f,y+h-f);
			
			pathA = "M " + (x+w) + "," + (y+h) + " L "+ (hs)+","+ (y) + " L "+ pointB.x+","+pointB.y+
						" L "+ pointA.x+","+pointA.y + " L " +(x+w)+","+(y+h);
			
			pathB = "M " + (hs) + "," + (y) + " L "+(x)+","+(y)+" L "+pointC.x+","+pointC.y+
						" L "+ pointB.x+","+pointB.y + " L " +(hs)+","+(y);
				
			pathC = "M " + (x) + "," + (y) + " l "+(x)+","+(y+h)+" L "+ pointD.x+","+pointD.y+
						" L "+ pointC.x+","+pointC.y + " L "+ (x) + "," + (y);
		
			pathD = "M " + (x) + "," + (y+h) + " l "+(x+w)+",0 L "+ pointA.x+","+pointA.y+
						" L "+ pointD.x+","+pointD.y + " L "+ (x) + "," + (y+h);
		
			createDescription(id+"_a", "ANGLED-SILL-RAIL... base LENGTH: " + getDim(Math.sqrt(Math.pow(w,2)+Math.pow((h-hs),2)))  + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA)+"," + Math.round(degB) + " degrees.");
			createDescription(id+"_b", "HEAD-RAIL... base LENGTH: " + getDim(hs) + "  THICKNESS: " + getDim(f) + "   MITRE: 45,"+Math.round(degB)+" degrees.");
			createDescription(id+"_c", "SIDE-RAIL... base LENGTH: " + getDim(w) + "  THICKNESS: " + getDim(f) + "   MITRE: 45,45 degrees.");
			createDescription(id+"_d", "SILL...base LENGTH: " + getDim(h) + "  THICKNESS: " + getDim(f) + "   MITRE: 45,"+ Math.round(degA)+" degrees.");
			
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

function initGlassTrapezoidExt(id,sashId,x, y, w, h, l, hw, f /*inset*/, v /*hidden glass inset*/, type)
{
try
{
trace("initGlassTrapezoidExt('"+id+"','"+sashId+"',"+x+","+ y+","+ w+","+ h+","+ l+","+ hw+","+ f+","+ v+",'"+type+"')");
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
		gls.setAttribute("shape","trapext");
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
			case "IT":
				t.setAttribute("x",x+w-inchesToMM(4));
				t.setAttribute("y",y+h-inchesToMM(4));
				break;			
			default:
				t.setAttribute("x",x+inchesToMM(4));
				t.setAttribute("y",y+inchesToMM(4));
				break;
		}
	}
	
	var path,angleA,angleB,angleC,angleD,pointA, pointB, pointC, pointD, pointE, pointF,insetX, insetY,wV,hV, hsV,wNet,hNet, hsNet, lDiag;

	switch(type)
	{
		case "IT": // narrow end Up
		{
			angleA = Math.atan2((w-hw)/2,(h-l));
			angleB = Math.PI - angleA;
			degA = degD = (angleB / Math.PI)*90;
			insetX = f/Math.tan(angleB/2);
			pointA = new Point(f,h-l+insetX);
			pointD = new Point(w-f,h-l+insetX);

			angleC = Math.atan2((h-l),(w-hw)/2);
			angleD = Math.PI - angleC;
			insetY = f/Math.tan(angleD/2);
			degB = degC  = (angleD / Math.PI)*90; 
			pointB = new Point(((w-hw)/2)+insetY,f);
			pointC = new Point(((w-hw)/2)+hw-insetY,f);
			
			pointE = new Point(w-f,h-f);
			pointF = new Point(f,h-f);

		}
			break;	

		default:
			break;
	}
	

	path = "M " + pointA.x + "," + pointA.y +
			" L "+ pointB.x + "," + pointB.y +
			" L " + pointC.x + "," + pointC.y +
			" L " + pointD.x + "," + pointD.y +
			" L " + pointE.x + "," + pointE.y +
			" L " + pointF.x + "," + pointF.y + 
			" L " + pointA.x + "," + pointA.y;
	gls.setAttribute("d",path);
  gls.setAttribute("x1",pointA.x);
  gls.setAttribute("y1",pointA.y);
  gls.setAttribute("x2",pointB.x);
  gls.setAttribute("y2",pointB.y);
  gls.setAttribute("x3",pointC.x);
  gls.setAttribute("y3",pointC.y);
  gls.setAttribute("x4",pointD.x);
  gls.setAttribute("y4",pointD.y);
  gls.setAttribute("x5",pointE.x);
  gls.setAttribute("y5",pointE.y);


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
	alertUser("Exception: initGlassTrapezoidExt('"+id+"','"+sashId+"',"+x+","+ y+","+ w+","+ h+","+ l+","+ hw+","+ f+","+ v+",'"+type+"')");

	alertUser(e);
	trace(e);
}	
} 



function initMitredTrapezoidFrameExt(id, x, y, w, h, l, hw, f, color, type)
{
try
{
trace("initMitredTrapezoidFrameExt('"+id+"',"+x+","+ y+","+ w+","+ h+","+l+","+hw+","+ f+",'"+ color+"','"+ type+"')");

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

	var sideF = drawing.getElementById(id+"_f");
	if(sideF === null)
	{
		sideF = drawing.createElementNS(svgNS,"path");
		sideF.setAttribute("id",id+"_f");
		sideF.setAttribute("class","frame");
		sideF.setAttribute("d","M 0,0");
		
		grp.appendChild(sideF);
	}

	var angleA,angleB,angleC,angleD,degA,degB,degC,degD,pointA, pointB, pointC, pointD, pointE, pointF,pathA, pathB, pathC, pathD, pathE, pathF, insetX, insetY;
	

	switch(type)
	{
		case "IT": // isosoles trap with legs, narrow end up
		{
			angleA = Math.atan2((w-hw)/2,(h-l));
			angleB = Math.PI - angleA;
			degA = degD = (angleB / Math.PI)*90;
			insetX = f/Math.tan(angleB/2);
			
			pointA = new Point(f,h-l+insetX);
			pointD = new Point(w-f,h-l+insetX);
	
			angleC = Math.atan2((h-l),(w-hw)/2);
			angleD = Math.PI - angleC;
			insetY = f/Math.tan(angleD/2);
			degB = degC  = (angleD / Math.PI)*90; 
			pointB = new Point(((w-hw)/2)+insetY,f);
			pointC = new Point(((w-hw)/2)+hw-insetY,f);
			
			pointE = new Point(w-f,h-f);
			pointF = new Point(f,h-f);
			
			pathA = "M " + (x) + "," + (h-l) + " L "+((w-hw)/2)+","+ (y) + " L "+ pointB.x+","+pointB.y+
						" L "+ pointA.x+","+pointA.y + " L " +(x) + "," + (h-l);
			
			pathB = "M " + ((w-hw)/2) + "," + (y) + " L "+(((w-hw)/2)+hw)+","+ (y) +" L "+pointC.x+","+pointC.y+
						" L "+ pointB.x+","+pointB.y + " L " +((w-hw)/2) + "," + (y);
				
			pathC = "M " + (((w-hw)/2)+hw) + "," + (y) + " L "+(w)+","+(h-l)+" L "+ pointD.x+","+pointD.y+
						" L "+ pointC.x+","+pointC.y + " L "+ (((w-hw)/2)+hw) + "," + (y);
		
			pathD = "M " + (w) + "," + (h-l) + " L "+(w)+"," +(h)+" L "+ pointE.x+","+pointE.y+
						" L "+ pointD.x+","+pointD.y + " L "+ (w) + "," + (h-l);

			pathE = "M " + (w) + "," + (h) + " L "+(x)+","+(h)+" L "+ pointF.x+","+pointF.y+
						" L "+ pointE.x+","+pointE.y + " L "+ (w) + "," + (h);
		
			pathF = "M " + (x) + "," + (h) + " L "+(x)+","+(h-l)+" L "+ pointA.x+","+pointA.y+
						" L "+ pointF.x+","+pointF.y + " L "+ (x) + "," + (h);

		
			createDescription(id+"_a", "DIAG-CROSS-RAIL1... base LENGTH: " + getDim(Math.sqrt(Math.pow((w-hw)/2,2)+Math.pow((h),2)))  + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA)+"," + Math.round(degB) + " degrees.");
			createDescription(id+"_b", "HEAD-RAIL... base LENGTH: " + getDim(Math.sqrt(Math.pow((w-hw)/2,2)+Math.pow((h),2)))  + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degB)+"," + Math.round(degC) + " degrees.");
			createDescription(id+"_c", "DIAG=CROSS-RAIL2... base LENGTH: " + getDim(hw) + "  THICKNESS: " + getDim(f) + "   MITRE: "+Math.round(degC)+","+Math.round(degD)+" degrees.");
			createDescription(id+"_d", "SIDE-RAIL... base LENGTH: " + getDim(Math.sqrt(Math.pow((w-hw)/2,2)+Math.pow((h),2)))  + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degD)+", 45 degrees.");
			createDescription(id+"_e", "SILL... base LENGTH: " + getDim(Math.sqrt(Math.pow((w-hw)/2,2)+Math.pow((h),2)))  + "  THICKNESS: " + getDim(f) + "   MITRE: 45,45 degrees.");
			createDescription(id+"_f", "SIDE-RAIL... base LENGTH: " + getDim(h) + "  THICKNESS: " + getDim(f) + "   MITRE: 45,"+Math.round(degA)+" degrees.");
		
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
	sideF.setAttribute("d",pathF);
	
	sideA.getStyle().setProperty("fill",color,"");
	sideB.getStyle().setProperty("fill",color,"");
	sideC.getStyle().setProperty("fill",color,"");
	sideD.getStyle().setProperty("fill",color,"");
	sideE.getStyle().setProperty("fill",color,"");
	sideF.getStyle().setProperty("fill",color,"");
	

}	
catch(e)
{
	alertUser("Exception:  initMitredTrapezoidFrameExt('"+id+"',"+x+","+ y+","+ w+","+ h+","+l+","+hw+","+ f+",'"+ color+"','"+ type+"')");
	alertUser(e);
	trace(e);
}	
} 




function initGlassParallel(id,sashId,x, y, w, h, hs, f /*inset*/, v /*hidden glass inset*/, type)
{
try
{
trace("initGlassParallel('"+id+"','"+sashId+"',"+x+","+ y+","+ w+","+ h+","+ hs+","+ f+","+ v+",'"+type+"')");
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
		gls.setAttribute("shape","parallel");
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
			case "R":
				t.setAttribute("x",x+w-inchesToMM(4));
				t.setAttribute("y",y+h-inchesToMM(4));
				break;
			case "L":
				t.setAttribute("x",x+inchesToMM(4));
				t.setAttribute("y",y+h-inchesToMM(4));
				break;
										
			default:
				t.setAttribute("x",x+inchesToMM(4));
				t.setAttribute("y",y+inchesToMM(4));
				break;
		}
	}
	
	var path,angleA,angleB,angleC,pointA, pointB, pointC, pointD, degA,degB,degC,degD,insetX, insetY,wV,hV, hsV,wNet,hNet, hsNet, lDiag;

	switch(type)
	{
		case "L": // narrow end Up
		{
			angleA = Math.atan2(hs,h);
			angleB = (Math.PI/2) - angleA;
			degA = degC = (angleB / Math.PI)*90;
			insetX = f/(Math.tan(angleB/2));
			pointA = new Point(insetX,h-f);
			pointC = new Point(w-insetX,f);

			angleC = Math.PI - angleB; 
			insetY = f/(Math.tan(angleC/2));
			degB = degD  = (angleC / Math.PI)*90; 
			pointB = new Point(hs+insetY,f);
			pointD = new Point(w-hs-insetY,h-f);

		}
			break;	
		case "R": // narrow end Up
		{
			angleA = Math.atan2(hs,h);
			angleB = (Math.PI/2) - angleA;
			degA = degC = (angleB / Math.PI)*90;
			insetXA = f/(Math.tan(angleB/2));
			pointA = new Point(insetXA,f);
			pointC = new Point(w-insetXA,h-f);

			angleC = Math.PI-angleB;
			insetXB = f/(Math.tan(angleC/2));
			degB = degD  = (angleC / Math.PI)*90; 
			pointB = new Point(w-hs-insetXB,f);
			pointD = new Point(hs+insetXB,h-f);

		}
			break;	

		default:
			break;
	}
	

	path = "M " + pointA.x + "," + pointA.y + " L "+ pointB.x + "," + pointB.y + " L " + pointC.x + "," + pointC.y + " L " + pointD.x + "," + pointD.y + " L " + pointA.x + "," + pointA.y;
	gls.setAttribute("d",path);
	gls.setAttribute("x1",pointA.x);
  gls.setAttribute("y1",pointA.y);
  gls.setAttribute("x2",pointB.x);
  gls.setAttribute("y2",pointB.y);
  gls.setAttribute("x3",pointC.x);
  gls.setAttribute("y3",pointC.y);
  gls.setAttribute("x4",pointD.x);
  gls.setAttribute("y4",pointD.y);


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
	alertUser("Exception: initGlassParallel('"+id+"','"+sashId+"',"+x+","+ y+","+ w+","+ h+","+ hs+","+ f+","+ v+",'"+type+"')");

	alertUser(e);
	trace(e);
}	
} 



function initMitredParallelFrame(id, x, y, w, h, hs, f, color, type)
{
try
{
trace("initMitredParallelFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+hs+","+ f+",'"+ color+"','"+ type+"')");

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
		
	var angleA,angleB,angleC,degA,degB,degC,degD, pointA, pointB, pointC, pointD, pathA, pathB, pathC, pathD, insetX, insetY;
	

	switch(type)
	{
		case "L": // parallelogram, pointing left
		{
			angleA = Math.atan2(hs,h);
			angleB = (Math.PI/2) - angleA;
			degA = degC = (angleB / Math.PI)*90;
			insetX = f/Math.tan(angleB/2);
			
			pointA = new Point(insetX,h-f);
			pointC = new Point(w-insetX,f);
	
			angleC = Math.PI - angleB;
			insetY = f/Math.tan(angleC/2);
			degB = degD  = (angleC / Math.PI)*90; 
			pointB = new Point(hs+insetY,f);
			pointD = new Point(w-hs-insetY,h-f);
			
			
			pathA = "M " + (x) + "," + (y+h) + " L "+(hs)+","+ (y) + " L "+ pointB.x+","+pointB.y+
						" L "+ pointA.x+","+pointA.y + " L " +(x) + "," + (y+h);
			
			pathB = "M " + (hs) + "," + (y) + " L "+w+",0 L "+pointC.x+","+pointC.y+
						" L "+ pointB.x+","+pointB.y + " L " +(hs) + "," + (y);
				
			pathC = "M " + (x+w) + "," + (y) + " L "+(w-hs)+","+h+" L "+ pointD.x+","+pointD.y+
						" L "+ pointC.x+","+pointC.y + " L "+ (x+w) + "," + (y);
		
			pathD = "M " + (w-hs) + "," + (y+h) + " L "+(x)+","+h+" L "+ pointA.x+","+pointA.y+
						" L "+ pointD.x+","+pointD.y + " L "+ (w-hs) + "," + (y+h);
		
			createDescription(id+"_a", "SIDE-RAIL... base LENGTH: " + getDim(Math.sqrt(Math.pow((w-hs)/2,2)+Math.pow((h),2)))  + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA)+"," + Math.round(degB) + " degrees.");
			createDescription(id+"_b", "HEAD-RAIL... base LENGTH: " + getDim(h) + "  THICKNESS: " + getDim(f) + "   MITRE: "+Math.round(degB)+","+Math.round(degC)+" degrees.");
			createDescription(id+"_c", "SIDE-RAIL... base LENGTH: " + getDim(Math.sqrt(Math.pow((w-hs)/2,2)+Math.pow((h),2)))  + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA)+"," + Math.round(degB) + " degrees.");
			createDescription(id+"_d", "SILL... base LENGTH: " + getDim(hs) + "  THICKNESS: " + getDim(f) + "   MITRE: "+Math.round(degD)+","+Math.round(degA)+" degrees.");
		
		}
			break;

		case "R": // parallelogram, pointing right
		{
			angleA = Math.atan2(hs,h);
			angleB = (Math.PI/2) - angleA;
			degA = degC = (angleB / Math.PI)*90;
			insetXA = f/Math.tan(angleB/2);
			
			pointA = new Point(insetXA,f);
			pointC = new Point(w-insetXA,h-f);
	
			angleC = Math.PI -angleB;
			insetXB = f/Math.tan(angleC/2);
			degB = degD  = (angleC / Math.PI)*90; 
			pointB = new Point(w-hs-insetXB,f);
			pointD = new Point(hs+insetXB,h-f);
			
			
			pathA = "M " + (x) + "," + (y) + " L "+(w-hs)+","+ (y) + " L "+ pointB.x+","+pointB.y+
						" L "+ pointA.x+","+pointA.y + " L " +(x) + "," + (y);
			
			pathB = "M " + (w-hs) + "," + (y) + " L "+w+","+h+" L "+pointC.x+","+pointC.y+
						" L "+ pointB.x+","+pointB.y + " L " +(w-hs) + "," + (y);
				
			pathC = "M " + (x+w) + "," + (y+h) + " L "+(hs)+","+(y+h)+" L "+ pointD.x+","+pointD.y+
						" L "+ pointC.x+","+pointC.y + " L "+ (x+w) + "," + (y+h);
		
			pathD = "M " + (hs) + "," + (h) + " L "+x+","+y+" L "+ pointA.x+","+pointA.y+
						" L "+ pointD.x+","+pointD.y + " L "+ (hs) + "," + (y+h);
		
			createDescription(id+"_a", "HEAD-RAIL... base LENGTH: " + getDim(Math.sqrt(Math.pow((w-hs)/2,2)+Math.pow((h),2)))  + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA)+"," + Math.round(degB) + " degrees.");
			createDescription(id+"_b", "SIDE-RAIL... base LENGTH: " + getDim(h) + "  THICKNESS: " + getDim(f) + "   MITRE: "+Math.round(degB)+","+Math.round(degC)+" degrees.");
			createDescription(id+"_c", "SILL... base LENGTH: " + getDim(Math.sqrt(Math.pow((w-hs)/2,2)+Math.pow((h),2)))  + "  THICKNESS: " + getDim(f) + "   MITRE: " + Math.round(degA)+"," + Math.round(degB) + " degrees.");
			createDescription(id+"_d", "SIDE-RAIL... base LENGTH: " + getDim(hs) + "  THICKNESS: " + getDim(f) + "   MITRE: "+Math.round(degD)+","+Math.round(degA)+" degrees.");
		
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
	alertUser("Exception:  initMitredParallelFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+hs+","+ f+",'"+ color+"','"+ type+"')");
	alertUser(e);
	trace(e);
}	
} 

/**
 * Draw clip trapezoid glass
 * 
 * @param id		String id
 * @param sashId	String id of containing sash/frame
 * @param x			decimal x coordinate of containing rectangle
 * @param y			decimal y coordinate of containing rectangle
 * @param w			decimal width 
 * @param ws		decimal width of short side
 * @param h			decimal height of long side
 * @param hs		decimal height of short side
 * @param f			decimal frame thickness
 * @param v			decimal visible inset
 * @param type		String LT=left/top, RT=right/top 
 * @return
 */

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
		gls.setAttribute("shape","trapclip");
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
				t.setAttribute("x",x+inchesToMM(4));
				t.setAttribute("y",y+h-inchesToMM(4));
				break;
			case "LT":
				t.setAttribute("x",x+w-inchesToMM(4));
				t.setAttribute("y",y+h-inchesToMM(4));
				break;
			case "LB":
				t.setAttribute("x",x+w-inchesToMM(4));
				t.setAttribute("y",y+inchesToMM(4));
				break;
				
			case "RB":
				t.setAttribute("x",x+inchesToMM(4));
				t.setAttribute("y",y+inchesToMM(4));
				break;
			default:
				t.setAttribute("x",x+inchesToMM(4));
				t.setAttribute("y",y+inchesToMM(4));
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

	gls.setAttribute("x1",pointA.x);
  gls.setAttribute("y1",pointA.y);
  gls.setAttribute("x2",pointB.x);
  gls.setAttribute("y2",pointB.y);
  gls.setAttribute("x3",pointC.x);
  gls.setAttribute("y3",pointC.y);
  gls.setAttribute("x4",pointD.x);
  gls.setAttribute("y4",pointD.y);
  gls.setAttribute("x5",pointE.x);
  gls.setAttribute("y5",pointE.y);


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



/**
 * Draw clip trapezoid frame (non-mitred)
 * 
 * @param id		String id
 * @param x			decimal x coordinate of containing rectangle
 * @param y			decimal y coordinate of containing rectangle
 * @param w			decimal width 
 * @param ws		decimal width of short side
 * @param h			decimal height of long side
 * @param hs		decimal height of short side
 * @param f			decimal frame thickness
 * @param sillThk	decimal sill thickness
 * @param color 	String web color code
 * @param type		String LT=left/top, RT=right/top
 * @return
 */

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



/**
 * Draw clip trapezoid frame (mitred)
 * 
 * @param id		String id
 * @param x			decimal x coordinate of containing rectangle
 * @param y			decimal y coordinate of containing rectangle
 * @param w			decimal width 
 * @param ws		decimal width of short side
 * @param h			decimal height of long side
 * @param hs		decimal height of short side
 * @param f			decimal frame thickness
 * @param color 	String web color code
 * @param type		String LT=left/top, RT=right/top
 * @return
 */
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
















/**
 * Draw pentagon glass
 * 
 * @param id		String id
 * @param sashId	String id of containing sash/frame
 * @param x			decimal x coordinate of containing rectangle
 * @param y			decimal y coordinate of containing rectangle
 * @param w			decimal width 
 * @param h			decimal height of long side
 * @param hs		decimal height of short side
 * @param f			decimal frame thickness
 * @param v			decimal visible glass inset
 * @param type		String T=top, B=bottom
 * @return
 */


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
		gls.setAttribute("shape","pentagon");
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
				t.setAttribute("x",x+w-inchesToMM(4));
				t.setAttribute("y",y+h-inchesToMM(4));
				break;				
			case "B":
				t.setAttribute("x",x+inchesToMM(4));
				t.setAttribute("y",y+inchesToMM(4));
				break;

			default:
				t.setAttribute("x",x+w-inchesToMM(4));
				t.setAttribute("y",y+h-inchesToMM(4));
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

	gls.setAttribute("x1",pointA.x);
  gls.setAttribute("y1",pointA.y);
  gls.setAttribute("x2",pointB.x);
  gls.setAttribute("y2",pointB.y);
  gls.setAttribute("x3",pointC.x);
  gls.setAttribute("y3",pointC.y);
  gls.setAttribute("x4",pointD.x);
  gls.setAttribute("y4",pointD.y);
  gls.setAttribute("x5",pointE.x);
  gls.setAttribute("y5",pointE.y);


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


/**
 * Draw pentagon frame (non-mitred)
 * 
 * @param id		String id
 * @param x			decimal x coordinate of containing rectangle
 * @param y			decimal y coordinate of containing rectangle
 * @param w			decimal width 
 * @param h			decimal height of long side
 * @param hs		decimal height of short side
 * @param f			decimal frame thickness
 * @param sillThk	decimal sill thickness
 * @param color		String web color code
 * @param type		String T=top, B=bottom
 * @return
 */
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

/**
 * Draw pentagon frame (mitred)
 * 
 * @param id		String id
 * @param x			decimal x coordinate of containing rectangle
 * @param y			decimal y coordinate of containing rectangle
 * @param w			decimal width 
 * @param h			decimal height of long side
 * @param hs		decimal height of short side
 * @param f			decimal frame thickness
 * @param color		String web color code
 * @param type		String T=top, B=bottom
 * @return
 */

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




















/**
 * Draw octagon glass
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
		gls.setAttribute("shape","octagon");
		if(g("f_imgType")=="U1" )
	{
		gls.getStyle().setProperty("fill-opacity","0","");
	}
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
		t.setAttribute("x",point5.x-inchesToMM(4));
		t.setAttribute("y",point5.y-inchesToMM(4));
	}

	gls.setAttribute("x1",point1.x);
  gls.setAttribute("y1",point1.y);
  gls.setAttribute("x2",point2.x);
  gls.setAttribute("y2",point2.y);
  gls.setAttribute("x3",point3.x);
  gls.setAttribute("y3",point3.y);
  gls.setAttribute("x4",point4.x);
  gls.setAttribute("y4",point4.y);
  gls.setAttribute("x5",point5.x);
  gls.setAttribute("y5",point5.y);
  gls.setAttribute("x6",point6.x);
  gls.setAttribute("y6",point6.y);
  gls.setAttribute("x7",point7.x);
  gls.setAttribute("y7",point7.y);
  gls.setAttribute("x8",point8.x);
  gls.setAttribute("y8",point8.y);


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


/**
 * Draw octagon frame
 * 
 * @param id		String id
 * @param x			decimal x coordinate of containing rectangle
 * @param y			decimal y coordinate of containing rectangle
 * @param d			decimal diameter/width 
 * @param f			decimal frame thickness
 * @param color		String web color code
 * @return
 */
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

function initGlassOctagonExt(id,sashId,x, y, w, h, f /*inset*/, v /*hidden glass inset*/)
{
try
{
trace("initGlassOctagonExt('"+id+"','"+sashId+"',"+x+","+ y+","+ w+","+ h+","+ f+","+ v+")");
	var grp = drawing.getElementById(id);
	var idPrefix = g("f_idprefix");
	var s;
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
		gls.setAttribute("shape","octagonext");
		if(g("f_imgType")=="U1" )
	{
		gls.getStyle().setProperty("fill-opacity","0","");
	}
		grp.appendChild(gls);
	}
	
	var sw = (w-(2*f))*.414211;
	var sh = (h-(2*f));
	var sd = Math.sqrt(Math.pow(sw,2)/2);
	
	
	insetXY = Math.tan(Math.PI/8)*f;
	
	var point1 = new Point(x+f+sd+insetXY, y+f);
	var point2 = new Point(x+f+sd+sw-insetXY, y+f);
	var point3 = new Point(x+f+sd+sw+sd, y+f+sd+insetXY);
	var point4 = new Point(x+f+sd+sw+sd, y+sh+f-sd-insetXY);
	var point5 = new Point(x+f+sd+sw-insetXY, y+sh+f);
	var point6 = new Point(x+f+sd+insetXY, y+sh+f);
	var point7 = new Point(x+f, y+sh+f-sd-insetXY);
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
	gls.setAttribute("x1",point1.x);
  gls.setAttribute("y1",point1.y);
  gls.setAttribute("x2",point2.x);
  gls.setAttribute("y2",point2.y);
  gls.setAttribute("x3",point3.x);
  gls.setAttribute("y3",point3.y);
  gls.setAttribute("x4",point4.x);
  gls.setAttribute("y4",point4.y);
  gls.setAttribute("x5",point5.x);
  gls.setAttribute("y5",point5.y);
  gls.setAttribute("x6",point6.x);
  gls.setAttribute("y6",point6.y);
  gls.setAttribute("x7",point7.x);
  gls.setAttribute("y7",point7.y);
  gls.setAttribute("x8",point8.x);
  gls.setAttribute("y8",point8.y);

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
		t.setAttribute("x",point5.x-inchesToMM(4));
		t.setAttribute("y",point5.y-inchesToMM(4));
	}


	if(g("f_tn")!="true")
	{
		var desc = "WIDTH: %SW% x HEIGHT: %SH% ... VISIBLE: %DV%.";
		desc = desc.replace(/%SW%/g,getDim(sw-f));
		desc = desc.replace(/%SH%/g,getDim(sh-f));
		desc = desc.replace(/%DV%/g,getDim(sw-f-v));
		createDescription(id+"_pane",desc);
	}
}	
catch(e)
{
	alertUser("Exception: initGlassOctagonExt('"+id+"','"+sashId+"',"+x+","+ y+","+ w +","+ h +","+ f+","+ v+")");

	alertUser(e);
	trace(e);
}	
} 



function initMitredOctagonFrameExt(id, x, y, w, h, f, color)
{
try
{
trace("initMitredOctagonFrameExt('"+id+"',"+x+","+ y+","+ w +","+ h +","+ f+",'"+ color+"')");

	var desc = "";
	// frame group
	var grp = drawing.getElementById(id);
	var s;
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
	
	var sw = w*.414211;
	var sh = h;
//	var sh = h*.414211;
	var sd = Math.sqrt(Math.pow(sw,2)/2);
	insetXY = Math.tan(Math.PI/8)*f;
	trace("insetXY="+insetXY);
	
		
	var point1a = new Point(x+sd, y);
	var point2a = new Point(x+sd+sw, y);
	var point3a = new Point(x+sd+sw+sd, y+sd);
	var point4a = new Point(x+sd+sw+sd, y+sh-sd);
	var point5a = new Point(x+sd+sw, y+sh);
	var point6a = new Point(x+sd, y+sh);
	var point7a = new Point(x, y+sh-sd);
	var point8a = new Point(x, sd);

	var point1b = new Point(x+sd+insetXY, y+f);
	var point2b = new Point(x+sd+sw-insetXY, y+f);
	var point3b = new Point(x+sd+sw+sd-f, y+sd+insetXY);
	var point4b = new Point(x+sd+sw+sd-f, y+sh-sd-insetXY);
	var point5b = new Point(x+sd+sw-insetXY, y+sh-f);
	var point6b = new Point(x+sd+insetXY, y+sh-f);
	var point7b = new Point(x+f, y+sh-sd-insetXY);
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
			createDescription(id+"_"+ix, "FRAME SEGMENT... base LENGTH: " + getDim(sw)  + "  THICKNESS: " + getDim(f) + "   MITRE: 67.5 degrees.");
		}
	}

}	
catch(e)
{
	alertUser("Exception:  initMitredOctagonFrameExt('"+id+"',"+x+","+ y+","+ w +","+ h +","+ f+",'"+ color+"')");
	alertUser(e);
	trace(e);
}	
} 


function initGlassHexagon(id,sashId,x, y, w, f /*inset*/, v /*hidden glass inset*/)
{
try
{
trace("initGlassHexaon('"+id+"','"+sashId+"',"+x+","+ y+","+ w+","+ f+","+ v+")");
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
//		gls.setAttribute("height",d);
    gls.setAttribute("shape","hexagon");
		if(g("f_imgType")=="U1" )
	{
		gls.getStyle().setProperty("fill-opacity","0","");
	}
		
		grp.appendChild(gls);
	}
	
//	var s = (d-(2*f))*.414211;
//	var sd = Math.sqrt(Math.pow(s,2)/2);
	var width = w;
	var legHeight = (width/2);
	var height = (legHeight*(Math.sqrt(3)));	
	gls.setAttribute("height",height);
trace("height =" +g("height"));
	var vh = ((legHeight/2)*(Math.sqrt(3)));
	var halfleg = (legHeight/2);
	insetXY = Math.tan(Math.PI/6)*f;
	
	var point1 = new Point(halfleg+insetXY, insetXY);
	var point2 = new Point(halfleg+legHeight-insetXY, insetXY);
	var point3 = new Point(width-insetXY, vh);
	var point4 = new Point(halfleg+legHeight-insetXY, height-insetXY);
	var point5 = new Point(halfleg+insetXY, height-insetXY);
	var point6 = new Point(insetXY, vh);
	
	path = 
		"M " +	point1.x + "," + point1.y + 
		" L "+  point2.x + "," + point2.y + 
		" L "+  point3.x + "," + point3.y + 
		" L "+  point4.x + "," + point4.y + 
		" L "+  point5.x + "," + point5.y + 
		" L "+  point6.x + "," + point6.y + 
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

		t.setAttribute("x",point4.x-inchesToMM(4));
		t.setAttribute("y",point4.y-inchesToMM(4));
	}
	gls.setAttribute("x1",point1.x);
  gls.setAttribute("y1",point1.y);
  gls.setAttribute("x2",point2.x);
  gls.setAttribute("y2",point2.y);
  gls.setAttribute("x3",point3.x);
  gls.setAttribute("y3",point3.y);
  gls.setAttribute("x4",point4.x);
  gls.setAttribute("y4",point4.y);
  gls.setAttribute("x5",point5.x);
  gls.setAttribute("y5",point5.y);
  gls.setAttribute("x6",point6.x);
  gls.setAttribute("y6",point6.y);
 

	if(g("f_tn")!="true")
	{
		var desc = "WIDTH: %D% HEIGHT: %H% VISIBLE: %DV%.";
		desc = desc.replace(/%D%/g,getDim(w-f));
		desc = desc.replace(/%H%/g,getDim(height));
		desc = desc.replace(/%DV%/g,getDim(w-f-v));
		createDescription(id+"_pane",desc);
	}
}	
catch(e)
{
	alertUser("Exception: initGlassHexagon('"+id+"','"+sashId+"',"+x+","+ y+","+ w +","+ f+","+ v+")");

	alertUser(e);
	trace(e);
}	
} 



function initMitredHexagonFrame(id, x, y, w, f, color)
{
try
{
trace("initMitredHexagonFrame('"+id+"',"+x+","+ y+","+ w +","+ f+",'"+ color+"')");

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
	

	var legHeight = (w/2);
	trace("legHeight="+legHeight);
	var height = (legHeight*(Math.sqrt(3)));	
	trace("height="+height);
	var vh = ((legHeight/2)*(Math.sqrt(3)));
	trace("vh="+vh);
	var halfleg = (legHeight/2);
	trace("halfleg="+halfleg);
	insetXY = Math.tan(Math.PI/6)*f;
	trace("insetXY="+insetXY);
	
	
	var point1a = new Point(halfleg, y);
	var point2a = new Point(halfleg+legHeight, y);
	var point3a = new Point(w, vh);
	var point4a = new Point(halfleg+legHeight, height);
	var point5a = new Point(halfleg, height);
	var point6a = new Point(x, vh);

	var point1b = new Point(halfleg+insetXY, f);
	var point2b = new Point(halfleg+legHeight-insetXY, f);
	var point3b = new Point(w-f, vh);
	var point4b = new Point(halfleg+legHeight-insetXY, height-f);
	var point5b = new Point(halfleg+insetXY, height-f);
	var point6b = new Point(f, vh);


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
		" L "+  point1a.x + "," + point1a.y + 
		" L "+  point1b.x + "," + point1b.y + 
		" L "+  point6b.x + "," + point6b.y + 
		" L "+  point6a.x + "," + point6a.y;
	side6.setAttribute("d",path);
	side6.getStyle().setProperty("fill",color,"");
	


	var ix=1;
	if(g("f_tn")!="true")
	{
		for(;ix<=6;ix++)
		{
			createDescription(id+"_"+ix, "FRAME SEGMENT... base LENGTH: " + getDim(s)  + "  THICKNESS: " + getDim(f) + "   MITRE: 60 degrees.");
		}
	}

}	
catch(e)
{
	alertUser("Exception:  initMitredHexagonFrame('"+id+"',"+x+","+ y+","+ w +","+ f+",'"+ color+"')");
	alertUser(e);
	trace(e);
}	
} 




function initGlassHexagonExt(id,sashId,x, y, w, h, f /*inset*/, v /*hidden glass inset*/)
{
try
{
trace("initGlassHexaonExt('"+id+"','"+sashId+"',"+x+","+ y+","+ w+","+ h+","+ f+","+ v+")");
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
		gls.setAttribute("shape","hexagonext");
		if(g("f_imgType")=="U1" )
	{
		gls.getStyle().setProperty("fill-opacity","0","");
	}
		
		grp.appendChild(gls);
	}
	
//	var s = (d-(2*f))*.414211;
//	var sd = Math.sqrt(Math.pow(s,2)/2);
	var width = w;
	var legHeight = (h/(Math.sqrt(3)));
trace ("legHeight="+legHeight);
//	var height = (legHeight*(Math.sqrt(3)));	
//trace("height =" +g("height"));
	var vh = (h/2);
	var halfleg = (legHeight/2);
trace ("halfleg="+halfleg);
	insetXY = Math.tan(Math.PI/6)*f;
trace ("insetXY="+insetXY);
	var longLeg = (w-legHeight);
trace ("longLeg=" +longLeg);
	
	var point1 = new Point(halfleg+insetXY, insetXY);
	var point2 = new Point(halfleg+longLeg-insetXY, insetXY);
	var point3 = new Point(width-insetXY, vh);
	var point4 = new Point(halfleg+longLeg-insetXY, h-insetXY);
	var point5 = new Point(halfleg+insetXY, h-insetXY);
	var point6 = new Point(insetXY, vh);
	
	path = 
		"M " +	point1.x + "," + point1.y + 
		" L "+  point2.x + "," + point2.y + 
		" L "+  point3.x + "," + point3.y + 
		" L "+  point4.x + "," + point4.y + 
		" L "+  point5.x + "," + point5.y + 
		" L "+  point6.x + "," + point6.y + 
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
		t.setAttribute("x",point4.x-inchesToMM(4));
		t.setAttribute("y",point4.y-inchesToMM(4));
	}

	gls.setAttribute("x1",point1.x);
  gls.setAttribute("y1",point1.y);
  gls.setAttribute("x2",point2.x);
  gls.setAttribute("y2",point2.y);
  gls.setAttribute("x3",point3.x);
  gls.setAttribute("y3",point3.y);
  gls.setAttribute("x4",point4.x);
  gls.setAttribute("y4",point4.y);
  gls.setAttribute("x5",point5.x);
  gls.setAttribute("y5",point5.y);
  gls.setAttribute("x6",point6.x);
  gls.setAttribute("y6",point6.y);
 

	if(g("f_tn")!="true")
	{
		var desc = "WIDTH: %D% HEIGHT: %H% VISIBLE: %DV%.";
		desc = desc.replace(/%D%/g,getDim(w-f));
		desc = desc.replace(/%H%/g,getDim(h));
		desc = desc.replace(/%DV%/g,getDim(w-f-v));
		createDescription(id+"_pane",desc);
	}
}	
catch(e)
{
	alertUser("Exception: initGlassHexagonExt('"+id+"','"+sashId+"',"+x+","+ y+","+ w +","+ h +","+ f+","+ v+")");

	alertUser(e);
	trace(e);
}	
} 



function initMitredHexagonFrameExt(id, x, y, w, h, f, color)
{
try
{
trace("initMitredHexagonFrameExt('"+id+"',"+x+","+ y+","+ w +","+ h +","+ f+",'"+ color+"')");

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
	


	var width = w;
	var legHeight = (h/(Math.sqrt(3)));
trace ("legHeight="+legHeight);
//	var height = (legHeight*(Math.sqrt(3)));	
//trace("height =" +g("height"));
	var vh = (h/2);
	var halfleg = (legHeight/2);
trace ("halfleg="+halfleg);
	insetXY = Math.tan(Math.PI/6)*f;
trace ("insetXY="+insetXY);
	var longLeg = (w-legHeight);
trace ("longLeg=" +longLeg);	
	
	var point1a = new Point(halfleg, y);
	var point2a = new Point(halfleg+longLeg, y);
	var point3a = new Point(w, vh);
	var point4a = new Point(halfleg+longLeg, h);
	var point5a = new Point(halfleg, h);
	var point6a = new Point(x, vh);

	var point1b = new Point(halfleg+insetXY, f);
	var point2b = new Point(halfleg+longLeg-insetXY, f);
	var point3b = new Point(w-f, vh);
	var point4b = new Point(halfleg+longLeg-insetXY, h-f);
	var point5b = new Point(halfleg+insetXY, h-f);
	var point6b = new Point(f, vh);


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
		" L "+  point1a.x + "," + point1a.y + 
		" L "+  point1b.x + "," + point1b.y + 
		" L "+  point6b.x + "," + point6b.y + 
		" L "+  point6a.x + "," + point6a.y;
	side6.setAttribute("d",path);
	side6.getStyle().setProperty("fill",color,"");
	


	var ix=1;
	if(g("f_tn")!="true")
	{
		for(;ix<=6;ix++)
		{
			createDescription(id+"_"+ix, "FRAME SEGMENT... base LENGTH: " + getDim(s)  + "  THICKNESS: " + getDim(f) + "   MITRE: 60 degrees.");
		}
	}

}	
catch(e)
{
	alertUser("Exception:  initMitredHexagonFrameExt('"+id+"',"+x+","+ y+","+ w +","+ h +","+ f+",'"+ color+"')");
	alertUser(e);
	trace(e);
}	
} 

