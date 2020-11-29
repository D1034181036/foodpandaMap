var lat = "25.0581408";
var lng = "121.6665558";
var requestUrl = "https://disco.deliveryhero.io/listing/api/v1/pandora/vendors?latitude="+lat+"&longitude="+lng+"&language_id=6&include=characteristics&new_sorting=true&dynamic_pricing=0&configuration=Original&country=tw&customer_id=&customer_hash=&budgets=&cuisine=&food_characteristic=&vertical=restaurants&customer_type=regular";

function setMarker(items){
	for(var i=0; i<items.length; i++){
	    document.getElementById("demo").innerHTML += (i+1) + " " + items[i]["name"] + "<br>";
	}
}

//=================================================

xmlhttp = new XMLHttpRequest();

xmlhttp.open("GET", requestUrl, true);
xmlhttp.setRequestHeader("x-disco-client-id", "web");
xmlhttp.send();

xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var jsonData = JSON.parse(this.responseText);
        var items = jsonData["data"]["items"];
        var availableItems = [];
        var unavailableItems = [];
        for(var i=0; i<items.length; i++){
        	if(items[i]["metadata"]["is_delivery_available"] == true){
        		availableItems.push(items[i]);
        	}else{
        		unavailableItems.push(items[i]);
        	}
        }

        setMarker(availableItems);
        console.log(items.length);
        console.log(availableItems.length);
        console.log(unavailableItems.length);
    }
};