// import PageCache table from schemas.graphql
const { PageCache } = tables;
import fs from 'fs';     // File system module to read the file
import yaml from 'js-yaml'; // YAML parser

// Load and parse the YAML file manually
const config = yaml.load(fs.readFileSync('./config.yaml', 'utf8'));



// ***********EXAMPLE IMPLEMENTATION OF HTML-ONLY CACHE RETURN************

// This is usefule if you are caching pages at scale and want to reduce the response payload

/* 

export class ExamplePageCache extends PageCache {
  
  // Method to return only the cached HTML string
  get() {
	try {
	  // Assuming `this.cachedData` contains the cached HTML string
	  if (this.cachedData) {
		return this.cachedData;
	  } else {
		throw new Error("No cached data found.");
	  }
	} catch (error) {
	  console.error("ERROR fetching cached HTML:", error);
	  return "Error fetching cached HTML";
	}
  }
}

*/

/********************************************************************************************************** */

// ***********EXAMPLE IMPLEMENTATION OF PAGE CACHE************ //

/*
	  Usage Instructions:
  
	  1. define the cache ID. (The ID is set using HarperDB REST handler):
	  	You can access the cache from the browser using the following URL: http://localhost:9926/PageCache/<cacheId>
	  2. Customize `pageURL` based on where the page is hosted.

	  Example: 
	  - The returned `cachedData` will contain the HTML as a string.
  */

// A class used to update the cache for a specific page
export class PageCacheResource extends PageCache {
  // Invalidate the cache if necessary
  invalidate() {
    super.invalidate();
  }

  // Fetch the page and update the cache
  async get() {
    
    // Extract the origin URL
    const origin = config.origin.url;

    const path  = "/"; // URL path of the page to cache

    const response = await fetch(`${origin}${path}`); // Fetch the page content

    /**
     * To save response as binary data, use response.bytes() instead of response.text()
     *
     * Example:
     * const byteArray = await response.bytes();
     *  return {cachedData: byteArray};
     * Set cachedData type in schemas.graphql to Bytes
     */

    //convert html to string
    const convertHtmlTextToStr = await response.text();

    //Return the cached data in a structured format
    return { cachedData: convertHtmlTextToStr };
  }
}

PageCache.sourcedFrom(PageCacheResource);
