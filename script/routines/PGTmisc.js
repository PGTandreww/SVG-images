
/**
 * Convert from PGT color code to HTML color name.
 * NOTE: conversion to hex color code was done using https://www.w3schools.com/colors/colors_converter.asp
 * 
 * @param 	strPGTColor		String PGT color code 
 * @param       strMaterial     A - aluminum, V - vinyl
 * @return	strHTMLColor	String HTML color name
 */

function getFrameColor(strPGTColor, strMaterial)
{
try
{
	trace("getFrameColor('"+strPGTColor+"')");
        
	var strHTMLColor;
        
	switch(strPGTColor){
        //WHITE
            case "W":
            case "WHITE":
            case "10PW":
            case "20PW":
            case "D2W":
            case "D702W":
            case "D72W":
            case "D3W":
            case "D703W":
            case "D73W":
            case "W/T":
            case "W/B":
            case "W/B/T/PK":
            case "W/NC":
            case "W/DO":
            case "W/NO":
                //white is white
		strHTMLColor = "#ffffff";
		break;
        //VENETIAN BRONZE
            case "VB":
            case "10PVB":
            case "20PVB":
            case "D2VB":
            case "D702VB":
            case "D72VB":
            case "D3VB":
            case "D703VB":
            case "D73VB":
                //cmyk(40%,41%,54%,44%)
                strHTMLColor = "#565442";
		break;
        //PEBBLE KHAKI
            case "PK":
            case "10PPK":
            case "20PPK":
            case "D2PK":
            case "D702PK":
            case "D72PK":
            case "D3PK":
            case "D703PK":
            case "D73PK":
            case "PK/NC":
            case "PK/DO":
            case "PK/NO":
            case "PK/W":
                switch(strMaterial){
                    case "A":
                        strHTMLColor = "#9e9e81";
                        break;
                    case "V":
                        strHTMLColor = "#a69f88";
                        break;
                }
                break;
        //ARIZONA BEIGE
            case "ZG":
            case "AB":
            case "10PAB":
            case "10PZG":
            case "20PAB":
            case "20PZG":
            case "D2AB":
            case "D2ZG":
            case "D702AB":
            case "D702ZG":
            case "D72ZG":
            case "D3AB":
            case "D3ZG":
            case "D703AB":
            case "D703ZG":
            case "D73ZG":
                //cmyk(9%,12%,24%,13%)
		strHTMLColor = "#cac3a9";
		break;
        //ANODIZE
            case "A":
            case "A1":
            case "A2":
            case "A/NC":
            case "A/DO":
            case "A/NO":
            case "A/W":
            case "10PSA":
            case "20PSA":
        //MILL - uses same as anodize
            case "M":
            case "MILL":
                //cmyk(0%,0%,0%,10%)
		strHTMLColor = "#c0c0c0";
		break;
        //BRONZE (standard)
            case "B":
            case "10PB":
            case "20PB":
            case "D2B":
            case "D702B":
            case "D72B":
            case "D3B":
            case "D703B":
            case "D73B":
            case "BA":
            case "B2W":
            case "B2WP":
            case "D2B2W":
            case "D702B2W":
            case "D72B2W":
            case "D3B2W":
            case "D703B2W":
            case "D73B2W":
            case "B/T":
            case "B/NC":
            case "B/DO":
            case "B/NO":
            case "B/W":
            case "10PB2W":
            case "20PB2W":
        //SOUTHERN BRONZE - uses same code as standard bronze    
            case "SB":
            case "10PSB":
            case "20PSB":
            case "D702SB":
            case "D72SB":
            case "D703SB":
            case "D73SB":
            case "SB2W":
                switch(strMaterial){
                    case "V":
                        strHTMLColor = "#6c5735";
                        break;
                    case "A":
                        strHTMLColor = "#696158";
                        break;
                }
                break;
        //BLACK
            case "K":
            case "10PK":
            case "20PK":
            case "D2K":
            case "D702K":
            case "D72K":
            case "D3K":
            case "D703K":
            case "D73K":
            case "K2W":
            case "D2K2W":
            case "D702K2W":
            case "D72K2W":
            case "D3K2W":
            case "D703K2W":
            case "D73K2W":
            case "10PK2W":
            case "20PK2W":
                //black is black
		strHTMLColor = "#000000";
		break;
        //BEIGE
            case "T":
            case "10PT":
            case "20PT":
            case "D2T":
            case "D702T":
            case "D72T":
            case "D3T":
            case "D703T":
            case "D73T":
            case "T/B":
            case "T/NC":
            case "T/DO":
            case "T/NO":
            case "T/W":
		strHTMLColor = "#d6d2c4";
		break;
        //HUNTER GREEN
            case "HG":
            case "10PHG":
            case "20PHG":
            case "D2HG":
            case "D702HG":
            case "D72PHG":
            case "D3HG":
            case "D703HG":
            case "D73PHGN":
            case "HG/NC":
            case "HG/DO":
            case "HG/NO":
            case "HG/W":
                switch(strMaterial){
                    case "A":
                        strHTMLColor = "#13322b";
                        break;
                    case "V":
                        strHTMLColor = "#13322b";
                        break;
                }
                break;
        //BRICK RED
            case "BR":
            case "10PBR":
            case "20PBR":
            case "D2BR":
            case "D702BR":
            case "D72BR":
            case "D3BR":
            case "D703BR":
            case "D73BR":
            case "BR/NC":
            case "BR/DO":
            case "BR/NO":
            case "BR/W":
                switch(strMaterial){
                    case "A":
                        strHTMLColor = "#81312f";
                        break;
                    case "V":
                        strHTMLColor = "#81312f";
                        break;
                }
                break;
            default:
		strHTMLColor = "purple";
	
	}
        trace("return:"+strHTMLColor);
	return strHTMLColor;
}	
catch(e)
{
	alertUser("Exception:  getFrameColor('"+strPGTColor+"')");
	alertUser(e);
	trace(e);
}	
} 



