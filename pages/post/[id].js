import React from 'react'
import dynamic from 'next/dynamic'
import { API } from 'aws-amplify'
import { useRouter } from 'next/router'
import { Container, Typography, Box, Button } from '@mui/material'
import { formatDate } from '../../lib/formatTime'
import { deletePost } from '../../graphql/mutations'

const DynamicViewer = dynamic(() => import('../../components/viewer'), {
  ssr: false,
})

const Post = () => {
  const { query, push } = useRouter()

  const handleClickUpdate = () => {
    push({
      pathname: `/write`,
      query,
    })
  }

  const handleClickDelete = async () => {
    try {
      await API.graphql({
        query: deletePost,
        variables: { input: { id: query.id } },
      })

      push({
        pathname: `/`,
      })
    } catch (err) {
      alert('권한이 없습니다.')
    }
  }

  if (!query.id) {
    return (
      <Container
        maxWidth="md"
        sx={{ display: 'flex', flexDirection: 'column' }}
      >
        로딩중
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box>
        <Button
          onClick={handleClickUpdate}
          sx={{ justifyContent: 'start', minWidth: 'auto' }}
        >
          수정
        </Button>
        <Button
          onClick={handleClickDelete}
          sx={{ justifyContent: 'start', minWidth: 'auto' }}
        >
          삭제
        </Button>
      </Box>
      <Box sx={{ paddingBottom: 3 }}>
        <Box sx={{ display: 'flex', padding: '0 8px' }}>
          {typeof query.tags === 'object' ? (
            query.tags.map(tag => (
              <Typography
                key={`${query.id}_${tag}`}
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  marginRight: 1,
                }}
              >
                #{tag}
              </Typography>
            ))
          ) : (
            <Typography
              key={`${query.id}_${query.tags}`}
              sx={{
                fontSize: '0.875rem',
                fontWeight: 400,
                marginRight: 1,
              }}
            >
              #{query.tags}
            </Typography>
          )}
        </Box>
        <Typography
          component="h1"
          sx={{ fontSize: '2.5rem', fontWeight: 600, lineHeight: 1.3 }}
        >
          {query.title}
        </Typography>
        <Typography>{formatDate(query.createdAt)}</Typography>
      </Box>
      <DynamicViewer markDown={query.markDown} />
    </Container>
  )
}

export default Post
