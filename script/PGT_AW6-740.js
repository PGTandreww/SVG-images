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

//check w and h...no need to continue is either is 0
if(WDTH > 0 && HGHT> 0){
    //continue
//    //basic colonial setup
//    var grid = {
//        add:false,
//        v_bars:COL1HQTY - 1,
//        h_bars:COL1VQTY - 1,
//        pattern:COL1PTRN,
////        location1:COLMTNLOC1,
////        location2:COLMTNLOC2,
//        square:COLSQSZ,
//        barWidth:getGridFace(COLTYPE)
//    };
//    //centralize grid conditioning
//    if (grid.barWidth > 0){
//            switch(COLLOC){
//                case "CMPASSY":
//                case "UNIT":
//                    grid.add = true;
//                    break;
//            }
//    }
    var frame = {
        x:0,
        y:0,
        width:WDTH,
        height:HGHT,
        face:0.562,
        sashGap:0.1283,
        color:getFrameColor(FRMCLR, "A")
    };	
    var sash = {
        x:frame.x + frame.face + frame.sashGap,
        y:frame.y + frame.face + frame.sashGap,
        width:frame.width - (frame.face * 2) - (frame.sashGap *2),
        height:frame.height - (frame.face * 2) - (frame.sashGap *2),
        face1:1.258,
        face2:0.7201
    };
    initMitredFrame("sash", sash.x, sash.y, sash.width, sash.height, sash.face1 + sash.face2, frame.color);
    initMitredFrame("sash_bevel", sash.x + sash.face1, sash.y + sash.face1, sash.width - (sash.face1 * 2), sash.height - (sash.face1 * 2), sash.face2, frame.color);

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
        color:getGlassColor(GLS1CLR)
    };
    initGlass("glass","sash", glass.x, glass.y, glass.width, glass.height, 0, glass.color);

    //colonial
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
        bar_width:getGridFace(COLTYPE),
        color:getFrameColor(COLCLR,"A")
    };

    with (grid){
        if (bar_width > 0){
            add = true;
        }

        if (add){
            initPGTGrid("glass_pane","grid",glass.color,grid);
        }
    }

