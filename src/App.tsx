import { useEffect, useState } from "react";
import { supabase } from "./supabase";

type Trade = {
  id: string;
  entry_price: number;
  exit_price: number;
  quantity: number;
  pnl: number;
};

function App() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [trades, setTrades] = useState<Trade[]>([]);
  const [entry, setEntry] = useState("");
  const [exit, setExit] = useState("");

  // 🔹 Get Logged In User
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      if (data.user) fetchTrades(data.user.id);
    };
    getUser();
  }, []);

  // 🔹 Login
  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    window.location.reload();
  };

  // 🔹 Signup
  const signUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created. Now login.");
  };

  // 🔹 Logout
  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  // 🔹 Fetch Trades
  const fetchTrades = async (userId: string) => {
    const { data, error } = await supabase
      .from("trades")
      .select("*")
      .eq("user_id", userId);

    if (!error && data) {
      setTrades(data);
    }
  };

  // 🔹 Add Trade
  const addTrade = async () => {
    if (!user) return;

    const entryValue = Number(entry);
    const exitValue = Number(exit);
    const quantity = 1;

    const pnl = (exitValue - entryValue) * quantity;

    const { error } = await supabase.from("trades").insert({
      user_id: user.id,
      entry_price: entryValue,
      exit_price: exitValue,
      quantity: quantity,
      pnl: pnl,
      notes: "",
      date: new Date().toISOString(),
      asset: "Stock",
      direction: "Long",
    });

    if (error) {
      alert(error.message);
      return;
    }

    setEntry("");
    setExit("");
    fetchTrades(user.id);
  };

  // 🔹 If Not Logged In → Show Login
  if (!user) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Login</h2>
        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />
        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />
        <button onClick={signIn}>Login</button>
        <button onClick={signUp}>Sign Up</button>
      </div>
    );
  }

  const totalPnL = trades.reduce(
    (acc, t) => acc + t.pnl,
    0
  );

  return (
    <div style={{ padding: 40 }}>
      <h2>Welcome {user.email}</h2>
      <button onClick={signOut}>Logout</button>

      <h3>Total P&L: ₹{totalPnL}</h3>

      <h3>Add Trade</h3>
      <input
        placeholder="Entry Price"
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
      />
      <input
        placeholder="Exit Price"
        value={exit}
        onChange={(e) => setExit(e.target.value)}
      />
      <button onClick={addTrade}>Save Trade</button>

      <h3>Your Trades</h3>
      <ul>
        {trades.map((trade) => (
          <li key={trade.id}>
            Entry: {trade.entry_price} | Exit: {trade.exit_price} | PnL: ₹{trade.pnl}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;