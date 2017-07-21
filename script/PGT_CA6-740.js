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
var addOverallWidth = false;
//check w and h...no need to continue is either is 0
if(WDTH > 0 && HGHT> 0){
    //continue
    //basic colonial setup
    var grid1 = {
//        add:false,
//        v_bars:COL1HQTY - 1,
//        h_bars:COL1VQTY - 1,
//        pattern:COL1PTRN,
//        location1:COLMTNLOC1,
//        location2:COLMTNLOC2,
//        square:COLSQSZ,
//        barWidth:0
        add:false,
        v_bars:COL1HQTY - 1,
        h_bars:COL1VQTY - 1,
        pattern:COL1PTRN,
        location1:COLMTNLOC1,
        location2:COLMTNLOC2,
        horiz_offset:0,
        vert_offset:0,
        square:COLSQSZ,
        radius:0,
        square_width:0,
        square_height:0,
        bar_width:getGridFace(COLTYPE),
        color:getFrameColor(COLCLR,"A")
    };

    var grid2 = {
//        add:false,
//        v_bars:COL2HQTY - 1,
//        h_bars:COL2VQTY - 1,
//        pattern:COL2PTRN,
//        location1:COLMTNLOC1,
//        location2:COLMTNLOC2,
//        square:COLSQSZ,
//        barWidth:0
        add:false,
        v_bars:COL2HQTY - 1,
        h_bars:COL2VQTY - 1,
        pattern:COL2PTRN,
        location1:COLMTNLOC1,
        location2:COLMTNLOC2,
        horiz_offset:0,
        vert_offset:0,
        square:COLSQSZ,
        radius:0,
        square_width:0,
        square_height:0,
        bar_width:getGridFace(COLTYPE),
        color:getFrameColor(COLCLR,"A")
    };
    var grid3 = {
//        add:false,
//        v_bars:COL3HQTY - 1,
//        h_bars:COL3VQTY - 1,
//        pattern:COL3PTRN,
//        location1:COLMTNLOC1,
//        location2:COLMTNLOC2,
//        square:COLSQSZ,
//        barWidth:0
        add:false,
        v_bars:COL3HQTY - 1,
        h_bars:COL3VQTY - 1,
        pattern:COL3PTRN,
        location1:COLMTNLOC1,
        location2:COLMTNLOC2,
        horiz_offset:0,
        vert_offset:0,
        square:COLSQSZ,
        radius:0,
        square_width:0,
        square_height:0,
        bar_width:getGridFace(COLTYPE),
        color:getFrameColor(COLCLR,"A")
    };
    //centralize grid conditioning
    switch(CNFG){
        case "X":
        case "O":
            switch(COLLOC){
            case "CMPASSY":
            case "UNIT":
                grid1.add = (grid1.bar_width>0);
                break;
            }
            break;
        case "XX":
            switch(COLLOC){
            case "CMPASSY":
            case "UNIT":
                grid1.add = (grid1.bar_width>0);
                grid2.add = (grid2.bar_width>0);
                break;
            case "LFTSIDE":
                grid1.add = (grid1.bar_width>0);
                break;
            case "RGHTSIDE":
                grid2.add = (grid2.bar_width>0);
                break;
            }
            break;
        case "XOX":
            switch(COLLOC){
                case "CMPASSY":
                case "UNIT":
                    grid1.add = (grid1.bar_width>0);
                    grid2.add = (grid2.bar_width>0);
                    grid3.add = (grid3.bar_width>0);
                    break;
                case "LFTSIDE":
                    grid1.add = (grid1.bar_width>0);
                    break;
                case "RGHTSIDE":
                    grid3.add = (grid3.bar_width>0);
                    break;
                case "CNTR":
                    grid2.add = (grid2.bar_width>0);
                    break;
                case "LFTRGHTSIDES":
                    grid1.add = (grid1.bar_width>0);
                    grid3.add = (grid3.bar_width>0);
                    break;
            }
            break;
    }

//    switch(COLTYPE){
//        case "DA1000":
//        case "DF1000":
//        case "SR1000":
//        case "RLO1000":
//        case "ODA1000":
//            grid1.barWidth = grid2.barWidth = grid3.barWidth = 1;
//            break;
//        case "GBGF0563":
//            grid1.barWidth = grid2.barWidth = grid3.barWidth = 0.563;
//            break;
//    }

    var width1, width2, width3;

    switch(CNFG){
        case "X":
        case "O":
            addOverallWidth = false;
            drawUnit(0,0,WDTH,HGHT,HNGSIDE,FRMCLR,GLS1CLR,grid1)
            break;
        case "XX":
            addOverallWidth = true;
            width1 = width2 = WDTH/2;

            drawUnit(0,0,width1,HGHT,"LEFT",FRMCLR,GLS1CLR,grid1)
            drawUnit(width1,0,width2,HGHT,"RIGHT",FRMCLR,GLS2CLR,grid2)
            break;
        case "XOX":
            addOverallWidth = true;
            switch(VNTCNFG){
                case "1/4.1/2.1/4":
                    width1 = width3 = WDTH/4;
                    width2 = WDTH/2;
                    break;
                case "1/3.1/3.1/3":
                    width1 = width2 = width3 = WDTH/3;
                    break;
                case "CSTM.VNT":
                    width1 = width3 = UVNTWDTH;
                    width2 = WDTH - (width1 + width3);
                    break;
            }

            drawUnit(0,0,width1,HGHT,"LEFT",FRMCLR,GLS1CLR,grid1)
            drawUnit(width1,0,width2,HGHT,"",FRMCLR,GLS2CLR,grid2)
            drawUnit(width1 + width2,0,width3,HGHT,"RIGHT",FRMCLR,GLS3CLR,grid3)

            break;

    }
    trace("Draw Sash");

        //Add overall dims
        var dimWidth = {
            x1:0,
            y1:HGHT,
            x2:WDTH,
            y2:HGHT,
            offset:4
        };
        var dimHeight = {
            x1:WDTH,
            y1:0,
            x2:WDTH,
            y2:HGHT,
            offset:1.5
        };
            
        
        if (addOverallWidth){
            createDim(dimWidth.x1,dimWidth.y1 + dimWidth.offset,dimWidth.x2,dimWidth.y2 + dimWidth.offset,false);
        }
        createDim(dimHeight.x1 + dimHeight.offset,dimHeight.y1,dimHeight.x2 + dimHeight.offset,dimHeight.y2,false);


        }
