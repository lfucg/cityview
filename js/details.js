/*Created by Jonathan Hollinger, 2014. Use and modify freely at your own risk.*/

function getDetails()
    {
    var dataset = getUrlParameter('type')
    var idnum = getUrlParameter('ID')

    if (dataset == 'permit') { 
      var fields = '"ID", "Date","Address","Suite","PermitType","ConstructionCost","OwnerName","Contractor"'
      var resource = '2691aff1-e555-48d3-9188-aebf1fa8323e'
      var params = {
          sql: 'SELECT' + fields + 'FROM"' + resource + '"WHERE"_id"=' + idnum};
      $.ajax({
          url: '//www.civicdata.com/api/action/datastore_search_sql',
          data: params,
          dataType: 'jsonp',
          success: function(data) {
          $.each(data.result.records, function(key, property){
          $("#title").html('<h1>' + AddressClean(property.Address) + '</h1><h3>Permit</h3>')
          $("#details").html('<ul class="permit"><li><b>Permit ID:</b> ' + property.ID + '</li><li><b>Date:</b> ' + FormatDate(property.Date) + '</li><li><b>Address:</b> ' + AddressProper(property.Address) + ' ' + ProperCase(property.Suite) + '</li>  <li><b>Permit Type:</b> ' + ProperCase(property.PermitType) + '</li><li><b>Construction Cost: </b>' + FormatCurrency(property.ConstructionCost) + '</li>  <li><b>Owner:</b> ' + ProperCase(property.OwnerName) + '</li><li><b>Contractor:</b> ' + ProperCase(property.Contractor) + '</li></ul><p>If you have questions or concerns about this building permit please contact the Division of Building Inspection at (859) 258-3770.</p><p>Addresses and  map locations are approximate.</p>')    
          $("#map").html('<iframe width="100%" height="300px" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/place?q=' + AddressClean(property.Address) + ' Lexington KY United States &key=AIzaSyDXqhUx3ZQwPBtAVsXg6tz9N_2yvrRydcQ"></iframe>')      
          });
          }
        })} 
    else if (dataset == 'code') { 
      var fields = '"CaseNo","DateOpened","Address","CaseType","Status","StatusDate","Closed"'
      var resource = 'ad346da7-ce88-4c77-a0e1-10ff09bb0622'
      var params = {
          sql: 'SELECT' + fields + 'FROM"' + resource + '"WHERE"_id"=' + idnum};
          $.ajax({
          url: '//www.civicdata.com/api/action/datastore_search_sql',
          data: params,
          dataType: 'jsonp',
          success: function(data) {
          $.each(data.result.records, function(key, property){
          $("#title").html('<h1>' + AddressClean(property.Address)+ '</h1><h3>Code Enforcement Case</h3>')
          $("#details").html('<ul class="permit"><li><b>Case No:</b> ' + property.CaseNo + '</li><li><b>Date Opened:</b> ' + FormatDate(property.DateOpened) + '</li><li><b>Address:</b> ' + AddressProper(property.Address) + '</li>  <li><b>Case Type:</b> ' + ProperCase(property.CaseType) + '</li><li><b>Status:</b> The status of this case was updated to ' + property.Status.toLowerCase() + ' on ' + FormatDate(property.StatusDate) + '.</li></ul><p>If you have questions or concerns about this code enforcement case please contact the Division of Code Enforcement at (859) 425-2255.</p><p>Addresses and  map locations are approximate.</p>')    
          $("#map").html('<iframe width="100%" height="300px" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/place?q=' + AddressClean(property.Address) + ' Lexington KY United States &key=AIzaSyDXqhUx3ZQwPBtAVsXg6tz9N_2yvrRydcQ"></iframe>')         
          });
          }
        })}
    else{
      $("#title").html('<h1>Uh Oh...</h1>');
      $("#details").html("<h3>The dataset you have selected does not exist.</h3>");
    }    
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