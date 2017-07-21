// $import="windows.js"
// $return$

function generate(evt)
{
// $initialize$

	
if(color == "")
{
	color = "gray";	
}	
if(color == "ALMOND")
{
	color = "TAN";  // web color
}
var x = 0;
var y = 0;

var panelWidth = sideWidth - (2*stileWidth);

var hTopPanel = height - lowerPanelHeight - topRailWidth - midRailWidth - btmRailWidth;
initOuterNonMtrdFrame("lt_panel", x+stileWidth, y+topRailWidth, panelWidth, hTopPanel, 0.75,0.75,0.75, color);

var xRPanels= x + width + stileWidth - sideWidth;
initOuterNonMtrdFrame("rt_panel", xRPanels,y+topRailWidth, panelWidth, hTopPanel, 0.75,0.75,0.75, color);

var yLLPanel = y + height - lowerPanelHeight - btmRailWidth;
initOuterNonMtrdFrame("ll_panel", x+stileWidth, yLLPanel, panelWidth, lowerPanelHeight, 0.75,0.75,0.75, color);

initOuterNonMtrdFrame("lr_panel", xRPanels, yLLPanel, panelWidth, lowerPanelHeight, 0.75,0.75,0.75, color);

var yMidRails = y + topRailWidth + hTopPanel;
initRect("lmid_rail", x+stileWidth, yMidRails, panelWidth, midRailWidth, color);
initRect("rmid_rail", xRPanels, yMidRails, panelWidth, midRailWidth, color);

var yBotRails = y + height - btmRailWidth;
initRect("lbot_rail", x+stileWidth, yBotRails, panelWidth, btmRailWidth, color);
initRect("rbot_rail", xRPanels, yBotRails, panelWidth, btmRailWidth, color);

initRect("linner_rail", x+sideWidth-stileWidth, y+topRailWidth, stileWidth, height-topRailWidth, color);
initRect("rinner_rail", x+(width - sideWidth), y+topRailWidth, stileWidth, height-topRailWidth, color);

initDoorNoThresholdNonMtrdFrame("inner_frame", x+sideWidth, topRailWidth, width-(sideWidth*2), height-topRailWidth, 0.75, 0.75, color);

initDoorNoThresholdMitredFrame("outer_frame", x, y, width, height, topRailWidth, stileWidth, color);


createDim(x,-6,x+width,-6,false); 
createDim(x+stileWidth,-3,x+width-stileWidth,-3,false); 

createDim(-3,y,-3,y+topRailWidth,false);
createDim(-3,y+topRailWidth,-3,y+topRailWidth+hTopPanel,false);
createDim(-3,y+topRailWidth+hTopPanel,-3,y+topRailWidth+hTopPanel+midRailWidth,false);
createDim(-3,y+topRailWidth+hTopPanel+midRailWidth,-3,y+topRailWidth+hTopPanel+midRailWidth+lowerPanelHeight,false);
createDim(-3,y+height-btmRailWidth,-3,y+height,false);

createDim(-6,y+topRailWidth,-6,y+height-topRailWidth,false);

createDim(x,y+height+3,x+stileWidth,y+height+3,false);
createDim(x+stileWidth,y+height+3,x+sideWidth-stileWidth,y+height+3,false);
createDim(x+sideWidth-stileWidth,y+height+3,x+sideWidth,y+height+3,false);

createDim(x+width-sideWidth,y+height+3,x+width-sideWidth+stileWidth,y+height+3,false);
createDim(x+width-sideWidth+stileWidth,y+height+3,x+width-stileWidth,y+height+3,false);
createDim(x+width-stileWidth,y+height+3,x+width,y+height+3,false);


createDim(x,y+height+6,x+sideWidth,y+height+6,false);
createDim(x+sideWidth,y+height+6,x+width-sideWidth,y+height+6,false);
createDim(x+width-sideWidth,y+height+6,x+width,y+height+6,false);


returnConfigData();

}