//        //colonial setup
//    if(grid.add){
//        trace("Add grid: " + grid.pattern);
//        switch(grid.pattern){
//                case "9LP":
//                    //create grid
//                    initGrid("glass_pane","grid","P1T1B1L1R"+grid.square,frame.color,grid.barWidth);
//                    break;
//                case "3LPH":
//                    //create grid
//                    initGrid("glass_pane","grid","P1T1B0L0R"+grid.square,frame.color,grid.barWidth);
//                    break;
//                case "3LPV":
//                    //create grid
//                    initGrid("glass_pane","grid","P0T0B1L1R"+grid.square,frame.color,grid.barWidth);
//                    break;
//                case "6LPB":
//                    //create grid
//                    initGrid("glass_pane","grid","P0T1B1L1R"+grid.square,frame.color,grid.barWidth);
//                    break;
//                case "6LPT":
//                    //create grid
//                    initGrid("glass_pane","grid","P1T0B1L1R"+grid.square,frame.color,grid.barWidth);
//                    break;
//                case "6LPL":
//                    //create grid
//                    initGrid("glass_pane","grid","P1T1B1L0R"+grid.square,frame.color,grid.barWidth);
//                    break;
//                case "6LPR":
//                    //create grid
//                    initGrid("glass_pane","grid","P1T1B0L1R"+grid.square,frame.color,grid.barWidth);
//                    break;
//                //Now the complex patterns...
//                //the following are Craftsman...grids start at top and go down
//                //C#V#H(T or B)(location) - where location is the location of the bounding muntin 
//                case "1T":
//                case "1B":
//                    //single horizontal bar w/ user defined location
//                    //create grid
//                    initGrid("glass_pane","grid","C0V1HT"+(grid.location1-(glass.x - frame.x)),frame.color,grid.barWidth);
//                    break;
//                case "1TB":
//                    //top horizontal bar w/ user defined location
//                    //create grid
//                    initGrid("glass_pane","grid1","C0V1HT"+(grid.location1-(glass.x - frame.x)),frame.color,grid.barWidth);
//                    //bottom horizontal bar w/ user defined location
//                    //create grid
//                    initGrid("glass_pane","grid2","C0V1HB"+(glass.height-(grid.location2-(glass.x - frame.x))),frame.color,grid.barWidth);
//                    break;
//                case "2-1T":
//                    //single horizontal bar w/ user defined location 
//                    //single vertical bar standard location above horizontal
//                    //create grid
//                    initGrid("glass_pane","grid","C1V1HT"+(grid.location1-(glass.x - frame.x)),frame.color,grid.barWidth);
//                    break;
//                case "2-1B":
//                    //single horizontal bar w/ user defined location 
//                    //single vertical bar standard location below horizontal
//                    //create grid
//                    initGrid("glass_pane","grid","C1V1HB"+(grid.location1-(glass.x - frame.x)),frame.color,grid.barWidth);
//                    break;
//                case "2-2B":
//                case "2-2T":
//                    //single vertical bar in standard location 
//                    //create grid
//                    initGrid("glass_pane","grid1","1V0H",frame.color,grid.barWidth); 
//                    //single horizontal bar w/ user defined location 
//                    //create grid
//                    initGrid("glass_pane","grid2","C1V1HB"+(grid.location1-(glass.x - frame.x)),frame.color,grid.barWidth);
//                    break;
//                case "2-3TB":
//                    //single vertical bar in standard location 
//                    //create grid
//                    initGrid("glass_pane","grid1","1V0H",frame.color,grid.barWidth); 
//                    //top horizontal bar w/ user defined location
//                    //create grid
//                    initGrid("glass_pane","grid2","C0V1HT"+(grid.location1-(glass.x - frame.x)),frame.color,grid.barWidth);
//                    //bottom horizontal bar w/ user defined location
//                    //create grid
//                    initGrid("glass_pane","grid3","C0V1HB"+(glass.height-(grid.location2-(glass.x - frame.x))),frame.color,grid.barWidth);
//                    break;
//                case "3-2T":
//                    //single horizontal bar w/ user defined location 
//                    //double vertical bar standard location
//                    //create grid
//                    initGrid("glass_pane","grid","C2V1HT"+(grid.location1-(glass.x - frame.x)),frame.color,grid.barWidth);
//                    break;
//                case "4-2T":
//                    //single horizontal bar w/ user defined location 
//                    //triple vertical bar standard location
//                    //create grid
//                    initGrid("glass_pane","grid","C3V1HT"+(grid.location1-(glass.x - frame.x)),frame.color,grid.barWidth);
//                    break;
//                case "2-2-3T":
//                    //double horizontal bar w/ user defined location 
//                    //single vertical bar standard location
//                    //create grid
//                    initGrid("glass_pane","grid","C1V2HT"+(grid.location1-(glass.x - frame.x)),frame.color,grid.barWidth);
//                    break;
//                case "3-3-3T":
//                    //double horizontal bar w/ user defined location 
//                    //double vertical bar standard location
//                    //create grid
//                    initGrid("glass_pane","grid","C2V2HT"+(grid.location1-(glass.x - frame.x)),frame.color,grid.barWidth);
//                    break;
//                default:
//                    //the default pattern is just vert/horiz bars
//                    //create grid
//                    initGrid("glass_pane","grid",grid.v_bars+"V"+grid.h_bars+"H",frame.color,grid.barWidth);
//                    break;
//            
//        }
//    }
    initOuterNonMtrdFrame("bead", bead.x, bead.y, bead.width, bead.height, bead.face, bead.face, bead.face, true, bead.face, true, frame.color);
    //initMitredFrame("bead", bead.x, bead.y, bead.width, bead.height, bead.face, frame.color);


    initMitredFrame("frame", frame.x, frame.y, frame.width, frame.height, frame.face, frame.color);
    
    frame.color = adjustColor(frame.color, -100);

    initMitredFrame("sash_gap", frame.x + frame.face, frame.y + frame.face, frame.width - (frame.face *2), frame.height - (frame.face * 2), frame.sashGap, frame.color);

    //and handing
    initHanding("handing","glass_pane","U");

    //add dims
//    if(grid.add && grid.location1 > 0){
//        createDim(frame.x + (frame.width - 5),frame.y,frame.x + (frame.width - 5),frame.y + grid.location1,false,true);
//    }
//    if(grid.add && grid.location2 > 0){
//        createDim(frame.x + (frame.width - 5),frame.height - grid.location2,frame.x + (frame.width - 5),frame.height,false,true);
//    }

    //Add overall dims
    var dimWidth = {
        x1:0,
        y1:HGHT,
        x2:WDTH,
        y2:HGHT,
        offset:1.5
    };
    var dimHeight = {
        x1:WDTH,
        y1:0,
        x2:WDTH,
        y2:HGHT,
        offset:1.5
    };


    createDim(dimWidth.x1,dimWidth.y1 + dimWidth.offset,dimWidth.x2,dimWidth.y2 + dimWidth.offset,false);
    createDim(dimHeight.x1 + dimHeight.offset,dimHeight.y1,dimHeight.x2 + dimHeight.offset,dimHeight.y2,false);


        }
// INSERT YOUR SCRIPTING HERE!!!!!



	returnConfigData();  // post values to confguration code
}




