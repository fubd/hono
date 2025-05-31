import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import fs from 'fs'
import { Kysely, MysqlDialect, sql } from 'kysely'
import { createPool } from 'mysql2'
import type { Database } from './Database.js'
import { promisify } from 'util'
import { logger } from 'hono/logger'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { jsonMiddleware } from './jsonMiddleware.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const initPool = createPool({
  host: '101.34.88.217',
  user: 'root',
  password: 'mm110z',
  port: 3306,
  connectionLimit: 10,
  supportBigNumbers: true,
  bigNumberStrings: true,
  typeCast: (field, next) => {
    if (field.type === 'LONGLONG') {
      const val = field.string();
      return val === null ? null : val;
    }
    return next();
  },
})

async function initDatabase() {
  try {
    const query = promisify(initPool.query).bind(initPool)
    const sqlScript = fs.readFileSync(path.resolve(__dirname, 'db.sql'), 'utf-8')
    const statements = sqlScript.split(';').filter(stmt => stmt.trim())
    
    for (const statement of statements) {
      if (statement.trim()) {
        await query({ sql: statement })
        console.log(`执行SQL语句成功: ${statement.trim().substring(0, 50)}...`)
      }
    }
    
    console.log('数据库初始化完成')
  } catch (error) {
    console.error('数据库初始化失败:', error)
  }
}

await initDatabase()

const dialect = new MysqlDialect({
  pool: createPool({
    database: 'hono',
    host: '101.34.88.217',
    user: 'root',
    password: 'mm110z',
    port: 3306,
    connectionLimit: 10,
    supportBigNumbers: true,
    bigNumberStrings: true,
    typeCast: (field, next) => {
      if (field.type === 'LONGLONG') {
        const val = field.string();
        return val === null ? null : val;
      }
      return next();
    }
  })

})

const db = new Kysely<Database>({
  dialect,
})

const app = new Hono()
app.use(logger())

app.use(jsonMiddleware);

app.use('/*', serveStatic({ root: './static' }))

app.get('/', (c) => {
  const html = fs.readFileSync('./static/index.html', 'utf-8')
  return c.html(html)
})

app.post('/apiv1/getUser', async (c) => {
  const users = await sql`SELECT * FROM user`.execute(db)
  return c.jsonFmt({
    success: true,
    data: users.rows
  })
})

app.post('/apiv1/addUser', async (c) => {
  const res = await sql`INSERT INTO user (name, password) VALUES ('test', 'test')`.execute(db)
  return c.jsonFmt({
    success: true,
    data: res.insertId
  })
})

app.post('/api/getBanner', (c) => {
  return c.json({
    status: 1,
    data: ['https://m1.fubodong.com/banner1.jpg', 'https://m1.fubodong.com/banner2.jpg']
  });
})

app.post('/api/getDesc', (c) => {
  return c.json({
    status: 1,
    data: '这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这一个描述'
  })
})

app.post('/api/getOrderList', async (c) => {
  // 获取参数
  const { limit = 10, page = 1, orderNo } = await c.req.json();
  const total = 1000;
  // 生成模拟数据
  let allList = Array.from({ length: total }, (_, i) => {
    return {
      id: `${1000 + i + 1}`,
      supplier: '上海供应链有限公司',
      amount: '3000',
      orderNo: `ORD${1000 + i + 1}`,
      orderTime: '2024-05-01 10:00',
      goods_number: '100'
    };
  });

  // 根据 orderNo 搜索
  if (orderNo) {
    allList = allList.filter(item => item.orderNo.includes(orderNo));
  }
  const filteredTotal = allList.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const list = allList.slice(start, end);

  return c.json({
    status: 1,
    data: {
      count: filteredTotal,
      list
    }
  });
});

app.post('/api/getOrderProductList', async (c) => {
  // 获取参数
  const { limit = 10, page = 1, name } = await c.req.json();
  const total = 1000;
  // 生成模拟商品数据
  let allList = Array.from({ length: total }, (_, i) => {
    return {
      id: `${1000 + i + 1}`,
      name:  i % 2 === 0 ? `百事可乐 经典原味汽水330ml/罐` : `可口可乐 经典原味汽水330ml/罐`,
      specification: `330ml*1罐`,
      price: 2.5,
      quantity: 3,
      image: 'https://m1.fubodong.com/product.png',
      min: 24,
      unit: '12瓶/箱'
    };
  });

  if (name) {
    allList = allList.filter(item => item.name.includes(name));
  }
  const filteredTotal = allList.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const list = allList.slice(start, end);

  return c.json({
    status: 1,
    data: {
      count: filteredTotal,
      list
    }
  });
});

app.post('/api/delivery/number', async (c) => {
  return c.json({
    status: 1,
    data: {
      process: 10,
      wait: 20,
    }
  });
});

