# Forevery Flyer Influencers Map
----
A section of Philippine Airline's Forever Flyer site.

https://foreverflyer.philippineairlines.com

## Development

This projects uses [LiquidJS](https://liquidjs.com/) for the layout 
and [PostCSS](https://postcss.org/) to build stylesheets.

Install project dependencies first by running `npm install`.

### Project structure

The **`src`** folder contains all the source files for the project including
dynamic data and configuration inside the **`src/data`** folder.

The **`build`** folder contains the final files ready to be uploaded to a static server.
While the **`publish`** folder contains the code to be imported in a site builder.

Static assets can be stored inside the **`build/assets`** directory
and accessible under the URL path **`/assets/`** (on self-hosted servers only).

### Configuration

Before building or publishing, make sure that you set the proper configuration
inside the **`src/data/config.yml`** file. 

For use with a site builder, set the proper overrides in the **`src/data/production.yml`** file.
To override influencer properties, set them under the property with influencer's instagram username as key.
See example snippet below.

```yaml
influencers:
  mari.explores:
	# This will override this influencers photo
    photo: https://pal.wideoutplusdev.com/wp-content/uploads/2021/12/dp-mari.explores.jpg
	# This will override this influencers polaroid photo
    polaroid:
      image: https://pal.wideoutplusdev.com/wp-content/uploads/2021/12/polaroid-mari.explores.png
```

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

Run the command `npm run build` to build files to deploy to your server.

Run the command `npm run publish` to build files to be used on a site builder.
