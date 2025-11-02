import { Calender } from "./components/Calender";
import { EventsProvider } from "./context/Events";
import "./styles.css";
export default function App() {
  return (
    <EventsProvider>
      <Calender />
    </EventsProvider>
  );
}
