import React from 'react'
import { Auth } from 'aws-amplify'
import { Box, Container, TextField, Button, Typography } from '@mui/material'
import { Google } from '@mui/icons-material'

const SignIn = ({ setUser }) => {
  const [signInData, setSigninData] = React.useState({
    id: '',
    password: '',
  })

  const handleChange = e => {
    const { id, value } = e.target
    setSigninData({ ...signInData, [id]: value })
  }

  const signIn = async () => {
    try {
      const result = await Auth.signIn(signInData.id, signInData.password)
      setUser(result.getUsername())
    } catch (err) {
      alert('관리자 전용입니다')
    }
  }

  return (
    <Container>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          padding: 5,
          width: 400,
          borderRadius: '10px',
          bgcolor: 'background.paper',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <TextField
          id="id"
          type="email"
          placeholder="아이디"
          variant="standard"
          sx={{
            width: '100%',
            marginBottom: '30px',
          }}
          onChange={handleChange}
        />
        <TextField
          id="password"
          type="password"
          placeholder="비밀번호"
          variant="standard"
          sx={{
            width: '100%',
            marginBottom: '30px',
          }}
          onChange={handleChange}
        />
        <Button
          variant="outlined"
          onClick={signIn}
          sx={{ width: '100%', marginBottom: '20px' }}
        >
          로그인
        </Button>
        <hr />
        <Button
          variant="outlined"
          sx={{
            width: '100%',
            marginTop: '20px',
            bgcolor: '#3B83F9',
          }}
          onClick={() => Auth.federatedSignIn({ provider: 'Google' })}
        >
          <Google
            sx={{
              color: 'white',
              margin: '0 10px',
            }}
          />
          <Typography
            sx={{
              color: 'white',
              fontWeight: 500,
            }}
          >
            구글 로그인
          </Typography>
        </Button>
      </Box>
    </Container>
  )
}

export default SignIn
