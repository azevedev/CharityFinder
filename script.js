var apiKey = "06b42691-258b-41d2-8cce-da98d58d98a6";
var base_url = "https://api.globalgiving.org/api/public/services/search/projects?api_key="+apiKey;
var themesURL = "https://api.globalgiving.org/api/public/projectservice/themes?api_key="+apiKey;
var data;
var themes;
$(document).ready(function(){
    $.getJSON("isoCountrys.json", function(json) {
        data = json; // this will show the info it in firebug console
        show_continents();
    });
    get_themes();
    
});

function get_themes(){
    $.ajax({
        url: themesURL,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            themes = data.themes.theme;
            var themes_input = $('#select_themes')[0];
            var text_html = '<option value="-1" selected >-- Select --</option>'; 
            themes.forEach(function(item){
                text_html += '<option value="'+item.id+'">'+item.name+'</option>';
            });
            themes_input.innerHTML = text_html;
            $('#select_themes').show();
        },
        error: function(data){
            console.error(data);
        }
    });
}

function show_continents(){
    var cont = $('#select_continent')[0];
    var text_html = '<option value="-1" selected >-- Select --</option>';
    data.forEach(function(item, index){
        text_html += '<option value="'+index+'">'+item.continent+'</option>';
    });
    cont.innerHTML = text_html;
}

$("#select_continent").click(function(){
    var op_value = $(this).find(":selected").val();
    if(op_value >= 0){
        show_contries(op_value);
    }else{
        $('#select_country').hide();
        $('#not_select_country').show();
    }
});

function show_contries(op){
    $('#not_select_country').hide();
    data.forEach(function(item, index){
        if(op == index){
            var countries = item.countries;
            var cont = $('#select_country')[0];
            $('#select_country').show();
            var text_html = '<option value="-1" selected >-- Select --</option>';
            countries.forEach(function(item){
                text_html += '<option value="'+item.code+'">'+item.Name+'</option>';
            });
            cont.innerHTML = text_html;
        }
    });
}


$("#go").click(function(){
    var cur_url = base_url;
    var seach = $("#search_input").val();
    if(seach != ""){
        seach = seach.replace(" ", "+");
        cur_url += "&q="+seach;
    }else{
        cur_url += "&q=*";
    }
    var filter = "";
    var theme = $('#select_themes').find(":selected").val();
    if(theme != '-1' && theme){
        filter += "&filter=theme:"+theme;
    }
    var cont = $('#select_continent').find(":selected").val();
    if(cont >= 0){
        var cur_country = $('#select_country').find(":selected").val();
        console.log("coutry:"+cur_country);
        if(cur_country != "-1"){
            if(filter == ""){
                filter += "&filter=country:"+cur_country;
            }else{
                filter += ",country:"+cur_country;
            }
        }
    }
    cur_url += filter;
    $.ajax({
        url: cur_url,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            if(data.search.response.numberFound > 0){
                var projects = data.search.response.projects.project;
                // console.log(data.search.response.projects);
                
                $("#results")[0].innerHTML = "";
                projects.forEach(addToBody);
            }
            

        },
        error: function(data){
            console.error(data);
        }
    });
    $(this).blur();
});


function addToBody(item){
    console.log(item);
    var title = item.title;
    var summary = item.summary;
    var length = 200;
    summary = summary.substring(0, length);
    summary += '...';
    var category = item.themeName;
    var imgUrl = item.imageLink;
    var websiteLink = item.contactUrl;
    var projectLink = item.projectLink; 
    var htmlText = '<div class="card">';
    htmlText += '<div class="category">'+category+'</div>';
    var cardImgHtml = '<img src="'+imgUrl+'" width="100% height="auto">';
    htmlText += '<div class="card-img">'+cardImgHtml+'</div>';
    htmlText += '<div class="card-body">';
    htmlText += '<div class="header-content"><h2>'+title+'</h2></div><br><br>';
    var linkHtml = '<a href="'+projectLink+'" target="_blank">Read more >></a>';
    htmlText += '<div class="main-content">'+summary+'<br>'+linkHtml+'</div>';
    linkHtml = '<a href="'+websiteLink+'" target="_blank">Visit Website</a>';
    htmlText += '<div class="footer-content">'+linkHtml+'</div><br>';
    $("#results")[0].innerHTML += htmlText;
}


// <div class="card">
//                 <div class="category">
//                     Education
//                 </div>
//                 <div class="card-img">
//                     <img src="https://cdn01.buxtonco.com/client_logos/1168/blattbeertable__medium.png" alt="" width="100%">
//                 </div>
//                 <div class="card-body">
//                     <div class="header-content">
//                         <h2>Title of Project</h2>
//                     </div>
//                     <div class="main-content" style="text-align: left;">
//                         This is just a sumary. Lorem ipsum dolor sit amet consectetur adipisicing elit. Error dolor voluptatem hic soluta fugit, expedita enim consequatur, quas iusto ullam quasi sunt suscipit rem eos molestias perferendis tempore quibusdam cumque.
//                     </div>
//                     <div class="footer-content">
//                         <a href="#" target="_blank">Visit Website</a>
//                     </div>
//                 </div>
//             </div>