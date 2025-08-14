import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Outlet, useRoutes, useNavigate, useLocation } from 'react-router';
import Home from './Home';
import Task from './Task';
import * as styles from './index.module.css'

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { label: 'Home', path: '/' },
    { label: 'Task', path: '/task' },
  ];

  return (
    <div className={styles.container}>
      <header>header</header>
      <main style={{ display: 'flex' }}>
        <section style={{ minWidth: 200 }}>
          <nav>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {menu.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <button
                      onClick={() => navigate(item.path)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        color: isActive ? 'red' : 'black',
                        fontWeight: isActive ? 'bold' : 'normal',
                      }}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </section>
        <section style={{ flex: 1 }}>
          <Outlet />
        </section>
      </main>
    </div>
  );
}

function App() {
  const element = useRoutes([
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'task', element: <Task /> },
      ],
    },
  ]);
  return element;
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container as HTMLElement);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
