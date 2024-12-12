<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["forum"]);
const title = ref(props.forum.title);
const description = ref(props.forum.description);

const emit = defineEmits(["editForum", "refreshForums"]);

const editForum = async () => {
  try {
    await fetchy(`/api/forums/${props.forum._id}/${props.forum.title}`, "PATCH", {
      body: {
        title: title.value,
        description: description.value,
      },
    });
  } catch (e) {
    return;
  }
  emit("editForum");
  emit("refreshForums");
};
</script>

<template>
  <form @submit.prevent="editForum">
    <p class="author">{{ props.forum.author }}</p>
    <textarea id="title" v-model="title" placeholder="Edit title..." required></textarea>
    <textarea id="description" v-model="description" placeholder="Edit description..." required></textarea>

    <div class="base">
      <menu>
        <li>
          <button class="btn-small pure-button-primary pure-button" type="submit">Save</button>
        </li>
        <li>
          <button class="btn-small pure-button" @click="emit('editForum')">Cancel</button>
        </li>
      </menu>
      <p v-if="props.forum.dateCreated !== props.forum.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.forum.dateUpdated) }}</p>
      <p v-else class="timestamp">Created on: {{ formatDate(props.forum.dateCreated) }}</p>
    </div>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  border-radius: 4px;
  resize: none;
}

p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}
</style>
