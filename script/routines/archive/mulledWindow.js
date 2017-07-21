
   var svgNS = "http://www.w3.org/2000/svg";
   var xlinkNS = "http://www.w3.org/1999/xlink";

	var docWidthPX = 480;
	var docHeightPX = 480;
	var docWidthUM = 96;
	var docHeightUM = 96;
	var tn = false;



function trim(input)
{
	var l = 0;
	for(;l < input.length; l++)
		if(!(  input.charAt(l) == ' '
			|| input.charAt(l) == '\n'
			|| input.charAt(l) == '\t'
			|| input.charAt(l) == '\r'))	
			break;
			
	var r = input.length - 1;
	for(;r > 0; r--)
		if(!(  input.charAt(r) == ' '
			|| input.charAt(r) == '\n'
			|| input.charAt(r) == '\t'
			|| input.charAt(r) == '\r'))			
				break;
	return input.substring(l,r + 1);
}

	
function dimToInches(dimension)
{
	if(trim(dimension) == "")
		return 0;
		
	var work = dimension+"";
	
	if(work.indexOf("\"") != -1)
	{
		work = dimension.replace("'","*12 + ");
		work = work.replace("-"," + ");
		work = work.replace("\"", "");
	}
	else
		work = dimension.replace("'","*12");
	
	try
	{
		var val = eval(work);
		if(val === undefined || isNaN(val))
			return 0;
	}
	catch(x)
	{
		return 0;
	}
	
}
	
	
function dimsToInches(feet, inches, frac)
{
	var result = 0;
	
	if(feet != "")
		result += 12*(feet-0);

	if(inches != "")
		result += (inches-0);
	
	if(frac != "")
		try
		{
			var val = eval(frac);
			if(!(val === undefined || isNaN(val)))
				result+=val;
		}
		catch(x)
		{}
	return result;		

}
	

function inchesToDim(inches)
{
	var inchRemaining = inches%12;
	
	var feet = (inches - inchRemaining)/12;
	
	var fracRemaining = inchRemaining%1;
	var inchInteger = inchRemaining - fracRemaining;
	
	var frac = decToFraction(fracRemaining);
	
	var inch = "";
	
	if(inchInteger > 0 && frac != "")
		inch = inchInteger + "-" + frac + "\"";
	else
		if(inchInteger > 0)
			inch = inchInteger + "\"";
		else
		if(frac != "")
			inch = frac + "\"";
		else
			inch = "";
	
	return trim((feet == 0?"":feet + "' ") + inch);
}


function getDim(inches)
{
	var fracRemaining = inches%1;
	var inchInteger = inches - fracRemaining;
	
	var frac = decToFraction(fracRemaining);
	
	var inch = "";
	
	if(inchInteger > 0 && frac != "")
		inch = inchInteger + "-" + frac + "\"";
	else
		if(inchInteger > 0)
			inch = inchInteger + "\"";
		else
		if(frac != "")
			inch = frac + "\"";
		else
			inch = "";
	
	return trim(inch);
}

function decToFraction(indec)
{
	var dec = indec % 1;
	if(dec == 0)
		return "";
		
	var fracDec = 0;
	var fracs = ["0","1/16","1/8","3/16","1/4",   // TODO: support 1/32
					 "5/16","3/8","7/16","1/2",
					 "9/16","5/8","11/16","3/4",
					 "13/16","7/8","15/16","1"];
	var i = fracs.length - 1;
	for(; i >= 0; i--)
	{
		fracDec = eval(fracs[i]);
		if(fracDec <= dec)
			return fracs[i];
	}
	return "";
}
	
			


