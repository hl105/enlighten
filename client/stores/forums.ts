import { defineStore } from "pinia";

export const useForumStore = defineStore("forumStore", {
  state: () => ({
    forums: [] as Array<Record<string, any>>, // All fetched forums
    filteredForums: [] as Array<Record<string, any>>, // Forums after filtering
  }),
  actions: {
    // Fetch all forums from the backend
    async fetchForums() {
      try {
        const response = await fetch("/api/forums");
        const data = await response.json();
        this.forums = data;
        this.filteredForums = data; // Initially, all forums are shown
      } catch (error) {
        console.error("Error fetching forums:", error);
      }
    },
    // Filter forums based on search criteria
    filterForums({ author, title }: { author?: string; title?: string }) {
      let filtered = [...this.forums];

      // Filter by author
      if (author && author.trim() !== "") {
        filtered = filtered.filter((forum) => forum.author === author.trim());
      }

      // Filter by title
      if (title && title.trim() !== "") {
        filtered = filtered.filter((forum) => forum.title === title.trim());
      }

      this.filteredForums = filtered;
    },
  },
});
