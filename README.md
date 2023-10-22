# Weather App

## Brief Description

**Weather App** is a Vue.js front-end application that provides a user-friendly interface for weather forecasts. It retrieves weather data from OpenWeatherMap and relevant city photos from Unsplash via a REST API implemented with Node.js and Express.js. Key features include global state management with Pinia for language and city selection, basic internationalisation between English and French, and a dark mode implemented using Vue use composables.

Vue 3.0, Composition API, and modern libraries were used throughout.
## Table of Contents

- [Installation](#installation)
- [Features](#features)

## Installation

**Weather App** is built using Vite, a build tool for Vue applications. To get started, follow these installation steps (note that the [backend server](https://github.com/lukerabbitte/weather_app_backend) will have to be active on another local port for this to work):

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/weather-app.git
2. Change into the project directory:
    ```bash
    cd weather-app
3. Install dependencies using npm or yarn:
    ```bash
    npm install
    # or
    yarn
4. Start the development server:
    ```bash
    npm run dev
    # or
    yarn dev
5. Open browser and visit the URL provided by localhost

## Features

- User-Friendly Interface: Weather App offers an intuitive and visually appealing interface, making it easy for users to access weather data. Color schemes can be changed painlessly via CSS variables.

- API Integration: It retrieves accurate weather data from OpenWeatherMap and topical city photos from Unsplash via a REST API.

- Global State Management: Utilizes Pinia for global state management, such as allowing users to select their preferred language.

- Dark Mode: Implements persistent dark mode support that first reads from system preferences, then saves session state locally.

- Extensibility: Weather App can be extended, with the potential for future enhancements such as integrating Wikipedia or OpenStreetMap APIs or adding richer graphs.

