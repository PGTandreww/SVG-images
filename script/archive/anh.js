function getGrillePattern(type,wide,high)
{
	var pattern;

	switch(type)
	{
	case "RECT":
		pattern = (wide-1)+"V"+(high-1)+"H";
		break;
	case "PRA":
		if (wide == "TOP")
			{
				pattern = "P1T0B";
			}
		if (wide == "BTM")
			{
				pattern = "P0T1B";
			}
		if (wide == "TOPBTM")
			{	
				pattern = "P1T1B";
			}
		if (high == "LFT")
			{
				pattern += "1L0R";
			}
		if (high == "RGT")
			{
				pattern += "0L1R";
			}
		if (high == "LFTRGT")
			{	
				pattern += "1L1R";
			}
		break;
	case "DPRA":
		if (wide == "TOP")
			{
				pattern = "P2T0B";
			}
		if (wide == "BTM")
			{
				pattern = "P0T2B";
			}
		if (wide == "TOPBTM")
			{	
				pattern = "P2T2B";
			}
		if (high == "LFT")
			{
				pattern += "2L0R";
			}
		if (high == "RGT")
			{
				pattern += "0L2R";
			}
		if (high == "LFTRGT")
			{	
				pattern += "2L2R";
			}
		break;

	case "CRAFTSGLLDR":
		pattern = "C"+wide+"V"+high+"H1T";
		break;


	case "CRAFTDBLLDR":
		pattern = "C"+wide+"V"+high+"H2T";
		break;

	case "DIA":
		pattern = "D"+wide+"V"+high+"H";
		break;

	case "GOTHIC":
		pattern = "G" + wide;
		break;

	case "SEGHUB":
		pattern = "H"+wide+"V"+high+"H";
		break;

	default:
		break;

	}
	return pattern;
}

