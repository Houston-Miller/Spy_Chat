import { useState } from 'react'
import './App.css'
import { HubConnectionBuilder } from '@microsoft/signalr';
import Lobby from './components/lobby';
import CodecBoard from './components/codecboard';

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
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <Lobby />


      <div className="mt-10">
        <CodecBoard />
      </div>
    </div>
  )
}

export default App
