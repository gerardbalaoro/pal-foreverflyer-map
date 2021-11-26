# Forevery Flyer Influencers Map
----
A section of Philippine Airline's Forever Flyer site.

https://foreverflyer.philippineairlines.com

## Development

This projects uses [LiquidJS](https://liquidjs.com/) for the layout 
and [PostCSS](https://postcss.org/) to build stylesheets.

Install project dependencies by running `npm install`.

Static assets can be stored inside the **`build/assets`** directory
and accessible under the URL path **`/assets/`**.

### Adding and updating influencers

To add a new influencer, create a new file with the name **`[number]_[influencer-name].yml`** 
(the number prefix is for the ordering on mobile and table screens) inside the **`src/influencers`**. 
To update an existing influencer, open and modify the file with the matching name.

The **`.yml`** files follow the YAML data structure and have property names followed 
by a semicolon then the value. Values can be text or number 
(text that contain special characters should be wraped inside quotation marks).

Nested values are indented (indentation is equivalent to 2 spaces). 
Make sure to use consistent indentation in the whole file.

## Building

Run the command `npm run build` to build fresh 
`index.html` and `style.css` from the source.

