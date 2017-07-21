// $import="windows.js"
// $return$
function generate(evt)
{
// $initialize$


if(height == null || height == 0)
	height = dimsToInches(height_ft,height_in,height_frac);
	
if(width == null || width == 0)
	width = dimsToInches(width_ft,width_in,width_frac);

var legHeight = 0;
try{
 legHeight = leg_height;
}
catch(eUndefined)
{
	legHeight = 0;
}

var archHeight;
try{
 archHeight = arch_height;
}catch(eUndefined)
{
 archHeight = height - legHeight;
}



	
switch(color)
{
 	case "": 	color = "gray";	
 				break;
	case "ALMOND":
			color = "TAN";  // web color
			break;
	default:
			break;
}	
	
if(grid_color == "")
{
	grid_color = color;
}
if(grid_color == "ALMOND")
{
	grid_color = "TAN";
}
 
if(adj_gls_wth == 0)
{
	adj_gls_wth = t/2;
}


if(gls_flag == 2)
{
			var glass = drawing.getElementById("glass_pane");
			d = "CX=%WA% CY=%WA% RX=%WA2% RY=%WA2%";
			d=d.replace(/%WA%/g,width-adj_gls_wth-adj_gls_wth);
			d=d.replace(/%WA2%/g,(width-adj_gls_wth-adj_gls_wth)/2);

			try{
//			alert("glass d="+d);
				glass.setAttribute("glass",glass);
			}
			catch(e){alert("glass d="+d);}
			createDescription("glass_pane", "Glass Radius: " + ((width-adj_gls_wth-adj_gls_wth)/2) + ".");
		}
		if(grid != "NONE")	//defines grids (not fully developed
				{
					initGrid("t_glass_pane","t_grid_",	grid_pattern,grid_color,grid_thick);
				} //ends criteria for grids
	

if(frm_flag == 2)
		
if( f_nested != "true")
{	
// Create Dims Here
}

returnConfigData();

}

