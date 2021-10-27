import Header from 'next/head'

const Main = ({ children }) => {
  return (
    <div>
      <Header>
        <meta name="viewport" content="width=device-width, inital-scale=1" />
        <title>Jaewon Dev App</title>
      </Header>
      <div>{children}</div>
    </div>
  )
}

export default Main
