import ReactDOM from 'react-dom/client';
import {BrowserRouter, Outlet, useLocation, useNavigate, useRoutes} from 'react-router';
import Home from './Home';
import Task from './Task';
import './rest.css';
import clsx from 'clsx';
import styles from './index.module.css';

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    {label: 'Home', path: '/'},
    {label: 'Task', path: '/task'},
  ];

  return (
    <div className={styles.container}>
      <header>
        <h1>Get Started</h1>
      </header>
      <main style={{display: 'flex'}}>
        <section style={{minWidth: 200}}>
          <nav>
            <ul>
              {menu.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <button
                      type="button"
                      onClick={() => navigate(item.path)}
                      className={clsx(styles.navBtn, isActive && styles.active)}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </section>
        <section style={{flex: 1}}>
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
        {index: true, element: <Home />},
        {path: 'task', element: <Task />},
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
  </BrowserRouter>,
);
