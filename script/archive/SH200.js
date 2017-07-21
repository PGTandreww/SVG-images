// $import="fc.js"
// $import="rect.js"
var drawing = null;
// $return$

function generate(evt)
{
drawing = evt.getTarget().getOwnerDocument();

// $initialize$

var PAD = nested=="true"?0:9;
//adjustDocSize(WDTH,HGHT,400,400,PAD);
var color = 'GRAY';
switch(FRMCLR)
{
case 'W':
  color = 'WHITE';
  break;
case 'B':
  color = 'GOLDENROD';
//color = "BLACK";
  break;
default:
  color = 'GRAY';
  break;
 }
  


var grid = COL1TYPE;
if(grid === "")
{
	grid = "NONE";
}

	var frame_x = 0;
	var frame_y = 0;

	var frame_w = WDTH; 
	var frame_h = HGHT; 
  var sash_height = SASHHGHT2;

	initMitredFrame("frame",
				0, // x 
				0,	// y
				WDTH,	// w
				HGHT,	// y
				1.25,color);			// f (frame extrusion width)

	initRect("sill",0,frame_h - 1,frame_w,1,color);


	initGlass("t_glass","t_sash",
				frame_x + 1.25 + 0.75, // x 
				frame_y + 1.25 + 0.75,	// y
				frame_w - 2.5 - 1.5,	// w
				frame_h - sash_height - 2.5,	// h
				0.75);			// o (sash overlap)


	var vert = COL1HQTY-1;
	var horz = COL1VQTY-1;

	if(grid != "NONE")
	{
				s("f_t_grid_v",vert);
				s("f_t_grid_h",horz);
        drawGrid("t_glass_pane","t_grid_",color,0.75,false);
	}

	initMitredFrame("t_sash",
				frame_x + 1.25, // x 
				frame_y + 1.25,	// y
				frame_w - 2.5,	// w
				frame_h - sash_height - 2.5 + 1.5,	// h
				1.5,color);			// f (sash frame extrusion width)

	initGlass("b_glass","b_sash",
				frame_x + 1.25 + 0.75, // x 
				frame_y + (frame_h - sash_height - 1.25) + 0.75,	// y
				frame_w - 2.5 - 1.5,	// w
				sash_height - 1.5,	// h
				0.75);			// o (sash overlap)
	
	grid = COL2TYPE;
if(grid === "")
{
	grid = "NONE";
}
	vert = COL2HQTY-1;
	horz = COL2VQTY-1;

	if(grid != "NONE")
	{
			s("f_b_grid_v",vert);
			s("f_b_grid_h",horz);
       drawGrid("b_glass_pane","b_grid_",color,0.75,false);
	}
	
	initMitredFrame("b_sash",
				frame_x + 1.25, // x 
				frame_y + (frame_h - sash_height - 1.25),	// y
				frame_w - 2.5,	// w
				sash_height,	// h
				1.5,color);			// f (sash frame extrusion width)
	createDim(0,frame_h + 3,frame_w,frame_h + 3,true);
	createDim(frame_w + 2,frame_h - sash_height - 1.25, frame_w + 2, frame_h - 1 ,true);
	createDim(frame_w + 6,0,frame_w + 6,frame_h,true);

	// Display slide direction indications
	initDirection("t_direction","t_glass_pane","D");
	initDirection("b_direction","b_glass_pane","U");



// INSERT YOUR SCRIPTING HERE!!!!!



	returnConfigData();  // post values to confguration code
}

