# Spy Chat

## Overview 
Spy Chat is a thematic proof of concept for a fun, dynamic chat application based on the styling of the "codec conversations" 
from the early Metal Gear Solid video games

<img width="1500" height="750" alt="image" src="https://github.com/user-attachments/assets/0c48a8c8-86c5-4cae-8a75-44e2ba27101f" />


## Features
Spy Chat is built on SignalR's continuous connection protocol, allowing for seamless text chat between connected clients.
This functionality is bolstered by a lightwweight database the holds permanent information including room IDs (themed as call frequencies)
and usernames.

notable libraries and tools used:
- SignalR
- Entity Framework
- shadcn/tailwindcss
- Xunit/Fluent assertions

The project was made to meet the following requirements:
- Includes a C# web API using controllers (WebChat/Controllers)
- A project that consumes that API (the ReactTS front end)
- a test project with automated testing (SpyChat.Tests)
- A project exists that uses those web APIs to create, read, update, and delete data stored in-memory
  - Create: The entry field for frequencies
  - Read: Populate the list of available frequency rooms
  - Update: Set/update your username
  - Delete: remove frequency from list 


## Setting Up The Application

This project requires the following tools to be installed:

- dotnet SDK 10.0
- Node.js
- Entity Framework Tools (instructions to install this via the CLI will are provided below)

to begin, clone the git repo
```
git clone https://Link-to-Repo
```
Navigate to the cloned directory
```
cd Spy_Chat
```
To continue with the required setup, the following instructions will pertain to VSCode specifically
```
code .
```
install requires packages and prepare the dotnet api and sqlite database with the following commands:
```
dotnet tool install --global dotnet-ef

cd WebChat

dotnet restore

dotnet ef database update

dotnet run
```
Return to the main directory and proceed to install the front end requirements 
```
cd ..

cd ReactTS

npm install

npm run dev
```

Now that the project is running, open two browser windows, ideally in a side-by-side view, and navigate on both browsers to:
http://localhost:5173

Click the top input bar labeled "frequencies" and enter a string of numbers to represent your room id, for thematic purposes I reccomend '141.80'
Press ENTER

This 'frequency' will now be listed in the drop down menu under the 'Frequencies' button - if there are none there refresh the page(s)
click into this listed frequency on both browser windows

entering text in the bottom input field and pressing ENTER should now sucessfully send to both windows. Explore the endpooints available here by changing your name with the **rename** button and modular text field, exploring adding new rooms and moving between them, and deleting some old rooms.

in your WebChat terminal, also run

```
dotnet test
```
to load and run the tests included in the project (if the test are not populating automatically in the test field in VSCode's testing navigation, please use the Refresh Tests function at the top of the bar, or press (Ctrl+; , Ctrl+R))

## What I learned 

While what is on display here is extremely bare bones, I enjoyed the process of using these front-end libraries immensely, as this was the first time I had explored doing any amount of front end work.
Having never tackled a project of this size, It became very clear how important structure and modularity are for projects that begin to show any amount of scope. As a single page, monolithic project, this could easily bloat into a complete mess quickly.

## If I Spend More Time With This Project

I originally aimed to build this project with a more "professional" scope and break it into many pieces of discrete components - more appropriately called and used in the main App location. But after deciding that I didn't have the bandwidth to learn about routers and more 
advanced web dev tools, I built it this way. I would love to go back and break this into more manageble pieces to build on.

The tests are about as basic as they come, and they only test very simple, agreeable endpoints. These tests don't even begin to test the boundaries of what is available and I would love to expand on them.

As to be expected, there are so, so many bugs and potential error cases. In the near future I would love to add/fix some of the following:
- Update the User class/controller to also contain their avatar
- Fix the Username field to be able to distinguish between two users in the room and update the field correctly when they change usernames and avatars
- continue working on UI (breaks a bit on small monitors)
- but much more elaborate guard rails on the input fields
- limit users to 2~4 per room, with UI elements to denote room occupants
- roadmap for deploying to WAN
- containerization for easy deployment 

## AI usage disclosure
while I tried to keep direct AI usage as low as possible, it was regularly used for "how to go about x" and "what tools to do y" with - any explict chunks of code copied directly are marked and contained.
Copious amounts of help with formatting and syntax were delivered through intellisense - this should have been documented more thoroughly than it is. 

