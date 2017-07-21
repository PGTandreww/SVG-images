
/**
 * Convert from PGT color code to HTML color name.
 * 
 * @param 	strPGTColor		String PGT color code 
 * @return	strHTMLColor	String HTML color name
 */

function getHTMLColor(strPGTColor)
{
try
{
	trace("getHTMLColor('"+strPGTColor+"')");
	
	switch(strPGTColor){
		case "W":
			strHTMLColor = "Snow";
			break;
		case "B":
			strHTMLColor = "SaddleBrown";
			break;
		default:
			strHTMLColor = "White";
	
	}

	return strHTMLColor;
}	
catch(e)
{
	alertUser("Exception:  getHTMLColor('"+PGTColor+"')");
	alertUser(e);
	trace(e);
}	
} 


