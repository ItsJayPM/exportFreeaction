var dom = fl.getDocumentDOM();
if (dom == null)
{
    alert('Please open a file to use this script.');
}
else
{
	var lib = dom.library;
	var item;
	var oldLinkHavers = [];
	var targets = [];

	var gg_dialog = dom.xmlPanel(fl.configURI+"Commands/[FT] Export Freeaction.xml");

	if (gg_dialog.dismiss == "accept") {
		targets = gg_dialog.targets.split(",");
		deleteUnused();
		changeBaseClasses();
		alert("Processing finished! Simply export the movie to produce the freeaction file. Remember to double check that you got everything you wanted cleared out removed, anything stored in other files should be gone.");
	}
}

// Deletes unused symbols (regardless of linkage) and nulls out any symbols with scripts (or targets placed on them).
function deleteUnused()
{
	//Temporarily remove all linkages so the select unused function works (it intentionally avoids linked stuff).
	//Also removes contents while we're at it...
	var i = lib.items.length;
	while (i--){
		item = lib.items[i];
		if (item.linkageClassName)
		{
			oldLinkHavers.push(item.name);
			item.linkageExportForAS = false;
			lib.selectItem(item.name);
			lib.editItem();
			dom.selectAll();
			//Apparently trying to delete when there is nothing there causes a crash... who knew!
			if (dom.selection.length > 0)
			{
				dom.deleteSelection();
			}
			dom.exitEditMode();
		}
		else
		{
			//If we don't have a linked symbol, check if the symbol is a target...
			//If it is, we remove the contents.
			//Splitting is necessary to make it work in folders.
			var itemSplit = item.name.split("/");
			for (var j = 0; j < targets.length; j++)
			{
				if (itemSplit[itemSplit.length - 1] == targets[j])
				{
					lib.selectItem(item.name);
					lib.editItem();
					dom.selectAll();
					if (dom.selection.length > 0)
					{
						dom.deleteSelection();
					}
					dom.exitEditMode();
				}
			}
		}
	}
	
	//Grab the unused items and delete them.
	var unusedArr = lib.unusedItems;

	for(i=0;i < unusedArr.length;i++) 
	{
		lib.deleteItem(unusedArr[i].name);
	}
	
	
	//Now that we're done, re-enable the linkage for everything we disabled.
	i = lib.items.length;
	while (i--){
		item = lib.items[i];
		for (var p = 0; p < oldLinkHavers.length; p++)
		{
			if (item.name == oldLinkHavers[p])
			{
				item.linkageExportForAS = true;
			}
		}
	}
	
	
	
}

//Changes the base classes depending on the folders.
function changeBaseClasses()
{
	var i = lib.items.length;
	while (i--){
		item = lib.items[i];
		
		//Is our item linked?
		if (item.linkageClassName)
		{
			//If it is, check if the folder it is in indicates what linkage it should have.
			folder = item.name.split("/")[0].toUpperCase();
			switch (folder)
			{
				case "UPPER":
					item.linkageBaseClass = "anifire.core.GoUpper";
					break;
				case "LOWER":
					item.linkageBaseClass = "anifire.core.GoLower";
					break;
				case "HAIR":
					item.linkageBaseClass = "anifire.core.GoHair";
					break;
				case "FEET":
					item.linkageBaseClass = "anifire.core.GoFeet";
					break;
				case "HANDS":
					item.linkageBaseClass = "anifire.core.GoHands";
					break;
				case "BEHIND BODY":
					item.linkageBaseClass = "anifire.core.GoBehindBody";
					break;
				default:
					alert("Failed to find a matching class for " + item.name + ". Make sure you put it into a recognized folder.\n(e.g.: \"UPPER\",\"LOWER\",\"HAIR\",\"FEET\",\"HANDS\",\"BEHIND BODY\")");
					break;
			}
		}
		
	}
}