/**
 * Convert from PGT color code to HTML color name.
 * 
 * @param 	strPGTColor		String PGT color code 
 * @return	strHTMLColor	String HTML color name
 */

function getGlassColor(strPGTColor)
{
try
{
	trace("getGlassColor('"+strPGTColor+"')");
	
        var strHTMLColor;
        
	switch(strPGTColor){
		case "CL":
			strHTMLColor = "WhiteSmoke";
			break;
		case "BZ":
			strHTMLColor = "RosyBrown";
			break;
		case "GR":
			strHTMLColor = "LightGray";
			break;
		case "GN":
			strHTMLColor = "LightGreen";
			break;
		case "AZ":
			strHTMLColor = "Aqua";
			break;
		case "SB":
			strHTMLColor = "Goldenrod";
			break;
		case "SG":
			strHTMLColor = "LightSlateGray";
			break;
		case "G2":
			strHTMLColor = "DarkGray";
			break;
		default:
			strHTMLColor = "White";
	
	}
        trace("return:"+strHTMLColor);
	return strHTMLColor;
}	
catch(e)
{
	alertUser("Exception:  getGlassColor('"+PGTColor+"')");
	alertUser(e);
	trace(e);
}	
} 

/**
 * Return PGT grid face dimension.
 * 
 * @param 	gridType	String PGT colonial type 
 * @return	gridFace	Decimal grid face dimension
 */

function getGridFace(gridType)
{
try
{
    trace("getGridFace('"+gridType+"')");
    var gridFace;
    switch(gridType){
        case "ODA1000":
        case "SDLB1000":
        case "SDLC1000":
        case "SDC1000":
        case "GBGC1000":
        case "FB1000":
        case "DF1000":
        case "RM1000":
        case "DA1000":
        case "SR1000":
        case "DR1000":
        case "OG1000":
        case "RLO1000":
        case "ODR1000":
        case "OGL1000":
        case "SDFB1000":
        case "SDLT1000":
        case "SDLL1000":
        case "SDL1000":
            gridFace = 1;
            break;
        case "GBGF0813":
            gridFace = 0.813;
            break;
        case "FB2000":
        case "DF2000":
        case "RM2000":
        case "DR2000":
        case "DA2000":
            gridFace = 2;
            break;
        case "DA0875":
        case "ODA0875":
        case "ODR0875":
        case "FB0875":
        case "RM0875":
        case "OG0875":
        case "SDLT0875":
            gridFace = 0.875;
            break;
        case "GBGF0563":
            gridFace = 0.563;
            break;
    }
    return gridFace;
}
catch(e)
{
	alertUser("Exception:  getGridFace('"+gridType+"')");
	alertUser(e);
	trace(e);
}	
}
