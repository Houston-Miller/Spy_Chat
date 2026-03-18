import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

export const useSignalR = (hubUrl: string) => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("Connected to SignalR Hub");
        setIsConnected(true);
        setConnection(newConnection);
      })
      .catch((err) => console.error("SignalR Connection Error: ", err));

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, [hubUrl]);

  return { connection, isConnected };
};