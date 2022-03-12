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

The constructor delegates two other functions to methods that, respectively, checks that the target element exists (`.parentExists`), and creates a unique ID for later use in referencing the new SVG element(`createUniqueID`).

###parentExists Method###
The existence of a valid element ID argument in the call to the class constructor is tested and a message sent to the console indicating success (or that no element with that ID could be found). The test and messaging is delegated to the `parentExists` method of the class, which takes a single argument (the ID used to create the object in the call to the constructor). 

The `parentExists` method checks whether the `target` variable set in the constructor by a call to the `getELementByID` method of the document (to hold the html element object referenced by the ID) references a valid, existing, html object.

A console message reports that the element was found and referenced correctly or warns that no element with that ID was found in the html document from which the constructer call was made.

(a custom error may be added later).

###createUniqueID Method### 
The value of the variable `ID` created in the constructor (not the ID used to reference the target element) is set by a call to the `createUniqueID` method. This method returns a unique string of (currently) eight alpha-numeric characters. 

The method uses an epoch time stamp as a unique starting point. By converting the number resulting from a call to `Date().getTime()` to a radix 36 string, a unique, shorter, alpha-numeric string is produced. As of March 2022, the resulting ID is eight characters long. Rough calculations suggest it will not grow to ten or more characters long until at least 1,000 years from now. The ID might create a string that begin with a digit but such strings are valid for element ID attribute values in html 5. The ID should always be different to any generated before.

##The draw Method##

The draw method will be called by the user after the object is created and parameters (which will form arguments to the draw call) are set in the calling script. `draw()` will execute sequential methods to render a chart according to the passed arguments.

###data Argument of draw Method###

The first argument of the `draw` method is a data array defined by the user with their specific data. The data array must conform to the rigid structure of being a two dimensional array akin to a .csv table. Element 0 is an array holding strings for the category and value labels (for example `["category","cost"]`). Each subsequent element is an array with corresponding data pairs as follows:

```
  const data = [
    ["category", "cost"],
    ["rent", 500],
    ["local taxes", 100],
    ["media subs", 70],
    ["heating", 90],
    ["electricity", 68],
    ["food", 200],
    ["transport", 190],
    ["other", 230]
   ];
```

###Methods Applied to the data Array###
On receipt of the `data` array, the `draw` method sequentially passes a reference to the array to several helper methods, each with a defined task, listed below.

 - ####setDataLabels(data)####
Global variables `categoryLabel` and `valueLabel` are assigned values extracted from the first element of the data array. Element [0] (the header) is removed from the array, leaving just paired data. **note** Element [0] of the data array will be removed from the data array regardless of whether it contained header information or not. The remaining data will be plotted as normal but will result in the first intended data pair being absent from the chart, if the no header was included in the data array argument.

 - ####setValueTotal(data)####
Global variable `valueTotal` is calculated by summing the second element of all the inner arrays. The data array is unchanged by this operations.

 - ####appendAngularProportions(data)####
Each inner array of the data array is appended with a new element containing a radian value equivalent to a circle arc fraction equivalent to the fraction of the original value to the total. 

###preferences Argument of draw Method###

The second argument of the `draw` method is an object defined by the user with their preference data. All items are optional and they can be placed in any order. Key names must match those available, which user notes should specify and define. E.g.:

```
title: "quotted string"
sort: number (0,1,-1 specifying no sort, sort asscending, sort descending for the data)
degreesOffsetFromTop: (number 0 to +/- 360, where the first slice starts on chart)
(add here as new features developed)
```
**note** The degrees offset set by the user is relative to the top of the pie chart (i.e. the 12 o'clock position, and not the x-axis (3 o'clock) as sometimes used. 

Each item must be separated by comma, with no trailing comma. 

####parsePrefs Method ####
The draw method delegates parsing of the user preferences to the helper method `parsePrefs`. A series of ternary operator conditionals scans the passed `prefs` object for expected keys and assigns their values to the relevant global properties initialised by the `constructor` method.

In the case of the `degreesOffsetFromTop` preference, `parsePrefs` processes the passed value to finally assign a radian value relative to the x-axis rather than the top. The default value, assigned to the global `startOffset` if 0 or no value is passed by the user, is -Pi/2 radians (the top of the chart). The assignment statement also takes care of out of range and negative values by applying remainder division by 2Pi after converting the passed degrees to radians and subtracting the quarter circle. 