function getRadiusPattern(type,hubType,radiusBars,spokes)
{

	var pattern;
	switch(type)
	{
	case"SUN":
	
		switch(hubType)
		{
			case "OPEN":
				pattern = "S" + spokes + "A"+ radiusBars;
				break;
			case "CLOSED":
				pattern = "A" + radiusBars + "T" + spokes;
				break;
			case "SPLIT":
				pattern = "S" + spokes;
				if(radiusBars > 0)
				{
					pattern += "A"+ radiusBars;
				}
				pattern += "T1";

				break;
			default:
				pattern = "S" + spokes + "A"+ radiusBars;
				break;
		}
		break;
	case "SCAL":
		switch(hubType)
		{
			case "OPEN":
				pattern = "S" + spokes + "A"+ radiusBars;
				break;
			case "CLOSED":
				pattern = "A" + radiusBars + "T" + spokes;
				break;
			case "SPLIT":
				pattern = "S" + spokes;
				if(radiusBars > 0)
				{
					pattern += "A"+ radiusBars;
				}
				pattern += "T1";


				break;
			default:
				pattern = "S" + spokes + "A"+ radiusBars;
				break;
		}
		pattern+="C";
		break;
	
	case "GOTHIC":
		pattern = "G" + spokes;
		break;
		
	default:
		break;						

	}
	return pattern;

}
function getStandardWebColors(clr)
{
	var wbclr;
	switch(clr)
	{
		case "WHT":
				wbclr = "WHITE";
				break;
		case "WHTALM":
				wbclr = "WHITE";
				break;
		case "WHTBLK":
				wbclr = "WHITE";
				break;
		case "WHTBRZ":
				wbclr = "WHITE";
				break;								
		case "WHTCHA":
				wbclr = "WHITE";
				break;
		case "WHTGRN":
				wbclr = "WHITE";
				break;
		case "WHTSAND":
				wbclr = "WHITE";
				break;
		case "SAND":
				wbclr = "MOCCASIN";
				break;
		case "SANDWHT":
				wbclr = "MOCCASIN";
				break;
		case "BRZ":
				wbclr = "SIENNA";
				break;
		case "BRZH":
				wbclr = "SIENNA";
				break;
		case "BRZWHT":
				wbclr = "SIENNA";
				break;
		case "CLAY":
				wbclr = "MAROON";
				break;
		case "BRKRED":
				wbclr = "FIREBRICK";
				break;
		case "CRAN":
				wbclr = "DARKRED";
				break;
		case "EVRGRN":
				wbclr = "FORESTGREEN";
				break;
		case "GGRAY":
				wbclr = "LIGHTGRAY";
				break;
		case "PRIMED":
				wbclr = "WHITE";
				break;
		case "NSC":
				wbclr = "DARKVIOLET";
				break;
		case "PREFIN":
				wbclr = "WHITE";
				break;
		case "UNFIN":
				wbclr = "SANDYBROWN";
				break;
		case "N":
				wbclr = "SANDYBROWN";
				break;
		case "ALM":
				wbclr = "BLANCHEDALMOND";
				break;
		case "ALMWHT":
				wbclr = "BLANCHEDALMOND";
				break;
		case "BLKWHT":
				wbclr = "BLACK";
				break;
		case "BLK":
				wbclr = "BLACK";
				break;				
		case "BLK":
				wbclr = "BLACK";
				break;
		case "CHA":
				wbclr = "LINEN";
				break;
		case "CHAWHT":
				wbclr = "LINEN";
				break;
		case "GRN":
				wbclr = "GREEN";
				break;
		case "GRNWHT":
				wbclr = "GREEN";
				break;
		case "TTTAN":
				wbclr = "TAN";
				break;
		case "TAN":
				wbclr = "TAN";
				break;
		case "DRKBRN":
				wbclr = "SADDLEBROWN";
				break;
		default:
			wbclr = "RED";
			break;						
	}
	return wbclr;

}
function getHanding(hand)
{
var glass_hand;
	switch(hand)
	{
		case "LEFT":
				glass_hand = "L";
				break;
		case "RIGHT":
				glass_hand = "R";
				break;
		default:
			gls_hand = "";
			break;
	}
	return glass_hand;
}
function getGridThickness(thick)
{
var grid_thick;
	switch(thick)
	{
		case "3/4CONT":
				grid_thick = .75;
				break;
		case "7/8FLAT":
				 grid_thick = .875;
				break;
		case "7/8SDL":
				 grid_thick = .875;
				break;
		case "7/8SDLALUM":
				 grid_thick = .875;
				break;
		case "7/8SDLSB":
				 grid_thick = .875;
				break;
		case "7/8SDLSBALUM":
				 grid_thick = .875;
				break;
		case "1CONT":
				grid_thick = 1;
				break;
		case "1-1/8SDL":
				grid_thick = 1.125;
				break;
		case "1-1/8SDLSB":
				grid_thick = 1.125;
				break;
		case "1-5/16SDLSB":
				grid_thick = 1.3125;
				break;
		case "1-5/16SDL":
				grid_thick = 1.3125;
				break;
		case "2SDLSB":
				grid_thick = 2;
				break;
		case "2SDL":
				grid_thick = 2;
				break;
		default:
			grid_thick = .75;
			break;						
	}
	return grid_thick;

}

