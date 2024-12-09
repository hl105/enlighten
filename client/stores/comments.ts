import { defineStore } from "pinia";

export const useCommentStore = defineStore("commentStore", {
  state: () => ({
    comments: [] as Array<Record<string, any>>, // All fetched comments
  }),
  actions: {
    // Fetch comments from the backend for specific forum
    async fetchComments(forumId: string, forumTitle: string) {
      try {
        const response = await fetch(`/api/forums/comments/${forumId}/${forumTitle}`);
        const data = await response.json();
        this.comments = data;
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    },
  },
});
