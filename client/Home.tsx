function Animal() {
  return (
    <div style={{ boxSizing: 'border-box', width: 500, height: 500, overflowY: 'auto' }}>
      <div
        style={{
          boxSizing: 'border-box',
          border: '1px solid hotpink',
          width: 100,
          height: 100,
          margin: 20,
          background: 'powderblue',
        }}
      ></div>
      <div style={{ boxSizing: 'border-box', border: '1px solid hotpink', width: 100, height: 100, margin: 20, background: '#f0f0f0' }}></div>
      <div style={{ background: 'green', width: 100, height: 100 }}>
        new
      </div>
    </div>
  );
}

export default Animal;
