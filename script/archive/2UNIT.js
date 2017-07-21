// $import="fc.js"
// $import="elliptical.js"
// $import="rect.js"
// $return$

function generate(evt)
{

// $initialize$
// height and width are computed, so reinitialize these variables.
	height=gN("height");
	width=gN("width");
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
		case "2X1": arrange2X1(); break;
		case "1X2": arrange1X2(); break;

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
	case "2X1":
		s("height",Math.max(gN("height2"),gN("height2")));
		s("width",gN("width1")+gN("mull_thk")+gN("width2"));
		break;	
	case "1X2":
		s("width",Math.max(gN("width1"),gN("width2")));
		s("height",gN("height1")+gN("mull_thk")+gN("height2"));
		break;
	default:
		break;
	}
}


function arrange1X2()
{
// top unit
	var x = 0;
	var y = 0;
	var w = gN("width2");
	var h = gN("height2");
	var mull_thk = gN("mull_thk");
	var width = gN("width");
	var height = gN("height");
	
	embedSubmodel(2,x,y,w,h);

	createDim(-5,y,-5,y+h,false);
	if(mull_thk != 0)
	{
		initRect("MH1",x,y+h,w,mull_thk,g("color"));
	}
// bottom unit
	x = 0;
	y = h+mull_thk;
	w = gN("width1");
	h = gN("height1");
	
	embedSubmodel(1,x,y,w,h);

	createDim(x,height+3,x+w,height+3,false);
	createDim(-5,y,-5,y+h,false);
	createDim(width+5,0,width+5,height,false);
}

function arrange2X1()
{
// left unit
	var x = 0;
	var y = 0;
	var w = gN("width1");
	var h = gN("height1");
	var mull_thk = gN("mull_thk");
	var width = gN("width");
	var height = gN("height");
	
	embedSubmodel(1,x,y,w,h);

	createDim(x,height+3,x+w,height+3,false);
	if(mull_thk != 0)
	{
		initRect("MV1",x+w,y,mull_thk,h,g("color"));
	}	
// right unit
	x = w+mull_thk;
	y = 0;
	w = gN("width2");
	h = gN("height2");

	embedSubmodel(2,x,y,w,h);

	createDim(x,height+3,x+w,height+3,false);
	createDim(width+3,y,width+3,y+h,false);
	createDim(0,-5,width,-5,false);
}



function align()
{
	trace("ALIGNING ORDER #" + g("f_order"));

	var mulledSet = MulledSet.getInstance(g("f_order"));
	var modelSetUnit = MulledUnit.getInstance(g("f_order"),g("f_item"));
	
	
	var drivingUnit = null;
	var alignedUnit = null;


	var cntUnits = mulledSet.getCountUnits();
	
	var n,m = 1;
	for(n=1;n <= cntUnits; n++)
	{
		
		drivingUnit = mulledSet.getUnit(n);
		if(drivingUnit.isLeftmostUnit())
		{
			for(m=1;m <= cntUnits; m++)
			{
				alignedUnit = mulledSet.getUnit(m);
				if(alignedUnit.isRight(drivingUnit))
				{
					alignedUnit.horzAlignTo(drivingUnit,"BT","Center",4);
				}
			}
		}
	}
	var bottomUnit = null;
	var drivenUnit = null;
	for(n=1;n <= cntUnits; n++)
	{
		bottomUnit = mulledSet.getUnit(n);
		if(bottomUnit.isBottomUnit())
		{
			for(m=1;m <= cntUnits; m++)
			{
				drivenUnit = mulledSet.getUnit(m);
				if(drivenUnit.isAbove(bottomUnit))
				{
					drivenUnit.vertAlignTo(bottomUnit,"LR","Center",4);
				}
				drivenUnit.vertAlignTo(mulledSet.getMasterUnit(),"LR","Center",4);
			}
		}
	}
}

