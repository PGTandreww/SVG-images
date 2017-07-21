// $import="fc.js"
// $import="elliptical.js"
// $import="rect.js"
// $return$

function generate(evt)
{

// $initialize$
// height and width are computed, so reinitialize these variables.
	if(color == "ALMOND")
	{
		s("color","TAN");
	}

//NOTE:  The "applet" can an instance of either:
//		1) viewer applet (com.fc.drawings.SvgViewer)
//		2) mulled set (com.fc.drawings.MulledSet)
//		Both support the same interface.
	
// Register the overall window set so mulling seams can be
// alignment points.

switch(layout)
{
		case "2X2": arrange2X2(); break;
		case "4X1": arrange4X1(); break;
		case "1X4": arrange1X4(); break;
		case "1C3": arrange1O3(true); break;
		case "1O3": arrange1O3(false); break;

		default:
			break;
	}
	
	if(f_applet == "true")
	{
		applet.embedDocs();
	}
	
	returnConfigData();
}


function calculateDimensions()
{

	switch(g("layout"))
	{
	case "2X2":
		s("height",gN("mull_thk")+
					Math.max(gN("height1")+gN("height3"),gN("height2")+gN("height4")));
		s("width",gN("mull_thk")+
				Math.max(gN("width1")+gN("width2"),gN("width3")+gN("width4")));
		break;	
	case "1X4":
		s("width",Math.max(gN("width4"),Math.max(gN("width3"),Math.max(gN("width1"),gN("width2")))));
		s("height",(gN("mull_thk")*3)
					+gN("height1")
					+gN("height2")
					+gN("height3")
					+gN("height4"));
		break;

	case "4X1":
		s("height",Math.max(gN("height4"),Math.max(gN("height3"),Math.max(gN("height1"),gN("height2")))));
		s("width",(gN("mull_thk")*3)
					+gN("width1")
					+gN("width2")
					+gN("width3")
					+gN("width4"));
		break;

	case "1C3":
	case "1O3":
		s("height",gN("height4")
				+gN("mull_thk")
				+Math.max(gN("height3"),Math.max(gN("height1"),gN("height2"))));
		s("width",(gN("mull_thk")*2)
					+ gN("width1")
					+gN("width2")
					+gN("width3"));
		break;

		
	default:
		break;
	}
}


function arrange2X2()
{
// top/left unit
	var color = g("color");
	var x = 0;
	var y = 0;
	var w = gN("width3");
	var h = gN("height3");
	var mull_thk = gN("mull_thk");
	var width = gN("width");
	var height = gN("height");
	
	embedSubmodel(3,x,y,w,h);
	if(mull_thk != 0)
	{
		initRect("MV1",x+w,y,mull_thk,h,color);
	}
	createDim(-5,y,-5,y+h,false);	
// top/right unit
	x = x+w+mull_thk;
	w = gN("width4");
	h = gN("height4");

	embedSubmodel(4,x,y,w,h);

	if(mull_thk != 0)
	{
	initRect("MH1",0,y+h,width,mull_thk,color);
	}	
// bottom/left unit
	x = 0;
	y = y+h+mull_thk;
	w = gN("width1");
	h = gN("height1");

	embedSubmodel(1,x,y,w,h);
	
	createDim(-5,y,-5,y+h,false);
	createDim(x,height+5,x+w,height+5,false);
	if(mull_thk != 0)
	{
	initRect("MV2",x+w,y,mull_thk,h,color);
	}		
// bottom/right unit
	x = x+w+mull_thk;
	
	w = gN("width2");
	h = gN("height2");
	
	embedSubmodel(2,x,y,w,h);
	
	createDim(x,height+5,x+w,height+5,false);
	createDim(width+5,0,width+5,height,false);
	createDim(0,-5,width,-5,false);
}