function initDhfxdFrame(id, x, y, w, h, f,fTop,fBot,fBal, color)
{
try
{
trace("initDhfxdFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+","+ fTop+","+ fBot+","+ fBal+",'"+ color+"')");

	var ws = w - (2*f);
	var hs = h - fTop - fBot;
	var ht = h - fTop;
	var hb = h - fBot;
	var hm = h - f;
	var fj;
	if (fTop  <= f)
	{
		fj = f-fTop;
	}
	else
	{
		fj = 0;
	}
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
	var path = "M "+x+","+y+" l "+w+",0 l -"+fTop+","+fTop+ " l -"+(w-(fTop*2))+",0 l -"+fTop+",-"+fTop+" ";


	top.setAttribute("d",path);
	top.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		top.setAttribute("class","frameTN");
	}
	else
	{	
		desc = "LENGTH: %W% ... %F% extrusion stock.";
		desc = desc.replace(/%W%/g,inchesToInchesDim(w));
		desc = desc.replace(/%F%/g,inchesToInchesDim(fTop));
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
	path = "M "+(x+f)+","+(y+h)+" l "+ws+",0 l 0,-"+fBot+ " l -"+ws+",0 l 0,"+fBot+ " ";

	bot.setAttribute("d",path);
	bot.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		bot.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %W% ... %F% extrusion stock.";
		desc = desc.replace(/%W%/g,inchesToInchesDim(w));
		desc = desc.replace(/%F%/g,inchesToInchesDim(fBot));
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
	
	path = "M "+x+","+(y)+" l 0,"+h+" l "+f+",0 l 0,-"+hm+" l -"+f+",-"+f+" M "+f+","+f+" l 0,"+hs+" "+fBal+",0 l 0,-"+hs+" -"+fBal+",0 ";

	left.setAttribute("d",path);
	left.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		left.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H% ... %F% extrusion stock.";
		desc = desc.replace(/%H%/g,inchesToInchesDim(h));
		desc = desc.replace(/%F%/g,inchesToInchesDim(f));
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
	path = "M "+(x+w)+","+(y)+" l 0,"+h+" l -"+f+",0 l 0,-"+hm+"  l "+f+",-"+f+" M "+(x+w-f)+","+(y+f)+" l 0,"+hs+" l -"+fBal+",0 l 0,-"+hs+" l "+fBal+",0 ";

	right.setAttribute("d",path);
	right.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		right.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H%  ... %F% extrusion stock.";
		desc = desc.replace(/%H%/g,inchesToInchesDim(h));
		desc = desc.replace(/%F%/g,inchesToInchesDim(f));
		createDescription(id+"_right_jamb",desc);
	
		desc = "WIDTH: %W% HEIGHT: %H% ... %F% extrusion stock.";
		desc = desc.replace(/%W%/g,inchesToInchesDim(w));
		desc = desc.replace(/%H%/g,inchesToInchesDim(h));
		desc = desc.replace(/%F%/g,inchesToInchesDim(f));

		createDescription(id,desc);
	}
}	
catch(e)
{
	alertUser("Exception:  initDhfxdFrame('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+","+ fTop+","+ fBot+","+ fBal+",'"+ color+"')");
	alertUser(e);
	trace(e);
}	
}

function initAvglcsmtSash(id, x, y, w, h, f, color)
{
try
{
trace("initAvglcsmtSash('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+",'"+ color+"')");

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
	var path = "M %X%,%Y% l %WS%,0 l 0,%F% l -%WS%,0 l 0,-%F%";
	path=path.replace(/%X%/g,x+f);
	path=path.replace(/%Y%/g,y);
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
		desc = desc.replace(/%W%/g,inchesToInchesDim(w));
		desc = desc.replace(/%F%/g,inchesToInchesDim(f));
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
	path = "M %X%,%Y% l %WS%,0 l 0,-%F% l -%WS%,0 l 0,%F%";
	path=path.replace(/%X%/g,x+f);
	path=path.replace(/%Y%/g,y+h);
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
		desc = desc.replace(/%W%/g,inchesToInchesDim(w));
		desc = desc.replace(/%F%/g,inchesToInchesDim(f));
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
		desc = desc.replace(/%H%/g,inchesToInchesDim(h));
		desc = desc.replace(/%F%/g,inchesToInchesDim(f));
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
	}
	path = "M %X%,%Y% l 0,%HL% l -%F%,0 l 0,-%HL% l %F%,0";
	path=path.replace(/%X%/g,x+w);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%HL%/g,h);
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
		desc = desc.replace(/%H%/g,inchesToInchesDim(h));
		desc = desc.replace(/%F%/g,inchesToInchesDim(f));
		createDescription(id+"_right_stile",desc);
	
		desc = "WIDTH: %W% HEIGHT: %H% ... %F% extrusion stock.";
		desc = desc.replace(/%W%/g,inchesToInchesDim(w));
		desc = desc.replace(/%H%/g,inchesToInchesDim(h));
		desc = desc.replace(/%F%/g,inchesToInchesDim(f));

		createDescription(id,desc);
	}
}	
catch(e)
{
	alertUser("Exception:  initAvglcsmtSash('"+id+"',"+x+","+ y+","+ w+","+ h+","+ f+",'"+ color+"')");
	alertUser(e);
	trace(e);
}	
}

