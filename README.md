# teamwork-swapi

## [Project Setup](#setup)

## [Task Solution](#solution)

### <a name="setup">Project setup</a>

```
npm install
```

#### Compiles and hot-reloads for development

```
npm run serve
```

#### Compiles and minifies for production

```
npm run build
```

#### Lints and fixes files

```
npm run lint
```

#### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## <a name="solution">Task Solution</a>

### Requirements

-   [x] Create a one-page application with a list of people and the details about their related home planet.
-   [x] List of people and information related to a planet can be accessed from the swapi API
-   [x] Implement a table that contains a list of users with: Name, Height, Mass, Created, Edited, Planet Name
-   [x] When the user clicks on the planet name link a popup is displayed
-   [x] Popup should show information regarding the planet (Name, Diameter, Climate, Population)
-   [x] User should be able to sort the table by each column
-   [x] User should be able to filter by searching a person's name
-   [x] Implement pagination for handling list of people

### Nice to have

-   [x] Some form of caching to make API calls less "spammy"

### Implementation

I have created the one-page application using VueJS and all API calls are performed using the Axios library.
State management is done with Vuex and I have implemented this in such a way to minimise the number of API calls required.
Since the API does not have an option to retrieve all People in a single call, and only in pages of 10 people, I've stored each "paged" response in Vuex as they are requested.
When the user clicks the "Prev" or "Next" buttons, the application will check for the existance of the appropriate paged response in Vuex before sending an API request.

When Person responses are retrieved there is also a check on the individual Person "homeworld", which is the API URL of their home planet.
The application checks to see if the planet details are already stored in Vuex, and if not it makes the API call to retreve them.
Since the Planet name is not included in the Person result I had to run the homeworld endpoint for each Person when retrieving them. This was the only was to get the Planet Name.
I've implemented a loader state that displays while waiting on the API calls to complete.

This implementation achieves all of the required tasks and keeps the number of API calls to a minimum.
Calls for a page of Person results will only happen once for each page available in the API.
Calls for Planet details will only happen once for each planet.
Once a Page of People or details for a Planet have been retrieved, they will only be accessed from the Vuex store after that.

The Search does call the API each time as I found that just searching the contents of the Vuex store would mean that any People that have not already been retrieved as part of a call to get a page of People, would not be returned in my search results.
The API has a Search endpoint for People so using that will retrieve all People, including those that have not already been displayed as part of a page of results.
