import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div style={{padding:40, fontFamily:"sans-serif"}}>
      <h1 style={{color:"#E84B2C"}}>✅ Casta Latina — React carga OK</h1>
      <p>Si ves esto, el proyecto React en Vercel funciona correctamente.</p>
      <button onClick={() => setCount(c => c+1)}
        style={{marginTop:20, padding:"10px 20px", background:"#2B3A5C",
          color:"#fff", border:"none", borderRadius:8, fontSize:16, cursor:"pointer"}}>
        Clicks: {count}
      </button>
    </div>
  );
}
