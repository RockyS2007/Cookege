# **Cookege**

A cooking app for university/college students struggling to figure out what to eat and how to make it 

> Deadline: July 27th, 2026 to finish version 1.0 of the app as I will be using it as part of my application to Hack The North 2026.


List of technologies used: TypeScript, HTML/CSS, Node.js, PostGreSQL, Supabase, OAuth (Supabase users)


Date: 07/12/26

Brainstorm base features
- Catalog of simple recipes that can be made in a student dorm
- A recipe recommendation system

Started designing the Recipe object


Started thinking about the recipe database schema

Date: 07/13/26
- only using recipes from allrecipes.com that I think are fit
- give the link's of recipes to agentic workflow (1) checks if the recipe is reasonable for student to make (2) break recipe into a JSON object (3) add those recipes to DB (4) generate new recipes to look at based on current selection

 Date: 07/14/26
 - Defined initial db schema: recipes, ingredients, instructions
 - Watched Supabase tutorial + setting up Supabase backend
 - Learned basic CRUD operations, but need to learn TypeScript
 - Scrapped Python layer for TypeScript + Supabase

 Date: 07/15/26
 - Finished a short TypeScript tutorial and some reading
 - Start learning React and Vite

 Date: 07/16/26
 - A bunch of tutorials

 Date: 07/17/26
 - 75% done HTML/CSS tutorial

 Date: 07/18/26
 - Finished HTML/CSS tutorial
 - break

 Date: 07/19/26
 - Finish editing tables in Supabase
 - Watched F1 + WC... 💀

 Date: 07/20/26
 - 3 hour JS tutorial
 - Basically stuck in tutorial hell, still have React + Vite tutorial to do

 Date: 07/21/26
 - Reading Supabase API documentation
 - Setting up RLS and policies
 - Challenges setting up a dev user that had access to all DB operations w/o letting any anon user have the same perms
 - Added DB policies for dev to all tables, probably start implementing and testing CRUD tomorrow

 Date: 07/22/26
 - Still working on DB
 - Implementing CRUD

 Date: 07/23/26
 - forced to take a day break, maybe code a bit

 NOTES
 - Review all RLS policies for newly signed up users
 - Setup docker image