function arrange1X4()
{
// top unit
	var color = g("color");
	var x = 0;
	var y = 0;
	var w = gN("width4");
	var h = gN("height4");
	var mull_thk = gN("mull_thk");
	var width = gN("width");
	var height = gN("height");
	
	embedSubmodel(1,x,y,w,h);

	createDim(-5,y,-5,y+h,false);
	if(mull_thk != 0)
	{
	initRect("MH1",x,y+h,w,mull_thk,color);
	}	
// top/middle unit
	 x = 0;
	 y = y+h+mull_thk;
	 w = gN("width3");
	 h = gN("height3");
	
	embedSubmodel(3,x,y,w,h);

	createDim(-5,y,-5,y+h,false);
	if(mull_thk != 0)
	{
	initRect("MH2",x,y+h,w,mull_thk,color);
	}

// bottom/middle unit
	x = 0;
	y = y+h+mull_thk;
	w = gN("width2");
	h = gN("height2");
	
	embedSubmodel(2,x,y,w,h);

	createDim(-5,y,-5,y+h,false);
	if(mull_thk != 0)
	{
	initRect("MH3",x,y+h,w,mull_thk,color);
	}
// bottom unit
	x = 0;
	y = y+h+mull_thk;
	w = gN("width1");
	h = gN("height1");

	embedSubmodel(1,x,y,w,h);
	
	createDim(x,height+5,x+w,height+5,false);
	createDim(-5,y,-5,y+h,false);
	createDim(width+5,0,width+5,height,false);
}


function arrange4X1()
{
	var color = g("color");
// left unit
	var x = 0;
	var y = 0;
	var w = gN("width1");
	var h = gN("height1");
	var mull_thk = gN("mull_thk");
	var width = gN("width");
	var height = gN("height");
	
	embedSubmodel(1,x,y,w,h);

	createDim(x,height+5,x+w,height+5,false);
	if(mull_thk != 0)
	{
	initRect("MV1",x+w,y,mull_thk,h,color);
	}	
	
// left/center unit
	x = x+w+mull_thk;
	y = 0;
	w = gN("width2");
	h = gN("height2");
	embedSubmodel(2,x,y,w,h);
	createDim(x,height+5,x+w,height+5,false);
	if(mull_thk != 0)
	{
	initRect("MV2",x+w,y,mull_thk,h,color);
	}	
	
// right/center unit
	x = x+w+v_mull_thk;
	y = 0;
	w = gN("width3");
	h = gN("height3");
	embedSubmodel(3,x,y,w,h);

	createDim(x,height+5,x+w,height+5,false);
	if(v_mull_thk != 0)
	{
	initRect("MV3",x+w,y,mull_thk,h,color);
	}	
	
// right unit
	x = x+w+mull_thk;
	y = 0;
	w = gN("width4");
	h = gN("height4");
	embedSubmodel(4,x,y,w,h);
	createDim(x,height+5,x+w,height+5,false);
	createDim(width+5,0,width+5,height,false);
	createDim(0,-5,width,-5,false);
}

function arrange1O3(centered)
{
	var color = g("color");
// top unit
	var y = 0;
	var w = gN("width4");
	var h = gN("height4");
	var mull_thk = gN("mull_thk");
	var width = gN("width");
	var height = gN("height");
	var x = centered?(width-w)/2 : 0;
	
	embedSubmodel(4,x,y,w,h);

	createDim(0,-5,width,-5,false);
	createDim(-5,y,-5,y+h,false);
	if(mull_thk != 0)
	{
	initRect("MH1",x,y+h,w,mull_thk,color);
	}	
	
	// left unit
	x = 0;
	y = h+mull_thk;
	w = gN("width1");
	h = gN("height1");
	embedSubmodel(1,x,y,w,h);

	createDim(x,height+5,x+w,height+5,false);
	createDim(-5,y,-5,y+h,false);
	if(mull_thk != 0)
	{
	initRect("MV1",x+w,y,mull_thk,h,color);
	}
			
	// center unit
	x = x+w+mull_thk;
	
	w = gN("width2");
	h = gN("height2");
	embedSubmodel(2,x,y,w,h);

	createDim(x,height+5,x+w,height+5,false);
	if(mull_thk != 0)
	{
	initRect("MV2",x+w,y,mull_thk,h,color);
	}

	// right unit
	x = x+w+mull_thk;
	
	w = gN("width3");
	h = gN("height3");

	embedSubmodel(3,x,y,w,h);

	createDim(x,height+5,x+w,height+5,false);
	createDim(width+5,0,width+5,height,false);

}



