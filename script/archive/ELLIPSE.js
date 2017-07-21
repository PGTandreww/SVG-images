// $import="windows.js"
// $import="anh.js"
// $return$
function generate(evt)
{
// $initialize$


if(height === null || height === 0)
	height = dimsToInches(height_ft,height_in,height_frac);
	
if(width === null || width === 0)
	width = dimsToInches(width_ft,width_in,width_frac);

var legHeight = 0;
try{
 legHeight = leg_height;
}
catch(eUndefined)
{
	legHeight = 0;
}
if (unit_type == "CMPLUNT")
{
	fr_flag = "2";
	gls_flag = "2";
}
if (unit_type == "FRM")
{
	fr_flag = "2";
	gls_flag = "1";
}	

if (unit_type == "GLASS")
{
	fr_flag = "1";
	gls_flag = "2";
}	
if(frame_color == "")
{
	frame_color = "GRAY";	
}	

if(grid_color == "")
{
	grid_color = "GRAY";
}
if(grid == "")
{
	grid = "N";
}

var vert = 0;
var horz = 0;
var f_s_ofst_w = 0.5;			//values received from A&H spreadsheet
var f_s_ofst_t = 0.5;			//values received from A&H spreadsheet
var f_s_ofst_b = 0;			//values received from A&H spreadsheet
var s_g_ofst = 0.50;		//values received from A&H spreadsheet
var segType = "F";
if(gls_flag == 2)
{
	if(model == "AVELIP" || model == "CVELIP" || model == "GLELIP")
	{
	if(glassType == "TMP")
		{
 			s("f_glass","TEMPERED");
		}
		initGlass3CentredArch("glass", "frame",0,0, width, height, legHeight, s_g_ofst, "F");
		segType = "F";
	}
	if(model == "AVQELIP" || model == "CVQELIP" || model == "GLQELIP")
	{
		if(getHanding(handing) == "L")
		{
			if(glassType == "TMP")
			{
 				s("f_glass","TEMPERED");
			}
			initGlass3CentredArch("glass", "frame",0,0, width, height, legHeight, s_g_ofst, "L");
			segType = "L";

		}
		if(getHanding(handing) == "R")
		{
			if(glassType == "TMP")
			{
 				s("f_glass","TEMPERED");
			}
			initGlass3CentredArch("glass", "frame",0,0, width, height, legHeight, s_g_ofst, "R");
			segType = "R";
		}
	}



	if(grid != "N")	//defines grids (not fully developed
	{
		if(lt1_grl_patn != "SCAL" && lt1_grl_patn != "SUN")
		{
			initGrid("glass_pane","grid_",getGrillePattern(lt1_grl_patn,grid_v,grid_h),getStandardWebColors(grid_color),getGridThickness(grid_thick));
		} //ends criteria for grids
		else
		{
			initArchGrille("glass_pane", 0,0,width,height,legHeight,adj_gls_w-s_g_ofst, getRadiusPattern(lt1_grl_patn,hubType,radius_bars,spokes), getGridThickness(grid_thick), getStandardWebColors(grid_color),segType);
		}
	}
}
if(fr_flag == 2)
{
	if(model == "AVELIP" || model == "CVELIP" || model == "GLELIP")
	{
		initFrame3CentredArch("frame",0,0,width,height,legHeight, adj_gls_w, getStandardWebColors(frame_color), "F")
	}
	if(model == "AVQELIP" || model == "CVQELIP" || model == "GLQELIP")
	{
		if(getHanding(handing) == "L")
		{
			initFrame3CentredArch("frame",0,0,width,height,legHeight, adj_gls_w, getStandardWebColors(frame_color), "L")
		}
		if(getHanding(handing) == "R")
		{
			initFrame3CentredArch("frame",0,0,width,height,legHeight, adj_gls_w, getStandardWebColors(frame_color), "R")
		}
	}
}

if(fr_flag == 2  && f_nested != "true")
	{
		createDim(0,height + 3,width,height + 3,true);	//used for frame width dim
		createDim(width + 6,0,width + 6,height,true);	//used for frame height dim

	}

returnConfigData();

}