function initAvgltopSash(id, x, y, w, h, swt, stt, sbt, color)
{
try
{
trace("initAvgltopSash('"+id+"',"+x+","+ y+","+ w+","+ h+","+ swt+","+ stt+","+ sbt+",'"+ color+"')");
	var tn = g("tn") == "true";
	var idPrefix = g("f_idprefix");

	var ws = w - (2*swt);
	var wt = w - swt;
	var hs = h - stt-sbt;
	var ht = h - stt + (swt-sbt);
	var hb = h - sbt;
	var desc = "";
	
	// sash group
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
	var path = "M %X%,%Y% l %WL%,0 l 0,%STT% l -%WL%,0 l 0,-%STT%";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%WL%/g,w);
	path=path.replace(/%WS%/g,ws);
	path=path.replace(/%STT%/g,stt);
	top.setAttribute("d",path);
	top.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		top.setAttribute("class","frameTN");
	}
	else
	{	
		desc = "LENGTH: %W% ... %STT% extrusion stock.";
		desc = desc.replace(/%W%/g,inchesToInchesDim(w));
		desc = desc.replace(/%STT%/g,inchesToInchesDim(stt));
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
	path = "M %X%,%Y% l %WL%,0 l 0,-%SBT% l -%WL%,0 l 0,%SBT%";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y+h);
	path=path.replace(/%WL%/g,w);
	path=path.replace(/%WS%/g,ws);
	path=path.replace(/%SBT%/g,sbt);
	bot.setAttribute("d",path);
	bot.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		bot.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %W% ... %SBT% extrusion stock.";
		desc = desc.replace(/%W%/g,inchesToInchesDim(w));
		desc = desc.replace(/%SBT%/g,inchesToInchesDim(sbt));
		createDescription(id+"_lock_rail",desc);


		if(applet)
		{
			applet.registerHorzElement(idPrefix+id+"_lock_rail",
										"",
										y +"", 	
										sbt + "",
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
	
	path = "M %X%,%Y% l 0,%HS% l %SWT%,0 l 0,-%HS% l -%SWT%,0";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y+stt);
	path=path.replace(/%HS%/g,hs);
	path=path.replace(/%SWT%/g,swt);
	left.setAttribute("d",path);
	left.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		left.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H% ... %SWT% extrusion stock.";
		desc = desc.replace(/%H%/g,inchesToInchesDim(h));
		desc = desc.replace(/%SWT%/g,inchesToInchesDim(swt));
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
	path = "M %X%,%Y% l 0,%HS% l -%SWT%,0 l 0,-%HS% l %SWT%,0";
	path=path.replace(/%X%/g,x+w);
	path=path.replace(/%Y%/g,y+stt);
	path=path.replace(/%HS%/g,hs);
	path=path.replace(/%SWT%/g,swt);
	right.setAttribute("d",path);
	right.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		right.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H%  ... %SWT% extrusion stock.";
		desc = desc.replace(/%H%/g,inchesToInchesDim(h));
		desc = desc.replace(/%SWT%/g,inchesToInchesDim(swt));
		createDescription(id+"_right_stile",desc);
	
		desc = "WIDTH: %W% HEIGHT: %H% ... %SWT% extrusion stock.";
		desc = desc.replace(/%W%/g,inchesToInchesDim(w));
		desc = desc.replace(/%H%/g,inchesToInchesDim(h));
		desc = desc.replace(/%SWT%/g,inchesToInchesDim(swt));

		createDescription(id,desc);
		//grp.setAttribute("onmousedown","showDescription(evt,true)");
		//grp.setAttribute("onmouseup","showDescription(evt,false)");
	}
}	
catch(e)
{
	alertUser("Exception:  initAvgltopSash('"+id+"',"+x+","+ y+","+ w+","+ h+","+ swt+","+ stt+","+ sbt+",'"+ color+"')");
	alertUser(e);
	trace(e);
}	
}