// INSERT YOUR SCRIPTING HERE!!!!!



	returnConfigData();  // post values to confguration code
}

function drawUnit (x,y,width,height,hinge,frameColor,glassColor,grid)
{
    switch(hinge){
        case "LEFT":
            hinge = "l";
            break;
        case "RIGHT":
            hinge = "r";
            break;
        default:
            hinge = "f";
    }
    
    var frame = {
        x:x,
        y:y,
        width:width,
        height:height,
        face:0.562,
        sashGap:0.1283,
        color:getFrameColor(frameColor, "A")
    };	
    var sash = {
        x:frame.x + frame.face + frame.sashGap,
        y:frame.y + frame.face + frame.sashGap,
        width:frame.width - (frame.face * 2) - (frame.sashGap *2),
        height:frame.height - (frame.face * 2) - (frame.sashGap *2),
        face1:1.258,
        face2:0.7201
    };
    initMitredFrame(hinge + "sash", sash.x, sash.y, sash.width, sash.height, sash.face1 + sash.face2, frame.color);
    initMitredFrame(hinge + "sash_bevel", sash.x + sash.face1, sash.y + sash.face1, sash.width - (sash.face1 * 2), sash.height - (sash.face1 * 2), sash.face2, frame.color);

    //bead variables
    var bead = {
        x:sash.x + sash.face1 + sash.face2,
        y:sash.y + sash.face1 + sash.face2,
        width:sash.width - ((sash.face1 + sash.face2) * 2),
        height:sash.height - ((sash.face1 + sash.face2) * 2),
        face:0.875
    };

    var glass = {
        x:bead.x + bead.face,
        y:bead.y + bead.face,
        width:bead.width - (bead.face * 2),
        height:bead.height - (bead.face * 2),
        color:getGlassColor(glassColor)
    };
    initGlass(hinge + "glass",hinge + "sash", glass.x, glass.y, glass.width, glass.height, 0, glass.color);
    //colonial setup
    if(grid.add){
        trace("Add grid: " + grid.pattern);
        
        grid.horiz_offset = (glass.x - frame.x);
        grid.vert_offset = (glass.y - frame.y);

        if(grid.location2 > 0){
           grid.location2 = frame.height - grid.location2;
        }
        
        initPGTGrid(hinge + "glass_pane",hinge + "grid",glass.color,grid);

//        switch(grid.pattern){
//                case "9LP":
//                    //create grid
//                    initGrid(hinge + "glass_pane",hinge + "grid","P1T1B1L1R"+grid.square,frame.color,grid.barWidth);
//                    break;
//                case "3LPH":
//                    //create grid
//                    initGrid(hinge + "glass_pane",hinge + "grid","P1T1B0L0R"+grid.square,frame.color,grid.barWidth);
//                    break;
//                case "3LPV":
//                    //create grid
//                    initGrid(hinge + "glass_pane",hinge + "grid","P0T0B1L1R"+grid.square,frame.color,grid.barWidth);
//                    break;
//                case "6LPB":
//                    //create grid
//                    initGrid(hinge + "glass_pane",hinge + "grid","P0T1B1L1R"+grid.square,frame.color,grid.barWidth);
//                    break;
//                case "6LPT":
//                    //create grid
//                    initGrid(hinge + "glass_pane",hinge + "grid","P1T0B1L1R"+grid.square,frame.color,grid.barWidth);
//                    break;
//                case "6LPL":
//                    //create grid
//                    initGrid(hinge + "glass_pane",hinge + "grid","P1T1B1L0R"+grid.square,frame.color,grid.barWidth);
//                    break;
//                case "6LPR":
//                    //create grid
//                    initGrid(hinge + "glass_pane",hinge + "grid","P1T1B0L1R"+grid.square,frame.color,grid.barWidth);
//                    break;
//                //Now the complex patterns...
//                //the following are Craftsman...grids start at top and go down
//                //C#V#H(T or B)(location) - where location is the location of the bounding muntin 
//                case "1T":
//                case "1B":
//                    //single horizontal bar w/ user defined location
//                    //create grid
//                    initGrid(hinge + "glass_pane",hinge + "grid","C0V1HT"+(grid.location1-(glass.x - frame.x)),frame.color,grid.barWidth);
//                    break;
//                case "1TB":
//                    //top horizontal bar w/ user defined location
//                    //create grid
//                    initGrid(hinge + "glass_pane","grid1","C0V1HT"+(grid.location1-(glass.x - frame.x)),frame.color,grid.barWidth);
//                    //bottom horizontal bar w/ user defined location
//                    //create grid
//                    initGrid(hinge + "glass_pane","grid2","C0V1HB"+(glass.height-(grid.location2-(glass.x - frame.x))),frame.color,grid.barWidth);
//                    break;
//                case "2-1T":
//                    //single horizontal bar w/ user defined location 
//                    //single vertical bar standard location above horizontal
//                    //create grid
//                    initGrid(hinge + "glass_pane",hinge + "grid","C1V1HT"+(grid.location1-(glass.x - frame.x)),frame.color,grid.barWidth);
//                    break;
//                case "2-1B":
//                    //single horizontal bar w/ user defined location 
//                    //single vertical bar standard location below horizontal
//                    //create grid
//                    initGrid(hinge + "glass_pane",hinge + "grid","C1V1HB"+(grid.location1-(glass.x - frame.x)),frame.color,grid.barWidth);
//                    break;
//                case "2-2B":
//                case "2-2T":
//                    //single vertical bar in standard location 
//                    //create grid
//                    initGrid(hinge + "glass_pane","grid1","1V0H",frame.color,grid.barWidth); 
//                    //single horizontal bar w/ user defined location 
//                    //create grid
//                    initGrid(hinge + "glass_pane","grid2","C1V1HB"+(grid.location1-(glass.x - frame.x)),frame.color,grid.barWidth);
//                    break;
//                case "2-3TB":
//                    //single vertical bar in standard location 
//                    //create grid
//                    initGrid(hinge + "glass_pane","grid1","1V0H",frame.color,grid.barWidth); 
//                    //top horizontal bar w/ user defined location
//                    //create grid
//                    initGrid(hinge + "glass_pane","grid2","C0V1HT"+(grid.location1-(glass.x - frame.x)),frame.color,grid.barWidth);
//                    //bottom horizontal bar w/ user defined location
//                    //create grid
//                    initGrid(hinge + "glass_pane","grid3","C0V1HB"+(glass.height-(grid.location2-(glass.x - frame.x))),frame.color,grid.barWidth);
//                    break;
//                case "3-2T":
//                    //single horizontal bar w/ user defined location 
//                    //double vertical bar standard location
//                    //create grid
//                    initGrid(hinge + "glass_pane",hinge + "grid","C2V1HT"+(grid.location1-(glass.x - frame.x)),frame.color,grid.barWidth);
//                    break;
//                case "4-2T":
//                    //single horizontal bar w/ user defined location 
//                    //triple vertical bar standard location
//                    //create grid
//                    initGrid(hinge + "glass_pane",hinge + "grid","C3V1HT"+(grid.location1-(glass.x - frame.x)),frame.color,grid.barWidth);
//                    break;
//                case "2-2-3T":
//                    //double horizontal bar w/ user defined location 
//                    //single vertical bar standard location
//                    //create grid
//                    initGrid(hinge + "glass_pane",hinge + "grid","C1V2HT"+(grid.location1-(glass.x - frame.x)),frame.color,grid.barWidth);
//                    break;
//                case "3-3-3T":
//                    //double horizontal bar w/ user defined location 
//                    //double vertical bar standard location
//                    //create grid
//                    initGrid(hinge + "glass_pane",hinge + "grid","C2V2HT"+(grid.location1-(glass.x - frame.x)),frame.color,grid.barWidth);
//                    break;
//                default:
//                    //the default pattern is just vert/horiz bars
//                    //create grid
//                    initGrid(hinge + "glass_pane",hinge + "grid",grid.v_bars+"V"+grid.h_bars+"H",frame.color,grid.barWidth);
//                    break;
//            
//        }
    }
    initOuterNonMtrdFrame(hinge + "bead", bead.x, bead.y, bead.width, bead.height, bead.face, bead.face, bead.face, true, bead.face, true, frame.color);
    //initMitredFrame(hinge + "bead", bead.x, bead.y, bead.width, bead.height, bead.face, frame.color);


    initMitredFrame(hinge + "frame", frame.x, frame.y, frame.width, frame.height, frame.face, frame.color);
    
    switch(hinge){
        case "f":
            frame.color = adjustColor(frame.color, -20);
            break;
        default:
            frame.color = adjustColor(frame.color, -100);
    }

    initMitredFrame(hinge + "sash_gap", frame.x + frame.face, frame.y + frame.face, frame.width - (frame.face *2), frame.height - (frame.face * 2), frame.sashGap, frame.color);

    //and handing
    switch(hinge){
        case "f":
            //do nothing
            break;
        default:
            initHanding(hinge + "handing",hinge + "glass_pane",hinge.toUpperCase());
    }
    //Add dims
    var dimWidth = {
        x1:frame.x,
        y1:frame.y + frame.height,
        x2:frame.x + frame.width,
        y2:frame.height,
        offset:1.5
    };
    createDim(dimWidth.x1,dimWidth.y1 + dimWidth.offset,dimWidth.x2,dimWidth.y2 + dimWidth.offset,false);
    
    if(grid.add && grid.location1 > 0){
        createDim(frame.x + (frame.width - 5),frame.y,frame.x + (frame.width - 5),frame.y + grid.location1,false,true);
    }
    if(grid.add && grid.location2 > 0){
        createDim(frame.x + (frame.width - 5),grid.location2,frame.x + (frame.width - 5),frame.height,false,true);
    }


}



