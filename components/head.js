import React from 'react'
import NextLink from 'next/link'
import SiginIn from './signin'
import { Box, Container, Typography, Modal } from '@mui/material'
import { Auth } from 'aws-amplify'

const Header = () => {
  const [user, setUser] = React.useState(null)
  const [opened, setOpened] = React.useState(false)

  const signOut = () => {
    Auth.signOut()
    setUser(null)
  }

  React.useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => {
        setUser(user.username)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  return (
    <Container component="nav" maxWidth="md">
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', padding: 2 }}
      >
        <NextLink href="/" passHref>
          <Typography variant="h4" component="h1" sx={{ cursor: 'pointer' }}>
            JJ Dev
          </Typography>
        </NextLink>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: 'auto',
          }}
        >
          <Box mx={1} sx={{ cursor: 'pointer' }}>
            <a
              style={{ color: 'black', textDecoration: 'none' }}
              href="https://github.com/appWon"
            >
              GitHub
            </a>
          </Box>
          {user ? (
            <>
              <NextLink href="/write" passHref>
                <Box mx={1} sx={{ cursor: 'pointer' }}>
                  글쓰기
                </Box>
              </NextLink>
              <Box mx={1} sx={{ cursor: 'pointer' }} onClick={signOut}>
                로그아웃
              </Box>
            </>
          ) : (
            <>
              <Box
                mx={1}
                sx={{ cursor: 'pointer' }}
                onClick={() => setOpened(!opened)}
              >
                로그인
              </Box>
              <Modal open={opened} onClose={() => setOpened(false)}>
                <>
                  <SiginIn setUser={setUser} />
                </>
              </Modal>
            </>
          )}
        </Box>
      </Box>
    </Container>
  )
}

export default Header
