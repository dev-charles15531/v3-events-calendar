# v3-events-calendar

v3-events-calendar is a Vue 3 component for displaying calendar dates and events listings. It provides a customizable, easy-to-use interface for adding and managing events on a calendar.

## Installation

You can install the package using npm:

```bash
npm install v3-events-calendar
```

## Screenshots

Currently it is responsive on mobile and desktop screens.

### Desktop View

![](https://github.com/dev-charles15531/v3-events-calendar/blob/main/public/ss1.png)
![](https://github.com/dev-charles15531/v3-events-calendar/blob/main/public/ss2.png)
![](https://github.com/dev-charles15531/v3-events-calendar/blob/main/public/ss3.png)

### Mobile View

![](https://github.com/dev-charles15531/v3-events-calendar/blob/main/public/ss4.png)
![](https://github.com/dev-charles15531/v3-events-calendar/blob/main/public/ss5.png)
![](https://github.com/dev-charles15531/v3-events-calendar/blob/main/public/ss6.png)

## Usage

To use the component, import it and its styles into your Vue application:

```javascript
import V3EventsCalendar from "v3-events-calendar";
import "v3-events-calendar/dist/style.css";
```

### Basic Example

Here is a basic example of how to use the `V3EventsCalendar` component in your Vue application:

```vue
<template>
  <div>
    <V3EventsCalendar :events="events" primaryColor="teal" />
  </div>
</template>

<script setup>
import V3EventsCalendar from "v3-events-calendar";
import "v3-events-calendar/dist/style.css";
import { ref } from "vue";

const events = ref([
  {
    id: 1,
    url: "https://github.com/dev-charles15531",
    title: "Dummy Event Name 1",
    time: { start: "2023-01-01T12:00", end: "2023-01-01T14:00" },
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    image: "test-img.png",
    tags: "#fun #nightout #dance #veterantime",
    location: "At the base",
    background: "teal",
  },
  {
    id: 2,
    url: "https://github.com/dev-charles15531",
    title: "Dummy Event Name 2",
    time: { start: "2024-06-11T02:00", end: "2024-06-11T14:00" },
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    image: "test-img.png",
    tags: "#fun #nightout #dance #veterantime",
    location: "At the base",
  },
]);
</script>
```

### Props

| Prop              | Type    | Required | Default          | Description                                                        |
| ----------------- | ------- | -------- | ---------------- | ------------------------------------------------------------------ |
| `events`          | Array   | Yes      | -                | An array of event objects.                                         |
| `timezone`        | String  | No       | America/New_York | Timezone you want calendar to use                                  |
| `sundayStartWeek` | Boolean | No       | true             | If the calendar's first day of the week is Sunday or not.          |
| `primaryColor`    | String  | No       | indigo           | The primary color of the calendar. Must be one of the safe colors. |
| `showAddBtn`      | Boolean | No       | true             | Show the 'Add event' button                                        |

### Event Object Format

Each event object should have the following properties:

| Property      | Type   | Required | Description                                                                                           |
| ------------- | ------ | -------- | ----------------------------------------------------------------------------------------------------- |
| `id`          | Number | Yes      | Unique identifier for the event.                                                                      |
| `title`       | String | Yes      | The title of the event.                                                                               |
| `time`        | Object | Yes      | An object with `start` and `end` properties, representing the start and end times in ISO 8601 format. |
| `url`         | String | No       | A URL associated with the event.                                                                      |
| `description` | String | No       | A description of the event.                                                                           |
| `image`       | String | No       | An image associated with the event.                                                                   |
| `tags`        | String | No       | Tags associated with the event.                                                                       |
| `location`    | String | No       | The location of the event.                                                                            |
| `background`  | String | No       | The background color for the event. Must be one of the safe colors.                                   |

### Safe Colors

The safe colors available for use are:

- `rose`
- `pink`
- `fuchsia`
- `purple`
- `violet`
- `blue`
- `indigo`
- `cyan`
- `teal`
- `emerald`
- `lime`
- `yellow`
- `orange`
- `red`
- `gray`

## Contributing

We welcome contributions to the `v3-events-calendar` package! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch with your feature or bugfix.
3. Commit your changes.
4. Push the branch to your fork.
5. Open a Pull Request.

Please ensure your code follows our coding standards and includes appropriate tests.

## Reporting Issues

If you encounter any issues, please open an issue on our [GitHub Issues page](https://github.com/dev-charles15531/v3-events-calendar/issues). Provide as much detail as possible, including steps to reproduce the issue and any relevant logs or screenshots.

## Built With

- [Vue 3](https://vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Floating UI](https://floating-ui.com/)
- [Vue Datepicker](https://vue3datepicker.com/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

Special thanks to all open-source projects that made this package possible.

---

Thank you for using `v3-events-calendar`! If you have any questions or feedback, please don't hesitate to reach out.
