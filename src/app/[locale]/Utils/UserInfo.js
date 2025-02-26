import Cookies from "js-cookie";
import { siteName } from "./variables";

export let token = Cookies.get(`${siteName}_token`);
export let userId = Cookies.get(`${siteName}_u_id`);
export let userEmail = Cookies.get(`${siteName}_user_email`);


