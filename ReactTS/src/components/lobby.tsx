import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface LobbyProps {
    onJoinRoom: (roomID: string) => Promise<void>;
}

const frequencies = ["140.15", "140.48", "140.85", "140.96", "141.12", "141.52", "141.80"];

export default function Lobby({ onJoinRoom }: LobbyProps) {
  return (
    <Card className="bg-red-500">
      <CardHeader>
        <CardTitle>Frequency</CardTitle>
        <CardDescription>Who Would You Like to Contact?</CardDescription>
        <CardAction></CardAction>
      </CardHeader>
      <CardContent>
        {frequencies.map((id) => (
          <Button key={id} onClick={() => onJoinRoom(id)}>
            Connect To {id}
          </Button>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="ghost">Call</Button>
      </CardFooter>
    </Card>
  );
}  