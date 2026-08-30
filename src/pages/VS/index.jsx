function VS() {
  return (
    <div style={{
      width: '100%',
      height: 'calc(100vh - 80px)',
      background: '#fff'
    }}>
      <iframe
        src="/vs-game/index.html"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block'
        }}
        title="VS"
      />
    </div>
  )
}

export default VS