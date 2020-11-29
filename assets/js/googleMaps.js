function initMap(){
    var initPos = { lat: 25.0640087, lng: 121.659068 };
    map = new google.maps.Map(document.getElementById("map"), {
        center: initPos,
        zoom: 18,
    });
    initMarkers(initPos);
}

function initMarkers(initPos){
	var requestUrl = "https://disco.deliveryhero.io/listing/api/v1/pandora/vendors?latitude="+initPos.lat+"&longitude="+initPos.lng+"&language_id=6&include=characteristics&new_sorting=true&dynamic_pricing=0&configuration=Original&country=tw&customer_id=&customer_hash=&budgets=&cuisine=&food_characteristic=&vertical=restaurants&customer_type=regular";
	
	xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", requestUrl, true);
	xmlhttp.setRequestHeader("x-disco-client-id", "web");
	xmlhttp.send();

	xmlhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	        var jsonData = JSON.parse(this.responseText);
	        var data = getItems(jsonData);
	        setMarkers(data["items"]); //.slice(0, 100)
	        //console.log("item: " + data["items"].length + "\navailableItems: " + data["availableItems"].length + "\nunavailableItems: " + data["unavailableItems"].length);
	    }
	};
}

function setMarkers(items){
	var marker = {};
    var infoWindow = {};
    var info_div = {};

	for(let i = 0; i<items.length; i++){
		items[i]["lat"] = items[i]["latitude"];  //for google maps
        items[i]["lng"] = items[i]["longitude"]; //for google maps
        items[i]["bgColor"] = items[i]["metadata"]["is_delivery_available"] ? "green" : "brown";
        items[i]["showTitle"] = items[i]["name"] + " (" + items[i]["minimum_delivery_time"] + " 分鐘)";
        
        marker[i] = new google.maps.Marker({
            position: items[i],
            map: map,
            icon: createMarkerIcon(items[i]["showTitle"], {bgColor: items[i]["bgColor"]})
        });

        infoWindow[i] = new google.maps.InfoWindow({
		    content: "地址: " + items[i]["address"] + "<br>" +
		    		 "距離: " + items[i]["distance"] + "<br>" +		    		
		    		 "最短送餐時間: " + items[i]["minimum_delivery_time"] + " 分鐘<br>" +
		    		 "點餐網址: <a href='" + items[i]["redirection_url"] + "'> 按我點餐 </a><br>"
		});

        marker[i].addListener("click", function() {infoWindow[i].open(map, marker[i]);});

        info_div[i] = addInfoTab("info", i, items[i]["showTitle"]);

		document.getElementById("info").appendChild(info_div[i]);

        google.maps.event.addDomListener(info_div[i], "click", () => {
		    infoWindow[i].open(map, marker[i]);
		});
	}
	console.log(items[0]);
}

function getItems(jsonData){
	var data = {};
	data["items"] = jsonData["data"]["items"];
	data["availableItems"] = [];
	data["unavailableItems"] = [];
	data["items"].sort(function (x, y) {
	    return ((x.minimum_delivery_time==y.minimum_delivery_time)?0:((x.minimum_delivery_time>y.minimum_delivery_time)?1:-1));
	});
    for(var i=0; i<data["items"].length; i++){
      	if(data["items"][i]["metadata"]["is_delivery_available"] == true){
       		data["availableItems"].push(data["items"][i]);
       	}else{
       		data["unavailableItems"].push(data["items"][i]);
       	}
    }
    return data;
}

function addInfoTab(obj, id, text) {
	var parent = document.getElementById(obj);
	var aTag = document.createElement("a");
	aTag.setAttribute("id", id);
	aTag.setAttribute("class", "list-group-item");
	aTag.classList.add("list-group-item-action");

	aTag.href = "#";
	aTag.onClick = "return false;";
	aTag.innerHTML = text;
	aTag.setAttribute("data-toggle", "list");
	parent.appendChild(aTag);
	return aTag;
}