importClass(Packages.org.w3c.dom.Document);
importClass(Packages.org.w3c.dom.Element);
importClass(Packages.org.w3c.dom.Node);
importClass(Packages.org.w3c.dom.NodeList);
importClass(Packages.org.w3c.dom.events.DocumentEvent);
importClass(java.lang.System);
importClass(java.util.HashMap);
var svgNS = "http://www.w3.org/2000/svg";
var xlinkNS = "http://www.w3.org/1999/xlink";

var drawing = null;
var globalMap = new java.util.HashMap(47);
var applet = null;
var debug = false;
var um = "in";
var umDisplay = "in16";
var nested = false;
var tn = false;


/**
 * @private
 * Initializes the SVG document.
 * It adjusts the viewBox to be proportional with
 * the width and height of the drawing.
 * If width or height are zero, it will call a
 * user-defined function, calculateDimensions() to
 * provide width and height in the variable container.
 * It looks for a variable name "doc_padding" to define
 * the padding around the drawn object.  If not specified,
 * the padding defaults to 12 inches (or equivalent mm).
 * It also initializes the command interface which 
 * enables java code to call javascript functions. 
 * @return
 */
function initDoc()
{
try{
debug = g("f_debug") == "true";
trace("initDoc()");
	um = g("f_um");
	if(um===null)
	{
		um = "in";
	}

nested = g("f_nested") == "true";


var w = gN("width");
var h = gN("height");


if(w === 0 || h === 0)
{
	try
	{
		calculateDimensions();
	}
	catch(notfound){}
	w = gN("width");
	h = gN("height");
}
if(w == 0)
{
	w = gN("f_width");
}
if(h == 0)
{
	h = gN("f_height");
}
var p = nested ? 0: inchesToMM(12);

var wPage = g("f_docWidth");
var hPage = g("f_docHeight");
var fixedSize = g("f_fixedSize") == "true";	


if(w == 0)
	w = 120;
if(h == 0)
	h = 96;

	var docWidthPX = s("docWidthPX",wPage);
	var docHeightPX = s("docHeightPX",hPage);
	var docWidthUM = s("docWidthUM", w);
	var docHeightUM = s("docHeightUM", h);
	
	tn = s("f_tn",(docWidthPX <= 120 && docHeightPX <= 120)?"true":"false") == "true";

	var doc = drawing.getDocumentElement();
	doc.setAttribute("viewBox",(nested ? "-.0625 -.0625 "+ (w+.125) + " " + (h+.125) :"-"+p+" -"+p+" "+ (w+(2*p)) + " " + (h+(2*p))));
	
	if(fixedSize)
	{
		doc.setAttribute("width",wPage+"px");
		doc.setAttribute("height",hPage+"px");
	}
	else
	{
		if(((h+p)/hPage) < ((w+p)/wPage))
		{
			var docH = wPage*((h+p)/(w+p));
			doc.setAttribute("width",wPage+"px");
			doc.setAttribute("height",docH+"px");
		}
		else
		{
			var docW = hPage*((w+p)/(h+p));
			doc.setAttribute("width",docW+"px");
			doc.setAttribute("height",hPage+"px");
		}
	}
	var winGrp = drawing.getElementById("window");
	if(winGrp == null)
	{
		winGrp = drawing.createElementNS(svgNS,"g");
		winGrp.setAttribute("id","window");
		drawing.getDocumentElement().appendChild(winGrp);
	}

	umDisplay = g("f_umDisplay");
	if(umDisplay===null)
	{
		if(um=="in")
		{
			umDisplay = "in16";
		}
		else
		{
			umDisplay = "mm";
		}
	}
	roundingFactor = gN("f_roundingFactor");
	if(roundingFactor === 0)
	{
		roundingFactor = 5;
	}
	
	if(g("f_applet") == "true")
	{

		drawing.getElementById("window").setAttribute("onmousemove","showCoords(evt)");
	}
	
	trace("calling initCommandInterface()");
	initCommandInterface();
	trace("returning from initCommandInterface()");
	
	if(applet)
	{
			applet.registerLite(g("f_idprefix")+"this","0","0",w+"",h+"",null);
			applet.setUnitOfMeasure(umDisplay);
	}
	
}	
catch(e)
{
	alertUser("Exception:  initDoc()");
	alertUser(e);
	trace(e);
}		
} 

function showCoords(evt)
{
	var x,y;
	if(applet != null)
	{
		x = getDim(getX(evt));
		y = getDim(getY(evt));
		
		applet.callExternalJS("displayStatus","X="+x+"  Y="+y,null,null,null);
	}
}
/**
 * Convert inches to millimeters.
 * @param i decimal inches
 * @return	decimal millimeters
 */
function inchesToMM(i)
{
trace("inchesToMM(" + i + ")");
	if(um !== "mm")
		return i;
		
	return Math.round(i*25.4);
}

/**
 * @private
 * Creates a mechanism that enables java to
 * call into the javascript.
 * 
 * @return void
 */
function initCommandInterface()
{
try{
	var text = drawing.getElementById("java2jsDummyText");
                                       
	if(text == null)
	{
  		text= drawing.createElementNS(svgNS,"text");
		text.setAttribute("id","java2jsDummyText");
   		text.setAttribute("x", "0");
  		text.setAttribute("y", "0");
  		text.setAttribute("visibility", "hidden");

		// Create separate cmd element because we don't want
		// setting the cmd to prematurely trigger it's own execution.
		// I.e. we can better control the timing.
		var cmd= drawing.createElementNS(svgNS,"text");
		cmd.setAttribute("id","java2jsCommand");
   		cmd.setAttribute("x", "0");
  		cmd.setAttribute("y", "0");
  		cmd.setAttribute("visibility", "hidden");
		var cmdContent = drawing.createTextNode(";");
		cmd.appendChild(cmdContent);
  
  		var svgRoot = drawing.getDocumentElement();
  		svgRoot.appendChild(text);
 		svgRoot.appendChild(cmd);
  
		text.addEventListener("DOMCharacterDataModified", executeCmd, false); 
	}
	
}
catch(e)
{
	alertUser("Exception thrown: initCommandInterface()");
	alertUser(e);
	
}

} 

/**
 * Externally (from java) execute javascript commands. 
 * @return
 */
function executeCmd()
{
var cmdScript=getText("java2jsCommand");
trace("executeCmd("+cmdScript+")");
try{
if(cmdScript == "align()")
{
  debug=true;
  align();
  debug=false;
}
else
{
	eval(cmdScript+";");
	trace("eval completed");
}
}
catch(e)
{
	trace("Exception thrown: executeCmd(" + cmdScript + ")");
	trace(e);
	
}
}

/**
 * Get a value from the variable container.
 * 
 * @param id String name of variable.
 * @return String value of variable or null if not found.
 */


function g(id)
{
	if(applet != null)
	{
		return applet.getVar(id);
	}

	var s = globalMap.get(id);
	return s !== null? s+"":null;
	
}	

/**
 * Get a numeric value from the variable container.
 * Same as g() except it will always coerce the value
 * to a number.  If the value is not a number, or it's not
 * found in the container, it returns 0.
 * @param id String name of variable.
 * @return decimal
 */
function gN(id)
{
	var n;
	if(applet != null)
	{
		n = applet.getVar(id);
	}
	else
	{
		n = globalMap.get(id);
	}
	if(n === null || isNaN(n))
		return 0
	return n-0;
}	

/**
 * Set a value in the variable container.
 *  
 * @param id  String name of variable
 * @param value  untyped value to assign.
 * @return untyped value assigned
 */
function s(id,value)
{

	if(applet)
	{
		applet.setVar(id,value);
	}
	else
	if(value !== null)
	{
		globalMap.put(id, new java.lang.String(value));
		trace("set('"+id+"','"+value+"')");
		
	}
	
	return value;
}
/**
 * Initializes a value in the variable container, and the original
 * value container.  Not the same as s(...) because it doesn't 
 * update the original value container.  The system compares
 * the original value with the current value to determine if
 * a configuration value should be updated.
 * $initialize generates the code to initialize each of the
 * drawing variables.
 * 
 * @param id String name of variable.
 * @param value
 * @return
 */
function init(id,value)
{

	if(applet)
	{
		applet.initVar(id,value);
	}
	else
	if(value !== null)
	{
		globalMap.put(id,value); // new java.lang.String(value));
		trace("init('"+id+"','"+value+"')");
	}
	
	return value;
}

/**
 * Write text to systemOut.log (i.e. java console in applet).
 * Use this function for debugging your scripts.
 * 
 * @param text
 * @return void
 */
function trace(text)
{
	if(debug == false) return;
	if(applet != null)
		applet.log(text);
	else
		System.out.println(text);
}

/**
 * Display text to the user.
 * @param text
 * @return void
 */
function alertUser(text)
{
	alert(text);
}

/**
 * Remove leading and trailing whitespace for a String.
 * 
 * @param input String to be trimmed.
 * @return
 */
function trim(input)
{
	var s = new java.lang.String(input);
	return s.trim();
}

var dragObj = null;
var dragOffset = null;
var dragType = null;
/**
 * Start dragging a vertical grille element
 * @param evt Event
 * @return void
 */
function startDragX(evt)
{
	if(applet==null)
		return;
	
	var rightClick =  (evt.which && evt.which == 3)
						||
						(evt.button && evt.button == 2);

	var el = evt.getTarget();
	dragObj = el;
	dragOffset = getX(evt) - el.getAttribute("x");  
	dragType = "X";
	
		applet.startDragX(el.id,"");

}

