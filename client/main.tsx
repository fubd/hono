import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom/client'

const container = document.getElementById('root')

const root = ReactDOM.createRoot(container as HTMLElement)

function App() {
  const [list, setList] = React.useState<{name: string;id: string;password: string;}[]>([])
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [current, setCurrent] = React.useState<{name: string;id: string;password: string;} | null>(null)

  function getAll() {
    fetch('https://m1.fubodong.com/api/user').then((res) => res.json()).then((data) => {
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
