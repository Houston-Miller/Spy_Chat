import { useState, useEffect, } from "react";
import codec from "./assets/Codec.webp";
import snakecodec from "./assets/snakecodec.jpg";
import liquidcodec from "./assets/liquidcodec.jpg";
import merylcodec from "./assets/Merylcodec.jpg";
import "./App.css";
import TypeIt from "typeit-react";
import { useSignalR } from "./hooks/signalRHook";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
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

export default function App() {
  // I THINK this host URL is the one provided by the signalR server, but I will need to confirm this
  const { connection } = useSignalR("http://localhost:5062/ChatHub");
  const [activeRoom, setActiveRoom] = useState("");
  const [openRooms, setOpenRooms] = useState<string[]>([]);
  const [frequency, setFrequency] = useState("");
  const [message, setMessage] = useState<{ user: string; text: string }[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [username, setUsername] = useState("");

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
      setMessage((prev) => [...prev, { user, text }]);
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

  // Update requirement met here
  const handleUpdateName = async () => {
    if (!connection?.connectionId) return;
    try {
      const response = await fetch(`${API_URL}/user/${connection.connectionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(username),
      });

      if (response.ok) {
        console.log("Username updated successfully");
      }
    } catch (err) {
      console.error("Error updating username: ", err);}
  }

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

                  <span className="text-4xl font-semibold text-center tracking-widest">
                    <Button>NAME</Button>
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
              <div className="size-full flex items-center justify-center">
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

                  <span className="text-4xl font-semibold text-center tracking-widest">
                    <Button>NAME</Button>
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
          {message.map((msg, i) => (
            <div key={i} className="mb-1">
              <span className="font-bold">{msg.user}: </span>
              <span>{msg.text}</span>
            </div>
          ))}
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

{
  /* {view === "LOBBY" && <Lobby onJoinRoom={handleJoinRoom} />}
      {view === "CODECBOARD" && <CodecBoard connection={connection} roomID={activeRoom} />} */
}

// This is the template code for vite, I am keeping it for reference atm
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <section id="center">
//         <div className="hero">
//           <img src={heroImg} className="base" width="170" height="179" alt="" />
//           <img src={reactLogo} className="framework" alt="React logo" />
//           <img src={viteLogo} className="vite" alt="Vite logo" />
//         </div>
//         <div>
//           <h1>Get started</h1>
//           <p>
//             Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
//           </p>
//         </div>
//         <button
//           className="counter"
//           onClick={() => setCount((count) => count + 1)}
//         >
//           Count is {count}
//         </button>
//       </section>

//       <div className="ticks"></div>

//       <section id="next-steps">
//         <div id="docs">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#documentation-icon"></use>
//           </svg>
//           <h2>Documentation</h2>
//           <p>Your questions, answered</p>
//           <ul>
//             <li>
//               <a href="https://vite.dev/" target="_blank">
//                 <img className="logo" src={viteLogo} alt="" />
//                 Explore Vite
//               </a>
//             </li>
//             <li>
//               <a href="https://react.dev/" target="_blank">
//                 <img className="button-icon" src={reactLogo} alt="" />
//                 Learn more
//               </a>
//             </li>
//           </ul>
//         </div>
//         <div id="social">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#social-icon"></use>
//           </svg>
//           <h2>Connect with us</h2>
//           <p>Join the Vite community</p>
//           <ul>
//             <li>
//               <a href="https://github.com/vitejs/vite" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#github-icon"></use>
//                 </svg>
//                 GitHub
//               </a>
//             </li>
//             <li>
//               <a href="https://chat.vite.dev/" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#discord-icon"></use>
//                 </svg>
//                 Discord
//               </a>
//             </li>
//             <li>
//               <a href="https://x.com/vite_js" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#x-icon"></use>
//                 </svg>
//                 X.com
//               </a>
//             </li>
//             <li>
//               <a href="https://bsky.app/profile/vite.dev" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#bluesky-icon"></use>
//                 </svg>
//                 Bluesky
//               </a>
//             </li>
//           </ul>
//         </div>
//       </section>

//       <div className="ticks"></div>
//       <section id="spacer"></section>
//     </>
//   )
// }

// export default App
