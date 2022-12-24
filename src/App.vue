<script setup>
import { ref } from "vue";
import Calendar from "./components/Calendar.vue";

// all events data
const events = ref([
  {
    id: 1,
    uri: "event uri",
    title: "Event Name 1",
    time: { start: "2022-12-16 12:05", end: "2022-05-16 13:35" },
    description:
      "lorem ygwgi ehuxhuhwe weggesgi hxisggxwg7hwehuhew whgdhuwdhuxh ewu hg7exhguwgxtx xtwxtx xfty xwqfx xxf x  x ",
  },
  {
    id: "2",
    title: "Event Name 2 jyjj jjuiomnhj uj",
    time: { start: "2022-12-26 12:05", end: "2022-05-16 13:35" },
    color: "yellow",
    isEditable: true,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores assumenda corporis doloremque et expedita molestias necessitatibus quam quas temporibus veritatis. Deserunt excepturi illum nobis perferendis praesentium repudiandae saepe sapiente voluptatem!",
  },
  {
    id: "3",
    title: "Event Name 3",
    time: { start: "2022-12-26 12:05", end: "2022-05-16 13:35" },
    color: "yellow",
    isEditable: true,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores assumenda corporis doloremque et expedita molestias necessitatibus quam quas temporibus veritatis. Deserunt excepturi illum nobis perferendis praesentium repudiandae saepe sapiente voluptatem!",
  },
  {
    id: "4",
    title: "Event Name 4",
    time: { start: "2022-12-26 12:05", end: "2022-05-16 13:35" },
    color: "yellow",
    isEditable: true,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores assumenda corporis doloremque et expedita molestias necessitatibus quam quas temporibus veritatis. Deserunt excepturi illum nobis perferendis praesentium repudiandae saepe sapiente voluptatem!",
  },
  {
    id: "5",
    title: "Event Name 5",
    time: { start: "2022-12-26 12:05", end: "2022-05-16 13:35" },
    color: "yellow",
    isEditable: true,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores assumenda corporis doloremque et expedita molestias necessitatibus quam quas temporibus veritatis. Deserunt excepturi illum nobis perferendis praesentium repudiandae saepe sapiente voluptatem!",
  },
  {
    id: "6",
    title: "Event Name 6",
    time: { start: "2022-12-06 12:05", end: "2022-05-16 13:35" },
    color: "yellow",
    isEditable: true,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores assumenda corporis doloremque et expedita molestias necessitatibus quam quas temporibus veritatis. Deserunt excepturi illum nobis perferendis praesentium repudiandae saepe sapiente voluptatem!",
  },
  {
    id: "7",
    title: "Event Name 7",
    time: { start: "2022-12-16 12:05", end: "2022-05-16 13:35" },
    color: "yellow",
    isEditable: true,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores assumenda corporis doloremque et expedita molestias necessitatibus quam quas temporibus veritatis. Deserunt excepturi illum nobis perferendis praesentium repudiandae saepe sapiente voluptatem!",
  },
  {
    id: "8",
    title: "Event Name 8",
    time: { start: "2022-12-16 12:05", end: "2022-05-16 13:35" },
    color: "yellow",
    isEditable: true,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores assumenda corporis doloremque et expedita molestias necessitatibus quam quas temporibus veritatis. Deserunt excepturi illum nobis perferendis praesentium repudiandae saepe sapiente voluptatem!",
  },
]);
</script>

<template>
  <div class="h-full w-full flex items-center justify-center">
    <div class="w-full h-full">
      <div class="w-full">
        <h3 class="w-full text-lg text-center font-extrabold text-green-400">
          Hello Vue + tailwind
        </h3>
      </div>

      <div class="w-full mt-5 px-4">
        <Calendar :events="events">
          <template #eventDialog="props">
            <div
              v-if="props.eventDialogData && props.eventDialogData.title"
              class="p-4 flex justify-center bg-[#1A202C] rounded-md"
            >
              <div>
                <div
                  class="text-sm md:text-base font-bold text-gray-200 text-center"
                >
                  {{ props.eventDialogData.title }}
                </div>

                <div class="mt-5">
                  <div class="text-xs text-gray-300 space-y-2">
                    <!-- your time -->
                    <h6 class="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span
                        ><span class="font-medium">Your Time: </span
                        >{{ props.eventDialogData.time.start }}
                      </span>
                    </h6>

                    <!-- their time -->
                    <h6 class="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span
                        ><span class="font-medium">Their Time: </span
                        >{{ props.eventDialogData.time.start }}
                      </span>
                    </h6>

                    <!-- tags -->
                    <h6 class="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6 6h.008v.008H6V6z"
                        />
                      </svg>
                      <span class="font-medium italic"
                        >{{ props.eventDialogData.tags }}
                      </span>
                    </h6>

                    <!-- blockchain -->
                    <h6 class="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                        />
                      </svg>

                      <span class="font-medium uppercase"
                        >{{ props.eventDialogData.blockchain }}
                      </span>
                    </h6>
                  </div>

                  <div
                    v-if="props.eventDialogData.image != null"
                    class="w-full flex justify-center mt-5"
                  >
                    <img
                      :src="
                        assetUrl +
                        '/project-event-images/' +
                        props.eventDialogData.image
                      "
                      alt="launch image"
                      class="rounded-full h-36 w-36"
                    />
                  </div>

                  <div class="w-full text-xs font-medium text-gray-300 mt-5">
                    {{ props.eventDialogData.description }}
                  </div>

                  <div class="w-full flex justify-center mt-6">
                    <div class="w-full flex items-center justify-between">
                      <button
                        class="close-flyout flex items-center space-x-2 bg-gray-400 py-1 px-3 text-xs hover:text-sm rounded-md text-gray-700 transition-all"
                        @click="props.closeEventDialog"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="w-6 h-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        <span>close</span>
                      </button>
                      <a
                        :href="'/calendar/launch/'"
                        class="bg-purple-600 rounded-md py-1 md:py-2 px-5 hover:px-6 shadow-md hover:bg-purple-700 transition-all"
                      >
                        <span class="text-xs md:text-sm font-medium text-white"
                          >See more</span
                        >
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <!-- <button class="close-flyout" @click="props.closeEventDialog">
          Finished!
        </button> -->
            </div>
          </template>
        </Calendar>
      </div>
    </div>
  </div>
</template>
