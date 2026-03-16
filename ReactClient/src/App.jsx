import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { HubConnectionBuilder } from '@microsoft/signalr';

const connection = new HubConnectionBuilder()
    .withUrl('http://localhost:5062/chatHub')
    .withAutomaticReconnect()
    .build();

connection.start()
    .then(() => console.log('Connected to SignalR hub'))
    .catch(err => console.error('Error Connecting to hub', err));

connection.on('ReceiveMessage', message => {
    console.log('Received message:', message);
})

function App() {
    
}

export default App
