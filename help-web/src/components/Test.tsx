import React from "react";
import { createClient, type User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

export default function Test() {

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const sb = createClient(
        "https://kkvszipvbsxezcdrgsut.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrdnN6aXB2YnN4ZXpjZHJnc3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM2OTk4MDcsImV4cCI6MjAzOTI3NTgwN30.UlRIl7wtwzNr8jW6pjehojKhPjSDE0imkw_IAHgPdIQ",
      );
      const resp = await sb.auth.getUser();
      setUser(resp.data.user);
    };
    fetchUser();
  },[])
  
  return (
    <div>
      {user?.email ?? 'No user'}
    </div>
  );
}