import "dotenv/config"
import {getAllCasts} from "../functions/index-casts";

const casts = getAllCasts()

console.log("grabbing casts")
casts.then((casts) => {
    console.log(casts)
})