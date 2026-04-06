# Spy Chat

## Overview 
Spy Chat is a thematic proof of concept for a fun, dynamic chat application based on the styling of the "codec conversations" 
from the early Metal Gear Solid video games

<img width="500" height="288" alt="image" src="https://github.com/user-attachments/assets/159f0383-1d03-4ec0-9c6c-5710d7eae300" />


## Features
Spy Chat is built on SignalR's continuous connection protocol, allowing for seamless text chat between connected clients.
This functionality is bolstered by a lightwweight database the holds permanent information including room IDs (themed as call frequencies)
and usernames.

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

Click the top input bar labeled "frequencies" and enter a string of numbers to represent your room id, for thematic purposes I reccomend '140.85'
Press Enter

This 'frequency' will now be listed in the drop down menu under the 'Frequencies' button - if there are none there refresh the page(s)
click into this listed frequency on both browser windows

entering text in the bottom input field should now sucessfully send to both windows 
