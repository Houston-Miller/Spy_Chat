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

<Card>
  <CardHeader>
    <CardTitle>Frequency</CardTitle>
    <CardDescription>Who Would You Like to Contact?</CardDescription>
    <CardAction>Card Action</CardAction>
  </CardHeader>
  <CardContent>
    {/* These need to be href links to the signalR groups that are created for each frequency */}
    <p>140.15</p>
    <p>140.48</p>
    <p>140.85</p>
    <p>140.96</p>
    <p>141.12</p>
    <p>141.52</p>
    <p>141.80</p>
  </CardContent>
  <CardFooter>
    <Button variant="ghost">Call</Button>
  </CardFooter>
</Card>