app.post('/api/appointment/add', async (c) => {
  return c.json({
    status: 1,
    data: null,
  });
});

app.post('/api/getHelpList', async (c) => {
  return c.json({
    status: 1,
    data: [
      { title: '使用指南', open: false, content: [] },
      { title: '修改快递编号？', open: false, content: [] },
      { title: '如何修改手机号', open: false, content: [] },
      { title: '如何快速登记？', open: false, content: [] },
      { title: '如何登陆？', open: false, content: [] },
      {
        title: '接收不到短信？',
        open: true,
        content: [
          '1、通过短信验证码登录，若手机号收不到验证码，可能是短信运营商拦截或设置问题可以致电客服人员(0571)87665425帮您处理。',
          '2、当当天多次发送验证码且被使用，则当日无法再获取验证码，可次日再次试获取。',
        ],
      },
    ]
  });
});

app.post('/api/getContact', async (c) => {
  return c.json({
    status: 1,
    data: [
      {name: '客服1', phone: '0571-87665425'},
      {name: '客服2', phone: '0571-87665426'},
      {name: '客服3', phone: '0571-87665427'},
    ]
  });
});


app.post('/api/appointmentList', async (c) => {
  // 获取参数
  const { limit = 10, page = 1, supplierName, purchaseOrderId } = await c.req.json();
  const total = 1000;
  // 生成模拟预约单数据
  let allList = Array.from({ length: total }, (_, i) => {
    return {
      purchaseOrderId: `PO${1000 + i + 1}`,
      appointmentDate: `2025-06-${(i % 28 + 1).toString().padStart(2, '0')}`,
      warehouseName: `仓库${(i % 5) + 1}`,
      supplierName: i % 2 === 0 ? '上海供应链有限公司' : '北京供应链有限公司',
      deliveryMethod: i % 3 === 0 ? '货运' : (i % 3 === 1 ? '物流' : ''),
      logisticsCompany: i % 3 === 1 ? '顺丰快递' : undefined,
      trackingNumber: i % 3 === 1 ? `SF${100000 + i}` : undefined,
      unloadingMethod: i % 2 === 0 ? '自卸' : '仓卸',
      vehicleType: i % 3 === 0 ? '厢式货车' : undefined,
      driverName: i % 3 === 0 ? `司机${i + 1}` : undefined,
      driverPhone: i % 3 === 0 ? `1380000${(1000 + i).toString().slice(-4)}` : undefined,
      selfPaidAmount: (i % 5 === 0) ? (100 + i).toString() : undefined,
      orderId: `ORD${1000 + i + 1}`,
      actualNumber: (i % 10 + 1).toString(),
      actualVolume: (10 + i % 5).toString(),
      actualWeight: (100 + i % 20).toString(),
      status: '1',
      payStatus: '0',
    };
  });

  // 支持 supplierName、purchaseOrderId 搜索
  if (supplierName) {
    allList = allList.filter(item => item.supplierName.includes(supplierName));
  }
  if (purchaseOrderId) {
    allList = allList.filter(item => item.purchaseOrderId.includes(purchaseOrderId));
  }
  const filteredTotal = allList.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const list = allList.slice(start, end);

  return c.json({
    status: 1,
    data: {
      count: filteredTotal,
      list
    }
  });
});

app.post('/api/appointmentDetail', async (c) => {
  // 获取分页参数
  const { limit = 10, page = 1 } = await c.req.json().catch(() => ({}));
  const total = 100;
  // 生成100条商品数据
  const allList = Array.from({ length: total }, (_, i) => ({
    id: `P${(i + 1).toString().padStart(3, '0')}`,
    name: `商品${String.fromCharCode(65 + (i % 26))}`,
    specification: `规格${(i % 5) + 1}`,
    price: (99 + i).toFixed(2),
    quantity: ((i % 10) + 1).toString(),
    min: ((i % 5) + 1).toString(),
    unit: '箱',
    image: 'https://m1.fubodong.com/product.png',
  }));
  const start = (page - 1) * limit;
  const end = start + limit;
  const list = allList.slice(start, end);

  return c.jsonFmt({
    status: 1,
    data: {
    appointmentInfo: {
      id: 'A001',
      purchaseOrderId: 'PO001',
      appointmentDate: '2024-03-20 14:30',
      warehouseName: '广州仓库',
      supplierName: '广州供应商A',
      deliveryMethod: '货运',
      vehicleType: 'B1-厢式货车',
      driverName: '张师傅',
      driverPhone: '13800138000',
      quantity: 100,
      volume: '3m³',
      weight: '500kg',
      status: '1',
    },
    productInfo: {
      count: total,
      list
    },
  }});
});

serve({
  fetch: app.fetch,
  port: 10220
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
