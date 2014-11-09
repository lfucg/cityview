/*Created by Jonathan Hollinger, 2014. Use and modify freely at your own risk.*/

function getDetails()
{
var type = 'Permit'
var titlefield = 'Address'
var mapfield = 'Address'
var meta = '<h3>About the Data</h3><p>Permits are issued by the Division of Building Inspection and the Division of Planning for a variety of activities including construction and certification of compliance with zoning. The permit information above is submitted by the applicant.</p><p>If you have questions or concerns about permits, please contact the the Division of Building Inspection at (859) 425-2255.</p><p>Addresses and map locations are approximate. No warranties, expressed or implied, are provided with this information.</p>'
var resource = '2691aff1-e555-48d3-9188-aebf1fa8323e'
var config  = {
 "ID" : 
   {"title" : "Permit ID", "formatter" : "none"},
 "Date" : 
   {"title" : "Date", "formatter" : "date"},
 "Address" :
   {"title" : "Address", "formatter" : "address"},
 "Suite" :
   {"title" : "Suite", "formatter" : "proper"},
 "PermitType" :
   {"title" : "Permit Type", "formatter" : "proper"},
  "ConstructionCost" :
   {"title" : "Construction Cost", "formatter" : "Currency"}, 
  "OwnerName" :
   {"title" : "Owner", "formatter" : "proper"},
   "Contractor" :
   {"title" : "Contractor", "formatter" : "proper"}
}
var fields = $.map(config, function( val, key ){return '"' + key + '"'}).toString()

var dataset = getUrlParameter('type')
var idnum = getUrlParameter('ID')

$.ajax({
          url: '//www.civicdata.com/api/action/datastore_search_sql?sql=SELECT'  + fields + 'FROM"' + resource + '"WHERE"_id"=' + idnum,
          dataType: 'jsonp',
          success: function(data) {
          $.each(data.result.records, function(index, property){
          $('#record').html('<div id="content" class="col-md-4"><h1>' + AddressClean(property[titlefield]) + '</h1><h3>' + type + '</h3><ul class="infolist"></ul></div>'  )
          $.each(config, function(key, value){
          var item = ''
          if (value.formatter === 'clean'){item = AddressClean(property[key])}
	  else if (value.formatter === 'address'){item = AddressProper(property[key])}
          else if (value.formatter === 'date'){item = FormatDate(property[key])}
          else if (value.formatter === 'proper'){item = ProperCase(property[key])}
          else if (value.formatter === 'currency'){item = FormatCurrency(property[key])}
          else {item = property[key]}  
          $('.infolist').append('<li><b>' + value.title + ':</b> '+ item + '</li>')
          })
 	  $("#record").append('<div id="map" class="col-md-8"><iframe width="100%" height="300px" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/place?q=' + AddressClean(property[mapfield]) + ' Lexington KY United States &key=AIzaSyDXqhUx3ZQwPBtAVsXg6tz9N_2yvrRydcQ"></iframe></div>')
	  $('#record').append('<div id="meta" class="col-md-12">' + meta + '</div>')          
        
})
          }});
}

function getUrlParameter(sParam){
var sPageURL = window.location.search.substring(1);
var sURLVariables = sPageURL.split('&');
for (var i = 0; i < sURLVariables.length; i++) 
{
var sParameterName = sURLVariables[i].split('=');
if (sParameterName[0] == sParam) 
   {return sParameterName[1];}}}

function AddressClean(input){
var clean =  input.toLowerCase().replace(/#.*$/,'').replace(/\(.*$/,'').replace(/\(.*$/,'').replace(/\bmh\b.*$/,'').replace(/\b(exterior|interior|roof)\b.*$/,'').replace(/-[0-9]*(?=\s)/,'').trim();
return $.map(clean.toLowerCase().split(' '), function( v, i ) {
if (v.match(/\b(i|ii|iii|iv|v|vi|vii|viii|ix)\b/i) !== null){return v.toUpperCase();} 
else if (v.match(/\b(and|if|of)\b/i) !== null){return v.toLowerCase();} 
else {return v.replace(v.charAt(0),v.charAt(0).toUpperCase());}
}).join(" ")
}

function AddressProper(input){
var clean =  input.toLowerCase().trim();
return $.map(clean.toLowerCase().split(' '), function( v, i ) {
if (v.match(/\b(i|ii|iii|iv|v|vi|vii|viii|ix)\b/i) !== null){return v.toUpperCase();} 
else if (v.match(/\b(and|if|of)\b/i) !== null){return v.toLowerCase();} 
else {return v.replace(v.charAt(0),v.charAt(0).toUpperCase());}
}).join(" ")
}

function ProperCase (input) {
var bigwords = /\b(aka|llc|hvac|n\/c|^[b-df-hj-np-tv-z]{3,}|i|ii|iii|iv|v|vi|vii|viii|ix)\b/i;
var smallwords = /\b(an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|to|vs)\b/i;
return $.map(input.toLowerCase().split(' '), function( v, i ) {
if (v.match(bigwords) !== null){return v.toUpperCase();} 
else if (v.match(smallwords) !== null){return v.toLowerCase();} 
else {return v.replace(v.charAt(0),v.charAt(0).toUpperCase());}
}).join(" ")};

function FormatDate (input){
var year = input.split('-')[0];
var month = input.split('-')[1].replace(/^0/, '');
var day = input.split('-')[2].replace(/^0/, '');
return month + '/' + day + '/' + year;
};

function FormatCurrency (input){ 
if (input && $.isNumeric(input) === true) {
var rounded = Math.round(input)
return '$' + rounded.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
} else {return '$0'}};