/**
 * Start dragging a horizontal grille element.
 * @param evt Event
 * @return void
 */
function startDragY(evt)
{
	if(applet==null)
		return;

	var rightClick =  (evt.which && evt.which == 3)
						||
						(evt.button && evt.button == 2);
	
	
	
	
	var el = evt.getTarget();
	dragObj = el;
	dragOffset = getY(evt) - el.getAttribute("y");  
	dragType = "Y";
	
	
//	if(rightClick)
//	{
//		deleteGrid(evt);
//	}
//	else
//	{
	//	applet.startDragY(el.id,evt.altKey?"copy":"");
		applet.startDragY(el.id,"");
//	}
}

/**
 * Drag and move a grille element.
 * @param evt Event
 * @return void
 */
function drag(evt)
{
	
	if(dragObj == null)
		return;
		

		
	switch(dragType)
	{
		case 'X':
			dragObj.setAttribute("x",getX(evt)-dragOffset);
			applet.dragX(dragObj.id);
			break;
		case 'Y':
			dragObj.setAttribute("y",getY(evt)-dragOffset);
			applet.dragY(dragObj.id);
			break;
		default: break;
	}
}


/**
 * Drop a grille element.
 * @param evt Event
 * @return void
 */
function drop(evt)
{

	if(dragObj == null)
		return;
		


	switch(dragType)
	{
		case 'X':
			dragObj.setAttribute("x",getX(evt)-dragOffset);
			applet.dropX(dragObj.id);
			break;
		case 'Y':
			dragObj.setAttribute("y",getY(evt)-dragOffset);
			applet.dropY(dragObj.id);
			break;
		default: break;
	}
	showDescLater(evt,dragObj.id);
		
	dragObj =  null;
	dragOffset = 0;
	dragType = "";	
}

/**
 * Terminate a dragging operation.
 * @param evt Event
 * @return void
 */
function endDrag(evt)
{

	if(dragObj == null)
		return;
		

	var el = evt.getTarget();
	dragObj =  null;
	dragOffset = 0;
	dragType = "";	
	
	if(applet != null)
		applet.endDrag();
		
	showDescLater(evt,el.id);
		
}

/**
 * @deprecated
 * Delete a grille element.
 * @param evt Event
 * @return void
 */
function deleteGrid(evt)
{
	if(dragObj == null)
		return;
	if(applet == null)
		return;
		


	switch(dragType)
	{
		case 'X':
			if(confirm("Delete " + dragObj.id + "?")==true)
			{
				applet.deleteX(dragObj.id);
			}
			break;
		case 'Y':
			if(confirm("Delete " + dragObj.id + "?")==true)
			{
				applet.deleteY(dragObj.id);
			}
			break;
		default: break;
	}
	dragObj =  null;
	dragOffset = 0;
	dragType = "";	

}
	
/**
 * Convert #'#-#/#" to decimal inches.
 * @param dimension String
 * @return decimal inches
 */	
function dimToInches(dimension)
{
	if(trim(dimension) == "")
	{
		return 0;
	}
		
	var work = dimension+"";
	
	if(work.indexOf("\"") != -1)
	{
		work = dimension.replace("'","*12 + ");
		work = work.replace("-"," + ");
		work = work.replace("\"", "");
	}
	else
	{
		work = dimension.replace("'","*12");
	}
	try
	{
		var val = eval(work);
		if(val === undefined || isNaN(val))
		{
			return 0;
		}
		return val;
	}
	catch(x)
	{
		return 0;
	}
	
}
	
/**
 * Convert feet,inches, fraction to decimal inches
 * @param feet integer
 * @param inches integer
 * @param frac String fraction expression
 * @return decimal inches
 */		
function dimsToInches(feet, inches, frac)
{
	var result = 0;
	
	if(feet != "")
	{
		result += 12*(feet-0);
	}
	
	if(inches != "")
	{
		result += (inches-0);
	}
	
	if(frac != "")
	{
		try
		{
			var val = eval(frac);
			if(!(val === undefined || isNaN(val)))
				result+=val;
		}
		catch(x)
		{}
	}	
	return result;		

}
	
/**
 * Convert decimal inches to #'#-#/#" or if u/m is mm,
 * return #mm.
 * @param inches
 * @return String dimension expression
 */
function inchesToDim(inches)
{
		
	var inchRemaining = inches%12;
	
	var feet = (inches - inchRemaining)/12;
	
	var fracRemaining = inchRemaining%1;
	var inchInteger = inchRemaining - fracRemaining;
	
	var frac = decToFraction(fracRemaining);
	
	var inch = "";
	
	if(inchInteger > 0 && frac != "")
	{
		inch = inchInteger + "-" + frac + "\"";
	}
	else
	{
		if(inchInteger > 0)
		{
			inch = inchInteger + "\"";
		}
		else
		{
		if(frac != "")
		{
			inch = frac + "\"";
		}
		else
		{
			inch = "0\"";
		}
		}
	}
	return trim((feet == 0?"":feet + "' ") + inch);
}

/**
 * Convert decimal inches to #-#/#
 * @param inches
 * @return
 */
function inchesToInchesDim(inches)
{

	var fracRemaining = inches%1;
	var inchInteger = inches - fracRemaining;
	
	var frac = decToFraction(fracRemaining);
	
	var inch = "";
	
	if(inchInteger > 0 && frac != "")
	{
		inch = inchInteger + "-" + frac + "\"";
	}
	else
	{
		if(inchInteger > 0)
		{
			inch = inchInteger + "\"";
		}
		else
		{
		if(frac != "")
		{
			inch = frac + "\"";
		}
		else
		{
			inch = "";
		}
		}
	}
	
	return trim(inch);
}

/**
 * Convert decimal units (f_um) to the display unit of measure (f_umDisplay).
 * @param inches
 * @return
 */
function getDim(units)
{
	
	if(um === "mm" && umDisplay === "mm")
	{
		return round(units)+"mm";
	}
	
	if(um === "in" && umDisplay === "indec")
	{
		return round(units)+"\"";
	}
	
	if(um === "mm" && umDisplay === "indec")
	{
		return round(units*0.0393700787)+"\"";
	}
	
	if(um === "in" && umDisplay === "mm")
	{
		return round(units*(1/0.0393700787))+"mm";
	}
	// umDisplay must be "in16"
	var inches = um === "mm" ? units*0.0393700787:units;
	if(inches > 60)
	{
		return inchesToDim(inches);  // show feet'
	}
	var fracRemaining = inches%1;
	var inchInteger = inches - fracRemaining;
	
	var frac = decToFraction(fracRemaining);
	
	var inch = "";
	
	if(inchInteger > 0 && frac != "")
	{
		inch = inchInteger + "-" + frac + "\"";
	}
	else
	{
		if(inchInteger > 0)
		{
			inch = inchInteger + "\"";
		}
		else
		{
		if(frac != "")
		{
			inch = frac + "\"";
		}
		else
		{
			inch = "";
		}
		}
	}
	
	return trim(inch);
}




/**
 * Convert a decimal to a fraction expression.
 * @param indec
 * @return String fraction expression (precision = 1/16)
 */
function decToFraction(indec)
{
	var dec = indec % 1;
	if(dec == 0)
	{
		return "";
	}	
	var fracDec = 0;
	var fracs = ["","1/16","1/8","3/16","1/4",   // TODO: support 1/32
					 "5/16","3/8","7/16","1/2",
					 "9/16","5/8","11/16","3/4",
					 "13/16","7/8","15/16","1"];
	var i = fracs.length - 1;
	for(; i >= 0; i--)
	{
		fracDec = eval(fracs[i]);
		if(fracDec <= dec)
		{
			return fracs[i];
		}
	}
	return "";
}

/**
 * Round a decimal number to the specified # of decimals specified by f_roundingFactor
 * @param inDec
 */	
function round(number)
{
  return Math.round(number*(Math.pow(10,roundingFactor)))/Math.pow(10,roundingFactor);
}

/**
 * Round a decimal number to the specified # of decimals.
 * @param inDec
 * @return decimal
 */	
function roundTo(number, decimals)
{
  return Math.round(number*(Math.pow(10,decimals)))/Math.pow(10,decimals);
}


/**
 * Round a decimal number to the nearest 1/16th.
 * @param inDec
 * @return decimal
 */	
function roundToSixteenth(inDec)
{
	var trimVal = inDec % .0625;
	return ((inDec - trimVal)*1000)/1000;
}			


/**
 * Point
 * @constructor
 * @param x decimal
 * @param y decimal
 */

function Point(X,Y)
{
	this.x = X;
	this.y = Y;
}

/**
 * Radial point; x,y,c,a where c=circumference offset,a=angle in radians
 * @constructor
 * @param x decimal
 * @param y decimal
 * @param c decimal circumference offest from beginning of the arc
 * @param a decimal angle(radians)
 */
