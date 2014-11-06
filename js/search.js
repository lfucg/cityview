/*Created by Jonathan Hollinger, 2014. Use and modify freely at your own risk.*/

function search(){
var term = "'%" + document.getElementById("search").value.trim().toUpperCase() + "%'"
var params = {
    sql: 'SELECT "_id", "ID", "Date","Address", "Suite","PermitType", "ConstructionCost","OwnerName","Contractor" FROM "2691aff1-e555-48d3-9188-aebf1fa8323e" WHERE "Address" LIKE' + term + 'OR "Suite" LIKE' + term + 'OR "PermitType" LIKE' + term + 'OR "OwnerName" LIKE' + term + 'OR "Contractor" LIKE' + term + 'ORDER BY "Date" DESC LIMIT 25'};
  
$.ajax({
    url: '//www.civicdata.com/api/action/datastore_search_sql',
    data: params,
    dataType: 'jsonp',
    success: function(data) {
      
      $("#table").html('<table class="table table-striped"><thead><tr><th>Date</th><th>Address</th><th>Permit Type</th><th>Construction Cost</th><th>More Info</th><tr></thead><tbody id="tablebody"></tbody></table>');
      
      $.each(data.result.records, function(key, property){
      $("#tablebody").append('<tr><td>' + FormatDate(property.Date) + '</td><td>' + AddressClean(property.Address) + ' '+ ProperCase(property.Suite) + '</td><td>' + ProperCase(property.PermitType) + '</td><td>' + FormatCurrency(property.ConstructionCost) + '</td><td><a href="http://jmhollinger.github.io/info/details.html?type=permit&ID=' + property._id +'">View Permit</a></td></tr>')});     
    }
  });
};

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