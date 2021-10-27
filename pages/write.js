import React from 'react'
import dynamic from 'next/dynamic'
import { API } from 'aws-amplify'
import { useRouter } from 'next/router'
import { createPost, updatePost } from '../graphql/mutations'
import { Container, TextField, Autocomplete, Box, Button } from '@mui/material'

const ToastEditor = dynamic(() => import('../components/editor'), {
  ssr: false,
})
const ForwardedRefComponent = React.forwardRef((props, ref) => (
  <ToastEditor {...props} forwardedRef={ref} />
))
ForwardedRefComponent.displayName = `toast-ui-editor`

const Write = () => {
  const editRef = React.createRef(null)
  const { query, push } = useRouter()
  const [writeData, setWriteData] = React.useState({
    title: query.title || '',
    description: query.description || '',
    tags: query.tags || [],
  })

  const handleClickUpload = async () => {
    const { lineTexts } = editRef.current.getInstance().toastMark
    if (!lineTexts.length) return

    // 배열로 받은 마크다운 데이터 String
    const markDown = lineTexts.reduce((str, value, cnt) => {
      str += value
      if (cnt + 1 !== lineTexts.length) str += '\n'
      return str
    }, '')

    try {
      let result = {}

      if (query.id) {
        // 데이터 수정
        result = await API.graphql({
          query: updatePost,
          variables: {
            input: { ...writeData, id: query.id, markDown: markDown },
          },
          authMode: 'AMAZON_COGNITO_USER_POOLS',
        })
      } else {
        // 데이터 추가
        result = await API.graphql({
          query: createPost,
          variables: { input: { ...writeData, markDown: markDown } },
          authMode: 'AMAZON_COGNITO_USER_POOLS',
        })
      }

      const method = Object.keys(result.data)[0]

      push({
        pathname: `post/${result.data[method].id}`,
        query: result.data[method],
      })
    } catch (err) {
      alert('권한이 없습니다.')
    }
  }

  const handleChangeInput = e => {
    const { id, value } = e.target
    setWriteData({ ...writeData, [id]: value })
  }

  const handleChangeInputTag = (e, value) => {
    setWriteData({ ...writeData, tags: value })
  }

  return (
    <Container sx={{ margin: '40px auto' }}>
      <TextField
        id="title"
        defaultValue={query.title || ''}
        placeholder="제목을 입력해주세요"
        variant="standard"
        inputProps={{ style: { fontSize: '2rem' } }}
        sx={{
          width: '100%',
          marginBottom: '30px',
        }}
        onChange={handleChangeInput}
      />
      <TextField
        id="description"
        defaultValue={query.description || ''}
        placeholder="설명을 입력해주세요"
        variant="standard"
        sx={{
          width: '100%',
          marginBottom: '20px',
        }}
        onChange={handleChangeInput}
      />
      <Autocomplete
        id="tags"
        defaultValue={[...(query.tags || [])]}
        multiple
        freeSolo
        options={[]}
        renderInput={params => (
          <TextField
            {...params}
            variant="standard"
            placeholder="태그를 입력해주세요"
          />
        )}
        sx={{ width: '100%', marginBottom: '40px', fontSize: '0.5rem' }}
        onChange={handleChangeInputTag}
      />
      <ForwardedRefComponent
        initialValue={query.markDown || '작성해주세요'}
        ref={editRef}
        previewStyle="vertical"
        height="600px"
        initialEditType="markdown"
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '10px 0 ',
        }}
      >
        <Button
          type="submit"
          variant="outlined"
          size="large"
          onClick={handleClickUpload}
        >
          작성하기
        </Button>
      </Box>
    </Container>
  )
}

export default Write