function initAvglbotSash(id, x, y, w, h, swb, stb, sbb, color)
{
try
{
trace("initAvglbotSash('"+id+"',"+x+","+ y+","+ w+","+ h+","+ swb+","+ stb+","+ sbb+",'"+ color+"')");
	var tn = g("tn") == "true";
	var idPrefix = g("f_idprefix");

	var ws = w - (2*swb);
	var wt = w - swb;
	var hs = h - stb-sbb;
	var ht = h - sbb + (swb-stb);
	var hb = h - stb;
	var desc = "";
	
	// sash group
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
	var path = "M %X%,%Y% l %WL%,0 l 0,%STB% l -%WL%,0 l 0,-%STB%";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%WL%/g,w);
	path=path.replace(/%WS%/g,ws);
	path=path.replace(/%STB%/g,stb);
	top.setAttribute("d",path);
	top.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		top.setAttribute("class","frameTN");
	}
	else
	{	
		desc = "LENGTH: %W% ... %STB% extrusion stock.";
		desc = desc.replace(/%W%/g,inchesToInchesDim(w));
		desc = desc.replace(/%STB%/g,inchesToInchesDim(stb));
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
	path = "M %X%,%Y% l %WL%,0 l 0,-%SBB% l -%WL%,0 l 0,%SBB%";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y+h);
	path=path.replace(/%WL%/g,w);
	path=path.replace(/%WS%/g,ws);
	path=path.replace(/%SBB%/g,sbb);
	bot.setAttribute("d",path);
	bot.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		bot.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %W% ... %SBB% extrusion stock.";
		desc = desc.replace(/%W%/g,inchesToInchesDim(w));
		desc = desc.replace(/%SBB%/g,inchesToInchesDim(sbb));
		createDescription(id+"_lock_rail",desc);


		if(applet)
		{
			applet.registerHorzElement(idPrefix+id+"_lock_rail",
										"",
										y +"", 	
										sbb + "",
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
	
	path = "M %X%,%Y% l 0,%HS% l %SWB%,0 l 0,-%HS% l -%SWB%,0";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y+stb);
	path=path.replace(/%HS%/g,hs);
	path=path.replace(/%SWB%/g,swb);
	left.setAttribute("d",path);
	left.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		left.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H% ... %SWB% extrusion stock.";
		desc = desc.replace(/%H%/g,inchesToInchesDim(h));
		desc = desc.replace(/%SWB%/g,inchesToInchesDim(swb));
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
	path = "M %X%,%Y% l 0,%HS% l -%SWB%,0 l 0,-%HS% l %SWB%,0";
	path=path.replace(/%X%/g,x+w);
	path=path.replace(/%Y%/g,y+stb);
	path=path.replace(/%HS%/g,hs);
	path=path.replace(/%SWB%/g,swb);
	right.setAttribute("d",path);
	right.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		right.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H%  ... %SWB% extrusion stock.";
		desc = desc.replace(/%H%/g,inchesToInchesDim(h));
		desc = desc.replace(/%SWB%/g,inchesToInchesDim(swb));
		createDescription(id+"_right_stile",desc);
	
		desc = "WIDTH: %W% HEIGHT: %H% ... %SWB% extrusion stock.";
		desc = desc.replace(/%W%/g,inchesToInchesDim(w));
		desc = desc.replace(/%H%/g,inchesToInchesDim(h));
		desc = desc.replace(/%SWB%/g,inchesToInchesDim(swb));

		createDescription(id,desc);
		//grp.setAttribute("onmousedown","showDescription(evt,true)");
		//grp.setAttribute("onmouseup","showDescription(evt,false)");
	}
}	
catch(e)
{
	alertUser("Exception:  initAvglbotSash('"+id+"',"+x+","+ y+","+ w+","+ h+","+ swb+","+ sbt+","+ sbb+",'"+ color+"')");
	alertUser(e);
	trace(e);
}	
}

