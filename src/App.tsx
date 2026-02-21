import { useEffect, useState } from "react";
import { supabase } from "./supabase";

type Trade = {
  id: string;
  entry_price: number;
  exit_price: number;
  quantity: number;
  pnl: number;
  notes: string;
};

function App() {
  const [user, setUser] = useState<any>(null);

  const [isSignup, setIsSignup] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      if (data.user) fetchTrades(data.user.id);
    };
    getUser();
  }, []);

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

  const signUp = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created successfully. Please login.");
    setIsSignup(false);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  

  if (!user) {
    return (
      <div style={{ padding: 40 }}>
        {!isSignup ? (
          <>
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

            <p style={{ marginTop: 20 }}>
              Don't have an account?{" "}
              <span
                style={{ color: "blue", cursor: "pointer" }}
                onClick={() => setIsSignup(true)}
              >
                Create Now
              </span>
            </p>
          </>
        ) : (
          <>
            <h2>Create Account</h2>

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

            <input
              placeholder="Confirm Password"
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <br /><br />

            <button onClick={signUp}>Create Account</button>

            <p style={{ marginTop: 20 }}>
              Already have an account?{" "}
              <span
                style={{ color: "blue", cursor: "pointer" }}
                onClick={() => setIsSignup(false)}
              >
                Login
              </span>
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Welcome {user.email}</h2>
      <button onClick={signOut}>Logout</button>
      <h3>Your dashboard is ready.</h3>
    </div>
  );
}

export default App;