// $import="windows.js"
// $import="anh.js"
// $return$

function generate(evt)
{
// $initialize$

if(door_qty == "SGL")
{
initRect("pnl_1", 5, 5, calloutToInches(panel_1_wth), calloutToInches(panel_hgt),"white");
	if(handing == "L")
		{
		initHanding("l_direction","pnl_1","L");
		}
	if(handing == "R")
		{
		initHanding("r_direction","pnl_1","R");
		}
}
if(door_qty == "SGL1SL")
{
initRect("pnl_1", 5, 5, calloutToInches(panel_1_wth), calloutToInches(panel_hgt),"white");
initRect("pnl_2", (calloutToInches(panel_1_wth)+5), 5, calloutToInches(panel_2_wth), calloutToInches(panel_hgt),"white");
	if(handing == "LF")
		{
		initHanding("l_direction","pnl_1","L");
		}
	if(handing == "RF")
		{
		initHanding("r_direction","pnl_1","R");
		}
	if(handing == "FL")
		{
		initHanding("l_direction","pnl_2","L");
		}
	if(handing == "FR")
		{
		initHanding("r_direction","pnl_2","R");
		}
}
if(door_qty == "SGL2SL")
{
initRect("pnl_1", 5, 5, calloutToInches(panel_1_wth), calloutToInches(panel_hgt),"white");
initRect("pnl_2", (calloutToInches(panel_1_wth)+5), 5, calloutToInches(panel_2_wth), calloutToInches(panel_hgt),"white");
initRect("pnl_3", (calloutToInches(panel_1_wth)+calloutToInches(panel_2_wth)+5), 5, calloutToInches(panel_3_wth), calloutToInches(panel_hgt),"white");
	if(handing == "FLF")
		{
		initHanding("l_direction","pnl_2","L");
		}
	if(handing == "FRF")
		{
		initHanding("r_direction","pnl_2","R");
		}
}
if(door_qty == "SGL" || door_qty == "SGL1SL" || door_qty == "SGL2SL")
{
initImage("door_1_image",null,door_img_1 + ".jpg", 5, 5, calloutToInches(panel_1_wth), calloutToInches(panel_hgt));
}
if(door_qty == "SGL1SL" || door_qty == "SGL2SL")
{
initImage("door_2_image",null,door_img_2 + ".jpg", (calloutToInches(panel_1_wth)+5), 5, calloutToInches(panel_2_wth), calloutToInches(panel_hgt));
}
if(door_qty == "SGL2SL")
{
initImage("door_3_image",null,door_img_3 + ".jpg", (calloutToInches(panel_1_wth)+calloutToInches(panel_2_wth)+5), 5, calloutToInches(panel_3_wth), calloutToInches(panel_hgt));
}
if(door_qty != "")
{
createDim(-3,5,-3,(calloutToInches(panel_hgt)+5),true);
}
if(door_qty == "SGL")
{
	createDim(5,(calloutToInches(panel_hgt) + 10),(calloutToInches(panel_1_wth)+5),(calloutToInches(panel_hgt) + 10),true);
}
if(door_qty == "SGL1SL")
{
	createDim(5,(calloutToInches(panel_hgt) + 10),(calloutToInches(panel_1_wth)+calloutToInches(panel_2_wth) + 5),(calloutToInches(panel_hgt) + 10),true);
}
if(door_qty == "SGL2SL")
{
	createDim(5,(calloutToInches(panel_hgt) + 10),(calloutToInches(panel_1_wth)+calloutToInches(panel_2_wth)+calloutToInches(panel_3_wth) + 5),(calloutToInches(panel_hgt) + 10),true);
}

	returnConfigData();  // post values to confguration code
}

