# ExerciseSeniorFrontEnd

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.8

## Development server

Run  `npm install` to install all the dependencies from npm

Run `ng serve --o` for a dev server. Default browser will open the app with uri  `http://localhost:4200/`.

## Below are the features developed in the app  using the mocked data stream
* Show a table with all of the assets
* Allow to sort for each one of the model fields
* Allow to filter for each one of the model fields

## Display assets in table
* Service layer mocks the data
* Data is injected to one of the components, where it is displayed in a table
* All 400 assets are displayed at once
* Pagination or load more can be implemented to improve the performace when the data is fetched from an external API

## Sorting
* Clicking on a table header sorts the assets by column in ascending order
* Single sort per table is implemented
* Original data order is not lost, as the sorting is applied on a data copy
* Clicking on `Remove Sort` will remove the sorting applied on the table column

## Filter
* Click on `Show Filter` or `Hide Filter` to toggle filters
* Filter is applied on number, string and date data type, with relavent conditions 
* Multiple filter can be applied on the table but single filter per column is applied for simplicity. Logical AND is used for multiple filters
* Applied filters are showed in a list above the table, which disappears once the filters are cleared
* `Total Assets` section on the top of table, displays the number of records after filter conditions are applied
* Filter logic for datetime column `Updated Date`, is applied on Date portion ignoring the time value, this can be enhanced to include time
* Clicking on `Clear Filter` will remove all the filters applied on the table, will retain the sorting applied in the column


## User Interface
* Clarity UI package is used for implementing user interface
