var addthis_share = {
    templates: { twitter:"Awesome text+icons: {{url}} @kawantum #nounproject"  }
}

function getInput(){
var beginInput = ['a teddy-bear in love','my physical-therapy is surfing', 'i enjoyed the cocktail at the scenic-viewpoint','use a robot to plant a flower', 'where is the taxi ?'];
var rand=Math.floor(Math.random()*beginInput.length);

$("FORM INPUT:text").val(function(){ 
return beginInput[rand]});
}
	
$('#loadingDiv')
    .hide()  // hide it initially
    .ajaxStart(function() {
        $(this).show();
    })
    .ajaxStop(function() {
        $(this).hide();
    })
;

//for hashing links to share
function addHash(index, word) {
   var uniq_id = word;
   window.location.hash += (escape(uniq_id) + '&');
   window.addthis.update('share', 'url', window.location.href);
   window.addthis.update('share', 'template', "Awesome text+icons: {{url}} @kawantum #nounproject");
}

function restoreState() {
   var hash =escape(window.location.hash.replace( /^#/, ''));
  hash = hash.replace(new RegExp("%3A", "g"), ":");
	var input = hash.split("%26");
	
	input = $.map(input, function(entry){
	return unescape(entry);
});
  $("FORM INPUT:text").val(function(){
		return input.join(" ");
	});
 
}


function getSVG(index, word){
	var link="";
	$.getJSON('api/'+word.toString(),function(data){

					if(data['status']=='Success'){
						link = data['data'];
					}	
				
	 $("span#"+index.toString()).html(displayIMG(word,link));
	});


}




function displayIMG(id, link){
	if(link!=""){

	//	image_html = "<span class='image'><a href ='http://thenounproject.com/noun/"+id +"/'><img src ='" + link + "' , title = '"+link+ "', alt ='" + link +" '/></a></span>";
//		image_html = "<span class='image'><a href ='http://thenounproject.com/noun/"+id+"/'><object data ='" + link + "' , title = '"+link+ "' /></a></span>";
//		image_html = "<span class='image'><a href ='http://thenounproject.com/noun/"+id+"/'><embed src ='" + link + "' , title = '"+link+ "' /></a></span>";
image_html = "<a href ='http://thenounproject.com/noun/"+id+"/'><span class='image'><object id ='"+id+"' data='"+link+"'><param name='wmode' value = 'transparent' ></object></span></a>";
//image_html+="<script type = \"text/javascript\">$(\"object#"+id.toString()+"\").click(function(){window.location='"+link+"';}); </script>"
	}
	else{
		image_html = "<span class = 'text'>"+id+" </span>";
	}
return image_html;
} 

//write out divs for display
function displayContainer(index, word){
	$('<span>', {'id':index, html: ''}).appendTo('#content');

//any characters to escape 
if(word=='?'|| word=='.'){$("span#"+index.toString()).html(displayIMG(word,""));}

}

function inputProcessing(input){
window.location.hash='';
words = input.split(" ");
 var newArr = new Array();for (k in words) if(words[k]) newArr.push(words[k]);
  words = newArr;
  $('#content').empty();
  $.each(words, displayContainer);
  $.each(words, getSVG);
$.each(words, addHash);

}

function displayResults(){

	var inputString = $("FORM INPUT:text").val();
	
 if(inputString==''){	
		restoreState();
  	inputString = $("FORM INPUT:text").val();

		if(inputString==''){	

		getInput();
	  inputString = $("FORM INPUT:text").val();
		}
	}
	inputProcessing(inputString);
}		

	

displayResults();
