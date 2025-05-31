import { useState } from "react";
import React from 'react'
import ReactDOM from 'react-dom/client'

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      
    </div>
  );
}

export default function App() {
  function onAdd() {
    fetch('/apiv1/addUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: '用户名',
        password: '密码'
      })
    })
      .then(response => response.json())
      .then(data => {
        // 处理返回结果
        console.log(data);
      });
  }

  function onGetUsers() {
    fetch('/apiv1/getUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        // 处理返回结果
        console.log(data);
      });
  }
  return (
    <div>
      <h1>hello AI</h1>
      <Counter />
      <hr />
      <button onClick={onAdd}>click to add user</button>
      <hr />
      <button onClick={onGetUsers}>click to get users</button>
    </div>
  );
}

const root = document.getElementById('root')!

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)