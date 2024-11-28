<script setup lang="ts">
import router from "@/router";
import { defineProps } from "vue";

const props = defineProps(["earned", "started"]);

const goToProfile = async () => {
  await router.push({ name: "Profile" });
};
</script>

<template>
  <div v-if="props.earned === 'updated' || props.started === 'start new badge'" class="popup-overlay">
    <div class="popup-container">
      <h2>
        <!-- earned/started status -->
        <span v-if="props.earned === 'updated'">Badge Progress Updated!</span>
        <span v-else-if="props.earned === 'created'">New Badge Unlocked!</span>
        <span v-else-if="props.started === 'start new badge'">You've Started a New Badge!</span>
      </h2>
      <p>
        <!-- Description -->
        <span v-if="props.earned === 'updated'"> Your badge progress has been successfully updated. </span>
        <span v-else-if="props.earned === 'created'"> Congratulations! You've unlocked a brand new badge. </span>
        <span v-else-if="props.started === 'start new badge'"> You've begun earning progress for a new badge! </span>
      </p>
      <!-- profile page button -->
      <button class="profile-button" @click="goToProfile">Go to Profile</button>
    </div>
  </div>
</template>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-container {
  background: #fff;
  border-radius: 10px;
  padding: 2rem;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-in-out;
}

.popup-container h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #063970;
}

.popup-container p {
  font-size: 1rem;
  margin-bottom: 1.5rem;
  color: #333;
}

.profile-button {
  background: #063970;
  color: #fff;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.profile-button:hover {
  background: #052850;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