function RadialPoint(X,Y,C,A)
{
	this.x = X;
	this.y = Y;
	this.c = C;
	this.a = A;
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
		
	
		//case 'P': // Prairie
		//	top = g(gridElName+"t");
		//	if(top == null)
				//s("f_"+gridElName+"t",pattern.charAt(1));
		//	bottom = g(gridElName+"b");
		//	if(bottom == null)
				//s("f_"+gridElName+"b",pattern.charAt(3));
		//	left = g(gridElName+"l");
		//	if(left == null)
				//s("f_"+gridElName+"l",pattern.charAt(5));
		//	right = g(gridElName+"r");
		//	if(right == null)
				//s("f_"+gridElName+"r",pattern.charAt(7));
			//drawPrairieGrid(rectName,gridElName,color,t,false);
			//break;	

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
		
		case 'P': // Prairie Award				
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
 * @private
 * Create a clippattern so any grille pattern can be superimposed
 * over any shape window.  
 * Caveat ... punch points cannot be calculated.
 * 
 * @param idGlass String id of glass pane
 * @return void
 */
function createClipPattern(idGlass)
{

 
    var glass = drawing.getElementById(idGlass);
    if(glass == null)
    {
         return;
    }

	var defsNodeList = drawing.getElementsByTagName("defs");
    var defs = defsNodeList.item(0);
    if(defs == null)
    {
         defs = drawing.createElementNS(svgNS,"defs");
         drawing.getDocumentElement().appendChild(defs);
    }
 	var idPrefix = g("f_idprefix");
     var clipPath = drawing.getElementById(idPrefix+"clip_"+idGlass);
    if(clipPath == null)
    {
         clipPath = drawing.createElementNS(svgNS,"clipPath");
         clipPath.setAttribute("id",idPrefix+"clip_"+idGlass);
         defs.appendChild(clipPath);
    }   
    copyTree(clipPath,glass, idPrefix + "clip_dtl_");

}

/**
 * Copy a DOM tree.
 * 
 * @param parent String ID target parent node
 * @param source String ID source node
 * @param idPrefix String modelset context prefix
 * @return
 */
function copyTree(parent,source,idPrefix)
{
    var target = source.cloneNode(true);

    
    target.setAttribute("id",idPrefix + source.getAttribute("id"));

    parent.appendChild(target);
    
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
			punchX = (nVert*vSep)+inset-(.5*t);
		}
	//	punchX  = roundToSixteenth(punchX);
		punchX = Math.round(punchX*1000)/1000;
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
			punchX = (nLeft*sep)+inset-(.5*t);
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
		if(punchX === 0)
		{
			punchX = w - (nRight*sep)+inset-(.5*t);
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
			punchY = h - (sep*nTop)+inset-(.5*t);
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
			punchY = (sep*nBottom)+inset-(.5*t);
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
 * Create a direction indicator
 * 
 * @param id		String id
 * @param frame		String id of containing glass pane
 * @param direction	char direction code L,R,U,D
 * @return			void
 */
function initDirection(id,frame,direction)
{
try{
	trace("initDirection('"+id+"','"+frame+"','"+direction+"')");
	var eFrame = drawing.getElementById(frame);
	var xOffset = 0;
	var yOffset = 0;
	var inset = inchesToMM(2);
	switch(direction)
	{
		case 'L': xOffset = -inset; break;
		case 'R': xOffset = inset; break;
		case 'U': yOffset = -inset; break;
		case 'D': yOffset = inset; break;
	}
	
	var dirX = 	getN(frame,"x") 
				+ getN(frame,"width")/2
				+ xOffset;
	
	var dirY = 	getN(frame,"y") 
				+ getN(frame,"height")/2
				+ yOffset;

	var e = drawing.getElementById(id);
	if(e == null)
	{
		e = drawing.createElementNS(svgNS,"path");
		e.setAttribute("id",id);
		e.setAttribute("class","direction");
		e.setAttribute("d",drawDirection(direction,dirX,dirY));	
		drawing.getElementById("window").appendChild(e);
	}
	else
	{
		e.setAttribute("d",drawDirection(direction,dirX,dirY));	
	}
}catch(e)
{
	alertUser("Exception:  initDirection('"+id+"','"+frame+"','"+direction+"')");
	alertUser(e);
	trace(e);
}	
}

/**
 * Draw a direction indicator
 * 
 * @param direction	char direction code L,R,U,D
 * @param x			decimal x coordinate
 * @param y			decimal y coordinate
 * @return			void
 */
function drawDirection(direction,x,y)
{
	var inset = inchesToMM(1.25);
	var inseta = inchesToMM(.5);
	var insetb = inchesToMM(1.75);
	var insetc = inchesToMM(3);
	var path = "";
	switch(direction)
	{
		case "D":
			path = "M %X%,%Y% l "+inset+",-"+inset+" l -"+(2*inset)+",0 l "+inset+","+inset+" m -"+inset+",-"+insetc+" l "+(2*inset)+",0 m -"+(2*inset)+",-"+inseta+" l "+(2*inset)+",0 m -"+(2*inset)+",-"+inseta+" l "+(2*inset)+",0";
			break;
		case "U":
			path = "M %X%,%Y% l "+inset+","+inset+" l -"+(2*inset)+",0 l "+inset+",-"+inset+" m -"+inset+","+insetb+" l "+(2*inset)+",0 m -"+(2*inset)+","+inseta+" l "+(2*inset)+",0 m -"+(2*inset)+","+inseta+" l "+(2*inset)+",0";
			break;
		case "L":
			path = "M %X%,%Y% l "+(2*inset)+",-"+inset+" l 0,"+(2*inset)+" l -"+(2*inset)+",-"+inset+" m "+insetc+",-"+inset+" l 0,"+(2*inset)+" m "+inseta+",-"+(2*inset)+" l 0,"+(2*inset)+" m "+inseta+",-"+(2*inset)+" l 0,"+(2*inset)+"";
			break;
		case "R":
			path = "M %X%,%Y% l -"+(2*inset)+",-"+inset+" l 0,"+(2*inset)+" l "+(2*inset)+",-"+inset+" m -"+insetc+",-"+inset+" l 0,"+(2*inset)+" m -"+inseta+",-"+(2*inset)+" l 0,"+(2*inset)+" m -"+inseta+",-"+(2*inset)+" l 0,"+(2*inset)+"";
			break;
	}
	
	path = path.replace(/%X%/g,x); 			
	path = path.replace(/%Y%/g,y); 

	return path;		
}

/**
 * Create a swing direction 
 * 
 * @param id		String id
 * @param frame		String id of containing glass pane
 * @param handing	char handing direction (L,R,U,D)
 * @return			void
 */

function initHanding(id,frame,handing)
{
try{
	trace("initHanding('"+id+"','"+frame+"','"+handing+"')");
	var e = drawing.getElementById(id);

	var frame_x = getN(frame,"x");
	var frame_y = getN(frame,"y");
	var frame_h = getN(frame,"height");
	var frame_w = getN(frame,"width");


	if(e == null)
	{
		e = drawing.createElementNS(svgNS,"path");
		e.setAttribute("id",id);
		e.setAttribute("class","opening");
		e.setAttribute("d",drawSwingDirection(frame,handing,frame_x,frame_y,frame_w,frame_h));
		drawing.getElementById("window").appendChild(e);
	}
	else
	{
		e.setAttribute("d",drawSwingDirection(frame,handing,frame_x,frame_y,frame_w,frame_h));
	}
}catch(e)
{
	alertUser("Exception:  initHanding('"+id+"','"+frame+"','"+handing+"')");
	alertUser(e);
	trace(e);
}	
}

/**
 * Same as initHanding() with specific coordinates.  
 * Use this function when you want specific control over placement.
 * 
 * @param id		String id
 * @param frame		String id of containing glass pane
 * @param handing	char handing direction (L,R,U,D)
 * @param frame_x	decimal x coordinate
 * @param frame_y	decimal y coordinate
 * @param frame_w	decimal width
 * @param frame_h	decimal height
 * @return			void
 */
function initHanding2(id,frame,handing,frame_x,frame_y,frame_w,frame_h)
{
try{
	trace("initHanding2('"+id+"','"+frame+"','"+handing+"',"+frame_x+","+frame_y+","+frame_w+","+frame_h+")");
	var e = drawing.getElementById(id);



	if(e == null)
	{
		e = drawing.createElementNS(svgNS,"path");
		e.setAttribute("id",id);
		e.setAttribute("class","opening");
		e.setAttribute("d",drawSwingDirection(frame,handing,frame_x,frame_y,frame_w,frame_h));
		drawing.getElementById("window").appendChild(e);
	}
	else
	{
		e.setAttribute("d",drawSwingDirection(frame,handing,frame_x,frame_y,frame_w,frame_h));
	}
}catch(e)
{
	alertUser("Exception: initHanding2('"+id+"','"+frame+"','"+handing+"',"+frame_x+","+frame_y+","+frame_w+","+frame_h+")");

	alertUser(e);
	trace(e);
}	
}

/**
 * Draw the handing at specific coordinates.  
  * 
 * @param id		String id
 * @param handing	char handing direction (L,R,U,D)
 * @param frame_x	decimal x coordinate
 * @param frame_y	decimal y coordinate
 * @param frame_w	decimal width
 * @param frame_h	decimal height
 * @return			void
 */
 
function initHanding3(id,frame,handing)
{
try{
	trace("initHanding3('"+id+"','"+frame+"','"+handing+"')");
	var e = drawing.getElementById(id);

	var frame_x = getN(frame,"x");
	var frame_y = getN(frame,"y");
	var frame_h = getN(frame,"height");
	var frame_w = getN(frame,"width");


	if(e == null)
	{
		e = drawing.createElementNS(svgNS,"path");
		e.setAttribute("id",id);
		e.setAttribute("class","opening");
		e.setAttribute("d",drawSwingDirection2(frame,handing,frame_x,frame_y,frame_w,frame_h));
		drawing.getElementById("window").appendChild(e);
	}
	else
	{
		e.setAttribute("d",drawSwingDirection2(frame,handing,frame_x,frame_y,frame_w,frame_h));
	}
}catch(e)
{
	alertUser("Exception:  initHanding3('"+id+"','"+frame+"','"+handing+"')");
	alertUser(e);
	trace(e);
}	
} 
function drawSwingDirection(frame, handing,frame_x,frame_y,frame_w,frame_h)
{
	var handingPath = "";
	var sx=0,sy=0,g1=0,g2=0,gm=0;
	var inset = inchesToMM(3.75);	
	switch(handing.charAt(0))
	{
		case 'U':
			handingPath = "M %SX%,%SY% l %GM%,%G1% l %GM%,%G2%";
			sx = frame_x + inset;
			sy = frame_y + frame_h-inset;
			g1 = -(frame_h-(2*inset));
			g2 = frame_h-(2*inset);
			gm = (frame_w-(2*inset))/2;
			break;
		case 'D':
			handingPath = "M %SX%,%SY% l %GM%,%G1% l %GM%,%G2%";
			sx = frame_x + inset;
			sy = frame_y + inset;
			g1 = frame_h-(2*inset);
			g2 = -(frame_h-(2*inset));
			gm = (frame_w-(2*inset))/2;
			break;
		case 'L':
			handingPath = "M %SX%,%SY% l %G1%,%GM% l %G2%,%GM%";
			sx = frame_x + frame_w-inset;
			sy = frame_y + inset;
			g1 = -(frame_w-(2*inset));
			g2 = frame_w-(2*inset);
			gm = (frame_h-(2*inset))/2;
			break;
		case 'R':
			handingPath = "M %SX%,%SY% l %G1%,%GM% l %G2%,%GM%";
			sx = frame_x + inset;
			sy = frame_y + inset;
			g1 = frame_w-(2*inset);
			g2 = -(frame_w-(2*inset));
			gm = (frame_h-(2*inset))/2;
			break;	
	}
	handingPath=handingPath.replace(/%SX%/g,sx);
	handingPath=handingPath.replace(/%SY%/g,sy);
	handingPath=handingPath.replace(/%G1%/g,g1);
	handingPath=handingPath.replace(/%G2%/g,g2);
	handingPath=handingPath.replace(/%GM%/g,gm);

	return handingPath;
}

/**
 * Get an element attribute.
 * 
 * @param entity 		String id
 * @param attribute		String attribute name
 * @return String
 */
 
function drawSwingDirection2(frame, handing,frame_x,frame_y,frame_w,frame_h)
{
	var handingPath = "";
	var sx=0,sy=0,g1=0,g2=0,gm=0;
	var inset = inchesToMM(3.75);
	var hand = handing.length == 2 ? handing.charAt(1):handing.charAt(0);			
	switch(hand)
	{
		case 'U':
			handingPath = "M %SX%,%SY% l %GM%,%G1% l %GM%,%G2%";
			sx = frame_x + inset;
			sy = frame_y + frame_h-inset;
			g1 = -(frame_h-(2*inset));
			g2 = frame_h-(2*inset);
			gm = (frame_w-(2*inset))/2;
			break;
		case 'D':
			handingPath = "M %SX%,%SY% l %GM%,%G1% l %GM%,%G2%";
			sx = frame_x + inset;
			sy = frame_y + inset;
			g1 = frame_h-(2*inset);
			g2 = -(frame_h-(2*inset));
			gm = (frame_w-(2*inset))/2;
			break;
		case 'L':
			handingPath = "M %SX%,%SY% l %G1%,%GM% l %G2%,%GM%";
			sx = frame_x + frame_w-inset;
			sy = frame_y + inset;
			g1 = -(frame_w-(2*inset));
			g2 = frame_w-(2*inset);
			gm = (frame_h-(2*inset))/2;
			break;
		case 'R':
			handingPath = "M %SX%,%SY% l %G1%,%GM% l %G2%,%GM%";
			sx = frame_x + inset;
			sy = frame_y + inset;
			g1 = frame_w-(2*inset);
			g2 = -(frame_w-(2*inset));
			gm = (frame_h-(2*inset))/2;
			break;	
	}
	handingPath=handingPath.replace(/%SX%/g,sx);
	handingPath=handingPath.replace(/%SY%/g,sy);
	handingPath=handingPath.replace(/%G1%/g,g1);
	handingPath=handingPath.replace(/%G2%/g,g2);
	handingPath=handingPath.replace(/%GM%/g,gm);

	return handingPath;
}
 
function get(entity, attribute)
{
try{
trace("get('"+entity+"','"+attribute+"')");
	var e = drawing.getElementById(entity);
	return e.getAttribute(attribute);
}
catch(e)
{
	alertUser("Exception:  get('"+entity+"','"+attribute+"')");
	alertUser(e);
	trace(e);
}	
}

/**
 * Get an element attribute and coerce it to numeric.
 * 
 * @param entity 		String id
 * @param attribute		String attribute name
 * @return number
 */

function getN(entity, attribute)
{
try{
trace("getN('"+entity+"','"+attribute+"')");
	var e = drawing.getElementById(entity);
	return (e.getAttribute(attribute)-0);
}
catch(e)
{
	alertUser("Exception:  getN('"+entity+"','"+attribute+"')");
	alertUser(e);
	trace(e);
}	
}

/**
 * Get a style attribute
 * 
 * @param entity		String id
 * @param property		String style property name
 * @return	String
 */
function getStyle(entity, property)
{
try{
	trace("getStyle('"+entity+"','"+property+"')");

	var e = drawing.getElementById(entity);
	return e.getStyle().getProperty(property);
}	
catch(e)
{
	alertUser("Exception:  getStyle('"+entity+"','"+property+"')");
	alertUser(e);
	trace(e);
}
}

/**
 * Set an element attribute.
 * 
 * @param entity	String id
 * @param attribute	String attribute id
 * @param value		String attribute  value
 * @return 	void
 */
function set(entity, attribute, value)
{
try{
	trace("set('"+entity+"','"+attribute+"','"+value+"')");

	var e = drawing.getElementById(entity);
//	e.setAttributeNS(svgNS,attribute,value);
	e.setAttribute(attribute,value);

}	
catch(e)
{
	alertUser("Exception:  set('"+entity+"','"+attribute+"','"+value+"')");
	alertUser(e);
	trace(e);
}	
}

/**
 * Set a style attribute.
 * 
 * @param entity		String id
 * @param property		String style attribute name
 * @param value			String style attribute value
 * @return	void
 */
function setStyle(entity, property, value)
{
try{
	trace("setStyle('"+entity+"','"+property+"','"+value+"')");

	var e = drawing.getElementById(entity);
	e.getStyle().setProperty(property,value,"");
}	
catch(e)
{
	alertUser("Exception:  setStyle('"+entity+"','"+property+"','"+value+"')");
	alertUser(e);
	trace(e);
}	
}

/**
 * Set text for an element.
 * 
 * @param entity	String id
 * @param value		String text
 * @return	void
 */
function setText(entity, value)
{
try{
	trace("setText('"+entity+"','"+value+"')");

	var e = drawing.getElementById(entity);
	if(e.firstChild)
	{
		e.firstChild.nodeValue = value;
	}
	else
	{
		var textContent = drawing.createTextNode(value);
   		e.appendChild(textContent);
	}
}	
catch(e)
{
	alertUser("Exception:  setText('"+entity+"','"+value+"')");
	alertUser(e);
	trace(e);
}
}

/**
 * Get text from an element.
 * 
 * @param entity 	String id
 * @return	String
 */
function getText(entity)
{
try{
	trace("getText('"+entity+"')");

	var e = drawing.getElementById(entity);
	if(e != null)
	{
		if(e.firstChild)
		{
			return	e.firstChild.nodeValue;
		}
	}
	return "";
}	
catch(e)
{
	alertUser("Exception:  getText('"+entity+"')");
	alertUser(e);
	trace(e);
}	
}

/**
 * Convert from drawing units to pixels
 * 
 * @param drawingUnits	decimal
 * @return	decimal	pixels
 */
function toPixels(drawingUnits)
{
   var SVGRoot = drawing.getDocumentElement();
   var m = SVGRoot.getScreenCTM(); 
   var p = SVGRoot.createSVGPoint(); 
   p.x = drawingUnits; 
   p.y = drawingUnits; 
   p = p.matrixTransform();
   return p.x; 
}


/**
 * Convert from pixels to drawing units
 * 
 * @param z		decimal pixels
 * @return	decimal drawing units
 */
function toDrawingUnits(z)
{
            var SVGRoot = drawing.getDocumentElement();
            var m = SVGRoot.getScreenCTM(); 
            var p = SVGRoot.createSVGPoint(); 
            p.x = z; 
            p.y = z; 
            p = p.matrixTransform(m.inverse());
	         return p.x; 
}

/**
 * Get the point of a mouse event in drawing units.
 * 
 * @param evt	Event object
 * @return	Point
 */
function getPoint(evt)
{
            var SVGRoot = drawing.getDocumentElement();
            var m = SVGRoot.getScreenCTM(); 
            var p = SVGRoot.createSVGPoint(); 
            p.x = evt.clientX; 
            p.y = evt.clientY; 
            p = p.matrixTransform(m.inverse());
	         return p; 
}

/**
 * Get x coordinate of a mouse event in drawing units.
 * 
 * @param evt	Event
 * @return decimal 
 */
function getX(evt)
{
	return	getPoint(evt).x;
}

/**
 * Get y coordinate of a mouse event in drawing units.
 * 
 * @param evt	Event
 * @return decimal 
 */
function getY(evt)
{
	return getPoint(evt).y;
}

/**
 * Make frame semi-transparent to expose elements underneath it.
 * @param evt			Event
 * @param id			String id of element to expose
 * @param transparent	boolean tranparent/opaque ...true/false
 * @return
 */
function expose(evt,id,transparent)
{
//	var gFrame = drawing.getElementById("window");
//	if(gFrame != null)
//	{	
//		gFrame.getStyle().setProperty("fill-opacity",(transparent?"0.2":"1.0"),"");	
//	}
}

/**
 * Create a rectangular glass pane.
 * 
 * @param id		String id 
 * @param sashId	String id of containing sash/frame
 * @param x			decimal x
 * @param y			decimal y
 * @param w			decimal width
 * @param h			decimal height
 * @param v			decimal invisible inset 
 * @return
 */

function initGlass(id,sashId,x, y, w, h, v)
{
try
{
trace("initGlass('"+id+"','"+sashId+"',"+x+","+ y+","+ w+","+ h+","+ v+")");
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
		gls.setAttribute("class","glass")
		gls.setAttribute("onmouseover","expose(evt,'"+idPrefix+sashId+"',true)");
		gls.setAttribute("onmouseout","expose(evt,'"+idPrefix+sashId+"',false)");
	}

	gls.setAttribute("x",x);
	gls.setAttribute("y",y);
	gls.setAttribute("width",w);
	gls.setAttribute("height",h);
	gls.setAttribute("inset",v); // non-SVG info
	if(g("f_imgType")=="U1" )
	{
		gls.getStyle().setProperty("fill-opacity","0","");
	}

	if(!gExists)
	{
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
		t.setAttribute("x",x+w-inchesToMM(3));
		t.setAttribute("y",y+h-inchesToMM(2));
	}
	

	if(g("f_tn")!="true")
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
 * Draw a rectangle.
 * 
 * @param id		String id
 * @param x			decimal x
 * @param y			decimal y
 * @param w			decimal width
 * @param h			decimal height
 * @param color		String web color code
 * @return
 */
function initRect(id, x, y, w, h, color)
{
try
{
trace("initRect('"+id+"',"+x+","+ y+","+ w+","+ h+",'"+ color+"')");
	var fillH = color.charAt(0) == '*' ? "url(#"+ g(color.substring(1))+"H)" : color;
	var fillV = color.charAt(0) == '*' ? "url(#"+ g(color.substring(1))+"V)" : color;
trace("fillH="+fillH);
trace("fillV="+fillV);

	var e = drawing.getElementById(id);
	if(e===null)
	{
		e = drawing.createElementNS(svgNS,"rect");
		e.setAttribute("id",id);
		e.setAttribute("x",x);
		e.setAttribute("y",y);
		e.setAttribute("width",w);
		e.setAttribute("height",h);
		e.setAttribute("class","frame");
		drawing.getElementById("window").appendChild(e);
	}
	e.setAttribute("x",x);
	e.setAttribute("y",y);
	e.setAttribute("width",w);
	e.setAttribute("height",h);
	if(color !== null)
	{
		e.getStyle().setProperty("fill",w>h?fillH:fillV,"");
	}
	if(g("f_tn")== "true")
	{
		e.setAttribute("class","frameTN");
	}
	else
	{
		var desc = "WIDTH: " + getDim(w) + " HEIGHT: " + getDim(h) + ".";
		createDescription(id,desc);
	}
}	
catch(e)
{
	alertUser("Exception:  initRect('"+id+"',"+x+","+ y+","+ w+","+ h+",'"+ color+"')");
	alertUser(e);
	trace(e);
}	
} 


/**
 * Draw a rectangle and attach it to a parent group.
 * 
 * @param id		String id
 * @param parent	Node parent group node
 * @param x			decimal x
 * @param y			decimal y
 * @param w			decimal width
 * @param h			decimal height
 * @param color		String web color code
 * @return
 */
function initRectInParent(id,parent, x, y, w, h, color)
{
try
{
trace("initRect('"+id+"',"+x+","+ y+","+ w+","+ h+",'"+ color+"')");
	var fillH = color.charAt(0) == '*' ? "url(#"+ g(color.substring(1))+"H)" : color;
	var fillV = color.charAt(0) == '*' ? "url(#"+ g(color.substring(1))+"V)" : color;
trace("fillH="+fillH);
trace("fillV="+fillV);

	var e = drawing.getElementById(id);
	if(e===null)
	{
		e = drawing.createElementNS(svgNS,"rect");
		e.setAttribute("id",id);
		e.setAttribute("x",x);
		e.setAttribute("y",y);
		e.setAttribute("width",w);
		e.setAttribute("height",h);
		e.setAttribute("class","frame");
		parent.appendChild(e);
	}
	e.setAttribute("x",x);
	e.setAttribute("y",y);
	e.setAttribute("width",w);
	e.setAttribute("height",h);
	if(color !== null)
	{
		e.getStyle().setProperty("fill",w>h?fillH:fillV,"");
	}
	if(g("f_tn")== "true")
	{
		e.setAttribute("class","frameTN");
	}
	else
	{
		var desc = "WIDTH: " + getDim(w) + " HEIGHT: " + getDim(h) + ".";
		createDescription(id,desc);
	}
}	
catch(e)
{
	alertUser("Exception:  initRect('"+id+"',"+x+","+ y+","+ w+","+ h+",'"+ color+"')");
	alertUser(e);
	trace(e);
}	
} 

/**
 * Draw a circle.
 * 
 * @param id	String id
 * @param x		decimal x coordinate of center
 * @param y		decimal y coordinate of center
 * @param r		decimal radius
 * @param color	fill color
 * @return
 */

function initCircle(id, x, y, r, color)
{
try
{
trace("initCircle('"+id+"',"+x+","+ y+","+ r+",'"+ color+"')");

	var e = drawing.getElementById(id);
	if(e===null)
	{
		e = drawing.createElementNS(svgNS,"circle");
		e.setAttribute("id",id);
		e.setAttribute("cx",x);
		e.setAttribute("cy",y);
		e.setAttribute("r",r);
		e.setAttribute("class","frame");
		drawing.getElementById("window").appendChild(e);
	}
	e.setAttribute("cx",x);
	e.setAttribute("cy",y);
	e.setAttribute("r",r);
	if(color !== null)
	{
		e.getStyle().setProperty("fill",color,"");
	}
	if(g("f_tn")== "true")
	{
		e.setAttribute("class","frameTN");
	} 
	else
	{
		var desc = "RADIUS: " + getDim(r) + ".";
		createDescription(id,desc);
	}
}	
catch(e)
{
	alertUser("Exception:  initCircle('"+id+"',"+x+","+ y+","+ r+",'"+ color+"')");
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

/**
 * Associate a title to a drawing element.
 *  
 * @param subjectID		String id
 * @param text			String text
 * @return	void
 */
function createDescription(subjectID, text)
{
	if(g("f_applet")!="true")
	{
		return;
	}
	
	var subject = drawing.getElementById(subjectID);
	if(subject == null)
	{
		alert("createDescription():  subject -" + subjectID + "- does not exist.");
		return;
	}

    var e = drawing.createElementNS(svgNS ,"title");
    
    e.setAttribute("id",subjectID + "_desc");

 	if(e == null)
	{
		alert("createDescription():  cannot create  -" + subjectID + "_desc-.");
		return;
	}   
    var textContent = drawing.createTextNode("ID: " + subjectID + "  ...  " +text);
    e.appendChild(textContent);
	subject.appendChild(e);
	subject.setAttribute("onclick", "showDesc(evt,'" + g("f_idprefix")+ subjectID + "')");
	
 }


function showDescLater(evt,id)
{ 
     evt.stopPropagation(); 
     suppressOnclick = true; 
     setTimeout("suppressOnclick=false;showDesc(null,'"+id+"');",200);
}

var suppressOnclick = false;
var cDesc = "";
var saveStroke;
var saveStrokeWidth;
var saveStrokeDasharray;

function showDesc(evt, id) 
{
	if(suppressOnclick)
    	return;

	var currentId = id;
	if(evt !== null)
	{
     	evt.stopPropagation();
     	currentId = evt.getTarget().id;
    }
 
   var win  = drawing.getElementById("window");
   if (applet != null) {
     if (cDesc != "") {
         var c = drawing.getElementById(cDesc);
         var d = c.getStyle();
         	if(saveStroke === "")
         		d.removeProperty("stroke");
         	else
        		d.setProperty("stroke", saveStroke, "");
         	if(saveStrokeWidth === "")
         		d.removeProperty("stroke-width");
         	else
 	     		d.setProperty("stroke-width", saveStrokeWidth, "");
           	if(saveStrokeDasharray === "")
         		d.removeProperty("stroke-dasharray");
         	else
        		d.setProperty("stroke-dasharray", saveStrokeDasharray, saveStrokeDasharray );
         
		win.getStyle().removeProperty("fill-opacity");
     }

     if (cDesc === currentId) {
        cDesc = "";
   		applet.callExternalJS("displayDesc","",null,null,null); 
   		return;
     }

     var e = drawing.getElementById(currentId);

     cDesc = currentId;
     
     saveStroke =  e.getStyle().getPropertyValue("stroke");
     saveStrokeWidth =  e.getStyle().getPropertyValue("stroke-width");
     saveStrokeDasharray =  e.getStyle().getPropertyValue("stroke-dasharray");
     e.getStyle().setProperty("stroke", "blue", "");
     e.getStyle().setProperty("stroke-width", (um==="mm"?5:0.25), "");
     e.getStyle().setProperty("stroke-dasharray", (um==="mm"?25:1), (um==="mm"?25:1));

     win.getStyle().setProperty("fill-opacity", .3, "");

     var z = drawing.getElementById(id + "_desc");
     if (z != null) {
        var desc = TextOf(z);
        applet.callExternalJS("displayDesc",desc,null,null,null);
     }
   }
 }
 //Get the text of the elem
 function TextOf(elem) {
     var childs = elem ? elem.getChildNodes() : null;

     for (var i = 0; childs && i < childs.getLength(); i++)
         if (childs.item(i).getNodeType() == 3) // text node ..
         return childs.item(i).getNodeValue();

     return "";
 }
 
 

/**
 * Create a dimension.
 * 
 * @param x1		decimal x1
 * @param y1		decimal y1
 * @param x2		decimal x2
 * @param y2		decimal y2
 * @param showFeet	boolean display feet (true) or just inches (false)
 * @return	void
 */ 

function createDim(x1,y1,x2,y2,showFeet)
{
try{
trace("createDim("+x1+","+y1+","+x2+","+y2+","+showFeet+")");

var idprefix = g("f_idprefix");
if(um === null)
{
	um = "in";
}
	if(tn || g("f_nested") == "true")
	{
		return;
	}
	var length = Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
	
	if((x1 > x2) || (x1 == x2 && y2 < y1))
	{ // flip it so the arrows don't get reversed.
		var x = x1;
		x1 = x2;
		x2 = x;
		var y = y1;
		y1 = y2;
		y2 = y;
	}

	// showFeet = false;

	var rotate = 0;
	if(x1 == x2)
	{
		rotate = 90;
	}
	else
	{
		if(y1 == y2)
		{
			rotate = 0;
		}
		else
		{
			rotate = Math.round((Math.atan((y2-y1)/(x2-x1)))*180);  //TODO: this doesn't work!
		}
	}
	var rotateRev = rotate + 180;

	
	var l = Math.sqrt(((x2-x1)*(x2-x1)) + ((y2-y1)*(y2-y1)));
	var dimText = getDim(l);

   	var grp = drawing.getElementById(idprefix+"f_dims");
   	if(grp == null)
   	{
   		grp = drawing.createElementNS(svgNS,"g");
   		grp.setAttribute("id",idprefix+"f_dims");
   	}
   	
   	var xC = x1 + (x2-x1)/2;
  	var yC = y1 + (y2-y1)/2;
/*
 alert("rotate="+rotate
 	+ " rotateRev=" + rotateRev
	+ " x1=" + x1
	+ " y1=" + y1
	+ " xC=" + xC
	+ " yC=" + yC
	+ " x2=" + x2
 	+ " y2=" + y2
 	+ " dimText=" + dimText);
*/ 	
 

if(length < (um === "mm" ? 200 : 8))
{
var line1 = drawing.createElementNS(svgNS,"line");
var line2 = drawing.createElementNS(svgNS,"line");
	if(rotate == 0)
	{
   		line1.setAttribute("x1",x1);
  		line1.setAttribute("x2",x1);
  		line1.setAttribute("y1",y1-1);
 		line1.setAttribute("y2",y1+1);
 		line2.setAttribute("x1",x2);
  		line2.setAttribute("x2",x2);
  		line2.setAttribute("y1",y2-1);
 		line2.setAttribute("y2",y2+1);
 	}
 	else
 	{
   		line1.setAttribute("x1",x1-1);
  		line1.setAttribute("x2",x1+1);
  		line1.setAttribute("y1",y1);
 		line1.setAttribute("y2",y1);
 		line2.setAttribute("x1",x2-1);
  		line2.setAttribute("x2",x2+1);
  		line2.setAttribute("y1",y2);
 		line2.setAttribute("y2",y2);
 	}	
 	line1.setAttribute("class","dimEnd");
  	grp.appendChild(line1);
	line2.setAttribute("class","dimEnd");
  	grp.appendChild(line2);
 }
else
{
// create faint dashed line
    var line = drawing.createElementNS(svgNS,"line");
   	line.setAttribute("x1",x1);
  	line.setAttribute("x2",x2);
  	line.setAttribute("y1",y1);
  	line.setAttribute("y2",y2);
  	line.setAttribute("class","dim");

  	grp.appendChild(line);
// create starting arrow  	
   	var g1= drawing.createElementNS(svgNS,"g");
   	g1.setAttribute("transform","translate("+x1+","+y1+")");
	var g2 = drawing.createElementNS(svgNS,"g");  
  	g2.setAttribute("transform","rotate("+rotate+")");
	var use = drawing.createElementNS(svgNS,"use");
	use.setAttributeNS(xlinkNS,"href","#arrow");
	g2.appendChild(use);
	g1.appendChild(g2);
	grp.appendChild(g1);
	
// create ending arrow	
	g1= drawing.createElementNS(svgNS,"g");
   	g1.setAttribute("transform","translate("+x2+","+y2+")");
	g2 = drawing.createElementNS(svgNS,"g");  
  	g2.setAttribute("transform","rotate("+rotateRev+")");
	use = drawing.createElementNS(svgNS,"use");
	use.setAttribute("xlink:href","#arrow");
	use.setAttributeNS(xlinkNS,"href","#arrow");
	g2.appendChild(use);
	g1.appendChild(g2);
	grp.appendChild(g1);
}

// create text caption
	g1= drawing.createElementNS(svgNS,"g");
	if(rotate<0)
	{
		rotate+=180;
   	}
   	g1.setAttribute("transform","rotate("+rotate+","+xC+","+(yC)+")");
	var text = drawing.createElementNS(svgNS,"text");
	text.setAttribute("x",xC);
	text.setAttribute("y",(yC+1));
	text.setAttribute("class",length<8?"dimSmall":"dim");
	var textContent = drawing.createTextNode(dimText);
	text.appendChild(textContent);
	g1.appendChild(text);
	grp.appendChild(g1);
	
	drawing.getElementById("window").appendChild(grp);
}	
catch(e)
{
	alertUser("Exception:  createDim("+x1+","+y1+","+x2+","+y2+","+showFeet+")");
	alertUser(e);
	trace(e);
}
}

/**
 * Create a dimension.
 * 
 * @param x1		decimal x1
 * @param y1		decimal y1
 * @param x2		decimal x2
 * @param y2		decimal y2
 * @param showFeet	boolean display feet (true) or just inches (false)
 * @return	void
 */ 

function createDimUnconditionally(x1,y1,x2,y2,showFeet)
{
try{
trace("createDim("+x1+","+y1+","+x2+","+y2+","+showFeet+")");

var idprefix = g("f_idprefix");
if(um === null)
{
	um = "in";
}
	
	var length = Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
	
	if((x1 > x2) || (x1 == x2 && y2 < y1))
	{ // flip it so the arrows don't get reversed.
		var x = x1;
		x1 = x2;
		x2 = x;
		var y = y1;
		y1 = y2;
		y2 = y;
	}

	// showFeet = false;

	var rotate = 0;
	if(x1 == x2)
	{
		rotate = 90;
	}
	else
	{
		if(y1 == y2)
		{
			rotate = 0;
		}
		else
		{
			rotate = Math.round((Math.atan((y2-y1)/(x2-x1)))*180);  //TODO: this doesn't work!
		}
	}
	var rotateRev = rotate + 180;

	
	var l = Math.sqrt(((x2-x1)*(x2-x1)) + ((y2-y1)*(y2-y1)));
	var dimText = getDim(l);


   	var grp = drawing.getElementById(idprefix+"f_dims");
   	if(grp == null)
   	{
   		grp = drawing.createElementNS(svgNS,"g");
   		grp.setAttribute("id",idprefix+"f_dims");
   	}
   	
   	var xC = x1 + (x2-x1)/2;
  	var yC = y1 + (y2-y1)/2;
/*
 alert("rotate="+rotate
 	+ " rotateRev=" + rotateRev
	+ " x1=" + x1
	+ " y1=" + y1
	+ " xC=" + xC
	+ " yC=" + yC
	+ " x2=" + x2
 	+ " y2=" + y2
 	+ " dimText=" + dimText);
*/ 	
 

if(length < (um === "mm" ? 200 : 8))
{
var line1 = drawing.createElementNS(svgNS,"line");
var line2 = drawing.createElementNS(svgNS,"line");
	if(rotate == 0)
	{
   		line1.setAttribute("x1",x1);
  		line1.setAttribute("x2",x1);
  		line1.setAttribute("y1",y1-1);
 		line1.setAttribute("y2",y1+1);
 		line2.setAttribute("x1",x2);
  		line2.setAttribute("x2",x2);
  		line2.setAttribute("y1",y2-1);
 		line2.setAttribute("y2",y2+1);
 	}
 	else
 	{
   		line1.setAttribute("x1",x1-1);
  		line1.setAttribute("x2",x1+1);
  		line1.setAttribute("y1",y1);
 		line1.setAttribute("y2",y1);
 		line2.setAttribute("x1",x2-1);
  		line2.setAttribute("x2",x2+1);
  		line2.setAttribute("y1",y2);
 		line2.setAttribute("y2",y2);
 	}	
 	line1.setAttribute("class","dimEnd");
  	grp.appendChild(line1);
	line2.setAttribute("class","dimEnd");
  	grp.appendChild(line2);
 }
else
{
// create faint dashed line
    var line = drawing.createElementNS(svgNS,"line");
   	line.setAttribute("x1",x1);
  	line.setAttribute("x2",x2);
  	line.setAttribute("y1",y1);
  	line.setAttribute("y2",y2);
  	line.setAttribute("class","dim");

  	grp.appendChild(line);
// create starting arrow  	
   	var g1= drawing.createElementNS(svgNS,"g");
   	g1.setAttribute("transform","translate("+x1+","+y1+")");
	var g2 = drawing.createElementNS(svgNS,"g");  
  	g2.setAttribute("transform","rotate("+rotate+")");
	var use = drawing.createElementNS(svgNS,"use");
	use.setAttributeNS(xlinkNS,"href","#arrow");
	g2.appendChild(use);
	g1.appendChild(g2);
	grp.appendChild(g1);
	
// create ending arrow	
	g1= drawing.createElementNS(svgNS,"g");
   	g1.setAttribute("transform","translate("+x2+","+y2+")");
	g2 = drawing.createElementNS(svgNS,"g");  
  	g2.setAttribute("transform","rotate("+rotateRev+")");
	use = drawing.createElementNS(svgNS,"use");
	use.setAttribute("xlink:href","#arrow");
	use.setAttributeNS(xlinkNS,"href","#arrow");
	g2.appendChild(use);
	g1.appendChild(g2);
	grp.appendChild(g1);
}

// create text caption
	g1= drawing.createElementNS(svgNS,"g");
	if(rotate<0)
	{
		rotate+=180;
   	}
   	g1.setAttribute("transform","rotate("+rotate+","+xC+","+(yC)+")");
	var text = drawing.createElementNS(svgNS,"text");
	text.setAttribute("x",xC);
	text.setAttribute("y",(yC+1));
	text.setAttribute("class",length<8?"dimSmall":"dim");
	var textContent = drawing.createTextNode(dimText);
	text.appendChild(textContent);
	g1.appendChild(text);
	grp.appendChild(g1);
	
	drawing.getElementById("window").appendChild(grp);
}	
catch(e)
{
	alertUser("Exception:  createDim("+x1+","+y1+","+x2+","+y2+","+showFeet+")");
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
function initOuterNonMtrdFrame(id, x, y, w, h, f,fTop,fBot, color)
{
try
{
trace("initOuterNonMtrdFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+","+fTop+","+ fBot+",'"+ color+"')");

	var ws = w - (2*f);
	var hs = h - fBot;
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
		top = drawing.createElementNS(svgNS,"rect");
		top.setAttribute("id",id+"_header");
		top.setAttribute("class","frame");
		top.setAttribute("x",x+f);
		top.setAttribute("y",y);
		top.setAttribute("width",ws);
		top.setAttribute("height",fTop);
		top.getStyle().setProperty("fill",color,"");
		grp.appendChild(top);
	}
	else
	{
		top.setAttribute("x",x+f);
		top.setAttribute("y",y);
		top.setAttribute("width",ws);
		top.setAttribute("height",fTop);
		top.getStyle().setProperty("fill",color,"");
	}
	if(tn)
	{
		top.setAttribute("class","frameTN");
	}
	else
	{	
				desc = "LENGTH: %W% ... %F% extrusion stock.";
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
		bot.setAttribute("x",x);
		bot.setAttribute("y",y+h-fBot);
		bot.setAttribute("width",w);
		bot.setAttribute("height",fBot);
		bot.getStyle().setProperty("fill",color,"");
		
		grp.appendChild(bot);
	}
	else
	{
		bot.setAttribute("x",x);
		bot.setAttribute("y",y+h-fBot);
		bot.setAttribute("width",w);
		bot.setAttribute("height",fBot);
		bot.getStyle().setProperty("fill",color,"");
	}
	if(tn)
	{
		top.setAttribute("class","frameTN");
	}
	else
	{	
		desc = "LENGTH: %W% ... %F% extrusion stock.";
		desc = desc.replace(/%W%/g,getDim(w));
		desc = desc.replace(/%F%/g,getDim(fBot));
		createDescription(id+"_sill",desc);
	}
	bot.getStyle().setProperty("fill",color,"");
	
		
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
		left.setAttribute("height",hs);
		left.getStyle().setProperty("fill",color,"");
		grp.appendChild(left);
	}
	else
	{
		left.setAttribute("x",x);
		left.setAttribute("y",y);
		left.setAttribute("width",f);
		left.setAttribute("height",hs);
		left.getStyle().setProperty("fill",color,"");
	}
	if(tn)
	{
		left.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H% ... %F% extrusion stock.";
		desc = desc.replace(/%H%/g,getDim(hs));
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
		right.setAttribute("height",hs);
		right.getStyle().setProperty("fill",color,"");
		grp.appendChild(right);
	}
	else
	{
		right.setAttribute("x",x+ws+f);
		right.setAttribute("y",y);
		right.setAttribute("width",f);
		right.setAttribute("height",hs);
		right.getStyle().setProperty("fill",color,"");
	}
	if(tn)
	{
		right.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H%  ... %F% extrusion stock.";
		desc = desc.replace(/%H%/g,getDim(hs));
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
	alertUser("Exception:  initOuterNonMtrdFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+","+fTop+","+ fBot+",'"+ color+"')");
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




/**
 * Draw an image
 * 
 * @param id		String id
 * @param idParent	String id of parent group
 * @param resource	String file name (.jpg or .png)
 * @param x			decimal x coordinate
 * @param y			decimal y coordinate
 * @param w			decimal width
 * @param h			decimal height
 * @return	void
 */

function initImage(id, idParent, resource, x, y, w, h)
{
try{
	trace("initImage('"+id+"','"+idParent+"','"+resource+"',"+x+","+y+","+ w+","+ h+")");

	var parent = idParent == null ? null : drawing.getElementById(idParent);
	if(idParent != null && parent == null)
	{
		parent = drawing.createElementNS(svgNS,"g");
		parent.setAttribute("id",idPLarent);
		drawing.getElementById("window").appendChild(parent);
	}
	else
	{
		parent = drawing.getElementById("window");
	}

	var img = drawing.getElementById(id);
	var create = false;
	if(img == null)
	{
		img = drawing.createElementNS(svgNS,"image");
		img.setAttribute("id",id);
		create = true;
	}
	img.setAttribute("x",x);
	img.setAttribute("y",y);
	img.setAttribute("width",w);
	img.setAttribute("height",h);
	img.setAttribute("preserveAspectRatio","none");
	
		
	var fromRasterize = g("f_rasterize") == "true";
	var resourcePath = g("f_resourcePath");
	
	img.setAttributeNS(xlinkNS,"href",resourcePath + resource);

	if(create)
	{
		parent.appendChild(img);
	}
}
catch(e)
{
	alertUser("Exception:  initImage('"+id+"','"+idParent+"','"+resource+"',"+x+","+y+","+ w+","+ h+")");
	alertUser(e);
	trace(e);
}		
}


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
	
			pointC = new Point(x+w-f,y+f);
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
		gls.setAttribute(shape,"octagon");
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



/**
 * Embed a submodel drawing
 * 
 * @param pos		integer ordinal 
 * @param x			decimal x coordinate
 * @param y			decimal y coordinate
 * @param w			decimal width
 * @param h			decimal height
 * @return
 */
function embedSubmodel(pos,x,y,w,h)
{
	var url = g("f_POS"+pos+"_IMGURL")
	var pn = g("f_POS"+pos+"_PN");
	
	if(g("f_applet") == "true")
	{
		embedSubmodelSvg(url,pos,x,y,w,h,pn);
	}
	else
	{
		embedSubmodelImage(url,pos,x,y,w,h);
	}
}

/**
 * Embed a submodel drawing SVG
 * 
 * @param url 		String url to generate SVG
 * @param pos		integer ordinal 
 * @param x			decimal x coordinate
 * @param y			decimal y coordinate
 * @param w			decimal width
 * @param h			decimal height
 * @param pn		String product ID
 * @return
 */
function embedSubmodelSvg(url,pos,x,y,w,h,pn)
{
try{

	var mulledSet = null;
	if(g("f_mulling") == "true")
	{
		mulledSet = MulledSet.getInstance(g("f_order"));
		mulledSet.setPosition(pos,x,y);
		return;
	}
	
	trace("embedSubmodelSvg('"+url+"',"+pos+","+x+","+y+","+w+","+h+")");
	var grpWindow = drawing.getElementById("window");
	if(grpWindow === null)
	{
		alert("<g id=window ... is required in all drawings.");
		return;
	}
// Generate Download Progress
	var	grp = drawing.createElementNS(svgNS,"g");
	grp.setAttribute("id","p" + pos);
	grp.setAttribute("transform","translate("+x+","+y+")");
	
	var	progress = drawing.createElementNS(svgNS,"g");
	
	progress.setAttribute("id","p" + pos + "_PROGRESS");
	progress.setAttribute("transform","translate("+(w/2)+","+(h/2)+")");

	var use = drawing.createElementNS(svgNS,"use");
	use.setAttribute("id","p" + pos + "_PROGRESS_WHEEL");
	use.setAttributeNS(xlinkNS,"href","#progress");
	use.setAttribute("transform","translate(12,2)");
	use.setAttribute("visibility","hidden");
	var text = drawing.createElementNS(svgNS,"text");
	text.setAttribute("x","12");
	text.setAttribute("y","3");
	text.setAttribute("class","prod");
	var textContent = drawing.createTextNode(pn);
	text.appendChild(textContent);
	
	progress.appendChild(use);
	progress.appendChild(text);
	
	grp.appendChild(progress);

	applet.registerVertElement("p0_V_SEAM_"+pos,
								"p0",
								x,
								gN("v_mull_thk"),							 	
								null);

	
	grpWindow.appendChild(grp);
	
	applet.addEmbed("p" + pos, url);
	

}catch(e)
{
	alertUser("Exception:  embedSubmodelSvg('"+url+"',"+pos+","+x+","+y+","+w+","+h+")");
	alertUser(e);
	trace(e);
}			
}


/**
 * Embed a submodel drawing 
 * 
 * @param url 		String url to generate SVG
 * @param pos		integer ordinal 
 * @param x			decimal x coordinate
 * @param y			decimal y coordinate
 * @param w			decimal width
 * @param h			decimal height
 * @return
 */
function embedSubmodelImage(url,pos,x,y,w,h)
{
try{
	var mulledSet = null;
	if(g("f_mulling") == "true")
	{
		mulledSet = MulledSet.getInstance(g("f_order"));
		mulledSet.setPosition(pos,x,y);
		return;
	}
	
	trace("embedSubmodelImage('"+url+"',"+pos+","+x+","+y+","+w+","+h+")");

  
	var grpWindow = drawing.getElementById("window");
	if(grpWindow === null)
	{
		trace("<g id=window ... is required in all drawings.");
		return;
	}

	var type = g("f_imgType");
  	var pixToUm = (gN("docWidthPX")/gN("docWidthUM"));
	var docWidth = (w* pixToUm); 
	var docHeight = (h* pixToUm);
	trace("docWidth="+ docWidth);
  	trace("docHeight="+ docHeight);

	var p = 0; //inchesToMM(0.625);
	var	img = drawing.createElementNS(svgNS,"image");
	img.setAttribute("id","EMBED_POS_" + pos);
	img.setAttribute("x",x-p);
	img.setAttribute("y",y-p);
	img.setAttribute("width",w+(2*p));
	img.setAttribute("height",h+(2*p));
	img.setAttribute("preserveAspectRatio","none"); //"xMinYMin meet");
	img.setAttributeNS(xlinkNS,"href",url+"&nested=true&type="+type+"&w="+docWidth+"&h="+docHeight+(g("f_configuring")=="true"?"&cfg=true":""));
	grpWindow.appendChild(img);
	
	
		
}catch(e)
{
	alertUser("Exception:  embedSubmodelImage('"+url+"',"+pos+","+x+","+y+","+w+","+h+")");
	alertUser(e);
	trace(e);
}		
}









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

function initText(id,parentId,x,y,w,text,klass)
{
  var parent = parentId === null ? 	drawing.getElementById("window") : 	drawing.getElementById(parentId);


	var textEl = drawing.createElementNS(svgNS,"text");
	var xC = x;
	var fontSize = w/(text+"").length;
	
	var yC = y;
	 
	textEl.setAttribute("x",xC);
	textEl.setAttribute("y",(yC+1));
	if(klass != null)
	{
    textEl.setAttribute("class",klass);
	}
	else
	{
      textEl.getStyle().setProperty("font-size",fontSize);
      textEl.getStyle().setProperty("text-anchor","middle");
	}
	var textContent = drawing.createTextNode(text);
	textEl.appendChild(textContent);
	
	parent.appendChild(textEl);

}

function displayAlignmentError()
{

  var showError = g("f_redraw") != "true" && g("f_applet") != "true";
  if(!showError)
  {

     return;
  }
  
  var errorMsg = g("f_errorMsg");
  if(errorMsg === "" || errorMsg === null)
  {

    return;
  }
   
   
 
 
  if(tn)
  {

    initRect("align_error",0,0,gN("width"),gN("height"),"yellow");
    setStyle("align_error","fill-opacity",".5");
    setStyle("align_error","stroke","none");
   }
   else
   {

   	var x = gN("width")/2;
		var y = gN("height")/2;
		initText("alignErrorMsg","window",x,y,gN("width"),errorMsg,"error");
  }
 
  
}


function gridLen(glassId, gridId)
{
  
  var glass = drawing.getElementById(glassId);
  if(glass === null)
  {
    return 0;
  }
  var grid = drawing.getElementById(gridId);
  if(grid === null)
  {
    return 0;
  }
  var x,y,x1,x2,y1,y2,w,h,l;
  if(grid.tagName == "rect")
  {
    x = roundTo(grid.getAttribute("x")-0,3);
    y = roundTo(grid.getAttribute("y")-0,3);
    w = roundTo(grid.getAttribute("width")-0,3);
    h = roundTo(grid.getAttribute("height")-0,3);
    if(w>h)
    {
      y = roundTo(y + h/2,3);
      l = computeGridLen(glass,new Point(x,y),new Point(x+w,y));
      return l === 0 ? w : l;
    }
    else
    {
      roundTo(x = x + w/2,3);
      l = computeGridLen(glass,new Point(x,y),new Point(x,y+h));
      return l === 0 ? h : l;
    }
  }
  else
  if(grid.tagName == "line")
  {
      x1 = roundTo(grid.getAttribute("x1")-0,3);
      y1 = roundTo(grid.getAttribute("y1")-0,3);
      x2 = roundTo(grid.getAttribute("x2")-0,3);
      y2 = roundTo(grid.getAttribute("y2")-0,3);

      l = computeGridLen(glass,new Point(x1,y1),new Point(x2,y2));
      return l === 0 ? roundTo(Math.sqrt(Math.pow(x1-x2.x,2)+Math.pow(y1-y2,2)),3) : l;
  }
  
  return 0;
  
} 


function computeGridLen(glass,p1,p2)
{
     trace("grid = "+ p1.x +"    "+p1.y + "   TO   " +  p2.x + "  " + p2.y);

  var i;
  var pA=null;  // intersect point 1
  var pB=null;  // intersect point 2
  var pStart=null; // first point in shape
  var x0,y0,x1,x2,y1,y2;
  var a;
  
  
  for(i=1;i<10;i++)
  {
        trace("p"+i +" = "+ glass.getAttribute("x"+i) +"    "+glass.getAttribute("y"+i));

      x0 = glass.getAttribute("x"+i);
      y0 = glass.getAttribute("y"+i);
      if(x0 === null || x0 === "")
      {
          if(pA === null)
          {
            break;
          }
          pB = checkIntersection(x1,y1,  pStart.x,pStart.y,  p1.x,p1.y,  p2.x,p2.y);

          break;
       }
  
       if(i==1)
       {
          pStart = new Point(x0-0,y0-0);
          x1 = pStart.x;
          y1 = pStart.y;
          continue;
       } 
       x2 = roundTo(x0-0,3);
       y2 = roundTo(y0-0,3);
       
       if(pA === null)
       {
          pA = checkIntersection(x1,y1,x2,y2,p1.x,p1.y,p2.x,p2.y);
       }
       else
       {
          pB = checkIntersection(x1,y1,x2,y2,p1.x,p1.y,p2.x,p2.y);
       }
       if(pA !== null && pB !== null)
       {
        break;
       } 
       x1 = x2;
       y1 = y2;

  }
  if(pB === null)
  { 
    return 0;
  }
  trace("pA = "+ pA.x +"    "+pA.y+"     pB = " + pB.x +"    "+pB.y);

  var l = roundTo(Math.sqrt(Math.pow(pB.x-pA.x,2)+Math.pow(pB.y-pA.y,2)),3);
  trace("Length="+l);
  return l;
}



function checkIntersection(lineAx1,lineAy1,lineAx2,lineAy2,lineBx1,lineBy1,lineBx2,lineBy2)
{ 
var cp = null;
var a1,b1,c1,a2,b2,c2,denom;
a1 = lineAy2-lineAy1;
b1 = lineAx1-lineAx2;
c1 = lineAx2*lineAy1-lineAx1*lineAy2; 
// a1x + b1y + c1 = 0 line1 eq
a2 = lineBy2-lineBy1;
b2 = lineBx1-lineBx2;
c2 = lineBx2*lineBy1-lineBx1*lineBy2; 
// a2x + b2y + c2 = 0 line2 eq
denom = a1*b2 - a2*b1;
if(denom != 0)
{
  cp = new Point(roundTo((b1*c2 - b2*c1)/denom,3),roundTo((a2*c1 - a1*c2)/denom,3));
 
}
if(cp !== null &&
    isPointOnLine(cp,new Point(lineAx1,lineAy1),new Point(lineAx2,lineAy2)) &&
    isPointOnLine(cp,new Point(lineBx1,lineBy1),new Point(lineBx2,lineBy2)))
{
  trace("INTERSECTION = "+ cp.x +"    "+cp.y );
  return cp;
}
return null;
}

function isPointOnLine(p, p1, p2)
{
   trace("is point on line...  "+ p.x +"    "+p.y+"     "+ p1.x +" "+p1.y+"          "+ p2.x +" "+p2.y);
  return p.x >= Math.min(p1.x,p2.x)   &&
          p.x <= Math.max(p1.x,p2.x)   &&
          p.y >= Math.min(p1.y,p2.y)   &&
          p.y <= Math.max(p1.y,p2.y);
          
}
