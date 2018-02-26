# JavaScript Style Guide

This documentation consist of style rulings for the team to abide by while developing with JavaScript (JS). As practices and the site changes, this document will be updated as needed.

**Change log:**
 - 02/22/2018: Initial document written

## Outline of the script
Each JS file should be outlined in the following manner.

 1. **Global variables:** Any variables that are needed for multiple functions in a global scope should be denoted at the beginning of the file.  
	> All variables should be initialized, as to denote their object type and never mistaken for *undentified* or *null*.
2. **Main function:** Whether using JQuery or general JavaScript, the main function (if needed) should be next set of code written.
	> There should only be one main function. If multiple types of functions are needed when the file is loaded, they should be divided into different global functions and called from the main function. 
3. **Action handler functions:** Any functions that have user input should be the next set of code written.
4. **Helper functions:** All other sets of functions should be the last set of code written within a JS file. 
	> This will also include any functions that are called from the action handler functions. 

## Functional rules
These are general best practice rules for our team to abide by, whether it be for cleanliness of code or better functional purposes.

 - **No inline functions:** Inline functions are pieces of code that are written within a callback function or nested functions. Examples are given below.

*Inline function*
```
function addition( value1, value2 ) {
	$.ajax( {
		url: "https://www.math.com/add",
		data: { arg1: value1, arg2: value2 }
	})
	    .done(function( response ) {
		    console.log("Answer: " + response.answer); 
	});
};
```

*Updated functions*
```
function addition( value1, value2 ) {
	$.ajax( {
		url: "https://www.math.com/add",
		data: { arg1: value1, arg2: value2 }
	})
	    .done( displaySum );
};

function displaySum( response ) {
	console.log("Answer: " + response.answer);
};
```
Inline functions are visually tedious and can be difficult to test if we ever begin using unit test.  


  
    

     
 	       	   
  

   

 

