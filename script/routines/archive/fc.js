importClass(Packages.org.w3c.dom.Document);
importClass(Packages.org.w3c.dom.Element);
importClass(Packages.org.w3c.dom.Node);
importClass(Packages.org.w3c.dom.NodeList);
importClass(Packages.org.w3c.dom.events.DocumentEvent);
importClass(java.lang.System);
importClass(java.io.File);
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
var roundingFactor = 5;


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

nested = g("f_nested") == "true";

	um = g("f_um");
	if(um===null)
	{
		um = "in";
	}

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
			s("f_docWidth",wPage);
			s("f_docHeight",docH);
		}
		else
		{
			var docW = hPage*((w+p)/(h+p));
			doc.setAttribute("width",docW+"px");
			doc.setAttribute("height",hPage+"px");
			s("f_docWidth",docW);
			s("f_docHeight",hPage);
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
  trace("ALIGNING");
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


importClass(Packages.com.fc.util.configurator.PCMTrace);
var pcmTracer = null;
function initPcmTracer(){
	if(pcmTracer == null){
		pcmTracer = PCMTrace.create(g("f_system"),g("f_user"),g("f_password"),g("f_order"),g("f_item"));
		pcmTracer.traceIt(">>>>> START SVG <<<<<");
	}
}

/**
 * Write text to pcmTrace, systemOut.log (i.e. java console in applet).
 * Use this function for debugging your scripts.
 * 
 * @param text
 * @return void
 */
function trace(text)
{
  if(g("f_tracing") == "true")
  {
    initPcmTracer();
    
    pcmTracer.traceIt(text);
    return;
  }
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
	if(um == "mm")
	{
		return inches+"mm";
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
	}	var fracRemaining = inches%1;
	var inchInteger = inches - fracRemaining;
	
	var frac = decToFraction(fracRemaining);
	
	var inch = "";
	
	if(inchInteger > 0 && frac !== "")
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
		if(frac !== "")
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
 * Draw horizontal grille bars
 * 
 * @param liteName  String id of containing lite
 * @param grp		String id of grille group (i.e. radial grille ID)
 * @param x			decimal x coordinate
 * @param y			decimal y coordinate
 * @param w			decimal width
 * @param h			decimal height
 * @param horz		integer bar count
 * @param color		String color code
 * @param t			decimal thickness of grille bar
 * @param startAtTop	boolean draw first bar at top (i.e. y)
 * @param redraw		boolean redrawing
 * @return void
 */


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
	var inset =	inchesToMM(3.75);	
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
//	var gFrame = drawing.getElementById(id);
//	if(gFrame != null)
//	{	
//		gFrame.getStyle().setProperty("fill-opacity",(transparent?"0.2":"1.0"),"");	
//	}
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

function initLine(id, x1, y1, x2, y2, style)
{
try
{
trace("initLine('"+id+"',"+x1+","+ y1+","+ x2+","+ x2+",'"+ style+"')");


	var e = drawing.getElementById(id);
	if(e===null)
	{
		e = drawing.createElementNS(svgNS,"line");
		e.setAttribute("id",id);
		e.setAttribute("x1",x1);
		e.setAttribute("y1",y1);
		e.setAttribute("x2",x2);
		e.setAttribute("y2",y2);
		drawing.getElementById("window").appendChild(e);
	}
		e.setAttribute("x1",x1);
		e.setAttribute("y1",y1);
		e.setAttribute("x2",x2);
		e.setAttribute("y2",y2);
		if(style !== null)
		{
			e.setAttribute("class",style);
		}
	
}	
catch(e)
{
	alertUser("Exception:  initLine('"+id+"',"+x1+","+ y1+","+ x2+","+ y2+",'"+ style+"')");
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
	

   	var grp = drawing.getElementById("f_dims");
   	if(grp == null)
   	{
   		grp = drawing.createElementNS(svgNS,"g");
   		grp.setAttribute("id","f_dims");
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
	text.setAttribute("class",length<(um === "mm" ? 200 : 8)?"dimSmall":"dim");
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

   	var grp = drawing.getElementById("f_dims");
   	if(grp == null)
   	{
   		grp = drawing.createElementNS(svgNS,"g");
   		grp.setAttribute("id","f_dims");
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
	if(resource.substring(0,13) == "cad_drawings/")
	{
		resourcePath = resourcePath.substring(0,resourcePath.indexOf("products/drawings/resource"));
	}
	
	var ixFilePath = resourcePath.indexOf("&resource=");
	if(ixFilePath !== -1)
	{
		var filePath = resourcePath.substring(resourcePath,10)+resource;
		var file = new File(filePath);
		if(!file.exists())
			return false;
	}
	
	img.setAttributeNS(xlinkNS,"href",resourcePath + resource);

	if(create)
	{
		parent.appendChild(img);
	}
	return true;
}
catch(e)
{
	alertUser("Exception:  initImage('"+id+"','"+idParent+"','"+resource+"',"+x+","+y+","+ w+","+ h+")");
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

	var p = inchesToMM(0.0625);
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

// Find the intersection points of two circles.
// How it works --
//  Suppose P0 is the first center, with radius r0;
//  P1 is second center, with radius r1.
//  Find d = distance between P0 and P1.
//  Image a line segment between the two intersections;
//  let h = half its length;
//  it intersects the P0<->P1 line at point P2.
//  Let A = distance from P0 to P2.
//  Let B = distance from P2 to P1.
//  Then d = A + B, and B = (d-A)
//  Take the two equalities --
//    A*A + h*h = r0*r0  and B*B + h*h = r1*r1
//  Substitute (d-A) for B in the second one;
//  then subtract that equality from the first one,
//  and solve for A.  Follow the code from there.
// 
//  The result is P3 and P3', the points of intersection.
//
// This is from an explanation by Paul Bourke.
//
function i_circles(x0,y0,r0,x1,y1,r1) {
	var d = distance(x0,y0,x1,y1);
	var pa = new Array();
	if (d > r0 + r1) {
		return pa;	// disjunct
	}
	if (d < Math.abs(r0 - r1) ) {
		return pa;	// one contains the other
	}
	var a = (r0*r0 - r1*r1 + d*d ) / (2*d);
	var h = Math.sqrt(r0*r0 - a*a);
	
	// Use proportional triangles to find point P2 from P0.
	// Both triangle have one corner at P0, one side
	// on the P0->P1 line, and one side horizontal.
	var x2 = x0 + a * (x1 - x0)/d;
	var y2 = y0 + a * (y1 - y0)/d;

	// Use proportional triangles to find point P3 from P2.
	// One triangle has P0 at one corner, and P0->P1 as
	// the hypotenuse; the other has P2, with P2->P3 as hypotenuse.
	// A negative change in x results in positive change in y.
	// A positive change in x results in negative change in y.
	//
	var x3 = x2 + h * (y1 - y0 ) / d;
	var y3 = y2 - h * (x1 - x0 ) / d;
	pa.push(x3);
	pa.push(y3);
	if (h == 0) return pa;
	x3 = x2 - h * (y1 - y0 ) / d;
	y3 = y2 + h * (x1 - x0 ) / d;
	pa.push(x3);
	pa.push(y3);

	return pa;
}

// Determine if a point is in a circle
//
function inCircle(x,y,cx,cy,r) {

   var tx = x - cx;
   var ty = y - cy;
   if (tx*tx + ty*ty <= r*r) /* Change to < to not include the edge */
      return true;
   else
      return false;

}

/* Distance between points in the plane
*/
function distance(x,y,a,b) {
	var d = Math.sqrt(Math.pow(x - a,2) + Math.pow(y - b,2));
	return d;
}


/* Return true if the given thing is a number.
*  Assume it's either a number or a string.
*  Note: this must work for 0 and "0"
*/
function isNumber(thing) {
	return "" + (thing + 1) != (thing + "" + 1);
}