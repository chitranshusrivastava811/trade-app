import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zcqstysrtavqdmsspsiz.supabase.co";
const supabaseKey = "sb_publishable_ovAes4K9c0_8tkBdN58z7Q_qYkxmFbL";

export const supabase = createClient(supabaseUrl, supabaseKey);