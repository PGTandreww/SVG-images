// $import="fc.js"
// $import="PGTrect.js"
// $import="PGTmisc.js"

var drawing = null;
// $return$
 
function generate(evt)
{
	drawing = evt.getTarget().getOwnerDocument();

	// $initialize$

	var PAD = nested=="true"?0:9;

	var color = getFrameColor(FRMCLR,"A");

	trace("set up main frame variables");

	//draw the main frame
	var frame_x = 0;
	var frame_y = 0;
	var frame_w = WDTH; 
	var frame_h = HGHT; 
	var frame_headWidth, frame_sillWidth, frame_leftWidth, frame_rightWidth;
	var frame_headFin, frame_sillFin, frame_leftFin, frame_rightFin;
	var frame_headOffset, frame_sillOffset, frame_leftOffset, frame_rightOffset;
	var frame_top_thru = false;
	var frame_bot_thru = false;
	var addFin = false;
        
        switch(FRMTYPE){
            case ".5FLANGE":
                frame_headWidth = 1.326;
                frame_headFin = 0;
                frame_headOffset = 0;
                frame_sillWidth = 2.489;
                frame_sillFin = 0;
                frame_sillOffset = 0;
                frame_leftWidth = 0.980;
                frame_leftFin = 0;
                frame_leftOffset = 0;
                frame_rightWidth = 0.980;
                frame_rightFin = 0;
                frame_rightOffset = 0;
                break;
//            case "1.125FIN":
//                addFin = true;
//                if(PRPMULLTP === "Y"){
//                    frame_headWidth = 1.326;
//                    frame_headFin = 0;
//                    frame_headOffset = .5;                    
//                }else{
//                    frame_headWidth = 0.344;                    
//                    frame_headFin = 1.125;
//                    frame_headOffset = 0;
//                }
//                if(PRPMULLBTM === "Y"){
//                    frame_sillWidth = 2.489;
//                    frame_sillFin = 0;
//                    frame_sillOffset = .5;
//                }else{
//                    frame_sillWidth = 0.344;
//                    frame_sillFin = 1.125;
//                    frame_sillOffset = 0;
//                }
//                if(PRPMULLLFT === "Y"){
//                    frame_leftWidth = 0.980;
//                    frame_leftFin = 0;
//                    frame_leftOffset = .5;
//                }else{
//                    frame_leftWidth = 0.344;
//                    frame_leftFin = 1.125;
//                    frame_leftOffset = 0;
//                }
//                if(PRPMULLRGHT === "Y"){
//                    frame_rightWidth = 0.980;
//                    frame_rightFin = 0;
//                    frame_rightOffset = .5;
//                }else{
//                    frame_rightWidth = 0.344;
//                    frame_rightFin = 1.125;
//                    frame_rightOffset = 0;
//                }
//                break;
        }

        //sashes
        //sash_x changes based on config, but the rest are constant
        var lsash_x,rsash_x;
        var sash_y = frame_y + 1.448;
        var sash_top = 0.5;
        var sash_bot = 0.5;
        var sash_pull = 1.186;
        var sash_lock = 1.249;
        var addLsash = false;
        var addRsash = false;
        var lsash_w, rsash_w, lsash_h, rsash_h;
        switch(CNFG){
        case "XO":
            addLsash = true;
            lsash_w = SASHWDTH1;
            lsash_h = SASHHGHT1;
            break;
        case "OX":
            addRsash = true;
            rsash_w = SASHWDTH1;
            rsash_h = SASHHGHT1;
            break;
        case "XOX":
            addLsash = true;
            lsash_w = SASHWDTH1;
            lsash_h = SASHHGHT1;
            addRsash = true;
            rsash_w = SASHWDTH2;
            rsash_h = SASHHGHT2;
            break;
        }

    
        //check w and h...no need to continue is either is 0
        if(frame_w > 0 && frame_h > 0 && ((addLsash && (lsash_w > 0 && lsash_h > 0)) || (addRsash && (rsash_w > 0 && rsash_h > 0)))){
            //continue
            trace("call initOuterNonMtrdFrame from PGTrect.js");

            frame_x = frame_leftFin;
            frame_y = frame_headFin;
            frame_w = frame_w + frame_leftOffset + frame_rightOffset;
            frame_h = frame_h + frame_headOffset + frame_sillOffset;
 
            
            
            //bead variables
            var bead_x, bead_y, bead_w, bead_h;
            var bead_partWidth = 0.5;
            var glass_x, glass_y, glass_w, glass_h;
            var glass_color;
            
            //basic colonial setup
            //basic colonial setup
            var lgrid = {
                add:false,
                v_bars:COL1HQTY - 1,
                h_bars:COL1VQTY - 1,
                pattern:COL1PTRN,
                location1:0,
                location2:0,
                horiz_offset:0,
                vert_offset:0,
                square:COLSQSZ,
                radius:0,
                square_width:0,
                square_height:0,
                bar_width:getGridFace(COLTYPE),
                color:color
            };
            var rgrid = {
                add:false,
                v_bars:(CNFG === "XOX" ? COL3HQTY : COL2HQTY) - 1,
                h_bars:(CNFG === "XOX" ? COL3VQTY : COL2VQTY) - 1,
                pattern:(CNFG === "XOX" ? COL3PTRN : COL2PTRN),
                location1:0,
                location2:0,
                horiz_offset:0,
                vert_offset:0,
                square:COLSQSZ,
                radius:0,
                square_width:0,
                square_height:0,
                bar_width:getGridFace(COLTYPE),
                color:color
            };
            var fgrid = {
                add:false,
                v_bars:(CNFG === "OX" ? COL1HQTY : COL2HQTY) - 1,
                h_bars:(CNFG === "OX" ? COL1VQTY : COL2VQTY) - 1,
                pattern:(CNFG === "OX" ? COL1PTRN : COL2PTRN),
                location1:0,
                location2:0,
                horiz_offset:0,
                vert_offset:0,
                square:COLSQSZ,
                radius:0,
                square_width:0,
                square_height:0,
                bar_width:getGridFace(COLTYPE),
                color:color
            };
/*
            var grid_face;
            var lgrid_v_bars, lgrid_h_bars, lgrid_pattern;
            var rgrid_v_bars, rgrid_h_bars, rgrid_pattern;
            var fgrid_v_bars, fgrid_h_bars, fgrid_pattern;
            var addLgrid = false;
            var addRgrid = false;
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
            }*/
            //centralize grid conditioning
trace ("rgrid.add:" + rgrid.add);             
            switch(CNFG){
            case "XO":
                switch(COLLOC){
                case "CMPASSY":
                case "UNIT":
                    lgrid.add = (lgrid.bar_width > 0);
                    fgrid.add = (fgrid.bar_width > 0);
                    break;
                case "LFTSIDE":
                    lgrid.add = (lgrid.bar_width > 0);
                    break;
                case "RGHTSIDE":
                    fgrid.add = (fgrid.bar_width > 0);
                    break;
                }
                break;
            case "OX":
                switch(COLLOC){
                case "CMPASSY":
                case "UNIT":
                    fgrid.add = (fgrid.bar_width > 0);
                    rgrid.add = (rgrid.bar_width > 0);
                    break;
                case "LFTSIDE":
                    fgrid.add = (fgrid.bar_width > 0);
                    break;
                case "RGHTSIDE":
                    rgrid.add = (rgrid.bar_width > 0);
                    break;
                }
                break;
            case "XOX":
                switch(COLLOC){
                case "CMPASSY":
                case "UNIT":
                    lgrid.add = (lgrid.bar_width > 0);
                    fgrid.add = (fgrid.bar_width > 0);
                    rgrid.add = (rgrid.bar_width > 0);
                    break;
                case "LFTSIDE":
                    lgrid.add = (lgrid.bar_width > 0);
                    break;
                case "RGHTSIDE":
                    rgrid.add = (rgrid.bar_width > 0);
                    break;
                case "CNTR":
                    fgrid.add = (fgrid.bar_width > 0);
                    break;
                case "LFTRGHTSIDES":
                    lgrid.add = (lgrid.bar_width > 0);
                    rgrid.add = (rgrid.bar_width > 0);
                    break;
                }
                break;
            }
trace ("rgrid.add:" + rgrid.add);     
            //left sash
            if(addLsash){
                //Draw the left sash, glass, grid, and bead
                //first calculate the sash_x, then draw the sash frame
                lsash_x = frame_x + 1.060;
                initOuterNonMtrdFrame("lsash", lsash_x, sash_y, lsash_w, lsash_h, sash_pull,sash_lock,sash_top,true,sash_bot,true, color);
                //calculate the bead frame specs
                bead_x = lsash_x + sash_pull;
                bead_y = sash_y + sash_top;
                bead_w = lsash_w - sash_pull - sash_lock;
                bead_h = lsash_h - sash_top - sash_bot;
                // draw the glass
                glass_x = bead_x + bead_partWidth;
                glass_y = bead_y + bead_partWidth;
                glass_w	= bead_w - (bead_partWidth * 2);
                glass_h = bead_h - (bead_partWidth * 2);
                //left sash is always glass 1
                glass_color = getGlassColor(GLS1CLR);
                trace("InitGlass");
                initGlass("lglass","lsash", glass_x, glass_y, glass_w, glass_h, 0, glass_color);
                if(lgrid.add){
                    
                    initPGTGrid("lglass_pane","lgrid",glass_color,lgrid);
                    
/*                    switch(COLSTYL){
                    case "2/2V":
                    case "2/2H":
                    case "STD":
                    case "U.COL.LITES":
                    case "U.COL.BARS":
                        //conversion from lites to bars...segment is lites
                        //also note that the segments are confusing here...when STD or LITES, H and V are crossed
                        lgrid_v_bars = COL1HQTY - 1;
                        lgrid_h_bars = COL1VQTY - 1;

                        initGrid("lglass_pane","lgrid",lgrid_v_bars+"V"+lgrid_h_bars+"H",color,grid_face);

                        break;
                    case "9LP":
                        //create grid
                        initGrid("lglass_pane","lgrid","P1T1B1L1R"+COLSQSZ,color,grid_face);
                        //set the h bars for alignment conditioning
                        lgrid_h_bars = 2;
                        break;
                    case "6LP":
                        //create grid
                        initGrid("lglass_pane","lgrid","P1T1B1L0R"+COLSQSZ,color,grid_face);
                        //set the h bars for alignment conditioning
                        lgrid_h_bars = 2;
                        break;
                    case "CUSTOMLP":
                        switch(COL1PTRN){
                        //First the brittanies...easily handled by changing the # in the P pattern
                        case "3LPH":
                            //create grid
                            initGrid("lglass_pane","lgrid","P0T0B1L1R"+COLSQSZ,color,grid_face);
                            //set the h bars for alignment conditioning
                            lgrid_h_bars = 0;
                            break;
                        case "3LPV":
                            //create grid
                            initGrid("lglass_pane","lgrid","P1T1B0L0R"+COLSQSZ,color,grid_face);
                            //set the h bars for alignment conditioning
                            lgrid_h_bars = 2;
                            break;
                        case "6LPB":
                            //create grid
                            initGrid("lglass_pane","lgrid","P0T1B1L1R"+COLSQSZ,color,grid_face);
                            //set the h bars for alignment conditioning
                            lgrid_h_bars = 1;
                            break;
                        case "6LPT":
                            //create grid
                            initGrid("lglass_pane","lgrid","P1T0B1L1R"+COLSQSZ,color,grid_face);
                            //set the h bars for alignment conditioning
                            lgrid_h_bars = 1;
                            break;
                        case "6LPL":
                            //create grid
                            initGrid("lglass_pane","lgrid","P1T1B1L0R"+COLSQSZ,color,grid_face);
                            //set the h bars for alignment conditioning
                            lgrid_h_bars = 2;
                            break;
                        case "6LPR":
                            //create grid
                            initGrid("lglass_pane","lgrid","P1T1B0L1R"+COLSQSZ,color,grid_face);
                            //set the h bars for alignment conditioning
                            lgrid_h_bars = 2;
                            break;
                        case "9LP":
                            //create grid
                            initGrid("lglass_pane","lgrid","P1T1B1L1R"+COLSQSZ,color,grid_face);
                            //set the h bars for alignment conditioning
                            lgrid_h_bars = 2;
                            break;
                        }
                    }
*/
                }
//                initOuterNonMtrdFrame("lbead", bead_x, bead_y, bead_w, bead_h, bead_partWidth, bead_partWidth, bead_partWidth, false, bead_partWidth, false, color);
                initMitredFrame("lbead", bead_x, bead_y, bead_w, bead_h, bead_partWidth, color);                
            }
            //right sash
            if(addRsash){
                //Draw the right sash, glass, grid, and bead
                //first calculate the sash_x, then draw the sash frame
                rsash_x = (frame_x + frame_w) - 1.060 - rsash_w;
                initOuterNonMtrdFrame("sash", rsash_x, sash_y, rsash_w, rsash_h, sash_pull,sash_lock,sash_top,true,sash_bot,true, color);
                //calculate the bead frame specs
                bead_x = rsash_x + sash_pull;
                bead_y = sash_y + sash_top;
                bead_w = rsash_w - sash_pull - sash_lock;
                bead_h = rsash_h - sash_top - sash_bot;

                // draw the glass
                glass_x = bead_x + bead_partWidth;
                glass_y = bead_y + bead_partWidth;
                glass_w	= bead_w - (bead_partWidth * 2);
                glass_h = bead_h - (bead_partWidth * 2);
                //right sash needs to get glass color based on config
                switch(CNFG){
                case "OX":
                    glass_color = getGlassColor(GLS2CLR);
                    break;
                case "XOX":
                    glass_color = getGlassColor(GLS3CLR);
                    break;
                }
                
                trace("InitGlass");
                initGlass("rglass","rsash", glass_x, glass_y, glass_w, glass_h, 0, glass_color);

                if(rgrid.add){

                    initPGTGrid("rglass_pane","rgrid",glass_color,rgrid);


/*                switch(COLSTYL){
                    case "2/2V":
                    case "2/2H":
                    case "STD":
                    case "U.COL.LITES":
                    case "U.COL.BARS":
                        //conversion from lites to bars...segment is lites
                        switch(CNFG){
                        case "OX":
                            rgrid_v_bars = COL2HQTY - 1;
                            rgrid_h_bars = COL2VQTY - 1;
                            break;
                        case "XOX":
                            rgrid_v_bars = COL3HQTY - 1;
                            rgrid_h_bars = COL3VQTY - 1;
                            break;
                        }
                            
                            
                        initGrid("rglass_pane","rgrid",rgrid_v_bars+"V"+rgrid_h_bars+"H",color,grid_face);

                        break;
                    case "9LP":
                        //create grid
                        initGrid("rglass_pane","rgrid","P1T1B1L1R"+COLSQSZ,color,grid_face);
                        //set the h bars for alignment conditioning
                        rgrid_h_bars = 2;
                        break;
                    case "6LP":
                        //create grid
                        initGrid("rglass_pane","rgrid","P1T1B0L1R"+COLSQSZ,color,grid_face);
                        //set the h bars for alignment conditioning
                        rgrid_h_bars = 2;
                        break;
                    case "CUSTOMLP":
                        switch(CNFG){
                        case "OX":
                            rgrid_pattern = COL2PTRN;
                            break;
                        case "XOX":
                            rgrid_pattern = COL3PTRN;
                            break;
                        }
                        switch(rgrid_pattern){
                        //First the brittanies...easily handled by changing the # in the P pattern
                        case "3LPH":
                            //create grid
                            initGrid("rglass_pane","rgrid","P0T0B1L1R"+COLSQSZ,color,grid_face);
                            //set the h bars for alignment conditioning
                            rgrid_h_bars = 0;
                            break;
                        case "3LPV":
                            //create grid
                            initGrid("rglass_pane","rgrid","P1T1B0L0R"+COLSQSZ,color,grid_face);
                            //set the h bars for alignment conditioning
                            rgrid_h_bars = 2;
                            break;
                        case "6LPB":
                            //create grid
                            initGrid("rglass_pane","rgrid","P0T1B1L1R"+COLSQSZ,color,grid_face);
                            //set the h bars for alignment conditioning
                            rgrid_h_bars = 1;
                            break;
                        case "6LPT":
                            //create grid
                            initGrid("rglass_pane","rgrid","P1T0B1L1R"+COLSQSZ,color,grid_face);
                            //set the h bars for alignment conditioning
                            rgrid_h_bars = 1;
                            break;
                        case "6LPL":
                            //create grid
                            initGrid("rglass_pane","rgrid","P1T1B1L0R"+COLSQSZ,color,grid_face);
                            //set the h bars for alignment conditioning
                            rgrid_h_bars = 2;
                            break;
                        case "6LPR":
                            //create grid
                            initGrid("rglass_pane","rgrid","P1T1B0L1R"+COLSQSZ,color,grid_face);
                            //set the h bars for alignment conditioning
                            rgrid_h_bars = 2;
                            break;
                        case "9LP":
                            //create grid
                            initGrid("rglass_pane","rgrid","P1T1B1L1R"+COLSQSZ,color,grid_face);
                            //set the h bars for alignment conditioning
                            rgrid_h_bars = 2;
                            break;
                        }
                    }*/
                }
                
//                initOuterNonMtrdFrame("rbead", bead_x, bead_y, bead_w, bead_h, bead_partWidth, bead_partWidth, bead_partWidth, false, bead_partWidth, false, color);
                initMitredFrame("rbead", bead_x, bead_y, bead_w, bead_h, bead_partWidth, color);                
            }
            //draw the main frame
            initOuterNonMtrdFrame("frame", frame_x, frame_y, frame_w, frame_h, frame_leftWidth, frame_rightWidth, frame_headWidth, frame_top_thru, frame_sillWidth, frame_bot_thru, color);
    
            //place the meeting rail(s) and extra legs
            //since the fixed section is affected by the meeting rails, also calcuting that here
            var mr_x;
            var mr_y = frame_y + frame_headWidth;
            var mr_w = 1.038;
            var mr_h = frame_h - frame_headWidth - frame_sillWidth;
            
            if(addLsash){
                mr_x = frame_x + 1.060 + lsash_w - 0.794;
                //draw the meeting rail
                initFrameMember("lmrail", "frame", mr_x, mr_y, mr_w, mr_h, color);
                initFrameMember("lleg", "frame", frame_x + frame_leftWidth, frame_y + frame_headWidth, 0.457, frame_h - frame_headWidth - frame_sillWidth, color);
                initFrameMember("tlleg", "frame", frame_x + frame_leftWidth + 0.457, frame_y + frame_headWidth, mr_x - (frame_x + frame_leftWidth + 0.457) , 0.457, color);
                initFrameMember("blleg", "frame", frame_x + frame_leftWidth + 0.457, frame_h - frame_sillWidth - 0.457,mr_x - (frame_x + frame_leftWidth + 0.457) , 0.457, color);
                
                //calculate the fixed bead frame
                bead_x = mr_x + mr_w;
                bead_y = frame_y + frame_headWidth;
                bead_w = frame_w - bead_x - frame_rightWidth;
                bead_h = frame_h - frame_headWidth - frame_sillWidth;
            }
            if(addRsash){
                mr_x = (frame_x + frame_w) - 1.060 - rsash_w + 0.794 - mr_w;
                //draw the meeting rail
                initFrameMember("rmrail", "frame", mr_x, mr_y, mr_w, mr_h, color);
                initFrameMember("rleg", "frame", frame_x + (frame_w - frame_rightWidth) - 0.457, frame_y + frame_headWidth, 0.457, frame_h - frame_headWidth - frame_sillWidth, color);
                initFrameMember("trleg", "frame", mr_x + mr_w, frame_y + frame_headWidth, frame_w - frame_rightWidth - 0.437 - (mr_x + mr_w), 0.457, color);
                initFrameMember("brleg", "frame", mr_x + mr_w, frame_h - frame_sillWidth - 0.457, frame_w - frame_rightWidth - 0.437 - (mr_x + mr_w), 0.457, color);
                
                //calcualte the fixed bead frame 
                //if there is a left sash, then the fixed bead x and y have already been calculated based on that meeting rail location
                //if no left sash, we need to set the fixed bead x and y based on the left side fo the frame
                if(!addLsash){
                    bead_x = frame_x + frame_leftWidth;
                    bead_y = frame_y + frame_headWidth;
                }
                //the fixed bead will stop at the right mrail whether left sash exists or not
                bead_w = mr_x - bead_x;
                bead_h = frame_h - frame_headWidth - frame_sillWidth;
            }

            // draw the glass
            glass_x = bead_x + bead_partWidth;
            glass_y = bead_y + bead_partWidth;
            glass_w = bead_w - (bead_partWidth * 2);
            glass_h = bead_h - (bead_partWidth * 2);
            //fixed needs to get glass color based on config
            switch(CNFG){
            case "OX":
                glass_color = getGlassColor(GLS1CLR);
                break;
            case "XO":
            case "XOX":
                glass_color = getGlassColor(GLS2CLR);
                break;
            }

            trace("InitGlass");
            initGlass("fglass","frame", glass_x, glass_y, glass_w, glass_h, 0, glass_color);

            if(fgrid.add){
                
                initPGTGrid("fglass_pane","fgrid",glass_color,fgrid);
                
/*                switch(COLSTYL){
                case "2/2V":
                case "2/2H":
                case "STD":
                case "U.COL.LITES":
                case "U.COL.BARS":
                    //conversion from lites to bars...segment is lites
                    switch(CNFG){
                    case "OX":
                        fgrid_v_bars = COL1HQTY - 1;
                        fgrid_h_bars = COL1VQTY - 1;
                        break;
                    case "XO":
                    case "XOX":
                        fgrid_v_bars = COL2HQTY - 1;
                        fgrid_h_bars = COL2VQTY - 1;
                        break;
                    }

                    initGrid("fglass_pane","fgrid",fgrid_v_bars+"V"+fgrid_h_bars+"H",color,grid_face);

                    break;
                case "9LP":
                    //create grid
                    initGrid("fglass_pane","fgrid","P1T1B1L1R"+COLSQSZ,color,grid_face);
                    //set the h bars for alignment conditioning
                    fgrid_h_bars = 2;

                    break;
                case "6LP":
                    //create grid
                    switch(CNFG){
                    case "XOX":
                        initGrid("fglass_pane","fgrid","P1T1B0L0R"+COLSQSZ,color,grid_face);
                        //set the h bars for alignment conditioning
                        fgrid_h_bars = 2;
                        break;
                    case "XO":
                        initGrid("fglass_pane","fgrid","P1T1B0L1R"+COLSQSZ,color,grid_face);
                        //set the h bars for alignment conditioning
                        fgrid_h_bars = 2;
                        break;
                    case "OX":
                        initGrid("fglass_pane","fgrid","P1T1B1L0R"+COLSQSZ,color,grid_face);
                        //set the h bars for alignment conditioning
                        fgrid_h_bars = 2;
                        break;
                    }
                    break;
                case "CUSTOMLP":
                    switch(CNFG){
                    case "OX":
                        fgrid_pattern = COL1PTRN;
                        break;
                    case "XO":
                    case "XOX":
                        fgrid_pattern = COL2PTRN;
                        break;
                    }
                    switch(fgrid_pattern){
                    //First the brittanies...easily handled by changing the # in the P pattern
                    case "3LPH":
                        //create grid
                        initGrid("fglass_pane","fgrid","P0T0B1L1R"+COLSQSZ,color,grid_face);
                        //set the h bars for alignment conditioning
                        fgrid_h_bars = 0;
                        break;
                    case "3LPV":
                        //create grid
                        initGrid("fglass_pane","fgrid","P1T1B0L0R"+COLSQSZ,color,grid_face);
                        //set the h bars for alignment conditioning
                        fgrid_h_bars = 2;
                        break;
                    case "6LPB":
                        //create grid
                        initGrid("fglass_pane","fgrid","P0T1B1L1R"+COLSQSZ,color,grid_face);
                        //set the h bars for alignment conditioning
                        fgrid_h_bars = 1;
                        break;
                    case "6LPT":
                        //create grid
                        initGrid("fglass_pane","fgrid","P1T0B1L1R"+COLSQSZ,color,grid_face);
                        //set the h bars for alignment conditioning
                        fgrid_h_bars = 1;
                        break;
                    case "6LPL":
                        //create grid
                        initGrid("fglass_pane","fgrid","P1T1B1L0R"+COLSQSZ,color,grid_face);
                        //set the h bars for alignment conditioning
                        fgrid_h_bars = 2;
                        break;
                    case "6LPR":
                        //create grid
                        initGrid("fglass_pane","fgrid","P1T1B0L1R"+COLSQSZ,color,grid_face);
                        //set the h bars for alignment conditioning
                        fgrid_h_bars = 2;
                        break;
                    case "9LP":
                        //create grid
                        initGrid("fglass_pane","fgrid","P1T1B1L1R"+COLSQSZ,color,grid_face);
                        //set the h bars for alignment conditioning
                        fgrid_h_bars = 2;
                        break;
                    }

                }*/
                //align grids
                if(lgrid.add && lgrid.h_bars === fgrid.h_bars){
                    alignlite_h("fglass_pane", "fgrid", "lglass_pane", "lgrid", "", 0);
                }
                if(rgrid.add && rgrid.h_bars === fgrid.h_bars){
                    alignlite_h("fglass_pane", "fgrid", "rglass_pane", "rgrid", "", 0);
                }

            }

//            initOuterNonMtrdFrame("fbead", bead_x, bead_y, bead_w, bead_h, bead_partWidth, bead_partWidth, bead_partWidth, false, bead_partWidth, false, color);
            initMitredFrame("fbead", bead_x, bead_y, bead_w, bead_h, bead_partWidth, color);

            //and handing
            if(addLsash){
                initDirection("l_direction","lglass_pane","R");
            }
            if(addRsash){
                initDirection("r_direction","rglass_pane","L");
            }
            //Add dims
            var w_dimOffset = 1.5;
            var h_dimOffset = 1.5;
            var dim_x1, dim_y1, dim_x2, dim_y2;
            
            //custom sash dims
            if(VNTCNFG === "CSTM.VNT"){
                if(addLsash){
                    dim_x1 = lsash_x;
                    dim_y1 = frame_h + (frame_headFin + frame_sillFin) + 1.5;
                    dim_x2 = dim_x1 + lsash_w;
                    dim_y2 = dim_y1;
                    w_dimOffset = 4;
                    createDim(dim_x1,dim_y1,dim_x2,dim_y2,false);
                }
                if(addRsash){
                    dim_x1 = rsash_x;
                    dim_y1 = frame_h + (frame_headFin + frame_sillFin) + 1.5;
                    dim_x2 = dim_x1 + rsash_w;
                    dim_y2 = dim_y1;
                    w_dimOffset = 4;
                    createDim(dim_x1,dim_y1,dim_x2,dim_y2,false);
                }
            }

            //width
            dim_x1 = frame_x + frame_leftOffset;
            dim_y1 = frame_h + (frame_headFin + frame_sillFin) + w_dimOffset;
            dim_x2 = frame_x + frame_w - frame_rightOffset;
            dim_y2 = dim_y1;
            
            createDim(dim_x1,dim_y1,dim_x2,dim_y2,false);

            //height
            dim_x1 = frame_w + (frame_leftFin + frame_rightFin) + h_dimOffset;
            dim_y1 = frame_y + frame_headOffset;
            dim_x2 = dim_x1;
            dim_y2 = frame_y + frame_h - frame_sillOffset;

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
        
            createDim(dim_x1,dim_y1,dim_x2,dim_y2,false);


        }
// INSERT YOUR SCRIPTING HERE!!!!!



	returnConfigData();  // post values to confguration code
}

