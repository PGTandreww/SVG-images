// $import="fc.js"
// $import="PGTshapes.js"
// $import="PGTelliptical.js"
// $import="PGTcolors.js"

var drawing = null;
// $return$

function generate(evt)
{
       
        drawing = evt.getTarget().getOwnerDocument();

	// $initialize$

	var PAD = nested=="true"?0:9;

        //get frame color from PGTcolors.js
	var color = getFrameColor(FRMCLR);

	trace("set up main frame variables");

	//draw the main frame
        //X and Y coordinates of main frame...always start with 0
	var frame_x = 0;
	var frame_y = 0;
        //configured width and height of unit from segments
	var frame_w = WDTH; 
	var frame_h = HGHT;
        var frame_l = LG;
        var frame_tl = TPLNGTH;
        var frame_rl = RGHTLG;
        var frame_ll = LFTLG;
        
        //init other variables that will be used based on config to affect drawing
        //the Width variables are the face width of the extrusion
	var frame_partWidth;
        var frame_headWidth, frame_sillWidth, frame_leftWidth, frame_rightWidth;
        //the Fin variables are the width of the fin to be added outside the mainframe
	var frame_partFin;
        var frame_headFin, frame_sillFin, frame_leftFin, frame_rightFin;
        //the Offset variables are the offset between DLO and TTT
        //if a fin unit is prepped for mull, a flange frame will be substituted, and the dimension will stay in DLO
        //flange dimensional reference is TTT, so we need this offset to account for that
	var frame_partOffset;
        var frame_headOffset, frame_sillOffset, frame_leftOffset, frame_rightOffset;
        //the thru variables are to tell the base outer frame method whether the head and/or sill are full width
        //true = the top/bot is the full width of the unit
        //false = the sides are the full height of the unit
	var frame_top_thru = true;
	var frame_bot_thru = true;
        //Boolean flag to easily flip the outer frame on/off
	var addFin = false;
        
        switch(FRMTYPE){
            case ".5FLANGE":
                //base dims for flange frame...pulled from CAD drawing
                frame_partWidth = 0.844;
                frame_partFin = 0;
                frame_partOffset = 0;
                break;
            case "1.125FIN":
                //flip the flag
                addFin = true;
                //base dimes for fin frame...taken from CAD drawing
                //note that we need to check each side of the frame to see if it is prepped for mulling
                //if it is that side is actually flange, so it gets those specs, with the offset value to set the reference to DLO and no fin
                //if it is not, then it gets the frame and fin sizes 
                if(PRPMULLTP === "Y"){
                    frame_headWidth = 0.844;
                    frame_headFin = 0;
                    frame_headOffset = .5;                    
                }
                else{
                    frame_headWidth = 0.344;                    
                    frame_headFin = 1.125;
                    frame_headOffset = 0;
                }
                if(PRPMULLBTM === "Y"){
                    frame_sillWidth = 0.844;
                    frame_sillFin = 0;
                    frame_sillOffset = .5;
                }
                else{
                    frame_sillWidth = 0.344;
                    frame_sillFin = 1.125;
                    frame_sillOffset = 0;
                }
                if(PRPMULLLFT === "Y"){
                    frame_leftWidth = 0.844;
                    frame_leftFin = 0;
                    frame_leftOffset = .5;
                }
                else{
                    frame_leftWidth = 0.344;
                    frame_leftFin = 1.125;
                    frame_leftOffset = 0;
                }
                if(PRPMULLRGHT === "Y"){
                    frame_rightWidth = 0.844;
                    frame_rightFin = 0;
                    frame_rightOffset = .5;
                }
                else{
                    frame_rightWidth = 0.344;
                    frame_rightFin = 1.125;
                    frame_rightOffset = 0;
                }
                break;
        }

	//adjustDocSize(WDTH,HGHT,400,400,PAD);
        var type;
        
        switch(SHP){
            case "FC":
                frame_h = frame_w;
                initEllipseFrame("frame", frame_x, frame_y, frame_w, frame_h, frame_partWidth, color);
                break;
            case "HC":
                initArchCircularWithSill("frame", frame_x, frame_y, frame_w, frame_w / 2, 0, frame_partWidth, frame_partWidth, color, "F");
                break;
            case "QC":
                switch(SHPORNT){
                    case "LEFT":
                        type = "L";
                        break;
                    case "RIGHT":
                        type = "R"
                        break;
                }
                initArchCircularWithSill("frame", frame_x, frame_y, frame_w, frame_w, 0, frame_partWidth, frame_partWidth, color, type);
                break;
            case "AR":
                initArchCircularWithSill("frame", frame_x, frame_y, frame_w, frame_h, frame_h - (frame_w / 2), frame_partWidth, frame_partWidth, color, "F");
                break;
            case "HAR":
                switch(SHPORNT){
                    case "LEFT":
                        type = "L";
                        break;
                    case "RIGHT":
                        type = "R"
                        break;
                }
                initArchCircularWithSill("frame", frame_x, frame_y, frame_w, frame_h, frame_h - frame_w, frame_partWidth, frame_partWidth, color, type);
                break;
            case "EB":
                initArchCircularWithSill("frame", frame_x, frame_y, frame_w, frame_h, frame_l, frame_partWidth, frame_partWidth, color, "F");
                break;
            case "HEB":
                switch(SHPORNT){
                    case "LEFT":
                        type = "L";
                        break;
                    case "RIGHT":
                        type = "R"
                        break;
                }
                initArchCircularWithSill("frame", frame_x, frame_y, frame_w, frame_h, frame_l, frame_partWidth, frame_partWidth, color, type);
                break;
            case "FN":
                initArchCircularWithSill("frame", frame_x, frame_y, frame_w, frame_h, 0, frame_partWidth, frame_partWidth, color, "F");
                break;
            case "HFN":
                switch(SHPORNT){
                    case "LEFT":
                        type = "L";
                        break;
                    case "RIGHT":
                        type = "R"
                        break;
                }
                initArchCircularWithSill("frame", frame_x, frame_y, frame_w, frame_h, 0, frame_partWidth, frame_partWidth, color, type);
                break;
            case "OV":
                initEllipseFrame("frame", frame_x, frame_y, frame_w, frame_h, frame_partWidth, color);
                break;
            case "EL":
                initFrame3CentredArchWithSill("frame", frame_x, frame_y, frame_w, frame_h, 0, frame_partWidth, frame_partWidth, color, "F");
                break;
            case "HEL":
                switch(SHPORNT){
                    case "LEFT":
                        type = "L";
                        break;
                    case "RIGHT":
                        type = "R"
                        break;
                }
                initFrame3CentredArchWithSill("frame", frame_x, frame_y, frame_w, frame_h, 0, frame_partWidth, frame_partWidth, color, type);
                break;
            case "OC":
                //EQUAL VERIFIED
                //UNEQUAL UNSUPPORTED...Octagon assumes it is symmetrical...we can stretch them wider then they are high...
                
                switch(SHPORNT){
                    case "EQUAL":
                        break;
                    case "UNEQUAL":
                        break;
                }
                initMitredOctagonFrame("frame", frame_x, frame_y, frame_w, frame_partWidth, color);
                break;
            case "HX":
                //EQUAL VERIFIED
                //UNEQUAL UNSUPPORTED...Hexagon assumes it is symmetrical...we can stretch them wider or change the centerline height...
                switch(SHPORNT){
                    case "EQUAL":
                        break;
                    case "UNEQUAL":
                        break;
                }
                initMitredHexagonFrame("frame", frame_x, frame_y, frame_w, frame_partWidth, color);
                break;
            case "TI":
                //VERIFIED
                switch(SHPORNT){
                    case "LEFT":
                        type = "RT";
                        break;
                    case "RIGHT":
                        type = "LT";
                        break;
                    case "EQUAL":
                    //calculate height for function call
                        frame_h = frame_w / 2 * Math.sqrt(3);  
                    case "ISOSCELES":
                        type = "IT";
                        break;
                }
                initMitredTriangleFrame("frame", frame_x, frame_y, frame_w, frame_h, frame_partWidth, color, type);
                break;
            case "PP":
                //EQ_LEG VERIFIED
                //UNEQ_LEG UNSUPPORTED...HomePlate does not allow for unequal legs or off-center peak
                switch(SHPORNT){
                    case "EQ_LEG":
                    case "UNEQ_LEG":
                        type = "T";
                        break;
                }
                initHomePlateFrame("frame", frame_x, frame_y, frame_w, frame_h, frame_l, frame_partWidth,frame_partWidth, color, type);
                break;
            case "TZ":
                //VERIFIED
                switch(SHPORNT){
                    case "LEFT":
                        type = "LT";
                        break;
                    case "RIGHT":
                        type = "RT";
                        break;
                }
                initTrapezoidFrame("frame", frame_x, frame_y, frame_w, frame_h, frame_l, frame_partWidth,frame_partWidth, color, type);
                break;
            case "5TZ":
                //VERIFIED
                switch(SHPORNT){
                    case "LEFT":
                        type = "LT";
                        break;
                    case "RIGHT":
                        type = "RT";
                        break;
                }
                initClipTrapFrame("frame", frame_x, frame_y, frame_w, frame_tl, frame_h, frame_l, frame_partWidth,frame_partWidth, color, type);
                break;
        }
        //check w and h...no need to continue is either is 0
//        if(frame_w > 0 && frame_h > 0){
//            //continue
//            trace("call initOuterNonMtrdFrame from PGTrect.js");
//
//            frame_x = frame_leftFin;
//            frame_y = frame_headFin;
//            frame_w = frame_w + frame_leftOffset + frame_rightOffset;
//            frame_h = frame_h + frame_headOffset + frame_sillOffset;
// 
//            initOuterNonMtrdFrame("frame", frame_x, frame_y, frame_w, frame_h, frame_leftWidth, frame_rightWidth, frame_headWidth, frame_top_thru, frame_sillWidth, frame_bot_thru, color);
//
//            //if this is IF, then draw the fin
//            if(addFin){
//                initOuterNonMtrdFrame("frame_fin", 0, 0, frame_w + frame_leftFin + frame_rightFin, frame_h + frame_headFin + frame_sillFin, frame_leftFin, frame_rightFin, frame_headFin, frame_top_thru, frame_sillFin, frame_bot_thru, color);
//            }
//            
//            //set up the bead frame...we draw it after we draw the muntin, but we use its calcs for glass
//            var bead_x = frame_x + frame_leftWidth;
//            var bead_y = frame_y + frame_headWidth;
//            var bead_w = frame_w - (frame_leftWidth + frame_rightWidth);
//            var bead_h = frame_h - (frame_headWidth + frame_sillWidth);
//            var bead_partWidth = 0.5;
//            var bead_top_thru = false;
//            var bead_bot_thru = false;
//
//            // draw the glass
//            var glass_x = bead_x + bead_partWidth;
//            var glass_y = bead_y + bead_partWidth;
//            var glass_w	= bead_w - (bead_partWidth * 2);
//            var glass_h = bead_h - (bead_partWidth * 2);
//            //var glass_overlap = bead_partWidth; 
//            var glass_color = getGlassColor(GLS1CLR);
//
//            trace("InitGlass");
//            initGlass("glass","bead", glass_x, glass_y, glass_w, glass_h, 0, glass_color);
//
//            //colonial
//            var grid_color = getFrameColor(COLCLR);
//            var grid_v_offset = (glass_y - frame_y) - frame_headOffset; 
//            var grid_h_offset = (glass_x - frame_x) - frame_leftOffset;
//
//            var grid_v_bars, grid_h_bars, grid_face, grid_radius, grid_sq_h, grid_sq_v;
//
//            switch(COLTYPE){
//                case "DA1000":
//                case "DF1000":
//                case "SR1000":
//                    grid_face = 1;
//                    break;
//                case "GBGF0563":
//                    grid_face = 0.563;
//                    break;
//            }
//           
//            switch(COLSTYL){
//                case "U.COL.LITES":
//                case "U.COL.BARS":
//                    //conversion from lites to bars...segment is lites
//                    grid_v_bars = COL1HQTY - 1;
//                    grid_h_bars = COL1VQTY - 1;
//
//                    initGrid("glass_pane","grid",grid_v_bars+"V"+grid_h_bars+"H",grid_color,grid_face);
//
//                    break;
//                case "9LP":
//                    //create grid
//                    initGrid("glass_pane","grid","P1T1B1L1R"+COLSQSZ,grid_color,grid_face);
//
//                    break;
//                case "CUSTOMLP":
//                case "CODE":
//                    switch(COL1PTRN){
//                        case "PW5LSB":
//                        case "PW5LSBX":
//                        case "PW8LSB":
//                        case "PW8LSBT":
//                        case "PW9LSB":
//                           if(COLCRCLDIA > 0){
//                                grid_radius = COLCRCLDIA/2;
//                            }else{
//                                grid_radius = WDTH/4;
//                            }
//                            break;
//                        case "PW5L-SQ":
//                            if(COLPCSTMSQH > 0){
//                                grid_sq_h = COLPCSTMSQH;
//                            }else{
//                                grid_sq_h = COLPSTDSQH;
//                            }
//                            if(COLPCSTMSQV > 0){
//                                grid_sq_v = COLPCSTMSQV;
//                            }else{
//                                grid_sq_v = COLPSTDSQV;
//                            }
//                            break;
//
//                        }
//
//                    switch(COL1PTRN){
//                        //First the brittanies...easily handled by changing the # in the P pattern
//                        case "3LPH":
//                            //create grid
//                            initGrid("glass_pane","grid","P0T0B1L1R"+COLSQSZ,grid_color,grid_face);
//                            break;
//                        case "3LPV":
//                            //create grid
//                            initGrid("glass_pane","grid","P1T1B0L0R"+COLSQSZ,grid_color,grid_face);
//                            break;
//                        case "6LPB":
//                            //create grid
//                            initGrid("glass_pane","grid","P0T1B1L1R"+COLSQSZ,grid_color,grid_face);
//                            break;
//                        case "6LPT":
//                            //create grid
//                            initGrid("glass_pane","grid","P1T0B1L1R"+COLSQSZ,grid_color,grid_face);
//                            break;
//                        case "6LPL":
//                            //create grid
//                            initGrid("glass_pane","grid","P1T1B1L0R"+COLSQSZ,grid_color,grid_face);
//                            break;
//                        case "6LPR":
//                            //create grid
//                            initGrid("glass_pane","grid","P1T1B0L1R"+COLSQSZ,grid_color,grid_face);
//                            break;
//                        //Now the complex patterns...
//                        //the following are Craftsman...grids start at top and go down
//                        //C#V#H(T or B)(location) - where location is the location of the bounding muntin 
//                        case "1T":
//                        case "1B":
//                            //single horizontal bar w/ user defined location
//                            //create grid
//                            initGrid("glass_pane","grid","C0V1HT"+(COLMTNLOC1-grid_v_offset),grid_color,grid_face);
//                            break;
//                        case "1TB":
//                            //top horizontal bar w/ user defined location
//                            //create grid
//                            initGrid("glass_pane","grid1","C0V1HT"+(COLMTNLOC1-grid_v_offset),grid_color,grid_face);
//                            //bottom horizontal bar w/ user defined location
//                            //create grid
//                            initGrid("glass_pane","grid2","C0V1HB"+(glass_h-(COLMTNLOC2-grid_v_offset)),grid_color,grid_face);
//                            break;
//                        case "2-1T":
//                            //single horizontal bar w/ user defined location 
//                            //single vertical bar standard location above horizontal
//                            //create grid
//                            initGrid("glass_pane","grid","C1V1HT"+(COLMTNLOC1-grid_v_offset),grid_color,grid_face);
//                            break;
//                        case "2-1B":
//                            //single horizontal bar w/ user defined location 
//                            //single vertical bar standard location below horizontal
//                            //create grid
//                            initGrid("glass_pane","grid","C1V1HB"+(COLMTNLOC1-grid_v_offset),grid_color,grid_face);
//                            break;
//                        case "2-2B":
//                        case "2-2T":
//                            //single vertical bar in standard location 
//                            //create grid
//                            initGrid("glass_pane","grid1","1V0H",grid_color,grid_face); 
//                            //single horizontal bar w/ user defined location 
//                            //create grid
//                            initGrid("glass_pane","grid2","C1V1HB"+(COLMTNLOC1-grid_v_offset),grid_color,grid_face);
//                            break;
//                        case "2-3TB":
//                            //single vertical bar in standard location 
//                            //create grid
//                            initGrid("glass_pane","grid1","1V0H",grid_color,grid_face); 
//                            //top horizontal bar w/ user defined location
//                            //create grid
//                            initGrid("glass_pane","grid2","C0V1HT"+(COLMTNLOC1-grid_v_offset),grid_color,grid_face);
//                            //bottom horizontal bar w/ user defined location
//                            //create grid
//                            initGrid("glass_pane","grid3","C0V1HB"+(glass_h-(COLMTNLOC2-grid_v_offset)),grid_color,grid_face);
//                            break;
//                        case "3-2T":
//                            //single horizontal bar w/ user defined location 
//                            //double vertical bar standard location
//                            //create grid
//                            initGrid("glass_pane","grid","C2V1HT"+(COLMTNLOC1-grid_v_offset),grid_color,grid_face);
//                            break;
//                        case "4-2T":
//                            //single horizontal bar w/ user defined location 
//                            //triple vertical bar standard location
//                            //create grid
//                            initGrid("glass_pane","grid","C3V1HT"+(COLMTNLOC1-grid_v_offset),grid_color,grid_face);
//                            break;
//                        case "2-2-3T":
//                            //double horizontal bar w/ user defined location 
//                            //single vertical bar standard location
//                            //create grid
//                            initGrid("glass_pane","grid","C1V2HT"+(COLMTNLOC1-grid_v_offset),grid_color,grid_face);
//                            break;
//                        case "3-3-3T":
//                            //double horizontal bar w/ user defined location 
//                            //double vertical bar standard location
//                            //create grid
//                            initGrid("glass_pane","grid","C2V2HT"+(COLMTNLOC1-grid_v_offset),grid_color,grid_face);
//                            break;
//                        case "PW4L":
//                            //create grid
//                            initGrid("glass_pane","grid","D1V1H",grid_color,grid_face);
//                            break;
//                        case "PW8L":
//                            //create grid
//                            initGrid("glass_pane","grid1","D1V1H",grid_color,grid_face);
//                            initGrid("glass_pane","grid2","1V1H",grid_color,grid_face);
//                            break;
//                        case "PW6LV":
//                            //create grid
//                            initGrid("glass_pane","grid1","D1V1H",grid_color,grid_face);
//                            initGrid("glass_pane","grid2","1V0H",grid_color,grid_face);
//                            break;
//                        case "PW6LH":
//                            //create grid
//                            initGrid("glass_pane","grid1","D1V1H",grid_color,grid_face);
//                            initGrid("glass_pane","grid2","0V1H",grid_color,grid_face);
//                            break;
//                        case "PW5LSB":
//                            //create grid
//                            initGrid("glass_pane","grid1","1V1H",grid_color,grid_face);
//                            //add circle
//                            trace("add circle");
//                            initGrid("glass_pane","grid2","R"+grid_radius+"F"+glass_color,grid_color,grid_face);
//                            break;
//                        case "PW5LSBX":
//                            //create grid
//                            initGrid("glass_pane","grid1","D1V1H",grid_color,grid_face);
//                            //add circle
//                            initGrid("glass_pane","grid2","R"+grid_radius+"F"+glass_color,grid_color,grid_face);
//                            break;
//                        case "PW8LSB":
//                            //create grid
//                            initGrid("glass_pane","grid1","D1V1H",grid_color,grid_face);
//                            //add circle
//                            initGrid("glass_pane","grid2","R"+grid_radius+"Fnone",grid_color,grid_face);
//                            break;
//                        case "PW8LSBT":
//                            //create grid
//                            initGrid("glass_pane","grid1","1V1H",grid_color,grid_face);
//                            //add circle
//                            initGrid("glass_pane","grid2","R"+grid_radius+"Fnone",grid_color,grid_face);
//                            break;
//                        case "PW9LSB":
//                            //create grid
//                            initGrid("glass_pane","grid1","D1V1H",grid_color,grid_face);
//                            initGrid("glass_pane","grid2","1V1H",grid_color,grid_face);
//                            //add circle
//                            initGrid("glass_pane","grid3","R"+grid_radius+"F"+glass_color,grid_color,grid_face);
//                            break;
//                        case "PW5L-SQ":
//                            //create grid
//                            initGrid("glass_pane","grid1","D1V1H",grid_color,grid_face);
//                            //create square
//                            initGrid("glass_pane","grid2","Q"+grid_sq_h+"X"+grid_sq_v+"F"+glass_color,grid_color,grid_face);
//                            break;
//
//                        
//                        
//                        
//                        
//                        
//                    }
//               
//            
//              
//                    
//            }
//
//    //
//    //            if(grid === "")
//    //            {
//    //                    grid = "NONE";
//    //            }
//    //            var vert = COL1HQTY-1;
//    //            var horz = COL1VQTY-1;
//    //
//    //            if(grid !== "NONE")
//    //            {
//    //                    s("f_t_grid_v",vert);
//    //                    s("f_t_grid_h",horz);
//    //            drawGrid("t_glass_pane","t_grid_",color,0.75,false);
//    //            }
//            initOuterNonMtrdFrame("bead", bead_x, bead_y, bead_w, bead_h, bead_partWidth, bead_partWidth, bead_partWidth, bead_top_thru, bead_partWidth, bead_bot_thru, color);
//
            //Add dims
            var w_dimOffset = 1.5;
            var h_dimOffset = 1.5;
            var dim_x1, dim_y1, dim_x2, dim_y2;
            
            
            //width
            dim_x1 = frame_x + frame_partOffset;
            dim_y1 = frame_h + (frame_partFin + frame_partFin) + w_dimOffset;
            dim_x2 = frame_x + frame_w - frame_partOffset;
            dim_y2 = dim_y1;
            
            trace(dim_x1+","+dim_y1+","+dim_x2+","+dim_y2);
            createDim(dim_x1,dim_y1,dim_x2,dim_y2,false);

            //height
            dim_x1 = frame_w + (frame_partFin + frame_partFin) + h_dimOffset;
            dim_y1 = frame_y + frame_partOffset;
            dim_x2 = dim_x1;
            dim_y2 = frame_y + frame_h - frame_partOffset;
//
//            //custom muntin location...add in first to see if we need to move the main dim
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
//        
            dim_x1 = dim_x1 + h_dimOffset;
            dim_x2 = dim_x1;
        
            createDim(dim_x1,dim_y1,dim_x2,dim_y2,false);
//
//
//        }
//// INSERT YOUR SCRIPTING HERE!!!!!



	returnConfigData();  // post values to confguration code
}

