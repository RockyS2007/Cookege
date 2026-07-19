# **Cookege**

A cooking app for university/college students struggling to figure out what to eat and how to make it 

> Deadline: July 27th, 2026 to finish version 1.0 of the app as I will be using it as part of my application to Hack The North 2026.


List of technologies used: TypeScript, PostGreSQL, Supabase


Date: 07/12/26

Brainstormed base features for the app
- A catalog of simple recipes that can be made in a student dorm
- A recipe recommendation system
- Recipe bookmarking
- Personal recipe rating

Started designing the Recipe object
Started thinking about the recipe database schema

Date: 07/13/26
- Right now I am only using recipes from allrecipes.com that I think are fit
- I give the link's of recipes I want to an agentic workflow that (1) checks if the recipe is reasonable for a student to make (2) have the recipe be broken down into a JSON object that I can read (3) compile a list of new recipes that I may want to think about adding
 - Originally I was playing to use MySQL but I think creating a recipe object in PostGreSQL might be easier, I just need to figure out how

 Date: 07/14/26
 - Defined an initial database schema with three tables: recipes, ingredients, instructions
 - Watched a Supabase tutorial
 - Started setting up the Supabase backend
 - Learned basic CRUD operations, but need to learn TypeScript before continuing
 - Scrapped Python layer (for now) for TypeScript + Supabase
 - NOTE: create a virtual environment and environment variables for API keys

 Date: 07/15/26
 - Finished a short TypeScript and some reading
 - Start learning React and Vite

 Date: 07/16/26
 - A bunch of tutorials

 Date: 07/17/26
 - 75% done HTML/CSS tutorial

 Date: 07/18/26
 - Finished HTML/CSS tutorial
 - Took a pause today