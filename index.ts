import { AssetCache } from "@11ty/eleventy-fetch";
import type { Item } from "feedbin-stars";
import getStarredFeed from "feedbin-stars";

interface Options {
  feed_id?: string;
  cache_duration?: string;
}

export default function feedbinStarsPlugin(eleventyConfig, options: Options) {
  if (typeof options.feed_id !== "string") {
    throw new Error("eleventy-plugin-feedbin-stars requires a feed_id");
  }

  let items: Item[];
  let asset = new AssetCache("feedbin-" + options.feed_id);
  if (asset.isCacheValid(options.cache_duration || "4h")) {
    items = asset.getCachedValue();
  }

  eleventyConfig.addCollection("feedbinStars", async function () {
    if (!items) {
      items = await getStarredFeed(options.feed_id);
      await asset.save(items, "json");
    }
    return items;
  });
}
