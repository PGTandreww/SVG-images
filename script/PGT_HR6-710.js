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
            lsashInset:0,
            rsashInset:0,
            color:getFrameColor(FRMCLR,"A")
        };
        var lsash = {
            x:0,
            y:0,
            width:0,
            height:0,
            topWidth:0.495,
            botWidth:0.495,
            leftWidth:1.371,
            rightWidth:1.081,
            xOffset:0,
            yOffset:0
        };          
        var rsash = {
            x:0,
            y:0,
            width:0,
            height:0,
            topWidth:0.495,
            botWidth:0.495,
            leftWidth:1.081,
            rightWidth:1.371,
            xOffset:0,
            yOffset:0
        };
        
        var addLsash = false;
        var addRsash = false;
        //var lsash.width, rsash.width, lsash.height, rsash.height;
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
        if(frame.width > 0 && frame.height > 0 && ((addLsash && (lsash.width > 0 && lsash.height > 0)) || (addRsash && (rsash.width > 0 && rsash.height > 0)))){
            //continue
            trace("call initOuterNonMtrdFrame from PGTrect.js");

            var addFin = false;

            switch(FRMTYPE){
                case ".5FLANGE":
                    frame.headWidth = 1.311;
                    frame.headFin = 0;
                    frame.headOffset = 0;
                    frame.sillWidth = 2.964;
                    frame.sillFin = 0;
                    frame.sillOffset = 0;
                    frame.leftWidth = 0.675;
                    frame.leftFin = 0;
                    frame.leftOffset = 0;
                    frame.rightWidth = 0.675;
                    frame.rightFin = 0;
                    frame.rightOffset = 0;
                    lsash.xOffset = rsash.xOffset = .780;
                    lsash.yOffset = rsash.yOffset = 1.527;
                    break;
                case "1.125FIN":
                    addFin = true;
                    if(PRPMULLTP === "Y"){
                        frame.headWidth = 1.311;
                        frame.headFin = 0;
                        frame.headOffset = .5;                    
                        lsash.yOffset = rsash.yOffset = 1.527;
                    }else{
                        frame.headWidth = 0.873;                    
                        frame.headFin = 1.125;
                        frame.headOffset = 0;
                        lsash.yOffset = rsash.yOffset = 1.027;
                    }
                    if(PRPMULLBTM === "Y"){
                        frame.sillWidth = 2.964;
                        frame.sillFin = 0;
                        frame.sillOffset = .5;
                    }else{
                        frame.sillWidth = 2.562;
                        frame.sillFin = 1.125;
                        frame.sillOffset = 0;
                    }
                    if(PRPMULLLFT === "Y"){
                        frame.leftWidth = 0.675;
                        frame.leftFin = 0;
                        frame.leftOffset = .5;
                        lsash.xOffset = .780;
                    }else{
                        frame.leftWidth = 0.175;
                        frame.leftFin = 1.125;
                        frame.leftOffset = 0;
                        lsash.xOffset = .280;
                    }
                    if(PRPMULLRGHT === "Y"){
                        frame.rightWidth = 0.675;
                        frame.rightFin = 0;
                        frame.rightOffset = .5;
                        rsash.xOffset = .780;
                    }else{
                        frame.rightWidth = 0.175;
                        frame.rightFin = 1.125;
                        frame.rightOffset = 0;
                        rsash.xOffset = .280;
                    }
                    break;
            }

            frame.x = frame.leftFin;
            frame.y = frame.headFin;
            frame.width = frame.width + frame.leftOffset + frame.rightOffset;
            frame.height = frame.height + frame.headOffset + frame.sillOffset;
            
            //bead variables
            var bead = {
                x:0,
                y:0,
                width:0,
                height:0,
                partWidth:0.626
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
                color:frame.color
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
                color:frame.color
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
                color:frame.color
            };
/*            var addLgrid = false;
            var addRgrid = false;
            var addFgrid = false;
            
            switch(COLTYPE){
                case "DA1000":
                case "DF1000":
                case "SR1000":
                    rgrid.barWidth = fgrid.barWidth = lgrid.barWidth = 1;
                    break;
                case "GBGF0563":
                    rgrid.barWidth = fgrid.barWidth = lgrid.barWidth = 0.563;
                    break;
            }*/
            
            //centralize grid conditioning
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
            
            //left sash
            if(addLsash){
                //Draw the left sash, glass, grid, and bead
                //first calculate the sash_x, then draw the sash frame
                lsash.x = frame.x + lsash.xOffset;
                lsash.y = frame.y + lsash.yOffset;
                initOuterNonMtrdFrame("lsash", lsash.x, lsash.y, lsash.width, lsash.height, lsash.leftWidth,lsash.rightWidth,lsash.topWidth,true,lsash.botWidth,true, frame.color);
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
                if(lgrid.add){
                    
                    initPGTGrid("lglass_pane","lgrid",glass.color,lgrid);
                    
                    
/*                    switch(COLSTYL){
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
                    }*/
                }
                initOuterNonMtrdFrame("lbead", bead.x, bead.y, bead.width, bead.height, bead.partWidth, bead.partWidth, bead.partWidth, false, bead.partWidth, false, frame.color);
            }
            //right sash
            if(addRsash){
                //Draw the right sash, glass, grid, and bead
                //first calculate the sash_x, then draw the sash frame
                rsash.x = (frame.x + frame.width) - rsash.xOffset - rsash.width;
                rsash.y = frame.y + rsash.yOffset;
                initOuterNonMtrdFrame("rsash", rsash.x, rsash.y, rsash.width, rsash.height, rsash.leftWidth,rsash.rightWidth,rsash.topWidth,true,rsash.botWidth,true, frame.color);
                //calculate the bead frame specs
                bead.x = rsash.x + rsash.leftWidth;
                bead.y = rsash.y + rsash.topWidth;
                bead.width = rsash.width - rsash.leftWidth - rsash.rightWidth;
                bead.height = rsash.height - rsash.topWidth - rsash.botWidth;

                // draw the glass
                glass.x = bead.x + bead.partWidth;
                glass.y = bead.y + bead.partWidth;
                glass.width = bead.width - (bead.partWidth * 2);
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

                if(rgrid.add){
                    
                    initPGTGrid("rglass_pane","rgrid",glass.color,rgrid);
                    
                    
/*                    switch(COLSTYL){
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
                    }*/
                }
                initOuterNonMtrdFrame("rbead", bead.x, bead.y, bead.width, bead.height, bead.partWidth, bead.partWidth, bead.partWidth, false, bead.partWidth, false, frame.color);
            }
            
            //if this is IF, then draw the fin
            if(addFin){
                initOuterNonMtrdFrame("frame_fin", 0, 0, frame.width + frame.leftFin + frame.rightFin, frame.height + frame.headFin + frame.sillFin, frame.leftFin, frame.rightFin, frame.headFin, false, frame.sillFin, false, frame.color);
            }
        
            //draw the main frame
            initOuterNonMtrdFrame("frame", frame.x, frame.y, frame.width, frame.height, frame.leftWidth, frame.rightWidth, frame.headWidth, false, frame.sillWidth, false, frame.color);
            initFrameMember("sill", "frame", frame.x + frame.leftWidth, frame.y + (frame.height - 1.122), frame.width - frame.leftWidth - frame.rightWidth, 1.122, frame.color);
    
            //place the meeting rail(s) and extra legs
            //since the fixed section is affected by the meeting rails, also calcuting that here
            var mr = {
                x:0,
                y:frame.y + frame.headWidth,
                width:1.341,
                height:frame.height - frame.headWidth - frame.sillWidth,
                overlap:1.07
            };
            
            if(addLsash){
                mr.x = lsash.x + lsash.width - mr.overlap;
                //draw the meeting rail
                initFrameMember("lmrail", "frame", mr.x, mr.y, mr.width, mr.height, frame.color);
                initFrameMember("lleg1", "frame", frame.x + frame.leftWidth, frame.y + frame.headWidth, 0.626, frame.height - frame.headWidth - frame.sillWidth, frame.color);
                initFrameMember("lleg2", "frame", frame.x + frame.leftWidth, frame.y + frame.headWidth, 0.3, frame.height - frame.headWidth - frame.sillWidth, frame.color);
                initFrameMember("tlleg", "frame", frame.x + frame.leftWidth + 0.626, frame.y + frame.headWidth, mr.x - (frame.x + frame.leftWidth + 0.626) , 0.626, frame.color);
                initFrameMember("blleg", "frame", frame.x + frame.leftWidth + 0.626, frame.y + frame.height - frame.sillWidth - 0.626,mr.x - (frame.x + frame.leftWidth + 0.626) , 0.626, frame.color);
                
                //calculate the fixed bead frame
                bead.x = mr.x + mr.width;
                bead.y = frame.y + frame.headWidth;
                bead.width = frame.width - bead.x - frame.rightWidth;
                bead.height = frame.height - frame.headWidth - frame.sillWidth;
            }
            if(addRsash){
                mr.x = rsash.x + mr.overlap - mr.width;
                //draw the meeting rail
                initFrameMember("rmrail", "frame", mr.x, mr.y, mr.width, mr.height, frame.color);
                initFrameMember("rleg1", "frame", frame.x + (frame.width - frame.rightWidth) - 0.626, frame.y + frame.headWidth, 0.626, frame.height - frame.headWidth - frame.sillWidth, frame.color);
                initFrameMember("rleg2", "frame", frame.x + (frame.width - frame.rightWidth) - 0.3, frame.y + frame.headWidth, 0.3, frame.height - frame.headWidth - frame.sillWidth, frame.color);
                initFrameMember("trleg", "frame", mr.x + mr.width, frame.y + frame.headWidth, frame.x + frame.width - frame.rightWidth - 0.626 - (mr.x + mr.width), 0.626, frame.color);
                initFrameMember("brleg", "frame", mr.x + mr.width, frame.y + frame.height - frame.sillWidth - 0.626, frame.x + frame.width - frame.rightWidth - 0.626 - (mr.x + mr.width), 0.626, frame.color);
                
                //calcualte the fixed bead frame 
                //if there is a left sash, then the fixed bead x and y have already been calculated based on that meeting rail location
                //if no left sash, we need to set the fixed bead x and y based on the left side fo the frame
                if(!addLsash){
                    bead.x = frame.x + frame.leftWidth;
                    bead.y = frame.y + frame.headWidth;
                }
                //the fixed bead will stop at the right mrail whether left sash exists or not
                bead.width = mr.x - bead.x;
                bead.height = frame.height - frame.headWidth - frame.sillWidth;
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

            trace("InitGlass");
            initGlass("fglass","frame", glass.x, glass.y, glass.width, glass.height, 0, glass.color);

            if(fgrid.add){
                
                initPGTGrid("fglass_pane","fgrid",glass.color,fgrid);
                
/*                switch(COLSTYL){
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

                }*/
                //align grids
                if(lgrid.add && lgrid.h_bars === fgrid.h_bars){
                    alignlite_h("fglass_pane", "fgrid", "lglass_pane", "lgrid", "", 0);
                }
                if(rgrid.add && rgrid.h_bars === fgrid.h_bars){
                    alignlite_h("fglass_pane", "fgrid", "rglass_pane", "rgrid", "", 0);
                }
            }
            initOuterNonMtrdFrame("fbead", bead.x, bead.y, bead.width, bead.height, bead.partWidth, bead.partWidth, bead.partWidth, false, bead.partWidth, false, frame.color);

            //and handing
            if(addLsash){
                initDirection("l_direction","lglass_pane","R");
            }
            if(addRsash){
                initDirection("r_direction","rglass_pane","L");
            }
            //Add dims
            trace("Create DIMs");
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
            trace("Create DIMs");

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
//                createDim((glass.x + (glass.width - (grid_radius*2))/2),(glass.y + (glass.height/2)),(glass.x + (glass.width - (grid_radius*2))/2) + (grid_radius*2),(glass.y + (glass.height/2)),true);
//                h_dimOffset = 1.5;
//            }
//
//            if(grid_sq_h > 0){
//                createDim((glass.x + ((glass.width - grid_sq_h)/2)),(glass.y + ((glass.height - grid_sq_v)/2) + grid_sq_v + 1.5),(glass.x + ((glass.width - grid_sq_h)/2)) + grid_sq_h,(glass.y + ((glass.height - grid_sq_v)/2) + grid_sq_v + 1.5),true);
//                h_dimOffset = 1.5;
//            }
//
//            if(grid_sq_v > 0){
//                createDim((glass.x + ((glass.width - grid_sq_h)/2)) + grid_sq_h + 1.5,(glass.y + ((glass.height - grid_sq_v)/2)),(glass.x + ((glass.width - grid_sq_h)/2)) + grid_sq_h + 1.5,(glass.y + ((glass.height - grid_sq_v)/2) + grid_sq_v),true);
//                h_dimOffset = 1.5;
//            }
//
        
            createDim(dimWidth.x1,dimWidth.y1 + dimWidth.offset,dimWidth.x2,dimWidth.y2 + dimWidth.offset,false);
            createDim(dimHeight.x1 + dimHeight.offset,dimHeight.y1,dimHeight.x2 + dimHeight.offset,dimHeight.y2,false);
            trace("End DIMs");


        }
// INSERT YOUR SCRIPTING HERE!!!!!



	returnConfigData();  // post values to confguration code
}

