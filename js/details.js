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
          
          $("#title").html('<h1>' + property.Address.Clean() + '</h1><h3>Permit</h3>')
          
          $("#details").html('<ul class="permit"><li><b>Permit ID:</b> ' + property.ID + '</li><li><b>Date:</b> ' + property.Date.FormatDate('/') + '</li><li><b>Address:</b> ' + property.Address.ProperCase(0) + ' ' + property.Suite.ProperCase(0) + '</li>  <li><b>Permit Type:</b> ' + property.PermitType.ProperCase(0) + '</li><li><b>Construction Cost: </b>' + CurrencyFormat(property.ConstructionCost) + '</li>  <li><b>Owner:</b> ' + property.OwnerName.ProperCase(1) + '</li><li><b>Contractor:</b> ' + property.Contractor.ProperCase(1) + '</li></ul><p>If you have questions or concerns about this building permit please contact the Division of Building Inspection at (859) 258-3770.</p><p>Addresses and  map locations are approximate.</p>')    
          
          $("#map").html('<iframe width="100%" height="300px" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/place?q=' + property.Address.Clean() + ' Lexington KY United States &key=AIzaSyDXqhUx3ZQwPBtAVsXg6tz9N_2yvrRydcQ"></iframe>')
                   
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
          
          $("#title").html('<h1>' + property.Address.Clean()+ '</h1><h3>Code Enforcement Case</h3>')
          
          $("#details").html('<ul class="permit"><li><b>Case No:</b> ' + property.CaseNo + '</li><li><b>Date Opened:</b> ' + property.DateOpened.FormatDate('/') + '</li><li><b>Address:</b> ' + property.Address.ProperCase(0) + '</li>  <li><b>Case Type:</b> ' + property.CaseType.ProperCase(1) + '</li><li><b>Status:</b> The status of this case was updated to ' + property.Status.toLowerCase() + ' on ' + property.StatusDate.FormatDate('/') + '.</li></ul><p>If you have questions or concerns about this code enforcement case please contact the Division of Code Enforcement at (859) 425-2255.</p><p>Addresses and  map locations are approximate.</p>')    
          
          $("#map").html('<iframe width="100%" height="300px" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/place?q=' + property.Address.Clean() + ' Lexington KY United States &key=AIzaSyDXqhUx3ZQwPBtAVsXg6tz9N_2yvrRydcQ"></iframe>')
                   
          });
          }
        })}
    else{}    
    }

function getUrlParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}

function CurrencyFormat (number){
if (number) {
var rounded = Math.round(number) 
return '$' + rounded.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
else {return '$0'}  
};

String.prototype.ProperCase = function(mode) {
if (mode === 0) {var bigwords = /\b(llc|hvac|n\/c|i|ii|iii|iv|v|vi|vii|viii|ix)\b/i;}  
else {var bigwords = /\b(llc|hvac|n\/c|[b-df-hj-np-tv-z]+|i|ii|iii|iv|v|vi|vii|viii|ix)\b/i;}
var smallwords = /\b(and|if|of)\b/i;
var abbrev = /\b()\b/i;
var result = '';
var oldstring = this.toLowerCase().split(' '); 
var newstring = $.map(oldstring, function( v, i ) {
if (v.match(bigwords) !== null){
result = v.toUpperCase();   
} 
else if (v.match(smallwords) !== null){
result = v.toLowerCase();
} 
else {result = v.replace(v.charAt(0),v.charAt(0).toUpperCase());
}
return(result);
});
return newstring.join(" ");
};

String.prototype.Clean = function Clean(){
return this.toLowerCase().replace(/#.*$/,'').replace(/\(.*$/,'').replace(/\(.*$/,'').replace(/\bmh\b.*$/,'').replace(/\b(exterior|interior|roof)\b.*$/,'').replace(/-[0-9]*(?=\s)/,'').trim().ProperCase(0);
    }

String.prototype.FormatDate = function FormatDate(separator){
var year = this.split('-')[0];
var month = this.split('-')[1].replace(/^0/, '');
var day = this.split('-')[2].replace(/^0/, '');
return month + separator + day + separator + year;
};
