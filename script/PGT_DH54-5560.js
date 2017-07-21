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
            color:getFrameColor(FRMCLR)
        };	
        //sashes
        var lsash = {
            x:0,
            y:0,
            width:0,
            height:0,
            topWidth:1,
            botWidth:1,
            leftWidth:1,
            rightWidth:1,
            xOffset:0,
            yOffset:0
        };          
        var rsash = {
            x:0,
            y:0,
            width:0,
            height:0,
            topWidth:1,
            botWidth:1,
            leftWidth:1,
            rightWidth:1,
            xOffset:0,
            yOffset:0
        };
        
        var addLsash = false;
        var addRsash = false;

        switch(CNFG){
        case "XO":
            addLsash = true;
            lsash.width = SASHWDTH1;
            lsash.height = SASHHGHT1;
            break;
        case "OX":
            addRsash = true;
            rsash.width = SASHWDTH1;
            rsash.height = SASHHGHT1;
            break;
        case "XOX":
            addLsash = true;
            lsash.width = SASHWDTH1;
            lsash.height = SASHHGHT1;
            addRsash = true;
            rsash.width = SASHWDTH2;
            rsash.height = SASHHGHT2;
            break;
        }

    
        //check w and h...no need to continue is either is 0
        if(frame.width > 0 && frame.height> 0 && ((addLsash && (lsash.width > 0 && lsash.height > 0)) || (addRsash && (rsash.width > 0 && rsash.height > 0)))){
            //continue
            trace("call initOuterNonMtrdFrame from PGTrect.js");

            var addFin = false;
            
            switch(FRMTYPE){
                case ".625FLANGE":
                    //base dims for flange frame...pulled from CAD drawing
                    frame.headWidth = 2.426;
                    frame.headFin = 0;
                    frame.headOffset = .625;
                    frame.sillWidth = 2.426;
                    frame.sillFin = 0;
                    frame.sillOffset = 0.625;
                    frame.leftWidth = 2.426;
                    frame.leftFin = 0;
                    frame.leftOffset = 0.625;
                    frame.rightWidth = 2.426;
                    frame.rightFin = 0;
                    frame.rightOffset = 0.625;
                    lsash.xOffset = rsash.xOffset = 1.683;
                    lsash.yOffset = rsash.yOffset = 1.939;
                    break;
                case "EQUAL":
                    //base dims for flange frame...pulled from CAD drawing
                    frame.headWidth = 1.801;
                    frame.headFin = 0;
                    frame.headOffset = 0;
                    frame.sillWidth = 1.801;
                    frame.sillFin = 0;
                    frame.sillOffset = 0;
                    frame.leftWidth = 1.801;
                    frame.leftFin = 0;
                    frame.leftOffset = 0;
                    frame.rightWidth = 1.801;
                    frame.rightFin = 0;
                    frame.rightOffset = 0;
                    lsash.xOffset = rsash.xOffset = 1.683;
                    lsash.yOffset = rsash.yOffset = 1.939;
                    break;
                case "1.375FIN":
                    //flip the flag
                    addFin = true;
                    //base dimes for fin frame...taken from CAD drawing
                    //note that we need to check each side of the frame to see if it is prepped for mulling
                    //if it is that side is actually flange, so it gets those specs, with the offset value to set the reference to DLO and no fin
                    //if it is not, then it gets the frame and fin sizes 
                    frame.headWidth = 1.801;
                    frame.headOffset = 0;                    
                    lsash.yOffset = rsash.yOffset = 1.939;
                    if(PRPMULLTP === "Y"){
                        frame.headFin = 0;
                    }
                    else{
                        frame.headFin = 1.375;
                    }
                    frame.sillWidth = 1.801;
                    frame.sillOffset = 0;
                    if(PRPMULLBTM === "Y"){
                        frame.sillFin = 0;
                    }
                    else{
                        frame.sillFin = 1.375;
                    }
                    frame.leftWidth = 1.801;
                    frame.leftOffset = 0;
                    lsash.xOffset = 1.683;
                    if(PRPMULLLFT === "Y"){
                        frame.leftFin = 0;
                    }
                    else{
                        frame.leftFin = 1.375;
                    }
                    frame.rightWidth = 1.801;
                    frame.rightOffset = 0;
                    rsash.xOffset = 1.683;
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
                    frame.headWidth = 2.426;
                    frame.headOffset = 0.625;                    
                    lsash.yOffset = rsash.yOffset = 1.939;
                    if(PRPMULLTP === "Y"){
                        frame.headFin = 0;
                    }
                    else{
                        frame.headFin = 0.75;
                    }
                    frame.sillWidth = 2.426;
                    frame.sillOffset = 0.625;
                    if(PRPMULLBTM === "Y"){
                        frame.sillFin = 0;
                    }
                    else{
                        frame.sillFin = 0.75;
                    }
                    frame.leftWidth = 2.426;
                    frame.leftOffset = 0.625;
                    lsash.xOffset = 1.683;
                    if(PRPMULLLFT === "Y"){
                        frame.leftFin = 0;
                    }
                    else{
                        frame.leftFin = 0.75;
                    }
                    frame.rightWidth = 2.426;
                    frame.rightOffset = 0.625;
                    rsash.xOffset = 1.683;
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
            
            //basic colonial setup
            var lgrid = {
                v_bars:0,
                h_bars:0,
                pattern:"",
                barWidth:0
            };
            var rgrid = {
                v_bars:0,
                h_bars:0,
                pattern:"",
                barWidth:0
            };
            var fgrid = {
                v_bars:0,
                h_bars:0,
                pattern:"",
                barWidth:0
            };
            var addLgrid = false;
            var addRgrid = false;
            var addFgrid = false;
            
            switch(COL1TYPE){
                case "DA1000":
                case "DF1000":
                case "SR1000":
                    grid.barWidth = 1;
                    break;
                case "GBGF0563":
                    grid.barWidth = 0.563;
                    break;
                case "SDLT0875":
                    grid.barWidth = 0.875;
                    break;
                case "SDLT0875":
                    grid.barWidth = 0.875;
                    break;
                case "GBGF0813":
                    grid.barWidth = 0.813;
                    break;
                case "GBGC1000":
                    grid.barWidth = 1;
                    break;
                    
            }
            //centralize grid conditioning
            switch(CNFG){
            case "XO":
                switch(COLLOC){
                case "CMPASSY":
                case "UNIT":
                    addLgrid = true;
                    addFgrid = true;
                    break;
                case "LFTSIDE":
                    addLgrid = true;
                    break;
                case "RGHTSIDE":
                    addFgrid = true;
                    break;
                }
            case "OX":
                switch(COLLOC){
                case "CMPASSY":
                case "UNIT":
                    addFgrid = true;
                    addRgrid = true;
                    break;
                case "LFTSIDE":
                    addFgrid = true;
                    break;
                case "RGHTSIDE":
                    addRgrid = true;
                    break;
                }
            case "XOX":
                switch(COLLOC){
                case "CMPASSY":
                case "UNIT":
                    addLgrid = true;
                    addFgrid = true;
                    addRgrid = true;
                    break;
                case "LFTSIDE":
                    addLgrid = true;
                    break;
                case "RGHTSIDE":
                    addRgrid = true;
                    break;
                case "CNTR":
                    addFgrid = true;
                    break;
                case "LFTRGHTSIDES":
                    addLgrid = true;
                    addRgrid = true;
                    break;
                    }
            }
            
            //left sash
            if(addLsash){
                //Draw the left sash, glass, grid, and bead
                //first calculate the sash_x, then draw the sash frame
                lsash.x = frame.x + lsash.xOffset + frame.leftOffset;
                lsash.y = frame.y + lsash.yOffset + frame.headOffset;
                initOuterMiterFrame("lsash", lsash.x, lsash.y, lsash.width, lsash.height, lsash.leftWidth,lsash.rightWidth,lsash.topWidth,lsash.botWidth,frame.color);
                //calculate the bead frame specs
                bead.x = lsash.x + lsash.leftWidth;
                bead.y = lsash.y + lsash.topWidth;
                bead.width = lsash.width - lsash.leftWidth - lsash.rightWidth;
                bead.height = lsash.height - lsash.topWidth - lsash.botWidth;
                // draw the glass
                glass.x = bead.x + bead.partWidth;
                glass.y = bead.y + bead.partWidth;
                glass.width	= bead.width - (bead.partWidth * 2);
                glass.height = bead.height - (bead.partWidth * 2);
                //left sash is always glass 1
                glass.color = getGlassColor(GLS1CLR);
                trace("InitGlass");
                initGlass("lglass","lsash", glass.x, glass.y, glass.width, glass.height, 0, glass.color);
                if(addLgrid){
                    switch(COLSTYL){
                    case "2/2V":
                    case "2/2H":
                    case "STD":
                    case "U.COL.LITES":
                    case "U.COL.BARS":
                        //conversion from lites to bars...segment is lites
                        //also note that the segments are confusing here...when STD or LITES, H and V are crossed
                        lgrid.v_bars = COL1HQTY - 1;
                        lgrid.h_bars = COL1VQTY - 1;

                        initGrid("lglass_pane","lgrid",lgrid.v_bars+"V"+lgrid.h_bars+"H",frame.color,lgrid.barWidth);

                        break;
                    case "9LP":
                        //create grid
                        initGrid("lglass_pane","lgrid","P1T1B1L1R"+COLSQSZ,frame.color,lgrid.barWidth);
                        //set the h bars for alignment conditioning
                        lgrid.h_bars = 2;
                        break;
                    case "6LP":
                        //create grid
                        initGrid("lglass_pane","lgrid","P1T1B1L0R"+COLSQSZ,frame.color,lgrid.barWidth);
                        //set the h bars for alignment conditioning
                        lgrid.h_bars = 2;
                        break;
                    case "CUSTOMLP":
                        switch(COL1PTRN){
                        //First the brittanies...easily handled by changing the # in the P pattern
                        case "3LPH":
                            //create grid
                            initGrid("lglass_pane","lgrid","P0T0B1L1R"+COLSQSZ,frame.color,lgrid.barWidth);
                            //set the h bars for alignment conditioning
                            lgrid.h_bars = 0;
                            break;
                        case "3LPV":
                            //create grid
                            initGrid("lglass_pane","lgrid","P1T1B0L0R"+COLSQSZ,frame.color,lgrid.barWidth);
                            //set the h bars for alignment conditioning
                            lgrid.h_bars = 2;
                            break;
                        case "6LPB":
                            //create grid
                            initGrid("lglass_pane","lgrid","P0T1B1L1R"+COLSQSZ,frame.color,lgrid.barWidth);
                            //set the h bars for alignment conditioning
                            lgrid.h_bars = 1;
                            break;
                        case "6LPT":
                            //create grid
                            initGrid("lglass_pane","lgrid","P1T0B1L1R"+COLSQSZ,frame.color,lgrid.barWidth);
                            //set the h bars for alignment conditioning
                            lgrid.h_bars = 1;
                            break;
                        case "6LPL":
                            //create grid
                            initGrid("lglass_pane","lgrid","P1T1B1L0R"+COLSQSZ,frame.color,lgrid.barWidth);
                            //set the h bars for alignment conditioning
                            lgrid.h_bars = 2;
                            break;
                        case "6LPR":
                            //create grid
                            initGrid("lglass_pane","lgrid","P1T1B0L1R"+COLSQSZ,frame.color,lgrid.barWidth);
                            //set the h bars for alignment conditioning
                            lgrid.h_bars = 2;
                            break;
                        case "9LP":
                            //create grid
                            initGrid("lglass_pane","lgrid","P1T1B1L1R"+COLSQSZ,frame.color,lgrid.barWidth);
                            //set the h bars for alignment conditioning
                            lgrid.h_bars = 2;
                            break;
                        }
                    }
                }
                initMitredFrame("lbead", bead.x, bead.y, bead.width, bead.height, bead.partWidth, frame.color);
                
            }
            //right sash
            if(addRsash){
                //Draw the right sash, glass, grid, and bead
                //first calculate the sash_x, then draw the sash frame
                rsash.x = (frame.x + frame.width) - frame.rightOffset - rsash.xOffset - rsash.width;
                rsash.y = frame.y + rsash.yOffset + frame.headOffset;
                initOuterMiterFrame("rsash", rsash.x, rsash.y, rsash.width, rsash.height, rsash.leftWidth,rsash.rightWidth,rsash.topWidth,rsash.botWidth,frame.color);
                //calculate the bead frame specs
                bead.x = rsash.x + rsash.leftWidth;
                bead.y = rsash.y + rsash.topWidth;
                bead.width = rsash.width - rsash.leftWidth - rsash.rightWidth;
                bead.height = rsash.height - rsash.topWidth - rsash.botWidth;

                // draw the glass
                glass.x = bead.x + bead.partWidth;
                glass.y = bead.y + bead.partWidth;
                glass.width	= bead.width - (bead.partWidth * 2);
                glass.height = bead.height - (bead.partWidth * 2);
                //right sash needs to get glass color based on config
                switch(CNFG){
                case "OX":
                    glass.color = getGlassColor(GLS2CLR);
                    break;
                case "XOX":
                    glass.color = getGlassColor(GLS3CLR);
                    break;
                }
                
                trace("InitGlass");
                initGlass("rglass","rsash", glass.x, glass.y, glass.width, glass.height, 0, glass.color);

                if(addRgrid){
                    switch(COLSTYL){
                    case "2/2V":
                    case "2/2H":
                    case "STD":
                    case "U.COL.LITES":
                    case "U.COL.BARS":
                        //conversion from lites to bars...segment is lites
                        switch(CNFG){
                        case "OX":
                            rgrid.v_bars = COL2HQTY - 1;
                            rgrid.h_bars = COL2VQTY - 1;
                            break;
                        case "XOX":
                            rgrid.v_bars = COL3HQTY - 1;
                            rgrid.h_bars = COL3VQTY - 1;
                            break;
                        }
                            
                            
                        initGrid("rglass_pane","rgrid",rgrid.v_bars+"V"+rgrid.h_bars+"H",frame.color,rgrid.barWidth);

                        break;
                    case "9LP":
                        //create grid
                        initGrid("rglass_pane","rgrid","P1T1B1L1R"+COLSQSZ,frame.color,rgrid.barWidth);
                        //set the h bars for alignment conditioning
                        rgrid.h_bars = 2;
                        break;
                    case "6LP":
                        //create grid
                        initGrid("rglass_pane","rgrid","P1T1B0L1R"+COLSQSZ,frame.color,rgrid.barWidth);
                        //set the h bars for alignment conditioning
                        rgrid.h_bars = 2;
                        break;
                    case "CUSTOMLP":
                        switch(CNFG){
                        case "OX":
                            rgrid.pattern = COL2PTRN;
                            break;
                        case "XOX":
                            rgrid.pattern = COL3PTRN;
                            break;
                        }
                        switch(rgrid.pattern){
                        //First the brittanies...easily handled by changing the # in the P pattern
                        case "3LPH":
                            //create grid
                            initGrid("rglass_pane","rgrid","P0T0B1L1R"+COLSQSZ,frame.color,rgrid.barWidth);
                            //set the h bars for alignment conditioning
                            rgrid.h_bars = 0;
                            break;
                        case "3LPV":
                            //create grid
                            initGrid("rglass_pane","rgrid","P1T1B0L0R"+COLSQSZ,frame.color,rgrid.barWidth);
                            //set the h bars for alignment conditioning
                            rgrid.h_bars = 2;
                            break;
                        case "6LPB":
                            //create grid
                            initGrid("rglass_pane","rgrid","P0T1B1L1R"+COLSQSZ,frame.color,rgrid.barWidth);
                            //set the h bars for alignment conditioning
                            rgrid.h_bars = 1;
                            break;
                        case "6LPT":
                            //create grid
                            initGrid("rglass_pane","rgrid","P1T0B1L1R"+COLSQSZ,frame.color,rgrid.barWidth);
                            //set the h bars for alignment conditioning
                            rgrid.h_bars = 1;
                            break;
                        case "6LPL":
                            //create grid
                            initGrid("rglass_pane","rgrid","P1T1B1L0R"+COLSQSZ,frame.color,rgrid.barWidth);
                            //set the h bars for alignment conditioning
                            rgrid.h_bars = 2;
                            break;
                        case "6LPR":
                            //create grid
                            initGrid("rglass_pane","rgrid","P1T1B0L1R"+COLSQSZ,frame.color,rgrid.barWidth);
                            //set the h bars for alignment conditioning
                            rgrid.h_bars = 2;
                            break;
                        case "9LP":
                            //create grid
                            initGrid("rglass_pane","rgrid","P1T1B1L1R"+COLSQSZ,frame.color,rgrid.barWidth);
                            //set the h bars for alignment conditioning
                            rgrid.h_bars = 2;
                            break;
                        }
                    }
                }
                
                initMitredFrame("rbead", bead.x, bead.y, bead.width, bead.height, bead.partWidth, frame.color);
                
            }
            //if this is IF, then draw the fin
            if(addFin){
                initOuterMiterFrame("frame_fin", 0, 0, frame.width + frame.leftFin + frame.rightFin, frame.height+ frame.headFin + frame.sillFin, frame.leftFin, frame.rightFin, frame.headFin, frame.sillFin, frame.color);
            }

            initOuterMiterFrame("frame", frame.x, frame.y, frame.width, frame.height, frame.leftWidth,frame.rightWidth, frame.headWidth,frame.sillWidth, frame.color);
            initMitredFrame("frame_leg", frame.x + frame.leftWidth, frame.y + frame.headWidth, frame.width - (frame.leftWidth + frame.rightWidth), frame.height- (frame.headWidth + frame.sillWidth),0.641, frame.color);
    
            //place the meeting rail(s) and extra legs
            //since the fixed section is affected by the meeting rails, also calcuting that here
            var mr = {
                x:0,
                y:frame.y + frame.headWidth,
                width:1.231,
                height:frame.height - frame.headWidth - frame.sillWidth,
                overlap:1.160
            };
            
            if(addLsash){
                mr.x = lsash.x + lsash.width - mr.overlap;
                //draw the meeting rail
                initFrameMember("lmrail", "frame_leg", mr.x, mr.y, mr.width, mr.height, frame.color);
                
                //calculate the fixed bead frame
                bead.x = mr.x + mr.width;
                bead.y = frame.y + frame.headWidth;
                bead.width = frame.width - bead.x - frame.rightWidth;
                bead.height = frame.height- frame.headWidth - frame.sillWidth;
            }
            if(addRsash){
                mr.x = rsash.x + mr.overlap - mr.width;
                //draw the meeting rail
                initFrameMember("rmrail", "frame_leg", mr.x, mr.y, mr.width, mr.height, frame.color);
                
                //calcualte the fixed bead frame 
                //if there is a left sash, then the fixed bead x and y have already been calculated based on that meeting rail location
                //if no left sash, we need to set the fixed bead x and y based on the left side fo the frame
                if(!addLsash){
                    bead.x = frame.x + frame.leftWidth;
                    bead.y = frame.y + frame.headWidth;
                }
                //the fixed bead will stop at the right mrail whether left sash exists or not
                bead.width = mr.x - bead.x;
                bead.height = frame.height- frame.headWidth - frame.sillWidth;
            }

            // draw the glass
            glass.x = bead.x + bead.partWidth;
            glass.y = bead.y + bead.partWidth;
            glass.width = bead.width - (bead.partWidth * 2);
            glass.height = bead.height - (bead.partWidth * 2);
            //fixed needs to get glass color based on config
            switch(CNFG){
            case "OX":
                glass.color = getGlassColor(GLS1CLR);
                break;
            case "XO":
            case "XOX":
                glass.color = getGlassColor(GLS2CLR);
                break;
            }

            trace("InitFixedGlass");
            initGlass("fglass","frame", glass.x, glass.y, glass.width, glass.height, 0, glass.color);

            if(addFgrid){
                switch(COLSTYL){
                case "2/2V":
                case "2/2H":
                case "STD":
                case "U.COL.LITES":
                case "U.COL.BARS":
                    //conversion from lites to bars...segment is lites
                    switch(CNFG){
                    case "OX":
                        fgrid.v_bars = COL1HQTY - 1;
                        fgrid.h_bars = COL1VQTY - 1;
                        break;
                    case "XO":
                    case "XOX":
                        fgrid.v_bars = COL2HQTY - 1;
                        fgrid.h_bars = COL2VQTY - 1;
                        break;
                    }

                    initGrid("fglass_pane","fgrid",fgrid.v_bars+"V"+fgrid.h_bars+"H",frame.color,fgrid.barWidth);

                    break;
                case "9LP":
                    //create grid
                    initGrid("fglass_pane","fgrid","P1T1B1L1R"+COLSQSZ,frame.color,fgrid.barWidth);
                    //set the h bars for alignment conditioning
                    fgrid.h_bars = 2;

                    break;
                case "6LP":
                    //create grid
                    switch(CNFG){
                    case "XOX":
                        initGrid("fglass_pane","fgrid","P1T1B0L0R"+COLSQSZ,frame.color,fgrid.barWidth);
                        //set the h bars for alignment conditioning
                        fgrid.h_bars = 2;
                        break;
                    case "XO":
                        initGrid("fglass_pane","fgrid","P1T1B0L1R"+COLSQSZ,frame.color,fgrid.barWidth);
                        //set the h bars for alignment conditioning
                        fgrid.h_bars = 2;
                        break;
                    case "OX":
                        initGrid("fglass_pane","fgrid","P1T1B1L0R"+COLSQSZ,frame.color,fgrid.barWidth);
                        //set the h bars for alignment conditioning
                        fgrid.h_bars = 2;
                        break;
                    }
                    break;
                case "CUSTOMLP":
                    switch(CNFG){
                    case "OX":
                        fgrid.pattern = COL1PTRN;
                        break;
                    case "XO":
                    case "XOX":
                        fgrid.pattern = COL2PTRN;
                        break;
                    }
                    switch(fgrid.pattern){
                    //First the brittanies...easily handled by changing the # in the P pattern
                    case "3LPH":
                        //create grid
                        initGrid("fglass_pane","fgrid","P0T0B1L1R"+COLSQSZ,frame.color,fgrid.barWidth);
                        //set the h bars for alignment conditioning
                        fgrid.h_bars = 0;
                        break;
                    case "3LPV":
                        //create grid
                        initGrid("fglass_pane","fgrid","P1T1B0L0R"+COLSQSZ,frame.color,fgrid.barWidth);
                        //set the h bars for alignment conditioning
                        fgrid.h_bars = 2;
                        break;
                    case "6LPB":
                        //create grid
                        initGrid("fglass_pane","fgrid","P0T1B1L1R"+COLSQSZ,frame.color,fgrid.barWidth);
                        //set the h bars for alignment conditioning
                        fgrid.h_bars = 1;
                        break;
                    case "6LPT":
                        //create grid
                        initGrid("fglass_pane","fgrid","P1T0B1L1R"+COLSQSZ,frame.color,fgrid.barWidth);
                        //set the h bars for alignment conditioning
                        fgrid.h_bars = 1;
                        break;
                    case "6LPL":
                        //create grid
                        initGrid("fglass_pane","fgrid","P1T1B1L0R"+COLSQSZ,frame.color,fgrid.barWidth);
                        //set the h bars for alignment conditioning
                        fgrid.h_bars = 2;
                        break;
                    case "6LPR":
                        //create grid
                        initGrid("fglass_pane","fgrid","P1T1B0L1R"+COLSQSZ,frame.color,fgrid.barWidth);
                        //set the h bars for alignment conditioning
                        fgrid.h_bars = 2;
                        break;
                    case "9LP":
                        //create grid
                        initGrid("fglass_pane","fgrid","P1T1B1L1R"+COLSQSZ,frame.color,fgrid.barWidth);
                        //set the h bars for alignment conditioning
                        fgrid.h_bars = 2;
                        break;
                    }

                }
                //align grids
                if(addLgrid && lgrid.h_bars === fgrid.h_bars){
                    alignlite_h("fglass_pane", "fgrid", "lglass_pane", "lgrid", "", 0);
                }
                if(addRgrid && rgrid.h_bars === fgrid.h_bars){
                    alignlite_h("fglass_pane", "fgrid", "rglass_pane", "rgrid", "", 0);
                }

            }

            initMitredFrame("fbead", bead.x, bead.y, bead.width, bead.height, bead.partWidth, frame.color);


            //and handing
            if(addLsash){
                initDirection("l_direction","lglass_pane","R");
            }
            if(addRsash){
                initDirection("r_direction","rglass_pane","L");
            }
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
            
            //custom sash dims
            if(VNTCNFG === "CSTM.VNT"){
                if(addLsash){
                    createDim(
                        lsash.x,
                        frame.height + (frame.headFin + frame.sillFin) + dimOffset,
                        lsash.x + lsash.width,
                        frame.height + (frame.headFin + frame.sillFin) + dimOffset,
                        false);
                    dimWidth.offset = 4;
                }
                if(addRsash){
                    createDim(
                        rsash.x,
                        frame.height + (frame.headFin + frame.sillFin) + dimOffset,
                        rsash.x + rsash.width,
                        frame.height + (frame.headFin + frame.sillFin) + dimOffset,
                        false);
                    dimWidth.offset = 4;
                }
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
//            if(grid.radius > 0){
//                createDim((glass.x + (glass.width - (grid.radius*2))/2),(glass.y + (glass.height/2)),(glass.x + (glass.width - (grid.radius*2))/2) + (grid.radius*2),(glass.y + (glass.height/2)),true);
//                h_dimOffset = 1.5;
//            }
//
//            if(grid.sq_h > 0){
//                createDim((glass.x + ((glass.width - grid.sq_h)/2)),(glass.y + ((glass.height - grid.sq_v)/2) + grid.sq_v + 1.5),(glass.x + ((glass.width - grid.sq_h)/2)) + grid.sq_h,(glass.y + ((glass.height - grid.sq_v)/2) + grid.sq_v + 1.5),true);
//                h_dimOffset = 1.5;
//            }
//
//            if(grid.sq_v > 0){
//                createDim((glass.x + ((glass.width - grid.sq_h)/2)) + grid.sq_h + 1.5,(glass.y + ((glass.height - grid.sq_v)/2)),(glass.x + ((glass.width - grid.sq_h)/2)) + grid.sq_h + 1.5,(glass.y + ((glass.height - grid.sq_v)/2) + grid.sq_v),true);
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

