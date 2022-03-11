#SVGchart.js#

SVG chart is a javascript library broadly intended to reproduce the functionality of (initially just the pie and donut charts of) Google's javascript chart library. The intention is to add extra features such as the ability to specify segment colours (might already exist?) and easily add text labels to the hole in a donut chart (why else have a hole?)

#Internals of the js#

A new SVGchart object is created when two arguments are sent to the constructor:

`myChart = new SVGchart(target, size);` 

`target` is a string equivalent to the ID attribute of the *existing* html element into which the chart will be rendered. For example, a division with a unique ID might exist on the page:

`<div id="chart-container" class="chart"></div>`

the corresponding call to create a new chart would be:

`myChart = new SVGchart("chart-container", <size>);`

the `size` parameter is a number indicating the nominal pixel *diameter* of the pie chart.  The size of the rendered chart can be defined using css as needed. (this parameter might become obsolete later)

##Constructor Function##

The SVGchart constructor sets internal variable values (such as width and height from the size argument). It also attempts to reference the intended html target into which the svg chart will be rendered, assigning the html object with the specified ID to a property named `target`. 

The constructor delegates two other functions to methods that, respectively, the target element exists (`.parentExists`), and create a unique ID for later use in referencing the created SVG element(`createUniqueID`).

###parentExists Method###
The existence of a valid element ID argument in the call to the class constructor is tested and a message sent to the console indicating success (or that no element with that ID could be found). The test and messaging is delegated to the `parentExists` method of the class, which takes a single argument (the id, purely for reporting purposes). 

The `parentExists` method checks whether the `target` variable set in the constructor by a call to the `getELementByID` method of the document (to hold the html element object referenced by the ID) references a valid, existing, html object.

A console message reports that the element was found and referenced correctly or warns that no element with that ID was found.

(a custom error may be added later).

###createUniqueID Method### 
The value of the variable `ID` created in the constructor is set by a call to the `createUniqueID` method. This method returns a unique string of (currently) eight alpha-numeric characters. 

The method uses an epoch time stamp as a unique starting point. By converting the number resulting from a call to `Date().getTime()` to a radix 36 string, a unique, shorter, alpha-numeric string is produced. As of March 2022, the resulting ID is eight characters long. Rough calculations suggest it will not grow to ten or more characters long until at least 1,000 years from now. The ID might create string that begin with a digit but such strings are valid for element ID attribute values in html 5. The ID should always be differenet to any generated before.

##The draw Method##

The draw method will be called after the object is created. It will handle passed parameters and execute further methods to convert them into the required chart and render it to the page.
