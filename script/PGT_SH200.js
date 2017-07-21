// $import="fc.js"
// $import="PGTrect.js"
// $import="PGTcolors.js"

var drawing = null;
// $return$
 
function generate(evt)
{
	drawing = evt.getTarget().getOwnerDocument();

	// $initialize$

	var PAD = nested=="true"?0:9;

	var color = getFrameColor(FRMCLR);

	trace("set up main frame variables");


	var frame_w = WDTH; 
	var frame_h = HGHT;
        var sash_w = SASHWDTH2;
        var sash_h = SASHHGHT2;
    
        //check w and h...no need to continue is either is 0
        if(frame_w > 0 && frame_h > 0 && sash_w > 0 && sash_h > 0){
            //continue
            trace("call initOuterNonMtrdFrame from PGTrect.js");
            //draw the main frame
            var frame_x = 0;
            var frame_y = 0;

            var frame_headWidth, frame_sillWidth, frame_leftWidth, frame_rightWidth;
            var frame_headFin, frame_sillFin, frame_leftFin, frame_rightFin;
            var frame_headOffset, frame_sillOffset, frame_leftOffset, frame_rightOffset;
            var frame_top_thru = true;
            var frame_bot_thru = true;
            var addFin = false;

            switch(FRMTYPE){
                case ".5FLANGE":
                    frame_headWidth = 1.159;
                    frame_headFin = 0;
                    frame_headOffset = 0;
                    frame_sillWidth = 0.911;
                    frame_sillFin = 0;
                    frame_sillOffset = 0;
                    frame_leftWidth = 1.463;
                    frame_leftFin = 0;
                    frame_leftOffset = 0;
                    frame_rightWidth = 1.463;
                    frame_rightFin = 0;
                    frame_rightOffset = 0;
                    break;
                case "1.125FIN":
                    addFin = true;
                    if(PRPMULLTP === "Y"){
                        frame_headWidth = 1.159;
                        frame_headFin = 0;
                        frame_headOffset = .5;                    
                    }else{
                        frame_headWidth = 0.659;                    
                        frame_headFin = 1.125;
                        frame_headOffset = 0;
                    }
                    if(PRPMULLBTM === "Y"){
                        frame_sillWidth = 0.911;
                        frame_sillFin = 0;
                        frame_sillOffset = .5;
                    }else{
                        frame_sillWidth = 0.176;
                        frame_sillFin = 1.125;
                        frame_sillOffset = 0;
                    }
                    if(PRPMULLLFT === "Y"){
                        frame_leftWidth = 1.463;
                        frame_leftFin = 0;
                        frame_leftOffset = .5;
                    }else{
                        frame_leftWidth = 0.963;
                        frame_leftFin = 1.125;
                        frame_leftOffset = 0;
                    }
                    if(PRPMULLRGHT === "Y"){
                        frame_rightWidth = 1.463;
                        frame_rightFin = 0;
                        frame_rightOffset = .5;
                    }else{
                        frame_rightWidth = 0.963;
                        frame_rightFin = 1.125;
                        frame_rightOffset = 0;
                    }
                    break;
            }

            frame_x = frame_leftFin;
            frame_y = frame_headFin;
            frame_w = frame_w + frame_leftOffset + frame_rightOffset;
            frame_h = frame_h + frame_headOffset + frame_sillOffset;

            //sashes
            //sash_x changes based on config, but the rest are constant
            var sash_x = frame_x + ((frame_w - sash_w)/2);
            var sash_y = frame_y + (frame_h - frame_sillWidth - sash_h);
            var sash_top = 1.335;
            var sash_bot = 1.230;
            var sash_left = 0.625;
            var sash_right = 0.625;

            //bead variables
            var bead_x, bead_y, bead_w, bead_h;
            var bead_partWidth = 0.5;
            var glass_x, glass_y, glass_w, glass_h;
            var glass_color;
            
            //basic colonial setup
            var grid_face;
            var sgrid_v_bars, sgrid_h_bars, sgrid_pattern;
            var fgrid_v_bars, fgrid_h_bars, fgrid_pattern;
            var addSgrid = false;
            var addFgrid = false;
            
            switch(COLTYPE){
                case "DA1000":
                case "DF1000":
                case "SR1000":
                    grid_face = 1;
                    break;
                case "GBGF0563":
                    grid_face = 0.563;
                    break;
            }
            //centralize grid conditioning
            switch(COLLOC){
                case "CMPASSY":
                case "UNIT":
                    addSgrid = true;
                    addFgrid = true;
                    break;
                case "TPSSH":
                    addFgrid = true;
                    break;
                case "BTSSH":
                    addSgrid = true;
                    break;
            }
           
            //sash
            //Draw the left sash, glass, grid, and bead
            //first calculate the sash_x, then draw the sash frame
            initOuterNonMtrdFrame("sash", sash_x, sash_y, sash_w, sash_h, sash_left,sash_right,sash_top,false,sash_bot,false, color);
            //calculate the bead frame specs
            bead_x = sash_x + sash_left;
            bead_y = sash_y + sash_top;
            bead_w = sash_w - sash_left - sash_right;
            bead_h = sash_h - sash_top - sash_bot;
            // draw the glass
            glass_x = bead_x + bead_partWidth;
            glass_y = bead_y + bead_partWidth;
            glass_w = bead_w - (bead_partWidth * 2);
            glass_h = bead_h - (bead_partWidth * 2);
            //left sash is always glass 2
            glass_color = getGlassColor(GLS2CLR);
            trace("InitGlass");
            initGlass("sglass","sash", glass_x, glass_y, glass_w, glass_h, 0, glass_color);
            if(addSgrid){
                switch(COLSTYL){
                case "2/2V":
                case "2/2H":
                case "STD":
                case "U.COL.LITES":
                case "U.COL.BARS":
                    //conversion from lites to bars...segment is lites
                    //also note that the segments are confusing here...when STD or LITES, H and V are crossed
                    sgrid_v_bars = COL2HQTY - 1;
                    sgrid_h_bars = COL2VQTY - 1;

                    initGrid("sglass_pane","sgrid",sgrid_v_bars+"V"+sgrid_h_bars+"H",color,grid_face);

                    break;
                case "9LP":
                    //create grid
                    initGrid("sglass_pane","sgrid","P1T1B1L1R"+COLSQSZ,color,grid_face);
                    //set the h bars for alignment conditioning
                    sgrid_v_bars = 2;
                    break;
                case "6LP":
                    //create grid
                    initGrid("sglass_pane","sgrid","P0T1B1L1R"+COLSQSZ,color,grid_face);
                    //set the h bars for alignment conditioning
                    sgrid_v_bars = 2;
                    break;
                case "CUSTOMLP":
                    switch(COL2PTRN){
                    //First the brittanies...easily handled by changing the # in the P pattern
                    case "3LPH":
                        //create grid
                        initGrid("sglass_pane","sgrid","P0T0B1L1R"+COLSQSZ,color,grid_face);
                        //set the h bars for alignment conditioning
                        sgrid_v_bars = 2;
                        break;
                    case "3LPV":
                        //create grid
                        initGrid("sglass_pane","sgrid","P1T1B0L0R"+COLSQSZ,color,grid_face);
                        //set the h bars for alignment conditioning
                        sgrid_v_bars = 0;
                        break;
                    case "6LPB":
                        //create grid
                        initGrid("sglass_pane","sgrid","P0T1B1L1R"+COLSQSZ,color,grid_face);
                        //set the h bars for alignment conditioning
                        sgrid_v_bars = 2;
                        break;
                    case "6LPT":
                        //create grid
                        initGrid("sglass_pane","sgrid","P1T0B1L1R"+COLSQSZ,color,grid_face);
                        //set the h bars for alignment conditioning
                        sgrid_v_bars = 2;
                        break;
                    case "6LPL":
                        //create grid
                        initGrid("sglass_pane","sgrid","P1T1B1L0R"+COLSQSZ,color,grid_face);
                        //set the h bars for alignment conditioning
                        sgrid_v_bars = "1L";
                        break;
                    case "6LPR":
                        //create grid
                        initGrid("sglass_pane","sgrid","P1T1B0L1R"+COLSQSZ,color,grid_face);
                        //set the h bars for alignment conditioning
                        sgrid_v_bars = "1R";
                        break;
                    case "9LP":
                        //create grid
                        initGrid("sglass_pane","sgrid","P1T1B1L1R"+COLSQSZ,color,grid_face);
                        //set the h bars for alignment conditioning
                        sgrid_v_bars = 2;
                        break;
                    }
                }
            }
//            initMitredFrame("sbead", bead_x, bead_y, bead_w, bead_h, bead_partWidth, color);

            //if this is IF, then draw the fin
            if(addFin){
                initOuterNonMtrdFrame("frame_fin", 0, 0, frame_w + frame_leftFin + frame_rightFin, frame_h + frame_headFin + frame_sillFin, frame_leftFin, frame_rightFin, frame_headFin, frame_top_thru, frame_sillFin, frame_bot_thru, color);
            }

            //draw the main frame
            initOuterNonMtrdFrame("frame", frame_x, frame_y, frame_w, frame_h, frame_leftWidth, frame_rightWidth, frame_headWidth, frame_top_thru, frame_sillWidth, frame_bot_thru, color);


            //place the meeting rail(s) and extra legs
            //since the fixed section is affected by the meeting rails, also calcuting that here
            var mr_x = frame_x + frame_leftWidth;
            var mr_y = sash_y - 0.353;
            var mr_w = frame_w - (frame_leftWidth + frame_rightWidth);
            var mr_h = 1.020;
            
            //draw the meeting rail
            initFrameMember("mrail", "frame", mr_x, mr_y, mr_w, mr_h, color);
            initFrameMember("lip", "frame", mr_x, sash_y + sash_h - 0.234, mr_w, 0.234, color);

            //calculate the fixed bead frame
            bead_x = mr_x;
            bead_y = frame_y + frame_headWidth;
            bead_w = mr_w;
            bead_h = mr_y - bead_y;

            // draw the glass
            glass_x = bead_x + bead_partWidth;
            glass_y = bead_y + bead_partWidth;
            glass_w = bead_w - (bead_partWidth * 2);
            glass_h = bead_h - (bead_partWidth * 2);
            //fixed is always glass 1
            glass_color = getGlassColor(GLS1CLR);

            trace("InitGlass");
            initGlass("fglass","frame", glass_x, glass_y, glass_w, glass_h, 0, glass_color);

            if(addFgrid){
                switch(COLSTYL){
                case "2/2V":
                case "2/2H":
                case "STD":
                case "U.COL.LITES":
                case "U.COL.BARS":
                    //conversion from lites to bars...segment is lites
                    fgrid_v_bars = COL1HQTY - 1;
                    fgrid_h_bars = COL1VQTY - 1;

                    initGrid("fglass_pane","fgrid",fgrid_v_bars+"V"+fgrid_h_bars+"H",color,grid_face);

                    break;
                case "9LP":
                    //create grid
                    initGrid("fglass_pane","fgrid","P1T1B1L1R"+COLSQSZ,color,grid_face);
                    //set the h bars for alignment conditioning
                    fgrid_v_bars = 2;

                    break;
                case "6LP":
                    //create grid
                    initGrid("fglass_pane","fgrid","P1T0B1L1R"+COLSQSZ,color,grid_face);
                    //set the h bars for alignment conditioning
                    fgrid_v_bars = 2;
                    break;
                case "CUSTOMLP":
                        switch(COL1PTRN){
                        //First the brittanies...easily handled by changing the # in the P pattern
                        case "3LPH":
                            //create grid
                            initGrid("fglass_pane","fgrid","P0T0B1L1R"+COLSQSZ,color,grid_face);
                            //set the h bars for alignment conditioning
                            fgrid_v_bars = 2;
                            break;
                        case "3LPV":
                            //create grid
                            initGrid("fglass_pane","fgrid","P1T1B0L0R"+COLSQSZ,color,grid_face);
                            //set the h bars for alignment conditioning
                            fgrid_v_bars = 0;
                            break;
                        case "6LPB":
                            //create grid
                            initGrid("fglass_pane","fgrid","P0T1B1L1R"+COLSQSZ,color,grid_face);
                            //set the h bars for alignment conditioning
                            fgrid_v_bars = 2;
                            break;
                        case "6LPT":
                            //create grid
                            initGrid("fglass_pane","fgrid","P1T0B1L1R"+COLSQSZ,color,grid_face);
                            //set the h bars for alignment conditioning
                            fgrid_v_bars = 2;
                            break;
                        case "6LPL":
                            //create grid
                            initGrid("fglass_pane","fgrid","P1T1B1L0R"+COLSQSZ,color,grid_face);
                            //set the h bars for alignment conditioning
                            fgrid_v_bars = "1L";
                            break;
                        case "6LPR":
                            //create grid
                            initGrid("fglass_pane","fgrid","P1T1B0L1R"+COLSQSZ,color,grid_face);
                            //set the h bars for alignment conditioning
                            fgrid_v_bars = "1R";
                            break;
                        case "9LP":
                            //create grid
                            initGrid("fglass_pane","fgrid","P1T1B1L1R"+COLSQSZ,color,grid_face);
                            //set the h bars for alignment conditioning
                            fgrid_v_bars = 2;
                            break;
                        }

                }
                //align grids
                if(addSgrid && sgrid_v_bars === fgrid_v_bars){
                    alignlite_v("fglass_pane", "fgrid", "sglass_pane", "sgrid", "", 0);
                }

            }

//            initMitredFrame("fbead", bead_x, bead_y, bead_w, bead_h, bead_partWidth, color);
            
            //and handing
            initDirection("s_direction","sglass_pane","U");

            //Add dims
            var dimOffset = 1.5;    //dimOffset is the distance away from the window
            var dimSpacing = 2;   //dimSpacing is the space between dims if multiple dims are required
            var dim_x1, dim_y1, dim_x2, dim_y2;
            
            //width
            dim_x1 = frame_x + frame_leftOffset;
            dim_y1 = frame_h + (frame_headFin + frame_sillFin) + dimOffset;
            dim_x2 = frame_x + frame_w - frame_rightOffset;
            dim_y2 = dim_y1;
            
            createDim(dim_x1,dim_y1,dim_x2,dim_y2,false);


            //height
            dim_x1 = frame_w + (frame_leftFin + frame_rightFin) + dimOffset;
            dim_x2 = dim_x1;

            //insert custom sash dims
            if(VNTCNFG === "CSTM.VNT"){
                //calculate start and end y for sash height
                dim_y1 = sash_y;
                dim_y2 = sash_y + sash_h;
                //draw the dim
                createDim(dim_x1,dim_y1,dim_x2,dim_y2,false);
                //move the dim x's to the right
                dim_x1 = dim_x1 + dimSpacing;
                dim_x2 = dim_x1;
            }

            //custom muntin location...add in first to see if we need to move the main dim
//            h_dimOffset = 0;
//            if(COLMTNLOC1 > 0){
//                createDim(dim_x1,dim_y1,dim_x2,dim_y1 + COLMTNLOC1,true);
//                h_dimOffset = 1.5;
//            }
//            if(COLMTNLOC2 > 0){
//                createDim(dim_x1,dim_y2 - COLMTNLOC2,dim_x2,dim_y2,true);
//                h_dimOffset = 1.5;
//            }
//
//            if(COLMTNLOC2 > 0){
//                createDim(dim_x1,dim_y2 - COLMTNLOC2,dim_x2,dim_y2,true);
//                h_dimOffset = 1.5;
//            }
//
//            if(grid_radius > 0){
//                createDim((glass_x + (glass_w - (grid_radius*2))/2),(glass_y + (glass_h/2)),(glass_x + (glass_w - (grid_radius*2))/2) + (grid_radius*2),(glass_y + (glass_h/2)),true);
//                h_dimOffset = 1.5;
//            }
//
//            if(grid_sq_h > 0){
//                createDim((glass_x + ((glass_w - grid_sq_h)/2)),(glass_y + ((glass_h - grid_sq_v)/2) + grid_sq_v + 1.5),(glass_x + ((glass_w - grid_sq_h)/2)) + grid_sq_h,(glass_y + ((glass_h - grid_sq_v)/2) + grid_sq_v + 1.5),true);
//                h_dimOffset = 1.5;
//            }
//
//            if(grid_sq_v > 0){
//                createDim((glass_x + ((glass_w - grid_sq_h)/2)) + grid_sq_h + 1.5,(glass_y + ((glass_h - grid_sq_v)/2)),(glass_x + ((glass_w - grid_sq_h)/2)) + grid_sq_h + 1.5,(glass_y + ((glass_h - grid_sq_v)/2) + grid_sq_v),true);
//                h_dimOffset = 1.5;
//            }
//
        
//            dim_x1 = dim_x1 + h_dimOffset;
//            dim_x2 = dim_x1;
//
            //calculate the start and end y for the window height
            dim_y1 = frame_y + frame_headOffset;
            dim_y2 = frame_y + frame_h - frame_sillOffset;
        
            //draw the height dim
            createDim(dim_x1,dim_y1,dim_x2,dim_y2,false);


        }
// INSERT YOUR SCRIPTING HERE!!!!!



	returnConfigData();  // post values to confguration code
}

