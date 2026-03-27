import { useState } from "react";
import codec from "./assets/Codec.webp";
import "./App.css";
//import {lobby, codecboard} from '@/components'
//import Lobby from "@/components/lobby";
//import CodecBoard from "@/components/codecBoard";
import { useSignalR } from "./hooks/signalRHook";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

export default function App() {
  // I THINK this host URL is the one provided by the signalR server, but I will need to confirm this
  const { connection } = useSignalR("http://localhost:5062/ChatHub");
  //const [view, setView] = useState<"LOBBY" | "CODECBOARD">("LOBBY");
  const [activeRoom, setActiveRoom] = useState<string>("140.15");
  const [message, setMessage] = useState("");

  const handleJoinRoom = async (roomID: string) => {
    if (!connection) return;

    try {
      await connection.invoke("JoinRoom", roomID);
      setActiveRoom(roomID);
      //setView("CODECBOARD");
    } catch (err) {
      console.error("Error joining room: ", err);
    }
  };

  const handleSendMessage = async () => {
    if (!connection || !message.trim()) return;
      console.log("Sending to room id: ", activeRoom)

    try {
      await connection.invoke("SendMessage", activeRoom, message);
      setMessage(""); //This is to clear the input field after sending a message
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="h-screen dark">
      <div className="grid grid-rows-4 h-full">
        <div className="row-span-2 max-h-full overflow-hidden">
          <div className="grid grid-cols-5">
            <div className="col-span-1">SNAKE</div>
            <div className="col-span-3 size-full max-h-full">
              <div className="size-full flex items-center justify-center">
                <img
                  src={codec}
                  className="h-full object-cover w-80"
                  alt=""
                />
              </div>
            </div>
            <div className="col-span-1">LIQUID</div>
          </div>
        </div>
        <div className="row-span-1">TEXT</div>
        <div className="row-span-1">
          <div className="flex flex-row">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="ENTER MESSAGE..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            ></Input>
            <Button onClick={handleSendMessage}>Send</Button>
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
