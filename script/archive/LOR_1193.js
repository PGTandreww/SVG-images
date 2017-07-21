// $import="windows.js"
// $return$

function generate(evt)
{

// $initialize$

trace("width_table =" + width_table);
trace("depth_table =" + depth_table);
if(width_table == "" || width_table < 36)
	width_table = 36;

if(depth_table == "" || depth_table < 36)
	depth_table = 36;

if(height_table == "" || height_table < 29)
	height_table = 29;
	
if(cnt_sngl_leaf == "")
	cnt_sngl_leaf = 0;

if(cnt_dbl_leaf == "")
	cnt_dbl_leaf = 0;

var end_width = 8;
var mid_width = 4;
var leg_width = 4.5;
var leg_inset = 1;
	


 var width_leaves = (cnt_sngl_leaf*12) +  (cnt_dbl_leaf*24) ;
 var width_expanded = width_leaves + width_table;



	createDim(4,0,4,depth_table,false);

	createDim(12,depth_table+6,12+width_table,depth_table+6,false);

	createDim(112,depth_table+6,112+width_expanded,depth_table+6,false);

	createDim(4,72,4,72+height_table,false);
	createDim(12+5.5,72+8,12+5.5+(width_table-11),72+8,false);
	createDim(12+5.5+4,
				72+1.25+3.5+.25,
				12+5.5+4,
				72+height_table,
				false);

	createDim(112+5.5,72+8,112+5.5+width_expanded-11,72+8,false);


	createDim(12,112-4,12+depth_table,112-4,false);
	createDim(4,112,4,112+height_table,false);
	createDim(12+5.5,112+8,12+5.5+(depth_table-11),112+8,false);
	
// adjust depth
	set("leaf_end_plank","height",depth_table);
	var i = 0;
	for(i=1;i<=6;i++)
	{
		set("leaf_end_rivet_"+i,"y",3+(i*6));
	}
 	set("leaf_plank_board","height",depth_table/6);
 	for(i=1;i<=6;i++)
	{
		set("leaf_plank_"+i,"transform","matrix(1,0,0,1,4," +(((i-1)/6)*depth_table) + ")");
	}
 	set("leaf_end_E","transform","translate(12,"+depth_table+") rotate(180)");

 	set("leaf_dbl_plank_board","height",depth_table/6);
 	for(i=1;i<=6;i++)
	{
		set("leaf_dbl_plank_"+i,"transform","matrix(1,0,0,1,4," +(((i-1)/6)*depth_table) + ")");
	}
 	set("leaf_dbl_end_E","transform","translate(24,"+depth_table+") rotate(180)");

	set("end_plank","height",depth_table);
	var i = 0;
	for(i=1;i<=6;i++)
	{
		set("end_rivet_"+i,"y",3+(i*6));
	}
 
 	set("mid_plank","height",depth_table);
	var i = 0;
	for(i=1;i<=6;i++)
	{
		set("mid_rivet_"+i,"y",3+(i*6));
	} 
	
	set("plank_board","height",depth_table/6);

	var i = 0;
	for(i=1;i<=6;i++)
	{
		set("top_plank_"+i,"transform","matrix(1,0,0,1,8,"+(((i-1)/6)*depth_table)+")");
	} 
	    	

 
 

// top view
	var plank_width = (width_table/2)- (end_width+mid_width);
	set("plank_board","width",plank_width);
	set("top_mid","transform",
		"matrix(1,0,0,1," + (end_width+plank_width) + ",0)");
	
	set("front_top_W","width",width_table/2);
	set("front_connect_W_2","transform",
		"translate(" + (end_width+plank_width) + ",0)");
	set("front_support_W","width",
		 (end_width+plank_width+mid_width-(leg_width+leg_inset)));
	set("front_bead_W","width",
		 (end_width+plank_width+mid_width-(leg_width+leg_inset)));
	
	set("front_top_E","width",width_table/2);
	set("front_connect_E_2","transform",
		"translate(" + (mid_width+plank_width) + ",0)");
	set("front_support_E","width",
		 (end_width+plank_width+mid_width-(leg_width+leg_inset)));
	set("front_bead_E","width",
		 (end_width+plank_width+mid_width-(leg_width+leg_inset)));
	set("front_leg_E","x",(width_table/2) - (leg_width+leg_inset));

// top short view
	set("top_half_SV_E","transform",
		"translate(" + width_table + "," + depth_table + ")  rotate(180)");

 
	set("top_support_SV_N","width",width_table - 2*(leg_width+leg_inset));
	set("top_support_SV_S","width",width_table - 2*(leg_width+leg_inset));
	set("top_support_SV_S","y",depth_table - .5*leg_width - leg_inset -.5);
	set("top_support_SV_E","height",depth_table - 2*(leg_width+leg_inset));
	set("top_support_SV_E","x",width_table - .5 - (leg_width+leg_inset)/2);
	set("top_support_SV_W","height",depth_table - 2*(leg_width+leg_inset));

	set("top_leg_SV_NE","x",width_table - (leg_width+leg_inset));
	set("top_leg_SV_SW","y",depth_table - (leg_width+leg_inset));
	set("top_leg_SV_SE","x",width_table - (leg_width+leg_inset));
	set("top_leg_SV_SE","y",depth_table - (leg_width+leg_inset));

                                                                                                                                                                                                                                                                                                                                                                                       
	set("top_brace_SV_NE","transform",
		"translate(" + (width_table-3.75) + ",3.75)  rotate(90)");
	set("top_brace_SV_SW","transform",
		"translate(3.75," + (depth_table-3.75) + ")  rotate(270)");
	set("top_brace_SV_SE","transform",
		"translate("+ (width_table-3.75) + "," + (depth_table-3.75) + ")  rotate(180)");


// Top long view

 	set("top_half_LV_E","transform",
		"translate(" + width_expanded + "," + depth_table + ")  rotate(180)");
 	set("TLV_g_leaves","transform",
		"translate("+ (width_table/2) + ",0)");

	var leaf_offset = 0;
 	var x=0;
 	var grp_leaves = drawing.getElementById("TLV_g_leaves");
 	for(x=1;x<=cnt_sngl_leaf;x++)
 	{
 		var use = drawing.createElementNS(svgNS,"use");
		use.setAttributeNS(xlinkNS,"href","#leaf");
		use.setAttribute("transform","translate(" + leaf_offset + ",0)");
		leaf_offset+=12;
		grp_leaves.appendChild(use);
 	}
   	for(x=1;x<=cnt_dbl_leaf;x++)
 	{
 		var use = drawing.createElementNS(svgNS,"use");
		use.setAttributeNS(xlinkNS,"href","#leaf_dbl");
		use.setAttribute("transform","translate(" + leaf_offset + ",0)");
		leaf_offset+=24;
		grp_leaves.appendChild(use);
 	}



	set("top_support_LV_N","width",width_expanded - 2*(leg_width+leg_inset));
	set("top_support_LV_S","width",width_expanded - 2*(leg_width+leg_inset));
	set("top_support_LV_S","y",depth_table - .5*leg_width - leg_inset -.5);
	set("top_support_LV_E","height",depth_table - 2*(leg_width+leg_inset));
	set("top_support_LV_E","x",width_expanded - .5 - (leg_width+leg_inset)/2);
	set("top_support_LV_W","height",depth_table - 2*(leg_width+leg_inset));

	set("top_leg_LV_NE","x",width_expanded - (leg_width+leg_inset));
	set("top_leg_LV_SW","y",depth_table - (leg_width+leg_inset));
	set("top_leg_LV_SE","x",width_expanded - (leg_width+leg_inset));
	set("top_leg_LV_SE","y",depth_table - (leg_width+leg_inset));

                                                                                                                                                                                                                                                                                                                                                                                       
	set("top_brace_LV_NE","transform",
		"translate(" + (width_expanded-3.75) + ",3.75)  rotate(90)");
	set("top_brace_LV_SW","transform",
		"translate(3.75," + (depth_table-3.75) + ")  rotate(270)");
	set("top_brace_LV_SE","transform",
		"translate("+ (width_expanded-3.75) + "," + (depth_table-3.75) + ")  rotate(180)");
 
 
// Front views 
 
 	set("FSV_front_E","transform",
		"translate("+ (width_table/2) + ",0)");
 
 
 	set("FLV_front_E","transform",
		"translate("+ ((width_table/2)+width_leaves) + ",0)");
 	set("FLV_g_leaves","transform",
		"translate("+ (width_table/2) + ",0)");
 	leaf_offset = 0;
 	x=0;
 	grp_leaves = drawing.getElementById("FLV_g_leaves");
 	for(x=1;x<=cnt_sngl_leaf;x++)
 	{
 		var use = drawing.createElementNS(svgNS,"use");
		use.setAttributeNS(xlinkNS,"href","#front_leaf");
		use.setAttribute("transform","translate(" + leaf_offset + ",0)");
		leaf_offset+=12;
		grp_leaves.appendChild(use);
 	}
   	for(x=1;x<=cnt_dbl_leaf;x++)
 	{
 		var use = drawing.createElementNS(svgNS,"use");
		use.setAttributeNS(xlinkNS,"href","#front_leaf_dbl");
		use.setAttribute("transform","translate(" + leaf_offset + ",0)");
		leaf_offset+=24;
		grp_leaves.appendChild(use);
 	}
	
	set("end_view_top","width",depth_table);
	set("end_view_support","width",(depth_table-2*(leg_width+leg_inset)));
	set("end_view_bead","width",(depth_table-2*(leg_width+leg_inset)));
	set("end_view_leg_E","x",(depth_table-(leg_width+leg_inset)));
	
	
 	returnConfigData();
}