function initCvtopSash(id, x, y, w, h, swt, stt, sbt, color)
{
try
{
trace("initCvtopSash('"+id+"',"+x+","+ y+","+ w+","+ h+","+ swt+","+ stt+","+ sbt+",'"+ color+"')");
	var tn = g("tn") == "true";
	var idPrefix = g("f_idprefix");

	var ws = w - (2*swt);
	var wt = w - swt;
	var hs = h - stt-sbt;
	var ht = h - stt + (swt-sbt);
	var hb = h - sbt;
	var desc = "";
	
	// sash group
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
	var path = "M %X%,%Y% l %WS%,0 l 0,%STT% l -%WS%,0 l 0,-%STT%";
	path=path.replace(/%X%/g,x+swt);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%WL%/g,w);
	path=path.replace(/%WS%/g,ws);
	path=path.replace(/%STT%/g,stt);
	top.setAttribute("d",path);
	top.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		top.setAttribute("class","frameTN");
	}
	else
	{	
		desc = "LENGTH: %W% ... %STT% extrusion stock.";
		desc = desc.replace(/%W%/g,inchesToInchesDim(w));
		desc = desc.replace(/%STT%/g,inchesToInchesDim(stt));
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
	path = "M %X%,%Y% l %WL%,0 l -%SBT%,-%SBT% l -%WT%,0 l -%SBT%,%SBT%";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y+h);
	path=path.replace(/%WL%/g,w);
	path=path.replace(/%WT%/g,wt);
	path=path.replace(/%SBT%/g,sbt);
	bot.setAttribute("d",path);
	bot.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		bot.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %W% ... %SBT% extrusion stock.";
		desc = desc.replace(/%W%/g,inchesToInchesDim(w));
		desc = desc.replace(/%SBT%/g,inchesToInchesDim(sbt));
		createDescription(id+"_lock_rail",desc);


		if(applet)
		{
			applet.registerHorzElement(idPrefix+id+"_lock_rail",
										"",
										y +"", 	
										sbt + "",
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
	
	path = "M %X%,%Y% l 0,%HL% l %SBT%,-%SBT% l %SBTM%,0 l 0,-%HT% l -%SWT%,0";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%HL%/g,h);
	path=path.replace(/%HT%/g,ht);
	path=path.replace(/%SBT%/g,sbt);
	path=path.replace(/%SWT%/g,swt);
	path=path.replace(/%SBTM%/g,swt-sbt);
	left.setAttribute("d",path);
	left.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		left.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H% ... %SWT% extrusion stock.";
		desc = desc.replace(/%H%/g,inchesToInchesDim(h));
		desc = desc.replace(/%SWT%/g,inchesToInchesDim(swt));
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
	path = "M %X%,%Y% l 0,%HL% l -%SBT%,-%SBT% l -%SBTM%,0 l 0,-%HT% l %SWT%,0";
	path=path.replace(/%X%/g,x+w);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%HL%/g,h);
	path=path.replace(/%HT%/g,ht);
	path=path.replace(/%SWT%/g,swt);
	path=path.replace(/%SBT%/g,sbt);
	path=path.replace(/%SBTM%/g,swt-sbt);	
	right.setAttribute("d",path);
	right.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		right.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H%  ... %SWT% extrusion stock.";
		desc = desc.replace(/%H%/g,inchesToInchesDim(h));
		desc = desc.replace(/%SWT%/g,inchesToInchesDim(swt));
		createDescription(id+"_right_stile",desc);
	
		desc = "WIDTH: %W% HEIGHT: %H% ... %SWT% extrusion stock.";
		desc = desc.replace(/%W%/g,inchesToInchesDim(w));
		desc = desc.replace(/%H%/g,inchesToInchesDim(h));
		desc = desc.replace(/%SWT%/g,inchesToInchesDim(swt));

		createDescription(id,desc);
		//grp.setAttribute("onmousedown","showDescription(evt,true)");
		//grp.setAttribute("onmouseup","showDescription(evt,false)");
	}
}	
catch(e)
{
	alertUser("Exception:  initCvtopSash('"+id+"',"+x+","+ y+","+ w+","+ h+","+ swt+","+ stt+","+ sbt+",'"+ color+"')");
	alertUser(e);
	trace(e);
}	
}

