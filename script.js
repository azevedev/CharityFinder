var apiKey = "06b42691-258b-41d2-8cce-da98d58d98a6";
var url = "https://api.globalgiving.org/api/public/services/search/projects?api_key="+apiKey+"&q=test&filter=theme:edu,country:IN";
var countrys;
$(document).ready(function(){
    console.log("ready!");
    $.getJSON("isoCountrys.json", function(json) {
        countrys = json; // this will show the info it in firebug console
        console.log(json);
    });
});

$("#go").click(function(){
    console.log("GO!");
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            // console.log(data.search.response);
            // console.log(data.search.response.numberFound);
            if(data.search.response.numberFound > 0){
                var projects = data.search.response.projects.project;
                // console.log(data.search.response.projects);
                console.log(projects);
                projects.forEach(addToBody);
            }
            

        },
        error: function(data){
            console.error(data);
        }
    });
});


function addToBody(item){
    console.log(item);

}