function setElementValue(doc, element, data)
{
    var value = data;
    var text = value;
    var ixText = data.indexOf("\\");
    
    if(ixText != -1)
    {
        value = data.substring(0,ixText);
        text = data.substring(ixText + 1);
    }
        
	if(element.length != null && element[0].tagName == "INPUT" && element[0].type == "radio")
	{
		var i = 0;
		for(;i < element.length; i++)
		{
			element[i].checked = (element[i].value == value);
		}
	}
	else
	if(element.length != null && element[0].tagName == "INPUT" && element[0].type == "checkbox")
	{
		element.checked = (value == "Y");
	}
	else
	 if(element.tagName == 'INPUT' )
	{
 		element.value = value;
 		if(element.type == "hidden")
 		{
 			var displayed = doc.all["SPAN_" + element.name];
 			if(displayed)
 				displayed.innerHTML = text;
 		}
	} else
 	if(element.tagName == 'TEXTAREA')
	{
 		element.value = value;
	} else
	if(element.tagName == 'SPAN' )  // static text
	{
        var s = value.replace("\r\n","<br>");
        s = s.replace("\n","<br>");
        s = s.replace("\t","&nbsp;&nbsp;&nbsp;&nbsp;");
 		element.innerHTML = s;
	} else
	if(element.tagName == 'SELECT' )
	{
		var options = element.options;
		var i = 0;
		for(;i < options.length; i++)
		{
			if(options[i].value == value)
			{
				element.selectedIndex = i;
				return;
			}
		}
		element.selectedIndex = -1;
	} 
	
}




function get(entity, attribute)
{
	var e = drawing.getElementById(entity);
	if(e != null)
		return e.getAttribute(attribute);
	return null;
}

function getN(entity, attribute)
{
	var e = drawing.getElementById(entity);
	if(e != null)
		return (e.getAttribute(attribute)-0);
	return 0;
}

function set(entity, attribute, value)
{
	var e = drawing.getElementById(entity);
	if(e != null)
		e.setAttribute(attribute,value);
}

