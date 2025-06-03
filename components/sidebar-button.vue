<script lang="ts" setup>
import type { RouteLocationRaw } from "vue-router";

const props = defineProps<{
  label: string;
  icon: string;
  href?: string;
  to?: RouteLocationRaw;
  showLabel: boolean;
  iconColor?: "text-accent" | "text-primary" | "text-secondary";
}>();
const route = useRoute();
</script>

<template>
  <div class="flex" :data-tip="showLabel ? undefined : props.label" :class="{ 'tooltip tooltip-right': !props.showLabel }">
    <NuxtLink :class="{ 'bg-blue-300': route.path === props.href, 'justify-center': !props.showLabel, 'justify-start': props.showLabel }" :to="props.href || props.to" class="btn flex-1 flex-nowrap gap-2 p-2 hover:bg-base-400 hover:cursor-pointer">
      <Icon :name="props.icon" size="24" :class="iconColor" />
      <Transition name="grow">
        <span v-if="props.showLabel">{{ props.label }}</span>
      </Transition>
    </NuxtLink>
  </div>
</template>

<style scoped>
/* we will explain what these classes do next! */
.grow-enter-active {
  animation: grow 0.2s ease-out;
}
.grow-leave-active {
  animation: grow 0.2s ease-out reverse;
}

@keyframes grow {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
