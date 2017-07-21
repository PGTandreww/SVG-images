// $import="windows.js"
// $return$

function generate(evt)
{
// $initialize$

if(door_qty == "1DR")
{
initRect("pnl_1", 5, 5, panel_1_wth, panel_hgt);
	if(handing == "L")
		{
		initHanding("l_direction","pnl_1","L");
		}
	if(handing == "R")
		{
		initHanding("r_direction","pnl_1","R");
		}
}
if(door_qty == "1DR1SL")
{
initRect("pnl_1", 5, 5, panel_1_wth, panel_hgt);
initRect("pnl_2", (panel_1_wth+5), 5, panel_2_wth, panel_hgt);
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
if(door_qty == "1DR2SL")
{
initRect("pnl_1", 5, 5, panel_1_wth, panel_hgt);
initRect("pnl_2", (panel_1_wth+5), 5, panel_2_wth, panel_hgt);
initRect("pnl_3", (panel_1_wth+panel_2_wth+5), 5, panel_3_wth, panel_hgt);
	if(handing == "FLF")
		{
		initHanding("l_direction","pnl_2","L");
		}
	if(handing == "FRF")
		{
		initHanding("r_direction","pnl_2","R");
		}
}
if(door_qty == "1DR" || door_qty == "1DR1SL" || door_qty == "1DR2SL")
{
initImage("door_1_image",null,door_img_1 + ".jpg", 5, 5, panel_1_wth, panel_hgt);
}
if(door_qty == "1DR1SL" || door_qty == "1DR2SL")
{
initImage("door_2_image",null,door_img_2 + ".jpg", (panel_1_wth+5), 5, panel_2_wth, panel_hgt);
}
if(door_qty == "1DR2SL")
{
initImage("door_3_image",null,door_img_3 + ".jpg", (panel_1_wth+panel_2_wth+5), 5, panel_3_wth, panel_hgt);
}
	returnConfigData();  // post values to confguration code
}

