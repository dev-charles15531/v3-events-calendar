import V3EventsCalendar from "./components/V3EventsCalendar.vue";

export default {
    install: (app, options) => {
        app.component("V3EventsCalendar", V3EventsCalendar);
    }
}