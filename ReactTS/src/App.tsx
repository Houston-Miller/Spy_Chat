import { useState, useEffect, } from "react";
import codec from "./assets/Codec.webp";
import snakecodec from "./assets/snakecodec.jpg";
import liquidcodec from "./assets/liquidcodec.jpg";
import merylcodec from "./assets/Merylcodec.jpg";
import "./App.css";
import Typewriter from 'typewriter-effect';
import React from "react";
import { useSignalR } from "./hooks/signalRHook";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const API_URL = "http://localhost:5062/api/";

// This is heavily AI generated as I was unable to make the typewriter library work 
// I hate that this is at the top of the file but I tried like 3 different typewriter libraries and struggled with getting them to drop in easily 
const CodecMessage = React.memo(({ user, text, isLatest }: { user: string; text: string; isLatest: boolean }) => {
  return (
    // TODO: change my shadcn styling to closer match this color scheme 
    <div className="mb-2 font-mono border-l-2 border-emerald-900 pl-3 py-1">
      <span className="text-[10px] text-emerald-800 block uppercase">
        {user}
      </span>
      <div className="text-emerald-400 text-sm">
        {isLatest ? (
          <Typewriter
            options={{
              strings: [text],
              autoStart: true,
              delay: 70,
              cursor: '█',
              loop: false,
              deleteSpeed: Infinity,
            }}
          />
        ) : (
          <span>{text}</span>
        )}
      </div>
    </div>
  );
}); // End of Heavy AI Generated Component

