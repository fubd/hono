import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { io, Socket } from 'socket.io-client';

const container = document.getElementById('root')

const root = ReactDOM.createRoot(container as HTMLElement)
let socket: Socket;

function App() {
  const [list, setList] = React.useState<{name: string;id: string;password: string;}[]>([])
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [current, setCurrent] = React.useState<{name: string;id: string;password: string;} | null>(null)

  function getAll() {
    fetch('https://m1.fubodong.com/api/user/list').then((res) => res.json()).then((data) => {
      setList(data.data)
    }).catch((err) => {
      console.error('Error fetching user:', err)
    })
  }

  useEffect(getAll, []);

  function onAdd() {
    const name = (document.getElementById('name') as HTMLInputElement).value
    if (!name) {
      alert('请输入name')
      return
    }
    const password = (document.getElementById('password') as HTMLInputElement).value
    if (!password) {
      alert('请输入password')
      return
    }
    fetch('https://m1.fubodong.com/api/user/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          getAll()
        } else {
          alert('添加失败')
        }
      })
      .catch((err) => {
        console.error('Error adding user:', err)
      });
    (document.getElementById('name') as HTMLInputElement).value = '';
    (document.getElementById('password') as HTMLInputElement).value = '';
  }

  function onEdit() {
    const name = (document.getElementById('editName') as HTMLInputElement).value;
    const password = (document.getElementById('editPassword') as HTMLInputElement).value;
    fetch(`https://m1.fubodong.com/api/user/update?id=${current?.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          getAll();
          dialogRef.current?.close();
        } else {
          alert('编辑失败');
        }
      })
      .catch((err) => {
        console.error('Error editing user:', err);
      });
  }

  function onDel(id: string) {
    fetch(`https://m1.fubodong.com/api/user/del?id=${id}`, {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          getAll();
        } else {
          alert('删除失败');
        }
      })
      .catch((err) => {
        console.error('Error deleting user:', err);
      });
  }

  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

   useEffect(() => {
    // 初始化 socket
    socket = io('https://m1.fubodong.com');

    socket.on('connect', () => {
      console.log('连接成功:', socket.id);
      setConnected(true);

      socket.emit('message', '你好，服务器');
      socket.emit('chat', '来自客户端的 chat 消息');
    });

    socket.on('testEvent', (data: any) => {
      console.log('收到 testEvent:', data);
      setMessages((prev) => [...prev, `reply: ${data.message}`]);
    });

    socket.on('disconnect', () => {
      console.log('已断开连接');
      setConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const [file, setFile] = useState(null);
  const [uploadRestul, setUploadResult] = useState<{filename: string} | null>(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

    const handleUpload = async () => {
    if (!file) {
      alert('请选择文件');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setUploadResult(data);
    } catch (err) {
      alert('上传失败');
    }
  };

  return (
    <div>
      <div style={{display: 'flex', gap: '10px'}}>
        <label htmlFor="name">name</label>
        <input id='name' />
        <label htmlFor="password">password</label>
        <input id='password' />
        <button onClick={onAdd}>add User</button>
      </div>
      <hr />
      <div>
        <h4>消息记录:</h4>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
      <hr />
          <div>
      <h2>文件上传</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>上传</button>
      {uploadRestul && <pre>{JSON.stringify(uploadRestul, null, 2)}</pre>}
      {
        uploadRestul?.filename && <img src={"https://m1.fubodong.com/uploads/" + uploadRestul?.filename} />
      }
    </div>
    <hr/>
      <button onClick={getAll}>get All User</button>
      <div>
        <ul style={{listStyle: 'none', margin: 0, padding: 8, display: 'flex', flexDirection: 'column', gap: '10px', borderRadius: 4, border: '1px solid #ccc', width:  600}}>
          {list.map((item) => (
            <li key={item.id}>
              {item.id} - {item.name} - {item.password}
              <div style={{display: 'inline-flex', gap: '10px', marginLeft: '10px'}}>
                <button onClick={
                  () => {
                    dialogRef.current?.showModal?.();
                    setCurrent(item);
                  }
                }>edit</button>
                <button onClick={() => onDel(item.id)}>delete</button>
              </div>
            </li>
          ))}
        </ul> 
      </div>
      <dialog id="myDialog" ref={dialogRef}>
        <h3>edit user</h3>
        {current && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <div>
              <label htmlFor="editName" style={{marginRight: 10}}>name</label>
              <input id='editName' defaultValue={current.name} />
            </div>
            <div>
              <label htmlFor="editPassword" style={{marginRight: 10}}>password</label>
              <input id='editPassword' defaultValue={current.password} />
            </div>
          </div>
        )}
         <hr />
         <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
          <button onClick={() => dialogRef.current?.close()}>取消</button>
          <button onClick={onEdit}>保存</button>
         </div>
      </dialog>
    </div>
  )
}

// 渲染 App 组件
root.render(<App />)
