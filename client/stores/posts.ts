import { defineStore } from "pinia";

export const usePostStore = defineStore("postStore", {
  state: () => ({
    posts: [] as Array<Record<string, any>>, // All fetched posts
    filteredPosts: [] as Array<Record<string, any>>, // Posts after filtering
  }),
  actions: {
    // Fetch all posts from the backend
    async fetchPosts() {
      try {
        const response = await fetch("/api/posts");
        const data = await response.json();
        this.posts = data;
        this.filteredPosts = data; // Initially, all posts are shown
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    },
    // Filter posts based on search criteria
    filterPosts({ author, location, hashtags }: { author?: string; location?: string; hashtags?: string }) {
      let filtered = [...this.posts];

      // Filter by author
      if (author && author.trim() !== "") {
        filtered = filtered.filter((post) => post.author === author.trim());
      }

      // Filter by location
      if (location && location.trim() !== "") {
        const [x, y] = location.split(",").map((coord) => parseFloat(coord.trim()));
        if (!isNaN(x) && !isNaN(y)) {
          // Assuming posts have a `location` property with `coordinates` as [x, y]
          filtered = filtered.filter((post) => {
            if (post.location && post.location.coordinates) {
              const [postX, postY] = post.location.coordinates;
              const distance = Math.sqrt(Math.pow(postX - x, 2) + Math.pow(postY - y, 2));
              return distance <= 20; // Example: Filter posts within 20 units
            }
            return false;
          });
        }
      }

      // Filter by hashtags
      if (hashtags && hashtags.trim() !== "") {
        const hashtagsArray = hashtags.split(",").map((tag) => tag.trim());
        filtered = filtered.filter((post) => hashtagsArray.some((tag) => post.hashtag && post.hashtag.includes(tag)));
      }

      this.filteredPosts = filtered;
    },
  },
});