export default function App() {
  // I THINK this host URL is the one provided by the signalR server, but I will need to confirm this
  const { connection } = useSignalR("http://localhost:5062/ChatHub");
  const [activeRoom, setActiveRoom] = useState("");
  const [openRooms, setOpenRooms] = useState<string[]>([]);
  const [frequency, setFrequency] = useState("");
  const [chathistory, setChatHistory] = useState<{ user: string; text: string }[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [username, setUsername] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);

  // Create requirement met here
  const handleCreateRoom = async (roomID: string) => {
    if (!connection || !roomID) return;
    try {
      await fetch(`${API_URL}frequency`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roomID),
      });

      await connection.invoke("JoinRoom", roomID);
      setActiveRoom(roomID);
      setInputMessage("");
      setOpenRooms((prev) => {
        return [...prev, roomID];
      });
    } catch (err) {
      console.error("Error creating room: ", err);
    }
  };

  // Read requirement met here
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`${API_URL}frequency`);
        const data = await res.json();
        setOpenRooms(data);
      } catch (err) {
        console.error("Error fetching rooms: ", err);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    if (!connection) return;

    connection.on("ReceiveMessage", (user: string, text: string) => {
      setChatHistory((prev) => [...prev, { user, text }]);
    });

    return () => {
      connection.off("ReceiveMessage");
    };
  }, [connection]);

  // Delete requirement met here
  const handleDeleteRoom = async (roomID: string) => {
    try {
      await fetch(`${API_URL}frequency/${roomID}`, {
        method: "DELETE",
      });
      setOpenRooms((prev) => prev.filter((r) => r !== roomID));
    } catch (err) {
      console.error("Error deleting room: ", err);
    }
  };

  const handleJoinRoom = async (roomID: string) => {
    if (!connection) return;

    try {
      await connection.invoke("JoinRoom", roomID);
      setActiveRoom(roomID);
    } catch (err) {
      console.error("Error joining room: ", err);
    }
  };

  const handleSendMessage = async () => {
    if (!connection || !inputMessage) return;
    console.log("Sending to room id: ", activeRoom);

    try {
      await connection.invoke(
        "SendMessage",
        activeRoom,
        username,
        inputMessage,
      );
      setInputMessage(""); //This is to clear the input field after sending a message
    } catch (error) {
      console.error("Error sending message:", error);
    }
  
  };
  

  // Update requirement met here
  const handleUpdateName = async () => {
    if (!connection?.connectionId) return;
    try {
      const response = await fetch(`${API_URL}user/${connection.connectionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(username),
      });

      if (response.ok) {
        setIsEditingName(false);
        console.log("Username updated successfully");
      }
    } catch (err) {
      console.error("Error updating username: ", err);}
  };

  

  return (
    <div className="h-screen dark">
      <div className="grid grid-rows-4 h-full">
        <div className="row-span-2 max-h-full overflow-hidden">
          <div className="grid grid-cols-5">
            <div className="col-span-1">
              <Carousel className="max-w-full">
                <CarouselContent>
                  <CarouselItem className="text-2xl font-bold">
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-2/4 items-center justify-center p-6">
                          <img
                            src={snakecodec}
                            className="h-full object-cover w-80"
                            alt=""
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                  <CarouselItem className="text-2xl font-bold">
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-2/4 items-center justify-center p-6">
                          <img
                            src={liquidcodec}
                            className="h-full object-cover w-80"
                            alt=""
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                  <CarouselItem className="text-2xl font-bold">
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-2/4 items-center justify-center p-6">
                          <img
                            src={merylcodec}
                            className="h-full object-cover w-80"
                            alt=""
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                </CarouselContent>
                <div className="flex items-center justify-center mt-2 px-2">
                  <CarouselPrevious className="static translate-y-0 translate-x-0" />

                  <span className="flex flex-col items-center gap-2">
                    {isEditingName ? (
                      <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="ENTER USERNAME..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleUpdateName();
                          if (e.key === "Escape") setIsEditingName(false);
                        }}
                      />
                    ) : (
                      <Card>
                        {username || "USERNAME"}
                      </Card>
                    )}
                    <Button onClick={() => isEditingName ? handleUpdateName() : setIsEditingName(true)}>
                      {isEditingName ? "Save" : "RENAME"}
                    </Button>
                  </span>
                  <CarouselNext className="static translate-y-0 translate-x-0" />
                </div>
              </Carousel>
            </div>
            <div className="col-span-3 size-full max-h-full">
              <Input
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                placeholder="ENTER FREQUENCY..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCreateRoom(frequency);
                  }
                }}
              />
              <div className="flex items-center justify-center">
                <img src={codec} className="h-full object-cover w-80" alt="" />
              </div>
            </div>
            <div className="col-span-1">
              <Carousel className="max-w-full">
                <CarouselContent>
                  <CarouselItem className="text-2xl font-bold">
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-2/4 items-center justify-center p-6">
                          <img
                            src={liquidcodec}
                            className="h-full object-cover w-80"
                            alt=""
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                  <CarouselItem className="text-2xl font-bold">
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-2/4 items-center justify-center p-6">
                          <img
                            src={snakecodec}
                            className="h-full object-cover w-80"
                            alt=""
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                  <CarouselItem className="text-2xl font-bold">
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-2/4 items-center justify-center p-6">
                          <img
                            src={merylcodec}
                            className="h-full object-cover w-80"
                            alt=""
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                </CarouselContent>
                <div className="flex items-center justify-center mt-2 px-2">
                  <CarouselPrevious className="static translate-y-0 translate-x-0" />

                  <span className="flex flex-col items-center gap-2">
                    {isEditingName ? (
                      <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="ENTER USERNAME..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleUpdateName();
                          if (e.key === "Escape") setIsEditingName(false);
                        }}
                      />
                    ) : (
                      <Card>
                        {username || "USERNAME"}
                      </Card>
                    )}
                    <Button onClick={() => isEditingName ? handleUpdateName() : setIsEditingName(true)}>
                      {isEditingName ? "Save" : "RENAME"}
                    </Button>
                  </span>
                  <CarouselNext className="static translate-y-0 translate-x-0" />
                </div>
              </Carousel>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Frequencies</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSeparator />
            {openRooms.map((room) => (
              <DropdownMenuItem key={room} onClick={() => handleJoinRoom(room)}
                className="flex justify-between items-center group"
                >
                  <span>{room}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRoom(room);
                    }}
                  >
                    Delete
                  </button>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="row-span-1">
          {chathistory.length > 0 ? (
            <CodecMessage 
              key={chathistory.length}
              user={chathistory[chathistory.length - 1].user} 
              text={chathistory[chathistory.length - 1].text} 
              isLatest={true}
            />
          ) : (<span className="text-emerald-500 text-sm italic">...</span>
          )}
        </div>
        <div className="row-span-1">
          <div className="flex flex-row">
            <Input
            //update this input to use the typeit library 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="ENTER MESSAGE..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                }
              }}
            ></Input>
            <Button>Send</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
