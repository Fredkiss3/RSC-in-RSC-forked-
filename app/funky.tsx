import { FunkyClient } from "./funky-client";

export async function Funky() {
    const currentDate = new Date();
    console.log("COMPUTING FUNKY !", currentDate);
    return (
        <div>
            Hello, this is a server component{" "}
            {new Intl.DateTimeFormat("en-US", {
                dateStyle: "long",
                timeStyle: "long",
                hour12: true,
                timeZone: "Europe/Paris",
            }).format(currentDate)}
            <br />
            <FunkyClient />
        </div>
    );
}
