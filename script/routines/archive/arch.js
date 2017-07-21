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

function computeHorzOffset(w,h,inset)
{
		computeCircleCenter(0,h,(w/2),0,w,h);
		
		var adj =  (w/2) - Math.sqrt(Math.pow(R,2) - Math.pow(Yo-h+inset,2));
		
		return Math.abs(adj);
}

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

function initGlassArchCircularSeg(id,idFrame, pLT, pRT, pLB, pRB, pC, r, inset)
{
// segType: F=full, L=left half, R=right half
try
{
trace("initGlassArchCircularSeg'"+id+"',("+pLT.x+","+ pLT.y+"),("+pRT.x+","+ pRT.y+"),("+pLB.x+","+ pLB.y+"),("+pRB.x+","+ pRB.y+"),("+pC.x+","+ pC.y+"),"+ r+","+ inset+")");

	var x = pLT.x;
	var y = Math.min(pLT.y,pRT.y);
	var w = pRT.x-pLT.x;
	var h = pRB.y-y;
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
	var appendGrp = false;
	var idPrefix = g("f_idprefix");
	if(grp === null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id);
		appendGrp = true;
		// drawing.getElementById("window").appendChild(grp);
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
		gls.setAttribute("y",(segType == "F" ? pC.y - r : y);
		gls.setAttribute("width",w);
		gls.setAttribute("height",
			(segType == "F" ? iLB.y - (pC.y - r)
							: iLB.y - Math.min(iLT.y,iRT.y)));
		
		
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
		t.setAttribute("x",x+w-2);
		t.setAttribute("y",y+h-2);
	}


		try
		{
			trace("d="+d);
			gls.setAttribute("d",d);
		}
		catch(e){alert(id + "_arch d="+d);}
		createDescription2(gls , "Arch WIDTH: " + getDim(w) +"  HEIGHT: " + getDim(h) + "  HEIGHT LEGS: " + getDim(hLegs) +  "  RADIUS: "+getDim(r)+".");

		if(appendGrp == true)
		{
		 	drawing.getElementById("window").appendChild(grp);
		}

}	
catch(e)
{
	alertUser("Exception:  initGlassArchCircularSeg'"+id+"',("+pLT.x+","+ pLT.y+"),("+pRT.x+","+ pRT.y+"),("+pLB.x+","+ pLB.y+"),("+pRB.x+","+ pRB.y+"',("+pC.x+","+ pC.y+"),"+ r+","+ inset+")");
	alertUser(e);
	trace(e);
}
}

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
	var appendGrp = false;
	if(grp === null)
	{
		grp = drawing.createElementNS(svgNS,"g");
		grp.setAttribute("id",id);
		appendGrp = true;
		// drawing.getElementById("window").appendChild(grp);
	}
	var hLegs = pLB.y - Math.max(pLT.y,pRT.y);
	
	var iLT,iRT,iLB,iRB;
	


	var d = null;
	var dSill = null;
	var dLeft = null;
	var dRight = null;
	
	var	rInner = r - inset;
	trace("rInner="+rInner);	
	if(hLegs === 0)
	{
		switch(segType)
		{
			case "F":
				iLT = new Point( pC.x - Math.sqrt(Math.pow(rInner,2)-Math.pow(pC.y-(pLT.y-inset),2)),
								pLT.y - inset);
				iRT = new Point(pC.x + Math.sqrt(Math.pow(rInner,2)-Math.pow(pC.y-(pRT.y-inset),2)),
								pLT.y - inset);	
				
			
				d =  "M " + pLT.x + "," + pLT.y + " A " + r+","+r+" 0 0,1 " +pRT.x+","+pRT.y +
					" L " + iRT.x+","+iRT.y +
					" A "+rInner+","+rInner+" 180 0,0 "+ iLT.x+","+iLT.y +
					" L " + pLT.x +","+ pLT.y;
				dSill = "M " +pLT.x+","+pLT.y +
						" L " + pRT.x+","+pRT.y +
						" L " + iRT.x+","+iRT.y +
						" L " + iLT.x+","+iLT.y +
						" L " +pLT.x+"," +pLT.y;	
						
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
		createDescription2(arch, "ARCH WIDTH: " + getDim(w) + "    LENGTH: " +getDim(archCircumference)+"  OUTER RADIUS: "+getDim(r)+".");


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
			createDescription2(bottomRail, "SILL WIDTH: " + getDim(pLB.x-pLT.x) + "  THICKNESS: "+getDim(inset)+".");
			
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
			createDescription2(leftRail, "LEFT RAIL LENGTH: " + getDim(pLB.y-pLT.y) + "  THICKNESS: "+getDim(inset)+".");
			
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
			createDescription2(rightRail, "RIGHT RAIL LENGTH: " + getDim(pRB.y-pRT.y) + "  THICKNESS: "+getDim(inset)+".");
		}
		
		if(appendGrp == true)
		{
		 	drawing.getElementById("window").appendChild(grp);
		}

}	
catch(e)
{
	alertUser("Exception:  initArchCircularSeg'"+id+"',("+pLT.x+","+ pLT.y+"),("+pRT.x+","+ pRT.y+"),("+pLB.x+","+ pLB.y+"),("+pRB.x+","+ pRB.y+"',("+pC.x+","+ pC.y+"),"+ r+","+ inset+",'"+ color+"')");
	alertUser(e);
	trace(e);
}
}

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
		createDescription2(arch, "ARCH WIDTH: " + getDim(w) + "    LENGTH: " +getDim(archCircumference)+"  OUTER RADIUS: "+getDim(r)+".");


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
			createDescription2(bottomRail, "SILL WIDTH: " + getDim(pLB.x-pLT.x) + "  THICKNESS: "+getDim(sill)+".");
			
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
			createDescription2(leftRail, "LEFT RAIL LENGTH: " + getDim(pLB.y-pLT.y) + "  THICKNESS: "+getDim(inset)+".");
			
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
			createDescription2(rightRail, "RIGHT RAIL LENGTH: " + getDim(pRB.y-pRT.y) + "  THICKNESS: "+getDim(inset)+".");
		}
	

}	
catch(e)
{
	alertUser("Exception: initArchCircularSegWithSill'"+id+"',("+pLT.x+","+ pLT.y+"),("+pRT.x+","+ pRT.y+"),("+pLB.x+","+ pLB.y+"),("+pRB.x+","+ pRB.y+"',("+pC.x+","+ pC.y+"),"+ r+","+ inset+","+ sill+",'"+ color+"')");
	alertUser(e);
	trace(e);
}
}

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
		createDescription2(gls, "GLASS ... base WIDTH: " + getDim(w-inset)  +"  HEIGHT: " + getDim(h-inset) + ".");
	}
	

}	
catch(e)
{
	alertUser("Exception: initGlass3CentredArch('"+id+"','"+idFrame+"',"+xParm+","+ yParm+","+ wParm+","+ hParm+","+ hlegParm+","+ inset+",'"+segType+"'");

	alertUser(e);
	trace(e);
}	
}

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
		createDescription2(sideRail2, "FRAME ... base WIDTH: " + getDim(w)  +"  HEIGHT: " + getDim(h) + ".");
	}
	

}	
catch(e)
{
	alertUser("Exception: initFrame3CentredArch('"+id+","+xParm+","+ yParm+","+ wParm+","+ hParm+","+ hlegParm+","+ inset+",'"+color+"','"+segType+"')");

	alertUser(e);
	trace(e);
}	
}

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
		createDescription2(siderail2, "FRAME ... base WIDTH: " + getDim(w)  +"  HEIGHT: " + getDim(h) + ".");
	}
	

}	
catch(e)
{
	alertUser("Exception: 	initFrame3CentredArchWithSill('"+id+"',"+xParm+","+ yParm+","+ wParm+","+ hParm+","+ hlegParm+","+ inset+","+ sillThk+",'"+color+"','"+segType+"')");

	alertUser(e);
	trace(e);
}	
}

