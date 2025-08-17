import InputField from "./InputField";
import SessionForm from "./SessionForm";

const StartSession = () => {
  return(
    <>
      <SessionForm />
    </>
  )
}

export default StartSession;

/*const handleClick = async () => {
  const response = await fetch('http://localhost:5667/timer', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId: "user123",
      topic: "Math Revision",
      plannedDuration: 1500,   // in seconds
      stake: 10
    }),
  } )

  console.log(response.json());
}*/