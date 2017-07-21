// $import="windows.js"
// $return$
function generate(evt)
{
// $initialize$

if(height == null || height == 0)
	height = dimsToInches(height_ft,height_in,height_frac);
	
if(width == null || width == 0)
	width = dimsToInches(width_ft,width_in,width_frac);
	
height = width/2;	
	
if(color == "")
	color = "gray";	
if(color == "ALMOND")
	color = "TAN";  // web color
if(grid == "")
	grid = "NONE";
if(grid_color =="")
	grid_color = "gray";
if(grid_color == "ALMOND")
	grid_color = "TAN"; //web color
if(grid_pattern == "")
	grid_pattern = "";

	var frame_w = width; 
	var frame_h = height; 
if(have_sash == "Y")	
{	
	if(gls_flag == 2)
	{
		var glass = drawing.getElementById("glass_pane");
		d = "M %FT2%,%H% A %HT2%,%HT2% 0 0,1 %W%,%H% L %FT%,%H%";
		d=d.replace(/%H%/g,frame_h-adj_sash_hgt-adj_gls_hgt);
		d=d.replace(/%W%/g,frame_w-adj_sash_wth-adj_gls_wth);
		d=d.replace(/%HT2%/g,frame_h-((adj_sash_hgt+adj_gls_hgt)*(31/32)));
		d=d.replace(/%FT%/g,(adj_gls_hgt*2));
		d=d.replace(/%FT2%/g,(adj_sash_wth+adj_gls_wth));

		try{
			trace("glass d="+d);
			glass.setAttribute("d",d);
		}
		catch(e){alert("glass d="+d);}
		createDescription("glass_pane", "Glass Arch WIDTH: " + (frame_w-sash_t+1) + "  HEIGHT: " + (frame_h-sash_t+1) + ".");
	}
	if(s_flag == 2)
	{
		var sash_rail = drawing.getElementById("sash_rail");
		d = d="M %FT%,%H% l %W%,0 l -%FT%,-%FT% l -%WS%,0 l -%FT%,%FT% ";
		d=d.replace(/%H%/g,frame_h-adj_sash_hgt);
		d=d.replace(/%W%/g,frame_w-adj_sash_wth-adj_sash_wth);
		d=d.replace(/%FT%/g,sash_t);
		d=d.replace(/%WS%/g,frame_w-adj_sash_wth-adj_sash_wth-sash_t-sash_t);

		try{
//		alert("sash_rail d="+d);
			sash_rail.setAttribute("d",d);
			sash_rail.setAttribute("style","fill: "+color);
		
		}
		catch(e){alert("sash_rail d="+d);}
		createDescription("sash_rail", "Base WIDTH: " + (frame_w-(sash_t*2)) + "  HEIGHT: " + (frame_h-sash_t) + ".");

		var sash_arch = drawing.getElementById("sash_arch");
	
		var d = "M %FT%,%H% A %H4%,%H4% 0 0,1 %W%,%H% l -%FT%,-%FT% " +
		    "A %HT2%,%HT2% 180 0,0 %FT2%,%H2% l -%FT%,%FT%";
	
		d=d.replace(/%W%/g,frame_w-adj_sash_wth);
		d=d.replace(/%H%/g,frame_h-adj_sash_hgt);
		d=d.replace(/%H4%/g,frame_h-(adj_sash_hgt*(31/32)));
		d=d.replace(/%FT%/g,adj_sash_wth);
		d=d.replace(/%FT2%/g,adj_sash_wth*2);
		d=d.replace(/%HT2%/g,frame_h-((adj_sash_hgt+adj_sash_hgt)*(29/32)));
		d=d.replace(/%H2%/g,frame_h-adj_sash_hgt-adj_sash_hgt);

		try{
			trace("sash_arch d="+d);
			sash_arch.setAttribute("d",d);
			sash_arch.setAttribute("style","fill: "+color);
		}
		catch(e){alert("sash_arch d="+d);}
		createDescription("sash_arch", "Arch WIDTH: " + width + "  HEIGHT: " + height + ".");
	}
}
else
{	
	if(gls_flag == 2)
	{
		var glass = drawing.getElementById("glass_pane");
		d = "M %FT%,%HT3% A %HT2%,%HT2% 0 0,1 %WG%,%HT3% L %FT%,%HT3%";
		d=d.replace(/%WG%/g,frame_w-(t/2));
		d=d.replace(/%HT2%/g,frame_h-((t*31)/64));
		d=d.replace(/%FT%/g,t/2);
		d=d.replace(/%HT3%/g,frame_h-(t/2));
		d=d.replace(/%HT%/g,frame_h-t);
		try{
			trace("glass d="+d);
			glass.setAttribute("d",d);
		}
		catch(e){alert("glass d="+d);}
		createDescription("glass_pane", "Glass Arch WIDTH: " + (frame_w-t+1) + "  HEIGHT: " + (frame_h-t+1) + ".");
	}
}
if(frm_flag == 2)
{
		var frame_sill = drawing.getElementById("frame_sill");
		d = d="M 0,%H% l %W%,0 l -%FT%,-%FT% l -%WS%,0 l -%FT%,%FT% ";
		d=d.replace(/%H%/g,frame_h);
		d=d.replace(/%W%/g,frame_w);
		d=d.replace(/%FT%/g,t);
		d=d.replace(/%WS%/g,frame_w-t-t);

		try{
//		alert("frame_sill d="+d);
			frame_sill.setAttribute("d",d);
			frame_sill.setAttribute("style","fill: "+color);
		
		}
		catch(e){alert("frame_sill d="+d);}
		createDescription("frame_sill", "Base WIDTH: " + (frame_w-(t*2)) + "  HEIGHT: " + (frame_h-t) + ".");

		var frame_arch = drawing.getElementById("frame_arch");
	
		var d = "M 0,%H% A %H%,%H% 0 0,1 %W%,%H% l -%FT%,-%FT% " +
		    "A %HT2%,%HT2% 180 0,0 %FT%,%HT% l -%FT%,%FT%";
	
		d=d.replace(/%W%/g,frame_w);
		d=d.replace(/%H%/g,frame_h);
		d=d.replace(/%FT%/g,t);
		d=d.replace(/%HT%/g,frame_h-t);
		d=d.replace(/%HT2%/g,frame_h-((t*15)/16));
		d=d.replace(/%W2%/g,frame_w-t);
		d=d.replace(/%H2%/g,frame_h-(t*2));

		try{
			trace("frame_arch d="+d);
			frame_arch.setAttribute("d",d);
			frame_arch.setAttribute("style","fill: "+color);
		}
		catch(e){alert("frame_arch d="+d);}
		createDescription("frame_arch", "Arch WIDTH: " + width + "  HEIGHT: " + height + ".");
}		
		if( f_nested != "true")
		{	
			createDim(0,frame_h + 3,frame_w,frame_h + 3,true);
			createDim(frame_w + 2,0,frame_w + 2,frame_h,true);
		}
	
	var arches = 0;
	var spokes = 1;
//	alert("grid pattern="+grid_pattern);
	switch(grid_pattern.charAt(0))
	{
		case 'A':
				arches = grid_pattern.charAt(1);
				spokes = grid_pattern.substring(3);
				drawArchGrids("grille",t+adj_gls_wth,t+adj_gls_hgt,width-(2*(t+adj_gls_wth)),height-(2*(t+adj_gls_hgt)),arches-0,spokes-0,1.0, "", grid_color);
				break;
		case 'S':
				spokes = grid_pattern.charAt(1);
				arches = grid_pattern.length == 4 ? grid_pattern.substring(3) : 0;
						 
				drawArchGrids("grille",t+adj_gls_wth,t+adj_gls_hgt,width-(2*(t+adj_gls_wth)),height-(2*(t+adj_gls_hgt)),arches-0, spokes-0,1.0, "SUNBURST", grid_color);
				break;

	}

		returnConfigData();

}

