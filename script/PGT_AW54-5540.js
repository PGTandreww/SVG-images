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

//	var color = getFrameColor(FRMCLR);

	trace("set up main frame variables");

	//draw the main frame
        var frame = {
            x:0,
            y:0,
            width:WDTH,
            height:HGHT,
            headWidth:0,
            sillWidth:0,
            leftWidth:0,
            rightWidth:0,
            headFin:0,
            sillFin:0,
            leftFin:0,
            rightFin:0,
            headOffset:0,
            sillOffset:0,
            leftOffset:0,
            rightOffset:0,
            color:getFrameColor(FRMCLR,"V")
        };	
        var sash = {
            x:0,
            y:0,
            width:0,
            height:0,
            topWidth:1.875,
            botWidth:1.875,
            leftWidth:1.875,
            rightWidth:1.875,
            xOffset:0,
            yOffset:0
        };          

        //check w and h...no need to continue is either is 0
        if(frame.width > 0 && frame.height> 0){
            //continue
            trace("call initOuterMiteredFrame from PGTrect.js");
            var addFin = false;
            switch(FRMTYPE){
                case ".625FLANGE":
                    //base dims for flange frame...pulled from CAD drawing
                    frame.headWidth = 1.41;
                    frame.headFin = 0;
                    frame.headOffset = 0.625;
                    frame.sillWidth = 1.41;
                    frame.sillFin = 0;
                    frame.sillOffset = 0.625;
                    frame.leftWidth = 1.41;
                    frame.leftFin = 0;
                    frame.leftOffset = 0.625;
                    frame.rightWidth = 1.41;
                    frame.rightFin = 0;
                    frame.rightOffset = 0.625;
                    sash.xOffset = 1.41;
                    sash.yOffset = 1.41;
                    break;
                case "EQUAL":
                    //base dims for flange frame...pulled from CAD drawing
                    frame.headWidth = .785;
                    frame.headFin = 0;
                    frame.headOffset = 0;
                    frame.sillWidth = .785;
                    frame.sillFin = 0;
                    frame.sillOffset = 0;
                    frame.leftWidth = .785;
                    frame.leftFin = 0;
                    frame.leftOffset = 0;
                    frame.rightWidth = .785;
                    frame.rightFin = 0;
                    frame.rightOffset = 0;
                    sash.xOffset = .785;
                    sash.yOffset = .785;
                    break;
                case "1.375FIN":
                    //flip the flag
                    addFin = true;
                    //base dimes for fin frame...taken from CAD drawing
                    //note that we need to check each side of the frame to see if it is prepped for mulling
                    //if it is that side is actually flange, so it gets those specs, with the offset value to set the reference to DLO and no fin
                    //if it is not, then it gets the frame and fin sizes 
                    frame.headWidth = .785;
                    frame.headOffset = 0;                    
                    sash.yOffset = .785;
                    if(PRPMULLTP === "Y"){
                        frame.headFin = 0;
                    }
                    else{
                        frame.headFin = 1.375;
                    }
                    frame.sillWidth = .785;
                    frame.sillOffset = 0;
                    if(PRPMULLBTM === "Y"){
                        frame.sillFin = 0;
                    }
                    else{
                        frame.sillFin = 1.375;
                    }
                    frame.leftWidth = .785;
                    frame.leftOffset = 0;
                    sash.xOffset = .785;
                    if(PRPMULLLFT === "Y"){
                        frame.leftFin = 0;
                    }
                    else{
                        frame.leftFin = 1.375;
                    }
                    frame.rightWidth = .785;
                    frame.rightOffset = 0;
                    if(PRPMULLRGHT === "Y"){
                        frame.rightFin = 0;
                    }
                    else{
                        frame.rightFin = 1.375;
                    }
                    break;
                case "JCHANNEL":
                    //flip the flag
                    addFin = true;
                    //base dimes for fin frame...taken from CAD drawing
                    //note that we need to check each side of the frame to see if it is prepped for mulling
                    //if it is that side is actually flange, so it gets those specs, with the offset value to set the reference to DLO and no fin
                    //if it is not, then it gets the frame and fin sizes 
                    frame.headWidth = 1.41;
                    frame.headOffset = 0.625;                    
                    sash.yOffset = 1.41;
                    if(PRPMULLTP === "Y"){
                        frame.headFin = 0;
                    }
                    else{
                        frame.headFin = 0.75;
                    }
                    frame.sillWidth = 1.41;
                    frame.sillOffset = 0.625;
                    if(PRPMULLBTM === "Y"){
                        frame.sillFin = 0;
                    }
                    else{
                        frame.sillFin = 0.75;
                    }
                    frame.leftWidth = 1.41;
                    frame.leftOffset = 0.625;
                    sash.xOffset = 1.41;
                    if(PRPMULLLFT === "Y"){
                        frame.leftFin = 0;
                    }
                    else{
                        frame.leftFin = 0.75;
                    }
                    frame.rightWidth = 1.41;
                    frame.rightOffset = 0.625;
                    if(PRPMULLRGHT === "Y"){
                        frame.rightFin = 0;
                    }
                    else{
                        frame.rightFin = 0.75;
                    }
                    break;
            }
            frame.x = frame.leftFin;
            frame.y = frame.headFin;
            frame.width = frame.width + frame.leftOffset + frame.rightOffset;
            frame.height= frame.height+ frame.headOffset + frame.sillOffset;
            
            //bead variables
            var bead = {
                x:0,
                y:0,
                width:0,
                height:0,
                partWidth:0.644
            };
            var glass = {
                x:0,
                y:0,
                width:0,
                height:0,
                color:""
            };
            
//
//            var grid = {
//                v_bars:0,
//                h_bars:0,
//                pattern:"",
//                barWidth:0
//            };
//            var addGrid = false;
//            
//            switch(COL1TYPE){
//                case "DA1000":
//                case "DF1000":
//                case "SR1000":
//                    grid.barWidth = 1;
//                    break;
//                case "GBGF0563":
//                    grid.barWidth = 0.563;
//                    break;
//                case "SDLT0875":
//                    grid.barWidth = 0.875;
//                    break;
//                case "SDLT0875":
//                    grid.barWidth = 0.875;
//                    break;
//                case "GBGF0813":
//                    grid.barWidth = 0.813;
//                    break;
//                case "GBGC1000":
//                    grid.barWidth = 1;
//                    break;
//                    
//            }
//            //centralize grid conditioning
//            switch(COLLOC){
//                case "CMPASSY":
//                case "UNIT":
//                    addGrid = true;
//                    break;
//            }
            trace("Draw Sash");
            //sash
            //Draw the left sash, glass, grid, and bead
            //first calculate the sash_x, then draw the sash frame
            sash.x = frame.x + sash.xOffset;
            sash.y = frame.y + sash.yOffset;
            sash.width = frame.width - (sash.xOffset * 2);
            sash.height = frame.height - (sash.yOffset * 2);
            
            initOuterMiterFrame("sash", sash.x, sash.y, sash.width, sash.height, sash.leftWidth,sash.rightWidth,sash.topWidth,sash.botWidth,frame.color);
            //calculate the bead frame specs
            bead.x = sash.x + sash.leftWidth;
            bead.y = sash.y + sash.topWidth;
            bead.width = sash.width - sash.leftWidth - sash.rightWidth;
            bead.height = sash.height - sash.topWidth - sash.botWidth;
            // draw the glass
            glass.x = bead.x + bead.partWidth;
            glass.y = bead.y + bead.partWidth;
            glass.width	= bead.width - (bead.partWidth * 2);
            glass.height = bead.height - (bead.partWidth * 2);
            //left sash is always glass 1
            glass.color = getGlassColor(GLS1CLR);
            trace("InitGlass");
            initGlass("glass","sash", glass.x, glass.y, glass.width, glass.height, 0, glass.color);

            //basic colonial setup
            var grid = {
                add:false,
                v_bars:COL1HQTY - 1,
                h_bars:COL1VQTY - 1,
                pattern:COL1PTRN,
                location1:0,
                location2:0,
                horiz_offset:(glass.x - frame.x),
                vert_offset:(glass.y - frame.y),
                square:COLSQSZ,
                radius:0,
                square_width:0,
                square_height:0,
                bar_width:getGridFace(COL1TYPE),
                color:getFrameColor(COLCLR,"V")
            };

            with (grid){
                if (bar_width > 0){
                    add = true;
                }
                
                if (add){
                    initPGTGrid("glass_pane","grid",glass.color,grid);
                }
            }

        
        
//        if(addGrid){
//                switch(COLSTYL){
//                case "2/2V":
//                case "2/2H":
//                case "STD":
//                case "U.COL.LITES":
//                case "U.COL.BARS":
//                    //conversion from lites to bars...segment is lites
//                    //also note that the segments are confusing here...when STD or LITES, H and V are crossed
//                    grid.v_bars = COL1HQTY - 1;
//                    grid.h_bars = COL1VQTY - 1;
//
//                    initGrid("glass_pane","grid",grid.v_bars+"V"+grid.h_bars+"H",frame.color,grid.barWidth);
//
//                    break;
//                case "9LP":
//                    //create grid
//                    initGrid("glass_pane","grid","P1T1B1L1R"+COLSQSZ,frame.color,grid.barWidth);
//                    //set the h bars for alignment conditioning
//                    grid.h_bars = 2;
//                    break;
//                case "6LP":
//                    //create grid
//                    initGrid("glass_pane","grid","P1T1B1L0R"+COLSQSZ,frame.color,grid.barWidth);
//                    //set the h bars for alignment conditioning
//                    grid.h_bars = 2;
//                    break;
//                case "CUSTOMLP":
//                    switch(COL1PTRN){
//                    //First the brittanies...easily handled by changing the # in the P pattern
//                    case "3LPH":
//                        //create grid
//                        initGrid("glass_pane","grid","P0T0B1L1R"+COLSQSZ,frame.color,grid.barWidth);
//                        //set the h bars for alignment conditioning
//                        grid.h_bars = 0;
//                        break;
//                    case "3LPV":
//                        //create grid
//                        initGrid("glass_pane","grid","P1T1B0L0R"+COLSQSZ,frame.color,grid.barWidth);
//                        //set the h bars for alignment conditioning
//                        grid.h_bars = 2;
//                        break;
//                    case "6LPB":
//                        //create grid
//                        initGrid("glass_pane","grid","P0T1B1L1R"+COLSQSZ,frame.color,grid.barWidth);
//                        //set the h bars for alignment conditioning
//                        grid.h_bars = 1;
//                        break;
//                    case "6LPT":
//                        //create grid
//                        initGrid("glass_pane","grid","P1T0B1L1R"+COLSQSZ,frame.color,grid.barWidth);
//                        //set the h bars for alignment conditioning
//                        grid.h_bars = 1;
//                        break;
//                    case "6LPL":
//                        //create grid
//                        initGrid("glass_pane","grid","P1T1B1L0R"+COLSQSZ,frame.color,grid.barWidth);
//                        //set the h bars for alignment conditioning
//                        grid.h_bars = 2;
//                        break;
//                    case "6LPR":
//                        //create grid
//                        initGrid("glass_pane","grid","P1T1B0L1R"+COLSQSZ,frame.color,grid.barWidth);
//                        //set the h bars for alignment conditioning
//                        grid.h_bars = 2;
//                        break;
//                    case "9LP":
//                        //create grid
//                        initGrid("glass_pane","grid","P1T1B1L1R"+COLSQSZ,frame.color,grid.barWidth);
//                        //set the h bars for alignment conditioning
//                        grid.h_bars = 2;
//                        break;
//                    }
//                }
//            }

        initMitredFrame("bead", bead.x, bead.y, bead.width, bead.height, bead.partWidth, frame.color);
                
            //if this is IF, then draw the fin
            if(addFin){
                initOuterMiterFrame("frame_fin", 0, 0, frame.width + frame.leftFin + frame.rightFin, frame.height+ frame.headFin + frame.sillFin, frame.leftFin, frame.rightFin, frame.headFin, frame.sillFin, frame.color);
            }

            initOuterMiterFrame("frame", frame.x, frame.y, frame.width, frame.height, frame.leftWidth,frame.rightWidth, frame.headWidth,frame.sillWidth, frame.color);
            initMitredFrame("sash_inset", sash.x - 0.119, sash.y - 0.119, sash.width + (0.119*2), sash.height + (0.119*2), 0.119, adjustColor(frame.color, -100));
    
            //and handing
            initHanding("handing","glass_pane","U");
            //Add dims
            var dimOffset = 1.5;
            var dimWidth = {
                x1:frame.x + frame.leftOffset,
                y1:frame.height + (frame.headFin + frame.sillFin),
                x2:frame.x + frame.width - frame.rightOffset,
                y2:frame.height + (frame.headFin + frame.sillFin),
                offset:dimOffset
            };
            var dimHeight = {
                x1:frame.width + (frame.leftFin + frame.rightFin),
                y1:frame.y + frame.headOffset,
                x2:frame.width + (frame.leftFin + frame.rightFin),
                y2:frame.y + frame.height - frame.sillOffset,
                offset:dimOffset
            };
            
            //custom muntin location...add in first to see if we need to move the main dim
//            h_dimOffset = 0;
//            if(COLMTNLOC1 > 0){
//                createDim(dim_x1,dim_y1,dim_x2,dim_y1 + COLMTNLOC1,false,true);
//                h_dimOffset = 1.5;
//            }
//            if(COLMTNLOC2 > 0){
//                createDim(dim_x1,dim_y2 - COLMTNLOC2,dim_x2,dim_y2,false,true);
//                h_dimOffset = 1.5;
//            }
//
//            if(COLMTNLOC2 > 0){
//                createDim(dim_x1,dim_y2 - COLMTNLOC2,dim_x2,dim_y2,false,true);
//                h_dimOffset = 1.5;
//            }
//
//            if(grid.radius > 0){
//                createDim((glass.x + (glass.width - (grid.radius*2))/2),(glass.y + (glass.height/2)),(glass.x + (glass.width - (grid.radius*2))/2) + (grid.radius*2),(glass.y + (glass.height/2)),false,true);
//                h_dimOffset = 1.5;
//            }
//
//            if(grid.sq_h > 0){
//                createDim((glass.x + ((glass.width - grid.sq_h)/2)),(glass.y + ((glass.height - grid.sq_v)/2) + grid.sq_v + 1.5),(glass.x + ((glass.width - grid.sq_h)/2)) + grid.sq_h,(glass.y + ((glass.height - grid.sq_v)/2) + grid.sq_v + 1.5),false,true);
//                h_dimOffset = 1.5;
//            }
//
//            if(grid.sq_v > 0){
//                createDim((glass.x + ((glass.width - grid.sq_h)/2)) + grid.sq_h + 1.5,(glass.y + ((glass.height - grid.sq_v)/2)),(glass.x + ((glass.width - grid.sq_h)/2)) + grid.sq_h + 1.5,(glass.y + ((glass.height - grid.sq_v)/2) + grid.sq_v),false,true);
//                h_dimOffset = 1.5;
//            }
//
        
//            dim_x1 = dim_x1 + h_dimOffset;
//            dim_x2 = dim_x1;
        
            createDim(dimWidth.x1,dimWidth.y1 + dimWidth.offset,dimWidth.x2,dimWidth.y2 + dimWidth.offset,false);
            createDim(dimHeight.x1 + dimHeight.offset,dimHeight.y1,dimHeight.x2 + dimHeight.offset,dimHeight.y2,false);


        }
// INSERT YOUR SCRIPTING HERE!!!!!



	returnConfigData();  // post values to confguration code
}