function setText(entity, value)
{
	var e = drawing.getElementById(entity);
	if(e != null)
	{
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
}


function getText(entity, value)
{
	var e = drawing.getElementById(entity);
	if(e != null)
		if(e.firstChild)
			return	e.firstChild.nodeValue;
	return "";
}

function toPixels(drawingUnits)
{
	var height = drawing.getDocumentElement().getAttribute("height") - 0;
	var vb = new java.lang.String(drawing.getDocumentElement().getAttribute("viewBox"));
	var vbHeight = vb.substring(vb.lastIndexOf(' '))-0;
	return (height/vbHeight) * drawingUnits;
	
}

function getX(evt)
{
	var SVGRoot = drawing.getDocumentElement();
//	var width = SVGRoot.getAttribute("width") - 0;
//	var vb = new java.lang.String(SVGRoot.getAttribute("viewBox"));
//	var v = vb.split(' ');
//	var vbW = (v[2]-0) - (v[0] - 0);
	
	var scale = SVGRoot.getCurrentScale();
	var pan = SVGRoot.getCurrentTranslate();
	return (docWidthUM/docHeightPX) * (evt.getClientX()/scale + (( 0.0 - pan.x ) / scale));
}

function getY(evt)
{
	var SVGRoot = drawing.getDocumentElement();
//	var height = SVGRoot.getAttribute("height") - 0;
//	var vb = new java.lang.String(SVGRoot.getAttribute("viewBox"));
//	var v = vb.split(' ');
//	var vbH = (v[3]-0) - (v[1] - 0);
	
	var scale = SVGRoot.getCurrentScale();
	var pan = SVGRoot.getCurrentTranslate();
	return (docHeightUM/docHeightPX) * evt.getClientY()/scale + (( 0.0 - pan.y ) / scale);
}





function createDescription(subjectID, text)
{
	if(tn)
		return;

	var subject = drawing.getElementById(subjectID);
	if(subject == null)
	{
		alert("createDescription():  subject -" + subjectID + "- does not exist.");
		return;
	}
	var foo = subject.getAttribute("onmouseover");
	if(foo == null)
		foo = "";
	else
	{
		if(foo != "")
			foo = foo + ";";
	}
	subject.setAttribute("onmouseover",foo+"showDescription(evt,true)");
	foo = subject.getAttribute("onmouseout");
	if(foo == null)
		foo = "";
	else
		foo = foo + ";";

	subject.setAttribute("onmouseout",foo+"showDescription(evt,false)");
	
    var e = drawing.createElement("desc");
    
    e.setAttribute("id",subjectID + "_desc");

 	if(e == null)
	{
		alert("createDescription():  cannot create  -" + subjectID + "_desc-.");
		return;
	}   
    var textContent = drawing.createTextNode(text);
    e.appendChild(textContent);
	subject.appendChild(e);
 }
 
 function showDescription(evt,show)
{
	var id =  new java.lang.String(evt.getTarget().id);
	var e = drawing.getElementById("ELEMENT_DESCRIPTION");
	var eBox = drawing.getElementById("ELEMENT_DESCRIPTION_BOX");
	
	if(show)
	{
		var text = getText(id + "_desc");
		if(text.length < 70)
		{
			var x = 70 - text.length;
			for(;x>0;x--)
				text = text + " ";
		}
		if(text != "")
		{
		   if(e != null)
		   {
		   		e.setAttribute("x", 3 ); // getX(evt) + .5); 
		   		var showY = getY(evt);
		   		if(showY > (docHeightUM-2) || showY < 0 )
		   			showY = docHeightUM - 2;
		   		
		   		e.setAttribute("y", showY + 1.25);
				e.setAttribute("class","description");
		   		
		   		eBox.setAttribute("x", 2 ); // getX(evt) + .5); 
		   		eBox.setAttribute("y", showY );
				eBox.setAttribute("class","description");
		   		setText("ELEMENT_DESCRIPTION","ID: " + id + " " + text);
		   	}
		}
	}
	else
	{
		   if(e != null)
		   {
		   		setText("ELEMENT_DESCRIPTION","");
		   		e.setAttribute("class","hide");
		   		eBox.setAttribute("class","hide");
		   		
		   }
	}
	//evt.stopPropagation();

}
 
function adjustDocSize(w,h,wPage,hPage,p)
{
	docWidthPX = wPage;
	docHeightPX = hPage;
	docWidthUM = w;
	docHeightUM= h;
	
	tn = (docWidthPX <= 120 && docHeightPX <= 120);
	if(tn)
		p = 0;
	var doc = drawing.getDocumentElement();
	doc.setAttribute("viewBox","0 0 " + (w+p) + " " + (h+p));
	var docH = wPage*((h+p)/(w+p));
	if(docH <= hPage)
	{
		doc.setAttribute("width",wPage+"px");
		doc.setAttribute("height",docH+"px");
	//	alert("1111 " + wPage + "x" + docH);
		
	}
	else
	{
		docW = hPage*((w+p)/(h+p));
		doc.setAttribute("width",docW+"px");
		doc.setAttribute("height",hPage+"px");
	//	alert("22222 " + docW + "x" + hPage);
		
	}
} 

function createDim(x1,y1,x2,y2,showFeet)
{
	if(tn)
		return;
	
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
		rotate = 90;
	else
	if(y1 == y2)
		rotate = 0;
	else
		rotate = Math.round((Math.atan((y2-y1)/(x2-x1)))*180);  //TODO: this doesn't work!
	
	var rotateRev = rotate + 180;

	
	var l = Math.sqrt(((x2-x1)*(x2-x1)) + ((y2-y1)*(y2-y1)));
	var dimText = showFeet ? inchesToDim(l):getDim(l);

   	var g = drawing.createElementNS(svgNS,"g");
   	g.setAttribute("id","dims");
   	
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
 // create faint dashed line
    var line = drawing.createElementNS(svgNS,"line");
   	line.setAttribute("x1",x1);
  	line.setAttribute("x2",x2);
  	line.setAttribute("y1",y1);
  	line.setAttribute("y2",y2);
  	line.setAttribute("class","dim");

  	g.appendChild(line);

// create starting arrow  	
   	var g1= drawing.createElementNS(svgNS,"g");
   	g1.setAttribute("transform","translate("+x1+","+y1+")");
	var g2 = drawing.createElementNS(svgNS,"g");  
  	g2.setAttribute("transform","rotate("+rotate+")");
	var use = drawing.createElementNS(svgNS,"use");
	use.setAttributeNS(xlinkNS,"href","#arrow");
	g2.appendChild(use);
	g1.appendChild(g2);
	g.appendChild(g1);
	
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
	g.appendChild(g1);

// create text caption
	g1= drawing.createElementNS(svgNS,"g");
	if(rotate<0)
		rotate+=180;
   	g1.setAttribute("transform","rotate("+rotate+","+xC+","+yC+")");
	var text = drawing.createElementNS(svgNS,"text");
	text.setAttribute("x",xC);
	text.setAttribute("y",yC);
	text.setAttribute("class","dim");
	var textContent = drawing.createTextNode(dimText);
	text.appendChild(textContent);
	g1.appendChild(text);
	g.appendChild(g1);
	
	drawing.getElementById("window").appendChild(g);
}