function align()
{
	if(g("alignment") != "A")
	{
		return;
	}
	trace("ALIGNING ORDER #" + g("f_order"));

	var mulledSet = MulledSet.getInstance(g("f_order"));
	trace("Got to function Align");
	trace("ALIGNING ORDER #" + g("f_order"));

	var mulledSet = MulledSet.getInstance(g("f_order"));

  var modelsetID = g("f_pn")+"";
   
    
switch(g("layout"))
{
		case "2X2": 
		if(mulledSet.getUnit(3).getVar("f_pn") == "PW")
		{
			mulledSet.getUnit(1).vertAlignTo(mulledSet.getUnit(3),"LR","Center",0);
		}
		else
		{
			mulledSet.getUnit(3).vertAlignTo(mulledSet.getUnit(1),"LR","Center",0);
		}
		if(mulledSet.getUnit(4).getVar("f_pn") == "PW")
		{
			mulledSet.getUnit(2).vertAlignTo(mulledSet.getUnit(4),"LR","Center",0);
		}
		else
		{
			mulledSet.getUnit(4).vertAlignTo(mulledSet.getUnit(2),"LR","Center",0);
		}
		if(mulledSet.getUnit(2).getVar("f_pn") == "PW")
		{
		    mulledSet.getUnit(1).horzAlignTo(mulledSet.getUnit(2),"BT","Center",0);
    	}
    	else
    	{
			mulledSet.getUnit(2).horzAlignTo(mulledSet.getUnit(1),"BT","Center",0);
		}
		if(mulledSet.getUnit(4).getVar("f_pn") == "PW")
		{
			mulledSet.getUnit(3).horzAlignTo(mulledSet.getUnit(4),"BT","Center",0);
		}
		else
		{
			mulledSet.getUnit(4).horzAlignTo(mulledSet.getUnit(3),"BT","Center",0);
		}
 		 		break;
			break;
		case "4X1": 
		if(mulledSet.getUnit(2).getVar("f_pn") == "PW")
		{
			mulledSet.getUnit(1).horzAlignTo(mulledSet.getUnit(2),"BT","Center",0);
			mulledSet.getUnit(3).horzAlignTo(mulledSet.getUnit(2),"BT","Center",0);
			mulledSet.getUnit(4).horzAlignTo(mulledSet.getUnit(2),"BT","Center",0);
		}
		else
		if(mulledSet.getUnit(3).getVar("f_pn") == "PW")
		{
			mulledSet.getUnit(1).horzAlignTo(mulledSet.getUnit(3),"BT","Center",0);
			mulledSet.getUnit(2).horzAlignTo(mulledSet.getUnit(3),"BT","Center",0);
			mulledSet.getUnit(4).horzAlignTo(mulledSet.getUnit(3),"BT","Center",0);
		}
		else
		if(mulledSet.getUnit(4).getVar("f_pn") == "PW")
		{
			mulledSet.getUnit(1).horzAlignTo(mulledSet.getUnit(4),"BT","Center",0);
			mulledSet.getUnit(2).horzAlignTo(mulledSet.getUnit(4),"BT","Center",0);
			mulledSet.getUnit(3).horzAlignTo(mulledSet.getUnit(4),"BT","Center",0);
		}		
		else
		{
			mulledSet.getUnit(2).horzAlignTo(mulledSet.getUnit(1),"BT","Center",0);
			mulledSet.getUnit(3).horzAlignTo(mulledSet.getUnit(1),"BT","Center",0);
			mulledSet.getUnit(4).horzAlignTo(mulledSet.getUnit(1),"BT","Center",0);
		}		

		
			break;
		case "1X4": 
		if(mulledSet.getUnit(3).getVar("f_pn") == "PW")
		{ 
			mulledSet.getUnit(2).horzAlignTo(mulledSet.getUnit(3),"BT","Center",0);
			mulledSet.getUnit(4).horzAlignTo(mulledSet.getUnit(3),"BT","Center",0);
			mulledSet.getUnit(5).horzAlignTo(mulledSet.getUnit(3),"BT","Center",0);
		}
		else
		if(mulledSet.getUnit(4).getVar("f_pn") == "PW")
		{ 
			mulledSet.getUnit(2).horzAlignTo(mulledSet.getUnit(4),"BT","Center",0);
			mulledSet.getUnit(3).horzAlignTo(mulledSet.getUnit(4),"BT","Center",0);
			mulledSet.getUnit(5).horzAlignTo(mulledSet.getUnit(4),"BT","Center",0);
		}		
		else
		if(mulledSet.getUnit(5).getVar("f_pn") == "PW")
		{ 
			mulledSet.getUnit(2).horzAlignTo(mulledSet.getUnit(5),"BT","Center",0);
			mulledSet.getUnit(3).horzAlignTo(mulledSet.getUnit(5),"BT","Center",0);
			mulledSet.getUnit(4).horzAlignTo(mulledSet.getUnit(5),"BT","Center",0);
		}
		else
		{ 
			mulledSet.getUnit(3).horzAlignTo(mulledSet.getUnit(2),"BT","Center",0);
			mulledSet.getUnit(4).horzAlignTo(mulledSet.getUnit(2),"BT","Center",0);
			mulledSet.getUnit(5).horzAlignTo(mulledSet.getUnit(2),"BT","Center",0);
		}		
		if(mulledSet.getUnit(2).getVar("f_pn") == "PW")
		{ 
			mulledSet.getUnit(1).vertAlignTo(mulledSet.getUnit(2),"LR","Center",0);
		}
		else
		{
			mulledSet.getUnit(2).vertAlignTo(mulledSet.getUnit(1),"LR","Center",0);
		}
		if(mulledSet.getUnit(3).getVar("f_pn") == "PW")
		{ 
			mulledSet.getUnit(1).vertAlignTo(mulledSet.getUnit(3),"LR","Center",0);
		}
		else
		{
			mulledSet.getUnit(3).vertAlignTo(mulledSet.getUnit(1),"LR","Center",0);
		}		
		if(mulledSet.getUnit(4).getVar("f_pn") == "PW")
		{ 
			mulledSet.getUnit(1).vertAlignTo(mulledSet.getUnit(4),"LR","Center",0);
		}
		else
		{
			mulledSet.getUnit(4).vertAlignTo(mulledSet.getUnit(1),"LR","Center",0);
		}
		if(mulledSet.getUnit(5).getVar("f_pn") == "PW")
		{ 
			mulledSet.getUnit(1).vertAlignTo(mulledSet.getUnit(5),"LR","Center",0);
		}
		else
		{
			mulledSet.getUnit(5).vertAlignTo(mulledSet.getUnit(1),"LR","Center",0);
		}
	        break;
		case "1O3": 
			if(mulledSet.getUnit(2).getVar("f_pn") == "PW")
			{
				mulledSet.getUnit(1).horzAlignTo(mulledSet.getUnit(2),"BT","Center",0);
				mulledSet.getUnit(3).horzAlignTo(mulledSet.getUnit(2),"BT","Center",0);
			}
			mulledSet.getUnit(1).vertAlignTo(mulledSet.getUnit(4),"LR","Center",0);
			mulledSet.getUnit(2).vertAlignTo(mulledSet.getUnit(4),"LR","Center",0);
			mulledSet.getUnit(3).vertAlignTo(mulledSet.getUnit(4),"LR","Center",0);
		
			break;
		case "1C3": 
		mulledSet.getUnit(4).vertAlignTo(mulledSet.getUnit(2),"LR","Center",0);

		if(mulledSet.getUnit(2).getVar("f_pn") == "PW")
		{
			mulledSet.getUnit(1).horzAlignTo(mulledSet.getUnit(2),"BT","Center",0);
			mulledSet.getUnit(3).horzAlignTo(mulledSet.getUnit(2),"BT","Center",0);
		}
		else
		{
				mulledSet.getUnit(2).horzAlignTo(mulledSet.getUnit(1),"BT","Center",0);
        mulledSet.getUnit(3).horzAlignTo(mulledSet.getUnit(1),"BT","Center",0);

		}
		 break;

		default:
			break;
	}
	
}