function initCvbotSash(id, x, y, w, h, swb, stb, sbb, color)
{
try
{
trace("initCvbotSash('"+id+"',"+x+","+ y+","+ w+","+ h+","+ swb+","+ stb+","+ sbb+",'"+ color+"')");
	var tn = g("tn") == "true";
	var idPrefix = g("f_idprefix");

	var ws = w - (2*swb);
	var wt = w - swb;
	var hs = h - stb-sbb;
	var ht = h - sbb + (swb-stb);
	var hb = h - stb;
	var desc = "";
	
	// sash group
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
	var path = "M %X%,%Y% l %WL%,0 l -%STB%,%STB% l -%WT%,0 l -%STB%,-%STB%";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%WL%/g,w);
	path=path.replace(/%WT%/g,wt);
	path=path.replace(/%STB%/g,stb);
	top.setAttribute("d",path);
	top.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		top.setAttribute("class","frameTN");
	}
	else
	{	
		desc = "LENGTH: %W% ... %STB% extrusion stock.";
		desc = desc.replace(/%W%/g,inchesToInchesDim(w));
		desc = desc.replace(/%STB%/g,inchesToInchesDim(stb));
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
	path = "M %X%,%Y% l %WS%,0 l 0,-%SBB% l -%WS%,0 l 0,%SBB%";
	path=path.replace(/%X%/g,x+swb);
	path=path.replace(/%Y%/g,y+h);
	path=path.replace(/%WL%/g,w);
	path=path.replace(/%WS%/g,ws);
	path=path.replace(/%SBB%/g,sbb);
	bot.setAttribute("d",path);
	bot.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		bot.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %W% ... %SBB% extrusion stock.";
		desc = desc.replace(/%W%/g,inchesToInchesDim(w));
		desc = desc.replace(/%SBB%/g,inchesToInchesDim(sbb));
		createDescription(id+"_lock_rail",desc);


		if(applet)
		{
			applet.registerHorzElement(idPrefix+id+"_lock_rail",
										"",
										y +"", 	
										sbb + "",
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
	
	path = "M %X%,%Y% l 0,%HL% l %SWB%,0 l 0,-%HB% l -%SWB%,-%SWB%";
	path=path.replace(/%X%/g,x);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%HL%/g,h);
	path=path.replace(/%HB%/g,hb);
	path=path.replace(/%SWB%/g,swb);
	left.setAttribute("d",path);
	left.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		left.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H% ... %SWB% extrusion stock.";
		desc = desc.replace(/%H%/g,inchesToInchesDim(h));
		desc = desc.replace(/%SWB%/g,inchesToInchesDim(swb));
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
	path = "M %X%,%Y% l 0,%HL% l -%SWB%,0 l 0,-%HB% l %SWB%,-%SWB%";
	path=path.replace(/%X%/g,x+w);
	path=path.replace(/%Y%/g,y);
	path=path.replace(/%HL%/g,h);
	path=path.replace(/%HB%/g,hb);
	path=path.replace(/%SWB%/g,swb);
	right.setAttribute("d",path);
	right.getStyle().setProperty("fill",color,"");
	if(tn)
	{
		right.setAttribute("class","frameTN");
	}
	else
	{
		desc = "LENGTH: %H%  ... %SWB% extrusion stock.";
		desc = desc.replace(/%H%/g,inchesToInchesDim(h));
		desc = desc.replace(/%SWB%/g,inchesToInchesDim(swb));
		createDescription(id+"_right_stile",desc);
	
		desc = "WIDTH: %W% HEIGHT: %H% ... %SWB% extrusion stock.";
		desc = desc.replace(/%W%/g,inchesToInchesDim(w));
		desc = desc.replace(/%H%/g,inchesToInchesDim(h));
		desc = desc.replace(/%SWB%/g,inchesToInchesDim(swb));

		createDescription(id,desc);
		//grp.setAttribute("onmousedown","showDescription(evt,true)");
		//grp.setAttribute("onmouseup","showDescription(evt,false)");
	}
}	
catch(e)
{
	alertUser("Exception:  initCvBotSash('"+id+"',"+x+","+ y+","+ w+","+ h+","+ swb+","+ stb+","+ sbb+",'"+ color+"')");
	alertUser(e);
	trace(e);
}	
}

function calloutToInches(callout)
{
	var dim = callout.replace(/-/,"\'")+"\"";
	return dimToInches(dim);
}

