import React, { useEffect, useRef, useState } from 'react'

// function Index() {
//   return (
//     <div style={{width: 300, height: 100, background: 'skyblue', display: 'flex'}}>
//       <div style={{flex: 1,background: 'hotpink', left: 100 , position: 'relative'}}></div>
//     </div>
//   )
// }

function Index() {
  return (
    <div style={{padding: 50, width: 300,background: 'skyblue', boxSizing: 'border-box'}}>
      <div style={{height: 100, background: 'hotpink', display: 'flex',justifyContent: 'space-between',gap: 20, width: '100%' }}>
        <div style={{flex: 1, background: 'gray', color: '#fff'}}>1</div>
        <div style={{flex: 1, background: 'gray', color: '#fff'}}>2</div>
      </div>
    </div>
  )
}

function Animal() {
  return (
<div style={{boxSizing: 'border-box', /* border: '1px solid skyblue', */ width: 300, height: 300, overflowY: 'auto'}}>
  <div style={{boxSizing: 'border-box', border: '1px solid hotpink', width: 100, height: 100, margin: 20}}></div>
  <div style={{boxSizing: 'border-box', border: '1px solid hotpink', width: 100, height: 100, margin: 20}}></div>
</div>
  )
}

export default Animal